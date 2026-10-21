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
     logger.info('Initiating Artist DB & R2 Media Cleanup', { traceId, artistId });

     try {
       const artist = await ArtistRepository.findById(artistId);
       if (artist) {
         if (artist.avatar_url) {
           await StorageService.deleteAssetByUrl(artist.avatar_url).catch((err) =>
             logger.warn('Non-blocking R2 avatar delete warning', { error: err.message })
           );
         }
         if (artist.hero_url) {
           await StorageService.deleteAssetByUrl(artist.hero_url).catch((err) =>
             logger.warn('Non-blocking R2 hero banner delete warning', { error: err.message })
           );
         }
         if (artist.epk_url) {
           await StorageService.deleteAssetByUrl(artist.epk_url).catch((err) =>
             logger.warn('Non-blocking R2 EPK document delete warning', { error: err.message })
           );
         }
       }
     } catch (err: any) {
       logger.warn('Non-blocking artist media lookup warning', { traceId, error: err.message });
     }

     await ArtistRepository.delete(artistId);
     logger.info('Artist DB Delete Successful', { traceId, artistId });
  }
}
