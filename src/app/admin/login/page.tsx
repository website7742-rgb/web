import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { checkIsUserAdminAction } from '@/app/actions/authActions';
import AdminLoginFormClient from '@/components/admin/AdminLoginFormClient';

export const dynamic = 'force-dynamic';

export default async function AdminLoginPage() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
    console.error('[AdminLoginPage] Session check exception:', e);
  }

  // Server-side session checks
  if (user) {
    if (isAdmin) {
      redirect('/admin');
    } else {
      redirect('/profile');
    }
  }

  return <AdminLoginFormClient />;
}
