'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { StatutCommande } from '@/types';

const SUIVANT: Partial<Record<StatutCommande, { statut: StatutCommande; libelle: string }>> = {
  payee: { statut: 'en_preparation', libelle: 'Lancer' },
  en_preparation: { statut: 'en_livraison', libelle: 'Envoyer' },
  en_livraison: { statut: 'livree', libelle: 'Livrée' },
};

/** Fait passer une commande à l'étape suivante (via l'API protégée côté serveur). */
export function BoutonAvancerStatut({ commandeId, statut, grand = false }: { commandeId: string; statut: StatutCommande; grand?: boolean }) {
  const router = useRouter();
  const [enCours, setEnCours] = useState(false);
  const suivant = SUIVANT[statut];
  if (!suivant) return null;

  async function avancer() {
    setEnCours(true);
    try {
      const res = await fetch('/api/commandes/statut', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commande_id: commandeId, statut: suivant!.statut }),
      });
      const json = await res.json();
      if (!res.ok) toast.error(json.error ?? 'Action impossible');
      else router.refresh();
    } catch {
      toast.error('Erreur réseau');
    } finally {
      setEnCours(false);
    }
  }

  return (
    <button
      onClick={avancer}
      disabled={enCours}
      className={grand
        ? 'min-h-[46px] px-[18px] rounded-xl bg-mosaique-nuit text-mosaique-or font-extrabold text-sm disabled:opacity-60'
        : 'min-h-[38px] px-3 rounded-[10px] bg-mosaique-nuit text-mosaique-or font-extrabold text-[13px] disabled:opacity-60'}
    >
      {enCours ? '…' : grand ? { payee: 'Lancer la préparation', en_preparation: 'Envoyer en livraison', en_livraison: 'Marquer livrée' }[statut as 'payee'] : suivant.libelle}
    </button>
  );
}
