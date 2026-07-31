import React from 'react';
import { Metadata } from 'next';
import { FALLBACK_DATA } from '@/constants';
import { ArtistFirstHomeClient } from '@/components/features/home/ArtistFirstHomeClient';

import { HeroHighlight } from '@/components/HeroHighlight';
import { videoRepository } from '@/lib/repositories/VideoRepository';

export const metadata: Metadata = {
  title: 'WorldStarHipHop | Premier Rap & Hip-Hop Media Platform',
  description: 'The premier destination for hip hop artists, talent discovery, executive publishing, and music.',
  icons: {
    icon: '/favicon.png?v=5',
    shortcut: '/favicon.png?v=5',
    apple: '/favicon.png?v=5',
  },
  openGraph: {
    title: 'WorldstarHipHop',
    description: 'The premier destination for hip hop artists, talent discovery, executive publishing, and music.',
    url: 'https://worldstarhiphop.com',
    siteName: 'WorldstarHipHop',
  },
};

export default async function HomePage() {
  const featuredVideo = await videoRepository.getFeaturedVideo();
  const latestVideos = await videoRepository.getLatestVideos(8);

  return (
    <div className="bg-gradient-to-b from-black via-[#08080a] to-black text-white min-h-screen font-sans w-full pb-20 pt-[70px] sm:pt-[90px]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <HeroHighlight video={featuredVideo} />
        <ArtistFirstHomeClient latestVideos={latestVideos} />
      </div>
    </div>
  );
}
