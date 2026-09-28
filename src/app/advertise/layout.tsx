import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Advertise on WorldStar Hip Hop — Media Kit & Brand Partnerships',
  description: 'Reach millions of dedicated hip-hop fans. High-impact video takeovers, sponsored premieres, and custom brand activations on WorldStar Hip Hop.',
  alternates: {
    canonical: '/advertise',
  },
  openGraph: {
    title: 'Advertise on WorldStar Hip Hop',
    description: 'Reach millions of dedicated hip-hop fans. High-impact video takeovers, sponsored premieres, and custom brand activations on WorldStar Hip Hop.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/advertise` : 'https://www.worldstarhiphop.world/advertise',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function AdvertiseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
