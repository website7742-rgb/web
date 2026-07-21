'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { Sparkles, ShieldCheck, CheckCircle, XCircle, Clock, ExternalLink, FileText, Globe } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function AdminSubmissionsPage() {
  const { submissions, approveSubmission, rejectSubmission } = useData();
  const { showToast } = useUI();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [adminNotesInput, setAdminNotesInput] = useState<{ [key: string]: string }>({});

  const filteredSubmissions = submissions.filter(s => filter === 'ALL' || s.status === filter);

  const handleApprove = (id: string, stageName: string) => {
    const notes = adminNotesInput[id] || 'Approved by Executive A&R Board.';
    approveSubmission(id, notes);
    showToast(`SUCCESS! ${stageName} approved and published live to Roster!`, 'success');
  };

  const handleReject = (id: string, stageName: string) => {
    const notes = adminNotesInput[id] || 'Declined by A&R Board.';
    rejectSubmission(id, notes);
    showToast(`${stageName} submission rejected and archived.`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-mono uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>A&R EXECUTIVE BOARD PIPELINE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            SUBMISSION <span className="text-gold-gradient">INBOX</span>
          </h1>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl transition-all ${
                filter === tab
                  ? 'bg-gold text-obsidian font-bold shadow-lg'
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
          <div className="glass-panel rounded-3xl p-12 text-center text-zinc-400 font-mono space-y-2">
            <Clock className="w-8 h-8 text-gold mx-auto" />
            <h3 className="text-lg font-bold text-white">NO SUBMISSIONS FOUND</h3>
            <p className="text-xs">No talent submissions match the active filter criteria.</p>
          </div>
        ) : (
          filteredSubmissions.map((sub) => {
            return (
              <div
                key={sub.id}
                className="glass-panel-gold rounded-3xl p-6 md:p-8 border border-gold/30 space-y-6 shadow-2xl"
              >
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sub.coverImageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'}
                      alt={sub.stageName}
                      className="w-16 h-16 rounded-2xl object-cover border border-gold/40 shadow-lg"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-display font-bold text-white">{sub.stageName}</h3>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20 font-bold">
                          {sub.genre}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5">
                        {sub.fullName} • {sub.email} • {sub.country} ({sub.experience})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                      sub.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                      sub.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                      STATUS: {sub.status}
                    </span>
                  </div>
                </div>

                {/* Submissions Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
                  <div className="space-y-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    <span className="text-zinc-500 block font-bold">ARTIST BIOGRAPHY:</span>
                    <p className="text-zinc-300 font-sans leading-relaxed">{sub.biography}</p>
                  </div>

                  <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    <span className="text-zinc-500 block font-bold">OFFICIAL ASSETS & LINKS:</span>

                    <div className="flex flex-wrap gap-2">
                      {sub.spotifyUrl && (
                        <a href={sub.spotifyUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" />
                          <span>SPOTIFY</span>
                        </a>
                      )}
                      {sub.pressKitPdfUrl && (
                        <a href={sub.pressKitPdfUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-gold/10 text-gold border border-gold/20 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF PRESS KIT</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Executive Action Row */}
                {sub.status === 'PENDING' && (
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
                    <input
                      type="text"
                      placeholder="Add A&R Executive Notes..."
                      value={adminNotesInput[sub.id] || ''}
                      onChange={(e) => setAdminNotesInput({ ...adminNotesInput, [sub.id]: e.target.value })}
                      className="w-full md:w-1/2 p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-gold"
                    />

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={() => handleReject(sub.id, sub.stageName)}
                        className="w-1/2 md:w-auto px-6 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 font-mono text-xs font-bold hover:bg-red-500/20 flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>DECLINE</span>
                      </button>

                      <button
                        onClick={() => handleApprove(sub.id, sub.stageName)}
                        className="w-1/2 md:w-auto px-6 py-3 rounded-xl bg-gold text-obsidian font-mono text-xs font-bold hover:bg-gold-light shadow-lg flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>APPROVE & PUBLISH LIVE</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
