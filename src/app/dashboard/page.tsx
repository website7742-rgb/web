import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LogOut, User, ShieldCheck, Mail, Calendar, Activity, Upload, Music, Clock } from 'lucide-react';

export const metadata = {
  title: 'Artist Dashboard - WORLDSTAR',
};

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Handled in middleware
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // Fetch verified profile from public.profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || 'AUTHORIZED ARTIST';
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || null;
  const email = profile?.email || user.email;
  const createdDate = new Date(profile?.created_at || user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-white selection:text-black pb-24">
      
      {/* Top Navigation */}
      <nav className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-white" />
            <span className="font-bold tracking-widest uppercase text-lg">WORLDSTAR <span className="text-red-600">PORTAL</span></span>
          </div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
              SIGN OUT
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
            ARTIST DASHBOARD
          </h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Identity Verified • Authorized Access Granted
          </p>
        </div>

        {/* 1. HERO PROFILE BLOCK */}
        <section className="border border-neutral-800 bg-neutral-950 p-8 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar Section */}
          <div className="shrink-0 relative">
            <div className="w-32 h-32 bg-black border border-neutral-800 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              ) : (
                <User className="w-12 h-12 text-zinc-600" />
              )}
            </div>
            <div className="absolute -bottom-3 -right-3 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              ARTIST
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 space-y-6 w-full">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">
                Primary Alias
              </label>
              <div className="text-3xl font-black text-white tracking-wide uppercase">
                {fullName}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Registered Email
                </label>
                <div className="text-sm font-mono text-zinc-300">
                  {email}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  Clearance Granted
                </label>
                <div className="text-sm font-mono text-zinc-300">
                  {createdDate}
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  System ID
                </label>
                <div className="text-xs font-mono text-zinc-700 truncate w-full">
                  {user.id}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* 2. MUSIC SUBMISSION WIDGET */}
          <section className="lg:col-span-1 border border-neutral-800 bg-neutral-950 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-black uppercase text-white tracking-widest">SUBMIT TRACK</h2>
            </div>
            
            <form className="space-y-5">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Track Title</label>
                <input type="text" placeholder="e.g. STREET SYMPHONY" className="w-full bg-black border border-neutral-800 p-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Genre</label>
                <select className="w-full bg-black border border-neutral-800 p-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-sm appearance-none">
                  <option>HIP HOP</option>
                  <option>R&B</option>
                  <option>TRAP</option>
                  <option>DRILL</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2 block">Media Link (SoundCloud/Drive)</label>
                <input type="url" placeholder="https://" className="w-full bg-black border border-neutral-800 p-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono text-sm" />
              </div>
              <button type="button" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-4 transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4">
                <span>DEPLOY SUBMISSION</span>
                <Upload className="w-4 h-4" />
              </button>
            </form>
          </section>

          {/* 3. TRACKS HISTORY TABLE */}
          <section className="lg:col-span-2 border border-neutral-800 bg-neutral-950 p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Music className="w-5 h-5 text-red-600" />
              <h2 className="text-xl font-black uppercase text-white tracking-widest">SUBMISSION HISTORY</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs font-bold uppercase tracking-widest text-zinc-500">
                    <th className="pb-3 pr-4 font-normal">Track Name</th>
                    <th className="pb-3 px-4 font-normal">Genre</th>
                    <th className="pb-3 px-4 font-normal">Date Submitted</th>
                    <th className="pb-3 pl-4 font-normal text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-mono text-zinc-300">
                  {/* Placeholder Rows */}
                  <tr className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-white">MIDNIGHT RIDER</td>
                    <td className="py-4 px-4 text-zinc-400">TRAP</td>
                    <td className="py-4 px-4 text-zinc-400">Aug 07, 2026</td>
                    <td className="py-4 pl-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-widest">
                        <Clock className="w-3 h-3" /> PENDING
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-neutral-900/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-white">STREET SYMPHONY</td>
                    <td className="py-4 px-4 text-zinc-400">HIP HOP</td>
                    <td className="py-4 px-4 text-zinc-400">Jul 21, 2026</td>
                    <td className="py-4 pl-4 text-right">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] uppercase font-bold tracking-widest">
                        <Activity className="w-3 h-3" /> EVALUATING
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
              <p className="text-xs text-zinc-500 font-mono">
                No further records found. Keep working.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
