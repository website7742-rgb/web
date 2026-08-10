'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  UserCheck, 
  ShieldAlert, 
  Globe, 
  Music, 
  ExternalLink,
  Users,
  Filter,
  CheckCircle2,
  Mail
} from 'lucide-react';

export interface UserProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  country: string | null;
  genre: string | null;
  role: string | null;
  bio: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface UserDirectoryClientProps {
  initialUsers: UserProfileRow[];
}

export function UserDirectoryClient({ initialUsers }: UserDirectoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Filtered Users computation
  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.genre && user.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.country && user.country.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole =
        roleFilter === 'ALL' ||
        (roleFilter === 'ADMIN' && (user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'superuser')) ||
        (roleFilter === 'ARTIST' && user.role?.toLowerCase() === 'artist') ||
        (roleFilter === 'USER' && (!user.role || user.role.toLowerCase() === 'user'));

      return matchesSearch && matchesRole;
    });
  }, [initialUsers, searchTerm, roleFilter]);

  // Aggregate Metrics
  const totalUsers = initialUsers.length;
  const adminCount = initialUsers.filter((u) => u.role?.toLowerCase() === 'admin' || u.role?.toLowerCase() === 'superuser').length;
  const uniqueGenres = new Set(initialUsers.map((u) => u.genre).filter(Boolean)).size;
  const uniqueCountries = new Set(initialUsers.map((u) => u.country).filter(Boolean)).size;

  return (
    <div className="space-y-8 font-sans">
      
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white">
              USER DIRECTORY
            </h1>
            <span className="px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
              {totalUsers} {totalUsers === 1 ? 'ACCOUNT' : 'ACCOUNTS'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Global Database Accounts & Security Role Management
          </p>
        </div>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-neutral-950 border border-white/5 rounded-none space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>TOTAL USERS</span>
            <Users className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-3xl font-black tracking-tight text-white">{totalUsers}</p>
        </div>

        <div className="p-5 bg-neutral-950 border border-white/5 rounded-none space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>ADMINISTRATORS</span>
            <ShieldAlert className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-3xl font-black tracking-tight text-white">{adminCount}</p>
        </div>

        <div className="p-5 bg-neutral-950 border border-white/5 rounded-none space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>ACTIVE GENRES</span>
            <Music className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-3xl font-black tracking-tight text-white">{uniqueGenres || 1}</p>
        </div>

        <div className="p-5 bg-neutral-950 border border-white/5 rounded-none space-y-2">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-mono">
            <span>GLOBAL REGIONS</span>
            <Globe className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-3xl font-black tracking-tight text-white">{uniqueCountries || 1}</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-neutral-950 border border-white/5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, genre, or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black border border-white/10 text-white text-xs font-mono placeholder:text-zinc-500 focus:outline-none focus:border-red-500/60 transition-colors"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0 mr-1 hidden sm:block" />
          {['ALL', 'ADMIN', 'ARTIST', 'USER'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 text-[11px] font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-red-600/20 border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
                  : 'bg-black/40 border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* SLEEK DARK DATA TABLE */}
      <div className="bg-neutral-950 border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-black/60 text-zinc-400 text-[11px] font-mono uppercase tracking-wider">
                <th className="py-4 px-6 font-bold">USER ACCOUNT</th>
                <th className="py-4 px-6 font-bold">REGION</th>
                <th className="py-4 px-6 font-bold">GENRE</th>
                <th className="py-4 px-6 font-bold">ROLE</th>
                <th className="py-4 px-6 font-bold">UPDATED</th>
                <th className="py-4 px-6 font-bold text-right">PROFILE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const initials = user.full_name
                    ? user.full_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    : 'WS';
                  const isAdminRole = user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'superuser';
                  const formattedDate = user.updated_at
                    ? new Date(user.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'N/A';

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* USER INFO */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-red-500/40 transition-colors">
                            {user.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.avatar_url}
                                alt={user.full_name || 'User'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="font-mono font-bold text-red-500 text-xs">{initials}</span>
                            )}
                          </div>

                          <div className="min-w-0 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-black text-sm text-white tracking-tight truncate group-hover:text-red-400 transition-colors">
                                {user.full_name || 'Unnamed Account'}
                              </span>
                              <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                            </div>
                            {user.email && (
                              <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400 truncate">
                                <Mail className="w-3 h-3 text-zinc-500 shrink-0" />
                                <span className="truncate">{user.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* REGION / COUNTRY */}
                      <td className="py-4 px-6 font-mono text-zinc-300 uppercase">
                        {user.country ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-zinc-500" />
                            {user.country}
                          </span>
                        ) : (
                          <span className="text-zinc-500">GLOBAL</span>
                        )}
                      </td>

                      {/* GENRE */}
                      <td className="py-4 px-6 font-mono">
                        {user.genre ? (
                          <span className="px-2.5 py-1 bg-red-600/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                            {user.genre}
                          </span>
                        ) : (
                          <span className="text-zinc-500 font-mono text-[11px]">GENERAL</span>
                        )}
                      </td>

                      {/* SYSTEM ROLE */}
                      <td className="py-4 px-6 font-mono">
                        {isAdminRole ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                            <ShieldAlert className="w-3 h-3 text-red-500" /> ADMIN
                          </span>
                        ) : user.role?.toLowerCase() === 'artist' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                            ARTIST
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-zinc-900 border border-white/10 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                            USER
                          </span>
                        )}
                      </td>

                      {/* UPDATED / JOINED */}
                      <td className="py-4 px-6 font-mono text-zinc-400 text-[11px]">
                        {formattedDate}
                      </td>

                      {/* ACTION LINK */}
                      <td className="py-4 px-6 text-right">
                        <Link
                          href={`/profile`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 hover:border-red-500/50 hover:bg-white/10 text-zinc-300 hover:text-white text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                        >
                          <span>VIEW</span>
                          <ExternalLink className="w-3 h-3 text-red-500" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-zinc-500 font-mono">
                    <UserCheck className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                    <p className="uppercase tracking-widest text-xs font-bold">No matching user accounts found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
