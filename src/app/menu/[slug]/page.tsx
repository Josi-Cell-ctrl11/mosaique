import { notFound } from 'next/navigation';
import { FichePlatClient } from '@/components/menu/FichePlatClient';
import { PLATS_DEMO } from '@/lib/demo-data';
import type { Plat } from '@/types';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const plat = await getPlat(params.slug);
  if (!plat) return { title: 'Plat introuvable' };
  return { title: plat.nom, description: plat.description };
}

async function getPlat(slug: string): Promise<Plat | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url === 'your_supabase_project_url') {
    return PLATS_DEMO.find((p) => p.slug === slug) ?? null;
  }

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();

    const { data: plat } = await supabase
      .from('plats')
      .select(`*, categorie:categories(*), options:options_plat(*, valeurs:valeurs_option(*)), avis(*, profiles(nom))`)
      .eq('slug', slug)
      .eq('disponible', true)
      .single();

    return (plat as Plat | null);
  } catch {
    return PLATS_DEMO.find((p) => p.slug === slug) ?? null;
  }
}

async function getSuggestion(plat: Plat): Promise<Plat | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || url === 'your_supabase_project_url') {
    return PLATS_DEMO.find((p) => p.categorie_id === plat.categorie_id && p.id !== plat.id) ?? null;
  }

  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();

    const { data } = await supabase
      .from('plats')
      .select('*, categorie:categories(*)')
      .eq('categorie_id', plat.categorie_id)
      .eq('disponible', true)
      .neq('id', plat.id)
      .limit(1)
      .single();

    return data as Plat | null;
  } catch {
    return null;
  }
}

export default async function PageFichePlat({ params }: Props) {
  const plat = await getPlat(params.slug);
  if (!plat) notFound();

  const suggestion = await getSuggestion(plat!);

  return (
    <div className="pt-16 lg:pt-20">
      <FichePlatClient plat={plat!} suggestion={suggestion} />
    </div>
  );
}
