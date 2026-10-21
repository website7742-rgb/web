'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Flame, X, ArrowUpRight, Copy, ExternalLink, TrendingUp, Sparkles } from 'lucide-react';
import { AggregatedVideo } from '@/services/YoutubeService';
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';
import { getYouTubeThumbnail } from '@/lib/utils';
import { useData } from '@/providers/DataContext';

interface HeroHighlightProps {
  video?: AggregatedVideo;
  trendingVideos?: AggregatedVideo[];
}

// Fallback trending drops if none provided
const DEFAULT_TRENDING: AggregatedVideo[] = [
  {
    videoId: 'q3pI2z36U0Q',
    title: 'KENDRICK LAMAR — NOT LIKE US (OFFICIAL MUSIC VIDEO)',
    thumbnailUrl: 'https://i.ytimg.com/vi/q3pI2z36U0Q/hqdefault.jpg',
    channelName: 'Kendrick Lamar',
    artistName: 'Kendrick Lamar',
    embedUrl: 'https://www.youtube.com/embed/q3pI2z36U0Q?autoplay=1&rel=0',
    youtubeUrl: 'https://www.youtube.com/watch?v=q3pI2z36U0Q',
    publishedAt: new Date().toISOString(),
    genre: 'Hip-Hop',
    rank: 1,
  },
  {
    videoId: 'c_Kk1eWvP5Q',
    title: 'DRAKE FT. 21 SAVAGE — IT’S UP (STUDIO PREMIERE)',
    thumbnailUrl: 'https://i.ytimg.com/vi/c_Kk1eWvP5Q/hqdefault.jpg',
    channelName: 'Drake',
    artistName: 'Drake',
    embedUrl: 'https://www.youtube.com/embed/c_Kk1eWvP5Q?autoplay=1&rel=0',
    youtubeUrl: 'https://www.youtube.com/watch?v=c_Kk1eWvP5Q',
    publishedAt: new Date().toISOString(),
    genre: 'Hip-Hop',
    rank: 2,
  },
  {
    videoId: '4pG0w2d3Y7g',
    title: 'J. COLE FT. FUTURE — RUN A TRAIN (EXCLUSIVE DROP)',
    thumbnailUrl: 'https://i.ytimg.com/vi/4pG0w2d3Y7g/hqdefault.jpg',
    channelName: 'J. Cole',
    artistName: 'J. Cole',
    embedUrl: 'https://www.youtube.com/embed/4pG0w2d3Y7g?autoplay=1&rel=0',
    youtubeUrl: 'https://www.youtube.com/watch?v=4pG0w2d3Y7g',
    publishedAt: new Date().toISOString(),
    genre: 'Hip-Hop',
    rank: 3,
  },
];

export function HeroHighlight({ video, trendingVideos = [] }: HeroHighlightProps) {
  const { siteSettings } = useData();
  const [activeModalVideo, setActiveModalVideo] = useState<{ url: string; title: string } | null>(null);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    setEmbedError(false);
    if (!activeModalVideo) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalVideo(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalVideo]);

  const getSafeEmbedUrl = (url: string) => {
    if (url && url.includes('youtube.com/embed/')) {
      return url.replace('autoplay=1', 'autoplay=0');
    }
    return url;
  };

  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    return match ? match[1] : null;
  };

  const mainVideoId = extractYoutubeId(siteSettings.heroVideoUrl);
  const mainPosterUrl = mainVideoId 
    ? getYouTubeThumbnail(mainVideoId, 'max') 
    : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80';

  // Use passed trending videos or fallbacks (take top 3)
  const displayTrending = (trendingVideos && trendingVideos.length > 0)
    ? trendingVideos.slice(0, 3)
    : DEFAULT_TRENDING;

  // Realistic WorldStar-style duration tags
  const durationTags = ['03:48', '04:12', '03:15'];
  const viewCounts = ['2.8M VIEWS', '1.9M VIEWS', '1.4M VIEWS'];
  const timeTags = ['1 HOUR AGO', '2 HOURS AGO', '4 HOURS AGO'];

  return (
    <>
      <section className="w-full space-y-4 mb-8 sm:mb-12" aria-label="Featured WorldStar Premiere & Trending Rail">
        {/* ICONIC WORLDSTAR SPLIT HERO LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* ============================================================ */}
          {/* LEFT: MAIN FEATURED PREMIERE (65% DESKTOP WIDTH) */}
          {/* ============================================================ */}
          <div className="lg:col-span-8 relative min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex items-end rounded-2xl sm:rounded-3xl border border-white/10 bg-black shadow-2xl group overflow-hidden">
            {/* Background Image / Poster */}
            <div className="absolute inset-0 w-full h-full bg-zinc-950 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mainPosterUrl}
                alt={siteSettings.heroTitle}
                onError={(e) => {
                  if (mainVideoId) {
                    const img = e.currentTarget;
                    const hq = getYouTubeThumbnail(mainVideoId, 'hq');
                    if (img.src !== hq && hq) img.src = hq;
                  }
                }}
                className="w-full h-full object-cover object-center opacity-65 group-hover:scale-105 transition-all duration-1000 will-change-transform"
              />
              {/* Cinematic Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/80 to-transparent" />
            </div>

            {/* TOP RIGHT 3-DOT HERO OPTIONS MENU */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <ThreeDotMenu
                items={[
                  {
                    label: 'WATCH FEATURED PREMIERE',
                    icon: <Play className="w-3.5 h-3.5 text-red-500 fill-current" />,
                    onClick: () => setActiveModalVideo({ url: siteSettings.heroVideoUrl, title: siteSettings.heroTitle }),
                  },
                  {
                    label: 'COPY EMBED LINK',
                    icon: <Copy className="w-3.5 h-3.5 text-zinc-400" />,
                    onClick: () => {
                      if (typeof window !== 'undefined') {
                        navigator.clipboard.writeText(getSafeEmbedUrl(siteSettings.heroVideoUrl));
                      }
                    },
                  },
                  {
                    label: 'WATCH ON YOUTUBE',
                    icon: <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />,
                    onClick: () => {
                      if (typeof window !== 'undefined') {
                        window.open(siteSettings.heroVideoUrl, '_blank');
                      }
                    },
                  },
                  {
                    label: 'EXPLORE ARTIST',
                    icon: <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />,
                    href: siteSettings.heroCtaLink,
                  },
                ]}
                ariaLabel={`Hero options for ${siteSettings.heroTitle}`}
              />
            </div>

            {/* HERO CONTENT */}
            <div className="relative z-10 w-full p-5 sm:p-8 lg:p-10 space-y-4 sm:space-y-5 max-w-4xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-red-600 text-white font-mono text-[11px] sm:text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.7)]">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>FEATURED PREMIERE</span>
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-zinc-300 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                  <span>WORLDSTAR EXCLUSIVE</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="font-black text-white text-2xl xs:text-3xl sm:text-5xl lg:text-5xl uppercase tracking-tight leading-tight break-words drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
                {siteSettings.heroTitle}
              </h1>

              {/* Subtitle / Channel / Metadata */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-zinc-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
                <span className="text-red-500 font-black">{siteSettings.heroSubtitle}</span>
                <span className="text-zinc-600" aria-hidden="true">•</span>
                <span className="text-zinc-300 font-bold">🔥 3.2M VIEWS</span>
                <span className="text-zinc-600" aria-hidden="true">•</span>
                <span className="text-zinc-400">TODAY</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() => setActiveModalVideo({ url: siteSettings.heroVideoUrl, title: siteSettings.heroTitle })}
                  className="bg-red-600 text-white font-mono rounded-none px-6 sm:px-8 py-3.5 sm:py-4 font-black tracking-widest uppercase hover:bg-red-500 transition-all flex items-center gap-2.5 shadow-[0_0_25px_rgba(220,38,38,0.5)] cursor-pointer min-h-[44px] active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>WATCH PREMIERE</span>
                </button>

                <Link
                  href={siteSettings.heroCtaLink}
                  className="bg-black/60 border border-white/30 text-white font-mono rounded-none px-5 sm:px-6 py-3.5 sm:py-4 font-bold tracking-widest uppercase hover:bg-white/10 hover:border-white transition-colors flex items-center gap-2 min-h-[44px]"
                >
                  <span>{siteSettings.heroCtaText}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT: "HOTTEST RIGHT NOW" SIDE RAIL (35% DESKTOP WIDTH) */}
          {/* ============================================================ */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-neutral-950/80 border border-neutral-800/90 rounded-2xl sm:rounded-3xl p-4 sm:p-5 space-y-4">
            
            {/* SIDE RAIL HEADER */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-red-600 rounded-full" />
                <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-white flex items-center gap-1.5 font-display">
                  <span>HOTTEST RIGHT NOW</span>
                  <Flame className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 bg-red-950/50 border border-red-800/60 px-2 py-0.5">
                TOP 3 DROPS
              </span>
            </div>

            {/* STACKED 3 TOP VIDEOS */}
            <div className="flex flex-col gap-3.5 flex-1 justify-around">
              {displayTrending.map((vid, idx) => {
                const vidId = vid.videoId || (vid.id ? String(vid.id) : '');
                const thumb = vid.thumbnailUrl || (vidId && !vidId.startsWith('unresolved') ? `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg` : '/images/placeholders/video-placeholder.svg');
                const rankNumber = idx + 1;
                const embedUrl = vid.embedUrl || (vidId && !vidId.startsWith('unresolved') ? `https://www.youtube.com/embed/${vidId}?autoplay=1&rel=0` : '');

                return (
                  <div
                    key={vidId || idx}
                    onClick={() => {
                      if (embedUrl) {
                        setActiveModalVideo({ url: embedUrl, title: vid.title });
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        if (embedUrl) setActiveModalVideo({ url: embedUrl, title: vid.title });
                      }
                    }}
                    className="group/card flex items-center gap-3.5 p-2 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/60 hover:border-red-600/60 transition-all duration-300 cursor-pointer"
                  >
                    {/* THUMBNAIL WITH RANK & DURATION */}
                    <div className="relative w-28 sm:w-32 aspect-video shrink-0 bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={thumb}
                        alt={vid.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/images/placeholders/video-placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors" />
                      
                      {/* RANK BADGE */}
                      <span className={`absolute top-1 left-1 z-10 text-[10px] font-mono font-black px-1.5 py-0.2 rounded-none text-white ${
                        rankNumber === 1 
                          ? 'bg-gradient-to-r from-amber-500 to-red-600 shadow-md' 
                          : rankNumber === 2 
                            ? 'bg-red-600' 
                            : 'bg-neutral-800 border border-neutral-700'
                      }`}>
                        #{rankNumber}
                      </span>

                      {/* DURATION BADGE */}
                      <span className="absolute bottom-1 right-1 z-10 bg-black/85 text-zinc-300 font-mono text-[9px] font-bold px-1 rounded-xs">
                        {durationTags[idx] || '03:30'}
                      </span>

                      {/* HOVER PLAY ICON */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity bg-black/40">
                        <Play className="w-5 h-5 text-red-500 fill-current drop-shadow-lg" />
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-tight line-clamp-2 group-hover/card:text-red-500 transition-colors">
                        {vid.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                        <span className="text-red-400 font-bold">{viewCounts[idx] || '1.2M VIEWS'}</span>
                        <span className="text-zinc-600">•</span>
                        <span>{timeTags[idx] || '2H AGO'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* QUICK LINK TO FULL CHARTS */}
            <Link
              href="/charts"
              className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-red-600/20 border border-neutral-800 hover:border-red-600/60 text-center font-mono font-bold text-xs uppercase tracking-widest text-zinc-300 hover:text-white transition-all rounded-xl flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>EXPLORE WORLDSTAR CHARTS</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />
            </Link>
          </div>

        </div>
      </section>

      {/* CINEMATIC IN-APP VIDEO PLAYER OVERLAY */}
      {activeModalVideo && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-[fadeIn_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-label={activeModalVideo.title || "Featured Video Player Modal"}
          onClick={() => setActiveModalVideo(null)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setActiveModalVideo(null)}
              aria-label="Close video player"
              className="absolute top-4 right-4 z-30 p-3 rounded-full bg-black/80 hover:bg-red-600 text-white border border-white/20 transition-all hover:scale-110 shadow-xl cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-6 h-6" />
            </button>

            {/* EMBED FALLBACK */}
            {embedError ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-zinc-950 p-6">
                <div className="relative z-10 text-center space-y-4 max-w-md">
                  <p className="text-white font-black text-xl uppercase tracking-widest">{activeModalVideo.title}</p>
                  <p className="text-zinc-400 text-sm">Direct playback restricted by provider. Click below to stream directly.</p>
                  <a
                    href={activeModalVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-widest rounded-none transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Source Video
                  </a>
                </div>
              </div>
            ) : (
              /* IN-APP VIDEO PLAYER */
              <iframe
                src={getSafeEmbedUrl(activeModalVideo.url)}
                title={activeModalVideo.title}
                className="w-full h-full border-none"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onError={() => setEmbedError(true)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
