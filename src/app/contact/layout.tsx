import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact WorldStar Hip Hop — Support, Advertising, A&R & Press',
  description: 'Get in touch with WorldStar Hip Hop. Dedicated executive communications desks for technical support, advertising, artist submissions, and press.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact WorldStar Hip Hop — Executive Communications',
    description: 'Get in touch with WorldStar Hip Hop. Dedicated executive communications desks for technical support, advertising, artist submissions, and press.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/contact` : 'https://www.worldstarhiphop.world/contact',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const contactStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "name": "Contact WorldStar Hip Hop",
        "description": "Executive communications and inquiry desk for WorldStar Hip Hop.",
        "url": `${siteUrl}/contact`,
        "mainEntity": {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "email": "support@worldstarhiphop.world"
            },
            {
              "@type": "ContactPoint",
              "contactType": "Advertising Inquiries",
              "email": "ads@worldstarhiphop.world"
            },
            {
              "@type": "ContactPoint",
              "contactType": "Artist Submissions & A&R",
              "email": "submissions@worldstarhiphop.world"
            },
            {
              "@type": "ContactPoint",
              "contactType": "Press & Legal Inquiries",
              "email": "press@worldstarhiphop.world"
            }
          ]
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How long does it take to receive a response from WorldStar Hip Hop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our executive communications desk operates Monday through Saturday. General support inquiries are answered within 24 hours, while urgent business and press inquiries receive priority routing within 12 hours."
            }
          },
          {
            "@type": "Question",
            "name": "How can independent artists submit music videos or demo tracks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Artists can submit demos and music videos directly through our online submission portal at /submit-demo, or email submissions@worldstarhiphop.world with media links and artist biography."
            }
          },
          {
            "@type": "Question",
            "name": "Where can brands and agencies inquire about advertising on WorldStar Hip Hop?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Advertisers and media agencies can contact ads@worldstarhiphop.world or review advertising options at /advertise."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactStructuredData),
        }}
      />
      {children}
    </>
  );
}
