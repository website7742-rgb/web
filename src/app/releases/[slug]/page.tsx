import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getReleaseBySlugOrId, getTracksForRelease, getVerifiedReleases } from '@/lib/data/verifiedReleases';
import { Disc, ExternalLink, Film, User, Calendar, Music, Radio } from 'lucide-react';
import { ExplicitBadge } from '@/components/ui/ExplicitBadge';
import { formatDuration, formatDate } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const release = getReleaseBySlugOrId(params.slug);
  if (!release) {
    return {
      title: 'Release Not Found | WorldStar Hip Hop',
      description: 'The requested hip-hop release or single could not be located in our active catalog.',
    };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');
  const canonicalPath = `/releases/${release.slug}`;

  return {
    title: `${release.title} - ${release.artistName} | WorldStar Hip Hop`,
    description: `Official streaming release for "${release.title}" by ${release.artistName}. Explore tracklist, credits, and visuals on WorldStar Hip Hop.`,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${release.title} - ${release.artistName}`,
      description: `Official streaming release for "${release.title}" by ${release.artistName}.`,
      url: `${siteUrl}${canonicalPath}`,
      siteName: 'WorldStar Hip Hop',
      images: release.coverUrl ? [{ url: release.coverUrl, alt: release.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${release.title} - ${release.artistName}`,
      description: `Official streaming release for "${release.title}" by ${release.artistName}.`,
      images: release.coverUrl ? [release.coverUrl] : undefined,
    },
  };
}

export default function ReleaseDetailPage({ params }: { params: { slug: string } }) {
  const release = getReleaseBySlugOrId(params.slug);

  if (!release) {
    notFound();
  }

  const releaseTracks = getTracksForRelease(release.id);
  const allReleases = getVerifiedReleases();
  const relatedReleases = allReleases.filter(
    r => r.artistName.toLowerCase() === release.artistName.toLowerCase() && r.id !== release.id
  ).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-400">
        <Link href="/" className="hover:text-gold transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/releases" className="hover:text-gold transition-colors">RELEASES</Link>
        <span>/</span>
        <span className="text-gold truncate max-w-xs">{release.title.toUpperCase()}</span>
      </nav>

      {/* Release Hero Header */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center border-b border-white/10 pb-12">
        <div className="md:col-span-5 lg:col-span-4 relative aspect-square rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl bg-obsidian-light">
          <Image
            src={release.coverUrl}
            alt={`${release.title} by ${release.artistName}`}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            priority
            className="object-cover"
          />
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-obsidian/85 backdrop-blur-md border border-gold/40 text-gold text-xs font-mono font-bold">
            {release.type}
          </div>
          {release.genre && (
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-obsidian/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono">
              {release.genre}
            </div>
          )}
        </div>

        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-mono font-bold">
              OFFICIAL WSHH RELEASE
            </span>
            <span className="text-xs font-mono text-zinc-400">CAT: {release.catalogNumber}</span>
            <span className="text-xs font-mono text-zinc-400">UPC: {release.upcCode}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
            {release.title}
          </h1>

          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest block mb-1">RECORDING ARTIST</span>
            {release.artistSlug ? (
              <Link 
                href={`/roster/${release.artistSlug}`} 
                className="text-2xl md:text-3xl text-gold font-display font-bold hover:text-white transition-colors inline-flex items-center gap-2 group"
              >
                <span>{release.artistName}</span>
                <ExternalLink className="w-5 h-5 text-gold group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <p className="text-2xl md:text-3xl text-gold font-display font-bold">
                {release.artistName}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400 border-t border-b border-white/10 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold" />
              <span>RELEASE DATE: {formatDate(release.releaseDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-gold" />
              <span>{release.tracksCount} {release.tracksCount === 1 ? 'TRACK' : 'TRACKS'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-gold" />
              <span>GENRE: {release.genre || 'Hip-Hop'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {release.artistSlug && (
              <Link
                href={`/roster/${release.artistSlug}`}
                className="btn-gold-luxury px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>ARTIST DOSSIER</span>
              </Link>
            )}
            {release.spotifyUrl && (
              <a
                href={release.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl text-xs font-bold font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all flex items-center gap-2"
              >
                <span>SPOTIFY HUB</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Official Video Player Embed (If Available) */}
      {release.embedUrl && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-gold" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-white">
              OFFICIAL VISUAL PREMIERE
            </h2>
          </div>
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            <iframe
              src={release.embedUrl}
              title={`${release.title} by ${release.artistName} Official Video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Official Tracklist Table */}
      <div className="glass-panel-gold rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Disc className="w-5 h-5 text-gold" />
            <span>OFFICIAL MASTER TRACKLIST ({releaseTracks.length})</span>
          </h2>
          <span className="text-xs font-mono text-zinc-500">HI-RES AUDIO MASTERING</span>
        </div>

        <div className="space-y-3">
          {releaseTracks.map((track, idx) => (
            <div
              key={track.id}
              className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-gold/30 hover:bg-white/[0.04] transition-all text-zinc-300 font-mono text-xs"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-zinc-500 font-bold w-6">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm truncate">{track.title}</span>
                    {track.isExplicit && <ExplicitBadge />}
                  </div>
                  <span className="text-[10px] text-zinc-500">ISRC: {track.isrcCode}</span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {track.playsCount > 0 && (
                  <span className="text-[11px] text-zinc-500 hidden sm:inline">
                    {(track.playsCount / 1_000_000).toFixed(1)}M STREAMS
                  </span>
                )}
                <span className="text-zinc-400">{formatDuration(track.duration)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Releases by Same Artist */}
      {relatedReleases.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-white/10">
          <h2 className="text-2xl font-display font-bold text-white flex items-center gap-2">
            <Music className="w-5 h-5 text-gold" />
            <span>MORE RELEASES FROM {release.artistName.toUpperCase()}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedReleases.map(rel => (
              <Link
                key={rel.id}
                href={`/releases/${rel.slug}`}
                className="group glass-panel rounded-2xl p-4 border border-white/10 hover:border-gold/50 transition-all block"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <Image
                    src={rel.coverUrl}
                    alt={rel.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-obsidian/80 text-[10px] font-mono text-gold">
                    {rel.type}
                  </div>
                </div>
                <h4 className="font-display font-bold text-white text-sm truncate group-hover:text-gold transition-colors">
                  {rel.title}
                </h4>
                <p className="text-xs text-zinc-400">{rel.releaseDate}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
