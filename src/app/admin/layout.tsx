import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import AdminNavigation from '@/components/admin/AdminNavigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  let user = null;
  let error = null;

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
        },
      }
    );

    const authRes = await supabase.auth.getUser();
    user = authRes.data.user;
    error = authRes.error;
  } catch (e) {
    // Fail-safe catch for unconfigured Supabase credentials
  }

  const adminCookie = cookieStore.get('wshh_admin_session')?.value;
  const isAuthenticated = (user !== null && !error) || adminCookie === 'authenticated';

  // If unauthenticated, redirect to login IMMEDIATELY.
  if (!isAuthenticated) {
    redirect('/login');
  }

  return (
    <AdminNavigation>
      {children}
    </AdminNavigation>
  );
}
