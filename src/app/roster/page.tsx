'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Search, ShieldCheck, UserPlus, Disc, SlidersHorizontal, Loader2, Globe, Music, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import { toggleFollowAction } from '@/app/actions/socialActions';
import { useUI } from '@/providers/UIContext';
import { PaginationControls } from '@/components/ui/PaginationControls';

interface ProfileArtist {
  id: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  country?: string;
  genre?: string;
  follower_count: number;
}

const DynamicArtistCard = ({ art, index, currentUserId }: { art: ProfileArtist; index: number; currentUserId: string | null }) => {
  const { openAuthModal, showToast } = useUI();
  const [following, setFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(art.follower_count);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!currentUserId || currentUserId === art.id) return;
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    supabase
      .from('followers')
      .select('id')
      .eq('follower_id', currentUserId)
      .eq('following_id', art.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setFollowing(true);
      });
  }, [art.id, currentUserId]);

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) return openAuthModal();
    if (currentUserId === art.id) return showToast("You cannot follow yourself.", "error");

    const nextFollowing = !following;
    setFollowing(nextFollowing);
    setFollowerCount((prev) => (nextFollowing ? prev + 1 : Math.max(0, prev - 1)));

    startTransition(async () => {
      const res = await toggleFollowAction(art.id);
      if (res.success) {
        setFollowing(res.following ?? nextFollowing);
        showToast(res.following ? `Now following ${art.full_name}!` : `Unfollowed ${art.full_name}`, 'success');
      } else {
        // Revert
        setFollowing(!nextFollowing);
        setFollowerCount((prev) => (!nextFollowing ? prev + 1 : Math.max(0, prev - 1)));
        showToast(res.error || 'Failed to update follow status.', 'error');
      }
    });
  };

  return (
    <div className="group bg-[#0a0a0a] border border-zinc-800 hover:border-red-600/80 hover:shadow-[0_0_25px_rgba(255,43,43,0.2)] transition-all duration-300 overflow-hidden flex flex-col justify-between relative backdrop-blur-xl">
      <div className="p-6 space-y-4">
        {/* AVATAR & HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
            {art.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={art.avatar_url} alt={art.full_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <span className="font-black text-xl text-red-600 font-mono">
                {art.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <button
            onClick={handleFollow}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all border cursor-pointer ${
              following
                ? 'bg-neutral-800 border-neutral-700 text-zinc-300 hover:bg-neutral-700'
                : 'bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600'
            }`}
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : following ? (
              'FOLLOWING'
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                FOLLOW
              </>
            )}
          </button>
        </div>

        {/* ARTIST INFO */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold text-red-400 uppercase px-2 py-0.5 bg-red-600/10 border border-red-600/30">
              {art.genre || 'HIP-HOP'}
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              • {art.country || 'USA'}
            </span>
          </div>

          <h3 className="font-black text-white text-xl uppercase tracking-tight group-hover:text-red-500 transition-colors truncate">
            {art.full_name}
          </h3>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-2 font-mono">
            {art.bio || 'Official Worldstar Hip Hop verified artist profile.'}
          </p>
        </div>
      </div>

      {/* FOOTER METRICS */}
      <div className="px-6 py-3 border-t border-zinc-800/80 bg-black/90 flex items-center justify-between text-xs font-mono">
        <span className="text-zinc-500 uppercase font-bold text-[10px]">VERIFIED ARTIST</span>
        <span className="text-white font-bold">{followerCount} FOLLOWERS</span>
      </div>
    </div>
  );
};

export default function RosterPage() {
  const [artists, setArtists] = useState<ProfileArtist[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user?.id || null);
    });

    // Fetch dynamic profiles joined with follower counts
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, bio, country, genre, followers:followers_following_id_fkey(count)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setIsLoading(false);
        if (!error && data) {
          const formatted: ProfileArtist[] = data.map((p: any) => ({
            id: p.id,
            full_name: p.full_name || 'UNKNOWN ARTIST',
            avatar_url: p.avatar_url,
            bio: p.bio,
            country: p.country || 'USA',
            genre: p.genre || 'HIP-HOP',
            follower_count: p.followers?.[0]?.count || 0,
          }));
          setArtists(formatted);
        }
      });
  }, []);

  const genres = ['ALL', 'HIP-HOP', 'RAP', 'R&B', 'POP', 'DRILL', 'TRAP'];

  const filteredArtists = useMemo(() => {
    return artists.filter((art) => {
      const query = searchQuery.toLowerCase();
      const matchesQuery =
        art.full_name.toLowerCase().includes(query) ||
        (art.bio && art.bio.toLowerCase().includes(query)) ||
        (art.country && art.country.toLowerCase().includes(query));

      const matchesGenre =
        selectedGenre === 'ALL' ||
        (art.genre && art.genre.toUpperCase() === selectedGenre.toUpperCase());

      return matchesQuery && matchesGenre;
    });
  }, [artists, searchQuery, selectedGenre]);

  const totalPages = Math.ceil(filteredArtists.length / pageSize);
  const paginatedArtists = filteredArtists.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 space-y-10">
      {/* PAGE HEADER */}
      <div className="space-y-4 border-b border-white/10 pb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 border border-red-600/30 text-xs font-mono font-bold uppercase tracking-widest">
          <Disc className="w-4 h-4" />
          <span>LIVE WORLDSTAR ARTIST DIRECTORY</span>
        </div>
        <h1 className="uppercase font-black text-white text-4xl md:text-6xl tracking-tight leading-tight">
          TALENT ROSTER
        </h1>
        <p className="uppercase text-zinc-400 font-mono tracking-wider text-sm max-w-2xl">
          Discover verified hip-hop icons, active platform creators, and signed artists.
        </p>
      </div>

      {/* SEARCH BAR & GENRE FILTERS */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-6 shadow-2xl">
        <div className="relative group">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors" />
          <input
            type="text"
            placeholder="SEARCH BY ARTIST NAME, BIO, OR COUNTRY..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/10 text-white text-xs font-bold font-mono uppercase tracking-wide focus:outline-none focus:border-red-500 transition-all"
          />
        </div>

        {/* Genre Filters */}
        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
          <span className="text-xs text-zinc-500 font-bold font-mono uppercase mr-2 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
            <span>GENRE:</span>
          </span>
          {genres.map((g) => {
            const isActive = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => {
                  setSelectedGenre(g);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/10'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* ARTISTS DIRECTORY GRID */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <p className="text-xs font-mono uppercase tracking-widest">Loading artist roster...</p>
        </div>
      ) : paginatedArtists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedArtists.map((art, index) => (
            <DynamicArtistCard key={art.id} art={art} index={index} currentUserId={currentUserId} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4 bg-[#0a0a0a] border border-white/10 p-8">
          <p className="text-xl text-white font-black uppercase tracking-tight">NO ARTISTS FOUND</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('ALL');
            }}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            RESET FILTERS
          </button>
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredArtists.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
