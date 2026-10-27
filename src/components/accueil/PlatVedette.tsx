import Link from 'next/link';
import Image from 'next/image';
import type { Plat } from '@/types';
import { formatPrix, imagePlaceholder } from '@/lib/utils';

interface PlatVedetteProps {
  plat?: Plat | null;
}

// Plat par défaut si rien en base
const PLAT_DEFAUT: Partial<Plat> = {
  nom: 'Poulet yassa',
  slug: 'poulet-yassa',
  description:
    'Notre signature — poulet fermier mariné toute une nuit dans le citron et les oignons caramélisés. Servi avec du riz basmati parfumé.',
  prix: 5500,
};

export function PlatVedette({ plat }: PlatVedetteProps) {
  const p = plat ?? PLAT_DEFAUT;
  const image = (plat?.image_url) || imagePlaceholder(p.nom ?? '');

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container-site">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Photo */}
          <div className="relative aspect-[4/3] rounded-card overflow-hidden shadow-card-hover">
            <Image
              src={image}
              alt={p.nom ?? 'Plat mis en avant'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Texte */}
          <div className="flex flex-col gap-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-mosaique-ocre">
              Le plat du moment
            </span>

            <h2 className="font-display text-4xl lg:text-5xl font-bold text-mosaique-terre leading-tight">
              {p.nom}
            </h2>

            <p className="text-mosaique-gris text-lg leading-relaxed">
              {p.description}
            </p>

            {/* Prix bien visible, positionné près du CTA */}
            <div className="flex items-center gap-6 pt-2">
              <span className="prix text-prix-lg">{formatPrix(p.prix ?? 0)}</span>
              {p.slug && (
                <Link
                  href={`/menu/${p.slug}`}
                  className="btn-primary"
                >
                  Commander ce plat
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
