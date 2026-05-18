'use client';

import React from 'react';
import { Play, ShieldCheck, Sparkles, Database, ArrowUpRight } from 'lucide-react';

interface AnalyticsCardsProps {
  historyCount: number;
}

export default function AnalyticsCards({ historyCount }: AnalyticsCardsProps) {
  // Mock metrics based on user interactions
  const totalRuns = historyCount > 0 ? historyCount : 12;
  const avgScore = historyCount > 0 
    ? (historyCount * 9.1 + 8.8) / (historyCount + 1)
    : 9.3;
  const humanRealism = 98.4;
  const memoriesIndexed = 47;

  const stats = [
    {
      id: 'total_runs',
      label: 'Agent Runs executed',
      value: totalRuns,
      change: '+14.2% since yesterday',
      icon: Play,
      color: 'text-cyan-400 border-cyan-500/20 bg-cyan-950/10',
      glow: 'shadow-cyan-500/5',
    },
    {
      id: 'avg_score',
      label: 'Avg Quality Score',
      value: `${avgScore.toFixed(1)}/10`,
      change: 'Passed threshold of 8.0',
      icon: ShieldCheck,
      color: 'text-emerald-400 border-emerald-500/20 bg-emerald-950/10',
      glow: 'shadow-emerald-500/5',
    },
    {
      id: 'realism',
      label: 'Human Realism Index',
      value: `${humanRealism}%`,
      change: 'Critique AI pass rate',
      icon: Sparkles,
      color: 'text-violet-400 border-violet-500/20 bg-violet-950/10',
      glow: 'shadow-violet-500/5',
    },
    {
      id: 'memories',
      label: 'RAG Knowledge Entries',
      value: memoriesIndexed,
      change: 'Synced from company database',
      icon: Database,
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-950/10',
      glow: 'shadow-indigo-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            className={`rounded-2xl border border-slate-800/60 bg-slate-900/20 p-5 backdrop-blur-md flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-slate-700/80 hover:-translate-y-0.5 shadow-lg ${stat.glow}`}
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-slate-800/10 to-transparent blur-md rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-start mb-3">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </span>
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <h3 className="text-2xl font-bold tracking-tight text-white">{stat.value}</h3>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>{stat.change}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
