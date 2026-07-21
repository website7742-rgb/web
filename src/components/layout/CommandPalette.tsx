'use client';

import React, { useState, useEffect } from 'react';
import { useUI } from '@/context/UIContext';
import { useData } from '@/context/DataContext';
import { Search, Sparkles, User, Disc, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export function CommandPalette() {
  const { isCommandPaletteOpen, closeCommandPalette } = useUI();
  const { artists, releases } = useData();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isCommandPaletteOpen) {
          closeCommandPalette();
        } else {
          // Open handled by navbar
        }
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        closeCommandPalette();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, closeCommandPalette]);

  if (!isCommandPaletteOpen) return null;

  const filteredArtists = artists.filter(a => a.name.toLowerCase().includes(query.toLowerCase()));
  const filteredReleases = releases.filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-xl" onClick={closeCommandPalette} />

      <div className="relative w-full max-w-2xl glass-panel-gold rounded-3xl border border-gold/40 shadow-2xl overflow-hidden z-10">
        <div className="p-4 flex items-center gap-3 border-b border-white/10">
          <Search className="w-5 h-5 text-gold" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search artists, catalog, tours..."
            className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm font-mono"
            autoFocus
          />
          <button onClick={closeCommandPalette} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-6 font-mono text-xs">
          {/* Artists */}
          {filteredArtists.length > 0 && (
            <div className="space-y-2">
              <span className="text-zinc-500 block font-bold">PUBLISHING ARTISTS</span>
              <div className="space-y-1">
                {filteredArtists.map(artist => (
                  <Link
                    key={artist.id}
                    href={`/roster/${artist.slug}`}
                    onClick={closeCommandPalette}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-white"
                  >
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gold" />
                      <span>{artist.name}</span>
                    </div>
                    <span className="text-zinc-500">{artist.country}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Releases */}
          {filteredReleases.length > 0 && (
            <div className="space-y-2">
              <span className="text-zinc-500 block font-bold">DISCOGRAPHY RELEASES</span>
              <div className="space-y-1">
                {filteredReleases.map(release => (
                  <Link
                    key={release.id}
                    href={`/releases/${release.slug}`}
                    onClick={closeCommandPalette}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Disc className="w-4 h-4 text-gold" />
                      <span>{release.title}</span>
                    </div>
                    <span className="text-zinc-500">{release.artistName}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
