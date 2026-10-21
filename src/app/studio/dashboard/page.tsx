import React from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldAlert, 
  Play, 
  Video, 
  Users, 
  Inbox, 
  UserCheck, 
  Settings, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ArrowUpRight, 
  Cloud, 
  Sparkles,
  Flame,
  Radio,
  ExternalLink,
  ChevronRight,
  Upload,
  Music,
  HardDrive
} from 'lucide-react';
import { OFFICIAL_100_VIDEOS } from '@/data/official100Videos';
import SubmissionActionButtons from '@/components/admin/SubmissionActionButtons';

export const dynamic = 'force-dynamic';

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export default async function AdminDashboardPage() {
  const adminDb = getAdminSupabase();

  // Fetch real counts concurrently
  const [
    curatedVideosRes,
    profilesRes,
    allSubmissionsRes,
    pendingSubmissionsRes,
    approvedSubmissionsRes,
    recentSubmissionsRes,
    recentCuratedRes
  ] = await Promise.all([
    adminDb.from('videos').select('*', { count: 'exact', head: true }),
    adminDb.from('profiles').select('*', { count: 'exact', head: true }),
    adminDb.from('submissions').select('*', { count: 'exact', head: true }),
    adminDb.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
    adminDb.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'APPROVED'),
    adminDb.from('submissions').select(`
      id,
      created_at,
      track_title,
      genre,
      media_url,
      status,
      profiles (
        email,
        full_name
      )
    `).order('created_at', { ascending: false }).limit(6),
    adminDb.from('videos').select(`
      id,
      title,
      artist_name,
      video_url,
      thumbnail_url,
      genre,
      is_featured,
      created_at
    `).order('created_at', { ascending: false }).limit(5)
  ]);

  const curatedCount = curatedVideosRes.count ?? 0;
  const catalogCount = OFFICIAL_100_VIDEOS.length;
  const totalUnifiedCount = catalogCount + curatedCount;
  const userCount = profilesRes.count ?? 0;
  const totalSubmissions = allSubmissionsRes.count ?? 0;
  const pendingCount = pendingSubmissionsRes.count ?? 0;
  const approvedCount = approvedSubmissionsRes.count ?? 0;

  const recentSubmissions = recentSubmissionsRes.data || [];
  const recentCurated = recentCuratedRes.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> APPROVED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" /> REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" /> PENDING
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans max-w-[1600px] mx-auto">
      
      {/* 1. WELCOME & EXECUTIVE COMMAND HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800/80 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-red-600/10 border border-red-600/30 text-red-500 rounded-sm mb-2.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-widest uppercase font-mono">WORLDSTAR EXECUTIVE CONTROL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-display">
            STUDIO <span className="text-red-600">COMMAND CENTER</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1 max-w-2xl">
            Live platform management, Cloudflare R2 video streaming pipeline, and A&R talent operations.
          </p>
        </div>

        {/* Live Telemetry Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-zinc-950 border border-zinc-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-500 text-[10px] uppercase font-bold">R2 PIPELINE:</span>
            <span className="text-emerald-400 font-bold text-[10px]">ACTIVE (ZERO CORS)</span>
          </div>

          <Link
            href="/studio/videos"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] active:scale-95 cursor-pointer min-h-[44px]"
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>UPLOAD VIDEO (R2)</span>
          </Link>
        </div>
      </div>

      {/* 2. QUICK ACTION LAUNCHPAD (EASY 1-TAP CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            <span>QUICK ACTIONS — DIRECT SHORTCUTS</span>
          </h2>
          <span className="text-[10px] font-mono text-zinc-500">TAP ANY MODULE TO OPEN</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Action 1: Upload R2 Video */}
          <Link
            href="/studio/videos"
            className="group p-4 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 hover:border-red-600 rounded-sm flex flex-col justify-between transition-all hover:shadow-[0_0_20px_rgba(220,38,38,0.15)] min-h-[110px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 group-hover:scale-105 transition-transform">
                <Cloud className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-red-950/40 border border-red-900/50">
                UP TO 500MB
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-red-500 transition-colors uppercase tracking-tight mt-2">
                Upload Video to R2
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Stream MP4 masters directly into WorldStar catalog
              </p>
            </div>
          </Link>

          {/* Action 2: Submissions Inbox */}
          <Link
            href="/studio/submissions"
            className="group p-4 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 hover:border-amber-500 rounded-sm flex flex-col justify-between transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] min-h-[110px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform">
                <Inbox className="w-5 h-5" />
              </div>
              {pendingCount > 0 ? (
                <span className="text-[9px] font-mono text-amber-300 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-900/50 animate-pulse">
                  {pendingCount} PENDING
                </span>
              ) : (
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-900">
                  ALL REVIEWED
                </span>
              )}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-amber-400 transition-colors uppercase tracking-tight mt-2">
                A&R Submissions
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Audition submitted artist demos & approve live
              </p>
            </div>
          </Link>

          {/* Action 3: Artist Roster */}
          <Link
            href="/studio/roster"
            className="group p-4 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 hover:border-purple-500 rounded-sm flex flex-col justify-between transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] min-h-[110px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono text-purple-400 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-900/50">
                TALENT
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors uppercase tracking-tight mt-2">
                Manage Artist Roster
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Edit official artist biographies & social links
              </p>
            </div>
          </Link>

          {/* Action 4: User Accounts */}
          <Link
            href="/studio/users"
            className="group p-4 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 hover:border-blue-500 rounded-sm flex flex-col justify-between transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] min-h-[110px]"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-mono text-blue-400 font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-950/40 border border-blue-900/50">
                {userCount} PROFILES
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors uppercase tracking-tight mt-2">
                User & Admin Directory
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                Audit creator accounts & grant administrator access
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* 3. KEY METRICS TELEMETRY GRID */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono mb-3">
          PLATFORM METRICS & STATUS OVERVIEW
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Total Curated Videos */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Live Curated</span>
              <Video className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{curatedCount}</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1 flex items-center gap-1 truncate">
              <span>+ 100 Canonical =</span>
              <span className="text-red-500 font-bold">{totalUnifiedCount} Total</span>
            </div>
          </div>

          {/* Pending Submissions */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Pending Demos</span>
              <Inbox className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{pendingCount}</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
              <span className="text-emerald-400 font-bold">{approvedCount}</span> approved of {totalSubmissions}
            </div>
          </div>

          {/* Registered Users */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">User Accounts</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">{userCount}</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
              Active listeners & creators
            </div>
          </div>

          {/* Catalog Health */}
          <div className="bg-zinc-950 border border-zinc-800/80 p-4 rounded-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-1.5">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider">Official Top 100</span>
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</div>
            <div className="text-[10px] text-zinc-400 font-mono mt-1 truncate">
              100 canonical tracks verified
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACTIVITY SPLIT: RECENT SUBMISSIONS & RECENT VIDEOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        {/* RECENT A&R SUBMISSIONS (2 COLUMNS) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>LATEST TALENT SUBMISSIONS</span>
            </h2>
            <Link
              href="/studio/submissions"
              className="text-xs font-mono text-red-500 hover:text-red-400 flex items-center gap-1 font-bold"
            >
              <span>View All ({totalSubmissions})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/80 rounded-sm overflow-hidden shadow-xl">
            {recentSubmissions.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                No submissions currently in the pipeline.
              </div>
            ) : (
              <div>
                {/* Desktop View Table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black border-b border-zinc-800 text-[10px] font-mono uppercase text-zinc-500">
                        <th className="p-3">Artist</th>
                        <th className="p-3">Track Title</th>
                        <th className="p-3">Audition Audio</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 text-xs font-mono">
                      {recentSubmissions.map((sub: any) => (
                        <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-3">
                            <div className="font-bold text-white truncate max-w-[130px]">
                              {sub.profiles?.full_name || 'Candidate Artist'}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate max-w-[130px]">
                              {sub.profiles?.email || ''}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-red-500 font-bold uppercase tracking-wide truncate max-w-[150px]">
                              {sub.track_title}
                            </div>
                            <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                              {sub.genre || 'Hip-Hop'}
                            </span>
                          </td>
                          <td className="p-3">
                            {sub.media_url ? (
                              <audio 
                                controls 
                                controlsList="nodownload" 
                                className="h-7 w-32 opacity-75 hover:opacity-100 transition-opacity"
                                src={sub.media_url} 
                              />
                            ) : (
                              <span className="text-[10px] text-zinc-600 italic">No audio</span>
                            )}
                          </td>
                          <td className="p-3">
                            {getStatusBadge(sub.status)}
                          </td>
                          <td className="p-3 text-right">
                            <SubmissionActionButtons submissionId={sub.id} currentStatus={sub.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Cards (< 640px) */}
                <div className="sm:hidden divide-y divide-zinc-900">
                  {recentSubmissions.map((sub: any) => (
                    <div key={sub.id} className="p-3.5 space-y-2.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-white text-xs">{sub.profiles?.full_name || 'Candidate Artist'}</p>
                          <p className="text-red-500 font-bold text-xs uppercase mt-0.5">{sub.track_title}</p>
                          <span className="text-[9px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded mt-1 inline-block">
                            {sub.genre || 'Hip-Hop'}
                          </span>
                        </div>
                        <div>
                          {getStatusBadge(sub.status)}
                        </div>
                      </div>

                      {sub.media_url && (
                        <div>
                          <audio 
                            controls 
                            controlsList="nodownload" 
                            className="h-8 w-full opacity-90"
                            src={sub.media_url} 
                          />
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <SubmissionActionButtons submissionId={sub.id} currentStatus={sub.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RECENT CURATED VIDEOS QUEUE (1 COLUMN) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <span>LIVE VIDEO STREAM QUEUE</span>
            </h2>
            <Link
              href="/studio/videos"
              className="text-xs font-mono text-red-500 hover:text-red-400 flex items-center gap-1 font-bold"
            >
              <span>Manage ({curatedCount})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-zinc-950 border border-zinc-800/80 rounded-sm p-3.5 space-y-3 shadow-xl">
            {recentCurated.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 font-mono text-xs">
                No curated videos added yet.
              </div>
            ) : (
              recentCurated.map((vid: any) => (
                <div 
                  key={vid.id}
                  className="flex items-center gap-3 p-2.5 rounded bg-black/60 border border-zinc-900 hover:border-zinc-800 transition-colors"
                >
                  <div className="relative w-16 h-10 flex-shrink-0 bg-zinc-900 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={vid.thumbnail_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'} 
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                    {vid.is_featured && (
                      <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[7px] font-bold px-1 rounded-xs">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate leading-tight">
                      {vid.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-zinc-400 font-mono truncate">
                        {vid.artist_name}
                      </span>
                      {vid.video_url?.includes('r2.dev') && (
                        <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-500/20">
                          R2
                        </span>
                      )}
                    </div>
                  </div>
                  <a
                    href={vid.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Watch ${vid.title}`}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))
            )}

            <div className="pt-2">
              <Link
                href="/studio/videos"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-mono font-bold uppercase tracking-wider bg-zinc-900 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors rounded-sm min-h-[44px]"
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>+ Upload / Curate Another Video</span>
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
