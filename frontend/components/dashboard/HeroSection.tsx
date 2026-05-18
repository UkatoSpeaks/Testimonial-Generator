'use client';

import React from 'react';
import { Sparkles, Cpu, Award } from 'lucide-react';
import AICenterpiece from './AICenterpiece';

interface HeroSectionProps {
  isGenerating?: boolean;
  progress?: number;
}

export default function HeroSection({ isGenerating = false, progress = 0 }: HeroSectionProps) {
  return (
    <section className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950/45 p-8 select-none mb-8 cyber-card">
      {/* Cinematic Glowing Background Blobs */}
      <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[10%] w-[400px] h-[200px] bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Modern subtle grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

      {/* Main Content Layout */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-12">
        <div className="space-y-4 max-w-2xl text-left flex-1">
          {/* Animated Glow Tech Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-semibold text-[10px] tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.05)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>LangGraph Multi-Agent Testimonial Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            AI Testimonial{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-sm animate-text-shine">
              Machine
            </span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed">
            Generate high-realism customer feedback powered by RAG-driven brand memory. 
            Watch our specialized LangGraph AI Agents analyze product specs, craft targeted personas, 
            humanize writing patterns, and self-review quality metrics—all streaming LIVE in real-time.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-xl">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>6 Cooperative Agents</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-xl">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Score Critic Self-Correction</span>
            </div>
          </div>
        </div>

        {/* Cinematic abstract machine centerpiece */}
        <div className="flex items-center justify-center shrink-0">
          <AICenterpiece isGenerating={isGenerating} progress={progress} />
        </div>
      </div>
    </section>
  );
}

