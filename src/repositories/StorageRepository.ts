import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { InternalServerError } from '@/lib/errors';
import { asyncContext } from '@/lib/logger';

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || '',
    secretAccessKey: secretAccessKey || '',
  },
});

export class StorageRepository {
  static async uploadFile(fileName: string, buffer: Buffer, mimeType: string) {
    const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: mimeType,
        })
      );
      return `https://pub-${accountId}.r2.dev/${fileName}`;
    } catch (err: any) {
      throw new InternalServerError(`R2 Upload Error: ${err.message}`, traceId);
    }
  }

  static async deleteFile(fileName: string) {
    const traceId = asyncContext.getStore()?.get('traceId') || 'NO-TRACE-ID';
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: fileName,
        })
      );
    } catch (err: any) {
      throw new InternalServerError(`R2 Delete Error: ${err.message}`, traceId);
    }
  }
}
