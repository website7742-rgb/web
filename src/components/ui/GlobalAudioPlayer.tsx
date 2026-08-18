'use client';

import React, { useRef, useState } from 'react';
import { useAudio } from '@/providers/AudioContext';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  X
} from 'lucide-react';
import Image from 'next/image';

export function GlobalAudioPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    currentTime, 
    duration, 
    volume, 
    togglePlay, 
    seek, 
    setVolume, 
    closePlayer 
  } = useAudio();

  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newProgress = Math.max(0, Math.min(1, x / rect.width));
      seek(newProgress);
    }
  };

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (volumeBarRef.current) {
      const rect = volumeBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const newVolume = Math.max(0, Math.min(1, x / rect.width));
      setVolume(newVolume);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-[9999] bg-[#09090B]/95 backdrop-blur-md border-t border-[#D4AF37]/30 transform transition-transform duration-500 translate-y-0">
      
      {/* Top Scrubber Bar (Full Width) */}
      <div 
        ref={progressBarRef}
        className="w-full h-1 bg-zinc-900 cursor-pointer group relative"
        onClick={handleProgressClick}
      >
        <div 
          className="absolute top-0 left-0 h-full bg-gold transition-all duration-100 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
        {/* Scrubber Thumb (Visible on hover) */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(212,175,55,0.5)]"
          style={{ left: `calc(${progress * 100}% - 6px)` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 h-20 md:h-24 flex items-center justify-between gap-4">
        
        {/* Left: Track Info */}
        <div className="flex items-center gap-4 w-1/3 min-w-[200px]">
          <div className="relative w-12 h-12 md:w-14 md:h-14 flex-shrink-0 border border-zinc-800">
            <Image 
              src={currentTrack.coverArt} 
              alt={currentTrack.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="font-hero font-bold text-white text-sm md:text-base truncate">
                {currentTrack.title}
              </span>
              <span className="hidden lg:inline-flex px-1.5 py-0.5 border border-[#D4AF37]/30 text-[#D4AF37] text-[9px] uppercase tracking-widest font-mono rounded-none items-center">
                LDAC / High-Res
              </span>
            </div>
            <span className="font-sans text-xs text-zinc-400 truncate">
              {currentTrack.artist}
            </span>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center justify-center w-1/3 flex-shrink-0">
          <div className="flex items-center gap-4 md:gap-6">
            <button 
              onClick={() => seek(Math.max(0, (currentTime - 10) / (duration || 1)))}
              className="text-zinc-500 hover:text-white transition-colors p-2 hidden sm:block cursor-pointer"
              title="Rewind 10s"
              aria-label="Rewind 10 seconds"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
              ) : (
                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-1" />
              )}
            </button>

            <button 
              onClick={() => seek(Math.min(1, (currentTime + 10) / (duration || 1)))}
              className="text-zinc-500 hover:text-white transition-colors p-2 hidden sm:block cursor-pointer"
              title="Fast Forward 10s"
              aria-label="Fast forward 10 seconds"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden md:flex items-center gap-3 mt-1 w-full max-w-xs font-mono text-[10px] text-zinc-500">
            <span>{formatTime(currentTime)}</span>
            <span className="flex-1"></span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Actions */}
        <div className="flex items-center justify-end gap-4 w-1/3 min-w-[120px]">
          <div 
            className="hidden md:flex items-center gap-2 group relative"
            onMouseEnter={() => setIsHoveringVolume(true)}
            onMouseLeave={() => setIsHoveringVolume(false)}
          >
            <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-zinc-400 hover:text-white transition-colors">
              {volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div 
              className={`w-24 h-1 bg-zinc-800 cursor-pointer relative transition-all duration-300 ${isHoveringVolume ? 'opacity-100 w-24' : 'opacity-50 w-16'}`}
              ref={volumeBarRef}
              onClick={handleVolumeClick}
            >
              <div 
                className="absolute top-0 left-0 h-full bg-zinc-400 group-hover:bg-gold transition-colors"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          <div className="w-px h-8 bg-zinc-800 hidden sm:block mx-2"></div>

          <button 
            onClick={closePlayer}
            className="text-zinc-500 hover:text-red-400 transition-colors p-2"
            title="Close Player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
}
