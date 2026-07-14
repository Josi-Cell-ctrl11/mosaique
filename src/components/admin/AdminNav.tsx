'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, CreditCard, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const LIENS = [
  { href: '/admin',          label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/plats',    label: 'Plats',            icon: UtensilsCrossed },
  { href: '/admin/commandes',label: 'Commandes',        icon: ShoppingBag },
  { href: '/admin/paiements',label: 'Paiements',        icon: CreditCard },
  { href: '/admin/livraison',label: 'Livraison',        icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-mosaique-terre text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-8">
        <Link href="/admin" className="font-display font-bold text-xl text-white">
          Mosaïque <span className="text-mosaique-ocre text-sm font-normal">Admin</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {LIENS.map(({ href, label, icon: Icon, exact }) => {
            const actif = exact ? pathname === href : pathname.startsWith(href) && href !== '/admin';
            const actifExact = href === '/admin' && pathname === '/admin';
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-btn text-sm font-medium whitespace-nowrap transition-colors',
                  actif || actifExact
                    ? 'bg-mosaique-ocre text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link href="/" className="ml-auto text-xs text-white/50 hover:text-white transition-colors">
          ← Voir le site
        </Link>
      </div>
    </header>
  );
}
