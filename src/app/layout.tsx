import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Bebas_Neue, JetBrains_Mono } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import Preloader from '@/components/Preloader';

// Premium body font — clean, modern, editorial
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

// Premium display font — bold, impactful titles
const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: 'WorldStar - Official Music Videos',
    template: '%s | WORLDSTAR',
  },
  description: 'The premier global destination for official Rap and Hip-Hop music videos, exclusive hip-hop drops, artist rosters, uncut studio sessions, and talent discovery.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  keywords: [
    'WorldStar Official', 'Music Labels', 'Exclusive Hip-Hop Drops', 'Artist Rosters', 
    'Uncut Studio Sessions', 'Rap Music', 'Hip Hop', 'Viral Rap Videos', 
    'Artist Spotlight', 'Music Publishing'
  ],
  authors: [{ name: 'WorldStar Official' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://worldstarhiphop.com'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WorldStar Official',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    title: 'WorldStar Official | Exclusive Releases',
    description: 'The premier global destination for official Rap and Hip-Hop music videos, exclusive hip-hop drops, artist rosters, and uncut studio sessions.',
    url: 'https://aetheria-music-group.vercel.app',
    siteName: 'WorldStar Official',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WorldStar Official Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorldStar Official | Exclusive Releases',
    description: 'The premier global destination for official Rap and Hip-Hop music videos, exclusive hip-hop drops, artist rosters, and uncut studio sessions.',
    images: ['/og-image.png'],
    creator: '@worldstar',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`dark scroll-smooth ${plusJakartaSans.variable} ${bebasNeue.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "WorldStar Official",
              "url": "https://worldstarhiphop.com",
              "logo": "https://worldstarhiphop.com/logo.png",
              "description": "The premier global destination for official Rap and Hip-Hop music videos, exclusive hip-hop drops, artist rosters, uncut studio sessions, and talent discovery.",
              "sameAs": [
                "https://instagram.com/worldstar",
                "https://facebook.com/worldstar",
                "https://twitter.com/worldstar"
              ]
            })
          }}
        />
      </head>
      <body className="bg-obsidian text-zinc-100 min-h-screen flex flex-col antialiased font-[family-name:var(--font-plus-jakarta)]">
        <AppProviders user={user}>
          <Preloader />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
