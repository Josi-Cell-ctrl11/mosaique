'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Star, ChevronLeft } from 'lucide-react';
import type { Plat } from '@/types';
import { formatPrix, imagePlaceholder } from '@/lib/utils';
import { usePanier } from '@/store/panier';
import { CartePlat } from './CartePlat';
import { toast } from 'sonner';

interface FichePlatClientProps {
  plat: Plat;
  suggestion?: Plat | null;
}

export function FichePlatClient({ plat, suggestion }: FichePlatClientProps) {
  const [quantite, setQuantite] = useState(1);
  const [photoActive, setPhotoActive] = useState(0);
  const [optionsChoisies, setOptionsChoisies] = useState<Record<string, string>>({});
  const { ajouterArticle } = usePanier();

  const toutes_images = [
    ...(plat.image_url ? [plat.image_url] : []),
    ...(plat.images_urls ?? []),
  ];
  if (toutes_images.length === 0) toutes_images.push(imagePlaceholder(plat.nom));

  const prixOptions = Object.entries(optionsChoisies).reduce((total, [optionId, valeurId]) => {
    const option = plat.options?.find((o) => o.id === optionId);
    const valeur = option?.valeurs?.find((v) => v.id === valeurId);
    return total + (valeur?.prix_sup ?? 0);
  }, 0);

  const prixUnitaire = plat.prix + prixOptions;
  const prixTotal = prixUnitaire * quantite;

  const avisApprouves = (plat.avis ?? []).filter((a) => a.approuve);
  const notemoyenne =
    avisApprouves.length > 0
      ? avisApprouves.reduce((s, a) => s + a.note, 0) / avisApprouves.length
      : null;

  function ajouterAuPanier() {
    // Vérifier les options obligatoires
    const optionsObligatoires = plat.options?.filter((o) => o.required) ?? [];
    for (const opt of optionsObligatoires) {
      if (!optionsChoisies[opt.id]) {
        toast.error(`Veuillez choisir : ${opt.nom}`);
        return;
      }
    }

    ajouterArticle({
      platId: plat.id,
      nom: plat.nom,
      prix: plat.prix,
      image_url: plat.image_url,
      quantite,
      options: Object.keys(optionsChoisies).length > 0 ? optionsChoisies : undefined,
      prixOptions,
    });
    toast.success(`${quantite}× ${plat.nom} ajouté${quantite > 1 ? 's' : ''} au panier`);
  }

  return (
    <>
    <div className="min-h-screen bg-mosaique-ivoire pb-24 lg:pb-0">
      {/* Retour */}
      <div className="container-site pt-6 pb-2">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 text-sm text-mosaique-gris hover:text-mosaique-ocre transition-colors"
        >
          <ChevronLeft size={16} />
          Retour au menu
        </Link>
      </div>

      <div className="container-site py-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Galerie photos */}
          <div className="space-y-3">
            {/* Photo principale */}
            <div className="relative aspect-[4/3] rounded-card overflow-hidden bg-mosaique-creme">
              <Image
                src={toutes_images[photoActive]}
                alt={plat.nom}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Miniatures */}
            {toutes_images.length > 1 && (
              <div className="flex gap-2">
                {toutes_images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setPhotoActive(i)}
                    aria-label={`Photo ${i + 1}`}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      photoActive === i ? 'border-mosaique-ocre' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Infos produit — prix + bouton toujours dans ce bloc, visible sans scroll */}
          <div className="space-y-6">
            {/* Catégorie */}
            {plat.categorie && (
              <Link
                href={`/menu?categorie=${plat.categorie.slug}`}
                className="text-xs font-semibold uppercase tracking-widest text-mosaique-ocre hover:underline"
              >
                {plat.categorie.nom}
              </Link>
            )}

            <h1 className="font-display text-3xl lg:text-4xl font-bold text-mosaique-terre leading-tight">
              {plat.nom}
            </h1>

            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              {plat.est_vegetarien && <span className="badge-vegetarien">🌿 Végétarien</span>}
              {plat.est_epice && <span className="badge-epice">🌶 Épicé</span>}
            </div>

            {/* Note moyenne */}
            {notemoyenne !== null && (
              <div className="flex items-center gap-2 text-sm text-mosaique-gris">
                <div className="flex gap-0.5" aria-label={`Note : ${notemoyenne.toFixed(1)} sur 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      size={14}
                      className={n <= Math.round(notemoyenne) ? 'text-mosaique-ocre fill-mosaique-ocre' : 'text-mosaique-creme'}
                    />
                  ))}
                </div>
                <span>{notemoyenne.toFixed(1)} ({avisApprouves.length} avis)</span>
              </div>
            )}

            {/* Description */}
            <p className="text-mosaique-nuit/80 text-base leading-relaxed">{plat.description}</p>

            {/* Ingrédients */}
            {plat.ingredients && (
              <div className="text-sm text-mosaique-gris leading-relaxed">
                <span className="font-medium text-mosaique-nuit">Ingrédients : </span>
                {plat.ingredients}
              </div>
            )}

            {/* Options */}
            {(plat.options ?? []).length > 0 && (
              <div className="space-y-4 pt-2">
                {plat.options!.map((option) => (
                  <div key={option.id}>
                    <label className="label-field">
                      {option.nom}
                      {option.required && <span className="text-mosaique-epice ml-1">*</span>}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.valeurs.map((valeur) => (
                        <button
                          key={valeur.id}
                          type="button"
                          onClick={() =>
                            setOptionsChoisies((prev) => ({
                              ...prev,
                              [option.id]: valeur.id,
                            }))
                          }
                          className={`px-3 py-2 rounded-btn border text-sm font-medium min-h-[40px] transition-colors ${
                            optionsChoisies[option.id] === valeur.id
                              ? 'bg-mosaique-ocre text-white border-mosaique-ocre'
                              : 'bg-white text-mosaique-nuit border-mosaique-creme hover:border-mosaique-ocre'
                          }`}
                        >
                          {valeur.label}
                          {valeur.prix_sup > 0 && (
                            <span className="ml-1 opacity-70">+{formatPrix(valeur.prix_sup)}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Prix + Quantité + CTA — toujours visibles ensemble */}
            <div className="pt-4 space-y-4 border-t border-mosaique-creme">
              {/* Prix total */}
              <div className="flex items-baseline gap-3">
                <span className="prix" style={{ fontSize: '2rem' }}>{formatPrix(prixUnitaire)}</span>
                {quantite > 1 && (
                  <span className="text-mosaique-gris text-sm tabular-nums">
                    × {quantite} = {formatPrix(prixTotal)}
                  </span>
                )}
              </div>

              {/* Quantité */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                    aria-label="Diminuer la quantité"
                    className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-mosaique-creme text-mosaique-nuit hover:bg-mosaique-creme transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-semibold text-lg tabular-nums">{quantite}</span>
                  <button
                    onClick={() => setQuantite((q) => q + 1)}
                    aria-label="Augmenter la quantité"
                    className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-mosaique-creme text-mosaique-nuit hover:bg-mosaique-creme transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <button
                  onClick={ajouterAuPanier}
                  className="btn-primary flex-1"
                >
                  Ajouter au panier
                </button>
              </div>

              {/* Info livraison contextuelle */}
              <p className="text-xs text-mosaique-gris">
                Livré en environ 45 min après validation de la commande.
              </p>
            </div>
          </div>
        </div>

        {/* Avis clients */}
        {avisApprouves.length > 0 && (
          <section className="mt-16" aria-labelledby="titre-avis">
            <h2 id="titre-avis" className="font-display text-2xl font-bold text-mosaique-terre mb-6">
              Ce qu&apos;en disent nos clients
            </h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {avisApprouves.slice(0, 6).map((avis) => (
                <li key={avis.id} className="bg-white rounded-card p-5 shadow-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm text-mosaique-nuit">
                      {avis.profiles?.nom ?? 'Client'}
                    </span>
                    <div className="flex gap-0.5" aria-label={`${avis.note} étoiles sur 5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={12}
                          className={n <= avis.note ? 'text-mosaique-ocre fill-mosaique-ocre' : 'text-mosaique-creme'}
                        />
                      ))}
                    </div>
                  </div>
                  {avis.commentaire && (
                    <p className="text-sm text-mosaique-nuit/70 leading-relaxed">{avis.commentaire}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Suggestion — "va bien avec" */}
        {suggestion && (
          <section className="mt-16" aria-labelledby="titre-suggestion">
            <h2 id="titre-suggestion" className="font-display text-2xl font-bold text-mosaique-terre mb-6">
              Va bien avec
            </h2>
            <div className="max-w-xs">
              <CartePlat plat={suggestion} />
            </div>
          </section>
        )}
      </div>
    </div>

    {/* CTA fixe mobile — prix + bouton toujours visibles */}
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-mosaique-creme px-4 py-3 flex items-center gap-3">
      {/* Quantité */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => setQuantite((q) => Math.max(1, q - 1))}
          aria-label="Diminuer"
          className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-mosaique-creme text-mosaique-nuit active:bg-mosaique-creme"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center font-semibold tabular-nums">{quantite}</span>
        <button
          onClick={() => setQuantite((q) => q + 1)}
          aria-label="Augmenter"
          className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-mosaique-creme text-mosaique-nuit active:bg-mosaique-creme"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Bouton + prix */}
      <button
        onClick={ajouterAuPanier}
        className="btn-primary flex-1 flex items-center justify-between"
      >
        <span>Ajouter au panier</span>
        <span className="tabular-nums font-bold">{formatPrix(prixTotal)}</span>
      </button>
    </div>
  </>
  );
}
