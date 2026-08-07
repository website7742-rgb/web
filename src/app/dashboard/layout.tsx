import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ShieldCheck, LogOut, LayoutDashboard, Music, Settings } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Client Portal - WORLDSTAR',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {}
      }
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-white selection:text-black flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-black border-r border-neutral-900 flex flex-col shrink-0">
        <div className="h-20 flex items-center px-6 border-b border-neutral-900 shrink-0">
          <ShieldCheck className="w-5 h-5 text-red-600 mr-2" />
          <span className="font-bold tracking-widest uppercase text-sm text-white">WORLDSTAR</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-neutral-900/50 rounded-sm transition-colors whitespace-nowrap">
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            Overview
          </Link>
          <Link href="/dashboard/tracks" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-neutral-900/50 rounded-sm transition-colors whitespace-nowrap">
            <Music className="w-4 h-4 shrink-0" />
            My Tracks
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-neutral-900/50 rounded-sm transition-colors whitespace-nowrap">
            <Settings className="w-4 h-4 shrink-0" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-900 shrink-0">
          <form action="/auth/signout" method="post">
            <button type="submit" className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors cursor-pointer py-3 border border-neutral-900 hover:border-red-900/50 rounded-sm">
              <LogOut className="w-4 h-4" />
              SIGN OUT
            </button>
          </form>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header (Optional) */}
        <header className="md:hidden h-16 border-b border-neutral-900 flex items-center px-6 bg-black shrink-0">
          <span className="font-bold tracking-widest uppercase text-xs text-zinc-500">CLIENT PORTAL</span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
