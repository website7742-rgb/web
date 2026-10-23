'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Send,
  Loader2,
  User,
  MessageSquare,
  AlertCircle,
  LogIn,
  Heart,
  Trash2,
  Copy,
  Check,
  CornerDownRight,
  Flame,
  ArrowUpDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import {
  getSubmissionCommentsAction,
  postCommentAction,
  deleteCommentAction,
  EntityType,
} from '@/app/actions/socialActions';
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
  isOptimistic?: boolean;
}

interface CommentDrawerProps {
  submissionId: string;
  trackTitle: string;
  entityType?: EntityType;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

type SortOrder = 'NEWEST' | 'TOP' | 'OLDEST';

const QUICK_REACTIONS = [
  { emoji: '🔥', label: 'Fire' },
  { emoji: '🐐', label: 'GOAT' },
  { emoji: '👑', label: 'Classic' },
  { emoji: '🎤', label: 'Hard Bars' },
  { emoji: '💀', label: 'Wild' },
  { emoji: '🚀', label: 'Next Up' },
  { emoji: '💯', label: '100' },
];

function formatRelativeTime(dateString: string): string {
  try {
    const now = Date.now();
    const date = new Date(dateString).getTime();
    if (isNaN(date)) return 'Just now';
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 30) return 'Just now';
    if (diffSec < 60) return `${diffSec}s ago`;
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recently';
  }
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
  const [sortOrder, setSortOrder] = useState<SortOrder>('NEWEST');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [copiedCommentId, setCopiedCommentId] = useState<string | null>(null);
  const [likedCommentIds, setLikedCommentIds] = useState<Record<string, boolean>>({});
  const [commentLikeCounts, setCommentLikeCounts] = useState<Record<string, number>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  // Initialize liked comments and like counts from localStorage for seamless persistence
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem('wshh_liked_comments');
      if (storedLikes) setLikedCommentIds(JSON.parse(storedLikes));
      const storedCounts = localStorage.getItem('wshh_comment_like_counts');
      if (storedCounts) setCommentLikeCounts(JSON.parse(storedCounts));
    } catch {
      // LocalStorage access restricted or unavailable
    }
  }, []);

  // Check auth state on mount and subscribe to changes
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

  // Lock body scroll when drawer is open (Rule #2 compliance)
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

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
        setComments(res.comments as CommentItem[]);
      } else {
        setErrorMessage(res.error || 'Failed to load community discussion.');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [submissionId, entityType, isOpen]);

  // Instant Like / Heart Toggle for Comments
  const handleToggleCommentLike = (commentId: string) => {
    const isLiked = !!likedCommentIds[commentId];
    const newLiked = !isLiked;

    const nextLikedMap = { ...likedCommentIds, [commentId]: newLiked };
    const currentCount = commentLikeCounts[commentId] || 0;
    const nextCount = newLiked ? currentCount + 1 : Math.max(0, currentCount - 1);
    const nextCountsMap = { ...commentLikeCounts, [commentId]: nextCount };

    setLikedCommentIds(nextLikedMap);
    setCommentLikeCounts(nextCountsMap);

    try {
      localStorage.setItem('wshh_liked_comments', JSON.stringify(nextLikedMap));
      localStorage.setItem('wshh_comment_like_counts', JSON.stringify(nextCountsMap));
    } catch {
      // Ignore storage errors
    }
  };

  // Reply Trigger: Prefills @username and focuses textarea
  const handleReplyTo = (authorName: string) => {
    setReplyingTo(authorName);
    const prefix = `@${authorName} `;
    if (!content.startsWith(prefix)) {
      setContent(prefix);
    }
    inputRef.current?.focus();
  };

  // Copy Comment Text
  const handleCopyComment = (commentId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommentId(commentId);
    showToast('Comment text copied to clipboard!', 'info');
    setTimeout(() => setCopiedCommentId(null), 2000);
  };

  // Quick Emoji Click Handler
  const handleQuickReaction = (emoji: string) => {
    if (!currentUser) {
      showToast('Please sign in to join the discussion.', 'info');
      openAuthModal();
      return;
    }
    setContent((prev) => (prev ? `${prev} ${emoji}` : emoji));
    inputRef.current?.focus();
  };

  // Optimistic Post Comment
  const handlePost = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser) {
      showToast('Please sign in to join the discussion.', 'info');
      openAuthModal();
      return;
    }

    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    // Create optimistic temporary comment item
    const tempId = `temp-${Date.now()}`;
    const optimisticComment: CommentItem = {
      id: tempId,
      content: trimmed,
      created_at: new Date().toISOString(),
      user_id: currentUser.id,
      profiles: {
        full_name: currentUser.name,
        avatar_url: currentUser.avatarUrl,
      },
      isOptimistic: true,
    };

    // Instant optimistic update (zero lag for user)
    setComments((prev) => [optimisticComment, ...prev]);
    setContent('');
    setReplyingTo(null);
    if (onCommentAdded) onCommentAdded();

    setIsSubmitting(true);
    const res = await postCommentAction(submissionId, trimmed, entityType);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Comment posted to WorldStar discussion!', 'success');
      // If server returned the inserted comment with real id, replace tempId
      if (res.comment && (res.comment as any).id) {
        const realItem = res.comment as CommentItem;
        setComments((prev) => prev.map((c) => (c.id === tempId ? realItem : c)));
      }
    } else {
      // Revert optimistic addition if failed
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      setContent(trimmed);
      showToast(res.error || 'Failed to post comment. Please try again.', 'error');
      if (res.error?.includes('sign in')) {
        openAuthModal();
      }
    }
  };

  // Delete Comment Action
  const handleDeleteComment = async (commentId: string) => {
    if (deletingId) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    setDeletingId(commentId);
    const prevComments = [...comments];

    // Optimistically remove comment
    setComments((prev) => prev.filter((c) => c.id !== commentId));

    const res = await deleteCommentAction(commentId);
    setDeletingId(null);

    if (res.success) {
      showToast('Comment deleted successfully.', 'info');
    } else {
      // Revert if failed
      setComments(prevComments);
      showToast(res.error || 'Failed to delete comment.', 'error');
    }
  };

  // Keyboard shortcut: Enter to submit, Shift+Enter for newline
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handlePost();
    }
  };

  // Sorted Comments List
  const sortedComments = useMemo(() => {
    const list = [...comments];
    if (sortOrder === 'NEWEST') {
      return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    if (sortOrder === 'OLDEST') {
      return list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    if (sortOrder === 'TOP') {
      return list.sort((a, b) => {
        const countA = (commentLikeCounts[a.id] || 0) + (likedCommentIds[a.id] ? 1 : 0);
        const countB = (commentLikeCounts[b.id] || 0) + (likedCommentIds[b.id] ? 1 : 0);
        return countB - countA;
      });
    }
    return list;
  }, [comments, sortOrder, commentLikeCounts, likedCommentIds]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100000] flex justify-end items-end md:items-stretch bg-black/80 backdrop-blur-md animate-in fade-in duration-200 touch-none"
      role="dialog"
      aria-modal="true"
      aria-label={`WorldStar Community Discussion: ${trackTitle}`}
      onClick={onClose}
    >
      <div
        className="bg-neutral-950 border-t md:border-t-0 md:border-l border-neutral-800 w-full md:max-w-lg h-[88vh] md:h-full rounded-t-2xl md:rounded-none flex flex-col shadow-2xl relative animate-in slide-in-from-bottom md:slide-in-from-right duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MOBILE DRAG HANDLE */}
        <div className="md:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-neutral-700/80" />
        </div>

        {/* TOP HEADER */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-black/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-red-600/15 border border-red-600/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(220,38,38,0.3)]">
              <MessageSquare className="w-5 h-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-black uppercase text-white tracking-wide truncate">
                {trackTitle}
              </h2>
              <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                <span className="flex items-center gap-1.5 uppercase font-bold text-red-500">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Discussion
                </span>
                <span>•</span>
                <span className="text-zinc-500 font-medium">
                  {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-neutral-900 min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 ml-2"
            aria-label="Close community discussion drawer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* SORTING CONTROLS & SUBHEADER */}
        <div className="px-4 py-2.5 border-b border-neutral-800/80 bg-neutral-900/40 flex items-center justify-between text-xs font-mono shrink-0">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <span className="uppercase text-[11px] font-bold text-zinc-300">Sort by:</span>
          </div>

          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-sm border border-neutral-800">
            <button
              onClick={() => setSortOrder('NEWEST')}
              className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase transition-all cursor-pointer ${
                sortOrder === 'NEWEST'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder('TOP')}
              className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                sortOrder === 'TOP'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3" />
              Top
            </button>
            <button
              onClick={() => setSortOrder('OLDEST')}
              className={`px-2.5 py-1 rounded-xs text-[10px] font-bold uppercase transition-all cursor-pointer ${
                sortOrder === 'OLDEST'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Oldest
            </button>
          </div>
        </div>

        {/* COMMENTS LIST AREA */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 font-mono">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              <p className="text-xs uppercase tracking-widest font-bold">Loading discussion...</p>
            </div>
          ) : errorMessage ? (
            <div className="p-4 bg-red-600/10 border border-red-600/30 text-red-500 text-xs flex items-center gap-3 rounded-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <p className="font-bold uppercase">Connection Notice</p>
                <p className="text-zinc-400 text-[11px] font-sans mt-0.5">{errorMessage}</p>
              </div>
            </div>
          ) : sortedComments.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-600/30 flex items-center justify-center mx-auto text-red-500">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-wider text-white">NO COMMENTS YET</p>
                <p className="text-xs text-zinc-400 font-sans max-w-xs mx-auto">
                  Be the first to drop your thoughts on this WorldStar drop!
                </p>
              </div>

              {/* Quick suggestion chips */}
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                {['🔥 Straight Fire!', '🐐 Absolute GOAT', '🎤 Hard Bars!'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      if (!currentUser) return openAuthModal();
                      setContent(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-600/50 rounded-full text-xs text-zinc-300 hover:text-white transition-all cursor-pointer font-sans"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            sortedComments.map((c) => {
              const author = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
              const name = author?.full_name || 'Anonymous User';
              const avatar = author?.avatar_url;
              const isCurrentUser = currentUser && currentUser.id === c.user_id;
              const isLiked = !!likedCommentIds[c.id];
              const likeCount = (commentLikeCounts[c.id] || 0) + (isLiked ? 1 : 0);

              return (
                <div
                  key={c.id}
                  className={`bg-neutral-900/60 hover:bg-neutral-900/90 border transition-all duration-200 p-3.5 sm:p-4 rounded-sm space-y-2.5 group ${
                    c.isOptimistic
                      ? 'border-red-600/60 bg-red-950/20'
                      : 'border-neutral-800/80 hover:border-neutral-700'
                  }`}
                >
                  {/* COMMENT HEADER */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                        <ProfileAvatar
                          src={avatar}
                          name={name}
                          alt={name}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-bold uppercase tracking-wider text-white truncate max-w-[140px] sm:max-w-[200px]">
                          {name}
                        </span>
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.2 bg-red-600/20 border border-red-600/40 text-red-400 text-[9px] font-bold uppercase rounded-xs">
                            YOU
                          </span>
                        )}
                        {c.isOptimistic && (
                          <span className="text-[10px] text-zinc-500 animate-pulse font-sans">
                            (posting...)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* TIMESTAMP & QUICK ACTIONS */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-zinc-500">
                        {formatRelativeTime(c.created_at)}
                      </span>

                      {/* Delete button (only author or admin) */}
                      {isCurrentUser && (
                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          disabled={deletingId === c.id}
                          className="text-zinc-500 hover:text-red-500 transition-colors p-1 rounded-sm cursor-pointer opacity-70 group-hover:opacity-100"
                          title="Delete comment"
                          aria-label="Delete your comment"
                        >
                          {deletingId === c.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* COMMENT CONTENT */}
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-sans pl-10 whitespace-pre-wrap break-words">
                    {c.content}
                  </p>

                  {/* COMMENT FOOTER / INTERACTIONS */}
                  <div className="flex items-center justify-between pl-10 pt-1 text-[11px] text-zinc-400">
                    <div className="flex items-center gap-4">
                      {/* Heart Like Toggle */}
                      <button
                        onClick={() => handleToggleCommentLike(c.id)}
                        className={`flex items-center gap-1.5 transition-all cursor-pointer py-1 px-1.5 rounded-sm hover:bg-neutral-800 ${
                          isLiked ? 'text-red-500 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                        aria-label={isLiked ? 'Unlike comment' : 'Like comment'}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 transition-transform ${
                            isLiked ? 'fill-current scale-110 text-red-500' : ''
                          }`}
                        />
                        <span>{likeCount > 0 ? likeCount : 'Like'}</span>
                      </button>

                      {/* Reply Button */}
                      <button
                        onClick={() => handleReplyTo(name)}
                        className="flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors cursor-pointer py-1 px-1.5 rounded-sm hover:bg-neutral-800"
                        title={`Reply to ${name}`}
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>

                    {/* Copy text trigger */}
                    <button
                      onClick={() => handleCopyComment(c.id, c.content)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 cursor-pointer"
                      title="Copy comment text"
                      aria-label="Copy comment text"
                    >
                      {copiedCommentId === c.id ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
          <div ref={listEndRef} />
        </div>

        {/* BOTTOM INPUT & QUICK REACTION DOCK */}
        {currentUser ? (
          <div className="p-3.5 sm:p-4 border-t border-neutral-800 bg-neutral-950 shrink-0 space-y-2.5 pb-safe">
            {/* QUICK HIP-HOP EMOJI REACTION PILLS */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                <Flame className="w-3 h-3 text-red-500" /> Quick:
              </span>
              {QUICK_REACTIONS.map((qr) => (
                <button
                  key={qr.label}
                  type="button"
                  onClick={() => handleQuickReaction(qr.emoji)}
                  className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-red-600/50 rounded-full text-xs text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1 shrink-0 active:scale-95"
                >
                  <span>{qr.emoji}</span>
                  <span className="text-[10px] font-mono">{qr.label}</span>
                </button>
              ))}
            </div>

            {/* REPLY BANNER (IF ACTIVE) */}
            {replyingTo && (
              <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-sm text-xs text-zinc-300">
                <div className="flex items-center gap-1.5 truncate">
                  <CornerDownRight className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="text-zinc-400">Replying to</span>
                  <span className="text-white font-bold truncate">@{replyingTo}</span>
                </div>
                <button
                  onClick={() => {
                    setReplyingTo(null);
                    if (content.startsWith(`@${replyingTo} `)) {
                      setContent('');
                    }
                  }}
                  className="text-zinc-500 hover:text-white p-1 cursor-pointer"
                  title="Cancel reply"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* LIVE USER POSTING BAR */}
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
              <span className="flex items-center gap-1.5 text-white font-bold uppercase truncate max-w-[240px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Posting as {currentUser.name}
              </span>
              <span
                className={`text-[10px] ${
                  content.length > 900
                    ? 'text-red-500 font-bold'
                    : content.length > 750
                    ? 'text-amber-500'
                    : 'text-zinc-500'
                }`}
              >
                {content.length}/1000
              </span>
            </div>

            {/* INPUT FORM WITH MULTILINE TEXTAREA */}
            <form onSubmit={handlePost} className="flex gap-2 items-end">
              <div className="flex-1 bg-neutral-900 border border-neutral-800 focus-within:border-red-600 rounded-sm transition-colors p-2 flex flex-col">
                <textarea
                  ref={inputRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    replyingTo ? `Reply to @${replyingTo}...` : 'Join the discussion (Enter to send, Shift+Enter for new line)...'
                  }
                  maxLength={1000}
                  rows={2}
                  required
                  className="w-full bg-transparent text-white text-xs sm:text-sm focus:outline-none resize-none font-sans placeholder:text-zinc-600 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="bg-red-600 hover:bg-red-500 text-white px-5 py-3.5 text-xs font-bold uppercase tracking-widest flex items-center gap-2 rounded-sm transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.4)] min-h-[44px]"
                aria-label="Post comment"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">POST</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 pb-safe">
            <div className="flex items-center gap-3 text-zinc-400 text-xs font-mono">
              <div className="w-9 h-9 rounded-full bg-red-600/15 border border-red-600/40 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-left">
                <p className="font-bold text-white uppercase text-xs">Join WorldStar Discussion</p>
                <p className="text-[11px] text-zinc-400 font-sans">
                  Sign in to drop comments, reply to members & react to drops.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal()}
              className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2 cursor-pointer shrink-0 min-h-[44px] rounded-sm"
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
