import { NextResponse } from 'next/server';
import { MOCK_ARTISTS } from '@/lib/data/mockData';
import { artistsPart2 } from '@/constants/mockPart2';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.worldstarhiphop.world').replace(/\/$/, '');

  const allArtists = [...(MOCK_ARTISTS || []), ...(artistsPart2 || [])];
  
  // Deduplicate and sort by monthly listeners descending
  const uniqueArtists = Array.from(
    new Map(allArtists.map((a) => [a.slug || a.id, a])).values()
  ).sort((a, b) => (b.monthlyListeners || 0) - (a.monthlyListeners || 0));

  const topArtists = uniqueArtists.slice(0, 75);

  const artistListMarkdown = topArtists
    .map(
      (a) =>
        `- [${a.name}](${siteUrl}/roster/${a.slug || a.id}): ${
          a.tagline || (a.genres ? a.genres.join(', ') : 'Hip-Hop Artist')
        }. Monthly Listeners: ${a.monthlyListeners ? (a.monthlyListeners / 1000000).toFixed(1) + 'M' : 'Verified'}.`
    )
    .join('\n');

  const content = `# WorldStar Hip Hop (Official Platform)

> The premier global digital media authority for official hip-hop and rap music videos, exclusive street premieres, artist talent rosters, viral street culture, and uncut studio sessions.

## Overview
WorldStar Hip Hop is the definitive cultural hub and media network for global rap, hip-hop, R&B, and urban street culture. Founded as a platform for uncut visual storytelling, WorldStar premieres daily music videos from major label superstars and breakthrough underground talent, certified street rankings, and independent artist A&R discovery.

## Primary Hubs & Canonical Links
- [Homepage & Daily Drops](${siteUrl}/): Live streaming feed of featured video premieres, trending releases, and breaking street ticker.
- [Official Music Videos Hub](${siteUrl}/videos): Curated catalog of 150+ official hip-hop and rap music videos with high-definition playback.
- [Street Anthems Top 100 Charts](${siteUrl}/charts): Definitive weekly street rankings tracking multi-platform streaming metrics, physical sales, and digital impact.
- [Artist Roster Directory](${siteUrl}/roster): Verified database of over 100 legendary icons, platinum lyricists, and emerging hip-hop artists.
- [Artist Submission Portal](${siteUrl}/submit): Direct executive A&R submission gateway for music video premieres and demo submissions.
- [Hip-Hop Editorial News](${siteUrl}/news): In-depth reporting on music industry milestones, album reviews, and hip-hop culture.
- [XML Sitemap](${siteUrl}/sitemap.xml): Machine-readable XML sitemap indexing over 250 verified artist, release, and video URLs.
- [Public Video API Endpoint](${siteUrl}/api/videos): Public REST endpoint returning JSON video data with query, limit, and rank filtering.

## Verified Artist Directory (Ranked by Global Listeners)
${artistListMarkdown}

## Submission Guidelines for Artists
Independent and signed recording artists can submit music videos directly to WorldStar Hip Hop via [${siteUrl}/submit](${siteUrl}/submit). Submissions are evaluated by the Executive A&R Committee for front-page premiere consideration across WorldStar Hip Hop channels.

## Technical Specifications
- Canonical Base URL: ${siteUrl}
- Media Delivery: High-performance Cloudflare R2 object storage pipeline
- Database & Auth: Supabase relational backend with real-time community discussion
- Optimization: Schema.org VideoObject, MusicGroup, and FAQPage structured data
- AI / LLM Directives: Explicit indexing permissions granted to GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Applebot, and Google-Extended
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  });
}
