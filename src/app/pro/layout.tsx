import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WorldStar PRO — Premium Publishing & Artist Suite',
  description: 'Join WorldStar PRO. Professional creator suite featuring priority A&R review, high-definition streaming, analytics telemetry, and direct distribution.',
  alternates: {
    canonical: '/pro',
  },
  openGraph: {
    title: 'WorldStar PRO | Creator Suite',
    description: 'Join WorldStar PRO. Professional creator suite featuring priority A&R review, high-definition streaming, analytics telemetry, and direct distribution.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/pro` : 'https://www.worldstarhiphop.world/pro',
    siteName: 'WorldStar Hip Hop',
  },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
