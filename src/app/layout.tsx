import './globals.css';
import type { Metadata } from 'next';
import { Oswald, Inter, JetBrains_Mono } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
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
    default: 'WorldStarHipHop | Premier Rap & Hip-Hop Media Platform',
    template: '%s | WorldStarHipHop',
  },
  description: 'The premier global destination for official Rap and Hip-Hop music videos, talent discovery, executive publishing, artist Spotlight profiles, and live concert tours.',
  icons: {
    icon: '/favicon.png?v=5',
    shortcut: '/favicon.png?v=5',
    apple: '/favicon.png?v=5',
  },
  keywords: [
    'WorldStarHipHop', 'WSHH', 'Hip Hop', 'Rap Music', 'Viral Rap Videos', 
    'Artist Spotlight', 'Music Publishing', 'Rap Cyphers', 'Hip Hop Concert Tours',
    'Talent Discovery', 'Record Label', 'Uncut Studio Freestyles'
  ],
  authors: [{ name: 'WorldStarHipHop Executive Board' }],
  metadataBase: new URL('https://worldstarhiphop.com'),
  alternates: {
    canonical: 'https://worldstarhiphop.com',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'WSHH',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  openGraph: {
    title: 'WorldStarHipHop | Premier Rap & Hip-Hop Media Platform',
    description: 'The premier global destination for official Rap and Hip-Hop music videos, talent discovery, executive publishing, and artist Spotlight profiles.',
    url: 'https://worldstarhiphop.com',
    siteName: 'WorldStarHipHop',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'WorldStarHipHop Flagship Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorldStarHipHop | Premier Rap & Hip-Hop Media Platform',
    description: 'The premier global destination for official Rap and Hip-Hop music videos, talent discovery, and artist Spotlight profiles.',
    images: ['/logo.png'],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-obsidian text-zinc-100 min-h-screen flex flex-col antialiased font-sans">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
