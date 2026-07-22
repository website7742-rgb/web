'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Search, ShoppingBag, Menu } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { MobileNavSheet } from './MobileNavSheet';

export function Navbar() {
  const pathname = usePathname();
  const { openCommandPalette, toggleCart, cart } = useUI();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navLinks = [
    { label: 'HOME', href: '/' },
    { label: 'CHARTS', href: '/charts' },
    { label: 'NEWSROOM', href: '/news' },
    { label: 'ARTISTS', href: '/roster' },
    { label: 'RELEASES', href: '/releases' },
    { label: 'TOUR', href: '/tour' },
    { label: 'MERCH', href: '/merch' },
    { label: 'PRO', href: '/pro' },
    { label: 'SUBMIT DEMO', href: '/submit' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 transition-all duration-300">
        <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto bg-[#09090B]/60 backdrop-blur-xl rounded-full px-5 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl border border-white/10">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gold group-hover:scale-110 transition-transform" />
            <div className="flex items-center gap-2.5">
              <span className="font-hero font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-gold transition-colors">
                AETHERIA
              </span>
              <span className="hidden xl:inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 border border-white/10 font-bold uppercase tracking-widest">
                85.4B Streams
              </span>
            </div>
          </Link>

          {/* Public Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] uppercase tracking-[0.2em] font-medium transition-all relative py-1 whitespace-nowrap ${
                    isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D4AF37]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            
            {/* Search Trigger */}
            <button
              onClick={openCommandPalette}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-xs font-mono text-zinc-400 hover:text-white"
              aria-label="Search Catalog"
            >
              <Search className="w-3.5 h-3.5 text-gold" />
              <span className="hidden md:inline font-medium tracking-widest uppercase text-[10px]">SEARCH</span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[9px] bg-black/40 text-zinc-500 border border-white/10 rounded-md">⌘K</kbd>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={toggleCart}
              className="relative text-white hover:text-gold transition-colors p-1"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-gold text-obsidian text-[9px] font-bold flex items-center justify-center border-2 border-[#09090B]">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-1 text-white hover:text-gold lg:hidden transition-colors"
              aria-label="Toggle Mobile Menu"
            >
              <Menu className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavSheet isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
