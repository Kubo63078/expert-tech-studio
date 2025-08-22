import { createClient } from '@supabase/supabase-js'

// 환경 변수에서 Supabase 설정 가져오기
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 디버깅을 위한 로그
console.log('Environment variables:', {
  'import.meta.env.VITE_SUPABASE_URL': import.meta.env.VITE_SUPABASE_URL,
  'import.meta.env.VITE_SUPABASE_ANON_KEY': import.meta.env.VITE_SUPABASE_ANON_KEY ? '***' + import.meta.env.VITE_SUPABASE_ANON_KEY.slice(-4) : 'undefined',
  supabaseUrl,
  supabaseAnonKey: supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'undefined'
})

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 타입 정의들
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'CLIENT' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'ADMIN'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          role?: 'CLIENT' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'ADMIN'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'CLIENT' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'ADMIN'
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      client_profiles: {
        Row: {
          id: string
          user_id: string
          status: 'INITIAL' | 'ANALYZED' | 'IN_DEVELOPMENT' | 'LAUNCHED' | 'CANCELLED'
          basic_info: any // JSON
          expertise?: any // JSON
          business_intent?: any // JSON
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'INITIAL' | 'ANALYZED' | 'IN_DEVELOPMENT' | 'LAUNCHED' | 'CANCELLED'
          basic_info: any
          expertise?: any
          business_intent?: any
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'INITIAL' | 'ANALYZED' | 'IN_DEVELOPMENT' | 'LAUNCHED' | 'CANCELLED'
          basic_info?: any
          expertise?: any
          business_intent?: any
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      quick_consultations: {
        Row: {
          id: string
          name: string
          email: string
          phone?: string
          expertise_field: string
          idea_description: string
          target_customers: string
          budget_range: string
          consultation_timing: string
          main_concerns: string[]
          contact_preference: string
          status: 'PENDING' | 'CONTACTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
          notes?: string
          contacted_at?: string
          scheduled_at?: string
          completed_at?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string
          expertise_field: string
          idea_description: string
          target_customers: string
          budget_range: string
          consultation_timing: string
          main_concerns: string[]
          contact_preference: string
          status?: 'PENDING' | 'CONTACTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
          notes?: string
          contacted_at?: string
          scheduled_at?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          expertise_field?: string
          idea_description?: string
          target_customers?: string
          budget_range?: string
          consultation_timing?: string
          main_concerns?: string[]
          contact_preference?: string
          status?: 'PENDING' | 'CONTACTED' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
          notes?: string
          contacted_at?: string
          scheduled_at?: string
          completed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'CLIENT' | 'PROJECT_MANAGER' | 'DEVELOPER' | 'ADMIN'
      client_status: 'INITIAL' | 'ANALYZED' | 'IN_DEVELOPMENT' | 'LAUNCHED' | 'CANCELLED'
      project_status: 'PLANNING' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD'
      recommendation_status: 'DRAFT' | 'PRESENTED' | 'ACCEPTED' | 'REJECTED' | 'IN_DEVELOPMENT'
      template_status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
      task_status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED'
    }
  }
}