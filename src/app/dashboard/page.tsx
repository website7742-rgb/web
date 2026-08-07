import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { User, Activity, Music, CheckCircle2, Clock, XCircle } from 'lucide-react';
import SubmissionWidget from '@/components/dashboard/SubmissionWidget';

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

  // Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || 'ARTIST';

  // Fetch Submissions Metrics
  const { data: submissions } = await supabase
    .from('submissions')
    .select('status')
    .eq('user_id', user.id);

  const total = submissions?.length || 0;
  const approved = submissions?.filter(s => s.status === 'APPROVED').length || 0;
  const pending = submissions?.filter(s => s.status === 'PENDING').length || 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2">
          OVERVIEW
        </h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Welcome back, {fullName}
        </p>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-neutral-950 border border-neutral-800 p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Music className="w-16 h-16 text-white" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Total Submissions</p>
          <p className="text-4xl font-black text-white">{total}</p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Approved Tracks</p>
          <p className="text-4xl font-black text-emerald-500">{approved}</p>
        </div>

        <div className="bg-neutral-950 border border-neutral-800 p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-16 h-16 text-amber-500" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Pending Reviews</p>
          <p className="text-4xl font-black text-amber-500">{pending}</p>
        </div>
      </div>

      <div className="max-w-xl">
        <h2 className="text-xl font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-600" />
          SUBMIT NEW TRACK
        </h2>
        <SubmissionWidget />
      </div>
    </div>
  );
}
