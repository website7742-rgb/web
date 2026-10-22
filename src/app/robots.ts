import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const aiBots = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'anthropic-ai',
    'PerplexityBot',
    'Google-Extended',
    'GoogleOther',
    'Applebot',
    'Applebot-Extended',
    'Meta-ExternalAgent',
    'FacebookBot',
  ];

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/videos', '/llms.txt'],
        disallow: [
          '/admin',
          '/admin/',
          '/api/admin/',
          '/studio',
          '/studio/',
          '/dashboard',
          '/profile',
          '/api/',
        ],
      },
      ...aiBots.map((bot) => ({
        userAgent: bot,
        allow: ['/', '/videos', '/roster', '/charts', '/submit', '/news', '/llms.txt', '/api/videos'],
        disallow: [
          '/admin',
          '/admin/',
          '/api/admin/',
          '/studio',
          '/studio/',
          '/dashboard',
          '/profile',
        ],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
