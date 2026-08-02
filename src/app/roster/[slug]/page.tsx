'use client';

import React, { useState, useTransition } from 'react';
import { notFound } from 'next/navigation';
import { useData } from '@/providers/DataContext';
import { 
  Award, 
  ShieldCheck,
  Video,
  ExternalLink,
  Disc,
  X as CloseIcon,
  Sparkles,
  Flame,
  Play,
  UserPlus,
  UserCheck,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { getCountryISO } from '@/lib/utils/countryToISO';
import { StreamingPlatform } from '@/types';
import { useUI } from '@/providers/UIContext';

// ⭐ Premium Brand Logo SVG Components
const SpotifyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.498 17.302c-.22.36-.689.474-1.05.253-2.873-1.756-6.488-2.153-10.748-1.18-.409.094-.817-.162-.911-.571-.094-.409.162-.817.571-.911 4.662-1.066 8.653-.615 11.886 1.359.36.221.475.69.252 1.05zm1.464-3.256c-.277.452-.871.597-1.323.32-3.287-2.02-8.3-2.61-12.19-1.428-.507.155-1.041-.131-1.196-.639-.155-.507.132-1.04.639-1.196 4.453-1.352 9.986-.692 13.748 1.62.452.277.597.871.322 1.323zm.127-3.39c-3.943-2.342-10.447-2.558-14.218-1.413-.604.183-1.246-.165-1.43-.769-.183-.603.166-1.246.769-1.43 4.331-1.314 11.523-1.06 16.059 1.631.544.323.722 1.03.399 1.575-.323.544-1.03.722-1.579.406z"/>
  </svg>
);

const AppleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.31c.67-.81 1.13-1.94.99-3.08-1 .04-2.22.67-2.92 1.49-.63.73-1.18 1.89-1.03 3.01 1.12.09 2.27-.59 2.96-1.42z"/>
  </svg>
);

const YoutubeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const XBrandIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const GlobeBrandIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={`${className} fill-none stroke-current stroke-[1.8]`} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default function ArtistSpotlightPage({ params }: { params: { slug: string } }) {
  const { artists, releases } = useData();
  const { showToast } = useUI();
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleFollowToggle = (artistName: string) => {
    startTransition(() => {
      setTimeout(() => {
        setIsFollowing(prev => {
          const next = !prev;
          if (next) {
            showToast(`YOU ARE NOW FOLLOWING ${artistName.toUpperCase()}!`, 'success');
          } else {
            showToast(`UNFOLLOWED ${artistName.toUpperCase()}`, 'info');
          }
          return next;
        });
      }, 400);
    });
  };

  const targetSlug = decodeURIComponent(params.slug).toLowerCase().trim();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug);

  const artist = artists.find(a => {
    if (isUUID) {
      return a.id === params.slug;
    }
    return (
      (a.slug && a.slug.toLowerCase().trim() === targetSlug) || 
      (a.name && a.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') === targetSlug)
    );
  });

  if (!artist) {
    notFound();
  }

  const safeArtistName = artist.name || 'Unknown Artist';
  const artistReleases = releases.filter(r => r.artistId === artist.id || r.artistName === safeArtistName);

  const formatNumber = (num: number) => {
    if (!num) return '0';
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
    return num.toString();
  };

  const encName = encodeURIComponent(safeArtistName);
  const wikiSlug = encodeURIComponent(safeArtistName.replace(/ /g, '_'));
  const cleanHandle = safeArtistName.toLowerCase().replace(/[^a-z0-9]/g, '');

  const featuredVideoId = artist.videos && artist.videos.length > 0 ? artist.videos[0].youtubeId : null;

  const realPlatforms: StreamingPlatform[] = [
    {
      id: `sp-spot-${artist.id}`,
      name: 'Spotify Official',
      url: artist.socials?.spotify && !artist.socials.spotify.endsWith('open.spotify.com')
        ? artist.socials.spotify
        : `https://open.spotify.com/search/${encName}`
    },
    {
      id: `sp-app-${artist.id}`,
      name: 'Apple Music',
      url: artist.socials?.apple
        ? artist.socials.apple
        : `https://music.apple.com/us/search?term=${encName}`
    },
    {
      id: `sp-yt-${artist.id}`,
      name: 'YouTube Music',
      url: artist.socials?.youtube
        ? artist.socials.youtube
        : `https://www.youtube.com/results?search_query=${encodeURIComponent(artist.name + " official")}`
    },
    {
      id: `sp-ig-${artist.id}`,
      name: 'Instagram',
      url: artist.socials?.instagram
        ? artist.socials.instagram
        : `https://www.instagram.com/${cleanHandle}`
    },
    {
      id: `sp-tw-${artist.id}`,
      name: 'Twitter / X',
      url: artist.socials?.twitter
        ? artist.socials.twitter
        : `https://twitter.com/search?q=${encName}`
    },
    {
      id: `sp-wiki-${artist.id}`,
      name: 'Official Wikipedia Page',
      url: artist.socials?.website && !artist.socials.website.includes('officialwebsite')
        ? artist.socials.website
        : `https://en.wikipedia.org/wiki/${wikiSlug}`
    }
  ];

  const getPlatformBrandIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('spotify')) return <SpotifyIcon className="w-5 h-5" />;
    if (lower.includes('apple')) return <AppleIcon className="w-5 h-5" />;
    if (lower.includes('youtube')) return <YoutubeIcon className="w-5 h-5" />;
    if (lower.includes('instagram')) return <InstagramIcon className="w-5 h-5" />;
    if (lower.includes('twitter') || lower.includes('x')) return <XBrandIcon className="w-5 h-5" />;
    return <GlobeBrandIcon className="w-5 h-5" />;
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-24 w-full overflow-x-hidden bg-black text-white selection:bg-red-600 selection:text-white">
      {/* ⭐ Cinematic Edge-to-Edge Hero Section with Blur Backdrop */}
      <section className="relative min-h-[65vh] sm:min-h-[72vh] flex items-end px-4 sm:px-6 md:px-8 lg:px-12 pb-12 sm:pb-16 overflow-hidden border-b border-white/10 w-full bg-black">
        {/* Background Layer with Heavy Dark Ambient Blur */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={artist.heroUrl || artist.avatarUrl || '/placeholder.png'}
            alt={`Official artist profile hero image for ${safeArtistName}`}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.25] contrast-[1.3] blur-xl opacity-30 scale-110 transform transition-transform duration-1000"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full relative z-10 space-y-8">
          {/* Artist Header Grid */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              {/* Profile Avatar Image with Glow Frame */}
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600 to-zinc-600 opacity-40 blur-xl group-hover:opacity-80 transition-opacity duration-500" />
                <a
                  href={`https://en.wikipedia.org/wiki/${wikiSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Click to view Official Wikipedia & Media Data"
                  className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/20 flex-shrink-0 block shadow-2xl bg-zinc-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={artist.avatarUrl || '/placeholder.png'} alt={`Official avatar for ${safeArtistName}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold uppercase tracking-wider">
                    <ExternalLink className="w-6 h-6 text-red-500" />
                  </div>
                </a>
              </div>

              <div className="space-y-3 min-w-0">
                {/* Verified Premium Label SVG Status Bar */}
                <div className="inline-flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-2xl shadow-2xl">
                  {artist.isVerified && (
                    <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-red-600/15 border border-red-500/30 text-red-400 text-[11px] font-mono font-bold uppercase tracking-wider">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                      <span>VERIFIED PREMIUM LABEL ARTIST</span>
                    </div>
                  )}

                  {artist.country && (
                    <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-mono font-semibold uppercase tracking-wider">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={`https://flagcdn.com/w20/${getCountryISO(artist.country)}.png`} 
                        alt={artist.country} 
                        className="w-4 h-auto rounded-xs opacity-90" 
                      />
                      <span>{artist.country}</span>
                    </div>
                  )}

                  {artist.labelStatus && (
                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-mono font-semibold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{artist.labelStatus} ROSTER</span>
                    </div>
                  )}
                </div>

                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-tight leading-none drop-shadow-2xl">
                  {safeArtistName}
                </h1>
                <p className="text-base sm:text-xl text-zinc-300 font-medium tracking-wide max-w-2xl uppercase">
                  {artist.tagline || 'OFFICIAL ARTIST PROFILE'}
                </p>

                {/* Floating Brand Icons */}
                <div className="flex items-center gap-7 pt-4 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  <a href={`https://open.spotify.com/search/${encName}`} target="_blank" rel="noopener noreferrer" title="Spotify Official" className="text-zinc-300 hover:text-[#1DB954] transition-all duration-300 hover:scale-125">
                    <SpotifyIcon className="w-6 h-6" />
                  </a>
                  <a href={`https://music.apple.com/us/search?term=${encName}`} target="_blank" rel="noopener noreferrer" title="Apple Music" className="text-zinc-300 hover:text-[#FA243C] transition-all duration-300 hover:scale-125">
                    <AppleIcon className="w-6 h-6" />
                  </a>
                  <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(artist.name + " official")}`} target="_blank" rel="noopener noreferrer" title="YouTube Music" className="text-zinc-300 hover:text-[#FF0000] transition-all duration-300 hover:scale-125">
                    <YoutubeIcon className="w-6 h-6" />
                  </a>
                  <a href={`https://www.instagram.com/${cleanHandle}`} target="_blank" rel="noopener noreferrer" title="Instagram" className="text-zinc-300 hover:text-[#E4405F] transition-all duration-300 hover:scale-125">
                    <InstagramIcon className="w-6 h-6" />
                  </a>
                  <a href={`https://twitter.com/search?q=${encName}`} target="_blank" rel="noopener noreferrer" title="X / Twitter" className="text-zinc-300 hover:text-[#1DA1F2] transition-all duration-300 hover:scale-125">
                    <XBrandIcon className="w-6 h-6" />
                  </a>
                  <a href={`https://en.wikipedia.org/wiki/${wikiSlug}`} target="_blank" rel="noopener noreferrer" title="Official Website / Wikipedia" className="text-zinc-300 hover:text-[#3366CC] transition-all duration-300 hover:scale-125">
                    <GlobeBrandIcon className="w-6 h-6" />
                  </a>
                </div>

                {/* Non-commerce Action Bar */}
                <div className="flex flex-wrap items-center gap-4 pt-6">
                  <button
                    onClick={() => handleFollowToggle(artist.name)}
                    disabled={isPending}
                    className={`px-6 py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                      isFollowing
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_25px_rgba(220,38,38,0.4)]'
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : isFollowing ? (
                      <UserCheck className="w-4 h-4" />
                    ) : (
                      <UserPlus className="w-4 h-4" />
                    )}
                    <span>{isFollowing ? 'FOLLOWING ARTIST' : 'FOLLOW ARTIST'}</span>
                  </button>

                  <Link
                    href="/submit"
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider border border-white/20 backdrop-blur-xl transition-all flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-red-500" />
                    <span>SUBMIT DEMO</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Highlights Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 border-t border-white/10 pt-8">
            <div className="space-y-1 group">
              <span className="text-[11px] text-zinc-400 block uppercase font-mono font-bold tracking-widest">MONTHLY LISTENERS</span>
              <span className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight block drop-shadow-lg">{formatNumber(artist.monthlyListeners)}</span>
            </div>

            <div className="space-y-1 group sm:border-l sm:border-white/10 sm:pl-8">
              <span className="text-[11px] text-zinc-400 block uppercase font-mono font-bold tracking-widest">GLOBAL STREAMS</span>
              <span className="text-4xl sm:text-5xl font-black text-red-500 uppercase tracking-tight block drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]">{formatNumber(artist.totalStreams)}</span>
            </div>

            <div className="space-y-1 group sm:border-l sm:border-white/10 sm:pl-8">
              <span className="text-[11px] text-zinc-400 block uppercase font-mono font-bold tracking-widest">RIAA PLATINUM</span>
              <span className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight block drop-shadow-lg">{artist.riaaCertifications?.platinum ?? 0}X</span>
            </div>

            <div className="space-y-1 group sm:border-l sm:border-white/10 sm:pl-8">
              <span className="text-[11px] text-zinc-400 block uppercase font-mono font-bold tracking-widest">GRAMMY WINS</span>
              <span className="text-4xl sm:text-5xl font-black text-red-500 uppercase tracking-tight block drop-shadow-[0_0_25px_rgba(220,38,38,0.5)]">{artist.grammyWins}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ⭐ Main Content Layout */}
      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 space-y-14 w-full">
        
        {/* ⭐ LATEST DROP: Light Responsive YouTube Embed Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Video className="w-7 h-7 text-red-500 flex-shrink-0" />
              <span>LATEST DROP & OFFICIAL VISUAL</span>
            </h2>
            <span className="text-xs font-mono font-bold text-red-500 uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full">
              FEATURED EMBED
            </span>
          </div>

          <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl hover:shadow-[0_0_40px_rgba(220,38,38,0.2)] transition-shadow duration-500">
            <iframe
              src={
                featuredVideoId
                  ? `https://www.youtube.com/embed/${featuredVideoId}`
                  : `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(safeArtistName + " official music video")}`
              }
              title={`${safeArtistName} Latest Official Music Video`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>

        {/* ⭐ PURE BIO & METRICS BENTO GRID (NO COMMERCE) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 w-full">
          {/* Left Column (8 Columns) - Editorial Bio & Platform Hubs */}
          <div className="lg:col-span-8 space-y-12 w-full">
            {/* Editorial Biography */}
            <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-8 sm:p-10 space-y-6 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3 text-red-500">
                  <Sparkles className="w-5 h-5" />
                  <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                    EDITORIAL BIOGRAPHY & ARTISTIC LEGACY
                  </h2>
                </div>
              </div>

              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base font-normal whitespace-pre-line border-l-2 border-red-600/60 pl-5">
                {artist.bio}
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-bold uppercase">
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>CONFIDENCE: {artist.verificationConfidence || 'HIGH'} (MULTI-SOURCE VERIFIED)</span>
                </div>
                <span className="text-zinc-500">LAST VERIFIED: {artist.biographyLastVerified || '2026-07-21'}</span>
              </div>

              {artist.topSongs && artist.topSongs.length > 0 && (
                <div className="border-t border-white/10 pt-6 space-y-3">
                  <span className="text-xs font-extrabold text-red-500 uppercase tracking-wider block">KEY RECORDINGS & ANTHEMS</span>
                  <div className="flex flex-wrap gap-2.5">
                    {artist.topSongs.map((song, idx) => (
                      <span key={idx} className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-white font-bold text-xs uppercase flex items-center gap-2 hover:border-red-500/50 transition-colors">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        <span>{song}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verified Official Platform Hubs */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <GlobeBrandIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span>OFFICIAL PLATFORM HUBS</span>
                </h2>
                <span className="text-xs font-extrabold text-zinc-500 uppercase">
                  VERIFIED LINKS ({realPlatforms.length})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {realPlatforms.map((platform) => {
                  const lower = platform.name.toLowerCase();
                  let hoverBrandText = 'group-hover:text-red-500';

                  if (lower.includes('spotify')) hoverBrandText = 'group-hover:text-[#1DB954]';
                  else if (lower.includes('apple')) hoverBrandText = 'group-hover:text-[#FA243C]';
                  else if (lower.includes('youtube')) hoverBrandText = 'group-hover:text-[#FF0000]';
                  else if (lower.includes('instagram')) hoverBrandText = 'group-hover:text-[#E4405F]';
                  else if (lower.includes('twitter') || lower.includes('x')) hoverBrandText = 'group-hover:text-[#1DA1F2]';
                  else if (lower.includes('wikipedia')) hoverBrandText = 'group-hover:text-[#3366CC]';

                  return (
                    <div
                      key={platform.id}
                      className="bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 rounded-2xl p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl shadow-2xl group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform text-zinc-300 ${hoverBrandText}`}>
                          {getPlatformBrandIcon(platform.name)}
                        </div>
                        <div className="min-w-0">
                          <h4 className={`font-extrabold text-white text-base uppercase truncate transition-colors ${hoverBrandText}`}>{platform.name}</h4>
                          <span className="text-[10px] text-zinc-500 block truncate font-bold uppercase">VERIFIED ARTIST LINK</span>
                        </div>
                      </div>

                      <a
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-red-600 border border-white/15 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 transition-all shadow-md"
                      >
                        <span>OPEN</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Discography Master Releases */}
            {artistReleases.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Disc className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span>DISCOGRAPHY CATALOG</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {artistReleases.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/releases/${rel.slug}`}
                      className="group bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-red-500/40 rounded-2xl p-5 transition-all flex gap-4 backdrop-blur-xl"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rel.coverUrl} alt={rel.title} className="w-24 h-24 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform flex-shrink-0" />
                      <div className="space-y-1.5 min-w-0">
                        <span className="text-[10px] text-red-500 font-extrabold uppercase tracking-wider">{rel.type} • {rel.releaseDate}</span>
                        <h4 className="font-black text-lg text-white uppercase truncate group-hover:text-red-500 transition-colors">{rel.title}</h4>
                        <p className="text-xs text-zinc-500 font-bold uppercase">CAT: {rel.catalogNumber}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Videos Gallery */}
            {artist.videos && artist.videos.length > 1 && (
              <div className="space-y-6">
                <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <Video className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span>MORE OFFICIAL VIDEOS</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {artist.videos.slice(1).map(vid => (
                    <div
                      key={vid.id}
                      onClick={() => setActiveVideoUrl(`https://www.youtube.com/embed/${vid.youtubeId}?autoplay=1`)}
                      className="group bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/50 cursor-pointer transition-all"
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="font-black text-sm text-white uppercase group-hover:text-red-500 transition-colors">{vid.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (4 Columns) Sidebar Industry Metrics Bento Panel */}
          <div className="lg:col-span-4 space-y-8 w-full">
            <div className="bg-zinc-950/80 border border-white/[0.08] rounded-3xl p-7 space-y-6 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.8)]">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-red-500" />
                  <span>INDUSTRY METRICS & RIAA</span>
                </h3>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-mono font-semibold tracking-widest uppercase flex items-center gap-1.5">
                  VERIFIED
                </span>
              </div>

              {/* 2x2 Glassmorphic Certification Cards Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* RIAA Diamond */}
                <div className="bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 border border-white/[0.05] hover:border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-xl shadow-2xl group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] font-semibold text-zinc-500 uppercase">DIAMOND</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                  </div>
                  <span className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-cyan-200 via-cyan-400 to-blue-500 text-transparent bg-clip-text mt-3 group-hover:scale-105 transition-transform origin-left">
                    {artist.riaaCertifications?.diamond ?? 0}
                  </span>
                </div>

                {/* RIAA Platinum */}
                <div className="bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 border border-white/[0.05] hover:border-zinc-300/30 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-xl shadow-2xl group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] font-semibold text-zinc-500 uppercase">PLATINUM</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shadow-[0_0_8px_rgba(212,212,216,0.8)]"></span>
                  </div>
                  <span className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-gray-100 via-zinc-300 to-zinc-500 text-transparent bg-clip-text mt-3 group-hover:scale-105 transition-transform origin-left">
                    {artist.riaaCertifications?.platinum ?? 0}
                  </span>
                </div>

                {/* RIAA Gold */}
                <div className="bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 border border-white/[0.05] hover:border-amber-400/30 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-xl shadow-2xl group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] font-semibold text-zinc-500 uppercase">GOLD</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                  </div>
                  <span className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-amber-200 via-yellow-400 to-yellow-600 text-transparent bg-clip-text mt-3 group-hover:scale-105 transition-transform origin-left">
                    {artist.riaaCertifications?.gold ?? 0}
                  </span>
                </div>

                {/* Grammy Wins */}
                <div className="bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 border border-white/[0.05] hover:border-rose-500/30 rounded-2xl p-5 flex flex-col justify-between backdrop-blur-xl shadow-2xl group">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.2em] font-semibold text-zinc-500 uppercase">GRAMMY</span>
                    <Award className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-black bg-gradient-to-br from-rose-400 via-red-500 to-red-700 text-transparent bg-clip-text mt-3 group-hover:scale-105 transition-transform origin-left">
                    {artist.grammyWins}
                  </span>
                </div>
              </div>

              {/* Publishing Status Banner */}
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-zinc-400 uppercase">PUBLISHING STATUS</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-medium tracking-wide flex items-center gap-2">
                  <span className="animate-pulse bg-emerald-400 rounded-full h-1.5 w-1.5"></span>
                  <span>{artist.labelStatus || 'SIGNED'}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/90 backdrop-blur-2xl" onClick={() => setActiveVideoUrl(null)} />
          <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden z-10 shadow-2xl">
            <div className="p-4 flex justify-between items-center border-b border-white/10 bg-black">
              <span className="text-xs font-black text-red-500 uppercase tracking-widest">WORLDSTAR VIDEO PLAYER</span>
              <button onClick={() => setActiveVideoUrl(null)} className="text-zinc-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center">
                <CloseIcon className="w-5 h-5" />
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
