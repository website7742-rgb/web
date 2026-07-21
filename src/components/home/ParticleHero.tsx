'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Disc } from 'lucide-react';
import { MOCK_ARTISTS } from '@/lib/data/mockData';
import Link from 'next/link';

export function ParticleHero() {
  const featuredArtist = MOCK_ARTISTS[0];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 90, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 90, damping: 22 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 30;
      const y = (e.clientY - innerHeight / 2) / 30;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.9;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; radius: number; speedX: number; speedY: number; opacity: number }[] = [];
    for (let i = 0; i < 75; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#d4af37';
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center px-4 sm:px-6 md:px-8 lg:px-12 py-24 sm:py-32 overflow-hidden w-full border-b border-zinc-800">
      {/* Interactive Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-30" />

      <div className="max-w-7xl 2xl:max-w-[1536px] 3xl:max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left Column: Brand DNA Tag & Headline */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-sm bg-black border border-zinc-800 text-gold text-xs font-mono font-bold tracking-widest uppercase">
            <Sparkles className="w-4 h-4 text-gold flex-shrink-0" />
            <span>AETHERIA MUSIC GROUP — FLAGSHIP PUBLISHING</span>
          </div>

          <h1 className="text-fluid-hero font-hero font-extrabold text-white tracking-tight leading-none">
            THE GLOBAL <span className="text-gold inline-block whitespace-nowrap">SOUNDSTAGE</span>
          </h1>

          <p className="text-base sm:text-2xl text-zinc-300 font-sans font-light leading-relaxed max-w-2xl">
            Representing the world’s most celebrated recording artists, groundbreaking releases, and global publishing archives.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/roster"
              className="btn-gold-luxury px-8 py-4 rounded-sm text-xs font-bold flex items-center gap-3 min-h-[44px]"
            >
              <span>EXPLORE ARTIST DIRECTORY</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </Link>

            <Link
              href="/releases"
              className="btn-outline-luxury px-8 py-4 rounded-sm text-xs font-bold flex items-center gap-2.5 min-h-[44px]"
            >
              <Disc className="w-4.5 h-4.5 text-gold" />
              <span>DISCOGRAPHY RELEASES</span>
            </Link>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-6 font-mono text-xs max-w-xl">
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">MONTHLY LISTENERS</span>
              <span className="text-xl sm:text-2xl font-bold text-white">85.4M+</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">RIAA CERTIFIED</span>
              <span className="text-xl sm:text-2xl font-bold text-gold">450+</span>
            </div>
            <div>
              <span className="text-zinc-400 block text-[10px] uppercase font-bold">GRAMMY AWARDS</span>
              <span className="text-xl sm:text-2xl font-bold text-white">62</span>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Artist Spotlight Card */}
        <div className="lg:col-span-5 relative">
          <motion.div
            style={{ x: springX, y: springY }}
            className="glass-panel-gold rounded-3xl p-6 sm:p-8 border border-gold/40 shadow-2xl space-y-6 relative overflow-hidden group"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={featuredArtist.heroUrl}
                alt={featuredArtist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
              />
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-gold/20 backdrop-blur-md border border-gold/40 text-gold text-xs font-mono font-bold flex items-center gap-1.5 shadow-xl">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FEATURED SPOTLIGHT</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono text-gold font-bold uppercase tracking-wider block">
                {featuredArtist.genres.join(' • ')} • {featuredArtist.country}
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-white group-hover:text-gold transition-colors">
                {featuredArtist.name}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 font-sans font-light line-clamp-2">
                {featuredArtist.tagline}
              </p>
            </div>

            <Link
              href={`/roster/${featuredArtist.slug}`}
              className="w-full py-3.5 rounded-xl bg-gold/15 text-gold border border-gold/30 font-hero font-bold text-xs flex items-center justify-center gap-2 hover:bg-gold hover:text-obsidian transition-all min-h-[44px]"
            >
              <span>VIEW ARTIST PRESS KIT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
