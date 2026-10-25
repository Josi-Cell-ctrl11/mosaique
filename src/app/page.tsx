import { Hero } from '@/components/accueil/Hero';
import { CategoriesAccueil } from '@/components/accueil/CategoriesAccueil';
import { SaucesMaison, type FamilleSauce } from '@/components/accueil/SaucesMaison';
import { Michoui } from '@/components/accueil/Michoui';
import { PlatsPopulaires } from '@/components/accueil/PlatsPopulaires';
import { CommentCaMarche } from '@/components/accueil/CommentCaMarche';
import { FooterSite } from '@/components/layout/FooterSite';
import { CATEGORIES_DEMO, PLATS_DEMO } from '@/lib/demo-data';
import type { Categorie, Plat } from '@/types';

export const revalidate = 300;

async function getDonnees(): Promise<{ categories: Categorie[]; plats: Plat[] }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url === 'your_supabase_project_url') return { categories: CATEGORIES_DEMO, plats: PLATS_DEMO };
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();
    const [{ data: categories }, { data: plats }] = await Promise.all([
      supabase.from('categories').select('*').order('ordre'),
      supabase.from('plats').select('*, categorie:categories(*)').eq('disponible', true).order('ordre'),
    ]);
    if (!categories?.length || !plats?.length) return { categories: CATEGORIES_DEMO, plats: PLATS_DEMO };
    return { categories: categories as Categorie[], plats: plats as Plat[] };
  } catch {
    return { categories: CATEGORIES_DEMO, plats: PLATS_DEMO };
  }
}

export default async function Accueil() {
  const { categories, plats } = await getDonnees();

  const parCategorie = (id: string) => plats.filter((p) => p.categorie_id === id);
  const imageCategorie = (id: string) => parCategorie(id).find((p) => p.image_url)?.image_url ?? null;

  const sauces: FamilleSauce[] = categories
    .filter((c) => /sauce/i.test(c.nom))
    .map((c) => {
      const liste = parCategorie(c.id);
      return {
        slug: c.slug,
        nom: c.nom.replace(/^Sauces?\s+/i, 'Sauce ').replace(/^Sauce arachide$/i, 'Sauce d’arachide'),
        nbGarnitures: liste.length,
        prixMin: liste.length ? Math.min(...liste.map((p) => p.prix)) : 0,
        image: imageCategorie(c.id),
        premierPlat: liste[0]?.slug ?? null,
      };
    })
    .filter((s) => s.nbGarnitures > 0);

  const catMichoui = categories.find((c) => /michoui/i.test(c.nom));
  const michouis = catMichoui ? parCategorie(catMichoui.id) : [];

  const vedettes = plats.filter((p) => p.est_vedette).slice(0, 6);
  const populaires = vedettes.length >= 3 ? vedettes : plats.slice(0, 6);

  return (
    <>
      <Hero image={sauces[0]?.image ?? imageCategorie(categories[0]?.id ?? '')} prixDes={sauces[0]?.prixMin} nomPlat={sauces[0]?.nom} />
      <CategoriesAccueil
        categories={categories.map((c) => ({ id: c.id, nom: c.nom, slug: c.slug, image: imageCategorie(c.id), nb: parCategorie(c.id).length })).filter((c) => c.nb > 0)}
      />
      {sauces.length > 0 && <SaucesMaison sauces={sauces} />}
      {michouis.length > 0 && <Michoui plats={michouis} slugCategorie={catMichoui!.slug} />}
      <PlatsPopulaires plats={populaires} />
      <CommentCaMarche />
      <FooterSite />
    </>
  );
}
