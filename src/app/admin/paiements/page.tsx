import { createClient } from '@/lib/supabase/server';
import { formatPrix, formatDate } from '@/lib/utils';
import { STATUT_PAIEMENT_LABELS } from '@/types';
import type { Metadata } from 'next';
import type { Commande } from '@/types';

export const metadata: Metadata = { title: 'Suivi des paiements' };
export const revalidate = 0;

const PAIEMENT_COULEURS: Record<string, string> = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  paye:       'bg-green-100 text-green-800',
  echoue:     'bg-red-100 text-red-800',
  rembourse:  'bg-gray-100 text-gray-800',
};

export default async function AdminPaiements() {
  const supabase = createClient();

  const { data: commandes } = await supabase
    .from('commandes')
    .select('*, profiles(nom, telephone)')
    .order('created_at', { ascending: false });

  const totalPaye = (commandes ?? [])
    .filter((c: Commande) => c.statut_paiement === 'paye')
    .reduce((s: number, c: Commande) => s + c.total, 0);

  const totalEnAttente = (commandes ?? [])
    .filter((c: Commande) => c.statut_paiement === 'en_attente')
    .reduce((s: number, c: Commande) => s + c.total, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">
        Suivi des paiements
      </h1>

      {/* Métriques */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-card shadow-card p-5">
          <p className="text-xs text-mosaique-gris uppercase tracking-wide mb-1">Total encaissé</p>
          <p className="font-display text-2xl font-bold text-mosaique-vert">{formatPrix(totalPaye)}</p>
        </div>
        <div className="bg-white rounded-card shadow-card p-5">
          <p className="text-xs text-mosaique-gris uppercase tracking-wide mb-1">En attente</p>
          <p className="font-display text-2xl font-bold text-yellow-600">{formatPrix(totalEnAttente)}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-mosaique-ivoire border-b border-mosaique-creme text-xs text-mosaique-gris uppercase">
                <th className="text-left px-4 py-3">Commande</th>
                <th className="text-left px-4 py-3">Client</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Montant</th>
                <th className="text-center px-4 py-3">Statut</th>
                <th className="text-left px-4 py-3">Réf. FedaPay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mosaique-creme">
              {(commandes as (Commande & { profiles?: { nom: string } })[])?.map((c) => (
                <tr key={c.id} className="hover:bg-mosaique-ivoire/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-mosaique-ocre">{c.numero}</td>
                  <td className="px-4 py-3 text-mosaique-nuit">{c.profiles?.nom ?? '-'}</td>
                  <td className="px-4 py-3 text-mosaique-gris">{formatDate(c.created_at)}</td>
                  <td className="px-4 py-3 text-right prix text-sm">{formatPrix(c.total)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PAIEMENT_COULEURS[c.statut_paiement] ?? ''}`}>
                      {STATUT_PAIEMENT_LABELS[c.statut_paiement]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-mosaique-gris font-mono text-xs">
                    {c.fedapay_reference ?? '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
