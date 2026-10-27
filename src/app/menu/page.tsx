import { MenuClient } from '@/components/menu/MenuClient';
import { CATEGORIES_DEMO, PLATS_DEMO } from '@/lib/demo-data';
import type { Plat, Categorie } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Le menu',
  description: 'Parcourez tous les plats Mosaïque — entrées, plats principaux, grillades, desserts et boissons.',
};

async function getMenuData() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url === 'your_supabase_project_url') {
    return { categories: CATEGORIES_DEMO, plats: PLATS_DEMO };
  }

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();

    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));

    const fetchData = Promise.all([
      supabase.from('categories').select('*').order('ordre', { ascending: true }),
      supabase
        .from('plats')
        .select('*, categorie:categories(*)')
        .eq('disponible', true)
        .order('ordre', { ascending: true }),
    ]);

    const result = await Promise.race([fetchData, timeout]);

    if (!result) {
      return { categories: CATEGORIES_DEMO, plats: PLATS_DEMO };
    }

    const [{ data: categories }, { data: plats }] = result;

    return {
      categories: (categories ?? []).length > 0 ? (categories as Categorie[]) : CATEGORIES_DEMO,
      plats: (plats ?? []).length > 0 ? (plats as Plat[]) : PLATS_DEMO,
    };
  } catch {
    return { categories: CATEGORIES_DEMO, plats: PLATS_DEMO };
  }
}

export default async function PageMenu() {
  const { categories, plats } = await getMenuData();

  return (
    <div className="pt-20 lg:pt-24 min-h-screen">
      <MenuClient categories={categories} plats={plats} />
    </div>
  );
}
