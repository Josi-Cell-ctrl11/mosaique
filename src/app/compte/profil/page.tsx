import { createClient } from '@/lib/supabase/server';
import { ProfilClient } from '@/components/compte/ProfilClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mon profil' };

export default async function PageProfil() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single();

  return <ProfilClient profile={profile} />;
}
