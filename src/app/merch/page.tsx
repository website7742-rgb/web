'use client';

import React, { useState } from 'react';
import { useData } from '@/context/DataContext';
import { ShoppingBag, Sparkles, Filter } from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function MerchPage() {
  const { merch } = useData();
  const { showToast } = useUI();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'VINYL', 'APPAREL', 'ACCESSORIES', 'COLLECTIBLE'];

  const filteredMerch = selectedCategory === 'ALL'
    ? merch
    : merch.filter(m => m.category === selectedCategory);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddToCart = (title: string) => {
    showToast(`Added "${title}" to your order summary!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-label uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL LABEL STORE</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-hero font-extrabold text-white tracking-tight">
            MERCHANDISE & <span className="text-gold-gradient">VINYL</span>
          </h1>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all min-h-[44px] ${
                selectedCategory === cat
                  ? 'bg-gold text-obsidian shadow-lg'
                  : 'glass-panel border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Merch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMerch.map((item) => (
          <div
            key={item.id}
            className="group glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-gold/40 transition-all flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-obsidian/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              {item.isExclusive && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gold text-obsidian font-mono text-[10px] font-bold uppercase tracking-widest shadow-xl">
                  LIMITED EDITION
                </span>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500">{item.category}</span>
                <h3 className="text-base font-display font-bold text-white line-clamp-1 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{item.description}</p>
                <p className="text-sm font-mono font-bold text-gold mt-2">{formatCurrency(item.price)}</p>
              </div>

              <button
                onClick={() => handleAddToCart(item.title)}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-gold hover:text-obsidian text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADD TO CART</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
