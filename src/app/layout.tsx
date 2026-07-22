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

export const metadata: Metadata = {
  title: {
    default: 'Aetheria Music Group | Global Record Label',
    template: '%s | Aetheria',
  },
  description: 'The premier U.S. independent record label and publishing house. Discover the voices shaping global culture, exploring our world-class artist roster, chart data, and A&R submissions.',
  keywords: ['Record Label', 'Music Publishing', 'A&R', 'Aetheria Music Group', 'Artist Management', 'Global Music', 'Record Deal'],
  authors: [{ name: 'Aetheria Music Group' }],
  metadataBase: new URL('https://aetheria-music.com'),
  openGraph: {
    title: 'Aetheria Music Group | Global Record Label',
    description: 'The premier U.S. independent record label and publishing house. Discover the voices shaping global culture.',
    url: 'https://aetheria-music.com',
    siteName: 'Aetheria Music Group',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&h=630&q=80',
        width: 1200,
        height: 630,
        alt: 'Aetheria Music Group Headquarters',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aetheria Music Group | Global Record Label',
    description: 'The premier U.S. independent record label and publishing house. Discover the voices shaping global culture.',
    images: ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&h=630&q=80'],
    creator: '@aetheriamusic',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark scroll-smooth ${oswald.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
      </head>
      <body className="bg-obsidian text-zinc-100 min-h-screen flex flex-col antialiased font-sans">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
