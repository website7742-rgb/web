'use server';

import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase admin configuration missing (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY).');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * ⚡ Server Action: Register User with Instant Email Auto-Confirmation (Zero Friction)
 */
export async function signUpUserAction(fullName: string, email: string, password: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanFullName = fullName.trim();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const supabaseAdmin = getAdminSupabase();

    // Check if user already exists in auth.users
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    
    let existingUser = null;
    if (!listError && listData?.users) {
      existingUser = listData.users.find((u: any) => u.email?.toLowerCase() === normalizedEmail);
    }

    if (existingUser) {
      // If user exists, force auto-confirm email and update password
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
          user_metadata: { full_name: cleanFullName || existingUser.user_metadata?.full_name || 'WorldStar User' },
        }
      );

      if (updateError) {
        return { success: false, error: updateError.message || 'Failed to activate existing account.' };
      }

      // Upsert into public.profiles
      await supabaseAdmin.from('profiles').upsert({
        id: existingUser.id,
        email: normalizedEmail,
        full_name: cleanFullName || 'WorldStar User',
        updated_at: new Date().toISOString(),
      });

      return { success: true, isExistingConfirmed: true, message: 'Existing account verified and updated successfully.' };
    }

    // Create brand-new user with email_confirm: true for zero-friction sign up
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
      user_metadata: { full_name: cleanFullName || 'WorldStar User' },
    });

    if (createError || !newUser?.user) {
      return { success: false, error: createError?.message || 'Failed to create user account.' };
    }

    // Sync to public.profiles
    await supabaseAdmin.from('profiles').upsert({
      id: newUser.user.id,
      email: normalizedEmail,
      full_name: cleanFullName || 'WorldStar User',
      updated_at: new Date().toISOString(),
    });

    return { success: true, isNew: true, message: 'Registration successful! Account activated instantly.' };
  } catch (err: any) {
    console.error('[AuthAction] signUpUserAction Exception:', err);
    return { success: false, error: err.message || 'Registration failed due to a server error.' };
  }
}

/**
 * ⚡ Server Action: Auto-confirm any existing unconfirmed user account by email
 */
export async function autoConfirmUnconfirmedUserAction(email: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const supabaseAdmin = getAdminSupabase();

    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    
    if (listError || !listData?.users) {
      return { success: false, error: 'Failed to access user accounts.' };
    }

    const targetUser = listData.users.find((u: any) => u.email?.toLowerCase() === normalizedEmail);

    if (!targetUser) {
      return { success: false, error: 'Account not found.' };
    }

    const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.id,
      { email_confirm: true }
    );

    if (confirmError) {
      return { success: false, error: confirmError.message };
    }

    return { success: true, message: `Account ${normalizedEmail} auto-confirmed successfully!` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * ⚡ Server Action: Force-confirm ALL registered users in Supabase Auth (Total Removal of Email Verification Gates)
 */
export async function forceConfirmAllUsersAction() {
  try {
    const supabaseAdmin = getAdminSupabase();
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });

    if (listError || !listData?.users) {
      return { success: false, error: listError?.message || 'Failed to list users.' };
    }

    let confirmedCount = 0;
    for (const u of listData.users) {
      if (!u.email_confirmed_at) {
        await supabaseAdmin.auth.admin.updateUserById(u.id, { email_confirm: true });
        confirmedCount++;
      }
    }

    return { success: true, confirmedCount, totalUsers: listData.users.length };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * ⚡ Server Action: Sign Out User and Redirect to Home Route (Zero 404 Errors)
 */
export async function signOutUserAction() {
  try {
    const { cookies } = await import('next/headers');
    const { redirect } = await import('next/navigation');
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: any[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: any) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    });

    await supabase.auth.signOut();
    cookieStore.set('wshh_admin_session', '', { path: '/', maxAge: 0 });
    
    redirect('/');
  } catch (e: any) {
    if (e?.digest?.startsWith('NEXT_REDIRECT')) {
      throw e;
    }
    console.warn('[signOutUserAction] Warning:', e);
    const { redirect } = await import('next/navigation');
    redirect('/');
  }
}
