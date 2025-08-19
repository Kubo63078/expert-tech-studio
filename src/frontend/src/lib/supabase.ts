import { createClient } from '@supabase/supabase-js'

// 환경 변수를 직접 하드코딩하여 테스트
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://asxcaplxnbfrhyzpyreo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzeGNhcGx4bmJmcmh5enB5cmVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1OTQzNTYsImV4cCI6MjA3MTE3MDM1Nn0.AMhezsKrbIcmIhPtug1s9O4FbXNsHWgD9d_rDI1OmiM'

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