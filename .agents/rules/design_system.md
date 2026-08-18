# WorldStar Design System & Visual Architecture Blueprint

## 1. Executive Summary & Brand Direction
- **Identity**: WorldStar Hip Hop (or "WorldStar")
- **Aesthetic**: Premium, dark-mode first, high-contrast streetwear and streaming elegance (Spotify/Apple Music caliber).
- **Core Palette**:
  - Background Base: `#09090B` (Obsidian / Zinc 950)
  - Surface Raised: `#121216` / `#18181B` (Zinc 900)
  - Primary Accent: `#FA243C` / `#DC2626` (Electric Crimson / Red 600)
  - Gold Accent: `#D4AF37` / `#E5C07B` (A&R / VIP Status)
  - Text Primary: `#FFFFFF` (White)
  - Text Secondary: `#A1A1AA` (Zinc 400)
  - Text Muted / Mono: `#71717A` (Zinc 500)

---

## 2. Typography Standard (2026 Tier-1 Standard)
- **Primary Body & Display Font**: `Plus Jakarta Sans`
  - Clean geometric sans-serif with high x-height and optimal tracking for streaming dashboards.
  - Weights: `300`, `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold).
- **Technical & Timestamp Font**: `JetBrains Mono`
  - Used strictly for audio waveforms, duration counters, metadata badges, ISRC codes, and bitrate pills.
- **Button & CTA Typography**:
  - Uppercase, high letter-spacing (`tracking-widest` / `tracking-[0.2em]`), font weight `800`/`900`.
  - Specific action buttons preserve punchy sans/mono weights.

---

## 3. User Profile Architectural Blueprint
The User Profile (`/profile`) follows a Spotify Artist / Pro Creator layout:

### A. Hero Header (Above-The-Fold)
- **Avatar Component**:
  - Circular frame (28x28 mobile, 48x48 desktop) with subtle radial crimson glow.
  - Cloudflare R2 direct stream integration with hover camera overlay for instant crop upload.
  - Preloaded WebP asset delivery to eliminate flicker.
- **Identity & Metadata Block**:
  - Verified Identity pill / Public Profile badge.
  - Fluid display name (`text-2xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight`).
  - Bio with left accent border (`border-l-2 border-red-600/40`).
  - Stats pill row: Email, Liked Drops count, Following count, Comments count, Country.
  - Action row: `Edit Profile` CTA button with subtle gradient hover.

### B. Segmented Tab Navigation
- Tab switches (`LIKED DROPS`, `MY COMMENTS`, `FOLLOWING`) with animated bottom indicator & active counters.
- Zero layout shift during tab transition.

### C. Content Grids & Audio Cards
- Dynamic grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- Global persistent audio player synchronization (`useAudio()`).
- Empty states featuring pulsating radial icons and direct navigation triggers.

---

## 4. Spacing, Touch Targets & Mobile-First Rules
- **Touch Targets**: Minimum 44px on all interactive elements (`min-h-[44px] min-w-[44px]`).
- **Container Max Widths**: `max-w-[1400px]` for feed layouts, `max-w-6xl` for hero views.
- **Safe Area Insets**: Handled natively on fixed headers and bottom persistent audio bars.
- **Dynamic Caching**: All authenticated user views enforce `export const dynamic = 'force-dynamic'`.
