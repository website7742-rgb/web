import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET(request: Request) {
  try {
    const supabaseAdmin = getAdminSupabase();

    // Fetch up to 1000 registered auth users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

    if (authError || !authData?.users) {
      return NextResponse.json(
        { success: false, error: authError?.message || 'Failed to list auth users' },
        { status: 500 }
      );
    }

    const users = authData.users;
    const totalUserCount = users.length;

    // Search for target email armyking1428@gmail.com
    const targetEmail = 'armyking1428@gmail.com';
    const targetUser = users.find((u) => u.email?.toLowerCase() === targetEmail.toLowerCase());

    const targetEmailAudit = targetUser
      ? {
          email: targetUser.email,
          exists: true,
          id: targetUser.id,
          email_confirmed: Boolean(targetUser.email_confirmed_at),
          confirmed_at: targetUser.email_confirmed_at || null,
          created_at: targetUser.created_at,
          last_sign_in_at: targetUser.last_sign_in_at || null,
        }
      : {
          email: targetEmail,
          exists: false,
          status: 'ACCOUNT_NOT_FOUND',
        };

    // Sort recent users by creation date
    const recentUsers = users
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map((u) => ({
        id: u.id,
        email: u.email,
        email_confirmed: Boolean(u.email_confirmed_at),
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at || null,
      }));

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      totalUserCount,
      targetEmailAudit,
      recentUsers,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Diagnostic error' },
      { status: 500 }
    );
  }
}
