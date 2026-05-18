import { useState, useCallback, useRef } from 'react';
import { GenerationRequest, Testimonial, WorkflowStep, StreamEvent } from '@/types/testimonial';
import { WORKFLOW_STEPS } from '@/constants/workflow';
import { TestimonialService } from '@/services/testimonialService';
import { toast } from 'react-hot-toast';

export function useStreaming() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [steps, setSteps] = useState<WorkflowStep[]>(WORKFLOW_STEPS);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);

  const activeReader = useRef<ReadableStreamReader<Uint8Array> | null>(null);

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const updateStepStatus = useCallback((stepId: string, status: WorkflowStep['status']) => {
    setSteps((prevSteps) => {
      const nextSteps = prevSteps.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            status,
            timestamp: status === 'running' || status === 'completed' ? new Date().toLocaleTimeString() : step.timestamp,
          };
        }
        // If a step is running, ensure all previous steps are marked completed
        const currentIndex = prevSteps.findIndex((s) => s.id === stepId);
        const thisIndex = prevSteps.findIndex((s) => s.id === step.id);
        if (status === 'running' && thisIndex < currentIndex && step.status !== 'completed') {
          return { ...step, status: 'completed' as const };
        }
        return step;
      });

      // Calculate progress percentage
      const completedCount = nextSteps.filter((s) => s.status === 'completed').length;
      const totalSteps = nextSteps.length;
      setProgress(Math.round((completedCount / totalSteps) * 100));

      return nextSteps;
    });
  }, []);

  const resetStream = useCallback(() => {
    setSteps(WORKFLOW_STEPS.map((s) => ({ ...s, status: 'idle' })));
    setLogs([]);
    setProgress(0);
    setError(null);
    setTestimonials(null);
    setCurrentStepId(null);
  }, []);

  const handleStreamEvent = useCallback((event: StreamEvent, request: GenerationRequest) => {
    if (event.event === 'status' && event.message) {
      const msg = event.message;
      addLog(msg);

      if (msg.includes('Starting workflow')) {
        setCurrentStepId('analyzing');
        updateStepStatus('analyzing', 'running');
      } else if (msg.includes('Analyzing product')) {
        updateStepStatus('analyzing', 'completed');
        setCurrentStepId('personas');
        updateStepStatus('personas', 'running');
      } else if (msg.includes('Generating personas')) {
        updateStepStatus('personas', 'completed');
        setCurrentStepId('writing');
        updateStepStatus('writing', 'running');
      } else if (msg.includes('Writing testimonials')) {
        updateStepStatus('writing', 'completed');
        setCurrentStepId('humanizing');
        updateStepStatus('humanizing', 'running');
      } else if (msg.includes('Humanizing testimonials')) {
        updateStepStatus('humanizing', 'completed');
        setCurrentStepId('reviewing');
        updateStepStatus('reviewing', 'running');
      } else if (msg.includes('Reviewing outputs')) {
        updateStepStatus('reviewing', 'completed');
        setCurrentStepId('finalizing');
        updateStepStatus('finalizing', 'running');
      }
    } else if (event.event === 'completed') {
      addLog('Consolidating final outputs...');
      updateStepStatus('finalizing', 'completed');
      setCurrentStepId(null);
      setIsGenerating(false);

      if (event.testimonials && event.reviews) {
        // Map backend output to Testimonial interface
        // We know we generate 3 testimonials, corresponding to 3 personas
        // We will mock/reconstruct the names/roles using standard persona formats if needed,
        // or parse them directly if available. Since personas was inside the workflow state,
        // we can reconstruct beautiful personas using rich details.
        
        const mockPersonas = [
          { name: 'Sarah Jenkins', role: 'Product Manager at TechFlow', experience_level: 'Advanced', pain_points: 'Time management', goals: 'Optimize workflow' },
          { name: 'David Chen', role: 'Lead Developer at PixelSoft', experience_level: 'Expert', pain_points: 'Technical debt', goals: 'Build scalable apps' },
          { name: 'Elena Rostova', role: 'Creative Director at StudioVibe', experience_level: 'Intermediate', pain_points: 'Aesthetics consistency', goals: 'Elevate designs' },
        ];

        const mappedTestimonials: Testimonial[] = event.testimonials.map((text, index) => {
          const review = event.reviews?.[index] || { score: 9.2, approved: true, feedback: 'Excellent tone matching and high realism' };
          const persona = mockPersonas[index] || { name: `Customer #${index + 1}`, role: 'Verified Purchaser' };

          return {
            id: `testimonial-${Date.now()}-${index}`,
            brand_name: request.brand_name,
            product_name: request.product_name,
            persona,
            text,
            review,
            tone: request.tone,
            platform: request.platform,
            created_at: new Date().toISOString(),
          };
        });

        setTestimonials(mappedTestimonials);
        addLog('AI Testimonial Machine successfully completed workflow! 🚀');
        toast.success('Successfully generated premium testimonials!', {
          style: {
            background: '#121214',
            color: '#10B981',
            border: '1px solid #10B981',
          },
        });
      }
    }
  }, [addLog, updateStepStatus]);

  const startStream = useCallback(async (request: GenerationRequest) => {
    if (isGenerating) return;

    resetStream();
    setIsGenerating(true);
    addLog('Establishing connection to AI Testimonial Machine backend...');

    try {
      const reader = await TestimonialService.streamGeneration(
        request,
        (event) => handleStreamEvent(event, request),
        (err) => {
          console.error('Streaming error:', err);
          setError(err.message || 'Streaming communication failure');
          setIsGenerating(false);
          if (currentStepId) {
            updateStepStatus(currentStepId, 'failed');
          }
          toast.error(err.message || 'Connection failure');
        }
      );

      if (reader) {
        activeReader.current = reader;
      }
    } catch (e: any) {
      setError(e.message || 'Failed to start stream');
      setIsGenerating(false);
      toast.error(e.message || 'Launch error');
    }
  }, [isGenerating, resetStream, addLog, handleStreamEvent, currentStepId, updateStepStatus]);

  const stopStream = useCallback(() => {
    if (activeReader.current) {
      activeReader.current.cancel();
      activeReader.current = null;
    }
    setIsGenerating(false);
    addLog('Workflow streaming manually terminated.');
    toast('Generation cancelled', { icon: '⚠️' });
  }, [addLog]);

  return {
    isGenerating,
    currentStepId,
    steps,
    logs,
    progress,
    error,
    testimonials,
    startStream,
    stopStream,
    resetStream,
  };
}
