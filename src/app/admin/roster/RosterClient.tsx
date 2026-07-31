'use client';

import React, { useState, useTransition } from 'react';
import { useUI } from '@/providers/UIContext';
import { Plus, Edit2, Trash2, X, Search, ShieldCheck, Upload, Image as ImageIcon } from 'lucide-react';
import { Artist } from '@/types';
import Image from 'next/image';
import { addArtist, deleteArtist } from '@/actions/adminActions';
import { uploadArtistImage } from '@/lib/upload';

// Initial state for forms
const INITIAL_ARTIST: Partial<Artist> = {
  name: '',
  slug: '',
  tagline: '',
  bio: '',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  heroUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80',
  genres: ['Pop'],
  country: 'United States',
  countryFlag: 'ðŸ‡ºðŸ‡¸',
  isVerified: true,
  isFeatured: false,
  labelStatus: 'SIGNED',
  monthlyListeners: 0,
  totalStreams: 0,
  grammyWins: 0,
  riaaCertifications: { platinum: 0, gold: 0, diamond: 0 },
  topSongs: [],
  streamingPlatforms: [],
  socials: {}
};

export default function AdminRosterClient({ initialArtists }: { initialArtists: Artist[] }) {
  const { showToast } = useUI();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Artist>>(INITIAL_ARTIST);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const filteredArtists = initialArtists.filter(a =>  
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (artist?: Artist) => {
    if (artist) {
      setEditingArtistId(artist.id);
      setFormData(artist);
    } else {
      setEditingArtistId(null);
      setFormData(INITIAL_ARTIST);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArtistId(null);
    setFormData(INITIAL_ARTIST);
  };

  const handleAvatarFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const uploadedUrl = await uploadArtistImage(file, 'avatars');
    if (uploadedUrl) {
      setFormData(prev => ({ ...prev, avatarUrl: uploadedUrl }));
      showToast('Avatar uploaded to Supabase Storage!', 'success');
    } else {
      showToast('Failed to upload image.', 'error');
    }
    setIsUploadingAvatar(false);
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingHero(true);
    const uploadedUrl = await uploadArtistImage(file, 'banners');
    if (uploadedUrl) {
      setFormData(prev => ({ ...prev, heroUrl: uploadedUrl }));
      showToast('Hero banner uploaded to Supabase Storage!', 'success');
    } else {
      showToast('Failed to upload banner.', 'error');
    }
    setIsUploadingHero(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        let finalData = { ...formData };
        if (!editingArtistId) {
          finalData.slug = formData.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'new-artist';
          finalData.id = `art-${Date.now()}`; // Ensure new ID for upsert
        }
        
        const formPayload = new FormData();
        formPayload.append('artistData', JSON.stringify(finalData));

        const res = await addArtist(formPayload);
        
        if (res.success) {
          showToast(res.message || 'Artist saved successfully.', 'success');
          handleCloseModal();
        } else {
          showToast(res.message || 'Error saving artist data.', 'error');
          if (res.errors) {
            console.error("Zod Validation Errors:", res.errors);
          }
        }
      } catch (err) {
        showToast('Error saving artist data.', 'error');
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('WARNING: Are you sure you want to permanently delete this artist from the roster? This action cannot be undone.')) {
      setIsDeleting(id);
      startTransition(async () => {
        try {
          const res = await deleteArtist(id);
          if (res.success) {
            showToast('Artist permanently removed from database.', 'success');
          } else {
            showToast(res.message || 'Failed to delete artist.', 'error');
          }
        } catch (err) {
          showToast('Failed to delete artist.', 'error');
        } finally {
          setIsDeleting(null);
        }
      });
    }
  };

  return (
    <div className="max-w-7xl px-4 md:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>EXECUTIVE CMS</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-hero font-extrabold text-white uppercase tracking-tight">
            ROSTER <span className="text-gold">MANAGER</span>
          </h1>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-gold text-black font-hero font-bold text-sm tracking-wide flex items-center gap-2 hover:bg-[#b5952f] transition-colors"
        >
          <Plus className="w-4 h-4" />
          ADD NEW ARTIST
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900/30 p-4 border border-zinc-800">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roster by name or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-zinc-800 text-white font-sans text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <div className="text-xs font-mono text-zinc-500 hidden sm:block">
          SHOWING {filteredArtists.length} ARTIST(S)
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto border border-zinc-800 bg-black">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs text-gold uppercase bg-zinc-900 border-b border-zinc-800 font-mono tracking-wider">
            <tr>
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4">Country</th>
              <th className="px-6 py-4">Metrics</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredArtists.map((art) => (
              <tr key={art.id} className="hover:bg-zinc-900/50 transition-colors font-sans">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image src={art.avatarUrl} alt={art.name} width={40} height={40} className="object-cover border border-zinc-800" />
                    <div>
                      <div className="font-hero font-bold text-white text-base tracking-wide">{art.name}</div>
                      <div className="text-[10px] uppercase font-label">{art.genres.join(', ')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{art.country}</td>
                <td className="px-6 py-4">
                  <div className="text-xs space-y-1">
                    <div><span className="text-zinc-500">GRAMMYS:</span> <span className="text-white font-bold">{art.grammyWins}</span></div>
                    <div><span className="text-zinc-500">STREAMS:</span> <span className="text-white font-bold">{(art.totalStreams / 1000000).toFixed(1)}M</span></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {art.isVerified ? (
                    <span className="px-2 py-1 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold bg-emerald-500/10">VERIFIED</span>
                  ) : (
                    <span className="px-2 py-1 border border-zinc-700 text-zinc-500 text-[10px] font-mono font-bold bg-zinc-900">PENDING</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenModal(art)}
                    className="p-2 text-zinc-400 hover:text-white border border-transparent hover:border-zinc-700 bg-transparent hover:bg-zinc-900 transition-all"
                    title="Edit Artist"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    disabled={isDeleting === art.id}
                    className="p-2 text-red-500/70 hover:text-red-400 border border-transparent hover:border-red-500/30 bg-transparent hover:bg-red-950/20 transition-all disabled:opacity-50"
                    title="Delete Artist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredArtists.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 font-mono">
                  NO ARTISTS FOUND IN DIRECTORY
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-black border border-zinc-800 w-full max-w-2xl shadow-2xl relative my-8">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-black z-10">
              <h2 className="text-2xl font-hero font-bold text-white uppercase tracking-tight">
                {editingArtistId ? 'EDIT ARTIST RECORD' : 'CREATE NEW ARTIST'}
              </h2>
              <button onClick={handleCloseModal} className="text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-xs font-mono text-gold border-b border-zinc-800 pb-2">BASIC INFORMATION</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">Stage Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-sans text-sm focus:border-gold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">Country</label>
                      <input
                        required
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-sans text-sm focus:border-gold outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase">Tagline</label>
                    <input
                      required
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                      className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-sans text-sm focus:border-gold outline-none"
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-xs font-mono text-gold border-b border-zinc-800 pb-2">ACHIEVEMENTS & METRICS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">Grammy Wins</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.grammyWins}
                        onChange={(e) => setFormData({...formData, grammyWins: parseInt(e.target.value) || 0})}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-sans text-sm focus:border-gold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">Total Streams</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.totalStreams}
                        onChange={(e) => setFormData({...formData, totalStreams: parseInt(e.target.value) || 0})}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-sans text-sm focus:border-gold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">RIAA Platinum</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.riaaCertifications?.platinum || 0}
                        onChange={(e) => setFormData({...formData, riaaCertifications: { ...formData.riaaCertifications!, platinum: parseInt(e.target.value) || 0 }})}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-sans text-sm focus:border-gold outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase">Monthly Listeners</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.monthlyListeners}
                        onChange={(e) => setFormData({...formData, monthlyListeners: parseInt(e.target.value) || 0})}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-sans text-sm focus:border-gold outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-xs font-mono text-gold border-b border-zinc-800 pb-2">MEDIA ASSETS</h3>
                  <div className="space-y-2">
                    <label className="text-zinc-400 block font-bold flex items-center gap-1.5 text-[10px] font-mono uppercase">
                      <ImageIcon className="w-3.5 h-3.5 text-gold" />
                      <span>Avatar URL (Square)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-sans text-sm focus:border-gold outline-none"
                      />
                      <label className="px-4 border border-zinc-700 bg-zinc-800 text-zinc-300 rounded-lg cursor-pointer flex items-center justify-center min-h-[44px]">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                      </label>
                    </div>
                    {isUploadingAvatar && <span className="text-[10px] font-mono text-gold animate-pulse">Uploading photo to Supabase Storage...</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-zinc-400 block font-bold flex items-center gap-1.5 text-[10px] font-mono uppercase">
                      <ImageIcon className="w-3.5 h-3.5 text-gold" />
                      <span>Hero URL (Wide)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.heroUrl}
                        onChange={(e) => setFormData({...formData, heroUrl: e.target.value})}
                        className="w-full p-2.5 bg-zinc-900 border border-zinc-800 text-white font-sans text-sm focus:border-gold outline-none"
                      />
                      <label className="px-4 border border-zinc-700 bg-zinc-800 text-zinc-300 rounded-lg cursor-pointer flex items-center justify-center min-h-[44px]">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={handleHeroFileUpload} className="hidden" />
                      </label>
                    </div>
                    {isUploadingHero && <span className="text-[10px] font-mono text-gold animate-pulse">Uploading banner to Supabase Storage...</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-zinc-800 mt-6 sticky bottom-0 bg-black p-4 -mx-6 -mb-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 border border-zinc-700 text-white font-hero font-bold text-sm tracking-wide hover:bg-zinc-900 transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 bg-gold text-black font-hero font-bold text-sm tracking-wide hover:bg-[#b5952f] transition-colors disabled:opacity-50"
                >
                  {isPending ? 'PROCESSING...' : (editingArtistId ? 'SAVE CHANGES' : 'PUBLISH ARTIST')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
