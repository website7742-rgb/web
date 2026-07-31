'use client';

import React from 'react';
import { Settings, ShieldCheck, Key, Lock, Globe, Server, Sparkles } from 'lucide-react';
import { useUI } from '@/providers/UIContext';

export default function AdminSettingsPage() {
  const { showToast } = useUI();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SYSTEM CONFIGURATION &amp; SECURITY CONTROLS</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
          PLATFORM <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">SETTINGS</span>
        </h1>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-3xl space-y-6 max-w-3xl">
        <h2 className="text-xl font-mono font-bold text-white uppercase tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-500" />
          <span>EXECUTIVE SECURITY POLICIES</span>
        </h2>

        <div className="space-y-4 font-mono text-xs text-zinc-300">
          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl">
            <div>
              <p className="font-bold text-white">CSP Security Headers</p>
              <p className="text-[10px] text-zinc-500">Includes Cloudflare Stream &amp; Supabase Storage permissions.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">ACTIVE</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-xl">
            <div>
              <p className="font-bold text-white">Edge Rate Limiting (Upstash Redis)</p>
              <p className="text-[10px] text-zinc-500">Sliding window protection against DoS attacks.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">ENFORCED</span>
          </div>
        </div>

        <button
          onClick={() => showToast('Platform security settings saved.', 'success')}
          className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest cursor-pointer shadow-lg"
        >
          SAVE CONFIGURATION
        </button>
      </div>
    </div>
  );
}
