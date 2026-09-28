import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Protection Notice',
  description: 'WorldStar Hip Hop comprehensive Privacy Policy explaining how user data is collected, processed, and protected under CCPA, CPRA, and GDPR standards.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | WorldStar Hip Hop',
    description: 'WorldStar Hip Hop comprehensive Privacy Policy explaining how user data is collected, processed, and protected under CCPA, CPRA, and GDPR standards.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/privacy` : 'https://www.worldstarhiphop.world/privacy',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
