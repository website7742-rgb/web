'use client';

import React, { useState, useEffect } from 'react';
import AuthHeader from '@/components/auth/AuthHeader';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  // Extract error from URL if redirected from auth callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlError = urlParams.get('error');
      if (urlError) {
        setError(decodeURIComponent(urlError));
      }
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 font-sans relative selection:bg-white selection:text-black">
      <div className="max-w-md w-full relative z-10">
        <div className="border border-zinc-800/50 bg-black/40 backdrop-blur-md p-10 rounded-none shadow-2xl">
          
          <AuthHeader />

          <div className="space-y-6">
            <LoginForm onError={setError} />

            {error && (
              <div className="p-3 bg-red-950/20 border border-red-900 text-red-500 text-xs font-bold text-center font-mono mt-4">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              <hr className="w-full border-zinc-800" />
              <span className="px-4 text-xs font-bold tracking-widest text-zinc-600 uppercase bg-transparent">OR</span>
              <hr className="w-full border-zinc-800" />
            </div>

            <div className="mt-6">
              <GoogleAuthButton onError={setError} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
