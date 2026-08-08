import React from 'react';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { ShieldAlert, Play, CheckCircle2, XCircle, Clock, Search, Filter } from 'lucide-react';
import SubmissionActionButtons from '@/components/admin/SubmissionActionButtons';

export const dynamic = 'force-dynamic'; // Ensures this page is always SSR

export default async function AdminControlPanel() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {}
    }
  });

  // Fetch all submissions joined with profiles
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select(`
      id,
      created_at,
      track_title,
      genre,
      media_url,
      status,
      artist_id,
      profiles (
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching submissions:', error);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3 h-3" /> APPROVED</span>;
      case 'REJECTED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20"><XCircle className="w-3 h-3" /> REJECTED</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20"><Clock className="w-3 h-3" /> PENDING</span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-sans animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="max-w-[1600px] mx-auto mb-8 border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 rounded-sm mb-4">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase">RESTRICTED ADMIN ZONE</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white mb-2 font-display">A&R CONTROL PANEL</h1>
          <p className="text-sm text-zinc-400 font-mono">Review, evaluate, and manage all incoming global track submissions.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search artists or tracks..." 
              className="bg-neutral-950 border border-neutral-800 focus:border-red-600 text-sm font-mono px-4 py-2 pl-9 text-white outline-none w-64 transition-colors"
            />
          </div>
          <Link href="/admin/videos" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-sm transition-colors shadow-md">
            <Play className="w-4 h-4 fill-current" /> CURATE YOUTUBE VIDEOS
          </Link>
        </div>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="max-w-[1600px] mx-auto bg-[#0a0a0a] border border-neutral-800 shadow-2xl rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950 border-b border-neutral-800">
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Artist Info</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Track Details</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 w-72">Inline Evaluation (Audio)</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Status</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {(!submissions || submissions.length === 0) ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-zinc-500 font-mono text-sm">
                    No track submissions found in the database.
                  </td>
                </tr>
              ) : (
                submissions.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-white mb-1">{sub.profiles?.full_name || 'Unknown Artist'}</div>
                      <div className="text-xs text-zinc-500 font-mono">{sub.profiles?.email || 'No email provided'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-red-500 uppercase tracking-widest text-sm mb-1">{sub.track_title}</div>
                      <div className="text-xs text-zinc-400 font-mono inline-block bg-neutral-900 px-2 py-0.5 rounded-sm">{sub.genre}</div>
                    </td>
                    <td className="p-4 align-middle">
                      {sub.media_url ? (
                        <audio 
                          controls 
                          controlsList="nodownload"
                          className="h-8 w-full max-w-[240px] opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                          src={sub.media_url}
                        >
                          Your browser does not support the audio element.
                        </audio>
                      ) : (
                        <span className="text-xs text-zinc-600 font-mono italic">No audio file attached.</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getStatusBadge(sub.status)}
                      <div className="text-[10px] text-zinc-600 font-mono mt-2">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <SubmissionActionButtons submissionId={sub.id} currentStatus={sub.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
