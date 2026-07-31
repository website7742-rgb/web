'use client';

import React, { useState } from 'react';
import { useData } from '@/providers/DataContext';
import { Sparkles, ShieldCheck, Clock, FileText, Globe, Music, Video, Link2, Instagram, PhoneCall, Copy } from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { ThreeDotMenu } from '@/components/ui/ThreeDotMenu';
import { PaginationControls } from '@/components/ui/PaginationControls';

export default function AdminSubmissionsPage() {
  const { submissions, approveSubmission, rejectSubmission } = useData();
  const { showToast } = useUI();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [adminNotesInput, setAdminNotesInput] = useState<{ [key: string]: string }>({});
  const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WORLDSTAR A&R EXECUTIVE BOARD PIPELINE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            SUBMISSION <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">INBOX</span>
          </h1>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => handleFilterChange(tab)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-red-600 text-white font-bold shadow-lg'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-6">
        {filteredSubmissions.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-12 text-center text-zinc-400 font-mono space-y-2">
            <Clock className="w-8 h-8 text-red-500 mx-auto" />
            <h3 className="text-lg font-bold text-white uppercase">NO SUBMISSIONS FOUND</h3>
            <p className="text-xs">No talent submissions match the active filter criteria.</p>
          </div>
        ) : (
          paginatedSubmissions.map((sub) => {
            const displayName = sub.stageName || sub.fullName;
            return (
              <div
                key={sub.id}
                className="bg-[#0a0a0a] rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-2xl backdrop-blur-xl relative"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sub.coverImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                      alt={displayName}
                      className="w-16 h-16 rounded-2xl object-cover border border-red-600/40 shadow-lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-display font-bold text-white">{displayName}</h3>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-red-600/10 text-red-500 border border-red-600/20 font-bold">
                          {sub.genre}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400 mt-1">
                        Submitted by: {sub.fullName} ({sub.email})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full uppercase border ${
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
                          },
                        },
                      ]}
                      ariaLabel={`Options for ${displayName}`}
                    />
                  </div>
                </div>

                {/* Submissions Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
                  {sub.audioUrl && (
                    <a href={sub.audioUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all">
                      <Music className="w-4 h-4 text-red-500" />
                      <span className="truncate">AUDIO DEMO</span>
                    </a>
                  )}
                  {sub.videoUrl && (
                    <a href={sub.videoUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all">
                      <Video className="w-4 h-4 text-red-500" />
                      <span className="truncate">VIDEO TRAILER</span>
                    </a>
                  )}
                  {sub.instagramUrl && (
                    <a href={sub.instagramUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all">
                      <Instagram className="w-4 h-4 text-red-500" />
                      <span className="truncate">INSTAGRAM</span>
                    </a>
                  )}
                  {sub.phone && (
                    <a href={`tel:${sub.phone}`} className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all">
                      <PhoneCall className="w-4 h-4 text-red-500" />
                      <span className="truncate">{sub.phone}</span>
                    </a>
                  )}
                  {sub.pressKitPdfUrl && (
                    <a href={sub.pressKitPdfUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white flex items-center gap-2 hover:border-red-600/40 transition-all">
                      <FileText className="w-4 h-4 text-red-500" />
                      <span className="truncate">PRESS KIT PDF</span>
                    </a>
                  )}
                </div>

                {/* Executive Action Row */}
                {sub.status === 'PENDING' && (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                    <input
                      type="text"
                      placeholder="Add A&R Executive Notes..."
                      value={adminNotesInput[sub.id] || ''}
                      onChange={(e) => setAdminNotesInput({ ...adminNotesInput, [sub.id]: e.target.value })}
                      className="w-full md:w-1/2 p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-red-600"
                    />

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={() => handleReject(sub.id, displayName)}
                        disabled={loadingIds[sub.id]}
                        className="w-1/2 md:w-auto px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 font-mono text-xs font-bold hover:bg-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <span>DECLINE</span>
                      </button>

                      <button
                        onClick={() => handleApprove(sub.id, displayName)}
                        disabled={loadingIds[sub.id]}
                        className="w-1/2 md:w-auto px-6 py-3 rounded-xl bg-red-600 text-white font-mono text-xs font-bold hover:bg-red-500 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>APPROVE &amp; PUBLISH LIVE</span>
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
