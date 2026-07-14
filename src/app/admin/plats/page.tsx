import { createClient } from '@/lib/supabase/server';
import { PlatsAdminClient } from '@/components/admin/PlatsAdminClient';
import type { Metadata } from 'next';
import type { Plat, Categorie } from '@/types';

export const metadata: Metadata = { title: 'Gestion des plats' };
export const revalidate = 0;

export default async function AdminPlats() {
  const supabase = createClient();

  const [{ data: plats }, { data: categories }] = await Promise.all([
    supabase
      .from('plats')
      .select('*, categorie:categories(*)')
      .order('ordre', { ascending: true }),
    supabase
      .from('categories')
      .select('*')
      .order('ordre', { ascending: true }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">Gestion des plats</h1>
      <PlatsAdminClient
        plats={(plats ?? []) as Plat[]}
        categories={(categories ?? []) as Categorie[]}
      />
    </div>
  );
}
