'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ShieldCheck, User } from 'lucide-react';
import { useData } from '@/providers/DataContext';

export function RosterSliderClient() {
  const { artists } = useData();
  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  if (!artists || artists.length === 0) {
    return (
      <div className="w-full h-[160px] bg-[#111] border border-[#222] rounded-lg flex flex-col items-center justify-center text-center p-4">
        <User className="w-8 h-8 text-zinc-600 mb-2" aria-hidden="true" />
        <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-wider">No Artists Found</h3>
        <p className="text-zinc-600 text-[10px] uppercase tracking-widest mt-1">Roster is currently empty or failed to load.</p>
      </div>
    );
  }

  const rosterArtists = artists.slice(0, 20);

  return (
    <div 
      className="flex overflow-x-auto gap-4 pb-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 rounded-lg"
      tabIndex={0}
      aria-label="Horizontal Artist Roster"
    >
      {rosterArtists.map((artist, idx) => (
        <Link
          key={artist.id}
          href={`/roster/${artist.slug}`}
          className="shrink-0 group cursor-pointer w-[140px]"
        >
          <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-zinc-900 mb-2.5">
            {!imgError[artist.id] ? (
              <Image
                src={artist.avatarUrl}
                alt={artist.name}
                fill
                sizes="140px"
                onError={() => setImgError(prev => ({ ...prev, [artist.id]: true }))}
                className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-800">
                <User className="w-10 h-10 text-zinc-600" aria-hidden="true" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-lg" />
            
            <div className="absolute top-2 left-2 w-6 h-6 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/10">
              <span className="text-[9px] font-black text-zinc-300 leading-none">#{idx + 1}</span>
            </div>
            
            <div className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-lg">
              <ShieldCheck className="w-2.5 h-2.5" aria-hidden="true" />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-2xl">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="px-0.5">
            <h3 className="text-white font-bold text-xs leading-tight truncate group-hover:text-red-500 transition-colors uppercase tracking-wide">
              {artist.name}
            </h3>
            <p className="text-zinc-500 text-[10px] mt-0.5 truncate">{artist.genres?.[0] || 'Hip-Hop / Rap'}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
