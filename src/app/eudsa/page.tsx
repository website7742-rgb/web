'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function EuDsaPage() {
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
          <ShieldAlert className="w-5 h-5" />
          <span className="text-xs font-extrabold tracking-widest uppercase">REGULATORY COMPLIANCE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
          EU DIGITAL <span className="text-red-600">SERVICES ACT (DSA)</span>
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-2">
          INFORMATION FOR EUROPEAN UNION USERS &amp; AUTHORITIES
        </p>
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] p-6 sm:p-10 space-y-6 rounded-sm text-zinc-300 text-sm leading-relaxed">
        <p>In accordance with Article 24(2) of the European Digital Services Act (Regulation (EU) 2022/2065), online platforms are required to publish information on their average monthly active recipients in the European Union.</p>
        <div className="bg-[#111] p-5 border border-zinc-800 space-y-2 text-xs">
          <h2 className="text-white font-extrabold uppercase text-sm">EU MONTHLY ACTIVE RECIPIENTS</h2>
          <p className="text-zinc-400">Average monthly active recipients in the European Union are monitored and updated periodically in compliance with EU regulations.</p>
        </div>
        <div className="space-y-1 text-xs text-zinc-400">
          <p><strong className="text-white">Single Point of Contact for EU Authorities:</strong> dsa@worldstarhiphop.com</p>
        </div>
      </div>
    </div>
  );
}
