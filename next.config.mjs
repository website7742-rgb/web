/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '500mb',
    },
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { 
            key: 'Content-Security-Policy', 
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https: https://*.cloudflarestream.com https://*.videodelivery.net https://*.cloudflare.com; font-src 'self' data: https:; connect-src 'self' https: wss: *.supabase.co https://*.supabase.co wss://*.supabase.co https://*.googleapis.com https://*.youtube.com https://*.googlevideo.com https://*.cloudflarestream.com https://*.videodelivery.net https://*.cloudflare.com; media-src 'self' blob: https: https://*.cloudflarestream.com https://*.videodelivery.net https://*.cloudflare.com; frame-src 'self' https://www.youtube.com https://youtube.com https://*.youtube.com https://www.youtube-nocookie.com https://*.youtube-nocookie.com https://*.doubleclick.net https://*.google.com https://*.cloudflarestream.com https://*.videodelivery.net; child-src 'self' https://www.youtube.com https://youtube.com https://*.youtube.com https://www.youtube-nocookie.com https://*.youtube-nocookie.com https://*.cloudflarestream.com https://*.videodelivery.net;" 
          }
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
