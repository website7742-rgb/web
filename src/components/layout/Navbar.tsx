'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Plus, Menu, X, Instagram, Facebook, Twitter } from 'lucide-react';
import { LOGO_BASE64 } from './logoBase64';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside (handling both mouse & touch events)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      // Safeguard against unmounted DOM nodes (e.g. icon replacement on click)
      if (!target || !document.body.contains(target)) {
        return;
      }

      if (
        menuRef.current && 
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleMenu = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const menuItems = [
    { label: 'ARTISTS', href: '/roster' },
    { label: 'ADVERTISE', href: '/advertise' },
    { label: 'CONTACT US', href: '/contact' },
    { label: 'EU DSA', href: '/eudsa' },
    { label: 'PRIVACY', href: '/privacy' },
    { label: 'TERMS', href: '/terms' },
    { label: 'DMCA', href: '/dmca' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pointer-events-auto">
      <div className="max-w-[1400px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-2 overflow-hidden text-white relative">
        
        {/* LEFT & CENTER-LEFT: BRAND & NAV */}
        <div className="flex items-center gap-3 md:gap-10 shrink-0">
          {/* LOGO */}
          <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={LOGO_BASE64} 
              alt="WorldStarHipHop Official Logo" 
              className="w-auto h-9 sm:h-10 md:h-14 object-contain py-0.5" 
            />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="uppercase text-sm font-semibold tracking-wide hover:text-red-600 transition-colors">
              DISCOVER
            </Link>
            <Link href="/roster" className="uppercase text-sm font-semibold tracking-wide hover:text-red-600 transition-colors">
              ARTISTS
            </Link>
          </div>
        </div>

        {/* RIGHT SECTOR: ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
          {/* SEARCH TRIGGER */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle Search"
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
          >
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          
          <Link 
            href="/submit" 
            className="!bg-[#FF2B2B] !text-white !rounded-none !border-none font-bold uppercase tracking-wider px-2.5 py-1.5 sm:px-5 sm:py-2.5 flex items-center justify-center gap-1 transition-all text-xs sm:text-sm whitespace-nowrap shrink-0 shadow-md transform-gpu active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>SUBMIT</span>
            <span className="hidden sm:inline">DEMO</span>
          </Link>
          
          <Link href="/login" className="uppercase text-sm font-semibold hidden md:block hover:text-red-600 transition-colors">
            SIGN IN
          </Link>

          {/* 3-DOT / HAMBURGER MENU BUTTON */}
          <button 
            ref={buttonRef}
            type="button"
            onClick={toggleMenu}
            className="p-3 -m-2 hover:text-red-600 transition-colors focus:outline-none cursor-pointer relative z-[10001] pointer-events-auto"
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-red-600 pointer-events-none" />
            ) : (
              <Menu className="w-6 h-6 pointer-events-none" />
            )}
          </button>
        </div>

        {/* DROPDOWN MENU PANEL MATCHING REFERENCE ARCHITECTURE */}
        {menuOpen && (
          <div 
            ref={menuRef}
            className="absolute top-full right-4 sm:right-6 w-64 bg-black border border-zinc-800 shadow-2xl p-6 z-[10000] animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="uppercase font-bold text-white text-lg hover:text-red-600 transition-colors tracking-wide block"
                >
                  {item.label}
                </Link>
              ))}

              {/* SOCIAL MEDIA ICONS AT BOTTOM */}
              <div className="flex items-center gap-6 pt-4 mt-2 border-t border-zinc-900 text-white">
                <Image 
                  src={`https://flagcdn.com/w20/us.png`} 
                  alt="USA" 
                  width={20}
                  height={15}
                  className="w-5 h-auto rounded-none opacity-50" 
                />
                <a
                  href="https://instagram.com/worldstar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com/worldstar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com/worldstar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-6 h-6 fill-current" />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {isSearchOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-[#0a0a0a] border-b border-white/10 p-4 z-50 animate-in slide-in-from-top-2">
          <div className="max-w-[1400px] mx-auto flex items-center">
            <Search className="w-5 h-5 text-zinc-400 mr-3" />
            <input 
              type="text" 
              placeholder="Search artists, videos, or exclusive drops..." 
              className="w-full bg-transparent text-white focus:outline-none text-sm md:text-base font-mono"
              autoFocus
            />
            <button onClick={() => setIsSearchOpen(false)} className="text-xs text-zinc-500 hover:text-white uppercase font-bold tracking-widest ml-4">
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
