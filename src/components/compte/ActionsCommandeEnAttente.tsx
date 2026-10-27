'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Props {
  commandeId: string;
  fedapayTransactionId?: string;
}

export function ActionsCommandeEnAttente({ commandeId, fedapayTransactionId }: Props) {
  const router = useRouter();
  const [annulation, setAnnulation] = useState(false);

  async function continuerPaiement() {
    if (!fedapayTransactionId) {
      toast.error('Transaction introuvable.');
      return;
    }
    // Récupérer l'URL de paiement depuis FedaPay
    try {
      const res = await fetch(`/api/commandes/paiement-url?transaction_id=${fedapayTransactionId}`);
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error('Impossible de récupérer le lien de paiement.');
      }
    } catch {
      toast.error('Erreur réseau.');
    }
  }

  async function annulerCommande() {
    if (!confirm('Confirmer l\'annulation de cette commande ?')) return;
    setAnnulation(true);
    try {
      const res = await fetch(`/api/commandes/annuler`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commande_id: commandeId }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Commande annulée.');
        router.refresh();
      } else {
        toast.error(data.error ?? 'Erreur lors de l\'annulation.');
      }
    } catch {
      toast.error('Erreur réseau.');
    } finally {
      setAnnulation(false);
    }
  }

  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      <button
        onClick={continuerPaiement}
        className="flex-1 sm:flex-none btn-primary text-sm py-2 px-4"
      >
        Continuer le paiement
      </button>
      <button
        onClick={annulerCommande}
        disabled={annulation}
        className="flex-1 sm:flex-none btn-secondary text-sm py-2 px-4 border-mosaique-epice text-mosaique-epice hover:bg-red-50"
      >
        {annulation ? 'Annulation…' : 'Annuler la commande'}
      </button>
    </div>
  );
}
