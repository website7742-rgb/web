'use client';

import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Download, BarChart2, Award, CheckCircle, Zap, FileSpreadsheet, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ProPage() {
  const [billingCycle, setBillingCycle] = useState<'ANNUAL' | 'MONTHLY'>('ANNUAL');

  const proFeatures = [
    'Complete Billboard Hot 100 & Global 200 Historic Chart Archive',
    'Raw CSV Data Exports for Streaming & Vinyl Sales Telemetry',
    'Label Market Share Analytics & Territory Revenue Heatmaps',
    'Priority 48-Hour A&R Submission Review Queue',
    'Verified Music Executive Directory & Contact Hub',
    'Exclusive Access to Aetheria Industry Whitepapers & Market Reports',
  ];

  return (
    <div className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-mono font-bold uppercase">
          <Sparkles className="w-4 h-4 text-gold" />
          <span>ENTERPRISE MUSIC INDUSTRY INTELLIGENCE</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          AETHERIA <span className="text-gold-gradient">PRO PLATFORM</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 font-sans font-light">
          Empowering music executives, A&R directors, managers, and publishing catalog owners with real-time market share telemetry, historic chart exports, and priority submission queues.
        </p>
      </div>

      {/* Plan Card */}
      <div className="max-w-xl mx-auto glass-panel-gold rounded-3xl p-8 sm:p-12 border border-gold/40 shadow-2xl space-y-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-gold text-obsidian px-6 py-1.5 font-mono text-[10px] font-extrabold uppercase rounded-bl-2xl">
          INDUSTRY STANDARD
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-gold font-bold uppercase tracking-wider block">ENTERPRISE ACCESS</span>
          <div className="flex items-baseline justify-center gap-1 font-display font-extrabold text-white">
            <span className="text-5xl sm:text-6xl">$49</span>
            <span className="text-xs font-mono text-zinc-400">/ MONTH (BILLED ANNUALLY)</span>
          </div>
        </div>

        <ul className="space-y-3 text-left font-mono text-xs text-zinc-300 border-y border-white/10 py-6">
          {proFeatures.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => alert('Welcome to Aetheria PRO! Executive access granted.')}
          className="w-full btn-gold-luxury py-4 rounded-2xl text-xs font-bold shadow-2xl flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Lock className="w-4 h-4" />
          <span>START 14-DAY PRO TRIAL</span>
        </button>

        <p className="text-[10px] font-mono text-zinc-400">
          Cancel anytime. Backed by Aetheria Music Group Enterprise SLA.
        </p>
      </div>
    </div>
  );
}
