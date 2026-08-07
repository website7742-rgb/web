'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, UserPlus, Loader2 } from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { toggleLikeAction, toggleFollowAction } from '@/app/actions/socialActions';
import { createBrowserClient } from '@supabase/ssr';

interface InteractionBarProps {
  entityId: string;
  artistId?: string;
  artistName: string;
  initialLikeCount?: number;
  initialCommentCount?: number;
  hasLiked?: boolean;
  isFollowing?: boolean;
}

export function InteractionBar({
  entityId,
  artistId,
  artistName,
  initialLikeCount = 0,
  initialCommentCount = 0,
  hasLiked = false,
  isFollowing = false
}: InteractionBarProps) {
  const { openAuthModal, showToast } = useUI();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setUserId(session?.user?.id || null);
    });
  }, []);
  
  const [liked, setLiked] = useState(hasLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  const [following, setFollowing] = useState(isFollowing);
  const [isFollowProcessing, setIsFollowProcessing] = useState(false);

  const handleLike = async () => {
    if (!isLoggedIn) return openAuthModal();
    if (isLikeProcessing) return;

    setIsLikeProcessing(true);
    const newStatus = !liked;
    setLiked(newStatus);
    setLikeCount(prev => newStatus ? prev + 1 : prev - 1);

    const res = await toggleLikeAction(entityId, !newStatus);
    if (!res.success) {
      // Revert optimistic update
      setLiked(!newStatus);
      setLikeCount(prev => newStatus ? prev - 1 : prev + 1);
      showToast('Action failed', 'error');
    }
    setIsLikeProcessing(false);
  };

  const handleFollow = async () => {
    if (!isLoggedIn) return openAuthModal();
    if (!artistId) return showToast('Artist not found', 'error');
    if (isFollowProcessing) return;

    setIsFollowProcessing(true);
    const newStatus = !following;
    setFollowing(newStatus);

    const res = await toggleFollowAction(artistId, !newStatus);
    if (!res.success) {
      setFollowing(!newStatus);
      showToast('Action failed', 'error');
    }
    setIsFollowProcessing(false);
  };

  const handleComment = () => {
    if (!isLoggedIn) return openAuthModal();
    // In a full implementation, this might open a comment drawer
    showToast('Comments section coming soon!', 'info');
  };

  return (
    <div className="flex items-center justify-between border-t border-neutral-800/50 pt-4 mt-4">
      <div className="flex items-center gap-6">
        <button 
          onClick={handleLike} 
          disabled={isLikeProcessing}
          className={`flex items-center gap-2 group transition-colors ${liked ? 'text-red-500' : 'text-zinc-400 hover:text-white'}`}
        >
          {isLikeProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className={`w-5 h-5 ${liked ? 'fill-current' : 'group-hover:text-red-500'}`} />}
          <span className="text-sm font-bold">{likeCount > 0 ? likeCount : ''}</span>
        </button>

        <button 
          onClick={handleComment} 
          className="flex items-center gap-2 text-zinc-400 hover:text-white group transition-colors"
        >
          <MessageSquare className="w-5 h-5 group-hover:text-blue-400" />
          <span className="text-sm font-bold">{initialCommentCount > 0 ? initialCommentCount : ''}</span>
        </button>
      </div>

      <button 
        onClick={handleFollow}
        disabled={isFollowProcessing}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm border ${
          following 
            ? 'bg-neutral-800 border-neutral-700 text-zinc-300 hover:bg-neutral-700' 
            : 'bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600'
        }`}
      >
        {isFollowProcessing ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : following ? (
          'FOLLOWING'
        ) : (
          <>
            <UserPlus className="w-3 h-3" />
            FOLLOW {artistName}
          </>
        )}
      </button>
    </div>
  );
}
