import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { envoyerNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  // Vérifier l'authentification
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

  // Calculer les montants
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
    console.error('Erreur lignes commande:', erreurLignes);
    // Annuler la commande
    await supabaseAdmin.from('commandes').delete().eq('id', commande.id);
    return NextResponse.json({ error: 'Erreur lors de la création des lignes' }, { status: 500 });
  }

  // Créer la transaction FedaPay
  try {
    const fedapayRes = await fetch(
      `https://api${process.env.FEDAPAY_ENVIRONMENT === 'sandbox' ? '-sandbox' : ''}.fedapay.com/v1/transactions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        },
        body: JSON.stringify({
          description: `Commande Mosaïque ${commande.numero}`,
          amount: total,
          currency: { iso: 'XOF' },
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/fedapay/webhook`,
          customer: {
            email: user.email,
          },
          metadata: {
            commande_id: commande.id,
            commande_numero: commande.numero,
          },
        }),
      }
    );

    const fedapayData = await fedapayRes.json();

    if (!fedapayRes.ok) {
      console.error('Erreur FedaPay:', fedapayData);
      return NextResponse.json({ 
        error: `Erreur FedaPay: ${fedapayData.message ?? JSON.stringify(fedapayData)}` 
      }, { status: 502 });
    }

    // Sauvegarder l'ID FedaPay
    await supabaseAdmin
      .from('commandes')
      .update({
        fedapay_transaction_id: String(fedapayData.v1.transaction.id),
        fedapay_reference: fedapayData.v1.transaction.reference,
      })
      .eq('id', commande.id);

    // Générer le lien de paiement
    const tokenRes = await fetch(
      `https://api${process.env.FEDAPAY_ENVIRONMENT === 'sandbox' ? '-sandbox' : ''}.fedapay.com/v1/transactions/${fedapayData.v1.transaction.id}/token`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        },
      }
    );

    const tokenData = await tokenRes.json();
    const fedapayUrl = `https://checkout${process.env.FEDAPAY_ENVIRONMENT === 'sandbox' ? '-sandbox' : ''}.fedapay.com/?token=${tokenData.token}`;

    // Notifier l'admin
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
  } catch (err) {
    console.error('Erreur FedaPay:', err);
    return NextResponse.json({ error: 'Erreur lors de l\'initialisation du paiement' }, { status: 500 });
  }
}
