import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ConsultationModal from '../components/ConsultationModal';
import { downloadAnalysisReport, downloadTextReport } from '../utils/downloadReport';
import type { AnalysisResult as AIAnalysisResult } from '../services/analysisService';
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
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // AI 분석 결과를 페이지 형식으로 변환하는 함수
  const convertAIResponseToPageFormat = (aiResult: AIAnalysisResult): AnalysisResult => {
    // successProbability에서 숫자만 추출 (예: "85%" → 85)
    const successProb = parseInt(aiResult.successProbability.replace(/[^\d]/g, '')) || 75;
    
    return {
      expertiseScore: aiResult.expertiseScore,
      marketFitScore: Math.min(90, aiResult.expertiseScore + 5), // 전문성 기반 계산
      successProbability: successProb,
      strengths: aiResult.keyStrengths.length > 0 ? aiResult.keyStrengths : [
        '축적된 전문 지식과 경험',
        '업계 이해도와 인사이트',
        '고객 니즈 파악 능력'
      ],
      riskFactors: [
        '초기 고객 확보의 어려움',
        aiResult.urgencyFactor || '경쟁이 치열한 시장 환경',
        '기술적 학습 곡선'
      ],
      nextSteps: [
        aiResult.nextStepTeaser || 'MVP(최소 실행 가능 제품) 개발',
        '초기 사용자 그룹 확보',
        '마케팅 전략 수립',
        '법적 컴플라이언스 검토'
      ],
      recommendations: [
        {
          id: 'ai-powered-service',
          title: aiResult.businessHint || 'AI 기반 전문 서비스',
          description: aiResult.personalizedInsight + ' ' + (aiResult.marketOpportunity || '시장에서 큰 성장 잠재력이 있습니다.'),
          marketPotential: Math.min(90, aiResult.expertiseScore),
          developmentCost: '2,000-4,000만원',
          timeline: '4-8개월',
          successRate: successProb,
          requiredSkills: aiResult.keyStrengths.slice(0, 3),
          targetRevenue: '월 300-800만원',
          keyFeatures: [
            '맞춤형 AI 솔루션',
            '전문 지식 기반 서비스',
            '온라인 플랫폼',
            '고객 데이터 분석',
            '실시간 상담 서비스'
          ],
          competitiveAdvantage: aiResult.exclusiveValue || '전문 경험과 AI 기술의 융합'
        }
      ]
    };
  };

  // useEffect로 AI 결과 로드
  useEffect(() => {
    const state = location.state as any;
    if (state?.analysisResult) {
      console.log('🎯 AI 분석 결과 로드:', state.analysisResult);
      const convertedResult = convertAIResponseToPageFormat(state.analysisResult);
      setAnalysisResult(convertedResult);
    } else {
      // 폴백 데이터 (AI 결과가 없을 때)
      console.log('⚠️ AI 결과 없음, 폴백 데이터 사용');
      setAnalysisResult(getFallbackData());
    }
  }, [location.state]);

  // 폴백 데이터 함수
  const getFallbackData = (): AnalysisResult => ({
    expertiseScore: 75,
    marketFitScore: 70,
    successProbability: 75,
    strengths: [
      '축적된 전문 지식과 경험',
      '업계 이해도와 인사이트',
      '고객 니즈 파악 능력'
    ],
    riskFactors: [
      '초기 고객 확보의 어려움',
      '경쟁이 치열한 시장 환경',
      '기술적 학습 곡선'
    ],
    nextSteps: [
      'MVP(최소 실행 가능 제품) 개발',
      '초기 사용자 그룹 확보',
      '마케팅 전략 수립'
    ],
    recommendations: [
      {
        id: 'ai-service',
        title: 'AI 기반 전문 서비스',
        description: '전문 지식과 AI 기술을 결합한 맞춤형 서비스 플랫폼',
        marketPotential: 75,
        developmentCost: '2,000-4,000만원',
        timeline: '4-8개월',
        successRate: 75,
        requiredSkills: ['전문 지식', '기술 이해', '고객 서비스'],
        targetRevenue: '월 300-800만원',
        keyFeatures: ['맞춤형 솔루션', '전문 상담', '온라인 플랫폼'],
        competitiveAdvantage: '전문 경험과 AI 기술의 융합'
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

  // 로딩 중일 때
  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600">분석 결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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