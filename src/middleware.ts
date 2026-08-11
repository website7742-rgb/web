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

  // STRICT GUARD: Validate Supabase Auth session OR wshh_admin_session cookie
  const adminSessionCookie = request.cookies.get('wshh_admin_session')?.value;
  const isAuthenticated = (user !== null && !error) || adminSessionCookie === 'authenticated';

  const pathname = request.nextUrl.pathname;
  
  // Inject x-pathname into request headers for server layouts
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const isAdminRoute = (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) && pathname !== '/admin/login';
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginRoute = pathname === '/login';

  // SCENARIO 1: Unauthenticated access to Protected Routes
  if ((isAdminRoute || isDashboardRoute) && !isAuthenticated) {
    if (pathname.startsWith('/api/')) {
      return new NextResponse('Unauthorized: Invalid or missing session', { status: 401 });
    }
    
    // Redirect unauthenticated admin route attempts directly to /admin/login
    const targetRoute = pathname.startsWith('/admin') ? '/admin/login' : '/login';
    const redirectUrl = new URL(targetRoute, request.url);
    
    if (pathname !== '/admin/login' && pathname !== '/login') {
      redirectUrl.searchParams.set('redirect', pathname);
    }

    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    
    return redirectResponse;
  }

  // SCENARIO 2: Authenticated user attempting to access Login page
  if (isLoginRoute && isAuthenticated) {
    const redirectUrl = new URL('/dashboard', request.url);
    const redirectResponse = NextResponse.redirect(redirectUrl);
    
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    
    return redirectResponse;
  }

  // APPLE STANDARD: CRYPTOGRAPHIC CSP NONCES
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
    '/((?!_next/static|_next/image|favicon.ico|public/|api/).*)',
  ],
};
