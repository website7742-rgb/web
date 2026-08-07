'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useUI } from '@/providers/UIContext';
import AuthHeader from '@/components/auth/AuthHeader';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const { showToast } = useUI();
  const router = useRouter();

  // ANTI-BYPASS: Verify secure session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error || !session) {
          showToast('Invalid or expired recovery session. Please request a new link.', 'error');
          router.replace('/login');
          return;
        }
        setIsVerifying(false);
      } catch (err) {
        router.replace('/login');
      }
    };
    verifySession();
  }, [router, showToast]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;
      
      showToast('Password updated successfully. You are now logged in.', 'success');
      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update password.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-zinc-950 font-sans relative selection:bg-white selection:text-black">
      <div className="max-w-md w-full relative z-10">
        <div className="border border-zinc-800/50 bg-black/40 backdrop-blur-md p-10 rounded-none shadow-2xl">
          
          <AuthHeader />
          
          <div className="mb-6 text-center">
            <p className="text-zinc-400 text-sm font-mono leading-relaxed">
              Enter your new secure password below.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2 block">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-4 p-4 bg-zinc-900 border border-zinc-700 focus:border-white transition-colors rounded-none text-white focus:outline-none focus:ring-0 placeholder:text-zinc-600 font-mono text-sm disabled:opacity-50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black rounded-none px-6 py-4 font-bold tracking-widest uppercase hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>UPDATING...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM NEW PASSWORD</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
