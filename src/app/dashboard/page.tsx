import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LogOut, User, ShieldCheck, Mail, Calendar, Activity } from 'lucide-react';
import AuthHeader from '@/components/auth/AuthHeader';

export const metadata = {
  title: 'Dashboard - WORLDSTAR',
};

export default async function DashboardPage() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Handled in middleware
      },
    },
  });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // Extract metadata safely
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'Authorized User';
  const avatarUrl = user.user_metadata?.avatar_url || null;
  const createdDate = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-zinc-950 font-sans selection:bg-white selection:text-black">
      
      {/* Top Navigation */}
      <nav className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-white" />
            <span className="font-bold tracking-widest uppercase text-lg">WORLDSTAR <span className="text-zinc-600">HQ</span></span>
          </div>
          <form action="/auth/signout" method="post">
            <button type="submit" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
            Secure Profile
          </h1>
          <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            Identity Verified • Authorized Access Granted
          </p>
        </div>

        {/* Profile Card */}
        <div className="border border-zinc-800/50 bg-black/40 backdrop-blur-md p-10 shadow-2xl relative overflow-hidden group">
          
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <ShieldCheck className="w-48 h-48" />
          </div>

          <div className="flex flex-col md:flex-row gap-10 relative z-10 items-start">
            
            {/* Avatar Section */}
            <div className="shrink-0 relative">
              <div className="w-32 h-32 bg-zinc-900 border-2 border-white/10 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                ) : (
                  <User className="w-12 h-12 text-zinc-600" />
                )}
              </div>
              <div className="absolute -bottom-3 -right-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1">
                VERIFIED
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 space-y-8 w-full">
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 block">
                  Identity Name
                </label>
                <div className="text-2xl font-bold text-white tracking-wide">
                  {fullName}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
                    <Mail className="w-3 h-3" />
                    Registered Email
                  </label>
                  <div className="text-sm font-mono text-zinc-300">
                    {user.email}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Clearance Granted
                  </label>
                  <div className="text-sm font-mono text-zinc-300">
                    {createdDate}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2">
                    <Activity className="w-3 h-3" />
                    System ID
                  </label>
                  <div className="text-xs font-mono text-zinc-700 truncate w-full">
                    {user.id}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </main>

    </div>
  );
}
