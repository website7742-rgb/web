'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { ReleaseType } from '@/types';
import { Disc, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TYPES: ('ALL' | ReleaseType)[] = ['ALL', 'ALBUM', 'EP', 'SINGLE', 'VINYL'];

export default function ReleasesPage() {
  const { releases } = useData();
  const [selectedType, setSelectedType] = useState<'ALL' | ReleaseType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReleases = releases.filter(release => {
    const matchesType = selectedType === 'ALL' || release.type === selectedType;
    const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          release.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          release.catalogNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest">
          <Disc className="w-3.5 h-3.5" />
          <span>MASTER DISCOGRAPHY & PUBLISHING</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
          RECORD <span className="text-gold-gradient">RELEASES</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400">
          Explore the official discography catalog across vinyl pressings, deluxe albums, EPs, and digital masters.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass-panel-gold rounded-2xl p-4 md:p-6 border border-white/10">
        {/* Type Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all ${
                selectedType === t
                  ? 'bg-gold text-obsidian font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-gold/30'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search catalog number, album..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-xs font-mono"
          />
        </div>
      </div>

      {/* Releases Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredReleases.map((release) => (
          <Link
            key={release.id}
            href={`/releases/${release.slug}`}
            className="group glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-obsidian-light p-4">
              <Image
                src={release.coverUrl}
                alt={release.title}
                fill
                className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-obsidian/80 backdrop-blur-md border border-gold/40 text-gold text-[10px] font-mono">
                {release.type}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div>
                <span className="text-[10px] font-mono text-zinc-500">{release.catalogNumber}</span>
                <h3 className="text-lg font-display font-bold text-white line-clamp-1 group-hover:text-gold transition-colors">
                  {release.title}
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">{release.artistName}</p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-zinc-500">
                <span>{release.tracksCount} TRACKS</span>
                <span>{release.releaseDate}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
