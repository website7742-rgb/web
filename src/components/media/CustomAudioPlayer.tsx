'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';

interface CustomAudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  className?: string;
}

export function CustomAudioPlayer({ src, title, artist, className = '' }: CustomAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-neutral-950 border border-neutral-800 p-4 rounded-sm shadow-xl font-mono text-white select-none ${className}`}>
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* TRACK HEADER IF PROVIDED */}
      {(title || artist) && (
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="truncate pr-4">
            <span className="font-extrabold uppercase text-white tracking-tight block truncate">
              {title || 'UNNAMED DROP'}
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block truncate">
              {artist || 'WORLDSTAR ARTIST'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest">AUDIO ENGINE</span>
          </div>
        </div>
      )}

      {/* CONTROLS ROW */}
      <div className="flex items-center gap-3">
        {/* PLAY / PAUSE BUTTON */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 bg-red-600 hover:bg-red-500 text-white rounded-sm flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-[0_0_12px_rgba(220,38,38,0.4)]"
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* TIME STAMPS & PROGRESS BAR */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="relative w-full flex items-center h-2 group">
            <div className="absolute inset-0 bg-neutral-900 border border-neutral-800 rounded-none overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* MUTE / VOLUME TOGGLE */}
        <button
          onClick={toggleMute}
          className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-2 shrink-0"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-red-500" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
