'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, User, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePanier } from '@/store/panier';
import { createClient } from '@/lib/supabase/client';
import { Logo } from '@/components/ui/Logo';

const LIENS = [
  { href: '/menu', label: 'Menu' },
  { href: '/menu?categorie=sauces-gombo', label: 'Sauces maison' },
  { href: '/menu?categorie=michoui-mouton', label: 'Michoui' },
  { href: '/#contact', label: 'Contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const { totalArticles, ouvrirPanier } = usePanier();
  const [monte, setMonte] = useState(false);
  const nbArticles = monte ? totalArticles() : 0;
  const [connecte, setConnecte] = useState(false);
  const [estAdmin, setEstAdmin] = useState(false);

  useEffect(() => {
    setMonte(true);
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return; // mode démo sans Supabase
    const supabase = createClient();
    function synchroniser(user: { id: string } | null) {
      setConnecte(Boolean(user));
      if (!user) return setEstAdmin(false);
      // Appel différé hors du callback auth pour ne pas bloquer Supabase Auth
      setTimeout(() => {
        supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
          .then(({ data }) => setEstAdmin(Boolean(data?.is_admin)));
      }, 0);
    }
    supabase.auth.getUser().then(({ data }) => synchroniser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => synchroniser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-mosaique-nuit/95 backdrop-blur-md border-b border-mosaique-brun">
      <nav className="container-site flex items-center justify-between gap-4 h-16 lg:h-20" aria-label="Navigation principale">
        <Link href="/" aria-label="Le Mosaïque, accueil">
          <Logo />
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {LIENS.map((lien) => (
            <li key={lien.href}>
              <Link
                href={lien.href}
                className={cn(
                  'px-3.5 py-2.5 rounded-btn text-[15px] font-bold transition-colors',
                  pathname === lien.href ? 'text-mosaique-or' : 'text-[#F3EBDD] hover:text-mosaique-or'
                )}
              >
                {lien.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          {estAdmin && (
            <Link href="/admin" className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2.5 rounded-btn text-sm font-bold text-mosaique-or hover:bg-mosaique-brun">
              <ShieldCheck size={16} aria-hidden="true" /> Admin
            </Link>
          )}
          <Link
            href={connecte ? '/compte' : '/connexion'}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2.5 rounded-btn text-[15px] font-bold text-[#F3EBDD] hover:text-mosaique-or"
          >
            <User size={17} aria-hidden="true" />
            {connecte ? 'Mon compte' : 'Se connecter'}
          </Link>
          <button
            onClick={ouvrirPanier}
            aria-label={`Panier, ${nbArticles} article${nbArticles > 1 ? 's' : ''}`}
            className="relative inline-flex items-center gap-2 min-h-[44px] px-3 md:px-4 rounded-btn md:bg-mosaique-or text-[#F3EBDD] md:text-mosaique-nuit font-extrabold text-[15px] transition hover:brightness-105"
          >
            <ShoppingBag size={20} aria-hidden="true" />
            <span className="hidden md:inline">Panier</span>
            {nbArticles > 0 && (
              <span className="absolute md:static -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-mosaique-or md:bg-mosaique-nuit text-mosaique-nuit md:text-mosaique-or text-[11px] font-extrabold flex items-center justify-center">
                {nbArticles > 99 ? '99+' : nbArticles}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
