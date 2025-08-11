import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const businessTemplates = [
  // 금융 업계 템플릿
  {
    title: 'AI 금융 자문 플랫폼',
    description: '개인화된 투자 조언과 포트폴리오 관리를 제공하는 AI 기반 금융 자문 서비스',
    industry: 'Finance',
    targetMarket: '개인 투자자, 중소기업',
    businessModel: JSON.stringify([
      { tier: 'Basic', price: 9900, features: ['기본 포트폴리오 분석', '투자 추천'] },
      { tier: 'Premium', price: 29900, features: ['실시간 시장 분석', '개인 맞춤 전략', '전문가 상담'] },
      { tier: 'Enterprise', price: 99900, features: ['기업 자산 관리', '위험 관리', '컴플라이언스 지원'] }
    ]),
    requirements: JSON.stringify(['금융 라이센스', '데이터 보안 인증', 'API 연동']),
    features: JSON.stringify(['실시간 시장 데이터', '포트폴리오 최적화', '위험 분석', '자동 리밸런싱']),
    techStack: JSON.stringify({
      frontend: ['React', 'TypeScript', 'Chart.js'],
      backend: ['Node.js', 'Python', 'PostgreSQL'],
      ai: ['TensorFlow', 'Pandas', 'Alpha Vantage API']
    }),
    estimatedCost: JSON.stringify({
      development: 50000000,
      monthly_operations: 5000000,
      licensing: 10000000
    }),
    timeline: JSON.stringify({
      planning: 2,
      development: 12,
      testing: 4,
      launch: 2
    }),
    complexity: 'complex'
  },

  // 부동산 업계 템플릿
  {
    title: '스마트 부동산 투자 플랫폼',
    description: '데이터 기반 부동산 투자 분석 및 관리 시스템',
    industry: 'RealEstate',
    targetMarket: '부동산 투자자, 중개업체',
    businessModel: JSON.stringify([
      { tier: 'Starter', price: 19900, features: ['기본 시장 분석', '투자 계산기'] },
      { tier: 'Professional', price: 49900, features: ['고급 분석 도구', '포트폴리오 관리', 'ROI 추적'] },
      { tier: 'Enterprise', price: 199900, features: ['기업용 대시보드', 'API 접근', '맞춤 리포트'] }
    ]),
    requirements: JSON.stringify(['부동산 데이터 라이센스', '지도 API', '금융 API']),
    features: JSON.stringify(['시장 동향 분석', '수익률 계산', '위치 분석', '투자 추천']),
    techStack: JSON.stringify({
      frontend: ['Vue.js', 'TypeScript', 'Mapbox'],
      backend: ['Django', 'PostgreSQL', 'Redis'],
      data: ['Beautiful Soup', '국토교통부 API', 'Google Maps API']
    }),
    estimatedCost: JSON.stringify({
      development: 35000000,
      monthly_operations: 3000000,
      data_licensing: 5000000
    }),
    timeline: JSON.stringify({
      planning: 2,
      development: 8,
      testing: 3,
      launch: 1
    }),
    complexity: 'moderate'
  },

  // 헬스케어 업계 템플릿
  {
    title: '원격 건강 상담 플랫폼',
    description: '의료진과 환자를 연결하는 테레메디신 플랫폼',
    industry: 'Healthcare',
    targetMarket: '환자, 의료진, 의료기관',
    businessModel: JSON.stringify([
      { tier: 'Patient', price: 0, features: ['기본 상담 예약', '처방전 관리'] },
      { tier: 'Doctor', price: 99000, features: ['환자 관리', '진료 도구', '수익 관리'] },
      { tier: 'Clinic', price: 299000, features: ['다중 의사 관리', '통합 EMR', '보험 연동'] }
    ]),
    requirements: JSON.stringify(['의료기기 허가', 'HIPAA 준수', '보안 인증']),
    features: JSON.stringify(['화상 진료', '처방전 관리', '의료 기록', '결제 시스템']),
    techStack: JSON.stringify({
      frontend: ['React Native', 'WebRTC'],
      backend: ['Node.js', 'Socket.io', 'MongoDB'],
      security: ['end-to-end encryption', 'HIPAA compliance']
    }),
    estimatedCost: JSON.stringify({
      development: 80000000,
      monthly_operations: 8000000,
      compliance: 15000000
    }),
    timeline: JSON.stringify({
      planning: 3,
      development: 16,
      testing: 6,
      launch: 3
    }),
    complexity: 'complex'
  },

  // 교육 업계 템플릿
  {
    title: '개인화 학습 관리 시스템',
    description: 'AI 기반 맞춤형 학습 경로 및 진도 관리 플랫폼',
    industry: 'Education',
    targetMarket: '학생, 교사, 학부모',
    businessModel: JSON.stringify([
      { tier: 'Student', price: 9900, features: ['개인 학습 계획', '진도 추적'] },
      { tier: 'Teacher', price: 29900, features: ['클래스 관리', '성과 분석', '교육 자료'] },
      { tier: 'School', price: 99900, features: ['기관 관리', '종합 리포트', 'LMS 연동'] }
    ]),
    requirements: JSON.stringify(['교육부 인증', '개인정보보호', 'LMS 표준']),
    features: JSON.stringify(['적응형 학습', '진도 관리', '성취도 분석', '학부모 알림']),
    techStack: JSON.stringify({
      frontend: ['Angular', 'TypeScript', 'D3.js'],
      backend: ['Spring Boot', 'MySQL', 'Redis'],
      ai: ['scikit-learn', 'TensorFlow']
    }),
    estimatedCost: JSON.stringify({
      development: 40000000,
      monthly_operations: 4000000,
      content_licensing: 8000000
    }),
    timeline: JSON.stringify({
      planning: 2,
      development: 10,
      testing: 4,
      launch: 2
    }),
    complexity: 'moderate'
  },

  // 컨설팅 업계 템플릿
  {
    title: '비즈니스 인텔리전스 대시보드',
    description: '기업 데이터 분석 및 인사이트 제공 플랫폼',
    industry: 'Consulting',
    targetMarket: '중소기업, 스타트업',
    businessModel: JSON.stringify([
      { tier: 'Basic', price: 19900, features: ['기본 대시보드', '표준 리포트'] },
      { tier: 'Advanced', price: 49900, features: ['고급 분석', '맞춤 대시보드', 'API 연동'] },
      { tier: 'Enterprise', price: 149900, features: ['엔터프라이즈 기능', '전담 지원', '온프레미스'] }
    ]),
    requirements: JSON.stringify(['데이터 보안', 'API 연동', '클라우드 인프라']),
    features: JSON.stringify(['실시간 대시보드', '예측 분석', '자동 리포트', '데이터 시각화']),
    techStack: JSON.stringify({
      frontend: ['React', 'TypeScript', 'Recharts'],
      backend: ['Python', 'FastAPI', 'PostgreSQL'],
      analytics: ['Pandas', 'NumPy', 'Plotly']
    }),
    estimatedCost: JSON.stringify({
      development: 30000000,
      monthly_operations: 3000000,
      infrastructure: 5000000
    }),
    timeline: JSON.stringify({
      planning: 1,
      development: 6,
      testing: 2,
      launch: 1
    }),
    complexity: 'simple'
  }
];

async function main() {
  console.log('🌱 비즈니스 템플릿 시드 데이터 생성 시작...');
  
  try {
    // 기존 템플릿 삭제
    await prisma.businessTemplate.deleteMany();
    console.log('✅ 기존 템플릿 데이터 삭제 완료');

    // 새 템플릿 생성
    for (const template of businessTemplates) {
      const created = await prisma.businessTemplate.create({
        data: template
      });
      console.log(`✅ 템플릿 생성: ${created.title}`);
    }

    console.log(`🎉 총 ${businessTemplates.length}개의 비즈니스 템플릿이 생성되었습니다.`);
  } catch (error) {
    console.error('❌ 시드 데이터 생성 중 오류 발생:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });