import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies, headers } from 'next/headers';
import AdminNavigation from '@/components/admin/AdminNavigation';

export const dynamic = 'force-dynamic';

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
  'admin@worldstarhiphop.world',
];

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = headers();
  const pathname = headerList.get('x-pathname') || '';

  // Bypass AdminNavigation shell for /studio (the Login page)
  if (pathname === '/studio') {
    return <>{children}</>;
  }

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

    if (!user) {
      const adminSessionCookie = cookieStore.get('wshh_admin_session')?.value;
      const adminEmailCookie = cookieStore.get('wshh_admin_email')?.value;
      if (adminSessionCookie === 'authenticated') {
        const email = adminEmailCookie || 'admin@wshh.com';
        if (KNOWN_ADMIN_EMAILS.includes(email.toLowerCase())) {
          user = { id: 'admin-session-user', email } as any;
          isAdmin = true;
        }
      }
    }
  } catch (e) {
    console.error('[StudioLayout] Auth exception:', e);
  }

  // Redirect handling: Unauthenticated or non-admin -> /studio
  if (!user || !isAdmin) {
    redirect('/studio');
  }

  return (
    <AdminNavigation>
      {children}
    </AdminNavigation>
  );
}
