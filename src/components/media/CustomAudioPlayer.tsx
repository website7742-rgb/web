'use client';

import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/providers/AudioContext';

interface CustomAudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
  className?: string;
}

export function CustomAudioPlayer({ src, title, artist, className = '' }: CustomAudioPlayerProps) {
  const { currentTrack, isPlaying, progress, currentTime, duration, volume, playTrack, togglePlay, seek, setVolume } = useAudio();

  const isThisTrackActive = currentTrack?.audioUrl === src;
  const isThisTrackPlaying = isThisTrackActive && isPlaying;
  
  // Local derived state synced with global context
  const localCurrentTime = isThisTrackActive ? currentTime : 0;
  const localDuration = isThisTrackActive ? duration : 0;
  const isMuted = volume === 0;

  const handleTogglePlay = () => {
    if (isThisTrackActive) {
      togglePlay();
    } else {
      playTrack({
        id: src, // Use src as unique fallback ID
        title: title || 'UNNAMED DROP',
        artist: artist || 'WORLDSTAR ARTIST',
        coverArt: '/default-avatar.png', // Fallback, could be improved if passed in
        audioUrl: src,
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isThisTrackActive) return; // Cannot seek a track that isn't loaded globally
    const newTime = parseFloat(e.target.value);
    const newProgress = newTime / (localDuration || 1);
    seek(newProgress);
  };

  const toggleMute = () => {
    setVolume(isMuted ? 1 : 0);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = localDuration > 0 ? (localCurrentTime / localDuration) * 100 : 0;

  return (
    <div className={`bg-neutral-950 border border-neutral-800 p-4 rounded-sm shadow-xl font-mono text-white select-none ${className}`}>
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
            {isThisTrackPlaying && <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />}
            <span className={`text-[9px] font-bold uppercase tracking-widest ${isThisTrackPlaying ? 'text-red-500' : 'text-zinc-600'}`}>
              GLOBAL SYNC
            </span>
          </div>
        </div>
      )}

      {/* CONTROLS ROW */}
      <div className="flex items-center gap-3">
        {/* PLAY / PAUSE BUTTON */}
        <button
          onClick={handleTogglePlay}
          className={`w-10 h-10 rounded-sm flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0 ${
            isThisTrackPlaying
              ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]'
              : 'bg-white text-black hover:bg-zinc-200'
          }`}
          aria-label={isThisTrackPlaying ? 'Pause audio' : 'Play audio'}
        >
          {isThisTrackPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* TIME STAMPS & PROGRESS BAR */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold">
            <span>{formatTime(localCurrentTime)}</span>
            <span>{formatTime(localDuration)}</span>
          </div>

          <div className="relative w-full flex items-center h-2 group">
            <div className="absolute inset-0 bg-neutral-900 border border-neutral-800 rounded-none overflow-hidden">
              <div
                className={`h-full transition-all duration-100 ${isThisTrackPlaying ? 'bg-gradient-to-r from-red-600 to-rose-500' : 'bg-zinc-600'}`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={localDuration || 100}
              step={0.1}
              value={localCurrentTime}
              onChange={handleSeek}
              className={`absolute inset-0 w-full opacity-0 ${isThisTrackActive ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              disabled={!isThisTrackActive}
            />
          </div>
        </div>

        {/* MUTE / VOLUME TOGGLE */}
        <button
          onClick={toggleMute}
          className={`hover:text-white transition-colors cursor-pointer p-2 shrink-0 ${isThisTrackActive ? 'text-zinc-300' : 'text-zinc-600'}`}
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
