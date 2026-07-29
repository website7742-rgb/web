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
  title: 'WorldstarHipHop',
  description: 'The hottest hip hop talent, news, and videos.',
  keywords: ['Hip Hop', 'Rap', 'Music Videos', 'Viral', 'WorldstarHipHop', 'WSHH', 'Worldstar'],
  authors: [{ name: 'WorldstarHipHop' }],
  metadataBase: new URL('https://worldstarhiphop.com'),
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
    title: 'WorldstarHipHop',
    description: 'The hottest hip hop talent, news, and videos.',
    url: 'https://worldstarhiphop.com',
    siteName: 'WorldstarHipHop',
    images: [
      {
        url: '/branding/WORLDSTARHIPHOP_id7LUag0YE_1.png',
        width: 1200,
        height: 630,
        alt: 'WorldstarHipHop Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WorldstarHipHop',
    description: 'The hottest hip hop talent, news, and videos.',
    images: ['/branding/WORLDSTARHIPHOP_id7LUag0YE_1.png'],
    creator: '@worldstar',
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
        <link rel="icon" href="/icon.png?v=1" type="image/png" sizes="any" />
      </head>
      <body className="bg-obsidian text-zinc-100 min-h-screen flex flex-col antialiased font-sans">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
