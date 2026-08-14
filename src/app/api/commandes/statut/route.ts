import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { envoyerNotification } from '@/lib/notifications';
import type { StatutCommande } from '@/types';

const TRANSITIONS: Record<StatutCommande, StatutCommande[]> = {
  en_attente_paiement: ['annulee'],
  payee: ['en_preparation'],
  en_preparation: ['en_livraison', 'annulee'],
  en_livraison: ['livree', 'annulee'],
  livree: [],
  annulee: [],
};

// PATCH /api/commandes/statut — réservé aux admins
export async function PATCH(req: NextRequest) {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });

  let body: { commande_id?: string; statut?: StatutCommande };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Corps de requête invalide' }, { status: 400 }); }
  const { commande_id, statut } = body;
  if (!commande_id || !statut || !Object.prototype.hasOwnProperty.call(TRANSITIONS, statut)) {
    return NextResponse.json({ error: 'Commande ou statut invalide' }, { status: 400 });
  }

  const { data: commande, error: lectureError } = await supabaseAdmin
    .from('commandes')
    .select('id, numero, statut, statut_paiement, utilisateur_id')
    .eq('id', commande_id)
    .single();
  if (lectureError || !commande) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

  if (!TRANSITIONS[commande.statut as StatutCommande].includes(statut)) {
    return NextResponse.json({ error: `Transition impossible : ${commande.statut} → ${statut}` }, { status: 409 });
  }
  if (statut === 'annulee' && commande.statut_paiement === 'paye') {
    return NextResponse.json({ error: 'Cette commande est payée. Un remboursement FedaPay doit être traité avant annulation.' }, { status: 409 });
  }
  if (statut === 'payee') {
    return NextResponse.json({ error: 'Le statut payé est confirmé uniquement par le webhook FedaPay.' }, { status: 409 });
  }

  const { data: commandeMaj, error } = await supabaseAdmin
    .from('commandes')
    .update({ statut })
    .eq('id', commande_id)
    .eq('statut', commande.statut)
    .select()
    .single();
  if (error || !commandeMaj) return NextResponse.json({ error: 'La commande a changé, recharge la page.' }, { status: 409 });

  await envoyerNotification({
    type: 'statut_change',
    commandeId: commandeMaj.id,
    commandeNumero: commandeMaj.numero,
    userId: commandeMaj.utilisateur_id,
    nouveauStatut: statut,
  }).catch(console.error);

  return NextResponse.json({ success: true, commande: commandeMaj });
}
