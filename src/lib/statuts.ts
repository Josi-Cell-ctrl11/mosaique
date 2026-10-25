import type { StatutCommande, StatutPaiement } from '@/types';

/** Couleurs des pastilles de statut (contraste AA vérifié sur fond blanc). */
export const COULEUR_STATUT: Record<StatutCommande, string> = {
  en_attente_paiement: 'bg-[#FFF1D6] text-[#7A4B00]',
  payee: 'bg-[#E6E1F7] text-[#3B2E7A]',
  en_preparation: 'bg-mosaique-dore text-mosaique-ocre-fonce',
  en_livraison: 'bg-[#DCEBFF] text-[#0B3A75]',
  livree: 'bg-[#E2F0E6] text-[#2C5A3A]',
  annulee: 'bg-[#F6E3DC] text-[#8A2E14]',
};

export const COULEUR_PAIEMENT: Record<StatutPaiement, string> = {
  paye: 'bg-[#E2F0E6] text-[#2C5A3A]',
  en_attente: 'bg-[#FFF1D6] text-[#7A4B00]',
  echoue: 'bg-[#F6E3DC] text-[#8A2E14]',
  rembourse: 'bg-[#ECE8E2] text-[#4A433C]',
};

export const LIBELLE_STATUT_COURT: Record<StatutCommande, string> = {
  en_attente_paiement: 'Paiement en attente',
  payee: 'Payée',
  en_preparation: 'En préparation',
  en_livraison: 'En livraison',
  livree: 'Livrée',
  annulee: 'Annulée',
};
