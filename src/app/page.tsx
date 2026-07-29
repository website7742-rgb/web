import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Metadata } from 'next';

import { VideoCard } from '@/components/features/home/VideoCard';
import { AdCard } from '@/components/features/home/AdCard';
import { RosterSliderClient } from '@/components/features/home/RosterSliderClient';

import { FALLBACK_DATA } from '@/constants';
import { injectAds } from '@/lib/utils/injectAds';

export const metadata: Metadata = {
  title: 'Worldstar Hip Hop | Home',
  description: 'The premier destination for hip hop news, videos, and music.',
  openGraph: {
    title: 'Worldstar Hip Hop | Home',
    description: 'The premier destination for hip hop news, videos, and music.',
    url: 'https://worldstarhiphop.com',
    siteName: 'Worldstar Hip Hop',
    images: [
      {
        url: 'https://worldstarhiphop.com/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function HomePage() {
  const featured = FALLBACK_DATA[0];
  const restVideos = FALLBACK_DATA.slice(1);
  
  // Compute arrays on the server-side before rendering
  const grid1 = restVideos.slice(0, 16);
  const grid1WithAds = injectAds(grid1);
  
  const grid2 = restVideos.slice(16, 32);
  const grid2WithAds = grid2.length > 0 ? injectAds(grid2) : [];

  return (
    <div className="bg-black text-white min-h-screen font-sans w-full pb-20 pt-[60px] sm:pt-[80px]">
      <div className="max-w-[1400px] mx-auto px-2 sm:px-4 space-y-8">
        
        {/* 1. EXCLUSIVE ROSTER (Client Component) */}
        <section className="w-full pt-4">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-1 h-7 bg-red-600 rounded-full" />
              <h2 className="text-white font-black uppercase text-lg md:text-xl tracking-widest">
                TOP <span className="text-red-600">ARTISTS</span>
              </h2>
            </div>
            <Link
              href="/roster"
              className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-zinc-400 hover:text-white transition-colors tracking-wider border border-zinc-700 hover:border-red-600 px-3 py-1.5 rounded-sm"
            >
              View All
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <RosterSliderClient />
        </section>

        {/* 2. TOP FEATURED VIDEO */}
        <section className="w-full border-[3px] border-red-600 p-0.5 bg-[#0a0a0a] shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          <a href={featured.videoLink} target="_blank" rel="noopener noreferrer" className="group block relative">
            <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden bg-zinc-900">
              <Image
                src={featured.imageUrl}
                alt={featured.title}
                fill
                sizes="100vw"
                priority
                className="object-cover filter brightness-[0.85] group-hover:brightness-100 transition-all duration-200"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-600/90 flex items-center justify-center border-2 border-white/50 shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white fill-white ml-1.5 sm:ml-2" aria-hidden="true" />
                </div>
              </div>
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 uppercase tracking-widest border border-white/20">
                FEATURED
              </div>
            </div>
            <div className="p-3 sm:p-5 bg-[#0a0a0a] border-t-2 border-red-600/50">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-red-600 uppercase leading-[1.1] group-hover:underline decoration-red-600 mb-1.5">
                {featured.title}
              </h1>
              <div className="flex items-center gap-3 text-[10px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">
                <span>{featured.views}</span><span>|</span><span>{featured.posted}</span>
              </div>
            </div>
          </a>
        </section>

        {/* 3. TODAY'S VIDEOS HEADER */}
        <div className="bg-[#111] border-l-4 border-red-600 px-3 py-2 flex items-center justify-between border-y border-y-[#222]">
          <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-tight">
            TODAY&apos;S <span className="text-red-600">VIDEOS</span>
          </h2>
          <span className="text-[10px] text-zinc-500 font-bold uppercase">JULY 23, 2026</span>
        </div>

        {/* GRID 1 */}
        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
          {grid1WithAds.map((item) =>
            'isAd' in item ? (
              <AdCard key={item.id} item={item as any} />
            ) : (
              <VideoCard key={item.id} item={item as any} />
            )
          )}
        </section>

        {/* DATE DIVIDER */}
        <div className="w-full bg-[#0a0a0a] py-1.5 border-y border-[#333] text-center">
          <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-widest">JULY 22, 2026</span>
        </div>

        {/* GRID 2 */}
        {grid2WithAds.length > 0 && (
          <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
            {grid2WithAds.map((item) =>
              'isAd' in item ? (
                <AdCard key={item.id} item={item as any} />
              ) : (
                <VideoCard key={item.id} item={item as any} />
              )
            )}
          </section>
        )}

      </div>
    </div>
  );
}
