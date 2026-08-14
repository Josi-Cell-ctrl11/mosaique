import { createClient } from '@/lib/supabase/server';
import { OptionsAdminClient } from '@/components/admin/OptionsAdminClient';
import type { OptionPlat, Plat } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Options de plats' };
export const revalidate = 0;

type OptionAvecNom = OptionPlat & { platNom?: string };

export default async function AdminOptions() {
  const supabase = createClient();
  const [{ data: options }, { data: plats }] = await Promise.all([
    supabase.from('options_plat').select('*, valeurs:valeurs_option(*)').order('created_at', { ascending: true }),
    supabase.from('plats').select('id, nom').order('nom', { ascending: true }),
  ]);
  const platsList = (plats ?? []) as Pick<Plat, 'id' | 'nom'>[];
  const noms = new Map(platsList.map((plat) => [plat.id, plat.nom]));
  const optionsList = ((options ?? []) as OptionPlat[]).map((option) => ({ ...option, platNom: noms.get(option.plat_id), valeurs: option.valeurs ?? [] })) as OptionAvecNom[];
  return <div><h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">Options et suppléments</h1><OptionsAdminClient options={optionsList} plats={platsList} /></div>;
}
