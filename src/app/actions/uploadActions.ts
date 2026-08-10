'use server';

import { safeAction } from '@/lib/safeAction';
import { z } from 'zod';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const ALLOWED_MIME_TYPES = ['video/mp4', 'video/webm', 'video/quicktime', 'audio/mpeg', 'audio/wav', 'application/pdf', 'image/jpeg', 'image/png', 'image/webp'] as const;

const SIZE_LIMITS: Record<string, number> = {
  'video/mp4':      500 * 1024 * 1024, // 500MB
  'video/webm':     500 * 1024 * 1024,
  'video/quicktime':500 * 1024 * 1024,
  'audio/mpeg':      15 * 1024 * 1024, // 15MB
  'audio/wav':       15 * 1024 * 1024,
  'application/pdf':  5 * 1024 * 1024, // 5MB
  'image/jpeg':      10 * 1024 * 1024, // 10MB
  'image/png':       10 * 1024 * 1024,
  'image/webp':      10 * 1024 * 1024,
};

const UploadInputSchema = z.object({
  fileName:  z.string().min(1, 'fileName is required'),
  fileType:  z.string().refine((val) => ALLOWED_MIME_TYPES.includes(val as (typeof ALLOWED_MIME_TYPES)[number]), {
    message: 'Invalid file format. Allowed: MP4, WebM, MOV, MP3, WAV, PDF, JPG, PNG, WEBP.',
  }),
  fileSize:  z.number().positive('fileSize must be positive'),
  base64Data:z.string().min(1, 'base64Data is required'),
  pathFolder:z.string().optional().default('uploads'),
});

function getR2Client() {
  const accountId     = process.env.CLOUDFLARE_R2_ACCOUNT_ID     || '283e2da5eed64818e8d66be129764632';
  const accessKeyId   = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID   || '';
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';

  return {
    client: new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    }),
    accountId,
    bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME || 'worldstarhiphop',
  };
}

/**
 * Primary upload action — sends ALL files directly to Cloudflare R2.
 * This completely replaces the previous Supabase Storage path.
 */
export const uploadMediaAction = safeAction<
  { fileName: string; fileType: string; fileSize: number; base64Data: string; pathFolder?: string },
  { publicUrl: string; fileName: string; fileType: string; fileSize: number }
>(async (input) => {
  const validation = UploadInputSchema.safeParse(input);
  if (!validation.success) {
    const errorMsg = validation.error.issues.map((i) => i.message).join(', ');
    throw new Error(errorMsg);
  }

  const { fileName, fileType, fileSize, base64Data, pathFolder } = validation.data;

  // Enforce file size limits
  const maxAllowedSize = SIZE_LIMITS[fileType] ?? 5 * 1024 * 1024;
  if (fileSize > maxAllowedSize) {
    const maxMB = (maxAllowedSize / (1024 * 1024)).toFixed(0);
    throw new Error(`File size exceeds limit (${maxMB}MB max for ${fileType.split('/')[1].toUpperCase()}).`);
  }

  // Convert base64 → Buffer
  const base64Clean = base64Data.replace(/^data:.*?;base64,/, '');
  const buffer = Buffer.from(base64Clean, 'base64');

  // Unique R2 key: folder/timestamp_randomhex.ext
  const ext = fileName.split('.').pop()?.toLowerCase() || 'bin';
  const uniqueKey = `${pathFolder}/${Date.now()}_${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const { client, accountId, bucketName } = getR2Client();

  await client.send(new PutObjectCommand({
    Bucket:        bucketName,
    Key:           uniqueKey,
    Body:          buffer,
    ContentType:   fileType,
    ContentLength: buffer.length,
  }));

  const publicUrl = `https://pub-${accountId}.r2.dev/${uniqueKey}`;

  return { publicUrl, fileName, fileType, fileSize };
});

/**
 * Alias kept for backward-compatibility with any callers using uploadToR2 name.
 */
export const uploadToR2 = uploadMediaAction;
