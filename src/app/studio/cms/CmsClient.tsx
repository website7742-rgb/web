'use client';

import React, { useState, useTransition } from 'react';
import { Artist, StreamingPlatform } from '@/types';
import { Sparkles, Plus, Trash2, Save, Globe, ShieldCheck, Star, UserPlus, Upload, Image as ImageIcon, FileText, CheckCircle2, ChevronLeft, Search } from 'lucide-react';
import Image from 'next/image';
import { useUI } from '@/providers/UIContext';
import { useData } from '@/providers/DataContext';
import { addArtist, deleteArtist } from '@/actions/adminActions';
import { uploadArtistImage } from '@/lib/upload';

const FALLBACK_ARTIST: Artist = {
  id: 'new-artist-template',
  name: 'WorldStar Artist',
  slug: 'worldstar-artist',
  tagline: 'Recording Artist',
  bio: 'Official biography detailing releases and accolades...',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  heroUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
  genres: ['Hip-Hop'],
  country: 'United States',
  countryFlag: '🇺🇸',
  isVerified: true,
  isFeatured: false,
  labelStatus: 'SIGNED',
  monthlyListeners: 100000,
  totalStreams: 500000,
  grammyWins: 0,
  topSongs: ['Hit Track 1'],
  riaaCertifications: { platinum: 0, gold: 0, diamond: 0 },
  socials: {},
  streamingPlatforms: [
    { id: 'sp-1', name: 'Spotify', url: 'https://open.spotify.com' }
  ],
  biographyLastVerified: '2026-07-21',
  verificationConfidence: 'HIGH',
  verificationNotes: 'Verified via WorldStar Executive CMS.'
};

export default function AdminCmsClient({ initialArtists }: { initialArtists: Artist[] }) {
  const { showToast } = useUI();
  const { artists: contextArtists } = useData();
  const [isPending, startTransition] = useTransition();

  const actualArtists = (initialArtists && initialArtists.length > 0)
    ? initialArtists
    : (contextArtists && contextArtists.length > 0 ? contextArtists : [FALLBACK_ARTIST]);

  const [formData, setFormData] = useState<Artist>(() => actualArtists[0] || FALLBACK_ARTIST);
  const [topSongsText, setTopSongsText] = useState<string>(formData?.topSongs?.join(', ') || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingEpk, setIsUploadingEpk] = useState(false);
  const [searchArtistQuery, setSearchArtistQuery] = useState('');
  
  // Mobile tab state: on mobile (< lg), toggle between 'list' and 'editor'
  const [mobileView, setMobileView] = useState<'list' | 'editor'>('list');

  // Fallback safe reference so formData is guaranteed non-null
  const activeData = formData || actualArtists[0] || FALLBACK_ARTIST;

  const filteredList = actualArtists.filter(a =>
    a.name.toLowerCase().includes(searchArtistQuery.toLowerCase()) ||
    a.country.toLowerCase().includes(searchArtistQuery.toLowerCase())
  );

  const handleSelectArtist = (artist: Artist) => {
    setFormData(artist);
    setTopSongsText(artist.topSongs?.join(', ') || '');
    setIsCreatingNew(false);
    setMobileView('editor');
  };

  const handleStartCreateNew = () => {
    const newTemplate: Artist = {
      id: `art-${Date.now()}`,
      name: 'NEW RECORDING ARTIST',
      slug: `new-artist-${Date.now()}`,
      tagline: 'International Recording Artist',
      bio: 'Editorial biography detailing career accomplishments and publishing history...',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      heroUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
      genres: ['Hip-Hop'],
      country: 'United States',
      countryFlag: '🇺🇸',
      isVerified: true,
      isFeatured: false,
      labelStatus: 'SIGNED',
      monthlyListeners: 100000,
      totalStreams: 500000,
      grammyWins: 0,
      topSongs: ['Hit Single 1', 'Hit Single 2'],
      riaaCertifications: { platinum: 0, gold: 1, diamond: 0 },
      socials: {
        website: 'https://officialwebsite.com',
        spotify: 'https://open.spotify.com',
      },
      streamingPlatforms: [
        { id: `sp-${Date.now()}-1`, name: 'Official Website', url: 'https://officialwebsite.com' },
        { id: `sp-${Date.now()}-2`, name: 'Spotify', url: 'https://open.spotify.com' },
      ],
      biographyLastVerified: new Date().toISOString().split('T')[0],
      verificationConfidence: 'HIGH',
      verificationNotes: 'Verified via Executive Admin CMS.'
    };
    setFormData(newTemplate);
    setTopSongsText(newTemplate.topSongs?.join(', ') || '');
    setIsCreatingNew(true);
    setMobileView('editor');
  };

  const handleInputChange = (field: keyof Artist, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const uploadedUrl = await uploadArtistImage(file, 'avatars');
    if (uploadedUrl) {
      handleInputChange('avatarUrl', uploadedUrl);
      showToast('Artist profile photo uploaded to Cloudflare R2!', 'success');
    } else {
      showToast('Failed to upload image.', 'error');
    }
    setIsUploadingAvatar(false);
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHero(true);
    const uploadedUrl = await uploadArtistImage(file, 'banners');
    if (uploadedUrl) {
      handleInputChange('heroUrl', uploadedUrl);
      showToast('Hero banner uploaded to Cloudflare R2!', 'success');
    } else {
      showToast('Failed to upload banner.', 'error');
    }
    setIsUploadingHero(false);
  };

  const handleEpkFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingEpk(true);
    const uploadedUrl = await uploadArtistImage(file, 'documents');
    if (uploadedUrl) {
      handleInputChange('epkUrl', uploadedUrl);
      showToast('Digital Press Kit (EPK) uploaded to Cloudflare R2!', 'success');
    } else {
      showToast('Failed to upload EPK document.', 'error');
    }
    setIsUploadingEpk(false);
  };

  const handleAddPlatform = () => {
    const platforms = activeData.streamingPlatforms || [];
    if (platforms.length >= 9) {
      showToast('Maximum 9 official platform links permitted per artist profile.', 'error');
      return;
    }
    const newPlatform: StreamingPlatform = {
      id: `sp-${Date.now()}`,
      name: 'Spotify',
      url: 'https://open.spotify.com',
    };
    setFormData(prev => {
      const current = prev || activeData;
      return {
        ...current,
        streamingPlatforms: [...(current.streamingPlatforms || []), newPlatform],
      };
    });
  };

  const handleRemovePlatform = (id: string) => {
    const platforms = activeData.streamingPlatforms || [];
    if (platforms.length <= 1) {
      showToast('Minimum 1 official link required per artist profile.', 'error');
      return;
    }
    setFormData(prev => {
      const current = prev || activeData;
      return {
        ...current,
        streamingPlatforms: (current.streamingPlatforms || []).filter(p => p.id !== id),
      };
    });
  };

  const handlePlatformChange = (id: string, field: keyof StreamingPlatform, value: string) => {
    setFormData(prev => ({
      ...prev,
      streamingPlatforms: prev.streamingPlatforms.map(p => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      }),
    }));
  };

  const handleSaveArtist = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const parsedSongs = topSongsText.split(',').map(s => s.trim()).filter(Boolean);
        const updatedData = { 
          ...formData, 
          topSongs: parsedSongs,
          biographyLastVerified: new Date().toISOString().split('T')[0]
        };

        const formPayload = new FormData();
        formPayload.append('artistData', JSON.stringify(updatedData));

        const res = await addArtist(formPayload);
        
        if (res.success) {
          showToast(res.message || 'CMS Update published successfully!', 'success');
          setIsCreatingNew(false);
        } else {
          showToast(res.message || 'Failed to publish to Supabase.', 'error');
          if (res.errors) {
            console.error("Validation Errors:", res.errors);
          }
        }
      } catch (err) {
        showToast('Error saving to Supabase.', 'error');
      }
    });
  };

  const handleDeleteArtist = async () => {
    if (!activeData || !activeData.id) return;
    if (actualArtists.length <= 1) {
      showToast('Cannot delete the last remaining artist.', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${activeData.name}?`)) return;
    startTransition(async () => {
      const res = await deleteArtist(activeData.id);
      if (res.success) {
        showToast(`Artist deleted from database.`, 'info');
        const remaining = actualArtists.filter(a => a.id !== activeData.id);
        const nextArtist = remaining[0] || FALLBACK_ARTIST;
        setFormData(nextArtist);
        setTopSongsText(nextArtist.topSongs?.join(', ') || '');
        setMobileView('list');
      } else {
        showToast(res.message || 'Failed to delete artist.', 'error');
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono font-bold uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CONTENT MANAGEMENT SYSTEM</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
            EDITORIAL <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1">
            Author artist biographies, manage official social links, and publish verified editorial updates.
          </p>
        </div>

        <button
          onClick={handleStartCreateNew}
          className="px-5 sm:px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.35)] min-h-[44px] cursor-pointer transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>CREATE NEW PROFILE</span>
        </button>
      </div>

      {/* Mobile Mode Switcher (< lg) */}
      <div className="flex lg:hidden items-center p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
        <button
          onClick={() => setMobileView('list')}
          className={`flex-1 py-2.5 text-xs font-mono font-bold rounded-lg transition-all min-h-[40px] ${
            mobileView === 'list'
              ? 'bg-red-600 text-white shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          ARTIST DIRECTORY ({actualArtists.length})
        </button>
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2.5 text-xs font-mono font-bold rounded-lg transition-all min-h-[40px] ${
            mobileView === 'editor'
              ? 'bg-red-600 text-white shadow'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          {isCreatingNew ? 'NEW PROFILE' : `EDIT: ${formData?.name || 'PROFILE'}`}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Select Artist (Visible on desktop or when mobileView === 'list') */}
        <div className={`lg:col-span-4 space-y-4 ${mobileView === 'editor' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between">
            <h3 className="font-mono font-bold text-white text-xs sm:text-sm uppercase tracking-wider text-zinc-300">
              PUBLISHED PROFILES ({actualArtists.length})
            </h3>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or country..."
              value={searchArtistQuery}
              onChange={(e) => setSearchArtistQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black border border-zinc-800 rounded-xl text-white font-sans text-xs focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
            {filteredList.map((art) => {
              const isSelected = !isCreatingNew && art.id === activeData.id;
              return (
                <div
                  key={art.id}
                  onClick={() => handleSelectArtist(art)}
                  className={`p-3 sm:p-4 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                    isSelected
                      ? 'bg-red-600/15 border-red-500/60 text-white shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                      : 'bg-zinc-950/80 border-zinc-800/80 hover:border-red-500/30 text-zinc-300'
                  }`}
                >
                  <Image src={art.avatarUrl} alt={art.name} width={44} height={44} className="w-11 h-11 rounded-lg object-cover border border-zinc-800 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-sm truncate">{art.name}</h4>
                    <span className="text-[11px] font-mono text-zinc-400">{art.country}</span>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Edit / Create Artist Form (Visible on desktop or when mobileView === 'editor') */}
        <div className={`lg:col-span-8 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          <form onSubmit={handleSaveArtist} className="bg-zinc-950/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-6 border border-zinc-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
              <div>
                {/* Back to list button on mobile */}
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className="lg:hidden inline-flex items-center gap-1 text-xs font-mono text-red-400 hover:text-red-300 mb-2 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Artist Directory</span>
                </button>
                <h3 className="text-base sm:text-xl font-display font-black text-white uppercase tracking-tight">
                  {isCreatingNew ? 'CREATE NEW ARTIST PROFILE' : `EDIT: ${activeData.name}`}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {!isCreatingNew && (
                  <button
                    type="button"
                    onClick={handleDeleteArtist}
                    disabled={isPending}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 min-h-[44px] min-w-[44px] flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    title="Delete Artist Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50 shadow-[0_0_15px_rgba(220,38,38,0.35)] cursor-pointer transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>{isPending ? 'PROCESSING...' : 'PUBLISH CHANGES'}</span>
                </button>
              </div>
            </div>

            {/* Verification Metadata Box */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/60 border border-red-600/30 space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-red-400 font-bold flex items-center gap-1.5 uppercase text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>EDITORIAL ATTRIBUTION &amp; VERIFICATION</span>
                </span>
                <span className="text-zinc-500 text-[10px]">VERIFIED: {activeData.biographyLastVerified || '2026-07-21'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 block font-bold text-[10px] uppercase">CONFIDENCE LEVEL</label>
                  <select
                    value={activeData.verificationConfidence || 'HIGH'}
                    onChange={(e) => handleInputChange('verificationConfidence', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                  >
                    <option value="HIGH">HIGH (3+ Primary Sources)</option>
                    <option value="MEDIUM">MEDIUM (2 Authoritative Sources)</option>
                    <option value="LOW">LOW (Unverified / Review Needed)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block font-bold text-[10px] uppercase">SOURCES / VERIFICATION NOTES</label>
                  <input
                    type="text"
                    value={activeData.verificationNotes || ''}
                    onChange={(e) => handleInputChange('verificationNotes', e.target.value)}
                    placeholder="Official Website, RIAA, Grammy Archives..."
                    className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            {/* Badges toggles */}
            <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4 font-mono text-xs">
              <label className="flex items-center gap-2 text-white cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={!!activeData.isVerified}
                  onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                  className="w-4 h-4 accent-red-600"
                />
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>VERIFIED BADGE</span>
              </label>

              <label className="flex items-center gap-2 text-white cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={!!activeData.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="w-4 h-4 accent-red-600"
                />
                <Star className="w-4 h-4 text-red-500" />
                <span>FEATURED ON HOMEPAGE</span>
              </label>
            </div>

            {/* Dynamic Metric Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 block font-bold text-[10px] uppercase">MONTHLY LISTENERS</label>
                <input
                  type="number"
                  value={activeData.monthlyListeners}
                  onChange={(e) => handleInputChange('monthlyListeners', Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block font-bold text-[10px] uppercase">GLOBAL STREAMS</label>
                <input
                  type="number"
                  value={activeData.totalStreams}
                  onChange={(e) => handleInputChange('totalStreams', Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block font-bold text-[10px] uppercase">GRAMMY WINS</label>
                <input
                  type="number"
                  value={activeData.grammyWins}
                  onChange={(e) => handleInputChange('grammyWins', Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-400 block font-bold text-[10px] uppercase">ARTIST STAGE NAME</label>
                <input
                  type="text"
                  value={activeData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    handleInputChange('name', name);
                    handleInputChange('slug', slug);
                  }}
                  className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 block font-bold text-[10px] uppercase">ORIGIN / COUNTRY</label>
                <input
                  type="text"
                  value={activeData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                />
              </div>

              {/* Profile Image File Upload */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 block font-bold flex items-center gap-1.5 text-[10px] uppercase">
                  <ImageIcon className="w-3.5 h-3.5 text-red-500" />
                  <span>PROFILE PHOTO URL (CLOUDFLARE R2)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activeData.avatarUrl}
                    onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                    className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                  />
                  <label className={`px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center flex-shrink-0 min-h-[44px] bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white ${isUploadingAvatar ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleAvatarFileUpload} disabled={isUploadingAvatar || isPending} className="hidden" />
                  </label>
                </div>
                {isUploadingAvatar && <span className="text-[10px] font-mono text-red-400 animate-pulse">Streaming photo to Cloudflare R2...</span>}
              </div>

              {/* Hero Banner File Upload */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 block font-bold flex items-center gap-1.5 text-[10px] uppercase">
                  <ImageIcon className="w-3.5 h-3.5 text-red-500" />
                  <span>HERO BANNER URL (CLOUDFLARE R2)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activeData.heroUrl}
                    onChange={(e) => handleInputChange('heroUrl', e.target.value)}
                    className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                  />
                  <label className={`px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center flex-shrink-0 min-h-[44px] bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white ${isUploadingHero ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleHeroFileUpload} disabled={isUploadingHero || isPending} className="hidden" />
                  </label>
                </div>
                {isUploadingHero && <span className="text-[10px] font-mono text-red-400 animate-pulse">Streaming banner to Cloudflare R2...</span>}
              </div>

              {/* EPK PDF File Upload */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-zinc-400 block font-bold flex items-center gap-1.5 text-[10px] uppercase">
                  <FileText className="w-3.5 h-3.5 text-red-500" />
                  <span>DIGITAL PRESS KIT (EPK PDF DOCUMENT)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={activeData.epkUrl || ''}
                    onChange={(e) => handleInputChange('epkUrl', e.target.value)}
                    placeholder="https://.../press-kit.pdf"
                    className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
                  />
                  <label className={`px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center flex-shrink-0 min-h-[44px] bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white ${isUploadingEpk ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="application/pdf" onChange={handleEpkFileUpload} disabled={isUploadingEpk || isPending} className="hidden" />
                  </label>
                </div>
                {isUploadingEpk && <span className="text-[10px] font-mono text-red-400 animate-pulse">Streaming EPK PDF to Cloudflare R2...</span>}
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 block font-bold text-[10px] uppercase">TOP SONGS &amp; ANTHEMS (COMMA SEPARATED)</label>
              <input
                type="text"
                value={topSongsText}
                onChange={(e) => setTopSongsText(e.target.value)}
                placeholder="Song 1, Song 2, Song 3..."
                className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-zinc-400 block font-bold text-[10px] uppercase">EDITORIAL BIOGRAPHY</label>
              <textarea
                rows={5}
                value={activeData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full p-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-red-600 font-sans text-xs sm:text-sm"
              />
            </div>

            {/* Official Platform Links Manager */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-mono font-bold text-white text-xs sm:text-sm flex items-center gap-2 uppercase tracking-wider">
                  <Globe className="w-4 h-4 text-red-500" />
                  <span>OFFICIAL PLATFORM LINKS ({(activeData?.streamingPlatforms || []).length})</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddPlatform}
                  className="px-3.5 py-2 rounded-xl bg-red-600/15 text-red-400 border border-red-500/30 text-xs font-mono font-bold flex items-center gap-1 hover:bg-red-600/25 min-h-[40px] cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD LINK</span>
                </button>
              </div>

              <div className="space-y-3">
                {(activeData?.streamingPlatforms || []).map((plat) => (
                  <div key={plat.id} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3 rounded-xl bg-black border border-zinc-800">
                    <select
                      value={plat.name}
                      onChange={(e) => handlePlatformChange(plat.id, 'name', e.target.value)}
                      className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 min-h-[44px]"
                    >
                      <option value="Official Website">Official Website</option>
                      <option value="Spotify">Spotify</option>
                      <option value="Apple Music">Apple Music</option>
                      <option value="YouTube">YouTube</option>
                      <option value="SoundCloud">SoundCloud</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Instagram">Instagram</option>
                      <option value="X (Twitter)">X (Twitter)</option>
                      <option value="Facebook">Facebook</option>
                    </select>

                    <input
                      type="url"
                      value={plat.url}
                      onChange={(e) => handlePlatformChange(plat.id, 'url', e.target.value)}
                      placeholder="Official URL..."
                      className="w-full p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-red-600 min-h-[44px]"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePlatform(plat.id)}
                      className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                      title="Remove platform link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
