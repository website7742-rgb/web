'use client';

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUI } from '@/providers/UIContext';

interface LoginFormProps {
  onError: (error: string | null) => void;
  onForgotPassword: () => void;
}

export default function LoginForm({ onError, onForgotPassword }: LoginFormProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { showToast } = useUI();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (isSignUp && (!fullName || !confirmPassword))) {
      onError('Please fill out all required fields.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      onError('Passwords do not match.');
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
            data: { full_name: fullName },
            emailRedirectTo: `${originUrl}/auth/callback?next=/profile`,
          },
        });
        
        if (signUpError) throw signUpError;
        showToast('Registration successful! Check your email to verify your account.', 'success');
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        const redirectTarget = searchParams.get('redirect') || '/profile';
        showToast('Authentication successful.', 'success');
        router.push(redirectTarget);
        router.refresh();
      }
    } catch (err: any) {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        onError('No Internet Connection. Please check your network and try again.');
      } else {
        onError(err.message || 'Authentication failed. Please check your credentials.');
      }
      setPassword('');
      setConfirmPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleAuth} className="space-y-6">
        <div className="space-y-5">
          {isSignUp && (
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required={isSignUp}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-4 pr-4 p-4 bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-300 rounded-none text-white focus:outline-none placeholder:text-zinc-600 font-mono text-base disabled:opacity-50"
                />
              </div>
            </div>
          )}

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
                className="w-full pl-11 pr-4 p-4 bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-300 rounded-none text-white focus:outline-none placeholder:text-zinc-600 font-mono text-base disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold block">
                Password
              </label>
              {!isSignUp && (
                <Link
                  href="/forgot-password"
                  className="text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 font-bold hover:text-white transition-colors py-2 px-1 -mr-1"
                >
                  Forgot Password?
                </Link>
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
                className="w-full pl-11 pr-12 p-4 bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-300 rounded-none text-white focus:outline-none placeholder:text-zinc-600 font-mono text-base disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required={isSignUp}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full pl-11 pr-12 p-4 bg-neutral-950 border border-neutral-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all duration-300 rounded-none text-white focus:outline-none placeholder:text-zinc-600 font-mono text-base disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
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
          className="text-xs text-zinc-400 tracking-widest hover:text-white transition-colors cursor-pointer min-h-[44px] px-4 w-full flex items-center justify-center"
        >
          {isSignUp ? (
            <>Already have an account? <span className="font-bold underline">Sign In</span></>
          ) : (
            <>New to WORLDSTAR? <span className="font-bold underline">Register Now</span></>
          )}
        </button>
      </div>
    </>
  );
}
