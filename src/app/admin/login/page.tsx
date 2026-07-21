'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2, Disc } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useUI();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, passcode: accessCode }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast('Admin session authenticated securely.', 'success');
        // Route protection will allow us in now
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Invalid executive credentials');
        setAccessCode('');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black font-sans relative overflow-hidden">
      {/* Decorative subtle grid background */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-black border border-gold flex items-center justify-center text-gold mb-6 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Disc className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-hero font-extrabold text-white tracking-tight uppercase text-center">
            EXECUTIVE <span className="text-gold">PORTAL</span>
          </h1>
          <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase mt-3">
            SECURE ACCESS REQUIRED
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-black p-8 space-y-6 border border-zinc-800 shadow-2xl">
          <div className="space-y-4">
            <div className="space-y-2 font-mono text-xs">
              <label className="text-zinc-400 block font-bold tracking-wide">ADMIN EMAIL</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="admin@aetheria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3.5 bg-zinc-900 border text-white focus:outline-none transition-colors min-h-[44px] ${
                    error ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-gold'
                  } disabled:opacity-50`}
                />
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              <label className="text-zinc-400 block font-bold tracking-wide">SECURITY ACCESS KEY</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter authorized passcode..."
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={isLoading}
                  className={`w-full pl-11 pr-4 py-3.5 bg-zinc-900 border text-white focus:outline-none transition-colors min-h-[44px] ${
                    error ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-gold'
                  } disabled:opacity-50`}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-950/20 border border-red-500/30 text-red-500 text-xs font-mono font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !accessCode || !email}
            className="w-full py-3.5 bg-gold text-black font-hero font-bold text-sm tracking-widest flex items-center justify-center gap-2 min-h-[44px] hover:bg-[#b5952f] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span>VERIFY CREDENTIALS</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
        
        <p className="text-center text-[10px] text-zinc-600 font-mono tracking-widest mt-8">
          AETHERIA MUSIC GROUP © 2026<br/>
          UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
        </p>
      </div>
    </div>
  );
}
