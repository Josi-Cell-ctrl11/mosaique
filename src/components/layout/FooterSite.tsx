import Link from 'next/link';

export function FooterSite() {
  return (
    <footer className="bg-mosaique-terre text-white/70 py-12">
      <div className="container-site">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          {/* Marque */}
          <div>
            <p className="font-display text-2xl font-bold text-white mb-3">Mosaïque</p>
            <p className="text-sm leading-relaxed">
              Une cuisine faite à la main, livrée avec soin. Chaque jour.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Navigation</p>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/menu', label: 'Le menu' },
                { href: '/#histoire', label: 'Notre histoire' },
                { href: '/compte', label: 'Mon compte' },
                { href: '/connexion', label: 'Se connecter' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Contact</p>
            <ul className="space-y-2 text-sm">
              <li>Du lundi au samedi, 10h–22h</li>
              <li>contact@mosaique.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Mosaïque. Tous droits réservés.</p>
          <p>Paiement sécurisé via FedaPay</p>
        </div>
      </div>
    </footer>
  );
}
