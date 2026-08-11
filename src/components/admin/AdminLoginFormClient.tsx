'use client';

import React, { useState } from 'react';
import { Mail, Lock, ShieldCheck, Eye, EyeOff, Loader2, ArrowRight, AlertOctagon } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUI } from '@/providers/UIContext';
import { checkIsUserAdminAction, setAdminSessionCookieAction } from '@/app/actions/authActions';

export default function AdminLoginFormClient() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useUI();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError || !authData.user) {
        setError(signInError?.message || 'Authentication failed. Check your credentials.');
        setIsLoading(false);
        return;
      }

      // 2. Strict Admin Verification Check
      const isAdmin = await checkIsUserAdminAction(authData.user.id, authData.user.email);

      if (!isAdmin) {
        // Immediately sign out non-admin users to prevent unauthorized access
        await supabase.auth.signOut();
        setError('Access Denied: Admin credentials required to access WorldStar Control Center.');
        showToast('Access Denied: Regular users cannot access Admin Control.', 'error');
        setIsLoading(false);
        return;
      }

      // 3. Set Admin Session Cookie for instant middleware validation
      await setAdminSessionCookieAction();

      showToast('Admin verification successful. Access granted.', 'success');

      // 4. Redirect to intended admin page or /admin
      const requestedRedirect = searchParams.get('redirect');
      const targetUrl = requestedRedirect && requestedRedirect.startsWith('/admin')
        ? requestedRedirect
        : '/admin';

      router.push(targetUrl);
      router.refresh();
    } catch (err: any) {
      console.error('[AdminLoginFormClient] Exception:', err);
      setError(err.message || 'An unexpected error occurred during admin authentication.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex flex-col justify-center items-center p-4 sm:p-6 overflow-x-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.12)_0%,transparent_65%)] pointer-events-none" />

      {/* Main Glassmorphic Container */}
      <div className="relative w-full max-w-md bg-neutral-950/90 border border-neutral-800 rounded-none shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-rose-500 to-red-700" />

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600/10 border border-red-500/30 text-red-500 mb-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
            WORLDSTAR <span className="text-red-600">ADMIN CONTROL</span>
          </h1>
          <p className="text-xs font-mono text-zinc-400 tracking-wider uppercase">
            RESTRICTED ACCESS PORTAL · AUTHORIZED PERSONNEL ONLY
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-600/50 rounded-none flex items-start gap-3 text-xs font-mono text-red-300 animate-in fade-in duration-200">
            <AlertOctagon className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAdminLogin} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold mb-1.5 block">
                ADMIN EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@worldstarhiphop.world"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-900 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all rounded-none text-white focus:outline-none placeholder:text-zinc-600 font-mono text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] sm:text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold mb-1.5 block">
                ADMIN SECURE PASSWORD
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 py-3.5 bg-neutral-900 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all rounded-none text-white focus:outline-none placeholder:text-zinc-600 font-mono text-sm disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-500 text-white rounded-none px-6 py-4 font-mono font-bold tracking-widest uppercase transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-50 shadow-[0_0_25px_rgba(220,38,38,0.4)] active:scale-95 cursor-pointer text-xs sm:text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <>
                <span>SIGN IN TO ADMIN CONTROL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-neutral-900 text-center">
          <Link
            href="/"
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-300 uppercase tracking-widest transition-colors inline-flex items-center gap-1.5 min-h-[44px] px-3"
          >
            ← Return to Main Platform
          </Link>
        </div>
      </div>
    </div>
  );
}
