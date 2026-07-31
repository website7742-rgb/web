'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Send, Sparkles, CheckCircle2, AlertCircle, User, Globe, Headphones, 
  PhoneCall, Calendar, Video, Music, Image as ImageIcon, Link2, Upload, 
  Loader2, ArrowRight, ArrowLeft, Terminal, ShieldCheck, Cpu, Radio, Activity
} from 'lucide-react';
import { Genre } from '@/types';
import { useUI } from '@/providers/UIContext';
import { useData } from '@/providers/DataContext';
import { uploadMediaAction } from '@/app/actions/uploadActions';

const GENRES: Genre[] = ['R&B', 'Hip-Hop', 'Electronic', 'Alternative', 'Afrobeats', 'Pop', 'Cinematic'];

const TERMINAL_LOGS = [
  "INITIALIZING AI A&R NEURAL PIPELINE...",
  "ENCRYPTING MEDIA & METADATA PAYLOAD...",
  "ANALYZING BPM & FREQUENCY SPECTRUM...",
  "UPLOADING HIGH-BITRATE ASSETS TO SUPABASE CLOUD...",
  "VERIFYING RLS STORAGE & IDENTITY POLICIES...",
  "DISPATCHING DEMO TO EXECUTIVE A&R COMMITTEE...",
  "TRANSMISSION SECURED & LOGGED LIVE."
];

export default function SubmitPage() {
  const { showToast } = useUI();
  const { addSubmission } = useData();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Terminal overlay sequence
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  // 3D Motion Card Tilt Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [4, -4]);
  const rotateY = useTransform(mouseX, [-300, 300], [-4, 4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const [formData, setFormData] = useState({
    fullName: '',
    stageName: '',
    email: '',
    phone: '',
    country: 'United States',
    city: 'Los Angeles',
    age: 22,
    genre: 'Hip-Hop' as Genre,
    experience: 'MID_CAREER' as 'EMERGING' | 'MID_CAREER' | 'ESTABLISHED',
    biography: '',
    spotifyUrl: '',
    appleUrl: '',
    youtubeUrl: '',
    videoUrl: '',
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

  // Terminal log cycling during submission or upload
  useEffect(() => {
    if (!isSubmitting && !isUploading) {
      setTerminalIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setTerminalIndex((prev) => (prev + 1) % TERMINAL_LOGS.length);
    }, 600);
    return () => clearInterval(interval);
  }, [isSubmitting, isUploading]);

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
    <div className="min-h-screen relative overflow-hidden bg-black text-white py-12 px-4 sm:px-6 lg:px-8 selection:bg-red-600 selection:text-white">
      {/* Dynamic Pulsing Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/30 via-black to-black pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" />

      {/* AI A&R TERMINAL OVERLAY */}
      <AnimatePresence>
        {(isSubmitting || isUploading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center space-y-6"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
              <Cpu className="w-10 h-10 text-red-500 animate-pulse" />
            </div>

            <div className="space-y-3 max-w-md w-full">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-600/40 text-red-500 font-mono text-xs font-bold uppercase tracking-widest">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>AI A&R OPERATING SYSTEM</span>
              </div>
              
              <p className="text-lg font-mono font-bold text-white tracking-wide">
                {TERMINAL_LOGS[terminalIndex]}
              </p>

              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-red-600 h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-xl">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STUDIO COMMAND CENTER • EXECUTIVE DEMO TRANSMISSION</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
            SUBMIT YOUR <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">DEMO &amp; MASTERS</span>
          </h1>

          {/* STEP INDICATORS */}
          <div className="flex items-center justify-center gap-3 pt-4">
            {[
              { id: 1, label: '1. IDENTIFY' },
              { id: 2, label: '2. DROP THE HEAT' },
              { id: 3, label: '3. TRANSMISSION' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setStep(s.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                  step === s.id
                    ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] scale-105'
                    : step > s.id
                    ? 'bg-red-950/60 text-red-400 border border-red-800/40'
                    : 'bg-white/[0.03] text-zinc-500 border border-white/10'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D TILT CONTAINER CARD */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Corner Accent */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="py-12 px-6 text-center space-y-8 max-w-lg mx-auto bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.2)] relative overflow-hidden"
            >
              {/* Glowing SVG Checkmark Path Animation */}
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-600/20 blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <svg className="w-24 h-24 text-red-500 relative z-10" viewBox="0 0 100 100" fill="none">
                  {/* Outer Glowing Ring */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  {/* Inner Drawn Checkmark */}
                  <motion.path
                    d="M30 52 L43 65 L70 35"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  />
                </svg>
              </div>

              {/* Holographic Studio Typography */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 font-mono text-[10px] font-bold uppercase tracking-widest">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>TRANSMISSION SECURED • ENCRYPTED</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight uppercase">
                  WELCOME TO THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">ROSTER</span>
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed max-w-sm mx-auto">
                  Your media is now in the hands of our A&amp;R Executive Team. We will review the frequencies shortly.
                </p>
              </div>

              {/* Reset Trigger */}
              <div className="pt-2">
                <button
                  onClick={() => { setIsSuccess(false); setStep(1); }}
                  className="px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-red-600 border border-white/10 hover:border-red-500 text-white font-mono font-bold uppercase tracking-widest shadow-xl hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] hover:scale-105 transition-all duration-300 text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>SUBMIT ANOTHER PROJECT</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* STEP 1: IDENTIFY */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                      <User className="w-5 h-5 text-red-500" />
                      <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">
                        STEP 1: ARTIST IDENTITY &amp; CONTACT
                      </h3>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold mb-2 block font-mono">Legal Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Elena Vance"
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white transition-all focus:bg-white/[0.05] focus:border-red-600/60 focus:ring-1 focus:ring-red-600/60 outline-none placeholder:text-zinc-600 text-sm font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold mb-2 block font-mono">Official Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="artist@management.com"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white transition-all focus:bg-white/[0.05] focus:border-red-600/60 focus:ring-1 focus:ring-red-600/60 outline-none placeholder:text-zinc-600 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold mb-2 block font-mono">WhatsApp / Phone *</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 019-2834"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white transition-all focus:bg-white/[0.05] focus:border-red-600/60 focus:ring-1 focus:ring-red-600/60 outline-none placeholder:text-zinc-600 text-sm font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold mb-2 block font-mono">Stage Name / Alias *</label>
                        <input
                          type="text"
                          required
                          value={formData.stageName}
                          onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                          placeholder="e.g. Aetheria"
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3.5 text-white transition-all focus:bg-white/[0.05] focus:border-red-600/60 focus:ring-1 focus:ring-red-600/60 outline-none placeholder:text-zinc-600 text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold mb-2 block font-mono">Primary Genre *</label>
                        <select
                          value={formData.genre}
                          onChange={(e) => setFormData({ ...formData, genre: e.target.value as Genre })}
                          className="w-full bg-zinc-950 border border-white/[0.08] rounded-xl px-4 py-3.5 text-white transition-all focus:border-red-600/60 focus:ring-1 focus:ring-red-600/60 outline-none text-sm"
                        >
                          {GENRES.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.fullName || !formData.email) {
                            showToast('Please fill out Name and Email.', 'error');
                            return;
                          }
                          setStep(2);
                        }}
                        className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:scale-105 transition-all text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <span>NEXT: DROP THE HEAT</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: DROP THE HEAT (DRAG & DROP MEDIA) */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                      <Upload className="w-5 h-5 text-red-500" />
                      <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">
                        STEP 2: DROP THE HEAT (DIRECT MEDIA UPLOAD)
                      </h3>
                    </div>

                    {/* DRAG & DROP ZONE */}
                    <div className="relative border-2 border-dashed border-red-600/30 hover:border-red-600 rounded-3xl p-8 text-center bg-red-950/10 transition-all duration-300 group shadow-inner">
                      <input
                        type="file"
                        accept="video/mp4,audio/mpeg,application/pdf,image/jpeg,image/png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          if (file.size > 50 * 1024 * 1024) {
                            showToast('File size exceeds 50MB maximum limit.', 'error');
                            return;
                          }

                          setUploadedFileName(file.name);
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
                                showToast(`SUCCESS! ${file.name} uploaded to Supabase Storage.`, 'success');
                                if (file.type.startsWith('audio/')) {
                                  setFormData(prev => ({ ...prev, audioUrl: res.data!.publicUrl }));
                                } else if (file.type.startsWith('video/')) {
                                  setFormData(prev => ({ ...prev, videoUrl: res.data!.publicUrl }));
                                } else if (file.type === 'application/pdf') {
                                  setFormData(prev => ({ ...prev, pressKitPdfUrl: res.data!.publicUrl }));
                                }
                              } else {
                                showToast(res.error || 'Upload failed.', 'error');
                              }
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={isUploading}
                      />

                      <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
                        <Upload className="w-12 h-12 text-red-500 group-hover:scale-110 transition-transform" />
                        
                        <div className="space-y-1">
                          <p className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                            DRAG &amp; DROP MASTER AUDIO / VIDEO OR <span className="text-red-500">BROWSE FILES</span>
                          </p>
                          <p className="text-xs font-mono text-zinc-500">
                            MP4 (50MB MAX) • MP3 (15MB MAX) • PDF (5MB MAX)
                          </p>
                        </div>

                        {/* AUDIO EQUALIZER MICRO-INTERACTION */}
                        {uploadedFileName && (
                          <div className="pt-3 flex items-center gap-3 bg-black/60 border border-red-600/40 px-4 py-2 rounded-full backdrop-blur-md">
                            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-zinc-300 truncate max-w-[200px]">
                              {uploadedFileName}
                            </span>
                            {/* Glowing Red EQ Bars */}
                            <div className="flex items-end gap-1 h-4">
                              <div className="w-1 bg-red-600 rounded-full h-full animate-[bounce_1s_infinite_100ms]" />
                              <div className="w-1 bg-red-500 rounded-full h-full animate-[bounce_1s_infinite_300ms]" />
                              <div className="w-1 bg-red-600 rounded-full h-full animate-[bounce_1s_infinite_200ms]" />
                              <div className="w-1 bg-rose-500 rounded-full h-full animate-[bounce_1s_infinite_400ms]" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* FALLBACK MEDIA URL INPUTS */}
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold mb-2 block font-mono">SoundCloud / MP3 Stream Link</label>
                        <input
                          type="url"
                          value={formData.audioUrl}
                          onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                          placeholder="https://soundcloud.com/..."
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white transition-all focus:border-red-600/60 outline-none text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold mb-2 block font-mono">Music Video / YouTube Link</label>
                        <input
                          type="url"
                          value={formData.youtubeUrl || formData.videoUrl}
                          onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value, videoUrl: e.target.value })}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white transition-all focus:border-red-600/60 outline-none text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>BACK</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-8 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold uppercase tracking-widest shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:scale-105 transition-all text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <span>NEXT: TRANSMISSION</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: TRANSMISSION */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                      <Send className="w-5 h-5 text-red-500" />
                      <h3 className="text-xl font-display font-bold text-white uppercase tracking-tight">
                        STEP 3: BIOGRAPHY &amp; TRANSMISSION
                      </h3>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold mb-2 block font-mono">Artist Biography &amp; Background</label>
                      <textarea
                        rows={3}
                        value={formData.biography}
                        onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                        placeholder="Share your musical background, recent accomplishments..."
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white transition-all focus:border-red-600/60 outline-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-[0.15em] text-zinc-400 font-semibold mb-2 block font-mono">Message to Executive A&amp;R Board</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Personal note regarding publishing goals..."
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white transition-all focus:border-red-600/60 outline-none text-sm"
                      />
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>BACK</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.6)] hover:scale-105 transition-all text-xs flex items-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>TRANSMIT DEMO TO EXECUTIVE BOARD</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
