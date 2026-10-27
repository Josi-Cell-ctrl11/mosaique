import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatPrix } from '@/lib/utils';
import { STATUT_LABELS } from '@/types';
import type { Metadata } from 'next';
import type { Commande } from '@/types';

export const metadata: Metadata = { title: 'Tableau de bord' };
export const revalidate = 30;

export default async function AdminDashboard() {
  const supabase = createClient();

  const [
    { count: totalPlats },
    { count: totalCommandes },
    { data: commandesRecentes },
    { data: statsRevenu },
  ] = await Promise.all([
    supabase.from('plats').select('*', { count: 'exact', head: true }).eq('disponible', true),
    supabase.from('commandes').select('*', { count: 'exact', head: true }),
    supabase
      .from('commandes')
      .select('*, profiles(nom)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('commandes')
      .select('total')
      .eq('statut_paiement', 'paye'),
  ]);

  const revenuTotal = (statsRevenu ?? []).reduce((s: number, c: { total: number }) => s + c.total, 0);
  const commandesAujourd = (commandesRecentes ?? []).filter((c: Commande) => {
    const today = new Date().toDateString();
    return new Date(c.created_at).toDateString() === today;
  }).length;

  const STATUT_COULEURS: Record<string, string> = {
    en_attente_paiement: 'bg-yellow-100 text-yellow-800',
    payee:              'bg-blue-100 text-blue-800',
    en_preparation:     'bg-orange-100 text-orange-800',
    en_livraison:       'bg-indigo-100 text-indigo-800',
    livree:             'bg-green-100 text-green-800',
    annulee:            'bg-red-100 text-red-800',
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">Tableau de bord</h1>

      {/* Métriques */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Plats actifs',     valeur: totalPlats ?? 0,          unite: 'plats' },
          { label: 'Total commandes',  valeur: totalCommandes ?? 0,       unite: 'commandes' },
          { label: "Aujourd'hui",      valeur: commandesAujourd,          unite: 'commandes' },
          { label: 'Revenu (payé)',    valeur: formatPrix(revenuTotal),    unite: '' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-card shadow-card p-5">
            <p className="text-xs text-mosaique-gris uppercase tracking-wide mb-1">{m.label}</p>
            <p className="font-display text-2xl font-bold text-mosaique-terre">
              {typeof m.valeur === 'number' ? m.valeur : m.valeur}
            </p>
            {m.unite && <p className="text-xs text-mosaique-gris">{m.unite}</p>}
          </div>
        ))}
      </div>

      {/* Dernières commandes */}
      <div className="bg-white rounded-card shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-mosaique-nuit">Dernières commandes</h2>
          <Link href="/admin/commandes" className="text-sm text-mosaique-ocre hover:underline">
            Voir toutes →
          </Link>
        </div>

        {(!commandesRecentes || commandesRecentes.length === 0) ? (
          <p className="text-mosaique-gris text-sm">Aucune commande pour l&apos;instant.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-mosaique-gris uppercase border-b border-mosaique-creme">
                  <th className="text-left pb-3 pr-4">Numéro</th>
                  <th className="text-left pb-3 pr-4">Client</th>
                  <th className="text-left pb-3 pr-4">Statut</th>
                  <th className="text-right pb-3">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mosaique-creme">
                {(commandesRecentes as (Commande & { profiles: { nom: string } })[]).map((c) => (
                  <tr key={c.id} className="hover:bg-mosaique-ivoire transition-colors">
                    <td className="py-3 pr-4">
                      <Link href={`/admin/commandes/${c.id}`} className="text-mosaique-ocre font-medium hover:underline">
                        {c.numero}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-mosaique-nuit">{c.profiles?.nom ?? '-'}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_COULEURS[c.statut] ?? ''}`}>
                        {STATUT_LABELS[c.statut]}
                      </span>
                    </td>
                    <td className="py-3 text-right prix text-sm">{formatPrix(c.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
