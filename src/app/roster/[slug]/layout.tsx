import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldstarhiphop.com';

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug);
  const queryColumn = isUUID ? 'id' : 'slug';

  const { data: artist, error } = await supabase
    .from('artists')
    .select('name, bio, hero_url, avatar_url')
    .eq(queryColumn, params.slug)
    .single();

  if (!artist || error) {
    return {
      title: 'Artist Not Found | WorldStar Official',
      description: 'The requested artist profile could not be located.',
    };
  }

  const safeName = artist.name || 'Unknown Artist';
  const imageUrl = artist.hero_url || artist.avatar_url;

  return {
    title: `${safeName} | Official Roster`,
    description: artist.bio || `Official artist profile for ${safeName} on WorldStar Official.`,
    openGraph: {
      title: `${safeName} | Official Roster`,
      description: artist.bio || `Official artist profile for ${safeName} on WorldStar Official.`,
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
