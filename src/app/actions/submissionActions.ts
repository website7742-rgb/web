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
    subject: `WORLDSTAR: Track Submission Received - ${trackTitle}`,
    html: `
      <div style="background-color: #000; color: #fff; padding: 40px; font-family: monospace;">
        <h1 style="color: #FA243C; text-transform: uppercase;">Submission Confirmed</h1>
        <p>We have successfully received your track submission.</p>
        <ul>
          <li><strong>Track:</strong> ${trackTitle}</li>
          <li><strong>Genre:</strong> ${genre}</li>
          <li><strong>Audio Link:</strong> <a href="${publicUrl}" style="color: #FA243C;">Listen to Upload</a></li>
        </ul>
        <p>Our A&R team will evaluate your submission shortly.</p>
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
