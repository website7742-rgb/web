import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    });

    await supabase.auth.signOut();
  } catch (e) {
    console.warn('[Logout API] Error during signOut:', e);
  }

  cookieStore.set('wshh_admin_session', '', {
    path: '/',
    httpOnly: false,
    maxAge: 0,
  });
  cookieStore.set('wshh_admin_email', '', {
    path: '/',
    httpOnly: false,
    maxAge: 0,
  });

  return NextResponse.json({ success: true, redirectUrl: '/', message: 'Session terminated successfully' });
}
