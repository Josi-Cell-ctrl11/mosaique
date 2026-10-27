'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Commande, StatutCommande } from '@/types';
import { STATUT_LABELS } from '@/types';
import { formatPrix, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

interface Props { commandes: Commande[] }

const STATUTS_SUIVANTS: Record<StatutCommande, StatutCommande | null> = {
  en_attente_paiement: null,           // géré par FedaPay
  payee:               'en_preparation',
  en_preparation:      'en_livraison',
  en_livraison:        'livree',
  livree:              null,
  annulee:             null,
};

const STATUT_COULEURS: Record<string, string> = {
  en_attente_paiement: 'bg-yellow-100 text-yellow-800',
  payee:              'bg-blue-100 text-blue-800',
  en_preparation:     'bg-orange-100 text-orange-800',
  en_livraison:       'bg-indigo-100 text-indigo-800',
  livree:             'bg-green-100 text-green-800',
  annulee:            'bg-red-100 text-red-800',
};

type FiltreStatut = 'tous' | StatutCommande;

export function CommandesAdminClient({ commandes: initial }: Props) {
  const router = useRouter();
  const [commandes, setCommandes] = useState(initial);
  const [filtre, setFiltre] = useState<FiltreStatut>('tous');
  const [chargement, setChargement] = useState<string | null>(null);

  const commandesFiltrees = filtre === 'tous'
    ? commandes
    : commandes.filter((c) => c.statut === filtre);

  async function changerStatut(commandeId: string, nouveauStatut: StatutCommande) {
    setChargement(commandeId);
    try {
      const res = await fetch('/api/commandes/statut', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commande_id: commandeId, statut: nouveauStatut }),
      });

      if (!res.ok) {
        toast.error('Erreur lors de la mise à jour.');
        return;
      }

      setCommandes((prev) =>
        prev.map((c) => c.id === commandeId ? { ...c, statut: nouveauStatut } : c)
      );
      toast.success(`Statut mis à jour : ${STATUT_LABELS[nouveauStatut]}`);
      router.refresh();
    } finally {
      setChargement(null);
    }
  }

  return (
    <div>
      {/* Filtres */}
      <div className="flex gap-2 flex-wrap mb-6">
        {(['tous', 'en_attente_paiement', 'payee', 'en_preparation', 'en_livraison', 'livree', 'annulee'] as FiltreStatut[]).map((s) => (
          <button
            key={s}
            onClick={() => setFiltre(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[36px] ${
              filtre === s
                ? 'bg-mosaique-ocre text-white'
                : 'bg-white text-mosaique-gris hover:text-mosaique-nuit border border-mosaique-creme'
            }`}
          >
            {s === 'tous' ? 'Toutes' : STATUT_LABELS[s]}
            {' '}({s === 'tous' ? commandes.length : commandes.filter((c) => c.statut === s).length})
          </button>
        ))}
      </div>

      {/* Liste */}
      {commandesFiltrees.length === 0 ? (
        <p className="text-mosaique-gris py-8 text-center">Aucune commande dans cette catégorie.</p>
      ) : (
        <div className="space-y-4">
          {commandesFiltrees.map((commande) => {
            const prochainStatut = STATUTS_SUIVANTS[commande.statut];
            const enChargement = chargement === commande.id;

            return (
              <div key={commande.id} className="bg-white rounded-card shadow-card p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Link
                        href={`/admin/commandes/${commande.id}`}
                        className="font-semibold text-mosaique-ocre hover:underline"
                      >
                        {commande.numero}
                      </Link>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUT_COULEURS[commande.statut] ?? ''}`}>
                        {STATUT_LABELS[commande.statut]}
                      </span>
                    </div>
                    <p className="text-sm text-mosaique-gris">
                      {(commande as Commande & { profiles?: { nom: string; telephone: string } }).profiles?.nom ?? '-'}
                      {' · '}
                      {formatDate(commande.created_at)}
                    </p>
                    {commande.lignes && commande.lignes.length > 0 && (
                      <p className="text-xs text-mosaique-gris mt-1">
                        {commande.lignes.map((l) => `${l.quantite}× ${l.nom_plat}`).join(' · ')}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="prix text-sm">{formatPrix(commande.total)}</span>
                    {prochainStatut && (
                      <button
                        onClick={() => changerStatut(commande.id, prochainStatut)}
                        disabled={enChargement}
                        className="btn-primary text-sm py-2 px-4"
                      >
                        {enChargement ? '…' : `→ ${STATUT_LABELS[prochainStatut]}`}
                      </button>
                    )}
                    {commande.statut !== 'annulee' && commande.statut !== 'livree' && (
                      <button
                        onClick={() => changerStatut(commande.id, 'annulee')}
                        disabled={enChargement}
                        className="text-xs text-mosaique-gris hover:text-mosaique-epice transition-colors min-h-[36px] px-2"
                      >
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
