'use server';

import { withAdminAuthAndRateLimit } from '@/lib/safeAction';
import { StorageService } from '@/services/StorageService';
import { ValidationError } from '@/lib/errors';

export const uploadToR2 = withAdminAuthAndRateLimit(async (formData: FormData) => {
  const file = formData.get('file') as File;
  const pathFolder = formData.get('pathFolder') as string;

  if (!file) {
    throw new ValidationError('No file provided.', 'NO-TRACE-ID');
  }
  if (!pathFolder) {
    throw new ValidationError('No pathFolder provided.', 'NO-TRACE-ID');
  }

  const publicUrl = await StorageService.uploadMedia(file, pathFolder);

  return { url: publicUrl };
});
