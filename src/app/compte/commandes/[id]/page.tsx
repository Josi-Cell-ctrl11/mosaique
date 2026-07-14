import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { formatPrix, formatDate } from '@/lib/utils';
import { STATUT_LABELS } from '@/types';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ActionsCommandeEnAttente } from '@/components/compte/ActionsCommandeEnAttente';

export const metadata: Metadata = { title: 'Détail de commande' };

interface Props { params: { id: string } }

const ETAPES = [
  { statut: 'payee',           label: 'Payée' },
  { statut: 'en_preparation',  label: 'En préparation' },
  { statut: 'en_livraison',    label: 'En livraison' },
  { statut: 'livree',          label: 'Livrée' },
];

function getEtapeIndex(statut: string): number {
  return ETAPES.findIndex((e) => e.statut === statut);
}

export default async function PageDetailCommande({ params }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: commande } = await supabase
    .from('commandes')
    .select('*, lignes_commande(*)')
    .eq('id', params.id)
    .eq('utilisateur_id', user!.id)
    .single();

  if (!commande) notFound();

  const etapeActuelle = getEtapeIndex(commande.statut);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/compte/commandes" className="text-sm text-mosaique-gris hover:text-mosaique-ocre">
          ← Mes commandes
        </Link>
      </div>

      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-2">
        Commande {commande.numero}
      </h1>
      <p className="text-mosaique-gris text-sm mb-8">Passée le {formatDate(commande.created_at)}</p>

      {/* Suivi en cours — barre de progression */}
      {commande.statut !== 'annulee' && commande.statut !== 'en_attente_paiement' && (
        <div className="bg-white rounded-card shadow-card p-6 mb-6">
          <h2 className="font-semibold text-mosaique-nuit mb-4">Suivi de la commande</h2>
          <ol className="relative flex gap-0">
            {ETAPES.map((etape, i) => {
              const fait = i <= etapeActuelle;
              const actuel = i === etapeActuelle;
              return (
                <li key={etape.statut} className="flex-1 relative">
                  {/* Ligne de connexion */}
                  {i < ETAPES.length - 1 && (
                    <div className={`absolute top-4 left-1/2 right-0 h-0.5 ${fait ? 'bg-mosaique-ocre' : 'bg-mosaique-creme'}`} />
                  )}
                  <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      fait
                        ? 'bg-mosaique-ocre border-mosaique-ocre text-white'
                        : 'bg-white border-mosaique-creme text-mosaique-gris'
                    } ${actuel ? 'ring-4 ring-mosaique-ocre/20' : ''}`}>
                      {i + 1}
                    </div>
                    <span className={`text-xs text-center ${fait ? 'text-mosaique-nuit font-medium' : 'text-mosaique-gris'}`}>
                      {etape.label}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Détail articles */}
        <div className="bg-white rounded-card shadow-card p-6">
          <h2 className="font-semibold text-mosaique-nuit mb-4">Articles commandés</h2>
          <ul className="divide-y divide-mosaique-creme">
            {commande.lignes_commande?.map((ligne: { id: string; quantite: number; nom_plat: string; prix_unitaire: number; sous_total: number }) => (
              <li key={ligne.id} className="flex justify-between py-3 text-sm">
                <span className="text-mosaique-nuit">{ligne.quantite}× {ligne.nom_plat}</span>
                <span className="tabular-nums text-mosaique-gris">{formatPrix(ligne.sous_total)}</span>
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-mosaique-creme space-y-1.5 text-sm">
            <div className="flex justify-between text-mosaique-gris">
              <span>Sous-total</span>
              <span>{formatPrix(commande.sous_total)}</span>
            </div>
            <div className="flex justify-between text-mosaique-gris">
              <span>Livraison</span>
              <span>{formatPrix(commande.frais_livraison)}</span>
            </div>
            <div className="flex justify-between font-bold text-mosaique-nuit">
              <span>Total</span>
              <span className="prix">{formatPrix(commande.total)}</span>
            </div>
          </div>
        </div>

        {/* Adresse + statut */}
        <div className="bg-white rounded-card shadow-card p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-mosaique-nuit mb-2">Livraison à</h2>
            <p className="text-sm text-mosaique-gris">
              {commande.adresse_livraison}, {commande.ville_livraison}
            </p>
            <p className="text-sm text-mosaique-gris">{commande.telephone_livraison}</p>
          </div>
          <div>
            <h2 className="font-semibold text-mosaique-nuit mb-2">Statut</h2>
            <p className="text-sm text-mosaique-gris">{STATUT_LABELS[commande.statut as keyof typeof STATUT_LABELS]}</p>
          </div>
          {commande.notes && (
            <div>
              <h2 className="font-semibold text-mosaique-nuit mb-2">Instructions</h2>
              <p className="text-sm text-mosaique-gris">{commande.notes}</p>
            </div>
          )}

          {/* Actions si en attente de paiement */}
          {commande.statut === 'en_attente_paiement' && (
            <ActionsCommandeEnAttente
              commandeId={commande.id}
              fedapayTransactionId={commande.fedapay_transaction_id}
            />
          )}
        </div>
      </div>
    </div>
  );
}
