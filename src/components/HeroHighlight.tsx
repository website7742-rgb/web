'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Flame, X, ArrowUpRight, ShieldCheck, ChevronLeft, ChevronRight, Copy, ExternalLink } from 'lucide-react';
import { AggregatedVideo } from '@/services/YoutubeService';
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';
import { getYouTubeThumbnail } from '@/lib/utils';

interface HeroHighlightProps {
  video?: AggregatedVideo;
}

const HERO_SLIDES: AggregatedVideo[] = [
  {
    videoId: 'fP8SMUdh8Zc',
    title: 'Drake & 21 Savage: Uncut Studio',
    thumbnailUrl: getYouTubeThumbnail('fP8SMUdh8Zc'),
    channelName: 'OVO / Slaughter Gang',
    embedUrl: 'https://www.youtube.com/embed/fP8SMUdh8Zc?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'tvTRZJ-4EyI',
    title: 'Kendrick Lamar: The Pop Out Sessions',
    thumbnailUrl: getYouTubeThumbnail('tvTRZJ-4EyI'),
    channelName: 'pgLang',
    embedUrl: 'https://www.youtube.com/embed/tvTRZJ-4EyI?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'l0U7SxXHkPY',
    title: 'Future & Metro Boomin: Extended',
    thumbnailUrl: getYouTubeThumbnail('l0U7SxXHkPY'),
    channelName: 'Freebandz',
    embedUrl: 'https://www.youtube.com/embed/l0U7SxXHkPY?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'SNpFucht9iA',
    title: 'Travis Scott: Utopia Chronicles',
    thumbnailUrl: getYouTubeThumbnail('SNpFucht9iA'),
    channelName: 'Cactus Jack',
    embedUrl: 'https://www.youtube.com/embed/SNpFucht9iA?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'pDqli9sY_G8',
    title: 'J. Cole: The Fall Off Preview',
    thumbnailUrl: getYouTubeThumbnail('pDqli9sY_G8'),
    channelName: 'Dreamville',
    embedUrl: 'https://www.youtube.com/embed/pDqli9sY_G8?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'l4WTSWxBWqg',
    title: 'Playboi Carti: Opium Exclusive',
    thumbnailUrl: getYouTubeThumbnail('l4WTSWxBWqg'),
    channelName: 'Opium',
    embedUrl: 'https://www.youtube.com/embed/l4WTSWxBWqg?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  }
];

export function HeroHighlight({ video }: HeroHighlightProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);

  const slides = HERO_SLIDES;
  const activeSlide = slides[currentSlideIndex];

  // Auto-play carousel slider
  useEffect(() => {
    if (isPlayingModalOpen) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length, isPlayingModalOpen]);

  const getSafeEmbedUrl = (v: AggregatedVideo) => {
    if (v.embedUrl && v.embedUrl.includes('youtube.com/embed/')) {
      return v.embedUrl.includes('autoplay=1') ? v.embedUrl : `${v.embedUrl}?autoplay=1&rel=0`;
    }
    const id = v.videoId || 'tvTRZJ-4EyI';
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  };

  return (
    <>
      <section className="relative w-full min-h-[65vh] lg:min-h-[75vh] flex items-end rounded-3xl border border-white/10 bg-black shadow-2xl group">
        {/* Background Image Banner — Real YouTube maxresdefault thumbnail */}
        <div className="absolute inset-0 w-full h-full bg-zinc-950 overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={activeSlide.videoId}
            src={activeSlide.thumbnailUrl || getYouTubeThumbnail(activeSlide.videoId)}
            alt={`Official music video for ${activeSlide.title}`}
            onError={(e) => {
              const img = e.currentTarget;
              const hq = getYouTubeThumbnail(activeSlide.videoId, 'hq');
              if (img.src !== hq && hq) img.src = hq;
            }}
            className="w-full h-full object-cover object-center opacity-60 group-hover:scale-105 transition-all duration-1000"
          />
          {/* Heavy Gradient Overlays for Cinematic Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-black/40 to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
        </div>

        {/* Carousel Slide Navigation Arrows */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 z-20 flex justify-between pointer-events-none">
          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            aria-label="Previous Hero Slide"
            className="p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-110 pointer-events-auto cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setCurrentSlideIndex((prev) => (prev + 1) % slides.length)}
            aria-label="Next Hero Slide"
            className="p-3 rounded-full bg-black/60 hover:bg-red-600 text-white border border-white/10 backdrop-blur-md transition-all hover:scale-110 pointer-events-auto cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
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
                    navigator.clipboard.writeText(getSafeEmbedUrl(activeSlide));
                  }
                },
              },
              {
                label: 'OPEN ON YOUTUBE',
                icon: <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />,
                onClick: () => {
                  if (typeof window !== 'undefined') {
                    window.open(`https://www.youtube.com/watch?v=${activeSlide.videoId}`, '_blank');
                  }
                },
              },
              {
                label: 'EXPLORE ARTISTS',
                icon: <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />,
                href: '/roster',
              },
            ]}
            ariaLabel={`Hero video options for ${activeSlide.title}`}
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
            {activeSlide.title}
          </h1>

          {/* Subtitle / Channel */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-zinc-300 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
            <span className="text-red-500 font-black">{activeSlide.channelName}</span>
            <span>•</span>
            <span className="text-zinc-400">EXCLUSIVE RELEASE 2026</span>
          </div>

          {/* Action Buttons & Dot Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => setIsPlayingModalOpen(true)}
                className="!bg-white !text-black !rounded-none !border-none font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] px-6 sm:px-8 py-3.5 hover:!bg-zinc-200 transition-colors flex items-center gap-2 sm:gap-3 transform-gpu active:scale-95 cursor-pointer shadow-lg"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current !text-black" />
                <span>WATCH NOW</span>
              </button>

              <Link
                href="/roster"
                className="px-6 sm:px-8 py-3.5 !rounded-none bg-black/40 border border-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-[0.2em] backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-2 sm:gap-3 transform-gpu active:scale-95"
              >
                <span>EXPLORE ROSTER</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Minimalist Slide Dot Indicators */}
            <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-full px-4 py-2 backdrop-blur-md">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentSlideIndex ? 'w-8 bg-red-600' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
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

            {/* IN-APP YOUTUBE IFRAME */}
            <iframe
              src={getSafeEmbedUrl(activeSlide)}
              title={activeSlide.title}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
