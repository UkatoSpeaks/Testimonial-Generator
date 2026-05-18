'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Sparkles, Shield, UserCheck, MessageSquare, Database } from 'lucide-react';

interface AICenterpieceProps {
  isGenerating?: boolean;
  progress?: number;
}

export default function AICenterpiece({ isGenerating = false, progress = 0 }: AICenterpieceProps) {
  // Agent nodes mapping
  const agents = [
    { id: 'analyze', icon: Database, label: 'RAG Doc', angle: 0, color: 'from-cyan-400 to-blue-500' },
    { id: 'persona', icon: Cpu, label: 'Persona', angle: 72, color: 'from-blue-500 to-indigo-600' },
    { id: 'generate', icon: MessageSquare, label: 'Draft', angle: 144, color: 'from-indigo-600 to-violet-600' },
    { id: 'humanize', icon: Sparkles, label: 'Humanize', angle: 216, color: 'from-violet-600 to-fuchsia-500' },
    { id: 'review', icon: Shield, label: 'Critic', angle: 288, color: 'from-fuchsia-500 to-cyan-400' },
  ];

  return (
    <div className="relative w-72 h-72 flex items-center justify-center select-none group">
      
      {/* 1. Global Ambient Glow Sphere */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: isGenerating ? [1, 1.25, 0.95, 1.2, 1] : [1, 1.12, 1],
            opacity: isGenerating ? [0.6, 0.85, 0.55, 0.9, 0.6] : [0.4, 0.55, 0.4],
          }}
          transition={{
            duration: isGenerating ? 3 : 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-52 h-52 bg-gradient-to-tr from-cyan-500/20 via-indigo-500/10 to-purple-500/25 rounded-full blur-[40px] pointer-events-none"
        />
      </div>

      {/* 2. Interactive Orbiting Rings (Holographic Visuals) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: isGenerating ? 12 : 25, repeat: Infinity, ease: "linear" }}
        className="absolute w-56 h-56 rounded-full border border-dashed border-cyan-500/20 flex items-center justify-center"
      >
        <div className="absolute w-[95%] h-[95%] rounded-full border border-slate-800/40" />
        <div className="absolute w-2 h-2 bg-cyan-400 rounded-full top-0 left-1/2 -translate-x-1/2 shadow-[0_0_12px_#06b6d4]" />
      </motion.div>

      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: isGenerating ? 16 : 35, repeat: Infinity, ease: "linear" }}
        className="absolute w-44 h-44 rounded-full border border-dashed border-purple-500/25"
      >
        <div className="absolute w-1.5 h-1.5 bg-purple-400 rounded-full bottom-0 left-1/2 -translate-x-1/2 shadow-[0_0_12px_#a855f7]" />
      </motion.div>

      {/* 3. The Core Neural Energy Sphere */}
      <motion.div
        whileHover={{ scale: 1.08 }}
        className="absolute w-28 h-28 rounded-full bg-gradient-to-b from-slate-900 via-slate-950 to-black border border-slate-800/80 flex items-center justify-center z-10 shadow-[0_0_40px_rgba(6,182,212,0.06)] cursor-pointer"
      >
        {/* Core Inside Glow Layer */}
        <div className="absolute inset-[3px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-blue-600/5 to-purple-500/20 opacity-90 group-hover:opacity-100 transition-opacity" />
        
        {/* Pulse rings */}
        <motion.div
          animate={{
            scale: isGenerating ? [1, 1.45, 1] : [1, 1.25, 1],
            opacity: isGenerating ? [0.4, 0, 0.4] : [0.2, 0, 0.2],
          }}
          transition={{
            duration: isGenerating ? 1.5 : 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 rounded-full border-2 border-cyan-500/35 pointer-events-none"
        />

        {/* Floating Core Indicator */}
        <div className="flex flex-col items-center justify-center text-center space-y-1 relative z-20">
          <motion.div
            animate={isGenerating ? {
              scale: [1, 1.15, 0.95, 1.1, 1],
              rotate: [0, 90, 180, 270, 360]
            } : {
              y: [0, -4, 0]
            }}
            transition={isGenerating ? {
              duration: 2.5,
              repeat: Infinity,
              ease: "linear"
            } : {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/15"
          >
            <div className="w-full h-full rounded-[9px] bg-slate-950 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
          </motion.div>
          <span className="text-[9px] font-mono tracking-widest text-cyan-400 font-bold uppercase mt-1">
            {isGenerating ? `${progress}%` : 'ONLINE'}
          </span>
        </div>
      </motion.div>

      {/* 4. Active Node Particles / Connected Agent Nodes */}
      {agents.map((agent, i) => {
        const angleRad = (agent.angle * Math.PI) / 180;
        const radius = 104; // pixel offset from center
        const x = Number((Math.cos(angleRad) * radius).toFixed(4));
        const y = Number((Math.sin(angleRad) * radius).toFixed(4));
        const AgentIcon = agent.icon;

        return (
          <div
            key={agent.id}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            className="absolute z-20 flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.15 }}
              className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${agent.color} p-[1px] shadow-lg cursor-pointer relative`}
            >
              {/* Pulsing glow background for active generating states */}
              {isGenerating && (
                <span className="absolute -inset-1 rounded-xl bg-cyan-400/20 blur-md animate-pulse" />
              )}
              
              <div className="w-full h-full rounded-[11px] bg-slate-950/90 hover:bg-slate-900/90 flex items-center justify-center transition-colors">
                <AgentIcon className="w-4 h-4 text-white" />
              </div>
            </motion.div>
            
            {/* Minimal label tag underneath */}
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-500 mt-1 select-none">
              {agent.label}
            </span>
          </div>
        );
      })}

      {/* 5. Flowing Neural Connection lines background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0">
        {agents.map((agent) => {
          const angleRad = (agent.angle * Math.PI) / 180;
          const radius = 104;
          const endX = Number((144 + Math.cos(angleRad) * radius).toFixed(4));
          const endY = Number((144 + Math.sin(angleRad) * radius).toFixed(4));

          return (
            <line
              key={`line-${agent.id}`}
              x1="144"
              y1="144"
              x2={endX}
              y2={endY}
              stroke="url(#neon-line-gradient)"
              strokeWidth={isGenerating ? "1.5" : "1"}
              strokeDasharray={isGenerating ? "4 4" : undefined}
              className={isGenerating ? "animate-[dash_1.5s_linear_infinite]" : ""}
              style={{
                strokeDashoffset: isGenerating ? 20 : 0
              }}
            />
          );
        })}
        <defs>
          <linearGradient id="neon-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
