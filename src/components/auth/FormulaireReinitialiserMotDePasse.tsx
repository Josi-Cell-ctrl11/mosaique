'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmation: z.string(),
}).refine((d) => d.password === d.confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmation'],
});

type FormData = z.infer<typeof schema>;

export function FormulaireReinitialiserMotDePasse() {
  const router = useRouter();
  const supabase = createClient();
  const [montrerMdp, setMontrerMdp] = useState(false);
  const [chargement, setChargement] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setChargement(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Mot de passe mis à jour avec succès');
      router.push('/connexion');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card p-8">
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-2">
        Nouveau mot de passe
      </h1>
      <p className="text-mosaique-gris text-sm mb-6">
        Choisissez un nouveau mot de passe pour votre compte.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label className="label-field" htmlFor="password">Nouveau mot de passe</label>
          <div className="relative">
            <input
              id="password"
              type={montrerMdp ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Au moins 8 caractères"
              className="input-field pr-12"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setMontrerMdp(!montrerMdp)}
              aria-label={montrerMdp ? 'Masquer' : 'Voir'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mosaique-gris hover:text-mosaique-nuit p-1"
            >
              {montrerMdp ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-mosaique-epice text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="label-field" htmlFor="confirmation">Confirmer le mot de passe</label>
          <input
            id="confirmation"
            type={montrerMdp ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Répétez le mot de passe"
            className="input-field"
            {...register('confirmation')}
          />
          {errors.confirmation && (
            <p className="text-mosaique-epice text-xs mt-1">{errors.confirmation.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={chargement}
          className="btn-primary w-full mt-2"
        >
          {chargement ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
        </button>
      </form>
    </div>
  );
}
