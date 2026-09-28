import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';

// Spotify 'Circular' alternative — ultra-clean, modern geometric sans-serif
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
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
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  referrer: 'no-referrer-when-downgrade',
  title: {
    default: 'WorldStar Hip Hop — Official Platform',
    template: '%s | WorldStar Hip Hop',
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
  authors: [{ name: 'WorldStar Hip Hop' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WorldStar Hip Hop',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    title: 'WorldStar Hip Hop | Official Platform & Exclusive Releases',
    description: 'The premier global destination for official Rap and Hip-Hop music videos, exclusive hip-hop drops, artist rosters, and uncut studio sessions.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world',
    siteName: 'WorldStar Hip Hop',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WorldStar Hip Hop Official Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorldStar Hip Hop | Official Platform & Exclusive Releases',
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

import UrlSecurityGuard from '@/components/auth/UrlSecurityGuard';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const rootStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "WorldStar Hip Hop",
      "url": siteUrl,
      "logo": `${siteUrl}/favicon.svg`,
      "description": "The premier global destination for official Rap and Hip-Hop music videos, exclusive hip-hop drops, artist rosters, uncut studio sessions, and talent discovery.",
      "sameAs": [
        "https://instagram.com/worldstar",
        "https://facebook.com/worldstar",
        "https://twitter.com/worldstar"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      "name": "WorldStar Hip Hop",
      "url": siteUrl,
      "publisher": {
        "@id": `${siteUrl}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${siteUrl}/videos?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <html lang="en" className={`dark scroll-smooth ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(rootStructuredData)
          }}
        />
      </head>
      <body className="bg-obsidian text-zinc-100 min-h-screen flex flex-col antialiased font-[family-name:var(--font-plus-jakarta)] overflow-x-hidden">
        <AppProviders>
          <UrlSecurityGuard />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
