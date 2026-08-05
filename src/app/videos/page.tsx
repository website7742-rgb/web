'use client';

import React, { useState } from 'react';
import { Video, Sparkles, Play, ExternalLink, Share2, Copy, Eye } from 'lucide-react';
import { useData } from '@/providers/DataContext';
import { useUI } from '@/providers/UIContext';
import Link from 'next/link';
import { useDynamicViews } from '@/hooks/useDynamicViews';

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

const DEFAULT_FEATURED_VIDEOS: CustomVideoItem[] = [
  {
    id: 'uploaded-primary-video',
    title: 'EXCLUSIVE: MASTER MUSIC VIDEO PRODUCTION DROP',
    artistName: 'WorldStar Direct Talent Candidate',
    genre: 'Hip-Hop / Rap',
    videoUrl: 'https://krnsfelxtkpsiueuovwp.supabase.co/storage/v1/object/public/user_submissions/stress_test_1785905296150.mp4',
    coverImageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80',
    publishedAt: new Date().toISOString(),
    source: 'UPLOADED',
  },
  {
    id: 'drake-gods-plan',
    title: 'Drake — God\'s Plan (Official Music Video)',
    artistName: 'Drake',
    genre: 'Hip-Hop / OVO',
    videoUrl: 'https://www.youtube.com/embed/uelHwf8o7_U?autoplay=1&rel=0',
    coverImageUrl: `https://i.ytimg.com/vi/uelHwf8o7_U/maxresdefault.jpg`,
    publishedAt: new Date().toISOString(),
    source: 'FEATURED',
  },
  {
    id: 'kendrick-humble',
    title: 'Kendrick Lamar — HUMBLE. (Official Music Video)',
    artistName: 'Kendrick Lamar',
    genre: 'West Coast Hip-Hop',
    videoUrl: 'https://www.youtube.com/embed/JqFQkAeCBgA?autoplay=1&rel=0',
    coverImageUrl: `https://i.ytimg.com/vi/JqFQkAeCBgA/maxresdefault.jpg`,
    publishedAt: new Date().toISOString(),
    source: 'FEATURED',
  },
];

export default function DedicatedVideosPage() {
  const { submissions } = useData();
  const { showToast } = useUI();
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'UPLOADED' | 'FEATURED'>('ALL');

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

  const allVideos = [...submittedVideos, ...DEFAULT_FEATURED_VIDEOS];
  const { viewCounts, formatViews } = useDynamicViews(allVideos.map(v => v.id));

  const filteredVideos = allVideos.filter((v) => {
    if (selectedCategory === 'ALL') return true;
    return v.source === selectedCategory;
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(label, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12 animate-in fade-in duration-500">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-8 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WORLDSTAR HD VIDEO SHOWCASE HUB</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
            OFFICIAL <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">MUSIC VIDEOS</span>
          </h1>
          <p className="text-zinc-400 text-sm md:text-base mt-2 max-w-2xl font-sans">
            Stream full-length high-definition music videos, candidate submissions, and official WorldStar premieres with native HTML5 playback.
          </p>
        </div>

        {/* SUBMIT CTA & CATEGORY PILLS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center gap-2 font-mono text-xs bg-white/5 p-1.5 rounded-2xl border border-white/10">
            {(['ALL', 'UPLOADED', 'FEATURED'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl uppercase font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Link
            href="/submit-demo"
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <Video className="w-4 h-4" />
            <span>UPLOAD VIDEO</span>
          </Link>
        </div>
      </div>

      {/* VIDEO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredVideos.map((vid) => {
          const isDirectMp4 =
            vid.videoUrl.endsWith('.mp4') ||
            vid.videoUrl.endsWith('.webm') ||
            vid.videoUrl.endsWith('.mov') ||
            vid.videoUrl.includes('/storage/v1/object/public/');

          return (
            <div
              key={vid.id}
              className="bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-red-600/60 transition-all duration-300 backdrop-blur-xl"
            >
              {/* VIDEO PLAYER CONTAINER */}
              <div className="relative aspect-video w-full bg-black border-b border-white/10">
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
                    src={vid.videoUrl}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}

                <div className="absolute top-3 left-3 bg-red-600/90 text-white text-[9px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md shadow-lg pointer-events-none">
                  {vid.source === 'UPLOADED' ? 'CANDIDATE UPLOAD' : 'WORLDSTAR PREMIERE'}
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
                      {vid.source}
                    </span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight mt-1 line-clamp-2 group-hover:text-red-400 transition-colors leading-snug">
                    {vid.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-semibold mt-1 tracking-wide">{vid.artistName}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-2">
                    <span className="flex items-center gap-1 font-mono text-red-500 font-bold bg-red-950/40 border border-red-800/50 px-2 py-0.5 rounded-md">
                      <Eye className="w-3.5 h-3.5 animate-pulse" />
                      {formatViews(viewCounts[vid.id])}
                    </span>
                    <span>• {vid.source === 'UPLOADED' ? 'Uploaded Recently' : 'Featured Premiere'}</span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono">
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
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                      title="Copy Link"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${vid.videoUrl.includes('youtube') ? vid.videoUrl.split('embed/')[1]?.split('?')[0] : ''}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-red-500" />
                      <span>OPEN STREAM</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
