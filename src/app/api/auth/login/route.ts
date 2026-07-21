import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
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
