import Link from 'next/link';

export default function PageNotFound() {
  return (
    <div className="min-h-screen bg-mosaique-ivoire flex items-center justify-center">
      <div className="text-center px-4">
        <p className="font-display text-8xl font-bold text-mosaique-creme">404</p>
        <h1 className="font-display text-2xl font-bold text-mosaique-terre mt-4 mb-2">
          Cette page n&apos;existe pas
        </h1>
        <p className="text-mosaique-gris mb-8">
          Mais le menu, lui, est bien là.
        </p>
        <Link href="/" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
