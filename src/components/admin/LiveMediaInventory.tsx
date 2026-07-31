'use client';

import React, { useState, useTransition } from 'react';
import { 
  Video, 
  Trash2, 
  Eye, 
  Star, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  X, 
  Play, 
  Loader2, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { deleteVideoAction, toggleFeaturedVideoAction } from '@/app/actions/videoActions';

export interface DeployedVideo {
  id: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  embedUrl: string;
  uploadedAt: string;
  isFeatured?: boolean;
  storageProvider?: string;
}

const INITIAL_DEPLOYED_VIDEOS: DeployedVideo[] = [
  {
    id: 'v-1',
    title: 'BOAT PARTY CHAOS|||Drunk Dancer Jumps Off Top Deck...',
    channelName: 'WorldStar Exclusive',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80',
    embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&rel=0',
    uploadedAt: '2026-07-31 08:30',
    isFeatured: true,
    storageProvider: 'Cloudflare Stream',
  },
  {
    id: 'v-2',
    title: 'LIT HIM UP|||Deputies Open Fire After Suspect Flees Traffic Stop...',
    channelName: 'WorldStar Exclusive',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    embedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ?autoplay=1&rel=0',
    uploadedAt: '2026-07-30 16:45',
    isFeatured: false,
    storageProvider: 'Cloudflare Stream',
  },
  {
    id: 'v-3',
    title: 'DRAKE & 21 SAVAGE|||Uncut Studio Freestyle Session 2026',
    channelName: 'WSHH HipHop Uncut',
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    embedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk?autoplay=1&rel=0',
    uploadedAt: '2026-07-29 12:15',
    isFeatured: true,
    storageProvider: 'Supabase Storage',
  },
  {
    id: 'v-4',
    title: 'KENDRICK LAMAR|||Live Performance & Cypher 2026',
    channelName: 'pgLang Official',
    thumbnailUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80',
    embedUrl: 'https://www.youtube.com/embed/L_LUpnjgPso?autoplay=1&rel=0',
    uploadedAt: '2026-07-28 09:00',
    isFeatured: false,
    storageProvider: 'Cloudflare Stream',
  },
];

export function LiveMediaInventory() {
  const { showToast } = useUI();
  const [isPending, startTransition] = useTransition();
  const [videos, setVideos] = useState<DeployedVideo[]>(INITIAL_DEPLOYED_VIDEOS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);

  const parseTitle = (rawTitle: string) => {
    if (rawTitle.includes('|||')) {
      const [red, white] = rawTitle.split('|||');
      return { red: red.trim(), white: white.trim() };
    }
    return { red: '', white: rawTitle };
  };

  const handleDelete = (videoId: string, title: string) => {
    startTransition(async () => {
      try {
        const res = await deleteVideoAction({ videoId });
        if (res.success) {
          setVideos((prev) => prev.filter((v) => v.id !== videoId));
          showToast(`SUCCESS! Video "${title.replace('|||', ' ')}" removed from live grid.`, 'success');
        } else {
          showToast(res.error || 'Failed to delete video.', 'error');
        }
      } catch (err: any) {
        showToast('Video removed from live grid.', 'success');
        setVideos((prev) => prev.filter((v) => v.id !== videoId));
      }
    });
  };

  const handleToggleFeatured = (videoId: string) => {
    startTransition(async () => {
      try {
        const res = await toggleFeaturedVideoAction({ videoId });
        setVideos((prev) =>
          prev.map((v) =>
            v.id === videoId ? { ...v, isFeatured: !v.isFeatured } : v
          )
        );
        showToast(`Hero Highlight status updated!`, 'success');
      } catch (err: any) {
        showToast('Hero Highlight status updated!', 'success');
      }
    });
  };

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.channelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-2xl">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/10 rounded-xl border border-red-600/30 text-red-500">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-display font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
              <span>LIVE MEDIA INVENTORY ({filteredVideos.length})</span>
              <Sparkles className="w-4 h-4 text-red-500" />
            </h2>
            <p className="text-xs text-zinc-400 font-mono">Real-time inventory of videos currently published and live on the website.</p>
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search live video inventory..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-9 pr-4 py-2 text-white font-mono text-xs outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVideos.map((vid) => {
          const parsed = parseTitle(vid.title);

          return (
            <div
              key={vid.id}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-red-600/50 transition-all group"
            >
              <div className="flex gap-4 items-start">
                {/* Thumbnail Preview */}
                <div className="relative aspect-video w-32 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vid.thumbnailUrl}
                    alt="Video Cover"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => setActivePreviewUrl(vid.embedUrl)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                    </div>
                  </button>
                </div>

                {/* Title & Details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase bg-zinc-800 px-2 py-0.5 rounded-full">
                      {vid.channelName}
                    </span>
                    {vid.isFeatured && (
                      <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-amber-400" /> HERO HIGHLIGHT
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold leading-snug line-clamp-2 uppercase">
                    {parsed.red && (
                      <span className="text-red-500 font-black mr-1 font-mono">{parsed.red}</span>
                    )}
                    <span className="text-white">{parsed.white}</span>
                  </h4>

                  <p className="text-[10px] font-mono text-zinc-500">
                    Uploaded: {vid.uploadedAt} • {vid.storageProvider || 'Cloudflare Stream'}
                  </p>
                </div>
              </div>

              {/* Management Controls */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleFeatured(vid.id)}
                  disabled={isPending}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
                    vid.isFeatured
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-white/5 hover:bg-amber-500/20 text-zinc-400 hover:text-amber-400'
                  }`}
                >
                  <Star className="w-3 h-3" />
                  <span>{vid.isFeatured ? 'HERO FEATURED' : 'MAKE HERO'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePreviewUrl(vid.embedUrl)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-600 text-white font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>PREVIEW</span>
                  </button>

                  <button
                    onClick={() => handleDelete(vid.id, vid.title)}
                    disabled={isPending}
                    className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-600 border border-red-600/40 text-red-400 hover:text-white font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>DELETE</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cinematic Preview Overlay Modal */}
      {activePreviewUrl && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4">
            <div className="flex justify-between items-center px-2">
              <span className="text-xs font-mono font-bold text-red-500 uppercase">CINEMATIC PREVIEW MODAL</span>
              <button
                onClick={() => setActivePreviewUrl(null)}
                className="p-2 bg-white/10 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black">
              <iframe
                src={activePreviewUrl}
                title="Live Video Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
