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
  } catch (err) {
    console.warn('[SignOut Route] Warning during sign out:', err);
  }

  // Clear admin session cookie if set
  cookieStore.set('wshh_admin_session', '', {
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });

  const originUrl = new URL('/', request.url);
  return NextResponse.redirect(originUrl, { status: 303 });
}

export async function GET(request: Request) {
  return POST(request);
}
