'use client';

import React, { useState, useMemo } from 'react';
import { useData } from '@/context/DataContext';
import { Search, Filter, ShieldCheck, ArrowUpRight, Disc, SlidersHorizontal, User, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCountryISO } from '@/lib/utils/countryToISO';
import { useAudio } from '@/context/AudioContext';

const ArtistCard = ({ art, index }: { art: any; index: number }) => {
  const [imageError, setImageError] = useState(false);
  const { playTrack, togglePlay, currentTrack, isPlaying } = useAudio();

  const isThisTrackPlaying = currentTrack?.id === art.id && isPlaying;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (currentTrack?.id === art.id) {
      togglePlay();
    } else {
      playTrack({
        id: art.id,
        title: art.topSongs?.[0] || `${art.name} Top Hit`,
        artist: art.name,
        coverArt: art.avatarUrl,
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8f72e61.mp3?filename=trap-beat-104958.mp3' // High-quality royalty-free sample
      });
    }
  };

  return (
    <Link
      href={`/roster/${art.slug}`}
      className="group bg-black rounded-none overflow-hidden border border-zinc-800 hover:border-gold flex flex-col justify-between transition-colors"
    >
      <div>
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-900 flex items-center justify-center">
          {!imageError ? (
            <Image
              src={art.avatarUrl}
              alt={art.name}
              fill
              priority={index < 6}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black border border-zinc-700/50 flex items-center justify-center">
              <span className="font-hero text-4xl text-[#D4AF37] font-bold">
                {art.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

          {/* PLAY BUTTON */}
          <button 
            onClick={handlePlay}
            className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-gold hover:text-black hover:border-gold hover:scale-110 transition-all z-10"
          >
            {isThisTrackPlaying ? (
              <div className="flex gap-0.5 items-end h-3 w-3">
                <span className="w-[3px] h-3 bg-current animate-[pulse_1s_ease-in-out_infinite]"></span>
                <span className="w-[3px] h-1.5 bg-current animate-[pulse_1s_ease-in-out_infinite_0.2s]"></span>
                <span className="w-[3px] h-2.5 bg-current animate-[pulse_1s_ease-in-out_infinite_0.4s]"></span>
              </div>
            ) : (
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            )}
          </button>

          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-black border border-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://flagcdn.com/w20/${getCountryISO(art.country)}.png`} 
                alt={art.country} 
                className="w-5 h-auto rounded-sm border border-zinc-700/50" 
              />
              <span className="text-zinc-400 text-xs tracking-wide uppercase font-label">
                {art.country}
              </span>
            </span>
            {art.isVerified && (
              <span className="w-7 h-7 rounded-none bg-gold/20 border border-gold flex items-center justify-center text-gold">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {art.genres.map((g: string) => (
              <span key={g} className="text-[10px] font-label text-gold font-bold uppercase px-2.5 py-0.5 rounded-none bg-black border border-gold">
                {g}
              </span>
            ))}
          </div>

          <h3 className="font-hero font-bold text-xl sm:text-2xl text-white group-hover:text-gold transition-colors">
            {art.name}
          </h3>

          <p className="text-xs text-zinc-400 font-sans line-clamp-2">
            {art.tagline}
          </p>

          {art.topSongs && art.topSongs.length > 0 && (
            <div className="border-t border-zinc-800 pt-3">
              <span className="text-[10px] font-label text-zinc-500 block uppercase font-bold">KEY RELEASES:</span>
              <p className="text-xs font-mono text-zinc-300 truncate">
                {art.topSongs.join(' • ')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-zinc-800 flex items-center justify-between font-label text-xs text-gold font-bold group-hover:translate-x-1 transition-transform">
        <span>VIEW DIGITAL PRESS KIT</span>
        <ArrowUpRight className="w-4 h-4" />
      </div>
    </Link>
  );
};

export default function RosterPage() {
  const { artists } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'A-Z' | 'Z-A' | 'STREAMS' | 'GRAMMYS'>('STREAMS');

  // Extract unique countries
  const countries = useMemo(() => {
    const set = new Set(artists.map(a => a.country));
    return ['ALL', ...Array.from(set).sort()];
  }, [artists]);

  const genres = ['ALL', 'Pop', 'Hip-Hop', 'R&B', 'Rock', 'Country', 'Latin', 'Electronic', 'Alternative'];

  const filteredArtists = useMemo(() => {
    return artists
      .filter((art) => {
        const query = searchQuery.toLowerCase();
        const matchesQuery = 
          art.name.toLowerCase().includes(query) ||
          art.genres.some(g => g.toLowerCase().includes(query)) ||
          art.country.toLowerCase().includes(query) ||
          art.tagline.toLowerCase().includes(query);

        const matchesGenre = selectedGenre === 'ALL' || art.genres.includes(selectedGenre as any);
        const matchesCountry = selectedCountry === 'ALL' || art.country === selectedCountry;

        return matchesQuery && matchesGenre && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === 'A-Z') return a.name.localeCompare(b.name);
        if (sortBy === 'Z-A') return b.name.localeCompare(a.name);
        if (sortBy === 'GRAMMYS') return b.grammyWins - a.grammyWins;
        return b.totalStreams - a.totalStreams;
      });
  }, [artists, searchQuery, selectedGenre, selectedCountry, sortBy]);

  return (
    <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 space-y-10 sm:space-y-12">
      {/* Page Header */}
      <div className="space-y-4 text-center md:text-left border-b border-[#D4AF37]/30 pb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/10 text-gold border border-gold/30 text-xs font-label uppercase tracking-widest font-bold">
          <Disc className="w-4 h-4" />
          <span>AETHERIA PUBLISHING DIRECTORY</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-hero font-bold uppercase tracking-tight text-white">
          RECORDING ARTIST ROSTER
        </h1>
        <p className="text-zinc-400 font-sans text-lg md:text-xl">
          DISCOVER THE VOICES SHAPING GLOBAL CULTURE
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-black border border-gold rounded-none p-6 border border-gold/30 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by artist name, genre, or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-none bg-white/5 border border-zinc-800 text-white font-sans text-sm focus:outline-none focus:border-gold min-h-[44px]"
            />
          </div>

          {/* Country Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-3.5 rounded-none bg-obsidian border border-zinc-800 text-white font-label text-xs focus:outline-none focus:border-gold min-h-[44px]"
            >
              {countries.map(c => (
                <option key={c} value={c}>COUNTRY: {c.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-3.5 rounded-none bg-obsidian border border-zinc-800 text-white font-label text-xs focus:outline-none focus:border-gold min-h-[44px]"
            >
              <option value="STREAMS">SORT: TOTAL STREAMS</option>
              <option value="GRAMMYS">SORT: GRAMMY WINS</option>
              <option value="A-Z">SORT: ALPHABETICAL (A-Z)</option>
              <option value="Z-A">SORT: ALPHABETICAL (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Genre Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-4">
          <span className="text-xs font-label text-zinc-400 font-bold uppercase mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gold" />
            <span>GENRE:</span>
          </span>
          {genres.map((g) => {
            const isActive = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-label font-bold transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-gold text-obsidian shadow-lg'
                    : 'bg-white/5 border border-zinc-800 text-zinc-300 hover:border-gold/40'
                }`}
              >
                {g.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {filteredArtists.map((art, index) => (
          <ArtistCard key={art.id} art={art} index={index} />
        ))}
      </div>

      {filteredArtists.length === 0 && (
        <div className="text-center py-16 space-y-4 font-mono">
          <p className="text-xl text-white font-bold">NO ARTISTS MATCH YOUR SEARCH CRITERIA</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('ALL');
              setSelectedCountry('ALL');
            }}
            className="px-6 py-3 rounded-none bg-gold text-obsidian font-bold text-xs"
          >
            RESET SEARCH FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
