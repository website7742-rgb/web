import { NextRequest, NextResponse } from 'next/server';
import { artistVideoService } from '@/services/ArtistVideoService';

export const runtime = 'nodejs';

/**
 * 🎬 Dynamic Artist Video Endpoint (Public Artist Profile Pages)
 * Resolves verified, embeddable YouTube videos via YouTube Data API v3
 * with server-side caching and fallback layers.
 * 
 * Never leaks API keys or internal credentials to the client.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const slug = searchParams.get('slug') || undefined;
    const channelUrl = searchParams.get('channelUrl') || undefined;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Artist name parameter is required',
          status: 'UNAVAILABLE',
        },
        { status: 400 }
      );
    }

    const videoResult = await artistVideoService.resolveArtistVideo({
      artistName: name.trim(),
      artistSlug: slug?.trim(),
      youtubeChannelUrl: channelUrl?.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        status: videoResult.status,
        videoId: videoResult.videoId,
        title: videoResult.title,
        embedUrl: videoResult.embedUrl,
        channelName: videoResult.channelName,
        thumbnailUrl: videoResult.thumbnailUrl,
        source: videoResult.source,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        status: 'UNAVAILABLE',
        videoId: null,
        embedUrl: null,
        title: null,
        channelName: null,
        thumbnailUrl: null,
        error: err.message || 'Failed to resolve artist video',
      },
      { status: 500 }
    );
  }
}
