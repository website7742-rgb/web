import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import AdminNavigation from '@/components/admin/AdminNavigation';

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const KNOWN_ADMIN_EMAILS = [
  'armyking1428@gmail.com',
  'admin@wshh.com',
  'website7742@gmail.com',
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  let user = null;
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

    if (user && user.email) {
      const userEmail = user.email.toLowerCase();

      // Fast-path: Check known admin email list
      if (KNOWN_ADMIN_EMAILS.includes(userEmail)) {
        isAdmin = true;
      }

      // Check DB via Admin Service Role Client (bypasses RLS restrictions)
      const adminDb = getAdminSupabase();

      if (!isAdmin) {
        const { data: adminRow } = await adminDb
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (adminRow) {
          isAdmin = true;
        } else {
          const { data: profileRow } = await adminDb
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .maybeSingle();

          if (profileRow?.role?.toLowerCase() === 'admin' || profileRow?.role?.toLowerCase() === 'superuser') {
            isAdmin = true;
          }
        }
      }

      // Auto-Promote & Database Sync for Admin Users
      if (isAdmin) {
        try {
          await adminDb.from('admins').upsert({ id: user.id }, { onConflict: 'id' });
          await adminDb.from('profiles').update({ role: 'admin', updated_at: new Date().toISOString() }).eq('id', user.id);
        } catch (syncErr) {
          // Non-blocking sync
        }
      }
    }
  } catch (e) {
    console.error('[AdminLayout] Auth exception:', e);
  }

  // Redirect handling: Unauthenticated -> /login, Non-Admin -> /
  if (!user) {
    redirect('/login?redirect=/admin');
  }

  if (!isAdmin) {
    redirect('/');
  }

  return (
    <AdminNavigation>
      {children}
    </AdminNavigation>
  );
}
