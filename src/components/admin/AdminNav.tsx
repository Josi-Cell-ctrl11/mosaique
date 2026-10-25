'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, CreditCard, Truck, Tags, SlidersHorizontal, MessageSquare, Users, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/Logo';

const LIENS = [
  { href: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { href: '/admin/commandes', label: 'Commandes', icon: ShoppingBag, badge: 'commandes' as const },
  { href: '/admin/plats', label: 'Plats', icon: UtensilsCrossed },
  { href: '/admin/categories', label: 'Catégories', icon: Tags },
  { href: '/admin/options', label: 'Options', icon: SlidersHorizontal },
  { href: '/admin/livraison', label: 'Livraison', icon: Truck },
  { href: '/admin/avis', label: 'Avis', icon: MessageSquare, badge: 'avis' as const },
  { href: '/admin/paiements', label: 'Paiements', icon: CreditCard },
  { href: '/admin/profils', label: 'Profils', icon: Users },
];

/** Barre latérale noire du back-office ; elle passe au-dessus du contenu sur mobile. */
export function AdminNav({ badges }: { badges: { commandes: number; avis: number } }) {
  const pathname = usePathname();

  return (
    <aside className="flex-[1_1_248px] max-w-full lg:max-w-[248px] bg-mosaique-nuit px-3.5 py-4 lg:py-6 flex flex-col gap-1">
      <div className="flex items-center justify-between gap-3 px-2.5 pb-3 lg:pb-6">
        <Link href="/admin" className="flex flex-col">
          <Logo taille="sm" />
          <span className="text-xs text-[#A89C8B] pl-[30px] -mt-0.5">Back-office</span>
        </Link>
        <Link href="/" className="lg:hidden text-sm font-bold text-[#C9BFAF] min-h-[44px] flex items-center">Voir le site ↗</Link>
      </div>
      <nav aria-label="Administration" className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-none -mx-3.5 px-3.5 lg:mx-0 lg:px-0">
        {LIENS.map(({ href, label, icon: Icon, exact, badge }) => {
          const actif = exact ? pathname === href : pathname.startsWith(href);
          const n = badge ? badges[badge] : 0;
          return (
            <Link
              key={href}
              href={href}
              aria-current={actif ? 'page' : undefined}
              className={cn(
                'shrink-0 min-h-[44px] px-3 rounded-[10px] flex items-center gap-2.5 text-sm font-bold whitespace-nowrap transition-colors',
                actif ? 'bg-[#2A231C] text-mosaique-or' : 'text-[#C9BFAF] hover:text-mosaique-ivoire hover:bg-mosaique-brun'
              )}
            >
              <Icon size={17} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              {n > 0 && (
                <span className="min-w-[22px] h-[22px] px-1.5 rounded-full bg-mosaique-or text-mosaique-nuit text-xs font-extrabold flex items-center justify-center" aria-label={`${n} à traiter`}>{n}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <Link href="/" className="hidden lg:flex mt-6 min-h-[44px] px-3 rounded-[10px] border border-mosaique-trait text-[#C9BFAF] text-sm font-bold items-center gap-2 hover:text-mosaique-ivoire">
        Voir le site <ExternalLink size={14} aria-hidden="true" />
      </Link>
    </aside>
  );
}
