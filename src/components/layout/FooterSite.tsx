import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export function FooterSite() {
  return (
    <footer id="contact" className="bg-mosaique-nuit text-[#C9BFAF]">
      <div className="container-site py-10 lg:py-14 flex flex-wrap gap-8 lg:gap-12 justify-between">
        <div className="flex flex-col gap-3 max-w-sm">
          <Logo />
          <p className="font-display italic text-[15px] lg:text-[17px]">L’élégance du goût et un voyage culinaire pour tous.</p>
        </div>
        <div className="flex flex-col gap-1.5 text-[15px]">
          <span className="font-extrabold text-mosaique-ivoire">Nous trouver</span>
          <span>Abomey-Calavi, Bénin</span>
          <span>Livraison possible</span>
          {process.env.NEXT_PUBLIC_WHATSAPP && (
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP.replace(/\D/g, '')}`} className="text-mosaique-or hover:underline">
              WhatsApp : {process.env.NEXT_PUBLIC_WHATSAPP}
            </a>
          )}
        </div>
        <div className="flex flex-col gap-1.5 text-[15px]">
          <span className="font-extrabold text-mosaique-ivoire">Liens</span>
          <Link href="/menu" className="hover:text-mosaique-or">Menu</Link>
          <Link href="/compte/commandes" className="hover:text-mosaique-or">Mes commandes</Link>
          <Link href="/compte" className="hover:text-mosaique-or">Mon compte</Link>
        </div>
      </div>
      <div className="container-site pb-6 text-xs text-[#8C8073]">© {new Date().getFullYear()} Le Mosaïque</div>
    </footer>
  );
}
