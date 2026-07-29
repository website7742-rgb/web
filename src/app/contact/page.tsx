'use client';

import React from 'react';

export default function ContactPage() {
  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4 max-w-[1200px] mx-auto font-sans">
      <div className="border-l-4 border-red-600 pl-4 mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
          CONTACT <span className="text-red-600">US</span>
        </h1>
        <p className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mt-1">
          GET IN TOUCH WITH THE WORLDSTAR TEAM
        </p>
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] p-6 sm:p-10 space-y-6 rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111] p-5 border border-[#333] space-y-2">
            <h3 className="text-red-600 font-extrabold text-base uppercase">GENERAL INQUIRIES</h3>
            <p className="text-zinc-400 text-xs">Email: support@worldstarhiphop.com</p>
          </div>
          <div className="bg-[#111] p-5 border border-[#333] space-y-2">
            <h3 className="text-red-600 font-extrabold text-base uppercase">VIDEO SUBMISSIONS</h3>
            <p className="text-zinc-400 text-xs">Submit direct content via our Submit Portal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
