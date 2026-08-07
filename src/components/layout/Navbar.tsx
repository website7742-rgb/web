'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Plus, Menu, X, Instagram, Facebook, Twitter, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LOGO_BASE64 } from './logoBase64';

export function Navbar({ user }: { user?: any }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

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
    { label: 'DISCOVER', href: '/' },
    { label: 'VIDEOS SHOWCASE 🎬', href: '/videos' },
    { label: 'ARTISTS', href: '/roster' },
    { label: 'SUBMIT DEMO', href: '/submit-demo' },
    { label: 'ADVERTISE', href: '/advertise' },
    { label: 'CONTACT US', href: '/contact' },
    { label: 'EU DSA', href: '/eudsa' },
    { label: 'PRIVACY', href: '/privacy' },
    { label: 'TERMS', href: '/terms' },
    { label: 'DMCA', href: '/dmca' },
    { label: 'SIGN IN', href: '/login' },
    { label: 'DASHBOARD', href: '/dashboard' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pointer-events-auto">
      <div className="max-w-[1400px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between gap-2 text-white relative">
        
        {/* LEFT & CENTER-LEFT: BRAND & NAV */}
        <div className="flex items-center gap-3 md:gap-10 shrink-0 h-full">
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
          <div className="hidden md:flex items-center space-x-8 h-full">
            <Link href="/" className={`uppercase text-sm font-semibold tracking-wide transition-all duration-300 relative h-full flex items-center ${pathname === '/' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
              DISCOVER
              {pathname === '/' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] rounded-t-sm" />}
            </Link>
            <Link href="/roster" className={`uppercase text-sm font-semibold tracking-wide transition-all duration-300 relative h-full flex items-center ${pathname === '/roster' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
              ARTISTS
              {pathname === '/roster' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] rounded-t-sm" />}
            </Link>
            <Link href="/videos" className="uppercase text-sm font-bold tracking-wide text-red-500 hover:text-red-400 transition-colors flex items-center gap-1.5 px-3 py-1 bg-red-600/10 border border-red-600/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>VIDEOS</span>
            </Link>
          </div>
        </div>

        {/* RIGHT SECTOR: ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0 h-full">
          {/* HEADER CTAS */}
          <div className="hidden md:flex items-center gap-3 mr-2">
            <Link 
              href="/dashboard"
              className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm px-4 py-2 rounded-sm tracking-wider transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
            >
              SUBMIT DEMO
            </Link>
            {!user ? (
              <Link 
                href="/login"
                className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-sm px-4 py-2 rounded-sm tracking-wider transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
              >
                SIGN IN
              </Link>
            ) : (
              <div className="flex items-center gap-4 ml-2 border-l border-white/20 pl-4">
                <Link 
                  href="/dashboard"
                  className="flex items-center gap-2 text-white hover:text-red-500 transition-colors uppercase font-bold text-sm tracking-widest"
                >
                  <User className="w-4 h-4" />
                  DASHBOARD
                </Link>
                <form action="/auth/signout" method="post" className="m-0 p-0 flex items-center">
                  <button type="submit" className="text-zinc-500 hover:text-red-500 uppercase font-bold text-[10px] tracking-widest transition-colors cursor-pointer">
                    LOG OUT
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* SEARCH TRIGGER */}
          <button 
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            aria-label="Toggle Search"
            className="p-1.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
          >
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>

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
