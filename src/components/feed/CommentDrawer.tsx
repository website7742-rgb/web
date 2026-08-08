'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, Loader2, User, MessageSquare, AlertCircle } from 'lucide-react';
import { getSubmissionCommentsAction, postCommentAction } from '@/app/actions/socialActions';
import { useUI } from '@/providers/UIContext';

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
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

export function CommentDrawer({
  submissionId,
  trackTitle,
  isOpen,
  onClose,
  onCommentAdded,
}: CommentDrawerProps) {
  const { showToast } = useUI();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    getSubmissionCommentsAction(submissionId).then((res) => {
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
  }, [submissionId, isOpen]);

  if (!isOpen) return null;

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    const res = await postCommentAction(submissionId, trimmed);
    setIsSubmitting(false);

    if (res.success) {
      showToast('Comment posted successfully!', 'success');
      setContent('');
      if (onCommentAdded) onCommentAdded();
      
      // Refresh comment list
      const updated = await getSubmissionCommentsAction(submissionId);
      if (updated.success && updated.comments) {
        setComments(updated.comments as any[]);
      }
    } else {
      showToast(res.error || 'Failed to post comment.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-neutral-950 border-l border-neutral-800 w-full max-w-lg h-full flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300">
        
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
                        {avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatar} alt={name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-3.5 h-3.5 text-zinc-400" />
                        )}
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

        {/* BOTTOM INPUT FORM */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 shrink-0">
          <form onSubmit={handlePost} className="flex gap-2">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Join the discussion..."
              required
              className="flex-1 bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-red-600 font-mono transition-colors"
            />
            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
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

      </div>
    </div>
  );
}
