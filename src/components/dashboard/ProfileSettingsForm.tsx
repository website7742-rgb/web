'use client';

import React, { useState } from 'react';
import { updateProfileAction } from '@/app/actions/dashboardActions';
import { Loader2, Instagram, Twitter, User, FileText } from 'lucide-react';
import { useUI } from '@/providers/UIContext';

export default function ProfileSettingsForm({ initialData }: { initialData: any }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useUI();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await updateProfileAction(formData);

    if (res.success) {
      showToast('Profile updated successfully.', 'success');
    } else {
      showToast(res.error || 'Failed to update profile.', 'error');
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        
        {/* ARTIST NAME */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
            <User className="w-3 h-3" />
            Artist Name / Alias
          </label>
          <input 
            type="text" 
            name="fullName"
            defaultValue={initialData.fullName || ''}
            required
            className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-base focus:outline-none focus:border-red-600 transition-colors"
            placeholder="e.g. Future"
          />
        </div>

        {/* BIO */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
            <FileText className="w-3 h-3" />
            Artist Bio
          </label>
          <textarea 
            name="bio"
            defaultValue={initialData.bio || ''}
            rows={4}
            className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-base focus:outline-none focus:border-red-600 transition-colors resize-none"
            placeholder="Tell us your story..."
          />
        </div>

        {/* INSTAGRAM */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
            <Instagram className="w-3 h-3" />
            Instagram URL
          </label>
          <input 
            type="url" 
            name="instagramUrl"
            defaultValue={initialData.instagramUrl || ''}
            className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-base focus:outline-none focus:border-red-600 transition-colors"
            placeholder="https://instagram.com/yourhandle"
          />
        </div>

        {/* TWITTER */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
            <Twitter className="w-3 h-3" />
            Twitter / X URL
          </label>
          <input 
            type="url" 
            name="twitterUrl"
            defaultValue={initialData.twitterUrl || ''}
            className="w-full bg-neutral-900 border border-neutral-800 text-white px-4 py-3 text-base focus:outline-none focus:border-red-600 transition-colors"
            placeholder="https://twitter.com/yourhandle"
          />
        </div>

      </div>

      <button 
        type="submit" 
        disabled={isProcessing}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase py-4 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.3)]"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            SAVING...
          </>
        ) : (
          'UPDATE PROFILE'
        )}
      </button>
    </form>
  );
}
