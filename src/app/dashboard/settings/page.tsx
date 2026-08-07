import React from 'react';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ProfileSettingsForm from '@/components/dashboard/ProfileSettingsForm';
import { Settings } from 'lucide-react';

export default async function DashboardSettingsPage() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: { getAll() { return cookieStore.getAll(); }, setAll() {} }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch from Profiles table for standard info
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();

  // Combine Profile data with user_metadata (for the extended bio/socials)
  const initialData = {
    fullName: profile?.full_name || user.user_metadata?.full_name || '',
    bio: user.user_metadata?.bio || '',
    instagramUrl: user.user_metadata?.instagram_url || '',
    twitterUrl: user.user_metadata?.twitter_url || ''
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2">
          PROFILE SETTINGS
        </h1>
        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
          Manage your public identity
        </p>
      </div>

      <section className="border border-neutral-800 bg-neutral-950 p-6 shadow-xl max-w-2xl">
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-neutral-900">
          <Settings className="w-5 h-5 text-red-600" />
          <h2 className="text-xl font-black uppercase text-white tracking-widest">PUBLIC DETAILS</h2>
        </div>

        <ProfileSettingsForm initialData={initialData} />
      </section>
    </div>
  );
}
