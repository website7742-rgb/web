'use client';

import React, { useState, useEffect } from 'react';
import { Video, Sparkles, Play, ExternalLink, Share2, Copy, Eye, Youtube, Plus } from 'lucide-react';
import { useData } from '@/providers/DataContext';
import { useUI } from '@/providers/UIContext';
import Link from 'next/link';
import { useDynamicViews } from '@/hooks/useDynamicViews';
import { TrendingVideosGrid } from '@/components/TrendingVideosGrid';
import { createBrowserClient } from '@supabase/ssr';

interface CustomVideoItem {
  id: string;
  title: string;
  artistName: string;
  genre: string;
  videoUrl: string;
  coverImageUrl?: string;
  publishedAt: string;
  source: 'UPLOADED' | 'FEATURED';
}

export default function DedicatedVideosPage() {
  const { submissions } = useData();
  const { showToast } = useUI();
  const [activeTab, setActiveTab] = useState<'YOUTUBE' | 'UPLOADED' | 'ALL'>('YOUTUBE');

  // Convert submitted videos from database context
  const submittedVideos: CustomVideoItem[] = submissions
    .filter((s) => Boolean(s.videoUrl))
    .map((s, idx) => ({
      id: s.id || `sub-${idx}`,
      title: `${s.stageName || s.fullName} - Official ${s.genre} Master Video`,
      artistName: s.stageName || s.fullName,
      genre: s.genre || 'Hip-Hop',
      videoUrl: s.videoUrl || '',
      coverImageUrl: s.coverImageUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
      publishedAt: new Date().toISOString(),
      source: 'UPLOADED',
    }));

  const { viewCounts, formatViews } = useDynamicViews(submittedVideos.map(v => v.id));

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(label, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 sm:py-12 space-y-10 animate-in fade-in duration-500">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WORLDSTAR HD VIDEO SHOWCASE HUB</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            OFFICIAL <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">MUSIC VIDEOS</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl font-sans">
            Stream latest Hip-Hop premieres via YouTube Data API v3, candidate talent submissions, and exclusive WorldStar visuals.
          </p>
        </div>

        {/* SUBMIT CTA & VIEW TABS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs bg-neutral-950 p-1.5 border border-neutral-800">
            <button
              onClick={() => setActiveTab('YOUTUBE')}
              className={`px-4 py-2 uppercase font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'YOUTUBE'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              LATEST HIP-HOP
            </button>
            <button
              onClick={() => setActiveTab('UPLOADED')}
              className={`px-4 py-2 uppercase font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'UPLOADED'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              UPLOADS ({submittedVideos.length})
            </button>
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-2 uppercase font-bold text-xs transition-all cursor-pointer ${
                activeTab === 'ALL'
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ALL
            </button>
          </div>

          <Link
            href="/submit-demo"
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>SUBMIT VIDEO</span>
          </Link>
        </div>
      </div>

      {/* YOUTUBE LIVE AGGREGATED GRID */}
      {(activeTab === 'YOUTUBE' || activeTab === 'ALL') && (
        <div className="space-y-6">
          <TrendingVideosGrid
            title="LATEST HIP-HOP PREMIERES"
            subtitle="Live YouTube Data API v3 aggregation — up to 100 recent Hip-Hop releases"
            pageSize={12}
            showSearchBar={true}
          />
        </div>
      )}

      {/* COMMUNITY DIRECT SUBMISSIONS SECTION */}
      {(activeTab === 'UPLOADED' || activeTab === 'ALL') && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-7 bg-red-600 rounded-full" />
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white tracking-tight uppercase">
                  DIRECT CANDIDATE <span className="text-red-500">UPLOADS</span>
                </h2>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  Original high-definition music videos uploaded by artists and creators
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase">
              {submittedVideos.length} UPLOADED VIDEOS
            </span>
          </div>

          {submittedVideos.length === 0 ? (
            <div className="py-16 text-center border border-neutral-800 bg-neutral-950 p-8 space-y-4">
              <Video className="w-10 h-10 text-red-500/40 mx-auto" />
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-200">NO DIRECT UPLOADS YET</h3>
              <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
                Be the first artist to submit a direct HD music video to the WorldStar showcase.
              </p>
              <Link
                href="/submit-demo"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold uppercase tracking-widest transition-colors"
              >
                UPLOAD VIDEO NOW
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {submittedVideos.map((vid) => {
                const isDirectMp4 =
                  vid.videoUrl.endsWith('.mp4') ||
                  vid.videoUrl.endsWith('.webm') ||
                  vid.videoUrl.endsWith('.mov') ||
                  vid.videoUrl.includes('/storage/v1/object/public/');

                return (
                  <div
                    key={vid.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-none overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-red-600/60 transition-all duration-300"
                  >
                    {/* VIDEO CONTAINER */}
                    <div className="relative aspect-video w-full bg-black border-b border-neutral-800">
                      {isDirectMp4 ? (
                        <video
                          src={vid.videoUrl}
                          controls
                          playsInline
                          preload="metadata"
                          poster={vid.coverImageUrl}
                          className="w-full h-full object-contain"
                        >
                          Your browser does not support HTML5 video playback.
                        </video>
                      ) : (
                        <iframe
                          src={vid.videoUrl.replace('autoplay=1', 'autoplay=0')}
                          title={vid.title}
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      )}

                      <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[9px] font-mono font-bold px-3 py-1 rounded-none uppercase tracking-widest backdrop-blur-md shadow-lg pointer-events-none">
                        CANDIDATE UPLOAD
                      </div>
                    </div>

                    {/* DETAILS & METADATA */}
                    <div className="p-6 space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest">
                            {vid.genre}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            CANDIDATE DROP
                          </span>
                        </div>
                        <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight mt-1 line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
                          {vid.title}
                        </h3>
                        <p className="text-xs text-zinc-400 font-semibold mt-1 tracking-wide">{vid.artistName}</p>
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                          <span className="flex items-center gap-1 font-mono text-red-500 font-bold bg-red-950/40 border border-red-800/50 px-2 py-0.5 text-[10px]">
                            <Eye className="w-3 h-3 animate-pulse" />
                            {formatViews(viewCounts[vid.id])}
                          </span>
                          <span>• Uploaded Recently</span>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-xs font-mono">
                        <a
                          href={vid.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-400 font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <span>OPEN DIRECT LINK ↗</span>
                        </a>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(vid.videoUrl, 'Video URL copied to clipboard!')}
                            className="p-2 bg-neutral-900 hover:bg-neutral-800 text-zinc-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
                            title="Copy Link"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
