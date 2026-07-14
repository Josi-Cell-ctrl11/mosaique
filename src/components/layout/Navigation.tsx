'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePanier } from '@/store/panier';
import { createClient } from '@/lib/supabase/client';

export function Navigation() {
  const pathname = usePathname();
  const { totalArticles, ouvrirPanier } = usePanier();
  const nbArticles = totalArticles();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [utilisateur, setUtilisateur] = useState<{ id: string; email: string } | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUtilisateur(data.user ? { id: data.user.id, email: data.user.email! } : null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUtilisateur(session?.user ? { id: session.user.id, email: session.user.email! } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fermer le menu mobile à la navigation
  useEffect(() => setMenuOuvert(false), [pathname]);

  const isAccueil = pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-200',
        scrolled || !isAccueil
          ? 'bg-mosaique-ivoire/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <nav className="container-site flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="https://kaddzeimzjrieiysrrhp.supabase.co/storage/v1/object/public/photos/Le%20Logo.jpeg"
            alt="Mosaïque"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span
            className={cn(
              'font-display font-bold text-xl lg:text-2xl tracking-tight transition-colors',
              scrolled || !isAccueil ? 'text-mosaique-terre' : 'text-white'
            )}
          >
            Mosaïque
          </span>
        </Link>

        {/* Liens desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {[
            { href: '/menu', label: 'Le menu' },
            { href: '/#histoire', label: 'Notre histoire' },
          ].map((lien) => (
            <li key={lien.href}>
              <Link
                href={lien.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-mosaique-ocre',
                  scrolled || !isAccueil ? 'text-mosaique-nuit' : 'text-white/90',
                  pathname === lien.href && 'text-mosaique-ocre'
                )}
              >
                {lien.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions droite */}
        <div className="flex items-center gap-2">
          {/* Compte */}
          {utilisateur ? (
            <Link
              href="/compte"
              className={cn(
                'hidden md:flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-btn transition-colors',
                scrolled || !isAccueil
                  ? 'text-mosaique-nuit hover:text-mosaique-ocre hover:bg-mosaique-creme'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              <User size={16} />
              Mon compte
            </Link>
          ) : (
            <Link
              href="/connexion"
              className={cn(
                'hidden md:flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-btn transition-colors',
                scrolled || !isAccueil
                  ? 'text-mosaique-nuit hover:text-mosaique-ocre hover:bg-mosaique-creme'
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              )}
            >
              Se connecter
            </Link>
          )}

          {/* Panier */}
          <button
            onClick={ouvrirPanier}
            aria-label={`Panier — ${nbArticles} article${nbArticles > 1 ? 's' : ''}`}
            className={cn(
              'relative flex items-center justify-center w-11 h-11 rounded-btn transition-colors',
              scrolled || !isAccueil
                ? 'text-mosaique-nuit hover:bg-mosaique-creme hover:text-mosaique-ocre'
                : 'text-white hover:bg-white/10'
            )}
          >
            <ShoppingBag size={22} />
            {nbArticles > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 bg-mosaique-ocre text-white text-[10px] font-bold rounded-full">
                {nbArticles > 99 ? '99+' : nbArticles}
              </span>
            )}
          </button>

          {/* Burger mobile */}
          <button
            onClick={() => setMenuOuvert(!menuOuvert)}
            aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
            className={cn(
              'flex md:hidden items-center justify-center w-11 h-11 rounded-btn transition-colors',
              scrolled || !isAccueil
                ? 'text-mosaique-nuit hover:bg-mosaique-creme'
                : 'text-white hover:bg-white/10'
            )}
          >
            {menuOuvert ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      {menuOuvert && (
        <div className="md:hidden bg-mosaique-ivoire border-t border-mosaique-creme animer-glisser-bas">
          <ul className="container-site py-4 flex flex-col gap-1">
            {[
              { href: '/menu', label: 'Le menu' },
              { href: '/#histoire', label: 'Notre histoire' },
              utilisateur
                ? { href: '/compte', label: 'Mon compte' }
                : { href: '/connexion', label: 'Se connecter' },
              ...(!utilisateur ? [{ href: '/inscription', label: "S'inscrire" }] : []),
            ].map((lien) => (
              <li key={lien.href}>
                <Link
                  href={lien.href}
                  className="flex items-center px-3 py-3 text-base font-medium text-mosaique-nuit rounded-btn hover:bg-mosaique-creme hover:text-mosaique-ocre transition-colors"
                >
                  {lien.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
