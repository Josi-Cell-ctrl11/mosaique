'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingBag, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const LIENS = [
  { href: '/compte/commandes', label: 'Mes commandes', icon: ShoppingBag },
  { href: '/compte/profil', label: 'Mon profil', icon: User },
];

export function CompteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function seDeconnecter() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="bg-white rounded-card shadow-card p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-mosaique-gris px-3 mb-3">
        Mon espace
      </p>
      <ul className="space-y-1">
        {LIENS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'bg-mosaique-creme text-mosaique-ocre'
                  : 'text-mosaique-nuit hover:bg-mosaique-creme hover:text-mosaique-ocre'
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={seDeconnecter}
            className="flex items-center gap-3 px-3 py-2.5 rounded-btn text-sm font-medium text-mosaique-gris hover:text-mosaique-epice hover:bg-mosaique-creme transition-colors w-full"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </li>
      </ul>
    </nav>
  );
}
