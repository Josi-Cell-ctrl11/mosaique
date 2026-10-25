import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CompteNav } from '@/components/compte/CompteNav';

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/connexion?redirect=/compte');

  const { data: profil } = await supabase.from('profiles').select('nom, email').eq('id', user.id).maybeSingle();
  const nom = profil?.nom || user.email?.split('@')[0] || 'Mon compte';

  return (
    <div className="pt-16 lg:pt-20 min-h-screen">
      <div className="bg-mosaique-nuit">
        <div className="container-site max-w-3xl pt-6 lg:pt-10 flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <span className="w-[52px] h-[52px] rounded-2xl bg-mosaique-or text-mosaique-nuit font-display text-[22px] font-bold flex items-center justify-center" aria-hidden="true">
              {nom.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-[13px] text-[#A89C8B] truncate">{profil?.email ?? user.email}</p>
              <p className="font-display text-2xl font-semibold text-mosaique-ivoire truncate">{nom}</p>
            </div>
          </div>
          <CompteNav />
        </div>
      </div>
      <div className="container-site max-w-3xl py-6">{children}</div>
    </div>
  );
}
