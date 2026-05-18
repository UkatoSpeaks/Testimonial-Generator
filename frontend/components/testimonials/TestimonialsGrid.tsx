'use client';

import React, { useState } from 'react';
import { Testimonial } from '@/types/testimonial';
import TestimonialCard from './TestimonialCard';
import { 
  Download, 
  Copy, 
  Check, 
  Grid, 
  ListFilter, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

interface TestimonialsGridProps {
  testimonials: Testimonial[];
  onRegenerateCard?: (index: number) => void;
}

export default function TestimonialsGrid({ testimonials, onRegenerateCard }: TestimonialsGridProps) {
  const [filterTone, setFilterTone] = useState<string>('all');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'newest'>('score');
  
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Extract unique tones and platforms for filters
  const uniqueTones = Array.from(new Set(testimonials.map(t => t.tone)));
  const uniquePlatforms = Array.from(new Set(testimonials.map(t => t.platform)));

  // Copy helper
  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Export individual testimonial helper
  const handleExportIndividual = (testimonial: Testimonial, format: 'json' | 'txt' | 'csv') => {
    let content = '';
    let filename = `testimonial-${testimonial.persona.name.replace(/\s+/g, '-').toLowerCase()}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(testimonial, null, 2);
      filename += '.json';
      mimeType = 'application/json';
    } else if (format === 'txt') {
      content = `Name: ${testimonial.persona.name}\nRole: ${testimonial.persona.role}\nPlatform: ${testimonial.platform}\nTone: ${testimonial.tone}\nScore: ${testimonial.review.score}/10\n\n"${testimonial.text}"\n\nFeedback: ${testimonial.review.feedback}`;
      filename += '.txt';
      mimeType = 'text/plain';
    } else if (format === 'csv') {
      const headers = 'Name,Role,Platform,Tone,Score,Testimonial,Feedback\n';
      const row = `"${testimonial.persona.name.replace(/"/g, '""')}","${(testimonial.persona.role || '').replace(/"/g, '""')}","${testimonial.platform}","${testimonial.tone}",${testimonial.review.score},"${testimonial.text.replace(/"/g, '""')}","${testimonial.review.feedback.replace(/"/g, '""')}"`;
      content = headers + row;
      filename += '.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Bulk copy helper
  const handleCopyAll = async (filteredList: Testimonial[]) => {
    if (filteredList.length === 0) return;
    const combined = filteredList.map(t => `"${t.text}"\n- ${t.persona.name}, ${t.persona.role || ''}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(combined);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch (err) {
      console.error('Failed to copy all: ', err);
    }
  };

  // Bulk export helper
  const handleBulkExport = (filteredList: Testimonial[], format: 'json' | 'csv' | 'txt') => {
    if (filteredList.length === 0) return;
    let content = '';
    let filename = `all-testimonials-${Date.now()}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(filteredList, null, 2);
      filename += '.json';
      mimeType = 'application/json';
    } else if (format === 'txt') {
      content = filteredList
        .map((t, i) => `[${i + 1}] ${t.persona.name} (${t.persona.role || 'User'})\nPlatform: ${t.platform} | Tone: ${t.tone} | Score: ${t.review.score}/10\n"${t.text}"\nFeedback: ${t.review.feedback}`)
        .join('\n\n========================================\n\n');
      filename += '.txt';
      mimeType = 'text/plain';
    } else if (format === 'csv') {
      content = 'Name,Role,Platform,Tone,Score,Testimonial,Feedback\n' + 
        filteredList
          .map(t => `"${t.persona.name.replace(/"/g, '""')}","${(t.persona.role || '').replace(/"/g, '""')}","${t.platform}","${t.tone}",${t.review.score},"${t.text.replace(/"/g, '""')}","${t.review.feedback.replace(/"/g, '""')}"`)
          .join('\n');
      filename += '.csv';
      mimeType = 'text/csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Apply filters and sorting
  const filteredTestimonials = testimonials
    .filter(t => {
      const matchTone = filterTone === 'all' || t.tone === filterTone;
      const matchPlatform = filterPlatform === 'all' || t.platform === filterPlatform;
      return matchTone && matchPlatform;
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        return b.review.score - a.review.score;
      }
      // "newest" sorting relies on array ordering (keep existing ordering, b before a)
      return 0; 
    });

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6">
      
      {/* Header controls toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-slate-950/40 border border-slate-900/80 rounded-2xl p-4 backdrop-blur-md">
        
        {/* Filters section */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[10px] uppercase tracking-wider select-none">
            <ListFilter className="w-3.5 h-3.5 text-cyan-500" />
            <span>Filters:</span>
          </div>

          {/* Filter Tone Dropdown */}
          <select
            value={filterTone}
            onChange={(e) => setFilterTone(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 hover:bg-slate-800/80 transition-colors"
          >
            <option value="all">All Tones</option>
            {uniqueTones.map(tone => (
              <option key={tone} value={tone}>{tone}</option>
            ))}
          </select>

          {/* Filter Platform Dropdown */}
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 hover:bg-slate-800/80 transition-colors"
          >
            <option value="all">All Channels</option>
            {uniquePlatforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>

          {/* Sort selector */}
          <div className="flex items-center gap-2 border-l border-slate-900 pl-3">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'newest')}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 hover:bg-slate-800/80 transition-colors"
            >
              <option value="score">Sort by Quality Score</option>
              <option value="newest">Sort by Order Generated</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Controls */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
          
          {/* Copy all button */}
          <button
            type="button"
            onClick={() => handleCopyAll(filteredTestimonials)}
            disabled={filteredTestimonials.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-cyan-400 border border-slate-800 transition-all select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'Copied Feed!' : 'Copy Feed'}</span>
          </button>

          {/* Bulk Export Downloader options */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 select-none">
            <button
              type="button"
              onClick={() => handleBulkExport(filteredTestimonials, 'json')}
              disabled={filteredTestimonials.length === 0}
              title="Export All as JSON"
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-violet-400 hover:bg-slate-950/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              JSON
            </button>
            <span className="w-px h-3 bg-slate-850" />
            <button
              type="button"
              onClick={() => handleBulkExport(filteredTestimonials, 'txt')}
              disabled={filteredTestimonials.length === 0}
              title="Export All as Text Document"
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-cyan-400 hover:bg-slate-950/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              TXT
            </button>
            <span className="w-px h-3 bg-slate-850" />
            <button
              type="button"
              onClick={() => handleBulkExport(filteredTestimonials, 'csv')}
              disabled={filteredTestimonials.length === 0}
              title="Export All as CSV Spreadsheet"
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-400 hover:text-emerald-400 hover:bg-slate-950/60 transition-colors disabled:opacity-50 cursor-pointer"
            >
              CSV
            </button>
          </div>
        </div>

      </div>

      {/* Copy Alert HUD */}
      {copiedText && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-slate-950 border border-emerald-500/30 rounded-xl shadow-lg shadow-black/80 flex items-center gap-2 animate-[slideUp_0.3s_ease-out]">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-200">Testimonial copied to clipboard!</span>
        </div>
      )}

      {/* Testimonials List Grid */}
      {filteredTestimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-950/20 border border-dashed border-slate-900 rounded-2xl">
          <Sparkles className="w-8 h-8 text-slate-700 mb-3 animate-pulse" />
          <p className="text-xs font-semibold text-slate-500">No testimonials match the chosen criteria filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTestimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={`${testimonial.persona.name}-${idx}`}
              testimonial={testimonial}
              onCopy={handleCopyText}
              onExport={handleExportIndividual}
              onRegenerate={onRegenerateCard ? () => onRegenerateCard(idx) : undefined}
            />
          ))}
        </div>
      )}

    </div>
  );
}
