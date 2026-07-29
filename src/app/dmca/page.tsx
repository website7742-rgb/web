'use client';

import React from 'react';

export default function DmcaPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4 max-w-[1200px] mx-auto font-sans">
      <div className="border-l-4 border-red-600 pl-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
          DMCA <span className="text-red-600">POLICY</span>
        </h1>
        <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mt-1">
          DIGITAL MILLENNIUM COPYRIGHT ACT NOTICE
        </p>
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] p-6 sm:p-10 space-y-4 rounded-sm text-zinc-300 text-sm">
        <p>WorldStarHipHop respects the intellectual property rights of others and expects its users to do the same.</p>
        <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please submit your claim to copyright@worldstarhiphop.com.</p>
      </div>
    </div>
  );
}
