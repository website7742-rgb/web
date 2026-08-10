'use client';

import { useState, useEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import {
  Mail, Globe, Music, Heart, MessageSquare, Edit,
  Loader2, ShieldCheck, UserPlus, UserCheck, ArrowUpRight,
  Sparkles, Calendar, Camera
} from 'lucide-react';
import { getProfileSettingsAction, getUserLikedEntitiesAction, getUserCommentsHistoryAction, getUserFollowingAction } from '@/app/actions/profileActions';
import { toggleFollowAction } from '@/app/actions/socialActions';
import { CustomAudioPlayer } from '@/components/media/CustomAudioPlayer';
import { ProfilePhotoCropModal } from '@/components/profile/ProfilePhotoCropModal';
import { useUI } from '@/providers/UIContext';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  bio?: string;
  country?: string;
  genre?: string;
}

interface LikedItem {
  id: string;
  created_at: string;
  submission_id?: string | null;
  submissions?: {
    id: string;
    track_title: string;
    genre: string;
    media_url: string;
    created_at: string;
    profiles?: { full_name?: string } | { full_name?: string }[];
  } | null;
}

interface UserComment {
  id: string;
  content: string;
  created_at: string;
  submission_id?: string | null;
  video_id?: string | null;
  submissions?: { track_title: string } | null;
  videos?: { title: string } | null;
}

interface FollowingArtist {
  id: string;
  created_at: string;
  following_id: string;
  profiles?: {
    id: string;
    full_name?: string;
    avatar_url?: string;
    country?: string;
    genre?: string;
    bio?: string;
  } | null;
}

/* ─────────────────────────────────────────────────
   FOLLOWED ARTIST CARD
───────────────────────────────────────────────── */
function FollowedArtistCard({ item, index }: { item: FollowingArtist; index: number }) {
  const { showToast } = useUI();
  const [isFollowing, setIsFollowing] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  const artist = item.profiles;
  if (!artist) return null;

  const handleToggleUnfollow = () => {
    const nextState = !isFollowing;
    setIsFollowing(nextState);
    startTransition(async () => {
      const res = await toggleFollowAction(artist.id);
      if (res.success) {
        setIsFollowing(res.following ?? nextState);
        showToast(res.following ? `Following ${artist.full_name}` : `Unfollowed ${artist.full_name}`, 'success');
      } else {
        setIsFollowing(!nextState);
        showToast(res.error || 'Action failed', 'error');
      }
    });
  };

  const initials = (artist.full_name || 'WS').slice(0, 2).toUpperCase();

  return (
    <div
      className="group relative flex flex-col justify-between overflow-hidden border border-neutral-800/80 bg-neutral-950/80 p-5 space-y-4 transition-all duration-300 hover:border-red-600/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.08)]"
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms, border-color 0.3s ease, box-shadow 0.3s ease`,
      }}
    >
      <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-red-600 to-rose-500 group-hover:w-full transition-all duration-500" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 overflow-hidden flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(220,38,38,0.15)] group-hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-shadow duration-300">
            {artist.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={artist.avatar_url} alt={artist.full_name || 'Artist'} className="w-full h-full object-cover" />
            ) : (
              <span className="font-mono font-black text-red-500 text-sm tracking-widest">{initials}</span>
            )}
          </div>
          <div>
            <h4 className="font-black text-white text-sm uppercase tracking-tight truncate group-hover:text-red-400 transition-colors duration-200">
              {artist.full_name || 'UNKNOWN ARTIST'}
            </h4>
            <p className="text-[10px] font-mono text-zinc-500 uppercase mt-0.5">
              {artist.genre || 'HIP-HOP'} · {artist.country || 'USA'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleUnfollow}
          disabled={isPending}
          className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border transition-all duration-200 cursor-pointer ${
            isFollowing
              ? 'bg-neutral-900 border-neutral-700 text-zinc-300 hover:bg-red-600/10 hover:border-red-600/40 hover:text-red-400'
              : 'bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white'
          }`}
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isFollowing ? (
            <><UserCheck className="w-3 h-3 text-red-500" /> FOLLOWING</>
          ) : (
            <><UserPlus className="w-3 h-3" /> FOLLOW</>
          )}
        </button>
      </div>

      {artist.bio && (
        <p className="text-xs text-zinc-500 font-mono line-clamp-2 leading-relaxed group-hover:text-zinc-400 transition-colors duration-200">
          {artist.bio}
        </p>
      )}

      <div className="pt-2 border-t border-neutral-900/80 flex items-center justify-between text-[10px] font-mono font-bold text-zinc-600 group-hover:text-red-500 uppercase transition-colors duration-200">
        <Link href="/roster" className="hover:underline flex items-center gap-1">
          VIEW ROSTER PRESS KIT <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   PREMIUM EMPTY STATE
───────────────────────────────────────────────── */
function EmptyState({
  icon: Icon,
  title,
  subtitle,
  cta,
  ctaHref,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center py-24 px-8 text-center overflow-hidden border border-neutral-800/60 bg-neutral-950/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-6 border border-red-600/20 bg-red-600/5 shadow-[0_0_40px_rgba(220,38,38,0.12)]">
        <Icon className="w-9 h-9 text-red-600/50" />
        <div className="absolute inset-0 rounded-full border border-red-600/15 animate-ping" style={{ animationDuration: '3s' }} />
      </div>

      <p className="text-sm font-black uppercase tracking-widest text-zinc-300 mb-2">{title}</p>
      <p className="text-xs font-mono text-zinc-600 leading-relaxed max-w-xs">{subtitle}</p>

      {cta && ctaHref && (
        <Link
          href={ctaHref}
          className="group mt-8 inline-flex items-center gap-2 px-7 py-3 bg-red-600 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 hover:bg-red-500 hover:shadow-[0_0_24px_rgba(220,38,38,0.5)] hover:scale-[1.03] active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform duration-200" />
          {cta}
        </Link>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   MAIN PROFILE PAGE
───────────────────────────────────────────────── */
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [commentsHistory, setCommentsHistory] = useState<UserComment[]>([]);
  const [followingList, setFollowingList] = useState<FollowingArtist[]>([]);
  const [activeTab, setActiveTab] = useState<'LIKES' | 'COMMENTS' | 'FOLLOWING'>('LIKES');
  const [isLoading, setIsLoading] = useState(true);
  const [headerMounted, setHeaderMounted] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [selectedImageForCrop, setSelectedImageForCrop] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useUI();

  useEffect(() => {
    Promise.all([
      getProfileSettingsAction(),
      getUserLikedEntitiesAction(),
      getUserCommentsHistoryAction(),
      getUserFollowingAction(),
    ]).then(([profileRes, likesRes, commentsRes, followingRes]) => {
      setIsLoading(false);
      if (profileRes.success && profileRes.profile) setProfile(profileRes.profile);
      if (likesRes.success && likesRes.likes) setLikedItems(likesRes.likes as LikedItem[]);
      if (commentsRes.success && commentsRes.comments) setCommentsHistory(commentsRes.comments as UserComment[]);
      if (followingRes.success && followingRes.following) setFollowingList(followingRes.following as FollowingArtist[]);
      setTimeout(() => setHeaderMounted(true), 80);
    });
  }, []);

  // 1. File Selection -> Open Cropper Modal
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      showToast('Image file size must be under 15MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImageForCrop(reader.result);
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 2. Crop Confirmed -> Upload to Cloudflare R2
  const handleCroppedAvatarUpload = async (croppedFile: File) => {
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', croppedFile);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.avatar_url) {
        const freshUrl = `${data.avatar_url}${data.avatar_url.includes('?') ? '&' : '?'}t=${Date.now()}`;
        setProfile((prev) => (prev ? { ...prev, avatar_url: freshUrl } : prev));
        showToast(data.message || 'Profile picture updated successfully!', 'success');
        setSelectedImageForCrop(null);
      } else {
        showToast(data.error || 'Failed to upload profile picture', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error uploading cropped image', 'error');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 space-y-4 font-mono">
        <div className="relative">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          <div className="absolute inset-0 animate-ping rounded-full border border-red-600/20" style={{ animationDuration: '1.5s' }} />
        </div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-600">LOADING WORLDSTAR PROFILE...</p>
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'WS';

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-32 overflow-x-hidden">

      {/* ── SPOTIFY-STYLE HERO HEADER ── */}
      <div className="relative overflow-hidden bg-gradient-to-b from-neutral-900/90 via-black to-zinc-950 pt-12 sm:pt-20 pb-12 sm:pb-16 border-b border-white/5">
        {/* Subtle background atmosphere glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(220,38,38,0.14)_0%,transparent_55%)] pointer-events-none" />

        <div
          className="max-w-6xl mx-auto px-4 sm:px-8"
          style={{
            opacity: headerMounted ? 1 : 0,
            transform: headerMounted ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          {/* FLEX CONTAINER: Centered on mobile, Bottom-Aligned on sm+ */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-10">

            {/* AVATAR (LARGE CIRCLE) WITH CLOUDFLARE UPLOAD OVERLAY */}
            <div className="relative shrink-0 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarFileSelect}
                className="hidden"
                disabled={isUploadingAvatar}
              />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full bg-neutral-900/90 border border-white/10 flex items-center justify-center overflow-hidden shadow-[0_16px_50px_rgba(0,0,0,0.85)] transition-all duration-300 group-hover:border-red-500/60">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={profile.avatar_url}
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Profile Avatar'}
                    className="w-full h-full object-cover relative z-0"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-4xl sm:text-6xl font-black text-red-500 font-sans tracking-tight">{initials}</span>
                )}

                {/* Glassmorphic hover overlay / loading spinner */}
                <div className={`absolute inset-0 bg-black/65 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 transition-opacity duration-250 z-10 ${
                  isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {isUploadingAvatar ? (
                    <>
                      <Loader2 className="w-7 h-7 text-red-500 animate-spin" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-200">UPLOADING...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-zinc-200">CHANGE PHOTO</span>
                    </>
                  )}
                </div>
              </div>
              <div className="absolute bottom-2 right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_12px_rgba(16,185,129,0.6)] z-20" />
            </div>

            {/* SPOTIFY TEXT BLOCK: Sub-label + Dynamic Name + Inline Bullet Stats */}
            <div className="flex-1 space-y-3 text-center sm:text-left min-w-0 pb-1">

              {/* Sub-label */}
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.25em] text-zinc-400">
                  PUBLIC PROFILE
                </span>
              </div>

              {/* Responsive Display Name + Minimalist Verified Checkmark */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 min-w-0">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-white leading-none break-words max-w-full">
                  {profile?.full_name || 'User'}
                </h1>
                {/* Minimalist Verified Checkmark Badge */}
                <span className="inline-flex items-center justify-center shrink-0 align-middle p-1 bg-red-600/10 rounded-full border border-red-500/30 shadow-[0_0_14px_rgba(239,68,68,0.5)]">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 fill-current shrink-0"
                    viewBox="0 0 24 24"
                    aria-label="Verified User"
                  >
                    <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.575 9.55.7 10.92.7 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4zm-12.8 4.7l-4.2-4.2 1.4-1.4 2.8 2.8 6.8-6.8 1.4 1.4-8.2 8.2z" />
                  </svg>
                </span>
              </div>

              {/* Bio if exists */}
              {profile?.bio && (
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed border-l-2 border-red-600/40 pl-4 font-sans py-0.5">
                  {profile.bio}
                </p>
              )}

              {/* SPOTIFY INLINE METADATA ROW WITH BULLETS */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-2.5 gap-y-1.5 text-xs sm:text-sm font-sans text-zinc-400 pt-1 leading-relaxed">
                {profile?.email && (
                  <span className="flex items-center gap-1.5 text-zinc-300 font-medium truncate max-w-[240px] sm:max-w-none">
                    <Mail className="w-3.5 h-3.5 text-red-500/80 shrink-0" />
                    <span className="truncate">{profile.email}</span>
                  </span>
                )}
                {profile?.email && <span className="text-zinc-600 font-mono">•</span>}

                <span className="whitespace-nowrap"><strong className="text-white font-bold">{likedItems.length}</strong> Liked Drops</span>
                <span className="text-zinc-600 font-mono">•</span>

                <span className="whitespace-nowrap"><strong className="text-white font-bold">{followingList.length}</strong> Following</span>
                <span className="text-zinc-600 font-mono">•</span>

                <span className="whitespace-nowrap"><strong className="text-white font-bold">{commentsHistory.length}</strong> Comments</span>

                {profile?.country && (
                  <>
                    <span className="text-zinc-600 font-mono">•</span>
                    <span className="uppercase whitespace-nowrap text-zinc-400">{profile.country}</span>
                  </>
                )}

                {profile?.genre && (
                  <>
                    <span className="text-zinc-600 font-mono">•</span>
                    <span className="uppercase text-red-400 font-bold whitespace-nowrap">{profile.genre}</span>
                  </>
                )}
              </div>

            </div>

            {/* EDIT PROFILE BUTTON */}
            <div className="sm:self-end pt-2 sm:pt-0 pb-1">
              <Link
                href="/settings"
                className="group relative shrink-0 flex items-center gap-2.5 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-white text-xs font-mono font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:border-red-500/50 hover:bg-white/10 hover:shadow-[0_0_24px_rgba(239,68,68,0.25)] hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-red-600/20 to-transparent transition-transform duration-500 ease-out" />
                <Edit className="w-3.5 h-3.5 text-red-500 group-hover:rotate-[-8deg] transition-transform duration-200 relative z-10" />
                <span className="relative z-10">EDIT PROFILE</span>
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main
        className="max-w-5xl mx-auto px-6 py-10 space-y-8"
        style={{
          opacity: headerMounted ? 1 : 0,
          transform: headerMounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.6s ease 300ms, transform 0.6s ease 300ms',
        }}
      >
        {/* TABS */}
        <div className="flex border-b border-neutral-800 font-mono text-xs font-bold uppercase overflow-x-auto">
          {([
            { id: 'LIKES' as const, label: 'LIKED DROPS', count: likedItems.length, icon: Heart },
            { id: 'COMMENTS' as const, label: 'MY COMMENTS', count: commentsHistory.length, icon: MessageSquare },
            { id: 'FOLLOWING' as const, label: 'FOLLOWING', count: followingList.length, icon: UserCheck },
          ]).map(({ id, label, count, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`group relative px-6 py-4 flex items-center gap-2 border-b-2 transition-all duration-200 cursor-pointer whitespace-nowrap ${
                activeTab === id
                  ? 'border-red-600 text-white bg-red-600/5'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors duration-200 ${
                activeTab === id ? (id === 'COMMENTS' ? 'text-blue-400' : 'text-red-500 fill-current') : ''
              }`} />
              {label}
              <span className={`ml-1 px-1.5 py-0.5 text-[9px] font-mono transition-all duration-200 ${
                activeTab === id
                  ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                  : 'bg-neutral-900 text-zinc-600 border border-neutral-800'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* ── TAB: LIKED DROPS ── */}
        {activeTab === 'LIKES' && (
          <div className="space-y-6">
            {likedItems.length === 0 ? (
              <EmptyState
                icon={Heart}
                title="NO LIKED TRACK DROPS YET"
                subtitle="Browse audio drops on the feed to save your favorite tracks to your personal library."
                cta="EXPLORE DROPS"
                ctaHref="/"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {likedItems.map((item, index) => {
                  if (!item.submissions) return null;
                  const track = item.submissions;
                  const artistName = Array.isArray(track.profiles)
                    ? track.profiles[0]?.full_name
                    : track.profiles?.full_name;

                  return (
                    <div
                      key={item.id}
                      className="group relative bg-neutral-950/80 border border-neutral-800/80 p-5 space-y-4 overflow-hidden transition-all duration-300 hover:border-red-600/40 hover:shadow-[0_0_24px_rgba(220,38,38,0.08)]"
                      style={{
                        opacity: headerMounted ? 1 : 0,
                        transform: headerMounted ? 'translateY(0)' : 'translateY(10px)',
                        transition: `opacity 0.4s ease ${index * 60}ms, transform 0.4s ease ${index * 60}ms, border-color 0.3s, box-shadow 0.3s`,
                      }}
                    >
                      <div className="absolute top-0 left-0 w-0 h-[1px] bg-gradient-to-r from-red-600 to-rose-500 group-hover:w-full transition-all duration-500" />

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-red-500 px-2 py-0.5 bg-red-600/10 border border-red-600/30">
                          {track.genre || 'TRACK DROP'}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-mono text-zinc-600">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight truncate group-hover:text-red-400 transition-colors duration-200">
                          {track.track_title}
                        </h4>
                        <p className="text-xs font-bold text-zinc-500 uppercase font-mono truncate mt-0.5">
                          {artistName || 'UNKNOWN ARTIST'}
                        </p>
                      </div>

                      {track.media_url && (
                        <CustomAudioPlayer
                          src={track.media_url}
                          title={track.track_title}
                          artist={artistName || 'UNKNOWN ARTIST'}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: COMMENTS ── */}
        {activeTab === 'COMMENTS' && (
          <div className="space-y-4 font-mono">
            {commentsHistory.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="NO COMMENTS POSTED"
                subtitle="Join discussions on drops and videos across the platform to see your comment history."
              />
            ) : (
              commentsHistory.map((comment, index) => {
                const targetTitle = comment.submissions?.track_title || comment.videos?.title || 'CONTENT ITEM';
                return (
                  <div
                    key={comment.id}
                    className="group relative bg-neutral-950/80 border border-neutral-800/80 p-5 space-y-2 overflow-hidden transition-all duration-300 hover:border-neutral-700"
                    style={{
                      opacity: headerMounted ? 1 : 0,
                      transform: headerMounted ? 'translateY(0)' : 'translateY(8px)',
                      transition: `opacity 0.4s ease ${index * 50}ms, transform 0.4s ease ${index * 50}ms`,
                    }}
                  >
                    <div className="absolute left-0 top-0 h-full w-[2px] bg-blue-500/20 group-hover:bg-blue-500/50 transition-colors duration-200" />
                    <div className="flex items-center justify-between text-xs pl-2">
                      <span className="font-bold text-blue-400/80 uppercase tracking-wide text-[10px]">
                        ON: {targetTitle}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {new Date(comment.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed pl-2">
                      {comment.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── TAB: FOLLOWING ── */}
        {activeTab === 'FOLLOWING' && (
          <div className="space-y-6">
            {followingList.length === 0 ? (
              <EmptyState
                icon={UserCheck}
                title="NOT FOLLOWING ANY ARTISTS"
                subtitle="Follow artists from the directory or feed to stay updated on their latest releases."
                cta="EXPLORE ROSTER"
                ctaHref="/roster"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {followingList.map((item, index) => (
                  <FollowedArtistCard key={item.id} item={item} index={index} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CROPPER MODAL OVERLAY */}
      {selectedImageForCrop && (
        <ProfilePhotoCropModal
          imageSrc={selectedImageForCrop}
          onClose={() => setSelectedImageForCrop(null)}
          onCropComplete={handleCroppedAvatarUpload}
        />
      )}
    </div>
  );
}
