# Core Platform Architect Blueprints

These blueprints are absolute rules for all development, refactoring, and deployments in this repository.

1. **Brand Absolute Enforcement (WORLDSTAR ONLY):**
   - The platform name is strictly "WorldStar Hip Hop" (or "WorldStar").
   - Never use or leak any legacy template names (such as "Aetheria") in UI text, code comments, console logs, or metadata.

2. **Mobile-First Responsive Default:**
   - Every single component, layout, modal, and page built or modified must be fluidly responsive down to 375px (mobile screens).
   - Use dynamic Tailwind grids, flex wrapping (`flex-col md:flex-row`), and scalable typography (`text-xl sm:text-4xl`). No layout shifting, no un-wrapped metadata pills, and no text clipping.
   - Touch targets for mobile actions must be at least 44px. Prevent background scrolling on mobile overlays using `touch-none` safety layers.

3. **Infrastructure Strict Routing (R2 Only):**
   - All media assets (videos, avatars, tracks, submissions) must be streamed directly via Cloudflare R2 pipeline helpers.
   - Supabase is used strictly as a relational database layer (tables, schema, profiles, auth). Do NOT use or fallback to Supabase Storage buckets.

4. **Admin-First Content Management (CMS):**
   - No hardcoded dynamic assets on the public frontend. Banners, spotlight media, and rosters must fetch dynamically from context or database state.
   - Every user-facing feature must be fully manageable from the secure Admin Panel via service-role configurations to bypass client-level RLS restrictions.

5. **Self-Verification Protocol:**
   - Before completing any feature, run `npm run typecheck` to guarantee 0 TypeScript errors.
   - Run a programmatic internal verification check on the logic before pushing code.
