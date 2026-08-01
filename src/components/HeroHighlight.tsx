'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Flame, X, ArrowUpRight, ShieldCheck, ChevronLeft, ChevronRight, Copy, ExternalLink, Share2 } from 'lucide-react';
import { AggregatedVideo } from '@/services/YoutubeService';
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';

interface HeroHighlightProps {
  video?: AggregatedVideo;
}

const HERO_SLIDES: AggregatedVideo[] = [
  {
    videoId: 'tvTRZJ-4EyI',
    title: 'KENDRICK LAMAR: HUMBLE. (UNCUT OFFICIAL VIDEO)',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80',
    channelName: 'WorldStar Official Spotlight',
    embedUrl: 'https://www.youtube.com/embed/tvTRZJ-4EyI?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'fP8SMUdh8Zc',
    title: 'DRAKE & 21 SAVAGE: UNCUT STUDIO FREESTYLE 2026',
    thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tupac_Shakur_1993.jpg/1200px-Tupac_Shakur_1993.jpg',
    channelName: 'WSHH Uncut Exclusive',
    embedUrl: 'https://www.youtube.com/embed/fP8SMUdh8Zc?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'l0U7SxXHkPY',
    title: 'TRAVIS SCOTT: UTOPIA BACKSTAGE & CYPER 2026',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1600&q=80',
    channelName: 'Cactus Jack Media',
    embedUrl: 'https://www.youtube.com/embed/l0U7SxXHkPY?autoplay=1&rel=0&enablejsapi=1',
    publishedAt: new Date().toISOString(),
  },
];

export function HeroHighlight({ video }: HeroHighlightProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlayingModalOpen, setIsPlayingModalOpen] = useState(false);

  const slides = video ? [video, ...HERO_SLIDES.slice(1)] : HERO_SLIDES;
  const activeSlide = slides[currentSlideIndex];

  // Auto-play carousel slider
  useEffect(() => {
    if (isPlayingModalOpen) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
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
        {/* Background Image Banner */}
        <div className="absolute inset-0 w-full h-full bg-zinc-950 overflow-hidden rounded-3xl">
          <Image
            key={activeSlide.videoId}
            src={activeSlide.thumbnailUrl}
            alt={`Official music video for ${activeSlide.title}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-60 group-hover:scale-105 transition-all duration-1000"
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
          <h1 className="font-black text-white text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tight leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            {activeSlide.title}
          </h1>

          {/* Subtitle / Channel */}
          <div className="flex items-center gap-4 text-zinc-300 text-sm font-mono font-bold uppercase tracking-wider">
            <span className="text-red-500 font-black">{activeSlide.channelName}</span>
            <span>•</span>
            <span className="text-zinc-400">EXCLUSIVE RELEASE 2026</span>
          </div>

          {/* Action Buttons & Dot Indicators */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPlayingModalOpen(true)}
                className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:shadow-[0_0_40px_rgba(220,38,38,0.8)] hover:scale-105 transition-all flex items-center gap-3 cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>WATCH NOW</span>
              </button>

              <Link
                href="/roster"
                className="px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold text-sm uppercase tracking-widest backdrop-blur-xl hover:scale-105 transition-all flex items-center gap-2"
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
