import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';
import { envoyerNotification } from '@/lib/notifications';

const FEDAPAY_BASE = process.env.FEDAPAY_ENVIRONMENT === 'sandbox'
  ? 'https://sandbox-api.fedapay.com/v1'
  : 'https://api.fedapay.com/v1';

export type TransactionFedapay = {
  id: number | string;
  reference?: string;
  status?: string;
  amount?: number;
  payment_url?: string;
  mode?: string | null;
};

export async function fedapayFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${FEDAPAY_BASE}${path}`, {
    ...options,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
      ...(options.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`FedaPay ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

/** La réponse FedaPay est rangée sous la clé « v1/transaction ». */
export function extraireTransaction(data: Record<string, unknown>): TransactionFedapay | null {
  const tx = (data['v1/transaction'] ?? data.transaction ?? (data.v1 as Record<string, unknown> | undefined)?.transaction) as TransactionFedapay | undefined;
  return tx ?? null;
}

/**
 * Vérifie l'en-tête X-FEDAPAY-SIGNATURE (format « t=<horodatage>,s=<hmac> »),
 * HMAC-SHA256 de « <t>.<corps brut> » avec le secret du webhook.
 */
export function signatureValide(corpsBrut: string, entete: string | null, secret: string, toleranceSec = 300): boolean {
  if (!entete) return false;
  const parties = Object.fromEntries(
    entete.split(',').map((p) => {
      const [k, ...v] = p.trim().split('=');
      return [k, v.join('=')];
    })
  );
  const t = Number(parties.t);
  const s = parties.s;
  if (!t || !s) return false;
  if (Math.abs(Date.now() / 1000 - t) > toleranceSec) return false;
  const attendu = crypto.createHmac('sha256', secret).update(`${t}.${corpsBrut}`).digest('hex');
  const a = Buffer.from(attendu, 'hex');
  const b = Buffer.from(s, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Source de vérité : on interroge FedaPay pour connaître l'état réel d'une transaction,
 * puis on met la commande à jour. Rien de ce que le navigateur ou un webhook non vérifié
 * prétend n'est pris pour argent comptant.
 */
export async function synchroniserPaiement(commandeId: string): Promise<'paye' | 'echoue' | 'en_attente' | 'rembourse' | 'inconnu'> {
  const supabaseAdmin = createAdminClient();
  const { data: commande } = await supabaseAdmin
    .from('commandes')
    .select('id, numero, total, statut, statut_paiement, utilisateur_id, fedapay_transaction_id')
    .eq('id', commandeId)
    .maybeSingle();

  if (!commande?.fedapay_transaction_id) return 'inconnu';
  if (commande.statut_paiement === 'paye' || commande.statut_paiement === 'rembourse') return commande.statut_paiement;

  let tx: TransactionFedapay | null = null;
  try {
    tx = extraireTransaction(await fedapayFetch(`/transactions/${commande.fedapay_transaction_id}`));
  } catch (e) {
    console.error('Vérification FedaPay impossible:', e);
    return 'inconnu';
  }
  if (!tx) return 'inconnu';

  const statut = tx.status;
  if (statut === 'approved' || statut === 'transferred') {
    if (Number(tx.amount) !== commande.total) {
      console.error(`Montant incohérent pour ${commande.numero}: payé ${tx.amount}, attendu ${commande.total}`);
      return 'inconnu';
    }
    // Mise à jour conditionnelle : un seul passage à « payé », même si webhook et retour arrivent ensemble
    const { data: maj } = await supabaseAdmin
      .from('commandes')
      .update({ statut_paiement: 'paye', statut: 'en_preparation' })
      .eq('id', commande.id)
      .eq('statut_paiement', commande.statut_paiement)
      .select('id')
      .maybeSingle();
    if (maj) {
      await envoyerNotification({
        type: 'commande_confirmee',
        commandeId: commande.id,
        commandeNumero: commande.numero,
        userId: commande.utilisateur_id,
      }).catch(console.error);
    }
    return 'paye';
  }

  if (statut === 'declined' || statut === 'canceled' || statut === 'expired') {
    await supabaseAdmin
      .from('commandes')
      .update({ statut_paiement: 'echoue' })
      .eq('id', commande.id)
      .eq('statut_paiement', 'en_attente');
    return 'echoue';
  }

  if (statut === 'refunded') {
    await supabaseAdmin.from('commandes').update({ statut_paiement: 'rembourse', statut: 'annulee' }).eq('id', commande.id);
    return 'rembourse';
  }

  return 'en_attente';
}
