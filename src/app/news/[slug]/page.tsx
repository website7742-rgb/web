'use client';

import React from 'react';
import { useData } from '@/providers/DataContext';
import { Newspaper, Clock, ArrowLeft, Share2, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useUI } from '@/providers/UIContext';

export default function NewsArticleDetailPage({ params }: { params: { slug: string } }) {
  const { news } = useData();
  const { showToast } = useUI();

  const article = news.find(n => n.slug === params.slug);
  const relatedNews = news.filter(n => n.slug !== params.slug).slice(0, 3);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6 font-mono">
        <Newspaper className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
        <h1 className="text-3xl font-extrabold text-white uppercase">ARTICLE NOT FOUND</h1>
        <p className="text-zinc-400 text-xs">The requested news story could not be located in the WorldStar editorial archive.</p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white text-xs font-bold uppercase hover:bg-red-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO NEWSROOM</span>
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Article link copied to clipboard!', 'success');
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 space-y-10 selection:bg-red-600 selection:text-white">
      {/* Back Button */}
      <div>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-zinc-400 hover:text-red-500 uppercase transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO EDITORIAL NEWSROOM</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-6 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-3.5 py-1 rounded-full bg-red-600/20 text-red-500 border border-red-600/40 text-xs font-mono font-bold uppercase tracking-wider">
            {article.category}
          </span>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-red-600/40 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-red-500" />
            <span>SHARE ARTICLE</span>
          </button>
        </div>

        <h1 className="text-3xl sm:text-5xl font-display font-extrabold text-white leading-tight uppercase">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-2">
          <span className="text-red-500 font-bold">BY {article.author.toUpperCase()}</span>
          <span>•</span>
          <span>PUBLISHED: {article.date}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            {article.readTime}
          </span>
        </div>
      </header>

      {/* Featured Cover Image */}
      <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Summary Highlight Box */}
      <div className="p-6 rounded-2xl bg-red-600/10 border border-red-600/30 text-white font-sans text-base leading-relaxed space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-500 uppercase">
          <Sparkles className="w-4 h-4" />
          <span>EDITORIAL SUMMARY</span>
        </div>
        <p className="text-zinc-200 font-medium">{article.summary}</p>
      </div>

      {/* Body Content */}
      <div className="prose prose-invert max-w-none text-zinc-300 font-sans text-base leading-relaxed space-y-6 border-b border-white/10 pb-12">
        <p>{article.content}</p>
        <p>
          WorldStarHipHop remains committed to delivering raw, unedited, and authoritative coverage directly from studio sessions, label headquarters, and stadium tours across North America and internationally.
        </p>
      </div>

      {/* Related News Section */}
      {relatedNews.length > 0 && (
        <section className="space-y-6 pt-6">
          <h3 className="text-xl font-display font-extrabold text-white uppercase flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-500" />
            <span>MORE FROM THE NEWSROOM</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedNews.map((rel) => (
              <Link
                key={rel.id}
                href={`/news/${rel.slug}`}
                className="group bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-red-600/40 transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rel.imageUrl}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase">{rel.category}</span>
                  <h4 className="text-xs font-bold text-white uppercase line-clamp-2 group-hover:text-red-400 transition-colors">
                    {rel.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
