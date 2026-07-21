'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log catastrophic layout errors
    console.error('Catastrophic Layout Error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-obsidian min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-zinc-900 rounded-3xl p-8 md:p-10 text-center space-y-6 border border-zinc-800 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-red-500 font-bold uppercase tracking-widest">FATAL SYSTEM ERROR</span>
            <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-white tracking-tight">
              APPLICATION CRASHED
            </h1>
            <p className="text-sm text-zinc-400 font-sans">
              The application encountered a critical runtime error at the layout level.
            </p>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => reset()}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESTART APPLICATION</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
