'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Artist, StreamingPlatform } from '@/types';
import { Sparkles, Plus, Trash2, Save, Globe, ShieldCheck, Star, UserPlus, Upload, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function AdminCmsPage() {
  const { artists, updateArtist, createArtist, deleteArtist, uploadArtistImage } = useData();
  const { showToast } = useUI();

  const [formData, setFormData] = useState<Artist>(artists[0]);
  const [topSongsText, setTopSongsText] = useState<string>(formData?.topSongs?.join(', ') || '');
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingEpk, setIsUploadingEpk] = useState(false);

  const handleSelectArtist = (artist: Artist) => {
    setFormData(artist);
    setTopSongsText(artist.topSongs?.join(', ') || '');
    setIsCreatingNew(false);
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
      genres: ['Pop'],
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
      showToast('Artist profile photo uploaded to Supabase Storage!', 'success');
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
      showToast('Hero banner uploaded to Supabase Storage!', 'success');
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
      showToast('Digital Press Kit (EPK) uploaded to Supabase Storage!', 'success');
    } else {
      showToast('Failed to upload EPK document.', 'error');
    }
    setIsUploadingEpk(false);
  };

  const handleAddPlatform = () => {
    if (formData.streamingPlatforms.length >= 9) {
      showToast('Maximum 9 official platform links permitted per artist profile.', 'error');
      return;
    }
    const newPlatform: StreamingPlatform = {
      id: `sp-${Date.now()}`,
      name: 'Spotify',
      url: 'https://open.spotify.com',
    };
    setFormData(prev => ({
      ...prev,
      streamingPlatforms: [...prev.streamingPlatforms, newPlatform],
    }));
  };

  const handleRemovePlatform = (id: string) => {
    if (formData.streamingPlatforms.length <= 1) {
      showToast('Minimum 1 official link required per artist profile.', 'error');
      return;
    }
    setFormData(prev => ({
      ...prev,
      streamingPlatforms: prev.streamingPlatforms.filter(p => p.id !== id),
    }));
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
    const parsedSongs = topSongsText.split(',').map(s => s.trim()).filter(Boolean);
    const updatedData = { 
      ...formData, 
      topSongs: parsedSongs,
      biographyLastVerified: new Date().toISOString().split('T')[0]
    };

    if (isCreatingNew) {
      await createArtist(updatedData);
      showToast(`New Artist "${updatedData.name}" saved to Supabase!`, 'success');
      setIsCreatingNew(false);
    } else {
      await updateArtist(formData.id, updatedData);
      showToast(`CMS Update published to Supabase for ${formData.name}!`, 'success');
    }
  };

  const handleDeleteArtist = async () => {
    if (artists.length <= 1) {
      showToast('Cannot delete the last remaining artist.', 'error');
      return;
    }
    await deleteArtist(formData.id);
    showToast(`Artist deleted from Supabase.`, 'info');
    setFormData(artists[0]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-label uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTIVE ADMIN SYSTEM</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-hero font-extrabold text-white tracking-tight">
            SUPABASE CMS <span className="text-gold-gradient">MANAGER</span>
          </h1>
        </div>

        <button
          onClick={handleStartCreateNew}
          className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 min-h-[44px]"
        >
          <UserPlus className="w-4 h-4" />
          <span>CREATE NEW ARTIST</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Select Artist */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="font-display font-bold text-white text-lg">PUBLISHED ARTISTS ({artists.length})</h3>
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-2">
            {artists.map((art) => {
              const isSelected = !isCreatingNew && art.id === formData.id;
              return (
                <div
                  key={art.id}
                  onClick={() => handleSelectArtist(art)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'bg-gold/15 border border-gold/50 text-white'
                      : 'glass-panel border border-white/10 hover:border-gold/30 text-zinc-300'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={art.avatarUrl} alt={art.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-white text-base truncate">{art.name}</h4>
                    <span className="text-xs font-mono text-zinc-400">{art.countryFlag} {art.country}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Edit / Create Artist */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSaveArtist} className="glass-panel-gold rounded-3xl p-6 md:p-8 space-y-6 border border-gold/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-4">
              <h3 className="text-xl font-display font-bold text-white">
                {isCreatingNew ? 'CREATE NEW ARTIST PROFILE' : `EDIT ARTIST PROFILE: ${formData.name}`}
              </h3>
              <div className="flex items-center gap-3">
                {!isCreatingNew && (
                  <button
                    type="button"
                    onClick={handleDeleteArtist}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="submit"
                  className="btn-gold-luxury px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 min-h-[44px]"
                >
                  <Save className="w-4 h-4" />
                  <span>{isCreatingNew ? 'SAVE TO SUPABASE' : 'PUBLISH TO SUPABASE'}</span>
                </button>
              </div>
            </div>

            {/* Verification Metadata Box (Phase 9) */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-gold/30 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gold font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SOURCE ATTRIBUTION & VERIFICATION METADATA</span>
                </span>
                <span className="text-zinc-400">LAST VERIFIED: {formData.biographyLastVerified || '2026-07-21'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-zinc-400 block font-bold">VERIFICATION CONFIDENCE</label>
                  <select
                    value={formData.verificationConfidence || 'HIGH'}
                    onChange={(e) => handleInputChange('verificationConfidence', e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-obsidian border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                  >
                    <option value="HIGH">HIGH (3+ Primary Sources)</option>
                    <option value="MEDIUM">MEDIUM (2 Authoritative Sources)</option>
                    <option value="LOW">LOW (Unverified / Review Needed)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 block font-bold">VERIFICATION NOTES / SOURCES</label>
                  <input
                    type="text"
                    value={formData.verificationNotes || ''}
                    onChange={(e) => handleInputChange('verificationNotes', e.target.value)}
                    placeholder="Official Website, RIAA, Grammy Archives..."
                    className="w-full p-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            {/* Toggle Badges */}
            <div className="flex flex-wrap gap-4 border-b border-white/10 pb-4 font-mono text-xs">
              <label className="flex items-center gap-2 text-white cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={!!formData.isVerified}
                  onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>VERIFIED RECORDING ARTIST BADGE</span>
              </label>

              <label className="flex items-center gap-2 text-white cursor-pointer min-h-[44px]">
                <input
                  type="checkbox"
                  checked={!!formData.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                  className="w-4 h-4 accent-gold"
                />
                <Star className="w-4 h-4 text-gold" />
                <span>FEATURED ON HOMEPAGE</span>
              </label>
            </div>

            {/* Dynamic Metric Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-zinc-400 block font-bold">MONTHLY LISTENERS</label>
                <input
                  type="number"
                  value={formData.monthlyListeners}
                  onChange={(e) => handleInputChange('monthlyListeners', Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block font-bold">TOTAL GLOBAL STREAMS</label>
                <input
                  type="number"
                  value={formData.totalStreams}
                  onChange={(e) => handleInputChange('totalStreams', Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 block font-bold">GRAMMY WINS</label>
                <input
                  type="number"
                  value={formData.grammyWins}
                  onChange={(e) => handleInputChange('grammyWins', Number(e.target.value))}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-zinc-400 block font-bold">ARTIST STAGE NAME</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    handleInputChange('name', name);
                    handleInputChange('slug', slug);
                  }}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-zinc-400 block font-bold">COUNTRY</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                />
              </div>

              {/* Profile Image File Upload */}
              <div className="space-y-2">
                <label className="text-zinc-400 block font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-gold" />
                  <span>ARTIST PROFILE PHOTO (SUPABASE STORAGE)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                  />
                  <label className="btn-outline-luxury px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center flex-shrink-0 min-h-[44px]">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                  </label>
                </div>
                {isUploadingAvatar && <span className="text-[10px] font-mono text-gold animate-pulse">Uploading photo to Supabase Storage...</span>}
              </div>

              {/* Hero Banner File Upload */}
              <div className="space-y-2">
                <label className="text-zinc-400 block font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-gold" />
                  <span>HERO BANNER IMAGE (SUPABASE STORAGE)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.heroUrl}
                    onChange={(e) => handleInputChange('heroUrl', e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                  />
                  <label className="btn-outline-luxury px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center flex-shrink-0 min-h-[44px]">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" onChange={handleHeroFileUpload} className="hidden" />
                  </label>
                </div>
                {isUploadingHero && <span className="text-[10px] font-mono text-gold animate-pulse">Uploading banner to Supabase Storage...</span>}
              </div>

              {/* EPK PDF File Upload */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-zinc-400 block font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gold" />
                  <span>OFFICIAL DIGITAL PRESS KIT (EPK PDF DOCUMENT)</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.epkUrl || ''}
                    onChange={(e) => handleInputChange('epkUrl', e.target.value)}
                    placeholder="https://.../press-kit.pdf"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
                  />
                  <label className="btn-outline-luxury px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center flex-shrink-0 min-h-[44px]">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="application/pdf" onChange={handleEpkFileUpload} className="hidden" />
                  </label>
                </div>
                {isUploadingEpk && <span className="text-[10px] font-mono text-gold animate-pulse">Uploading EPK PDF to Supabase Storage...</span>}
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <label className="text-zinc-400 block font-bold">TOP SONGS & HIT ANTHEMS (COMMA SEPARATED)</label>
              <input
                type="text"
                value={topSongsText}
                onChange={(e) => setTopSongsText(e.target.value)}
                placeholder="Cruel Summer, Anti-Hero, Blank Space..."
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold min-h-[44px]"
              />
            </div>

            <div className="space-y-2 font-mono text-xs">
              <label className="text-zinc-400 block font-bold">EDITORIAL BIOGRAPHY</label>
              <textarea
                rows={5}
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold font-sans"
              />
            </div>

            {/* ⭐ Official Platform Links Manager */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-bold text-white text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gold" />
                  <span>OFFICIAL PLATFORM LINKS ({formData.streamingPlatforms.length})</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddPlatform}
                  className="px-3.5 py-2 rounded-xl bg-gold/15 text-gold border border-gold/30 text-xs font-mono font-bold flex items-center gap-1 hover:bg-gold/25 min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>ADD PLATFORM</span>
                </button>
              </div>

              <div className="space-y-3">
                {formData.streamingPlatforms.map((plat) => (
                  <div key={plat.id} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <select
                      value={plat.name}
                      onChange={(e) => handlePlatformChange(plat.id, 'name', e.target.value)}
                      className="p-2.5 rounded-lg bg-obsidian border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-gold min-h-[44px]"
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
                      className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-gold min-h-[44px]"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemovePlatform(plat.id)}
                      className="p-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
