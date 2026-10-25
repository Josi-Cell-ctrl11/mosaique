import Image from 'next/image';
import { cn } from '@/lib/utils';
import { imageDuPlat } from '@/lib/images';

interface Props {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Texte affiché sur le motif quand il n'y a pas de photo */
  libelle?: string;
}

/** Photo de plat, ou motif mosaïque doré si aucune photo n'est disponible. */
export function ImagePlat({ src, alt, className, sizes = '(max-width: 768px) 100vw, 33vw', priority, libelle = 'Photo à venir' }: Props) {
  const url = imageDuPlat(src);
  return (
    <div className={cn('relative overflow-hidden', !url && 'motif-mosaique flex items-center justify-center', className)}>
      {url ? (
        <Image src={url} alt={alt} fill className="object-cover" sizes={sizes} priority={priority} />
      ) : (
        <span className="text-[10px] font-extrabold tracking-[0.12em] uppercase text-mosaique-or text-center px-2">{libelle}</span>
      )}
    </div>
  );
}
