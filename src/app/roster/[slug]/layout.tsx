import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldstarhiphop.com';

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase env keys');
    }

    const { createClient } = await import('@/lib/supabase/server');
    const supabase = createClient();

    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug);
    const queryColumn = isUUID ? 'id' : 'slug';

    const { data: artist, error } = await supabase
      .from('artists')
      .select('name, bio, hero_url, avatar_url')
      .eq(queryColumn, params.slug)
      .single();

    if (error || !artist) throw new Error('Database fetch failed');

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
  } catch {
    // SILENT FALLBACK — never crash the page due to missing env keys or DB errors
    const decodedSlug = decodeURIComponent(params.slug).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      title: `${decodedSlug} | Official Roster`,
      description: `Official artist profile on WorldStar Official.`,
      alternates: {
        canonical: `${siteUrl}/roster/${params.slug}`,
      }
    };
  }
}

export default function RosterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
