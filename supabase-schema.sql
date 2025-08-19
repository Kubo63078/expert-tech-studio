-- ExpertTech Studio Database Schema for Supabase
-- PostgreSQL version with enums and proper constraints

-- =====================================
-- ENUM DEFINITIONS
-- =====================================

CREATE TYPE user_role AS ENUM (
  'CLIENT',
  'PROJECT_MANAGER', 
  'DEVELOPER',
  'ADMIN'
);

CREATE TYPE client_status AS ENUM (
  'INITIAL',
  'ANALYZED',
  'IN_DEVELOPMENT',
  'LAUNCHED',
  'CANCELLED'
);

CREATE TYPE project_status AS ENUM (
  'PLANNING',
  'IN_PROGRESS',
  'REVIEW',
  'COMPLETED',
  'CANCELLED',
  'ON_HOLD'
);

CREATE TYPE recommendation_status AS ENUM (
  'DRAFT',
  'PRESENTED',
  'ACCEPTED',
  'REJECTED',
  'IN_DEVELOPMENT'
);

CREATE TYPE template_status AS ENUM (
  'DRAFT',
  'ACTIVE',
  'ARCHIVED'
);

CREATE TYPE task_status AS ENUM (
  'TODO',
  'IN_PROGRESS',
  'REVIEW',
  'DONE',
  'CANCELLED'
);

-- =====================================
-- CORE USER MANAGEMENT
-- =====================================

-- Note: Supabase Auth automatically creates auth.users table
-- We'll create a public.users table for additional user data

CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(), -- Links to auth.users
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'CLIENT',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- =====================================
-- CLIENT MANAGEMENT
-- =====================================

CREATE TABLE public.client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status client_status DEFAULT 'INITIAL',
  basic_info JSONB,
  expertise JSONB,
  business_intent JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.client_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.client_profiles
  FOR ALL USING (auth.uid() = user_id);

-- =====================================
-- AI RECOMMENDATION SYSTEM
-- =====================================

CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  business_idea JSONB,
  business_model JSONB,
  implementation_plan JSONB,
  market_analysis JSONB,
  feasibility_score JSONB,
  estimated_investment JSONB,
  risks JSONB,
  status recommendation_status DEFAULT 'DRAFT',
  feedback JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own recommendations" ON public.recommendations
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.client_profiles WHERE id = profile_id
    )
  );

CREATE TABLE public.business_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  industry TEXT NOT NULL,
  target_market TEXT,
  business_model JSONB,
  requirements JSONB,
  features JSONB,
  tech_stack JSONB,
  estimated_cost JSONB,
  timeline JSONB,
  success_metrics JSONB,
  risks JSONB,
  market_analysis JSONB,
  competitor_analysis JSONB,
  revenue_projection JSONB,
  implementation_steps JSONB,
  supporting_resources JSONB,
  tags JSONB,
  complexity TEXT DEFAULT 'moderate' CHECK (complexity IN ('simple', 'moderate', 'complex')),
  status template_status DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.business_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Templates are public for now
CREATE POLICY "Templates are viewable by all authenticated users" ON public.business_templates
  FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================
-- PROJECT MANAGEMENT
-- =====================================

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  client_id UUID NOT NULL REFERENCES public.client_profiles(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  recommendation_id UUID REFERENCES public.recommendations(id) ON DELETE SET NULL,
  business_template JSONB,
  budget JSONB,
  timeline JSONB,
  requirements JSONB,
  deliverables JSONB,
  technologies JSONB,
  team JSONB,
  milestones JSONB,
  risks JSONB,
  status project_status DEFAULT 'PLANNING',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their projects" ON public.projects
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM public.client_profiles WHERE id = client_id
    ) OR auth.uid() = manager_id
  );

CREATE TABLE public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  status task_status DEFAULT 'TODO',
  due_date TIMESTAMP WITH TIME ZONE,
  estimated_hours INTEGER,
  tags JSONB,
  dependencies JSONB,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view tasks for their projects" ON public.project_tasks
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM public.projects 
      WHERE auth.uid() IN (
        SELECT user_id FROM public.client_profiles WHERE id = client_id
      ) OR auth.uid() = manager_id
    ) OR auth.uid() = assignee_id
  );

-- =====================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_client_profiles_updated_at BEFORE UPDATE ON public.client_profiles 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at BEFORE UPDATE ON public.recommendations 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_business_templates_updated_at BEFORE UPDATE ON public.business_templates 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_project_tasks_updated_at BEFORE UPDATE ON public.project_tasks 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =====================================
-- SAMPLE DATA (Optional)
-- =====================================

-- Insert some sample business templates
INSERT INTO public.business_templates (
  title, 
  description, 
  industry, 
  business_model,
  complexity,
  tags
) VALUES 
(
  '온라인 쇼핑몰 창업',
  '중장년층을 위한 전문 온라인 쇼핑몰 구축',
  '전자상거래',
  '{"type": "B2C", "revenue_streams": ["product_sales", "delivery_fees"]}',
  'moderate',
  '["ecommerce", "retail", "online"]'
),
(
  '컨설팅 서비스',
  '전문 지식을 활용한 컨설팅 서비스 사업',
  '서비스업',
  '{"type": "B2B", "revenue_streams": ["hourly_consulting", "project_based"]}',
  'simple',
  '["consulting", "service", "expertise"]'
);