export interface Persona {
  name: string;
  role: string;
  experience_level?: string;
  pain_points?: string;
  goals?: string;
}

export interface ReviewScore {
  score: number;
  approved: boolean;
  feedback: string;
}

export interface Testimonial {
  id: string;
  brand_name: string;
  product_name: string;
  persona: Persona;
  text: string;
  review: ReviewScore;
  tone: string;
  platform: string;
  created_at: string;
}

export interface GenerationRequest {
  brand_name: string;
  product_name: string;
  industry: string;
  target_audience: string;
  tone: string;
  platform: string;
}

export interface StreamEvent {
  event: 'status' | 'completed' | 'error';
  message?: string;
  testimonials?: string[];
  reviews?: ReviewScore[];
  personas?: Persona[];
}

export interface WorkflowStep {
  id: string;
  label: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  icon: string;
  timestamp?: string;
}
