'use client';

import React, { useState, useTransition } from 'react';
import { useData } from '@/providers/DataContext';
import { useUI } from '@/providers/UIContext';
import { Settings, Save, Upload, Video } from 'lucide-react';
import { uploadMedia } from '@/lib/upload';
import { SiteSettings } from '@/types';

export default function SiteSettingsClient() {
  const { siteSettings, updateSiteSettings } = useData();
  const { showToast } = useUI();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState<SiteSettings>(siteSettings);
  const [isUploading, setIsUploading] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateSiteSettings(formData);
        showToast('Site settings updated successfully!', 'success');
      } catch (err) {
        showToast('Failed to update settings', 'error');
      }
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('video/')) {
      showToast('Please upload a valid video file (MP4/WebM).', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const url = await uploadMedia(file, 'hero-videos');
      if (url) {
        setFormData(prev => ({ ...prev, heroVideoUrl: url }));
        showToast('Video uploaded successfully!', 'success');
      } else {
        throw new Error('Upload returned null');
      }
    } catch (err) {
      showToast('Failed to upload video.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
            <Settings className="w-8 h-8 text-red-500" />
            GLOBAL CMS SETTINGS
          </h1>
          <p className="text-zinc-400 mt-1">Manage global content, hero videos, and site-wide text.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={isPending || isUploading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]"
        >
          <Save className="w-5 h-5" />
          {isPending ? 'SAVING...' : 'SAVE SETTINGS'}
        </button>
      </div>

      <div className="bg-[#111113] rounded-2xl border border-white/5 p-6 md:p-8 space-y-8">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/10 flex items-center gap-2">
            <Video className="w-5 h-5 text-red-500" />
            Homepage Hero Section
          </h2>

          <div className="space-y-6">
            {/* HERO TITLE */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider">Hero Title</label>
              <input 
                type="text" 
                value={formData.heroTitle}
                onChange={e => setFormData({ ...formData, heroTitle: e.target.value })}
                placeholder="e.g. DRAKE & 21 SAVAGE: UNCUT STUDIO FREESTYLE"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* HERO SUBTITLE */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider">Hero Subtitle</label>
              <input 
                type="text" 
                value={formData.heroSubtitle}
                onChange={e => setFormData({ ...formData, heroSubtitle: e.target.value })}
                placeholder="e.g. WORLDSTAR EXCLUSIVE • OFFICIAL RELEASE"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* HERO VIDEO URL / UPLOAD */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider">Hero Video (URL or Upload)</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="text" 
                  value={formData.heroVideoUrl}
                  onChange={e => setFormData({ ...formData, heroVideoUrl: e.target.value })}
                  placeholder="e.g. https://www.youtube.com/embed/... or direct MP4 URL"
                  className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
                
                <div className="relative">
                  <input
                    type="file"
                    accept="video/mp4,video/webm"
                    onChange={handleVideoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isUploading}
                  />
                  <div className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest border transition-all ${isUploading ? 'bg-zinc-800 border-zinc-700 text-zinc-400' : 'bg-[#1a1a1f] border-white/10 hover:border-red-500 text-white'}`}>
                    <Upload className="w-5 h-5" />
                    <span>{isUploading ? 'UPLOADING...' : 'UPLOAD VIDEO'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA BUTTON CONFIGURATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider">CTA Button Text</label>
                <input 
                  type="text" 
                  value={formData.heroCtaText}
                  onChange={e => setFormData({ ...formData, heroCtaText: e.target.value })}
                  placeholder="e.g. WATCH NOW"
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-zinc-300 uppercase tracking-wider">CTA Button Link</label>
                <input 
                  type="text" 
                  value={formData.heroCtaLink}
                  onChange={e => setFormData({ ...formData, heroCtaLink: e.target.value })}
                  placeholder="e.g. /roster or https://..."
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
