import type { Metadata } from 'next';
import { FormulaireConnexion } from '@/components/auth/FormulaireConnexion';

export const metadata: Metadata = { title: 'Se connecter' };

export default function PageConnexion() {
  return <FormulaireConnexion />;
}
