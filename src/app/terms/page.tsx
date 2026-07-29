'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
          <FileText className="w-5 h-5" />
          <span className="text-xs font-extrabold tracking-widest uppercase">TERMS OF SERVICE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-none">
          TERMS &amp; <span className="text-red-600">CONDITIONS</span>
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm font-semibold uppercase tracking-wider mt-2">
          EFFECTIVE DATE: JANUARY 1, 2026
        </p>
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] p-6 sm:p-10 space-y-8 rounded-sm text-zinc-300 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-white uppercase text-red-600">1. ACCEPTANCE OF TERMS</h2>
          <p>By accessing or using WorldStarHipHop.com (&quot;WorldStar&quot;), you agree to be bound by these Terms of Use and all applicable laws and regulations.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-white uppercase text-red-600">2. USER SUBMISSIONS &amp; CONTENT LICENSE</h2>
          <p>When you submit videos, commentary, or media to WorldStar, you grant WorldStar a worldwide, non-exclusive, royalty-free, perpetual license to stream, distribute, promote, and feature your submitted content.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-white uppercase text-red-600">3. COMMUNITY CODE OF CONDUCT</h2>
          <p>Users are strictly prohibited from posting unlawful, threatening, abusive, defamatory, obscene, or copyright-infringing material.</p>
        </section>
        <section className="space-y-2">
          <h2 className="text-lg font-extrabold text-white uppercase text-red-600">4. DISCLAIMER &amp; LIMITATION OF LIABILITY</h2>
          <p>WorldStar provides content on an &quot;AS IS&quot; basis and assumes no liability for user-submitted videos, third-party advertisements, or external links.</p>
        </section>
      </div>
    </div>
  );
}
