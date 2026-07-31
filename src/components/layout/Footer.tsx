'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LOGO_BASE64 } from './logoBase64';

export function Footer() {
  return (
    <footer className="bg-black border-t border-[#222] py-8 sm:py-12 px-4 w-full mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center justify-center space-y-6">
        
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[10px] sm:text-xs font-bold text-zinc-500 uppercase tracking-widest">
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
          <Link href="/advertise" className="hover:text-white transition-colors">Advertise</Link>
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <Link href="/" className="inline-block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={LOGO_BASE64} 
              alt="WorldStarHipHop Official Logo" 
              className="w-auto h-10 md:h-14 object-contain opacity-90 hover:opacity-100 transition-opacity filter drop-shadow-[0_2px_10px_rgba(220,38,38,0.3)]" 
            />
          </Link>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            © 2026 WORLDSTAR HIP HOP. ALL RIGHTS RESERVED.
          </p>
        </div>

      </div>
    </footer>
  );
}
