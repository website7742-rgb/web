'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { useUI } from '@/context/UIContext';
import { Sparkles, ArrowRight, Award, Globe, Disc } from 'lucide-react';

export function Footer() {
  const { showToast } = useUI();
  const [email, setEmail] = useState('');

  const [times, setTimes] = useState({
    la: '',
    london: '',
    tokyo: '',
    ny: '',
  });

  useEffect(() => {
    const updateWorldClocks = () => {
      const now = new Date();
      setTimes({
        la: now.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles', hour: '2-digit', minute: '2-digit' }),
        london: now.toLocaleTimeString('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit' }),
        tokyo: now.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' }),
        ny: now.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' }),
      });
    };

    updateWorldClocks();
    const timer = setInterval(updateWorldClocks, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Welcome to Aetheria VIP Pass. Exclusive vinyl drops unlocked.', 'success');
    setEmail('');
  };

  return (
    <footer className="bg-obsidian border-t border-white/10 pt-16 sm:pt-24 pb-24 sm:pb-32 px-4 sm:px-6 md:px-8 lg:px-12 text-zinc-400 relative overflow-hidden w-full">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-40 bg-gold/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto space-y-16 sm:space-y-20 relative z-10">
        {/* Newsletter Box */}
        <div className="glass-panel-gold rounded-3xl p-6 sm:p-10 md:p-14 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 border border-gold/30 shadow-2xl">
          <div className="max-w-xl space-y-2 text-left">
            <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 animate-spin-slow flex-shrink-0" />
              <span>VIP ACCESS & EARLY VINYL DROPS</span>
            </div>
            <h3 className="text-2xl sm:text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
              JOIN THE AETHERIA CIRCLE
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">
              Receive invitations to listening sessions, limited vinyl pressings, and tour pre-sales.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-gold text-sm w-full lg:w-80 font-sans min-h-[44px]"
            />
            <button
              type="submit"
              className="btn-gold-luxury px-7 py-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 flex-shrink-0 min-h-[44px]"
            >
              <span>JOIN</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Global HQ World Clocks Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-mono text-xs border-y border-white/10 py-8">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="block text-zinc-500 font-bold">🇺🇸 LOS ANGELES</span>
            <span className="text-base sm:text-lg font-bold text-white block">{times.la || '11:27 AM'}</span>
            <span className="text-[10px] text-zinc-500">9000 SUNSET BLVD</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="block text-gold font-bold">🇬🇧 LONDON</span>
            <span className="text-base sm:text-lg font-bold text-gold block">{times.london || '07:27 PM'}</span>
            <span className="text-[10px] text-zinc-500">17 ALMA ROAD</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="block text-zinc-500 font-bold">🇯🇵 TOKYO</span>
            <span className="text-base sm:text-lg font-bold text-white block">{times.tokyo || '03:27 AM'}</span>
            <span className="text-[10px] text-zinc-500">MINAMI-AOYAMA</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
            <span className="block text-zinc-500 font-bold">🇺🇸 NEW YORK</span>
            <span className="text-base sm:text-lg font-bold text-white block">{times.ny || '02:27 PM'}</span>
            <span className="text-[10px] text-zinc-500">550 MADISON AVE</span>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 border-b border-white/10 pb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-gold flex-shrink-0" />
              <span className="font-display font-extrabold text-2xl text-white tracking-tight">AETHERIA</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-gold pt-2 font-bold">
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>{siteConfig.stats.riaaPlatinum} RIAA PLATINUM CERTIFICATIONS</span>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gold flex-shrink-0" />
              Headquarters
            </h4>
            <ul className="space-y-3 text-xs">
              {siteConfig.headquarters.map((hq) => (
                <li key={hq.city}>
                  <strong className="text-white block font-mono">{hq.city}</strong>
                  <span className="text-zinc-500">{hq.address}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <Disc className="w-4 h-4 text-gold flex-shrink-0" />
              Publishing & Masters
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/roster" className="hover:text-gold transition-colors">Artist Roster Directory</Link></li>
              <li><Link href="/releases" className="hover:text-gold transition-colors">Discography & Master Catalog</Link></li>
              <li><Link href="/tour" className="hover:text-gold transition-colors">World Tour Schedules</Link></li>
              <li><Link href="/merch" className="hover:text-gold transition-colors">Exclusive Store</Link></li>
              <li><Link href="/submit" className="hover:text-gold transition-colors">A&R Talent Submission Portal</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-display font-bold text-white text-sm tracking-wider uppercase mb-4">
              Legacy & Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3 text-center font-mono">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <span className="block text-2xl font-bold text-gold">{siteConfig.stats.grammyWins}</span>
                <span className="text-[10px] text-zinc-500">GRAMMY WINS</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
                <span className="block text-2xl font-bold text-gold">{siteConfig.stats.riaaDiamond}</span>
                <span className="text-[10px] text-zinc-500">RIAA DIAMOND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-zinc-500 gap-4 text-center sm:text-left">
          <p>© 2026 AETHERIA MUSIC GROUP INC. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-gold transition-colors">PRIVACY POLICY</Link>
            <Link href="/about" className="hover:text-gold transition-colors">TERMS OF PUBLISHING</Link>
            <Link href="/submit" className="hover:text-gold transition-colors">A&R GUIDELINES</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
