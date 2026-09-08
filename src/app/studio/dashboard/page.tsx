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
  ChevronRight
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
    `).order('created_at', { ascending: false }).limit(4)
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
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      
      {/* EXECUTIVE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-800 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/10 border border-red-600/30 text-red-500 rounded-sm mb-3">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-widest uppercase font-mono">EXECUTIVE COMMAND CENTER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display">
            ADMIN <span className="text-red-600">DASHBOARD</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono mt-1">
            Real-time platform telemetry, curated media pipeline, and talent operations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-zinc-400 text-[11px]">R2 STREAM PIPELINE:</span>
            <span className="text-emerald-400 font-bold text-[11px]">OPERATIONAL</span>
          </div>
          <Link
            href="/studio/videos"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-sm transition-colors shadow-lg"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>CURATE VIDEO</span>
          </Link>
        </div>
      </div>

      {/* STATS TELEMETRY GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Curated Videos */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Curated Videos</span>
            <Video className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{curatedCount}</div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
            <span>+ {catalogCount} Canonical =</span>
            <span className="text-red-500 font-bold">{totalUnifiedCount} Live</span>
          </div>
        </div>

        {/* Submissions Inbox */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Pending A&R</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{pendingCount}</div>
          <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-400 font-bold">{approvedCount}</span> approved of {totalSubmissions} total
          </div>
        </div>

        {/* Registered Profiles */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Total Accounts</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{userCount}</div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Active creator & listener profiles
          </div>
        </div>

        {/* Verified Catalog */}
        <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[11px] font-mono uppercase font-bold tracking-wider">Official Catalog</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100 / 100</div>
          <div className="text-[11px] text-zinc-400 mt-1">
            100% verified official Hip-Hop tracks
          </div>
        </div>
      </div>

      {/* QUICK SYSTEM MODULES */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 font-mono mb-3">
          SYSTEM OPERATIONS & MODULES
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/studio/videos"
            className="group p-5 bg-zinc-950 border border-zinc-800 hover:border-red-600 transition-all rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500">
                  <Video className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-red-500 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-red-500 transition-colors">
                Curated Videos
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Add, edit metadata, tag premiere features, or remove manual videos.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>{curatedCount} Active Curations</span>
              <span className="text-red-500 font-bold group-hover:translate-x-0.5 transition-transform">Manage &rarr;</span>
            </div>
          </Link>

          <Link
            href="/studio/submissions"
            className="group p-5 bg-zinc-950 border border-zinc-800 hover:border-red-600 transition-all rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Inbox className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-amber-500 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-amber-500 transition-colors">
                A&R Submissions
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Review submitted tracks, audition audio, approve to roster or archive.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span className="text-amber-400 font-bold">{pendingCount} Awaiting Review</span>
              <span className="text-amber-500 font-bold group-hover:translate-x-0.5 transition-transform">Review &rarr;</span>
            </div>
          </Link>

          <Link
            href="/studio/users"
            className="group p-5 bg-zinc-950 border border-zinc-800 hover:border-red-600 transition-all rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
                  <Users className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-blue-500 transition-colors">
                User Directory
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Audit registered users, inspect roles, verify emails and grant admin status.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>{userCount} Profiles</span>
              <span className="text-blue-500 font-bold group-hover:translate-x-0.5 transition-transform">Audit &rarr;</span>
            </div>
          </Link>

          <Link
            href="/studio/roster"
            className="group p-5 bg-zinc-950 border border-zinc-800 hover:border-red-600 transition-all rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500">
                  <UserCheck className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-purple-500 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-purple-500 transition-colors">
                Artist Roster
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Manage signed artist profiles, EPK packages, metrics, and biographies.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Signed Talent</span>
              <span className="text-purple-500 font-bold group-hover:translate-x-0.5 transition-transform">Configure &rarr;</span>
            </div>
          </Link>

          <Link
            href="/studio/site-settings"
            className="group p-5 bg-zinc-950 border border-zinc-800 hover:border-red-600 transition-all rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded bg-zinc-700/20 border border-zinc-700/40 flex items-center justify-center text-zinc-300">
                  <Settings className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-white transition-colors">
                Site Settings & CMS
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Configure Hero spotlight video, homepage banners, and platform metadata.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>CMS Controls</span>
              <span className="text-white font-bold group-hover:translate-x-0.5 transition-transform">Edit CMS &rarr;</span>
            </div>
          </Link>

          <Link
            href="/studio/media"
            className="group p-5 bg-zinc-950 border border-zinc-800 hover:border-red-600 transition-all rounded-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Cloud className="w-4 h-4" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                Cloudflare R2 Media
              </h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                Inspect media assets, storage quotas, and direct CDN streaming delivery.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>CDN Delivery</span>
              <span className="text-cyan-400 font-bold group-hover:translate-x-0.5 transition-transform">Inspect &rarr;</span>
            </div>
          </Link>
        </div>
      </div>

      {/* TWO COLUMN ACTIVITY: RECENT SUBMISSIONS & RECENT CURATED VIDEOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RECENT SUBMISSIONS (2 COLUMNS) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              <span>RECENT TALENT SUBMISSIONS</span>
            </h2>
            <Link
              href="/studio/submissions"
              className="text-xs font-mono text-red-500 hover:text-red-400 flex items-center gap-1"
            >
              <span>View All ({totalSubmissions})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden shadow-xl">
            {recentSubmissions.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs">
                No submissions currently in the pipeline.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-black border-b border-zinc-800 text-[10px] font-mono uppercase text-zinc-500">
                      <th className="p-3.5">Artist & Email</th>
                      <th className="p-3.5">Track</th>
                      <th className="p-3.5">Audio</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-xs font-mono">
                    {recentSubmissions.map((sub: any) => (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white truncate max-w-[140px]">
                            {sub.profiles?.full_name || 'Unknown Artist'}
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate max-w-[140px]">
                            {sub.profiles?.email || 'No email'}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="text-red-500 font-bold uppercase tracking-wide truncate max-w-[150px]">
                            {sub.track_title}
                          </div>
                          <span className="text-[10px] text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded">
                            {sub.genre || 'Hip-Hop'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          {sub.media_url ? (
                            <audio 
                              controls 
                              controlsList="nodownload" 
                              className="h-7 w-28 sm:w-36 opacity-75 hover:opacity-100 transition-opacity"
                              src={sub.media_url} 
                            />
                          ) : (
                            <span className="text-[10px] text-zinc-600 italic">No audio</span>
                          )}
                        </td>
                        <td className="p-3.5">
                          {getStatusBadge(sub.status)}
                        </td>
                        <td className="p-3.5 text-right">
                          <SubmissionActionButtons submissionId={sub.id} currentStatus={sub.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RECENT CURATED VIDEOS (1 COLUMN) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <span>CURATED VIDEO QUEUE</span>
            </h2>
            <Link
              href="/studio/videos"
              className="text-xs font-mono text-red-500 hover:text-red-400 flex items-center gap-1"
            >
              <span>Manage ({curatedCount})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 space-y-3 shadow-xl">
            {recentCurated.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 font-mono text-xs">
                No curated videos added yet.
              </div>
            ) : (
              recentCurated.map((vid: any) => (
                <div 
                  key={vid.id}
                  className="flex items-center gap-3 p-2.5 rounded bg-black/50 border border-zinc-900 hover:border-zinc-800 transition-colors"
                >
                  <div className="relative w-16 h-10 flex-shrink-0 bg-zinc-900 rounded overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={vid.thumbnail_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80'} 
                      alt={vid.title}
                      className="w-full h-full object-cover"
                    />
                    {vid.is_featured && (
                      <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[8px] font-bold px-1 rounded-xs">
                        HOT
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate leading-tight">
                      {vid.title}
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono truncate">
                      {vid.artist_name}
                    </p>
                  </div>
                  <a
                    href={vid.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))
            )}

            <div className="pt-2">
              <Link
                href="/studio/videos"
                className="w-full block text-center py-2 text-xs font-mono font-bold uppercase tracking-wider bg-zinc-900 hover:bg-red-600 text-zinc-300 hover:text-white transition-colors rounded-sm"
              >
                + Curate Another Video
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
