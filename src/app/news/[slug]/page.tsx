'use client';

import React, { useState } from 'react';
import { MOCK_NEWS, MOCK_ARTISTS } from '@/lib/data/mockData';
import { notFound, useParams } from 'next/navigation';
import { Clock, Share2, Twitter, Linkedin, Copy, Check, ArrowLeft, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [copied, setCopied] = useState(false);

  const article = MOCK_NEWS.find((a) => a.slug === slug) || MOCK_NEWS[0];

  if (!article) return notFound();

  // Find artists mentioned in this article
  const mentionedArtists = MOCK_ARTISTS.slice(0, 3);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <article className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full space-y-12">
      {/* Back to Newsroom Link */}
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-xs font-mono text-gold hover:underline font-bold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO NEWSROOM</span>
      </Link>

      {/* Article Header */}
      <header className="space-y-6 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-xs font-mono font-bold uppercase">
            {article.category}
          </span>
          <span className="text-xs font-mono text-zinc-400">{article.date}</span>
          <span className="text-xs font-mono text-zinc-500">•</span>
          <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base sm:text-xl text-zinc-300 font-sans font-light leading-relaxed">
          {article.summary}
        </p>

        <div className="flex items-center justify-between border-y border-white/10 py-4 font-mono text-xs text-zinc-400">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">WRITTEN BY</span>
            <span className="text-white font-bold text-sm">{article.author}</span>
          </div>

          {/* Floating Social Share Triggers */}
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[10px] uppercase font-bold hidden sm:inline">SHARE:</span>
            <button
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 text-zinc-300 hover:text-gold transition-all"
            >
              <Twitter className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 text-zinc-300 hover:text-gold transition-all"
            >
              <Linkedin className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-gold/40 text-zinc-300 hover:text-gold transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Image */}
      <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Grid (Article Body + Mentioned Artist Sidebar) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Article Content */}
        <div className="lg:col-span-8 space-y-6 text-zinc-300 font-sans text-base sm:text-lg leading-relaxed font-light">
          <p>
            {article.content || `Aetheria Music Group today announced record-breaking global streaming performance and Grammy Award recognition across major field categories. The official press kit telemetry reveals unprecedented listener retention across Spotify, Apple Music, and Amazon Music Unlimited.`}
          </p>
          <p>
            The shift toward multi-platform distribution and physical vinyl LP pressings reflects a broader industry movement toward high-fidelity audio consumption. Artists on the Aetheria roster have dominated the Billboard Hot 100 and Global 200 charts throughout the current quarter.
          </p>

          <blockquote className="glass-panel-gold rounded-2xl p-6 border-l-4 border-gold text-white font-display font-bold text-xl my-8">
            &ldquo;Our vision is to empower recording artists with complete creative autonomy while delivering enterprise-grade publishing support worldwide.&rdquo;
          </blockquote>

          <p>
            As live stadium tour schedules resume globally, demand for ticket access and collector merchandise has reached an all-time high. A&R representatives continue to review new demo submissions via the official executive submission queue.
          </p>
        </div>

        {/* Mentioned Artist Sidebar (Cross-Linked Data) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl space-y-6">
            <h3 className="text-xs font-mono text-gold font-bold uppercase tracking-wider border-b border-white/10 pb-3">
              MENTIONED IN THIS STORY
            </h3>

            <div className="space-y-4">
              {mentionedArtists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/roster/${artist.slug}`}
                  className="group flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/40 hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-white group-hover:text-gold transition-colors">
                        {artist.name}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-400">{artist.genres[0]} • {artist.countryFlag}</span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-gold transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
