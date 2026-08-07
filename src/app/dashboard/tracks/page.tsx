import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Music, Clock, Activity, CheckCircle2, XCircle } from 'lucide-react';

export default async function DashboardTracksPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: submissions } = await supabase
    .from('submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2">
          MY TRACKS
        </h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Submission History
        </p>
      </div>

      <section className="border border-neutral-800 bg-neutral-950 p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Music className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-black uppercase text-white tracking-widest">TRACK RECORD</h2>
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
              {submissions && submissions.length > 0 ? (
                submissions.map((track) => (
                  <tr key={track.id} className="border-b border-neutral-800/50 hover:bg-neutral-900/50 transition-colors">
                    <td className="py-4 pr-4 font-bold text-white truncate max-w-[200px]">{track.track_title}</td>
                    <td className="py-4 px-4 text-zinc-400">{track.genre || 'EXCLUSIVE'}</td>
                    <td className="py-4 px-4 text-zinc-400 whitespace-nowrap">
                      {new Date(track.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      {track.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] uppercase font-bold tracking-widest rounded-sm whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3" /> APPROVED
                        </span>
                      )}
                      {track.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase font-bold tracking-widest rounded-sm whitespace-nowrap">
                          <XCircle className="w-3 h-3" /> REJECTED
                        </span>
                      )}
                      {track.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] uppercase font-bold tracking-widest rounded-sm whitespace-nowrap">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-zinc-500 italic">
                    No submissions found. Submit a track from the overview tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
