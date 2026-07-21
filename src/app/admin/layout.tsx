'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileEdit, 
  BarChart3, 
  Headphones, 
  LogOut,
  Disc
} from 'lucide-react';
import { useUI } from '@/context/UIContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { showToast } = useUI();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      showToast('Secure session terminated.', 'info');
      window.location.href = '/admin/login';
    } catch (err) {
      showToast('Error terminating session.', 'error');
    }
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Roster Manager', path: '/admin/roster', icon: Users },
    { name: 'Editorial CMS', path: '/admin/cms', icon: FileEdit },
    { name: 'Charts Engine', path: '/admin/charts', icon: BarChart3 },
    { name: 'A&R Demos', path: '/admin/submissions', icon: Headphones },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-black flex-shrink-0 flex flex-col sticky top-0 md:h-screen z-40">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-sm bg-black border border-gold flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
              <Disc className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white font-hero font-bold tracking-tight leading-tight">EXECUTIVE</h2>
              <p className="text-[10px] text-zinc-400 font-mono tracking-widest">CONTROL CENTER</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <span className="text-[10px] font-label text-zinc-500 font-bold uppercase tracking-widest px-4 block mb-4">
            Platform Modules
          </span>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-none text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-zinc-900 text-gold border-l-2 border-gold'
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-black overflow-x-hidden min-h-screen">
        {children}
      </main>
    </div>
  );
}
