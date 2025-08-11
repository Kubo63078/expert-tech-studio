import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChartBarIcon,
  BoltIcon,
  CogIcon,
  ShieldCheckIcon,
  CheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              당신의 전문성을
              <br />
              <span className="text-accent-400">IT 비즈니스</span>로
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              20년의 전문 경험을 AI 기반 분석으로 맞춤형 비즈니스 기회로 전환하는
              <br className="hidden md:block" />
              ExpertTech Studio만의 차별화된 서비스를 만나보세요.
            </p>
            <Link 
              to="/consultation"
              className="inline-flex items-center px-8 py-4 bg-accent-500 text-primary-900 text-lg font-semibold rounded-xl hover:bg-accent-400 transition-colors duration-200 shadow-button hover:shadow-button-hover"
            >
              무료 상담 신청하기
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 핵심 서비스 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              ExpertTech Studio 핵심 서비스
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              AI 기술과 전문 컨설팅을 결합하여, 당신의 경험과 전문성을 수익성 높은 IT 비즈니스로 발전시켜드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* AI 전문성 분석 */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-card border border-neutral-200 hover:shadow-card-hover transition-all duration-200">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <ChartBarIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">AI 전문성 분석</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">
                20년 이상의 전문 경험을 AI가 체계적으로 분석하여 숨겨진 비즈니스 기회를 발굴합니다.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-600 mr-2" />
                  전문 분야 깊이 분석
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-600 mr-2" />
                  시장 기회 매칭
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-600 mr-2" />
                  성공 확률 예측
                </li>
              </ul>
            </div>

            {/* 맞춤형 비즈니스 추천 */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-card border border-neutral-200 hover:shadow-card-hover transition-all duration-200">
              <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                <BoltIcon className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">맞춤형 비즈니스 추천</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">
                개인의 전문성과 목표에 최적화된 IT 비즈니스 모델을 3단계로 제시합니다.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-600 mr-2" />
                  Basic/Advanced/Premium 옵션
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-600 mr-2" />
                  투자 비용 및 수익 예측
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-600 mr-2" />
                  실행 로드맵 제공
                </li>
              </ul>
            </div>

            {/* 전문 컨설팅 */}
            <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-card border border-neutral-200 hover:shadow-card-hover transition-all duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">전문 컨설팅</h3>
              <p className="text-neutral-600 leading-relaxed mb-6">
                비즈니스 기획부터 런칭까지 전 과정을 전문 컨설턴트가 1:1로 지원합니다.
              </p>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-600 mr-2" />
                  위험 요소 사전 분석
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-600 mr-2" />
                  3개월 무료 지원
                </li>
                <li className="flex items-center">
                  <CheckIcon className="h-4 w-4 text-primary-600 mr-2" />
                  성공률 87% 향상
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 개발 서비스 패키지 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              개발 서비스 패키지
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              당신의 예산과 목표에 맞는 최적의 개발 솔루션을 선택하세요.
              각 패키지는 성공적인 비즈니스 런칭을 보장합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-200 hover:shadow-card-hover transition-all duration-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Basic</h3>
                <p className="text-neutral-600 mb-4">시작하기 좋은 기본 패키지</p>
                <div className="text-4xl font-bold text-primary-600 mb-2">1,500만원</div>
                <p className="text-sm text-neutral-500">~ 2,500만원</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">웹 플랫폼 개발</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">AI 챗봇 통합</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">기본 사용자 관리</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">3개월 기술 지원</span>
                </li>
              </ul>

              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-4">개발 기간: 3-4개월</p>
                <p className="text-sm text-primary-600 font-semibold">예상 매출: 월 200-600만원</p>
              </div>
            </div>

            {/* Advanced Package */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-2xl shadow-card text-white hover:shadow-card-hover transition-all duration-200 transform scale-105">
              <div className="text-center mb-8">
                <div className="bg-accent-500 text-primary-900 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  가장 인기
                </div>
                <h3 className="text-2xl font-bold mb-2">Advanced</h3>
                <p className="text-primary-100 mb-4">비즈니스 성장을 위한 고급 패키지</p>
                <div className="text-4xl font-bold text-accent-400 mb-2">3,000만원</div>
                <p className="text-sm text-primary-200">~ 5,000만원</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-100">모든 Basic 기능 포함</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-100">고급 AI 분석 엔진</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-100">데이터 통합 및 자동화</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-100">6개월 기술 지원</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-accent-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-primary-100">맞춤형 컨설팅</span>
                </li>
              </ul>

              <div className="text-center">
                <p className="text-sm text-primary-200 mb-4">개발 기간: 6-8개월</p>
                <p className="text-sm text-accent-400 font-semibold">예상 매출: 월 500-1,000만원</p>
              </div>
            </div>

            {/* Premium Package */}
            <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-200 hover:shadow-card-hover transition-all duration-200">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Premium</h3>
                <p className="text-neutral-600 mb-4">대규모 비즈니스를 위한 완전한 솔루션</p>
                <div className="text-4xl font-bold text-primary-600 mb-2">5,000만원</div>
                <p className="text-sm text-neutral-500">~ 8,000만원</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">모든 Advanced 기능 포함</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">모바일 앱 개발</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">고급 자동화 시스템</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">전담 개발팀 배정</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">1년 무제한 지원</span>
                </li>
              </ul>

              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-4">개발 기간: 8-12개월</p>
                <p className="text-sm text-primary-600 font-semibold">예상 매출: 월 1,000만원 이상</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 프로세스 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              간단한 3단계 프로세스
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              복잡한 과정은 저희가 처리합니다. 당신은 단 3단계로 새로운 비즈니스를 시작할 수 있습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">전문성 분석</h3>
              <p className="text-neutral-600 leading-relaxed">
                간단한 질문을 통해 당신의 전문 분야와 경험을 AI가 분석합니다. 약 15분이면 충분합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-600 text-primary-900 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">맞춤 추천 받기</h3>
              <p className="text-neutral-600 leading-relaxed">
                AI 분석 결과를 바탕으로 3가지 최적의 비즈니스 모델을 추천받습니다. 성공률과 수익성까지 확인하세요.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4">전문가 상담</h3>
              <p className="text-neutral-600 leading-relaxed">
                전문 컨설턴트와 1:1 상담을 통해 구체적인 실행 계획을 수립하고 바로 시작하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            지금 시작하면 특별 혜택까지!
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            무료 전문성 분석 + 개인 맞춤 실행계획서 (30만원 상당) 무료 증정
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/consultation"
              className="inline-flex items-center justify-center px-8 py-4 bg-accent-500 text-primary-900 text-lg font-semibold rounded-xl hover:bg-accent-400 transition-colors duration-200 shadow-button hover:shadow-button-hover"
            >
              무료 상담 신청하기
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-primary-700 transition-colors duration-200"
            >
              더 자세한 정보 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;