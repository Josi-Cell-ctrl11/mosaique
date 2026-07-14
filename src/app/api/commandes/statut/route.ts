import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { createClient } from '@/lib/supabase/server';
import { envoyerNotification } from '@/lib/notifications';

// PATCH /api/commandes/statut — réservé aux admins
export async function PATCH(req: NextRequest) {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  // Vérifier admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  const { commande_id, statut } = await req.json();

  const statutsValides = ['payee', 'en_preparation', 'en_livraison', 'livree', 'annulee'];
  if (!statutsValides.includes(statut)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
  }

  const { data: commande, error } = await supabaseAdmin
    .from('commandes')
    .update({ statut })
    .eq('id', commande_id)
    .select()
    .single();

  if (error || !commande) {
    return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
  }

  // Notifier le client
  await envoyerNotification({
    type: 'statut_change',
    commandeId: commande.id,
    commandeNumero: commande.numero,
    userId: commande.utilisateur_id,
    nouveauStatut: statut,
  }).catch(console.error);

  return NextResponse.json({ success: true, commande });
}
