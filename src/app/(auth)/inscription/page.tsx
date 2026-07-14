import type { Metadata } from 'next';
import { FormulaireInscription } from '@/components/auth/FormulaireInscription';

export const metadata: Metadata = { title: "S'inscrire" };

export default function PageInscription() {
  return <FormulaireInscription />;
}
