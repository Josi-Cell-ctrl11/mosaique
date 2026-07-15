'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { BoutonGoogle } from './BoutonGoogle';

const schema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

type FormData = z.infer<typeof schema>;

export function FormulaireConnexion() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/menu';
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
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou mot de passe incorrect.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      router.push(redirect);
      router.refresh();
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card p-8">
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-2">Se connecter</h1>
      <p className="text-mosaique-gris text-sm mb-6">
        Accédez à votre compte pour passer commande.
      </p>

      {searchParams.get('redirect') && (
        <div className="bg-mosaique-creme border border-mosaique-ocre/30 rounded-btn px-4 py-3 text-sm text-mosaique-terre mb-4">
          Connectez-vous pour continuer votre commande.
        </div>
      )}

      {/* Google */}
      <BoutonGoogle label="Se connecter avec Google" />

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-mosaique-creme" />
        <span className="text-xs text-mosaique-gris">ou</span>
        <div className="flex-1 h-px bg-mosaique-creme" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Email */}
        <div>
          <label className="label-field" htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            className="input-field"
            inputMode="email"
            {...register('email')}
          />
          {errors.email && <p className="text-mosaique-epice text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Mot de passe */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="label-field !mb-0" htmlFor="password">Mot de passe</label>
            <Link
              href="/mot-de-passe-oublie"
              className="text-xs text-mosaique-ocre hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={montrerMdp ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Votre mot de passe"
              className="input-field pr-12"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setMontrerMdp(!montrerMdp)}
              aria-label={montrerMdp ? 'Masquer le mot de passe' : 'Voir le mot de passe'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mosaique-gris hover:text-mosaique-nuit p-1"
            >
              {montrerMdp ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className="text-mosaique-epice text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={chargement}
          className="btn-primary w-full mt-2"
        >
          {chargement ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>

      <p className="text-center text-sm text-mosaique-gris mt-6">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="text-mosaique-ocre font-medium hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
