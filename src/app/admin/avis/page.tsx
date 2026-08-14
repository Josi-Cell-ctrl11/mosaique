import { createClient } from '@/lib/supabase/server';
import { AvisAdminClient } from '@/components/admin/AvisAdminClient';
import type { Avis } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Avis clients' };
export const revalidate = 0;

type AvisAvecRelations = Avis & { plats?: { nom: string }; profiles?: { nom: string; email: string } };

export default async function AdminAvis() {
  const supabase = createClient();
  const { data } = await supabase.from('avis').select('*, plats(nom), profiles(nom, email)').order('created_at', { ascending: false });
  const avis = ((data ?? []) as AvisAvecRelations[]).map((item) => ({ ...item, platNom: item.plats?.nom, auteur: item.profiles?.nom, email: item.profiles?.email }));
  return <div><h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">Modération des avis</h1><AvisAdminClient avis={avis} /></div>;
}
