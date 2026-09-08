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

  // TEST 2: STORAGE (CLOUDFLARE R2)
  try {
    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'worldstarhiphop';

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('Cloudflare R2 credentials missing in environment.');
    }

    const { S3Client, HeadBucketCommand } = await import('@aws-sdk/client-s3');
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });

    await client.send(new HeadBucketCommand({ Bucket: bucketName }));
    results.storage = { status: 'SUCCESS', message: 'CLOUDFLARE R2 ACTIVE & CONNECTED' };
  } catch (err: any) {
    results.storage = { status: 'FAILED', message: err.message || 'Unknown R2 storage error' };
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
