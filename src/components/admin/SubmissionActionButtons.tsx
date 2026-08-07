'use client';

import React, { useState } from 'react';
import { approveTrackAction, rejectTrackAction } from '@/app/actions/adminActions';
import { Loader2 } from 'lucide-react';
import { useUI } from '@/providers/UIContext';

export default function SubmissionActionButtons({ submissionId, currentStatus }: { submissionId: string, currentStatus: string }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useUI();

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const res = await approveTrackAction(submissionId);
      if (res.success) {
        showToast('Track approved. Email triggered to artist.', 'success');
      } else {
        showToast(res.error || 'Failed to approve track.', 'error');
      }
    } catch (err: any) {
      showToast('Error approving track.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      const res = await rejectTrackAction(submissionId);
      if (res.success) {
        showToast('Track rejected. Artist has been notified.', 'success');
      } else {
        showToast(res.error || 'Failed to reject track.', 'error');
      }
    } catch (err: any) {
      showToast('Error rejecting track.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (currentStatus !== 'PENDING') {
    return (
      <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest italic pr-4">
        Action Taken
      </span>
    );
  }

  return (
    <div className="flex items-center justify-end gap-2 opacity-80 hover:opacity-100 transition-opacity">
      <button 
        onClick={handleApprove}
        disabled={isProcessing}
        className="flex items-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/30 hover:border-emerald-500 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
        Approve
      </button>
      <button 
        onClick={handleReject}
        disabled={isProcessing}
        className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 hover:border-red-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
        Reject
      </button>
    </div>
  );
}
