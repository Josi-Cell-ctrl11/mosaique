import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { envoyerNotification } from '@/lib/notifications';
import { fedapayFetch, extraireTransaction } from '@/lib/fedapay';

/**
 * Création d'une commande.
 * Sécurité : le client n'envoie QUE des identifiants et des quantités.
 * Les prix, suppléments d'options et frais de livraison sont relus en base ici.
 */
const schema = z.object({
  adresse_livraison: z.string().trim().min(3).max(300),
  ville_livraison: z.string().trim().min(2).max(120),
  telephone_livraison: z.string().trim().min(8).max(30),
  zone_livraison_id: z.string().uuid().nullish(),
  heure_livraison: z.string().datetime().nullish(),
  notes: z.string().trim().max(500).nullish(),
  articles: z
    .array(
      z.object({
        platId: z.string().uuid(),
        quantite: z.number().int().min(1).max(50),
        options: z.record(z.string().uuid(), z.string().uuid()).default({}),
      })
    )
    .min(1, 'Le panier est vide')
    .max(40),
});

type ValeurDb = { id: string; label: string; prix_sup: number };
type OptionDb = { id: string; nom: string; required: boolean | null; valeurs: ValeurDb[] };
type PlatDb = { id: string; nom: string; prix: number; disponible: boolean; options: OptionDb[] };

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Connectez-vous pour commander.' }, { status: 401 });
  }

  let body: z.infer<typeof schema>;
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Commande invalide' }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 });
  }

  // 1. Relire les plats et leurs options en base
  const ids = Array.from(new Set(body.articles.map((a) => a.platId)));
  const { data: platsData, error: erreurPlats } = await supabaseAdmin
    .from('plats')
    .select('id, nom, prix, disponible, options:options_plat(id, nom, required, valeurs:valeurs_option(id, label, prix_sup))')
    .in('id', ids);

  if (erreurPlats) {
    console.error('Lecture plats:', erreurPlats);
    return NextResponse.json({ error: 'Impossible de vérifier le menu. Réessayez.' }, { status: 500 });
  }
  const plats = new Map((platsData as unknown as PlatDb[]).map((p) => [p.id, p]));

  const lignes: Array<{ plat_id: string; nom_plat: string; prix_unitaire: number; quantite: number; options: Record<string, string>; sous_total: number }> = [];

  for (const article of body.articles) {
    const plat = plats.get(article.platId);
    if (!plat || !plat.disponible) {
      return NextResponse.json({ error: 'Un plat de votre panier n’est plus disponible. Mettez à jour votre panier.' }, { status: 409 });
    }

    let supplement = 0;
    const optionsLisibles: Record<string, string> = {};
    for (const option of plat.options ?? []) {
      const valeurId = article.options[option.id];
      if (!valeurId) {
        if (option.required) {
          return NextResponse.json({ error: `Choix manquant pour « ${plat.nom} » : ${option.nom}` }, { status: 400 });
        }
        continue;
      }
      const valeur = option.valeurs.find((v) => v.id === valeurId);
      if (!valeur) {
        return NextResponse.json({ error: `Option invalide pour « ${plat.nom} »` }, { status: 400 });
      }
      supplement += valeur.prix_sup;
      optionsLisibles[option.nom] = valeur.label;
    }
    // Refuser toute option qui n'appartient pas à ce plat
    const optionsConnues = new Set((plat.options ?? []).map((o) => o.id));
    if (Object.keys(article.options).some((id) => !optionsConnues.has(id))) {
      return NextResponse.json({ error: `Option invalide pour « ${plat.nom} »` }, { status: 400 });
    }

    const prixUnitaire = plat.prix + supplement;
    lignes.push({
      plat_id: plat.id,
      nom_plat: plat.nom,
      prix_unitaire: prixUnitaire,
      quantite: article.quantite,
      options: optionsLisibles,
      sous_total: prixUnitaire * article.quantite,
    });
  }

  // 2. Frais de livraison relus en base
  const { data: config } = await supabaseAdmin
    .from('config_livraison')
    .select('id, type, frais_fixe, actif, zones:zones_livraison(id, nom, frais)')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (!config || !config.actif) {
    return NextResponse.json({ error: 'La livraison est fermée pour le moment. Réessayez plus tard.' }, { status: 409 });
  }

  let fraisLivraison = config.frais_fixe;
  let zoneId: string | null = null;
  if (config.type === 'par_zone') {
    const zones = (config.zones ?? []) as Array<{ id: string; frais: number }>;
    const zone = zones.find((z) => z.id === body.zone_livraison_id);
    if (!zone) {
      return NextResponse.json({ error: 'Choisissez votre zone de livraison.' }, { status: 400 });
    }
    fraisLivraison = zone.frais;
    zoneId = zone.id;
  }

  const sousTotal = lignes.reduce((t, l) => t + l.sous_total, 0);
  const total = sousTotal + fraisLivraison;

  // 3. Enregistrer la commande (le numéro est généré par la base)
  const { data: commande, error: erreurCommande } = await supabaseAdmin
    .from('commandes')
    .insert({
      utilisateur_id: user.id,
      statut: 'en_attente_paiement',
      statut_paiement: 'en_attente',
      adresse_livraison: body.adresse_livraison,
      ville_livraison: body.ville_livraison,
      telephone_livraison: body.telephone_livraison,
      zone_livraison_id: zoneId,
      heure_livraison: body.heure_livraison ?? null,
      notes: body.notes ?? null,
      sous_total: sousTotal,
      frais_livraison: fraisLivraison,
      total,
    })
    .select('id, numero')
    .single();

  if (erreurCommande || !commande) {
    console.error('Création commande:', erreurCommande);
    return NextResponse.json({ error: 'Erreur lors de la création de la commande.' }, { status: 500 });
  }

  const { error: erreurLignes } = await supabaseAdmin
    .from('lignes_commande')
    .insert(lignes.map((l) => ({ ...l, commande_id: commande.id })));

  if (erreurLignes) {
    console.error('Création lignes:', erreurLignes);
    await supabaseAdmin.from('commandes').delete().eq('id', commande.id);
    return NextResponse.json({ error: 'Erreur lors de la création de la commande.' }, { status: 500 });
  }

  // 4. Transaction FedaPay
  try {
    const txData = await fedapayFetch('/transactions', {
      method: 'POST',
      body: JSON.stringify({
        description: `Commande Mosaïque ${commande.numero}`,
        amount: total,
        currency: { iso: 'XOF' },
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/commande/confirmation?commande=${commande.id}`,
        customer: { email: user.email },
        custom_metadata: { commande_id: commande.id },
      }),
    });

    const tx = extraireTransaction(txData);
    if (!tx?.id || !tx.payment_url) throw new Error('Réponse FedaPay inattendue');

    await supabaseAdmin
      .from('commandes')
      .update({ fedapay_transaction_id: String(tx.id), fedapay_reference: tx.reference ?? null })
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
      total,
      fedapay_url: tx.payment_url,
    });
  } catch (err) {
    // Le détail reste dans les logs serveur, jamais renvoyé au navigateur
    console.error('Erreur FedaPay:', err);
    return NextResponse.json(
      { error: 'Le paiement n’a pas pu être lancé. Votre commande est enregistrée : réessayez depuis « Mes commandes ».', commande_id: commande.id },
      { status: 502 }
    );
  }
}
