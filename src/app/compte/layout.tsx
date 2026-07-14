import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CompteNav } from '@/components/compte/CompteNav';

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/connexion?redirect=/compte');

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-mosaique-ivoire">
      <div className="container-site py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <CompteNav />
          </aside>
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
