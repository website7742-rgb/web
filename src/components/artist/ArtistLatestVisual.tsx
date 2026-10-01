'use client';

import React, { useState, useEffect } from 'react';
import { Video, ExternalLink, Play, Disc } from 'lucide-react';
import { ArtistVideoResult } from '@/services/ArtistVideoService';

interface ArtistLatestVisualProps {
  artistName: string;
  artistSlug?: string;
  youtubeChannelUrl?: string;
  initialVideoId?: string | null;
}

export default function ArtistLatestVisual({
  artistName,
  artistSlug,
  youtubeChannelUrl,
  initialVideoId,
}: ArtistLatestVisualProps) {
  const [videoData, setVideoData] = useState<ArtistVideoResult | null>(
    initialVideoId
      ? {
          status: 'MATCHED',
          videoId: initialVideoId,
          embedUrl: `https://www.youtube.com/embed/${initialVideoId}?rel=0`,
          title: `${artistName} Official Visual`,
          channelName: artistName,
          thumbnailUrl: `https://i.ytimg.com/vi/${initialVideoId}/hqdefault.jpg`,
          source: 'existing_video',
        }
      : null
  );
  const [isLoading, setIsLoading] = useState(!initialVideoId);

  useEffect(() => {
    let isMounted = true;

    async function fetchVideo() {
      // If we already have a confirmed initial video, still attempt background fresh resolution if needed
      try {
        const params = new URLSearchParams({
          name: artistName,
        });
        if (artistSlug) params.set('slug', artistSlug);
        if (youtubeChannelUrl) params.set('channelUrl', youtubeChannelUrl);

        const res = await fetch(`/api/artist/video?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`API returned HTTP ${res.status}`);
        }

        const data: { success: boolean } & ArtistVideoResult = await res.json();
        if (isMounted) {
          if (data.status === 'MATCHED' && data.videoId) {
            setVideoData(data);
          } else if (!initialVideoId) {
            setVideoData({
              status: 'UNAVAILABLE',
              videoId: null,
              embedUrl: null,
              title: null,
              channelName: null,
              thumbnailUrl: null,
              source: 'fallback_none',
            });
          }
        }
      } catch {
        if (isMounted && !initialVideoId) {
          setVideoData({
            status: 'UNAVAILABLE',
            videoId: null,
            embedUrl: null,
            title: null,
            channelName: null,
            thumbnailUrl: null,
            source: 'fallback_none',
          });
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchVideo();

    return () => {
      isMounted = false;
    };
  }, [artistName, artistSlug, youtubeChannelUrl, initialVideoId]);

  return (
    <section className="space-y-6">
      {/* ⭐ Section Header - Visual match to WorldStar Platform Spec */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
          <Video className="w-7 h-7 text-red-500 flex-shrink-0" />
          <span>LATEST DROP & OFFICIAL VISUAL</span>
        </h2>
        <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
          FEATURED EMBED
        </span>
      </div>

      {/* ⭐ 16:9 Aspect Video Container */}
      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl hover:shadow-[0_0_40px_rgba(220,38,38,0.2)] transition-shadow duration-500 relative">
        {/* CASE 1: Video Resolved & Active */}
        {videoData?.status === 'MATCHED' && videoData.videoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoData.videoId}?rel=0`}
            title={videoData.title || `${artistName} Latest Official Music Video`}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isLoading ? (
          /* CASE 2: Loading Skeleton (Zero Layout Shift) */
          <div className="w-full h-full bg-zinc-950 flex flex-col items-center justify-center p-6 space-y-4 animate-pulse">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600">
              <Disc className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-red-500/50" />
            </div>
            <div className="space-y-2 text-center max-w-sm">
              <div className="h-4 bg-white/10 rounded-full w-48 mx-auto" />
              <div className="h-3 bg-white/5 rounded-full w-32 mx-auto" />
            </div>
          </div>
        ) : (
          /* CASE 3: Branded Fallback (Zero Broken Iframes, Zero Unavailable Errors) */
          <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-gradient-to-b from-zinc-900/60 to-zinc-950/90 backdrop-blur-sm select-none">
            {/* Ambient Background Accents */}
            <div className="absolute inset-0 bg-red-600/5 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_25px_rgba(220,38,38,0.25)]">
                <Video className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 font-mono text-[11px] font-bold uppercase tracking-wider">
                  <Play className="w-3 h-3 text-red-500 fill-current" />
                  <span>PREMIERE VAULT</span>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                  OFFICIAL VISUAL PREMIERE COMING SOON
                </h3>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
                  Stay tuned for upcoming official video drops and visuals from {artistName}.
                </p>
              </div>

              {youtubeChannelUrl && (
                <div className="pt-2">
                  <a
                    href={youtubeChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors min-h-[44px] min-w-[44px] shadow-lg shadow-red-950/40"
                  >
                    <span>Visit Official Channel</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
