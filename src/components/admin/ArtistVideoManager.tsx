'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Video, Play, CheckCircle2, AlertTriangle, Search, Loader2, 
  Trash2, ExternalLink, RefreshCw, Eye, EyeOff, ShieldCheck, 
  HelpCircle, Info, Sparkles, Youtube, Check, ChevronDown,
  Film, UploadCloud
} from 'lucide-react';
import { MOCK_ARTISTS } from '@/lib/data/mockData';
import { Artist } from '@/types';
import { 
  validateArtistVideoAction, 
  publishArtistVideoAction, 
  unpublishArtistVideoAction, 
  removeArtistVideoAction, 
  getArtistVideoOverridesListAction,
  getAvailableR2VideosAction,
  publishArtistR2VideoAction,
  AvailableR2Video
} from '@/app/actions/artistVideoActions';
import { ArtistVideoOverride } from '@/lib/repositories/ArtistVideoOverrideRepository';
import { useUI } from '@/providers/UIContext';
import { getYouTubeId } from '@/lib/utils';

interface ValidationResult {
  videoId: string;
  youtubeUrl: string;
  title: string;
  channelName: string;
  thumbnailUrl: string;
  matchConfidence: 'EXACT' | 'WARNING';
  warningMessage?: string | null;
}

interface CurrentLiveStatus {
  status: 'MATCHED' | 'UNAVAILABLE';
  videoId?: string | null;
  videoUrl?: string | null;
  mediaType?: 'youtube' | 'r2';
  title?: string | null;
  channelName?: string | null;
  source?: string;
  loading: boolean;
}

interface ArtistVideoManagerProps {
  initialSlug?: string | null;
}

export default function ArtistVideoManager({ initialSlug }: ArtistVideoManagerProps) {
  const { showToast } = useUI();
  const [isPending, startTransition] = useTransition();

  // Deduplicated public artists sorted alphabetically
  const uniqueArtists = useMemo(() => {
    const map = new Map<string, Artist>();
    for (const a of MOCK_ARTISTS) {
      if (a && a.slug && !map.has(a.slug)) {
        map.set(a.slug, a);
      }
    }
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  // Selection & Input State
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug || (uniqueArtists[0]?.slug ?? ''));
  const [artistSearch, setArtistSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Source Type Selector: YOUTUBE vs CLOUDFLARE R2
  const [sourceType, setSourceType] = useState<'YOUTUBE' | 'R2'>('YOUTUBE');

  // YouTube Specific State
  const [inputUrl, setInputUrl] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [manualConfirmChecked, setManualConfirmChecked] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Cloudflare R2 Specific State
  const [r2VideosList, setR2VideosList] = useState<AvailableR2Video[]>([]);
  const [isLoadingR2Videos, setIsLoadingR2Videos] = useState(false);
  const [selectedR2VideoId, setSelectedR2VideoId] = useState<string | null>(null);
  const [r2SearchQuery, setR2SearchQuery] = useState('');
  const [isPublishingR2, setIsPublishingR2] = useState(false);

  // Overrides List State
  const [overridesList, setOverridesList] = useState<ArtistVideoOverride[]>([]);
  const [isLoadingOverrides, setIsLoadingOverrides] = useState(true);
  const [tableSearch, setTableSearch] = useState('');

  // Selected Artist's Current Live Status
  const [currentLive, setCurrentLive] = useState<CurrentLiveStatus>({
    status: 'UNAVAILABLE',
    loading: false,
  });

  const selectedArtist = useMemo(() => {
    return uniqueArtists.find((a) => a.slug === selectedSlug) || uniqueArtists[0];
  }, [uniqueArtists, selectedSlug]);

  // Load Overrides List
  const loadOverrides = async () => {
    setIsLoadingOverrides(true);
    const res = await getArtistVideoOverridesListAction();
    setIsLoadingOverrides(false);
    if (res.success && res.overrides) {
      setOverridesList(res.overrides);
    }
  };

  // Load Available Cloudflare R2 Videos
  const loadR2Videos = async () => {
    setIsLoadingR2Videos(true);
    const res = await getAvailableR2VideosAction();
    setIsLoadingR2Videos(false);
    if (res.success && res.videos) {
      setR2VideosList(res.videos);
    }
  };

  useEffect(() => {
    loadOverrides();
    loadR2Videos();
  }, []);

  // Update initial slug when prop changes
  useEffect(() => {
    if (initialSlug && uniqueArtists.some((a) => a.slug === initialSlug)) {
      setSelectedSlug(initialSlug);
    }
  }, [initialSlug, uniqueArtists]);

  // Fetch Current Live Video when Selected Artist changes
  useEffect(() => {
    if (!selectedArtist) return;

    let isMounted = true;
    setCurrentLive({ status: 'UNAVAILABLE', loading: true });
    setValidationResult(null);
    setValidationError(null);
    setInputUrl('');
    setAdminNote('');
    setManualConfirmChecked(false);
    setSelectedR2VideoId(null);

    const fetchCurrentStatus = async () => {
      try {
        const params = new URLSearchParams({
          name: selectedArtist.name,
          slug: selectedArtist.slug,
        });
        if (selectedArtist.socials?.youtube) {
          params.set('channelUrl', selectedArtist.socials.youtube);
        }

        const res = await fetch(`/api/artist/video?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch status');
        const data = await res.json();

        if (isMounted) {
          setCurrentLive({
            status: data.status || 'UNAVAILABLE',
            videoId: data.videoId,
            videoUrl: data.videoUrl,
            mediaType: data.mediaType || (data.videoUrl && !data.videoId ? 'r2' : 'youtube'),
            title: data.title,
            channelName: data.channelName,
            source: data.source,
            loading: false,
          });
        }
      } catch {
        if (isMounted) {
          setCurrentLive({ status: 'UNAVAILABLE', loading: false });
        }
      }
    };

    fetchCurrentStatus();

    // If an existing override exists for this artist, prefill admin note and default tab
    const existingOverride = overridesList.find((o) => o.artist_slug === selectedArtist.slug);
    if (existingOverride) {
      setAdminNote(existingOverride.admin_note || '');
      if (existingOverride.video_type === 'R2') {
        setSourceType('R2');
        if (existingOverride.video_id) {
          setSelectedR2VideoId(existingOverride.video_id);
        }
      } else {
        setSourceType('YOUTUBE');
        if (existingOverride.youtube_url) {
          setInputUrl(existingOverride.youtube_url);
        }
      }
    }

    return () => {
      isMounted = false;
    };
  }, [selectedArtist, overridesList]);

  // Handle YouTube Video Validation
  const handleValidateVideo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputUrl.trim()) {
      setValidationError('Please enter a YouTube video URL or 11-character video ID.');
      return;
    }

    setIsValidating(true);
    setValidationError(null);
    setValidationResult(null);
    setManualConfirmChecked(false);

    try {
      const res = await validateArtistVideoAction(inputUrl.trim(), selectedArtist.name);
      if (res.success && res.videoId) {
        setValidationResult({
          videoId: res.videoId,
          youtubeUrl: res.youtubeUrl || `https://www.youtube.com/watch?v=${res.videoId}`,
          title: res.title || 'Official Music Video',
          channelName: res.channelName || 'Official Channel',
          thumbnailUrl: res.thumbnailUrl || `https://i.ytimg.com/vi/${res.videoId}/hqdefault.jpg`,
          matchConfidence: res.matchConfidence as 'EXACT' | 'WARNING',
          warningMessage: res.warningMessage,
        });
        showToast('Video validated and embeddable!', 'success');
      } else {
        setValidationError(res.error || 'Video validation failed.');
        showToast(res.error || 'Video validation failed.', 'error');
      }
    } catch (err: any) {
      setValidationError(err.message || 'Validation request failed.');
      showToast(err.message || 'Validation request failed.', 'error');
    } finally {
      setIsValidating(false);
    }
  };

  // Handle Publish / Replace YouTube Video
  const handlePublishYouTube = async () => {
    if (!validationResult || !selectedArtist) return;

    if (validationResult.matchConfidence === 'WARNING' && !manualConfirmChecked) {
      showToast('Please confirm identity match checkbox before publishing.', 'error');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await publishArtistVideoAction({
        artistSlug: selectedArtist.slug,
        artistName: selectedArtist.name,
        youtubeUrl: validationResult.youtubeUrl,
        youtubeVideoId: validationResult.videoId,
        title: validationResult.title,
        channelName: validationResult.channelName,
        thumbnailUrl: validationResult.thumbnailUrl,
        adminNote: adminNote.trim() || undefined,
        matchConfidence: validationResult.matchConfidence,
      });

      if (res.success) {
        showToast(res.message || 'Spotlight video published successfully!', 'success');
        await loadOverrides();
        setCurrentLive({
          status: 'MATCHED',
          mediaType: 'youtube',
          videoId: validationResult.videoId,
          videoUrl: null,
          title: validationResult.title,
          channelName: validationResult.channelName,
          source: 'manual_studio',
          loading: false,
        });
        setValidationResult(null);
        setInputUrl('');
        setManualConfirmChecked(false);
      } else {
        showToast(res.error || 'Failed to publish video override.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Publishing failed.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  // Selected Cloudflare R2 Video Record
  const selectedR2Video = useMemo(() => {
    if (!selectedR2VideoId) return null;
    return r2VideosList.find((v) => v.id === selectedR2VideoId) || null;
  }, [r2VideosList, selectedR2VideoId]);

  // Filtered R2 Catalog
  const filteredR2Videos = useMemo(() => {
    if (!r2SearchQuery.trim()) return r2VideosList;
    const q = r2SearchQuery.toLowerCase().trim();
    return r2VideosList.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        (v.artist_name && v.artist_name.toLowerCase().includes(q)) ||
        (v.channel_name && v.channel_name.toLowerCase().includes(q))
    );
  }, [r2VideosList, r2SearchQuery]);

  // Handle Publish / Replace Cloudflare R2 Video
  const handlePublishR2 = async () => {
    if (!selectedR2Video || !selectedArtist) {
      showToast('Please select a Cloudflare R2 video asset from the catalog first.', 'error');
      return;
    }

    setIsPublishingR2(true);
    try {
      const res = await publishArtistR2VideoAction({
        artistSlug: selectedArtist.slug,
        artistName: selectedArtist.name,
        videoDbId: selectedR2Video.id,
        adminNote: adminNote.trim() || undefined,
      });

      if (res.success) {
        showToast(res.message || 'Cloudflare R2 visual published successfully!', 'success');
        await loadOverrides();
        setCurrentLive({
          status: 'MATCHED',
          mediaType: 'r2',
          videoUrl: selectedR2Video.video_url,
          videoId: null,
          title: selectedR2Video.title,
          channelName: selectedR2Video.artist_name || selectedR2Video.channel_name,
          source: 'manual_studio',
          loading: false,
        });
      } else {
        showToast(res.error || 'Failed to publish R2 video override.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Publishing failed.', 'error');
    } finally {
      setIsPublishingR2(false);
    }
  };

  // Handle Unpublish
  const handleUnpublish = async (slug: string) => {
    if (!confirm('Unpublish this spotlight visual? The artist profile will automatically fall back to the live YouTube API or curated visual.')) {
      return;
    }

    startTransition(async () => {
      const res = await unpublishArtistVideoAction(slug);
      if (res.success) {
        showToast(res.message || 'Spotlight video unpublished.', 'success');
        await loadOverrides();
        if (slug === selectedArtist?.slug) {
          // Re-fetch current live status
          const params = new URLSearchParams({ name: selectedArtist.name, slug: selectedArtist.slug });
          const liveRes = await fetch(`/api/artist/video?${params.toString()}`);
          if (liveRes.ok) {
            const data = await liveRes.json();
            setCurrentLive({
              status: data.status,
              videoId: data.videoId,
              videoUrl: data.videoUrl,
              mediaType: data.mediaType || (data.videoUrl && !data.videoId ? 'r2' : 'youtube'),
              title: data.title,
              channelName: data.channelName,
              source: data.source,
              loading: false,
            });
          }
        }
      } else {
        showToast(res.error || 'Failed to unpublish.', 'error');
      }
    });
  };

  // Handle Permanent Delete
  const handleDeleteOverride = async (slug: string, artistName: string) => {
    if (!confirm(`Delete spotlight video override for ${artistName}? This permanently clears the manual assignment.`)) {
      return;
    }

    startTransition(async () => {
      const res = await removeArtistVideoAction(slug);
      if (res.success) {
        showToast(`Override deleted for ${artistName}.`, 'success');
        await loadOverrides();
        if (slug === selectedArtist?.slug) {
          const params = new URLSearchParams({ name: selectedArtist.name, slug: selectedArtist.slug });
          const liveRes = await fetch(`/api/artist/video?${params.toString()}`);
          if (liveRes.ok) {
            const data = await liveRes.json();
            setCurrentLive({
              status: data.status,
              videoId: data.videoId,
              videoUrl: data.videoUrl,
              mediaType: data.mediaType || (data.videoUrl && !data.videoId ? 'r2' : 'youtube'),
              title: data.title,
              channelName: data.channelName,
              source: data.source,
              loading: false,
            });
          }
        }
      } else {
        showToast(res.error || 'Failed to delete override.', 'error');
      }
    });
  };

  // Handle Re-activation
  const handleReactivateOverride = async (override: ArtistVideoOverride) => {
    if (override.video_type === 'R2' && override.video_id) {
      startTransition(async () => {
        const res = await publishArtistR2VideoAction({
          artistSlug: override.artist_slug,
          artistName: override.artist_name,
          videoDbId: override.video_id!,
          adminNote: override.admin_note || undefined,
        });
        if (res.success) {
          showToast(`Re-activated R2 visual for ${override.artist_name}`, 'success');
          await loadOverrides();
          if (override.artist_slug === selectedArtist?.slug) {
            setCurrentLive({
              status: 'MATCHED',
              mediaType: 'r2',
              videoUrl: override.video_url,
              videoId: null,
              title: override.title,
              channelName: override.channel_name,
              source: 'manual_studio',
              loading: false,
            });
          }
        } else {
          showToast(res.error || 'Failed to reactivate.', 'error');
        }
      });
    } else if (override.youtube_url) {
      setSelectedSlug(override.artist_slug);
      setSourceType('YOUTUBE');
      setInputUrl(override.youtube_url);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filtered dropdown artists
  const filteredDropdownArtists = useMemo(() => {
    if (!artistSearch.trim()) return uniqueArtists;
    const q = artistSearch.toLowerCase().trim();
    return uniqueArtists.filter((a) => a.name.toLowerCase().includes(q) || a.slug.toLowerCase().includes(q));
  }, [uniqueArtists, artistSearch]);

  const existingOverrideForSelected = useMemo(() => {
    return overridesList.find((o) => o.artist_slug === selectedArtist?.slug);
  }, [overridesList, selectedArtist]);

  return (
    <div className="space-y-10">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-red-950/30 via-neutral-950 to-neutral-950 border border-neutral-800 p-6 md:p-8 rounded-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 rounded-sm">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">PRIORITY 1 SPOTLIGHT OVERRIDE ENGINE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
              ARTIST SPOTLIGHT <span className="text-red-600">VIDEO MANAGER</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono max-w-3xl leading-relaxed">
              Manually pin and publish verified YouTube or Cloudflare R2 visuals for public artists. Studio manual selections take highest priority over automatic YouTube Data API search and curated defaults on public artist profiles.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadOverrides();
                loadR2Videos();
              }}
              disabled={isLoadingOverrides || isLoadingR2Videos}
              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-300 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${(isLoadingOverrides || isLoadingR2Videos) ? 'animate-spin text-red-500' : ''}`} />
              REFRESH
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: ARTIST SELECTION + SOURCE SELECTOR + PUBLISH FORM (7 COLS) */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-800 p-6 md:p-8 space-y-6 rounded-sm shadow-2xl">
          
          {/* STEP 1: SELECT PUBLIC ARTIST */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 flex items-center justify-between">
              <span>1. SELECT PUBLIC ARTIST *</span>
              <span className="text-[10px] text-zinc-500 font-normal">192 VERIFIED PUBLIC ARTISTS</span>
            </label>

            {/* Custom Searchable Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-black border border-neutral-800 hover:border-neutral-700 focus:border-red-600 p-3.5 flex items-center justify-between text-left transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  {selectedArtist?.avatarUrl ? (
                    <div className="w-9 h-9 rounded-sm overflow-hidden bg-neutral-900 border border-neutral-800 relative flex-shrink-0">
                      <Image
                        src={selectedArtist.avatarUrl}
                        alt={selectedArtist.name}
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-sm bg-neutral-900 border border-neutral-800 flex items-center justify-center font-bold text-xs text-red-500">
                      WS
                    </div>
                  )}
                  <div>
                    <div className="font-hero font-bold text-white text-sm uppercase tracking-wide group-hover:text-red-500 transition-colors">
                      {selectedArtist?.name}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase">
                      SLUG: {selectedArtist?.slug}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {existingOverrideForSelected?.is_active && (
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 uppercase border ${
                      existingOverrideForSelected.video_type === 'R2'
                        ? 'text-amber-400 bg-amber-950/50 border-amber-500/30'
                        : 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'
                    }`}>
                      {existingOverrideForSelected.video_type === 'R2' ? 'R2 ACTIVE' : 'YOUTUBE ACTIVE'}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-40 bg-neutral-950 border border-neutral-800 shadow-2xl max-h-80 overflow-hidden flex flex-col">
                  <div className="p-2 border-b border-neutral-800 bg-black">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search artist name or slug..."
                        value={artistSearch}
                        onChange={(e) => setArtistSearch(e.target.value)}
                        autoFocus
                        className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-600 text-white font-mono text-xs pl-8 pr-3 py-2 outline-none"
                      />
                    </div>
                  </div>

                  <div className="overflow-y-auto divide-y divide-neutral-900">
                    {filteredDropdownArtists.map((artist) => {
                      const override = overridesList.find((o) => o.artist_slug === artist.slug && o.is_active);
                      return (
                        <button
                          key={artist.slug}
                          type="button"
                          onClick={() => {
                            setSelectedSlug(artist.slug);
                            setIsDropdownOpen(false);
                            setArtistSearch('');
                          }}
                          className={`w-full p-2.5 flex items-center justify-between text-left hover:bg-neutral-900 transition-colors cursor-pointer ${
                            artist.slug === selectedSlug ? 'bg-red-600/10 border-l-2 border-red-600' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {artist.avatarUrl && (
                              <div className="w-7 h-7 rounded-sm overflow-hidden bg-neutral-900 relative flex-shrink-0">
                                <Image
                                  src={artist.avatarUrl}
                                  alt={artist.name}
                                  fill
                                  className="object-cover"
                                  sizes="28px"
                                />
                              </div>
                            )}
                            <div>
                              <p className="text-xs font-bold text-white uppercase">{artist.name}</p>
                              <p className="text-[10px] font-mono text-zinc-500">{artist.slug}</p>
                            </div>
                          </div>

                          {override && (
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase border ${
                              override.video_type === 'R2'
                                ? 'text-amber-400 bg-amber-950/40 border-amber-500/30'
                                : 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30'
                            }`}>
                              {override.video_type === 'R2' ? 'R2 PINNED' : 'PINNED'}
                            </span>
                          )}
                        </button>
                      );
                    })}

                    {filteredDropdownArtists.length === 0 && (
                      <div className="p-4 text-center text-xs font-mono text-zinc-500">
                        NO MATCHING ARTISTS FOUND
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: CHOOSE SOURCE TYPE (YOUTUBE VS CLOUDFLARE R2) */}
          <div className="space-y-3 pt-3 border-t border-neutral-900">
            <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 block">
              2. SELECT SPOTLIGHT VISUAL SOURCE *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setSourceType('YOUTUBE');
                  setValidationError(null);
                }}
                className={`flex items-center justify-center gap-2.5 p-3.5 border font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[44px] ${
                  sourceType === 'YOUTUBE'
                    ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                    : 'bg-black text-zinc-400 hover:text-white border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <Youtube className="w-4 h-4 flex-shrink-0" />
                <span>YOUTUBE VIDEO</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSourceType('R2');
                  setValidationError(null);
                  if (r2VideosList.length === 0) loadR2Videos();
                }}
                className={`flex items-center justify-center gap-2.5 p-3.5 border font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer min-h-[44px] ${
                  sourceType === 'R2'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.4)]'
                    : 'bg-black text-zinc-400 hover:text-white border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <Film className="w-4 h-4 flex-shrink-0" />
                <span>CLOUDFLARE R2 ASSET</span>
              </button>
            </div>
          </div>

          {/* SOURCE A: YOUTUBE FLOW */}
          {sourceType === 'YOUTUBE' && (
            <div className="space-y-4">
              <form onSubmit={handleValidateVideo} className="space-y-4">
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 block mb-2">
                    YOUTUBE VIDEO URL OR 11-CHARACTER ID *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      required
                      placeholder="https://www.youtube.com/watch?v=... or 11-char ID"
                      value={inputUrl}
                      onChange={(e) => {
                        setInputUrl(e.target.value);
                        setValidationResult(null);
                        setValidationError(null);
                      }}
                      disabled={isValidating || isPublishing}
                      className="flex-1 bg-black border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 text-white font-mono text-xs sm:text-sm p-3.5 outline-none transition-all disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={isValidating || isPublishing || !inputUrl.trim()}
                      className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-mono text-xs font-bold uppercase tracking-wider px-5 py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    >
                      {isValidating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                          <span>VALIDATING...</span>
                        </>
                      ) : (
                        <>
                          <Youtube className="w-4 h-4 text-red-500" />
                          <span>VALIDATE</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 mt-1.5">
                    Accepts full YouTube watch URLs, youtu.be links, shorts, embed URLs, or raw 11-character video IDs.
                  </p>
                </div>

                {validationError && (
                  <div className="p-4 bg-red-950/30 border border-red-900 text-red-400 text-xs font-mono font-bold flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <span>{validationError}</span>
                  </div>
                )}
              </form>

              {/* YouTube Validation Result & Publish Button */}
              {validationResult && (
                <div className="p-5 bg-black border border-neutral-800 space-y-4 rounded-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-mono font-bold text-white uppercase">VALIDATION SUCCESSFUL</span>
                    </div>
                    {validationResult.matchConfidence === 'EXACT' ? (
                      <span className="text-[10px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5">
                        EXACT IDENTITY MATCH
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        CONFIRMATION REQUIRED
                      </span>
                    )}
                  </div>

                  {validationResult.matchConfidence === 'WARNING' && (
                    <div className="p-3.5 bg-amber-950/20 border border-amber-500/40 space-y-2.5 text-xs font-mono">
                      <p className="text-amber-300 leading-relaxed font-bold">
                        {validationResult.warningMessage}
                      </p>
                      <label className="flex items-start gap-2 pt-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={manualConfirmChecked}
                          onChange={(e) => setManualConfirmChecked(e.target.checked)}
                          className="w-4 h-4 accent-red-600 rounded mt-0.5 cursor-pointer"
                        />
                        <span className="text-white font-bold text-xs uppercase">
                          I confirm that this video is the authentic, intended visual for {selectedArtist?.name}.
                        </span>
                      </label>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-neutral-950 p-3.5 border border-neutral-900">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">VIDEO TITLE</span>
                      <span className="text-white font-bold truncate block">{validationResult.title}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">CHANNEL</span>
                      <span className="text-white font-bold truncate block">{validationResult.channelName}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">VIDEO ID</span>
                      <span className="text-red-400 font-bold">{validationResult.videoId}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">TARGET ARTIST</span>
                      <span className="text-white font-bold">{selectedArtist?.name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1 block">
                      Studio Admin Note (Internal Audit Log)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Official WorldStar premiere exclusive, verified by A&R team"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-white font-mono text-xs p-2.5 outline-none focus:border-red-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePublishYouTube}
                    disabled={
                      isPublishing ||
                      (validationResult.matchConfidence === 'WARNING' && !manualConfirmChecked)
                    }
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-mono font-black text-xs uppercase tracking-widest py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>PUBLISHING YOUTUBE SPOTLIGHT &amp; INVALIDATING CACHE...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {existingOverrideForSelected ? 'REPLACE & PUBLISH YOUTUBE VISUAL' : 'PUBLISH YOUTUBE VISUAL LIVE'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SOURCE B: CLOUDFLARE R2 FLOW */}
          {sourceType === 'R2' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 block">
                    CHOOSE CLOUDFLARE R2 VIDEO ASSET *
                  </label>
                  <p className="text-[10px] font-mono text-zinc-500">
                    Select an official video asset uploaded directly to WorldStar Cloudflare R2 storage.
                  </p>
                </div>

                <Link
                  href="/studio/videos?tab=CURATE_VIDEO"
                  className="text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 uppercase flex items-center gap-1 self-start sm:self-auto"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>UPLOAD NEW R2 VIDEO</span>
                </Link>
              </div>

              {/* R2 Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter uploaded R2 videos by title or artist..."
                  value={r2SearchQuery}
                  onChange={(e) => setR2SearchQuery(e.target.value)}
                  className="w-full bg-black border border-neutral-800 focus:border-amber-500 text-white font-mono text-xs pl-8 pr-3 py-2.5 outline-none"
                />
              </div>

              {/* R2 Videos Catalog Selector */}
              {isLoadingR2Videos ? (
                <div className="p-8 text-center text-zinc-500 font-mono space-y-2 border border-neutral-800 bg-black">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-amber-500" />
                  <p className="text-xs uppercase tracking-widest">Loading Cloudflare R2 video catalog...</p>
                </div>
              ) : filteredR2Videos.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-mono border border-neutral-800 bg-black space-y-3">
                  <Film className="w-8 h-8 text-zinc-600 mx-auto" />
                  <div>
                    <p className="text-xs font-bold uppercase text-zinc-400">NO CLOUDFLARE R2 VIDEOS FOUND</p>
                    <p className="text-[10px] text-zinc-600 max-w-sm mx-auto mt-1">
                      No video assets currently match your search. Use the &quot;Direct Cloudflare R2 Video Upload&quot; tab to upload video files directly from your computer.
                    </p>
                  </div>
                  <Link
                    href="/studio/videos?tab=CURATE_VIDEO"
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600/20 border border-amber-500/40 text-amber-400 text-xs font-mono font-bold uppercase hover:bg-amber-600/30 transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>GO TO DIRECT R2 UPLOAD</span>
                  </Link>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-2 border border-neutral-800 bg-black p-2 rounded-sm divide-y divide-neutral-900">
                  {filteredR2Videos.map((r2Video) => {
                    const isSelected = selectedR2VideoId === r2Video.id;
                    return (
                      <button
                        key={r2Video.id}
                        type="button"
                        onClick={() => setSelectedR2VideoId(r2Video.id)}
                        className={`w-full p-3 flex items-center justify-between text-left transition-all cursor-pointer rounded-sm ${
                          isSelected
                            ? 'bg-amber-950/30 border border-amber-500/60 shadow-[0_0_15px_rgba(217,119,6,0.15)]'
                            : 'hover:bg-neutral-900 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {r2Video.thumbnail_url ? (
                            <div className="w-12 h-8 rounded-sm overflow-hidden bg-neutral-900 border border-neutral-800 relative flex-shrink-0">
                              <Image
                                src={r2Video.thumbnail_url}
                                alt={r2Video.title}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-8 rounded-sm bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-500 flex-shrink-0">
                              <Film className="w-4 h-4" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white uppercase truncate">
                              {r2Video.title}
                            </p>
                            <p className="text-[10px] font-mono text-zinc-400 truncate">
                              {r2Video.artist_name || r2Video.channel_name || 'WorldStar Premiere'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <span className="text-[9px] font-mono text-zinc-500 hidden sm:inline">
                            {r2Video.created_at ? new Date(r2Video.created_at).toLocaleDateString() : ''}
                          </span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500 text-black'
                              : 'border-neutral-700 bg-transparent'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Selected R2 Asset Summary & Publish Action */}
              {selectedR2Video && (
                <div className="p-5 bg-black border border-amber-500/40 space-y-4 rounded-sm animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-mono font-bold text-white uppercase">
                        R2 ASSET READY FOR ASSIGNMENT
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5">
                      CLOUDFLARE R2
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono bg-neutral-950 p-3.5 border border-neutral-900">
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">ASSET TITLE</span>
                      <span className="text-white font-bold truncate block">{selectedR2Video.title}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 text-[10px] uppercase block">TARGET ARTIST</span>
                      <span className="text-amber-400 font-bold">{selectedArtist?.name}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="text-zinc-500 text-[10px] uppercase block">STREAM URL</span>
                      <span className="text-zinc-300 text-[10px] font-mono truncate block">
                        {selectedR2Video.video_url}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 mb-1 block">
                      Studio Admin Note (Internal Audit Log)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Official WorldStar Direct R2 Premiere, uploaded by Studio admin"
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 text-white font-mono text-xs p-2.5 outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePublishR2}
                    disabled={isPublishingR2}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-mono font-black text-xs uppercase tracking-widest py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_20px_rgba(217,119,6,0.3)] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    {isPublishingR2 ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>PUBLISHING R2 SPOTLIGHT VISUAL &amp; INVALIDATING CACHE...</span>
                      </>
                    ) : (
                      <>
                        <Film className="w-4 h-4" />
                        <span>
                          {existingOverrideForSelected
                            ? 'REPLACE & PUBLISH R2 SPOTLIGHT VISUAL'
                            : 'PUBLISH R2 SPOTLIGHT VISUAL LIVE'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* EXISTING OVERRIDE STATUS FOR THIS ARTIST */}
          {existingOverrideForSelected && (
            <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-400">EXISTING OVERRIDE:</span>
                  <span className={`font-bold uppercase ${existingOverrideForSelected.is_active ? 'text-emerald-400' : 'text-zinc-500'}`}>
                    {existingOverrideForSelected.is_active ? 'ACTIVE' : 'INACTIVE (UNPUBLISHED)'}
                  </span>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 border ${
                    existingOverrideForSelected.video_type === 'R2'
                      ? 'text-amber-400 border-amber-500/30 bg-amber-950/30'
                      : 'text-red-400 border-red-500/30 bg-red-950/30'
                  }`}>
                    {existingOverrideForSelected.video_type === 'R2' ? 'CLOUDFLARE R2' : 'YOUTUBE'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 truncate max-w-md">
                  {existingOverrideForSelected.title} (
                  {existingOverrideForSelected.video_type === 'R2'
                    ? 'R2 Direct Stream'
                    : existingOverrideForSelected.youtube_video_id}
                  )
                </p>
              </div>

              <div className="flex items-center gap-2">
                {existingOverrideForSelected.is_active ? (
                  <button
                    type="button"
                    onClick={() => handleUnpublish(selectedArtist.slug)}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-300 font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-zinc-400" />
                    UNPUBLISH
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleReactivateOverride(existingOverrideForSelected)}
                    disabled={isPending}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-300 font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    RE-ACTIVATE
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteOverride(selectedArtist.slug, selectedArtist.name)}
                  disabled={isPending}
                  className="px-3 py-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-900/60 text-red-400 font-mono text-xs uppercase font-bold tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 min-h-[44px]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  DELETE
                </button>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: INTERACTIVE PREVIEW & CURRENT STATUS (5 COLS) */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-800 p-6 space-y-6 rounded-sm">
          
          {/* Header */}
          <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-2">
              <Play className="w-4 h-4 text-red-600" />
              LIVE PREVIEW &amp; PROFILE STATUS
            </h4>
            <Link
              href={`/roster/${selectedArtist?.slug}`}
              target="_blank"
              className="text-[10px] font-mono font-bold text-red-500 hover:text-red-400 uppercase flex items-center gap-1"
            >
              <span>VIEW PUBLIC PROFILE</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Interactive 16:9 Video Player */}
          <div className="space-y-3">
            <div className="relative aspect-video w-full bg-black border border-neutral-800 rounded-sm overflow-hidden shadow-2xl">
              {sourceType === 'R2' && selectedR2Video ? (
                /* 1. Preview of newly selected R2 video */
                <video
                  key={selectedR2Video.video_url}
                  src={selectedR2Video.video_url}
                  poster={selectedR2Video.thumbnail_url || undefined}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain bg-black"
                />
              ) : sourceType === 'YOUTUBE' && validationResult?.videoId ? (
                /* 2. Preview of newly validated YouTube video */
                <iframe
                  src={`https://www.youtube.com/embed/${validationResult.videoId}?rel=0`}
                  title={validationResult.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : currentLive.loading ? (
                /* 3. Loading state */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 space-y-3 font-mono text-zinc-500">
                  <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                  <p className="text-xs uppercase tracking-wider">Resolving public video...</p>
                </div>
              ) : currentLive.status === 'MATCHED' && (currentLive.mediaType === 'r2' || (currentLive.videoUrl && !currentLive.videoId)) ? (
                /* 4. Currently active live R2 video on public profile */
                <video
                  key={currentLive.videoUrl!}
                  src={currentLive.videoUrl!}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain bg-black"
                />
              ) : currentLive.status === 'MATCHED' && currentLive.videoId ? (
                /* 5. Currently active live YouTube video on public profile */
                <iframe
                  src={`https://www.youtube.com/embed/${currentLive.videoId}?rel=0`}
                  title={currentLive.title || 'Current Public Visual'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                /* 6. Vault fallback placeholder */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 font-mono">
                  <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-zinc-600">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs uppercase font-bold text-zinc-400">NO ACTIVE SPOTLIGHT VIDEO</p>
                    <p className="text-[10px] text-zinc-600 max-w-xs mt-1">
                      Artist currently renders branded WorldStar Premiere Vault fallback.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Preview Info */}
            <div className="p-3 bg-black border border-neutral-900 space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500 uppercase">PREVIEWING:</span>
                <span className="text-white font-bold uppercase">
                  {sourceType === 'R2' && selectedR2Video
                    ? 'NEW R2 ASSET CANDIDATE (NOT YET SAVED)'
                    : validationResult
                    ? 'NEW YOUTUBE CANDIDATE (NOT YET SAVED)'
                    : currentLive.status === 'MATCHED'
                    ? `CURRENT PUBLIC PROFILE VISUAL (${currentLive.mediaType === 'r2' ? 'R2' : 'YOUTUBE'})`
                    : 'WORLDSTAR VAULT FALLBACK'}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500 uppercase">RESOLUTION SOURCE:</span>
                <span className="text-amber-400 font-bold uppercase">
                  {sourceType === 'R2' && selectedR2Video
                    ? 'CLOUDFLARE R2 SELECTION'
                    : validationResult
                    ? 'NEW YOUTUBE VALIDATION'
                    : currentLive.source || 'FALLBACK_NONE'}
                </span>
              </div>

              <div className="flex justify-between items-center text-[10px]">
                <span className="text-zinc-500 uppercase">TITLE:</span>
                <span className="text-zinc-300 font-bold truncate max-w-[220px]">
                  {sourceType === 'R2' && selectedR2Video
                    ? selectedR2Video.title
                    : validationResult?.title || currentLive.title || 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Resolution Priority Guide */}
          <div className="p-4 bg-neutral-900/40 border border-neutral-800/80 rounded-sm space-y-2.5 font-mono text-[11px]">
            <div className="flex items-center gap-1.5 text-zinc-300 font-bold uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 text-red-500" />
              <span>RESOLUTION HIERARCHY</span>
            </div>
            <ol className="space-y-1.5 text-zinc-400 list-decimal list-inside text-[10px]">
              <li className="text-white font-bold">1. Studio Manual Spotlight Override (YouTube or Cloudflare R2)</li>
              <li>2. Live YouTube Data API v3 (Newest relevant video)</li>
              <li>3. Curated Verified Catalog (119 verified mappings)</li>
              <li>4. Canonical Fallback Video</li>
              <li>5. WorldStar Premiere Vault Fallback</li>
            </ol>
          </div>

        </div>
      </div>

      {/* OVERRIDES DIRECTORY TABLE */}
      <div className="space-y-4 pt-6 border-t border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-red-600" />
              STUDIO SPOTLIGHT OVERRIDES DIRECTORY ({overridesList.length})
            </h3>
            <p className="text-xs font-mono text-zinc-500">
              Complete log of all manually published and archived spotlight video assignments (YouTube and Cloudflare R2).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter overrides..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="w-full bg-black border border-neutral-800 focus:border-red-600 text-white font-mono text-xs pl-8 pr-3 py-2 outline-none"
              />
            </div>
          </div>
        </div>

        {isLoadingOverrides ? (
          <div className="p-12 text-center text-zinc-500 font-mono space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-red-600" />
            <p className="text-xs uppercase tracking-widest">Loading studio overrides...</p>
          </div>
        ) : overridesList.length === 0 ? (
          <div className="p-12 text-center text-zinc-600 font-mono border border-neutral-900 bg-neutral-950 space-y-2">
            <p className="text-sm font-bold uppercase text-zinc-400">NO MANUAL OVERRIDES SAVED</p>
            <p className="text-xs">Select an artist above to assign your first manual spotlight video.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-neutral-800 bg-black">
            <table className="w-full text-left text-xs font-mono text-zinc-400">
              <thead className="text-[10px] text-zinc-400 uppercase bg-neutral-950 border-b border-neutral-800 tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Artist</th>
                  <th className="px-4 py-3.5">Video Title &amp; Channel</th>
                  <th className="px-4 py-3.5">Source / ID</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Confidence</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {overridesList
                  .filter((item) => {
                    if (!tableSearch.trim()) return true;
                    const q = tableSearch.toLowerCase().trim();
                    return (
                      item.artist_name.toLowerCase().includes(q) ||
                      item.artist_slug.toLowerCase().includes(q) ||
                      item.title.toLowerCase().includes(q) ||
                      (item.youtube_video_id && item.youtube_video_id.toLowerCase().includes(q)) ||
                      (item.video_type && item.video_type.toLowerCase().includes(q))
                    );
                  })
                  .map((override) => {
                    const isR2 = override.video_type === 'R2';
                    return (
                      <tr key={override.artist_slug} className="hover:bg-neutral-950/70 transition-colors">
                        {/* Type Badge */}
                        <td className="px-4 py-3.5">
                          {isR2 ? (
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase text-amber-400 bg-amber-950/40 border border-amber-500/30 flex items-center gap-1 w-fit">
                              <Film className="w-2.5 h-2.5" />
                              <span>R2</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[9px] font-bold uppercase text-red-400 bg-red-950/40 border border-red-500/30 flex items-center gap-1 w-fit">
                              <Youtube className="w-2.5 h-2.5" />
                              <span>YT</span>
                            </span>
                          )}
                        </td>

                        {/* Artist */}
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-white uppercase">{override.artist_name}</div>
                          <div className="text-[10px] text-zinc-500">{override.artist_slug}</div>
                        </td>

                        {/* Video Title & Channel */}
                        <td className="px-4 py-3.5 max-w-xs">
                          <div className="text-white font-bold truncate">{override.title}</div>
                          <div className="text-[10px] text-zinc-500 truncate">{override.channel_name}</div>
                        </td>

                        {/* Source / ID */}
                        <td className="px-4 py-3.5">
                          {isR2 ? (
                            <a
                              href={override.video_url || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold"
                            >
                              <span>R2 ASSET</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <a
                              href={override.youtube_url || `https://www.youtube.com/watch?v=${override.youtube_video_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-400 hover:text-red-300 flex items-center gap-1 font-bold"
                            >
                              <span>{override.youtube_video_id}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3.5">
                          {override.is_active ? (
                            <span className="text-[9px] font-bold uppercase text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5">
                              ACTIVE
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold uppercase text-zinc-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5">
                              INACTIVE
                            </span>
                          )}
                        </td>

                        {/* Confidence */}
                        <td className="px-4 py-3.5">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 border ${
                            override.match_confidence === 'EXACT'
                              ? 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20'
                              : 'text-amber-400 border-amber-500/20 bg-amber-950/20'
                          }`}>
                            {override.match_confidence || 'EXACT'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSlug(override.artist_slug);
                              if (override.video_type === 'R2') {
                                setSourceType('R2');
                                if (override.video_id) setSelectedR2VideoId(override.video_id);
                              } else {
                                setSourceType('YOUTUBE');
                                if (override.youtube_url) setInputUrl(override.youtube_url);
                              }
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-300 text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer min-h-[44px]"
                          >
                            SELECT
                          </button>

                          {override.is_active ? (
                            <button
                              type="button"
                              onClick={() => handleUnpublish(override.artist_slug)}
                              className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-400 hover:text-white text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer min-h-[44px]"
                            >
                              UNPUBLISH
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleReactivateOverride(override)}
                              className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-700 text-emerald-400 text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer min-h-[44px]"
                            >
                              ACTIVATE
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDeleteOverride(override.artist_slug, override.artist_name)}
                            className="p-1.5 text-red-500 hover:text-red-400 transition-colors cursor-pointer inline-flex items-center justify-center min-h-[44px] min-w-[44px]"
                            title="Delete Override"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
