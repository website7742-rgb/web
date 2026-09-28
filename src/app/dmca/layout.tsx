import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DMCA Copyright Policy & Notice Procedure',
  description: 'Digital Millennium Copyright Act compliance notice, copyright infringement claim procedures, and designated agent contacts for WorldStar Hip Hop.',
  alternates: {
    canonical: '/dmca',
  },
  openGraph: {
    title: 'DMCA Copyright Policy | WorldStar Hip Hop',
    description: 'Digital Millennium Copyright Act compliance notice, copyright infringement claim procedures, and designated agent contacts for WorldStar Hip Hop.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/dmca` : 'https://www.worldstarhiphop.world/dmca',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function DmcaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
