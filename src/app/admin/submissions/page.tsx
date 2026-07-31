'use client';

import React, { useState } from 'react';
import { useData } from '@/providers/DataContext';
import { Sparkles, ShieldCheck, Clock, FileText, Globe, Music, Video, Link2, Instagram, PhoneCall } from 'lucide-react';
import { useUI } from '@/providers/UIContext';

export default function AdminSubmissionsPage() {
  const { submissions, approveSubmission, rejectSubmission } = useData();
  const { showToast } = useUI();
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [adminNotesInput, setAdminNotesInput] = useState<{ [key: string]: string }>({});

  const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({});

  const filteredSubmissions = submissions.filter(s => filter === 'ALL' || s.status === filter);

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
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl transition-all ${
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
          filteredSubmissions.map((sub) => {
            const displayName = sub.stageName || sub.fullName;
            return (
              <div
                key={sub.id}
                className="bg-[#0a0a0a] rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 shadow-2xl backdrop-blur-xl"
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
                      <p className="text-xs font-mono text-zinc-400 mt-1 flex flex-wrap items-center gap-2">
                        <span>{sub.fullName}</span>
                        <span>•</span>
                        <span>{sub.email}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <PhoneCall className="w-3 h-3" />
                          {sub.phone}
                        </span>
                        <span>•</span>
                        <span>{sub.experience}</span>
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
                    <span className="text-zinc-500 block font-bold uppercase">ARTIST BIOGRAPHY:</span>
                    <p className="text-zinc-300 font-sans leading-relaxed">{sub.biography || 'No bio provided.'}</p>
                    {sub.message && (
                      <div className="pt-2 border-t border-white/5 mt-2">
                        <span className="text-red-400 block font-bold">NOTE TO A&R BOARD:</span>
                        <p className="text-zinc-300 font-sans text-xs italic">{sub.message}</p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                    <span className="text-zinc-500 block font-bold uppercase">OFFICIAL MEDIA & LINKS:</span>

                    <div className="flex flex-wrap gap-2">
                      {sub.audioUrl && (
                        <a href={sub.audioUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-red-600/10 text-red-400 border border-red-600/20 flex items-center gap-1.5 hover:bg-red-600/20 transition-all font-bold">
                          <Music className="w-3.5 h-3.5" />
                          <span>DEMO AUDIO</span>
                        </a>
                      )}
                      {(sub.youtubeUrl || sub.videoUrl) && (
                        <a href={sub.youtubeUrl || sub.videoUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-red-600/10 text-red-400 border border-red-600/20 flex items-center gap-1.5 hover:bg-red-600/20 transition-all font-bold">
                          <Video className="w-3.5 h-3.5" />
                          <span>MUSIC VIDEO</span>
                        </a>
                      )}
                      {sub.spotifyUrl && (
                        <a href={sub.spotifyUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 hover:bg-emerald-500/20 transition-all">
                          <Globe className="w-3.5 h-3.5" />
                          <span>SPOTIFY</span>
                        </a>
                      )}
                      {sub.appleUrl && (
                        <a href={sub.appleUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1.5 hover:bg-rose-500/20 transition-all">
                          <Globe className="w-3.5 h-3.5" />
                          <span>APPLE MUSIC</span>
                        </a>
                      )}
                      {sub.websiteUrl && (
                        <a href={sub.websiteUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1.5 hover:bg-blue-500/20 transition-all">
                          <Link2 className="w-3.5 h-3.5" />
                          <span>WEBSITE</span>
                        </a>
                      )}
                      {sub.instagramUrl && (
                        <a href={sub.instagramUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1.5 hover:bg-pink-500/20 transition-all">
                          <Instagram className="w-3.5 h-3.5" />
                          <span>INSTAGRAM</span>
                        </a>
                      )}
                      {sub.pressKitPdfUrl && (
                        <a href={sub.pressKitPdfUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5 hover:bg-amber-500/20 transition-all">
                          <FileText className="w-3.5 h-3.5" />
                          <span>PRESS KIT PDF</span>
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
    </div>
  );
}
