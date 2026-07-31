'use client';

import React, { useState, useTransition } from 'react';
import { Sparkles, CheckCircle, Lock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ProPage() {
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const proFeatures = [
    'Complete Billboard Hot 100 & Global 200 Historic Chart Archive',
    'Raw CSV Data Exports for Streaming & Vinyl Sales Telemetry',
    'Label Market Share Analytics & Territory Revenue Heatmaps',
    'Priority 48-Hour A&R Submission Review Queue',
    'Verified Music Executive Directory & Contact Hub',
    'Exclusive Access to Industry Whitepapers & Market Reports',
  ];

  const handleStartTrial = () => {
    startTransition(() => {
      setTimeout(() => {
        setSubscribed(true);
        setModalOpen(true);
      }, 600);
    });
  };

  return (
    <div className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-16 selection:bg-red-600 selection:text-white">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 text-red-500 border border-red-600/30 text-xs font-mono font-bold uppercase">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span>ENTERPRISE MUSIC INDUSTRY INTELLIGENCE</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          WORLDSTAR <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">PRO PLATFORM</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-300 font-sans font-light">
          Empowering music executives, A&amp;R directors, managers, and publishing catalog owners with real-time market share telemetry, historic chart exports, and priority submission queues.
        </p>
      </div>

      {/* Plan Card */}
      <div className="max-w-xl mx-auto bg-[#0a0a0a] rounded-3xl p-8 sm:p-12 border border-red-600/40 shadow-2xl space-y-8 text-center relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 bg-red-600 text-white px-6 py-1.5 font-mono text-[10px] font-extrabold uppercase rounded-bl-2xl">
          INDUSTRY STANDARD
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-red-500 font-bold uppercase tracking-wider block">ENTERPRISE ACCESS</span>
          <div className="flex items-baseline justify-center gap-1 font-display font-extrabold text-white">
            <span className="text-5xl sm:text-6xl">$49</span>
            <span className="text-xs font-mono text-zinc-400">/ MONTH (BILLED ANNUALLY)</span>
          </div>
        </div>

        <ul className="space-y-3 text-left font-mono text-xs text-zinc-300 border-y border-white/10 py-6">
          {proFeatures.map((feat) => (
            <li key={feat} className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleStartTrial}
          disabled={isPending || subscribed}
          className={`w-full py-4 rounded-2xl text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
            subscribed
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.4)]'
          } disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>INITIALIZING PRO SESSION...</span>
            </>
          ) : subscribed ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>PRO SESSION ACTIVE</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>START 14-DAY PRO TRIAL</span>
            </>
          )}
        </button>

        <p className="text-[10px] font-mono text-zinc-500">
          Cancel anytime. Backed by WorldStar Enterprise SLA.
        </p>
      </div>

      {/* Success Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-red-600/40 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center mx-auto text-red-500">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-display font-extrabold text-white uppercase">PRO ACCESS GRANTED</h3>
              <p className="text-xs text-zinc-300 font-mono">
                Welcome to WorldStar Executive PRO. Priority A&amp;R Submission queues and telemetry archives are now unlocked.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Link
                href="/admin"
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>ENTER EXECUTIVE PANEL</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
