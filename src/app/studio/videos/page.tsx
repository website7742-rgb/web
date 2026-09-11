'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { 
  Video, Plus, Trash2, ExternalLink, ShieldAlert, Loader2, ArrowLeft, 
  CheckCircle2, Play, Edit3, X, Search, Sparkles, Cloud, UploadCloud, FileVideo, Image as ImageIcon, Youtube
} from 'lucide-react';
import { 
  submitYouTubeVideoAction, submitR2VideoAction, getAllAdminVideosAction, 
  deleteAdminVideoAction, updateAdminVideoAction 
} from '@/app/actions/videoActions';
import { uploadMediaAction } from '@/app/actions/uploadActions';
import { getYouTubeId } from '@/lib/utils';
import { useUI } from '@/providers/UIContext';

interface CuratedVideo {
  id: string;
  title: string;
  artist_name: string;
  video_url: string;
  thumbnail_url: string;
  genre?: string;
  is_featured?: boolean;
  description?: string;
  created_at: string;
}

export default function AdminVideosPage() {
  const { showToast } = useUI();

  // Mode tab
  const [activeTab, setActiveTab] = useState<'YOUTUBE' | 'R2'>('YOUTUBE');

  // YouTube Curation State
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [artistName, setArtistName] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [genre, setGenre] = useState('Hip-Hop');
  const [isFeatured, setIsFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Direct R2 Upload State
  const [r2VideoFile, setR2VideoFile] = useState<File | null>(null);
  const [r2ThumbnailFile, setR2ThumbnailFile] = useState<File | null>(null);
  const [r2ThumbnailPreview, setR2ThumbnailPreview] = useState<string | null>(null);
  const [r2Title, setR2Title] = useState('');
  const [r2Artist, setR2Artist] = useState('');
  const [r2Genre, setR2Genre] = useState('Hip-Hop');
  const [r2IsFeatured, setR2IsFeatured] = useState(false);
  const [r2Uploading, setR2Uploading] = useState(false);
  const [r2Progress, setR2Progress] = useState(0);
  const [r2Status, setR2Status] = useState('');
  const [r2Error, setR2Error] = useState<string | null>(null);

  const [videosList, setVideosList] = useState<CuratedVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVideo, setEditingVideo] = useState<CuratedVideo | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Extract video ID for live thumbnail preview
  const previewVideoId = getYouTubeId(youtubeUrl);
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

    const res = await submitYouTubeVideoAction(youtubeUrl, artistName, {
      title: customTitle || undefined,
      genre,
      is_featured: isFeatured,
    });
    setIsSubmitting(false);

    if (res.success) {
      showToast(res.message || 'YouTube video curated successfully!', 'success');
      setYoutubeUrl('');
      setArtistName('');
      setCustomTitle('');
      setIsFeatured(false);
      loadVideos();
    } else {
      setError(res.error || 'Failed to add video.');
      showToast(res.error || 'Failed to add video.', 'error');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    setIsUpdating(true);
    const res = await updateAdminVideoAction(editingVideo.id, {
      title: editingVideo.title,
      artist_name: editingVideo.artist_name,
      genre: editingVideo.genre || 'Hip-Hop',
      is_featured: editingVideo.is_featured,
      thumbnail_url: editingVideo.thumbnail_url,
    });
    setIsUpdating(false);

    if (res.success) {
      showToast('Video updated successfully!', 'success');
      setVideosList((prev) => prev.map((v) => (v.id === editingVideo.id ? (res.video as CuratedVideo) : v)));
      setEditingVideo(null);
    } else {
      showToast(res.error || 'Failed to update video', 'error');
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

  const handleR2ThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setR2ThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setR2ThumbnailPreview(url);
    }
  };

  const handleR2VideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setR2VideoFile(file);
      if (!r2Title) {
        const rawName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setR2Title(rawName);
      }
    }
  };

  const handleR2Upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!r2VideoFile) {
      setR2Error('Please select a video file (MP4, WebM, MOV) to upload.');
      return;
    }
    if (!r2Artist.trim() || !r2Title.trim()) {
      setR2Error('Please enter both Video Title and Artist Name.');
      return;
    }

    setR2Uploading(true);
    setR2Error(null);
    setR2Progress(10);
    setR2Status('Converting video asset...');

    try {
      // 1. Convert video to base64
      const videoBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(r2VideoFile);
      });

      setR2Progress(35);
      setR2Status('Streaming video payload directly to Cloudflare R2 bucket...');

      const videoUploadRes = await uploadMediaAction({
        fileName: r2VideoFile.name,
        fileType: r2VideoFile.type || 'video/mp4',
        fileSize: r2VideoFile.size,
        base64Data: videoBase64,
        pathFolder: 'videos',
      });

      if (!videoUploadRes.success || !videoUploadRes.data?.publicUrl) {
        throw new Error(videoUploadRes.error || 'Cloudflare R2 video stream failed.');
      }

      const publicVideoUrl = videoUploadRes.data.publicUrl;
      setR2Progress(70);
      setR2Status('Video uploaded to Cloudflare R2! Processing thumbnail...');

      // 2. Upload thumbnail if selected
      let publicThumbUrl = '';
      if (r2ThumbnailFile) {
        const thumbBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(r2ThumbnailFile);
        });

        const thumbUploadRes = await uploadMediaAction({
          fileName: r2ThumbnailFile.name,
          fileType: r2ThumbnailFile.type || 'image/jpeg',
          fileSize: r2ThumbnailFile.size,
          base64Data: thumbBase64,
          pathFolder: 'thumbnails',
        });

        if (thumbUploadRes.success && thumbUploadRes.data?.publicUrl) {
          publicThumbUrl = thumbUploadRes.data.publicUrl;
        }
      }

      setR2Progress(85);
      setR2Status('Inserting metadata into Supabase database...');

      // 3. Register in Supabase videos table
      const dbRes = await submitR2VideoAction({
        title: r2Title,
        artistName: r2Artist,
        videoUrl: publicVideoUrl,
        thumbnailUrl: publicThumbUrl,
        genre: r2Genre,
        isFeatured: r2IsFeatured,
      });

      if (!dbRes.success) {
        throw new Error(dbRes.error || 'Failed to register video in database.');
      }

      setR2Progress(100);
      setR2Status('Published live!');
      showToast('Video uploaded to Cloudflare R2 and published live!', 'success');

      // Reset form
      setR2VideoFile(null);
      setR2ThumbnailFile(null);
      setR2ThumbnailPreview(null);
      setR2Title('');
      setR2Artist('');
      setR2IsFeatured(false);
      loadVideos();
    } catch (err: any) {
      console.error('[handleR2Upload] Error:', err);
      setR2Error(err.message || 'R2 upload pipeline failed.');
      showToast(err.message || 'R2 upload pipeline failed.', 'error');
    } finally {
      setR2Uploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans selection:bg-red-600 selection:text-white">
      <div className="max-w-[1500px] mx-auto space-y-10">
        
        {/* HEADER SECTION */}
        <div className="border-b border-neutral-800 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 rounded-sm">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">ADMIN VIDEO PIPELINE ENGINE</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight text-white font-display">
              VIDEO <span className="text-red-600">MANAGEMENT HUB</span>
            </h1>
            <p className="text-sm text-zinc-400 font-mono max-w-2xl leading-relaxed">
              Curate YouTube releases or upload native MP4 video masters directly into Cloudflare R2 storage and the WorldStar catalog.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio/dashboard"
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

        {/* TAB NAVIGATION: YOUTUBE VS CLOUDFLARE R2 */}
        <div className="flex flex-wrap items-center gap-3 border-b border-neutral-800 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('YOUTUBE')}
            className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'YOUTUBE'
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'bg-neutral-950 text-zinc-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Youtube className="w-4 h-4" />
            <span>YOUTUBE CURATION</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('R2')}
            className={`px-5 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'R2'
                ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                : 'bg-neutral-950 text-zinc-400 hover:text-white border border-neutral-800'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>DIRECT CLOUDFLARE R2 UPLOAD</span>
          </button>
        </div>

        {/* CURATION / UPLOAD FORM + LIVE PREVIEW GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* FORM AREA (7 COLS) */}
          <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 p-6 md:p-8 space-y-6 shadow-2xl rounded-sm">
            {activeTab === 'YOUTUBE' ? (
              <>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 mb-2 block">
                          Custom Title (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Leave blank for auto-detected YouTube title"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-black border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white font-mono text-xs p-3 outline-none transition-all disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 mb-2 block">
                          Genre
                        </label>
                        <select
                          value={genre}
                          onChange={(e) => setGenre(e.target.value)}
                          disabled={isSubmitting}
                          className="w-full bg-black border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white font-mono text-xs p-3 outline-none transition-all disabled:opacity-50"
                        >
                          <option value="Hip-Hop">Hip-Hop</option>
                          <option value="Rap">Rap</option>
                          <option value="Trap">Trap</option>
                          <option value="Drill">Drill</option>
                          <option value="R&B">R&B</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="checkbox"
                        id="isFeaturedCheck"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        disabled={isSubmitting}
                        className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                      />
                      <label htmlFor="isFeaturedCheck" className="text-xs font-mono text-zinc-300 uppercase tracking-wider cursor-pointer">
                        Feature as WorldStar Premiere (Highlighted in Public Hub)
                      </label>
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
                        <span>EXTRACTING METADATA &amp; INGESTING...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>ADD VIDEO TO PLATFORM</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <>
                {/* DIRECT CLOUDFLARE R2 UPLOAD FORM */}
                <div className="border-b border-neutral-800 pb-4">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-red-600" />
                    DIRECT CLOUDFLARE R2 MASTER UPLOAD
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    Upload MP4 master files directly to the Cloudflare R2 bucket. Streamed natively across the WorldStar CDN.
                  </p>
                </div>

                <form onSubmit={handleR2Upload} className="space-y-6">
                  <div className="space-y-4">
                    {/* Video File Picker */}
                    <div>
                      <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 mb-2 block">
                        Select Video File (MP4, WebM, MOV) *
                      </label>
                      <div className="border border-dashed border-neutral-800 hover:border-red-600/60 transition-colors p-5 bg-black flex flex-col items-center justify-center text-center cursor-pointer relative min-h-[90px]">
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          required
                          disabled={r2Uploading}
                          onChange={handleR2VideoChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <FileVideo className="w-8 h-8 text-red-500 mb-2" />
                        {r2VideoFile ? (
                          <div className="space-y-1 font-mono text-xs">
                            <p className="text-white font-bold">{r2VideoFile.name}</p>
                            <p className="text-zinc-500">{(r2VideoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="space-y-1 font-mono text-xs text-zinc-400">
                            <p className="font-bold uppercase text-white">Click or drag &amp; drop video file</p>
                            <p className="text-[10px] text-zinc-500">Direct binary upload to Cloudflare R2</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thumbnail Picker */}
                    <div>
                      <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 mb-2 block">
                        Custom Thumbnail Image (Optional)
                      </label>
                      <div className="border border-dashed border-neutral-800 hover:border-red-600/60 transition-colors p-3.5 bg-black flex items-center justify-between cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={r2Uploading}
                          onChange={handleR2ThumbnailChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="flex items-center gap-3">
                          <ImageIcon className="w-5 h-5 text-zinc-500" />
                          <span className="font-mono text-xs text-zinc-400 truncate max-w-xs">
                            {r2ThumbnailFile ? r2ThumbnailFile.name : 'Select JPG, PNG, or WEBP thumbnail'}
                          </span>
                        </div>
                        {r2ThumbnailFile && (
                          <span className="font-mono text-[10px] text-red-400 font-bold">READY</span>
                        )}
                      </div>
                    </div>

                    {/* Artist & Title */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 mb-2 block">
                          Artist Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. DRAKE, FUTURE"
                          value={r2Artist}
                          onChange={(e) => setR2Artist(e.target.value)}
                          disabled={r2Uploading}
                          className="w-full bg-black border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white font-mono text-sm p-3 outline-none transition-all disabled:opacity-50 uppercase"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 mb-2 block">
                          Video Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 100 Gigs Master Cut"
                          value={r2Title}
                          onChange={(e) => setR2Title(e.target.value)}
                          disabled={r2Uploading}
                          className="w-full bg-black border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white font-mono text-sm p-3 outline-none transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Genre & Feature Toggle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                      <div>
                        <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 mb-2 block">
                          Genre
                        </label>
                        <select
                          value={r2Genre}
                          onChange={(e) => setR2Genre(e.target.value)}
                          disabled={r2Uploading}
                          className="w-full bg-black border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white font-mono text-xs p-3 outline-none transition-all disabled:opacity-50"
                        >
                          <option value="Hip-Hop">Hip-Hop</option>
                          <option value="Rap">Rap</option>
                          <option value="Trap">Trap</option>
                          <option value="Drill">Drill</option>
                          <option value="R&B">R&B</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3 pt-4">
                        <input
                          type="checkbox"
                          id="r2IsFeaturedCheck"
                          checked={r2IsFeatured}
                          onChange={(e) => setR2IsFeatured(e.target.checked)}
                          disabled={r2Uploading}
                          className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                        />
                        <label htmlFor="r2IsFeaturedCheck" className="text-xs font-mono text-zinc-300 uppercase tracking-wider cursor-pointer">
                          Feature as WorldStar Premiere
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Telemetry Progress Bar */}
                  {r2Uploading && (
                    <div className="p-4 bg-red-950/20 border border-red-900/50 space-y-2 font-mono">
                      <div className="flex justify-between text-xs text-white font-bold">
                        <span>{r2Status}</span>
                        <span className="text-red-500">{r2Progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-900 overflow-hidden">
                        <div className="h-full bg-red-600 transition-all duration-300" style={{ width: `${r2Progress}%` }} />
                      </div>
                    </div>
                  )}

                  {r2Error && (
                    <div className="p-4 bg-red-950/20 border border-red-900 text-red-500 text-xs font-mono font-bold">
                      {r2Error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={r2Uploading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-mono font-black text-sm uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {r2Uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>STREAMING TO CLOUDFLARE R2 PIPELINE...</span>
                      </>
                    ) : (
                      <>
                        <Cloud className="w-5 h-5" />
                        <span>UPLOAD TO CLOUDFLARE R2 &amp; PUBLISH</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          {/* LIVE THUMBNAIL / R2 PREVIEW CARD (5 COLS) */}
          <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 p-6 space-y-4 rounded-sm">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 border-b border-neutral-800 pb-3 flex items-center gap-2">
              <Play className="w-4 h-4 text-red-600" />
              LIVE PREVIEW &amp; TELEMETRY
            </h4>

            {activeTab === 'YOUTUBE' ? (
              previewThumbnailUrl ? (
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
              )
            ) : (
              /* R2 PREVIEW */
              <div className="space-y-4 font-mono">
                {r2ThumbnailPreview ? (
                  <div className="relative aspect-video w-full bg-black border border-neutral-800 overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={r2ThumbnailPreview}
                      alt="R2 Master Thumbnail"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg">
                        <Play className="w-6 h-6 text-white fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-44 border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center text-center p-6 text-zinc-600 space-y-2">
                    <Cloud className="w-8 h-8 text-red-600" />
                    <p className="text-xs uppercase font-bold text-zinc-400">R2 STREAM PIPELINE READY</p>
                    <p className="text-[10px] text-zinc-500">Selected MP4 video will stream directly from Cloudflare R2 bucket.</p>
                  </div>
                )}

                <div className="p-3 bg-black border border-neutral-900 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase">
                    <span>STORAGE TARGET:</span>
                    <span className="text-emerald-400 font-bold">CLOUDFLARE R2</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase">
                    <span>VIDEO master:</span>
                    <span className="text-white font-bold truncate max-w-[150px]">{r2VideoFile ? r2VideoFile.name : 'NO FILE SELECTED'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase">
                    <span>ESTIMATED FILE SIZE:</span>
                    <span className="text-zinc-300 font-bold">{r2VideoFile ? `${(r2VideoFile.size / (1024 * 1024)).toFixed(2)} MB` : '0 MB'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CURATED VIDEOS TABLE / LIST */}
        <div className="space-y-6 pt-6 border-t border-neutral-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-red-600" />
                CURRENTLY CURATED VIDEOS ({videosList.length})
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search curated..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black border border-neutral-800 focus:border-red-600 text-white font-mono text-xs pl-8 pr-3 py-2 outline-none"
                />
              </div>
              <button
                onClick={loadVideos}
                className="text-xs font-mono text-zinc-400 hover:text-white uppercase font-bold tracking-widest cursor-pointer px-3 py-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700"
              >
                REFRESH
              </button>
            </div>
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
              {videosList
                .filter((v) => {
                  if (!searchTerm.trim()) return true;
                  const q = searchTerm.toLowerCase().trim();
                  return (
                    v.title.toLowerCase().includes(q) ||
                    v.artist_name.toLowerCase().includes(q) ||
                    (v.genre && v.genre.toLowerCase().includes(q))
                  );
                })
                .map((video) => (
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
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase text-red-500 bg-red-600/10 border border-red-600/30 px-2 py-0.5">
                        {video.artist_name || 'WORLDSTAR'}
                      </span>
                      {(video.video_url.includes('r2.dev') || video.video_url.includes('r2.cloudflarestorage')) && (
                        <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-1.5 py-0.5">
                          R2 STREAM
                        </span>
                      )}
                      {video.is_featured && (
                        <span className="text-[9px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5">
                          PREMIERE
                        </span>
                      )}
                    </div>
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
                      {video.video_url.includes('youtube') ? 'YOUTUBE' : 'R2 STREAM'} <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingVideo(video)}
                        className="text-zinc-400 hover:text-white p-1.5 transition-colors cursor-pointer"
                        title="Edit Video"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id, video.title)}
                        disabled={isPending}
                        className="text-red-500 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                        title="Delete Video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* EDIT VIDEO MODAL */}
        {editingVideo && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-neutral-950 border border-neutral-800 p-6 md:p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-red-600" />
                  EDIT VIDEO METADATA
                </h3>
                <button onClick={() => setEditingVideo(null)} className="text-zinc-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    className="w-full bg-black border border-neutral-800 focus:border-red-600 text-white font-mono text-sm p-3 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1">Artist Name</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.artist_name}
                    onChange={(e) => setEditingVideo({ ...editingVideo, artist_name: e.target.value })}
                    className="w-full bg-black border border-neutral-800 focus:border-red-600 text-white font-mono text-sm p-3 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1">Genre</label>
                    <select
                      value={editingVideo.genre || 'Hip-Hop'}
                      onChange={(e) => setEditingVideo({ ...editingVideo, genre: e.target.value })}
                      className="w-full bg-black border border-neutral-800 focus:border-red-600 text-white font-mono text-xs p-3 outline-none"
                    >
                      <option value="Hip-Hop">Hip-Hop</option>
                      <option value="Rap">Rap</option>
                      <option value="Trap">Trap</option>
                      <option value="Drill">Drill</option>
                      <option value="R&B">R&B</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="editIsFeatured"
                      checked={Boolean(editingVideo.is_featured)}
                      onChange={(e) => setEditingVideo({ ...editingVideo, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-red-600 rounded cursor-pointer"
                    />
                    <label htmlFor="editIsFeatured" className="text-xs font-mono text-zinc-300 uppercase cursor-pointer">
                      Featured Premiere
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-zinc-400 uppercase block mb-1">Thumbnail URL</label>
                  <input
                    type="url"
                    value={editingVideo.thumbnail_url}
                    onChange={(e) => setEditingVideo({ ...editingVideo, thumbnail_url: e.target.value })}
                    className="w-full bg-black border border-neutral-800 focus:border-red-600 text-white font-mono text-xs p-3 outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setEditingVideo(null)}
                    className="px-4 py-2 border border-neutral-700 text-zinc-400 hover:text-white font-mono text-xs uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs uppercase font-bold flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    {isUpdating && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
