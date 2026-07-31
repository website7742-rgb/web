'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag, ShoppingBag, Flame, Sparkles } from 'lucide-react';

export default function DealsPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-6 max-w-[1200px] mx-auto font-sans">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-red-600 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        BACK TO HOME
      </Link>

      <div className="border-l-4 border-red-600 pl-4 sm:pl-6 mb-8 py-1">
        <div className="flex items-center gap-2 text-red-600 mb-1">
          <Tag className="w-5 h-5" />
          <span className="text-xs font-extrabold tracking-widest uppercase">EXCLUSIVE PROMOTIONS</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
          WORLDSTAR <span className="text-red-600">DEALS &amp; PROMOS</span>
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-2">
          LIMITED TIME PARTNER DISCOUNTS &amp; MERCH OFFERS
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Deal Card 1 */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between hover:border-red-600/40 transition-all">
          <div className="space-y-2">
            <div className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded inline-flex items-center gap-1 uppercase tracking-widest">
              <Flame className="w-3 h-3" />
              50% OFF
            </div>
            <h3 className="font-extrabold text-white text-base uppercase">CUBAN LINK CHAINS &amp; JEWELRY</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">Get exclusive discounts on premier streetwear chains and accessories from official WorldStar merch line.</p>
          </div>
          <Link
            href="/merch"
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase px-4 py-3 rounded-xl w-full text-center transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>CLAIM DEAL</span>
          </Link>
        </div>

        {/* Deal Card 2 */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between hover:border-red-600/40 transition-all">
          <div className="space-y-2">
            <div className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded inline-flex items-center gap-1 uppercase tracking-widest">
              <Sparkles className="w-3 h-3" />
              EXCLUSIVE DROP
            </div>
            <h3 className="font-extrabold text-white text-base uppercase">DESIGNER SNEAKER MYSTERY BOX</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">Authentic hype sneakers and apparel drops curated exclusively for WorldStar community members.</p>
          </div>
          <Link
            href="/merch"
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase px-4 py-3 rounded-xl w-full text-center transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>SHOP NOW</span>
          </Link>
        </div>

        {/* Deal Card 3 */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl flex flex-col justify-between hover:border-red-600/40 transition-all">
          <div className="space-y-2">
            <div className="bg-red-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded inline-flex items-center gap-1 uppercase tracking-widest">
              A&R SPECIAL
            </div>
            <h3 className="font-extrabold text-white text-base uppercase">RECORDING STUDIO PACKAGES</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">Professional mixing, mastering &amp; executive publishing submission packages for independent artists.</p>
          </div>
          <Link
            href="/submit"
            className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase px-4 py-3 rounded-xl w-full text-center transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>LEARN MORE &amp; SUBMIT</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
