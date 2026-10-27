import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { formatPrix, formatDate } from '@/lib/utils';
import { STATUT_LABELS } from '@/types';
import type { Metadata } from 'next';
import type { Commande } from '@/types';
import { ActionsCommandeEnAttente } from '@/components/compte/ActionsCommandeEnAttente';

export const metadata: Metadata = { title: 'Mes commandes' };

const STATUT_COULEURS: Record<string, string> = {
  en_attente_paiement: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  payee:              'bg-blue-50 text-blue-800 border-blue-200',
  en_preparation:     'bg-orange-50 text-orange-800 border-orange-200',
  en_livraison:       'bg-indigo-50 text-indigo-800 border-indigo-200',
  livree:             'bg-green-50 text-green-800 border-green-200',
  annulee:            'bg-red-50 text-red-800 border-red-200',
};

export default async function PageCommandes() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: commandes } = await supabase
    .from('commandes')
    .select('*, lignes_commande(*)')
    .eq('utilisateur_id', user!.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">Mes commandes</h1>

      {(!commandes || commandes.length === 0) ? (
        <div className="bg-white rounded-card shadow-card p-10 text-center">
          <p className="text-mosaique-gris mb-4">Vous n&apos;avez pas encore passé de commande.</p>
          <Link href="/menu" className="btn-primary">Voir le menu</Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {(commandes as Commande[]).map((commande) => (
            <li key={commande.id}>
              <div className="bg-white rounded-card shadow-card p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-semibold text-mosaique-nuit">{commande.numero}</p>
                    <p className="text-sm text-mosaique-gris mt-0.5">{formatDate(commande.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUT_COULEURS[commande.statut] ?? ''}`}>
                      {STATUT_LABELS[commande.statut]}
                    </span>
                    <span className="prix text-sm">{formatPrix(commande.total)}</span>
                  </div>
                </div>

                {/* Lignes */}
                {commande.lignes && commande.lignes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-mosaique-creme">
                    <p className="text-xs text-mosaique-gris">
                      {commande.lignes.map((l) => `${l.quantite}× ${l.nom_plat}`).join(' · ')}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex gap-3 flex-wrap items-center">
                  <Link
                    href={`/compte/commandes/${commande.id}`}
                    className="text-sm text-mosaique-ocre font-medium hover:underline"
                  >
                    Voir le détail →
                  </Link>
                </div>

                {/* Actions si en attente de paiement */}
                {commande.statut === 'en_attente_paiement' && (
                  <ActionsCommandeEnAttente
                    commandeId={commande.id}
                    fedapayTransactionId={commande.fedapay_transaction_id}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
