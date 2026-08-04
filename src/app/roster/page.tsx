'use client';

import React, { useState, useMemo } from 'react';
import { useData } from '@/providers/DataContext';
import { Search, ShieldCheck, Play, ArrowUpRight, Disc, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getCountryISO } from '@/lib/utils/countryToISO';
import { useAudio } from '@/providers/AudioContext';
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';
import { PaginationControls } from '@/components/ui/PaginationControls';

const ArtistCard = ({ art, index, isBento = false }: { art: any; index: number; isBento?: boolean }) => {
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
      className={`group bg-[#0a0a0a] !rounded-none border border-zinc-800 hover:border-red-600/80 hover:shadow-[0_0_25px_rgba(255,43,43,0.3)] transition-all duration-500 overflow-hidden flex flex-col justify-between backdrop-blur-xl relative ${
        isBento ? 'col-span-1 md:col-span-2 md:row-span-2 shadow-[0_0_30px_rgba(220,38,38,0.2)]' : 'col-span-1'
      }`}
    >
      <div>
        <div className={`relative w-full overflow-hidden bg-zinc-950 flex items-center justify-center ${isBento ? 'aspect-[16/10] md:aspect-[4/3]' : 'aspect-[3/4]'}`}>
          {!imageError ? (
            <Image
              src={art.avatarUrl}
              alt={art.name}
              fill
              priority={index < 4}
              sizes={isBento ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"}
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
              <span className="font-black text-4xl text-red-600 uppercase tracking-widest font-mono">
                {art.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

          {/* PLAY BUTTON OVERLAY */}
          <button 
            onClick={handlePlay}
            aria-label={`Play top release by ${art.name}`}
            className="absolute bottom-4 right-4 w-12 h-12 rounded-none bg-red-600/90 hover:bg-red-500 flex items-center justify-center text-white transition-all z-20 shadow-[0_0_20px_rgba(220,38,38,0.6)] group-hover:scale-110 cursor-pointer border border-red-400/50"
          >
            {isThisTrackPlaying ? (
              <div className="flex gap-0.5 items-end h-3.5 w-3.5">
                <span className="w-[3px] h-3.5 bg-current animate-[pulse_1s_ease-in-out_infinite]"></span>
                <span className="w-[3px] h-2 bg-current animate-[pulse_1s_ease-in-out_infinite_0.2s]"></span>
                <span className="w-[3px] h-3 bg-current animate-[pulse_1s_ease-in-out_infinite_0.4s]"></span>
              </div>
            ) : (
              <Play className="w-5 h-5 ml-0.5 fill-current" />
            )}
          </button>

          {/* TOP BADGES & THREE-DOT MENU */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-black/80 border border-white/10 backdrop-blur-md pointer-events-none">
              <Image 
                src={`https://flagcdn.com/w20/${getCountryISO(art.country)}.png`} 
                alt={art.country} 
                width={16}
                height={12}
                className="w-3.5 h-auto rounded-xs opacity-90" 
              />
              <span className="text-zinc-300 text-[10px] font-mono tracking-wider uppercase font-bold">
                {art.country}
              </span>
            </span>

            <div className="flex items-center gap-2">
              {isBento && (
                <span className="px-2.5 py-1 rounded-none bg-red-600 text-white font-mono text-[9px] font-extrabold uppercase tracking-widest shadow-lg pointer-events-none">
                  TOP SPOTLIGHT
                </span>
              )}

              {art.isVerified && !isBento && (
                <span className="px-2 py-1 rounded-none bg-black/80 border border-red-600/50 text-red-400 text-[9px] font-mono font-bold flex items-center gap-1 pointer-events-none">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                  <span>OFFICIAL</span>
                </span>
              )}

              <ThreeDotMenu
                items={[
                  {
                    label: 'VIEW PRESS KIT',
                    icon: <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />,
                    href: `/roster/${art.slug}`,
                  },
                  {
                    label: 'PLAY TOP TRACK',
                    icon: <Play className="w-3.5 h-3.5 text-zinc-400" />,
                    onClick: (e?: any) => handlePlay(e || ({ preventDefault: () => {}, stopPropagation: () => {} } as any)),
                  },
                  {
                    label: 'SHARE ARTIST',
                    icon: <Disc className="w-3.5 h-3.5 text-zinc-400" />,
                    onClick: () => {
                      navigator.clipboard.writeText(`${window.location.origin}/roster/${art.slug}`);
                    },
                  },
                ]}
                ariaLabel={`Options for ${art.name}`}
              />
            </div>
          </div>
        </div>

        <div className="p-5 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent">
          <div className="flex flex-wrap items-center gap-2">
            {art.genres.map((g: string) => (
              <span key={g} className="text-[9px] font-mono font-bold text-red-400 uppercase px-2 py-0.5 rounded-none bg-red-600/10 border border-red-600/30">
                {g}
              </span>
            ))}
          </div>

          <h3 className={`font-black text-white group-hover:text-red-500 uppercase tracking-tight transition-colors ${isBento ? 'text-3xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>
            {art.name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2">
            {art.tagline}
          </p>

          {art.topSongs && art.topSongs.length > 0 && (
            <div className="border-t border-zinc-800/80 pt-2.5">
              <span className="text-[10px] text-zinc-500 block uppercase font-mono font-bold">KEY RELEASES:</span>
              <p className="text-xs font-bold text-zinc-300 truncate uppercase mt-0.5">
                {art.topSongs.join(' • ')}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-red-500 font-mono font-bold uppercase group-hover:translate-x-1 transition-transform bg-black/90">
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
  const [sortBy, setSortBy] = useState<'DEFAULT' | 'A-Z' | 'Z-A' | 'STREAMS' | 'GRAMMYS'>('DEFAULT');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

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
        if (sortBy === 'STREAMS') return b.totalStreams - a.totalStreams;
        return 0; // DEFAULT — keep array order (new artists on top)
      });
  }, [artists, searchQuery, selectedGenre, selectedCountry, sortBy]);

  const isDefaultView = !searchQuery && selectedGenre === 'ALL' && selectedCountry === 'ALL' && sortBy === 'DEFAULT';
  const totalPages = Math.ceil(filteredArtists.length / pageSize);
  const paginatedArtists = filteredArtists.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleGenreChange = (g: string) => {
    setSelectedGenre(g);
    setCurrentPage(1);
  };

  const handleCountryChange = (c: string) => {
    setSelectedCountry(c);
    setCurrentPage(1);
  };

  const handleSortChange = (s: any) => {
    setSortBy(s);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-20 space-y-10 sm:space-y-12">
      {/* Page Header */}
      <div className="space-y-4 text-center md:text-left border-b border-white/10 pb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 text-red-500 border border-red-600/30 text-xs font-mono font-bold uppercase tracking-widest">
          <Disc className="w-4 h-4" />
          <span>WORLDSTAR ROSTER DIRECTORY</span>
        </div>
        <h1 className="uppercase font-black text-white text-4xl md:text-6xl tracking-tight leading-tight drop-shadow-2xl">
          WORLDSTAR TALENT ROSTER
        </h1>
        <p className="uppercase text-zinc-400 font-mono tracking-wider text-sm max-w-2xl">
          Explore 200+ verified hip-hop icons, global chart-toppers, and exclusive signed artists.
        </p>
      </div>

      {/* ⭐ 3. COMMAND CENTER SEARCH BAR & FILTERS */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Command Center Search Bar */}
          <div className="md:col-span-6 relative group">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="SEARCH BY ARTIST NAME, GENRE, OR COUNTRY..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-16 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs font-bold font-mono uppercase tracking-wide focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/50 transition-all shadow-inner"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white/10 border border-white/10 rounded-lg px-2 py-1 text-[10px] font-mono text-zinc-400 pointer-events-none">
              <span>⌘K</span>
            </div>
          </div>

          {/* Country Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs font-bold font-mono uppercase tracking-wide focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/50 transition-all appearance-none cursor-pointer"
            >
              {countries.map(c => (
                <option key={c} value={c} className="bg-zinc-950 text-white">COUNTRY: {c.toUpperCase()}</option>
              ))}
            </select>
          </div>

          {/* Sort Control */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs font-bold font-mono uppercase tracking-wide focus:outline-none focus:border-red-500/80 focus:ring-2 focus:ring-red-500/50 transition-all appearance-none cursor-pointer"
            >
              <option value="DEFAULT" className="bg-zinc-950 text-white">SORT: NEW ARTISTS FIRST</option>
              <option value="STREAMS" className="bg-zinc-950 text-white">SORT: TOTAL STREAMS</option>
              <option value="GRAMMYS" className="bg-zinc-950 text-white">SORT: GRAMMY WINS</option>
              <option value="A-Z" className="bg-zinc-950 text-white">SORT: ALPHABETICAL (A-Z)</option>
              <option value="Z-A" className="bg-zinc-950 text-white">SORT: ALPHABETICAL (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Genre Pill Filters */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-6">
          <span className="text-xs text-zinc-500 font-bold font-mono uppercase mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
            <span>GENRE:</span>
          </span>
          {genres.map((g) => {
            const isActive = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10 hover:border-white/20'
                }`}
              >
                {g.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* ⭐ 2. BENTO GRID DIRECTORY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[280px] md:auto-rows-[320px]">
        {paginatedArtists.map((art, index) => {
          const isBento = isDefaultView && currentPage === 1 && (index === 0 || index === 1);
          return (
            <ArtistCard key={art.id} art={art} index={index} isBento={isBento} />
          );
        })}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredArtists.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {filteredArtists.length === 0 && (
        <div className="text-center py-20 space-y-5 bg-[#0a0a0a] border border-white/10 rounded-3xl p-8">
          <p className="text-xl md:text-2xl text-white font-black uppercase tracking-tight">NO ARTISTS MATCH YOUR SEARCH CRITERIA</p>
          <button
            onClick={() => {
              handleSearchChange('');
              handleGenreChange('ALL');
              handleCountryChange('ALL');
              handleSortChange('DEFAULT');
            }}
            className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs uppercase tracking-widest transition-colors shadow-lg cursor-pointer"
          >
            RESET SEARCH FILTERS
          </button>
        </div>
      )}
    </div>
  );
}
