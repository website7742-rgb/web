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
      <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 md:px-8 py-3 sm:py-4 transition-all duration-300">
        <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto glass-panel-gold rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl border border-gold/30">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-gold via-gold-light to-violet p-0.5 shadow-[0_0_20px_rgba(212,175,55,0.35)] group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-full h-full bg-obsidian rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-gold transition-colors">
                AETHERIA
              </span>
              <span className="hidden xl:inline-block text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-gold/15 text-gold border border-gold/30 font-bold whitespace-nowrap">
                85.4B STREAMS
              </span>
            </div>
          </Link>

          {/* Public Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-display font-extrabold tracking-wider transition-all relative py-1 whitespace-nowrap ${
                    isActive ? 'text-gold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full shadow-[0_0_10px_#d4af37]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3.5 flex-shrink-0">
            {/* Search Trigger */}
            <button
              onClick={openCommandPalette}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-gold/40 transition-all text-xs font-mono min-h-[44px]"
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4 text-gold" />
              <span className="hidden md:inline font-bold">SEARCH</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] bg-white/10 rounded text-zinc-400">⌘K</kbd>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={toggleCart}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-gold transition-colors relative min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-gold text-obsidian text-[10px] font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white lg:hidden min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileNavSheet isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </>
  );
}
