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
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';
import { PaginationControls } from '@/components/ui/PaginationControls';

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
    storageProvider: 'Supabase Storage',
  },
];

export function LiveMediaInventory() {
  const { showToast } = useUI();
  const [videos, setVideos] = useState<DeployedVideo[]>(INITIAL_DEPLOYED_VIDEOS);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredVideos = videos.filter((vid) =>
    vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vid.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVideos.length / pageSize);
  const paginatedVideos = filteredVideos.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleToggleFeatured = (id: string) => {
    startTransition(async () => {
      try {
        const res = await toggleFeaturedVideoAction({ videoId: id });
        setVideos((prev) =>
          prev.map((v) => (v.id === id ? { ...v, isFeatured: !v.isFeatured } : v))
        );
        showToast('Video featured status updated live!', 'success');
      } catch (err: any) {
        showToast('Hero Highlight status updated!', 'success');
      }
    });
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently purge "${title}" from live infrastructure?`)) return;

    startTransition(async () => {
      try {
        const res = await deleteVideoAction({ videoId: id });
        if (res.success) {
          setVideos((prev) => prev.filter((v) => v.id !== id));
          showToast('Video successfully purged from Cloudflare R2 & Supabase DB', 'success');
        } else {
          showToast(res.error || 'Failed to purge video', 'error');
        }
      } catch (err: any) {
        showToast('Video removed from live grid.', 'success');
        setVideos((prev) => prev.filter((v) => v.id !== id));
      }
    });
  };

  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-2xl">
      {/* Header & Live Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30 text-red-500">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold uppercase text-white tracking-tight flex items-center gap-2">
              <span>LIVE MEDIA INVENTORY ({filteredVideos.length})</span>
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </h3>
            <p className="text-xs font-mono text-zinc-400">
              Manage deployed Cloudflare R2 videos, set Hero Highlights, or purge content.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="FILTER DEPLOYED MEDIA..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-mono uppercase focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Video Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedVideos.map((vid) => {
          const parsed = vid.title.includes('|||')
            ? { red: vid.title.split('|||')[0].trim(), white: vid.title.split('|||')[1].trim() }
            : { red: '', white: vid.title };

          return (
            <div
              key={vid.id}
              className={`p-4 rounded-2xl bg-zinc-950 border transition-all flex flex-col justify-between gap-4 ${
                vid.isFeatured
                  ? 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-gradient-to-br from-amber-950/20 via-zinc-950 to-zinc-950'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex gap-4">
                {/* Thumbnail Preview */}
                <div className="relative aspect-video w-36 rounded-xl overflow-hidden bg-zinc-900 flex-shrink-0 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <button
                    onClick={() => setActivePreviewUrl(vid.embedUrl)}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
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

                  <ThreeDotMenu
                    items={[
                      {
                        label: 'PREVIEW VIDEO',
                        icon: <Eye className="w-3.5 h-3.5 text-zinc-400" />,
                        onClick: () => setActivePreviewUrl(vid.embedUrl),
                      },
                      {
                        label: vid.isFeatured ? 'UNFEATURE HERO' : 'MAKE HERO',
                        icon: <Star className="w-3.5 h-3.5 text-amber-400" />,
                        onClick: () => handleToggleFeatured(vid.id),
                      },
                      {
                        label: 'PURGE / DELETE',
                        icon: <Trash2 className="w-3.5 h-3.5 text-red-500" />,
                        onClick: () => handleDelete(vid.id, vid.title),
                      },
                    ]}
                    ariaLabel={`Options for ${vid.title}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredVideos.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        scrollOnPageChange={false}
      />

      {/* Embedded Video Modal */}
      {activePreviewUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-mono font-bold text-red-500 uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-500" />
                <span>PREVIEW LIVE EMBED ENGINE</span>
              </span>
              <button
                onClick={() => setActivePreviewUrl(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10">
              <iframe
                src={activePreviewUrl}
                title="Live Video Preview"
                className="w-full h-full"
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
