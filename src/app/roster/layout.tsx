import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Artist Roster & Talent Directory',
  description: 'Explore verified WorldStar Hip Hop recording artists, chart-topping lyricists, platinum producers, discographies, and streaming statistics.',
  alternates: {
    canonical: '/roster',
  },
  openGraph: {
    title: 'WorldStar Hip Hop Artist Roster & Directory',
    description: 'Explore verified WorldStar Hip Hop recording artists, chart-topping lyricists, platinum producers, discographies, and streaming statistics.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/roster` : 'https://www.worldstarhiphop.world/roster',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function RosterLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const rosterStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "WorldStar Hip Hop Artist Roster",
    "description": "Explore verified WorldStar Hip Hop recording artists, chart-topping lyricists, platinum producers, discographies, and streaming statistics.",
    "url": `${siteUrl}/roster`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(rosterStructuredData),
        }}
      />
      {children}
    </>
  );
}
