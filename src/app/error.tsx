'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white space-y-4">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong!</h2>
      <button onClick={() => reset()} className="px-4 py-2 bg-red-600 text-white font-bold rounded-sm hover:bg-red-700 transition">
        Try again
      </button>
    </div>
  );
}
