# Spotify-Tier Platform Roadmap
*Master Premium Gap Analysis & Technical Blueprint*

To elevate the WorldStar platform from a standard web application to a flagship, "Spotify-level" digital experience, the following critical architectural and UX features must be implemented.

## 1. Global Persistent Audio Engine (The #1 Priority)
**Current State:** Audio playback is scoped to individual components (e.g., `CustomAudioPlayer` on the profile page). If a user clicks to another page, the music stops abruptly.
**Spotify-Tier Requirement:** A global, singleton audio engine that lives outside the Next.js page router (at the `RootLayout` level). 
- A persistent bottom playback bar.
- Global state management (Zustand/Context) to manage queues, playlists, volume, and current track metadata.
- Seamless page navigation while music continues to play uninterrupted.

## 2. Real-Time Infrastructure (Supabase Presence)
**Current State:** The admin dashboard and social features (likes, follows, comments) require hard refreshes or optimistic local state.
**Spotify-Tier Requirement:** 
- **Live Social Metrics:** When a user likes a drop, everyone looking at that track sees the counter increment via WebSockets.
- **Admin Command Center:** New track submissions appear instantly in the A&R dashboard without a page reload using Supabase Realtime Channels.
- **Live Now Indicators:** "Listening now" avatars on specific drops.

## 3. Micro-Interactions & Fluid Navigation
**Current State:** Pages load sequentially. Standard CSS hover states.
**Spotify-Tier Requirement:** 
- **Optimistic UI:** Every interaction (follow, like) must happen in 0ms locally, reverting only on network failure.
- **Shared Element Transitions:** Album art seamlessly expanding into the player when clicked (using Framer Motion `layoutId`).
- **Skeleton Framework:** Zero layout shift. Every component must have an intricate, shimmering skeleton loader that exactly matches the final loaded structure.

## 4. Algorithmic Discovery & Content Curation
**Current State:** Chronological or basic filtered lists of videos and submissions.
**Spotify-Tier Requirement:**
- **Dynamic "For You" Feed:** A personalized, infinite-scroll vertical feed.
- **Smart Recommendations:** "Fans also like" sections based on genre and follower intersections.
- **Progressive Image Loading:** Blur-up placeholders (`placeholder="blur"`) for all artist avatars and track covers to ensure instant perceived performance.

## 5. Offline Capabilities & PWA
**Current State:** Standard web application.
**Spotify-Tier Requirement:**
- **Service Worker:** Background caching of static assets and pre-fetching of upcoming audio chunks in the playlist.
- **Offline Mode:** Users can view their "Liked Drops" and cached artist profiles even on a subway with no signal.
- **Installable Desktop/Mobile App:** Full PWA manifest integration for a standalone app experience without browser chrome.

---
*Roadmap generated following emergency security lockdown.*
