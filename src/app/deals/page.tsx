'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';

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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-[#0a0a0a] border border-[#222] p-5 space-y-3">
          <div className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 inline-block uppercase">50% OFF</div>
          <h3 className="font-extrabold text-white text-base uppercase">CUBAN LINK CHAINS &amp; JEWELRY</h3>
          <p className="text-zinc-400 text-xs">Get exclusive discounts on premier streetwear chains and accessories.</p>
          <button className="bg-red-600 text-white font-bold text-xs uppercase px-4 py-2 w-full hover:bg-red-700 transition-colors">CLAIM DEAL</button>
        </div>
        <div className="bg-[#0a0a0a] border border-[#222] p-5 space-y-3">
          <div className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 inline-block uppercase">EXCLUSIVE</div>
          <h3 className="font-extrabold text-white text-base uppercase">DESIGNER SNEAKER MYSTERY BOX</h3>
          <p className="text-zinc-400 text-xs">Authentic hype sneakers and apparel drops curated by WorldStar.</p>
          <button className="bg-red-600 text-white font-bold text-xs uppercase px-4 py-2 w-full hover:bg-red-700 transition-colors">SHOP NOW</button>
        </div>
        <div className="bg-[#0a0a0a] border border-[#222] p-5 space-y-3">
          <div className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 inline-block uppercase">SPONSORED</div>
          <h3 className="font-extrabold text-white text-base uppercase">RECORDING STUDIO PACKAGES</h3>
          <p className="text-zinc-400 text-xs">Professional mixing, mastering &amp; distribution deals for independent artists.</p>
          <button className="bg-red-600 text-white font-bold text-xs uppercase px-4 py-2 w-full hover:bg-red-700 transition-colors">LEARN MORE</button>
        </div>
      </div>
    </div>
  );
}
