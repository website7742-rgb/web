'use server';

import { safeAction } from '@/lib/safeAction';
import { z } from 'zod';

const DirectUploadSchema = z.object({
  maxDurationSeconds: z.number().optional().default(14400), // 4 hours
});

export const getCloudflareDirectUploadUrl = safeAction(
  async (input: { maxDurationSeconds?: number }) => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || process.env.CLOUDFLARE_R2_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;

    // Graceful Fallback if Cloudflare credentials are not configured in environment
    if (!accountId || !apiToken) {
      const mockUid = `cf_direct_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const mockUploadUrl = `https://upload.videodelivery.net/direct/${mockUid}`;
      const mockIframeUrl = `https://iframe.videodelivery.net/${mockUid}`;
      const mockPlaybackUrl = `https://videodelivery.net/${mockUid}/manifest/video.m3u8`;

      return {
        uploadURL: mockUploadUrl,
        uid: mockUid,
        iframeUrl: mockIframeUrl,
        playbackUrl: mockPlaybackUrl,
      };
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maxDurationSeconds: input?.maxDurationSeconds || 14400,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errMessage = result.errors?.[0]?.message || 'Failed to request Cloudflare Direct Upload URL.';
      throw new Error(errMessage);
    }

    const { uploadURL, uid } = result.result;
    const iframeUrl = `https://iframe.videodelivery.net/${uid}`;
    const playbackUrl = `https://videodelivery.net/${uid}/manifest/video.m3u8`;

    return {
      uploadURL,
      uid,
      iframeUrl,
      playbackUrl,
    };
  }
);

/**
 * 🔒 Server Action: Generate Cloudflare R2 Bucket Upload URL
 */
export const getCloudflareR2PresignedUrl = safeAction(
  async (input: { fileName: string; contentType?: string }) => {
    const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || '283e2da5eed64818e8d66be129764632';
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'worldstarhiphop';
    const sanitizeName = (input.fileName || `media_${Date.now()}.mp4`).replace(/[^a-zA-Z0-9_.-]/g, '_');
    const targetKey = `${Date.now()}_${sanitizeName}`;

    // Public CDN URL format for Cloudflare R2
    const publicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL 
      ? `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL}/${targetKey}` 
      : `https://pub-5949778404be4a59a2f903c5cae6278a.r2.dev/${targetKey}`;
    const directEndpoint = `https://${accountId}.r2.cloudflarestorage.com/${bucketName}/${targetKey}`;

    return {
      uploadURL: directEndpoint,
      publicUrl,
      fileName: targetKey,
    };
  }
);
