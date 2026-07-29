import { VideoRepository } from '@/repositories/VideoRepository';
import { asyncContext, logger } from '@/lib/logger';

export class VideoService {
  static async addVideo(videoData: any) {
     const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';
     
     logger.info('Initiating Video DB Insert', { traceId });
     const result = await VideoRepository.insert(videoData);
     logger.info('Video DB Insert Successful', { traceId, videoId: result.id });
     return result;
  }
}
