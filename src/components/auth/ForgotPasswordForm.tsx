'use client';

import React, { useState } from 'react';
import { Mail, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useUI } from '@/providers/UIContext';

interface ForgotPasswordFormProps {
  onError: (error: string | null) => void;
  onBack: () => void;
}

export default function ForgotPasswordForm({ onError, onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useUI();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      onError('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    onError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });

      if (error) throw error;
      
      showToast('Recovery link sent. Check your inbox.', 'success');
      onBack();
    } catch (err: any) {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        onError('No Internet Connection. Please check your network and try again.');
      } else {
        onError(err.message || 'Failed to send recovery link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mb-6 text-center">
        <p className="text-zinc-400 text-sm font-mono leading-relaxed">
          Enter your authorized email to receive a secure password reset link.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              <span>PROCESSING...</span>
            </>
          ) : (
            <>
              <span>SEND RECOVERY LINK</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={onBack}
          className="text-xs text-zinc-500 font-bold tracking-widest uppercase hover:text-white transition-colors cursor-pointer"
        >
          BACK TO LOGIN
        </button>
      </div>
    </>
  );
}
