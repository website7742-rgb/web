import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions of Service',
  description: 'Official Terms of Service and acceptable use agreement governing user submissions, media streaming, and platform access on WorldStar Hip Hop.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | WorldStar Hip Hop',
    description: 'Official Terms of Service and acceptable use agreement governing user submissions, media streaming, and platform access on WorldStar Hip Hop.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/terms` : 'https://www.worldstarhiphop.world/terms',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
