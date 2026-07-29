'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { VideoItem } from '@/types';
import LiveViewerBadge from '@/components/ui/LiveViewerBadge';

// A tiny 1x1 dark reddish gradient base64 to serve as a smooth placeholder
const DARK_BLUR_URI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO89ehRPQAIaAMs0/z7pwAAAABJRU5ErkJggg==';

export function VideoCard({ item }: { item: VideoItem }) {
  const [imgError, setImgError] = useState(false);
  return (
    <a
      href={item.videoLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group block space-y-1.5 cursor-pointer"
    >
      <div className="relative aspect-video w-full bg-zinc-900 overflow-hidden border border-[#222]">
        {!imgError ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            placeholder="blur"
            blurDataURL={DARK_BLUR_URI}
            onError={() => setImgError(true)}
            className="object-cover filter brightness-90 group-hover:brightness-100 transition-all duration-500 ease-in-out"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
            <Play className="w-8 h-8 text-zinc-600" aria-hidden="true" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600/95 flex items-center justify-center shadow-xl border border-red-500/50 group-hover:scale-110 transition-transform">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white ml-1" aria-hidden="true" />
          </div>
        </div>
        
        {/* Real-Time Viewers Badge */}
        <div className="absolute top-2 left-2">
          <LiveViewerBadge roomId={item.id} />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 pt-0.5">
        <h3 className="font-bold text-red-600 text-xs sm:text-sm leading-tight uppercase line-clamp-3 group-hover:underline decoration-red-600">
          {item.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase tracking-wide mt-0.5">
          <span>{item.views}</span>
          <span>|</span>
          <span>{item.posted}</span>
        </div>
      </div>
    </a>
  );
}
