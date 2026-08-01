import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldstarhiphop.com';

  const { data: video } = await supabase
    .from('videos')
    .select('title, description, thumbnail_url')
    .eq('id', params.slug)
    .single();

  if (!video) {
    return { title: 'Release Not Found' };
  }

  return {
    title: video.title,
    description: video.description || `Official music video for ${video.title}`,
    openGraph: {
      title: video.title,
      description: video.description || `Official music video for ${video.title}`,
      images: video.thumbnail_url ? [video.thumbnail_url] : [],
    },
    alternates: {
      canonical: `${siteUrl}/releases/${params.slug}`,
    }
  };
}

export default function ReleaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
