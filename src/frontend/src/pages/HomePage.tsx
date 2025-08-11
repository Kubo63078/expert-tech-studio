import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  SparklesIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI 기반 비즈니스 분석',
      description: '당신의 전문 분야와 경험을 분석하여 최적의 IT 비즈니스 아이디어를 제안합니다.',
    },
    {
      icon: UserGroupIcon,
      title: '40-50대 특화 서비스',
      description: '중년층의 풍부한 경험과 네트워크를 활용한 맞춤형 비즈니스 모델을 제공합니다.',
    },
    {
      icon: ChartBarIcon,
      title: '시장 분석 및 검증',
      description: '실제 시장 데이터를 기반으로 한 사업성 검토와 성공 확률을 분석해드립니다.',
    },
    {
      icon: CogIcon,
      title: '완전 개발 지원',
      description: '기획부터 개발, 출시, 운영까지 전 과정을 체계적으로 지원합니다.',
    },
  ];

  const successStories = [
    {
      industry: '부동산',
      title: '부동산 투자 자문 플랫폼',
      description: '20년 부동산 경력을 바탕으로 AI 기반 투자 추천 서비스 런칭',
      result: '월 매출 2,000만원 달성',
    },
    {
      industry: '의료',
      title: '원격 건강 상담 서비스',
      description: '의료진 네트워크를 활용한 온라인 헬스케어 플랫폼 구축',
      result: '1만 명 이상 사용자 확보',
    },
    {
      industry: '교육',
      title: '전문가 온라인 강의 플랫폼',
      description: '교육 전문성을 활용한 맞춤형 온라인 교육 서비스',
      result: '누적 수강생 5,000명',
    },
  ];

  const processSteps = [
    {
      step: '1',
      title: '전문성 분석',
      description: '경력, 스킬, 네트워크를 체계적으로 분석합니다.',
    },
    {
      step: '2',
      title: 'AI 추천',
      description: 'AI가 최적의 비즈니스 아이디어를 제안합니다.',
    },
    {
      step: '3',
      title: '사업 계획 수립',
      description: '구체적인 실행 계획과 로드맵을 작성합니다.',
    },
    {
      step: '4',
      title: '개발 및 런칭',
      description: '전문 개발팀이 완성도 높은 서비스를 구현합니다.',
    },
  ];

  return (
    <main id="main-content" className="overflow-x-hidden">
      {/* 히어로 섹션 */}
      <section 
        className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16 sm:py-20 lg:py-24" 
        aria-labelledby="hero-heading"
      >
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center spacing-relaxed">
            <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              당신의 전문성을<br />
              <span className="text-primary-200">IT 비즈니스로</span> 확장하세요
            </h1>
            <p className="text-senior-lg md:text-senior-xl lg:text-senior-2xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              40-50대 전문가를 위한 AI 기반 맞춤형 개발 에이전시<br />
              풍부한 경험을 바탕으로 성공적인 IT 창업을 시작해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" role="group" aria-label="주요 액션">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="btn-secondary text-primary-600 bg-white hover:bg-primary-50 px-6 sm:px-8 py-3 sm:py-4 text-senior-lg sm:text-senior-xl inline-flex items-center"
                  aria-label="대시보드로 이동"
                >
                  대시보드로 이동
                  <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/register" 
                    className="btn-secondary text-primary-600 bg-white hover:bg-primary-50 px-6 sm:px-8 py-3 sm:py-4 text-senior-lg sm:text-senior-xl inline-flex items-center"
                    aria-label="무료로 시작하기 - 회원가입"
                  >
                    무료로 시작하기
                    <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                  <Link 
                    to="/login" 
                    className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 px-6 sm:px-8 py-3 sm:py-4 text-senior-lg sm:text-senior-xl"
                    aria-label="기존 사용자 로그인"
                  >
                    로그인
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12 sm:mb-16 spacing-relaxed">
            <h2 id="features-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              왜 ExpertTech Studio인가요?
            </h2>
            <p className="text-senior-lg sm:text-senior-xl text-gray-600 max-w-2xl mx-auto">
              중년층의 풍부한 전문성과 경험을 IT 비즈니스로 성공적으로 전환할 수 있도록 도와드립니다.
            </p>
          </div>

          <div className="grid-responsive gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <article 
                key={index} 
                className="card touch-spacing text-center hover:shadow-xl focus-within:shadow-xl transition-shadow"
                role="region"
                aria-labelledby={`feature-${index}-title`}
              >
                <div 
                  className="w-16 h-16 sm:w-18 sm:h-18 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6"
                  aria-hidden="true"
                >
                  <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />
                </div>
                <h3 id={`feature-${index}-title`} className="text-senior-lg sm:text-senior-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-senior-base leading-relaxed">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 진행 과정 섹션 */}
      <section className="py-16 sm:py-20 bg-white" aria-labelledby="process-heading">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12 sm:mb-16 spacing-relaxed">
            <h2 id="process-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              어떻게 진행되나요?
            </h2>
            <p className="text-senior-lg sm:text-senior-xl text-gray-600 max-w-2xl mx-auto">
              체계적이고 단계적인 과정을 통해 성공적인 IT 비즈니스를 런칭합니다.
            </p>
          </div>

          <div className="relative">
            {/* 연결선 (데스크톱) */}
            <div className="hidden lg:block absolute top-16 left-0 w-full h-0.5 bg-primary-200" aria-hidden="true"></div>

            <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative" role="list">
              {processSteps.map((step, index) => (
                <li key={index} className="text-center relative" role="listitem">
                  <div 
                    className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-600 text-white rounded-full flex items-center justify-center text-senior-lg sm:text-senior-xl font-bold mx-auto mb-6 relative z-10"
                    aria-label={`단계 ${step.step}`}
                  >
                    {step.step}
                  </div>
                  <h3 className="text-senior-lg sm:text-senior-xl font-semibold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-senior-base leading-relaxed">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 성공 사례 섹션 */}
      <section className="py-16 sm:py-20 bg-gray-50" aria-labelledby="success-stories-heading">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-12 sm:mb-16 spacing-relaxed">
            <h2 id="success-stories-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              성공 사례
            </h2>
            <p className="text-senior-lg sm:text-senior-xl text-gray-600 max-w-2xl mx-auto">
              이미 많은 전문가들이 ExpertTech Studio와 함께 성공적인 IT 비즈니스를 시작했습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {successStories.map((story, index) => (
              <article 
                key={index} 
                className="card touch-spacing"
                role="region"
                aria-labelledby={`story-${index}-title`}
              >
                <div className="inline-block px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full mb-4">
                  {story.industry}
                </div>
                <h3 id={`story-${index}-title`} className="text-senior-lg sm:text-senior-xl font-semibold text-gray-900 mb-4">
                  {story.title}
                </h3>
                <p className="text-gray-600 text-senior-base mb-6 leading-relaxed">
                  {story.description}
                </p>
                <div className="flex items-center text-green-600" role="status" aria-label="성과">
                  <CheckCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  <span className="font-medium">{story.result}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-16 sm:py-20 bg-primary-600" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto container-padding text-center spacing-relaxed">
          <h2 id="cta-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            지금 바로 시작해보세요
          </h2>
          <p className="text-senior-lg sm:text-senior-xl text-primary-100 mb-8 leading-relaxed">
            당신의 전문성을 분석하고 최적의 IT 비즈니스 아이디어를 제안받아보세요.<br />
            무료 상담과 분석을 통해 새로운 가능성을 발견하실 수 있습니다.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" role="group" aria-label="회원가입 액션">
              <Link 
                to="/register" 
                className="btn-secondary text-primary-600 bg-white hover:bg-primary-50 px-6 sm:px-8 py-3 sm:py-4 text-senior-lg sm:text-senior-xl inline-flex items-center"
                aria-label="무료 회원가입하고 시작하기"
              >
                무료 회원가입
                <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default HomePage;