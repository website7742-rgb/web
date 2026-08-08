'use client';

import React, { useState } from 'react';
import { 
  Video, 
  Search, 
  Filter, 
  Upload, 
  Play, 
  Music, 
  FileText, 
  HardDrive, 
  Cloud, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Sparkles
} from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { LiveMediaInventory } from '@/components/admin/LiveMediaInventory';

interface MediaItem {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'pdf' | 'image';
  size: string;
  storageProvider: 'Cloudflare Stream' | 'Supabase Storage';
  url: string;
  uploadedAt: string;
}

const MOCK_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-1',
    name: 'KENDRICK_LAMAR_HUMBLE_UNCUT_4K.mp4',
    type: 'video',
    size: '48.2 MB',
    storageProvider: 'Cloudflare Stream',
    url: 'https://iframe.videodelivery.net/cf_stream_kendrick',
    uploadedAt: '2026-07-30',
  },
  {
    id: 'med-2',
    name: 'DRAKE_21SAVAGE_FREESTYLE_2026.mp4',
    type: 'video',
    size: '38.6 MB',
    storageProvider: 'Cloudflare Stream',
    url: 'https://iframe.videodelivery.net/cf_stream_drake',
    uploadedAt: '2026-07-29',
  },
  {
    id: 'med-3',
    name: 'WORLDSTAR_EPK_PRESS_KIT_2026.pdf',
    type: 'pdf',
    size: '4.1 MB',
    storageProvider: 'Supabase Storage',
    url: 'https://krnsfelxtkpsiucuovwp.supabase.co/storage/v1/object/public/user_submissions/epk.pdf',
    uploadedAt: '2026-07-28',
  },
  {
    id: 'med-4',
    name: 'UNCUT_STUDIO_SESSION_MASTER.mp3',
    type: 'audio',
    size: '12.4 MB',
    storageProvider: 'Supabase Storage',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    uploadedAt: '2026-07-27',
  },
];

export default function AdminMediaLibraryPage() {
  const { showToast } = useUI();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'VIDEO' | 'AUDIO' | 'PDF'>('ALL');
  const [activeVideoModalUrl, setActiveVideoModalUrl] = useState<string | null>(null);

  const filteredItems = MOCK_MEDIA_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'ALL' || item.type.toUpperCase() === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Storage Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono font-bold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CENTRALIZED MEDIA ASSET REPOSITORY</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            MEDIA <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">LIBRARY</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* TODO: Wire up to actual Cloudflare Analytics API and Supabase Storage API for real-time bytes tracking */}
          
          {/* 1. CLOUDFLARE R2 TELEMETRY (10.0 GB FREE TIER) */}
          {(() => {
            const usedGB = 0.01; // 69 Bytes test file
            const totalGB = 10.0;
            const percent = Math.max(1, Math.round((usedGB / totalGB) * 100));
            const isWarning = usedGB >= 8.0;

            return (
              <div className={`bg-[#0a0a0a] border rounded-2xl px-4 py-2.5 flex flex-col justify-center font-mono text-xs space-y-1.5 min-w-[190px] ${
                isWarning ? 'border-red-600/70 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <Cloud className={`w-3.5 h-3.5 ${isWarning ? 'text-red-500 animate-pulse' : 'text-red-500'}`} />
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">CLOUDFLARE R2</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isWarning ? 'bg-red-600 text-white animate-bounce' : 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'}`}>
                    {percent}% USED
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-black">{usedGB} GB</span>
                  <span className="text-zinc-500 font-bold">/ {totalGB} GB MAX</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isWarning ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-gradient-to-r from-red-600 to-rose-500'
                    }`} 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })()}

          {/* 2. SUPABASE STORAGE TELEMETRY (1.0 GB FREE TIER) */}
          {(() => {
            const usedGB = 0.00;
            const totalGB = 1.0;
            const percent = Math.round((usedGB / totalGB) * 100);
            const isWarning = usedGB >= 0.8;

            return (
              <div className={`bg-[#0a0a0a] border rounded-2xl px-4 py-2.5 flex flex-col justify-center font-mono text-xs space-y-1.5 min-w-[190px] ${
                isWarning ? 'border-red-600/70 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : 'border-white/10'
              }`}>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    <HardDrive className={`w-3.5 h-3.5 ${isWarning ? 'text-red-500 animate-pulse' : 'text-emerald-400'}`} />
                    <span className="text-[10px] text-zinc-400 uppercase font-bold">SUPABASE DB</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isWarning ? 'bg-red-600 text-white animate-bounce' : 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'}`}>
                    {percent}% USED
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white font-black">{usedGB} GB</span>
                  <span className="text-zinc-500 font-bold">/ {totalGB} GB MAX</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      isWarning ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    }`} 
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })()}

          <a
            href="/admin"
            className="bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <Upload className="w-4 h-4" />
            <span>+ UPLOAD NEW VIDEO</span>
          </a>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search uploaded video, audio, or press kit files..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white font-mono text-xs outline-none focus:border-red-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {(['ALL', 'VIDEO', 'AUDIO', 'PDF'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold uppercase transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'bg-white/[0.03] text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden p-5 flex flex-col justify-between space-y-4 hover:border-red-600/60 transition-all duration-300 shadow-xl backdrop-blur-xl group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase border ${
                  item.type === 'video' ? 'bg-red-600/10 text-red-500 border-red-600/30' :
                  item.type === 'audio' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/30'
                }`}>
                  {item.type}
                </span>

                <span className="text-[10px] font-mono text-zinc-500">{item.size}</span>
              </div>

              <h3 className="text-sm font-bold text-white font-mono truncate group-hover:text-red-400 transition-colors">
                {item.name}
              </h3>

              <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>{item.storageProvider}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-zinc-500">{item.uploadedAt}</span>
              
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-600 text-white font-mono text-[10px] font-bold uppercase transition-all flex items-center gap-1"
              >
                <span>OPEN FILE</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* LIVE DEPLOYED MEDIA INVENTORY */}
      <section id="live-media-inventory" className="pt-4">
        <LiveMediaInventory />
      </section>
    </div>
  );
}
