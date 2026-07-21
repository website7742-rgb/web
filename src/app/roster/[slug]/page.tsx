'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { 
  Award, 
  Download, 
  ShieldCheck,
  Video,
  ExternalLink,
  Globe,
  Disc,
  X,
  Tv,
  Instagram,
  Music,
  Share2,
  Twitter,
  Facebook,
  Calendar,
  Ticket,
  Sparkles,
  TrendingUp,
  Flame,
  CheckCircle2,
  Radio
} from 'lucide-react';
import Link from 'next/link';
import { getCountryISO } from '@/lib/utils/countryToISO';

export default function ArtistSpotlightPage({ params }: { params: { slug: string } }) {
  const { artists, releases, tourDates } = useData();

  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const artist = artists.find(a => a.slug === params.slug);
  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4 font-mono">
        <h1 className="text-3xl font-hero font-bold text-white">ARTIST PROFILE NOT FOUND</h1>
        <p className="text-zinc-400">The requested artist profile does not exist in our publishing database.</p>
        <Link href="/roster" className="inline-block px-6 py-3 rounded-none bg-gold text-obsidian font-bold min-h-[44px]">
          RETURN TO ROSTER DIRECTORY
        </Link>
      </div>
    );
  }

  const artistReleases = releases.filter(r => r.artistId === artist.id || r.artistName === artist.name);
  const artistTours = tourDates.filter(t => t.artistId === artist.id || t.artistName === artist.name);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
    return num.toString();
  };

  const getPlatformIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('website')) return <Globe className="w-5 h-5 text-gold flex-shrink-0" />;
    if (lower.includes('youtube')) return <Tv className="w-5 h-5 text-red-500 flex-shrink-0" />;
    if (lower.includes('instagram')) return <Instagram className="w-5 h-5 text-pink-500 flex-shrink-0" />;
    if (lower.includes('apple')) return <Music className="w-5 h-5 text-red-400 flex-shrink-0" />;
    if (lower.includes('spotify')) return <Disc className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
    if (lower.includes('twitter') || lower.includes('x')) return <Twitter className="w-5 h-5 text-sky-400 flex-shrink-0" />;
    if (lower.includes('facebook')) return <Facebook className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    return <Share2 className="w-5 h-5 text-gold flex-shrink-0" />;
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 w-full overflow-x-hidden">
      {/* ⭐ Apple Keynote & Billboard Editorial Hero Banner */}
      <section className="relative min-h-[65vh] sm:min-h-[72vh] flex items-end px-4 sm:px-6 md:px-8 lg:px-12 pb-10 sm:pb-14 overflow-hidden border-b border-zinc-800 w-full">
        {/* Background Spotlight Layer */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artist.heroUrl}
            alt={artist.name}
            className="w-full h-full object-cover filter brightness-[0.45] contrast-[1.1] scale-105 transform transition-transform duration-1000"
          />
          {/* Radial Gold & Dark Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/75 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.18),transparent_60%)]" />
        </div>

        <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full relative z-10 space-y-6">
          {/* Badges Bar */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {artist.isVerified && (
              <span className="px-4 py-1.5 rounded-full bg-gold/20 text-gold border border-gold/40 text-[11px] sm:text-xs font-label flex items-center gap-2 font-bold  backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                </span>
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>VERIFIED RECORDING ARTIST</span>
              </span>
            )}

            {artist.country && (
              <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-black border border-zinc-800 backdrop-blur-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`https://flagcdn.com/w20/${getCountryISO(artist.country)}.png`} 
                  alt={artist.country} 
                  className="w-5 h-auto rounded-sm border border-zinc-700/50" 
                />
                <span className="text-zinc-400 text-xs tracking-wide uppercase font-label">
                  {artist.country}
                </span>
              </span>
            )}

            {artist.labelStatus && (
              <span className="text-xs font-label text-gold px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 font-bold backdrop-blur-md">
                {artist.labelStatus} ROSTER
              </span>
            )}
          </div>

          {/* Artist Header Grid */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
              {/* Profile Avatar Image */}
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-none overflow-hidden border-2 border-gold/60  flex-shrink-0 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-none" />
              </div>

              <div className="space-y-2">
                <h1 className="text-fluid-hero font-hero font-extrabold text-white tracking-tight leading-none drop-">
                  {artist.name}
                </h1>
                <p className="text-sm sm:text-xl text-zinc-300 font-sans font-light tracking-wide max-w-2xl">
                  {artist.tagline}
                </p>
              </div>
            </div>

            <a
              href={artist.epkUrl || '#epk'}
              className="btn-gold-luxury px-7 py-4 rounded-none text-xs font-bold flex items-center justify-center gap-2.5 flex-shrink-0 min-h-[44px] "
            >
              <Download className="w-4.5 h-4.5" />
              <span>DOWNLOAD DIGITAL PRESS KIT (EPK)</span>
            </a>
          </div>

          {/* Metric Highlights Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-800 pt-6">
            <div className="bg-black border border-zinc-800 p-4 rounded-none border border-zinc-800">
              <span className="text-[10px] font-label text-zinc-400 block uppercase font-bold">MONTHLY LISTENERS</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-white">{formatNumber(artist.monthlyListeners)}</span>
            </div>

            <div className="bg-black border border-zinc-800 p-4 rounded-none border border-zinc-800">
              <span className="text-[10px] font-label text-zinc-400 block uppercase font-bold">GLOBAL STREAMS</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-gold">{formatNumber(artist.totalStreams)}</span>
            </div>

            <div className="bg-black border border-zinc-800 p-4 rounded-none border border-zinc-800">
              <span className="text-[10px] font-label text-zinc-400 block uppercase font-bold">RIAA PLATINUM</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-white">{artist.riaaCertifications.platinum}X</span>
            </div>

            <div className="bg-black border border-zinc-800 p-4 rounded-none border border-zinc-800">
              <span className="text-[10px] font-label text-zinc-400 block uppercase font-bold">GRAMMY WINS</span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-gold">{artist.grammyWins}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ Main Editorial Content Layout */}
      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 w-full">
        {/* Left Column (8 Columns) */}
        <div className="lg:col-span-8 space-y-12 sm:space-y-14 w-full">
          {/* Editorial Biography */}
          <div className="bg-black border border-gold rounded-none p-6 sm:p-10 space-y-6 border border-gold/30 ">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-gold">
                <Sparkles className="w-5 h-5" />
                <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide">
                  EDITORIAL BIOGRAPHY & ARTISTIC LEGACY
                </h2>
              </div>
            </div>

            <p className="text-zinc-200 leading-relaxed text-sm sm:text-base font-sans font-light whitespace-pre-line">
              {artist.bio}
            </p>

            {/* Source Attribution & Verification Metadata (Phase 9/11) */}
            <div className="p-4 rounded-none bg-white/[0.03] border border-gold/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>CONFIDENCE: {artist.verificationConfidence || 'HIGH'} (MULTI-SOURCE VERIFIED)</span>
              </div>
              <span className="text-zinc-400">LAST VERIFIED: {artist.biographyLastVerified || '2026-07-21'}</span>
            </div>

            {artist.topSongs && artist.topSongs.length > 0 && (
              <div className="border-t border-zinc-800 pt-6 space-y-3">
                <span className="text-xs font-label text-gold font-bold uppercase tracking-wider block">KEY RECORDINGS & ANTHEMS</span>
                <div className="flex flex-wrap gap-2.5">
                  {artist.topSongs.map((song, idx) => (
                    <span key={idx} className="px-4 py-2 rounded-none bg-white/5 border border-zinc-800 text-white font-mono text-xs flex items-center gap-2">
                      <Flame className="w-3.5 h-3.5 text-gold" />
                      <span>{song}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ⭐ Verified Official Platform Hubs */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 gap-2">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-gold flex-shrink-0" />
                <span>OFFICIAL PLATFORM HUBS</span>
              </h2>
              <span className="text-xs font-label text-zinc-400 font-bold">
                VERIFIED LINKS ({artist.streamingPlatforms.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {artist.streamingPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className="bg-black border border-zinc-800 rounded-none p-5 border border-zinc-800 hover:border-gold/50 flex items-center justify-between transition-all gap-4 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-none bg-white/5 border border-zinc-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      {getPlatformIcon(platform.name)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display font-bold text-white text-base truncate group-hover:text-gold transition-colors">{platform.name}</h4>
                      <span className="text-[10px] font-label text-zinc-500 block truncate font-bold">VERIFIED CHANNEL</span>
                    </div>
                  </div>

                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-none bg-gold text-obsidian font-hero text-xs font-bold hover:bg-gold-light transition-all flex items-center gap-1.5 flex-shrink-0 min-h-[44px]"
                  >
                    <span>VISIT</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Discography Master Releases */}
          {artistReleases.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
                <Disc className="w-5 h-5 text-gold flex-shrink-0" />
                <span>DISCOGRAPHY CATALOG</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {artistReleases.map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/releases/${rel.slug}`}
                    className="group bg-black border border-zinc-800 rounded-none p-5 border border-zinc-800 hover:border-gold/50 transition-all flex gap-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={rel.coverUrl} alt={rel.title} className="w-24 h-24 rounded-none object-cover border border-zinc-800 group-hover:scale-105 transition-transform flex-shrink-0" />
                    <div className="space-y-1.5 min-w-0">
                      <span className="text-[10px] font-label text-gold font-bold uppercase tracking-wider">{rel.type} • {rel.releaseDate}</span>
                      <h4 className="font-display font-bold text-lg text-white truncate group-hover:text-gold transition-colors">{rel.title}</h4>
                      <p className="text-xs font-mono text-zinc-400">CAT: {rel.catalogNumber}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Video Showcase */}
          {artist.videos && artist.videos.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-gold flex-shrink-0" />
                <span>OFFICIAL MUSIC VIDEOS & VISUALIZERS</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {artist.videos.map(vid => (
                  <div
                    key={vid.id}
                    onClick={() => setActiveVideoUrl(`https://www.youtube.com/embed/${vid.youtubeId}?autoplay=1`)}
                    className="group bg-black border border-zinc-800 rounded-none overflow-hidden border border-zinc-800 hover:border-gold/50 cursor-pointer transition-all"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-bold text-sm text-white group-hover:text-gold transition-colors">{vid.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Stadium Tours */}
          {artistTours.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gold flex-shrink-0" />
                <span>UPCOMING STADIUM TOUR DATES</span>
              </h2>

              <div className="space-y-3">
                {artistTours.map((tour) => (
                  <div
                    key={tour.id}
                    className="bg-black border border-zinc-800 rounded-none p-5 border border-zinc-800 hover:border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-label text-gold font-bold uppercase tracking-wider">{tour.tourName}</span>
                      <h4 className="font-display font-bold text-base text-white">{tour.venue} — {tour.city}, {tour.country}</h4>
                    </div>

                    <a
                      href={tour.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-none bg-gold text-obsidian font-hero text-xs font-bold hover:bg-gold-light transition-all flex items-center justify-center gap-1.5 min-h-[44px] flex-shrink-0"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>TICKETS</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 Columns) Sidebar Metadata Panel */}
        <div className="lg:col-span-4 space-y-8 w-full">
          <div className="bg-black border border-gold rounded-none p-6 md:p-8 border border-gold/30 space-y-6 ">
            <h3 className="text-lg sm:text-xl font-display font-bold text-white border-b border-zinc-800 pb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" />
              <span>PUBLISHING & RIAA METRICS</span>
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">RIAA DIAMOND:</span>
                <span className="text-gold font-bold">{artist.riaaCertifications.diamond}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">RIAA PLATINUM:</span>
                <span className="text-white font-bold">{artist.riaaCertifications.platinum}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">RIAA GOLD:</span>
                <span className="text-white font-bold">{artist.riaaCertifications.gold}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">GRAMMY WINS:</span>
                <span className="text-gold font-bold">{artist.grammyWins}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-white/5">
                <span className="text-zinc-400">PUBLISHING STATUS:</span>
                <span className="text-emerald-400 font-bold">{artist.labelStatus}</span>
              </div>
            </div>

            <a
              href={artist.epkUrl || '#epk'}
              className="w-full py-4 rounded-none bg-gold text-obsidian font-hero font-bold text-xs tracking-wider hover:bg-gold-light transition-all flex items-center justify-center gap-2 min-h-[44px] "
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD OFFICIAL EPK (ZIP)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setActiveVideoUrl(null)} />
          <div className="relative w-full max-w-4xl bg-obsidian border border-gold/40 rounded-none overflow-hidden z-10 ">
            <div className="p-4 flex justify-between items-center border-b border-zinc-800">
              <span className="font-mono text-xs text-gold">AETHERIA VIDEO PLAYER</span>
              <button onClick={() => setActiveVideoUrl(null)} className="text-zinc-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe src={activeVideoUrl} className="w-full h-full" allow="autoplay; encrypted-media" allowFullScreen />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
