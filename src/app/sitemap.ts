import { MetadataRoute } from 'next';
import { MOCK_ARTISTS, MOCK_NEWS } from '@/lib/data/mockData';
import { getVerifiedReleases } from '@/lib/data/verifiedReleases';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  // 1. Core Public Static Hubs
  const sitemapEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/videos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/roster`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/releases`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/charts`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tour`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/pro`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/advertise`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.65,
    },
    {
      url: `${baseUrl}/submit-demo`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/dmca`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/eudsa`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // 2. Verified Artist Profiles (from MOCK_ARTISTS)
  const seenArtistSlugs = new Set<string>();
  if (Array.isArray(MOCK_ARTISTS)) {
    MOCK_ARTISTS.forEach((artist) => {
      const slug = artist.slug || artist.id;
      if (slug && !seenArtistSlugs.has(slug)) {
        seenArtistSlugs.add(slug);
        sitemapEntries.push({
          url: `${baseUrl}/roster/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  }

  // 3. Official Hip-Hop & Rap Releases (from verified catalog - canonical slugs only)
  const seenReleaseSlugs = new Set<string>();
  const verifiedReleases = getVerifiedReleases();
  verifiedReleases.forEach((release) => {
    const slug = release.slug || release.id;
    if (slug && !seenReleaseSlugs.has(slug)) {
      seenReleaseSlugs.add(slug);
      sitemapEntries.push({
        url: `${baseUrl}/releases/${slug}`,
        lastModified: release.releaseDate ? new Date(release.releaseDate) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  });

  // 4. Editorial News Articles (from MOCK_NEWS)
  const seenNewsSlugs = new Set<string>();
  if (Array.isArray(MOCK_NEWS)) {
    MOCK_NEWS.forEach((article) => {
      const slug = article.slug || article.id;
      if (slug && !seenNewsSlugs.has(slug)) {
        seenNewsSlugs.add(slug);
        sitemapEntries.push({
          url: `${baseUrl}/news/${slug}`,
          lastModified: article.date ? new Date(article.date) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
    });
  }

  return sitemapEntries;
}
