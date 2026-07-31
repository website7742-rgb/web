'use client';

import React, { useState, useTransition } from 'react';
import { Calendar, MapPin, Ticket, CheckCircle, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface TourEvent {
  id: string;
  artistName: string;
  tourName: string;
  venue: string;
  city: string;
  country: string;
  eventDate: string;
  ticketStatus: 'ON SALE' | 'FEW TICKETS LEFT' | 'SOLD OUT';
}

export default function TourPage() {
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const tourEvents: TourEvent[] = [
    {
      id: 't1',
      artistName: 'Tupac Shakur & Guests',
      tourName: 'Legendary West Coast Revival Night',
      venue: 'The Forum',
      city: 'Inglewood, CA',
      country: 'USA',
      eventDate: '2026-09-15',
      ticketStatus: 'FEW TICKETS LEFT',
    },
    {
      id: 't2',
      artistName: 'J. Cole',
      tourName: 'The Off-Season Global Arena Experience',
      venue: 'Madison Square Garden',
      city: 'New York, NY',
      country: 'USA',
      eventDate: '2026-10-02',
      ticketStatus: 'ON SALE',
    },
    {
      id: 't3',
      artistName: 'Travis Scott',
      tourName: 'UTOPIA Circus Maximus Stadium Tour',
      venue: 'SoFi Stadium',
      city: 'Los Angeles, CA',
      country: 'USA',
      eventDate: '2026-11-12',
      ticketStatus: 'ON SALE',
    },
  ];

  const handleReserve = (id: string) => {
    startTransition(() => {
      setTimeout(() => {
        setReservedIds((prev) =>
          prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
      }, 400);
    });
  };

  return (
    <div className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl mx-auto w-full space-y-12 selection:bg-red-600 selection:text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-600/10 text-red-500 border border-red-600/30 text-xs font-mono font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WORLDSTAR LIVE DATES</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            LIVE DATES &amp; <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">CONCERTS</span>
          </h1>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[#0a0a0a] border border-red-600/40 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-lg">
          <Ticket className="w-4 h-4 text-red-500" />
          <span>RESERVED PASSES ({reservedIds.length})</span>
        </div>
      </div>

      {/* Tour Dates List */}
      <div className="space-y-4">
        {tourEvents.map((event) => {
          const isReserved = reservedIds.includes(event.id);

          return (
            <div
              key={event.id}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-red-600/40 transition-all shadow-xl"
            >
              <div className="flex items-center gap-6">
                <div className="p-4 rounded-xl bg-red-600/10 border border-red-600/30 text-center min-w-[90px] font-mono">
                  <span className="block text-xs text-red-500 uppercase font-bold">{event.eventDate}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-red-500 uppercase font-bold">{event.artistName}</span>
                  <h3 className="text-lg md:text-xl font-bold text-white uppercase">{event.tourName}</h3>
                  <p className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{event.venue} — {event.city}, {event.country}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0 border-white/10">
                <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  {event.ticketStatus}
                </span>

                <button
                  onClick={() => handleReserve(event.id)}
                  disabled={isPending}
                  className={`px-6 py-3 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                    isReserved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                  } disabled:opacity-80`}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isReserved ? (
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
  );
}
