import { Suspense } from 'react';
import type { Metadata } from 'next';
import { FormulaireConnexion } from '@/components/auth/FormulaireConnexion';

export const metadata: Metadata = { title: 'Se connecter' };

export default function PageConnexion() {
  return (
    <Suspense fallback={<div className="bg-white rounded-card shadow-card p-8 animate-pulse h-96" />}>
      <FormulaireConnexion />
    </Suspense>
  );
}
