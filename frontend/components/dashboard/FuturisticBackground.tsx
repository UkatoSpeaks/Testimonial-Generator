'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function FuturisticBackground() {
  // Generate coordinates for ambient floating particle energy nodes
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1.5,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 20,
    delay: Math.random() * -20,
  }));

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-black overflow-hidden pointer-events-none z-0 select-none">
      
      {/* 1. Cyber Grid Pattern (Slow moving vertical grid lines for depth) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:4rem_4rem]" 
        style={{
          maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, #000 60%, transparent 100%)',
        }}
      />
      
      {/* 2. Cyber Horizon Grid Overlay (Slanted perspective glow) */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/5 via-transparent to-transparent opacity-60" />

      {/* 3. Deep Cinematic Ambient Orb Lights */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[10%] left-[5%] w-[45vw] h-[45vw] bg-cyan-500/5 rounded-full blur-[130px]"
      />

      <motion.div
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[15%] right-[5%] w-[50vw] h-[50vw] bg-purple-600/5 rounded-full blur-[140px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.25, 0.9, 1],
          opacity: [0.15, 0.3, 0.15, 0.15],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[40%] left-[45%] w-[25vw] h-[25vw] bg-blue-500/5 rounded-full blur-[100px]"
      />

      {/* 4. Drifting Neural Particles (Framer Motion) */}
      <div className="absolute inset-0 w-full h-full">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-cyan-400/25 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ['0vh', '-110vh'],
              x: ['0vw', `${Math.sin(p.id) * 5}vw`],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

    </div>
  );
}
