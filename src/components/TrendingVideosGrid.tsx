'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Play, Sparkles, Flame, Eye, MoreVertical, Copy, ExternalLink,
  Share2, Flag, Trash2, X, Youtube, ArrowUpRight, Heart, MessageCircle,
  Search, RefreshCw, AlertCircle, Loader2
} from 'lucide-react';
import { AggregatedVideo } from '@/services/YoutubeService';
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

// Verified active official YouTube video IDs used strictly as graceful fallback
const FALLBACK_VIRAL_VIDEOS: AggregatedVideo[] = [
  {
    videoId: 'JqFQkAeCBgA',
    title: 'Kendrick Lamar — HUMBLE. (Official Music Video)',
    thumbnailUrl: getYouTubeThumbnail('JqFQkAeCBgA'),
    channelName: 'Kendrick Lamar',
    artistName: 'Kendrick Lamar',
    artistId: 'kendrick-lamar',
    embedUrl: 'https://www.youtube.com/embed/JqFQkAeCBgA?autoplay=1&rel=0',
    youtubeUrl: 'https://www.youtube.com/watch?v=JqFQkAeCBgA',
    publishedAt: '2024-01-01T00:00:00Z',
    genre: 'Hip-Hop',
  },
  {
    videoId: 'uelHwf8o7_U',
    title: "Drake — God's Plan (Official Music Video)",
    thumbnailUrl: getYouTubeThumbnail('uelHwf8o7_U'),
    channelName: 'Drake',
    artistName: 'Drake',
    artistId: 'drake',
    embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U?autoplay=1&rel=0',
    youtubeUrl: 'https://www.youtube.com/watch?v=uelHwf8o7_U',
    publishedAt: '2024-01-01T00:00:00Z',
    genre: 'Hip-Hop',
  },
  {
    videoId: 'KUmZp8pR1uc',
    title: 'Travis Scott ft. Drake — SICKO MODE (Official Music Video)',
    thumbnailUrl: getYouTubeThumbnail('KUmZp8pR1uc'),
    channelName: 'Travis Scott ft. Drake',
    artistName: 'Travis Scott',
    artistId: 'travis-scott',
    embedUrl: 'https://www.youtube.com/embed/KUmZp8pR1uc?autoplay=1&rel=0',
    youtubeUrl: 'https://www.youtube.com/watch?v=KUmZp8pR1uc',
    publishedAt: '2024-01-01T00:00:00Z',
    genre: 'Trap',
  },
  {
    videoId: '4L48n0iZom0',
    title: 'J. Cole — Middle Child (Official Music Video)',
    thumbnailUrl: getYouTubeThumbnail('4L48n0iZom0'),
    channelName: 'J. Cole',
    artistName: 'J. Cole',
    artistId: 'j-cole',
    embedUrl: 'https://www.youtube.com/embed/4L48n0iZom0?autoplay=1&rel=0',
    youtubeUrl: 'https://www.youtube.com/watch?v=4L48n0iZom0',
    publishedAt: '2024-01-01T00:00:00Z',
    genre: 'Hip-Hop',
  },
];

const CATEGORIES = [
  { id: 'ALL', label: 'ALL VIDEOS', query: 'Hip Hop music video OR Rap music video' },
  { id: 'LATEST', label: 'LATEST DROPS', query: 'New Hip Hop music video 2026' },
  { id: 'FREESTYLE', label: 'FREESTYLES', query: 'Rap Freestyle studio official' },
  { id: 'DRILL', label: 'DRILL & TRAP', query: 'Drill music video OR Trap rap video' },
  { id: 'CLASSICS', label: 'HIP-HOP PREMIERES', query: 'WorldStar Hip Hop exclusive music video' },
];

export function TrendingVideosGrid({
  videos: initialVideos = [],
  title = 'LATEST HIP-HOP VIDEOS',
  subtitle = 'Official music videos & live premieres streamed directly from YouTube',
  pageSize = 12,
  showSearchBar = true,
}: TrendingVideosGridProps) {
  const { showToast } = useUI();
  const [videos, setVideos] = useState<AggregatedVideo[]>(initialVideos);
  const [isLoading, setIsLoading] = useState<boolean>(initialVideos.length === 0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string | null>(null);
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [apiNotice, setApiNotice] = useState<{ type: 'warning' | 'info' | 'error'; message: string } | null>(null);

  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Fetch live YouTube videos from /api/videos
  const fetchVideos = async (forceRefresh: boolean = false, categoryQuery?: string) => {
    if (forceRefresh) setIsRefreshing(true);
    else if (videos.length === 0) setIsLoading(true);

    try {
      const q = categoryQuery || CATEGORIES.find(c => c.id === selectedCategory)?.query || 'Hip Hop music video OR Rap music video';
      const url = `/api/videos?limit=100&q=${encodeURIComponent(q)}${forceRefresh ? '&refresh=true' : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
        setVideos(data.videos);
        setApiNotice(null);
      } else {
        // Handle missing key or quota exceeded gracefully
        if (data.error === 'MISSING_API_KEY') {
          setApiNotice({
            type: 'warning',
            message: 'YOUTUBE_API_KEY is not configured in server environment. Displaying curated WorldStar premieres.',
          });
        } else if (data.error === 'QUOTA_EXCEEDED_OR_FORBIDDEN') {
          setApiNotice({
            type: 'warning',
            message: 'YouTube Data API daily quota limit reached. Serving cached/curated video showcase.',
          });
        }
        if (Array.isArray(data.videos) && data.videos.length > 0) {
          setVideos(data.videos);
        } else if (videos.length === 0) {
          setVideos(FALLBACK_VIRAL_VIDEOS);
        }
      }
    } catch (err: any) {
      console.warn('[TrendingVideosGrid] Failed to fetch /api/videos:', err.message);
      if (videos.length === 0) {
        setVideos(FALLBACK_VIRAL_VIDEOS);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialVideos.length === 0) {
      fetchVideos();
    }
  }, []);

  // Handle category pill changes
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
    const cat = CATEGORIES.find(c => c.id === catId);
    if (cat) {
      fetchVideos(false, cat.query);
    }
  };

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

  // Filter videos by client-side search query
  const filteredVideos = useMemo(() => {
    const list = videos.length > 0 ? videos : FALLBACK_VIRAL_VIDEOS;
    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase().trim();
    return list.filter(v =>
      v.title.toLowerCase().includes(query) ||
      v.channelName.toLowerCase().includes(query) ||
      (v.artistName && v.artistName.toLowerCase().includes(query))
    );
  }, [videos, searchQuery]);

  const { viewCounts, formatViews } = useDynamicViews(filteredVideos.map(v => v.videoId));
  const totalPages = Math.ceil(filteredVideos.length / pageSize) || 1;
  const paginatedList = filteredVideos.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    showToast(msg, 'success');
  };

  const handleToggleMenu = (e: React.MouseEvent | React.TouchEvent, videoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === videoId ? null : videoId));
  };

  const openVideoModal = (embedUrl: string, title: string) => {
    setActiveEmbedUrl(embedUrl);
    setActiveVideoTitle(title);
  };

  return (
    <section className="space-y-6" aria-label="Latest Hip-Hop Videos Feed">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-7 bg-red-600 rounded-full" aria-hidden="true" />
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight uppercase flex items-center gap-2">
              <span>{title}</span>
              <Sparkles className="w-5 h-5 text-red-500" aria-hidden="true" />
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchVideos(true)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-red-600/60 text-zinc-300 hover:text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh latest YouTube videos"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-red-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'SYNCING...' : 'REFRESH'}</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 uppercase tracking-wider">
            <Flame className="w-4 h-4 text-red-500" aria-hidden="true" />
            <span>{videos.length} VIDEOS LOADED</span>
          </div>
        </div>
      </div>

      {/* API NOTICE BANNER (If Key Missing or Quota Exceeded) */}
      {apiNotice && (
        <div className="bg-neutral-950 border border-neutral-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-zinc-300">
          <div className="flex items-center gap-2 text-zinc-300">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{apiNotice.message}</span>
          </div>
          <button
            onClick={() => fetchVideos(true)}
            className="px-3 py-1 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-600/30 text-[10px] font-bold uppercase tracking-widest transition-colors cursor-pointer shrink-0"
          >
            RETRY API
          </button>
        </div>
      )}

      {/* SEARCH BAR & CATEGORY PILLS */}
      {showSearchBar && (
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : 'bg-neutral-950/80 text-zinc-400 border-neutral-800 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {cat.label}
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
              placeholder="Search 100 Hip-Hop videos..."
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
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-200">NO VIDEOS MATCH YOUR SEARCH</h3>
          <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search terms or select another category above.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); }}
            className="mt-2 px-4 py-2 bg-neutral-900 border border-neutral-800 hover:border-red-600 text-white text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
          >
            CLEAR FILTERS
          </button>
        </div>
      ) : (
        /* VIDEO GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" role="list">
          {paginatedList.map((vid) => (
            <article
              key={vid.videoId}
              role="listitem"
              className="group bg-neutral-950 border border-neutral-800/80 hover:border-red-600/60 rounded-none overflow-visible transition-all duration-300 hover:shadow-[0_0_25px_rgba(220,38,38,0.15)] flex flex-col justify-between relative z-10 hover:z-40"
            >
              {/* Thumbnail Box */}
              <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`}
                  alt={vid.title}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    // Fallback to high quality YouTube thumbnail if maxres fails
                    const target = e.currentTarget;
                    const fallbackUrl = `https://img.youtube.com/vi/${vid.videoId}/hqdefault.jpg`;
                    if (target.src !== fallbackUrl) {
                      target.src = fallbackUrl;
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90 group-hover:brightness-100 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 pointer-events-none" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-xs z-10">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openVideoModal(vid.embedUrl, vid.title);
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

                {/* Badge: WorldStar Video */}
                <div className="absolute top-2 left-2 bg-red-600/90 text-white text-[8px] font-mono font-black px-2 py-0.5 rounded-none uppercase tracking-widest backdrop-blur-md flex items-center gap-1 pointer-events-none">
                  <Youtube className="w-3 h-3" />
                  <span>PREMIERE</span>
                </div>

                {/* Three-Dot Menu */}
                <div
                  ref={activeMenuId === vid.videoId ? menuContainerRef : null}
                  className="absolute top-2 right-2 z-50"
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
                          openVideoModal(vid.embedUrl, vid.title);
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
              </div>

              {/* Video Info Details */}
              <div className="p-4 space-y-2">
                <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest truncate block">
                  {vid.channelName}
                </span>
                <h3
                  onClick={() => openVideoModal(vid.embedUrl, vid.title)}
                  className="text-sm font-display font-bold text-white uppercase tracking-tight group-hover:text-red-400 transition-colors line-clamp-2 leading-snug cursor-pointer"
                  title={vid.title}
                >
                  {vid.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-zinc-400 pt-0.5">
                  <span className="flex items-center gap-1 font-mono text-red-500 font-bold bg-red-950/40 border border-red-800/50 px-1.5 py-0.5 text-[10px]">
                    <Eye className="w-3 h-3" />
                    {formatViews(viewCounts[vid.videoId])}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 truncate">
                    {new Date(vid.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </article>
          ))}
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

            {/* Responsive 16:9 Player Container (Mounted strictly when modal is active) */}
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
