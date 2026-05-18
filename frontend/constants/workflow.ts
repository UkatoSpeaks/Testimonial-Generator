import { WorkflowStep } from '@/types/testimonial';

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'analyzing',
    label: 'Analyzing Product & Brand',
    description: 'RAG Retriever searching brand memory and analyzing context...',
    status: 'idle',
    icon: 'Search',
  },
  {
    id: 'personas',
    label: 'Generating Customer Personas',
    description: 'Persona Agent creating 3 hyper-targeted user profiles...',
    status: 'idle',
    icon: 'Users',
  },
  {
    id: 'writing',
    label: 'Writing Initial Testimonials',
    description: 'Writer Agent drafting emotionally authentic reviews...',
    status: 'idle',
    icon: 'PenTool',
  },
  {
    id: 'humanizing',
    label: 'Humanizing Content',
    description: 'Humanizer Agent breaking grammar patterns for hyper-realism...',
    status: 'idle',
    icon: 'Sparkles',
  },
  {
    id: 'reviewing',
    label: 'Reviewing Outputs',
    description: 'Reviewer Agent evaluating authentic metrics & assigning scores...',
    status: 'idle',
    icon: 'ShieldCheck',
  },
  {
    id: 'finalizing',
    label: 'Finalizing Results',
    description: 'Consolidating approved testimonials into custom layout...',
    status: 'idle',
    icon: 'Award',
  },
];
