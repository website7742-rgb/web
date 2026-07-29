import React from 'react';
import { AdItem } from '@/types';

export function AdCard({ item }: { item: AdItem }) {
  return (
    <div className="bg-[#111] border border-[#333] flex flex-col items-center justify-center p-4 text-center min-h-[160px]">
      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-3 leading-tight">
        {item.adText}
      </span>
      <span className="text-sm font-bold text-white uppercase bg-red-600 px-4 py-2 hover:bg-red-700 cursor-pointer transition-colors mt-1 w-full shadow-md">
        {item.cta}
      </span>
    </div>
  );
}
