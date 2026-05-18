'use client';

import React from 'react';
import { Search, Sparkles, Bell, Activity, ArrowRight } from 'lucide-react';

interface HeaderProps {
  isGenerating: boolean;
  progress: number;
}

export default function Header({ isGenerating, progress }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-8 select-none z-20 sticky top-0">
      
      {/* Search Input with futuristic look */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full group">
          <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-focus-within:opacity-100 transition-opacity rounded-xl blur-sm" />
          <input
            type="text"
            placeholder="Search testimonials, brands or personas..."
            className="w-full h-9 pl-9 pr-12 rounded-xl text-xs bg-slate-900/60 border border-slate-800/80 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-cyan-400 transition-colors" />
          
          {/* Futuristic keyboard shortcut indicator */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none select-none">
            <kbd className="h-5 px-1.5 flex items-center text-[9px] font-mono text-slate-500 bg-slate-800/80 border border-slate-700/60 rounded">
              ⌘
            </kbd>
            <kbd className="h-5 px-1.5 flex items-center text-[9px] font-mono text-slate-500 bg-slate-800/80 border border-slate-700/60 rounded">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* AI System Status indicators and User Avatar */}
      <div className="flex items-center gap-6">
        
        {/* Realtime latency & agent engine status */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/40 border border-slate-800/60 px-3 py-1.5 rounded-xl text-[11px] text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono text-slate-300">Agent Latency: 124ms</span>
        </div>

        {/* Global Generator Status */}
        {isGenerating ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 font-medium text-[11px] shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>Generating ({progress}%)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-slate-400 font-medium text-[11px]">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
            <span>AI Core Ready</span>
          </div>
        )}

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-slate-800 transition-all rounded-xl relative">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full absolute top-1.5 right-1.5 animate-pulse" />
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* User profile avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800/60">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-violet-600/10">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center font-bold text-xs text-white">
              US
            </div>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-200">Ukato Speaks</p>
            <p className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider">PRO Member</p>
          </div>
        </div>

      </div>
    </header>
  );
}
