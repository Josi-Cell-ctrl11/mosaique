import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Formate un prix en Francs CFA
 * ex: 5500 → "5 500 FCFA"
 */
export function formatPrix(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant) + ' FCFA';
}

/**
 * Formate une date en français
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

/**
 * Formate une date courte
 */
export function formatDateCourte(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

/**
 * Slugifie un texte
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calcule le total d'un panier
 */
export function calculerTotalPanier(
  articles: Array<{ prix: number; quantite: number; prixOptions: number }>
): number {
  return articles.reduce(
    (total, a) => total + (a.prix + a.prixOptions) * a.quantite,
    0
  );
}

/**
 * Génère les créneaux horaires de livraison (toutes les 30 min, dans les 3h)
 */
export function genererCreneauxLivraison(delaiMinutes: number = 45): Array<{ label: string; value: string }> {
  const creneaux: Array<{ label: string; value: string }> = [];
  const maintenant = new Date();
  const debut = new Date(maintenant.getTime() + delaiMinutes * 60 * 1000);

  // Arrondir au prochain demi-heure
  debut.setMinutes(Math.ceil(debut.getMinutes() / 30) * 30, 0, 0);

  // Générer 8 créneaux (4 heures)
  for (let i = 0; i < 8; i++) {
    const creneau = new Date(debut.getTime() + i * 30 * 60 * 1000);
    const label = creneau.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    creneaux.push({ label, value: creneau.toISOString() });
  }

  return creneaux;
}

/**
 * Image de fallback pour les plats sans photo
 */
export function imagePlaceholder(nom: string): string {
  // Unsplash food photos de haute qualité
  const photos = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  ];
  // Hash stable basé sur le nom pour toujours retourner la même photo
  const index = nom.charCodeAt(0) % photos.length;
  return photos[index];
}
