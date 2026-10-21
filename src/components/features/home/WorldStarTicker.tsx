'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, Radio, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

interface TickerItem {
  tag: string;
  text: string;
  href: string;
  isHot?: boolean;
}

const TICKER_ITEMS: TickerItem[] = [
  {
    tag: 'PREMIERE',
    text: '100 OFFICIAL HIP-HOP MUSIC VIDEOS NOW STREAMING IN 4K ON WORLDSTAR',
    href: '/videos',
    isHot: true,
  },
  {
    tag: 'SUBMISSIONS',
    text: 'UPLOAD YOUR DIRECT VIDEO MASTER TO WORLDSTAR — DIRECT A&R REVIEW',
    href: '/submit',
    isHot: true,
  },
  {
    tag: 'EXCLUSIVE',
    text: 'KENDRICK LAMAR SUPER BOWL LIX REHEARSAL SESSIONS & SETLIST REVEALED',
    href: '/videos?q=Kendrick+Lamar',
  },
  {
    tag: 'CHARTS',
    text: 'J. COLE & FUTURE PEAK AT #1 ON WORLDSTAR TRENDING STREET CHARTS',
    href: '/charts',
    isHot: true,
  },
  {
    tag: 'UNCUT VAULT',
    text: 'BEHIND THE SCENES WITH DRAKE, 21 SAVAGE, TRAVIS SCOTT & MORE',
    href: '/videos?q=Drake',
  },
  {
    tag: 'ROSTER',
    text: 'OVER 100+ VERIFIED HIP-HOP LEGENDS & INDIE TITANS STREAMING LIVE',
    href: '/roster',
  },
];

export function WorldStarTicker() {
  return (
    <div 
      className="w-full bg-neutral-950/90 border-y border-red-600/30 overflow-hidden relative z-20 group shadow-[0_0_20px_rgba(220,38,38,0.15)] mb-6 sm:mb-8"
      role="region"
      aria-label="Breaking Hip-Hop News Ticker"
    >
      <div className="flex items-center min-h-[44px]">
        {/* LEFT BADGE: ICONIC WORLDSTAR BREAKING INDICATOR */}
        <div className="shrink-0 bg-red-600 text-white font-mono font-black text-[11px] sm:text-xs uppercase tracking-widest px-3 sm:px-4 py-2.5 flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.8)] z-30 select-none">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="hidden xs:inline">BREAKING</span>
          <span className="xs:hidden">LIVE</span>
        </div>

        {/* MARQUEE RUNNER */}
        <div className="relative flex-1 overflow-hidden py-2 select-none">
          <div className="flex w-max items-center gap-8 animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
            {/* DUPLICATED TWICE FOR SEAMLESS INFINITE LOOP */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="inline-flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors text-xs font-mono font-bold uppercase tracking-wider group/item whitespace-nowrap min-h-[36px]"
              >
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-none ${
                  item.isHot 
                    ? 'bg-red-600/30 text-red-400 border border-red-500/40' 
                    : 'bg-neutral-800 text-zinc-400 border border-neutral-700'
                }`}>
                  {item.tag}
                </span>
                <span className="group-hover/item:text-red-500 transition-colors">
                  {item.text}
                </span>
                <span className="text-red-600 font-black ml-4" aria-hidden="true">{'///'}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT QUICK ACTION */}
        <Link
          href="/videos"
          className="hidden md:flex shrink-0 items-center gap-1.5 px-3 py-2 text-[11px] font-mono font-bold text-zinc-400 hover:text-white uppercase tracking-wider border-l border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900 transition-colors z-30"
        >
          <span>ALL DROPS</span>
          <ChevronRight className="w-3.5 h-3.5 text-red-500" />
        </Link>
      </div>
    </div>
  );
}
