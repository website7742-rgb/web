import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  cookieStore.set('wshh_admin_session', '', {
    path: '/',
    httpOnly: true,
    maxAge: 0,
  });

  return NextResponse.json({ success: true, message: 'Admin session terminated' });
}
