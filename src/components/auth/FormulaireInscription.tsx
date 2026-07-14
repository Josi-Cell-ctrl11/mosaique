'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  telephone: z
    .string()
    .min(8, 'Numéro de téléphone invalide')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Numéro de téléphone invalide'),
  adresse: z.string().min(5, "L'adresse est requise"),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
});

type FormData = z.infer<typeof schema>;

export function FormulaireInscription() {
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
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nom: data.nom,
            telephone: data.telephone,
            adresse: data.adresse,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Un compte existe déjà avec cet email. Connectez-vous.');
        } else {
          toast.error(error.message);
        }
        return;
      }

      // Mettre à jour le profil avec l'adresse
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ adresse: data.adresse }).eq('id', user.id);
      }

      toast.success('Compte créé ! Bienvenue chez Mosaïque.');
      router.push('/menu');
    } finally {
      setChargement(false);
    }
  }

  return (
    <div className="bg-white rounded-card shadow-card p-8">
      <h1 className="font-display text-2xl font-bold text-mosaique-terre mb-2">Créer un compte</h1>
      <p className="text-mosaique-gris text-sm mb-6">
        Un compte est nécessaire pour passer commande.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Nom */}
        <div>
          <label className="label-field" htmlFor="nom">Nom complet</label>
          <input
            id="nom"
            type="text"
            autoComplete="name"
            placeholder="Votre nom et prénom"
            className="input-field"
            {...register('nom')}
          />
          {errors.nom && <p className="text-mosaique-epice text-xs mt-1">{errors.nom.message}</p>}
        </div>

        {/* Téléphone */}
        <div>
          <label className="label-field" htmlFor="telephone">Téléphone</label>
          <input
            id="telephone"
            type="tel"
            autoComplete="tel"
            placeholder="+229 00 00 00 00"
            className="input-field"
            inputMode="tel"
            {...register('telephone')}
          />
          {errors.telephone && <p className="text-mosaique-epice text-xs mt-1">{errors.telephone.message}</p>}
        </div>

        {/* Adresse */}
        <div>
          <label className="label-field" htmlFor="adresse">Adresse de livraison</label>
          <input
            id="adresse"
            type="text"
            autoComplete="street-address"
            placeholder="Votre adresse complète"
            className="input-field"
            {...register('adresse')}
          />
          {errors.adresse && <p className="text-mosaique-epice text-xs mt-1">{errors.adresse.message}</p>}
        </div>

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
          <label className="label-field" htmlFor="password">Mot de passe</label>
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
          {chargement ? 'Création du compte…' : 'Créer mon compte'}
        </button>
      </form>

      <p className="text-center text-sm text-mosaique-gris mt-6">
        Déjà un compte ?{' '}
        <Link href="/connexion" className="text-mosaique-ocre font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
