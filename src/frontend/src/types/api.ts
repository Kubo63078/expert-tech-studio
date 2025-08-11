export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ClientProfile {
  id: string;
  userId: string;
  status: 'INITIAL' | 'ANALYZED' | 'IN_DEVELOPMENT' | 'LAUNCHED' | 'CANCELLED';
  basicInfo: {
    name: string;
    age: number;
    occupation: string;
    experience: number;
    location: string;
  };
  expertise?: {
    industry: string;
    skills: string[];
    achievements: string[];
    network: string[];
  };
  businessIntent?: {
    goals: string[];
    budget: number;
    timeline: string;
    targetMarket: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessRecommendation {
  id: string;
  profileId: string;
  businessIdea: {
    title: string;
    description: string;
    industry: string;
    targetMarket: string;
  };
  businessModel: {
    revenueStreams: string[];
    keyResources: string[];
    valueProposition: string;
  };
  implementationPlan: {
    phases: Array<{
      name: string;
      duration: string;
      tasks: string[];
      deliverables: string[];
    }>;
    totalTimeline: string;
    estimatedCost: number;
  };
  marketAnalysis: {
    marketSize: string;
    competition: string;
    opportunities: string[];
    risks: string[];
  };
  feasibilityScore: {
    technical: number;
    market: number;
    financial: number;
    overall: number;
  };
  status: 'DRAFT' | 'PRESENTED' | 'ACCEPTED' | 'REJECTED' | 'IN_DEVELOPMENT';
  createdAt: string;
  updatedAt: string;
}

export interface BusinessTemplate {
  id: string;
  title: string;
  description: string;
  industry: string;
  targetMarket?: string;
  businessModel: Array<{
    tier: string;
    price: number;
    features: string[];
  }>;
  requirements?: string[];
  features?: string[];
  techStack?: {
    frontend?: string[];
    backend?: string[];
    database?: string[];
    [key: string]: any;
  };
  estimatedCost?: {
    development: number;
    monthly_operations: number;
    [key: string]: any;
  };
  timeline?: {
    planning: number;
    development: number;
    testing: number;
    launch: number;
  };
  complexity: 'simple' | 'moderate' | 'complex';
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}