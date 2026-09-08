import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkIsUserAdminAction } from '@/app/actions/authActions';
import AdminLoginFormClient from '@/components/admin/AdminLoginFormClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'WorldStar Studio Control | Secure Access',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function StudioLoginPage() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // 1. Check verified admin session cookie first
  const adminSessionCookie = cookieStore.get('wshh_admin_session')?.value;
  if (adminSessionCookie === 'authenticated') {
    redirect('/studio/dashboard');
  }

  let user = null;
  let isAdmin = false;

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      isAdmin = await checkIsUserAdminAction(user.id, user.email);
    }
  } catch (e) {
    console.error('[StudioLoginPage] Session check exception:', e);
  }

  // 2. If already signed in as verified admin, redirect directly to Studio Dashboard
  if (user && isAdmin) {
    redirect('/studio/dashboard');
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 space-y-4 font-mono">
          <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
          <p className="text-xs uppercase tracking-widest text-zinc-400">Loading Studio Control...</p>
        </div>
      }
    >
      <AdminLoginFormClient />
    </Suspense>
  );
}
