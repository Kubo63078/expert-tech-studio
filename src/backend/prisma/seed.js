"use strict";
/**
 * Database Seeding Script
 * Seeds the database with initial data for development
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const environment_1 = require("../src/config/environment");
const prisma = new client_1.PrismaClient();
/**
 * Hash password for test users
 */
const hashPassword = async (password) => {
    return bcryptjs_1.default.hash(password, environment_1.config.security.bcryptRounds);
};
/**
 * Seed Users
 */
const seedUsers = async () => {
    console.log('🌱 Seeding users...');
    const testPassword = await hashPassword('Test123!@#');
    const users = await prisma.user.createMany({
        data: [
            {
                email: 'admin@experttech.com',
                password: testPassword,
                role: client_1.UserRole.ADMIN,
            },
            {
                email: 'pm@experttech.com',
                password: testPassword,
                role: client_1.UserRole.PROJECT_MANAGER,
            },
            {
                email: 'dev@experttech.com',
                password: testPassword,
                role: client_1.UserRole.DEVELOPER,
            },
            {
                email: 'client1@example.com',
                password: testPassword,
                role: client_1.UserRole.CLIENT,
            },
            {
                email: 'client2@example.com',
                password: testPassword,
                role: client_1.UserRole.CLIENT,
            },
            {
                email: 'client3@example.com',
                password: testPassword,
                role: client_1.UserRole.CLIENT,
            },
        ],
        skipDuplicates: true,
    });
    console.log(`✅ Created ${users.count} users`);
};
/**
 * Seed Client Profiles
 */
const seedClientProfiles = async () => {
    console.log('🌱 Seeding client profiles...');
    // Get client users
    const clients = await prisma.user.findMany({
        where: { role: client_1.UserRole.CLIENT },
    });
    for (const client of clients) {
        await prisma.clientProfile.upsert({
            where: { userId: client.id },
            update: {},
            create: {
                userId: client.id,
                status: client_1.ClientStatus.INITIAL,
                basicInfo: {
                    name: client.email.includes('client1') ? '김철수' :
                        client.email.includes('client2') ? '이영희' : '박민수',
                    ageGroup: '46-50',
                    location: {
                        city: '서울특별시',
                        district: '강남구',
                    },
                    contact: {
                        email: client.email,
                        phone: '010-1234-5678',
                        preferredMethod: 'email',
                    },
                },
                expertise: client.email.includes('client1') ? {
                    industry: '부동산',
                    experience: 15,
                    specializations: ['투자 컨설팅', '시세 분석', '상권 분석'],
                    certifications: [
                        { name: '공인중개사', year: 2010 },
                        { name: '부동산투자상담사', year: 2015 },
                    ],
                    networkStrength: 4,
                    uniqueAdvantages: '강남 지역 20년 경력, 투자 성공률 85%',
                    successCases: [
                        '고객 A씨 오피스텔 투자 수익률 25% 달성',
                        '고객 B씨 아파트 매매 차익 5억원 실현',
                    ],
                } : client.email.includes('client2') ? {
                    industry: '세무',
                    experience: 12,
                    specializations: ['중소기업 세무', '절세 컨설팅', '세무조사 대응'],
                    certifications: [
                        { name: '세무사', year: 2012 },
                        { name: '회계사', year: 2008 },
                    ],
                    networkStrength: 3,
                    uniqueAdvantages: '중소기업 특화, 디지털 세무 시스템 구축 경험',
                    successCases: [
                        '중소기업 50곳 세금 20% 절감',
                        '세무조사 무혐의 100% 성공률',
                    ],
                } : {
                    industry: '법무',
                    experience: 18,
                    specializations: ['기업법무', '계약서 검토', '분쟁 조정'],
                    certifications: [
                        { name: '변호사', year: 2006 },
                        { name: '국제중재인', year: 2018 },
                    ],
                    networkStrength: 5,
                    uniqueAdvantages: '대기업 법무팀 출신, 국제계약 전문가',
                    successCases: [
                        '대기업 M&A 법무자문 성공',
                        '국제계약 분쟁 승소율 90%',
                    ],
                },
                businessIntent: {
                    interestAreas: ['본업연장', '온라인상담'],
                    serviceType: 'online_consulting',
                    targetCustomers: ['개인', '중소기업'],
                    operationScope: 'national',
                    timeCommitment: 6,
                    revenueGoal: 500, // 월 500만원
                    successCriteria: ['안정적수입', '전문성인정'],
                    concerns: ['기술부족', '마케팅'],
                },
            },
        });
    }
    console.log(`✅ Created client profiles for ${clients.length} clients`);
};
/**
 * Seed Business Templates
 */
const seedBusinessTemplates = async () => {
    console.log('🌱 Seeding business templates...');
    const templates = await prisma.businessTemplate.createMany({
        data: [
            {
                industry: '부동산',
                name: '부동산 투자 컨설팅 플랫폼',
                description: '개인 맞춤형 부동산 투자 분석 및 추천 서비스',
                features: {
                    core: ['시세 분석', '투자 시뮬레이션', '상담 예약', '포트폴리오 관리'],
                    premium: ['AI 투자 추천', '리스크 분석', '수익률 예측', 'VR 매물 투어'],
                },
                techStack: {
                    frontend: ['React', 'TypeScript', 'Tailwind CSS'],
                    backend: ['Node.js', 'PostgreSQL', 'Redis'],
                    external: ['부동산 시세 API', '지도 API', '결제 시스템'],
                },
                templateData: {
                    pages: ['홈', '시세검색', '투자분석', '상담예약', '포트폴리오'],
                    integrations: ['KB부동산 시세', '네이버 지도', '토스페이먼츠'],
                },
                estimatedCost: 15000000, // 1500만원
                estimatedTime: 8, // 8주
            },
            {
                industry: '세무',
                name: '중소기업 세무 자동화 시스템',
                description: '세무 업무 자동화 및 절세 컨설팅 플랫폼',
                features: {
                    core: ['세금 계산', '신고서 작성', '일정 관리', '고객 관리'],
                    premium: ['AI 절세 분석', '세무조사 대응', '실시간 세법 업데이트'],
                },
                techStack: {
                    frontend: ['Next.js', 'React', 'Chart.js'],
                    backend: ['Node.js', 'PostgreSQL', 'Python'],
                    external: ['국세청 API', '전자세금계산서 API'],
                },
                templateData: {
                    pages: ['대시보드', '세금계산', '신고관리', '고객관리', '보고서'],
                    integrations: ['홈택스 API', '더존 ERP', '카카오페이'],
                },
                estimatedCost: 20000000, // 2000만원
                estimatedTime: 10, // 10주
            },
            {
                industry: '법무',
                name: 'AI 법률 상담 플랫폼',
                description: '온라인 법률 상담 및 계약서 작성 지원 시스템',
                features: {
                    core: ['법률 상담', '계약서 작성', '판례 검색', '일정 관리'],
                    premium: ['AI 법률 분석', '계약서 리뷰', '분쟁 예측', '변호사 매칭'],
                },
                techStack: {
                    frontend: ['React', 'TypeScript', 'Material-UI'],
                    backend: ['Node.js', 'PostgreSQL', 'OpenAI API'],
                    external: ['법원 판례 API', '전자계약 시스템'],
                },
                templateData: {
                    pages: ['상담신청', '계약서작성', '판례검색', '사건관리', '수임료정산'],
                    integrations: ['대법원 판례 API', '전자인증', '법무법인 시스템'],
                },
                estimatedCost: 25000000, // 2500만원
                estimatedTime: 12, // 12주
            },
        ],
        skipDuplicates: true,
    });
    console.log(`✅ Created ${templates.count} business templates`);
};
/**
 * Seed Sample Recommendations
 */
const seedRecommendations = async () => {
    console.log('🌱 Seeding recommendations...');
    const clientProfiles = await prisma.clientProfile.findMany({
        include: { user: true },
    });
    for (const profile of clientProfiles) {
        const industry = profile.expertise?.industry || '일반';
        await prisma.recommendation.create({
            data: {
                clientId: profile.id,
                title: `${industry} 전문 온라인 플랫폼`,
                description: `${profile.basicInfo.name}님의 전문성을 활용한 맞춤형 온라인 비즈니스 솔루션`,
                businessModel: {
                    type: 'B2B2C 플랫폼',
                    targetMarket: '개인 및 중소기업',
                    revenueStreams: ['상담료', '구독료', '성과수수료'],
                    keyFeatures: [
                        '전문 상담 서비스',
                        'AI 기반 분석 도구',
                        '고객 관리 시스템',
                        '결제 및 정산 시스템',
                    ],
                },
                scores: {
                    marketPotential: Math.floor(Math.random() * 20) + 80, // 80-100
                    personalFit: Math.floor(Math.random() * 20) + 85, // 85-100
                    technicalFeasibility: Math.floor(Math.random() * 30) + 70, // 70-100
                    successProbability: Math.floor(Math.random() * 25) + 75, // 75-100
                },
                implementationPlan: {
                    phases: [
                        {
                            name: '기획 및 설계',
                            duration: '2주',
                            deliverables: ['요구사항 정의서', '화면 설계서', '시스템 아키텍처'],
                        },
                        {
                            name: '개발 및 구축',
                            duration: '6주',
                            deliverables: ['웹 플랫폼', 'AI 분석 시스템', '관리자 도구'],
                        },
                        {
                            name: '테스트 및 런칭',
                            duration: '2주',
                            deliverables: ['테스트 완료', '사용자 교육', '서비스 런칭'],
                        },
                    ],
                    totalDuration: '10주',
                },
                estimatedCost: Math.floor(Math.random() * 10000000) + 10000000, // 1000-2000만원
                estimatedTimelineWeeks: Math.floor(Math.random() * 4) + 8, // 8-12주
                status: 'active',
            },
        });
    }
    console.log(`✅ Created recommendations for ${clientProfiles.length} clients`);
};
/**
 * Seed Sample Projects
 */
const seedProjects = async () => {
    console.log('🌱 Seeding projects...');
    const recommendations = await prisma.recommendation.findMany({
        include: { client: { include: { user: true } } },
    });
    // Create a project for the first recommendation
    if (recommendations.length > 0) {
        const rec = recommendations[0];
        const project = await prisma.project.create({
            data: {
                clientId: rec.clientId,
                recommendationId: rec.id,
                projectNumber: 'PRJ-2024-001',
                name: `${rec.title} 개발 프로젝트`,
                description: `${rec.client.basicInfo.name}님을 위한 ${rec.title} 개발 및 런칭 프로젝트`,
                status: client_1.ProjectStatus.PLANNING,
                startDate: new Date(),
                endDate: new Date(Date.now() + rec.estimatedTimelineWeeks * 7 * 24 * 60 * 60 * 1000),
                metadata: {
                    priority: 'high',
                    complexity: 'medium',
                    clientRequirements: rec.businessModel,
                },
            },
        });
        // Create project phases
        const phases = [
            {
                name: '요구사항 분석 및 기획',
                description: '고객 요구사항 상세 분석 및 개발 계획 수립',
                order: 1,
                deliverables: ['요구사항 정의서', '기능 명세서', '화면 설계서'],
                dependencies: [],
            },
            {
                name: '시스템 설계 및 아키텍처',
                description: '시스템 아키텍처 설계 및 기술 스택 결정',
                order: 2,
                deliverables: ['시스템 아키텍처 문서', '데이터베이스 설계서', 'API 명세서'],
                dependencies: [],
            },
            {
                name: '프론트엔드 개발',
                description: '사용자 인터페이스 및 사용자 경험 구현',
                order: 3,
                deliverables: ['웹 애플리케이션', '반응형 UI', '사용자 대시보드'],
                dependencies: [],
            },
            {
                name: '백엔드 개발',
                description: '서버 및 데이터베이스 시스템 구현',
                order: 4,
                deliverables: ['API 서버', '데이터베이스', '인증 시스템'],
                dependencies: [],
            },
            {
                name: '테스트 및 QA',
                description: '시스템 테스트 및 품질 보증',
                order: 5,
                deliverables: ['테스트 결과서', '버그 수정', '성능 최적화'],
                dependencies: [],
            },
            {
                name: '배포 및 런칭',
                description: '프로덕션 환경 배포 및 서비스 런칭',
                order: 6,
                deliverables: ['프로덕션 배포', '사용자 교육', '모니터링 설정'],
                dependencies: [],
            },
        ];
        for (const phase of phases) {
            await prisma.projectPhase.create({
                data: {
                    ...phase,
                    projectId: project.id,
                },
            });
        }
        // Create project budget
        await prisma.projectBudget.create({
            data: {
                projectId: project.id,
                totalAmount: rec.estimatedCost,
                currency: 'KRW',
                breakdown: {
                    development: rec.estimatedCost * 0.7,
                    design: rec.estimatedCost * 0.15,
                    testing: rec.estimatedCost * 0.1,
                    management: rec.estimatedCost * 0.05,
                },
                isApproved: false,
            },
        });
        console.log(`✅ Created sample project: ${project.name}`);
    }
};
/**
 * Seed Audit Logs (Sample)
 */
const seedAuditLogs = async () => {
    console.log('🌱 Seeding audit logs...');
    const users = await prisma.user.findMany({ take: 3 });
    for (const user of users) {
        await prisma.auditLog.create({
            data: {
                userId: user.id,
                action: 'LOGIN',
                resource: 'User',
                resourceId: user.id,
                newData: {
                    email: user.email,
                    timestamp: new Date().toISOString(),
                },
                ip: '127.0.0.1',
                userAgent: 'Mozilla/5.0 (Test Environment)',
            },
        });
    }
    console.log('✅ Created sample audit logs');
};
/**
 * Seed Performance Metrics
 */
const seedMetrics = async () => {
    console.log('🌱 Seeding performance metrics...');
    const metrics = [
        { name: 'api_response_time', value: 245.5 },
        { name: 'db_query_time', value: 12.3 },
        { name: 'active_users', value: 15 },
        { name: 'project_success_rate', value: 0.85 },
        { name: 'client_satisfaction', value: 4.2 },
    ];
    for (const metric of metrics) {
        await prisma.metricData.create({
            data: {
                metricName: metric.name,
                value: metric.value,
                timestamp: new Date(),
                tags: {
                    environment: 'development',
                    source: 'seed_script',
                },
            },
        });
    }
    console.log(`✅ Created ${metrics.length} sample metrics`);
};
/**
 * Main Seed Function
 */
const main = async () => {
    console.log('🚀 Starting database seeding...');
    try {
        await seedUsers();
        await seedClientProfiles();
        await seedBusinessTemplates();
        await seedRecommendations();
        await seedProjects();
        await seedAuditLogs();
        await seedMetrics();
        console.log('✅ Database seeding completed successfully!');
        console.log('\n📋 Seeded data summary:');
        console.log('   - Users: Admin, PM, Developer, 3 Clients');
        console.log('   - Client profiles with detailed expertise');
        console.log('   - Business templates for 3 industries');
        console.log('   - AI recommendations for each client');
        console.log('   - Sample project with phases and budget');
        console.log('   - Audit logs and performance metrics');
        console.log('\n🔐 Test user credentials:');
        console.log('   Email: admin@experttech.com | Password: Test123!@#');
        console.log('   Email: pm@experttech.com | Password: Test123!@#');
        console.log('   Email: client1@example.com | Password: Test123!@#');
    }
    catch (error) {
        console.error('❌ Database seeding failed:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
};
// Run the seed script
main();
//# sourceMappingURL=seed.js.map