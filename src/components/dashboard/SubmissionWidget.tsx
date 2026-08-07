'use client';

import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { submitArtistTrackAction } from '@/app/actions/submissionActions';
import { useUI } from '@/providers/UIContext';

export default function SubmissionWidget() {
  const [trackTitle, setTrackTitle] = useState('');
  const [genre, setGenre] = useState('HIP HOP');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useUI();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackTitle || !audioFile) {
      showToast('Please fill out all required fields and attach an audio file.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('trackTitle', trackTitle);
      formData.append('genre', genre);
      formData.append('audioFile', audioFile);

      const res = await submitArtistTrackAction(formData);
      if (res.success) {
        showToast('Submission deployed! Confirmation email sent.', 'success');
        setTrackTitle('');
        setAudioFile(null);
      } else {
        showToast(res.error || 'Failed to deploy submission.', 'error');
      }
    } catch (err: any) {
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="lg:col-span-1 border border-neutral-800 bg-neutral-950 p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-5 h-5 text-red-600" />
        <h2 className="text-xl font-black uppercase text-white tracking-widest">SUBMIT TRACK</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Track Title</label>
          <input 
            type="text" 
            value={trackTitle}
            onChange={(e) => setTrackTitle(e.target.value)}
            required
            placeholder="e.g. STREET SYMPHONY" 
            disabled={isSubmitting}
            className="w-full bg-black border border-neutral-800 p-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-base disabled:opacity-50" 
          />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Genre</label>
          <select 
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-black border border-neutral-800 p-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-base appearance-none disabled:opacity-50"
          >
            <option value="HIP HOP">HIP HOP</option>
            <option value="R&B">R&B</option>
            <option value="TRAP">TRAP</option>
            <option value="DRILL">DRILL</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Audio File (.mp3, .wav)</label>
          <input 
            type="file" 
            accept="audio/*"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setAudioFile(e.target.files[0]);
              }
            }}
            required
            disabled={isSubmitting}
            className="w-full bg-black border border-neutral-800 p-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-base disabled:opacity-50 file:bg-red-600 file:text-white file:border-none file:px-4 file:py-2 file:text-base file:font-bold file:uppercase file:cursor-pointer file:mr-4 hover:file:bg-red-700" 
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-4 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span>DEPLOYING...</span>
              <Loader2 className="w-4 h-4 animate-spin" />
            </>
          ) : (
            <>
              <span>DEPLOY SUBMISSION</span>
              <Upload className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </section>
  );
}
