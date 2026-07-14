import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const supabaseAdmin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const { commande_id } = await req.json();
  if (!commande_id) return NextResponse.json({ error: 'commande_id requis' }, { status: 400 });

  // Vérifier que la commande appartient à l'utilisateur et est en attente
  const { data: commande } = await supabase
    .from('commandes')
    .select('id, statut')
    .eq('id', commande_id)
    .eq('utilisateur_id', user.id)
    .single();

  if (!commande) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

  if (commande.statut !== 'en_attente_paiement') {
    return NextResponse.json({ error: 'Seules les commandes en attente de paiement peuvent être annulées' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('commandes')
    .update({ statut: 'annulee', statut_paiement: 'echoue' })
    .eq('id', commande_id);

  if (error) return NextResponse.json({ error: 'Erreur lors de l\'annulation' }, { status: 500 });

  return NextResponse.json({ success: true });
}
