import { createClient } from '@/lib/supabase/server';
import { CommandesAdminClient } from '@/components/admin/CommandesAdminClient';
import type { Metadata } from 'next';
import type { Commande } from '@/types';

export const metadata: Metadata = { title: 'Commandes' };
export const revalidate = 0; // Toujours frais pour l'admin

export default async function AdminCommandes() {
  const supabase = createClient();

  const { data: commandes } = await supabase
    .from('commandes')
    .select('*, profiles(nom, telephone), lignes_commande(*)')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">Gestion des commandes</h1>
      <CommandesAdminClient commandes={(commandes ?? []) as Commande[]} />
    </div>
  );
}
