'use client';

import React, { useState } from 'react';
import { useData } from '@/providers/DataContext';
import { Release } from '@/types';
import { Disc, Search, ExternalLink, Copy, Share2, Music, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ThreeDotMenu, MenuItem } from '@/components/ui/ThreeDotMenu';
import { PaginationControls } from '@/components/ui/PaginationControls';

type FilterCategory = 'ALL' | 'HIP-HOP' | 'RAP' | 'TRAP' | 'ALBUMS' | 'SINGLES';
const FILTERS: FilterCategory[] = ['ALL', 'HIP-HOP', 'RAP', 'TRAP', 'ALBUMS', 'SINGLES'];

export default function ReleasesPage() {
  const { releases } = useData();
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const filteredReleases = releases.filter((release) => {
    // 1. Category Filter Matching
    let matchesCategory = true;
    const genreLower = (release.genre || '').toLowerCase();

    if (selectedFilter === 'ALBUMS') {
      matchesCategory = release.type === 'ALBUM';
    } else if (selectedFilter === 'SINGLES') {
      matchesCategory = release.type === 'SINGLE';
    } else if (selectedFilter === 'HIP-HOP') {
      matchesCategory = genreLower.includes('hip-hop');
    } else if (selectedFilter === 'RAP') {
      matchesCategory = genreLower.includes('rap');
    } else if (selectedFilter === 'TRAP') {
      matchesCategory = genreLower.includes('trap');
    }

    // 2. Search Query Matching
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      release.title.toLowerCase().includes(q) ||
      release.artistName.toLowerCase().includes(q) ||
      release.catalogNumber.toLowerCase().includes(q) ||
      genreLower.includes(q);

    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredReleases.length / pageSize);
  const paginatedReleases = filteredReleases.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleFilterChange = (f: FilterCategory) => {
    setSelectedFilter(f);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest">
          <Disc className="w-3.5 h-3.5" />
          <span>MASTER DISCOGRAPHY &amp; HIP-HOP CATALOG</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
          RECORD <span className="text-gold-gradient">RELEASES</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400">
          Explore official WorldStar Hip Hop master releases, iconic rap albums, trending drill drops, and verified studio singles.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 glass-panel-gold rounded-2xl p-4 md:p-6 border border-white/10">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all cursor-pointer ${
                selectedFilter === f
                  ? 'bg-gold text-obsidian font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-gold/30'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-gold absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search albums, artists, trap, drill..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-xs font-mono"
          />
        </div>
      </div>

      {/* Active Count Metric */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-2">
        <span>SHOWING {filteredReleases.length} VERIFIED RELEASES</span>
        <span>CATALOG FILTER: {selectedFilter}</span>
      </div>

      {/* Releases Grid */}
      {paginatedReleases.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center space-y-4">
          <Music className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-zinc-400 font-mono text-sm">No releases found matching your search criteria.</p>
          <button
            onClick={() => { setSelectedFilter('ALL'); setSearchQuery(''); }}
            className="px-4 py-2 rounded-xl bg-gold/20 border border-gold/40 text-gold text-xs font-mono hover:bg-gold/30 transition-colors"
          >
            RESET FILTERS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedReleases.map((release) => {
            const menuItems: MenuItem[] = [
              {
                label: 'VIEW RELEASE',
                icon: <ExternalLink className="w-3.5 h-3.5 text-gold" />,
                href: `/releases/${release.slug}`,
              },
            ];

            if (release.artistSlug) {
              menuItems.push({
                label: 'VIEW ARTIST',
                icon: <User className="w-3.5 h-3.5 text-gold" />,
                href: `/roster/${release.artistSlug}`,
              });
            }

            menuItems.push(
              {
                label: 'COPY CATALOG #',
                icon: <Copy className="w-3.5 h-3.5 text-zinc-400" />,
                onClick: () => {
                  navigator.clipboard.writeText(release.catalogNumber);
                },
              },
              {
                label: 'SHARE RELEASE',
                icon: <Share2 className="w-3.5 h-3.5 text-zinc-400" />,
                onClick: () => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/releases/${release.slug}`
                  );
                },
              }
            );

            return (
              <div
                key={release.id}
                className="group glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between relative bg-obsidian-light"
              >
                <div className="relative aspect-square overflow-hidden p-4">
                  <Image
                    src={release.coverUrl}
                    alt={`${release.title} by ${release.artistName}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-6 left-6 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-obsidian/85 backdrop-blur-md border border-gold/40 text-gold text-[10px] font-mono font-bold">
                      {release.type}
                    </span>
                    {release.genre && (
                      <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-zinc-300 text-[9px] font-mono hidden sm:inline">
                        {release.genre}
                      </span>
                    )}
                  </div>

                  {/* THREE-DOT MENU AT TOP RIGHT */}
                  <div className="absolute top-6 right-6 z-20">
                    <ThreeDotMenu
                      items={menuItems}
                      ariaLabel={`Options for ${release.title}`}
                    />
                  </div>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono text-zinc-500">{release.catalogNumber}</span>
                      {release.genre && (
                        <span className="text-[10px] font-mono text-gold/80 sm:hidden">{release.genre}</span>
                      )}
                    </div>
                    <Link
                      href={`/releases/${release.slug}`}
                      className="block group-hover:text-gold transition-colors"
                    >
                      <h3 className="text-base font-display font-bold text-white line-clamp-1 leading-snug">
                        {release.title}
                      </h3>
                    </Link>

                    {release.artistSlug ? (
                      <Link
                        href={`/roster/${release.artistSlug}`}
                        className="text-xs text-zinc-400 hover:text-gold transition-colors inline-block mt-0.5 font-sans"
                      >
                        {release.artistName}
                      </Link>
                    ) : (
                      <p className="text-xs text-zinc-400 mt-0.5 font-sans">{release.artistName}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[11px] font-mono text-zinc-500">
                    <span>{release.tracksCount} {release.tracksCount === 1 ? 'TRACK' : 'TRACKS'}</span>
                    <span>{release.releaseDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredReleases.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
