'use client';

import React, { useState } from 'react';
import { ParticleHero } from '@/components/home/ParticleHero';
import { BillboardCharts } from '@/components/home/BillboardCharts';
import { FeaturedRoster } from '@/components/home/FeaturedRoster';
import { NewsEditorial } from '@/components/home/NewsEditorial';
import { MerchTeaser } from '@/components/home/MerchTeaser';
import { useData } from '@/context/DataContext';
import { 
  Radio, 
  Sparkles, 
  Flame, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Globe, 
  Disc, 
  Video, 
  Calendar, 
  Ticket, 
  Download, 
  TrendingUp, 
  Send,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { artists, releases, tourDates } = useData();
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const featuredArtist = artists[0]; // Taylor Swift
  const mainReleases = releases.slice(0, 4);
  const mainTours = tourDates.slice(0, 3);

  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-16 sm:space-y-24 w-full overflow-x-hidden pb-20">
      {/* 1. Fullscreen Cinematic Hero (100vh) */}
      <section className="relative min-h-[92vh] sm:min-h-[100vh] flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 overflow-hidden border-b border-zinc-800 w-full">
        <ParticleHero />
      </section>

      {/* 2. Breaking Music Headlines Bar */}
      <div className="w-full bg-gold/10 border-y border-gold/30 py-3 px-4 overflow-hidden">
        <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto flex items-center justify-between gap-4 font-mono text-xs text-gold">
          <div className="flex items-center gap-2 flex-shrink-0 font-bold">
            <Radio className="w-4 h-4 text-gold animate-pulse" />
            <span className="uppercase tracking-widest text-[11px] bg-gold text-obsidian px-2.5 py-0.5 rounded font-extrabold">BREAKING MUSIC NEWS</span>
          </div>

          <div className="overflow-hidden whitespace-nowrap flex-1">
            <p className="inline-block animate-marquee text-zinc-200 text-xs">
              🔥 TAYLOR SWIFT BREATHTAKING ERAS TOUR PASSES 100M LISTENERS • ⚡ KENDRICK LAMAR &quot;NOT LIKE US&quot; TOPS GLOBAL CHARTS • 🏆 AETHERIA ARTISTS EARN 14 GRAMMY NOMINATIONS • 🎵 THE WEEKND SETS NEW SPOTIFY RECORD
            </p>
          </div>
        </div>
      </div>

      {/* 3. Featured Global Artist Spotlight */}
      {featuredArtist && (
        <section className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
          <div className="bg-black border border-gold rounded-none p-6 sm:p-10 border border-gold/40  grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-mono font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gold" />
                  <span>GLOBAL ARTIST SPOTLIGHT</span>
                </span>
                <span className="text-xs font-mono text-zinc-400">{featuredArtist.countryFlag} {featuredArtist.country}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
                {featuredArtist.name}
              </h2>

              <p className="text-sm sm:text-base text-zinc-200 font-sans font-light leading-relaxed line-clamp-4">
                {featuredArtist.bio}
              </p>

              <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-4 font-mono text-xs">
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold">MONTHLY LISTENERS</span>
                  <span className="text-lg sm:text-xl font-bold text-white">{formatNumber(featuredArtist.monthlyListeners)}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold">GLOBAL STREAMS</span>
                  <span className="text-lg sm:text-xl font-bold text-gold">{formatNumber(featuredArtist.totalStreams)}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block text-[10px] uppercase font-bold">GRAMMY WINS</span>
                  <span className="text-lg sm:text-xl font-bold text-white">{featuredArtist.grammyWins}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href={`/roster/${featuredArtist.slug}`}
                  className="btn-gold-luxury px-6 py-3 rounded-none text-xs font-bold flex items-center gap-2 min-h-[44px]"
                >
                  <span>EXPLORE PRESS KIT</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-[4/3] rounded-none overflow-hidden border border-zinc-800 ">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={featuredArtist.heroUrl} alt={featuredArtist.name} className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-700" />
            </div>
          </div>
        </section>
      )}

      {/* 4. Aetheria Global Top 10 Charts */}
      <BillboardCharts />

      {/* 5. Trending Master Releases */}
      {mainReleases.length > 0 && (
        <section className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full space-y-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-3">
                <Disc className="w-4 h-4 text-gold flex-shrink-0" />
                <span>MASTER DISCOGRAPHY RELEASES</span>
              </div>
              <h2 className="text-fluid-h2 font-display font-extrabold text-white tracking-tight">
                NEW & <span className="text-gold">TRENDING RELEASES</span>
              </h2>
            </div>

            <Link href="/releases" className="text-xs font-mono text-gold font-bold hover:underline flex items-center gap-1.5 min-h-[44px]">
              <span>VIEW FULL DISCOGRAPHY CATALOG →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainReleases.map((rel) => (
              <Link
                key={rel.id}
                href={`/releases/${rel.slug}`}
                className="group bg-black border border-zinc-800 rounded-none p-5 border border-zinc-800 hover:border-gold/50 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-square rounded-none overflow-hidden mb-4 border border-zinc-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={rel.coverUrl} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">{rel.type} • {rel.releaseDate}</span>
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-gold transition-colors truncate">{rel.title}</h3>
                  <p className="text-xs font-sans text-zinc-400">{rel.artistName}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 6. Official Music Videos Showcase */}
      <section className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full space-y-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-3">
              <Video className="w-4 h-4 text-gold flex-shrink-0" />
              <span>AETHERIA VISUAL & VIDEO GALLERY</span>
            </div>
            <h2 className="text-fluid-h2 font-display font-extrabold text-white tracking-tight">
              OFFICIAL <span className="text-gold">MUSIC VIDEOS</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div
            onClick={() => setActiveVideoUrl('https://www.youtube.com/embed/qSqVVswa420?autoplay=1')}
            className="group bg-black border border-zinc-800 rounded-none overflow-hidden border border-zinc-800 hover:border-gold/50 cursor-pointer transition-all"
          >
            <div className="relative aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.ytimg.com/vi/qSqVVswa420/maxresdefault.jpg" alt="Taylor Swift Fortnight Video" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 space-y-1">
              <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">OFFICIAL MUSIC VIDEO</span>
              <h3 className="font-display font-bold text-xl text-white group-hover:text-gold transition-colors">Taylor Swift — Fortnight (feat. Post Malone)</h3>
            </div>
          </div>

          <div
            onClick={() => setActiveVideoUrl('https://www.youtube.com/embed/T6eK-2OQtew?autoplay=1')}
            className="group bg-black border border-zinc-800 rounded-none overflow-hidden border border-zinc-800 hover:border-gold/50 cursor-pointer transition-all"
          >
            <div className="relative aspect-video overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://i.ytimg.com/vi/T6eK-2OQtew/maxresdefault.jpg" alt="Kendrick Lamar Not Like Us Video" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 space-y-1">
              <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">OFFICIAL MUSIC VIDEO</span>
              <h3 className="font-display font-bold text-xl text-white group-hover:text-gold transition-colors">Kendrick Lamar — Not Like Us</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Editorial Stories & Newsroom */}
      <NewsEditorial />

      {/* 8. Artist Roster Discovery */}
      <FeaturedRoster />

      {/* 9. Upcoming Stadium Tours */}
      {mainTours.length > 0 && (
        <section className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full space-y-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-zinc-800 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-3">
                <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
                <span>WORLDWIDE LIVE TOURS & STADIUM DATES</span>
              </div>
              <h2 className="text-fluid-h2 font-display font-extrabold text-white tracking-tight">
                UPCOMING <span className="text-gold">STADIUM TOURS</span>
              </h2>
            </div>
            <Link href="/tour" className="text-xs font-mono text-gold font-bold hover:underline flex items-center gap-1.5 min-h-[44px]">
              <span>VIEW ALL WORLD TOUR DATES →</span>
            </Link>
          </div>

          <div className="space-y-4">
            {mainTours.map((tour) => (
              <div
                key={tour.id}
                className="bg-black border border-zinc-800 rounded-none p-5 border border-zinc-800 hover:border-gold/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-gold font-bold uppercase tracking-wider">{tour.tourName} • {tour.artistName}</span>
                  <h3 className="font-display font-bold text-lg text-white">{tour.venue} — {tour.city}, {tour.country}</h3>
                </div>

                <a
                  href={tour.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-none bg-gold text-obsidian font-hero text-xs font-bold hover:bg-gold-light transition-all flex items-center justify-center gap-1.5 min-h-[44px] flex-shrink-0"
                >
                  <Ticket className="w-4 h-4" />
                  <span>TICKETS</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. Label Publishing & Collector Merchandise Teaser */}
      <MerchTeaser />

      {/* 11. Global Statistics Banner */}
      <section className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="bg-black border border-gold rounded-none p-8 sm:p-12 border border-gold/40 grid grid-cols-2 md:grid-cols-4 gap-8 text-center ">
          <div>
            <span className="text-[11px] font-mono text-zinc-400 block uppercase font-bold mb-1">GLOBAL CUMULATIVE STREAMS</span>
            <span className="text-3xl sm:text-5xl font-mono font-extrabold text-white">85.4B+</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-zinc-400 block uppercase font-bold mb-1">RIAA PLATINUM CERTS</span>
            <span className="text-3xl sm:text-5xl font-mono font-extrabold text-gold">450+</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-zinc-400 block uppercase font-bold mb-1">GRAMMY ACADEMY WINS</span>
            <span className="text-3xl sm:text-5xl font-mono font-extrabold text-white">62</span>
          </div>
          <div>
            <span className="text-[11px] font-mono text-zinc-400 block uppercase font-bold mb-1">WORLDWIDE TERRITORIES</span>
            <span className="text-3xl sm:text-5xl font-mono font-extrabold text-gold">140+</span>
          </div>
        </div>
      </section>

      {/* 12. VIP Executive Newsletter Subscription */}
      <section className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 w-full">
        <div className="bg-black border border-zinc-800 rounded-none p-8 sm:p-12 border border-zinc-800 space-y-6 text-center max-w-3xl mx-auto ">
          <div className="w-12 h-12 rounded-none bg-gold/15 border border-gold/30 flex items-center justify-center mx-auto text-gold">
            <Send className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
            SUBSCRIBE TO EXECUTIVE <span className="text-gold">PRESS DISPATCHES</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans font-light">
            Receive exclusive release announcements, A&R industry insights, and stadium tour access directly to your inbox.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Aetheria Executive Dispatches!'); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              placeholder="Enter official email..."
              className="p-3.5 rounded-none bg-obsidian border border-zinc-800 text-white text-xs font-mono focus:outline-none focus:border-gold flex-1 min-h-[44px]"
            />
            <button type="submit" className="btn-gold-luxury px-6 py-3.5 rounded-none text-xs font-bold flex-shrink-0 min-h-[44px]">
              <span>SUBSCRIBE</span>
            </button>
          </form>
        </div>
      </section>

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
