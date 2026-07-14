import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';
import type { Profile, ConfigLivraison } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Valider la commande' };

export default async function PageCheckout() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?redirect=/checkout');

  const [{ data: profile }, { data: config }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('config_livraison')
      .select('*, zones:zones_livraison(*)')
      .eq('actif', true)
      .single(),
  ]);

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-mosaique-ivoire">
      <CheckoutClient
        profile={profile as Profile}
        configLivraison={config as ConfigLivraison}
      />
    </div>
  );
}
