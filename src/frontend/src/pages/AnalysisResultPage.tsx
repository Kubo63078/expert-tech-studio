import { useState } from 'react';
import ConsultationModal from '../components/ConsultationModal';
import { downloadAnalysisReport, downloadTextReport } from '../utils/downloadReport';
import { 
  ChartBarIcon,
  StarIcon,
  TrophyIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarIconSolid 
} from '@heroicons/react/24/solid';

interface AnalysisResult {
  expertiseScore: number;
  marketFitScore: number;
  successProbability: number;
  strengths: string[];
  recommendations: BusinessRecommendation[];
  riskFactors: string[];
  nextSteps: string[];
}

interface BusinessRecommendation {
  id: string;
  title: string;
  description: string;
  marketPotential: number;
  developmentCost: string;
  timeline: string;
  successRate: number;
  requiredSkills: string[];
  targetRevenue: string;
  keyFeatures: string[];
  competitiveAdvantage: string;
}

const AnalysisResultPage = () => {
  // 샘플 분석 결과 (실제로는 AI API에서 받아옴)
  const [analysisResult] = useState<AnalysisResult>({
    expertiseScore: 85,
    marketFitScore: 78,
    successProbability: 82,
    strengths: [
      '20년 이상의 부동산 분야 전문 경험',
      '강남지역 특화 투자 노하우 보유',
      '업계 내 넓은 인적 네트워크',
      '디지털 도구 활용 능력 우수'
    ],
    riskFactors: [
      '초기 고객 확보의 어려움',
      '경쟁이 치열한 시장 환경',
      '규제 변화에 대한 대응 필요'
    ],
    nextSteps: [
      'MVP(최소 실행 가능 제품) 개발',
      '초기 사용자 그룹 확보',
      '마케팅 전략 수립',
      '법적 컴플라이언스 검토'
    ],
    recommendations: [
      {
        id: 'real-estate-ai',
        title: 'AI 기반 부동산 투자 분석 플랫폼',
        description: '머신러닝을 활용한 부동산 가치 평가 및 투자 기회 분석 서비스. 강남 지역 특화 데이터를 기반으로 개인 투자자에게 맞춤형 투자 조언을 제공합니다.',
        marketPotential: 85,
        developmentCost: '3,000-5,000만원',
        timeline: '6-8개월',
        successRate: 78,
        requiredSkills: ['부동산 분석', '데이터 해석', '고객 상담'],
        targetRevenue: '월 500-1,000만원',
        keyFeatures: [
          '실시간 부동산 가격 분석',
          '투자 리스크 계산기',
          '지역별 시장 동향 리포트',
          '개인 맞춤형 투자 포트폴리오',
          '전문가 상담 서비스'
        ],
        competitiveAdvantage: '강남 지역 특화 데이터와 20년 전문 경험 기반'
      },
      {
        id: 'property-consultant',
        title: '온라인 부동산 컨설팅 서비스',
        description: '화상 상담을 통한 1:1 부동산 투자 컨설팅. 개인의 재정 상황과 투자 목표에 맞춘 맞춤형 부동산 투자 전략을 제공합니다.',
        marketPotential: 72,
        developmentCost: '1,500-2,500만원',
        timeline: '3-4개월',
        successRate: 85,
        requiredSkills: ['상담 경험', '투자 분석', '커뮤니케이션'],
        targetRevenue: '월 300-800만원',
        keyFeatures: [
          '화상 상담 시스템',
          '고객 포트폴리오 관리',
          '투자 계획서 작성 도구',
          '시장 분석 리포트',
          '사후 관리 서비스'
        ],
        competitiveAdvantage: '개인 맞춤형 상담과 지속적인 관계 관리'
      },
      {
        id: 'investment-education',
        title: '부동산 투자 교육 플랫폼',
        description: '초보자부터 고급자까지 대상으로 한 온라인 부동산 투자 교육 과정. 실전 경험을 바탕으로 한 체계적인 커리큘럼을 제공합니다.',
        marketPotential: 68,
        developmentCost: '2,000-3,000만원',
        timeline: '4-5개월',
        successRate: 75,
        requiredSkills: ['교육 기획', '콘텐츠 제작', '온라인 강의'],
        targetRevenue: '월 200-600만원',
        keyFeatures: [
          '단계별 교육 과정',
          '실전 사례 분석',
          '온라인 시뮬레이션',
          '커뮤니티 기능',
          '수료증 발급'
        ],
        competitiveAdvantage: '실전 경험 기반의 차별화된 교육 콘텐츠'
      }
    ]
  });

  const [selectedRecommendation, setSelectedRecommendation] = useState<BusinessRecommendation | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationContext, setConsultationContext] = useState<string>('');

  // 상담 신청 핸들러
  const handleConsultationRequest = (context: string = '') => {
    setConsultationContext(context);
    setIsConsultationModalOpen(true);
  };

  // 리포트 다운로드 핸들러
  const handleDownloadReport = () => {
    try {
      // PDF 다운로드 (ReportTemplate 전용 인쇄)
      downloadAnalysisReport(analysisResult);
    } catch (error) {
      console.error('PDF 다운로드 실패, 텍스트 파일로 대체:', error);
      // 백업: 텍스트 파일 다운로드
      const fileName = downloadTextReport(analysisResult);
      alert(`분석 리포트가 ${fileName} 파일로 다운로드되었습니다.`);
    }
  };

  const renderScoreCard = (title: string, score: number, description: string, icon: any) => {
    const Icon = icon;
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-success-600 bg-success-50 border-success-200';
      if (score >= 70) return 'text-accent-600 bg-accent-50 border-accent-200';
      if (score >= 60) return 'text-primary-600 bg-primary-50 border-primary-200';
      return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    };

    return (
      <div className="card touch-spacing text-center">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${getScoreColor(score)}`}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
        <div className="text-3xl font-bold text-primary-600 mb-2">{score}점</div>
        <p className="text-neutral-600 text-sm">{description}</p>
      </div>
    );
  };

  const renderRecommendationDetail = (rec: BusinessRecommendation) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">{rec.title}</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <StarIconSolid className="h-5 w-5 text-accent-500 mr-1" />
                  <span className="font-medium text-neutral-700">성공 확률 {rec.successRate}%</span>
                </div>
                <div className="text-neutral-500">•</div>
                <div className="text-neutral-700 font-medium">{rec.timeline}</div>
              </div>
            </div>
            <button
              onClick={() => setSelectedRecommendation(null)}
              className="text-neutral-400 hover:text-neutral-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* 상세 설명 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">서비스 개요</h3>
            <p className="text-neutral-600 leading-relaxed">{rec.description}</p>
          </div>

          {/* 핵심 지표 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-primary-50 rounded-lg p-4 text-center">
              <div className="text-sm text-primary-600 font-medium mb-1">시장 잠재력</div>
              <div className="text-2xl font-bold text-primary-700">{rec.marketPotential}%</div>
            </div>
            <div className="bg-accent-50 rounded-lg p-4 text-center">
              <div className="text-sm text-accent-600 font-medium mb-1">개발 비용</div>
              <div className="text-lg font-bold text-accent-700">{rec.developmentCost}</div>
            </div>
            <div className="bg-success-50 rounded-lg p-4 text-center">
              <div className="text-sm text-success-600 font-medium mb-1">예상 매출</div>
              <div className="text-lg font-bold text-success-700">{rec.targetRevenue}</div>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4 text-center">
              <div className="text-sm text-neutral-600 font-medium mb-1">개발 기간</div>
              <div className="text-lg font-bold text-neutral-700">{rec.timeline}</div>
            </div>
          </div>

          {/* 주요 기능 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">핵심 기능</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {rec.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center bg-neutral-50 rounded-lg p-3">
                  <CheckIcon className="h-5 w-5 text-primary-600 mr-3 flex-shrink-0" />
                  <span className="text-neutral-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 경쟁 우위 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-3">경쟁 우위</h3>
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <p className="text-primary-800 font-medium">{rec.competitiveAdvantage}</p>
            </div>
          </div>

          {/* 필요 역량 */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">필요한 역량</h3>
            <div className="flex flex-wrap gap-2">
              {rec.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA 버튼 */}
          <div className="bg-primary-50 rounded-2xl p-6 text-center">
            <h4 className="text-xl font-bold text-primary-900 mb-3">
              이 비즈니스 모델에 관심이 있으신가요?
            </h4>
            <p className="text-primary-700 mb-6">
              전문 컨설턴트와 함께 구체적인 실행 계획을 수립해보세요
            </p>
            <button 
              onClick={() => handleConsultationRequest(rec.title)}
              className="btn-primary text-lg px-8 py-4"
            >
              무료 전문 상담 신청하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto container-padding py-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-success-600 to-success-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <DocumentTextIcon className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
              전문성 분석 리포트
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              AI 분석을 통해 도출한 맞춤형 비즈니스 추천 결과입니다
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto container-padding py-12">
        {/* 핵심 지표 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8 text-center">분석 결과 종합</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {renderScoreCard(
              '전문성 점수',
              analysisResult.expertiseScore,
              '경력과 전문 지식 수준',
              TrophyIcon
            )}
            {renderScoreCard(
              '시장 적합성',
              analysisResult.marketFitScore,
              '시장 기회와의 부합도',
              ArrowTrendingUpIcon
            )}
            {renderScoreCard(
              '성공 확률',
              analysisResult.successProbability,
              'AI 예측 성공 가능성',
              StarIcon
            )}
          </div>
        </section>

        {/* 강점과 위험 요소 */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 강점 */}
            <div className="card touch-spacing">
              <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                <ShieldCheckIcon className="h-6 w-6 text-success-600 mr-2" />
                발견된 강점
              </h3>
              <div className="space-y-4">
                {analysisResult.strengths.map((strength, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-neutral-700">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 위험 요소 */}
            <div className="card touch-spacing">
              <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-accent-600 mr-2" />
                고려할 위험 요소
              </h3>
              <div className="space-y-4">
                {analysisResult.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                      <ExclamationTriangleIcon className="h-3 w-3 text-white" />
                    </div>
                    <p className="text-neutral-700">{risk}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 비즈니스 모델 추천 */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">맞춤형 비즈니스 모델 추천</h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              분석 결과를 바탕으로 성공 확률이 높은 비즈니스 모델을 추천해드립니다
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {analysisResult.recommendations.map((rec, index) => (
              <div key={rec.id} className="card-interactive touch-spacing">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIconSolid
                          key={star}
                          className={`h-4 w-4 ${
                            star <= rec.successRate / 20 ? 'text-accent-500' : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-success-600 bg-success-50 px-2 py-1 rounded-full">
                    성공률 {rec.successRate}%
                  </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 mb-3">{rec.title}</h3>
                <p className="text-neutral-600 mb-6 line-clamp-3">{rec.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-neutral-600">
                      <BanknotesIcon className="h-4 w-4 mr-2" />
                      개발 비용
                    </div>
                    <span className="font-semibold text-neutral-800">{rec.developmentCost}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-neutral-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      개발 기간
                    </div>
                    <span className="font-semibold text-neutral-800">{rec.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-neutral-600">
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                      예상 매출
                    </div>
                    <span className="font-semibold text-success-700">{rec.targetRevenue}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecommendation(rec)}
                  className="w-full btn-primary"
                >
                  상세 정보 보기
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 다음 단계 */}
        <section className="mb-16">
          <div className="card touch-spacing bg-primary-50 border-primary-200">
            <h3 className="text-2xl font-bold text-primary-900 mb-6 text-center">
              다음 단계 가이드
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analysisResult.nextSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <p className="text-primary-800 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="text-center">
          <div className="card touch-spacing bg-neutral-900 text-white">
            <h3 className="text-3xl font-bold mb-4">전문 컨설턴트와 함께 시작하세요</h3>
            <p className="text-xl text-neutral-300 mb-8 max-w-2xl mx-auto">
              분석 결과를 바탕으로 전문가와 1:1 상담을 통해 구체적인 실행 계획을 수립해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => handleConsultationRequest()}
                className="btn-accent text-xl px-8 py-4"
              >
                <EnvelopeIcon className="h-6 w-6 mr-2" />
                무료 전문 상담 신청
              </button>
              <button 
                onClick={handleDownloadReport}
                className="btn-secondary text-xl px-8 py-4"
              >
                <DocumentTextIcon className="h-6 w-6 mr-2" />
                분석 리포트 다운로드
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 모달들 */}
      {selectedRecommendation && renderRecommendationDetail(selectedRecommendation)}
      
      <ConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={() => setIsConsultationModalOpen(false)}
        recommendedModel={consultationContext}
      />
    </div>
  );
};

export default AnalysisResultPage;