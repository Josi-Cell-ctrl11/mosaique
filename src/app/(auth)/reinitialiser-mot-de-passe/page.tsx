import { Suspense } from 'react';
import type { Metadata } from 'next';
import { FormulaireReinitialiserMotDePasse } from '@/components/auth/FormulaireReinitialiserMotDePasse';

export const metadata: Metadata = { title: 'Réinitialiser le mot de passe' };

export default function PageReinitialiserMotDePasse() {
  return (
    <Suspense fallback={<div className="bg-white rounded-card shadow-card p-8 animate-pulse h-64" />}>
      <FormulaireReinitialiserMotDePasse />
    </Suspense>
  );
}
