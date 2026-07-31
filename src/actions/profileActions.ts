'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { withAdminAuthAndRateLimit } from '@/lib/safeAction';
import { ProfileService } from '@/services/ProfileService';
import { ValidationError } from '@/lib/errors';
import { asyncContext } from '@/lib/logger';

const ProfileUpdateSchema = z.object({
  userId: z.string().uuid('Invalid User ID'),
  display_name: z.string().min(2, 'Display name is too short').max(50, 'Display name is too long').optional(),
  bio: z.string().max(300, 'Bio must be less than 300 characters').optional(),
  avatar_url: z.string().url('Invalid URL format').optional(),
});

export const updateProfile = withAdminAuthAndRateLimit(async (formData: FormData) => {
  const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';
  const rawData = Object.fromEntries(formData.entries());
  
  const validatedFields = ProfileUpdateSchema.safeParse(rawData);
  if (!validatedFields.success) {
    throw new ValidationError('Profile validation failed.', traceId, validatedFields.error.flatten().fieldErrors);
  }

  const { userId, ...profileData } = validatedFields.data;

  await ProfileService.updateProfile(userId, profileData);

  revalidatePath('/profile');
  revalidatePath(`/profile/${userId}`);
  
  return 'Profile successfully updated!';
});
