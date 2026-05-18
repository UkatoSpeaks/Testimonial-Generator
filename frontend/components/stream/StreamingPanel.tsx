'use client';

import React, { useEffect, useRef } from 'react';
import { WorkflowStep } from '@/types/testimonial';
import { 
  Search, 
  Users, 
  PenTool, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Cpu, 
  Terminal, 
  Loader2,
  XCircle
} from 'lucide-react';

interface StreamingPanelProps {
  isGenerating: boolean;
  currentStepId: string | null;
  steps: WorkflowStep[];
  logs: string[];
  progress: number;
  onStop: () => void;
}

export default function StreamingPanel({
  isGenerating,
  currentStepId,
  steps,
  logs,
  progress,
  onStop,
}: StreamingPanelProps) {
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Map step icons to actual Lucide Components
  const getIcon = (iconName: string, status: WorkflowStep['status']) => {
    const props = {
      className: `w-4 h-4 ${
        status === 'running' 
          ? 'text-cyan-400 animate-pulse' 
          : status === 'completed'
          ? 'text-emerald-400'
          : status === 'failed'
          ? 'text-rose-500'
          : 'text-slate-600'
      }`,
    };

    switch (iconName) {
      case 'Search':
        return <Search {...props} />;
      case 'Users':
        return <Users {...props} />;
      case 'PenTool':
        return <PenTool {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'ShieldCheck':
        return <ShieldCheck {...props} />;
      case 'Award':
        return <Award {...props} />;
      default:
        return <Cpu {...props} />;
    }
  };

  // Auto-scroll terminal console to the bottom
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Find active step info
  const activeStep = steps.find((s) => s.id === currentStepId);

  return (
    <div className="border border-slate-800/80 bg-slate-950/45 rounded-2xl p-6 backdrop-blur-md select-none relative overflow-hidden flex flex-col h-full min-h-[500px]">
      
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-b from-cyan-500/5 to-transparent blur-3xl" />
      
      {/* Title Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-5">
        <div className="flex items-center gap-2">
          <Cpu className={`w-5 h-5 ${isGenerating ? 'text-cyan-400 animate-spin' : 'text-slate-400'}`} />
          <div className="text-left">
            <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">LangGraph Agent Stream</h2>
            <p className="text-[10px] text-slate-500">Live orchestration of cooperative AI nodes</p>
          </div>
        </div>

        {isGenerating && (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 text-rose-400 font-semibold text-[10px] uppercase tracking-wider hover:bg-rose-500/10 active:scale-95 transition-all cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Abort Engine</span>
          </button>
        )}
      </div>

      {/* Progress bar loader */}
      <div className="space-y-1.5 mb-6 text-left">
        <div className="flex justify-between text-[11px] font-semibold">
          <span className="text-slate-400 uppercase tracking-wider">Engine Process Velocity</span>
          <span className="text-cyan-400 font-mono">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden p-[1px] border border-slate-800/60">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-500 rounded-full transition-all duration-500 relative"
            style={{ width: `${progress}%` }}
          >
            {isGenerating && (
              <div className="absolute inset-0 bg-white/20 animate-[pulse_1s_infinite] rounded-full" />
            )}
          </div>
        </div>
      </div>

      {/* Main Body Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Left Side: Agents List */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left pl-1">
            Execution Hierarchy
          </h3>
          <div className="space-y-2">
            {steps.map((step) => {
              const isRunning = step.status === 'running';
              const isCompleted = step.status === 'completed';
              const isFailed = step.status === 'failed';
              
              return (
                <div
                  key={step.id}
                  className={`rounded-xl border p-3 flex items-center gap-3 transition-all duration-300 ${
                    isRunning
                      ? 'border-cyan-500/30 bg-slate-900/60 shadow-[0_0_15px_rgba(6,182,212,0.04)]'
                      : isCompleted
                      ? 'border-emerald-500/15 bg-emerald-950/5'
                      : 'border-slate-850/40 bg-slate-950/20'
                  }`}
                >
                  {/* Status Indicator bubble */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isRunning
                      ? 'bg-cyan-500/10 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.1)]'
                      : isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : isFailed
                      ? 'bg-rose-500/10 border-rose-500/30'
                      : 'bg-slate-900 border-slate-800'
                  }`}>
                    {isRunning ? (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    ) : (
                      getIcon(step.icon, step.status)
                    )}
                  </div>

                  <div className="flex-1 text-left select-none">
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-bold ${
                        isRunning ? 'text-cyan-400' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                      }`}>
                        {step.label}
                      </span>
                      {step.timestamp && (
                        <span className="text-[9px] font-mono text-slate-500">
                          {step.timestamp}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] leading-tight mt-0.5 ${
                      isRunning ? 'text-cyan-400/80' : 'text-slate-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Live Logs Terminal Console */}
        <div className="flex flex-col h-full min-h-[250px] lg:min-h-0 bg-slate-950/80 rounded-xl border border-slate-900 p-4 relative font-mono text-left">
          {/* Console Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-900 mb-3 text-[10px] text-slate-500">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>TERMINAL FEED</span>
            </div>
            <span className="text-[9px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              SYSTEM_LOGS
            </span>
          </div>

          {/* Logs container */}
          <div className="flex-1 overflow-y-auto text-[11px] text-slate-400 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-900 pr-1">
            {logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 italic select-none">
                Waiting for backend request stream init...
              </div>
            ) : (
              logs.map((log, index) => {
                let textClass = 'text-slate-400';
                if (log.includes('completed') || log.includes('successfully')) {
                  textClass = 'text-emerald-400 font-bold';
                } else if (log.includes('Establishing') || log.includes('Starting')) {
                  textClass = 'text-cyan-400';
                } else if (log.includes('failure') || log.includes('error')) {
                  textClass = 'text-rose-500 font-bold';
                }
                
                return (
                  <div key={index} className={`leading-relaxed break-words ${textClass}`}>
                    <span className="text-cyan-500/60 font-bold mr-1">&gt;</span>
                    {log}
                  </div>
                );
              })
            )}
            <div ref={consoleEndRef} />
          </div>

          {/* Console Footer */}
          {activeStep && (
            <div className="mt-3 pt-2 border-t border-slate-900 flex items-center gap-2 text-[10px] text-cyan-400/80 select-none">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
              <span>Active Agent: {activeStep.label}...</span>
            </div>
          )}
        </div>
        
      </div>
      
    </div>
  );
}
