'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, UserPlus, Loader2 } from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { createBrowserClient } from '@supabase/ssr';

interface InteractionBarProps {
  entityId: string;
  artistId?: string;
  artistName: string;
  initialLikeCount?: number;
  initialCommentCount?: number;
}

export function InteractionBar({
  entityId,
  artistId,
  artistName,
  initialLikeCount = 0,
  initialCommentCount = 0,
}: InteractionBarProps) {
  const { openAuthModal, showToast } = useUI();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setCheckingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLike = () => {
    if (!isLoggedIn) {
      return openAuthModal();
    }
    // Session exists - handle optimistic UI update
    setLiked(!liked);
    setLikeCount(prev => !liked ? prev + 1 : Math.max(0, prev - 1));
    showToast(!liked ? 'Track liked!' : 'Like removed', 'success');
  };

  const handleComment = () => {
    if (!isLoggedIn) {
      return openAuthModal();
    }
    showToast('Comments panel coming soon!', 'info');
  };

  const handleFollow = () => {
    if (!isLoggedIn) {
      return openAuthModal();
    }
    setFollowing(!following);
    showToast(!following ? `Now following ${artistName}!` : `Unfollowed ${artistName}`, 'info');
  };

  return (
    <div className="flex items-center justify-between border-t border-neutral-800/50 pt-4 mt-4 select-none">
      <div className="flex items-center gap-6">
        {/* LIKE BUTTON */}
        <button 
          onClick={handleLike} 
          disabled={checkingAuth}
          className={`flex items-center gap-2 group transition-colors cursor-pointer ${
            liked ? 'text-red-500' : 'text-zinc-400 hover:text-white'
          }`}
          title={isLoggedIn ? 'Like track' : 'Sign in to like'}
        >
          <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${liked ? 'fill-current' : 'group-hover:text-red-500'}`} />
          <span className="text-sm font-bold font-mono">{likeCount > 0 ? likeCount : ''}</span>
        </button>

        {/* COMMENT BUTTON */}
        <button 
          onClick={handleComment} 
          disabled={checkingAuth}
          className="flex items-center gap-2 text-zinc-400 hover:text-white group transition-colors cursor-pointer"
          title={isLoggedIn ? 'Comment' : 'Sign in to comment'}
        >
          <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-blue-400" />
          <span className="text-sm font-bold font-mono">{initialCommentCount > 0 ? initialCommentCount : ''}</span>
        </button>
      </div>

      {/* FOLLOW BUTTON */}
      <button 
        onClick={handleFollow}
        disabled={checkingAuth}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm border cursor-pointer ${
          following 
            ? 'bg-neutral-800 border-neutral-700 text-zinc-300 hover:bg-neutral-700' 
            : 'bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600'
        }`}
        title={isLoggedIn ? `Follow ${artistName}` : 'Sign in to follow'}
      >
        {following ? (
          'FOLLOWING'
        ) : (
          <>
            <UserPlus className="w-3.5 h-3.5" />
            FOLLOW {artistName}
          </>
        )}
      </button>
    </div>
  );
}
