import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Music Video & Demo | WorldStar Hip Hop A&R Portal',
  description: 'Submit your official rap & hip-hop music videos for front-page premiere consideration on WorldStar Hip Hop. Direct executive A&R submission portal with multi-format streaming review.',
  alternates: {
    canonical: '/submit',
  },
  openGraph: {
    title: 'Submit Music Video & Demo | WorldStar Hip Hop A&R Portal',
    description: 'Submit your official rap & hip-hop music videos for front-page premiere consideration on WorldStar Hip Hop. Direct executive A&R submission portal.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/submit` : 'https://www.worldstarhiphop.world/submit',
    siteName: 'WorldStar Hip Hop',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WorldStar Hip Hop Submission Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit Music Video & Demo | WorldStar Hip Hop A&R Portal',
    description: 'Submit your official rap & hip-hop music videos for front-page premiere consideration on WorldStar Hip Hop.',
    images: ['/og-image.png'],
    creator: '@worldstar',
  },
};

export default function SubmitLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const submissionStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "WorldStar Hip Hop Video & Demo Submission",
    "serviceType": "Music Video Premiere & A&R Review",
    "provider": {
      "@type": "Organization",
      "name": "WorldStar Hip Hop",
      "url": siteUrl,
    },
    "description": "Direct artist music video and audio demo submission portal for front-page premiere consideration.",
    "url": `${siteUrl}/submit`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(submissionStructuredData),
        }}
      />
      {children}
    </>
  );
}
