'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import { ShieldCheck, Clock, Lock, ArrowRight, TrendingUp, Music, Globe } from 'lucide-react';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';

export default function AdminDashboardPage() {
  const { artists, submissions } = useData();

  const pendingCount = submissions.filter(s => s.status === 'PENDING').length;
  
  // Calculate Global Streams
  const totalStreams = artists.reduce((acc, artist) => acc + (artist.totalStreams || 0), 0);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <div className="max-w-7xl px-4 md:px-8 py-10 space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 border-b border-zinc-800 pb-8">
        <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>EXECUTIVE A&R BOARD DASHBOARD</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-hero font-extrabold text-white uppercase tracking-tight">
          PLATFORM <span className="text-gold">OVERVIEW</span>
        </h1>
        <p className="text-zinc-400 font-sans text-sm md:text-base">
          High-level metrics and system status for the AMG network.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-black border border-zinc-800 p-6 space-y-3 relative overflow-hidden group hover:border-gold transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Music className="w-16 h-16 text-gold" />
          </div>
          <span className="text-xs font-label font-bold text-zinc-400 block tracking-wider uppercase">Kamal Artists</span>
          <span className="block text-4xl md:text-5xl font-hero font-bold text-white tracking-tight">{artists.length}</span>
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">+ ACTIVE ON DIRECTORY</span>
        </div>

        <div className="bg-black border border-zinc-800 p-6 space-y-3 relative overflow-hidden group hover:border-gold transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe className="w-16 h-16 text-gold" />
          </div>
          <span className="text-xs font-label font-bold text-zinc-400 block tracking-wider uppercase">Global Streams</span>
          <span className="block text-4xl md:text-5xl font-hero font-bold text-gold tracking-tight">{formatNumber(totalStreams)}</span>
          <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">ACROSS ALL PLATFORMS</span>
        </div>

        <div className="bg-black border border-zinc-800 p-6 space-y-3 relative overflow-hidden group hover:border-gold transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-gold" />
          </div>
          <span className="text-xs font-label font-bold text-zinc-400 block tracking-wider uppercase">Active Chart Entries</span>
          <span className="block text-4xl md:text-5xl font-hero font-bold text-white tracking-tight">142</span>
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">TOP 100 BILLBOARD</span>
        </div>

        <div className="bg-black border border-zinc-800 p-6 space-y-3 relative overflow-hidden group hover:border-gold transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 text-gold" />
          </div>
          <span className="text-xs font-label font-bold text-zinc-400 block tracking-wider uppercase">Pending A&R Demos</span>
          <span className="block text-4xl md:text-5xl font-hero font-bold text-white tracking-tight">{pendingCount}</span>
          <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-widest">AWAITING REVIEW</span>
        </div>
      </div>

      {/* Recent Activity Queue Summary */}
      <div className="bg-black p-6 md:p-8 border border-zinc-800 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <h2 className="text-2xl font-hero font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-gold" />
            <span>RECENT INCOMING DEMOS</span>
          </h2>
          <Link href="/admin/submissions" className="text-xs font-mono font-bold text-gold hover:underline">
            VIEW ALL INBOX →
          </Link>
        </div>

        <div className="space-y-0 divide-y divide-zinc-800/50 border border-zinc-800">
          {submissions.slice(0, 4).map((sub) => (
            <div
              key={sub.id}
              className="flex items-center justify-between p-4 bg-zinc-900/20 hover:bg-zinc-900/50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-hero font-bold tracking-wide text-white text-lg uppercase">{sub.stageName}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold ${
                    sub.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' :
                    sub.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {sub.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-sans mt-1">{sub.fullName} • {sub.country} • {sub.genre}</p>
              </div>

              <Link
                href="/admin/submissions"
                className="px-4 py-2 border border-gold text-gold text-xs font-mono font-bold hover:bg-gold hover:text-black transition-all"
              >
                REVIEW DEMO →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
