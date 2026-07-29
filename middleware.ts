import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  // Update Supabase session (handles JWT and Auth)
  const response = await updateSession(request);

  // Security Headers (CSP, HSTS, XSS)
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Basic CSRF Protection for state-changing API routes
  if (request.method !== 'GET' && request.nextUrl.pathname.startsWith('/api/admin')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    if (!origin || !origin.includes(host || '')) {
      return new NextResponse('CSRF Error: Invalid Origin', { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
