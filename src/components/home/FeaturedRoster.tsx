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
          <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-3">
            <UserCheck className="w-4 h-4 text-gold flex-shrink-0" />
            <span>AETHERIA ROSTER & DISCOVERY</span>
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
        {featuredArtists.map((artist) => (
          <Link
            key={artist.id}
            href={`/roster/${artist.slug}`}
            className="group bg-black border border-zinc-800 rounded-none overflow-hidden border border-zinc-800 hover:border-gold/50 transition-all duration-500 flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-obsidian/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent opacity-80" />

              {artist.isVerified && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-obsidian/80 backdrop-blur-md border border-gold/40 text-gold text-[10px] font-mono font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>VERIFIED</span>
                </div>
              )}
            </div>

            <div className="p-6 space-y-3">
              <div>
                <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider block">
                  {artist.countryFlag} {artist.country} â€¢ {artist.genres[0]}
                </span>
                <h3 className="text-xl font-display font-bold text-white group-hover:text-gold transition-colors truncate">
                  {artist.name}
                </h3>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800 pt-3 text-xs font-mono">
                <span className="text-zinc-400">LISTENERS:</span>
                <span className="text-white font-bold">{formatNumber(artist.monthlyListeners)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
