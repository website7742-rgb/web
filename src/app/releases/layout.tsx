import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Official Master Discography & Record Releases',
  description: 'Browse official albums, deluxe EPs, vinyl pressings, and singles released across the WorldStar Hip Hop publishing catalog.',
  alternates: {
    canonical: '/releases',
  },
  openGraph: {
    title: 'WorldStar Hip Hop Discography & Record Releases',
    description: 'Browse official albums, deluxe EPs, vinyl pressings, and singles released across the WorldStar Hip Hop publishing catalog.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/releases` : 'https://www.worldstarhiphop.world/releases',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function ReleasesLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const releasesStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "WorldStar Hip Hop Record Releases",
    "description": "Browse official albums, deluxe EPs, vinyl pressings, and singles released across the WorldStar Hip Hop publishing catalog.",
    "url": `${siteUrl}/releases`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(releasesStructuredData),
        }}
      />
      {children}
    </>
  );
}
