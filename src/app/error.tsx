'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring services in production
    console.error('Unhandled App Router Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full glass-panel-gold rounded-3xl p-8 md:p-10 text-center space-y-6 border border-gold/40 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-label text-gold font-bold uppercase tracking-widest">SYSTEM RECOVERY</span>
          <h1 className="text-2xl md:text-3xl font-hero font-extrabold text-white tracking-tight">
            UNEXPECTED APPLICATION STATE
          </h1>
          <p className="text-sm text-zinc-300 font-sans">
            A temporary runtime exception occurred. The system has automatically logged this diagnostic event.
          </p>
        </div>

        {error?.message && (
          <div className="p-3.5 rounded-xl bg-obsidian border border-white/10 text-left">
            <span className="text-[10px] font-mono text-zinc-500 block uppercase">DIAGNOSTIC LOG</span>
            <p className="text-xs font-mono text-amber-400/90 truncate">{error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => reset()}
            className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RELOAD COMPONENT</span>
          </button>
          <Link
            href="/"
            className="btn-outline-luxury px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>RETURN HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
