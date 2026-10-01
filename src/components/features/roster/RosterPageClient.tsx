'use client';

import React, { useState, useEffect, useMemo, useTransition } from 'react';
import { Search, ShieldCheck, UserPlus, Disc, SlidersHorizontal, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { toggleFollowAction, getUserFollowingIdsAction } from '@/app/actions/socialActions';
import { useUI } from '@/providers/UIContext';
import { useData } from '@/providers/DataContext';
import { PaginationControls } from '@/components/ui/PaginationControls';
import ProfileAvatar from '@/components/ui/ProfileAvatar';

const PAGE_SIZE = 50;

interface ProfileArtist {
  id: string;
  slug?: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  country?: string;
  genre?: string;
  follower_count: number;
}

const DynamicArtistCard = ({
  art,
  index,
  currentUserId,
  isFollowingInitial = false,
  onToggleFollow,
}: {
  art: ProfileArtist;
  index: number;
  currentUserId: string | null;
  isFollowingInitial?: boolean;
  onToggleFollow?: (id: string, nextState: boolean) => void;
}) => {
  const { openAuthModal, showToast } = useUI();
  const [following, setFollowing] = useState(isFollowingInitial);
  const [followerCount, setFollowerCount] = useState(art.follower_count);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setFollowing(isFollowingInitial);
  }, [isFollowingInitial]);

  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUserId) return openAuthModal();
    if (currentUserId === art.id) return showToast("You cannot follow yourself.", "error");

    const nextFollowing = !following;
    setFollowing(nextFollowing);
    setFollowerCount((prev) => (nextFollowing ? prev + 1 : Math.max(0, prev - 1)));
    if (onToggleFollow) onToggleFollow(art.id, nextFollowing);

    startTransition(async () => {
      const res = await toggleFollowAction(art.id);
      if (res.success) {
        const finalState = res.following ?? nextFollowing;
        setFollowing(finalState);
        if (onToggleFollow) onToggleFollow(art.id, finalState);
        showToast(finalState ? `Now following ${art.full_name}!` : `Unfollowed ${art.full_name}`, 'success');
      } else {
        // Revert
        setFollowing(!nextFollowing);
        setFollowerCount((prev) => (!nextFollowing ? prev + 1 : Math.max(0, prev - 1)));
        if (onToggleFollow) onToggleFollow(art.id, !nextFollowing);
        showToast(res.error || 'Failed to update follow status.', 'error');
      }
    });
  };

  const slug = art.slug || art.full_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || art.id;

  return (
    <div className="group bg-[#0a0a0a] border border-zinc-800 hover:border-red-600/80 hover:shadow-[0_0_25px_rgba(255,43,43,0.2)] transition-all duration-300 overflow-hidden flex flex-col justify-between relative backdrop-blur-xl">
      <div className="p-6 space-y-4">
        {/* AVATAR & HEADER */}
        <div className="flex items-start justify-between gap-4">
          <Link href={`/roster/${slug}`} className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden flex items-center justify-center shrink-0">
            <ProfileAvatar
              src={art.avatar_url}
              name={art.full_name}
              alt={art.full_name}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <button
            onClick={handleFollow}
            disabled={isPending}
            aria-label={following ? `Following ${art.full_name}` : `Follow ${art.full_name}`}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all border cursor-pointer min-h-[44px] ${
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

          <Link href={`/roster/${slug}`} className="block group/title">
            <h3 className="font-black text-white text-xl uppercase tracking-tight group-hover/title:text-red-500 group-hover:text-red-500 transition-colors truncate">
              {art.full_name}
            </h3>
          </Link>

          <p className="text-xs text-zinc-400 line-clamp-2 mt-2 font-mono">
            {art.bio || 'Official WorldStar Hip Hop recording artist profile.'}
          </p>
        </div>
      </div>

      {/* FOOTER METRICS */}
      <div className="px-6 py-3 border-t border-zinc-800/80 bg-black/90 flex items-center justify-between text-xs font-mono">
        <Link href={`/roster/${slug}`} className="text-zinc-400 hover:text-red-500 uppercase font-bold text-[10px] flex items-center gap-1 transition-colors min-h-[44px] inline-flex items-center">
          <span>VIEW SPOTLIGHT</span> <ExternalLink className="w-3 h-3 text-red-500" />
        </Link>
        <span className="text-white font-bold">{followerCount} FOLLOWERS</span>
      </div>
    </div>
  );
};

export function RosterPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { artists: contextArtists } = useData();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());

  // Initialize filters and page directly from URL
  const urlPageRaw = searchParams.get('page');
  const urlPage = urlPageRaw ? parseInt(urlPageRaw, 10) : 1;
  const initialPage = isNaN(urlPage) || urlPage < 1 ? 1 : urlPage;
  const initialGenre = (searchParams.get('genre') || 'ALL').toUpperCase();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState<string>(initialGenre);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  // Sync state if user navigates with browser back/forward buttons
  useEffect(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    const g = (searchParams.get('genre') || 'ALL').toUpperCase();
    const q = searchParams.get('q') || '';
    setCurrentPage(isNaN(p) || p < 1 ? 1 : p);
    setSelectedGenre(g);
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id || null;
      setCurrentUserId(uid);
      if (uid) {
        getUserFollowingIdsAction()
          .then((ids) => {
            if (Array.isArray(ids)) setFollowingIds(new Set(ids));
          })
          .catch(() => {});
      }
    });
  }, []);

  // Public Artists are strictly sourced from the verified roster (DataContext / artists table).
  const publicArtists: ProfileArtist[] = useMemo(() => {
    return (contextArtists || []).map((a) => ({
      id: a.id,
      slug: a.slug || a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      full_name: a.name,
      avatar_url: a.avatarUrl || a.imageUrl,
      bio: a.bio,
      country: a.country || 'USA',
      genre: a.primaryGenre || a.genres?.[0] || 'HIP-HOP',
      follower_count: a.monthlyListeners ? Math.floor(a.monthlyListeners / 100) : 12500,
    }));
  }, [contextArtists]);

  const isLoading = !contextArtists || contextArtists.length === 0;
  const genres = ['ALL', 'HIP-HOP', 'RAP', 'R&B', 'POP', 'DRILL', 'TRAP'];

  const filteredArtists = useMemo(() => {
    return publicArtists.filter((art) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !query ||
        art.full_name.toLowerCase().includes(query) ||
        (art.bio && art.bio.toLowerCase().includes(query)) ||
        (art.country && art.country.toLowerCase().includes(query));

      const matchesGenre =
        selectedGenre === 'ALL' ||
        (art.genre && art.genre.toUpperCase() === selectedGenre.toUpperCase());

      return matchesQuery && matchesGenre;
    });
  }, [publicArtists, searchQuery, selectedGenre]);

  const totalPages = Math.ceil(filteredArtists.length / PAGE_SIZE) || 1;

  // Clamp current page if totalPages changes
  const effectivePage = Math.min(currentPage, totalPages);
  const paginatedArtists = filteredArtists.slice((effectivePage - 1) * PAGE_SIZE, effectivePage * PAGE_SIZE);

  // Helper to build canonical URL preserving active filters
  const createPageUrl = (targetPage: number) => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedGenre !== 'ALL') params.set('genre', selectedGenre.toLowerCase());
    if (targetPage > 1) params.set('page', targetPage.toString());
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const updateUrl = (page: number, genre: string, query: string) => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (genre !== 'ALL') params.set('genre', genre.toLowerCase());
    if (page > 1) params.set('page', page.toString());
    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    router.push(url, { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrl(newPage, selectedGenre, searchQuery);
  };

  const handleGenreChange = (newGenre: string) => {
    setSelectedGenre(newGenre);
    setCurrentPage(1);
    updateUrl(1, newGenre, searchQuery);
  };

  const handleSearchChange = (newQuery: string) => {
    setSearchQuery(newQuery);
    setCurrentPage(1);
    updateUrl(1, selectedGenre, newQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-12 space-y-10">
      {/* PAGE HEADER */}
      <div className="space-y-4 border-b border-white/10 pb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 border border-red-600/30 text-xs font-mono font-bold uppercase tracking-widest">
          <Disc className="w-4 h-4" />
          <span>WORLDSTAR ARTIST DIRECTORY</span>
        </div>
        <h1 className="uppercase font-black text-white text-4xl md:text-6xl tracking-tight leading-tight">
          TALENT ROSTER
        </h1>
        <p className="uppercase text-zinc-400 font-mono tracking-wider text-sm max-w-2xl">
          Discover hip-hop icons, emerging creators, and signed recording artists.
        </p>
      </div>

      {/* SEARCH BAR & GENRE FILTERS */}
      <div className="bg-[#0a0a0a] border border-white/10 p-6 space-y-6 shadow-2xl">
        <div className="relative group">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-red-500 transition-colors" />
          <input
            id="roster-search-input"
            name="rosterSearch"
            aria-label="Search roster by artist name, bio, or country"
            type="text"
            placeholder="SEARCH BY ARTIST NAME, BIO, OR COUNTRY..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 min-h-[44px] bg-white/[0.03] border border-white/10 text-white text-xs font-bold font-mono uppercase tracking-wide focus:outline-none focus:border-red-500 transition-all"
          />
        </div>

        {/* Genre Filters with 44px min touch target */}
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
                onClick={() => handleGenreChange(g)}
                className={`px-4 py-2 min-h-[44px] inline-flex items-center justify-center text-xs font-bold font-mono uppercase tracking-wider transition-all cursor-pointer ${
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
            <DynamicArtistCard
              key={art.id}
              art={art}
              index={index}
              currentUserId={currentUserId}
              isFollowingInitial={followingIds.has(art.id)}
              onToggleFollow={(id, nextState) => {
                setFollowingIds((prev) => {
                  const updated = new Set(prev);
                  if (nextState) updated.add(id);
                  else updated.delete(id);
                  return updated;
                });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-4 bg-[#0a0a0a] border border-white/10 p-8">
          <p className="text-xl text-white font-black uppercase tracking-tight">NO ARTISTS FOUND</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('ALL');
              updateUrl(1, 'ALL', '');
            }}
            className="px-6 py-3 min-h-[44px] inline-flex items-center justify-center bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            RESET FILTERS
          </button>
        </div>
      )}

      {/* NUMBERED PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={effectivePage}
          totalPages={totalPages}
          totalItems={filteredArtists.length}
          pageSize={PAGE_SIZE}
          itemLabel="ARTISTS"
          createPageUrl={createPageUrl}
          onPageChange={handlePageChange}
          scrollOnPageChange={true}
        />
      )}
    </div>
  );
}
