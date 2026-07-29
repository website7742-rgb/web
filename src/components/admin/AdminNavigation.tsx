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
  Search,
  Bell,
  ChevronDown,
  User
} from 'lucide-react';
import { useUI } from '@/providers/UIContext';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminNavigation({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { showToast } = useUI();
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
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
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-zinc-900 text-white border-l-4 border-red-600 shadow-md'
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white border-l-4 border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-red-600' : ''}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold text-zinc-400 hover:text-red-500 hover:bg-red-950/20 rounded-sm transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden bg-black">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <span>Admin</span>
              <span className="text-zinc-600">/</span>
              <span className="text-white">{getBreadcrumb()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search database..." 
                className="bg-black border border-zinc-800 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all w-64 placeholder:text-zinc-600"
              />
            </div>
            
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-zinc-950"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-zinc-800 pl-6 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700 group-hover:border-red-600 transition-colors">
                {avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={avatarUrl} alt="Admin" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-zinc-400" />
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-bold text-white leading-none">System Admin</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">Superuser</p>
              </div>
              <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors hidden md:block" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
