'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, X, ChevronRight, Send } from 'lucide-react';

interface MobileNavSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavSheet({ isOpen, onClose }: MobileNavSheetProps) {
  const pathname = usePathname();

  if (!isOpen) return null;

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'ARTISTS & ROSTER', href: '/roster' },
    { label: 'DISCOGRAPHY RELEASES', href: '/releases' },
    { label: 'ABOUT HERITAGE', href: '/about' },
    { label: 'SUBMIT DEMO (A&R)', href: '/submit' },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
      <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />

      <div className="relative w-full max-w-sm ml-auto h-full bg-obsidian border-l border-gold/30 p-6 flex flex-col justify-between overflow-y-auto z-10 shadow-2xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-600" />
              <span className="font-display font-extrabold text-lg text-white">WORLDSTAR</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 text-zinc-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close Mobile Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-2 font-display">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-all min-h-[48px] ${
                    isActive
                      ? 'bg-red-600/15 text-red-500 border border-red-600/30 font-bold'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white font-semibold'
                  }`}
                >
                  <span className="text-sm tracking-wider">{link.label}</span>
                  <ChevronRight className="w-4 h-4 text-red-600" />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-white/10 space-y-4">
          <Link
            href="/submit"
            onClick={onClose}
            className="w-full !bg-[#FF2B2B] !text-white !rounded-none !border-none py-3.5 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:!bg-red-700 transition-all shadow-md transform-gpu active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4 !text-white" />
            <span>SUBMIT DEMO TO A&R</span>
          </Link>
          <p className="text-[10px] font-mono text-zinc-500 text-center uppercase tracking-widest">
            © 2026 WORLDSTAR HIP HOP INC. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </div>
  );
}
