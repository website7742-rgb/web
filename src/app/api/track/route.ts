import { NextResponse, type NextRequest } from 'next/server';
import rateLimit from '@/lib/rate-limit';

const trackLimiter = rateLimit({
  interval: 60000,
  uniqueTokenPerInterval: 1000,
});
import { createClient } from '@supabase/supabase-js';

function getTrackingSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    try {
      await trackLimiter.check(60, ip);
    } catch {
      return NextResponse.json({ success: true, rateLimited: true });
    }
    const body = await request.json().catch(() => ({}));
    const rawCountry = typeof body.countryCode === 'string' ? body.countryCode.trim() : 'US';
    const rawCity = typeof body.city === 'string' ? body.city.trim() : 'Los Angeles';
    const rawPath = typeof body.path === 'string' ? body.path.trim() : '/';

    const countryCode = rawCountry.slice(0, 8);
    const city = rawCity.slice(0, 100);
    const path = rawPath.slice(0, 255);

    const supabase = getTrackingSupabase();
    if (supabase) {
      await supabase.from('analytics_events').insert({
        country_code: countryCode,
        city: city,
        path: path,
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true, warning: 'Tracking event recorded with fallback' });
  }
}
