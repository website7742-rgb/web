'use client';

import React, { useState, useMemo } from 'react';
import { useData } from '@/providers/DataContext';
import { Search, ShieldCheck, Play, ArrowUpRight, Disc, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCountryISO } from '@/lib/utils/countryToISO';
import { useAudio } from '@/providers/AudioContext';

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
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8b8f72e61.mp3?filename=trap-beat-104958.mp3'
      });
    }
  };

  return (
    <Link
      href={`/roster/${art.slug}`}
      className="group bg-black rounded-none overflow-hidden border border-zinc-800 hover:border-red-600 flex flex-col justify-between transition-colors"
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
              <span className="font-black text-4xl text-red-600 font-bold">
                {art.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

          {/* PLAY BUTTON */}
          <button 
            onClick={handlePlay}
            className="absolute bottom-4 right-4 w-11 h-11 rounded-sm bg-red-600/90 border border-red-500/50 flex items-center justify-center text-white hover:bg-red-700 hover:scale-110 transition-all z-10 shadow-xl"
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
              <Image 
                src={`https://flagcdn.com/w20/${getCountryISO(art.country)}.png`} 
                alt={art.country} 
                width={20}
                height={15}
                className="w-5 h-auto rounded-none border border-zinc-700/50" 
              />
              <span className="text-zinc-400 text-xs tracking-wide uppercase font-bold">
                {art.country}
              </span>
            </span>
            {art.isVerified && (
              <span className="w-7 h-7 rounded-none bg-red-600/20 border border-red-600 flex items-center justify-center text-red-600">
                <ShieldCheck className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {art.genres.map((g: string) => (
              <span key={g} className="text-[10px] font-bold text-red-600 uppercase px-2.5 py-0.5 rounded-none bg-black border border-red-600">
                {g}
              </span>
            ))}
          </div>

          <h3 className="font-black text-xl sm:text-2xl text-white group-hover:text-red-600 uppercase transition-colors">
            {art.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2">
            {art.tagline}
          </p>

          {art.topSongs && art.topSongs.length > 0 && (
            <div className="border-t border-zinc-800 pt-3">
              <span className="text-[10px] text-zinc-500 block uppercase font-bold">KEY RELEASES:</span>
              <p className="text-xs font-bold text-zinc-300 truncate uppercase mt-1">
                {art.topSongs.join(' â€¢ ')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-zinc-800 flex items-center justify-between text-xs text-red-600 font-bold uppercase group-hover:translate-x-1 transition-transform">
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
    <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-24 space-y-10 sm:space-y-12">
      {/* Page Header */}
      <div className="space-y-4 text-center md:text-left border-b border-zinc-800 pb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-red-600/10 text-red-600 border border-red-600/30 text-xs uppercase tracking-widest font-bold">
          <Disc className="w-4 h-4" />
          <span>WORLDSTAR ROSTER</span>
        </div>
        <h1 className="uppercase font-black text-white text-4xl md:text-5xl tracking-tight leading-tight">
          WORLDSTAR ARTISTS
        </h1>
        <p className="uppercase text-zinc-400 font-semibold tracking-wider text-sm">
          THE HOTTEST TALENT IN THE GAME RIGHT NOW.
        </p>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-[#0a0a0a] border border-zinc-800 rounded-none p-6 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="SEARCH BY ARTIST NAME, GENRE, OR COUNTRY..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-sm bg-black border border-zinc-800 text-white text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all min-h-[44px]"
            />
          </div>

          {/* Country Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-3.5 rounded-sm bg-black border border-zinc-800 text-white text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all min-h-[44px] appearance-none"
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
              className="w-full p-3.5 rounded-sm bg-black border border-zinc-800 text-white text-xs font-bold uppercase tracking-wide focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all min-h-[44px] appearance-none"
            >
              <option value="STREAMS">SORT: TOTAL STREAMS</option>
              <option value="GRAMMYS">SORT: GRAMMY WINS</option>
              <option value="A-Z">SORT: ALPHABETICAL (A-Z)</option>
              <option value="Z-A">SORT: ALPHABETICAL (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Genre Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-5">
          <span className="text-xs text-zinc-500 font-bold uppercase mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-600" />
            <span>GENRE:</span>
          </span>
          {genres.map((g) => {
            const isActive = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {g.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredArtists.map((art, index) => (
          <ArtistCard key={art.id} art={art} index={index} />
        ))}
      </div>

      {filteredArtists.length === 0 && (
        <div className="text-center py-20 space-y-5 bg-[#0a0a0a] border border-zinc-800">
          <p className="text-xl md:text-2xl text-white font-black uppercase tracking-tight">NO ARTISTS MATCH YOUR SEARCH CRITERIA</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('ALL');
              setSelectedCountry('ALL');
            }}
            className="px-8 py-3.5 rounded-sm bg-red-600 hover:bg-red-700 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-lg"
          >
            RESET SEARCH FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
