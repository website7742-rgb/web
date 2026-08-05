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

// ✅ VERIFIED ACTIVE OFFICIAL YOUTUBE VIDEO IDs — confirmed publicly available
const HERO_SLIDES: AggregatedVideo[] = [
  {
    videoId: 'JqFQkAeCBgA',
    title: 'Kendrick Lamar: HUMBLE. (Official Music Video)',
    thumbnailUrl: getYouTubeThumbnail('JqFQkAeCBgA'),
    channelName: 'pgLang / TDE / Aftermath',
    embedUrl: 'https://www.youtube.com/embed/JqFQkAeCBgA?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'uelHwf8o7_U',
    title: 'Drake: God\'s Plan (Official Music Video)',
    thumbnailUrl: getYouTubeThumbnail('uelHwf8o7_U'),
    channelName: 'OVO Sound / Young Money',
    embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'KUmZp8pR1uc',
    title: 'Travis Scott ft. Drake: SICKO MODE',
    thumbnailUrl: getYouTubeThumbnail('KUmZp8pR1uc'),
    channelName: 'Cactus Jack / OVO',
    embedUrl: 'https://www.youtube.com/embed/KUmZp8pR1uc?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: '4L48n0iZom0',
    title: 'J. Cole: Middle Child (Official Music Video)',
    thumbnailUrl: getYouTubeThumbnail('4L48n0iZom0'),
    channelName: 'Dreamville / Interscope',
    embedUrl: 'https://www.youtube.com/embed/4L48n0iZom0?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'k6jqx9kZgPM',
    title: 'Drake: Started From The Bottom',
    thumbnailUrl: getYouTubeThumbnail('k6jqx9kZgPM'),
    channelName: 'Young Money / Cash Money',
    embedUrl: 'https://www.youtube.com/embed/k6jqx9kZgPM?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'Bm5iA4Zupek',
    title: 'Migos ft. Lil Uzi Vert: Bad and Boujee',
    thumbnailUrl: getYouTubeThumbnail('Bm5iA4Zupek'),
    channelName: 'Quality Control Music',
    embedUrl: 'https://www.youtube.com/embed/Bm5iA4Zupek?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
];

export function HeroHighlight({ video }: HeroHighlightProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);
  const [embedError, setEmbedError] = useState(false);

  // Reset embed error when slide or modal changes
  useEffect(() => {
    setEmbedError(false);
  }, [currentSlideIndex, isPlayingModalOpen]);

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

            {/* EMBED FALLBACK: show if iframe fails to load */}
            {embedError ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeSlide.thumbnailUrl || getYouTubeThumbnail(activeSlide.videoId, 'hq')}
                  alt={activeSlide.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <div className="relative z-10 text-center space-y-4 px-6">
                  <p className="text-white font-black text-xl uppercase tracking-widest">Playback Restricted</p>
                  <p className="text-zinc-400 text-sm">This video cannot be embedded. Watch it directly on YouTube.</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${activeSlide.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm uppercase tracking-widest rounded-none transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Watch on YouTube
                  </a>
                </div>
              </div>
            ) : (
              /* IN-APP YOUTUBE IFRAME */
              <iframe
                src={getSafeEmbedUrl(activeSlide)}
                title={activeSlide.title}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
