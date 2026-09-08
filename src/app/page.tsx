import React from 'react';
import { Metadata } from 'next';
import { createServerClient } from '@supabase/ssr';
import { ArtistFirstHomeClient } from '@/components/features/home/ArtistFirstHomeClient';
import { HeroHighlight } from '@/components/HeroHighlight';
import { videoRepository } from '@/lib/repositories/VideoRepository';
import { TrackFeed } from '@/components/feed/TrackFeed';
import { youtubeService, AggregatedVideo } from '@/services/YoutubeService';

import { OFFICIAL_100_VIDEOS } from '@/data/official100Videos';

const CANONICAL_HOME_VIDEOS: AggregatedVideo[] = OFFICIAL_100_VIDEOS.map((track) => ({
  videoId: track.videoId !== 'NONE' ? track.videoId : `unresolved-${track.rank}`,
  title: `${track.requestedSong} — ${track.requestedArtist}`,
  thumbnailUrl: track.thumbnailUrl || (track.videoId !== 'NONE' ? `https://i.ytimg.com/vi/${track.videoId}/hqdefault.jpg` : '/images/placeholders/video-placeholder.jpg'),
  channelName: track.channel !== 'NONE' ? track.channel : track.requestedArtist,
  artistName: track.requestedArtist,
  embedUrl: track.embedUrl || (track.videoId !== 'NONE' ? `https://www.youtube.com/embed/${track.videoId}?autoplay=1&rel=0` : ''),
  youtubeUrl: track.youtubeUrl || (track.videoId !== 'NONE' ? `https://www.youtube.com/watch?v=${track.videoId}` : ''),
  publishedAt: '2026-01-01T00:00:00Z',
  genre: 'Hip-Hop',
  rank: track.rank,
  requestedSong: track.requestedSong,
  requestedArtist: track.requestedArtist,
  channelType: track.channelType,
  status: track.status,
}));

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
  let latestVideos: AggregatedVideo[] = CANONICAL_HOME_VIDEOS;
  try {
    const ytResult = await youtubeService.fetchLatestHipHopVideos({ limit: 100 });
    if (ytResult.success && ytResult.videos.length > 0) {
      latestVideos = ytResult.videos;
    }
  } catch {
    latestVideos = CANONICAL_HOME_VIDEOS;
  }

  // Statically cacheable Supabase client (no cookies used to prevent forcing Dynamic Rendering)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: { getAll() { return []; }, setAll() {} }
  });

  // Fetch only APPROVED tracks with resilient profiles lookup
  let approvedTracks: any[] = [];
  try {
    const { data: rawTracks, error: tracksErr } = await supabase
      .from('submissions')
      .select('id, artist_id, created_at, track_title, genre, media_url')
      .eq('status', 'APPROVED')
      .order('created_at', { ascending: false })
      .limit(12);

    if (!tracksErr && rawTracks && rawTracks.length > 0) {
      const artistIds = Array.from(new Set(rawTracks.map((t: any) => t.artist_id).filter(Boolean)));
      const profileMap: Record<string, { full_name: string }> = {};

      if (artistIds.length > 0) {
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', artistIds);

        if (profilesData) {
          profilesData.forEach((p: any) => {
            profileMap[p.id] = { full_name: p.full_name || 'WorldStar Artist' };
          });
        }
      }

      approvedTracks = rawTracks.map((track: any) => ({
        ...track,
        profiles: profileMap[track.artist_id] || { full_name: 'WorldStar Artist' },
        likes: [{ count: 0 }],
        comments: [{ count: 0 }],
      }));
    }
  } catch (err) {
    console.error('[HomePage] Error fetching approved submissions:', err);
  }

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
