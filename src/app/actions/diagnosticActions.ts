'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sendResendEmail } from '@/lib/emailService';

export async function runSystemDiagnostic() {
  const results = {
    database: { status: 'PENDING', message: '' },
    storage: { status: 'PENDING', message: '' },
    email: { status: 'PENDING', message: '' },
  };

  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {}
    }
  });

  // TEST 1: DATABASE
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    if (error) throw error;
    results.database = { status: 'SUCCESS', message: 'CONNECTED' };
  } catch (err: any) {
    results.database = { status: 'FAILED', message: err.message || 'Unknown database error' };
  }

  // TEST 2: STORAGE
  try {
    const blob = new Blob(['diagnostic-test'], { type: 'text/plain' });
    const fileName = `diagnostic/test_${Date.now()}.txt`;
    
    const { data, error } = await supabase.storage
      .from('tracks')
      .upload(fileName, blob, { upsert: true });
      
    if (error) throw error;
    
    // Clean up the dummy file
    await supabase.storage.from('tracks').remove([fileName]);
    results.storage = { status: 'SUCCESS', message: 'BUCKET ACTIVE & WRITABLE' };
  } catch (err: any) {
    results.storage = { status: 'FAILED', message: err.message || 'Unknown storage error' };
  }

  // TEST 3: EMAIL
  try {
    const emailRes = await sendResendEmail({
      to: 'onboarding@resend.dev',
      subject: 'SYSTEM DIAGNOSTIC: SUCCESS',
      html: '<p>If you receive this, the email pipeline is fully operational.</p>'
    });
    
    if (!emailRes.success) throw new Error(emailRes.error || 'Failed to send email');
    results.email = { status: 'SUCCESS', message: 'RESEND API OPERATIONAL' };
  } catch (err: any) {
    results.email = { status: 'FAILED', message: err.message || 'Unknown email error' };
  }

  return results;
}
