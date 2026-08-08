'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { User, Mail, Globe, Music, Heart, MessageSquare, Edit, Loader2, ShieldCheck, UserPlus, UserCheck, ArrowUpRight } from 'lucide-react';
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

function FollowedArtistCard({ item }: { item: FollowingArtist }) {
  const { showToast } = useUI();
  const [isFollowing, setIsFollowing] = useState(true);
  const [isPending, startTransition] = useTransition();

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

  return (
    <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-sm space-y-4 flex flex-col justify-between group hover:border-red-600/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-neutral-900 border border-neutral-700 overflow-hidden flex items-center justify-center shrink-0">
            {artist.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={artist.avatar_url} alt={artist.full_name || 'Artist'} className="w-full h-full object-cover" />
            ) : (
              <span className="font-mono font-bold text-red-500 text-sm">
                {(artist.full_name || 'WS').slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-black text-white text-base uppercase tracking-tight truncate group-hover:text-red-500 transition-colors">
              {artist.full_name || 'UNKNOWN ARTIST'}
            </h4>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">
              {artist.genre || 'HIP-HOP'} • {artist.country || 'USA'}
            </p>
          </div>
        </div>

        <button
          onClick={handleToggleUnfollow}
          disabled={isPending}
          className={`flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest border transition-all cursor-pointer ${
            isFollowing
              ? 'bg-neutral-900 border-neutral-700 text-zinc-300 hover:bg-neutral-800'
              : 'bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white'
          }`}
        >
          {isPending ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : isFollowing ? (
            <>
              <UserCheck className="w-3 h-3 text-red-500" />
              FOLLOWING
            </>
          ) : (
            <>
              <UserPlus className="w-3 h-3" />
              FOLLOW
            </>
          )}
        </button>
      </div>

      {artist.bio && (
        <p className="text-xs text-zinc-400 font-mono line-clamp-2 leading-relaxed">
          {artist.bio}
        </p>
      )}

      <div className="pt-2 border-t border-neutral-900 flex items-center justify-between text-[10px] font-mono font-bold text-red-500 uppercase">
        <Link href="/roster" className="hover:underline flex items-center gap-1">
          VIEW ROSTER PRESS KIT <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [likedItems, setLikedItems] = useState<LikedItem[]>([]);
  const [commentsHistory, setCommentsHistory] = useState<UserComment[]>([]);
  const [followingList, setFollowingList] = useState<FollowingArtist[]>([]);

  const [activeTab, setActiveTab] = useState<'LIKES' | 'COMMENTS' | 'FOLLOWING'>('LIKES');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getProfileSettingsAction(),
      getUserLikedEntitiesAction(),
      getUserCommentsHistoryAction(),
      getUserFollowingAction(),
    ]).then(([profileRes, likesRes, commentsRes, followingRes]) => {
      setIsLoading(false);
      if (profileRes.success && profileRes.profile) {
        setProfile(profileRes.profile);
      }
      if (likesRes.success && likesRes.likes) {
        setLikedItems(likesRes.likes as LikedItem[]);
      }
      if (commentsRes.success && commentsRes.comments) {
        setCommentsHistory(commentsRes.comments as UserComment[]);
      }
      if (followingRes.success && followingRes.following) {
        setFollowingList(followingRes.following as FollowingArtist[]);
      }
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 space-y-4 font-mono">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        <p className="text-xs uppercase tracking-widest">Loading WorldStar Profile...</p>
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'WS';

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans pb-24">
      {/* PROFILE HEADER HERO */}
      <div className="bg-neutral-950 border-b border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-600 via-rose-600 to-red-600" />

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* AVATAR */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-900 border-2 border-red-600/40 flex items-center justify-center shrink-0 overflow-hidden shadow-[0_0_25px_rgba(220,38,38,0.3)]">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-black text-red-500 font-mono tracking-widest">{initials}</span>
              )}
            </div>

            {/* DETAILS */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                    {profile?.full_name || 'WORLDSTAR ARTIST'}
                  </h1>
                  <span className="px-2.5 py-0.5 bg-red-600/10 border border-red-600/30 text-red-500 font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED USER
                  </span>
                </div>
                <p className="text-xs font-mono text-zinc-400 flex items-center justify-center md:justify-start gap-1">
                  <Mail className="w-3.5 h-3.5 text-zinc-500" /> {profile?.email}
                </p>
              </div>

              {profile?.bio && (
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl font-mono leading-relaxed">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono">
                <span className="flex items-center gap-1 text-zinc-400">
                  <Globe className="w-3.5 h-3.5 text-red-600" />
                  REGION: <strong className="text-white uppercase">{profile?.country || 'USA'}</strong>
                </span>
                <span className="flex items-center gap-1 text-zinc-400">
                  <Music className="w-3.5 h-3.5 text-red-600" />
                  GENRE: <strong className="text-white uppercase">{profile?.genre || 'HIP-HOP'}</strong>
                </span>
              </div>
            </div>

            {/* EDIT BUTTON */}
            <Link
              href="/settings"
              className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-zinc-200 px-5 py-3 text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors shrink-0 shadow-lg cursor-pointer"
            >
              <Edit className="w-4 h-4 text-red-500" />
              EDIT PROFILE
            </Link>
          </div>
        </div>
      </div>

      {/* TABBED INTERACTION CENTER */}
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {/* TABS */}
        <div className="flex border-b border-neutral-800 font-mono text-xs font-bold uppercase overflow-x-auto">
          <button
            onClick={() => setActiveTab('LIKES')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'LIKES'
                ? 'border-red-600 text-white bg-red-600/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${activeTab === 'LIKES' ? 'text-red-500 fill-current' : ''}`} />
            LIKED DROPS ({likedItems.length})
          </button>

          <button
            onClick={() => setActiveTab('COMMENTS')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'COMMENTS'
                ? 'border-red-600 text-white bg-red-600/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <MessageSquare className={`w-4 h-4 ${activeTab === 'COMMENTS' ? 'text-blue-400' : ''}`} />
            MY COMMENTS ({commentsHistory.length})
          </button>

          <button
            onClick={() => setActiveTab('FOLLOWING')}
            className={`px-6 py-4 flex items-center gap-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'FOLLOWING'
                ? 'border-red-600 text-white bg-red-600/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <UserCheck className={`w-4 h-4 ${activeTab === 'FOLLOWING' ? 'text-red-500' : ''}`} />
            FOLLOWING ({followingList.length})
          </button>
        </div>

        {/* TAB 1: LIKED AUDIO DROPS ONLY */}
        {activeTab === 'LIKES' && (
          <div className="space-y-6">
            {likedItems.length === 0 ? (
              <div className="text-center py-20 text-zinc-600 font-mono space-y-3 bg-neutral-950 border border-neutral-900 p-8">
                <Heart className="w-10 h-10 text-zinc-700 mx-auto" />
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">NO LIKED TRACK DROPS YET</p>
                <p className="text-xs">Browse audio drops on the feed to save your favorite tracks to your library.</p>
                <Link href="/" className="inline-block mt-4 px-6 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-widest">
                  EXPLORE DROPS
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {likedItems.map((item) => {
                  if (!item.submissions) return null;
                  const track = item.submissions;
                  const artistName = Array.isArray(track.profiles)
                    ? track.profiles[0]?.full_name
                    : track.profiles?.full_name;

                  return (
                    <div key={item.id} className="bg-neutral-950 border border-neutral-800 p-5 space-y-4 rounded-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase text-red-500 px-2 py-0.5 bg-red-600/10 border border-red-600/30">
                          {track.genre || 'TRACK DROP'}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-600">
                          LIKED ON {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-white uppercase tracking-tight truncate">
                          {track.track_title}
                        </h4>
                        <p className="text-xs font-bold text-zinc-400 uppercase font-mono truncate">
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

        {/* TAB 2: COMMENTS HISTORY */}
        {activeTab === 'COMMENTS' && (
          <div className="space-y-4 font-mono">
            {commentsHistory.length === 0 ? (
              <div className="text-center py-20 text-zinc-600 space-y-3 bg-neutral-950 border border-neutral-900 p-8">
                <MessageSquare className="w-10 h-10 text-zinc-700 mx-auto" />
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">NO COMMENTS POSTED</p>
                <p className="text-xs">Join discussions on drops and videos across the platform.</p>
              </div>
            ) : (
              commentsHistory.map((comment) => {
                const targetTitle = comment.submissions?.track_title || comment.videos?.title || 'CONTENT ITEM';

                return (
                  <div key={comment.id} className="bg-neutral-950 border border-neutral-800 p-5 space-y-2 rounded-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-red-500 uppercase tracking-wide">
                        ON: {targetTitle}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: FOLLOWING LIST */}
        {activeTab === 'FOLLOWING' && (
          <div className="space-y-6">
            {followingList.length === 0 ? (
              <div className="text-center py-20 text-zinc-600 font-mono space-y-3 bg-neutral-950 border border-neutral-900 p-8">
                <UserCheck className="w-10 h-10 text-zinc-700 mx-auto" />
                <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">NOT FOLLOWING ANY ARTISTS</p>
                <p className="text-xs">Follow artists from the directory or feed to stay updated on their latest releases.</p>
                <Link href="/roster" className="inline-block mt-4 px-6 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-widest">
                  EXPLORE ROSTER DIRECTORY
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {followingList.map((item) => (
                  <FollowedArtistCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
