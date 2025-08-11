import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BuildingOfficeIcon,
  LightBulbIcon,
  UserGroupIcon,
  TrophyIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-accent-400">전문성</span>과 <span className="text-accent-400">기술</span>이
              <br />
              만나는 곳
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              20년 이상의 IT 개발 경험과 AI 기술을 바탕으로
              <br className="hidden md:block" />
              중년 전문가들의 새로운 비즈니스 기회를 창출합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 회사 소개 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
                ExpertTech Studio는
                <br />
                <span className="text-primary-600">꿈을 현실로</span> 만듭니다
              </h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                우리는 40-50대 중년 전문가들이 가진 풍부한 경험과 전문성이 IT 시대에 맞는 
                새로운 비즈니스로 발전할 수 있다고 믿습니다.
              </p>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                단순한 기술 개발을 넘어, AI 분석을 통한 개인 맞춤형 비즈니스 모델 제안부터 
                성공적인 런칭까지 전 과정을 지원하는 것이 우리의 미션입니다.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">20+</div>
                  <div className="text-sm text-neutral-600">년 경험</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">150+</div>
                  <div className="text-sm text-neutral-600">성공 프로젝트</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">87%</div>
                  <div className="text-sm text-neutral-600">성공률</div>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-8">
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-neutral-900 mb-6">우리의 핵심 가치</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <LightBulbIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-2">혁신적 접근</h4>
                      <p className="text-neutral-600 text-sm leading-relaxed">
                        전통적인 전문성과 최신 AI 기술을 결합한 혁신적인 비즈니스 모델 창조
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <UserGroupIcon className="h-6 w-6 text-accent-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-2">고객 중심</h4>
                      <p className="text-neutral-600 text-sm leading-relaxed">
                        개인의 특성과 목표에 완벽하게 맞춘 맞춤형 솔루션 제공
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <TrophyIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-neutral-900 mb-2">성공 보장</h4>
                      <p className="text-neutral-600 text-sm leading-relaxed">
                        체계적인 분석과 지속적인 지원을 통한 높은 성공률 달성
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 팀 소개 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              전문성을 가진 팀
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              다양한 분야의 전문가들이 모여 당신의 성공적인 비즈니스 런칭을 위해 최선을 다합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI 분석 전문가 */}
            <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-200 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">AI 분석 전문가</h3>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                머신러닝과 데이터 분석 전문가들이 개인의 전문성을 정확하게 분석하고 최적의 비즈니스 기회를 발굴합니다.
              </p>
              <div className="text-sm text-neutral-500">
                • 데이터 사이언스 박사급 인력<br />
                • 10년+ AI 개발 경험<br />
                • 개인화 추천 시스템 전문
              </div>
            </div>

            {/* 비즈니스 컨설턴트 */}
            <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-200 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <BuildingOfficeIcon className="h-10 w-10 text-primary-900" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">비즈니스 컨설턴트</h3>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                다양한 산업 분야의 비즈니스 경험을 바탕으로 실현 가능한 비즈니스 모델과 전략을 수립합니다.
              </p>
              <div className="text-sm text-neutral-500">
                • MBA 및 산업 전문가<br />
                • 15년+ 컨설팅 경험<br />
                • 중소기업 성공 사례 다수
              </div>
            </div>

            {/* 기술 개발팀 */}
            <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-200 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">DEV</span>
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">기술 개발팀</h3>
              <p className="text-neutral-600 mb-4 leading-relaxed">
                최신 웹/앱 기술을 활용하여 사용하기 쉽고 효과적인 IT 솔루션을 개발합니다.
              </p>
              <div className="text-sm text-neutral-500">
                • 풀스택 개발자 10명+<br />
                • React, Node.js, AI 통합 전문<br />
                • 40-50대 친화적 UI/UX 특화
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 전문 분야 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              전문 지원 분야
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              다양한 전문 분야의 경험을 IT 비즈니스로 전환하는 데 특화된 노하우를 보유하고 있습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
              <div className="text-center">
                <div className="text-2xl mb-3">🏠</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">부동산</h3>
                <p className="text-sm text-neutral-600">투자 분석 플랫폼, 컨설팅 서비스</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 rounded-xl border border-blue-200">
              <div className="text-center">
                <div className="text-2xl mb-3">📊</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">세무/법무</h3>
                <p className="text-sm text-neutral-600">자동 상담 시스템, 문서 관리 솔루션</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200">
              <div className="text-center">
                <div className="text-2xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">컨설팅</h3>
                <p className="text-sm text-neutral-600">온라인 코칭 플랫폼, 고객 관리 시스템</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border border-red-200">
              <div className="text-center">
                <div className="text-2xl mb-3">⚕️</div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">의료/헬스케어</h3>
                <p className="text-sm text-neutral-600">원격 상담, 건강 관리 앱</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 성공 사례 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              고객 성공 사례
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              ExpertTech Studio와 함께 새로운 비즈니스에 성공한 고객들의 이야기를 확인하세요.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 성공 사례 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-200">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 font-bold text-lg">김</span>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">김○○ 대표</div>
                    <div className="text-sm text-neutral-600">부동산 전문가 → AI 투자 분석</div>
                  </div>
                </div>
                <blockquote className="text-neutral-700 italic leading-relaxed">
                  "20년간의 부동산 경험이 AI 기술과 만나 월 800만원의 안정적인 수익을 
                  창출하는 플랫폼으로 발전했습니다. ExpertTech Studio 덕분에 가능했어요."
                </blockquote>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">개발 기간</span>
                  <span className="font-semibold text-neutral-900">7개월</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-neutral-600">월 매출</span>
                  <span className="font-semibold text-primary-600">800만원</span>
                </div>
              </div>
            </div>

            {/* 성공 사례 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-200">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-accent-600 font-bold text-lg">이</span>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">이○○ 원장</div>
                    <div className="text-sm text-neutral-600">세무사 → 자동 상담 시스템</div>
                  </div>
                </div>
                <blockquote className="text-neutral-700 italic leading-relaxed">
                  "복잡한 세무 상담을 AI가 1차 분류해주니 업무 효율이 300% 증가했습니다. 
                  이제 더 중요한 고객 관계에 집중할 수 있어요."
                </blockquote>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">개발 기간</span>
                  <span className="font-semibold text-neutral-900">5개월</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-neutral-600">업무 효율</span>
                  <span className="font-semibold text-primary-600">300% 증가</span>
                </div>
              </div>
            </div>

            {/* 성공 사례 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-card border border-neutral-200">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold text-lg">박</span>
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">박○○ 코치</div>
                    <div className="text-sm text-neutral-600">경영 컨설턴트 → 온라인 플랫폼</div>
                  </div>
                </div>
                <blockquote className="text-neutral-700 italic leading-relaxed">
                  "대면 상담의 한계를 온라인 플랫폼으로 극복했습니다. 
                  이제 전국의 고객들과 소통하며 사업을 확장하고 있어요."
                </blockquote>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">고객 증가</span>
                  <span className="font-semibold text-neutral-900">5배</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-neutral-600">지역 확장</span>
                  <span className="font-semibold text-primary-600">전국 서비스</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 우리의 약속 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              ExpertTech Studio의 약속
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              단순한 개발 서비스를 넘어, 당신의 성공적인 비즈니스 파트너가 되겠습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">100% 맞춤형</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                개인의 특성과 목표에 완벽하게 맞춘 솔루션만 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">성공 보장</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                체계적인 분석과 검증된 방법론으로 높은 성공률을 보장합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">지속적 지원</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                런칭 후에도 지속적인 기술 지원과 비즈니스 컨설팅을 제공합니다.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <LightBulbIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">혁신적 기술</h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                최신 AI 기술과 검증된 개발 방법론을 결합한 솔루션을 제공합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            당신의 전문성을 새로운 기회로
          </h2>
          <p className="text-xl text-primary-100 mb-8 leading-relaxed">
            ExpertTech Studio와 함께 20년 경험을 IT 비즈니스로 발전시켜보세요.
            <br />
            무료 분석부터 시작해보세요.
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
              to="/services"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-semibold rounded-xl hover:bg-white hover:text-primary-700 transition-colors duration-200"
            >
              서비스 자세히 보기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;