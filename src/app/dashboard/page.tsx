import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Activity, ShieldCheck, LogOut } from 'lucide-react';
import SubmissionWidget from '@/components/dashboard/SubmissionWidget';
import Link from 'next/link';

export const metadata = {
  title: 'Artist Dashboard - WORLDSTAR',
};

export default async function DashboardOverviewPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || 'ARTIST';

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-white selection:text-black pb-24">
      <nav className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-white" />
            <span className="font-bold tracking-widest uppercase text-lg">WORLDSTAR <span className="text-red-600">PORTAL</span></span>
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
              SIGN OUT
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2">
            OVERVIEW
          </h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Welcome back, {fullName}
          </p>
        </div>

        <div className="max-w-xl">
          <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            SUBMIT NEW TRACK
          </h2>
          <SubmissionWidget />
        </div>
      </main>
    </div>
  );
}
