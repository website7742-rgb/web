'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Trophy, Users, ArrowRight, Music, Flame, Play, ArrowUpRight, Disc } from 'lucide-react';
import { useData } from '@/providers/DataContext';
import { RosterSliderClient } from './RosterSliderClient';
import { TrendingVideosGrid } from '@/components/TrendingVideosGrid';
import { AggregatedVideo } from '@/services/YoutubeService';
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';

const FALLBACK_ARTIST_IMG = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/TravisScott-byPhilipRomano.jpg/500px-TravisScott-byPhilipRomano.jpg';

export function ArtistFirstHomeClient({ latestVideos = [] }: { latestVideos?: AggregatedVideo[] }) {
  const { artists, submissions } = useData();
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [visibleCount, setVisibleCount] = useState<number>(50);
  const [imgErrorState, setImgErrorState] = useState<{ [key: string]: boolean }>({});

  // Spotlight Artist (Top Roster Feature)
  const spotlightArtist = (artists && artists.length > 0)
    ? (artists.find(a => a.name.includes('Kendrick') || a.name.includes('Tupac') || a.name.includes('Eminem')) || artists[0])
    : {
        id: 'spotlight-fallback',
        name: 'TUPAC SHAKUR',
        slug: 'tupac-shakur',
        tagline: 'LEGENDARY HIP-HOP ICON & POET',
        bio: 'One of the most influential rap artists of all time, redefining music, culture, and storytelling globally.',
        avatarUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tupac_Shakur_1993.jpg/500px-Tupac_Shakur_1993.jpg',
        heroUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tupac_Shakur_1993.jpg/500px-Tupac_Shakur_1993.jpg',
        country: 'United States',
        monthlyListeners: 28500000,
        totalStreams: 14200000000,
        grammyWins: 6,
        riaaCertifications: { platinum: 12, gold: 8, diamond: 1 },
        genres: ['Hip-Hop', 'Rap', 'West Coast Rap'],
        labelStatus: 'EXCLUSIVE' as const,
        socials: {},
        streamingPlatforms: [],
      };

  // Genre filtering for artist grid
  const genres = ['ALL', 'Hip-Hop', 'R&B', 'Electronic', 'Alternative', 'Afrobeats', 'Pop'];
  const filteredArtists = artists.filter(a => {
    if (selectedGenre === 'ALL') return true;
    if (a.primaryGenre === selectedGenre) return true;
    if (a.genres && Array.isArray(a.genres) && a.genres.includes(selectedGenre as any)) return true;
    return false;
  });

  const displayedArtists = filteredArtists.slice(0, visibleCount);
  const approvedSubmissions = submissions.filter(s => s.status === 'APPROVED');

  const submissionVideos: AggregatedVideo[] = submissions
    .filter(s => Boolean(s.videoUrl))
    .map((s, idx) => ({
      videoId: `sub-video-${s.id || idx}`,
      title: `OFFICIAL VIDEO ||| ${s.stageName || s.fullName} - ${s.genre} Master Visual`,
      thumbnailUrl: s.coverImageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
      channelName: `${s.stageName || s.fullName} (Direct Submission)`,
      embedUrl: s.videoUrl || '',
      publishedAt: new Date().toISOString(),
    }));


  const combinedVideos = [...submissionVideos, ...latestVideos];

  const handleImgError = (id: string) => {
    setImgErrorState(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-20 md:space-y-28 selection:bg-red-600 selection:text-white pt-6">
      
      {/* 1. TOP ROSTER ICON CAROUSEL */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-red-600 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight uppercase">
              FEATURED <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">ARTIST ROSTER</span>
            </h2>
          </div>
          <Link
            href="/roster"
            className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-red-500 hover:text-red-400 transition-colors"
          >
            <span>VIEW ALL ARTISTS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <RosterSliderClient />
      </section>

      {/* 2. ARTIST DISCOVERY BENTO GRID */}
      {/* Infinite marquee for premium vibe */}
      <section className="overflow-hidden bg-black py-3">
        <div className="marquee flex whitespace-nowrap text-4xl font-bold tracking-wider text-stroke animate-marquee transform-gpu will-change-transform">
          +++ EXCLUSIVE RELEASES 2026 +++ GLOBAL TALENT +++ LATEST DROPS +++
        </div>
      </section>

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-7 bg-red-600 rounded-full" />
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight uppercase">
              EXPLORE <span className="text-red-500">GLOBAL TALENT</span>
            </h2>
          </div>

          {/* Genre Filter Tabs */}
          <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {genres.map(genre => (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(genre);
                  setVisibleCount(50);
                }}
                className={`px-4 py-2 rounded-xl uppercase tracking-wider font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedGenre === genre
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* 50 Artists Bento Box Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[280px] md:auto-rows-[320px]">
          {displayedArtists.map((artist, idx) => {
            const isBento = idx === 0 || idx === 1;
            const hasErr = imgErrorState[artist.id];
            const rawSrc = artist.avatarUrl || artist.heroUrl || artist.imageUrl;
            const imgSrc = (!hasErr && rawSrc) ? rawSrc : null; // null = show gradient placeholder
            const genreName = artist.primaryGenre || (artist.genres && artist.genres[0]) || 'Hip-Hop';
            const listeners = artist.monthlyListeners ? (artist.monthlyListeners / 1_000_000).toFixed(1) + 'M' : '12.4M';

            return (
              <Link
                key={artist.id}
                href={`/roster/${artist.slug || artist.id}`}
                className={`group bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden transform-gpu will-change-transform 
                  hover:border-red-600/60 hover:shadow-[0_0_50px_rgba(220,38,38,0.3)]
                  transition-all duration-500 ease-out flex flex-col justify-between backdrop-blur-xl 
                  ${
                    isBento
                      ? 'sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 shadow-[0_0_30px_rgba(220,38,38,0.12)] md:hover:shadow-[0_0_60px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.4)]'
                      : 'col-span-1 hover:scale-[1.02]'
                  }`}
              >
                <div className={`relative w-full bg-zinc-900 overflow-hidden ${isBento ? 'aspect-[16/10] md:aspect-[4/3]' : 'aspect-square'}`}>
                  {imgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imgSrc}
                      alt={artist.name}
                      onError={() => handleImgError(artist.id)}
                      loading={idx < 4 ? 'eager' : 'lazy'}
                      className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-90 brightness-90 group-hover:brightness-100"
                    />
                  ) : (
                    /* Premium gradient placeholder when no image is available */
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black">
                      <span className={`font-black text-white/20 uppercase tracking-tighter select-none ${
                        isBento ? 'text-7xl' : 'text-4xl'
                      }`}>
                        {artist.name.slice(0, 2)}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 to-transparent" />
                    </div>
                  )}

                  {/* Gradient vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent opacity-90" />

                  {/* Subtle red shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-red-950/0 to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500" />

                  <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md">
                    {genreName}
                  </div>

                  <div className="absolute top-3 right-3 z-30 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {isBento && (
                      <span className="bg-white/10 border border-white/20 text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md pointer-events-none">
                        TOP TIER
                      </span>
                    )}

                    <ThreeDotMenu
                      items={[
                        {
                          label: 'VIEW PRESS KIT',
                          icon: <ArrowUpRight className="w-3.5 h-3.5 text-red-500" />,
                          href: `/roster/${artist.slug}`,
                        },
                        {
                          label: 'PLAY TOP TRACK',
                          icon: <Play className="w-3.5 h-3.5 text-zinc-400" />,
                          href: `/roster/${artist.slug}`,
                        },
                        {
                          label: 'SHARE ARTIST',
                          icon: <Disc className="w-3.5 h-3.5 text-zinc-400" />,
                          onClick: () => {
                            if (typeof window !== 'undefined') {
                              navigator.clipboard.writeText(`${window.location.origin}/roster/${artist.slug}`);
                            }
                          },
                        },
                      ]}
                      ariaLabel={`Options for ${artist.name}`}
                    />
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className={`font-black text-white uppercase tracking-tight group-hover:text-red-400 transition-colors duration-300 line-clamp-1 ${
                    isBento ? 'text-2xl sm:text-3xl' : 'text-base sm:text-lg'
                  }`}>
                    {artist.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-1">
                    <span>{listeners} LISTENERS</span>
                    <span className="text-red-500 font-bold group-hover:translate-x-1 group-hover:text-red-400 transition-all duration-300">PROFILE →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 3. ELEVATED DARK GLASSMORPHISM LOAD MORE PILL */}
        {visibleCount < filteredArtists.length && (
          <div className="text-center pt-10">
            <button
              onClick={() => setVisibleCount(prev => prev + 50)}
              className="bg-white/[0.03] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08] hover:border-white/20 transition-all !rounded-none px-10 py-4 text-xs font-mono font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-xl hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:scale-105 cursor-pointer"
            >
              EXPLORE MORE TALENT
            </button>
          </div>
        )}
      </section>

      {/* 4. NEW TALENT SPOTLIGHT (Portal Submissions) */}
      {approvedSubmissions.length > 0 && (
        <section className="bg-gradient-to-r from-red-950/30 via-[#0a0a0a] to-zinc-950 border border-red-600/30 rounded-3xl p-6 md:p-10 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-red-500" />
              <h2 className="text-xl md:text-2xl font-display font-bold text-white uppercase tracking-tight">
                NEWLY APPROVED <span className="text-red-500">TALENT SUBMISSIONS</span>
              </h2>
            </div>
            <Link href="/submit" className="text-xs font-mono font-bold text-zinc-400 hover:text-white uppercase tracking-wider">
              Submit Demo →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvedSubmissions.slice(0, 4).map(sub => (
              <div key={sub.id} className="bg-black/60 border border-white/10 rounded-2xl p-5 flex gap-4 items-center backdrop-blur-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sub.coverImageUrl || FALLBACK_ARTIST_IMG}
                  alt={sub.stageName || sub.fullName}
                  className="w-20 h-20 rounded-xl object-cover border border-red-600/40"
                />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base truncate">{sub.stageName || sub.fullName}</h3>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-600/30">
                      {sub.genre}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-1">{sub.biography || 'Newly signed artist to the WorldStar talent roster.'}</p>
                  <div className="flex items-center gap-3 pt-1">
                    {sub.audioUrl && (
                      <a href={sub.audioUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-red-500 font-bold hover:underline flex items-center gap-1">
                        <Music className="w-3 h-3" /> DEMO AUDIO
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. AUTOMATED TRENDING VIRAL RAP VIDEOS GRID */}
      <TrendingVideosGrid videos={combinedVideos} />


    </div>
  );
}
