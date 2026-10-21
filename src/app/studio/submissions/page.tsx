'use client';

import React, { useState } from 'react';
import { useData } from '@/providers/DataContext';
import { Sparkles, ShieldCheck, Clock, FileText, Music, Video, Instagram, PhoneCall, Copy, CheckCircle2, XCircle } from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';
import { PaginationControls } from '@/components/ui/PaginationControls';

function resolveStorageUrl(urlOrPath?: string): string {
  if (!urlOrPath) return '';
  if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
    return urlOrPath;
  }
  const r2Base = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-5949778404be4a59a2f903c5cae6278a.r2.dev';
  const cleanPath = urlOrPath.replace(/^\/+/, '');
  return `${r2Base}/${cleanPath}`;
}

export default function AdminSubmissionsPage() {
  const { submissions, approveSubmission, rejectSubmission } = useData();
  const { showToast } = useUI();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [adminNotesInput, setAdminNotesInput] = useState<{ [key: string]: string }>({});
  const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const countPending = submissions.filter(s => s.status === 'PENDING').length;
  const countApproved = submissions.filter(s => s.status === 'APPROVED').length;
  const countRejected = submissions.filter(s => s.status === 'REJECTED').length;

  const filteredSubmissions = submissions.filter(s => filter === 'ALL' || s.status === filter);
  const totalPages = Math.ceil(filteredSubmissions.length / pageSize);
  const paginatedSubmissions = filteredSubmissions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = (tab: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setFilter(tab);
    setCurrentPage(1);
  };

  const handleApprove = (id: string, name: string) => {
    setLoadingIds(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      const notes = adminNotesInput[id] || 'Approved by WorldStar Executive A&R Board.';
      approveSubmission(id, notes);
      showToast(`SUCCESS! ${name} approved and published live to Roster!`, 'success');
      setLoadingIds(prev => ({ ...prev, [id]: false }));
    }, 400);
  };

  const handleReject = (id: string, name: string) => {
    setLoadingIds(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      const notes = adminNotesInput[id] || 'Declined by A&R Board.';
      rejectSubmission(id, notes);
      showToast(`${name} submission rejected and archived.`, 'info');
      setLoadingIds(prev => ({ ...prev, [id]: false }));
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono font-bold uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>A&amp;R TALENT INBOX</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight uppercase">
            SUBMISSION <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">INBOX</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1">
            Review artist applications, listen to audio demos, watch R2 video auditions, and approve to live catalog.
          </p>
        </div>

        {/* Filter Pills - scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {(
            [
              { key: 'PENDING', label: 'PENDING', count: countPending },
              { key: 'APPROVED', label: 'APPROVED', count: countApproved },
              { key: 'REJECTED', label: 'REJECTED', count: countRejected },
              { key: 'ALL', label: 'ALL', count: submissions.length },
            ] as const
          ).map(tab => (
            <button
              key={tab.key}
              onClick={() => handleFilterChange(tab.key)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap min-h-[40px] flex items-center gap-2 cursor-pointer ${
                filter === tab.key
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                filter === tab.key ? 'bg-black/40 text-white' : 'bg-white/10 text-zinc-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-6">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center text-zinc-400 font-mono space-y-3">
            <Clock className="w-10 h-10 text-red-500 mx-auto" />
            <h3 className="text-base sm:text-lg font-bold text-white uppercase">NO SUBMISSIONS FOUND</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              There are currently no submissions matching the <span className="text-red-400 font-bold font-mono">[{filter}]</span> filter criteria.
            </p>
          </div>
        ) : (
          paginatedSubmissions.map((sub) => {
            const displayName = sub.stageName || sub.fullName;
            return (
              <div
                key={sub.id}
                className="bg-zinc-950/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-zinc-800/80 space-y-5 hover:border-red-500/40 hover:shadow-[0_0_25px_rgba(220,38,38,0.15)] transition-all relative"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4 sm:pb-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sub.coverImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                      alt={displayName}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border border-red-600/40 shadow-lg flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg sm:text-2xl font-display font-bold text-white truncate">{displayName}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-600/10 text-red-400 border border-red-500/30 font-bold uppercase tracking-wider">
                          {sub.genre}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5 truncate">
                        {sub.fullName} &bull; <span className="text-zinc-500">{sub.email}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase border ${
                      sub.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      sub.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {sub.status}
                    </span>

                    <ThreeDotMenu
                      items={[
                        {
                          label: 'APPROVE SUBMISSION',
                          icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
                          onClick: () => handleApprove(sub.id, displayName),
                        },
                        {
                          label: 'DECLINE SUBMISSION',
                          icon: <Clock className="w-3.5 h-3.5 text-red-400" />,
                          onClick: () => handleReject(sub.id, displayName),
                        },
                        {
                          label: 'COPY EMAIL',
                          icon: <Copy className="w-3.5 h-3.5 text-zinc-400" />,
                          onClick: () => {
                            navigator.clipboard.writeText(sub.email);
                            showToast('Email copied to clipboard', 'info');
                          },
                        },
                      ]}
                      ariaLabel={`Options for ${displayName}`}
                    />
                  </div>
                </div>

                {/* Embedded HTML5 Video Player Container */}
                {sub.videoUrl ? (
                  <div className="space-y-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black border border-zinc-800">
                    <div className="flex items-center justify-between text-xs font-mono text-red-500 font-bold px-1">
                      <span className="flex items-center gap-1.5 uppercase">
                        <Video className="w-3.5 h-3.5" />
                        <span>CLOUDFLARE R2 VIDEO PREVIEW</span>
                      </span>
                      <a 
                        href={resolveStorageUrl(sub.videoUrl)} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[11px] text-zinc-400 hover:text-white underline"
                      >
                        Open Stream ↗
                      </a>
                    </div>

                    <video 
                      src={resolveStorageUrl(sub.videoUrl)} 
                      controls 
                      crossOrigin="anonymous"
                      playsInline 
                      preload="metadata"
                      className="w-full aspect-video rounded-xl overflow-hidden bg-black border border-zinc-800/80 shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-zinc-500 text-xs font-mono">
                    No video file attached to this submission.
                  </div>
                )}

                {/* Submissions Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 text-xs font-mono">
                  {sub.audioUrl && (
                    <a 
                      href={sub.audioUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all min-h-[44px]"
                    >
                      <Music className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="truncate">AUDIO DEMO</span>
                    </a>
                  )}
                  {sub.videoUrl && (
                    <a 
                      href={resolveStorageUrl(sub.videoUrl)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all min-h-[44px]"
                    >
                      <Video className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="truncate">RAW R2 STREAM</span>
                    </a>
                  )}
                  {sub.instagramUrl && (
                    <a 
                      href={sub.instagramUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all min-h-[44px]"
                    >
                      <Instagram className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="truncate">INSTAGRAM</span>
                    </a>
                  )}
                  {sub.phone && (
                    <a 
                      href={`tel:${sub.phone}`} 
                      className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all min-h-[44px]"
                    >
                      <PhoneCall className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="truncate">{sub.phone}</span>
                    </a>
                  )}
                  {sub.pressKitPdfUrl && (
                    <a 
                      href={sub.pressKitPdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all min-h-[44px]"
                    >
                      <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="truncate">PRESS KIT PDF</span>
                    </a>
                  )}
                </div>

                {/* Executive Action Row */}
                {sub.status === 'PENDING' && (
                  <div className="flex flex-col md:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white/10 pt-4 sm:pt-5">
                    <input
                      type="text"
                      placeholder="Optional executive note (e.g. 'Signed to WorldStar 2026')..."
                      value={adminNotesInput[sub.id] || ''}
                      onChange={(e) => setAdminNotesInput({ ...adminNotesInput, [sub.id]: e.target.value })}
                      className="w-full md:w-1/2 p-3 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:outline-none focus:border-red-600 min-h-[44px]"
                    />

                    <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
                      <button
                        onClick={() => handleReject(sub.id, displayName)}
                        disabled={loadingIds[sub.id]}
                        className="flex-1 md:flex-initial px-4 sm:px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 font-mono text-xs font-bold hover:bg-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[44px] transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>DECLINE</span>
                      </button>

                      <button
                        onClick={() => handleApprove(sub.id, displayName)}
                        disabled={loadingIds[sub.id]}
                        className="flex-1 md:flex-initial px-5 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[44px] transition-all"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>APPROVE &amp; PUBLISH</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredSubmissions.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
