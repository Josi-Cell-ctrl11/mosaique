import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const metadata: Metadata = {
  title: { template: '%s | Le Mosaïque', default: 'Connexion' },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-mosaique-nuit pt-16 lg:pt-20 flex flex-col lg:flex-row">
      <div className="px-7 pt-10 pb-9 lg:flex-1 lg:flex lg:flex-col lg:justify-center lg:px-16 flex flex-col items-center lg:items-start gap-3.5 text-center lg:text-left">
        <Link href="/" aria-label="Le Mosaïque, accueil"><Logo taille="lg" /></Link>
        <p className="font-display italic text-[15px] lg:text-xl text-[#C9BFAF] max-w-sm">L’élégance du goût et un voyage culinaire pour tous</p>
      </div>
      <div className="flex-1 bg-mosaique-ivoire rounded-t-[28px] lg:rounded-none px-6 pt-8 pb-10 lg:flex lg:items-center lg:justify-center">
        <div className="w-full max-w-md mx-auto">{children}</div>
      </div>
    </div>
  );
}
