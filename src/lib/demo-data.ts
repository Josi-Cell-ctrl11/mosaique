/**
 * Données de démonstration — utilisées quand Supabase n'est pas encore configuré.
 * Reflète le vrai menu Le Mosaïque, Abomey-Calavi.
 */
import type { Plat, Categorie } from '@/types';

export const CATEGORIES_DEMO: Categorie[] = [
  { id: 'cat-1', nom: 'Sandwichs',        slug: 'sandwichs',        ordre: 1, created_at: '' },
  { id: 'cat-2', nom: 'Pâtes',            slug: 'pates',            ordre: 2, created_at: '' },
  { id: 'cat-3', nom: 'Kébabs',           slug: 'kebabs',           ordre: 3, created_at: '' },
  { id: 'cat-4', nom: 'Chawarma',         slug: 'chawarma',         ordre: 4, created_at: '' },
  { id: 'cat-5', nom: 'Poulets',          slug: 'poulets',          ordre: 5, created_at: '' },
  { id: 'cat-6', nom: 'Brochettes',       slug: 'brochettes',       ordre: 6, created_at: '' },
  { id: 'cat-7', nom: 'Poissons braisés', slug: 'poissons-braises', ordre: 7, created_at: '' },
  { id: 'cat-8', nom: 'Gaufres',          slug: 'gaufres',          ordre: 8, created_at: '' },
  { id: 'cat-9', nom: 'Crêpes',           slug: 'crepes',           ordre: 9, created_at: '' },
];

const d = new Date().toISOString();

export const PLATS_DEMO: Plat[] = [
  // ── SANDWICHS ──────────────────────────────────────────────
  {
    id: 'd-s01', categorie_id: 'cat-1', nom: 'Sandwich poulet BBQ', slug: 'sandwich-poulet-bbq',
    description: 'Sandwich généreux au poulet grillé façon BBQ, sauce maison, légumes frais.',
    prix: 3500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 1,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-s02', categorie_id: 'cat-1', nom: 'Sandwich poulet piquant', slug: 'sandwich-poulet-piquant',
    description: 'Poulet mariné aux épices pimentées, garni de légumes croquants et sauce relevée.',
    prix: 3500, disponible: true, est_vegetarien: false, est_epice: true, est_vedette: false, ordre: 2,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-s03', categorie_id: 'cat-1', nom: 'Sandwich langue de bœuf', slug: 'sandwich-langue-boeuf',
    description: 'Tranches de langue de bœuf fondantes, moutarde et cornichons dans un pain moelleux.',
    prix: 3000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 3,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-s04', categorie_id: 'cat-1', nom: 'Sandwich frites', slug: 'sandwich-frites',
    description: 'Sandwich garni de frites croustillantes, sauce ketchup-mayo maison.',
    prix: 2000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 4,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-s05', categorie_id: 'cat-1', nom: 'Chicken Sub', slug: 'chicken-sub',
    description: 'Sub au poulet grillé, salade, tomate, oignon et sauce spéciale Mosaïque.',
    prix: 3500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 5,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-s06', categorie_id: 'cat-1', nom: 'Steak Sub', slug: 'steak-sub',
    description: 'Sub au steak de bœuf émincé, poivrons sautés, fromage fondu et sauce maison.',
    prix: 3500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 6,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-s07', categorie_id: 'cat-1', nom: 'Hot Dog', slug: 'hot-dog',
    description: 'Saucisse grillée dans un pain brioché, moutarde, ketchup et oignons.',
    prix: 2000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 7,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-s08', categorie_id: 'cat-1', nom: 'Brochette de bœuf roulé', slug: 'brochette-boeuf-roule',
    description: 'Bœuf mariné roulé en brochette, servi dans un pain avec sauce arachide.',
    prix: 2500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 8,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-s09', categorie_id: 'cat-1', nom: '@MOSAÏQUE Hot Dog', slug: 'mosaique-hot-dog',
    description: 'La version signature Mosaïque — saucisse XXL, garnitures généreuses, sauce exclusive.',
    prix: 3500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 9,
    images_urls: [], created_at: d, updated_at: d,
  },

  // ── PÂTES ──────────────────────────────────────────────────
  {
    id: 'd-p01', categorie_id: 'cat-2', nom: 'Spaghetti sauce provençale', slug: 'spaghetti-provencale',
    description: 'Spaghetti al dente dans une sauce provençale tomate-herbes, parfumée à l\'ail et au basilic.',
    prix: 3500, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 1,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-p02', categorie_id: 'cat-2', nom: 'Spaghetti bolognaise', slug: 'spaghetti-bolognaise',
    description: 'Spaghetti avec une bolognaise de bœuf mijotée lentement, sauce tomate riche.',
    prix: 3500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 2,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-p03', categorie_id: 'cat-2', nom: 'Spaghetti al pesto', slug: 'spaghetti-pesto',
    description: 'Spaghetti enrobés d\'un pesto basilic-parmesan maison, noix de pin.',
    prix: 3000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 3,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-p04', categorie_id: 'cat-2', nom: 'Penne forestière', slug: 'penne-forestiere',
    description: 'Penne aux champignons des bois, crème fraîche, ail et persil.',
    prix: 4000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 4,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-p05', categorie_id: 'cat-2', nom: 'Penne aux fruits de mer', slug: 'penne-fruits-de-mer',
    description: 'Penne avec crevettes, calamars et moules dans une sauce tomate-crème parfumée.',
    prix: 4500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 5,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-p06', categorie_id: 'cat-2', nom: 'Farfalle MC Bouffe', slug: 'farfalle-mc-bouffe',
    description: 'Farfalle en sauce crémeuse au poulet grillé et légumes de saison.',
    prix: 4000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 6,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-p07', categorie_id: 'cat-2', nom: '@MOSAÏQUE Spaghetti', slug: 'mosaique-spaghetti',
    description: 'La signature Mosaïque — spaghetti en sauce spéciale maison, garniture généreuse.',
    prix: 3500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 7,
    images_urls: [], created_at: d, updated_at: d,
  },

  // ── KÉBABS ─────────────────────────────────────────────────
  {
    id: 'd-k01', categorie_id: 'cat-3', nom: 'Kébab Mouton', slug: 'kebab-mouton',
    description: 'Kébab de mouton mariné aux épices orientales, servi avec frites ou riz au choix.',
    prix: 3000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 1,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-k02', categorie_id: 'cat-3', nom: 'Kébab Bœuf', slug: 'kebab-boeuf',
    description: 'Kébab de bœuf haché épicé, garni de légumes frais et sauce yaourt.',
    prix: 4000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 2,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-k03', categorie_id: 'cat-3', nom: 'Kébab Poulet', slug: 'kebab-poulet',
    description: 'Kébab de poulet mariné au citron et herbes, légumes croquants, sauce blanche.',
    prix: 2500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 3,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-k04', categorie_id: 'cat-3', nom: 'Kébab Azmarlé', slug: 'kebab-azmarle',
    description: 'Kébab façon Azmarlé — viande mixte, épices locales, sauce signature.',
    prix: 3500, disponible: true, est_vegetarien: false, est_epice: true, est_vedette: false, ordre: 4,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-k05', categorie_id: 'cat-3', nom: 'Kébab Antablé', slug: 'kebab-antable',
    description: 'Kébab Antablé — préparation traditionnelle, viande tendre et marinée.',
    prix: 3000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 5,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-k06', categorie_id: 'cat-3', nom: 'Kébab Khichkhach', slug: 'kebab-khichkhach',
    description: 'Kébab Khichkhach — viande finement hachée avec épices maison.',
    prix: 3000, disponible: true, est_vegetarien: false, est_epice: true, est_vedette: false, ordre: 6,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-k07', categorie_id: 'cat-3', nom: '@MOSAÏQUE Kébab', slug: 'mosaique-kebab',
    description: 'Le kébab signature Mosaïque — viande premium, sauce exclusive, garniture complète.',
    prix: 4000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 7,
    images_urls: [], created_at: d, updated_at: d,
  },

  // ── POULETS ────────────────────────────────────────────────
  {
    id: 'd-v01', categorie_id: 'cat-4', nom: 'Poulet braisé entier', slug: 'poulet-braise-entier',
    description: 'Poulet fermier entier mariné et braisé au charbon de bois — peau croustillante, chair juteuse.',
    prix: 8000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 1,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-v02', categorie_id: 'cat-4', nom: 'Poulet rôti entier', slug: 'poulet-roti-entier',
    description: 'Poulet entier rôti lentement aux herbes et ail, servi avec son jus.',
    prix: 10000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 2,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-v03', categorie_id: 'cat-4', nom: 'Demi poulet braisé', slug: 'demi-poulet-braise',
    description: 'Demi-poulet braisé au charbon, mariné 24h. Servi avec accompagnement au choix.',
    prix: 4500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 3,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-v04', categorie_id: 'cat-4', nom: 'Demi poulet rôti', slug: 'demi-poulet-roti',
    description: 'Demi-poulet rôti aux herbes, tendre et parfumé.',
    prix: 5500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 4,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-v05', categorie_id: 'cat-4', nom: 'Poulet entier grillé', slug: 'poulet-entier-grille',
    description: 'Poulet entier grillé sur braise vive, assaisonné aux épices maison.',
    prix: 9000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 5,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-v06', categorie_id: 'cat-4', nom: 'Demi poulet grillé', slug: 'demi-poulet-grille',
    description: 'Demi-poulet grillé à point, croustillant en surface, moelleux à l\'intérieur.',
    prix: 5000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 6,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-v07', categorie_id: 'cat-4', nom: 'Poulet entier fumé', slug: 'poulet-entier-fume',
    description: 'Poulet entier fumé lentement aux bois aromatiques — saveur profonde et unique.',
    prix: 11000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 7,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-v08', categorie_id: 'cat-4', nom: 'Demi poulet fumé', slug: 'demi-poulet-fume',
    description: 'Demi-poulet fumé, texture fondante et arômes boisés.',
    prix: 6000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 8,
    images_urls: [], created_at: d, updated_at: d,
  },

  // ── BROCHETTES ─────────────────────────────────────────────
  {
    id: 'd-b01', categorie_id: 'cat-5', nom: 'Brochettes de mouton', slug: 'brochettes-mouton',
    description: 'Brochettes de mouton marinées aux épices, grillées sur braise vive.',
    prix: 8000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 1,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-b02', categorie_id: 'cat-5', nom: 'Brochettes de bœuf', slug: 'brochettes-boeuf',
    description: 'Brochettes de bœuf tendre, marinées au gingembre et herbes, grillées à point.',
    prix: 7000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 2,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-b03', categorie_id: 'cat-5', nom: 'Brochettes de gésiers de dinde', slug: 'brochettes-gesiers-dinde',
    description: 'Gésiers de dinde marinés et grillés en brochettes — saveur intense.',
    prix: 6000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 3,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-b04', categorie_id: 'cat-5', nom: 'Brochettes de gésiers de poule', slug: 'brochettes-gesiers-poule',
    description: 'Gésiers de poule en brochettes, marinés aux épices et grillés sur charbon.',
    prix: 5000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 4,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-b05', categorie_id: 'cat-5', nom: 'Brochettes de blanc de poulet', slug: 'brochettes-blanc-poulet',
    description: 'Blanc de poulet en brochettes, marinade citron-herbes, grillé moelleux.',
    prix: 5000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 5,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-b06', categorie_id: 'cat-5', nom: 'Brochettes de filet de poisson', slug: 'brochettes-filet-poisson',
    description: 'Filet de poisson frais en brochettes, épices douces, grillé sur braise.',
    prix: 6500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 6,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-b07', categorie_id: 'cat-5', nom: 'Brochettes de saucisses', slug: 'brochettes-saucisses',
    description: 'Saucisses maison en brochettes, grillées et servies avec sauce pimentée.',
    prix: 3000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 7,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-b08', categorie_id: 'cat-5', nom: 'Brochettes d\'ailerons', slug: 'brochettes-ailerons',
    description: 'Ailerons de poulet marinés et grillés en brochettes — croustillants et savoureux.',
    prix: 7000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 8,
    images_urls: [], created_at: d, updated_at: d,
  },

  // ── POISSONS BRAISÉS ───────────────────────────────────────
  {
    id: 'd-f01', categorie_id: 'cat-6', nom: 'Bar braisé', slug: 'bar-braise',
    description: 'Bar entier braisé sur charbon de bois, arrosé de sauce oignon-tomate fraîche.',
    prix: 8000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 1,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-f02', categorie_id: 'cat-6', nom: 'Dorade braisée', slug: 'dorade-braisee',
    description: 'Dorade royale entière braisée, marinée aux épices et citron, sauce maison.',
    prix: 8000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 2,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-f03', categorie_id: 'cat-6', nom: 'Carpe rouge braisée', slug: 'carpe-rouge-braisee',
    description: 'Carpe rouge entière braisée lentement, chair fondante et peau dorée.',
    prix: 7000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 3,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-f04', categorie_id: 'cat-6', nom: 'Tilapia braisé', slug: 'tilapia-braise',
    description: 'Tilapia entier braisé au charbon, servi avec sauce tomate-oignon pimentée.',
    prix: 6000, disponible: true, est_vegetarien: false, est_epice: true, est_vedette: false, ordre: 4,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-f05', categorie_id: 'cat-6', nom: 'Sol braisé', slug: 'sol-braise',
    description: 'Poisson sol braisé, délicat et savoureux, sauce légère aux herbes.',
    prix: 5000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 5,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-f06', categorie_id: 'cat-6', nom: 'MTN braisé', slug: 'mtn-braise',
    description: 'MTN braisé — poisson populaire de la région, préparé à la façon Mosaïque.',
    prix: 5000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 6,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-f07', categorie_id: 'cat-6', nom: 'Poisson de table entier braisé', slug: 'poisson-table-entier-braise',
    description: 'Grand poisson de table entier braisé — plat de fête pour partager en famille.',
    prix: 30000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 7,
    images_urls: [], created_at: d, updated_at: d,
  },

  // ── GAUFRES ────────────────────────────────────────────────
  {
    id: 'd-g01', categorie_id: 'cat-7', nom: 'Gaufre au sucre', slug: 'gaufre-sucre',
    description: 'Gaufre croustillante saupoudrée de sucre glace, servie chaude.',
    prix: 2500, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 1,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-g02', categorie_id: 'cat-7', nom: 'Gaufre au chocolat', slug: 'gaufre-chocolat',
    description: 'Gaufre nappée de chocolat fondu chaud, généreuse et gourmande.',
    prix: 3000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 2,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-g03', categorie_id: 'cat-7', nom: 'Gaufre chocolat banane', slug: 'gaufre-chocolat-banane',
    description: 'Gaufre avec chocolat fondu et tranches de banane fraîche.',
    prix: 3500, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: true, ordre: 3,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-g04', categorie_id: 'cat-7', nom: 'Gaufre au miel', slug: 'gaufre-miel',
    description: 'Gaufre dorée nappée de miel naturel, légère et parfumée.',
    prix: 3000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 4,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-g05', categorie_id: 'cat-7', nom: 'Gaufre à la confiture', slug: 'gaufre-confiture',
    description: 'Gaufre garnie de confiture maison au choix.',
    prix: 3000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 5,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-g06', categorie_id: 'cat-7', nom: 'Gaufre St Georges', slug: 'gaufre-st-georges',
    description: 'Gaufre garnie façon St Georges — crème, fruits et touche de chocolat.',
    prix: 4000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 6,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-g07', categorie_id: 'cat-7', nom: 'Gaufre spéciale MOSAÏQUE', slug: 'gaufre-speciale-mosaique',
    description: 'La signature — gaufre XXL avec garnitures multiples, sauce exclusive Mosaïque.',
    prix: 4000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: true, ordre: 7,
    images_urls: [], created_at: d, updated_at: d,
  },

  // ── CRÊPES ─────────────────────────────────────────────────
  {
    id: 'd-c01', categorie_id: 'cat-8', nom: 'Crêpe au fromage', slug: 'crepe-fromage',
    description: 'Crêpe fine garnie de fromage fondu, dorée à point.',
    prix: 2000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 1,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c02', categorie_id: 'cat-8', nom: 'Crêpe au jambon', slug: 'crepe-jambon',
    description: 'Crêpe garnie de jambon blanc et légèrement beurrée.',
    prix: 1500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 2,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c03', categorie_id: 'cat-8', nom: 'Crêpe jambon fromage', slug: 'crepe-jambon-fromage',
    description: 'Crêpe garnie de jambon et fromage fondant — la combinaison classique.',
    prix: 2500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: true, ordre: 3,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c04', categorie_id: 'cat-8', nom: 'Crêpe paysane', slug: 'crepe-paysane',
    description: 'Crêpe garnie d\'œuf, jambon, fromage et champignons.',
    prix: 3000, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 4,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c05', categorie_id: 'cat-8', nom: 'Crêpe complète', slug: 'crepe-complete',
    description: 'La complète — œuf, jambon, fromage, et garniture du moment.',
    prix: 3500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 5,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c06', categorie_id: 'cat-8', nom: '@MOSAÏQUE Crêpes', slug: 'mosaique-crepe-salee',
    description: 'La crêpe signature Mosaïque façon salée — garniture maison exclusive.',
    prix: 2500, disponible: true, est_vegetarien: false, est_epice: false, est_vedette: false, ordre: 6,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c07', categorie_id: 'cat-8', nom: 'Crêpe au sucre', slug: 'crepe-sucre',
    description: 'Crêpe fine saupoudrée de sucre, simple et délicieuse.',
    prix: 1000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 7,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c08', categorie_id: 'cat-8', nom: 'Crêpe Nutella', slug: 'crepe-nutella',
    description: 'Crêpe généreusement garnie de Nutella — le classique indémodable.',
    prix: 2000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: true, ordre: 8,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c09', categorie_id: 'cat-8', nom: 'Crêpe chocolat banane', slug: 'crepe-chocolat-banane',
    description: 'Crêpe avec chocolat fondu et tranches de banane fraîche.',
    prix: 2500, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 9,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c10', categorie_id: 'cat-8', nom: 'Crêpe au miel', slug: 'crepe-miel',
    description: 'Crêpe nappée de miel naturel, chaude et parfumée.',
    prix: 2000, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 10,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c11', categorie_id: 'cat-8', nom: 'Crêpe à la confiture', slug: 'crepe-confiture',
    description: 'Crêpe garnie de confiture maison, légère et fruitée.',
    prix: 2500, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: false, ordre: 11,
    images_urls: [], created_at: d, updated_at: d,
  },
  {
    id: 'd-c12', categorie_id: 'cat-8', nom: '#MOSAÏQUE Crêpes', slug: 'mosaique-crepe-sucree',
    description: 'La crêpe signature Mosaïque sucrée — garniture surprise maison.',
    prix: 1500, disponible: true, est_vegetarien: true, est_epice: false, est_vedette: true, ordre: 12,
    images_urls: [], created_at: d, updated_at: d,
  },
];
