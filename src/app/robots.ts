import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/*', '/api/cron/*'],
    },
    sitemap: 'https://worldstarhiphop.com/sitemap.xml',
  };
}
