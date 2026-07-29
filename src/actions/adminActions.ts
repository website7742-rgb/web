'use server';

import { revalidatePath } from 'next/cache';
import { ArtistSchema, VideoSchema } from '@/lib/validations';
import { createClient } from '@/lib/supabase/server';

export type ActionResponse = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

/**
 * SECURE SERVER ACTION: addArtist
 * Receives JSON payload via formData, validates via Zod, and inserts/updates in DB.
 */
export async function addArtist(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  const supabase = createClient();

  // 1. Security Layer 1: Verify the user session
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: 'Unauthorized. You must be logged in to perform this action.' };
  }

  try {
    const rawArtistData = formData.get('artistData');
    if (!rawArtistData || typeof rawArtistData !== 'string') {
       return { success: false, message: 'Missing artist data payload.' };
    }

    const parsedData = JSON.parse(rawArtistData);

    // 2. Security Layer 2: Parse and validate via Zod
    const validatedFields = ArtistSchema.safeParse(parsedData);

    if (!validatedFields.success) {
      return {
        success: false,
        message: 'Validation failed. Please check your inputs.',
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    // 3. Security Layer 3: DB Upsert (if ID exists it updates, otherwise inserts)
    // Note: Supabase upsert requires the primary key to match.
    const { error: dbError } = await supabase.from('artists').upsert(validatedFields.data, {
      onConflict: 'id'
    });

    if (dbError) {
      console.error("Database Upsert Error:", dbError);
      return { success: false, message: 'Failed to save artist to the database.' };
    }

    // Revalidate paths to instantly update the UI
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/roster');
    revalidatePath('/admin/cms');

    return { success: true, message: 'Artist successfully saved to the database!' };
  } catch (err) {
    console.error("Action execution error:", err);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}

/**
 * SECURE SERVER ACTION: deleteArtist
 */
export async function deleteArtist(artistId: string): Promise<ActionResponse> {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { success: false, message: 'Unauthorized.' };
  }

  const { error } = await supabase.from('artists').delete().eq('id', artistId);
  if (error) {
    console.error("Database Delete Error:", error);
    return { success: false, message: 'Failed to delete artist.' };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/roster');
  revalidatePath('/admin/cms');
  return { success: true, message: 'Artist deleted successfully.' };
}

/**
 * SECURE SERVER ACTION: addVideo
 */
export async function addVideo(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { success: false, message: 'Unauthorized.' };
  }

  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = VideoSchema.safeParse(rawData);
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { error: dbError } = await supabase.from('videos').insert([validatedFields.data]);

  if (dbError) {
    console.error("Database Insert Error:", dbError);
    return { success: false, message: 'Failed to upload video to the database.' };
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/cms');

  return { success: true, message: 'Video successfully uploaded and published!' };
}
