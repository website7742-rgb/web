'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldAlert,
  Inbox,
  UserCheck,
  HardDrive,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  Globe,
  Play
} from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { useData } from '@/providers/DataContext';
import { createBrowserClient } from '@supabase/ssr';

interface NavItem {
  name: string;
  shortName: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'CORE' | 'MEDIA' | 'TALENT' | 'SYSTEM';
  desc: string;
  badge?: number;
}

export default function AdminNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { showToast } = useUI();
  const { submissions } = useData();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('website7742@gmail.com');
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const pendingCount = submissions.filter(s => s.status === 'PENDING').length;

  // Close mobile drawer automatically when navigating between pages
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileDrawerOpen]);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return;

    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.email) setAdminEmail(user.email);
        if (user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url);
        }
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .maybeSingle();

        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }
      }
    };
    
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      showToast('Secure session terminated.', 'info');
      window.location.href = '/studio';
    } catch (err) {
      showToast('Error terminating session.', 'error');
    }
  };

  const navItems: NavItem[] = [
    { 
      name: 'Command Dashboard', 
      shortName: 'Dashboard',
      path: '/studio/dashboard', 
      icon: LayoutDashboard, 
      category: 'CORE', 
      desc: 'System health & quick metrics' 
    },
    { 
      name: 'Curated Videos & R2', 
      shortName: 'Videos',
      path: '/studio/videos', 
      icon: Video, 
      category: 'MEDIA', 
      desc: 'Cloudflare R2 stream & YouTube' 
    },
    { 
      name: 'A&R Submissions', 
      shortName: 'A&R Inbox',
      path: '/studio/submissions', 
      icon: Inbox, 
      category: 'TALENT', 
      desc: 'Audition demo tracks & approve',
      badge: pendingCount 
    },
    { 
      name: 'Artist Roster', 
      shortName: 'Roster',
      path: '/studio/roster', 
      icon: UserCheck, 
      category: 'TALENT', 
      desc: 'Manage artist profiles & bios' 
    },
    { 
      name: 'User Directory', 
      shortName: 'Users',
      path: '/studio/users', 
      icon: Users, 
      category: 'TALENT', 
      desc: 'Manage admin roles & creators' 
    },
    { 
      name: 'Media Storage Library', 
      shortName: 'Media',
      path: '/studio/media', 
      icon: HardDrive, 
      category: 'MEDIA', 
      desc: 'Direct R2 files & assets' 
    },
    { 
      name: 'Telemetry & Analytics', 
      shortName: 'Analytics',
      path: '/studio/analytics', 
      icon: BarChart3, 
      category: 'SYSTEM', 
      desc: 'View counts & live stream data' 
    },
    { 
      name: 'Site Controls', 
      shortName: 'Settings',
      path: '/studio/site-settings', 
      icon: Settings, 
      category: 'SYSTEM', 
      desc: 'CMS toggles & platform config' 
    },
  ];

  const currentItem = navItems.find(item => item.path === pathname) || navItems[0];

  const categories = [
    { key: 'CORE', label: 'EXECUTIVE OVERVIEW' },
    { key: 'MEDIA', label: 'MEDIA & STREAMING PIPELINE' },
    { key: 'TALENT', label: 'TALENT & TALENT OPERATIONS' },
    { key: 'SYSTEM', label: 'SYSTEM CONFIGURATION' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col md:flex-row antialiased selection:bg-red-600 selection:text-white">
      
      {/* =========================================================================
          1. MOBILE TOP APP BAR (< 768px)
          Compact, responsive 56px sticky bar with branding & hamburger trigger
         ========================================================================= */}
      <header className="md:hidden sticky top-0 z-40 h-14 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Link href="/studio/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-red-600 flex items-center justify-center text-white shadow-[0_0_12px_rgba(220,38,38,0.5)]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-sm uppercase tracking-tight text-white font-display block leading-none">
                WSHH <span className="text-red-500">STUDIO</span>
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mt-0.5">
                CONTROL CENTER
              </span>
            </div>
          </Link>
        </div>

        {/* Current Active Section Badge & Hamburger Button */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
            {currentItem.shortName}
          </span>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(prev => !prev)}
            aria-label="Toggle Navigation Menu"
            className="w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-sm bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:border-red-600 transition-colors active:scale-95 cursor-pointer"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          2. MOBILE SLIDE-OUT DRAWER OVERLAY (< 768px)
          Glassmorphic full navigation drawer with touch safety
         ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-sm bg-zinc-950 border-r border-zinc-800 h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-black/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-sm bg-red-600 flex items-center justify-center text-white">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase text-white font-display">WSHH ADMIN</h3>
                  <p className="text-[9px] font-mono text-zinc-400">MANAGEMENT PORTAL</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-9 h-9 min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Nav Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {categories.map((cat) => {
                const itemsInCat = navItems.filter(item => item.category === cat.key);
                if (itemsInCat.length === 0) return null;

                return (
                  <div key={cat.key} className="space-y-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-500 px-3 block">
                      {cat.label}
                    </span>
                    {itemsInCat.map((item) => {
                      const isActive = pathname === item.path;
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setMobileDrawerOpen(false)}
                          className={`flex items-center justify-between p-3 rounded-sm transition-all min-h-[48px] ${
                            isActive
                              ? 'bg-zinc-900 text-white border-l-4 border-red-600'
                              : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wide leading-none">{item.name}</p>
                              <p className="text-[10px] text-zinc-500 font-mono mt-1">{item.desc}</p>
                            </div>
                          </div>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-zinc-800 bg-black/50 space-y-2">
              <Link
                href="/videos"
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-bold uppercase tracking-wider rounded-sm border border-zinc-800 min-h-[44px]"
              >
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>VIEW LIVE SITE</span>
                <ExternalLink className="w-3 h-3 text-zinc-500 ml-auto" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-xs font-mono font-bold uppercase tracking-wider rounded-sm border border-red-900/40 min-h-[44px]"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>TERMINATE SESSION</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. DESKTOP PERSISTENT SIDEBAR (>= 768px)
          Executive dark theme, organized categories, badges, smooth transitions
         ========================================================================= */}
      <aside className="hidden md:flex w-72 border-r border-zinc-800/80 bg-zinc-950 flex-shrink-0 flex-col sticky top-0 h-screen z-30 shadow-2xl">
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-800/80 bg-black/40">
          <Link href="/studio/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-sm bg-black border border-red-600 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white font-black uppercase tracking-tight text-lg leading-none font-display">
                WORLDSTAR
              </h2>
              <p className="text-[10px] text-zinc-400 font-mono font-bold tracking-widest uppercase mt-1">
                STUDIO CONTROL
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Categories */}
        <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto custom-scrollbar">
          {categories.map((cat) => {
            const itemsInCat = navItems.filter(item => item.category === cat.key);
            if (itemsInCat.length === 0) return null;

            return (
              <div key={cat.key} className="space-y-1">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-500 px-3 block mb-1">
                  {cat.label}
                </span>

                {itemsInCat.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-sm transition-all duration-200 group ${
                        isActive
                          ? 'bg-zinc-900 text-white border-l-4 border-red-600 shadow-md'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-red-500' : 'text-zinc-500 group-hover:text-zinc-300'
                        }`} />
                        <div className="truncate">
                          <p className="text-xs font-bold uppercase tracking-wide truncate">{item.name}</p>
                          <p className="text-[10px] text-zinc-500 font-mono truncate">{item.desc}</p>
                        </div>
                      </div>

                      {item.badge !== undefined && item.badge > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold ml-2">
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                          isActive ? 'text-red-500 translate-x-0.5' : 'text-zinc-700 opacity-0 group-hover:opacity-100'
                        }`} />
                      )}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User Session Footer */}
        <div className="p-4 border-t border-zinc-800/80 bg-black/60 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-red-600/40 flex items-center justify-center text-zinc-300 text-xs overflow-hidden flex-shrink-0">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-none">System Admin</p>
              <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">{adminEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-zinc-900">
            <Link
              href="/videos"
              target="_blank"
              className="flex-1 py-1.5 px-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-colors border border-zinc-800"
            >
              <Globe className="w-3 h-3 text-zinc-400" />
              <span>LIVE SITE</span>
            </Link>
            <button
              onClick={handleLogout}
              title="Terminate Admin Session"
              className="py-1.5 px-3 bg-red-950/30 hover:bg-red-900/50 text-red-400 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-colors border border-red-900/40 cursor-pointer"
            >
              <LogOut className="w-3 h-3" />
              <span>EXIT</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          4. MAIN VIEWPORT & HEADER
         ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 bg-black min-h-screen">
        {/* Desktop Top Header (Hidden on Mobile) */}
        <header className="hidden md:flex h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-8 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span className="text-zinc-600">STUDIO</span>
              <span className="text-zinc-700">/</span>
              <span className="text-red-500 font-bold uppercase tracking-widest">{currentItem.category}</span>
              <span className="text-zinc-700">/</span>
              <span className="text-white font-bold uppercase tracking-wide">{currentItem.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold">R2 STREAM: READY</span>
            </div>
            <Link
              href="/videos"
              target="_blank"
              className="text-xs font-mono text-zinc-400 hover:text-white uppercase font-bold tracking-wider flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors"
            >
              <span>VIEW PUBLIC SITE</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </Link>
          </div>
        </header>

        {/* Content Body (with pb-24 on mobile to accommodate bottom floating dock) */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          {children}
        </div>

        {/* =========================================================================
            5. MOBILE FLOATING DOCK / BOTTOM BAR (< 768px)
            Gives smartphone users 1-tap thumb navigation between key studio tools
           ========================================================================= */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
          {/* 1. Dashboard */}
          <Link
            href="/studio/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded transition-colors ${
              pathname === '/studio/dashboard' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-mono tracking-tight leading-none uppercase">DASH</span>
          </Link>

          {/* 2. Curated Videos */}
          <Link
            href="/studio/videos"
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded transition-colors ${
              pathname === '/studio/videos' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-mono tracking-tight leading-none uppercase">VIDEOS</span>
          </Link>

          {/* 3. Submissions with badge */}
          <Link
            href="/studio/submissions"
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded transition-colors relative ${
              pathname === '/studio/submissions' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <div className="relative">
              <Inbox className="w-4 h-4 mb-1" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-red-600 text-white text-[8px] font-mono font-bold rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-mono tracking-tight leading-none uppercase">A&R</span>
          </Link>

          {/* 4. Roster */}
          <Link
            href="/studio/roster"
            className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded transition-colors ${
              pathname === '/studio/roster' ? 'text-red-500 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-mono tracking-tight leading-none uppercase">ROSTER</span>
          </Link>

          {/* 5. Menu trigger */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            aria-label="Open Full Navigation Menu"
            className="flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] text-zinc-400 hover:text-white rounded transition-colors"
          >
            <Menu className="w-4 h-4 mb-1" />
            <span className="text-[9px] font-mono tracking-tight leading-none uppercase">MENU</span>
          </button>
        </nav>
      </main>
    </div>
  );
}
