'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { Sparkles, Award, Globe, ShieldCheck, Flame, Disc, Music } from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    { year: "1998", title: "FOUNDING IN LONDON", desc: "Aetheria Soundworks established as an independent analog mastering studio in Windsor." },
    { year: "2008", title: "EXPANSION TO LOS ANGELES", desc: "Opened Sunset Blvd headquarters and launched Aetheria Publishing." },
    { year: "2016", title: "FIRST RIAA DIAMOND RECORD", desc: "Breakout multi-platinum releases reach over 10 billion streams worldwide." },
    { year: "2026", title: "GLOBAL HIGH-FIDELITY ERA", desc: "Unveiled $150M global artist development fund and 64-band spatial audio suite." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LABEL HERITAGE & INSTITUTIONAL VISION</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
          ARCHITECTS OF <span className="text-gold-gradient">MODERN SOUND</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400">
          Aetheria Music Group stands as an international benchmark in luxury record publishing, artist development, and sound engineering.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-center">
        <div className="glass-panel-gold rounded-3xl p-6 border border-white/10">
          <span className="block text-3xl md:text-4xl font-extrabold text-white">{siteConfig.stats.globalStreams}</span>
          <span className="text-xs text-gold mt-1 block">GLOBAL STREAMS</span>
        </div>
        <div className="glass-panel-gold rounded-3xl p-6 border border-white/10">
          <span className="block text-3xl md:text-4xl font-extrabold text-gold">{siteConfig.stats.grammyWins}</span>
          <span className="text-xs text-gold mt-1 block">GRAMMY AWARDS</span>
        </div>
        <div className="glass-panel-gold rounded-3xl p-6 border border-white/10">
          <span className="block text-3xl md:text-4xl font-extrabold text-white">{siteConfig.stats.riaaPlatinum}</span>
          <span className="text-xs text-gold mt-1 block">RIAA PLATINUM</span>
        </div>
        <div className="glass-panel-gold rounded-3xl p-6 border border-white/10">
          <span className="block text-3xl md:text-4xl font-extrabold text-gold">{siteConfig.stats.riaaDiamond}</span>
          <span className="text-xs text-gold mt-1 block">RIAA DIAMOND</span>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-display font-bold text-white text-center flex items-center justify-center gap-2">
          <Flame className="w-5 h-5 text-gold" />
          <span>LABEL HERITAGE TIMELINE</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div key={m.year} className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3 relative">
              <span className="text-3xl font-display font-extrabold text-gold">{m.year}</span>
              <h3 className="text-sm font-display font-bold text-white uppercase">{m.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Global HQ Locations */}
      <div className="glass-panel-gold rounded-3xl p-8 md:p-12 border border-white/10 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Globe className="w-8 h-8 text-gold mx-auto" />
          <h2 className="text-3xl font-display font-bold text-white">GLOBAL HEADQUARTERS</h2>
          <p className="text-xs text-zinc-400">Mastering suites and publishing offices located in global fashion & music capitals.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          {siteConfig.headquarters.map((hq) => (
            <div key={hq.city} className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
              <span className="block font-bold text-white text-sm text-gold">{hq.city}</span>
              <span className="text-zinc-400 block">{hq.address}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
