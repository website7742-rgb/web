import React from 'react';
import Link from 'next/link';
import { Compass, Home, Disc, ArrowRight, Radio } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-[#09090B] text-white flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Ambient Radial Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_40%,rgba(212,175,55,0.12),rgba(0,0,0,0))] pointer-events-none z-0" />
      <div className="absolute top-1/4 left-10 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main 404 Container */}
      <div className="relative z-10 max-w-2xl w-full bg-black/90 border border-gold/40 rounded-none p-8 sm:p-14 text-center space-y-8 shadow-[0_0_50px_rgba(212,175,55,0.15)]">
        
        {/* Animated Icon Badge */}
        <div className="w-20 h-20 rounded-none bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto text-gold shadow-[0_0_25px_rgba(212,175,55,0.25)]">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        {/* Headlines */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono font-bold tracking-widest uppercase">
            <Radio className="w-3.5 h-3.5 animate-pulse text-gold" />
            <span>HTTP 404 — NOT FOUND</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-hero font-extrabold text-white tracking-tight uppercase leading-none">
            PAGE DOES <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-amber-200">NOT EXIST</span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 font-sans font-light max-w-lg mx-auto leading-relaxed">
            The requested publishing directory, media asset, or catalog resource could not be located on the WorldStar Hip Hop global network.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="px-8 py-4 bg-gold text-[#09090B] font-hero text-xs font-extrabold tracking-widest uppercase hover:bg-gold-light transition-all flex items-center justify-center gap-2.5 w-full sm:w-auto min-h-[48px] shadow-[0_0_20px_rgba(212,175,55,0.3)] group"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO HOME</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/roster"
            className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 text-white font-hero text-xs font-extrabold tracking-widest uppercase hover:bg-white/10 hover:border-gold/50 transition-all flex items-center justify-center gap-2.5 w-full sm:w-auto min-h-[48px]"
          >
            <Disc className="w-4 h-4 text-gold" />
            <span>BROWSE ARTIST ROSTER</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
