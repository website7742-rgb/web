'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldAlert,
  Inbox,
  User
} from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { useData } from '@/providers/DataContext';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { showToast } = useUI();
  const { submissions } = useData();
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  const pendingCount = submissions.filter(s => s.status === 'PENDING').length;

  React.useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) return;

    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    };
    
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      showToast('Secure session terminated.', 'info');
      window.location.href = '/login';
    } catch (err) {
      showToast('Error terminating session.', 'error');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Submissions Inbox', path: '/admin/submissions', icon: Inbox, badge: pendingCount },
    { name: 'Roster Management', path: '/admin/roster', icon: Users },
    { name: 'Media Library', path: '/admin/media', icon: Video },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const getBreadcrumb = () => {
    const current = navItems.find(item => item.path === pathname);
    return current ? current.name : 'Overview';
  };

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row font-sans text-white">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-zinc-800 bg-zinc-950 flex-shrink-0 flex flex-col sticky top-0 md:h-screen z-40 shadow-2xl shadow-red-900/10">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-sm bg-black border border-red-600 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white font-black uppercase tracking-tight leading-none text-xl">WSHH</h2>
              <p className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase mt-0.5">Control Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-4 block mb-4">
            System Modules
          </span>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-sm text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-900 text-white border-l-4 border-red-600 shadow-md'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-red-500' : 'text-zinc-500'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Session Footer */}
        <div className="p-4 border-t border-zinc-800 bg-black/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-zinc-400 hover:text-red-500 hover:bg-zinc-900/80 rounded-sm transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
              <span>Terminate Session</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-black min-h-screen">
        {/* Top App Bar */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
              <span>ADMIN</span>
              <span>/</span>
              <span className="text-white font-bold uppercase">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
              <div className="w-8 h-8 rounded-full bg-zinc-900 border border-red-600/40 flex items-center justify-center text-zinc-300 font-bold text-xs overflow-hidden">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Admin Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-red-500" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-white leading-none">System Admin</p>
                <p className="text-[10px] text-red-500 font-mono font-bold uppercase tracking-widest mt-0.5">SUPERUSER</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
