'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Adresse email invalide'),
});

type FormData = z.infer<typeof schema>;

export function FormulaireMotDePasseOublie() {
  const supabase = createClient();
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setChargement(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reinitialiser-mot-de-passe`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setEnvoye(true);
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card p-8">
      <Link
        href="/connexion"
        className="inline-flex items-center gap-1.5 text-sm text-mosaique-gris hover:text-mosaique-ocre transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Retour à la connexion
      </Link>

      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-2">
        Mot de passe oublié
      </h1>

      {envoye ? (
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-mosaique-vert/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">✉️</span>
          </div>
          <p className="text-mosaique-nuit font-medium mb-2">Email envoyé !</p>
          <p className="text-sm text-mosaique-gris">
            Vérifiez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
          </p>
        </div>
      ) : (
        <>
          <p className="text-mosaique-gris text-sm mb-6">
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
              {errors.email && (
                <p className="text-mosaique-epice text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={chargement}
              className="btn-primary w-full mt-2"
            >
              {chargement ? 'Envoi en cours…' : 'Envoyer le lien'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
