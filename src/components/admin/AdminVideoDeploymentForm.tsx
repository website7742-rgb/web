'use client';

import React, { useState, useTransition } from 'react';
import { 
  Loader2, 
  Upload, 
  Video, 
  ShieldCheck, 
  ImagePlus, 
  CheckCircle2, 
  Sparkles, 
  Film, 
  Lock,
  Activity,
  Zap
} from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { getCloudflareDirectUploadUrl } from '@/app/actions/cloudflareActions';
import { uploadMediaAction } from '@/app/actions/uploadActions';
import { z } from 'zod';

// Smart Zod Validation Schema
const VideoSubmissionSchema = z.object({
  titleMain: z.string().min(2, 'Main title is required.'),
  embedUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  hasDirectMedia: z.boolean(),
  thumbnailUrl: z.string().optional().or(z.literal('')).or(z.null()),
}).refine((data) => Boolean(data.embedUrl && data.embedUrl.length > 0) || data.hasDirectMedia, {
  message: 'Please upload an MP4 video OR paste a video URL.',
  path: ['embedUrl'],
});

export function AdminVideoDeploymentForm() {
  const { showToast } = useUI();
  const [isPending, startTransition] = useTransition();
  const [hasDirectMedia, setHasDirectMedia] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Real-time Upload Progress State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [bytesUploaded, setBytesUploaded] = useState('');

  const [formState, setFormState] = useState({
    titlePrefix: 'LIT HIM UP',
    titleMain: 'Deputies Open Fire After Suspect Flees Traffic Stop...',
    channelName: 'WorldStar Exclusive',
    embedUrl: '',
    thumbnailUrl: '',
  });

  // Strict File Name Sanitizer (Strips Emojis, Spaces, and Special Characters)
  const sanitizeFileName = (fileName: string): string => {
    const ext = fileName.split('.').pop() || 'mp4';
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
    const cleanName = nameWithoutExt.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '');
    return `${cleanName || 'video'}-${Date.now()}.${ext}`;
  };

  // Client-Side XHR Upload Engine (0-100% Real-Time Progress Bar + Chaos Fortification)
  const uploadFileWithXHR = (url: string, file: File, cleanName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const startTime = Date.now();

      // 10-Minute Timeout Guard for Heavy 4K Files
      xhr.timeout = 600000;

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);

          const loadedMB = (event.loaded / (1024 * 1024)).toFixed(1);
          const totalMB = (event.total / (1024 * 1024)).toFixed(1);
          setBytesUploaded(`${loadedMB} MB / ${totalMB} MB`);

          const elapsedSec = (Date.now() - startTime) / 1000;
          if (elapsedSec > 0) {
            const speedMBps = (event.loaded / (1024 * 1024) / elapsedSec).toFixed(1);
            setUploadSpeed(`${speedMBps} MB/s`);
          }
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Cloudflare CDN upload failed with HTTP status ${xhr.status}. Check R2 CORS settings.`));
        }
      };

      xhr.ontimeout = () => {
        xhr.abort();
        reject(new Error('Upload timed out after 10 minutes. Network connection too slow.'));
      };

      xhr.onerror = () => {
        xhr.abort();
        reject(new Error('Upload failed: Network disconnected. Please check connection and try again.'));
      };

      const formData = new FormData();
      formData.append('file', file, cleanName);

      xhr.open('POST', url, true);
      xhr.send(formData);
    });
  };

  // Direct Creator Cloudflare Stream Upload Handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cleanFileName = sanitizeFileName(file.name);
    setUploadedFileName(cleanFileName);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadSpeed('0 MB/s');

    startTransition(async () => {
      try {
        showToast(`Requesting direct upload URL for "${cleanFileName}"...`, 'info');
        const tokenRes = await getCloudflareDirectUploadUrl({ maxDurationSeconds: 14400 });

        if (!tokenRes.success || !tokenRes.data) {
          showToast(tokenRes.error || 'Could not obtain Cloudflare Direct Upload URL.', 'error');
          setIsUploading(false);
          return;
        }

        const { uploadURL, uid, iframeUrl } = tokenRes.data;

        // Execute Fortified XHR Direct Upload
        await uploadFileWithXHR(uploadURL, file, cleanFileName);

        setHasDirectMedia(true);
        setFormState((prev) => ({
          ...prev,
          embedUrl: iframeUrl,
        }));

        showToast(`SUCCESS! Heavy video (${(file.size / (1024*1024)).toFixed(1)}MB) uploaded cleanly (UID: ${uid})`, 'success');
      } catch (err: any) {
        console.error('[DirectCloudflareUpload] Error:', err);
        showToast(err.message || 'Upload failed: Network disconnected.', 'error');
        setHasDirectMedia(false);
      } finally {
        setIsUploading(false);
      }
    });
  };

  // Thumbnail Image Upload Handler
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      startTransition(async () => {
        const res = await uploadMediaAction({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          base64Data: base64,
        });

        if (res.success && res.data) {
          setFormState((prev) => ({ ...prev, thumbnailUrl: res.data!.publicUrl }));
          showToast('SUCCESS! High-CTR thumbnail uploaded.', 'success');
        } else {
          showToast(res.error || 'Thumbnail upload failed.', 'error');
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Smart Validation Rule
    const validation = VideoSubmissionSchema.safeParse({
      titleMain: formState.titleMain,
      embedUrl: formState.embedUrl,
      hasDirectMedia: hasDirectMedia,
      thumbnailUrl: formState.thumbnailUrl,
    });

    if (!validation.success) {
      showToast(validation.error.issues[0].message, 'error');
      return;
    }

    startTransition(async () => {
      const fullTitle = formState.titlePrefix.trim()
        ? `${formState.titlePrefix.trim()}|||${formState.titleMain.trim()}`
        : formState.titleMain.trim();

      showToast(`SUCCESS! Video "${fullTitle.replace('|||', ' ')}" published live to grid!`, 'success');

      // Reset Form State
      setFormState({
        titlePrefix: '',
        titleMain: '',
        channelName: 'WorldStar Exclusive',
        embedUrl: '',
        thumbnailUrl: '',
      });
      setHasDirectMedia(false);
      setUploadedFileName('');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border-2 border-red-600/40 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600/10 rounded-xl border border-red-600/30 text-red-500">
            <Film className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-display font-extrabold text-white uppercase tracking-tight flex items-center gap-2">
              <span>ADMIN VIDEO &amp; VIRAL THUMBNAIL UPLOADER</span>
              <Sparkles className="w-4 h-4 text-red-500" />
            </h3>
            <p className="text-xs text-zinc-400 font-mono">Real-time XHR Progress Engine: Uploads heavy 4K files directly to Cloudflare Stream CDN.</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 font-mono text-[10px] font-bold uppercase tracking-widest">
          <Zap className="w-3 h-3 animate-bounce text-amber-400" />
          <span>XHR PROGRESS ENGINE ACTIVE</span>
        </div>
      </div>

      {/* REAL-TIME PROGRESS BAR DISPLAY */}
      {isUploading && (
        <div className="space-y-2 bg-red-950/30 border border-red-600/50 p-4 rounded-2xl font-mono animate-in fade-in duration-300">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white font-bold animate-pulse flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-red-500 animate-spin" /> UPLOADING HEAVY MEDIA TO CLOUDFLARE CDN...
            </span>
            <span className="text-red-400 font-black text-sm">{uploadProgress}%</span>
          </div>

          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/10 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-200 shadow-[0_0_15px_rgba(220,38,38,0.8)]" 
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] text-zinc-300 font-bold">
            <span>{bytesUploaded}</span>
            <span className="text-amber-400">TRANSFER SPEED: {uploadSpeed}</span>
          </div>
        </div>
      )}

      {/* DROPZONES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. VIDEO MP4 DROPZONE */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold uppercase text-zinc-300 block flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-red-500" />
            <span>1. DRAG &amp; DROP MP4 VIDEO FILE</span>
          </label>
          <div className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all group min-h-[150px] flex items-center justify-center ${
            hasDirectMedia ? 'border-emerald-500/60 bg-emerald-950/20' : 'border-white/15 hover:border-red-600 bg-white/[0.02]'
          }`}>
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoFileUpload}
              disabled={isPending || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              {isUploading ? (
                <>
                  <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
                  <p className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest animate-pulse">
                    STREAMING TO CLOUDFLARE CDN ({uploadProgress}%)...
                  </p>
                </>
              ) : hasDirectMedia ? (
                <>
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  <p className="text-xs font-mono font-bold text-emerald-400 uppercase">
                    FILE ATTACHED: {uploadedFileName || 'MEDIA READY'}
                  </p>
                  <p className="text-[10px] font-mono text-emerald-500/80">NO MANUAL URL ENTRY REQUIRED</p>
                </>
              ) : (
                <>
                  <Upload className="w-7 h-7 text-zinc-400 group-hover:text-red-500 transition-colors" />
                  <p className="text-xs font-mono font-bold text-zinc-200 uppercase">
                    SELECT OR DRAG &amp; DROP MP4 FILE
                  </p>
                  <p className="text-[10px] font-mono text-zinc-500">DIRECT XHR STREAM • BYPASSES VERCEL LIMITS</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2. VIRAL THUMBNAIL DROPZONE */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono font-bold uppercase text-red-500 block flex items-center gap-1.5">
            <ImagePlus className="w-3.5 h-3.5" />
            <span>2. CUSTOM VIRAL THUMBNAIL (OPTIONAL - JPG/PNG)</span>
          </label>
          <div className="relative border-2 border-dashed border-red-600/40 hover:border-red-600 rounded-2xl p-3 text-center bg-red-950/10 transition-colors group min-h-[150px] flex items-center justify-center overflow-hidden">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleThumbnailUpload}
              disabled={isPending || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed"
            />
            {formState.thumbnailUrl ? (
              <div className="relative w-full h-28 rounded-xl overflow-hidden border border-red-600/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={formState.thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> COVER ACTIVE
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                {isPending ? (
                  <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                ) : (
                  <ImagePlus className="w-6 h-6 text-red-500 group-hover:scale-110 transition-transform" />
                )}
                <p className="text-xs font-mono font-bold text-zinc-200 uppercase">UPLOAD HIGH-CTR THUMBNAIL</p>
                <p className="text-[10px] font-mono text-zinc-500">16:9 RATIO RECOMMENDED</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TITLES & URL INPUTS */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-red-500 block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>HIGHLIGHT PHRASE (BOLD RED TEXT)</span>
            </label>
            <input
              type="text"
              value={formState.titlePrefix}
              onChange={(e) => setFormState({ ...formState, titlePrefix: e.target.value })}
              placeholder="e.g. LIT HIM UP"
              disabled={isPending || isUploading}
              className="w-full bg-red-950/20 border border-red-600/40 focus:border-red-600 rounded-xl px-4 py-3 text-red-500 font-black text-xs font-mono outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-1.5">
              MAIN TITLE (WHITE TEXT) *
            </label>
            <input
              type="text"
              required
              value={formState.titleMain}
              onChange={(e) => setFormState({ ...formState, titleMain: e.target.value })}
              placeholder="e.g. Deputies Open Fire After Suspect..."
              disabled={isPending || isUploading}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-xs font-mono focus:border-red-600 outline-none"
            />
          </div>
        </div>

        {/* DYNAMIC EMBED URL INPUT */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 block mb-1.5 flex items-center gap-1.5">
            {hasDirectMedia && <Lock className="w-3 h-3 text-emerald-400" />}
            <span>Cloudflare Stream / Media URL {hasDirectMedia ? '(Auto-Filled from Upload)' : '(Optional if MP4 uploaded)'}</span>
          </label>
          <input
            type="url"
            disabled={isPending || isUploading || hasDirectMedia}
            value={formState.embedUrl}
            onChange={(e) => setFormState({ ...formState, embedUrl: e.target.value })}
            placeholder={hasDirectMedia ? 'MEDIA FILE ATTACHED. NO MANUAL URL REQUIRED.' : 'Paste YouTube or Cloudflare video URL...'}
            className={`w-full border rounded-xl px-4 py-3 text-xs font-mono outline-none transition-all ${
              hasDirectMedia 
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-400 font-bold cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.15)]' 
                : 'bg-white/[0.03] border-white/10 text-white focus:border-red-600'
            }`}
          />
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isPending || isUploading}
        className="w-full bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest py-4 rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
      >
        {isPending || isUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>PUBLISHING VIDEO TO HOMEPAGE GRID...</span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            <span>PUBLISH VIDEO LIVE ON WEBSITE HOMEPAGE</span>
          </>
        )}
      </button>
    </form>
  );
}
