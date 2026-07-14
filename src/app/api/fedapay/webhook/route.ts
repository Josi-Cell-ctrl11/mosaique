import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { envoyerNotification } from '@/lib/notifications';

export async function POST(req: NextRequest) {
  const supabaseAdmin = createAdminClient();

  let body: {
    name: string;
    object: {
      id: number;
      reference: string;
      status: string;
      metadata?: {
        commande_id?: string;
        commande_numero?: string;
      };
    };
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { name: eventName, object: transaction } = body;
  const commandeId = transaction?.metadata?.commande_id;

  if (!commandeId) {
    return NextResponse.json({ received: true });
  }

  // Mapper le statut FedaPay
  let statutPaiement: 'en_attente' | 'paye' | 'echoue' | 'rembourse' = 'en_attente';
  let statutCommande: string | null = null;

  if (eventName === 'transaction.approved' || transaction.status === 'approved') {
    statutPaiement = 'paye';
    statutCommande = 'en_preparation';
  } else if (eventName === 'transaction.declined' || transaction.status === 'declined') {
    statutPaiement = 'echoue';
  } else if (transaction.status === 'refunded') {
    statutPaiement = 'rembourse';
    statutCommande = 'annulee';
  }

  // Mettre à jour la commande
  const updateData: Record<string, string> = { statut_paiement: statutPaiement };
  if (statutCommande) updateData.statut = statutCommande;

  const { data: commande } = await supabaseAdmin
    .from('commandes')
    .update(updateData)
    .eq('id', commandeId)
    .select('*, profiles(*)')
    .single();

  // Envoyer notification client si paiement confirmé
  if (commande && statutPaiement === 'paye') {
    await envoyerNotification({
      type: 'commande_confirmee',
      commandeId: commande.id,
      commandeNumero: commande.numero,
      userId: commande.utilisateur_id,
    }).catch(console.error);
  }

  return NextResponse.json({ received: true });
}
