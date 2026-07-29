'use client';

import React, { useState } from 'react';
import { Send, Upload, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, Music, FileText, Globe, User, Headphones } from 'lucide-react';
import { Genre } from '@/types';
import { useUI } from '@/providers/UIContext';
import { useData } from '@/providers/DataContext';

const GENRES: Genre[] = ['R&B', 'Hip-Hop', 'Electronic', 'Alternative', 'Afrobeats', 'Pop', 'Cinematic'];

export default function SubmitPage() {
  const { showToast } = useUI();
  const { addSubmission } = useData();

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [formData, setFormData] = useState({
    fullName: '',
    stageName: '',
    email: '',
    phone: '',
    country: 'United Kingdom',
    city: 'London',
    age: 22,
    genre: 'R&B' as Genre,
    experience: 'MID_CAREER' as 'EMERGING' | 'MID_CAREER' | 'ESTABLISHED',
    biography: '',
    spotifyUrl: '',
    appleUrl: '',
    youtubeUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    soundcloudUrl: '',
    websiteUrl: '',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    coverImageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800',
    pressKitPdfUrl: '',
    additionalFilesUrl: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/demo-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to submit demo');
      }

      // Add to reactive DataContext pipeline
      addSubmission(formData);

      setIsSuccess(true);
      showToast('Master submission received! Sent to Executive A&R Pipeline.', 'success');
    } catch (err: any) {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        setErrorMessage('No Internet Connection. Please check your network and try again.');
        showToast('No Internet Connection', 'error');
      } else {
        setErrorMessage(err.message || 'An unexpected error occurred.');
        showToast(err.message || 'Submission failed.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AETHERIA GLOBAL TALENT & PUBLISHING SUBMISSION PORTAL</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
          SUBMIT YOUR <span className="text-gold-gradient">MASTERS</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto">
          Direct executive submission to our A&R publishing committees in London, Los Angeles, and Tokyo.
        </p>
      </div>

      {/* Step Wizard Indicator */}
      <div className="flex items-center justify-center gap-4 border-b border-white/10 pb-6 font-mono text-xs">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            step === 1 ? 'bg-gold text-obsidian font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-zinc-500 hover:text-white'
          } disabled:bg-zinc-800/50 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:border-transparent`}
        >
          <User className="w-4 h-4" aria-hidden="true" />
          <span>1. IDENTITY & METRICS</span>
        </button>
        <span className="text-zinc-700">â€¢</span>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => setStep(2)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            step === 2 ? 'bg-gold text-obsidian font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-zinc-500 hover:text-white'
          } disabled:bg-zinc-800/50 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:border-transparent`}
        >
          <Globe className="w-4 h-4" aria-hidden="true" />
          <span>2. BIO & SOCIAL PROFILES</span>
        </button>
        <span className="text-zinc-700">â€¢</span>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => setStep(3)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            step === 3 ? 'bg-gold text-obsidian font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'text-zinc-500 hover:text-white'
          } disabled:bg-zinc-800/50 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:border-transparent`}
        >
          <Headphones className="w-4 h-4" aria-hidden="true" />
          <span>3. AUDIO DEMO & PRESS KIT</span>
        </button>
      </div>

      {/* Form Container */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-12 border border-white/10 shadow-2xl relative">
        {isSuccess ? (
          <div className="py-16 text-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-gold mx-auto animate-bounce" />
            <h2 className="text-3xl font-display font-bold text-white">SUBMISSION LOGGED TO A&R QUEUE</h2>
            <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
              Your master demo for &quot;{formData.stageName}&quot; has been assigned to our Executive Review Board. You will receive a direct response within 5 business days.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setStep(1);
              }}
              className="px-8 py-3.5 rounded-xl bg-gold text-obsidian font-display font-bold text-xs tracking-wider hover:bg-gold-light transition-all"
            >
              SUBMIT ANOTHER MASTER
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: IDENTITY */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-white border-b border-white/10 pb-3">
                  ARTIST IDENTITY & LOCATION
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider block">Legal Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Elena Vance"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider block">Stage Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.stageName}
                      onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                      placeholder="e.g. AURORA NOVA"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider block">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="artist@management.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider block">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+44 7700 900077"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider block">Country *</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="e.g. United Kingdom"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider block">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. London"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider block">Age *</label>
                    <input
                      type="number"
                      required
                      min={16}
                      max={100}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 22 })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-gold text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider block">Primary Genre *</label>
                    <select
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value as Genre })}
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-light border border-white/10 text-white focus:outline-none focus:border-gold text-sm"
                    >
                      {GENRES.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-gold uppercase tracking-wider block">Career Experience *</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl bg-obsidian-light border border-white/10 text-white focus:outline-none focus:border-gold text-sm"
                    >
                      <option value="EMERGING">EMERGING (&lt; 100K Streams)</option>
                      <option value="MID_CAREER">MID-CAREER (100K â€“ 5M Streams)</option>
                      <option value="ESTABLISHED">ESTABLISHED (&gt; 5M Streams)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full py-4 rounded-xl bg-gold text-obsidian font-display font-bold text-sm tracking-wider hover:bg-gold-light transition-all"
                >
                  NEXT: BIOGRAPHY & PROFILES â†’
                </button>
              </div>
            )}

            {/* STEP 2: BIO & LINKS */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-white border-b border-white/10 pb-3">
                  BIOGRAPHY & STREAMING LINKS
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase tracking-wider block">Artist Biography & Achievements *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.biography}
                    onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                    placeholder="Detail past label releases, management, awards, live show experience..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Spotify Artist URL</label>
                    <input
                      type="url"
                      value={formData.spotifyUrl}
                      onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                      placeholder="https://open.spotify.com/artist/..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Apple Music URL</label>
                    <input
                      type="url"
                      value={formData.appleUrl}
                      onChange={(e) => setFormData({ ...formData, appleUrl: e.target.value })}
                      placeholder="https://music.apple.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                      placeholder="https://youtube.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Instagram Handle / URL</label>
                    <input
                      type="url"
                      value={formData.instagramUrl}
                      onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-4">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setStep(1)}
                    className="py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:border-transparent"
                  >
                    â† BACK
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="py-4 px-8 rounded-xl bg-gold text-obsidian font-display font-bold text-sm tracking-wider hover:bg-gold-light transition-all flex-1"
                  >
                    NEXT: AUDIO DEMO & PRESS KIT â†’
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: AUDIO DEMO & ASSETS */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-display font-bold text-white border-b border-white/10 pb-3">
                  AUDIO DEMO & MASTER ASSETS
                </h3>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase tracking-wider block">Demo Audio Stream / File URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.audioUrl}
                    onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                    placeholder="https://soundcloud.com/private-track or direct .mp3 link"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Cover Artwork URL</label>
                    <input
                      type="url"
                      value={formData.coverImageUrl}
                      onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block">Press Kit (PDF) URL</label>
                    <input
                      type="url"
                      value={formData.pressKitPdfUrl}
                      onChange={(e) => setFormData({ ...formData, pressKitPdfUrl: e.target.value })}
                      placeholder="https://drive.google.com/presskit.pdf"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-gold uppercase tracking-wider block">Message to Executive A&R Board</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Personal note regarding publishing goals..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-4">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setStep(2)}
                    className="py-4 px-6 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:border-transparent"
                  >
                    â† BACK
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-4 px-8 rounded-xl bg-gold text-obsidian font-display font-bold text-sm tracking-wider hover:bg-gold-light transition-all flex-1 flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-obsidian border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SUBMIT MASTER TO EXECUTIVE BOARD</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
