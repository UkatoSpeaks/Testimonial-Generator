'use client';

import React, { useState } from 'react';
import { Testimonial } from '@/types/testimonial';
import { 
  Copy, 
  Download, 
  RotateCw, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  TrendingUp, 
  Globe, 
  FileJson, 
  FileText, 
  Table 
} from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
  onCopy: (text: string) => void;
  onExport: (t: Testimonial, format: 'json' | 'txt' | 'csv') => void;
  onRegenerate?: () => void;
}

export default function TestimonialCard({
  testimonial,
  onCopy,
  onExport,
  onRegenerate,
}: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const { persona, review, text, tone, platform } = testimonial;

  // Generate a beautiful initials background color based on name length
  const initials = persona.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  
  const colors = [
    'from-cyan-500 to-blue-500 shadow-cyan-500/20',
    'from-violet-500 to-fuchsia-500 shadow-violet-500/20',
    'from-emerald-500 to-teal-500 shadow-emerald-500/20',
    'from-indigo-500 to-purple-500 shadow-indigo-500/20',
  ];
  
  const colorIndex = (persona.name.length + (persona.role?.length || 0)) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <div className="border border-slate-800/80 bg-slate-950/45 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden transition-all duration-300 hover:border-slate-700/60 hover:-translate-y-0.5 group">
      
      {/* Decorative cyber corner glows */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/5 to-transparent blur-md rounded-full opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-violet-600/5 to-transparent blur-md rounded-full opacity-60 pointer-events-none" />

      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {/* Persona initials Avatar */}
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${avatarColor} flex items-center justify-center font-bold text-sm text-white shadow-md select-none`}>
            {initials}
          </div>
          <div className="text-left select-none">
            <h4 className="text-xs font-bold text-slate-200">{persona.name}</h4>
            <p className="text-[10px] text-slate-500">{persona.role}</p>
          </div>
        </div>

        {/* Quality indicator pill & checkmark */}
        <div className="flex items-center gap-1.5 select-none">
          {review.approved ? (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px] uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3" />
              <span>Approved</span>
            </span>
          ) : (
            <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-[9px] uppercase tracking-wider">
              <span>Iterating</span>
            </span>
          )}

          {/* Glowing review score */}
          <div className="px-2.5 py-0.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[10px] font-bold text-cyan-400 shadow-inner">
            {review.score.toFixed(1)}/10
          </div>
        </div>
      </div>

      {/* Testimonial body text */}
      <div className="relative mb-5 pl-4 border-l-2 border-cyan-500/30 text-left">
        <p className="text-[13px] italic text-slate-300 leading-relaxed font-medium">
          &ldquo;{text}&rdquo;
        </p>
      </div>

      {/* Meta tags (tone, platform) */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-900/60 pb-4 select-none">
        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-medium">
          Tone: {tone}
        </span>
        <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-medium">
          Platform: {platform}
        </span>
        {persona.experience_level && (
          <span className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-medium">
            Tier: {persona.experience_level}
          </span>
        )}
      </div>

      {/* Accordion Trigger (Expand persona/critic details) */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-widest font-bold pb-4 select-none"
      >
        <span>Agent Analysis & Critique</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Analysis */}
      {expanded && (
        <div className="text-left space-y-3 pb-4 border-b border-slate-900/60 mb-4 animate-[fadeIn_0.3s_ease-out] select-none">
          {persona.pain_points && (
            <div>
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">Simulated Pain Points:</span>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{persona.pain_points}</p>
            </div>
          )}
          {persona.goals && (
            <div>
              <span className="text-[9px] font-bold text-violet-400 uppercase tracking-wider">Simulated Goals:</span>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{persona.goals}</p>
            </div>
          )}
          <div>
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Critic Evaluation feedback:</span>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed italic bg-slate-900/30 border border-slate-800/40 p-2.5 rounded-lg">
              {review.feedback}
            </p>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-1 select-none">
        
        {/* Copy trigger */}
        <button
          type="button"
          onClick={() => onCopy(text)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all duration-300 cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Review</span>
        </button>

        {/* Export trigger (dropdown/actions) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            onBlur={() => setTimeout(() => setShowExportMenu(false), 200)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all duration-300 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Data</span>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 bottom-10 w-36 bg-slate-950 border border-slate-800/80 rounded-xl p-1.5 shadow-xl shadow-black/80 flex flex-col gap-0.5 z-40 animate-[fadeIn_0.15s_ease-out]">
              <button
                type="button"
                onClick={() => onExport(testimonial, 'json')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] text-slate-400 hover:text-cyan-400 hover:bg-slate-900 font-medium transition-colors text-left"
              >
                <FileJson className="w-3 h-3 text-violet-400" />
                <span>JSON Format</span>
              </button>
              <button
                type="button"
                onClick={() => onExport(testimonial, 'txt')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] text-slate-400 hover:text-cyan-400 hover:bg-slate-900 font-medium transition-colors text-left"
              >
                <FileText className="w-3 h-3 text-cyan-400" />
                <span>TXT Format</span>
              </button>
              <button
                type="button"
                onClick={() => onExport(testimonial, 'csv')}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] text-slate-400 hover:text-cyan-400 hover:bg-slate-900 font-medium transition-colors text-left"
              >
                <Table className="w-3 h-3 text-emerald-400" />
                <span>CSV Spreadsheet</span>
              </button>
            </div>
          )}
        </div>

        {/* Optional Regeneration block */}
        {onRegenerate && (
          <button
            type="button"
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold text-slate-400 hover:text-cyan-400 hover:bg-slate-900 border border-transparent hover:border-slate-800/80 transition-all duration-300 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
            <span>Re-verify</span>
          </button>
        )}

      </div>
    </div>
  );
}
