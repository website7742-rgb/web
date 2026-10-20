# ANTIGRAVITY MASTER DESIGN SYSTEM, ANIMATION & CODE BLUEPRINTS

> **SYSTEM DIRECTIVE FOR AI AGENT:** Follow every standard, color token, physics curve, and component blueprint in this document strictly. Never output unfinished placeholders (`// ... rest of code`). Every generated file must be fully typed TypeScript, responsive across mobile (`375px`) to ultra-wide (`3440×1440`), and styled with dark luxury precision.

---

## 1. CORE TECH STACK & ARCHITECTURE RULES
- **Framework:** Next.js (App Router) or React + Vite with strict TypeScript.
- **Styling:** Tailwind CSS + `clsx` + `tailwind-merge`.
- **Animation:** `framer-motion` for UI physics/shared layouts, and `gsap` (`ScrollTrigger`) for scroll-driven timelines.
- **Icons:** `lucide-react` (`strokeWidth={1.5}`).
- **Component Rule:** Keep Server Components clean for SEO/Data, and isolate interactive states inside `'use client'` leaf components.

---

## 2. DARK LUXURY COLOR & TYPOGRAPHY TOKENS

### 2.1 Obsidian Surface Palette
- **Base Canvas (`--bg-base`):** `#050507`
- **Card Surface (`--bg-card`):** `#0B0B0F`
- **Elevated Hover (`--bg-elevated`):** `#12121A`
- **Glass Overlay:** `bg-[#0B0B0F]/70 backdrop-blur-xl`
- **Primary Accent:** `#E11D48` (Crimson Red)
- **Ambient Accent:** `#7C3AED` (Deep Violet)
- **Borders:** Default `border-white/[0.07]`, Hover `border-white/[0.15]`, Top highlight `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)]`.

### 2.2 Typography Hierarchy
- **Headings:** `'Clash Display'`, `'Outfit'`, or `'Plus Jakarta Sans'` (`tracking-[-0.03em]`, `text-[#FAFAFC]`).
- **Body Text:** `'Plus Jakarta Sans'` or `'Inter'` (`text-zinc-400`, `leading-relaxed`).
- **Metrics / Numbers / Tags:** `'JetBrains Mono'` (`font-mono`, `tracking-wider`).

---

## 3. GLOBAL FRAMER MOTION PHYSICS PRESETS
Always use these motion configs instead of default linear transitions:

```tsx
// lib/motion-presets.ts
export const SPRING_SNAPPY = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.8,
} as const;

export const SPRING_SMOOTH = {
  type: "spring",
  stiffness: 240,
  damping: 24,
  mass: 1,
} as const;

export const EASE_LUXURY = [0.16, 1, 0.3, 1] as const;

export const STAGGER_WRAPPER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const FADE_UP_BLUR = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: EASE_LUXURY },
  },
};
```

---

## 4. READY-TO-USE INTERACTIVE COMPONENT BLUEPRINTS

Whenever building cards, buttons, or hero sections, use these exact patterns:

### 4.1 Cursor-Tracking Spotlight Bento Card
Use this pattern for feature cards, pricing tiers, and portfolio items:

```tsx
"use client";
import React, { useRef, useState } from "react";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function SpotlightCard({
  children,
  className = "",
  glowColor = "rgba(225, 29, 72, 0.14)",
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0F] p-6 sm:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-colors duration-300 hover:border-white/[0.16] ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-500"
        style={{
          opacity: visible ? 1 : 0,
          background: `radial-gradient(500px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 45%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

### 4.2 Magnetic Luxury CTA Button
Use this for primary Hero actions and key conversion buttons:

```tsx
"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function MagneticButton({
  children,
  onClick,
  className = "",
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    setOffset({
      x: (e.clientX - centerX) * 0.22,
      y: (e.clientY - centerY) * 0.22,
    });
  };

  return (
    <motion.button
      ref={btnRef}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 20, mass: 0.6 }}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-rose-600 px-7 py-3.5 font-medium text-white shadow-[0_0_30px_rgba(225,29,72,0.4)] transition-all hover:bg-rose-500 hover:shadow-[0_0_45px_rgba(225,29,72,0.65)] ${className}`}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
```

### 4.3 3D Interactive Perspective Tilt Card
Use this for showcasing media, product previews, or dashboard cards:

```tsx
"use client";
import React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function TiltShowcaseCard({ children }: { children: React.ReactNode }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 250, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 250, damping: 25 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const resetTilt = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={resetTilt}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative rounded-3xl border border-white/[0.09] bg-gradient-to-b from-[#12121A] to-[#08080C] p-6 shadow-2xl"
    >
      <div style={{ transform: "translateZ(35px)" }}>{children}</div>
    </motion.div>
  );
}
```

### 4.4 GSAP ScrollTrigger Section Reveal Wrapper
Use this for smooth scroll-linked section reveals and parallax blocks:

```tsx
"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollRevealSection({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-reveal-item",
        { y: 45, opacity: 0, filter: "blur(6px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className={className}>
      {children}
    </section>
  );
}
```

---

## 5. ULTRA-WIDE (`3440×1440`) & RESPONSIVE RULES
1. **Container Lock:** Always wrap core readable content in `max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12`.
2. **Edge-to-Edge Ambience:** Background meshes, subtle grid lines (`bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:4rem_4rem]`), and radial blurs must span `w-full` so `3440×1440` curved monitors look seamless.
3. **Pre-Flight Check:** Never deliver code without verifying all imports, TypeScript interfaces, hover states, and mobile responsiveness.

---

## 6. WORLDSTAR HIP HOP PLATFORM & BRAND ABSOLUTE RULES
1. **Brand Absolute Enforcement (WORLDSTAR ONLY):**
   - The platform name is strictly "WorldStar Hip Hop" (or "WorldStar").
   - Never use or leak legacy template names in UI text, code comments, console logs, or metadata.
2. **Mobile-First Responsive Default:**
   - Every component, layout, modal, and page must be fluidly responsive down to 375px.
   - Use dynamic Tailwind grids, flex wrapping (`flex-col md:flex-row`), and scalable typography (`text-xl sm:text-4xl`).
   - Touch targets for mobile actions must be at least 44px (`min-h-[44px] min-w-[44px]`). Prevent background scrolling on mobile overlays using `touch-none` safety layers.
3. **Infrastructure Strict Routing (R2 Only):**
   - All media assets (videos, avatars, tracks, submissions) must be streamed directly via Cloudflare R2 pipeline helpers.
   - Supabase is used strictly as a relational database layer (tables, schema, profiles, auth). Never use or fallback to Supabase Storage buckets.
4. **Admin-First Content Management (CMS):**
   - No hardcoded dynamic assets on the public frontend. Banners, spotlight media, and rosters must fetch dynamically from context or database state.
   - Every user-facing feature must be fully manageable from the secure Studio portal (`/studio`) via service-role configurations.
5. **Self-Verification Protocol:**
   - Run `npm run typecheck` to guarantee 0 TypeScript errors before completing any task.
   - Perform programmatic verification on logic before committing and pushing code.
