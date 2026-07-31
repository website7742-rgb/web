import { ProfileRepository } from '@/repositories/ProfileRepository';
import { asyncContext, logger } from '@/lib/logger';
import { ValidationError } from '@/lib/errors';

export class ProfileService {
  static async updateProfile(userId: string, profileData: { display_name?: string; bio?: string; avatar_url?: string }) {
     const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';
     
     if (!userId) {
       throw new ValidationError('User ID is required to update a profile.', traceId);
     }

     logger.info('Initiating Profile DB Update', { traceId, userId });
     const result = await ProfileRepository.updateProfile(userId, profileData);
     logger.info('Profile DB Update Successful', { traceId, userId });
     
     return result;
  }
}
