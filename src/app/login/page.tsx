'use client';

import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, Loader2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useUI } from '@/providers/UIContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { showToast } = useUI();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Authenticate via secure API endpoint to set wshh_admin_session cookie
      const authRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const authJson = await authRes.json();

      if (!authRes.ok || !authJson.success) {
        throw new Error(authJson.error || 'Invalid admin credentials');
      }

      showToast('Admin session authenticated securely.', 'success');
      window.location.href = '/admin';
    } catch (err: any) {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        setError('No Internet Connection. Please check your network and try again.');
      } else {
        setError(err.message || 'Invalid credentials.');
      }
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black font-sans relative overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_#450a0a_0%,_transparent_70%)] opacity-40 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] font-bold text-zinc-300 tracking-widest uppercase font-mono">Secure System Access</span>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-red-600 blur-[30px] opacity-30 rounded-full" />
            <div className="relative w-16 h-16 bg-black border border-red-600/50 rounded-2xl flex items-center justify-center text-red-600 shadow-2xl">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">
              WSHH <span className="text-red-600">ADMIN</span>
            </h1>
            <p className="text-xs text-zinc-400 font-bold tracking-widest uppercase mt-1 font-mono">
              EXECUTIVE CONTROL PANEL LOGIN
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="bg-[#0a0a0a] border border-white/10 p-8 space-y-6 shadow-2xl rounded-2xl backdrop-blur-xl">
          <div className="space-y-4">
            <div className="space-y-2 text-xs">
              <label className="text-zinc-300 block font-bold tracking-wide uppercase font-mono">Admin Email</label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${emailFocused ? 'text-red-500' : 'text-zinc-500'}`} />
                <input
                  type="email"
                  required
                  placeholder="admin@wshh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  disabled={isLoading}
                  className={`w-full pl-11 pr-4 py-3.5 bg-white/[0.03] border text-white focus:outline-none transition-all duration-300 rounded-xl placeholder:text-zinc-600 font-mono text-xs ${
                    error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-red-600'
                  } disabled:opacity-50`}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-zinc-300 block font-bold tracking-wide uppercase font-mono">Authorized Password</label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${passwordFocused ? 'text-red-500' : 'text-zinc-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  disabled={isLoading}
                  className={`w-full pl-11 pr-12 py-3.5 bg-white/[0.03] border text-white focus:outline-none transition-all duration-300 rounded-xl placeholder:text-zinc-600 font-mono text-xs ${
                    error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-red-600'
                  } disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-950/40 border border-red-500/40 text-red-400 text-xs font-bold text-center rounded-xl font-mono">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 rounded-xl cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <span>LOGIN TO DASHBOARD</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">256-BIT ENCRYPTED EXECUTIVE SESSION</p>
          </div>
        </form>
      </div>
    </div>
  );
}
