'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import type { Commande, StatutCommande } from '@/types';
import { STATUT_LABELS, STATUT_PAIEMENT_LABELS } from '@/types';
import { formatDate, formatPrix } from '@/lib/utils';
import { toast } from 'sonner';

interface Props { commande: Commande }
const TRANSITIONS: Record<StatutCommande, StatutCommande[]> = {
  en_attente_paiement: ['annulee'],
  payee: ['en_preparation'],
  en_preparation: ['en_livraison', 'annulee'],
  en_livraison: ['livree', 'annulee'],
  livree: [],
  annulee: [],
};

export function CommandeDetailAdminClient({ commande: initial }: Props) {
  const router = useRouter();
  const [commande, setCommande] = useState(initial);
  const [chargement, setChargement] = useState(false);
  const transitions = TRANSITIONS[commande.statut];

  async function changerStatut(statut: StatutCommande) {
    setChargement(true);
    try {
      const res = await fetch('/api/commandes/statut', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ commande_id: commande.id, statut }) });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error ?? 'Transition impossible.'); return; }
      setCommande(data.commande as Commande);
      toast.success(`Statut : ${STATUT_LABELS[statut]}`);
      router.refresh();
    } finally { setChargement(false); }
  }

  return <div className="space-y-6">
    <Link href="/admin/commandes" className="inline-flex items-center gap-2 text-sm text-mosaique-gris hover:text-mosaique-ocre"><ArrowLeft size={16} /> Retour aux commandes</Link>
    <div className="flex items-start justify-between gap-4 flex-wrap"><div><p className="text-xs uppercase tracking-wide text-mosaique-gris">Commande</p><h1 className="font-display text-2xl font-bold text-mosaique-terre">{commande.numero}</h1><p className="text-sm text-mosaique-gris mt-1">{formatDate(commande.created_at)}</p></div><span className="px-3 py-1.5 rounded-full text-sm bg-mosaique-ivoire text-mosaique-terre">{STATUT_LABELS[commande.statut]}</span></div>
    <div className="grid lg:grid-cols-3 gap-5">
      <section className="lg:col-span-2 bg-white rounded-card shadow-card p-6"><h2 className="font-semibold text-mosaique-nuit mb-4">Articles</h2><div className="divide-y divide-mosaique-creme">{(commande.lignes ?? []).map((ligne) => <div key={ligne.id} className="flex justify-between gap-4 py-3"><div><p className="font-medium text-mosaique-nuit">{ligne.quantite}× {ligne.nom_plat}</p>{ligne.options && <p className="text-xs text-mosaique-gris">Options : {Object.values(ligne.options).join(', ')}</p>}</div><span className="prix text-sm">{formatPrix(ligne.sous_total)}</span></div>)}</div><div className="border-t border-mosaique-creme mt-4 pt-4 space-y-2 text-sm"><div className="flex justify-between"><span>Sous-total</span><span>{formatPrix(commande.sous_total)}</span></div><div className="flex justify-between"><span>Livraison</span><span>{formatPrix(commande.frais_livraison)}</span></div><div className="flex justify-between font-bold text-base pt-2"><span>Total</span><span className="prix">{formatPrix(commande.total)}</span></div></div></section>
      <div className="space-y-5"><section className="bg-white rounded-card shadow-card p-6 space-y-3"><h2 className="font-semibold text-mosaique-nuit">Client</h2><p className="text-sm"><strong>{commande.profiles?.nom ?? 'Client'}</strong><br />{commande.profiles?.email}<br />{commande.telephone_livraison}</p><p className="text-sm text-mosaique-gris">{commande.adresse_livraison}<br />{commande.ville_livraison}</p>{commande.notes && <p className="text-sm bg-mosaique-ivoire p-3 rounded-lg">Note : {commande.notes}</p>}</section><section className="bg-white rounded-card shadow-card p-6 space-y-3"><h2 className="font-semibold text-mosaique-nuit">Paiement</h2><p className="text-sm">Statut : <strong>{STATUT_PAIEMENT_LABELS[commande.statut_paiement]}</strong></p><p className="text-xs text-mosaique-gris break-all">Référence : {commande.fedapay_reference ?? '—'}</p></section></div>
    </div>
    <section className="bg-white rounded-card shadow-card p-6"><h2 className="font-semibold text-mosaique-nuit mb-4">Actions</h2>{commande.statut_paiement === 'paye' && transitions.includes('annulee') ? <p className="text-sm text-yellow-800 bg-yellow-50 p-3 rounded-lg mb-4">Cette commande est payée. Le remboursement doit être traité avant une annulation.</p> : null}<div className="flex flex-wrap gap-3">{transitions.filter((statut) => statut !== 'annulee').map((statut) => <button key={statut} onClick={() => changerStatut(statut)} disabled={chargement} className="btn-primary"><CheckCircle2 size={16} /> {chargement ? '…' : `Passer à « ${STATUT_LABELS[statut]} »`}</button>)}{transitions.includes('annulee') && commande.statut_paiement !== 'paye' && <button onClick={() => changerStatut('annulee')} disabled={chargement} className="btn-secondary text-mosaique-epice"><XCircle size={16} /> Annuler la commande</button>}{transitions.length === 0 && <p className="text-sm text-mosaique-gris">Aucune transition disponible pour ce statut.</p>}</div></section>
  </div>;
}
