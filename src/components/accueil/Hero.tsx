import Link from 'next/link';
import Image from 'next/image';
import type { Plat } from '@/types';

// Image hero : plat chaud, lumière naturelle rasante, couleurs franches
// Remplacer par la vraie photo du plat phare via l'admin
const HERO_IMAGE_FALLBACK =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=85';

interface HeroProps {
  platVedette?: Plat | null;
}

export function Hero({ platVedette }: HeroProps) {
  const imageHero = platVedette?.image_url ?? HERO_IMAGE_FALLBACK;

  return (
    <section
      className="relative min-h-screen flex items-end overflow-hidden"
      aria-label="Bienvenue chez Mosaïque"
    >
      {/* Photo pleine largeur — pas d'overlay sombre générique */}
      <Image
        src={imageHero}
        alt={platVedette ? `${platVedette.nom} — le plat du moment chez Mosaïque` : 'Un plat Mosaïque'}
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Dégradé naturel bas → haut, chaud, depuis le bas seulement */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(28,20,16,0.85) 0%, rgba(28,20,16,0.4) 40%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Contenu ancré en bas à gauche — pas centré */}
      <div className="relative container-site pb-16 lg:pb-24 pt-32 w-full">
        <div className="max-w-2xl">
          {/* Étiquette */}
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-mosaique-creme/70 mb-4">
            Livraison à domicile
          </span>

          {/* Titre — la ligne d'identité de Mosaïque */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Une cuisine qu&apos;on reconnaît
            <br />
            <em className="not-italic text-mosaique-ocre">au premier coup de fourchette.</em>
          </h1>

          <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
            Des recettes ancrées dans les marchés et les saisons, cuisinées avec soin
            chaque jour, livrées directement chez vous.
          </p>

          {/* CTAs — pas un seul bouton fantôme */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/menu" className="btn-primary text-base px-8 py-4">
              Voir le menu
            </Link>
            <Link
              href="#histoire"
              className="inline-flex items-center justify-center gap-2 text-white/90 font-medium px-6 py-4 rounded-btn hover:text-white transition-colors"
            >
              Notre histoire →
            </Link>
          </div>

          {/* Fait concret — livraison, pas une rangée d'icônes */}
          <p className="mt-8 text-sm text-white/60">
            Livré en environ 45 min · Commande en ligne · Paiement sécurisé
          </p>
        </div>
      </div>
    </section>
  );
}
