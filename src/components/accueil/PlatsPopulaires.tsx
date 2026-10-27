import Link from 'next/link';
import type { Plat } from '@/types';
import { CartePlat } from '@/components/menu/CartePlat';

interface PlatsPopulairesProps {
  plats: Plat[];
}

export function PlatsPopulaires({ plats }: PlatsPopulairesProps) {
  return (
    <section className="py-20 lg:py-28 bg-mosaique-ivoire" aria-labelledby="titre-populaires">
      <div className="container-site">
        {/* En-tête section */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-mosaique-ocre">
              Les incontournables
            </span>
            <h2
              id="titre-populaires"
              className="font-display text-3xl lg:text-4xl font-bold text-mosaique-terre mt-2"
            >
              Ce que nos clients commandent
              <br className="hidden lg:block" /> en premier.
            </h2>
          </div>
          <Link href="/menu" className="btn-secondary flex-shrink-0">
            Tout le menu
          </Link>
        </div>

        {/* Grille — max 6 plats, pas une liste infinie */}
        {plats.length === 0 ? (
          <p className="text-mosaique-gris text-center py-12">
            Le menu arrive bientôt…
          </p>
        ) : (
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {plats.slice(0, 6).map((plat) => (
              <li key={plat.id}>
                <CartePlat plat={plat} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
