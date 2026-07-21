import React from 'react';

export function ExplicitBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 rounded bg-zinc-800 border border-zinc-700 text-[9px] font-mono font-bold text-zinc-400 select-none flex-shrink-0 ${className}`}
      title="Explicit Content"
    >
      E
    </span>
  );
}
