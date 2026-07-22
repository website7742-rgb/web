'use client';

import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function BillboardCharts() {
  const chartItems = [
    {
      rank: '01',
      artistName: 'Taylor Swift',
      artistSlug: 'taylor-swift',
      title: 'Fortnight (feat. Post Malone)',
      album: 'The Tortured Poets Department',
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80',
      genre: 'Pop',
      countryFlag: '🇺🇸',
      streams: '680.4M',
      trend: '🔥 UP +2',
      trendColor: 'text-gold bg-gold/10 border-gold/30',
    },
    {
      rank: '02',
      artistName: 'Kendrick Lamar',
      artistSlug: 'kendrick-lamar',
      title: 'Not Like Us',
      album: 'GNX',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      genre: 'Hip-Hop',
      countryFlag: '🇺🇸',
      streams: '540.2M',
      trend: '⚡ NEW ENTRY',
      trendColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      rank: '03',
      artistName: 'The Weeknd',
      artistSlug: 'the-weeknd',
      title: 'Dancing in the Flames',
      album: 'Hurry Up Tomorrow',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      genre: 'R&B / Pop',
      countryFlag: '🇨🇦',
      streams: '495.8M',
      trend: '➡️ STABLE #3',
      trendColor: 'text-zinc-300 bg-white/5 border-white/10',
    },
    {
      rank: '04',
      artistName: 'Billie Eilish',
      artistSlug: 'billie-eilish',
      title: 'LUNCH',
      album: 'HIT ME HARD AND SOFT',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      genre: 'Alternative',
      countryFlag: '🇺🇸',
      streams: '412.1M',
      trend: '🔥 UP +1',
      trendColor: 'text-gold bg-gold/10 border-gold/30',
    },
    {
      rank: '05',
      artistName: 'Bad Bunny',
      artistSlug: 'bad-bunny',
      title: 'MONACO',
      album: 'Nadie Sabe Lo Que Va a Pasar Mañana',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
      genre: 'Latin Trap',
      countryFlag: '🇵🇷',
      streams: '389.0M',
      trend: '➡️ STABLE #5',
      trendColor: 'text-zinc-300 bg-white/5 border-white/10',
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-14 border-b border-white/10 pb-6 sm:pb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-2 sm:mb-3">
            <Flame className="w-4 h-4 fill-gold text-gold flex-shrink-0" />
            <span>GLOBAL MUSIC INDUSTRY CHARTS</span>
          </div>
          <h2 className="text-fluid-h2 font-display font-extrabold text-white tracking-tight leading-none">
            GLOBAL TOP <span className="text-gold-gradient">100 TRACKS</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 font-medium whitespace-nowrap">
          <TrendingUp className="w-4 h-4 text-gold flex-shrink-0" />
          <span>WEEKLY EDITORIAL RANKINGS</span>
        </div>
      </div>

      {/* Chart Rows Container */}
      <div className="glass-panel-gold rounded-3xl p-4 sm:p-6 md:p-10 border border-gold/30 shadow-2xl space-y-3 sm:space-y-4">
        {chartItems.map((item) => (
          <div
            key={item.rank}
            className="group flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl transition-all duration-300 bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-gold/40 text-zinc-300 gap-4"
          >
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              <span className={`font-display font-extrabold text-2xl sm:text-3xl w-8 sm:w-10 text-center flex-shrink-0 ${
                item.rank === '01' ? 'text-gold' : 'text-zinc-500 group-hover:text-zinc-300'
              }`}>
                {item.rank}
              </span>

              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base sm:text-xl truncate text-white group-hover:text-gold transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">{item.countryFlag}</span>
                </div>
                <p className="text-xs sm:text-sm font-sans text-zinc-400 truncate mt-0.5">
                  <Link href={`/roster/${item.artistSlug}`} className="hover:text-gold transition-colors font-semibold text-zinc-200">
                    {item.artistName}
                  </Link>{' '}
                  • <span className="text-zinc-500">{item.album}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:justify-end gap-4 sm:gap-8 border-t md:border-t-0 border-white/5 pt-3 md:pt-0 font-mono text-xs">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-bold">
                {item.genre}
              </span>

              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${item.trendColor}`}>
                {item.trend}
              </span>

              <span className="font-bold text-gold text-sm sm:text-base">
                {item.streams}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
