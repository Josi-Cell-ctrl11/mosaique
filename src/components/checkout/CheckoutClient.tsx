'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { usePanier } from '@/store/panier';
import { cn, formatPrix, genererCreneauxLivraison } from '@/lib/utils';
import type { Profile, ConfigLivraison } from '@/types';

interface CheckoutClientProps {
  profile: Profile | null;
  configLivraison: ConfigLivraison | null;
}

const schema = z.object({
  telephone: z.string().trim().min(8, 'Numéro de téléphone invalide'),
  adresse: z.string().trim().min(3, 'Indiquez une adresse ou un point de repère'),
  ville: z.string().trim().min(2, 'Indiquez la ville'),
  zone_id: z.string().optional(),
  heure_livraison: z.string().optional(),
  notes: z.string().max(500).optional(),
});
type FormData = z.infer<typeof schema>;

export function CheckoutClient({ profile, configLivraison }: CheckoutClientProps) {
  const router = useRouter();
  const { articles, sousTotal, viderPanier } = usePanier();
  const [chargement, setChargement] = useState(false);
  const [programmer, setProgrammer] = useState(false);
  const creneaux = genererCreneauxLivraison(configLivraison?.delai_minutes ?? 45);
  const parZone = configLivraison?.type === 'par_zone' && (configLivraison.zones?.length ?? 0) > 0;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      adresse: profile?.adresse ?? '',
      ville: profile?.ville ?? 'Abomey-Calavi',
      telephone: profile?.telephone ?? '',
      zone_id: parZone ? configLivraison!.zones![0].id : undefined,
    },
  });

  const zoneId = watch('zone_id');
  const zone = configLivraison?.zones?.find((z) => z.id === zoneId);
  const frais = !configLivraison ? 0 : parZone ? zone?.frais ?? 0 : configLivraison.frais_fixe;
  const total = sousTotal() + frais;

  if (articles.length === 0) {
    return (
      <div className="container-site py-24 text-center">
        <p className="font-display text-2xl mb-4">Votre panier est vide</p>
        <button onClick={() => router.push('/menu')} className="btn-primary">Voir le menu</button>
      </div>
    );
  }

  if (!configLivraison) {
    return (
      <div className="container-site py-24 text-center max-w-md">
        <p className="font-display text-2xl mb-2">Livraison fermée pour le moment</p>
        <p className="text-mosaique-gris mb-6">Votre panier est conservé. Revenez un peu plus tard.</p>
        <Link href="/menu" className="btn-secondary">Retour au menu</Link>
      </div>
    );
  }

  async function payer(data: FormData) {
    setChargement(true);
    try {
      const res = await fetch('/api/commandes/creer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adresse_livraison: data.adresse,
          ville_livraison: data.ville,
          telephone_livraison: data.telephone,
          zone_livraison_id: parZone ? data.zone_id : null,
          heure_livraison: programmer && data.heure_livraison ? data.heure_livraison : null,
          notes: data.notes || null,
          // Seuls les identifiants et quantités sont envoyés : les prix sont recalculés par le serveur
          articles: articles.map((a) => ({ platId: a.platId, quantite: a.quantite, options: a.options ?? {} })),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? 'Erreur lors de la commande.');
        if (json.commande_id) router.push('/compte/commandes');
        return;
      }
      viderPanier();
      window.location.href = json.fedapay_url;
    } catch {
      toast.error('Erreur réseau. Réessayez.');
    } finally {
      setChargement(false);
    }
  }

  const Erreur = ({ msg }: { msg?: string }) => (msg ? <p className="text-mosaique-epice text-xs font-semibold mt-1">{msg}</p> : null);

  return (
    <div className="container-site max-w-5xl pt-5 pb-12 lg:py-10">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/menu" aria-label="Retour au menu" className="-ml-2.5 w-11 h-11 flex items-center justify-center rounded-xl hover:bg-mosaique-sable">
          <ChevronLeft size={22} aria-hidden="true" />
        </Link>
        <h1 className="font-display text-[1.6rem] lg:text-4xl font-semibold">Finaliser</h1>
      </div>

      <ol aria-label="Étapes" className="grid grid-cols-3 gap-1.5 mb-7 max-w-md">
        {['Panier', 'Livraison', 'Paiement'].map((e, i) => (
          <li key={e} aria-current={i === 1 ? 'step' : undefined} className="flex flex-col gap-1.5">
            <span className={cn('h-1 rounded-full', i <= 1 ? 'bg-mosaique-nuit' : 'bg-[#E2D8C6]')} />
            <span className={cn('text-xs font-extrabold', i > 1 && 'text-mosaique-gris font-bold')}>{e}</span>
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(payer)} noValidate className="grid lg:grid-cols-[1fr_380px] gap-7 lg:gap-10 items-start">
        <div className="flex flex-col gap-7">
          <section className="flex flex-col gap-3">
            <h2 className="font-body text-lg font-extrabold">Où livrer ?</h2>
            <div>
              <label htmlFor="telephone" className="label-field">Téléphone</label>
              <input id="telephone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+229 01 00 00 00 00" className="input-field" {...register('telephone')} />
              <p className="text-xs text-mosaique-gris mt-1">Le livreur vous appellera sur ce numéro.</p>
              <Erreur msg={errors.telephone?.message} />
            </div>
            <div>
              <label htmlFor="adresse" className="label-field">Adresse ou point de repère</label>
              <input id="adresse" type="text" autoComplete="street-address" placeholder="Ex. : derrière la pharmacie, portail bleu" className="input-field" {...register('adresse')} />
              <Erreur msg={errors.adresse?.message} />
            </div>
            <div>
              <label htmlFor="ville" className="label-field">Ville</label>
              <input id="ville" type="text" autoComplete="address-level2" className="input-field" {...register('ville')} />
              <Erreur msg={errors.ville?.message} />
            </div>
          </section>

          {parZone && (
            <fieldset className="flex flex-col gap-2.5">
              <legend className="font-extrabold text-lg mb-2.5">Zone de livraison</legend>
              {configLivraison.zones!.map((z) => {
                const actif = z.id === zoneId;
                return (
                  <label key={z.id} className={cn('min-h-[60px] flex items-center gap-3 px-3.5 rounded-[14px] bg-white cursor-pointer', actif ? 'border-2 border-mosaique-nuit' : 'border border-[#E2D8C6] m-px')}>
                    <input type="radio" value={z.id} {...register('zone_id')} className="w-5 h-5 accent-mosaique-nuit" />
                    <span className="flex-1 text-[15px] font-bold">{z.nom}</span>
                    <span className="text-sm font-extrabold text-mosaique-ocre">{formatPrix(z.frais)}</span>
                  </label>
                );
              })}
            </fieldset>
          )}

          <fieldset className="flex flex-col gap-2.5">
            <legend className="font-extrabold text-lg mb-2.5">Quand ?</legend>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Dès que possible', false],
                ['Programmer', true],
              ].map(([libelle, valeur]) => (
                <button
                  key={String(libelle)}
                  type="button"
                  aria-pressed={programmer === valeur}
                  onClick={() => { setProgrammer(Boolean(valeur)); if (!valeur) setValue('heure_livraison', undefined); }}
                  className={cn('min-h-[50px] rounded-[14px] font-bold text-sm border', programmer === valeur ? 'bg-mosaique-nuit text-mosaique-or border-mosaique-nuit' : 'bg-white border-[#E2D8C6]')}
                >
                  {libelle}
                </button>
              ))}
            </div>
            {programmer && (
              <div>
                <label htmlFor="heure_livraison" className="label-field">Heure souhaitée</label>
                <select id="heure_livraison" className="input-field" {...register('heure_livraison')}>
                  {creneaux.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
            )}
            <p className="text-xs text-mosaique-gris">Délai habituel : environ {configLivraison.delai_minutes} min.</p>
          </fieldset>

          <div>
            <label htmlFor="notes" className="label-field">Note pour le livreur ou la cuisine <span className="font-semibold text-mosaique-gris">(facultatif)</span></label>
            <textarea id="notes" rows={3} placeholder="Ex. : peu pimenté, appeler en arrivant…" className="input-field resize-none" {...register('notes')} />
          </div>

          <section className="flex flex-col gap-2.5">
            <h2 className="font-body text-lg font-extrabold">Paiement</h2>
            <div className="carte p-3.5 flex flex-col gap-2.5">
              <div className="flex flex-wrap gap-2">
                <span className="text-[13px] font-extrabold px-3 py-1.5 rounded-[10px] bg-[#FFF4C2] text-[#4A3B00]">MTN MoMo</span>
                <span className="text-[13px] font-extrabold px-3 py-1.5 rounded-[10px] bg-[#DCEBFF] text-[#0B3A75]">Moov Money</span>
                <span className="text-[13px] font-extrabold px-3 py-1.5 rounded-[10px] bg-mosaique-sable">Carte bancaire</span>
              </div>
              <p className="text-[13px] leading-relaxed text-mosaique-gris">Vous choisirez votre moyen de paiement sur la page sécurisée FedaPay. Aucun frais supplémentaire.</p>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 flex flex-col gap-4">
          <section className="bg-mosaique-nuit rounded-[20px] p-[18px] flex flex-col gap-2.5 text-mosaique-ivoire">
            <h2 className="font-display text-xl font-semibold mb-1">Récapitulatif</h2>
            {articles.map((a) => (
              <div key={`${a.platId}-${JSON.stringify(a.options ?? {})}`} className="flex justify-between gap-3 text-sm text-[#C9BFAF]">
                <span>{a.nom} × {a.quantite}</span>
                <span className="tabular-nums shrink-0">{formatPrix((a.prix + a.prixOptions) * a.quantite)}</span>
              </div>
            ))}
            <div className="flex justify-between gap-3 text-sm text-[#C9BFAF]">
              <span>Livraison{zone ? ` · ${zone.nom}` : ''}</span>
              <span className="tabular-nums shrink-0">{formatPrix(frais)}</span>
            </div>
            <div className="h-px bg-mosaique-trait my-1" />
            <div className="flex justify-between items-baseline">
              <span className="font-extrabold">Total</span>
              <span className="text-[1.4rem] font-extrabold text-mosaique-or tabular-nums">{formatPrix(total)}</span>
            </div>
          </section>
          <button type="submit" disabled={chargement} className="btn-or text-base min-h-[58px] rounded-2xl">
            <Lock size={18} aria-hidden="true" />
            {chargement ? 'Redirection vers FedaPay…' : `Payer ${formatPrix(total)}`}
          </button>
          <p className="-mt-2 text-center text-xs text-mosaique-gris">Paiement sécurisé par FedaPay · le montant final est vérifié par nos serveurs</p>
        </aside>
      </form>
    </div>
  );
}
