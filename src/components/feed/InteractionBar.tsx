'use client';

import React, { useState, useEffect, useRef, useOptimistic, useTransition } from 'react';
import { Heart, MessageSquare, UserPlus, Loader2, Send, X } from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { createBrowserClient } from '@supabase/ssr';
import { toggleLikeAction, toggleFollowAction, postCommentAction } from '@/app/actions/socialActions';

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
  isFollowing = false,
}: InteractionBarProps) {
  const { openAuthModal, showToast } = useUI();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Persistent Local Base States (Synced with Props/DB)
  const [baseLikeState, setBaseLikeState] = useState({ liked: hasLiked, count: initialLikeCount });
  const [baseFollowState, setBaseFollowState] = useState(isFollowing);

  // React 18 useOptimistic Hooks
  const [optimisticLike, setOptimisticLike] = useOptimistic(
    baseLikeState,
    (current, nextLiked: boolean) => ({
      liked: nextLiked,
      count: nextLiked ? current.count + 1 : Math.max(0, current.count - 1),
    })
  );

  const [optimisticFollow, setOptimisticFollow] = useOptimistic(
    baseFollowState,
    (_current, nextFollowing: boolean) => nextFollowing
  );

  // Client-Side Click Throttling Ref (500ms Cooldown)
  const lastLikeClickRef = useRef<number>(0);
  const lastFollowClickRef = useRef<number>(0);

  // Comment Modal State
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      const loggedIn = !!session;
      setIsLoggedIn(loggedIn);
      setCheckingAuth(false);

      if (loggedIn && session?.user?.id) {
        const uid = session.user.id;
        // Fetch initial like status
        supabase
          .from('likes')
          .select('id')
          .eq('user_id', uid)
          .eq('submission_id', entityId)
          .maybeSingle()
          .then(({ data }) => {
            if (data) setBaseLikeState((prev) => ({ ...prev, liked: true }));
          });

        // Fetch initial follow status
        if (artistId && artistId !== uid) {
          supabase
            .from('followers')
            .select('id')
            .eq('follower_id', uid)
            .eq('following_id', artistId)
            .maybeSingle()
            .then(({ data }) => {
              if (data) setBaseFollowState(true);
            });
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [entityId, artistId]);

  // Handle Debounced / Throttled Like Action
  const handleLike = () => {
    if (!isLoggedIn) return openAuthModal();

    const now = Date.now();
    if (now - lastLikeClickRef.current < 500) {
      // 500ms Throttling: Ignore rapid spam clicks
      return;
    }
    lastLikeClickRef.current = now;

    const targetLikedState = !optimisticLike.liked;

    startTransition(async () => {
      // React 18 Instant Optimistic State Update
      setOptimisticLike(targetLikedState);

      const res = await toggleLikeAction(entityId);
      if (res.success) {
        setBaseLikeState({
          liked: res.liked ?? targetLikedState,
          count: res.liked ? baseLikeState.count + 1 : Math.max(0, baseLikeState.count - 1),
        });
        showToast(res.liked ? 'Track liked!' : 'Like removed', 'success');
      } else {
        showToast(res.error || 'Failed to update like status', 'error');
      }
    });
  };

  // Handle Debounced / Throttled Follow Action
  const handleFollow = () => {
    if (!isLoggedIn) return openAuthModal();
    if (!artistId) return showToast('Artist information unavailable.', 'error');

    const now = Date.now();
    if (now - lastFollowClickRef.current < 500) {
      // 500ms Throttling: Ignore rapid spam clicks
      return;
    }
    lastFollowClickRef.current = now;

    const targetFollowState = !optimisticFollow;

    startTransition(async () => {
      // React 18 Instant Optimistic Follow Update
      setOptimisticFollow(targetFollowState);

      const res = await toggleFollowAction(artistId);
      if (res.success) {
        setBaseFollowState(res.following ?? targetFollowState);
        showToast(res.following ? `Now following ${artistName}!` : `Unfollowed ${artistName}`, 'success');
      } else {
        showToast(res.error || 'Failed to update follow status', 'error');
      }
    });
  };

  // Handle Comment Modal
  const handleCommentClick = () => {
    if (!isLoggedIn) return openAuthModal();
    setIsCommentModalOpen(true);
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || isCommentSubmitting) return;

    setIsCommentSubmitting(true);
    const res = await postCommentAction(entityId, commentContent);
    setIsCommentSubmitting(false);

    if (res.success) {
      showToast('Comment posted successfully!', 'success');
      setCommentCount(prev => prev + 1);
      setCommentContent('');
      setIsCommentModalOpen(false);
    } else {
      showToast(res.error || 'Failed to post comment.', 'error');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-t border-neutral-800/50 pt-4 mt-4 select-none">
        <div className="flex items-center gap-6">
          {/* LIKE BUTTON */}
          <button 
            onClick={handleLike} 
            disabled={checkingAuth || isPending}
            className={`flex items-center gap-2 group transition-colors cursor-pointer disabled:opacity-60 ${
              optimisticLike.liked ? 'text-red-500' : 'text-zinc-400 hover:text-white'
            }`}
            title={isLoggedIn ? (optimisticLike.liked ? 'Unlike' : 'Like') : 'Sign in to like'}
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-red-500" />
            ) : (
              <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${optimisticLike.liked ? 'fill-current' : 'group-hover:text-red-500'}`} />
            )}
            <span className="text-sm font-bold font-mono">{optimisticLike.count > 0 ? optimisticLike.count : ''}</span>
          </button>

          {/* COMMENT BUTTON */}
          <button 
            onClick={handleCommentClick} 
            disabled={checkingAuth}
            className="flex items-center gap-2 text-zinc-400 hover:text-white group transition-colors cursor-pointer disabled:opacity-60"
            title={isLoggedIn ? 'Post a comment' : 'Sign in to comment'}
          >
            <MessageSquare className="w-5 h-5 transition-transform group-hover:scale-110 group-hover:text-blue-400" />
            <span className="text-sm font-bold font-mono">{commentCount > 0 ? commentCount : ''}</span>
          </button>
        </div>

        {/* FOLLOW BUTTON */}
        <button 
          onClick={handleFollow}
          disabled={checkingAuth || isPending}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all rounded-sm border cursor-pointer disabled:opacity-60 ${
            optimisticFollow 
              ? 'bg-neutral-800 border-neutral-700 text-zinc-300 hover:bg-neutral-700' 
              : 'bg-red-600/10 border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600'
          }`}
          title={isLoggedIn ? (optimisticFollow ? `Unfollow ${artistName}` : `Follow ${artistName}`) : 'Sign in to follow'}
        >
          {optimisticFollow ? (
            'FOLLOWING'
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              FOLLOW {artistName}
            </>
          )}
        </button>
      </div>

      {/* COMMENT MODAL */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-neutral-950 border border-neutral-800 shadow-2xl max-w-md w-full relative animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-black uppercase text-white tracking-wide">
                Post Comment
              </h3>
              <button 
                onClick={() => setIsCommentModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostComment} className="space-y-4">
              <textarea 
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Write your thoughts..."
                required
                rows={3}
                className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 text-sm focus:outline-none focus:border-red-600 transition-colors font-mono resize-none"
              />

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCommentModalOpen(false)}
                  className="text-xs uppercase font-bold tracking-widest text-zinc-500 hover:text-white px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCommentSubmitting || !commentContent.trim()}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest px-5 py-2.5 text-xs flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isCommentSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      POST
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
