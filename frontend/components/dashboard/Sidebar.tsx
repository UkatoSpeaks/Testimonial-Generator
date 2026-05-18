'use client';

import React from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Bookmark, 
  MessageSquareShare, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  Cpu, 
  ExternalLink 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'AI Generator', icon: LayoutDashboard },
    { id: 'brands', label: 'Brand Memory', icon: Bookmark, badge: 'RAG' },
    { id: 'testimonials', label: 'Generated Feed', icon: MessageSquareShare },
    { id: 'history', label: 'History & Logs', icon: HistoryIcon },
    { id: 'settings', label: 'System Configuration', icon: SettingsIcon },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/60 bg-slate-950/80 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand logo header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800/40 gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 relative group">
          <div className="absolute inset-0 rounded-lg bg-cyan-500 opacity-0 group-hover:opacity-40 transition-opacity blur-md" />
          <Cpu className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <span className="font-extrabold text-sm tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
            TESTIMONIAL
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              Machine
            </span>
            <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1 rounded font-mono">
              v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 gap-3 group relative overflow-hidden ${
                isActive 
                  ? 'bg-slate-900/60 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/20 border border-transparent'
              }`}
            >
              {/* Active glow light indicator */}
              {isActive && (
                <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_8px_#06b6d4]" />
              )}
              
              <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
              
              <span className="flex-1 text-left">{item.label}</span>
              
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase bg-gradient-to-r from-violet-600 to-indigo-600 text-white tracking-widest scale-90 border border-violet-500/20">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status info block */}
      <div className="p-4 border-t border-slate-800/40 bg-slate-950/40">
        <div className="rounded-xl p-3.5 bg-slate-900/40 border border-slate-800/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl" />
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute" />
            <span className="text-[11px] font-medium text-slate-300">Agent Core Online</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2">Connected to LangGraph Engine</p>
          <a
            href="http://localhost:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold hover:underline"
          >
            <span>View Swagger Docs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </aside>
  );
}
