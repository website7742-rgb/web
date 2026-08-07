import React from 'react';
import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { ArtistFirstHomeClient } from '@/components/features/home/ArtistFirstHomeClient';
import { HeroHighlight } from '@/components/HeroHighlight';
import { videoRepository } from '@/lib/repositories/VideoRepository';
import { TrackFeed } from '@/components/feed/TrackFeed';

export const revalidate = 60; // Next.js ISR: Revalidates the page every 60 seconds for fast loads with fresh data

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
  const latestVideos = await videoRepository.getLatestVideos(200);

  // Statically cacheable Supabase client (no cookies used to prevent forcing Dynamic Rendering)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll() { return []; }, setAll() {} }
  });

  // Fetch only APPROVED tracks
  const { data: approvedTracks } = await supabase
    .from('submissions')
    .select('id, user_id, created_at, track_title, genre, media_url, profiles(full_name)')
    .eq('status', 'APPROVED')
    .order('created_at', { ascending: false })
    .limit(12);

  return (
    <div className="bg-gradient-to-b from-black via-[#08080a] to-black text-white min-h-screen font-sans w-full pb-20 py-6 sm:py-8">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <HeroHighlight video={featuredVideo} />
        
        {/* PUBLIC APPROVED DROPS FEED */}
        {approvedTracks && approvedTracks.length > 0 && (
          <TrackFeed tracks={approvedTracks} />
        )}
        
        <ArtistFirstHomeClient latestVideos={latestVideos} />
      </div>
    </div>
  );
}
