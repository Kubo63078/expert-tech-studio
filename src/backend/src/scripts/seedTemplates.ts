/**
 * Business Template Seed Data
 * Populates the database with initial business templates
 */

import { db } from '../services/database';
import { TemplateStatus } from '../types';
import logger from '../utils/logger';

const businessTemplates = [
  {
    title: 'AI-Powered Financial Advisory Platform',
    description: 'Digital financial advisory service leveraging AI to provide personalized investment guidance and portfolio management for individuals and small businesses.',
    industry: 'Finance',
    targetMarket: 'Small businesses and individual investors',
    businessModel: ['SaaS', 'Advisory Services'],
    requirements: {
      technical: ['AI/ML expertise', 'Financial domain knowledge', 'Web development'],
      legal: ['Financial advisory license', 'Data protection compliance', 'Investment regulations'],
      business: ['Financial industry experience', 'Client relationship management'],
    },
    features: [
      'Automated portfolio analysis',
      'Risk assessment tools',
      'Investment recommendations',
      'Real-time market data integration',
      'Client dashboard and reporting',
      'Compliance tracking',
    ],
    techStack: {
      frontend: ['React', 'TypeScript', 'Chart.js'],
      backend: ['Node.js', 'Python', 'PostgreSQL'],
      ai: ['TensorFlow', 'Scikit-learn', 'Financial APIs'],
      infrastructure: ['AWS/Azure', 'Docker', 'Redis'],
    },
    estimatedCost: {
      initial: 80000000, // 80M KRW
      monthly: 15000000, // 15M KRW
      breakdown: {
        development: 50000000,
        licensing: 10000000,
        marketing: 20000000,
      },
    },
    timeline: {
      total: '4 months',
      phases: [
        { name: 'Platform Development', duration: '2 months' },
        { name: 'Compliance & Testing', duration: '1 month' },
        { name: 'Launch & Marketing', duration: '1 month' },
      ],
    },
    successMetrics: [
      'Customer acquisition cost < $200',
      'Monthly recurring revenue growth > 20%',
      'Customer retention rate > 85%',
      'Platform uptime > 99.5%',
    ],
    risks: [
      {
        type: 'Regulatory',
        description: 'Financial regulations and compliance requirements',
        impact: 'High',
        mitigation: 'Partner with legal experts, obtain necessary licenses',
      },
      {
        type: 'Competition',
        description: 'Established financial advisory firms',
        impact: 'Medium',
        mitigation: 'Focus on niche market and AI differentiation',
      },
    ],
    marketAnalysis: {
      marketSize: '$2.3B in Korea',
      growthRate: '15% annually',
      competitors: ['Traditional advisory firms', 'Robo-advisors'],
      opportunity: 'AI-powered personalization for SMB market',
    },
    competitorAnalysis: [
      {
        name: 'Traditional Financial Advisors',
        strengths: ['Personal relationships', 'Industry credibility'],
        weaknesses: ['High costs', 'Limited scalability'],
        differentiation: 'AI automation and lower costs',
      },
    ],
    revenueProjection: {
      year1: 200000000, // 200M KRW
      year2: 500000000, // 500M KRW
      year3: 1000000000, // 1B KRW
      breakEvenMonth: 12,
    },
    implementationSteps: [
      'Market research and business plan',
      'Technical architecture design',
      'MVP development and testing',
      'Regulatory compliance setup',
      'Beta testing with select clients',
      'Full platform launch',
    ],
    supportingResources: {
      documentation: ['Financial regulations guide', 'API documentation'],
      training: ['AI/ML courses', 'Financial advisory certification'],
      partnerships: ['Financial data providers', 'Compliance consultants'],
    },
    tags: ['FinTech', 'AI', 'Investment', 'Advisory', 'SaaS'],
    complexity: 'complex',
    status: TemplateStatus.ACTIVE,
  },
  {
    title: 'Telemedicine Platform',
    description: 'Digital health platform connecting patients with healthcare providers through video consultations, health monitoring, and AI-assisted diagnosis.',
    industry: 'Healthcare',
    targetMarket: 'Chronic disease patients and elderly care',
    businessModel: ['Platform', 'Consultation Fees'],
    requirements: {
      technical: ['Healthcare IT expertise', 'Security compliance', 'Mobile development'],
      legal: ['Medical practice licenses', 'HIPAA compliance', 'Telemedicine regulations'],
      business: ['Healthcare industry experience', 'Provider network'],
    },
    features: [
      'Video consultation platform',
      'Health record management',
      'Prescription management',
      'Appointment scheduling',
      'AI symptom checker',
      'Health monitoring integration',
    ],
    techStack: {
      frontend: ['React Native', 'Flutter', 'WebRTC'],
      backend: ['Node.js', 'Express', 'MongoDB'],
      security: ['End-to-end encryption', 'HIPAA compliance tools'],
      infrastructure: ['AWS HIPAA', 'CDN', 'Load balancers'],
    },
    estimatedCost: {
      initial: 120000000, // 120M KRW
      monthly: 20000000, // 20M KRW
      breakdown: {
        development: 80000000,
        compliance: 25000000,
        marketing: 15000000,
      },
    },
    timeline: {
      total: '6 months',
      phases: [
        { name: 'Platform Development', duration: '3 months' },
        { name: 'Provider Onboarding', duration: '2 months' },
        { name: 'Market Launch', duration: '1 month' },
      ],
    },
    successMetrics: [
      'Patient satisfaction score > 4.5/5',
      'Provider utilization rate > 70%',
      'Platform availability > 99.9%',
      'Average consultation rating > 4.0/5',
    ],
    risks: [
      {
        type: 'Regulatory',
        description: 'Healthcare regulations and patient privacy',
        impact: 'High',
        mitigation: 'Ensure HIPAA compliance, work with legal advisors',
      },
      {
        type: 'Provider Adoption',
        description: 'Difficulty recruiting healthcare providers',
        impact: 'Medium',
        mitigation: 'Competitive compensation, streamlined onboarding',
      },
    ],
    marketAnalysis: {
      marketSize: '$5.7B in Korea',
      growthRate: '23% annually',
      competitors: ['Hospital telehealth systems', 'Telemedicine apps'],
      opportunity: 'Chronic care and elderly market focus',
    },
    competitorAnalysis: [
      {
        name: 'Hospital Systems',
        strengths: ['Established provider network', 'Patient trust'],
        weaknesses: ['Limited technology', 'High costs'],
        differentiation: 'Modern platform with AI features',
      },
    ],
    revenueProjection: {
      year1: 150000000, // 150M KRW
      year2: 400000000, // 400M KRW
      year3: 800000000, // 800M KRW
      breakEvenMonth: 18,
    },
    implementationSteps: [
      'Healthcare market research',
      'Regulatory compliance planning',
      'Platform development and testing',
      'Provider recruitment and training',
      'Pilot program with select patients',
      'Full market launch',
    ],
    supportingResources: {
      documentation: ['HIPAA compliance guide', 'Telemedicine regulations'],
      training: ['Healthcare IT certification', 'Medical device regulations'],
      partnerships: ['Healthcare providers', 'Insurance companies'],
    },
    tags: ['HealthTech', 'Telemedicine', 'AI', 'Platform', 'Digital Health'],
    complexity: 'complex',
    status: TemplateStatus.ACTIVE,
  },
  {
    title: 'Real Estate Investment Analysis Platform',
    description: 'PropTech platform providing AI-driven property valuation, investment analysis, and portfolio management for real estate investors.',
    industry: 'Real Estate',
    targetMarket: 'Real estate investors and property managers',
    businessModel: ['SaaS', 'Transaction Fees'],
    requirements: {
      technical: ['Data analytics', 'Real estate expertise', 'GIS systems'],
      legal: ['Real estate regulations', 'Data licensing'],
      business: ['Real estate industry connections', 'Market knowledge'],
    },
    features: [
      'Property valuation algorithms',
      'Market trend analysis',
      'Investment ROI calculator',
      'Portfolio management dashboard',
      'Property comparison tools',
      'Market alerts and notifications',
    ],
    techStack: {
      frontend: ['Vue.js', 'D3.js', 'Mapbox'],
      backend: ['Python', 'Django', 'PostgreSQL'],
      analytics: ['Pandas', 'NumPy', 'Machine Learning'],
      infrastructure: ['GCP', 'BigQuery', 'Redis'],
    },
    estimatedCost: {
      initial: 90000000, // 90M KRW
      monthly: 12000000, // 12M KRW
      breakdown: {
        development: 60000000,
        dataLicensing: 20000000,
        marketing: 10000000,
      },
    },
    timeline: {
      total: '6 months',
      phases: [
        { name: 'Data Platform Build', duration: '3 months' },
        { name: 'Analytics Engine', duration: '2 months' },
        { name: 'Market Launch', duration: '1 month' },
      ],
    },
    successMetrics: [
      'Property analysis accuracy > 95%',
      'User engagement > 3 sessions/week',
      'Customer lifetime value > $2,000',
      'Platform reliability > 99%',
    ],
    risks: [
      {
        type: 'Data Quality',
        description: 'Accuracy of real estate data sources',
        impact: 'Medium',
        mitigation: 'Multiple data sources and validation',
      },
      {
        type: 'Market Volatility',
        description: 'Real estate market fluctuations',
        impact: 'Medium',
        mitigation: 'Diversified analysis models',
      },
    ],
    marketAnalysis: {
      marketSize: '$3.8B in Korea',
      growthRate: '12% annually',
      competitors: ['Traditional appraisal firms', 'Real estate platforms'],
      opportunity: 'AI-powered analytics for individual investors',
    },
    competitorAnalysis: [
      {
        name: 'Traditional Appraisal Services',
        strengths: ['Industry experience', 'Regulatory approval'],
        weaknesses: ['Manual processes', 'High costs'],
        differentiation: 'Automated AI-driven analysis',
      },
    ],
    revenueProjection: {
      year1: 180000000, // 180M KRW
      year2: 350000000, // 350M KRW
      year3: 600000000, // 600M KRW
      breakEvenMonth: 15,
    },
    implementationSteps: [
      'Real estate data aggregation setup',
      'AI model development and training',
      'Platform interface development',
      'Beta testing with investors',
      'Market validation and feedback',
      'Commercial launch',
    ],
    supportingResources: {
      documentation: ['Real estate data APIs', 'Property analysis guides'],
      training: ['PropTech courses', 'Real estate investment training'],
      partnerships: ['Data providers', 'Real estate agencies'],
    },
    tags: ['PropTech', 'Real Estate', 'AI', 'Investment', 'Analytics'],
    complexity: 'moderate',
    status: TemplateStatus.ACTIVE,
  },
  {
    title: 'Digital Consulting Platform',
    description: 'Scalable consulting platform for SMB digital transformation with AI-assisted frameworks, automated assessments, and project management.',
    industry: 'Consulting',
    targetMarket: 'Small and medium businesses',
    businessModel: ['Platform Subscription', 'Project Services'],
    requirements: {
      technical: ['Business process expertise', 'Platform development', 'AI/automation'],
      legal: ['Consulting regulations', 'Client confidentiality'],
      business: ['Consulting experience', 'Industry expertise'],
    },
    features: [
      'Digital readiness assessment',
      'Customized transformation roadmaps',
      'Project management tools',
      'Knowledge base and templates',
      'Client collaboration portal',
      'Progress tracking and reporting',
    ],
    techStack: {
      frontend: ['React', 'Material-UI', 'Chart.js'],
      backend: ['Node.js', 'Express', 'MongoDB'],
      automation: ['Process automation tools', 'AI frameworks'],
      infrastructure: ['AWS', 'Docker', 'CI/CD'],
    },
    estimatedCost: {
      initial: 60000000, // 60M KRW
      monthly: 10000000, // 10M KRW
      breakdown: {
        development: 40000000,
        contentCreation: 10000000,
        marketing: 10000000,
      },
    },
    timeline: {
      total: '6 months',
      phases: [
        { name: 'Framework Development', duration: '2 months' },
        { name: 'Platform Build', duration: '2 months' },
        { name: 'Client Acquisition', duration: '2 months' },
      ],
    },
    successMetrics: [
      'Client success rate > 80%',
      'Platform adoption rate > 60%',
      'Customer satisfaction > 4.5/5',
      'Monthly recurring revenue growth > 15%',
    ],
    risks: [
      {
        type: 'Client Acquisition',
        description: 'Building trust in consulting market',
        impact: 'Medium',
        mitigation: 'Strong case studies and referrals',
      },
      {
        type: 'Scalability',
        description: 'Maintaining quality while scaling',
        impact: 'Low',
        mitigation: 'Quality control processes',
      },
    ],
    marketAnalysis: {
      marketSize: '$4.2B in Korea',
      growthRate: '18% annually',
      competitors: ['Traditional consulting firms', 'Digital agencies'],
      opportunity: 'Affordable digital transformation for SMBs',
    },
    competitorAnalysis: [
      {
        name: 'Traditional Consulting Firms',
        strengths: ['Industry reputation', 'Deep expertise'],
        weaknesses: ['High costs', 'Long timelines'],
        differentiation: 'Scalable platform with automation',
      },
    ],
    revenueProjection: {
      year1: 120000000, // 120M KRW
      year2: 300000000, // 300M KRW
      year3: 500000000, // 500M KRW
      breakEvenMonth: 10,
    },
    implementationSteps: [
      'Consulting framework development',
      'Assessment tool creation',
      'Platform development and testing',
      'Content library creation',
      'Pilot client engagement',
      'Scale and marketing launch',
    ],
    supportingResources: {
      documentation: ['Digital transformation guides', 'Best practices library'],
      training: ['Consulting methodology', 'Digital transformation certification'],
      partnerships: ['Technology vendors', 'Industry associations'],
    },
    tags: ['Consulting', 'Digital Transformation', 'SMB', 'Platform', 'Automation'],
    complexity: 'moderate',
    status: TemplateStatus.ACTIVE,
  },
  {
    title: 'Online Knowledge Commerce Platform',
    description: 'Digital platform to monetize professional expertise through online courses, one-on-one consulting, and membership communities.',
    industry: 'Education',
    targetMarket: 'Professionals seeking specialized knowledge',
    businessModel: ['Course Sales', 'Consulting Fees', 'Memberships'],
    requirements: {
      technical: ['E-learning platform', 'Payment processing', 'Content management'],
      legal: ['Educational content regulations', 'Payment compliance'],
      business: ['Subject matter expertise', 'Content creation skills'],
    },
    features: [
      'Course creation and delivery',
      'Live webinar capabilities',
      'One-on-one booking system',
      'Community forums',
      'Progress tracking',
      'Certificate generation',
    ],
    techStack: {
      frontend: ['Next.js', 'Tailwind CSS', 'Video.js'],
      backend: ['Node.js', 'Prisma', 'PostgreSQL'],
      payments: ['Stripe', 'PayPal integration'],
      infrastructure: ['Vercel', 'AWS S3', 'CDN'],
    },
    estimatedCost: {
      initial: 30000000, // 30M KRW
      monthly: 5000000, // 5M KRW
      breakdown: {
        development: 20000000,
        contentProduction: 5000000,
        marketing: 5000000,
      },
    },
    timeline: {
      total: '6 months',
      phases: [
        { name: 'Platform Development', duration: '2 months' },
        { name: 'Content Creation', duration: '2 months' },
        { name: 'Launch & Growth', duration: '2 months' },
      ],
    },
    successMetrics: [
      'Course completion rate > 70%',
      'Student satisfaction > 4.5/5',
      'Monthly revenue growth > 25%',
      'Community engagement > 3 posts/week',
    ],
    risks: [
      {
        type: 'Market Fit',
        description: 'Finding right audience for expertise',
        impact: 'Medium',
        mitigation: 'Market validation and MVP testing',
      },
      {
        type: 'Content Quality',
        description: 'Maintaining high-quality educational content',
        impact: 'Low',
        mitigation: 'Quality review processes',
      },
    ],
    marketAnalysis: {
      marketSize: '$1.5B in Korea',
      growthRate: '20% annually',
      competitors: ['Online course platforms', 'Coaching services'],
      opportunity: 'Specialized expertise and premium positioning',
    },
    competitorAnalysis: [
      {
        name: 'Generic Course Platforms',
        strengths: ['Large user base', 'Platform features'],
        weaknesses: ['Commoditized content', 'Low prices'],
        differentiation: 'Premium specialized expertise',
      },
    ],
    revenueProjection: {
      year1: 50000000, // 50M KRW
      year2: 150000000, // 150M KRW
      year3: 300000000, // 300M KRW
      breakEvenMonth: 8,
    },
    implementationSteps: [
      'Market research and niche identification',
      'Platform setup and customization',
      'Course content development',
      'Marketing and audience building',
      'Launch with initial course offering',
      'Scale content and community',
    ],
    supportingResources: {
      documentation: ['Course creation guides', 'Marketing strategies'],
      training: ['Online teaching certification', 'Content marketing'],
      partnerships: ['Marketing agencies', 'Industry experts'],
    },
    tags: ['EdTech', 'Online Courses', 'Knowledge Commerce', 'Consulting', 'Community'],
    complexity: 'simple',
    status: TemplateStatus.ACTIVE,
  },
];

async function seedTemplates() {
  try {
    logger.info('🌱 Starting template seed...');
    
    // Connect to database
    await db.connect();
    
    // Clear existing templates (optional - remove in production)
    await db.getClient().businessTemplate.deleteMany({});
    logger.info('🧹 Cleared existing templates');
    
    // Insert templates
    let insertedCount = 0;
    for (const template of businessTemplates) {
      try {
        await db.getClient().businessTemplate.create({
          data: template,
        });
        insertedCount++;
        logger.info(`✅ Created template: ${template.title}`);
      } catch (error) {
        logger.error(`❌ Failed to create template ${template.title}:`, error);
      }
    }
    
    logger.info(`🎉 Template seed completed! Created ${insertedCount}/${businessTemplates.length} templates`);
    
    // Disconnect
    await db.disconnect();
  } catch (error) {
    logger.error('❌ Template seed failed:', error);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seedTemplates();
}

export { seedTemplates, businessTemplates };