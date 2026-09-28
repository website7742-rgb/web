import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Music Industry Charts & Hot 100 Rankings',
  description: 'The definitive weekly rankings of songs, albums, and artists based on multi-platform streaming, physical sales, and digital airplay.',
  alternates: {
    canonical: '/charts',
  },
  openGraph: {
    title: 'WorldStar Hip Hop Official Charts & Rankings',
    description: 'The definitive weekly rankings of songs, albums, and artists based on multi-platform streaming, physical sales, and digital airplay.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/charts` : 'https://www.worldstarhiphop.world/charts',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function ChartsLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const chartsStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "WorldStar Hip Hop Official Charts",
    "description": "Weekly music industry rankings including WorldStar Hot 100, Global 200, and Billboard 200 Albums.",
    "url": `${siteUrl}/charts`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(chartsStructuredData),
        }}
      />
      {children}
    </>
  );
}
