export const MOTION_TRANSITIONS = {
  springSmooth: { type: "spring", stiffness: 260, damping: 25 },
  springSnappy: { type: "spring", stiffness: 400, damping: 30 },
  easeLuxury: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export const MOTION_VARIANTS = {
  staggerContainer: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: MOTION_TRANSITIONS.easeLuxury }
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: MOTION_TRANSITIONS.easeLuxury }
  },
  scaleGlass: {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: MOTION_TRANSITIONS.springSmooth }
  },
  slideInRight: {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: MOTION_TRANSITIONS.easeLuxury }
  }
};
