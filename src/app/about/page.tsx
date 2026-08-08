'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { Sparkles, Globe, Flame, Disc } from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    { year: "1998", title: "FOUNDING IN LONDON", desc: "WorldStar Hip Hop established as an independent analog studio and media hub." },
    { year: "2008", title: "EXPANSION TO LOS ANGELES", desc: "Opened Sunset Blvd headquarters and launched WorldStar Global Video & Track Network." },
    { year: "2016", title: "FIRST RIAA DIAMOND RECORD", desc: "Breakout multi-platinum releases reach over 10 billion streams worldwide." },
    { year: "2026", title: "GLOBAL B2C ENGINE ERA", desc: "Unveiled real-time social interaction engine and independent artist publishing suite." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>LABEL HERITAGE & INSTITUTIONAL VISION</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight">
          ARCHITECTS OF <span className="text-red-600">HIP HOP CULTURE</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 font-mono">
          WorldStar Hip Hop stands as the international premier media destination for rap releases, talent discovery, and urban music culture.
        </p>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-center">
        <div className="bg-neutral-950 rounded-sm p-6 border border-neutral-800">
          <span className="block text-3xl md:text-4xl font-black text-white">{siteConfig.stats.globalStreams}</span>
          <span className="text-xs text-red-500 font-bold mt-1 block">GLOBAL STREAMS</span>
        </div>
        <div className="bg-neutral-950 rounded-sm p-6 border border-neutral-800">
          <span className="block text-3xl md:text-4xl font-black text-red-500">{siteConfig.stats.grammyWins}</span>
          <span className="text-xs text-red-500 font-bold mt-1 block">GRAMMY AWARDS</span>
        </div>
        <div className="bg-neutral-950 rounded-sm p-6 border border-neutral-800">
          <span className="block text-3xl md:text-4xl font-black text-white">{siteConfig.stats.riaaPlatinum}</span>
          <span className="text-xs text-red-500 font-bold mt-1 block">RIAA PLATINUM</span>
        </div>
        <div className="bg-neutral-950 rounded-sm p-6 border border-neutral-800">
          <span className="block text-3xl md:text-4xl font-black text-red-500">{siteConfig.stats.riaaDiamond}</span>
          <span className="text-xs text-red-500 font-bold mt-1 block">RIAA DIAMOND</span>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-8">
        <h2 className="text-2xl font-black text-white text-center uppercase tracking-tight flex items-center justify-center gap-2">
          <Flame className="w-5 h-5 text-red-600" />
          <span>BRAND HERITAGE TIMELINE</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div key={m.year} className="bg-neutral-950 rounded-sm p-6 border border-neutral-800 space-y-3 relative font-mono">
              <span className="text-3xl font-black text-red-600 block">{m.year}</span>
              <h3 className="text-sm font-bold text-white uppercase">{m.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Global HQ Locations */}
      <div className="bg-neutral-950 rounded-sm p-8 md:p-12 border border-neutral-800 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <Globe className="w-8 h-8 text-red-600 mx-auto" />
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">GLOBAL HEADQUARTERS</h2>
          <p className="text-xs text-zinc-400 font-mono uppercase">Editorial offices and sound suites located in music capitals worldwide.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
          {siteConfig.headquarters.map((hq) => (
            <div key={hq.city} className="p-4 rounded-sm bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="block font-bold text-red-500 text-sm">{hq.city}</span>
              <span className="text-zinc-400 block">{hq.address}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
