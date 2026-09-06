'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, Mail, Globe, Music, Instagram, Twitter, Save, Loader2, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2, Camera } from 'lucide-react';
import { getProfileSettingsAction, updateProfileSettingsAction } from '@/app/actions/profileActions';
import { ProfilePhotoCropModal } from '@/components/profile/ProfilePhotoCropModal';
import { useUI } from '@/providers/UIContext';

export default function SettingsPage() {
  const { showToast } = useUI();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('USA');
  const [genre, setGenre] = useState('Hip-Hop');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    getProfileSettingsAction().then((res) => {
      setIsLoading(false);
      if (res.success && res.profile) {
        setEmail(res.profile.email || '');
        setFullName(res.profile.full_name || '');
        setUsername(res.profile.username || '');
        setBio(res.profile.bio || '');
        setCountry(res.profile.country || 'USA');
        setGenre(res.profile.genre || 'Hip-Hop');
        setInstagramUrl(res.profile.instagram_url || '');
        setTwitterUrl(res.profile.twitter_url || '');
        setAvatarUrl(res.profile.avatar_url || null);
      } else {
        setErrorMessage(res.error || 'Please sign in to view settings.');
      }
    });
  }, []);

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('Image file size must be under 15MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImageForCrop(reader.result);
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.onerror = () => {
      showToast('Failed to read image file', 'error');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedAvatarUpload = async (croppedFile: File) => {
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', croppedFile);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.avatar_url) {
        const freshUrl = `${data.avatar_url}${data.avatar_url.includes('?') ? '&' : '?'}t=${Date.now()}`;
        // Preload image to prevent flicker
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = freshUrl;
        });

        setAvatarUrl(freshUrl);
        showToast('Profile picture updated successfully!', 'success');
        setSelectedImageForCrop(null);
      } else {
        showToast(data.error || 'Failed to upload profile picture', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error uploading cropped image', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }

    setIsSaving(true);
    const res = await updateProfileSettingsAction({
      full_name: fullName,
      username,
      bio,
      country,
      genre,
      instagram_url: instagramUrl,
      twitter_url: twitterUrl,
    });
    setIsSaving(false);

    if (res.success) {
      setSuccessMessage(res.message || 'Settings updated successfully!');
      showToast('Profile settings saved!', 'success');
    } else {
      setErrorMessage(res.error || 'Failed to update settings.');
      showToast(res.error || 'Update failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-white selection:text-black pb-24">
      {/* NAVBAR HEADER */}
      <nav className="border-b border-neutral-900 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <ShieldCheck className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
            <span className="font-bold tracking-widest uppercase text-lg">
              WORLDSTAR <span className="text-red-600">SETTINGS</span>
            </span>
          </Link>
          
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            DASHBOARD
          </Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2">
            PROFILE & ACCOUNT SETTINGS
          </h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Manage your artist identity, bio, and social channels.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <p className="text-xs font-mono uppercase tracking-widest">Loading credentials...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-neutral-950 border border-neutral-800 p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-rose-600 to-red-600" />

            {/* ERROR NOTIFICATION */}
            {errorMessage && (
              <div className="bg-red-600/10 border border-red-600/30 text-red-500 p-4 text-xs font-mono flex items-center gap-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* SUCCESS NOTIFICATION */}
            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 text-xs font-mono flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* AVATAR MANAGEMENT SECTION */}
            <div className="p-4 bg-neutral-900/60 border border-neutral-800 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarFileSelect}
                className="hidden"
                disabled={isUploadingAvatar}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative w-24 h-24 rounded-full bg-neutral-950 border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0 group cursor-pointer shadow-lg hover:border-red-500 transition-colors"
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt={fullName || 'Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-black text-red-500 font-sans">
                    {(fullName || 'WS').slice(0, 2).toUpperCase()}
                  </span>
                )}
                <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity ${
                  isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {isUploadingAvatar ? (
                    <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-300">
                    PROFILE PICTURE
                  </span>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-red-600/10 text-red-500 border border-red-600/20">
                    CLOUDFLARE R2
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-mono">
                  Upload and crop a high-resolution avatar. Supports JPG, PNG, WEBP, GIF up to 10MB.
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-red-600/50 text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Camera className="w-3.5 h-3.5 text-red-500" />
                    {isUploadingAvatar ? 'UPLOADING...' : 'CHANGE AVATAR'}
                  </button>
                  {avatarUrl && (
                    <Link
                      href="/profile"
                      className="text-xs font-mono text-zinc-400 hover:text-red-400 underline transition-colors"
                    >
                      VIEW PUBLIC PROFILE
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* EMAIL (READ ONLY) */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
                <Mail className="w-3 h-3 text-red-600" />
                Account Email (Read-Only)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-neutral-900/50 border border-neutral-800 text-zinc-500 px-4 py-3 text.sm font-mono cursor-not-allowed"
              />
            </div>

            {/* FULL NAME */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                <User className="w-3 h-3 text-red-600" />
                Artist / Display Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Young Icon"
                className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3.5 text-base focus:outline-none focus:border-red-600 font-mono transition-colors"
              />
            </div>

            {/* USERNAME */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                <User className="w-3 h-3 text-red-600" />
                Username / Handle
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-mono text-sm">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="artist_handle"
                  className="w-full bg-neutral-900 border border-neutral-800 text-white pl-9 pr-4 py-3.5 text-sm focus:outline-none focus:border-red-600 font-mono transition-colors"
                />
              </div>
            </div>

            {/* COUNTRY & GENRE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                  <Globe className="w-3 h-3 text-red-600" />
                  Country / Region
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="USA"
                  className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3.5 text-sm focus:outline-none focus:border-red-600 font-mono transition-colors uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2">
                  <Music className="w-3 h-3 text-red-600" />
                  Primary Genre
                </label>
                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="Hip-Hop"
                  className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3.5 text-sm focus:outline-none focus:border-red-600 font-mono transition-colors uppercase"
                />
              </div>
            </div>

            {/* BIO */}
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">
                Artist Bio & Headline
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your musical journey, discography highlights, or label affiliation..."
                className="w-full bg-neutral-900 border border-neutral-800 text-white p-4 text-sm focus:outline-none focus:border-red-600 font-mono transition-colors resize-none"
              />
            </div>

            {/* SOCIAL LINKS */}
            <div className="space-y-4 pt-4 border-t border-neutral-900">
              <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest">
                SOCIAL MEDIA CHANNELS
              </h3>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://instagram.com/artist"
                  className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-mono transition-colors"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2">
                  <Twitter className="w-3.5 h-3.5 text-blue-400" />
                  X / Twitter Profile URL
                </label>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  placeholder="https://x.com/artist"
                  className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-mono transition-colors"
                />
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)] mt-8"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SAVING CHANGES...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  SAVE PROFILE SETTINGS
                </>
              )}
            </button>
          </form>
        )}
      </main>

      {/* CROPPER MODAL OVERLAY */}
      {selectedImageForCrop && (
        <ProfilePhotoCropModal
          imageSrc={selectedImageForCrop}
          onClose={() => setSelectedImageForCrop(null)}
          onCropComplete={handleCroppedAvatarUpload}
        />
      )}
    </div>
  );
}
