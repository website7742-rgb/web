'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, Loader2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { createBrowserClient } from '@supabase/ssr';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { showToast } = useUI();

  const isMounted = useRef(true);
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);


  // Initialize Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      if (data.session) {
        showToast('Admin session authenticated securely.', 'success');
        router.push('/admin');
        router.refresh();
      }
    } catch (err: unknown) {
      if (typeof window !== 'undefined' && !navigator.onLine) {
        setError('No Internet Connection. Please check your network and try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected network error occurred.');
      }
      setPassword('');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black font-sans relative overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Dark Subtle Animated Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black"></div>
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_#450a0a_0%,_transparent_50%)] opacity-30"
        ></motion.div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        <div className="flex flex-col items-center mb-10 relative">
          <div className="absolute right-0 top-0 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800/50">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-[9px] font-bold text-zinc-400 tracking-widest uppercase">Secure Connection</span>
          </div>

          <div className="relative mb-6 mt-8">
            <div className="absolute inset-0 bg-red-600 blur-[40px] opacity-20 rounded-full"></div>
            <div className="relative w-16 h-16 bg-black border border-red-600/50 rounded-sm flex items-center justify-center text-red-600">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase text-center">
            WSHH <span className="text-red-600">ADMIN</span>
          </h1>
          <p className="text-xs text-zinc-500 font-bold tracking-widest uppercase mt-3">
            SECURE ACCESS REQUIRED
          </p>
        </div>

        <form onSubmit={handleLogin} className="bg-black/40 backdrop-blur-2xl p-8 space-y-6 border border-zinc-800/50 shadow-2xl rounded-sm">
          <div className="space-y-4">
            <div className="space-y-2 text-xs">
              <label className="text-zinc-400 block font-bold tracking-wide uppercase">Admin Email</label>
              <div className="relative">
                <Mail className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${emailFocused ? 'text-red-500' : 'text-zinc-500'}`} />
                <input
                  type="email"
                  placeholder="admin@wshh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  disabled={isLoading}
                  style={{ WebkitBoxShadow: '0 0 0px 1000px black inset', WebkitTextFillColor: 'white' }}
                  className={`w-full pl-11 pr-4 py-3.5 bg-black/50 border text-white focus:outline-none transition-all duration-300 min-h-[44px] rounded-sm placeholder:text-zinc-700 ${
                    error ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-600/50' : 'border-zinc-800/80 focus:border-red-600 focus:ring-2 focus:ring-red-600/50'
                  } disabled:opacity-50`}
                />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-zinc-400 block font-bold tracking-wide uppercase">Password</label>
              <div className="relative">
                <Lock className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${passwordFocused ? 'text-red-500' : 'text-zinc-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter authorized password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  disabled={isLoading}
                  style={{ WebkitBoxShadow: '0 0 0px 1000px black inset', WebkitTextFillColor: 'white' }}
                  className={`w-full pl-11 pr-12 py-3.5 bg-black/50 border text-white focus:outline-none transition-all duration-300 min-h-[44px] rounded-sm placeholder:text-zinc-700 ${
                    error ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-600/50' : 'border-zinc-800/80 focus:border-red-600 focus:ring-2 focus:ring-red-600/50'
                  } disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-950/20 border border-red-500/30 text-red-500 text-xs font-bold text-center rounded-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password || !email}
            className="w-full py-3.5 bg-red-600 text-white font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 min-h-[44px] hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-300 rounded-sm disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed disabled:border-transparent disabled:hover:shadow-none"
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

          <div className="text-center mt-4 flex flex-col items-center gap-4">
            <p className="font-mono text-[10px] text-zinc-600">256-BIT ENCRYPTED SESSION</p>
          </div>
        </form>
        
        <p className="text-center text-[10px] text-zinc-600 font-bold tracking-widest mt-8 uppercase">
          WSHH PLATFORM Â© 2026<br/>
          UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED
        </p>
      </motion.div>
    </div>
  );
}
