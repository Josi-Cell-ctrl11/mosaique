'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const LIENS = [
  { href: '/compte/commandes', label: 'Commandes' },
  { href: '/compte/profil', label: 'Profil' },
];

export function CompteNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function seDeconnecter() {
    await createClient().auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <nav aria-label="Espace client" className="flex items-end gap-6">
      {LIENS.map(({ href, label }) => {
        const actif = pathname.startsWith(href) || (href === '/compte/commandes' && pathname === '/compte');
        return (
          <Link
            key={href}
            href={href}
            aria-current={actif ? 'page' : undefined}
            className={cn('pt-2.5 pb-3 border-b-[3px] text-[15px] transition-colors', actif ? 'border-mosaique-or text-mosaique-or font-extrabold' : 'border-transparent text-[#C9BFAF] font-bold hover:text-mosaique-ivoire')}
          >
            {label}
          </Link>
        );
      })}
      <button onClick={seDeconnecter} className="ml-auto pt-2.5 pb-3 text-sm font-bold text-[#C9BFAF] hover:text-mosaique-ivoire">
        Se déconnecter
      </button>
    </nav>
  );
}
