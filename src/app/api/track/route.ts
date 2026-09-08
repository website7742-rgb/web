import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawCountry = typeof body.countryCode === 'string' ? body.countryCode.trim() : 'US';
    const rawCity = typeof body.city === 'string' ? body.city.trim() : 'Los Angeles';
    const rawPath = typeof body.path === 'string' ? body.path.trim() : '/';

    const countryCode = rawCountry.slice(0, 8);
    const city = rawCity.slice(0, 100);
    const path = rawPath.slice(0, 255);

    // Log to Supabase analytics_events table (graceful failover if unconfigured)
    await supabase.from('analytics_events').insert({
      country_code: countryCode,
      city: city,
      path: path,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: true, warning: err.message });
  }
}
