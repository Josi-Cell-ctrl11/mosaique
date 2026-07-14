// ============================================================
// Types Mosaïque
// ============================================================

export type Categorie = {
  id: string;
  nom: string;
  slug: string;
  ordre: number;
  created_at: string;
};

export type Plat = {
  id: string;
  categorie_id: string;
  categorie?: Categorie;
  nom: string;
  slug: string;
  description: string;
  ingredients?: string;
  prix: number;
  image_url?: string;
  images_urls?: string[];
  disponible: boolean;
  est_vegetarien: boolean;
  est_epice: boolean;
  est_vedette: boolean;
  ordre: number;
  options?: OptionPlat[];
  avis?: Avis[];
  created_at: string;
  updated_at: string;
};

export type OptionPlat = {
  id: string;
  plat_id: string;
  nom: string;
  type: 'select' | 'checkbox';
  required: boolean;
  valeurs: ValeurOption[];
};

export type ValeurOption = {
  id: string;
  option_id: string;
  label: string;
  prix_sup: number;
};

export type Avis = {
  id: string;
  plat_id: string;
  utilisateur_id: string;
  note: number;
  commentaire?: string;
  approuve: boolean;
  created_at: string;
  profiles?: { nom: string };
};

export type Profile = {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  adresse?: string;
  ville?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type ConfigLivraison = {
  id: string;
  type: 'fixe' | 'par_zone';
  frais_fixe: number;
  delai_minutes: number;
  actif: boolean;
  zones?: ZoneLivraison[];
};

export type ZoneLivraison = {
  id: string;
  config_id: string;
  nom: string;
  frais: number;
};

export type StatutCommande =
  | 'en_attente_paiement'
  | 'payee'
  | 'en_preparation'
  | 'en_livraison'
  | 'livree'
  | 'annulee';

export type StatutPaiement = 'en_attente' | 'paye' | 'echoue' | 'rembourse';

export type Commande = {
  id: string;
  numero: string;
  utilisateur_id: string;
  statut: StatutCommande;
  statut_paiement: StatutPaiement;
  adresse_livraison: string;
  ville_livraison: string;
  telephone_livraison: string;
  zone_livraison_id?: string;
  sous_total: number;
  frais_livraison: number;
  total: number;
  heure_livraison?: string;
  fedapay_transaction_id?: string;
  fedapay_reference?: string;
  notes?: string;
  lignes?: LigneCommande[];
  profiles?: Profile;
  created_at: string;
  updated_at: string;
};

export type LigneCommande = {
  id: string;
  commande_id: string;
  plat_id?: string;
  nom_plat: string;
  prix_unitaire: number;
  quantite: number;
  options?: Record<string, string>;
  sous_total: number;
};

// Panier (côté client, Zustand)
export type ArticlePanier = {
  platId: string;
  nom: string;
  prix: number;
  image_url?: string;
  quantite: number;
  options?: Record<string, string>;
  prixOptions: number; // total suppléments
};

export const STATUT_LABELS: Record<StatutCommande, string> = {
  en_attente_paiement: 'En attente de paiement',
  payee: 'Payée',
  en_preparation: 'En préparation',
  en_livraison: 'En livraison',
  livree: 'Livrée',
  annulee: 'Annulée',
};

export const STATUT_PAIEMENT_LABELS: Record<StatutPaiement, string> = {
  en_attente: 'En attente',
  paye: 'Payé',
  echoue: 'Échoué',
  rembourse: 'Remboursé',
};
