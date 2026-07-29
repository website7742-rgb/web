'use client';

import React, { useState, useEffect } from 'react';
import { useData } from '@/providers/DataContext';
import { 
  Users, 
  Video, 
  Eye, 
  FileBadge, 
  Plus, 
  Upload, 
  TrendingUp,
  MoreVertical,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { artists } = useData();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format helper
  const formatNumber = (num: number) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(0) + 'K';
    return num.toString();
  };

  // Mock data for missing metrics
  const totalVideos = 2453;
  const monthlyViews = 184500000;
  const activeEPKs = artists.length;
  
  const recentActivities = [
    { id: 1, type: 'artist', name: 'Travis Scott', detail: 'Onboarded to Exclusive Roster', status: 'Published', time: '2 hours ago' },
    { id: 2, type: 'video', name: 'Drake Responds to Kendrick', detail: 'Uploaded to Main Feed', status: 'Published', time: '5 hours ago' },
    { id: 3, type: 'video', name: 'Gunna - New Music Video', detail: 'Scheduled for release', status: 'Draft', time: '1 day ago' },
    { id: 4, type: 'artist', name: 'Ice Spice', detail: 'EPK Profile Update', status: 'Pending Review', time: '2 days ago' },
    { id: 5, type: 'video', name: 'Kai Cenat Stream Highlights', detail: 'Uploaded to Main Feed', status: 'Published', time: '2 days ago' },
  ];

  if (!mounted) return null; // Prevent hydration errors

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-400 text-sm mt-1">Manage artists, videos, and platform analytics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/roster" className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-sm border border-zinc-800 transition-colors text-sm font-bold">
            <Plus className="w-4 h-4" />
            Add Artist
          </Link>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm transition-colors text-sm font-bold shadow-[0_0_15px_rgba(220,38,38,0.4)]">
            <Upload className="w-4 h-4" />
            Upload Video
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Card 1 */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-sm relative overflow-hidden group hover:border-zinc-700 transition-colors shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Artists</p>
              <h3 className="text-3xl font-black text-white">{artists.length}</h3>
            </div>
            <div className="p-2 bg-zinc-900 rounded-md border border-zinc-800 text-zinc-400 group-hover:text-red-500 group-hover:border-red-900/50 transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className="flex items-center text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded-sm">
              <TrendingUp className="w-3 h-3 mr-1" /> +4%
            </span>
            <span className="text-zinc-500">this month</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-sm relative overflow-hidden group hover:border-zinc-700 transition-colors shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Videos</p>
              <h3 className="text-3xl font-black text-white">{formatNumber(totalVideos)}</h3>
            </div>
            <div className="p-2 bg-zinc-900 rounded-md border border-zinc-800 text-zinc-400 group-hover:text-red-500 group-hover:border-red-900/50 transition-colors">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className="flex items-center text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded-sm">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
            <span className="text-zinc-500">this month</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-sm relative overflow-hidden group hover:border-zinc-700 transition-colors shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Monthly Views</p>
              <h3 className="text-3xl font-black text-white">{formatNumber(monthlyViews)}</h3>
            </div>
            <div className="p-2 bg-zinc-900 rounded-md border border-zinc-800 text-zinc-400 group-hover:text-red-500 group-hover:border-red-900/50 transition-colors">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className="flex items-center text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded-sm">
              <TrendingUp className="w-3 h-3 mr-1" /> +24%
            </span>
            <span className="text-zinc-500">this month</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-sm relative overflow-hidden group hover:border-zinc-700 transition-colors shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Active EPKs</p>
              <h3 className="text-3xl font-black text-white">{activeEPKs}</h3>
            </div>
            <div className="p-2 bg-zinc-900 rounded-md border border-zinc-800 text-zinc-400 group-hover:text-red-500 group-hover:border-red-900/50 transition-colors">
              <FileBadge className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            <span className="flex items-center text-zinc-400 font-bold bg-zinc-800 px-1.5 py-0.5 rounded-sm">
              Steady
            </span>
            <span className="text-zinc-500">this week</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-sm shadow-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Recent Activity</h2>
          <button className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Item</th>
                <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Detail</th>
                <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Time</th>
                <th className="py-3 px-6 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-sm flex items-center justify-center border ${activity.type === 'artist' ? 'bg-zinc-900 border-zinc-700 text-zinc-300' : 'bg-red-950/30 border-red-900/50 text-red-500'}`}>
                        {activity.type === 'artist' ? <Users className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                      </div>
                      <span className="font-bold text-white text-sm">{activity.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-zinc-400">{activity.detail}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider border ${
                      activity.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      activity.status === 'Draft' ? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {activity.status === 'Published' && <CheckCircle2 className="w-3 h-3" />}
                      {activity.status === 'Draft' && <FileBadge className="w-3 h-3" />}
                      {activity.status === 'Pending Review' && <Clock className="w-3 h-3" />}
                      {activity.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-zinc-500">{activity.time}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-zinc-500 hover:text-white transition-colors p-1">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
