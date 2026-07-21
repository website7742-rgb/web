import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { MOCK_ARTISTS, MOCK_RELEASES } from '@/lib/data/mockData';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  const staticRoutes = ['', '/roster', '/releases', '/tour', '/merch', '/demo', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const artistRoutes = MOCK_ARTISTS.map((artist) => ({
    url: `${baseUrl}/roster/${artist.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const releaseRoutes = MOCK_RELEASES.map((release) => ({
    url: `${baseUrl}/releases/${release.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...artistRoutes, ...releaseRoutes];
}
