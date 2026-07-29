'use client';

import React from 'react';
import { MOCK_MERCH } from '@/lib/data/mockData';
import { useUI } from '@/providers/UIContext';
import { ShoppingBag, ArrowRight, Sparkles, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export function MerchTeaser() {
  const { addToCart } = useUI();

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-2">
            <ShoppingBag className="w-4 h-4" />
            <span>LIMITED EDITION STORE DROPS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            LUXURY <span className="text-gold-gradient">MERCHANDISE</span>
          </h2>
        </div>
        <Link
          href="/merch"
          className="flex items-center gap-2 text-xs font-mono text-gold hover:underline uppercase tracking-wider"
        >
          <span>VIEW FULL STORE ({MOCK_MERCH.length})</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_MERCH.map((item) => (
          <div
            key={item.id}
            className="group glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-gold/50 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-square overflow-hidden bg-obsidian-light p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
              {item.isExclusive && (
                <div className="absolute top-6 left-6 px-3 py-1 rounded-full bg-gold/90 text-obsidian text-[10px] font-mono font-bold">
                  LIMITED DROP
                </div>
              )}
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-zinc-500">{item.category}</span>
                <h3 className="text-base font-display font-bold text-white line-clamp-1 group-hover:text-gold transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm font-mono font-bold text-gold mt-1">{formatCurrency(item.price)}</p>
              </div>

              <button
                onClick={() => addToCart(item, 'M')}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-gold hover:text-obsidian text-white font-display font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>ADD TO BAG</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
