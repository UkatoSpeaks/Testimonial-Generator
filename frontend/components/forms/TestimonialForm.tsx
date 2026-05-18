'use client';

import React, { useState } from 'react';
import { GenerationRequest } from '@/types/testimonial';
import { Sparkles, HelpCircle, Layers, Users, Zap, Terminal } from 'lucide-react';

interface TestimonialFormProps {
  onSubmit: (data: GenerationRequest) => void;
  isGenerating: boolean;
}

export default function TestimonialForm({ onSubmit, isGenerating }: TestimonialFormProps) {
  const [formData, setFormData] = useState<GenerationRequest>({
    brand_name: 'OpenAI',
    product_name: 'ChatGPT Plus',
    industry: 'Artificial Intelligence',
    target_audience: 'Software Engineers and Researchers',
    tone: 'Authentic & Excited',
    platform: 'ProductHunt',
  });

  const tones = [
    { name: 'Authentic', desc: 'Real, human-like voice' },
    { name: 'Professional', desc: 'Polished, authority tone' },
    { name: 'Excited', desc: 'Enthusiastic & passionate' },
    { name: 'Casual', desc: 'Friendly, laid-back style' },
    { name: 'Skeptical-Believer', desc: 'Overcoming objections' },
    { name: 'Technical', desc: 'Detailed feature focus' },
  ];

  const platforms = [
    { id: 'ProductHunt', label: 'ProductHunt', icon: '😸' },
    { id: 'Twitter/X', label: 'Twitter / X', icon: '🐦' },
    { id: 'LinkedIn', label: 'LinkedIn', icon: '💼' },
    { id: 'WallOfLove', label: 'Wall of Love', icon: '❤️' },
    { id: 'LandingPage', label: 'Landing Page', icon: '✨' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectTone = (tone: string) => {
    setFormData((prev) => ({ ...prev, tone }));
  };

  const handleSelectPlatform = (platform: string) => {
    setFormData((prev) => ({ ...prev, platform }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand_name.trim() || !formData.product_name.trim()) return;
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-slate-950/40 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md select-none"
    >
      <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />

      <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
          <Terminal className="w-4 h-4 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">Configuration</h2>
          <p className="text-[10px] text-slate-500">Provide product meta-inputs for target simulation</p>
        </div>
      </div>

      {/* Brand & Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Brand Name Input */}
        <div className="relative group">
          <input
            type="text"
            name="brand_name"
            required
            value={formData.brand_name}
            onChange={handleChange}
            placeholder=" "
            disabled={isGenerating}
            className="peer w-full h-11 px-4 pt-4 rounded-xl text-xs bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-cyan-500/40 text-slate-200 placeholder-transparent transition-all duration-300 disabled:opacity-50"
          />
          <label className="absolute left-4 top-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-cyan-400 pointer-events-none">
            Brand Name
          </label>
        </div>

        {/* Product Name Input */}
        <div className="relative group">
          <input
            type="text"
            name="product_name"
            required
            value={formData.product_name}
            onChange={handleChange}
            placeholder=" "
            disabled={isGenerating}
            className="peer w-full h-11 px-4 pt-4 rounded-xl text-xs bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-cyan-500/40 text-slate-200 placeholder-transparent transition-all duration-300 disabled:opacity-50"
          />
          <label className="absolute left-4 top-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-cyan-400 pointer-events-none">
            Product Name
          </label>
        </div>
      </div>

      {/* Industry & Target Audience Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Industry Input */}
        <div className="relative group">
          <input
            type="text"
            name="industry"
            required
            value={formData.industry}
            onChange={handleChange}
            placeholder=" "
            disabled={isGenerating}
            className="peer w-full h-11 px-4 pt-4 rounded-xl text-xs bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-cyan-500/40 text-slate-200 placeholder-transparent transition-all duration-300 disabled:opacity-50"
          />
          <label className="absolute left-4 top-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-cyan-400 pointer-events-none">
            Industry Category
          </label>
        </div>

        {/* Target Audience Input */}
        <div className="relative group">
          <input
            type="text"
            name="target_audience"
            required
            value={formData.target_audience}
            onChange={handleChange}
            placeholder=" "
            disabled={isGenerating}
            className="peer w-full h-11 px-4 pt-4 rounded-xl text-xs bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-cyan-500/40 text-slate-200 placeholder-transparent transition-all duration-300 disabled:opacity-50"
          />
          <label className="absolute left-4 top-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-focus:top-1 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:text-cyan-400 pointer-events-none">
            Target Audience
          </label>
        </div>
      </div>

      {/* Tone Selection Block */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 text-left">
          Select Brand Voice Tone
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {tones.map((tone) => {
            const isSelected = formData.tone.toLowerCase().includes(tone.name.toLowerCase().split('-')[0]);
            return (
              <button
                type="button"
                key={tone.name}
                disabled={isGenerating}
                onClick={() => handleSelectTone(tone.name)}
                className={`px-3 py-2.5 rounded-xl border text-[11px] font-semibold text-left transition-all duration-300 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.05)]'
                    : 'bg-slate-950/45 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                }`}
              >
                <div className="font-bold">{tone.name}</div>
                <div className="text-[9px] text-slate-500 font-normal leading-tight mt-0.5">{tone.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Platform Selector Block */}
      <div className="space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 text-left">
          Target Output Platform
        </label>
        <div className="flex flex-wrap gap-2">
          {platforms.map((plat) => {
            const isSelected = formData.platform === plat.id;
            return (
              <button
                type="button"
                key={plat.id}
                disabled={isGenerating}
                onClick={() => handleSelectPlatform(plat.id)}
                className={`px-4 py-2 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.05)]'
                    : 'bg-slate-950/45 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-800'
                }`}
              >
                <span className="text-sm">{plat.icon}</span>
                <span>{plat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Launch CTA Generator Button */}
      <button
        type="submit"
        disabled={isGenerating}
        className="w-full h-12 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10 relative overflow-hidden group select-none transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-10 transition-opacity" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
        
        {isGenerating ? (
          <>
            <Zap className="w-4 h-4 text-cyan-200 animate-bounce" />
            <span>LANGGRAPH WORKFLOW RUNNING...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>LAUNCH GENERATION ENGINE</span>
          </>
        )}
      </button>
    </form>
  );
}
