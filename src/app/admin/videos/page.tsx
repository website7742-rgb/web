'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { Video, Plus, Trash2, ExternalLink, ShieldAlert, Loader2, ArrowLeft, CheckCircle2, Play } from 'lucide-react';
import { submitYouTubeVideoAction, getAllAdminVideosAction, deleteAdminVideoAction, extractYouTubeId } from '@/app/actions/videoActions';
import { useUI } from '@/providers/UIContext';

interface CuratedVideo {
  id: string;
  title: string;
  artist_name: string;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
}

export default function AdminVideosPage() {
  const { showToast } = useUI();

  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [artistName, setArtistName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [videosList, setVideosList] = useState<CuratedVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Extract video ID for live thumbnail preview
  const previewVideoId = extractYouTubeId(youtubeUrl);
  const previewThumbnailUrl = previewVideoId ? `https://img.youtube.com/vi/${previewVideoId}/hqdefault.jpg` : null;

  const loadVideos = () => {
    setIsLoadingVideos(true);
    getAllAdminVideosAction().then((res) => {
      setIsLoadingVideos(false);
      if (res.success && res.videos) {
        setVideosList(res.videos as CuratedVideo[]);
      }
    });
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl || !artistName) {
      setError('Please fill in both the YouTube URL and Artist Name.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await submitYouTubeVideoAction(youtubeUrl, artistName);
    setIsSubmitting(false);

    if (res.success) {
      showToast(res.message || 'YouTube video curated successfully!', 'success');
      setYoutubeUrl('');
      setArtistName('');
      loadVideos();
    } else {
      setError(res.error || 'Failed to add video.');
      showToast(res.error || 'Failed to add video.', 'error');
    }
  };

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    startTransition(async () => {
      const res = await deleteAdminVideoAction(id);
      if (res.success) {
        showToast('Video removed from showcase.', 'success');
        setVideosList((prev) => prev.filter((v) => v.id !== id));
      } else {
        showToast(res.error || 'Failed to delete video', 'error');
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-red-600 selection:text-white">
      <div className="max-w-[1500px] mx-auto space-y-10">
        
        {/* HEADER SECTION */}
        <div className="border-b border-neutral-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 rounded-sm">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">ADMIN VIDEO CURATION ENGINE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
              YOUTUBE <span className="text-red-600">CURATION HUB</span>
            </h1>
            <p className="text-sm text-zinc-400 font-mono max-w-2xl leading-relaxed">
              Curate and ingest official YouTube music videos directly to the WorldStar Videos showcase. The system extracts title metadata and thumbnail assets automatically.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-300 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              A&R PANEL
            </Link>
            <Link
              href="/videos"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Video className="w-4 h-4" />
              PUBLIC VIDEOS
            </Link>
          </div>
        </div>

        {/* CURATION FORM + LIVE PREVIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* CURATION FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 p-6 md:p-8 space-y-6 shadow-2xl rounded-sm">
            <div className="border-b border-neutral-800 pb-4">
              <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-600" />
                ADD YOUTUBE VIDEO
              </h3>
              <p className="text-xs font-mono text-zinc-400 mt-1">
                Paste any YouTube video link to automatically parse metadata and ingest to the public feed.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 mb-2 block">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-black border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white font-mono text-sm p-4 outline-none transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 mb-2 block">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DRAKE, KODAK BLACK, FUTURE"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-black border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white font-mono text-sm p-4 outline-none transition-all disabled:opacity-50 uppercase"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-950/20 border border-red-900 text-red-500 text-xs font-mono font-bold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-mono font-black text-sm uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>EXTRACTING METADATA & INGESTING...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>ADD VIDEO TO PLATFORM</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* LIVE THUMBNAIL PREVIEW CARD (5 COLS) */}
          <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 p-6 space-y-4 rounded-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 border-b border-neutral-800 pb-3 flex items-center gap-2">
              <Play className="w-4 h-4 text-red-600" />
              LIVE METADATA PREVIEW
            </h4>

            {previewThumbnailUrl ? (
              <div className="space-y-4">
                <div className="relative aspect-video w-full bg-black border border-neutral-800 overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewThumbnailUrl}
                    alt="YouTube Live Thumbnail Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1 font-mono">
                  <p className="text-xs text-zinc-500 uppercase">EXTRACTED VIDEO ID: <strong className="text-red-500">{previewVideoId}</strong></p>
                  <p className="text-xs text-zinc-300 font-bold uppercase truncate">{artistName || 'ARTIST NAME'}</p>
                </div>
              </div>
            ) : (
              <div className="h-52 border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center text-center p-6 text-zinc-600 font-mono space-y-2">
                <Video className="w-8 h-8 text-neutral-700" />
                <p className="text-xs uppercase font-bold text-zinc-500">PASTE A YOUTUBE URL TO PREVIEW</p>
                <p className="text-[10px] text-zinc-600">Thumbnail and oEmbed title will render automatically.</p>
              </div>
            )}
          </div>
        </div>

        {/* CURATED VIDEOS TABLE / LIST */}
        <div className="space-y-6 pt-6 border-t border-neutral-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-red-600" />
              CURRENTLY CURATED VIDEOS ({videosList.length})
            </h3>
            <button
              onClick={loadVideos}
              className="text-xs font-mono text-zinc-400 hover:text-white uppercase font-bold tracking-widest cursor-pointer"
            >
              REFRESH LIST
            </button>
          </div>

          {isLoadingVideos ? (
            <div className="py-12 text-center text-zinc-500 font-mono space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-600" />
              <p className="text-xs uppercase tracking-widest">Loading Curated Videos...</p>
            </div>
          ) : videosList.length === 0 ? (
            <div className="p-12 text-center text-zinc-600 font-mono border border-neutral-900 bg-neutral-950 space-y-2">
              <p className="text-sm font-bold uppercase text-zinc-400">NO CURATED VIDEOS IN DATABASE</p>
              <p className="text-xs">Use the form above to add your first YouTube video.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {videosList.map((video) => (
                <div key={video.id} className="bg-neutral-950 border border-neutral-800 rounded-sm p-4 space-y-3 flex flex-col justify-between group hover:border-neutral-700 transition-colors">
                  <div className="relative aspect-video w-full bg-black overflow-hidden border border-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/30 hover:bg-black/10 flex items-center justify-center transition-colors"
                    >
                      <Play className="w-8 h-8 text-white fill-current drop-shadow-md" />
                    </a>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-red-500 bg-red-600/10 border border-red-600/30 px-2 py-0.5">
                      {video.artist_name || 'WORLDSTAR'}
                    </span>
                    <h4 className="text-xs font-bold text-white uppercase line-clamp-2 leading-tight">
                      {video.title}
                    </h4>
                  </div>

                  <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
                    <a
                      href={video.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 flex items-center gap-1 uppercase"
                    >
                      YOUTUBE LINK <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => handleDelete(video.id, video.title)}
                      disabled={isPending}
                      className="text-red-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title="Delete Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
