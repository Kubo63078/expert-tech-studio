-- Quick Consultations Table for ExpertTech Studio
-- Add this to Supabase SQL Editor

-- Create quick consultations table
CREATE TABLE public.quick_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  expertise_field TEXT NOT NULL,
  idea_description TEXT NOT NULL,
  target_customers TEXT NOT NULL,
  budget_range TEXT NOT NULL,
  consultation_timing TEXT NOT NULL,
  main_concerns TEXT[],
  contact_preference TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONTACTED', 'SCHEDULED', 'COMPLETED', 'CANCELLED')),
  notes TEXT,
  contacted_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.quick_consultations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow admins and project managers to view all consultations
CREATE POLICY "Admins can view all quick consultations" ON public.quick_consultations
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.users 
      WHERE role IN ('ADMIN', 'PROJECT_MANAGER')
    )
  );

-- Allow admins and project managers to update consultations
CREATE POLICY "Admins can update quick consultations" ON public.quick_consultations
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM public.users 
      WHERE role IN ('ADMIN', 'PROJECT_MANAGER')
    )
  );

-- Allow anyone to insert new consultations (public form)
CREATE POLICY "Anyone can create quick consultations" ON public.quick_consultations
  FOR INSERT WITH CHECK (true);

-- Add trigger for updated_at
CREATE TRIGGER update_quick_consultations_updated_at 
  BEFORE UPDATE ON public.quick_consultations 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_quick_consultations_status ON public.quick_consultations(status);
CREATE INDEX idx_quick_consultations_created_at ON public.quick_consultations(created_at);
CREATE INDEX idx_quick_consultations_email ON public.quick_consultations(email);

-- Sample data for testing (optional)
INSERT INTO public.quick_consultations (
  name,
  email,
  phone,
  expertise_field,
  idea_description,
  target_customers,
  budget_range,
  consultation_timing,
  main_concerns,
  contact_preference,
  status
) VALUES (
  '김전문',
  'test@example.com',
  '010-1234-5678',
  '부동산',
  '강남지역 투자용 부동산 정보를 제공하는 AI 플랫폼을 만들고 싶습니다. 실시간 시세 분석과 투자 수익률 계산 기능을 포함하려고 합니다.',
  '개인 투자자',
  '3,000만원 - 5,000만원',
  '1주일 이내',
  ARRAY['기술적 구현 방법', '초기 고객 확보'],
  '전화 상담',
  'PENDING'
);