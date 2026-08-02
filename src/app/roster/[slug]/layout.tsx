import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldstarhiphop.com';

  const { data: artist, error } = await supabase
    .from('artists')
    .select('name, bio, hero_url, avatar_url')
    .eq('slug', params.slug)
    .single();

  if (!artist || error) {
    return { title: 'Artist Not Found' };
  }

  const imageUrl = artist.hero_url || artist.avatar_url;

  return {
    title: `${artist.name} | Official Roster`,
    description: artist.bio || `Official artist profile for ${artist.name} on WorldStar Official.`,
    openGraph: {
      title: `${artist.name} | Official Roster`,
      description: artist.bio || `Official artist profile for ${artist.name} on WorldStar Official.`,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${siteUrl}/roster/${params.slug}`,
    }
  };
}

export default function RosterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
