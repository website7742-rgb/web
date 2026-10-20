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
