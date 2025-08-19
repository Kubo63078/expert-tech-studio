export interface InterviewQuestion {
  id: string;
  category: 'basic' | 'expertise' | 'business' | 'goals';
  type: 'text' | 'select' | 'multiselect' | 'textarea' | 'scale';
  question: string;
  description?: string;
  options?: string[];
  placeholder?: string;
  required: boolean;
  followUpLogic?: {
    condition: (answer: any) => boolean;
    nextQuestions: string[];
  };
}

export interface InterviewFlow {
  [key: string]: InterviewQuestion;
}

// 전체 인터뷰 질문 데이터베이스
export const interviewQuestions: InterviewFlow = {
  // === 기본 프로필 ===
  'basic_name': {
    id: 'basic_name',
    category: 'basic',
    type: 'text',
    question: '성함을 알려주세요.',
    placeholder: '예: 김전문',
    required: true
  },
  
  'basic_age': {
    id: 'basic_age',
    category: 'basic',
    type: 'select',
    question: '연령대를 선택해주세요.',
    options: ['40-45세', '46-50세', '51-55세', '56-60세', '60세 이상'],
    required: true
  },
  
  'basic_location': {
    id: 'basic_location',
    category: 'basic',
    type: 'select',
    question: '거주하시는 지역을 알려주세요.',
    options: [
      '서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시',
      '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원도',
      '충청북도', '충청남도', '전라북도', '전라남도', '경상북도', '경상남도', '제주특별자치도'
    ],
    required: true
  },
  
  'basic_employment_status': {
    id: 'basic_employment_status',
    category: 'basic',
    type: 'select',
    question: '현재 직업 상태를 알려주세요.',
    options: [
      '현재 재직중', 
      '퇴직/은퇴 준비중', 
      '이미 은퇴함', 
      '프리랜서/자영업', 
      '구직 중',
      '기타'
    ],
    required: true,
    followUpLogic: {
      condition: (answer) => answer === '현재 재직중' || answer === '프리랜서/자영업',
      nextQuestions: ['basic_current_job', 'basic_job_satisfaction']
    }
  },
  
  'basic_current_job': {
    id: 'basic_current_job',
    category: 'basic',
    type: 'text',
    question: '현재 직업이나 업종을 구체적으로 알려주세요.',
    placeholder: '예: 부동산 중개업, 세무사 사무소, 컨설팅업체 이사',
    required: true
  },
  
  'basic_job_satisfaction': {
    id: 'basic_job_satisfaction',
    category: 'basic',
    type: 'scale',
    question: '현재 직업에 대한 만족도는 어느 정도인가요?',
    description: '1점(매우 불만족) ~ 10점(매우 만족)',
    required: true
  },
  
  'basic_it_experience': {
    id: 'basic_it_experience',
    category: 'basic',
    type: 'select',
    question: 'IT나 온라인 서비스 이용 수준은 어느 정도인가요?',
    options: [
      '기본적인 사용만 가능 (이메일, 검색 정도)',
      '일반적인 사용 가능 (온라인쇼핑, SNS, 앱 사용)',
      '능숙한 사용 가능 (온라인 업무, 블로그 운영 등)',
      '고급 사용자 (웹사이트 관리, 온라인 마케팅 등)'
    ],
    required: true
  },

  // === 전문성 분석 ===
  'expertise_main_field': {
    id: 'expertise_main_field',
    category: 'expertise',
    type: 'select',
    question: '주요 전문 분야를 선택해주세요.',
    options: [
      '부동산 (중개, 투자, 개발)',
      '금융/보험 (은행, 증권, 보험)',
      '법무/세무 (변호사, 세무사, 회계사)',
      '의료/헬스케어 (의사, 간호사, 의료진)',
      '교육 (교사, 교수, 강사)',
      '컨설팅 (경영, 전략, 전문 컨설턴트)',
      '제조업 (생산, 품질, 기술)',
      '서비스업 (요식업, 미용, 서비스)',
      '공공기관 (공무원, 공기업)',
      '기타'
    ],
    required: true,
    followUpLogic: {
      condition: (answer) => answer !== '기타',
      nextQuestions: ['expertise_years', 'expertise_specialization']
    }
  },
  
  'expertise_years': {
    id: 'expertise_years',
    category: 'expertise',
    type: 'select',
    question: '해당 분야에서의 총 경력은 얼마나 되시나요?',
    options: ['5-10년', '11-15년', '16-20년', '21-25년', '26-30년', '30년 이상'],
    required: true
  },
  
  'expertise_specialization': {
    id: 'expertise_specialization',
    category: 'expertise',
    type: 'textarea',
    question: '전문 분야에서 특히 잘하는 영역이나 특별한 경험이 있다면 구체적으로 알려주세요.',
    placeholder: '예: 강남지역 오피스텔 투자 전문, 중소기업 세무 최적화, 의료진 대상 교육 등',
    description: '본인만의 독특한 경험이나 노하우가 있다면 자세히 적어주세요.',
    required: true
  },
  
  'expertise_achievements': {
    id: 'expertise_achievements',
    category: 'expertise',
    type: 'textarea',
    question: '지금까지의 주요 성과나 자랑할 만한 경험을 알려주세요.',
    placeholder: '예: 연매출 10억 달성, 업계 최우수상 수상, 특정 프로젝트 성공 사례 등',
    required: true
  },
  
  'expertise_network': {
    id: 'expertise_network',
    category: 'expertise',
    type: 'select',
    question: '업계 내 인맥이나 네트워크는 어느 정도인가요?',
    options: [
      '매우 넓음 (업계 리더급, 다양한 분야 인맥)',
      '넓은 편 (동종업계 및 관련 분야 인맥)',
      '보통 (직장 동료, 거래처 수준)',
      '좁은 편 (소수의 친분 관계)',
      '거의 없음'
    ],
    required: true
  },
  
  'expertise_certifications': {
    id: 'expertise_certifications',
    category: 'expertise',
    type: 'textarea',
    question: '보유하고 계신 자격증이나 면허가 있다면 알려주세요.',
    placeholder: '예: 공인중개사, 세무사, 의사면허, MBA, 기사자격증 등',
    required: false
  },

  // === 비즈니스 의향 ===
  'business_motivation': {
    id: 'business_motivation',
    category: 'business',
    type: 'textarea',
    question: 'IT 비즈니스에 관심을 갖게 된 계기나 이유를 자세히 알려주세요.',
    placeholder: '예: 은퇴 후 새로운 도전, 추가 수입원 필요, 전문성을 더 많은 사람들과 공유하고 싶음',
    required: true
  },
  
  'business_time_commitment': {
    id: 'business_time_commitment',
    category: 'business',
    type: 'select',
    question: 'IT 비즈니스에 투입할 수 있는 시간은 하루 기준 얼마나 되시나요?',
    options: [
      '1-2시간 (부업 수준)',
      '3-4시간 (반일 근무 수준)',
      '5-6시간 (3/4 근무 수준)',
      '7시간 이상 (풀타임 수준)',
      '시간은 충분함 (전적으로 집중 가능)'
    ],
    required: true
  },
  
  'business_budget': {
    id: 'business_budget',
    category: 'business',
    type: 'select',
    question: '초기 투자 가능한 예산 규모는 어느 정도인가요?',
    options: [
      '500만원 이하',
      '500만원 - 1,500만원',
      '1,500만원 - 3,000만원',
      '3,000만원 - 5,000만원',
      '5,000만원 이상'
    ],
    required: true
  },
  
  'business_target_customers': {
    id: 'business_target_customers',
    category: 'business',
    type: 'multiselect',
    question: '어떤 고객층을 대상으로 하고 싶으신가요? (복수 선택 가능)',
    options: [
      '개인 고객 (B2C)',
      '소상공인/자영업자',
      '중소기업',
      '대기업',
      '정부기관/공공기관',
      '동종업계 전문가들',
      '일반 소비자',
      '특정 연령대 (시니어, 청년 등)'
    ],
    required: true
  },
  
  'business_service_type': {
    id: 'business_service_type',
    category: 'business',
    type: 'multiselect',
    question: '어떤 형태의 서비스를 제공하고 싶으신가요? (복수 선택 가능)',
    options: [
      '온라인 상담/컨설팅',
      '정보 제공 플랫폼',
      '교육/강의 서비스',
      '중개/매칭 서비스',
      '분석/진단 서비스',
      '관리 도구/솔루션',
      '커뮤니티 플랫폼',
      '전자상거래'
    ],
    required: true
  },
  
  'business_concerns': {
    id: 'business_concerns',
    category: 'business',
    type: 'multiselect',
    question: 'IT 비즈니스를 시작하면서 가장 걱정되는 부분은? (복수 선택 가능)',
    options: [
      '기술적 지식 부족',
      '마케팅/홍보 방법',
      '초기 고객 확보',
      '경쟁사와의 차별화',
      '법적/규제 문제',
      '지속적인 수익 창출',
      '시간과 에너지 투자',
      '실패에 대한 두려움'
    ],
    required: true
  },

  // === 목표 설정 ===
  'goals_revenue_target': {
    id: 'goals_revenue_target',
    category: 'goals',
    type: 'select',
    question: '1년 후 목표하는 월 매출 규모는 어느 정도인가요?',
    options: [
      '100만원 이하 (용돈 수준)',
      '100-300만원 (부업 수준)',
      '300-500만원 (반월급 수준)',
      '500-1,000만원 (월급 수준)',
      '1,000만원 이상 (고수익)',
      '매출보다는 사회적 가치 중시'
    ],
    required: true
  },
  
  'goals_success_criteria': {
    id: 'goals_success_criteria',
    category: 'goals',
    type: 'multiselect',
    question: '본인에게 성공의 기준은 무엇인가요? (복수 선택 가능)',
    options: [
      '안정적인 추가 수입',
      '사회적 인정과 명성',
      '개인적 성취감',
      '전문성의 사회적 기여',
      '새로운 도전과 학습',
      '인적 네트워크 확장',
      '자유로운 근무 환경',
      '후대에 남길 자산'
    ],
    required: true
  },
  
  'goals_timeline': {
    id: 'goals_timeline',
    category: 'goals',
    type: 'select',
    question: '언제까지 서비스를 런칭하고 싶으신가요?',
    options: [
      '3개월 이내',
      '6개월 이내',
      '1년 이내',
      '1-2년 내',
      '시기보다는 완성도 중시'
    ],
    required: true
  },
  
  'goals_support_needs': {
    id: 'goals_support_needs',
    category: 'goals',
    type: 'multiselect',
    question: '어떤 부분에서 가장 도움이 필요하다고 생각하시나요? (복수 선택 가능)',
    options: [
      '비즈니스 아이디어 구체화',
      '기술적 솔루션 설계',
      'UI/UX 디자인',
      '개발 및 구축',
      '마케팅 전략',
      '법적/세무 자문',
      '운영 및 관리',
      '지속적인 컨설팅'
    ],
    required: true
  },
  
  'goals_final_thoughts': {
    id: 'goals_final_thoughts',
    category: 'goals',
    type: 'textarea',
    question: '마지막으로, 하고 싶은 말씀이나 특별히 고려해주셨으면 하는 사항이 있다면 자유롭게 적어주세요.',
    placeholder: '예: 가족 상황, 건강 이슈, 특별한 희망사항 등',
    required: false
  }
};

// 질문 순서 정의 (동적으로 변경 가능)
export const defaultQuestionFlow = [
  // 기본 프로필
  'basic_name',
  'basic_age',
  'basic_location',
  'basic_employment_status',
  'basic_current_job',
  'basic_job_satisfaction',
  'basic_it_experience',
  
  // 전문성 분석
  'expertise_main_field',
  'expertise_years',
  'expertise_specialization',
  'expertise_achievements',
  'expertise_network',
  'expertise_certifications',
  
  // 비즈니스 의향
  'business_motivation',
  'business_time_commitment',
  'business_budget',
  'business_target_customers',
  'business_service_type',
  'business_concerns',
  
  // 목표 설정
  'goals_revenue_target',
  'goals_success_criteria',
  'goals_timeline',
  'goals_support_needs',
  'goals_final_thoughts'
];

// 질문 카테고리별 설명
export const categoryDescriptions = {
  basic: {
    title: '기본 프로필',
    description: '현재 상황과 기본 정보를 알려주세요',
    estimatedTime: '5분'
  },
  expertise: {
    title: '전문성 분석',
    description: '경력과 전문 분야를 자세히 분석합니다',
    estimatedTime: '10분'
  },
  business: {
    title: '비즈니스 의향',
    description: '원하시는 사업 방향을 파악합니다',
    estimatedTime: '10분'
  },
  goals: {
    title: '목표 설정',
    description: '구체적인 목표와 기대를 설정합니다',
    estimatedTime: '5분'
  }
};