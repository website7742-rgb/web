'use client';

import React from 'react';

export default function GenericInfoPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4 max-w-[1200px] mx-auto font-sans">
      <div className="border-l-4 border-red-600 pl-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
          WORLDSTAR <span className="text-red-600">INQUIRIES</span>
        </h1>
        <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mt-1">
          OFFICIAL BRAND & MEDIA PORTAL
        </p>
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] p-6 sm:p-10 space-y-6 rounded-sm">
        <h2 className="text-xl font-bold text-white uppercase border-b border-zinc-800 pb-3">
          ADVERTISE WITH WORLDSTARHIPHOP
        </h2>
        <p className="text-zinc-300 text-sm leading-relaxed">
          Reach millions of culture-shaping fans worldwide across the premiere hip-hop and viral entertainment platform. We offer premium banner placements, sponsored video premieres, brand partnerships, and custom digital activations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="bg-[#111] p-4 border border-[#333]">
            <h3 className="text-red-600 font-extrabold text-sm uppercase mb-1">MEDIA KIT & RATES</h3>
            <p className="text-zinc-400 text-xs">Direct inquiries: ads@worldstarhiphop.com</p>
          </div>
          <div className="bg-[#111] p-4 border border-[#333]">
            <h3 className="text-red-600 font-extrabold text-sm uppercase mb-1">SPONSORED PLACEMENTS</h3>
            <p className="text-zinc-400 text-xs">Video Premieres & Sponsored Posts available 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );
}
