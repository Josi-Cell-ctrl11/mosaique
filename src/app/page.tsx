import { Hero } from '@/components/accueil/Hero';
import { PlatVedette } from '@/components/accueil/PlatVedette';
import { HistoireMosaique } from '@/components/accueil/HistoireMosaique';
import { PlatsPopulaires } from '@/components/accueil/PlatsPopulaires';
import { FooterSite } from '@/components/layout/FooterSite';
import type { Plat } from '@/types';

// Données placeholder — remplacées automatiquement dès que Supabase est connecté
const PLAT_VEDETTE_DEMO: Plat = {
  id: 'demo-1',
  categorie_id: 'cat-platspr-0000-0000-000000000002',
  nom: 'Poulet yassa',
  slug: 'poulet-yassa',
  description:
    'Poulet mariné dans le citron et les oignons caramélisés, mijoté jusqu\'à ce que la viande se détache de l\'os. Servi avec du riz blanc.',
  ingredients: 'Poulet fermier, citron, oignon, moutarde, ail, laurier, riz basmati',
  prix: 5500,
  image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=900&q=80',
  images_urls: [],
  disponible: true,
  est_vegetarien: false,
  est_epice: false,
  est_vedette: true,
  ordre: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const PLATS_POPULAIRES_DEMO: Plat[] = [
  {
    id: 'demo-1',
    categorie_id: 'cat-platspr-0000-0000-000000000002',
    nom: 'Poulet yassa',
    slug: 'poulet-yassa',
    description: 'Poulet mariné dans le citron et les oignons caramélisés, mijoté jusqu\'à ce que la viande se détache de l\'os.',
    prix: 5500,
    image_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80',
    images_urls: [],
    disponible: true,
    est_vegetarien: false,
    est_epice: false,
    est_vedette: true,
    ordre: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    categorie_id: 'cat-platspr-0000-0000-000000000002',
    nom: 'Thiéboudienne',
    slug: 'thieboudienne',
    description: 'Le riz au poisson sénégalais — riz cuit dans un bouillon de poisson enrichi, légumes fondants.',
    prix: 6000,
    image_url: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&q=80',
    images_urls: [],
    disponible: true,
    est_vegetarien: false,
    est_epice: false,
    est_vedette: true,
    ordre: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    categorie_id: 'cat-grillad-0000-0000-000000000003',
    nom: 'Poulet braisé au charbon',
    slug: 'poulet-braise',
    description: 'Demi-poulet fermier mariné 24h, braisé lentement au charbon de bois jusqu\'à la peau croustillante.',
    prix: 6500,
    image_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=600&q=80',
    images_urls: [],
    disponible: true,
    est_vegetarien: false,
    est_epice: false,
    est_vedette: true,
    ordre: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-4',
    categorie_id: 'cat-platspr-0000-0000-000000000002',
    nom: 'Mafé de bœuf',
    slug: 'mafe-boeuf',
    description: 'Ragoût de bœuf à la sauce arachide profonde, patate douce et aubergine africaine.',
    prix: 5800,
    image_url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&q=80',
    images_urls: [],
    disponible: true,
    est_vegetarien: false,
    est_epice: true,
    est_vedette: false,
    ordre: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-5',
    categorie_id: 'cat-dessert-0000-0000-000000000005',
    nom: 'Thiakry à la mangue',
    slug: 'thiakry-mangue',
    description: 'Semoule de mil fermenté au lait concentré et yaourt, couronné de dés de mangue fraîche.',
    prix: 2500,
    image_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
    images_urls: [],
    disponible: true,
    est_vegetarien: true,
    est_epice: false,
    est_vedette: false,
    ordre: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'demo-6',
    categorie_id: 'cat-boisson-0000-0000-000000000006',
    nom: 'Bissap maison',
    slug: 'bissap-maison',
    description: 'Infusion de fleurs d\'hibiscus fraîche, sucrée à la canne, parfumée à la menthe et au gingembre.',
    prix: 1000,
    image_url: 'https://images.unsplash.com/photo-1587899897387-091ebd01a6b2?w=600&q=80',
    images_urls: [],
    disponible: true,
    est_vegetarien: true,
    est_epice: false,
    est_vedette: false,
    ordre: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

async function getPlatsFromSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url === 'your_supabase_project_url') {
    return { vedette: PLAT_VEDETTE_DEMO, populaires: PLATS_POPULAIRES_DEMO };
  }

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();

    // Timeout de 5s pour éviter un blocage si la DB n'est pas encore prête
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));

    const fetchData = Promise.all([
      supabase
        .from('plats')
        .select('*, categorie:categories(*)')
        .eq('disponible', true)
        .eq('est_vedette', true)
        .limit(1)
        .single(),
      supabase
        .from('plats')
        .select('*, categorie:categories(*)')
        .eq('disponible', true)
        .order('ordre', { ascending: true })
        .limit(6),
    ]);

    const result = await Promise.race([fetchData, timeout]);

    if (!result) {
      // Timeout — on affiche les données demo sans planter
      return { vedette: PLAT_VEDETTE_DEMO, populaires: PLATS_POPULAIRES_DEMO };
    }

    const [{ data: platsVedettes }, { data: platsPopulaires }] = result;

    return {
      vedette: (platsVedettes as Plat | null) ?? PLAT_VEDETTE_DEMO,
      populaires: ((platsPopulaires ?? []) as Plat[]).length > 0
        ? (platsPopulaires as Plat[])
        : PLATS_POPULAIRES_DEMO,
    };
  } catch {
    return { vedette: PLAT_VEDETTE_DEMO, populaires: PLATS_POPULAIRES_DEMO };
  }
}

export default async function Accueil() {
  const { vedette, populaires } = await getPlatsFromSupabase();

  return (
    <>
      <Hero platVedette={vedette} />
      <PlatVedette plat={vedette} />
      <HistoireMosaique />
      <PlatsPopulaires plats={populaires} />
      <FooterSite />
    </>
  );
}
