'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Ticket, MapPin } from 'lucide-react';
import { MOCK_TOUR_DATES } from '@/lib/data/mockData';

export function TourCountdown() {
  const targetDate = new Date("2026-09-14T20:00:00Z").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const nextTour = MOCK_TOUR_DATES[0]; // VESPERA at O2 Arena

  return (
    <div className="glass-panel-gold rounded-3xl p-8 md:p-12 border border-gold/40 shadow-2xl relative overflow-hidden my-12">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="space-y-3 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NEXT STADIUM WORLD TOUR EVENT</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            {nextTour.artistName} — {nextTour.tourName}
          </h2>

          <p className="text-sm font-mono text-zinc-300 flex items-center justify-center lg:justify-start gap-2">
            <MapPin className="w-4 h-4 text-gold" />
            <span>{nextTour.venue} • {nextTour.city}, {nextTour.country}</span>
          </p>
        </div>

        {/* Countdown Ticker Box */}
        <div className="flex items-center gap-4 sm:gap-6 font-mono text-center">
          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 min-w-20 sm:min-w-24">
            <span className="block text-3xl sm:text-5xl font-extrabold text-gold">{timeLeft.days}</span>
            <span className="text-[10px] text-zinc-500 tracking-widest">DAYS</span>
          </div>

          <span className="text-2xl text-zinc-600 font-bold">:</span>

          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 min-w-20 sm:min-w-24">
            <span className="block text-3xl sm:text-5xl font-extrabold text-white">{timeLeft.hours}</span>
            <span className="text-[10px] text-zinc-500 tracking-widest">HOURS</span>
          </div>

          <span className="text-2xl text-zinc-600 font-bold">:</span>

          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 min-w-20 sm:min-w-24">
            <span className="block text-3xl sm:text-5xl font-extrabold text-white">{timeLeft.minutes}</span>
            <span className="text-[10px] text-zinc-500 tracking-widest">MINS</span>
          </div>

          <span className="text-2xl text-zinc-600 font-bold">:</span>

          <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/10 min-w-20 sm:min-w-24">
            <span className="block text-3xl sm:text-5xl font-extrabold text-gold">{timeLeft.seconds}</span>
            <span className="text-[10px] text-zinc-500 tracking-widest">SECS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
