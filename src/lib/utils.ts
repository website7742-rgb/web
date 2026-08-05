import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatStreams(count: number): string {
  if (count >= 1_000_000_000) {
    return (count / 1_000_000_000).toFixed(1) + 'B';
  }
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1) + 'M';
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1) + 'K';
  }
  return count.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toUpperCase();
}

/**
 * Extracts a YouTube Video ID from various YouTube URL formats or plain IDs,
 * and returns the highest-quality official thumbnail URL.
 * Falls back to hqdefault.jpg if maxresdefault.jpg is unavailable.
 */
export function getYouTubeThumbnail(urlOrId: string, quality: 'max' | 'hq' = 'max'): string {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlOrId.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : urlOrId;
  // Only generate YouTube thumbnail if videoId looks like a valid YouTube ID (11 chars alphanumeric)
  if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return '';
  const res = quality === 'max' ? 'maxresdefault' : 'hqdefault';
  return `https://i.ytimg.com/vi/${videoId}/${res}.jpg`;
}

export function getYouTubeId(urlOrId: string): string {
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = urlOrId.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : urlOrId;
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : '';
}
