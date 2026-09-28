import React from 'react';
import { Metadata } from 'next';
import { Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';
import { TrendingVideosGrid } from '@/components/TrendingVideosGrid';
import { unifiedVideoService } from '@/services/UnifiedVideoService';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Official Rap & Hip-Hop Music Videos | WorldStar',
  description: 'Stream official hip-hop music videos, exclusive WorldStar premieres, uncut studio sessions, and trending rap visuals.',
  alternates: {
    canonical: '/videos',
  },
  openGraph: {
    title: 'Official Rap & Hip-Hop Music Videos | WorldStar',
    description: 'Stream official hip-hop music videos, exclusive WorldStar premieres, uncut studio sessions, and trending rap visuals.',
    url: process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/videos` : 'https://www.worldstarhiphop.world/videos',
    siteName: 'WorldStar Hip Hop',
  },
};

export default async function DedicatedVideosPage() {
  const unifiedVideos = await unifiedVideoService.getAllUnifiedVideos();
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const videoStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "WorldStar Official Hip-Hop Music Videos",
    "description": "Stream official hip-hop music videos, exclusive WorldStar premieres, uncut studio sessions, and trending rap visuals.",
    "url": `${siteUrl}/videos`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": unifiedVideos.slice(0, 15).map((vid, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "item": {
          "@type": "VideoObject",
          "name": vid.title,
          "description": `Official music video: ${vid.title} performed by ${vid.artistName || 'WorldStar Artist'}.`,
          "thumbnailUrl": vid.thumbnailUrl,
          "uploadDate": vid.publishedAt || "2026-01-01T00:00:00Z",
          "embedUrl": vid.embedUrl,
          "url": vid.videoUrl || `${siteUrl}/videos`
        }
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoStructuredData)
        }}
      />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 sm:py-12 space-y-10 animate-in fade-in duration-500">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WORLDSTAR VIDEO HUB</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
              OFFICIAL <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">MUSIC VIDEOS</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl font-sans">
              Stream all official hip-hop releases, curated premieres, and exclusive WorldStar visuals.
            </p>
          </div>

          {/* SUBMIT VIDEO CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/submit-demo"
              className="bg-red-600 hover:bg-red-500 text-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>SUBMIT VIDEO</span>
            </Link>
          </div>
        </div>

        {/* ONE UNIFIED VIDEO HUB GRID */}
        <TrendingVideosGrid
          videos={unifiedVideos}
          title="LATEST HIP-HOP DROPS"
          subtitle="The latest official music videos, exclusive hip-hop drops, and trending tracks."
          pageSize={16}
          showSearchBar={true}
        />

      </div>
    </>
  );
}
