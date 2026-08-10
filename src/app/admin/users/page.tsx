import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { UserDirectoryClient, UserProfileRow } from '@/components/admin/UserDirectoryClient';

export const metadata = {
  title: 'User Directory | Admin Dashboard',
  description: 'Manage registered user accounts, security roles, and profile metadata.',
};

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export default async function AdminUsersPage() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
    },
  });

  // 1. SERVER-SIDE AUTH & ADMIN VERIFICATION
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  let isAdmin = false;

  // Check admins table or profile role
  try {
    const { data: adminRow } = await supabase
      .from('admins')
      .select('id')
      .eq('id', user.id)
      .single();

    if (adminRow) {
      isAdmin = true;
    } else {
      const { data: profileRow } = await supabase
        .from('profiles')
        .select('role, email')
        .eq('id', user.id)
        .single();

      if (
        profileRow?.role?.toLowerCase() === 'admin' ||
        profileRow?.role?.toLowerCase() === 'superuser' ||
        profileRow?.email === 'armyking1428@gmail.com' ||
        user.email === 'armyking1428@gmail.com'
      ) {
        isAdmin = true;
      }
    }
  } catch (err) {
    // Fail-safe check by email
    if (user.email === 'armyking1428@gmail.com') {
      isAdmin = true;
    }
  }

  if (!isAdmin) {
    redirect('/');
  }

  // 2. FETCH ALL REGISTERED USERS FROM PROFILES TABLE (SUPABASE ADMIN SDK)
  const adminDb = getAdminSupabase();
  const { data: profiles, error } = await adminDb
    .from('profiles')
    .select('id, full_name, email, avatar_url, country, genre, role, bio, updated_at, created_at')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[AdminUsersPage] DB fetch error:', error.message);
  }

  // Fallback / merge with auth.users if profiles table is empty or missing rows
  let mappedUsers: UserProfileRow[] = (profiles || []) as UserProfileRow[];

  try {
    const { data: authUsersRes } = await adminDb.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (authUsersRes?.users && authUsersRes.users.length > 0) {
      const existingUserIds = new Set(mappedUsers.map((u) => u.id));
      
      authUsersRes.users.forEach((authUser) => {
        if (!existingUserIds.has(authUser.id)) {
          mappedUsers.push({
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || null,
            avatar_url: authUser.user_metadata?.avatar_url || null,
            country: authUser.user_metadata?.country || null,
            genre: authUser.user_metadata?.genre || null,
            role: (authUser.email === 'armyking1428@gmail.com' ? 'admin' : 'user'),
            bio: null,
            created_at: authUser.created_at || null,
            updated_at: authUser.updated_at || authUser.created_at || null,
          });
        }
      });
    }
  } catch (authErr) {
    console.warn('[AdminUsersPage] Auth listUsers fallback warning:', authErr);
  }

  return <UserDirectoryClient initialUsers={mappedUsers} />;
}
