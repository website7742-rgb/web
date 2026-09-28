import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EU Digital Services Act (DSA) Compliance Statement',
  description: 'Information on single points of contact, legal representatives, and active recipients under the EU Digital Services Act for WorldStar Hip Hop.',
  alternates: {
    canonical: '/eudsa',
  },
  openGraph: {
    title: 'EU Digital Services Act Statement | WorldStar Hip Hop',
    description: 'Information on single points of contact, legal representatives, and active recipients under the EU Digital Services Act for WorldStar Hip Hop.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/eudsa` : 'https://www.worldstarhiphop.world/eudsa',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function EudsaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
