'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePanier } from '@/store/panier';
import { formatPrix, genererCreneauxLivraison } from '@/lib/utils';
import type { Profile, ConfigLivraison } from '@/types';
import { toast } from 'sonner';
import Image from 'next/image';
import { imagePlaceholder } from '@/lib/utils';

interface CheckoutClientProps {
  profile: Profile;
  configLivraison: ConfigLivraison;
}

const schema = z.object({
  adresse: z.string().min(5, "L'adresse est requise"),
  ville: z.string().min(2, 'La ville est requise'),
  telephone: z.string().min(8, 'Numéro invalide'),
  zone_id: z.string().optional(),
  heure_livraison: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CheckoutClient({ profile, configLivraison }: CheckoutClientProps) {
  const router = useRouter();
  const { articles, sousTotal, viderPanier } = usePanier();
  const [etape, setEtape] = useState<'livraison' | 'recapitulatif'>('livraison');
  const [chargement, setChargement] = useState(false);

  const creneaux = genererCreneauxLivraison(configLivraison?.delai_minutes ?? 45);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      adresse: profile?.adresse ?? '',
      ville: profile?.ville ?? '',
      telephone: profile?.telephone ?? '',
    },
  });

  const zoneId = watch('zone_id');

  // Calcul frais livraison
  function calculerFraisLivraison(): number {
    if (!configLivraison) return 0;
    if (configLivraison.type === 'par_zone' && zoneId) {
      const zone = configLivraison.zones?.find((z) => z.id === zoneId);
      return zone?.frais ?? configLivraison.frais_fixe;
    }
    return configLivraison.frais_fixe;
  }

  const fraisLivraison = calculerFraisLivraison();
  const total = sousTotal() + fraisLivraison;

  // Rediriger si panier vide
  if (articles.length === 0) {
    return (
      <div className="container-site py-20 text-center">
        <p className="text-mosaique-gris text-lg mb-4">Votre panier est vide.</p>
        <button onClick={() => router.push('/menu')} className="btn-primary">
          Voir le menu
        </button>
      </div>
    );
  }

  async function passerCommande(data: FormData) {
    setChargement(true);
    try {
      const res = await fetch('/api/commandes/creer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adresse_livraison: data.adresse,
          ville_livraison: data.ville,
          telephone_livraison: data.telephone,
          zone_livraison_id: data.zone_id || null,
          heure_livraison: data.heure_livraison || null,
          notes: data.notes || null,
          frais_livraison: fraisLivraison,
          articles: articles.map((a) => ({
            platId: a.platId,
            nom: a.nom,
            prix: a.prix + a.prixOptions,
            quantite: a.quantite,
            options: a.options ?? {},
          })),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? 'Erreur lors de la commande.');
        return;
      }

      // Rediriger vers FedaPay (URL renvoyée par l'API)
      if (json.fedapay_url) {
        viderPanier();
        window.location.href = json.fedapay_url;
      } else {
        toast.error('Impossible de lancer le paiement.');
      }
    } catch {
      toast.error('Erreur réseau. Réessayez.');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="container-site py-10">
      <h1 className="font-display text-3xl font-bold text-mosaique-terre mb-8">
        Valider la commande
      </h1>

      {/* Indicateur d'étape */}
      <div className="flex items-center gap-3 mb-8 text-sm font-medium">
        <span className={etape === 'livraison' ? 'text-mosaique-ocre' : 'text-mosaique-gris'}>
          1. Livraison
        </span>
        <span className="text-mosaique-creme">—</span>
        <span className={etape === 'recapitulatif' ? 'text-mosaique-ocre' : 'text-mosaique-gris'}>
          2. Récapitulatif & Paiement
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Formulaire / Récap */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(passerCommande)} noValidate>
            {etape === 'livraison' && (
              <div className="bg-white rounded-card shadow-card p-6 space-y-5">
                <h2 className="font-display text-xl font-semibold text-mosaique-terre">
                  Adresse de livraison
                </h2>

                {/* Adresse */}
                <div>
                  <label className="label-field" htmlFor="adresse">Adresse</label>
                  <input id="adresse" type="text" autoComplete="street-address"
                    className="input-field" {...register('adresse')} />
                  {errors.adresse && <p className="text-mosaique-epice text-xs mt-1">{errors.adresse.message}</p>}
                </div>

                {/* Ville */}
                <div>
                  <label className="label-field" htmlFor="ville">Ville</label>
                  <input id="ville" type="text" autoComplete="address-level2"
                    className="input-field" {...register('ville')} />
                  {errors.ville && <p className="text-mosaique-epice text-xs mt-1">{errors.ville.message}</p>}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="label-field" htmlFor="telephone">Téléphone</label>
                  <input id="telephone" type="tel" autoComplete="tel"
                    inputMode="tel" className="input-field" {...register('telephone')} />
                  {errors.telephone && <p className="text-mosaique-epice text-xs mt-1">{errors.telephone.message}</p>}
                </div>

                {/* Zone de livraison si par zone */}
                {configLivraison?.type === 'par_zone' && configLivraison.zones && (
                  <div>
                    <label className="label-field" htmlFor="zone_id">Zone de livraison</label>
                    <select id="zone_id" className="input-field" {...register('zone_id')}>
                      <option value="">Sélectionner une zone</option>
                      {configLivraison.zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.nom} — {formatPrix(z.frais)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Heure de livraison */}
                <div>
                  <label className="label-field" htmlFor="heure_livraison">
                    Heure souhaitée (optionnel)
                  </label>
                  <select id="heure_livraison" className="input-field" {...register('heure_livraison')}>
                    <option value="">Dès que possible</option>
                    {creneaux.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="label-field" htmlFor="notes">Instructions pour la livraison</label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Code d'entrée, étage, point de repère…"
                    className="input-field resize-none"
                    {...register('notes')}
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const valid = await trigger(['adresse', 'ville', 'telephone']);
                    if (valid) setEtape('recapitulatif');
                  }}
                  className="btn-primary w-full"
                >
                  Continuer vers le paiement
                </button>
              </div>
            )}

            {etape === 'recapitulatif' && (
              <div className="bg-white rounded-card shadow-card p-6 space-y-6">
                <h2 className="font-display text-xl font-semibold text-mosaique-terre">
                  Récapitulatif de la commande
                </h2>

                {/* Articles */}
                <ul className="divide-y divide-mosaique-creme">
                  {articles.map((a) => (
                    <li key={`${a.platId}-${JSON.stringify(a.options ?? {})}`}
                      className="flex gap-3 py-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-mosaique-creme">
                        <Image
                          src={a.image_url || imagePlaceholder(a.nom)}
                          alt={a.nom} fill className="object-cover" sizes="56px"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-mosaique-nuit">{a.nom}</p>
                        <p className="text-xs text-mosaique-gris">Qté : {a.quantite}</p>
                      </div>
                      <span className="prix text-sm tabular-nums">
                        {formatPrix((a.prix + a.prixOptions) * a.quantite)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Totaux */}
                <div className="space-y-2 pt-2 border-t border-mosaique-creme text-sm">
                  <div className="flex justify-between text-mosaique-gris">
                    <span>Sous-total</span>
                    <span className="tabular-nums">{formatPrix(sousTotal())}</span>
                  </div>
                  <div className="flex justify-between text-mosaique-gris">
                    <span>Frais de livraison</span>
                    <span className="tabular-nums">{formatPrix(fraisLivraison)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-mosaique-nuit text-base pt-2 border-t border-mosaique-creme">
                    <span>Total</span>
                    <span className="prix text-prix-lg">{formatPrix(total)}</span>
                  </div>
                </div>

                <p className="text-xs text-mosaique-gris">
                  Aucun frais supplémentaire ne sera ajouté. Le paiement est sécurisé via FedaPay.
                </p>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEtape('livraison')}
                    className="btn-secondary flex-1"
                  >
                    Modifier
                  </button>
                  <button
                    type="submit"
                    disabled={chargement}
                    className="btn-primary flex-1"
                  >
                    {chargement ? 'Redirection…' : 'Payer maintenant'}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Résumé panier latéral */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-card shadow-card p-5 sticky top-28">
            <h3 className="font-semibold text-mosaique-nuit mb-4">Votre panier</h3>
            <ul className="space-y-3 mb-4">
              {articles.map((a) => (
                <li key={a.platId} className="flex justify-between text-sm">
                  <span className="text-mosaique-nuit">
                    {a.quantite}× {a.nom}
                  </span>
                  <span className="tabular-nums text-mosaique-gris">
                    {formatPrix((a.prix + a.prixOptions) * a.quantite)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-mosaique-creme">
              <div className="flex justify-between text-sm text-mosaique-gris mb-1">
                <span>Livraison</span>
                <span className="tabular-nums">{formatPrix(fraisLivraison)}</span>
              </div>
              <div className="flex justify-between font-bold text-mosaique-nuit">
                <span>Total</span>
                <span className="prix">{formatPrix(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
