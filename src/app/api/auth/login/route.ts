import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import rateLimit from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    try {
      await limiter.check(5, ip); // 5 requests per minute
    } catch {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Brute force protection delay
    await new Promise(res => setTimeout(res, 1000));

    const { email, passcode } = await request.json();

    if (!email || !passcode) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    // Authenticate with true Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: passcode,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { success: false, error: 'Invalid executive credentials' },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, user: data.user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication request failed' },
      { status: 500 }
    );
  }
}
