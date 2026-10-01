import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import { RosterPageClient } from '@/components/features/roster/RosterPageClient';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string; genre?: string; q?: string };
}): Promise<Metadata> {
  const pageNum = searchParams.page ? parseInt(searchParams.page, 10) : 1;
  const validPage = isNaN(pageNum) || pageNum < 1 ? 1 : pageNum;
  const canonicalPath = validPage > 1 ? `/roster?page=${validPage}` : '/roster';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');
  const title = validPage > 1
    ? `Official Artist Roster & Talent Directory - Page ${validPage} | WorldStar Hip Hop`
    : 'Official Artist Roster & Talent Directory | WorldStar Hip Hop';

  return {
    title,
    description: 'Explore verified WorldStar Hip Hop recording artists, chart-topping lyricists, platinum producers, discographies, and streaming statistics.',
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description: 'Explore verified WorldStar Hip Hop recording artists, chart-topping lyricists, platinum producers, discographies, and streaming statistics.',
      url: `${siteUrl}${canonicalPath}`,
      siteName: 'WorldStar Hip Hop',
    },
  };
}

export default function RosterPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-20 flex flex-col items-center justify-center text-zinc-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="text-xs font-mono uppercase tracking-widest">Loading artist roster...</p>
        </div>
      }
    >
      <RosterPageClient />
    </Suspense>
  );
}
