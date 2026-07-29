'use client';

import React, { useState } from 'react';
import { useData } from '@/providers/DataContext';
import { Newspaper, Clock, Search } from 'lucide-react';
import Link from 'next/link';

export default function NewsPage() {
  const { news } = useData();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['ALL', 'BREAKING', 'COVER_STORY', 'INDUSTRY_TRENDS', 'VIDEO_INTERVIEWS', 'STYLE_CULTURE', 'LABEL_ANNOUNCEMENT'];

  const filteredNews = news.filter((article) => {
    const matchesCategory = selectedCategory === 'ALL' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredArticle = news[0];

  return (
    <div className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full space-y-12">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-mono font-bold uppercase">
          <Newspaper className="w-4 h-4 text-gold" />
          <span>AETHERIA EDITORIAL & MEDIA NEWSROOM</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-white tracking-tight">
          JOURNALISM & <span className="text-gold-gradient">CULTURE</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-sans font-light max-w-2xl">
          Original reportage, deep A&R analysis, Grammy coverage, and executive interviews from the frontlines of the global music industry.
        </p>
      </div>

      {/* Featured Cover Story */}
      {featuredArticle && (
        <Link href={`/news/${featuredArticle.slug}`} className="group block">
          <div className="glass-panel-gold rounded-3xl p-6 sm:p-10 border border-gold/40 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                  FEATURED COVER STORY
                </span>
                <span className="text-xs font-mono text-zinc-400">{featuredArticle.date}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white group-hover:text-gold transition-colors leading-tight">
                {featuredArticle.title}
              </h2>

              <p className="text-sm sm:text-base text-zinc-300 font-sans font-light line-clamp-3 leading-relaxed">
                {featuredArticle.summary}
              </p>

              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 pt-2">
                <span className="text-gold font-bold">BY {featuredArticle.author}</span>
                <span>â€¢</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  {featuredArticle.readTime}
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredArticle.imageUrl}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </Link>
      )}

      {/* Filter Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap min-h-[44px] ${
                selectedCategory === cat
                  ? 'bg-gold text-obsidian shadow-lg'
                  : 'glass-panel border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search newsroom..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-obsidian border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-gold min-h-[44px]"
          />
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredNews.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-obsidian/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-obsidian/85 backdrop-blur-md border border-gold/40 text-gold text-[10px] font-mono font-bold uppercase tracking-wider">
                {article.category}
              </div>
            </div>

            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                <span className="text-gold font-bold">{article.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-xl font-display font-bold text-white group-hover:text-gold transition-colors leading-snug line-clamp-2">
                {article.title}
              </h3>

              <p className="text-xs text-zinc-300 font-sans font-light line-clamp-3 leading-relaxed">
                {article.summary}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
