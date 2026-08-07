'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useUI } from '@/providers/UIContext';

interface LoginFormProps {
  onError: (error: string | null) => void;
  onForgotPassword: () => void;
}

export default function LoginForm({ onError, onForgotPassword }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useUI();
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      onError('Please enter both your email and password.');
      return;
    }

    setIsLoading(true);
    onError(null);

    try {
      if (isSignUp) {
        const originUrl = process.env.NODE_ENV === 'production' ? 'https://worldstarhiphop.world' : window.location.origin;
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${originUrl}/auth/callback?next=/dashboard`,
          },
        });
        
        if (signUpError) throw signUpError;
        showToast('Registration successful! Check your email to verify your account.', 'success');
        setIsSignUp(false);
        setPassword('');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        showToast('Authentication successful.', 'success');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        onError('No Internet Connection. Please check your network and try again.');
      } else {
        onError(err.message || 'Authentication failed. Please check your credentials.');
      }
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleAuth} className="space-y-6">
        <div className="space-y-5">
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold block">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold hover:text-white transition-colors"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-11 pr-12 p-4 bg-zinc-900 border border-zinc-700 focus:border-white transition-colors rounded-none text-white focus:outline-none focus:ring-0 placeholder:text-zinc-600 font-mono text-sm disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
              <span>{isSignUp ? 'CREATE ACCOUNT' : 'SECURE LOGIN'}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button 
          onClick={() => {
            setIsSignUp(!isSignUp);
            onError(null);
          }}
          className="text-xs text-zinc-500 font-bold tracking-widest uppercase hover:text-white transition-colors cursor-pointer"
        >
          {isSignUp ? 'ALREADY AUTHORIZED? SIGN IN' : 'REQUEST ACCESS'}
        </button>
      </div>
    </>
  );
}
