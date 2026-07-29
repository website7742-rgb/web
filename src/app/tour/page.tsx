'use client';

import React, { useState } from 'react';
import { useData } from '@/providers/DataContext';
import { TourCountdown } from '@/components/tour/TourCountdown';
import { Sparkles, MapPin, Ticket, CheckCircle } from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { formatDate } from '@/lib/utils';

export default function TourPage() {
  const { tourDates } = useData();
  const { showToast } = useUI();
  const [reservedId, setReservedId] = useState<string | null>(null);

  const handleReserveTickets = (tourId: string, eventName: string) => {
    setReservedId(tourId);
    showToast(`VIP Ticket reservation lock confirmed for ${eventName}! Check email for pass code.`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-gold border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STADIUM & ARENA WORLD TOURS</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
          LIVE <span className="text-gold-gradient">EXPERIENCES</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400">
          Official ticket reservations and VIP packages for Aetheria Music Group stadium world tours.
        </p>
      </div>

      {/* Countdown Timer */}
      <TourCountdown />

      {/* Tour Dates Table */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-10 border border-gold/30 shadow-2xl space-y-4">
        <h2 className="text-2xl font-display font-bold text-white mb-6">ALL UPCOMING TOUR DATES</h2>

        <div className="space-y-4">
          {tourDates.map((tour) => {
            const isReserved = reservedId === tour.id;
            return (
              <div
                key={tour.id}
                className="flex flex-col lg:flex-row lg:items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-gold/40 transition-all gap-6"
              >
                <div className="flex items-center gap-6 min-w-0">
                  <div className="p-4 rounded-xl bg-gold/10 border border-gold/30 text-center min-w-24 font-mono">
                    <span className="block text-xs text-gold uppercase font-bold">{formatDate(tour.eventDate)}</span>
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="text-xs font-mono text-gold tracking-widest uppercase font-bold">{tour.artistName}</span>
                    <h3 className="text-xl font-display font-bold text-white truncate">{tour.tourName}</h3>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{tour.venue} â€” {tour.city}, {tour.country}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-white/10">
                  <span className="text-xs font-mono text-zinc-400 uppercase font-bold">{tour.ticketStatus}</span>

                  <button
                    onClick={() => handleReserveTickets(tour.id, `${tour.artistName} at ${tour.venue}`)}
                    className={`px-6 py-3 rounded-xl text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-2 ${
                      isReserved
                        ? 'bg-emerald-500 text-obsidian'
                        : 'btn-gold-luxury'
                    }`}
                  >
                    {isReserved ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>PASS RESERVED</span>
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4" />
                        <span>RESERVE VIP TICKET</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
