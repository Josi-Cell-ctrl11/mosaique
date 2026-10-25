import type { Metadata, Viewport } from 'next';
// Polices auto-hébergées (aucun appel à Google Fonts au chargement ni au build)
import '@fontsource-variable/manrope';
import '@fontsource-variable/playfair-display';
import '@fontsource-variable/playfair-display/wght-italic.css';
import './globals.css';
import { Toaster } from 'sonner';
import { Navigation } from '@/components/layout/Navigation';
import { BarreOnglets } from '@/components/layout/BarreOnglets';
import { Panier } from '@/components/panier/Panier';

export const metadata: Metadata = {
  title: {
    default: 'Le Mosaïque — L’élégance du goût, livrée chez vous',
    template: '%s | Le Mosaïque',
  },
  description:
    'Sauces maison, michoui de mouton, kébabs, chawarmas et sandwichs à Abomey-Calavi. Commandez en ligne, payez par Mobile Money.',
  keywords: ['restaurant', 'livraison', 'Abomey-Calavi', 'Bénin', 'sauce gombo', 'michoui', 'Mosaïque'],
  openGraph: {
    title: 'Le Mosaïque — L’élégance du goût, livrée chez vous',
    description: 'Sauces maison, michoui, kébabs et sandwichs livrés à Abomey-Calavi.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export const viewport: Viewport = {
  themeColor: '#14110E',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] btn-or">
          Aller au contenu
        </a>
        <Navigation />
        <main id="contenu" className="min-h-screen">{children}</main>
        <BarreOnglets />
        <Panier />
        <Toaster
          position="top-center"
          duration={2200}
          visibleToasts={2}
          toastOptions={{
            style: {
              background: '#14110E',
              border: '1px solid #3A3128',
              color: '#FAF7F1',
              fontFamily: 'var(--font-body), system-ui, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 600,
              borderRadius: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  );
}
