import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { envoyerNotification } from '@/lib/notifications';

const FEDAPAY_BASE = process.env.FEDAPAY_ENVIRONMENT === 'sandbox'
  ? 'https://sandbox-api.fedapay.com/v1'
  : 'https://api.fedapay.com/v1';

async function fedapayFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${FEDAPAY_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
      'X-VERSION': '1',
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json();
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  let body: {
    adresse_livraison: string;
    ville_livraison: string;
    telephone_livraison: string;
    zone_livraison_id?: string;
    heure_livraison?: string;
    notes?: string;
    frais_livraison: number;
    articles: Array<{
      platId: string;
      nom: string;
      prix: number;
      quantite: number;
      options: Record<string, string>;
    }>;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  if (!body.articles || body.articles.length === 0) {
    return NextResponse.json({ error: 'Le panier est vide' }, { status: 400 });
  }

  const sousTotal = body.articles.reduce((t, a) => t + a.prix * a.quantite, 0);
  const total = sousTotal + (body.frais_livraison ?? 0);

  // Créer la commande
  const { data: commande, error: erreurCommande } = await supabaseAdmin
    .from('commandes')
    .insert({
      utilisateur_id: user.id,
      statut: 'en_attente_paiement',
      statut_paiement: 'en_attente',
      adresse_livraison: body.adresse_livraison,
      ville_livraison: body.ville_livraison,
      telephone_livraison: body.telephone_livraison,
      zone_livraison_id: body.zone_livraison_id ?? null,
      heure_livraison: body.heure_livraison ?? null,
      notes: body.notes ?? null,
      sous_total: sousTotal,
      frais_livraison: body.frais_livraison,
      total,
    })
    .select()
    .single();

  if (erreurCommande || !commande) {
    console.error('Erreur création commande:', erreurCommande);
    return NextResponse.json({ error: 'Erreur lors de la création de la commande' }, { status: 500 });
  }

  // Insérer les lignes
  const lignes = body.articles.map((a) => ({
    commande_id: commande.id,
    plat_id: a.platId,
    nom_plat: a.nom,
    prix_unitaire: a.prix,
    quantite: a.quantite,
    options: a.options,
    sous_total: a.prix * a.quantite,
  }));

  const { error: erreurLignes } = await supabaseAdmin
    .from('lignes_commande')
    .insert(lignes);

  if (erreurLignes) {
    await supabaseAdmin.from('commandes').delete().eq('id', commande.id);
    return NextResponse.json({ error: 'Erreur lors de la création des lignes' }, { status: 500 });
  }

  // Créer la transaction FedaPay
  try {
    // 1. Créer la transaction (la réponse inclut payment_url directement)
    const txPayload: Record<string, unknown> = {
      description: `Commande Mosaïque ${commande.numero}`,
      amount: total,
      currency: { iso: 'XOF' },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/commande/confirmation?commande=${commande.id}`,
      customer: { email: user.email },
    };

    const txData = await fedapayFetch('/transactions', {
      method: 'POST',
      body: JSON.stringify(txPayload),
    });

    console.log('FedaPay tx:', JSON.stringify(txData).slice(0, 300));

    // La réponse est sous la clé 'v1/transaction'
    const tx = txData['v1/transaction'] ?? txData.transaction ?? txData.v1?.transaction;
    if (!tx) throw new Error(`Réponse inattendue: ${JSON.stringify(txData)}`);

    // payment_url est directement dans la réponse
    const fedapayUrl = tx.payment_url;
    if (!fedapayUrl) throw new Error('payment_url manquant dans la réponse FedaPay');

    // Sauvegarder
    await supabaseAdmin
      .from('commandes')
      .update({
        fedapay_transaction_id: String(tx.id),
        fedapay_reference: tx.reference,
      })
      .eq('id', commande.id);

    await envoyerNotification({
      type: 'nouvelle_commande',
      commandeId: commande.id,
      commandeNumero: commande.numero,
      userId: user.id,
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      commande_id: commande.id,
      commande_numero: commande.numero,
      fedapay_url: fedapayUrl,
    });

  } catch (err: unknown) {
    const e = err as { status?: number; data?: unknown; message?: string };
    console.error('Erreur FedaPay:', JSON.stringify(e));
    return NextResponse.json({
      error: `Erreur paiement FedaPay (${e.status ?? 500}): ${JSON.stringify(e.data ?? e.message)}`,
    }, { status: 500 });
  }
}
