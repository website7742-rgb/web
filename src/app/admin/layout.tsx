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

  let isAdmin = false;

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

    if (user) {
      // STRICT ADMIN VERIFICATION
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single();
        
      if (adminData) {
        isAdmin = true;
      }
    }
  } catch (e) {
    // Fail-safe catch for unconfigured Supabase credentials
  }

  // If unauthenticated or not an admin, redirect to login IMMEDIATELY.
  if (!isAdmin) {
    redirect('/dashboard');
  }

  return (
    <AdminNavigation>
      {children}
    </AdminNavigation>
  );
}
