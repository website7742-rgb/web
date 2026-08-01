'use client';

import React from 'react';
import { useData } from '@/providers/DataContext';
import { Disc, ExternalLink, ShieldCheck } from 'lucide-react';
import { ExplicitBadge } from '@/components/ui/ExplicitBadge';
import { formatDuration, formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default function ReleaseDetailPage({ params }: { params: { slug: string } }) {
  const { releases, tracks } = useData();

  const release = releases.find(r => r.slug === params.slug);
  if (!release) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-mono">
        <h1 className="text-3xl font-display font-bold text-white">RELEASE NOT FOUND</h1>
        <p className="text-zinc-400">The requested album or single does not exist in our publishing catalog.</p>
        <Link href="/releases" className="inline-block px-6 py-3 rounded-xl bg-gold text-obsidian font-bold">
          RETURN TO DISCOGRAPHY
        </Link>
      </div>
    );
  }

  const releaseTracks = tracks.filter(t => t.releaseId === release.id || t.releaseTitle === release.title);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
      {/* Release Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center border-b border-white/10 pb-12">
        <div className="md:col-span-4 relative aspect-square rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl">
          <Image src={release.coverUrl} alt={`Official music video for ${release.title}`} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover" />
        </div>

        <div className="md:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-mono font-bold">
              {release.type}
            </span>
            <span className="text-xs font-mono text-zinc-400">CAT: {release.catalogNumber}</span>
            <span className="text-xs font-mono text-zinc-400">UPC: {release.upcCode}</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
            {release.title}
          </h1>

          <p className="text-xl text-gold font-display font-semibold">
            {release.artistName}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {release.spotifyUrl && (
              <a
                href={release.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <span>SPOTIFY HUB</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tracklist Table */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          <Disc className="w-5 h-5 text-gold" />
          <span>OFFICIAL MASTER TRACKLIST ({releaseTracks.length})</span>
        </h2>

        <div className="space-y-3">
          {releaseTracks.map((track, idx) => (
            <div
              key={track.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-zinc-300 font-mono text-xs"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-zinc-500 font-bold w-6">0{idx + 1}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">{track.title}</span>
                    {track.isExplicit && <ExplicitBadge />}
                  </div>
                  <span className="text-[10px] text-zinc-500">ISRC: {track.isrcCode}</span>
                </div>
              </div>

              <span>{formatDuration(track.duration)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
