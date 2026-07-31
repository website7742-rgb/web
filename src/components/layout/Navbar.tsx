'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Plus, Menu, X, Instagram, Facebook, Twitter } from 'lucide-react';
import { LOGO_BASE64 } from './logoBase64';

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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

  const toggleMenu = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const menuItems = [
    { label: 'ADVERTISE', href: '/advertise' },
    { label: 'CONTACT US', href: '/contact' },
    { label: 'EU DSA', href: '/eudsa' },
    { label: 'PRIVACY', href: '/privacy' },
    { label: 'TERMS', href: '/terms' },
    { label: 'DMCA', href: '/dmca' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pointer-events-auto">
      <div className="max-w-[1400px] mx-auto px-4 h-16 md:h-20 flex items-center justify-between text-white relative">
        
        {/* LEFT & CENTER-LEFT: BRAND & NAV */}
        <div className="flex items-center gap-6 md:gap-10">
          {/* LOGO */}
          <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={LOGO_BASE64} 
              alt="WorldStarHipHop Official Logo" 
              className="w-auto h-10 md:h-14 object-contain py-0.5" 
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
        <div className="flex items-center gap-4 md:gap-6">
          {/* SEARCH TRIGGER / BAR */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <div className="flex items-center bg-[#111] border border-zinc-700 px-2 py-1 rounded">
                <input
                  type="text"
                  placeholder="SEARCH WORLDSTAR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white uppercase focus:outline-none w-36 sm:w-48"
                  autoFocus
                />
                <button 
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="p-2 -m-2 focus:outline-none"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4 text-zinc-400 hover:text-white cursor-pointer ml-1" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-3 -m-3 focus:outline-none"
                aria-label="Open search"
              >
                <Search className="w-5 h-5 cursor-pointer hover:text-red-600 transition-colors" />
              </button>
            )}
          </div>
          
          <Link 
            href="/submit" 
            className="bg-[#E50914] hover:bg-red-700 text-white flex items-center gap-1 font-bold text-sm px-3 py-1.5 rounded-sm uppercase transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">SUBMIT DEMO</span>
            <span className="sm:hidden">SUBMIT</span>
          </Link>
          
          <Link href="/login" className="uppercase text-sm font-semibold hidden md:block hover:text-red-600 transition-colors">
            SIGN IN
          </Link>

          {/* 3-DOT / HAMBURGER MENU BUTTON */}
          <button 
            ref={buttonRef}
            type="button"
            onClick={toggleMenu}
            onTouchEnd={(e) => {
              e.preventDefault();
              toggleMenu(e);
            }}
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
    </nav>
  );
}
