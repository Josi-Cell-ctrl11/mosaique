import { createClient } from '@/lib/supabase/server';
import { ProfilsAdminClient } from '@/components/admin/ProfilsAdminClient';
import type { Profile } from '@/types';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Profils et droits' };
export const revalidate = 0;

export default async function AdminProfils() {
  const supabase = createClient();
  const [{ data: user }, { data: profils }] = await Promise.all([
    supabase.auth.getUser(),
    supabase.from('profiles').select('*').order('created_at', { ascending: false }),
  ]);
  return <div><h1 className="font-display text-2xl font-bold text-mosaique-terre mb-2">Profils et droits</h1><p className="text-sm text-mosaique-gris mb-6">Gère les informations de contact et les droits admin. Les mots de passe restent gérés exclusivement par Supabase Auth.</p><ProfilsAdminClient profils={(profils ?? []) as Profile[]} currentUserId={user.user?.id ?? ''} /></div>;
}
