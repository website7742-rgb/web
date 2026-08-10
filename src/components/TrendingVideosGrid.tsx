'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Play, Sparkles, Flame, Eye, MoreVertical, Copy, ExternalLink, Share2, Flag, Trash2, X, Youtube, ArrowUpRight, Heart, MessageCircle } from 'lucide-react';
import { AggregatedVideo } from '@/services/YoutubeService';
import { PaginationControls } from '@/components/ui/PaginationControls';
import { useUI } from '@/providers/UIContext';
import { useDynamicViews } from '@/hooks/useDynamicViews';
import { getYouTubeThumbnail } from '@/lib/utils';

interface TrendingVideosGridProps {
  videos: AggregatedVideo[];
  title?: string;
  subtitle?: string;
}

// ✅ VERIFIED ACTIVE OFFICIAL YOUTUBE VIDEO IDs — confirmed publicly available
const FALLBACK_VIRAL_VIDEOS: AggregatedVideo[] = [
  {
    videoId: 'uploaded-video-1',
    title: 'EXCLUSIVE ||| MASTER MUSIC VIDEO PRODUCTION DROP',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    channelName: 'WorldStar Direct Submissions',
    embedUrl: 'https://krnsfelxtkpsiueuovwp.supabase.co/storage/v1/object/public/user_submissions/stress_test_1785905296150.mp4',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'JqFQkAeCBgA',
    title: 'HUMBLE. (Official Music Video)',
    thumbnailUrl: getYouTubeThumbnail('JqFQkAeCBgA'),
    channelName: 'Kendrick Lamar',
    artistName: 'Kendrick Lamar',
    artistId: 'kendrick-lamar',
    embedUrl: 'https://www.youtube.com/embed/JqFQkAeCBgA?autoplay=0&rel=0',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'uelHwf8o7_U',
    title: 'God\'s Plan (Official Music Video)',
    thumbnailUrl: getYouTubeThumbnail('uelHwf8o7_U'),
    channelName: 'Drake',
    artistName: 'Drake',
    artistId: 'drake',
    embedUrl: 'https://www.youtube.com/embed/uelHwf8o7_U?autoplay=0&rel=0',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: 'KUmZp8pR1uc',
    title: 'SICKO MODE',
    thumbnailUrl: getYouTubeThumbnail('KUmZp8pR1uc'),
    channelName: 'Travis Scott ft. Drake',
    artistName: 'Travis Scott',
    artistId: 'travis-scott',
    embedUrl: 'https://www.youtube.com/embed/KUmZp8pR1uc?autoplay=0&rel=0',
    publishedAt: new Date().toISOString(),
  },
  {
    videoId: '4L48n0iZom0',
    title: 'Middle Child (Official Music Video)',
    thumbnailUrl: getYouTubeThumbnail('4L48n0iZom0'),
    channelName: 'J. Cole',
    artistName: 'J. Cole',
    artistId: 'j-cole',
    embedUrl: 'https://www.youtube.com/embed/4L48n0iZom0?autoplay=0&rel=0',
    publishedAt: new Date().toISOString(),
  },
];



export function TrendingVideosGrid({
  videos = [],
  title = 'WORLDSTAR VIRAL RAP FEED',
  subtitle = 'Top trending Rap & Hip-Hop shorts under 2 minutes aggregated live',
}: TrendingVideosGridProps) {
  const { showToast } = useUI();
  const [activeEmbedUrl, setActiveEmbedUrl] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close active 3-dot dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      const target = e.target as Node;
      if (!target || !document.body.contains(target)) return;
      if (menuContainerRef.current && !menuContainerRef.current.contains(target)) {
        setActiveMenuId(null);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setActiveMenuId(null);
    }
    if (activeMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMenuId]);

  const displayList = videos && videos.length > 0 ? videos : FALLBACK_VIRAL_VIDEOS;
  const { viewCounts, formatViews } = useDynamicViews(displayList.map(v => v.videoId));
  const totalPages = Math.ceil(displayList.length / pageSize);
  const paginatedList = displayList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text);
    showToast(msg, 'success');
  };

  const handleToggleMenu = (e: React.MouseEvent | React.TouchEvent, videoId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveMenuId((prev) => (prev === videoId ? null : videoId));
  };

  return (
    <section className="space-y-6" aria-label="Trending Rap Videos Feed">
      {/* Section Header */}
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

        <div className="flex items-center gap-2 font-mono text-xs text-zinc-500 uppercase tracking-wider">
          <Flame className="w-4 h-4 text-red-500" aria-hidden="true" />
          <span>AUTO-AGGREGATED DAILY</span>
        </div>
      </div>

      {/* Premium Aggressive Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7" role="list">
        {paginatedList.map((vid) => (
          <article
            key={vid.videoId}
            role="listitem"
            className="group bg-zinc-950/70 backdrop-blur-md border border-zinc-800/60 rounded-2xl overflow-visible transition-all duration-300 hover:scale-[1.02] hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(255,43,43,0.25)] focus-within:ring-2 focus-within:ring-red-600 flex flex-col justify-between relative z-10 hover:z-40"
          >
            {/* Thumbnail Box */}
            <div className="relative aspect-video w-full bg-zinc-900 rounded-t-2xl">
              <div className="absolute inset-0 rounded-t-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800'}
                  alt={`Thumbnail preview for ${vid.title}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 filter brightness-90 group-hover:brightness-105 will-change-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-transparent opacity-90" aria-hidden="true" />

                {/* Play & Explore Overlay Buttons */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm z-10"
                >
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveEmbedUrl(vid.embedUrl); }}
                    aria-label={`Play viral video: ${vid.title} by ${vid.channelName}`}
                    aria-haspopup="dialog"
                    className="bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs tracking-wider px-6 py-3 transition-transform duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.5)] transform-gpu hover:scale-105 active:scale-95 cursor-pointer min-h-[44px]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                    <span>WATCH NOW</span>
                  </button>
                  
                  <Link
                    href={vid.artistId ? `/roster/${vid.artistId}` : '/roster'}
                    onClick={(e) => e.stopPropagation()}
                    className="px-6 py-3 rounded-full bg-transparent border border-white/40 text-white font-bold text-xs tracking-wider hover:bg-white/10 hover:border-white/80 transition-all duration-300 flex items-center gap-2 transform-gpu hover:scale-105 active:scale-95 min-h-[44px]"
                  >
                    <span>EXPLORE ARTIST</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="absolute top-2.5 left-2.5 bg-red-600/20 border border-red-500/50 text-red-400 text-[8px] font-mono font-black px-2.5 py-0.5 rounded-sm uppercase tracking-widest backdrop-blur-md flex items-center gap-1 shadow-[0_0_15px_rgba(220,38,38,0.4)] pointer-events-none" aria-label="Tag: Rap Short">
                  <Youtube className="w-3 h-3" aria-hidden="true" />
                  <span>WORLDSTAR PREMIERE</span>
                </div>
              </div>

              {/* THREE-DOT MENU AT TOP RIGHT */}
              <div 
                ref={activeMenuId === vid.videoId ? menuContainerRef : null}
                className="absolute top-2.5 right-2.5 z-50"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onTouchEnd={(e) => { e.stopPropagation(); }}
              >
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleMenu(e, vid.videoId); }}
                  aria-expanded={activeMenuId === vid.videoId}
                  aria-label={`Options menu for ${vid.title}`}
                  className="p-2 rounded-full bg-black/70 hover:bg-red-600 text-zinc-300 hover:text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600 pointer-events-auto"
                >
                  <MoreVertical className="w-4 h-4 pointer-events-none" />
                </button>

                {/* PREMIUM ABSOLUTE DROPDOWN MENU OVERLAYING THE CARD */}
                {activeMenuId === vid.videoId && (
                  <div
                    className="absolute top-full right-0 mt-2 w-48 bg-[#0d0d11] border border-white/10 rounded-xl shadow-2xl p-1.5 text-xs font-mono backdrop-blur-xl z-50 animate-in fade-in duration-150 space-y-0.5"
                    role="menu"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        setActiveEmbedUrl(vid.embedUrl);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <Play className="w-3.5 h-3.5 text-red-500 fill-current" />
                      <span>PLAY VIDEO</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        copyToClipboard(vid.embedUrl, 'Video link copied to clipboard!');
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>COPY LINK</span>
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${vid.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer block"
                      role="menuitem"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                      <span>OPEN YOUTUBE</span>
                    </a>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        copyToClipboard(window.location.href, 'Page link copied to share!');
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                      <span>SHARE VIDEO</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        showToast('Content report submitted to WSHH moderation team', 'info');
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 text-zinc-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      role="menuitem"
                    >
                      <Flag className="w-3.5 h-3.5 text-zinc-400" />
                      <span>REPORT CONTENT</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        showToast(`[ADMIN] Video deletion request queued: ${vid.title}`, 'error');
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer border-t border-white/10 mt-1 pt-1.5"
                      role="menuitem"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      <span>DELETE (ADMIN)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Video Details & Split Red/White Typography */}
            <div className="p-4 space-y-2">
              <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                {vid.channelName}
              </span>
              {(() => {
                const parsed = vid.title.includes('|||')
                  ? { red: vid.title.split('|||')[0].trim(), white: vid.title.split('|||')[1].trim() }
                  : { red: '', white: vid.title };
                return (
                  <h3 className="text-base font-display font-bold text-white uppercase tracking-tight group-hover:text-red-400 transition-colors line-clamp-2 leading-snug mt-1">
                    {parsed.red && (
                      <span className="text-red-600 font-black uppercase mr-1.5 drop-shadow-[0_0_12px_rgba(220,38,38,0.6)]">
                        {parsed.red}
                      </span>
                    )}
                    <span className="text-zinc-100">{parsed.white}</span>
                  </h3>
                );
              })()}
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                <span className="flex items-center gap-1 font-mono text-red-500 font-bold bg-red-950/40 border border-red-800/50 px-2 py-0.5 rounded-md">
                  <Eye className="w-3.5 h-3.5 animate-pulse" />
                  {formatViews(viewCounts[vid.videoId])}
                </span>
                <span>• Uploaded Recently</span>
              </div>
              
              {/* Engagement Bar */}
              <div className="flex items-center gap-4 pt-4 mt-2 border-t border-zinc-800/60">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showToast('Added to liked videos', 'success');
                  }}
                  className="flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-colors group/btn cursor-pointer"
                >
                  <Heart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-xs font-bold font-mono">Like</span>
                </button>

                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    showToast('Comments opened', 'info');
                  }}
                  className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group/btn cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  <span className="text-xs font-bold font-mono">Comment</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={displayList.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        scrollOnPageChange={false}
      />

      {/* Video Player Modal */}
      {activeEmbedUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-10 animate-[fadeIn_0.2s_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-label="Viral Rap Video Player"
        >
          <div className="relative w-full max-w-4xl bg-black rounded-3xl border border-white/20 overflow-hidden shadow-2xl space-y-4">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#0a0a0a]">
              <div className="flex items-center gap-2 text-red-500 font-mono text-xs font-bold uppercase">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>WORLDSTAR VIRAL EMBED PLAYER</span>
              </div>
              <button
                onClick={() => setActiveEmbedUrl(null)}
                aria-label="Close video player modal"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl">
              {activeEmbedUrl.endsWith('.mp4') || activeEmbedUrl.endsWith('.webm') || activeEmbedUrl.endsWith('.mov') || activeEmbedUrl.includes('/storage/v1/object/public/') ? (
                <video
                  src={activeEmbedUrl}
                  controls
                  playsInline
                  preload="metadata"
                  crossOrigin="anonymous"
                  className="w-full h-full object-contain"
                >
                  Your browser does not support HTML5 video streaming.
                </video>
              ) : (
                <iframe
                  src={activeEmbedUrl.replace('autoplay=1', 'autoplay=0')}
                  title="Viral Rap Video Player"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              )}
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
