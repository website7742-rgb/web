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

export const submitArtistTrackAction = safeAction(async (formData: FormData) => {
  const trackTitle = formData.get('trackTitle') as string;
  const genre = formData.get('genre') as string;
  const audioFile = formData.get('audioFile') as File | null;

  if (!trackTitle || !genre || !audioFile) {
    throw new Error('Missing required fields or audio file.');
  }

  if (!audioFile.type.startsWith('audio/')) {
    throw new Error('Invalid file type. Only audio files are allowed.');
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

  // 1. UPLOAD FILE TO SUPABASE STORAGE 'tracks' BUCKET
  const fileExt = audioFile.name.split('.').pop();
  const fileName = `${user.id}/${Date.now()}_${trackTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('tracks')
    .upload(fileName, audioFile, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    throw new Error(`Failed to upload audio: ${uploadError.message}`);
  }

  // Get Public URL
  const { data: { publicUrl } } = supabase.storage.from('tracks').getPublicUrl(fileName);

  // 2. INSERT INTO DATABASE
  const { error: insertError } = await supabase.from('submissions').insert({
    artist_id: user.id,
    track_title: trackTitle,
    genre,
    media_url: publicUrl,
    status: 'PENDING'
  });

  if (insertError) {
    console.error('Submission DB Insert Error:', insertError);
    // Even if db insert fails, we'll continue to send the email so they aren't fully lost,
    // but ideally we'd throw here. For this demo, we'll throw to be strict.
    throw new Error('Database error during submission.');
  }
  // 3. EXPLICIT RESEND TRIGGER: Send confirmation receipt to the Artist
  await sendResendEmail({
    to: user.email,
    subject: `Submission Received: ${trackTitle}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111827; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="font-size: 18px; font-weight: 700; margin-top: 0; color: #111827;">Submission Confirmed</h2>
        <p style="font-size: 15px; color: #374151; line-height: 1.5;">We have successfully received your track submission.</p>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin: 20px 0; border: 1px solid #f3f4f6;">
          <p style="margin: 4px 0; font-size: 14px; color: #111827;"><strong>Track:</strong> ${trackTitle}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #111827;"><strong>Genre:</strong> ${genre}</p>
          <p style="margin: 4px 0; font-size: 14px; color: #111827;"><strong>Audio Link:</strong> <a href="${publicUrl}" style="color: #2563eb; text-decoration: underline;">Listen to Upload</a></p>
        </div>
        <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin-bottom: 0;">Our A&R team will evaluate your submission shortly.</p>
      </div>
    `,
  });

  // 4. EXPLICIT RESEND TRIGGER: Notify Admin Inbox
  await sendResendEmail({
    to: 'admin@worldstarhiphop.world', 
    subject: `NEW DEMO: ${trackTitle} (${genre})`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>New Artist Submission</h2>
        <p><strong>Artist Email:</strong> ${user.email}</p>
        <p><strong>Track Title:</strong> ${trackTitle}</p>
        <p><strong>Genre:</strong> ${genre}</p>
        <p><strong>Audio File Link:</strong> <a href="${publicUrl}">${publicUrl}</a></p>
      </div>
    `,
  });

  return { success: true };
});
