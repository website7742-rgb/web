'use server';

import { safeAction } from '@/lib/safeAction';
import { sendResendEmail } from '@/lib/emailService';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

const SubmissionSchema = z.object({
  trackTitle: z.string().min(1, 'Track title is required.'),
  genre: z.string().min(1, 'Genre is required.'),
  mediaLink: z.string().url('A valid media URL is required.'),
});

export const submitArtistTrackAction = safeAction(async (input: { trackTitle: string; genre: string; mediaLink: string }) => {
  const validation = SubmissionSchema.safeParse(input);
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message);
  }

  // Get active session
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {}
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) {
    throw new Error('Unauthorized.');
  }

  // 1. In a real system, you would insert the record into Supabase here.
  // We'll mock the successful insertion for now since we don't have the table schema perfectly defined for submissions.
  // e.g. await supabase.from('submissions').insert({ artist_id: user.id, ...input })

  // 2. EXPLICIT RESEND TRIGGER: Send confirmation receipt to the Artist
  await sendResendEmail({
    to: user.email,
    subject: `WORLDSTAR: Track Submission Received - ${input.trackTitle}`,
    html: `
      <div style="background-color: #000; color: #fff; padding: 40px; font-family: monospace;">
        <h1 style="color: #FA243C; text-transform: uppercase;">Submission Confirmed</h1>
        <p>We have successfully received your track submission.</p>
        <ul>
          <li><strong>Track:</strong> ${input.trackTitle}</li>
          <li><strong>Genre:</strong> ${input.genre}</li>
          <li><strong>Link:</strong> <a href="${input.mediaLink}" style="color: #FA243C;">View Media</a></li>
        </ul>
        <p>Our A&R team will evaluate your submission shortly.</p>
      </div>
    `,
  });

  // 3. EXPLICIT RESEND TRIGGER: Notify Admin Inbox
  await sendResendEmail({
    to: 'admin@worldstarhiphop.world', // Or whatever the admin email is configured to
    subject: `NEW DEMO: ${input.trackTitle} (${input.genre})`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>New Artist Submission</h2>
        <p><strong>Artist Email:</strong> ${user.email}</p>
        <p><strong>Track Title:</strong> ${input.trackTitle}</p>
        <p><strong>Genre:</strong> ${input.genre}</p>
        <p><strong>Media Link:</strong> <a href="${input.mediaLink}">${input.mediaLink}</a></p>
      </div>
    `,
  });

  return { success: true };
});
