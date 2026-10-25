import Link from 'next/link';
import { ImagePlat } from '@/components/ui/ImagePlat';

interface Props {
  categories: Array<{ id: string; nom: string; slug: string; image: string | null; nb: number }>;
}

export function CategoriesAccueil({ categories }: Props) {
  return (
    <section className="container-site pt-10 lg:pt-16" aria-labelledby="titre-categories">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2 id="titre-categories" className="font-display text-2xl lg:text-4xl font-semibold">Envie de quoi ?</h2>
        <Link href="/menu" className="text-sm lg:text-base font-extrabold text-mosaique-ocre hover:text-mosaique-ocre-fonce">
          Tout le menu →
        </Link>
      </div>
      <ul className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-7 gap-x-3 gap-y-5">
        {categories.map((c) => (
          <li key={c.id}>
            <Link href={`/menu?categorie=${c.slug}`} className="group flex flex-col items-center gap-2 text-center">
              <ImagePlat src={c.image} alt="" libelle={c.nom.charAt(0)} sizes="96px" className="w-[72px] h-[72px] lg:w-24 lg:h-24 rounded-[18px] lg:rounded-[22px] transition-transform group-hover:scale-[1.04]" />
              <span className="text-xs lg:text-sm font-bold leading-tight">{c.nom}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
