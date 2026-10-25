import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { signatureValide, synchroniserPaiement } from '@/lib/fedapay';

/**
 * Webhook FedaPay.
 * 1. Si FEDAPAY_WEBHOOK_SECRET est défini, la signature est obligatoire.
 * 2. Dans tous les cas, l'état du paiement est relu auprès de l'API FedaPay
 *    (montant compris) : le contenu du webhook ne sert qu'à savoir quelle commande vérifier.
 */
export async function POST(req: NextRequest) {
  const corpsBrut = await req.text();

  const secret = process.env.FEDAPAY_WEBHOOK_SECRET;
  if (secret) {
    if (!signatureValide(corpsBrut, req.headers.get('x-fedapay-signature'), secret)) {
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
    }
  } else if (process.env.FEDAPAY_ENVIRONMENT === 'production') {
    console.warn('[FedaPay] FEDAPAY_WEBHOOK_SECRET manquant : signature non vérifiée (le statut reste revérifié via l’API).');
  }

  let transactionId: string | undefined;
  try {
    const body = JSON.parse(corpsBrut) as { entity?: { id?: number | string }; object?: { id?: number | string } };
    const id = body.entity?.id ?? body.object?.id;
    transactionId = id !== undefined ? String(id) : undefined;
  } catch {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 });
  }
  if (!transactionId) return NextResponse.json({ received: true });

  const supabaseAdmin = createAdminClient();
  const { data: commande } = await supabaseAdmin
    .from('commandes')
    .select('id')
    .eq('fedapay_transaction_id', transactionId)
    .maybeSingle();

  if (!commande) return NextResponse.json({ received: true });

  const resultat = await synchroniserPaiement(commande.id);
  return NextResponse.json({ received: true, statut: resultat });
}
