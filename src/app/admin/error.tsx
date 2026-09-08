'use client';

import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] bg-zinc-950 flex flex-col items-center justify-center text-white space-y-4 rounded-lg border border-zinc-800">
      <h2 className="text-xl font-bold text-red-600">Admin Module Error</h2>
      <button onClick={() => reset()} className="px-4 py-2 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition">
        Recover Module
      </button>
    </div>
  );
}
