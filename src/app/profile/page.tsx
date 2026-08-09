'use client';

import { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import {
  Mail, Globe, Music, Heart, MessageSquare, Edit,
  Loader2, ShieldCheck, UserPlus, UserCheck, ArrowUpRight,
  Sparkles, Calendar
} from 'lucide-react';
import { getProfileSettingsAction, getUserLikedEntitiesAction, getUserCommentsHistoryAction, getUserFollowingAction } from '@/app/actions/profileActions';
import { toggleFollowAction } from '@/app/actions/socialActions';
import { CustomAudioPlayer } from '@/components/media/CustomAudioPlayer';
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

      {/* ── PROFILE HEADER HERO ── */}
      <div className="relative overflow-hidden bg-[#0a0a0a] border-b border-neutral-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.07)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(220,38,38,0.04)_0%,transparent_60%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        <div
          className="max-w-5xl mx-auto px-6 py-14"
          style={{
            opacity: headerMounted ? 1 : 0,
            transform: headerMounted ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

            {/* AVATAR */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-neutral-900 border-2 border-red-600/30 flex items-center justify-center overflow-hidden shadow-[0_0_0_4px_rgba(220,38,38,0.08),0_0_40px_rgba(220,38,38,0.25)]">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-black text-red-500 font-mono tracking-widest">{initials}</span>
                )}
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-zinc-950 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </div>

            {/* DETAILS */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-none">
                    {profile?.full_name || 'WORLDSTAR ARTIST'}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-mono font-black uppercase tracking-[0.15em] text-red-400 border border-red-600/40 bg-red-600/10 shadow-[0_0_12px_rgba(220,38,38,0.2),inset_0_0_12px_rgba(220,38,38,0.05)]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    VERIFIED USER
                  </span>
                </div>
                <p className="text-xs font-mono text-zinc-500 flex items-center justify-center md:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-600" />
                  {profile?.email}
                </p>
              </div>

              {profile?.bio && (
                <p className="text-sm text-zinc-400 max-w-xl font-mono leading-relaxed border-l-2 border-red-600/30 pl-4">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-[11px] font-mono">
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/80 border border-neutral-800 text-zinc-400">
                  <Globe className="w-3.5 h-3.5 text-red-600/70" />
                  REGION: <strong className="text-zinc-200 uppercase ml-1">{profile?.country || 'USA'}</strong>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/80 border border-neutral-800 text-zinc-400">
                  <Music className="w-3.5 h-3.5 text-red-600/70" />
                  GENRE: <strong className="text-zinc-200 uppercase ml-1">{profile?.genre || 'HIP-HOP'}</strong>
                </span>
              </div>
            </div>

            {/* EDIT PROFILE BUTTON */}
            <Link
              href="/settings"
              className="group relative shrink-0 flex items-center gap-2 px-5 py-3 bg-neutral-900 border border-neutral-700 text-zinc-200 text-xs font-mono font-bold uppercase tracking-widest overflow-hidden transition-all duration-300 hover:border-red-600/50 hover:text-white hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] hover:scale-[1.02] active:scale-95"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-red-600/10 to-transparent transition-transform duration-500 ease-out" />
              <Edit className="w-4 h-4 text-red-500 group-hover:rotate-[-8deg] transition-transform duration-200 relative z-10" />
              <span className="relative z-10">EDIT PROFILE</span>
            </Link>
          </div>

          {/* STATS ROW */}
          <div
            className="mt-10 pt-8 border-t border-neutral-800/60 grid grid-cols-3 gap-4 text-center"
            style={{
              opacity: headerMounted ? 1 : 0,
              transform: headerMounted ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.6s ease 200ms, transform 0.6s ease 200ms',
            }}
          >
            {([
              { label: 'LIKED DROPS', value: likedItems.length, icon: Heart },
              { label: 'COMMENTS', value: commentsHistory.length, icon: MessageSquare },
              { label: 'FOLLOWING', value: followingList.length, icon: UserCheck },
            ] as const).map(({ label, value, icon: Icon }) => (
              <div key={label} className="group p-4 bg-neutral-900/40 border border-neutral-800/60 hover:border-red-600/30 hover:bg-neutral-900/70 transition-all duration-200 cursor-default">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Icon className="w-3.5 h-3.5 text-red-600/60 group-hover:text-red-500 transition-colors duration-200" />
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-zinc-500 transition-colors duration-200">{label}</span>
                </div>
                <p className="text-2xl font-black text-white group-hover:text-red-400 transition-colors duration-200">{value}</p>
              </div>
            ))}
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
    </div>
  );
}
