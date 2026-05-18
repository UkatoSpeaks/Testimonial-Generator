import { useState, useEffect, useCallback } from 'react';
import { Testimonial } from '@/types/testimonial';
import { toast } from 'react-hot-toast';

export function useTestimonials() {
  const [history, setHistory] = useState<Testimonial[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai_testimonial_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load testimonial history', e);
    }
  }, []);

  const saveToHistory = useCallback((items: Testimonial[]) => {
    setHistory((prev) => {
      // Avoid adding duplicates by ID
      const filteredPrev = prev.filter((p) => !items.some((item) => item.id === p.id));
      const nextHistory = [...items, ...filteredPrev].slice(0, 50); // limit to 50 items
      localStorage.setItem('ai_testimonial_history', JSON.stringify(nextHistory));
      return nextHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('ai_testimonial_history');
    setHistory([]);
    toast.success('Testimonial history cleared', {
      style: {
        background: '#121214',
        color: '#EF4444',
        border: '1px solid #EF4444',
      },
    });
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!', {
        icon: '📋',
        style: {
          background: '#121214',
          color: '#3B82F6',
          border: '1px solid #3B82F6',
        },
      });
    } catch (e) {
      toast.error('Failed to copy');
    }
  }, []);

  const exportTestimonial = useCallback((testimonial: Testimonial, format: 'json' | 'txt' | 'csv') => {
    let content = '';
    let mimeType = 'text/plain';
    let fileExtension = 'txt';

    if (format === 'json') {
      content = JSON.stringify(testimonial, null, 2);
      mimeType = 'application/json';
      fileExtension = 'json';
    } else if (format === 'txt') {
      content = `
BRAND: ${testimonial.brand_name}
PRODUCT: ${testimonial.product_name}
PERSONA: ${testimonial.persona.name} (${testimonial.persona.role})
TONE: ${testimonial.tone}
PLATFORM: ${testimonial.platform}
QUALITY SCORE: ${testimonial.review.score}/10
APPROVED: ${testimonial.review.approved ? 'YES' : 'NO'}
FEEDBACK: ${testimonial.review.feedback}

--------------------------------------------------------------------------------
TESTIMONIAL:
"${testimonial.text}"
--------------------------------------------------------------------------------
      `.trim();
      mimeType = 'text/plain';
      fileExtension = 'txt';
    } else if (format === 'csv') {
      const headers = 'Brand,Product,PersonaName,PersonaRole,Tone,Platform,Score,Approved,Text\n';
      const row = [
        testimonial.brand_name,
        testimonial.product_name,
        testimonial.persona.name,
        testimonial.persona.role,
        testimonial.tone,
        testimonial.platform,
        testimonial.review.score,
        testimonial.review.approved ? 'TRUE' : 'FALSE',
        `"${testimonial.text.replace(/"/g, '""')}"`,
      ].join(',');
      content = headers + row;
      mimeType = 'text/csv';
      fileExtension = 'csv';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `testimonial_${testimonial.persona.name.replace(/\s+/g, '_').toLowerCase()}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
  }, []);

  return {
    history,
    saveToHistory,
    clearHistory,
    copyToClipboard,
    exportTestimonial,
  };
}
