'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, User, MessageSquare, AlertCircle, LogIn } from 'lucide-react';
import { getSubmissionCommentsAction, postCommentAction, EntityType } from '@/app/actions/socialActions';
import { useUI } from '@/providers/UIContext';
import ProfileAvatar from '@/components/ui/ProfileAvatar';
import { supabase } from '@/lib/supabase/client';

interface CommentProfile {
  full_name?: string;
  avatar_url?: string;
}

interface CommentItem {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: CommentProfile | CommentProfile[];
}

interface CommentDrawerProps {
  submissionId: string;
  trackTitle: string;
  entityType?: EntityType;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

export function CommentDrawer({
  submissionId,
  trackTitle,
  entityType = 'TRACK',
  isOpen,
  onClose,
  onCommentAdded,
}: CommentDrawerProps) {
  const { openAuthModal, showToast } = useUI();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; avatarUrl?: string } | null>(null);

  // Check auth state on mount and listen to changes
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUser({
          id: data.user.id,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          avatarUrl: data.user.user_metadata?.avatar_url,
        });
      } else {
        setCurrentUser(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          avatarUrl: session.user.user_metadata?.avatar_url,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch comments from Supabase when drawer opens
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    getSubmissionCommentsAction(submissionId, entityType).then((res) => {
      if (!isMounted) return;
      setIsLoading(false);
      if (res.success && res.comments) {
        setComments(res.comments as any[]);
      } else {
        setErrorMessage(res.error || 'Failed to load comments.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [submissionId, entityType, isOpen]);

  // Global Escape key listener to dismiss drawer
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast('Please sign in to join the discussion.', 'info');
      openAuthModal();
      return;
    }

    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    const res = await postCommentAction(submissionId, trimmed, entityType);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Comment posted successfully!', 'success');
      setContent('');
      if (onCommentAdded) onCommentAdded();

      // Refresh comment list from Supabase
      const updated = await getSubmissionCommentsAction(submissionId, entityType);
      if (updated.success && updated.comments) {
        setComments(updated.comments as any[]);
      }
    } else {
      showToast(res.error || 'Failed to post comment.', 'error');
      if (res.error?.includes('sign in')) {
        openAuthModal();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100000] flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Community Discussion: ${trackTitle}`}
      onClick={onClose}
    >
      <div
        className="bg-neutral-950 border-l border-neutral-800 w-full max-w-lg h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-black/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase text-white tracking-wide truncate max-w-[280px]">
                {trackTitle}
              </h2>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                Community Discussion ({comments.length})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-2"
            aria-label="Close comment drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* COMMENTS LIST AREA */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              <p className="text-xs uppercase tracking-widest">Loading comments...</p>
            </div>
          ) : errorMessage ? (
            <div className="p-4 bg-red-600/10 border border-red-600/30 text-red-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-20 text-zinc-600 space-y-2">
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">NO COMMENTS YET</p>
              <p className="text-xs">Be the first to share your thoughts on this drop!</p>
            </div>
          ) : (
            comments.map((c) => {
              const author = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
              const name = author?.full_name || 'Anonymous User';
              const avatar = author?.avatar_url;

              return (
                <div key={c.id} className="bg-neutral-900/60 border border-neutral-800/80 p-4 rounded-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                        <ProfileAvatar
                          src={avatar}
                          name={name}
                          alt={name}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-white">
                        {name}
                      </span>
                    </div>

                    <span className="text-[10px] text-zinc-600">
                      {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-sans pl-9">
                    {c.content}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* BOTTOM INPUT / SIGN-IN CALL TO ACTION */}
        {currentUser ? (
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 shrink-0 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
              <span className="flex items-center gap-1.5 text-white font-bold uppercase truncate max-w-[240px]">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                Posting as {currentUser.name}
              </span>
              <span className="text-[10px] text-zinc-500">{content.length}/1000</span>
            </div>
            <form onSubmit={handlePost} className="flex gap-2">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Join the discussion..."
                maxLength={1000}
                required
                className="flex-1 bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-mono transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="bg-red-600 hover:bg-red-500 text-white px-5 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    POST
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 text-zinc-400 text-xs font-mono">
              <div className="w-8 h-8 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white uppercase text-[11px]">Join WorldStar Discussion</p>
                <p className="text-[10px] text-zinc-500">Sign in to drop comments & react to videos</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal()}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 cursor-pointer shrink-0 min-h-[44px]"
            >
              <LogIn className="w-4 h-4" />
              <span>SIGN IN TO COMMENT</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
