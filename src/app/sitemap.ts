import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://worldstarhiphop.com';

  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  ];

  try {
    // Dynamically fetch up to 200 artists
    const { data: artists } = await supabase
      .from('artists')
      .select('id, updated_at')
      .limit(200);

    if (artists) {
      artists.forEach((artist) => {
        sitemapEntries.push({
          url: `${baseUrl}/roster/${artist.id}`,
          lastModified: artist.updated_at ? new Date(artist.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    }

    // Dynamically fetch live videos
    const { data: videos } = await supabase
      .from('videos')
      .select('id, created_at')
      .limit(500);

    if (videos) {
      videos.forEach((video) => {
        sitemapEntries.push({
          url: `${baseUrl}/releases/${video.id}`,
          lastModified: video.created_at ? new Date(video.created_at) : new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
        });
      });
    }
  } catch (err) {
    console.error('[Sitemap] Failed to fetch dynamic entries', err);
  }

  return sitemapEntries;
}
