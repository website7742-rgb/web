import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/admin';

  if (code) {
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krnsfelxtkpsiueuovwp.supabase.co';
    let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ok2RbNf7CZn-raMzL0Qtuw_U7qRB5M0';

    // Safeguard against invalid or missing env configurations during SSR
    if (!supabaseUrl.startsWith('http')) {
      supabaseUrl = 'https://krnsfelxtkpsiueuovwp.supabase.co';
    }
    if (!supabaseAnonKey || supabaseAnonKey.length < 10) {
      supabaseAnonKey = 'sb_publishable_ok2RbNf7CZn-raMzL0Qtuw_U7qRB5M0';
    }

    let supabaseResponse = NextResponse.redirect(new URL(next, request.url));

    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.redirect(new URL(next, request.url));
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      });

      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error) {
        return supabaseResponse;
      }
    } catch (err) {
      console.error('SSR Auth Callback Error:', err);
    }
  }

  // Redirect back to login if there is an error
  const redirectUrl = new URL('/login', request.url);
  redirectUrl.searchParams.set('error', 'Authentication failed due to a server configuration issue');
  return NextResponse.redirect(redirectUrl);
}
