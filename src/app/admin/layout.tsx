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
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Critical Error: Missing Supabase Environment Variables");
  }

  // Construct standard read-only client for Server Components
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

  // ZERO-TRUST ARCHITECTURE: Do NOT rely on getSession() or assume middleware blocked access.
  // We explicitly ping the Supabase Auth Server using getUser() to validate the JWT.
  const { data: { user }, error } = await supabase.auth.getUser();

  // If the JWT is forged, expired, missing, or throws any error, redirect to login IMMEDIATELY.
  if (error || !user) {
    redirect('/login');
  }

  return (
    <AdminNavigation>
      {children}
    </AdminNavigation>
  );
}
