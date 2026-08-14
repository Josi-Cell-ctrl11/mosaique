import { createClient } from '@/lib/supabase/server';
import { CategoriesAdminClient } from '@/components/admin/CategoriesAdminClient';
import type { Categorie } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Catégories' };
export const revalidate = 0;

export default async function AdminCategories() {
  const supabase = createClient();
  const { data } = await supabase.from('categories').select('*').order('ordre', { ascending: true });
  return <div><h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">Gestion des catégories</h1><CategoriesAdminClient categories={(data ?? []) as Categorie[]} /></div>;
}
