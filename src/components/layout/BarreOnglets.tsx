'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, ShoppingBag, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePanier } from '@/store/panier';

const MASQUEE_SUR = ['/admin', '/checkout', '/connexion', '/inscription', '/mot-de-passe-oublie', '/reinitialiser-mot-de-passe'];

/** Barre d'onglets fixe en bas de l'écran, sur mobile uniquement. */
export function BarreOnglets() {
  const pathname = usePathname();
  const { totalArticles, ouvrirPanier } = usePanier();
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  const nb = monte ? totalArticles() : 0;

  // La fiche plat a sa propre barre d'ajout en bas
  const surFichePlat = /^\/menu\/[^/]+$/.test(pathname);
  if (MASQUEE_SUR.some((p) => pathname.startsWith(p)) || surFichePlat) return null;

  const onglet = (actif: boolean) =>
    cn(
      'flex flex-col items-center justify-center gap-1 min-h-[56px] text-[11px] font-bold transition-colors',
      actif ? 'text-mosaique-ocre' : 'text-mosaique-gris'
    );

  return (
    <>
      <div className="h-[76px] md:hidden" aria-hidden="true" />
      <nav aria-label="Navigation mobile" className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-mosaique-creme grid grid-cols-4 px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-1">
        <Link href="/" className={onglet(pathname === '/')} aria-current={pathname === '/' ? 'page' : undefined}>
          <Home size={22} strokeWidth={pathname === '/' ? 2.2 : 1.8} aria-hidden="true" />Accueil
        </Link>
        <Link href="/menu" className={onglet(pathname.startsWith('/menu'))} aria-current={pathname.startsWith('/menu') ? 'page' : undefined}>
          <UtensilsCrossed size={22} strokeWidth={1.8} aria-hidden="true" />Menu
        </Link>
        <button onClick={ouvrirPanier} className={cn(onglet(false), 'relative')} aria-label={`Panier, ${nb} article${nb > 1 ? 's' : ''}`}>
          <span className="relative">
            <ShoppingBag size={22} strokeWidth={1.8} aria-hidden="true" />
            {nb > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-mosaique-nuit text-mosaique-or text-[10px] font-extrabold flex items-center justify-center">{nb}</span>
            )}
          </span>
          Panier
        </button>
        <Link href="/compte" className={onglet(pathname.startsWith('/compte'))} aria-current={pathname.startsWith('/compte') ? 'page' : undefined}>
          <User size={22} strokeWidth={1.8} aria-hidden="true" />Compte
        </Link>
      </nav>
    </>
  );
}
