import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-gold/20" />
        <div className="absolute inset-0 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-1 font-mono">
        <span className="text-xs text-gold font-bold tracking-widest block uppercase">AETHERIA NETWORK</span>
        <p className="text-[11px] text-zinc-400">Loading catalog assets...</p>
      </div>
    </div>
  );
}
