'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ChevronLeft, Minus, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import type { Plat } from '@/types';
import { cn, formatPrix } from '@/lib/utils';
import { usePanier } from '@/store/panier';
import { ImagePlat } from '@/components/ui/ImagePlat';
import { CartePlat } from './CartePlat';

interface Props {
  plat: Plat;
  /** Autres plats de la même famille (ex. les autres garnitures d'une sauce) */
  famille?: Plat[];
  suggestion?: Plat | null;
}

/** « Sauce gombo enrichie — viande de mouton » → « Viande de mouton » */
function libelleGarniture(nom: string) {
  const morceaux = nom.split(/\s+[—–-]\s+/);
  if (morceaux.length > 1) return morceaux.slice(1).join(' — ').replace(/^./, (c) => c.toUpperCase());
  return nom;
}

export function FichePlatClient({ plat, famille = [], suggestion }: Props) {
  const router = useRouter();
  const [quantite, setQuantite] = useState(1);
  const [optionsChoisies, setOptionsChoisies] = useState<Record<string, string>>({});
  const { ajouterArticle } = usePanier();

  const prixOptions = Object.entries(optionsChoisies).reduce((total, [optionId, valeurId]) => {
    const valeur = plat.options?.find((o) => o.id === optionId)?.valeurs?.find((v) => v.id === valeurId);
    return total + (valeur?.prix_sup ?? 0);
  }, 0);
  const prixTotal = (plat.prix + prixOptions) * quantite;

  const avis = (plat.avis ?? []).filter((a) => a.approuve);
  const note = avis.length ? avis.reduce((s, a) => s + a.note, 0) / avis.length : null;

  // Garnitures = plats frères dont le nom suit le motif « Famille — garniture »
  const garnitures = famille.length > 1 && famille.some((p) => /\s[—–-]\s/.test(p.nom)) ? famille : [];

  function ajouter() {
    for (const opt of plat.options?.filter((o) => o.required) ?? []) {
      if (!optionsChoisies[opt.id]) {
        toast.error(`Choisissez : ${opt.nom}`);
        return;
      }
    }
    ajouterArticle({
      platId: plat.id,
      nom: plat.nom,
      prix: plat.prix,
      image_url: plat.image_url,
      quantite,
      options: Object.keys(optionsChoisies).length ? optionsChoisies : undefined,
      prixOptions,
    });
  }

  const Compteur = ({ compact = false }: { compact?: boolean }) => (
    <div className={cn('flex items-center border border-[#E2D8C6] rounded-[14px] bg-white', compact ? 'h-14' : 'h-14')}>
      <button onClick={() => setQuantite((q) => Math.max(1, q - 1))} aria-label="Retirer une portion" className="w-12 h-full flex items-center justify-center">
        <Minus size={18} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <span aria-live="polite" className="min-w-[24px] text-center text-[17px] font-extrabold tabular-nums">{quantite}</span>
      <button onClick={() => setQuantite((q) => Math.min(50, q + 1))} aria-label="Ajouter une portion" className="w-12 h-full flex items-center justify-center">
        <Plus size={18} strokeWidth={2.4} aria-hidden="true" />
      </button>
    </div>
  );

  return (
    <>
      <div className="bg-mosaique-ivoire pb-32 lg:pb-16 lg:pt-20">
        <div className="lg:container-site lg:pt-8 lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">
          {/* Photo */}
          <div className="relative">
            <ImagePlat src={plat.image_url} alt={plat.nom} priority sizes="(max-width: 1024px) 100vw, 50vw" className="h-[330px] lg:h-[520px] lg:rounded-[24px]" />
            <button
              onClick={() => (window.history.length > 1 ? router.back() : router.push('/menu'))}
              aria-label="Retour"
              className="lg:hidden absolute top-[78px] left-3.5 w-11 h-11 rounded-[14px] bg-mosaique-nuit/80 text-mosaique-ivoire flex items-center justify-center"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
          </div>

          {/* Infos */}
          <div className="relative -mt-7 lg:mt-0 bg-mosaique-ivoire rounded-t-[26px] px-5 pt-6 lg:p-0 flex flex-col gap-6">
            <Link href="/menu" className="hidden lg:inline-flex items-center gap-1 text-sm font-bold text-mosaique-gris hover:text-mosaique-terre">
              <ChevronLeft size={16} aria-hidden="true" /> Retour au menu
            </Link>

            <div className="flex flex-col gap-2">
              {plat.categorie && (
                <Link href={`/menu?categorie=${plat.categorie.slug}`} className="eyebrow hover:underline">{plat.categorie.nom}</Link>
              )}
              <h1 className="font-display text-[1.9rem] lg:text-[2.6rem] leading-[1.12] font-semibold">{garnitures.length ? plat.nom.split(/\s+[—–-]\s+/)[0] : plat.nom}</h1>
              <div className="flex flex-wrap gap-2">
                {plat.est_epice && <span className="badge-epice">Épicé</span>}
                {plat.est_vegetarien && <span className="badge-vegetarien">Végétarien</span>}
              </div>
              {note !== null && (
                <p className="flex items-center gap-1.5 text-sm text-mosaique-gris">
                  <Star size={15} className="fill-mosaique-or text-mosaique-or" aria-hidden="true" />
                  <span><strong className="text-mosaique-terre">{note.toFixed(1).replace('.', ',')}</strong> · {avis.length} avis</span>
                </p>
              )}
              <p className="text-[15px] leading-relaxed text-mosaique-gris">{plat.description}</p>
            </div>

            {garnitures.length > 0 && (
              <fieldset className="flex flex-col gap-2.5">
                <legend className="w-full flex items-center justify-between mb-2.5">
                  <span className="text-[17px] font-extrabold">Garniture</span>
                  <span className="pastille bg-mosaique-dore text-mosaique-ocre-fonce">Obligatoire</span>
                </legend>
                {garnitures.map((g) => {
                  const actif = g.id === plat.id;
                  return (
                    <Link
                      key={g.id}
                      href={`/menu/${g.slug}`}
                      replace
                      scroll={false}
                      aria-current={actif ? 'true' : undefined}
                      className={cn('min-h-[56px] flex items-center gap-3 px-3.5 rounded-[14px] bg-white', actif ? 'border-2 border-mosaique-nuit' : 'border border-[#E2D8C6] m-px hover:border-mosaique-terre')}
                    >
                      <span className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0', actif ? 'border-mosaique-nuit' : 'border-[#B9AE9E]')} aria-hidden="true">
                        {actif && <span className="w-2.5 h-2.5 rounded-full bg-mosaique-nuit" />}
                      </span>
                      <span className="flex-1 text-[15px] font-bold">{libelleGarniture(g.nom)}</span>
                      <span className="text-sm font-extrabold text-mosaique-ocre tabular-nums">{formatPrix(g.prix)}</span>
                    </Link>
                  );
                })}
              </fieldset>
            )}

            {(plat.options ?? []).map((option) => (
              <fieldset key={option.id} className="flex flex-col gap-2.5">
                <legend className="w-full flex items-center justify-between mb-2.5">
                  <span className="text-[17px] font-extrabold">{option.nom}</span>
                  {option.required && <span className="pastille bg-mosaique-dore text-mosaique-ocre-fonce">Obligatoire</span>}
                </legend>
                {option.valeurs.map((v) => {
                  const actif = optionsChoisies[option.id] === v.id;
                  return (
                    <label key={v.id} className={cn('min-h-[56px] flex items-center gap-3 px-3.5 rounded-[14px] bg-white cursor-pointer', actif ? 'border-2 border-mosaique-nuit' : 'border border-[#E2D8C6] m-px')}>
                      <input
                        type="radio"
                        name={option.id}
                        checked={actif}
                        onChange={() => setOptionsChoisies((o) => ({ ...o, [option.id]: v.id }))}
                        className="w-5 h-5 accent-mosaique-nuit"
                      />
                      <span className="flex-1 text-[15px] font-bold">{v.label}</span>
                      {v.prix_sup > 0 && <span className="text-sm font-extrabold text-mosaique-ocre">+{formatPrix(v.prix_sup)}</span>}
                    </label>
                  );
                })}
              </fieldset>
            ))}

            {plat.ingredients && (
              <div className="border-t border-mosaique-creme pt-4">
                <h2 className="font-body text-[15px] font-extrabold">Ingrédients</h2>
                <p className="text-sm leading-relaxed text-mosaique-gris mt-1">{plat.ingredients}</p>
              </div>
            )}

            {/* Ajout — grand écran */}
            <div className="hidden lg:flex items-center gap-3 border-t border-mosaique-creme pt-6">
              <Compteur />
              <button onClick={ajouter} className="btn-primary flex-1 justify-between px-5">
                <span>Ajouter au panier</span>
                <span className="text-mosaique-or tabular-nums">{formatPrix(prixTotal)}</span>
              </button>
            </div>
          </div>
        </div>

        {avis.length > 0 && (
          <section className="container-site mt-12" aria-labelledby="titre-avis">
            <h2 id="titre-avis" className="font-display text-2xl font-semibold mb-4">Ce qu’en disent nos clients</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {avis.slice(0, 6).map((a) => (
                <li key={a.id} className="carte p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">{a.profiles?.nom || 'Client'}</span>
                    <span className="text-[#B8892A] tracking-wider text-sm" role="img" aria-label={`${a.note} sur 5`}>{'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}</span>
                  </div>
                  {a.commentaire && <p className="text-sm leading-relaxed text-mosaique-gris">{a.commentaire}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {suggestion && (
          <section className="container-site mt-12" aria-labelledby="titre-suggestion">
            <h2 id="titre-suggestion" className="font-display text-2xl font-semibold mb-4">Va bien avec</h2>
            <div className="relative max-w-sm"><CartePlat plat={suggestion} /></div>
          </section>
        )}
      </div>

      {/* Barre d'ajout — mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-mosaique-creme px-4 pt-3.5 pb-[max(env(safe-area-inset-bottom),18px)] flex items-center gap-3">
        <Compteur compact />
        <button onClick={ajouter} className="btn-primary flex-1 justify-between px-[18px] min-h-[56px]">
          <span>Ajouter</span>
          <span className="text-mosaique-or tabular-nums">{formatPrix(prixTotal)}</span>
        </button>
      </div>
    </>
  );
}
