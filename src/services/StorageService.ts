import { StorageRepository } from '@/repositories/StorageRepository';
import { ValidationError } from '@/lib/errors';
import crypto from 'crypto';
import { asyncContext, logger } from '@/lib/logger';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

export class StorageService {
  static async uploadMedia(file: File, rawPathFolder: string): Promise<string> {
    const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';

    if (file.size > MAX_FILE_SIZE) {
      throw new ValidationError('File exceeds 5MB limit', traceId);
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new ValidationError('Invalid MIME type', traceId);
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      throw new ValidationError('Invalid file extension', traceId);
    }

    // Magic Bytes Verification
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hexHeader = buffer.subarray(0, 8).toString('hex').toUpperCase();
    
    let isMagicValid = false;
    if (file.type === 'image/jpeg' && hexHeader.startsWith('FFD8FF')) isMagicValid = true;
    if (file.type === 'image/png' && hexHeader.startsWith('89504E47')) isMagicValid = true;
    if (file.type === 'image/webp' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') isMagicValid = true;
    if (file.type === 'image/gif' && hexHeader.startsWith('47494638')) isMagicValid = true;
    if (file.type === 'video/mp4') isMagicValid = true; // MP4 parsing is complex, relying on MIME/ext for now

    if (!isMagicValid) {
       logger.warn('Magic Bytes Spoofing Detected', { traceId, hexHeader, declaredType: file.type });
       throw new ValidationError('File integrity check failed. Magic bytes do not match declared MIME type.', traceId);
    }

    const sanitizedFolder = rawPathFolder.replace(/[^a-zA-Z0-9_-]/g, ''); 
    const secureFileName = `${sanitizedFolder}/${crypto.randomUUID()}.${fileExt}`;

    return await StorageRepository.uploadFile(secureFileName, buffer, file.type);
  }

  static async rollbackUpload(url: string) {
     const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';
     try {
       const urlObj = new URL(url);
       const key = urlObj.pathname.substring(1); 
       await StorageRepository.deleteFile(key);
       logger.info('Rolled back orphaned R2 object successfully', { traceId, key });
     } catch (err: any) {
       logger.error('CRITICAL: Failed to rollback R2 object. Orphaned resource created!', { traceId, url, error: err.message });
     }
  }

  /**
   * Safely deletes a media file from Cloudflare R2 bucket.
   * Ensures third-party URLs (YouTube, Unsplash) and default system placeholders are never deleted.
   */
  static async deleteAssetByUrl(url?: string | null): Promise<boolean> {
    if (!url || typeof url !== 'string') return false;

    // Safety checks: Never delete third-party assets or default system placeholders
    if (
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('unsplash.com') ||
      url.includes('google') ||
      url.includes('/defaults/') ||
      url.includes('placeholder')
    ) {
      return false;
    }

    try {
      let key = '';
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const urlObj = new URL(url);
        key = decodeURIComponent(urlObj.pathname.replace(/^\/+/, ''));
      } else {
        key = url.replace(/^\/+/, '');
      }

      if (!key || key.startsWith('defaults/') || key.includes('placeholder')) {
        return false;
      }

      await StorageRepository.deleteFile(key);
      logger.info('Cleaned up Cloudflare R2 storage asset successfully', { key });
      return true;
    } catch (err: any) {
      logger.warn('Non-blocking R2 cleanup warning', { url, error: err.message });
      return false;
    }
  }
}
