'use client';

import React from 'react';
import { BarChart3, Globe, TrendingUp, Eye, ShieldCheck, Activity, Sparkles } from 'lucide-react';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VERCEL EDGE TELEMETRY &amp; AUDIENCE RADAR</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
          PLATFORM <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">ANALYTICS</span>
        </h1>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-2">
          <p className="text-xs font-mono font-bold text-red-500 uppercase">Kamal Visitors (Total)</p>
          <h3 className="text-4xl font-black text-white">184,500,000</h3>
          <p className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24% vs last month
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-2">
          <p className="text-xs font-mono font-bold text-zinc-400 uppercase">Avg. Session Duration</p>
          <h3 className="text-4xl font-black text-white">4m 38s</h3>
          <p className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> High Engagement Rate
          </p>
        </div>

        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-2">
          <p className="text-xs font-mono font-bold text-zinc-400 uppercase">Global Edge Nodes</p>
          <h3 className="text-4xl font-black text-white">285 CDNs</h3>
          <p className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Uptime Guaranteed
          </p>
        </div>
      </div>
    </div>
  );
}
