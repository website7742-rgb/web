import { ArtistRepository } from '@/repositories/ArtistRepository';
import { StorageService } from '@/services/StorageService';
import { asyncContext, logger } from '@/lib/logger';

export class ArtistService {
  /**
   * Upserts an artist and manages the distributed transaction for associated media.
   * If the DB fails, it rolls back the R2 upload to prevent orphaned blobs.
   */
  static async addArtist(artistData: any, newFileUrl?: string) {
     const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';
     
     try {
       logger.info('Initiating Artist DB Upsert', { traceId, artistId: artistData.id });
       const result = await ArtistRepository.upsert(artistData);
       logger.info('Artist DB Upsert Successful', { traceId, artistId: result.id });
       return result;
     } catch (err) {
       // DISTRIBUTED TRANSACTION COMPENSATION (Rollback)
       if (newFileUrl) {
         logger.warn('DB transaction failed, orchestrating compensation action on R2', { traceId, fileUrl: newFileUrl });
         await StorageService.rollbackUpload(newFileUrl);
       }
       throw err; 
     }
  }

  static async deleteArtist(artistId: string) {
     const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';
     logger.info('Initiating Artist DB Delete', { traceId, artistId });
     await ArtistRepository.delete(artistId);
     logger.info('Artist DB Delete Successful', { traceId, artistId });
  }
}
