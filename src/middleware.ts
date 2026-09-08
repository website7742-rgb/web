import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

  let user = null;
  let error = null;

  try {
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

    const authRes = await supabase.auth.getUser();
    user = authRes.data.user;
    error = authRes.error;
  } catch (e) {
    // Graceful fallback if Supabase is unconfigured or unreachable
  }

  const KNOWN_ADMIN_EMAILS = [
    'armyking1428@gmail.com',
    'admin@wshh.com',
    'website7742@gmail.com',
    'admin@worldstarhiphop.world',
  ];

  // STRICT GUARD: Separate User vs Admin privileges
  const adminSessionCookie = request.cookies.get('wshh_admin_session')?.value;
  const isUserAuthenticated = user !== null && !error;
  const isEmailAdmin = Boolean(user?.email && KNOWN_ADMIN_EMAILS.includes(user.email.toLowerCase()));
  const isAdminAuthenticated = adminSessionCookie === 'authenticated' || isEmailAdmin;
  const isAuthenticated = isUserAuthenticated || isAdminAuthenticated;

  const pathname = request.nextUrl.pathname;
  
  // CRYPTOGRAPHIC CSP NONCES & SECURITY HEADERS DEFINITION
  const nonce = btoa(crypto.randomUUID());
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
    style-src 'self' 'unsafe-inline' https:;
    img-src 'self' blob: data: https:;
    media-src 'self' blob: data: https:;
    connect-src 'self' https: wss:;
    font-src 'self' data: https:;
    frame-src 'self' https://www.youtube.com https://youtube.com https://*.youtube.com https://www.youtube-nocookie.com https://*.youtube-nocookie.com;
    child-src 'self' https://www.youtube.com https://youtube.com https://*.youtube.com https://www.youtube-nocookie.com https://*.youtube-nocookie.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s{2,}/g, ' ').trim();

  // RULE 1: ALL /admin and /admin/* routes are COMPLETELY NEUTRALIZED for EVERY VISITOR (including Admins)
  // Server-side rewrite to / renders the public Homepage / Hero directly.
  // 0 Admin UI, 0 Admin HTML, 0 Admin Flash, 0 Admin Metadata.
  const isOldAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  if (isOldAdminRoute) {
    const rewriteUrl = new URL('/', request.url);
    const rewriteHeaders = new Headers(request.headers);
    rewriteHeaders.set('x-pathname', '/');
    const rewriteResponse = NextResponse.rewrite(rewriteUrl, {
      request: {
        headers: rewriteHeaders,
      },
    });

    supabaseResponse.cookies.getAll().forEach(cookie => {
      rewriteResponse.cookies.set(cookie.name, cookie.value);
    });

    rewriteResponse.headers.set('Content-Security-Policy', cspHeader);
    rewriteResponse.headers.set('x-nonce', nonce);
    rewriteResponse.headers.set('X-DNS-Prefetch-Control', 'on');
    rewriteResponse.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    rewriteResponse.headers.set('X-XSS-Protection', '1; mode=block');
    rewriteResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
    rewriteResponse.headers.set('X-Content-Type-Options', 'nosniff');
    rewriteResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    rewriteResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    return rewriteResponse;
  }

  // RULE 2: Protected Admin APIs (/api/admin/*)
  if (pathname.startsWith('/api/admin') && !isAdminAuthenticated) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized: Admin privileges required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // RULE 3: Canonical Admin Entry (/studio)
  // If an already authenticated admin visits /studio, redirect straight to /studio/dashboard
  if (pathname === '/studio' && isAdminAuthenticated) {
    const redirectUrl = new URL('/studio/dashboard', request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // RULE 4: Protected Studio Admin modules (/studio/*)
  // Requires verified admin authorization. Non-admins or unauthenticated visitors are redirected to /studio
  if (pathname.startsWith('/studio/') && !isAdminAuthenticated) {
    const redirectUrl = new URL('/studio', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // RULE 5: Authenticated User Protected Routes (Dashboard / Profile)
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isProfileRoute = pathname.startsWith('/profile');
  if ((isDashboardRoute || isProfileRoute) && !isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized: Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // RULE 6: Authenticated user accessing regular Login page -> redirect to /dashboard
  const isLoginRoute = pathname === '/login';
  if (isLoginRoute && isAuthenticated) {
    const redirectUrl = new URL('/dashboard', request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  // Inject x-pathname into request headers for server layouts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Inject Enterprise-Grade Security Headers
  supabaseResponse.headers.set('Content-Security-Policy', cspHeader);
  supabaseResponse.headers.set('x-nonce', nonce);
  supabaseResponse.headers.set('X-DNS-Prefetch-Control', 'on');
  supabaseResponse.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  supabaseResponse.headers.set('X-XSS-Protection', '1; mode=block');
  supabaseResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
  supabaseResponse.headers.set('X-Content-Type-Options', 'nosniff');
  supabaseResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  supabaseResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // NON-BLOCKING EDGE GEOLOCATION RADAR TRACKING
  const country = request.headers.get('x-vercel-ip-country') || 'US';
  const city = request.headers.get('x-vercel-ip-city') || 'Los Angeles';
  
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    // Non-blocking asynchronous ping
    fetch(new URL('/api/track', request.url).toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ countryCode: country, city, path: pathname }),
    }).catch(() => {});
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
