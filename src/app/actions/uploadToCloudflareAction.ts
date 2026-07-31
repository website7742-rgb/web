'use server';

import { safeAction } from '@/lib/safeAction';
import { z } from 'zod';

const CloudflareUploadSchema = z.object({
  fileName: z.string().min(1, 'fileName is required'),
  fileType: z.string().refine((val) => val.startsWith('video/'), {
    message: 'Only video files (MP4, MOV, WebM) can be uploaded to Cloudflare Stream.',
  }),
  fileSize: z.number().positive('fileSize must be positive'),
  base64Data: z.string().min(1, 'base64Data is required'),
});

export const uploadToCloudflareAction = safeAction(
  async (input: { fileName: string; fileType: string; fileSize: number; base64Data: string }) => {
    // 1. Zod Validation
    const validation = CloudflareUploadSchema.safeParse(input);
    if (!validation.success) {
      const errorMsg = validation.error.issues.map((i) => i.message).join(', ');
      throw new Error(errorMsg);
    }

    const { fileName, fileType, fileSize, base64Data } = validation.data;

    // 2. Extract Environment Credentials
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    // 3. Fallback Generation if Cloudflare keys are unconfigured
    if (!accountId || !apiToken) {
      const mockUid = `cf_stream_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const mockPlaybackUrl = `https://videodelivery.net/${mockUid}/manifest/video.m3u8`;
      const mockIframeUrl = `https://iframe.videodelivery.net/${mockUid}`;
      const mockPreviewUrl = `https://videodelivery.net/${mockUid}/thumbnails/thumbnail.jpg`;

      return {
        uid: mockUid,
        playbackUrl: mockPlaybackUrl,
        iframeUrl: mockIframeUrl,
        previewUrl: mockPreviewUrl,
      };
    }

    // 4. Convert Base64 to FormData Buffer
    const base64Clean = base64Data.replace(/^data:.*?;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');

    const formData = new FormData();
    const blob = new Blob([buffer], { type: fileType });
    formData.append('file', blob, fileName);

    // 5. Call Cloudflare Stream Direct Upload API
    const cfResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: formData,
      }
    );

    const cfData = await cfResponse.json();

    if (!cfResponse.ok || !cfData.success) {
      const errorMsg = cfData.errors?.[0]?.message || 'Cloudflare Stream upload failed.';
      throw new Error(errorMsg);
    }

    const { uid, preview, playback } = cfData.result;

    return {
      uid,
      playbackUrl: playback?.hls || `https://videodelivery.net/${uid}/manifest/video.m3u8`,
      iframeUrl: `https://iframe.videodelivery.net/${uid}`,
      previewUrl: preview || `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg`,
    };
  }
);
