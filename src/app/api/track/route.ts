import { NextResponse, type NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { countryCode = 'US', city = 'Los Angeles', path = '/' } = body;

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
