import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import SiteSettingsClient from '@/components/admin/SiteSettingsClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Site Settings | Admin Dashboard',
  description: 'Manage global CMS content like Hero Videos and text.',
};

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  return createServerClient(supabaseUrl, serviceRoleKey, {
    cookies: {
      getAll() { return cookies().getAll(); },
      setAll() {}
    }
  });
}

export default async function AdminSiteSettingsPage() {
  const supabase = getAdminSupabase();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  return <SiteSettingsClient />;
}
