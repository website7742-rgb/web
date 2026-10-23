/**
 * WorldStar Hip Hop — Curated & Dynamic Community Discussion Engine
 * Provides authentic, diverse, and realistic hip-hop community discussions
 * for all videos and tracks, with distinct comment counts (300 to 3,444+)
 * and unique artist-specific discussions.
 */

import { OFFICIAL_100_VIDEOS } from './official100Videos';

export interface SeedCommentProfile {
  full_name: string;
  avatar_url: string;
}

export interface SeedComment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: SeedCommentProfile;
  likesCount: number;
}

// 32 Diverse Hip-Hop Community Members with Authentic Avatars
const COMMUNITY_USERS: SeedCommentProfile[] = [
  { full_name: 'Marcus Vance', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'BrooklynBeats_99', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Trey From The A', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Deon 808', avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'CaliVibes Dre', avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'NuWave Hiphop', avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'KDot Vault', avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Mia Southside', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'BigTrap Mike', avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'LondonSpitter Kay', avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Jordyn Dreamville', avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Darnell Certified', avatar_url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Snoop LBC Rebel', avatar_url: 'https://images.unsplash.com/photo-1528892952291-009c663ce843?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Keisha Bars', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Derrick WorldStarOG', avatar_url: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Tyrell Flow', avatar_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Rashad 313', avatar_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Aaliyah Rhymes', avatar_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Jayden Cutlass', avatar_url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Malik MPC', avatar_url: 'https://images.unsplash.com/photo-1506863530036-1efeddceb993?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Brianna Chi', avatar_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Kendall 704', avatar_url: 'https://images.unsplash.com/photo-1519764622345-23439dd774f7?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Jamal West', avatar_url: 'https://images.unsplash.com/photo-1508341591423-4347099e1f19?auto=format&fit=crop&w=150&q=80' },
  { full_name: 'Nia Rhythm', avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80' },
];

/**
 * Deterministic hash function for string IDs to produce stable pseudo-random numbers
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Get distinct, realistic comment count for any video (ranging from ~280 to 3,444+)
 * Incorporates real DB comments count on top.
 */
export function getDistinctVideoCommentCount(videoIdOrRank: string | number, realDbCount: number = 0): number {
  const seed = hashString(String(videoIdOrRank));
  // Generates realistic numbers like 342, 850, 1420, 2340, 3444, etc.
  const spread = (seed % 3200) + 285;
  return spread + realDbCount;
}

/**
 * Format comment count cleanly (e.g. "342", "1.4K", "3.4K")
 */
export function formatDistinctCommentCount(videoIdOrRank: string | number, realDbCount: number = 0): string {
  const count = getDistinctVideoCommentCount(videoIdOrRank, realDbCount);
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toLocaleString();
}

/**
 * Parse artist and song from videoId or trackTitle
 */
function extractArtistAndSong(videoId: string, title?: string): { artist: string; song: string } {
  // Check official 100 videos catalog first
  const official = OFFICIAL_100_VIDEOS.find((v) => v.videoId === videoId);
  if (official) {
    return {
      artist: official.requestedArtist || official.channel || 'Artist',
      song: official.requestedSong || official.actualTitle || 'Track',
    };
  }

  if (title) {
    // E.g. "J. Cole - Safety (Official Audio)"
    const parts = title.split(/[-–—]/);
    if (parts.length >= 2) {
      const artist = parts[0].trim();
      const song = parts[1].replace(/\(.*\)|\[.*\]/g, '').trim();
      return { artist: artist || 'Artist', song: song || 'Drop' };
    }
    return { artist: title.slice(0, 20), song: 'Track' };
  }

  return { artist: 'WorldStar Artist', song: 'Drop' };
}

/**
 * Comment text templates incorporating artist, song, and authentic hip-hop dialogue
 */
const COMMENT_TEMPLATES = [
  (artist: string, song: string) => `That second verse on ${song} gave me absolute chills. ${artist} is in rare form right here! 🔥🔥🔥`,
  (artist: string, song: string) => `The beat selection on this is insane. ${artist} floated over this like it was nothing! 🐐`,
  (artist: string, song: string) => `WorldStar premiering the hardest drops of 2026. This is getting played all weekend with the bass on 100! 🔊`,
  (artist: string, song: string) => `${artist} really proved once again why they run this era. The rhyme scheme at the hook is elite.`,
  (artist: string, song: string) => `Man who produced this?! The 808s and that sample flip are pure perfection. Certified street anthem! 👑`,
  (artist: string, song: string) => `I've had ${song} on repeat since midnight. No skips on this project without question!`,
  (artist: string, song: string) => `This flow reminds me why I fell in love with hip-hop. Real lyricism and hunger are alive and well. 🎤`,
  (artist: string, song: string) => `That beat transition halfway through was completely wild 💀 ${artist} snapped on this!`,
  (artist: string, song: string) => `Underrated masterpiece. Y'all better stop sleeping on ${artist}, generational talent!`,
  (artist: string, song: string) => `Car test passed with flying colors. Speakers were literally rattling on that second chorus! 🚗💨`,
  (artist: string, song: string) => `Album of the year incoming if the whole project has this exact same energy as ${song}! 🚀`,
  (artist: string, song: string) => `Need the official music video for this ASAP! WorldStar exclusive energy right here! 🎥`,
  (artist: string, song: string) => `Flow is timeless. This is why ${artist} is already in my personal top 5! 💯`,
  (artist: string, song: string) => `10/10 drop. Adding this straight to my daily gym playlist immediately.`,
  (artist: string, song: string) => `The storytelling on ${song} is top tier. ${artist} painted a whole movie in under 4 minutes.`,
  (artist: string, song: string) => `Nobody rapping with this level of cadence right now. Absolute classic status! 🔥`,
  (artist: string, song: string) => `That hook is stuck in my head all day. Instant replay value! 🔁`,
  (artist: string, song: string) => `WorldStar comment section knows real music when they hear it. Salute to ${artist}! 🫡`,
];

/**
 * Generate distinct, rich community comments for a given video
 */
export function getDistinctVideoComments(videoId: string, trackTitle?: string): SeedComment[] {
  const seed = hashString(videoId);
  const { artist, song } = extractArtistAndSong(videoId, trackTitle);

  // Number of comments: 8 to 14 comments per video
  const numComments = (seed % 7) + 8;
  const result: SeedComment[] = [];

  const now = Date.now();
  // Time distribution over the last 1 to 5 days
  const timeDeltas = [
    12 * 60 * 1000,        // 12 mins ago
    45 * 60 * 1000,        // 45 mins ago
    2 * 3600 * 1000,       // 2 hours ago
    5 * 3600 * 1000,       // 5 hours ago
    9 * 3600 * 1000,       // 9 hours ago
    18 * 3600 * 1000,      // 18 hours ago
    26 * 3600 * 1000,      // 1 day ago
    42 * 3600 * 1000,      // 1.5 days ago
    72 * 3600 * 1000,      // 3 days ago
    96 * 3600 * 1000,      // 4 days ago
    120 * 3600 * 1000,     // 5 days ago
    140 * 3600 * 1000,     // 6 days ago
    160 * 3600 * 1000,     // 7 days ago
    200 * 3600 * 1000,     // 8 days ago
  ];

  for (let i = 0; i < numComments; i++) {
    const userIndex = (seed + i * 7) % COMMUNITY_USERS.length;
    const templateIndex = (seed + i * 11) % COMMENT_TEMPLATES.length;
    const user = COMMUNITY_USERS[userIndex];
    const content = COMMENT_TEMPLATES[templateIndex](artist, song);
    const timeDelta = timeDeltas[i % timeDeltas.length] + ((seed * (i + 1)) % (20 * 60 * 1000));
    const createdAt = new Date(now - timeDelta).toISOString();
    const likes = ((seed + i * 29) % 180) + 8;

    result.push({
      id: `seed-${videoId}-${i}`,
      content,
      created_at: createdAt,
      user_id: `seed-user-${userIndex}`,
      profiles: user,
      likesCount: likes,
    });
  }

  // Sort descending by created_at (newest first)
  return result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}
