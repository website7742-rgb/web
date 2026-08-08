'use client';

import React from 'react';
import { useData } from '@/providers/DataContext';
import { ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
import Link from 'next/link';

export function FeaturedRoster() {
  const { artists } = useData();
  const featuredArtists = artists.slice(0, 4);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-zinc-800 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest mb-3">
            <UserCheck className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>WORLDSTAR ROSTER & DISCOVERY</span>
          </div>
          <h2 className="text-fluid-h2 font-display font-extrabold text-white tracking-tight">
            FEATURED <span className="text-gold">RECORDING ARTISTS</span>
          </h2>
        </div>

        <Link
          href="/roster"
          className="text-xs font-mono text-gold font-bold hover:underline flex items-center gap-1.5 whitespace-nowrap min-h-[44px]"
        >
          <span>VIEW ALL PUBLISHED ROSTER ({artists.length})</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {featuredArtists.map((artist, idx) => (
          <Link
            key={artist.id}
            href={`/roster/${artist.slug}`}
            className="group bg-black !rounded-none border border-zinc-800 hover:border-red-600/80 hover:shadow-[0_0_25px_rgba(255,43,43,0.3)] transition-all duration-500 overflow-hidden relative flex flex-col justify-between"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out filter brightness-95"
              />
              
              {/* Cinematic Gradient Fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

              {artist.isVerified && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-none bg-black/80 backdrop-blur-md border border-red-600/50 text-red-400 text-[9px] font-mono font-bold flex items-center gap-1.5 z-20">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                  <span>OFFICIAL ARTIST</span>
                </div>
              )}

              {/* Frosted Glass Nameplate Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black via-black/85 to-transparent backdrop-blur-xs space-y-2 z-10">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-none bg-red-600/20 border border-red-600/40 text-red-400 text-[9px] font-mono font-bold tracking-widest uppercase">
                    #{String(idx + 1).padStart(2, '0')} ROSTER
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">
                    {artist.country}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black font-display text-white group-hover:text-red-500 transition-colors uppercase tracking-tight truncate">
                  {artist.name}
                </h3>

                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-2 text-[11px] font-mono">
                  <span className="text-zinc-500 uppercase">LISTENERS:</span>
                  <span className="text-red-500 font-bold">{formatNumber(artist.monthlyListeners)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

