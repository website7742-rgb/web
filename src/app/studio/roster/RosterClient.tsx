'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useUI } from '@/providers/UIContext';
import { useData } from '@/providers/DataContext';
import { Plus, Edit2, Trash2, X, Search, ShieldCheck, Upload, Image as ImageIcon, Video, Sparkles } from 'lucide-react';
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
  genres: ['Hip-Hop'],
  country: 'United States',
  countryFlag: '🇺🇸',
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
  const { artists: contextArtists } = useData();
  const [isPending, startTransition] = useTransition();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Artist>>(INITIAL_ARTIST);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const actualArtists = initialArtists.length > 0 ? initialArtists : contextArtists;

  const filteredArtists = actualArtists.filter(a =>  
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
      showToast('Avatar uploaded to Cloudflare R2!', 'success');
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
      showToast('Hero banner uploaded to Cloudflare R2!', 'success');
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
          finalData.id = `art-${Date.now()}`;
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
            console.error("Validation Errors:", res.errors);
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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-500 text-xs font-mono font-bold uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EXECUTIVE ROSTER OPERATIONS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
            ROSTER <span className="bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-transparent bg-clip-text">MANAGER</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1">
            Manage official signed talent, edit profile artwork in Cloudflare R2, and configure spotlight visual showcases.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 sm:px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.35)] min-h-[44px] cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW ARTIST</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-3 sm:p-4 rounded-2xl border border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roster by artist name or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-zinc-800 rounded-xl text-white font-sans text-xs sm:text-sm focus:outline-none focus:border-red-600 transition-colors"
          />
        </div>
        <div className="text-xs font-mono text-zinc-400 px-2 flex items-center justify-between sm:justify-end gap-2">
          <span>DIRECTORY:</span>
          <span className="text-red-400 font-bold bg-red-600/10 border border-red-500/20 px-2 py-0.5 rounded">
            {filteredArtists.length} ARTIST(S)
          </span>
        </div>
      </div>

      {/* Mobile Card View (< 640px) */}
      <div className="grid grid-cols-1 gap-3 sm:hidden">
        {filteredArtists.map((art) => (
          <div
            key={art.id}
            className="bg-zinc-950/80 border border-zinc-800/90 rounded-2xl p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Image
                src={art.avatarUrl}
                alt={art.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-xl object-cover border border-zinc-800 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-white text-base truncate">{art.name}</h4>
                  {art.isVerified ? (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded">
                      VERIFIED
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-zinc-800 text-zinc-400 rounded">
                      PENDING
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-zinc-400 truncate">
                  {art.country} &bull; {art.genres.join(', ')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-black/50 p-2.5 rounded-xl border border-zinc-800/60">
              <div>
                <span className="text-zinc-500">STREAMS: </span>
                <span className="text-white font-bold font-mono">{(art.totalStreams / 1000000).toFixed(1)}M</span>
              </div>
              <div>
                <span className="text-zinc-500">GRAMMYS: </span>
                <span className="text-white font-bold font-mono">{art.grammyWins}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              <Link
                href={`/studio/videos?tab=ARTIST_SPOTLIGHT&slug=${encodeURIComponent(art.slug)}`}
                className="flex-1 py-2 rounded-xl bg-red-600/10 text-red-400 border border-red-500/30 text-xs font-mono font-bold flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Video className="w-3.5 h-3.5" />
                <span>SPOTLIGHT</span>
              </Link>
              <button
                onClick={() => handleOpenModal(art)}
                className="flex-1 py-2 rounded-xl bg-white/5 text-zinc-300 border border-white/10 text-xs font-mono font-bold flex items-center justify-center gap-1.5 min-h-[44px] hover:text-white"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>EDIT</span>
              </button>
              <button
                onClick={() => handleDelete(art.id)}
                disabled={isDeleting === art.id}
                className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-mono flex items-center justify-center min-h-[44px]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filteredArtists.length === 0 && (
          <div className="p-8 text-center bg-zinc-950 border border-zinc-800 rounded-2xl text-zinc-500 font-mono text-xs">
            NO ARTISTS MATCH ACTIVE SEARCH QUERY
          </div>
        )}
      </div>

      {/* Desktop Data Table (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto border border-zinc-800/80 rounded-2xl bg-zinc-950/80">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="text-xs text-red-500 uppercase bg-black/60 border-b border-zinc-800 font-mono tracking-wider">
            <tr>
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4">Origin</th>
              <th className="px-6 py-4">Metrics</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {filteredArtists.map((art) => (
              <tr key={art.id} className="hover:bg-white/[0.02] transition-colors font-sans">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image src={art.avatarUrl} alt={art.name} width={40} height={40} className="w-10 h-10 object-cover rounded-xl border border-zinc-800" />
                    <div>
                      <div className="font-display font-bold text-white text-base tracking-wide">{art.name}</div>
                      <div className="text-[10px] uppercase font-mono text-zinc-500">{art.genres.join(', ')}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-xs">{art.country}</td>
                <td className="px-6 py-4 font-mono text-xs">
                  <div className="space-y-0.5">
                    <div><span className="text-zinc-500">STREAMS:</span> <span className="text-white font-bold">{(art.totalStreams / 1000000).toFixed(1)}M</span></div>
                    <div><span className="text-zinc-500">GRAMMYS:</span> <span className="text-white font-bold">{art.grammyWins}</span></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {art.isVerified ? (
                    <span className="px-2.5 py-1 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold bg-emerald-500/10 rounded-md">VERIFIED</span>
                  ) : (
                    <span className="px-2.5 py-1 border border-zinc-700 text-zinc-500 text-[10px] font-mono font-bold bg-zinc-900 rounded-md">PENDING</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link
                    href={`/studio/videos?tab=ARTIST_SPOTLIGHT&slug=${encodeURIComponent(art.slug)}`}
                    className="p-2 text-zinc-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 bg-white/5 hover:bg-red-950/20 rounded-lg transition-all inline-block align-middle"
                    title="Manage Spotlight YouTube Visual"
                  >
                    <Video className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleOpenModal(art)}
                    className="p-2 text-zinc-400 hover:text-white border border-white/10 hover:border-zinc-600 bg-white/5 hover:bg-zinc-800 rounded-lg transition-all inline-block align-middle cursor-pointer"
                    title="Edit Artist"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    disabled={isDeleting === art.id}
                    className="p-2 text-red-500/70 hover:text-red-400 border border-white/10 hover:border-red-500/30 bg-white/5 hover:bg-red-950/20 rounded-lg transition-all disabled:opacity-50 inline-block align-middle cursor-pointer"
                    title="Delete Artist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredArtists.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-zinc-500 font-mono text-xs">
                  NO ARTISTS FOUND IN DIRECTORY
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl relative my-6 max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-950 z-10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-600/10 text-red-500 border border-red-500/30">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-xl font-display font-black text-white uppercase tracking-tight">
                  {editingArtistId ? 'EDIT ARTIST RECORD' : 'CREATE NEW ARTIST'}
                </h2>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="text-zinc-500 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold text-red-500 border-b border-zinc-800 pb-2 uppercase tracking-wider">
                    BASIC INFORMATION
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Stage Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white font-sans text-xs sm:text-sm focus:border-red-600 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Country of Origin</label>
                      <input
                        required
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white font-sans text-xs sm:text-sm focus:border-red-600 outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Tagline</label>
                    <input
                      required
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                      className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white font-sans text-xs sm:text-sm focus:border-red-600 outline-none"
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold text-red-500 border-b border-zinc-800 pb-2 uppercase tracking-wider">
                    ACHIEVEMENTS &amp; METRICS
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Grammys</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.grammyWins}
                        onChange={(e) => setFormData({...formData, grammyWins: parseInt(e.target.value) || 0})}
                        className="w-full p-2.5 bg-black border border-zinc-800 rounded-xl text-white font-mono text-xs focus:border-red-600 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Streams</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.totalStreams}
                        onChange={(e) => setFormData({...formData, totalStreams: parseInt(e.target.value) || 0})}
                        className="w-full p-2.5 bg-black border border-zinc-800 rounded-xl text-white font-mono text-xs focus:border-red-600 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Platinum</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.riaaCertifications?.platinum || 0}
                        onChange={(e) => setFormData({...formData, riaaCertifications: { ...formData.riaaCertifications!, platinum: parseInt(e.target.value) || 0 }})}
                        className="w-full p-2.5 bg-black border border-zinc-800 rounded-xl text-white font-mono text-xs focus:border-red-600 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-zinc-400 uppercase font-bold">Listeners</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.monthlyListeners}
                        onChange={(e) => setFormData({...formData, monthlyListeners: parseInt(e.target.value) || 0})}
                        className="w-full p-2.5 bg-black border border-zinc-800 rounded-xl text-white font-mono text-xs focus:border-red-600 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Media Uploads to Cloudflare R2 */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono font-bold text-red-500 border-b border-zinc-800 pb-2 uppercase tracking-wider">
                    MEDIA ASSETS (CLOUDFLARE R2)
                  </h3>
                  <div className="space-y-2">
                    <label className="text-zinc-400 block font-bold flex items-center gap-1.5 text-[10px] font-mono uppercase">
                      <ImageIcon className="w-3.5 h-3.5 text-red-500" />
                      <span>Avatar Photo URL (Square)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.avatarUrl}
                        onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                        className="w-full p-2.5 bg-black border border-zinc-800 rounded-xl text-white font-mono text-xs focus:border-red-600 outline-none"
                      />
                      <label className="px-4 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl cursor-pointer flex items-center justify-center min-h-[44px] transition-colors">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                      </label>
                    </div>
                    {isUploadingAvatar && <span className="text-[10px] font-mono text-red-400 animate-pulse">Streaming photo to Cloudflare R2...</span>}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-zinc-400 block font-bold flex items-center gap-1.5 text-[10px] font-mono uppercase">
                      <ImageIcon className="w-3.5 h-3.5 text-red-500" />
                      <span>Hero Banner URL (Wide)</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.heroUrl}
                        onChange={(e) => setFormData({...formData, heroUrl: e.target.value})}
                        className="w-full p-2.5 bg-black border border-zinc-800 rounded-xl text-white font-mono text-xs focus:border-red-600 outline-none"
                      />
                      <label className="px-4 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl cursor-pointer flex items-center justify-center min-h-[44px] transition-colors">
                        <Upload className="w-4 h-4" />
                        <input type="file" accept="image/*" onChange={handleHeroFileUpload} className="hidden" />
                      </label>
                    </div>
                    {isUploadingHero && <span className="text-[10px] font-mono text-red-400 animate-pulse">Streaming banner to Cloudflare R2...</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950 pb-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-900 transition-colors min-h-[44px] cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all disabled:opacity-50 min-h-[44px] cursor-pointer"
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
