import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Concert Dates, Festivals & Live Tour Schedule',
  description: 'Official concert schedule, festival appearances, and arena tour dates for WorldStar Hip Hop recording artists.',
  alternates: {
    canonical: '/tour',
  },
  openGraph: {
    title: 'WorldStar Live Concerts & Tour Dates',
    description: 'Official concert schedule, festival appearances, and arena tour dates for WorldStar Hip Hop recording artists.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/tour` : 'https://www.worldstarhiphop.world/tour',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function TourLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const tourStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "WorldStar Hip Hop Tour Dates & Live Concerts",
    "description": "Official concert schedule, festival appearances, and arena tour dates for WorldStar Hip Hop recording artists.",
    "url": `${siteUrl}/tour`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(tourStructuredData),
        }}
      />
      {children}
    </>
  );
}
