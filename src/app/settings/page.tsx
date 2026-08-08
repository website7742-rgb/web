'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Globe, Music, Instagram, Twitter, Save, Loader2, ShieldCheck, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getProfileSettingsAction, updateProfileSettingsAction } from '@/app/actions/profileActions';
import { useUI } from '@/providers/UIContext';

export default function SettingsPage() {
  const { showToast } = useUI();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('USA');
  const [genre, setGenre] = useState('Hip-Hop');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    getProfileSettingsAction().then((res) => {
      setIsLoading(false);
      if (res.success && res.profile) {
        setEmail(res.profile.email || '');
        setFullName(res.profile.full_name || '');
        setBio(res.profile.bio || '');
        setCountry(res.profile.country || 'USA');
        setGenre(res.profile.genre || 'Hip-Hop');
        setInstagramUrl(res.profile.instagram_url || '');
        setTwitterUrl(res.profile.twitter_url || '');
      } else {
        setErrorMessage(res.error || 'Please sign in to view settings.');
      }
    });
  }, []);

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
    </div>
  );
}
