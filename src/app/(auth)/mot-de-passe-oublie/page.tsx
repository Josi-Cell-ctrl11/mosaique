import { Suspense } from 'react';
import type { Metadata } from 'next';
import { FormulaireMotDePasseOublie } from '@/components/auth/FormulaireMotDePasseOublie';

export const metadata: Metadata = { title: 'Mot de passe oublié' };

export default function PageMotDePasseOublie() {
  return (
    <Suspense fallback={<div className="carte p-8 animate-pulse h-64" />}>
      <FormulaireMotDePasseOublie />
    </Suspense>
  );
}
