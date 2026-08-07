'use client';

import React from 'react';
import { useUI } from '@/providers/UIContext';
import { X, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useUI();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-950 border border-neutral-800 shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-600/10 border border-red-600/30 flex items-center justify-center rounded-full mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Authentication Required
          </h2>
          
          <p className="text-sm font-mono text-zinc-400">
            You must be logged in to interact with this content. Sign in to like, comment, and follow artists.
          </p>

          <div className="pt-4 space-y-4">
            <Link 
              href="/login" 
              onClick={closeAuthModal}
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-4 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
            >
              SIGN IN OR REGISTER
            </Link>
            
            <button 
              onClick={closeAuthModal}
              className="block w-full text-zinc-500 hover:text-white uppercase text-xs font-bold tracking-widest transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
