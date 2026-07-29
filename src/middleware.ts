import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return new NextResponse('Internal Server Error: Missing Supabase Env', { status: 500 });
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // STRICT GUARD: We must use getUser() to validate against the Supabase server, NOT just getSession() which checks local unverified JWTs.
  const { data: { user }, error } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isLoginRoute = pathname === '/login';

  // SCENARIO 1: Unauthenticated access to Protected Routes
  if (isAdminRoute && (!user || error)) {
    if (pathname.startsWith('/api/admin')) {
      return new NextResponse('Unauthorized: Invalid or missing session', { status: 401 });
    }
    
    const redirectUrl = new URL('/login', request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    // VITAL FIX: Preserve cookies (like cleared session) from the Supabase client across the redirect boundary
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    
    return redirectResponse;
  }

  // SCENARIO 2: Authenticated user attempting to access Login page
  if (isLoginRoute && user && !error) {
    const redirectUrl = new URL('/admin', request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    // VITAL FIX: Preserve cookies (like refreshed session JWTs) across the redirect boundary
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    
    return redirectResponse;
  }

  // APPLE STANDARD: CRYPTOGRAPHIC CSP NONCES
  const nonce = btoa(crypto.randomUUID());
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  // Inject Enterprise-Grade Security Headers
  supabaseResponse.headers.set('Content-Security-Policy', cspHeader);
  supabaseResponse.headers.set('x-nonce', nonce); // Pass nonce to layout.tsx
  supabaseResponse.headers.set('X-DNS-Prefetch-Control', 'on');
  supabaseResponse.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block');
  supabaseResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Anti-CSRF protection for state-changing admin APIs
  if (request.method !== 'GET' && pathname.startsWith('/api/admin')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (!origin || !origin.includes(host || '')) {
      return new NextResponse('CSRF Error: Invalid Origin', { status: 403 });
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
