import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Navigation } from '@/components/layout/Navigation';
import { Panier } from '@/components/panier/Panier';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mosaïque — Cuisine livrée chez vous',
    template: '%s | Mosaïque',
  },
  description:
    'Mosaïque vous livre une cuisine généreuse et soignée, directement à votre porte. Commandez en ligne, payez en toute sécurité.',
  keywords: ['restaurant', 'livraison', 'cuisine africaine', 'commande en ligne', 'Mosaïque'],
  openGraph: {
    title: 'Mosaïque — Cuisine livrée chez vous',
    description: 'Une cuisine généreuse et soignée, livrée à votre porte.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Panier />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FAF6EF',
              border: '1px solid #F0E8D8',
              color: '#1C1410',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
          }}
        />
      </body>
    </html>
  );
}
