import { NextRequest, NextResponse } from 'next/server';
import { youtubeService } from '@/services/YoutubeService';
import { videoRepository } from '@/lib/repositories/VideoRepository';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * 🤖 Vercel Cron Job Route: AUTOMATED CONTENT AGGREGATION PIPELINE
 * Endpoint: POST / GET /api/cron/fetch-videos
 * Header Guard: Authorization: Bearer <CRON_SECRET>
 */
export async function GET(req: NextRequest) {
  return handleCronJob(req);
}

export async function POST(req: NextRequest) {
  return handleCronJob(req);
}

async function handleCronJob(req: NextRequest) {
  try {
    // 1. Security Check: Validate CRON_SECRET header
    const authHeader = req.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      console.warn('[Cron:fetch-videos] Unauthorized cron trigger attempt.');
      return NextResponse.json(
        { error: 'UNAUTHORIZED_CRON_TRIGGER', message: 'Invalid or missing CRON_SECRET authorization header.' },
        { status: 401 }
      );
    }

    // 2. Fetch top trending Rap / Hip-Hop short videos (under 2 minutes)
    console.log('[Cron:fetch-videos] Triggering YouTube Data API aggregation...');
    const fetchedVideos = await youtubeService.fetchTrendingShortRapVideos(25);

    // 3. Secure Zod Validation & Bulk Repository Ingestion
    console.log(`[Cron:fetch-videos] Ingesting ${fetchedVideos.length} videos into database...`);
    const result = await videoRepository.bulkUpsertVideos(fetchedVideos);

    // 4. Return Execution Statistics Summary
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      videosFetched: fetchedVideos.length,
      insertedCount: result.insertedCount,
      status: result.status,
    });
  } catch (error: any) {
    console.error('[Cron:fetch-videos] Pipeline execution failure:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal pipeline error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
