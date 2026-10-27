import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Mosaïque',
    default: 'Connexion',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mosaique-creme flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="font-display text-3xl font-bold text-mosaique-terre">
            Mosaïque
          </a>
          <p className="text-mosaique-gris text-sm mt-1">Une cuisine livrée chez vous</p>
        </div>
        {children}
      </div>
    </div>
  );
}
