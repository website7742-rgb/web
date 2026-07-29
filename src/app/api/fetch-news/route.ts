import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export interface VideoItem {
  id: string;
  title: string;
  imageUrl: string;
  videoLink: string;
  views: string;
  posted: string;
}

// Hardcoded fallback data — used if WSHH blocks the scraper
const FALLBACK_DATA: VideoItem[] = [
  { id: 'f1',  title: "DRAKE RESPONDS TO KENDRICK DISS LIVE ON STAGE IN SHOCKING RANT!", views: "5.2M Views", posted: "2 HRS AGO",  imageUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?q=80&w=1000&auto=format&fit=crop", videoLink: "https://worldstarhiphop.com" },
  { id: 'f2',  title: "LIL BABY SPOTTED HANDING OUT CASH IN ATLANTA HOOD!",               views: "1.2M Views", posted: "4 HRS AGO",  imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f3',  title: "TRAVIS SCOTT MOSH PIT GOES CRAZY DURING UTOPIA TOUR IN ROME!",    views: "3.4M Views", posted: "6 HRS AGO",  imageUrl: "https://images.unsplash.com/photo-1541562232579-51fca3bb4b8b?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f4',  title: "FIGHT BREAKS OUT AT ROLLING LOUD MIAMI VIP SECTION!",              views: "890K Views", posted: "7 HRS AGO",  imageUrl: "https://images.unsplash.com/photo-1470229722913-7c090be5c524?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f5',  title: "GUNNA DROPS NEW MUSIC VIDEO FOR 'FUKUMEAN' AND IT'S A MOVIE!",    views: "2.1M Views", posted: "9 HRS AGO",  imageUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a2952c4a?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f6',  title: "KAI CENAT BREAKS TWITCH RECORD WITH KEVIN HART!",                  views: "4.5M Views", posted: "11 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f7',  title: "PLAYBOI CARTI MYSTERIOUS INSTAGRAM POST HAS FANS GOING WILD",      views: "1.9M Views", posted: "12 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f8',  title: "NBA YOUNGBOY RELEASES 4TH ALBUM THIS YEAR FROM HOUSE ARREST",      views: "3.1M Views", posted: "14 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f9',  title: "NEW MUSIC VIDEO: CHIEF KEEF RETURNS TO CHICAGO AFTER 12 YEARS!",   views: "6.2M Views", posted: "15 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f10', title: "CRAZY: FAN CLIMBS STAGE AT YE (KANYE WEST) LISTENING PARTY",       views: "1.1M Views", posted: "15 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1533174000243-ea848f0709d4?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f11', title: "FUTURE AND METRO BOOMIN ANNOUNCE JOINT TOUR DATES",                 views: "890K Views", posted: "16 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1505027492977-1037f14c46fa?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f12', title: "POLICE SHUT DOWN SECRET A$AP ROCKY POP-UP SHOP IN NYC",            views: "4.5M Views", posted: "18 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f13', title: "LIL UZI VERT PREVIEWS NEW ROCK ALBUM SNIPPETS ON IG LIVE",         views: "2.3M Views", posted: "19 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f14', title: "NEW MUSIC VIDEO: CENTRAL CEE - 'LONDON GRIT'",                     views: "5.1M Views", posted: "22 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f9af?q=80&w=1000&auto=format&fit=crop", videoLink: "https://worldstarhiphop.com" },
  { id: 'f15', title: "RICK ROSS HOSTS MASSIVE CAR SHOW AT HIS ATLANTA MANSION",           views: "3.7M Views", posted: "23 HRS AGO", imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f16', title: "CARDI B THROWS MICROPHONE AT FAN IN LAS VEGAS!",                   views: "10.5M Views",posted: "JULY 22",    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f17', title: "J COLE SEEN RIDING HIS BIKE THROUGH NYC UNBOTHERED",               views: "4.2M Views", posted: "JULY 22",    imageUrl: "https://images.unsplash.com/photo-1541562232579-51fca3bb4b8b?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f18', title: "SNOOP DOGG SMOKING A BLUNT WHILE COMMENTATING AT OLYMPICS!",        views: "15.4M Views",posted: "JULY 22",    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c090be5c524?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f19', title: "MEGAN THEE STALLION TWERKING ON IG LIVE BREAKS THE INTERNET",       views: "12.3M Views",posted: "JULY 22",    imageUrl: "https://images.unsplash.com/photo-1493225457124-a1a2a2952c4a?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
  { id: 'f20', title: "TYLER THE CREATOR SPOTTED SKATING IN PARIS DURING FASHION WEEK",   views: "4.8M Views", posted: "JULY 22",    imageUrl: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=800&q=80", videoLink: "https://worldstarhiphop.com" },
];

// In-memory cache to avoid hammering the target site
let cachedData: VideoItem[] | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function scrapeWSHH(): Promise<VideoItem[]> {
  const response = await fetch('https://worldstarhiphop.com/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cache-Control': 'no-cache',
      'Referer': 'https://www.google.com/',
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: WSHH blocked the request (likely Cloudflare).`);
  }

  const html = await response.text();

  // Cloudflare challenge check
  if (html.includes('cf-browser-verification') || html.includes('challenge-platform') || html.includes('__cf_chl')) {
    throw new Error('Cloudflare challenge detected — cannot scrape without a headless browser.');
  }

  const $ = cheerio.load(html);
  const items: VideoItem[] = [];

  // Try multiple selectors since WSHH may restructure their DOM
  const selectors = [
    'a.post-video',
    'div.post a',
    'article a',
    'a[href*="/video/"]',
    '.video-thumb a',
    '.main-content a',
  ];

  for (const selector of selectors) {
    $(selector).each((i, el) => {
      if (items.length >= 30) return false; // limit to 30 items

      const linkEl = $(el);
      const href = linkEl.attr('href') || '';
      const img = linkEl.find('img').first();
      const imgSrc = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src') || '';
      const titleEl = linkEl.find('.video-title, .title, h3, h4, p').first();
      const title = titleEl.text().trim() || linkEl.attr('title') || img.attr('alt') || '';

      if (!title || !imgSrc || items.find(v => v.videoLink === href)) return;

      const fullHref = href.startsWith('http') ? href : `https://worldstarhiphop.com${href}`;
      const fullImg  = imgSrc.startsWith('http') ? imgSrc : `https://worldstarhiphop.com${imgSrc}`;

      items.push({
        id: `live-${i}`,
        title: title.toUpperCase(),
        imageUrl: fullImg,
        videoLink: fullHref,
        views: `${(Math.random() * 5 + 0.5).toFixed(1)}M Views`,
        posted: 'LIVE',
      });
    });
    if (items.length > 0) break; // stop once a selector works
  }

  if (items.length === 0) {
    throw new Error('Scraping succeeded but found 0 items — DOM structure may have changed.');
  }

  return items;
}

export async function GET() {
  // Serve from cache if fresh
  if (cachedData && Date.now() - cacheTimestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      source: 'cache',
      items: cachedData,
    });
  }

  try {
    const items = await scrapeWSHH();
    cachedData = items;
    cacheTimestamp = Date.now();

    return NextResponse.json({
      source: 'live',
      items,
    });
  } catch (err: any) {
    console.warn('[WSHH Scraper] Falling back to mock data. Reason:', err.message);

    // Always return fallback so the homepage never breaks
    return NextResponse.json({
      source: 'fallback',
      reason: err.message,
      items: FALLBACK_DATA,
    });
  }
}
