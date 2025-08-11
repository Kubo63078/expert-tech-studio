/**
 * TypeScript Type Definitions
 * Centralized type definitions for the application
 */

import { Request } from 'express';

/**
 * User Types
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CLIENT = 'CLIENT',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  DEVELOPER = 'DEVELOPER',
  ADMIN = 'ADMIN',
}

export interface UserWithProfile extends User {
  clientProfile?: ClientProfile;
}

/**
 * Client Profile Types
 */
export interface ClientProfile {
  id: string;
  userId: string;
  basicInfo: BasicInfo;
  expertise: ExpertiseInfo;
  businessIntent: BusinessIntentInfo;
  aiAnalysis?: AIAnalysisResult;
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface BasicInfo {
  name: string;
  ageGroup: '40-45' | '46-50' | '51-55' | '56-60' | '60+';
  location: {
    city: string;
    district: string;
  };
  contact: {
    email: string;
    phone?: string;
    preferredMethod: 'email' | 'phone' | 'kakao' | 'in_person';
  };
}

export interface ExpertiseInfo {
  industry: string;
  experience: number;
  specializations: string[];
  certifications: Certification[];
  networkStrength: 1 | 2 | 3 | 4 | 5;
  uniqueAdvantages: string;
  successCases?: string[];
}

export interface Certification {
  name: string;
  year: number;
  authority?: string;
}

export interface BusinessIntentInfo {
  interestAreas: string[];
  serviceType: 'online_consulting' | 'offline_consulting' | 'product_sales' | 'education' | 'other';
  targetCustomers: string[];
  operationScope: 'local' | 'regional' | 'national' | 'global';
  timeCommitment: number; // hours per day
  revenueGoal: number; // monthly goal in KRW
  successCriteria: string[];
  concerns: string[];
}

export enum ClientStatus {
  INITIAL = 'INITIAL',
  ANALYZED = 'ANALYZED',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  LAUNCHED = 'LAUNCHED',
  CANCELLED = 'CANCELLED',
}

/**
 * AI Analysis Types
 */
export interface AIAnalysisResult {
  expertiseScore: number; // 0-100
  marketFitScore: number; // 0-100
  successProbability: number; // 0-100
  recommendedBusinessModels: BusinessModel[];
  marketInsights: string[];
  recommendations: string[];
  risks: string[];
  analyzedAt: Date;
}

export interface BusinessModel {
  id: string;
  title: string;
  description: string;
  targetMarket: string;
  keyFeatures: string[];
  revenueModel: string;
  competitiveAdvantage: string;
  implementationComplexity: 'low' | 'medium' | 'high';
  estimatedCost: number;
  estimatedTimeline: number; // in weeks
  requiredSkills: string[];
}

/**
 * Project Types
 */
export interface Project {
  id: string;
  clientId: string;
  recommendationId: string;
  status: ProjectStatus;
  phases: ProjectPhase[];
  team: TeamMember[];
  timeline: Timeline;
  budget: Budget;
  deliverables: Deliverable[];
  communications: Communication[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ProjectStatus {
  PLANNING = 'PLANNING',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  REVIEW = 'REVIEW',
  DEPLOYED = 'DEPLOYED',
  MAINTENANCE = 'MAINTENANCE',
  CANCELLED = 'CANCELLED',
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  startDate: Date;
  endDate: Date;
  deliverables: string[];
  dependencies: string[];
}

export interface TeamMember {
  userId: string;
  role: 'pm' | 'developer' | 'designer' | 'consultant';
  responsibilities: string[];
  allocation: number; // percentage
}

export interface Timeline {
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
}

export interface Milestone {
  name: string;
  date: Date;
  description: string;
  status: 'pending' | 'completed';
}

export interface Budget {
  totalAmount: number;
  currency: 'KRW' | 'USD';
  breakdown: BudgetItem[];
  paymentSchedule: PaymentSchedule[];
}

export interface BudgetItem {
  category: string;
  amount: number;
  description: string;
}

export interface PaymentSchedule {
  phase: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
}

export interface Deliverable {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'code' | 'design' | 'deployment';
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  dueDate: Date;
  files: FileInfo[];
}

export interface FileInfo {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
}

export interface Communication {
  id: string;
  type: 'email' | 'meeting' | 'call' | 'message';
  subject: string;
  content: string;
  participants: string[];
  createdAt: Date;
  attachments?: FileInfo[];
}

/**
 * API Response Types
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    pagination?: PaginationInfo;
  };
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Authentication Types
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface AuthenticatedRequest extends Request {
  user: User;
  token: string;
}

/**
 * Validation Types
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

/**
 * External Service Types
 */
export interface OpenAIRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  maxTokens?: number;
}

export interface StripeCustomer {
  id: string;
  email: string;
  name: string;
  metadata: Record<string, string>;
}

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

/**
 * Utility Types
 */
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

/**
 * Database Types (Prisma extends)
 */
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateClientProfileInput = Omit<ClientProfile, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateClientProfileInput = Partial<Omit<ClientProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>;