'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Play, Sparkles, Flame, Eye, MoreVertical, Copy, ExternalLink,
  Share2, Flag, Trash2, X, Youtube, ArrowUpRight, Heart, MessageCircle,
  Search, RefreshCw, AlertCircle, Loader2, CheckCircle2, HelpCircle
} from 'lucide-react';
import { AggregatedVideo } from '@/services/YoutubeService';
import { OFFICIAL_100_VIDEOS } from '@/data/official100Videos';
import { PaginationControls } from '@/components/ui/PaginationControls';
import { useUI } from '@/providers/UIContext';
import { useDynamicViews } from '@/hooks/useDynamicViews';
import { getYouTubeThumbnail } from '@/lib/utils';

interface TrendingVideosGridProps {
  videos?: AggregatedVideo[];
  title?: string;
  subtitle?: string;
  pageSize?: number;
  showSearchBar?: boolean;
}

// Convert canonical dataset to AggregatedVideo format
const CANONICAL_INITIAL_VIDEOS: AggregatedVideo[] = OFFICIAL_100_VIDEOS.map((track) => ({
  videoId: track.videoId !== 'NONE' ? track.videoId : `unresolved-${track.rank}`,
  title: `${track.requestedSong} — ${track.requestedArtist}`,
  thumbnailUrl: track.thumbnailUrl || (track.videoId !== 'NONE' ? `https://img.youtube.com/vi/${track.videoId}/hqdefault.jpg` : '/images/placeholders/video-placeholder.jpg'),
  channelName: track.channel !== 'NONE' ? track.channel : track.requestedArtist,
  artistName: track.requestedArtist,
  embedUrl: track.embedUrl || (track.videoId !== 'NONE' ? `https://www.youtube.com/embed/${track.videoId}?autoplay=1&rel=0` : ''),
  youtubeUrl: track.youtubeUrl || (track.videoId !== 'NONE' ? `https://www.youtube.com/watch?v=${track.videoId}` : ''),
  publishedAt: '2026-01-01T00:00:00Z',
  genre: 'Hip-Hop',
  rank: track.rank,
  requestedSong: track.requestedSong,
  requestedArtist: track.requestedArtist,
  channelType: track.channelType,
  status: track.status,
}));

const FILTER_TABS = [
  { id: 'ALL', label: 'ALL 100 TRACKS' },
  { id: 'MATCHED', label: 'VERIFIED VIDEOS' },
  { id: 'TOP20', label: 'TOP 20 HITS' },
  { id: 'UNRESOLVED', label: 'PENDING / UNRESOLVED' },
];

export function TrendingVideosGrid({
  videos: initialVideos = CANONICAL_INITIAL_VIDEOS,
  title = 'OFFICIAL 100 HIP-HOP TRACKS',
  subtitle = 'The canonical 100 hip-hop songs with verified official YouTube uploads & on-demand player',
  pageSize = 12,
  showSearchBar = true,
}: TrendingVideosGridProps) {
  const { showToast } = useUI();
  const [videos, setVideos] = useState<AggregatedVideo[]>(initialVideos.length > 0 ? initialVideos : CANONICAL_INITIAL_VIDEOS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');

  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Fetch videos from /api/videos
  const fetchVideos = async (forceRefresh: boolean = false) => {
    if (forceRefresh) setIsRefreshing(true);
    try {
      const url = `/api/videos?limit=100${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
        setVideos(data.videos);
        if (forceRefresh) {
          showToast('100 Hip-Hop catalog refreshed!', 'success');
        }
      }
    } catch (err: any) {
      console.warn('[TrendingVideosGrid] Failed to fetch /api/videos:', err.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (videos.length === 0) {
      fetchVideos();
    }
  }, []);

  // Close dropdown menu on outside click or Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (!target || !document.body.contains(target)) return;
      if (menuContainerRef.current && !menuContainerRef.current.contains(target)) {
        setActiveMenuId(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveMenuId(null);
        setActiveEmbedUrl(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Filter videos by client-side filter and search query
  const filteredVideos = useMemo(() => {
    let list = videos.length > 0 ? videos : CANONICAL_INITIAL_VIDEOS;

    if (selectedFilter === 'MATCHED') {
      list = list.filter(v => v.status === 'MATCHED');
    } else if (selectedFilter === 'UNRESOLVED') {
      list = list.filter(v => v.status === 'UNRESOLVED');
    } else if (selectedFilter === 'TOP20') {
      list = list.filter(v => (v.rank || 0) <= 20);
    }

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase().trim();
    return list.filter(v =>
      v.title.toLowerCase().includes(query) ||
      v.channelName.toLowerCase().includes(query) ||
      (v.artistName && v.artistName.toLowerCase().includes(query)) ||
      (v.requestedSong && v.requestedSong.toLowerCase().includes(query)) ||
      `#${v.rank}` === query ||
      `${v.rank}` === query
    );
  }, [videos, selectedFilter, searchQuery]);

  const { viewCounts, formatViews } = useDynamicViews(filteredVideos.map(v => v.videoId));
  const totalPages = Math.ceil(filteredVideos.length / pageSize) || 1;
  const paginatedList = filteredVideos.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const matchedCount = useMemo(() => videos.filter(v => v.status === 'MATCHED').length, [videos]);
  const unresolvedCount = useMemo(() => videos.filter(v => v.status === 'UNRESOLVED').length, [videos]);

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    showToast(msg, 'success');
  };

  const handleToggleMenu = (e: React.MouseEvent | React.TouchEvent, videoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === videoId ? null : videoId));
  };

  const openVideoModal = (embedUrl: string | undefined, title: string, status?: string) => {
    if (status === 'UNRESOLVED' || !embedUrl) {
      showToast('Official video is currently unreleased or pending distribution.', 'info');
      return;
    }
    setActiveEmbedUrl(embedUrl);
    setActiveVideoTitle(title);
  };

  return (
    <section className="space-y-6" aria-label="Official 100 Hip-Hop Videos Catalog">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-red-600 rounded-full" aria-hidden="true" />
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
              <span>{title}</span>
              <Sparkles className="w-5 h-5 text-amber-500" aria-hidden="true" />
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-700/50 text-emerald-400 text-[10px] font-mono font-bold uppercase">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{matchedCount} VERIFIED</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-zinc-700/50 text-zinc-400 text-[10px] font-mono font-bold uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{unresolvedCount} PENDING</span>
          </div>

          <button
            onClick={() => fetchVideos(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-red-600/60 text-zinc-300 hover:text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh catalog"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-red-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'SYNCING...' : 'SYNC'}</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS & INSTANT SEARCH */}
      {showSearchBar && (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setSelectedFilter(tab.id); setCurrentPage(1); }}
                className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                  selectedFilter === tab.id
                    ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : 'bg-neutral-950/80 text-zinc-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Instant Search Input */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by song, artist, rank..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-600 text-white text-xs font-mono pl-9 pr-8 py-2 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* SKELETON LOADING STATE */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="bg-neutral-950 border border-neutral-900 rounded-none overflow-hidden animate-pulse">
              <div className="aspect-video bg-neutral-900" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-neutral-900 rounded w-1/3" />
                <div className="h-4 bg-neutral-900 rounded w-5/6" />
                <div className="h-3 bg-neutral-900 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : paginatedList.length === 0 ? (
        /* EMPTY STATE */
        <div className="py-16 text-center border border-neutral-800/80 bg-neutral-950/60 p-8 space-y-3">
          <Youtube className="w-10 h-10 text-red-500/40 mx-auto" />
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-200">NO SONGS FOUND</h3>
          <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
            No matching tracks found for &quot;{searchQuery}&quot;. Try adjusting your search query or clear the filter.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedFilter('ALL'); }}
            className="mt-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-red-600 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            RESET CATALOG FILTERS
          </button>
        </div>
      ) : (
        /* 100-SONG VIDEO GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" role="list">
          {paginatedList.map((vid) => {
            const isMatched = vid.status === 'MATCHED';

            return (
              <article
                key={vid.rank ? `rank-${vid.rank}` : vid.videoId}
                role="listitem"
                className="group bg-neutral-950 border border-neutral-800/80 hover:border-red-600/60 rounded-none overflow-visible transition-all duration-300 hover:shadow-[0_0_25px_rgba(220,38,38,0.15)] flex flex-col justify-between relative z-10 hover:z-40"
              >
                {/* Thumbnail Box */}
                <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vid.thumbnailUrl || (isMatched ? `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg` : '/images/placeholders/video-placeholder.jpg')}
                    alt={vid.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      const target = e.currentTarget;
                      const fallbackUrl = `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`;
                      if (target.src !== fallbackUrl && isMatched) {
                        target.src = fallbackUrl;
                      }
                    }}
                    className={`w-full h-full object-cover transition-transform duration-500 filter ${
                      isMatched
                        ? 'group-hover:scale-105 brightness-90 group-hover:brightness-100 will-change-transform'
                        : 'grayscale opacity-50'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 pointer-events-none" />

                  {/* Rank Badge #1 - #100 (WorldStar Style) */}
                  {vid.rank && (
                    <div className="absolute top-2 left-2 z-20 flex items-center shadow-lg pointer-events-none">
                      <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-[11px] font-mono font-black px-2 py-0.5 tracking-wider border-r border-amber-400/40">
                        #{vid.rank}
                      </span>
                    </div>
                  )}

                  {/* Top Right Channel/Status Badge */}
                  <div className="absolute top-2 right-12 z-20 pointer-events-none">
                    {isMatched ? (
                      <span className="bg-neutral-900/90 text-zinc-300 border border-neutral-700/60 text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider backdrop-blur-md">
                        {vid.channelType ? vid.channelType.replace('Official ', '').toUpperCase() : 'OFFICIAL'}
                      </span>
                    ) : (
                      <span className="bg-amber-950/80 text-amber-300 border border-amber-700/60 text-[8px] font-mono font-bold px-1.5 py-0.5 uppercase tracking-wider backdrop-blur-md">
                        PENDING
                      </span>
                    )}
                  </div>

                  {/* Play Button Overlay (Hover) */}
                  {isMatched ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openVideoModal(vid.embedUrl, vid.title, vid.status);
                        }}
                        aria-label={`Watch ${vid.title}`}
                        className="bg-red-600 hover:bg-red-500 text-white rounded-none font-bold text-xs tracking-wider px-5 py-2.5 transition-transform duration-200 flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-95 cursor-pointer min-h-[44px]"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>WATCH NOW</span>
                      </button>

                      <a
                        href={vid.youtubeUrl || `https://www.youtube.com/watch?v=${vid.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-none bg-black/80 border border-white/20 text-white text-[10px] font-mono uppercase tracking-wider hover:border-white/60 transition-colors flex items-center gap-1.5 min-h-[44px]"
                      >
                        <span>YOUTUBE</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 backdrop-blur-xs z-10">
                      <span className="text-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                        UNRESOLVED UPLOAD
                      </span>
                      <p className="text-zinc-400 font-mono text-[9px] leading-tight">
                        No authorized official video on YouTube yet.
                      </p>
                    </div>
                  )}

                  {/* Three-Dot Menu */}
                  {isMatched && (
                    <div
                      ref={activeMenuId === vid.videoId ? menuContainerRef : null}
                      className="absolute top-2 right-2 z-30"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleToggleMenu(e, vid.videoId)}
                        aria-expanded={activeMenuId === vid.videoId}
                        aria-label="Options"
                        className="p-1.5 rounded-none bg-black/80 hover:bg-red-600 text-zinc-300 hover:text-white border border-white/20 backdrop-blur-md transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5 pointer-events-none" />
                      </button>

                      {/* Dropdown menu */}
                      {activeMenuId === vid.videoId && (
                        <div
                          className="absolute top-full right-0 mt-1.5 w-44 bg-neutral-950 border border-neutral-800 rounded-none shadow-2xl p-1 text-xs font-mono backdrop-blur-xl z-50 space-y-0.5"
                          role="menu"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              openVideoModal(vid.embedUrl, vid.title, vid.status);
                            }}
                            className="w-full px-2.5 py-1.5 text-left flex items-center gap-2 text-zinc-200 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3 text-red-500 fill-current" />
                            <span>PLAY VIDEO</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveMenuId(null);
                              copyToClipboard(vid.youtubeUrl || `https://www.youtube.com/watch?v=${vid.videoId}`, 'YouTube video link copied!');
                            }}
                            className="w-full px-2.5 py-1.5 text-left flex items-center gap-2 text-zinc-200 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3 h-3 text-zinc-400" />
                            <span>COPY LINK</span>
                          </button>

                          <a
                            href={vid.youtubeUrl || `https://www.youtube.com/watch?v=${vid.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setActiveMenuId(null)}
                            className="w-full px-2.5 py-1.5 text-left flex items-center gap-2 text-zinc-200 hover:text-white hover:bg-neutral-900 transition-colors cursor-pointer block"
                          >
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                            <span>OPEN YOUTUBE</span>
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Video Info Details */}
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    <span className="truncate font-bold text-zinc-300">
                      {vid.requestedArtist || vid.artistName || vid.channelName}
                    </span>
                    {vid.rank && (
                      <span className="text-zinc-500 shrink-0 font-mono text-[9px]">
                        TRACK #{vid.rank}
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => openVideoModal(vid.embedUrl, vid.title, vid.status)}
                    className={`text-sm font-display font-bold text-white uppercase tracking-tight transition-colors line-clamp-2 leading-snug ${
                      isMatched ? 'group-hover:text-red-400 cursor-pointer' : 'text-zinc-400'
                    }`}
                    title={vid.requestedSong ? `${vid.requestedSong} — ${vid.requestedArtist}` : vid.title}
                  >
                    {vid.requestedSong || vid.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                    <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[150px]">
                      {vid.channelName !== 'NONE' ? vid.channelName : 'Unreleased'}
                    </span>

                    {isMatched ? (
                      <span className="flex items-center gap-1 font-mono text-red-500 font-bold bg-red-950/40 border border-red-800/50 px-1.5 py-0.5 text-[10px]">
                        <Eye className="w-3 h-3" />
                        {formatViews(viewCounts[vid.videoId])}
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-amber-500/80 uppercase font-semibold">
                        PENDING
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      {filteredVideos.length > pageSize && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredVideos.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          scrollOnPageChange={false}
        />
      )}

      {/* OFFICIAL YOUTUBE EMBED PLAYER MODAL */}
      {activeEmbedUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 md:p-10 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="YouTube Video Player"
          onClick={() => setActiveEmbedUrl(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-2xl space-y-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-neutral-800 bg-neutral-900/60">
              <div className="flex items-center gap-2 text-red-500 font-mono text-xs font-bold uppercase truncate pr-4">
                <Youtube className="w-4 h-4 shrink-0 text-red-600" />
                <span className="truncate">{activeVideoTitle || 'WORLDSTAR OFFICIAL PLAYER'}</span>
              </div>
              <button
                onClick={() => setActiveEmbedUrl(null)}
                aria-label="Close video player modal"
                className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive 16:9 Player Container */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={activeEmbedUrl}
                title={activeVideoTitle || 'YouTube Video Player'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
