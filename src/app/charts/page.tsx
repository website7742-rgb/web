'use client';

import React, { useState } from 'react';
import { MOCK_CHARTS } from '@/lib/data/mockData';
import { ChartCategory, ChartEntry } from '@/types';
import { Flame, Calendar, TrendingUp, Sparkles, Filter, Play, Pause, ArrowUp, ArrowDown, Minus, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ChartsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ChartCategory>('HOT_100');
  const [selectedWeek, setSelectedWeek] = useState('2026-07-21');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories: { id: ChartCategory; label: string; description: string }[] = [
    { id: 'HOT_100', label: 'AETHERIA HOT 100', description: 'The week’s most popular songs across all streaming platforms and radio airplay.' },
    { id: 'GLOBAL_200', label: 'GLOBAL 200', description: 'Top songs ranked by worldwide digital streaming and sales data.' },
    { id: 'ALBUM_200', label: 'BILLBOARD 200 ALBUMS', description: 'Top selling and streaming albums of the week.' },
    { id: 'ARTIST_100', label: 'ARTIST 100', description: 'Top recording artists measuring activity across album & track sales, streaming, and social.' },
  ];

  const weeksList = [
    '2026-07-21 (CURRENT WEEK)',
    '2026-07-14',
    '2026-07-07',
    '2026-06-30',
  ];

  const currentEntries = MOCK_CHARTS.filter(entry => entry.chartCategory === selectedCategory);

  const handlePlayToggle = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const formatStreams = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    return num.toLocaleString();
  };

  return (
    <div className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full space-y-12">
      {/* Page Header */}
      <div className="border-b border-white/10 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-mono font-bold uppercase">
          <Flame className="w-4 h-4 fill-gold text-gold" />
          <span>OFFICIAL MUSIC INDUSTRY RANKINGS</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          AETHERIA <span className="text-gold-gradient">OFFICIAL CHARTS</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-sans font-light max-w-2xl">
          The definitive weekly rankings of songs, albums, and artists based on multi-platform streaming, physical vinyl sales, and digital airplay.
        </p>
      </div>

      {/* Category Tab Switcher & Historical Week Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold transition-all whitespace-nowrap min-h-[44px] ${
                selectedCategory === cat.id
                  ? 'bg-gold text-obsidian shadow-xl'
                  : 'glass-panel border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Historical Week Selector Dropdown */}
        <div className="flex items-center gap-3 glass-panel px-4 py-2.5 rounded-2xl border border-white/10 text-xs font-mono text-zinc-300">
          <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
          <span className="text-zinc-400">WEEK OF:</span>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(e.target.value)}
            className="bg-transparent text-gold font-bold focus:outline-none cursor-pointer"
          >
            {weeksList.map((week) => (
              <option key={week} value={week.split(' ')[0]} className="bg-obsidian text-white">
                {week}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Chart Header Banner */}
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {categories.find(c => c.id === selectedCategory)?.label}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans mt-1">
            {categories.find(c => c.id === selectedCategory)?.description}
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-gold bg-gold/10 px-4 py-2 rounded-xl border border-gold/30 self-start sm:self-auto">
          <TrendingUp className="w-4 h-4" />
          <span>UPDATED WEEKLY</span>
        </div>
      </div>

      {/* Main Chart Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-white/[0.03] border-b border-white/10 font-mono text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
          <div className="col-span-1 text-center">RANK</div>
          <div className="col-span-5">TITLE / ARTIST</div>
          <div className="col-span-2 text-center">LAST WEEK</div>
          <div className="col-span-2 text-center">PEAK POS</div>
          <div className="col-span-2 text-right">WEEKLY STREAMS</div>
        </div>

        {/* Chart Rows */}
        <div className="divide-y divide-white/5">
          {currentEntries.map((entry) => (
            <div
              key={entry.id}
              className="group grid grid-cols-1 md:grid-cols-12 p-4 sm:p-6 hover:bg-white/[0.04] transition-all items-center gap-4 text-zinc-300"
            >
              {/* Rank & Trend Movement */}
              <div className="md:col-span-1 flex items-center justify-between md:justify-center gap-2">
                <span className={`font-display font-extrabold text-2xl sm:text-3xl w-10 text-center ${
                  entry.rank === 1 ? 'text-gold' : 'text-zinc-400 group-hover:text-white'
                }`}>
                  {entry.rank < 10 ? `0${entry.rank}` : entry.rank}
                </span>

                <div className="flex items-center gap-1 font-mono text-[10px] font-bold">
                  {entry.trend === 'UP' && (
                    <span className="text-gold flex items-center gap-0.5 bg-gold/10 px-1.5 py-0.5 rounded border border-gold/30">
                      <ArrowUp className="w-3 h-3" />
                      +{entry.lastWeekRank ? entry.lastWeekRank - entry.rank : ''}
                    </span>
                  )}
                  {entry.trend === 'NEW' && (
                    <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      NEW
                    </span>
                  )}
                  {entry.trend === 'STABLE' && (
                    <span className="text-zinc-500 flex items-center gap-0.5">
                      <Minus className="w-3 h-3" />
                    </span>
                  )}
                  {entry.trend === 'DOWN' && (
                    <span className="text-rose-400 flex items-center gap-0.5 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">
                      <ArrowDown className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Title, Cover, Artist Link */}
              <div className="md:col-span-5 flex items-center gap-4">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={entry.coverUrl} alt={entry.title} className="w-full h-full object-cover" />

                  {entry.audioPreviewUrl && (
                    <button
                      onClick={() => handlePlayToggle(entry.id)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-gold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {playingId === entry.id ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-gold" />}
                    </button>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="font-display font-bold text-base sm:text-lg text-white group-hover:text-gold transition-colors truncate">
                    {entry.title}
                  </h3>
                  <p className="text-xs font-sans text-zinc-400 truncate mt-0.5">
                    <Link href={`/roster/${entry.artistSlug}`} className="hover:text-gold font-semibold text-zinc-200 transition-colors">
                      {entry.artistName}
                    </Link>{' '}
                    <span className="text-zinc-500">• {entry.genre} {entry.countryFlag}</span>
                  </p>
                </div>
              </div>

              {/* Stats Columns */}
              <div className="md:col-span-2 text-center font-mono text-xs text-zinc-400 hidden md:block">
                {entry.lastWeekRank ? `#${entry.lastWeekRank}` : '—'}
              </div>

              <div className="md:col-span-2 text-center font-mono text-xs text-zinc-400 hidden md:block">
                #{entry.peakPosition} ({entry.weeksOnChart} wks)
              </div>

              <div className="md:col-span-2 text-right font-mono text-sm font-bold text-gold">
                {formatStreams(entry.weeklyStreams)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
