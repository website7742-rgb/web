'use client';

import React, { useState } from 'react';
import { Newspaper, Clock, Sparkles, BookOpen } from 'lucide-react';

export function NewsEditorial() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'POP', 'HIP-HOP', 'R&B', 'ROCK', 'LATIN', 'GLOBAL'];

  const articles = [
    {
      id: 'news-1',
      title: 'Aetheria Music Group Secures 14 Nominations at the 68th Annual Grammy Awards',
      category: 'POP',
      date: '2026-06-12',
      readTime: '4 min read',
      author: 'A&R Executive Desk',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png',
      summary: 'Taylor Swift, Kendrick Lamar, and Billie Eilish lead main field nominations across Album of the Year and Record of the Year.',
    },
    {
      id: 'news-2',
      title: 'The Shift in Global Streaming Dynamics: Latin Trap & Afro-Fusion Take Dominant Lead',
      category: 'GLOBAL',
      date: '2026-06-18',
      readTime: '6 min read',
      author: 'Global Analytics & Charts',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Bad_Bunny_2019_by_Glenn_Francis_%28cropped%29.jpg',
      summary: 'Data reveals cross-border streaming consumption for Spanish and West African recordings has surged over 40% year-over-year.',
    },
    {
      id: 'news-3',
      title: 'West Coast Hip-Hop Architectural Revival: Kendrick Lamar & pgLang Redefine Stadium Era',
      category: 'HIP-HOP',
      date: '2026-06-25',
      readTime: '5 min read',
      author: 'Editorial Desk',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/18/KendrickSZASPurs230725-144_%28cropped%29_desaturated.jpg',
      summary: 'Inside the creative process of "Not Like Us" and the historical impact on stadium-level rap production.',
    },
    {
      id: 'news-4',
      title: 'Analog Vinyl Resurgence & The Collector LP Market: 180g Heavy Pressings Hit 30-Year High',
      category: 'ROCK',
      date: '2026-07-02',
      readTime: '3 min read',
      author: 'Vinyl Publishing Desk',
      imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=1200&q=80',
      summary: 'Physical vinyl LP sales eclipse digital download revenues as music purists demand high-fidelity tactile listening experiences.',
    },
  ];

  const filteredArticles = selectedCategory === 'ALL'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-zinc-800 pb-6 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-3">
            <Newspaper className="w-4 h-4 text-gold flex-shrink-0" />
            <span>GLOBAL PRESS & EDITORIAL NEWSROOM</span>
          </div>
          <h2 className="text-fluid-h2 font-display font-bold text-white tracking-tight">
            EDITORIAL & <span className="text-gold">JOURNALISM</span>
          </h2>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-none text-xs font-mono font-bold transition-all min-h-[44px] ${
                selectedCategory === cat
                  ? 'bg-gold text-black'
                  : 'bg-transparent border border-zinc-800 text-zinc-400 hover:text-white hover:border-gold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((article) => (
          <article
            key={article.id}
            className="group bg-black rounded-none overflow-hidden border border-zinc-800 hover:border-gold transition-colors duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 rounded-none bg-black border border-gold text-gold text-[10px] font-mono font-bold uppercase tracking-wider">
                {article.category}
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                <span className="text-gold font-bold">{article.author}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-display font-bold text-white group-hover:text-gold transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-sm text-zinc-300 font-sans font-light leading-relaxed line-clamp-2">
                {article.summary}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
