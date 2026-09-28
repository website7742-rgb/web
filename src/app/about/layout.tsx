import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About WorldStar Hip Hop — Heritage, Culture & Institutional Vision',
  description: 'Learn about the history, institutional milestones, global headquarters, and executive vision behind WorldStar Hip Hop.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About WorldStar Hip Hop — Heritage & Vision',
    description: 'Learn about the history, institutional milestones, global headquarters, and executive vision behind WorldStar Hip Hop.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/about` : 'https://www.worldstarhiphop.world/about',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About WorldStar Hip Hop",
    "description": "Learn about the history, institutional milestones, global headquarters, and executive vision behind WorldStar Hip Hop.",
    "url": `${siteUrl}/about`,
    "mainEntity": {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "WorldStar Hip Hop"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutStructuredData),
        }}
      />
      {children}
    </>
  );
}
