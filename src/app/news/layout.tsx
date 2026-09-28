import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hip-Hop Journalism & Editorial Newsroom',
  description: 'Original reporting, deep A&R analysis, Grammy coverage, and executive interviews from the WorldStar Hip Hop editorial desk.',
  alternates: {
    canonical: '/news',
  },
  openGraph: {
    title: 'WorldStar Hip Hop Journalism & Newsroom',
    description: 'Original reporting, deep A&R analysis, Grammy coverage, and executive interviews from the WorldStar Hip Hop editorial desk.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/news` : 'https://www.worldstarhiphop.world/news',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const newsStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "WorldStar Hip Hop Newsroom & Editorial",
    "description": "Original reporting, deep A&R analysis, Grammy coverage, and executive interviews from the WorldStar Hip Hop editorial desk.",
    "url": `${siteUrl}/news`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsStructuredData),
        }}
      />
      {children}
    </>
  );
}
