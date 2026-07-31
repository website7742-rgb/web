import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://worldstarhiphop.com';

  const routes = [
    '',
    '/roster',
    '/pro',
    '/tour',
    '/submit',
    '/terms',
    '/privacy',
    '/dmca',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
}
