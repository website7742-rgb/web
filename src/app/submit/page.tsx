'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Sparkles, CheckCircle2, AlertCircle, User, Globe, Headphones, 
  Mail, Phone, Music2, Share2, Upload, Loader2, ArrowRight, ArrowLeft, 
  ShieldCheck, Cpu, Radio, Activity, Lock, Check, FileAudio, Youtube, Instagram, MapPin
} from 'lucide-react';
import { Genre } from '@/types';
import { useUI } from '@/providers/UIContext';
import { useData } from '@/providers/DataContext';
import { uploadMediaAction } from '@/app/actions/uploadActions';

const GENRES: Genre[] = ['R&B', 'Hip-Hop', 'Electronic', 'Alternative', 'Afrobeats', 'Pop', 'Cinematic'];

const TERMINAL_LOGS = [
  "INITIALIZING SECURE A&R TRANSMISSION...",
  "ENCRYPTING MEDIA & METADATA PAYLOAD...",
  "ANALYZING BPM & AUDIO FREQUENCY SPECTRUM...",
  "UPLOADING HIGH-BITRATE ASSETS TO CLOUD STORAGE...",
  "VERIFYING RLS & IDENTITY POLICIES...",
  "DISPATCHING DEMO TO EXECUTIVE A&R COMMITTEE...",
  "TRANSMISSION SECURED & LOGGED LIVE."
];

export default function SubmitDemoPage() {
  const { showToast } = useUI();
  const { addSubmission } = useData();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [terminalIndex, setTerminalIndex] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

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
    audioUrl: '',
    coverImageUrl: '',
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

  const stepLabels = [
    { id: 1, label: 'Artist Info', icon: <User className="w-3.5 h-3.5" /> },
    { id: 2, label: 'Upload Track', icon: <FileAudio className="w-3.5 h-3.5" /> },
    { id: 3, label: 'Socials', icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: 4, label: 'Submit', icon: <Send className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#090909] text-white py-12 px-4 sm:px-6 lg:px-8 selection:bg-red-600 selection:text-white">
      {/* 1. Subtle, slow ambient gradient pulse background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/20 via-[#090909] to-[#090909] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none z-0 animate-pulse transform-gpu" />

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
                <span>AI A&R TRANSMISSION ENGINE</span>
              </div>
              
              <p className="text-base font-mono font-bold text-white tracking-wide">
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
            <span>GLOBAL A&R SUBMISSION PORTAL</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
            SUBMIT YOUR <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">MASTER DEMO</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 font-mono tracking-wide max-w-xl mx-auto uppercase">
            Direct pipeline to executive A&R committees in London, Los Angeles, and Tokyo.
          </p>

          {/* 2. INTERACTIVE STEP-PROGRESS TIMELINE */}
          <div className="pt-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Connecting Line */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-zinc-800 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-[2px] bg-red-600 -translate-y-1/2 z-0 transition-all duration-500 shadow-[0_0_10px_rgba(229,57,53,0.8)]"
                style={{ width: `${((step - 1) / (stepLabels.length - 1)) * 100}%` }}
              />

              {stepLabels.map((s) => {
                const isActive = step === s.id;
                const isPassed = step > s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => setStep(s.id as any)}
                    className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 transform-gpu ${
                      isActive
                        ? 'bg-red-600 text-white shadow-[0_0_25px_rgba(229,57,53,0.8)] scale-110 border border-red-400'
                        : isPassed
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                    }`}>
                      {isPassed ? <Check className="w-4 h-4" /> : s.icon}
                    </div>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider transition-colors ${
                      isActive ? 'text-red-500' : isPassed ? 'text-zinc-300' : 'text-zinc-600'
                    }`}>
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 1. FROSTED GLASS CONTAINER PANEL */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transform-gpu">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* 5. SUCCESS STATE LAYOUT */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="py-12 px-6 text-center space-y-8 max-w-lg mx-auto bg-zinc-950/80 backdrop-blur-2xl border border-zinc-800 rounded-2xl shadow-[0_0_50px_rgba(229,57,53,0.2)] relative overflow-hidden"
            >
              {/* Minimalist Crisp Checkmark Animation */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-600/20 blur-xl"
                  animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                
                <svg className="w-20 h-20 text-red-500 relative z-10" viewBox="0 0 100 100" fill="none">
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="44"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                  <motion.path
                    d="M32 52 L44 64 L68 36"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  />
                </svg>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-400 font-mono text-[10px] font-bold uppercase tracking-widest">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                  <span>DEMO LOGGED IN A&amp;R QUEUE</span>
                </div>

                <h2 className="text-3xl font-black uppercase tracking-tight text-white">
                  SUBMISSION <span className="text-red-500">RECEIVED</span>
                </h2>

                <p className="text-xs sm:text-sm text-zinc-300 font-mono leading-relaxed max-w-sm mx-auto">
                  Your master track has been encrypted and assigned to our Executive A&amp;R Committee.
                </p>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] font-mono font-bold text-red-400 uppercase">
                  Expected A&amp;R Response: 5-10 Business Days
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => { setIsSuccess(false); setStep(1); }}
                  className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(229,57,53,0.5)] hover:scale-105 transition-all text-xs flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>SUBMIT ANOTHER TRACK</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <AnimatePresence mode="wait">
                {/* 3. STEP 1: ARTIST INFO WITH INTEGRATED ICONS */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                      <User className="w-5 h-5 text-red-500" />
                      <h3 className="text-lg font-black uppercase tracking-wider text-white font-mono">
                        STEP 1: ARTIST IDENTITY
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 👤 Full Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Full Name *</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="e.g. Marcus Vance"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-medium focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                          />
                        </div>
                      </div>

                      {/* Stage Name */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Music2 className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Stage Name / Alias *</span>
                        </label>
                        <div className="relative">
                          <Music2 className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={formData.stageName}
                            onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
                            placeholder="e.g. K-VANCE"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-medium focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* ✉ Email */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Official Email *</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="artist@management.com"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-medium focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>WhatsApp / Phone</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 (555) 019-2834"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-mono focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 🎵 Genre */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Music2 className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Primary Genre *</span>
                        </label>
                        <div className="relative">
                          <Music2 className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                          <select
                            value={formData.genre}
                            onChange={(e) => setFormData({ ...formData, genre: e.target.value as Genre })}
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm font-medium focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none appearance-none cursor-pointer"
                          >
                            {GENRES.map(g => (
                              <option key={g} value={g} className="bg-zinc-950 text-white">{g}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* 🌍 Country */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Country / Region *</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            placeholder="United States"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-medium focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (!formData.fullName || !formData.email) {
                            showToast('Please fill out Full Name and Email.', 'error');
                            return;
                          }
                          setStep(2);
                        }}
                        className="px-8 py-3.5 !rounded-none !bg-white hover:!bg-zinc-200 !text-black font-extrabold uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all text-xs flex items-center gap-2 cursor-pointer transform-gpu"
                      >
                        <span>NEXT: UPLOAD TRACK</span>
                        <ArrowRight className="w-4 h-4 !text-black" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 4. STEP 2: ARMORED UPLOAD DROPZONE */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                      <FileAudio className="w-5 h-5 text-red-500" />
                      <h3 className="text-lg font-black uppercase tracking-wider text-white font-mono">
                        STEP 2: ARMORED UPLOAD DROPZONE
                      </h3>
                    </div>

                    {/* Armored Drag-and-Drop Box */}
                    <div className="relative border-2 border-dashed border-zinc-700/80 hover:border-red-500/80 rounded-2xl p-10 text-center bg-zinc-950/60 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(229,57,53,0.2)]">
                      <input
                        type="file"
                        accept="video/mp4,audio/mpeg,audio/wav,application/pdf,image/jpeg,image/png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          if (file.size > 100 * 1024 * 1024) {
                            showToast('File size exceeds 100MB limit.', 'error');
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
                                showToast(`SUCCESS! ${file.name} uploaded safely.`, 'success');
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
                        <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                          <Upload className="w-7 h-7" />
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                            DRAG &amp; DROP AUDIO / VIDEO FILE OR <span className="text-red-500">BROWSE</span>
                          </p>
                          <p className="text-xs font-mono text-zinc-400">
                            MP3 • WAV • MP4 (Max 100MB)
                          </p>
                        </div>

                        {uploadedFileName && (
                          <div className="pt-3 flex items-center gap-3 bg-zinc-900 border border-red-500/40 px-4 py-2 rounded-full backdrop-blur-md">
                            <Activity className="w-4 h-4 text-red-500 animate-pulse" />
                            <span className="text-xs font-mono font-bold text-zinc-200 truncate max-w-[220px]">
                              {uploadedFileName}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">READY</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stream Link Input */}
                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                        <Headphones className="w-3.5 h-3.5 text-zinc-500" />
                        <span>Or Stream Link (SoundCloud, Google Drive, Dropbox)</span>
                      </label>
                      <div className="relative">
                        <Headphones className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                          type="url"
                          value={formData.audioUrl}
                          onChange={(e) => setFormData({ ...formData, audioUrl: e.target.value })}
                          placeholder="https://soundcloud.com/artist/unreleased-demo"
                          className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-mono focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>BACK</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-8 py-3.5 !rounded-none !bg-white hover:!bg-zinc-200 !text-black font-extrabold uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all text-xs flex items-center gap-2 cursor-pointer transform-gpu"
                      >
                        <span>NEXT: SOCIALS</span>
                        <ArrowRight className="w-4 h-4 !text-black" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* 3. STEP 3: SOCIAL LINKS */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                      <Share2 className="w-5 h-5 text-red-500" />
                      <h3 className="text-lg font-black uppercase tracking-wider text-white font-mono">
                        STEP 3: SOCIAL LINKS &amp; PRESS
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* 📸 Instagram Link */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Instagram className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Instagram Profile</span>
                        </label>
                        <div className="relative">
                          <Instagram className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="url"
                            value={formData.instagramUrl}
                            onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                            placeholder="https://instagram.com/artist"
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-mono focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                          />
                        </div>
                      </div>

                      {/* 🎧 Spotify / YouTube Link */}
                      <div className="space-y-2">
                        <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                          <Youtube className="w-3.5 h-3.5 text-zinc-500" />
                          <span>Spotify or YouTube Channel</span>
                        </label>
                        <div className="relative">
                          <Youtube className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input
                            type="url"
                            value={formData.spotifyUrl || formData.youtubeUrl}
                            onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value, youtubeUrl: e.target.value })}
                            placeholder="https://open.spotify.com/artist/..."
                            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm font-mono focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                        Artist Bio / Press Kit Notes
                      </label>
                      <textarea
                        rows={3}
                        value={formData.biography}
                        onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                        placeholder="Briefly describe your career milestones, monthly streams, or label goals..."
                        className="w-full p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                      />
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>BACK</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(4)}
                        className="px-8 py-3.5 !rounded-none !bg-white hover:!bg-zinc-200 !text-black font-extrabold uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all text-xs flex items-center gap-2 cursor-pointer transform-gpu"
                      >
                        <span>NEXT: FINAL SUBMIT</span>
                        <ArrowRight className="w-4 h-4 !text-black" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: SUBMIT */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
                      <Send className="w-5 h-5 text-red-500" />
                      <h3 className="text-lg font-black uppercase tracking-wider text-white font-mono">
                        STEP 4: TRANSMIT TO EXECUTIVE A&amp;R BOARD
                      </h3>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-5 space-y-3 font-mono text-xs">
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500">ARTIST NAME:</span>
                        <span className="text-white font-bold">{formData.stageName || formData.fullName}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500">GENRE:</span>
                        <span className="text-red-500 font-bold">{formData.genre}</span>
                      </div>
                      <div className="flex justify-between border-b border-zinc-800 pb-2">
                        <span className="text-zinc-500">EMAIL:</span>
                        <span className="text-white font-bold">{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">AUDIO ATTACHMENT:</span>
                        <span className="text-emerald-400 font-bold">{uploadedFileName || formData.audioUrl ? 'ATTACHED' : 'STREAM LINK'}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                        Personal Note to A&amp;R Board (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Any additional details regarding publishing or management..."
                        className="w-full p-4 rounded-xl bg-zinc-950/80 border border-zinc-800 text-white placeholder:text-zinc-600 text-sm focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 outline-none"
                      />
                    </div>

                    <div className="pt-4 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-6 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>BACK</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-4 !rounded-none !bg-white hover:!bg-zinc-200 !text-black font-extrabold uppercase tracking-[0.2em] shadow-lg hover:scale-105 active:scale-95 transition-all text-xs flex items-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-500 cursor-pointer transform-gpu"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin !text-black" />
                        ) : (
                          <Send className="w-4 h-4 !text-black" />
                        )}
                        <span>TRANSMIT DEMO</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}

          {/* 5. TRUST SEALS FOOTER MICRO-COPY */}
          <div className="border-t border-zinc-800/80 pt-6 mt-8 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-red-500" />
              <span>✓ Secure Upload</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              <span>✓ Encrypted Connection</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-red-500" />
              <span>✓ Directed to A&amp;R Queue</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
