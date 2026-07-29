'use client';

import React from 'react';
import Link from 'next/link';

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

        <div className="text-center space-y-2">
          <span className="font-black text-zinc-800 text-2xl tracking-tighter block">
            WORLDSTAR
          </span>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
            © 2026 Worldstar Hip Hop. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
