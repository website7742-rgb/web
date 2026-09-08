import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { checkIsUserAdminAction, setAdminSessionCookieAction } from '@/app/actions/authActions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const supabase = createClient();

    // 1. Authenticate against Supabase Auth
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: String(password),
    });

    if (signInError || !authData?.user) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // 2. Strict Admin Role Verification
    const isAdmin = await checkIsUserAdminAction(authData.user.id, authData.user.email);
    if (!isAdmin) {
      // Sign out non-admin user
      await supabase.auth.signOut();
      return NextResponse.json(
        { success: false, error: 'Access Denied: Administrator privileges required' },
        { status: 403 }
      );
    }

    // 3. Set verified Admin Session Cookie
    await setAdminSessionCookieAction(authData.user.email);

    return NextResponse.json({ success: true, message: 'Authentication successful' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Authentication error' },
      { status: 500 }
    );
  }
}
