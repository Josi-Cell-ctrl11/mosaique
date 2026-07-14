import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const FEDAPAY_BASE = process.env.FEDAPAY_ENVIRONMENT === 'sandbox'
  ? 'https://sandbox-api.fedapay.com/v1'
  : 'https://api.fedapay.com/v1';

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const transactionId = req.nextUrl.searchParams.get('transaction_id');
  if (!transactionId) return NextResponse.json({ error: 'transaction_id requis' }, { status: 400 });

  // Vérifier que la commande appartient bien à cet utilisateur
  const { data: commande } = await supabase
    .from('commandes')
    .select('id')
    .eq('fedapay_transaction_id', transactionId)
    .eq('utilisateur_id', user.id)
    .single();

  if (!commande) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });

  try {
    const res = await fetch(`${FEDAPAY_BASE}/transactions/${transactionId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await res.json();
    const tx = data['v1/transaction'] ?? data.transaction;
    const url = tx?.payment_url;

    if (!url) return NextResponse.json({ error: 'URL introuvable' }, { status: 404 });

    return NextResponse.json({ url });
  } catch {
    return NextResponse.json({ error: 'Erreur FedaPay' }, { status: 500 });
  }
}
