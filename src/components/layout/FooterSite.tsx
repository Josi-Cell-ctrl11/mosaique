import Link from 'next/link';

const LIENS = [
  { href: '/menu', label: 'Le menu' },
  { href: '/#histoire', label: 'Notre histoire' },
  { href: '/compte', label: 'Mon compte' },
  { href: '/connexion', label: 'Se connecter' },
];

export function FooterSite() {
  return (
    <footer className="bg-mosaique-terre text-white/70 py-8">
      <div className="container-site">
        {/* Une seule ligne : marque · navigation · contact */}
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-5 pb-6">
          <div>
            <p className="font-display text-2xl font-bold text-white">Mosaïque</p>
            <p className="text-xs mt-0.5">Une cuisine faite à la main, livrée avec soin.</p>
          </div>

          <nav aria-label="Pied de page">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              {LIENS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <li>Du lundi au samedi, 10h–22h</li>
            <li>contact@mosaique.com</li>
          </ul>
        </div>

        <div className="border-t border-white/10 pt-5 flex flex-wrap justify-between items-center gap-x-6 gap-y-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Mosaïque. Tous droits réservés.</p>
          <p>Paiement sécurisé via FedaPay</p>
        </div>
      </div>
    </footer>
  );
}
