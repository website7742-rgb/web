'use client';

import React, { useState, useEffect, Suspense } from 'react';
import AuthHeader from '@/components/auth/AuthHeader';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import LoginForm from '@/components/auth/LoginForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'login' | 'forgot'>('login');

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
            {view === 'login' ? (
              <>
                <Suspense fallback={<div className="text-xs text-zinc-500 font-mono text-center py-4">LOADING...</div>}>
                  <LoginForm onError={setError} onForgotPassword={() => { setView('forgot'); setError(null); }} />
                </Suspense>

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

                <div className="mt-6 space-y-4">
                  <GoogleAuthButton onError={setError} />
                </div>
              </>
            ) : (
              <>
                <ForgotPasswordForm onError={setError} onBack={() => { setView('login'); setError(null); }} />
                {error && (
                  <div className="p-3 bg-red-950/20 border border-red-900 text-red-500 text-xs font-bold text-center font-mono mt-4">
                    {error}
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
