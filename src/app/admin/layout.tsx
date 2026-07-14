import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Admin Mosaïque',
    default: 'Administration',
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/connexion?redirect=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/');

  return (
    <div className="min-h-screen bg-mosaique-nuit/5">
      <AdminNav />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
