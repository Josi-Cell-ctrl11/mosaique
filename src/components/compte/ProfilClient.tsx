'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Profile } from '@/types';

interface Props { profile: Profile }

const schema = z.object({
  nom:       z.string().min(2, 'Nom requis'),
  telephone: z.string().min(8, 'Téléphone invalide'),
  adresse:   z.string().optional(),
  ville:     z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function ProfilClient({ profile }: Props) {
  const supabase = createClient();
  const [sauvegarde, setSauvegarde] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      nom:       profile?.nom ?? '',
      telephone: profile?.telephone ?? '',
      adresse:   profile?.adresse ?? '',
      ville:     profile?.ville ?? '',
    },
  });

  async function onSubmit(data: FormData) {
    setSauvegarde(true);
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', profile.id);

    if (error) {
      toast.error('Erreur lors de la sauvegarde.');
    } else {
      toast.success('Profil mis à jour.');
    }
    setSauvegarde(false);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-6">Mon profil</h1>

      <div className="bg-white rounded-card shadow-card p-6">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 max-w-md">
          <div>
            <label className="label-field" htmlFor="nom">Nom complet</label>
            <input id="nom" type="text" className="input-field" {...register('nom')} />
            {errors.nom && <p className="text-mosaique-epice text-xs mt-1">{errors.nom.message}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="telephone">Téléphone</label>
            <input id="telephone" type="tel" inputMode="tel" className="input-field" {...register('telephone')} />
            {errors.telephone && <p className="text-mosaique-epice text-xs mt-1">{errors.telephone.message}</p>}
          </div>

          <div>
            <label className="label-field" htmlFor="adresse">Adresse de livraison</label>
            <input id="adresse" type="text" className="input-field" {...register('adresse')} />
          </div>

          <div>
            <label className="label-field" htmlFor="ville">Ville</label>
            <input id="ville" type="text" className="input-field" {...register('ville')} />
          </div>

          <div>
            <label className="label-field">Adresse email</label>
            <input type="email" value={profile?.email ?? ''} disabled className="input-field" />
            <p className="text-xs text-mosaique-gris mt-1">L&apos;email ne peut pas être modifié ici.</p>
          </div>

          <button
            type="submit"
            disabled={!isDirty || sauvegarde}
            className="btn-primary"
          >
            {sauvegarde ? 'Sauvegarde…' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}
