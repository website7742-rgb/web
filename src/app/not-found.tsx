import React from 'react';
import Link from 'next/link';
import { Compass, Home, Disc } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-xl w-full glass-panel-gold rounded-3xl p-8 md:p-12 text-center space-y-6 border border-gold/30 shadow-2xl">
        <div className="w-20 h-20 rounded-3xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
          <Compass className="w-10 h-10 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono text-gold font-bold tracking-widest">HTTP 404 — NOT FOUND</span>
          <h1 className="text-3xl md:text-4xl font-hero font-extrabold text-white tracking-tight">
            PAGE DOES NOT EXIST
          </h1>
          <p className="text-sm text-zinc-300 font-sans">
            The requested publishing directory or resource could not be located on the Aetheria network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="btn-gold-luxury px-6 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>RETURN TO HOME</span>
          </Link>
          <Link
            href="/roster"
            className="btn-outline-luxury px-6 py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]"
          >
            <Disc className="w-4 h-4" />
            <span>BROWSE ARTIST ROSTER</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
