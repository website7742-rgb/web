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
