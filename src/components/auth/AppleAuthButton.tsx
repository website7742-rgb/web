'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

interface AppleAuthButtonProps {
  onError: (error: string) => void;
}

export default function AppleAuthButton({ onError }: AppleAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (err: any) {
      onError(err.message || 'Failed to initialize Apple authentication.');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAppleLogin}
      disabled={isLoading}
      className="w-full bg-transparent border border-white text-white rounded-none px-6 py-4 hover:bg-white hover:text-black transition-colors font-bold tracking-wider flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <svg className="w-5 h-5 fill-current transition-colors" viewBox="0 0 24 24">
          <path d="M15.42 5.54c-.66.83-1.61 1.36-2.58 1.25-.13-1.01.37-2.04 1.04-2.87.69-.87 1.76-1.42 2.76-1.3-.12 1.07-.48 2.06-1.22 2.92zm-5.07 14.86c-1.3 0-2.34-.73-3.23-1.44-1.29-1.02-3.13-3.41-3.66-4.63-.82-1.93-1.12-3.9-.84-5.65.31-1.92 1.34-3.5 2.76-4.52 1.35-.97 2.91-1.22 4.47-.94 1.33.24 2.53.88 3.51.88s2.34-.72 4.02-.91c1.68-.19 3.24.28 4.46 1.15-1.45 1.14-2.18 2.55-2.08 4.41.09 1.75.98 3.03 2.41 3.93-1.04 2.58-2.67 4.96-4.99 5.37-1.34.23-2.61-.31-3.6-.74-.98-.44-2.02-.93-3.23-.91z" />
        </svg>
      )}
      <span>CONTINUE WITH APPLE</span>
    </button>
  );
}
