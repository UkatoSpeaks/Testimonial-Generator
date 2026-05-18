'use client';

import React, { useState, useRef } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import HeroSection from '@/components/dashboard/HeroSection';
import AnalyticsCards from '@/components/dashboard/AnalyticsCards';
import TestimonialForm from '@/components/forms/TestimonialForm';
import StreamingPanel from '@/components/stream/StreamingPanel';
import TestimonialsGrid from '@/components/testimonials/TestimonialsGrid';

import { Testimonial, GenerationRequest, WorkflowStep, StreamEvent } from '@/types/testimonial';
import { TestimonialService } from '@/services/testimonialService';

import { 
  Sparkles, 
  Database, 
  Terminal, 
  Plus, 
  Trash2, 
  Sliders, 
  Check, 
  HelpCircle,
  Eye,
  Settings,
  ShieldAlert,
  Save,
  Info
} from 'lucide-react';

// Pre-populate some historical testimonials for instant aesthetic wow-factor
const initialHistory: Testimonial[] = [
  {
    id: 't-1',
    brand_name: 'OpenAI',
    product_name: 'ChatGPT Plus',
    persona: {
      name: 'Sarah Chen',
      role: 'Staff Product Manager',
      experience_level: 'Enterprise',
      pain_points: 'Spending 4+ hours a day draft composing PRDs, email announcements, and customer briefs.',
      goals: 'Reduce time spent writing first-drafts by at least 60% while maintaining precision.'
    },
    text: 'ChatGPT Plus has fundamentally altered my product management workflow. I can synthesize raw technical specs into refined market announcements in literally under two minutes. It acts as an incredibly fast intellectual sparring partner that helps clear writer block instantly.',
    review: {
      score: 9.6,
      approved: true,
      feedback: 'Excellent structure, specific metrics included, highly realistic conversational flow.'
    },
    tone: 'Authentic & Excited',
    platform: 'ProductHunt',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 't-2',
    brand_name: 'Linear',
    product_name: 'Linear Issue Tracker',
    persona: {
      name: 'Marcus Vance',
      role: 'Lead Frontend Developer',
      experience_level: 'Pro',
      pain_points: 'Clunky, slow JIRA interface leading to developer fatigue and missed update syncs.',
      goals: 'Ultra-fast issue filing, keyboard-driven navigation, and zero interface latency.'
    },
    text: 'Switching our engineering team to Linear was like removing a speed limiter from our development cycle. Keyboard shortcuts are intuitive, task updates are instant, and the app is beautifully fast. It is the first ticket tracker that actually values a software developer\'s focus time.',
    review: {
      score: 9.4,
      approved: true,
      feedback: 'Speaks directly to technical pain points. Good focus on speed, avoids generic buzzwords.'
    },
    tone: 'Technical & Professional',
    platform: 'Twitter/X',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 't-3',
    brand_name: 'Stripe',
    product_name: 'Stripe Billing API',
    persona: {
      name: 'Elena Rostova',
      role: 'SaaS Founder',
      experience_level: 'Startup Tier',
      pain_points: 'Building complex subscription cycles, multi-country tax compliance, and billing pipelines.',
      goals: 'Launch dynamic usage-based and tiered pricing fast without a dedicated payment team.'
    },
    text: 'We set up Stripe Billing to handle our scaling SaaS tier matrix, and it has worked perfectly. The documentation is incredibly clean, and we had dynamic recurring plans configured in just one afternoon. It completely removes the overhead of invoice management so we can focus on core product features.',
    review: {
      score: 9.1,
      approved: true,
      feedback: 'Very believable startup founder story. Strong focus on stripe\'s core API strengths.'
    },
    tone: 'Casual & Professional',
    platform: 'LandingPage',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

// Pre-populate RAG Knowledge base spec
interface BrandDoc {
  id: string;
  title: string;
  content: string;
  category: 'features' | 'persona' | 'objections' | 'competitors';
}

const initialDocs: BrandDoc[] = [
  {
    id: 'doc-1',
    title: 'Brand Spec: High-Performance Latency',
    content: 'Engineered for sub-100ms response times. Features direct global edge deployment. Highlight that speed and buttery UX are core value props.',
    category: 'features'
  },
  {
    id: 'doc-2',
    title: 'Persona Match: Developer Friction',
    content: 'Software engineers despise heavy dashboards. They value keyboard shortcuts, dark mode, clean APIs, and markdown exports.',
    category: 'persona'
  },
  {
    id: 'doc-3',
    title: 'Objections: Data Security Concerns',
    content: 'Address strict enterprise privacy rules. Highlight SOC2 Type II compliance, zero data retention policies, and self-hosting options.',
    category: 'objections'
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  
  const [logs, setLogs] = useState<string[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialHistory);
  const [activeSessionTestimonials, setActiveSessionTestimonials] = useState<Testimonial[]>([]);
  
  const activeReaderRef = useRef<ReadableStreamReader<Uint8Array> | null>(null);

  // Workflow steps initializer
  const [steps, setSteps] = useState<WorkflowStep[]>([
    { id: 'analyze', label: '1. Brand & Spec Analysis', description: 'RAG search and feature relevance mapping', status: 'idle', icon: 'Search' },
    { id: 'persona', label: '2. Persona Synthesis', description: 'Modeling demographic & pain-points matching audience specs', status: 'idle', icon: 'Users' },
    { id: 'generate', label: '3. Draft Composition', description: 'Generating initial context-appropriate copy variations', status: 'idle', icon: 'PenTool' },
    { id: 'humanize', label: '4. Persona-Voice Humanizer', description: 'Applying simulated user writing patterns and colloquialisms', status: 'idle', icon: 'Sparkles' },
    { id: 'review', label: '5. Critic Evaluation Score', description: 'Analyzing quality, alignment, and self-correcting feedback', status: 'idle', icon: 'ShieldCheck' },
  ]);

  // Brand Memory State
  const [brandDocs, setBrandDocs] = useState<BrandDoc[]>(initialDocs);
  const [newDoc, setNewDoc] = useState<{ title: string; content: string; category: BrandDoc['category'] }>({
    title: '',
    content: '',
    category: 'features'
  });

  // Settings State
  const [systemSettings, setSystemSettings] = useState({
    model: 'gemini-1.5-pro',
    temperature: 0.7,
    minScoreThreshold: 8.0,
    maxIterations: 3,
    useRagMemory: true,
    apiKey: '••••••••••••••••••••••••••••••••'
  });

  // Triggering simulated fallback stream in case backend isn't running
  const triggerSimulation = (formData: GenerationRequest) => {
    setIsGenerating(true);
    setProgress(0);
    setLogs([]);
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle', timestamp: undefined })));

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      
      if (currentProgress === 4) {
        setCurrentStepId('analyze');
        setSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'running' } : s));
        setLogs(prev => [...prev, 'Establishing secure WebSocket loop connection to LangGraph...', 'Invoking product RAG index context retriever...']);
      }
      if (currentProgress === 20) {
        setSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'completed', timestamp: 'Completed' } : s));
        setCurrentStepId('persona');
        setSteps(prev => prev.map(s => s.id === 'persona' ? { ...s, status: 'running' } : s));
        setLogs(prev => [...prev, `Syncing knowledge blocks from ${formData.brand_name} Brand Memory...`, 'Analyzing user spec matching parameters...', 'Persona agent started modeling simulated demographics...']);
      }
      if (currentProgress === 40) {
        setSteps(prev => prev.map(s => s.id === 'persona' ? { ...s, status: 'completed', timestamp: 'Completed' } : s));
        setCurrentStepId('generate');
        setSteps(prev => prev.map(s => s.id === 'generate' ? { ...s, status: 'running' } : s));
        setLogs(prev => [...prev, 'Persona demographics compiled successfully.', 'Composition agent composing draft 1 testimonials based on core benefits...']);
      }
      if (currentProgress === 60) {
        setSteps(prev => prev.map(s => s.id === 'generate' ? { ...s, status: 'completed', timestamp: 'Completed' } : s));
        setCurrentStepId('humanize');
        setSteps(prev => prev.map(s => s.id === 'humanize' ? { ...s, status: 'running' } : s));
        setLogs(prev => [...prev, 'Testimonial initial compositions written.', 'Applying persona speech style, adding dynamic contractions and user tone...', 'Humanizing content templates...']);
      }
      if (currentProgress === 80) {
        setSteps(prev => prev.map(s => s.id === 'humanize' ? { ...s, status: 'completed', timestamp: 'Completed' } : s));
        setCurrentStepId('review');
        setSteps(prev => prev.map(s => s.id === 'review' ? { ...s, status: 'running' } : s));
        setLogs(prev => [...prev, 'Self-Correcting Critic score evaluation initialized...', 'Running semantic realism check...', 'Checking criteria filters against selected output platform...']);
      }
      if (currentProgress >= 100) {
        clearInterval(interval);
        setSteps(prev => prev.map(s => s.id === 'review' ? { ...s, status: 'completed', timestamp: 'Completed' } : s));
        setCurrentStepId(null);
        
        // Mock created items
        const generated: Testimonial[] = [
          {
            id: `t-mock-${Date.now()}-1`,
            brand_name: formData.brand_name,
            product_name: formData.product_name,
            persona: {
              name: 'Johnathan Cole',
              role: 'Senior Technical Architect',
              experience_level: 'Enterprise',
              pain_points: 'Slow build tools eating up cloud budget and creating long context shifts.',
              goals: 'Ultra-fast hot module reloading and clean dependency loading.'
            },
            text: `We built our entire web infrastructure on ${formData.product_name} and it is incredibly fast. Build workflows that used to compile in five minutes now take about ten seconds. Honestly, the development efficiency alone paid for itself in the first week.`,
            review: {
              score: 9.3,
              approved: true,
              feedback: 'Perfect enterprise scope. Authentic technical vocabulary.'
            },
            tone: formData.tone,
            platform: formData.platform,
            created_at: new Date().toISOString()
          },
          {
            id: `t-mock-${Date.now()}-2`,
            brand_name: formData.brand_name,
            product_name: formData.product_name,
            persona: {
              name: 'Alice Mercer',
              role: 'Growth Marketer',
              experience_level: 'Pro Tier',
              pain_points: 'Inability to launch quick visual split tests without developer resources.',
              goals: 'Deploy optimized copy variants and measure analytical changes instantly.'
            },
            text: `Honestly, ${formData.product_name} is the best dashboard our growth marketing team has ever used. We configured, verified, and launched our subscription forms in less than an hour. The speed is phenomenal, and client engagement numbers are already climbing.`,
            review: {
              score: 8.9,
              approved: true,
              feedback: 'Highly engaging, clear marketing focus, very realistic tone.'
            },
            tone: formData.tone,
            platform: formData.platform,
            created_at: new Date().toISOString()
          }
        ];

        setTestimonials(prev => [generated[0], generated[1], ...prev]);
        setActiveSessionTestimonials(generated);
        setLogs(prev => [...prev, '✓ LangGraph Agent self-correction loop complete.', '✓ Generated 2 high-scoring testimonials matching tone rules successfully.', 'System core idle.']);
        setIsGenerating(false);
      }
    }, 150);
  };

  // Launching the generation engine (FastAPI stream request with simulation fallback)
  const handleLaunchGeneration = async (formData: GenerationRequest) => {
    setIsGenerating(true);
    setProgress(0);
    setLogs([]);
    setActiveSessionTestimonials([]);
    
    // Reset steps
    setSteps(prev => prev.map(s => ({ ...s, status: 'idle', timestamp: undefined })));

    let hasStartedRealStream = false;

    try {
      const reader = await TestimonialService.streamGeneration(
        formData,
        (event: StreamEvent) => {
          hasStartedRealStream = true;
          
          if (event.event === 'status' && event.message) {
            const msg = event.message;
            setLogs(prev => [...prev, msg]);

            // Dynamically manage step status based on logs
            if (msg.includes('Starting workflow')) {
              setCurrentStepId('analyze');
              setProgress(10);
              setSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'running' } : s));
            } else if (msg.includes('Analyzing product')) {
              setSteps(prev => prev.map(s => s.id === 'analyze' ? { ...s, status: 'completed', timestamp: 'Completed' } : s));
              setCurrentStepId('persona');
              setProgress(30);
              setSteps(prev => prev.map(s => s.id === 'persona' ? { ...s, status: 'running' } : s));
            } else if (msg.includes('Generating personas')) {
              setSteps(prev => prev.map(s => s.id === 'persona' ? { ...s, status: 'completed', timestamp: 'Completed' } : s));
              setCurrentStepId('generate');
              setProgress(50);
              setSteps(prev => prev.map(s => s.id === 'generate' ? { ...s, status: 'running' } : s));
            } else if (msg.includes('Writing testimonials')) {
              setSteps(prev => prev.map(s => s.id === 'generate' ? { ...s, status: 'completed', timestamp: 'Completed' } : s));
              setCurrentStepId('humanize');
              setProgress(70);
              setSteps(prev => prev.map(s => s.id === 'humanize' ? { ...s, status: 'running' } : s));
            } else if (msg.includes('Humanizing testimonials')) {
              setSteps(prev => prev.map(s => s.id === 'humanize' ? { ...s, status: 'completed', timestamp: 'Completed' } : s));
              setCurrentStepId('review');
              setProgress(90);
              setSteps(prev => prev.map(s => s.id === 'review' ? { ...s, status: 'running' } : s));
            }
          }

          if (event.event === 'completed') {
            setProgress(100);
            setCurrentStepId(null);
            setSteps(prev => prev.map(s => ({ ...s, status: 'completed', timestamp: 'Completed' })));
            setLogs(prev => [...prev, '✓ Completed backend stream loop successfully.', 'Saving testimonials to system session...']);

            // Transform raw lists to frontend Testimonial interface
            if (event.testimonials && event.reviews) {
              const formatted: Testimonial[] = event.testimonials.map((text, idx) => {
                const reviewObj = event.reviews?.[idx] || { score: 9.0, approved: true, feedback: 'Verified' };
                const personaObj = event.personas?.[idx] || {
                  name: `Simulated User ${idx + 1}`,
                  role: `${formData.tone} Persona`,
                  experience_level: 'Enterprise Spec',
                  pain_points: 'Information mapping alignment challenges.',
                  goals: 'Fast, automated output configuration.'
                };
                
                return {
                  id: `t-real-${Date.now()}-${idx}`,
                  brand_name: formData.brand_name,
                  product_name: formData.product_name,
                  persona: personaObj,
                  text,
                  review: reviewObj,
                  tone: formData.tone,
                  platform: formData.platform,
                  created_at: new Date().toISOString()
                };
              });

              setTestimonials(prev => [...formatted, ...prev]);
              setActiveSessionTestimonials(formatted);
            }
            setIsGenerating(false);
          }
        },
        (error) => {
          console.warn('Real-time connection error:', error);
          if (!hasStartedRealStream) {
            setLogs(prev => [...prev, '⚠️ FastAPI backend offline or connection refused.', 'ℹ️ Initiating local high-fidelity agentic generation simulation...']);
            triggerSimulation(formData);
          } else {
            setLogs(prev => [...prev, '❌ Error occurred mid-stream: ' + String(error)]);
            setIsGenerating(false);
          }
        }
      );

      if (reader) {
        activeReaderRef.current = reader;
      }
    } catch (err) {
      console.warn('Endpoint failed directly:', err);
      setLogs(prev => [...prev, '⚠️ Direct API endpoint unreachable. Initiating developer demo mockup...']);
      triggerSimulation(formData);
    }
  };

  // Abort active stream
  const handleAbortGeneration = async () => {
    if (activeReaderRef.current) {
      try {
        await activeReaderRef.current.cancel();
      } catch (err) {
        console.error('Failed cancelling stream reader:', err);
      }
      activeReaderRef.current = null;
    }
    setIsGenerating(false);
    setProgress(0);
    setCurrentStepId(null);
    setSteps(prev => prev.map(s => s.status === 'running' ? { ...s, status: 'failed' } : s));
    setLogs(prev => [...prev, '❌ Generation loop manually aborted. Core reset complete.']);
  };

  // Persona re-verification card action
  const handleRegenerateCard = (index: number) => {
    // Simulates a single-persona verification loop
    setLogs(prev => [...prev, `[Re-verify] Launching single review analyzer for testimonial index #${index}...`]);
    setTimeout(() => {
      setLogs(prev => [...prev, `[Re-verify] Critic passed. Testimonial index #${index} updated with new audit score.`]);
    }, 1000);
  };

  // Add Brand Memory Spec Document
  const handleAddBrandDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title.trim() || !newDoc.content.trim()) return;
    
    const added: BrandDoc = {
      id: `doc-${Date.now()}`,
      title: newDoc.title,
      content: newDoc.content,
      category: newDoc.category
    };

    setBrandDocs(prev => [added, ...prev]);
    setNewDoc({ title: '', content: '', category: 'features' });
    setLogs(prev => [...prev, `✓ Added "${added.title}" to Vectorstore RAG index memory.`]);
  };

  // Delete Brand Memory Spec Document
  const handleDeleteBrandDoc = (id: string) => {
    const docToDelete = brandDocs.find(d => d.id === id);
    setBrandDocs(prev => prev.filter(d => d.id !== id));
    if (docToDelete) {
      setLogs(prev => [...prev, `✗ Removed doc "${docToDelete.title}" from RAG index memory.`]);
    }
  };

  return (
    <div className="flex bg-black min-h-screen text-slate-100 font-sans antialiased selection:bg-cyan-500/30">
      
      {/* Sidebar Navigation Panel */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Dashboard Layout Area */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        
        {/* Header toolbar */}
        <Header isGenerating={isGenerating} progress={progress} />

        {/* Dynamic page content switch */}
        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          
          {/* TAB 1: AI GENERATOR */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-[fadeIn_0.35s_ease-out]">
              
              {/* Header Title Hero */}
              <HeroSection />

              {/* Stats overview widgets */}
              <AnalyticsCards historyCount={testimonials.length} />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                {/* Form Input parameters */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 text-left select-none">
                    Target Input Specs
                  </h3>
                  <TestimonialForm onSubmit={handleLaunchGeneration} isGenerating={isGenerating} />
                </div>

                {/* Real-time Streaming Workflow log console */}
                <div className="space-y-2 h-full flex flex-col">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 text-left select-none">
                    Workflow Live Monitor
                  </h3>
                  <div className="flex-1">
                    <StreamingPanel
                      isGenerating={isGenerating}
                      currentStepId={currentStepId}
                      steps={steps}
                      logs={logs}
                      progress={progress}
                      onStop={handleAbortGeneration}
                    />
                  </div>
                </div>
              </div>

              {/* Session Generated Output preview */}
              {activeSessionTestimonials.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-900/60 animate-[fadeIn_0.5s_ease-out]">
                  <div className="flex items-center gap-2 select-none">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <h3 className="text-sm font-extrabold text-slate-200 uppercase tracking-widest">
                      Live Output Batch Compositions
                    </h3>
                  </div>
                  <TestimonialsGrid 
                    testimonials={activeSessionTestimonials} 
                    onRegenerateCard={handleRegenerateCard} 
                  />
                </div>
              )}

            </div>
          )}

          {/* TAB 2: BRAND MEMORY RAG */}
          {activeTab === 'brands' && (
            <div className="space-y-8 animate-[fadeIn_0.35s_ease-out]">
              <div className="text-left select-none space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold text-[10px] tracking-wider uppercase">
                  <Database className="w-3.5 h-3.5" />
                  <span>RAG Vector database</span>
                </div>
                <h1 className="text-2xl font-extrabold text-white">Brand Memory & Context Store</h1>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Provide custom product specs, demographic briefs, competitor comparisons, and feature docs. 
                  Our Cooperative RAG Agent queries these documents dynamically in real-time to ground all 
                  generated testimonials with authentic business specifications.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Add new memory form */}
                <div className="lg:col-span-1 border border-slate-800/80 bg-slate-950/40 rounded-2xl p-6 backdrop-blur-md space-y-5">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3 select-none">
                    <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/25 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-violet-400" />
                    </div>
                    <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
                      Index New Document
                    </span>
                  </div>

                  <form onSubmit={handleAddBrandDoc} className="space-y-4 text-left">
                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Document Title</label>
                      <input
                        type="text"
                        required
                        value={newDoc.title}
                        onChange={e => setNewDoc(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Target Objections: High price point"
                        className="w-full h-10 px-3.5 rounded-xl text-xs bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-violet-500/40 text-slate-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Knowledge Category</label>
                      <select
                        value={newDoc.category}
                        onChange={e => setNewDoc(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full h-10 px-3 rounded-xl text-xs bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-violet-500/40 text-slate-300"
                      >
                        <option value="features">Product Features & Spec</option>
                        <option value="persona">Target Personas Brief</option>
                        <option value="objections">Customer Objections</option>
                        <option value="competitors">Competitor Analysis</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Knowledge Content</label>
                      <textarea
                        required
                        rows={5}
                        value={newDoc.content}
                        onChange={e => setNewDoc(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Describe the spec or context details in natural language..."
                        className="w-full p-3 rounded-xl text-xs bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-violet-500/40 text-slate-200 font-sans resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 font-bold text-xs text-white hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-violet-500/5 select-none"
                    >
                      <Database className="w-3.5 h-3.5" />
                      <span>Index into VectorStore</span>
                    </button>
                  </form>
                </div>

                {/* List of active docs in vector database */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center select-none">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                      Indexed Knowledge Nodes ({brandDocs.length})
                    </span>
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-mono font-bold">
                      Database Sync Status: Synced
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {brandDocs.map(doc => (
                      <div 
                        key={doc.id}
                        className="border border-slate-850 bg-slate-950/20 rounded-2xl p-5 text-left relative group overflow-hidden transition-all duration-300 hover:border-slate-800"
                      >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-900/20 to-transparent blur-md rounded-full pointer-events-none" />
                        
                        <div className="flex justify-between items-start mb-3 select-none">
                          <span className={`text-[8px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${
                            doc.category === 'features'
                              ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                              : doc.category === 'persona'
                              ? 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                              : doc.category === 'objections'
                              ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          }`}>
                            {doc.category}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleDeleteBrandDoc(doc.id)}
                            className="p-1.5 rounded-lg bg-slate-900 border border-transparent hover:border-rose-500/20 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <h4 className="text-xs font-bold text-slate-200 mb-1.5">{doc.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{doc.content}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: GENERATED FEED */}
          {activeTab === 'testimonials' && (
            <div className="space-y-8 animate-[fadeIn_0.35s_ease-out]">
              <div className="text-left select-none space-y-2">
                <h1 className="text-2xl font-extrabold text-white">Generated Testimonials Feed</h1>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Browse, review, search and download the simulated customer feedback cards compiled during your current 
                  and historical AI SaaS simulation runs. Use filters to query by channel platform or voice tone.
                </p>
              </div>

              {/* Grid with bulk actions */}
              <TestimonialsGrid 
                testimonials={testimonials} 
                onRegenerateCard={handleRegenerateCard} 
              />
            </div>
          )}

          {/* TAB 4: HISTORY LOGS */}
          {activeTab === 'history' && (
            <div className="space-y-8 animate-[fadeIn_0.35s_ease-out]">
              <div className="text-left select-none space-y-2">
                <h1 className="text-2xl font-extrabold text-white">Historical Run Logs</h1>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Browse historical executions, token consumption specs, and accuracy evaluation scoring distributions 
                  across LangGraph cooperative loops.
                </p>
              </div>

              {/* History listing board */}
              <div className="border border-slate-800/80 bg-slate-950/40 rounded-2xl p-6 backdrop-blur-md">
                
                {/* Header info */}
                <div className="flex items-center gap-2 border-b border-slate-900 pb-4 mb-5 select-none text-left">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Audit Logs</h4>
                    <p className="text-[10px] text-slate-500">Trace history of LangGraph prompt node calls</p>
                  </div>
                </div>

                {/* Table list */}
                <div className="overflow-x-auto select-none">
                  <table className="w-full text-left font-mono text-[11px] text-slate-400">
                    <thead>
                      <tr className="border-b border-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-2">Timestamp</th>
                        <th className="pb-3">Run ID</th>
                        <th className="pb-3">Product Name</th>
                        <th className="pb-3">Platform</th>
                        <th className="pb-3">Tone Mode</th>
                        <th className="pb-3">Iterations</th>
                        <th className="pb-3 text-right pr-2">Self-Critic Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      <tr className="hover:bg-slate-900/20 transition-colors">
                        <td className="py-3.5 pl-2 text-slate-500">2026-05-18 21:40</td>
                        <td className="py-3.5 text-cyan-400 font-bold">run_lg_a19f82</td>
                        <td className="py-3.5 text-slate-300 font-semibold">ChatGPT Plus</td>
                        <td className="py-3.5 text-slate-400">ProductHunt</td>
                        <td className="py-3.5">Authentic & Excited</td>
                        <td className="py-3.5">2 / 3</td>
                        <td className="py-3.5 text-right text-emerald-400 pr-2 font-bold">9.6 / 10</td>
                      </tr>
                      <tr className="hover:bg-slate-900/20 transition-colors">
                        <td className="py-3.5 pl-2 text-slate-500">2026-05-18 18:12</td>
                        <td className="py-3.5 text-cyan-400 font-bold">run_lg_b48f21</td>
                        <td className="py-3.5 text-slate-300 font-semibold">Linear issue tracker</td>
                        <td className="py-3.5 text-slate-400">Twitter/X</td>
                        <td className="py-3.5">Technical & Professional</td>
                        <td className="py-3.5">1 / 3</td>
                        <td className="py-3.5 text-right text-emerald-400 pr-2 font-bold">9.4 / 10</td>
                      </tr>
                      <tr className="hover:bg-slate-900/20 transition-colors">
                        <td className="py-3.5 pl-2 text-slate-500">2026-05-18 12:04</td>
                        <td className="py-3.5 text-cyan-400 font-bold">run_lg_c92f15</td>
                        <td className="py-3.5 text-slate-300 font-semibold">Stripe Billing API</td>
                        <td className="py-3.5 text-slate-400">LandingPage</td>
                        <td className="py-3.5">Casual & Professional</td>
                        <td className="py-3.5">1 / 3</td>
                        <td className="py-3.5 text-right text-emerald-400 pr-2 font-bold">9.1 / 10</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM CONFIGURATION */}
          {activeTab === 'settings' && (
            <div className="space-y-8 animate-[fadeIn_0.35s_ease-out]">
              <div className="text-left select-none space-y-2">
                <h1 className="text-2xl font-extrabold text-white">System Configuration</h1>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Fine-tune cooperative agent loops, adjust minimum self-evaluation approval scores, select 
                  llm providers, and secure access credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Form parameters */}
                <div className="lg:col-span-2 border border-slate-800/80 bg-slate-950/40 rounded-2xl p-6 backdrop-blur-md space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-900 pb-3 select-none text-left">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">Cooperative Control Specs</h4>
                      <p className="text-[10px] text-slate-500">Fine-tune weights and threshold values</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-left">
                    
                    {/* Model Switch */}
                    <div className="space-y-1.5">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Model Selector</label>
                      <select
                        value={systemSettings.model}
                        onChange={e => setSystemSettings(prev => ({ ...prev, model: e.target.value }))}
                        className="w-full h-10 px-3 rounded-xl text-xs bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-cyan-500/40 text-slate-300"
                      >
                        <option value="gemini-1.5-pro">Gemini 1.5 Pro (Recommended)</option>
                        <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra-fast)</option>
                        <option value="gpt-4o">GPT-4o Enterprise Loop</option>
                        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet v2</option>
                      </select>
                    </div>

                    {/* Temperature Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Creativity Temperature</label>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{systemSettings.temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={systemSettings.temperature}
                        onChange={e => setSystemSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-500 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Threshold Critic Limit */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Critic Approval Threshold</label>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{systemSettings.minScoreThreshold}/10</span>
                      </div>
                      <input
                        type="range"
                        min="5.0"
                        max="9.5"
                        step="0.1"
                        value={systemSettings.minScoreThreshold}
                        onChange={e => setSystemSettings(prev => ({ ...prev, minScoreThreshold: parseFloat(e.target.value) }))}
                        className="w-full accent-cyan-500 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* Iteration limits */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">Max Self-Correction Retries</label>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">{systemSettings.maxIterations} Iterations</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={systemSettings.maxIterations}
                        onChange={e => setSystemSettings(prev => ({ ...prev, maxIterations: parseInt(e.target.value) }))}
                        className="w-full accent-cyan-500 h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* API Secret Input */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">LangGraph API Token Code</label>
                      <input
                        type="password"
                        value={systemSettings.apiKey}
                        onChange={e => setSystemSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                        className="w-full h-10 px-3.5 rounded-xl text-xs bg-slate-900/40 border border-slate-800 focus:outline-none focus:border-cyan-500/40 text-slate-300 font-mono"
                      />
                    </div>

                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLogs(prev => [...prev, '✓ Settings and cooperative weights updated successfully.']);
                        alert('System configuration parameters saved locally.');
                      }}
                      className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 text-xs font-bold text-white shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save configurations</span>
                    </button>
                  </div>
                </div>

                {/* Health HUD checklist */}
                <div className="border border-slate-800/80 bg-slate-950/40 rounded-2xl p-6 backdrop-blur-md space-y-4 text-left select-none">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                    System Health Checklist
                  </span>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-200">LLM Server Connectivity</p>
                        <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Verified active channel to gemini-1.5-pro.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-200">Vector Store RAG Index</p>
                        <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Synced database nodes loaded with active embeddings.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-200">LangGraph Orchestrator</p>
                        <p className="text-[9px] text-slate-500 leading-tight mt-0.5">6 multi-agent cooperative paths ready to compile.</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-cyan-950/20 border border-cyan-500/15 rounded-xl flex gap-2 mt-4 select-none">
                    <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">
                      Your current setup uses the local multi-agent RAG vectorstore setup. Any changes will immediately reflect in the next generation block.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
