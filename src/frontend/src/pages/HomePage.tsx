import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  TrophyIcon,
  ShieldCheckIcon,
  CogIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon,
  BanknotesIcon,
  UsersIcon,
  ClockIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid
} from '@heroicons/react/24/solid';

const HomePage = () => {
  // H&R Block Professional Features
  const features = [
    {
      icon: SparklesIcon,
      title: 'AI 기반 전문성 분석',
      description: '40-50대 전문가의 경력과 스킬을 심층 분석하여 최적의 IT 비즈니스 기회를 발굴합니다.',
      benefit: '개인 맞춤형 추천',
    },
    {
      icon: TrophyIcon,
      title: '검증된 비즈니스 모델',
      description: '수백 건의 성공 사례를 바탕으로 한 입증된 비즈니스 프레임워크를 제공합니다.',
      benefit: '95% 성공률 보장',
    },
    {
      icon: ShieldCheckIcon,
      title: '전문가 멘토링',
      description: 'IT 업계 20년 이상 경력의 시니어 전문가들이 직접 멘토링을 제공합니다.',
      benefit: '1:1 전담 컨설팅',
    },
    {
      icon: CogIcon,
      title: '원스톱 개발 서비스',
      description: '기획부터 개발, 런칭, 운영까지 모든 과정을 통합 관리하여 완성도 높은 서비스를 보장합니다.',
      benefit: '6개월 완성 보장',
    },
  ];

  // H&R Block Success Stories
  const successStories = [
    {
      industry: '부동산',
      client: '김 부동산 전문가 (25년 경력)',
      title: 'AI 투자 분석 플랫폼',
      description: '부동산 빅데이터와 AI를 결합한 투자 의사결정 지원 서비스',
      result: '6개월 내 월 매출 3,500만원 달성',
      growth: '+250% 매출 증가',
      investment: '4.2억원 투자 유치',
      rating: 4.9,
    },
    {
      industry: '의료/헬스케어',
      client: '박 의료진 (의사 15년)',
      title: '원격 건강관리 플랫폼',
      description: '의료진 네트워크 기반 개인 맞춤형 건강관리 솔루션',
      result: '1년 내 2만 명 활성 사용자',
      growth: '+180% 사용자 증가',
      investment: '2.8억원 시리즈A',
      rating: 4.8,
    },
    {
      industry: '금융/컨설팅',
      client: '이 금융 전문가 (20년 경력)',
      title: '중소기업 금융 컨설팅 앱',
      description: '중소기업 대상 맞춤형 금융 솔루션 추천 및 관리 서비스',
      result: '8개월 내 500개 기업 고객 확보',
      growth: '+320% 고객사 증가',
      investment: '1.5억원 초기 투자',
      rating: 4.7,
    },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* H&R Block 히어로 섹션 */}
      <section 
        className="relative hero-gradient text-white py-20 sm:py-24 lg:py-32 overflow-hidden" 
        aria-labelledby="hero-heading"
      >
        {/* 백그라운드 패턴 */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-700/20 to-transparent" aria-hidden="true"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-500/10 to-transparent" aria-hidden="true"></div>
        
        <div className="relative max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* 메인 콘텐츠 */}
            <div className="text-center lg:text-left">
              {/* 신뢰 배지 */}
              <div className="inline-flex items-center px-6 py-3 bg-success-500/20 border border-success-400/30 text-success-200 text-sm font-semibold rounded-full mb-6">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                95% 성공률 보장 • 200+ 완료 프로젝트
              </div>
              
              <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
                당신의 전문성을<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-500">IT 비즈니스로</span><br />
                확장하세요
              </h1>
              
              <p className="text-xl lg:text-2xl text-primary-100 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                40-50대 전문가를 위한 AI 기반 맞춤형 개발 에이전시.<br />
                25년 업계 경험과 검증된 성공 사례로 <strong className="text-white font-semibold">안전하고 확실한 IT 창업</strong>을 지원합니다.
              </p>
              
              {/* 핵심 수치 */}
              <div className="grid grid-cols-3 gap-6 mb-10 text-center lg:text-left">
                <div>
                  <div className="text-3xl font-bold text-accent-400 mb-1">6개월</div>
                  <div className="text-sm text-primary-200 font-medium">평균 완성 기간</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success-400 mb-1">3.2억</div>
                  <div className="text-sm text-primary-200 font-medium">평균 투자 유치</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-300 mb-1">200+</div>
                  <div className="text-sm text-primary-200 font-medium">성공 프로젝트</div>
                </div>
              </div>
              
              {/* CTA 버튼들 */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center">
                <Link 
                  to="/consultation" 
                  className="inline-flex items-center px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white text-xl font-bold rounded-button shadow-button-hover hover:shadow-professional transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-accent-400/50"
                >
                  <span className="mr-2">💼</span>
                  무료 전문성 분석 시작
                  <ArrowRightIcon className="ml-3 h-6 w-6" aria-hidden="true" />
                </Link>
                <Link 
                  to="/about" 
                  className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 text-xl font-semibold rounded-button transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/50"
                >
                  더 알아보기
                </Link>
              </div>
            </div>
            
            {/* 사이드 콘텐츠 - 신뢰성 지표 */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">고객 성공 지표</h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center mr-4">
                      <TrophyIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">평균 매출 증가율</div>
                      <div className="text-success-200 text-sm font-medium">+250% (6개월 내)</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mr-4">
                      <BanknotesIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">투자 유치 성공률</div>
                      <div className="text-accent-200 text-sm font-medium">87% (평균 2.8억원)</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mr-4">
                      <UsersIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">고객 만족도</div>
                      <div className="text-primary-200 text-sm font-medium">4.8/5.0 ★★★★★</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-primary-200 text-sm italic">
                    "전문성을 활용한 IT 창업, 이제 위험하지 않습니다."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* H&R Block 주요 기능 섹션 */}
      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-primary-100 text-primary-700 font-semibold rounded-full mb-6">
              <SparklesIcon className="h-5 w-5 mr-2" />
              검증된 전문 서비스
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              왜 <span className="text-brand">ExpertTech Studio</span>인가요?
            </h2>
            <p className="text-xl sm:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              40-50대 중년층의 풍부한 전문성과 경험을 IT 비즈니스로 성공적으로 전환할 수 있도록 
              <strong className="text-neutral-800 font-semibold">검증된 프로세스와 전문 인력</strong>이 함께합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card touch-spacing text-center hover:shadow-professional focus-within:shadow-professional transition-all duration-300 group"
              >
                <div 
                  className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:from-primary-700 group-hover:to-primary-800 transition-all duration-300 shadow-button group-hover:shadow-button-hover"
                  aria-hidden="true"
                >
                  <feature.icon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4 group-hover:text-brand transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 text-base leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="inline-flex items-center px-4 py-2 bg-success-50 border border-success-200 text-success-700 text-sm font-semibold rounded-full">
                  <CheckCircleIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                  {feature.benefit}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H&R Block 성공 사례 섹션 */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-success-100 text-success-700 font-semibold rounded-full mb-6">
              <TrophyIcon className="h-5 w-5 mr-2" />
              검증된 성공 실적
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
              <span className="text-success-600">실제 성공 사례</span>를 확인하세요
            </h2>
            <p className="text-xl sm:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              이미 200명 이상의 40-50대 전문가들이 ExpertTech Studio와 함께 
              <strong className="text-neutral-800 font-semibold">평균 6개월 만에 수익성 있는 IT 비즈니스</strong>를 성공적으로 구축했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div 
                key={index} 
                className="card touch-spacing hover:shadow-professional transition-all duration-300 group border-l-4 border-success-500"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 text-sm font-bold rounded-full">
                    {story.industry}
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIconSolid 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < Math.floor(story.rating) ? 'text-accent-500' : 'text-neutral-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-neutral-600">{story.rating}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-neutral-500 mb-1">{story.client}</p>
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-brand transition-colors duration-300">
                    {story.title}
                  </h3>
                </div>
                
                <p className="text-neutral-600 text-base mb-6 leading-relaxed">
                  {story.description}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center text-success-700 bg-success-50 px-4 py-3 rounded-lg border border-success-200">
                    <TrophyIcon className="h-5 w-5 mr-3 flex-shrink-0" aria-hidden="true" />
                    <span className="font-semibold text-sm">{story.result}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary-50 px-3 py-2 rounded-lg border border-primary-200 text-center">
                      <div className="text-primary-700 font-bold text-sm">{story.growth}</div>
                      <div className="text-primary-600 text-xs font-medium">성장률</div>
                    </div>
                    <div className="bg-accent-50 px-3 py-2 rounded-lg border border-accent-200 text-center">
                      <div className="text-accent-700 font-bold text-sm">{story.investment}</div>
                      <div className="text-accent-600 text-xs font-medium">투자 유치</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H&R Block CTA 섹션 */}
      <section className="relative py-20 sm:py-24 hero-gradient text-white overflow-hidden">
        {/* 백그라운드 패턴 */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-transparent" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-success-600/10 to-transparent" aria-hidden="true"></div>
        
        <div className="relative max-w-6xl mx-auto container-padding text-center">
          {/* 신뢰성 배지들 */}
          <div className="flex flex-wrap justify-center items-center gap-6 mb-10">
            <div className="flex items-center px-4 py-2 bg-success-500/20 border border-success-400/30 text-success-200 text-sm font-semibold rounded-full">
              <ShieldCheckIcon className="h-4 w-4 mr-2" />
              무료 상담 보장
            </div>
            <div className="flex items-center px-4 py-2 bg-accent-500/20 border border-accent-400/30 text-accent-200 text-sm font-semibold rounded-full">
              <ClockIcon className="h-4 w-4 mr-2" />
              24시간 내 회신
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            지금 바로 <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-500">무료 분석</span>을<br />
            시작해보세요
          </h2>
          
          <p className="text-xl sm:text-2xl text-primary-100 mb-10 max-w-4xl mx-auto leading-relaxed">
            당신의 전문성을 심층 분석하고 최적의 IT 비즈니스 아이디어를 무료로 제안받아보세요.<br />
            <strong className="text-white font-semibold">상담료 0원, 분석 보고서 무료 제공</strong>으로 새로운 가능성을 발견하실 수 있습니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link 
              to="/consultation" 
              className="inline-flex items-center px-10 py-5 bg-accent-500 hover:bg-accent-600 text-white text-2xl font-bold rounded-button shadow-professional hover:shadow-button-hover transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-400/50 group"
            >
              <span className="mr-3 text-2xl">🚀</span>
              무료 전문성 분석 시작하기
              <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
          
          {/* 연락처 정보 */}
          <div className="pt-8 border-t border-white/20">
            <p className="text-primary-200 text-sm mb-4">궁금한 점이 있으시면 언제든 연락주세요</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <a 
                href="tel:1588-1234" 
                className="flex items-center text-primary-300 hover:text-white transition-colors duration-200"
              >
                <PhoneIcon className="h-5 w-5 mr-2" />
                1588-1234
              </a>
              <a 
                href="mailto:support@experttech.studio" 
                className="flex items-center text-primary-300 hover:text-white transition-colors duration-200"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                support@experttech.studio
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;