'use client';

import React, { useState } from 'react';
import { Send, Upload, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, Music } from 'lucide-react';
import { Genre } from '@/types';
import { useUI } from '@/providers/UIContext';

const GENRES: Genre[] = ['R&B', 'Hip-Hop', 'Electronic', 'Alternative', 'Afrobeats', 'Pop', 'Cinematic'];

export default function DemoSubmissionPage() {
  const { showToast } = useUI();
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    trackTitle: '',
    genre: 'R&B' as Genre,
    audioUrl: '',
    bioNotes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

      setIsSuccess(true);
      showToast('Demo submitted successfully to A&R executive board!', 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
      showToast(err.message || 'Submission failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest">
          <Send className="w-3.5 h-3.5" />
          <span>GLOBAL A&R PUBLISHING PORTAL</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
          JOIN THE <span className="text-gold-gradient">LEGACY</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto">
          Submit your original master recordings directly to our executive A&R committee in London, Los Angeles, and Tokyo.
        </p>
      </div>

      {/* Form Container */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-12 border border-white/10 shadow-2xl relative">
        {isSuccess ? (
          <div className="py-16 text-center space-y-6">
            <CheckCircle2 className="w-20 h-20 text-gold mx-auto animate-bounce" />
            <h2 className="text-3xl font-display font-bold text-white">DEMO UNDER REVIEW</h2>
            <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
              Your master track &quot;{formData.trackTitle}&quot; has been logged into our executive A&R queue. Our talent scouts will review your submission within 5 business days.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({ artistName: '', email: '', trackTitle: '', genre: 'R&B', audioUrl: '', bioNotes: '' });
              }}
              className="px-8 py-3.5 rounded-xl bg-gold text-obsidian font-display font-bold text-xs tracking-wider hover:bg-gold-light transition-all"
            >
              SUBMIT ANOTHER TRACK
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Artist Name */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gold uppercase tracking-wider block">Artist / Group Name *</label>
                <input
                  type="text"
                  required
                  value={formData.artistName}
                  onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
                  placeholder="e.g. Vespera"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gold uppercase tracking-wider block">Official Contact Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="artist@management.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Track Title */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gold uppercase tracking-wider block">Master Track Title *</label>
                <input
                  type="text"
                  required
                  value={formData.trackTitle}
                  onChange={(e) => setFormData({ ...formData, trackTitle: e.target.value })}
                  placeholder="e.g. Midnight Frequency"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
                />
              </div>

              {/* Primary Genre */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gold uppercase tracking-wider block">Primary Genre *</label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value as Genre })}
                  className="w-full px-4 py-3 rounded-xl bg-obsidian-light border border-white/10 text-white focus:outline-none focus:border-gold text-sm"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Audio Stream Link */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gold uppercase tracking-wider block">
                Streaming Audio Link (SoundCloud, Private Drive, Dropbox, MP3 URL) *
              </label>
              <input
                type="url"
                required
                value={formData.audioUrl}
                onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                placeholder="https://soundcloud.com/your-artist/private-track"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm font-mono"
              />
            </div>

            {/* Artist Bio Notes */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-gold uppercase tracking-wider block">
                Executive Summary / Career Achievements (Optional)
              </label>
              <textarea
                rows={4}
                value={formData.bioNotes}
                onChange={(e) => setFormData({ ...formData, bioNotes: e.target.value })}
                placeholder="Detail monthly streams, past label releases, management team, or press coverage..."
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 !bg-white !text-black !rounded-none !border-none font-extrabold text-xs uppercase tracking-[0.2em] hover:!bg-zinc-200 transition-all flex items-center justify-center gap-2 transform-gpu active:scale-95 cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4 !text-black" />
                  <span>SUBMIT DEMO TO EXECUTIVE A&R</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-500 pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>STRICT CONFIDENTIALITY & ARTIST IP OWNERSHIP GUARANTEED</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
