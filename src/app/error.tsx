'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalErrorBoundary]', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 sm:p-8 bg-black text-white">
      <div className="max-w-xl w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8 text-center shadow-2xl backdrop-blur-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 font-mono text-xs font-bold uppercase tracking-widest">
          <AlertTriangle className="w-4 h-4" />
          <span>SYSTEM GLITCH DETECTED</span>
        </div>

        {/* Title & Details */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            TEMPORARY SYSTEM DISRUPTION
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            {error.message || 'An unexpected client runtime exception occurred. Our system isolated the fault.'}
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-zinc-600 uppercase">
              TRACE DIGEST: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-widest shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>RESET & TRY AGAIN</span>
          </button>

          <Link
            href="/"
            className="px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-widest backdrop-blur-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>RETURN HOME</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
