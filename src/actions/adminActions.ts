'use server';

import { revalidatePath } from 'next/cache';
import { ArtistSchema, VideoSchema } from '@/lib/validations';
import { withAdminAuthAndRateLimit } from '@/lib/safeAction';
import { ArtistService } from '@/services/ArtistService';
import { VideoService } from '@/services/VideoService';
import { StorageService } from '@/services/StorageService';
import { ValidationError } from '@/lib/errors';

export const addArtist = withAdminAuthAndRateLimit(async (formData: FormData) => {
  const rawArtistData = formData.get('artistData');
  
  if (!rawArtistData || typeof rawArtistData !== 'string') {
     throw new ValidationError('Missing artist data payload.', 'NO-TRACE-ID');
  }

  const parsedData = JSON.parse(rawArtistData);
  const validatedFields = ArtistSchema.safeParse(parsedData);

  if (!validatedFields.success) {
    throw new ValidationError('Validation failed.', 'NO-TRACE-ID', validatedFields.error.flatten().fieldErrors);
  }

  const newFileUrl = formData.get('newFileUrl') as string | undefined;

  try {
    // Attempt the Supabase Database Insert
    await ArtistService.addArtist(validatedFields.data);
  } catch (err: any) {
    // GOOGLE STANDARD: DISTRIBUTED COMPENSATION / ROLLBACK
    // If DB fails, we MUST execute an S3 DeleteObjectCommand to wipe the newly created R2 file
    if (newFileUrl) {
      await StorageService.rollbackUpload(newFileUrl);
    }
    throw err; // Re-throw to be caught by the safeAction global handler
  }

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/roster');
  revalidatePath('/admin/cms');
  
  return 'Artist successfully saved to the database!';
});

export const deleteArtist = withAdminAuthAndRateLimit(async (artistId: string) => {
  if (!artistId) {
     throw new ValidationError('Missing artistId.', 'NO-TRACE-ID');
  }

  await ArtistService.deleteArtist(artistId);

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/roster');
  revalidatePath('/admin/cms');
  return 'Artist deleted successfully.';
});

export const addVideo = withAdminAuthAndRateLimit(async (formData: FormData) => {
  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = VideoSchema.safeParse(rawData);
  if (!validatedFields.success) {
    throw new ValidationError('Validation failed.', 'NO-TRACE-ID', validatedFields.error.flatten().fieldErrors);
  }

  await VideoService.addVideo(validatedFields.data);

  revalidatePath('/');
  revalidatePath('/admin');
  revalidatePath('/admin/cms');
  
  return 'Video successfully uploaded and published!';
});
