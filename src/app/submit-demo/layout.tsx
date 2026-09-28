import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Submit Music Video & Demo Track to WorldStar A&R',
  description: 'Submit your original music video, studio freestyle, or demo track to the WorldStar Hip Hop executive A&R committee for premiere consideration.',
  alternates: {
    canonical: '/submit-demo',
  },
  openGraph: {
    title: 'Submit Music Video & Demo Track | WorldStar Hip Hop',
    description: 'Submit your original music video, studio freestyle, or demo track to the WorldStar Hip Hop executive A&R committee for premiere consideration.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/submit-demo` : 'https://www.worldstarhiphop.world/submit-demo',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function SubmitDemoLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const submissionStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "WorldStar Hip Hop Demo & Video Submission Portal",
    "description": "Submit your original music video, studio freestyle, or demo track to the WorldStar Hip Hop executive A&R committee for premiere consideration.",
    "url": `${siteUrl}/submit-demo`,
    "publisher": {
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
          __html: JSON.stringify(submissionStructuredData),
        }}
      />
      {children}
    </>
  );
}
