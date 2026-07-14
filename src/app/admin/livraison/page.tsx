import { createClient } from '@/lib/supabase/server';
import { LivraisonAdminClient } from '@/components/admin/LivraisonAdminClient';
import type { Metadata } from 'next';
import type { ConfigLivraison } from '@/types';

export const metadata: Metadata = { title: 'Configuration livraison' };
export const revalidate = 0;

export default async function AdminLivraison() {
  const supabase = createClient();

  const { data: config } = await supabase
    .from('config_livraison')
    .select('*, zones:zones_livraison(*)')
    .eq('actif', true)
    .single();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">
        Configuration de la livraison
      </h1>
      <LivraisonAdminClient config={config as ConfigLivraison} />
    </div>
  );
}
