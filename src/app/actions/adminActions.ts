'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { sendResendEmail } from '@/lib/emailService';
import { revalidatePath } from 'next/cache';

async function verifyAdminAndGetSupabase() {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() { return cookieStore.getAll(); },
      setAll() {}
    }
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  // Verify Admin privileges
  const { data: adminData } = await supabase.from('admins').select('id').eq('id', user.id).single();
  if (!adminData) throw new Error('Forbidden: Admin access required.');

  return supabase;
}

export async function approveTrackAction(submissionId: string) {
  try {
    const supabase = await verifyAdminAndGetSupabase();

    // 1. Update Database Status
    const { data, error } = await supabase
      .from('submissions')
      .update({ status: 'APPROVED' })
      .eq('id', submissionId)
      .select('*, profiles(email, full_name)')
      .single();

    if (error || !data) {
      return { success: false, error: 'Failed to approve submission: ' + (error?.message || 'Unknown') };
    }

    // 2. Trigger Decision Email
    if (data.profiles && Array.isArray(data.profiles) ? data.profiles[0]?.email : (data.profiles as any)?.email) {
      const email = Array.isArray(data.profiles) ? data.profiles[0].email : (data.profiles as any).email;
      await sendResendEmail({
        to: email,
        subject: `WORLDSTAR: Track Approved - ${data.track_title}`,
        html: `
          <div style="background-color: #000; color: #fff; padding: 40px; font-family: monospace;">
            <h1 style="color: #10B981; text-transform: uppercase;">TRACK APPROVED</h1>
            <p>Congratulations, your track <strong>${data.track_title}</strong> has been APPROVED by the WORLDSTAR A&R team.</p>
            <p>We will be in touch with next steps regarding deployment and marketing on the main network.</p>
          </div>
        `
      });
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('approveTrackAction error:', err);
    return { success: false, error: err.message };
  }
}

export async function rejectTrackAction(submissionId: string) {
  try {
    const supabase = await verifyAdminAndGetSupabase();

    // 1. Update Database Status
    const { data, error } = await supabase
      .from('submissions')
      .update({ status: 'REJECTED' })
      .eq('id', submissionId)
      .select('*, profiles(email, full_name)')
      .single();

    if (error || !data) {
      return { success: false, error: 'Failed to reject submission: ' + (error?.message || 'Unknown') };
    }

    // 2. Trigger Decision Email
    if (data.profiles && Array.isArray(data.profiles) ? data.profiles[0]?.email : (data.profiles as any)?.email) {
      const email = Array.isArray(data.profiles) ? data.profiles[0].email : (data.profiles as any).email;
      await sendResendEmail({
        to: email,
        subject: `WORLDSTAR: Track Update - ${data.track_title}`,
        html: `
          <div style="font-family: sans-serif; padding: 40px;">
            <h2>Submission Update</h2>
            <p>Update on your submission: <strong>${data.track_title}</strong> was not selected at this time.</p>
            <p>Keep working and submit again later. Our A&R team is always listening.</p>
          </div>
        `
      });
    }

    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    console.error('rejectTrackAction error:', err);
    return { success: false, error: err.message };
  }
}
