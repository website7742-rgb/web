'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Flame, X, ArrowUpRight, ShieldCheck, ChevronLeft, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { AggregatedVideo } from '@/services/YoutubeService';
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';
import { getYouTubeThumbnail } from '@/lib/utils';

import { useData } from '@/providers/DataContext';

interface HeroHighlightProps {
  video?: AggregatedVideo; // Kept for backwards compatibility but not actively used for hero content anymore
}

export function HeroHighlight({ video }: HeroHighlightProps) {
  const { siteSettings } = useData();
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  // Reset embed error when modal opens/closes
  useEffect(() => {
    setEmbedError(false);
  }, [isPlayingModalOpen]);

  const getSafeEmbedUrl = (url: string) => {
    if (url && url.includes('youtube.com/embed/')) {
      return url.replace('autoplay=1', 'autoplay=0');
    }
    return url; // Could be R2 direct MP4 link or other
  };

  // Helper to extract YouTube ID if it's a YouTube URL to get the thumbnail
  const extractYoutubeId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    return match ? match[1] : null;
  };

  const videoId = extractYoutubeId(siteSettings.heroVideoUrl);
  // If it's a direct MP4, we won't have a YouTube thumbnail. In a real app we'd allow uploading a poster image.
  // For now, we fallback to a default image if it's not YouTube.
  const posterUrl = videoId 
    ? getYouTubeThumbnail(videoId, 'max') 
    : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&q=80';


  return (
    <>
      <section className="relative w-full min-h-[65vh] lg:min-h-[75vh] flex items-end rounded-3xl border border-white/10 bg-black shadow-2xl group">
        {/* Background Image Banner — Real YouTube maxresdefault thumbnail */}
        <div className="absolute inset-0 w-full h-full bg-zinc-950 overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt={siteSettings.heroTitle}
            onError={(e) => {
              if (videoId) {
                const img = e.currentTarget;
                const hq = getYouTubeThumbnail(videoId, 'hq');
                if (img.src !== hq && hq) img.src = hq;
              }
            }}
            className="w-full h-full object-cover object-center opacity-60 group-hover:scale-105 transition-all duration-1000"
          />
          {/* Heavy Gradient Overlays for Cinematic Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-black/40 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
        </div>

        {/* TOP RIGHT 3-DOT HERO OPTIONS MENU */}
        <div className="absolute top-6 right-6 z-30 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          <ThreeDotMenu
            items={[
              {
                label: 'WATCH FEATURED VIDEO',
                icon: <Play className="w-3.5 h-3.5 text-red-500 fill-current" />,
                onClick: () => setIsPlayingModalOpen(true),
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
                label: 'OPEN SOURCE',
                icon: <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />,
                onClick: () => {
                  if (typeof window !== 'undefined') {
                    window.open(siteSettings.heroVideoUrl, '_blank');
                  }
                },
              },
              {
                label: 'EXPLORE',
                icon: <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />,
                href: siteSettings.heroCtaLink,
              },
            ]}
            ariaLabel={`Hero video options for ${siteSettings.heroTitle}`}
          />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 w-full p-6 sm:p-10 lg:p-16 space-y-6 max-w-5xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/90 text-white font-mono text-xs font-extrabold uppercase tracking-widest shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse">
              <Flame className="w-4 h-4 fill-current" />
              <span>SPOTLIGHT HERO</span>
            </span>

            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-zinc-300 font-mono text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>OFFICIAL UNLEASHED</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="font-black text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-tight break-words drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            {siteSettings.heroTitle}
          </h1>

          {/* Subtitle / Channel */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-zinc-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
            <span className="text-red-500 font-black">{siteSettings.heroSubtitle}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
              <button
                onClick={() => setIsPlayingModalOpen(true)}
                className="bg-white text-black rounded-none px-8 py-4 font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors flex items-center gap-3 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>WATCH VIDEO</span>
              </button>

              <Link
                href={siteSettings.heroCtaLink}
                className="bg-transparent border border-white text-white rounded-none px-8 py-4 font-bold tracking-widest uppercase hover:bg-white/10 transition-colors flex items-center gap-3"
              >
                <span>{siteSettings.heroCtaText}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CINEMATIC IN-APP VIDEO PLAYER OVERLAY */}
      {isPlayingModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setIsPlayingModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsPlayingModalOpen(false)}
              aria-label="Close video player"
              className="absolute top-4 right-4 z-30 p-3 rounded-full bg-black/80 hover:bg-red-600 text-white border border-white/20 transition-all hover:scale-110 shadow-xl cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* EMBED FALLBACK: show if iframe fails to load */}
            {embedError ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={posterUrl}
                  alt={siteSettings.heroTitle}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative z-10 text-center space-y-4 px-6">
                  <p className="text-white font-black text-xl uppercase tracking-widest">Playback Restricted</p>
                  <p className="text-zinc-400 text-sm">This video cannot be embedded here.</p>
                  <a
                    href={siteSettings.heroVideoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-widest rounded-none transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Video
                  </a>
                </div>
              </div>
            ) : (
              /* IN-APP VIDEO PLAYER */
              <iframe
                src={getSafeEmbedUrl(siteSettings.heroVideoUrl)}
                title={siteSettings.heroTitle}
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
