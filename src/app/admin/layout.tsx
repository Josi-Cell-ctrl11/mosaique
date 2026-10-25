import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { template: '%s | Admin Mosaïque', default: 'Administration' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?redirect=/admin');

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) redirect('/');

  const [{ count: aTraiter }, { count: avisEnAttente }] = await Promise.all([
    supabase.from('commandes').select('id', { count: 'exact', head: true }).in('statut', ['payee', 'en_preparation', 'en_livraison']),
    supabase.from('avis').select('id', { count: 'exact', head: true }).eq('approuve', false),
  ]);

  return (
    <div className="min-h-screen bg-[#F5F1EA] flex flex-wrap">
      <AdminNav badges={{ commandes: aTraiter ?? 0, avis: avisEnAttente ?? 0 }} />
      <div className="flex-[999_1_560px] min-w-0 px-4 sm:px-8 py-6 lg:py-8">{children}</div>
    </div>
  );
}
