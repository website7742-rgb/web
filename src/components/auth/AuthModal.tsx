'use client';

import React from 'react';
import { useUI } from '@/providers/UIContext';
import { X, ShieldAlert, LogIn } from 'lucide-react';
import Link from 'next/link';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useUI();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-rose-600 to-red-600" />

        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-600/10 border border-red-600/30 flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>

          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">
              Sign In Required
            </h2>
            <p className="text-sm font-mono text-zinc-400 leading-relaxed">
              Sign in to interact with this track. Join the Worldstar Hip Hop community to like, comment, and follow your favorite artists.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link 
              href="/login" 
              onClick={closeAuthModal}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              SIGN IN / REGISTER NOW
            </Link>
            
            <button 
              onClick={closeAuthModal}
              className="w-full text-zinc-500 hover:text-zinc-300 uppercase text-xs font-bold tracking-widest transition-colors py-2 cursor-pointer"
            >
              CONTINUE BROWSING
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
