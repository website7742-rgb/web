'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Plus, Menu, X, Instagram, Facebook, Twitter, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { LOGO_BASE64 } from './logoBase64';

export function Navbar({ user: initialUser }: { user?: any }) {
  const [user, setUser] = useState<any>(initialUser || null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
      return;
    }
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    try {
      const supabase = createBrowserClient(supabaseUrl, supabaseKey);
      supabase.auth.getSession().then(({ data }) => {
        if (data?.session?.user) {
          setUser(data.session.user);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    } catch {
      // Graceful fallback
    }
  }, [initialUser]);

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
    { label: 'VIDEOS', href: '/videos' },
    ...(user ? [{ label: 'MY PROFILE', href: '/profile' }, { label: 'DASHBOARD', href: '/dashboard' }] : []),
    { label: 'ARTISTS', href: '/roster' },
    { label: 'CONTACT US', href: '/contact' },
    { label: 'LEGAL & PRIVACY', href: '/privacy' },
    ...(!user ? [{ label: 'SIGN IN', href: '/login' }] : []),
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    router.push(`/roster?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-black/90 backdrop-blur-md border-b border-white/10 shadow-2xl pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pointer-events-auto">
      <div className="max-w-[1400px] mx-auto px-2.5 xs:px-4 sm:px-6 md:px-8 h-14 sm:h-16 md:h-20 flex items-center justify-between gap-1.5 sm:gap-4 text-white relative">
        
        {/* LEFT & CENTER-LEFT: BRAND & NAV */}
        <div className="flex items-center gap-2 xs:gap-3 sm:gap-6 md:gap-8 lg:gap-10 shrink-0 h-full">
          {/* LOGO */}
          <Link href="/" className="flex items-center shrink-0 min-h-[44px]" onClick={() => setMenuOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={LOGO_BASE64} 
              alt="WorldStarHipHop Official Logo" 
              className="w-auto h-8 xs:h-9 sm:h-10 md:h-12 lg:h-14 object-contain py-0.5" 
            />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8 h-full">
            <Link href="/" className={`uppercase text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 relative h-full flex items-center ${pathname === '/' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
              DISCOVER
              {pathname === '/' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] rounded-t-sm" />}
            </Link>
            <Link href="/videos" className={`uppercase text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 relative h-full flex items-center ${pathname === '/videos' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
              VIDEOS
              {pathname === '/videos' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] rounded-t-sm" />}
            </Link>
            <Link href="/roster" className={`uppercase text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 relative h-full flex items-center ${pathname === '/roster' ? 'text-white' : 'text-zinc-400 hover:text-white'}`}>
              ARTISTS
              {pathname === '/roster' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] rounded-t-sm" />}
            </Link>
          </div>
        </div>

        {/* RIGHT SECTOR: ACTIONS */}
        <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-3 md:gap-4 shrink-0 h-full">
          {/* HEADER CTAS */}
          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-3 mr-0.5 sm:mr-1 md:mr-2">
            {!user ? (
              <Link 
                href="/login"
                className="bg-transparent hover:bg-white/10 active:bg-white/20 text-white font-bold uppercase text-[11px] xs:text-xs md:text-sm px-2.5 xs:px-3 md:px-4 py-1.5 sm:py-2 rounded-sm tracking-wider transition-all duration-300 border border-white/20 whitespace-nowrap min-h-[36px] sm:min-h-[40px] md:min-h-[44px] flex items-center justify-center"
              >
                SIGN IN
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-4 ml-1 sm:ml-2 border-l border-white/20 pl-2 xs:pl-2.5 sm:pl-4">
                <Link 
                  href="/profile"
                  className="flex items-center gap-1 sm:gap-2 text-white hover:text-red-500 transition-colors uppercase font-bold text-[11px] xs:text-xs md:text-sm tracking-wider min-h-[44px] whitespace-nowrap"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                  <span className="hidden sm:inline">MY </span>PROFILE
                </Link>
                <form action="/auth/signout" method="post" className="m-0 p-0 flex items-center">
                  <button 
                    type="submit" 
                    className="text-zinc-400 hover:text-red-500 uppercase font-bold text-[9.5px] xs:text-[10px] md:text-xs tracking-wider transition-colors cursor-pointer min-h-[44px] flex items-center px-1 whitespace-nowrap"
                  >
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
            className="p-1.5 xs:p-2 min-h-[44px] min-w-[38px] xs:min-w-[44px] flex items-center justify-center hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white"
          >
            {isSearchOpen ? <X className="w-4.5 h-4.5 sm:w-5 sm:h-5" /> : <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5" />}
          </button>

          {/* 3-DOT / HAMBURGER MENU BUTTON */}
          <button 
            ref={buttonRef}
            type="button"
            onClick={toggleMenu}
            className="p-1.5 xs:p-2 min-h-[44px] min-w-[38px] xs:min-w-[44px] flex items-center justify-center hover:text-red-600 transition-colors focus:outline-none cursor-pointer relative z-[10001] pointer-events-auto"
            aria-label="Toggle Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6 text-red-600 pointer-events-none" />
            ) : (
              <Menu className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6 pointer-events-none" />
            )}
          </button>
        </div>

        {/* DROPDOWN MENU PANEL MATCHING REFERENCE ARCHITECTURE */}
        {menuOpen && (
          <div 
            ref={menuRef}
            className="absolute top-full right-2 sm:right-6 max-w-[calc(100vw-1rem)] w-64 sm:w-72 bg-black border border-zinc-800 shadow-2xl p-5 sm:p-6 z-[10000] animate-in fade-in slide-in-from-top-2 duration-150"
          >
            <div className="flex flex-col space-y-3 sm:space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="uppercase font-bold text-white text-sm sm:text-base hover:text-red-600 transition-colors tracking-widest block py-1.5 min-h-[44px] flex items-center"
                >
                  {item.label}
                </Link>
              ))}

              {/* SOCIAL MEDIA ICONS AT BOTTOM */}
              <div className="flex items-center gap-5 sm:gap-6 pt-4 mt-2 border-t border-zinc-900 text-white">
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
        <div className="absolute top-full left-0 w-full bg-[#0a0a0a] border-b border-white/10 p-3 sm:p-4 z-50 animate-in slide-in-from-top-2 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="max-w-[1400px] mx-auto flex items-center gap-2">
            <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-zinc-400 mr-2 shrink-0" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artists, videos, or exclusive drops..." 
              className="w-full bg-transparent text-white focus:outline-none text-sm sm:text-base font-mono min-h-[44px]"
              autoFocus
            />
            <button type="submit" className="text-[11px] sm:text-xs bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest min-h-[44px] flex items-center justify-center px-3 sm:px-4 rounded-sm transition-colors cursor-pointer shrink-0">
              Search
            </button>
            <button type="button" onClick={() => setIsSearchOpen(false)} className="text-[11px] sm:text-xs text-zinc-400 hover:text-white uppercase font-bold tracking-widest min-h-[44px] flex items-center justify-center px-2 cursor-pointer shrink-0">
              Close
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
