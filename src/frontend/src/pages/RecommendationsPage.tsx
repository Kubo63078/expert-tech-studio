import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LightBulbIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon,
  ArrowRightIcon,
  ExclamationCircleIcon,
  ArrowPathIcon as RefreshIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { BusinessRecommendation } from '../types/api';

const RecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<BusinessRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { recommendationService } = await import('../services/recommendationService');
      const data = await recommendationService.getMyRecommendations();
      
      setRecommendations(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { recommendationService } = await import('../services/recommendationService');
      await recommendationService.generateRecommendations();
      
      await loadRecommendations();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptRecommendation = async (recommendationId: string) => {
    try {
      const { recommendationService } = await import('../services/recommendationService');
      await recommendationService.acceptRecommendation(recommendationId);
      
      await loadRecommendations();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const getFeasibilityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getFeasibilityLabel = (score: number) => {
    if (score >= 8) return '높음';
    if (score >= 6) return '보통';
    return '낮음';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-senior-lg text-gray-600">AI 추천을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ExclamationCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
            <p className="text-senior-lg text-gray-600 mb-6">{error}</p>
            <button
              onClick={loadRecommendations}
              className="btn-primary"
            >
              <RefreshIcon className="h-5 w-5 mr-2" />
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI 비즈니스 추천
              </h1>
              <p className="text-senior-lg text-gray-600">
                당신의 전문성에 맞는 맞춤형 비즈니스 아이디어입니다.
              </p>
            </div>
            <button
              onClick={generateNewRecommendations}
              disabled={isLoading}
              className="btn-primary flex items-center"
            >
              <RefreshIcon className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              새 추천 생성
            </button>
          </div>
        </div>

        {recommendations.length === 0 ? (
          /* 추천 결과 없음 */
          <div className="text-center py-12">
            <LightBulbIcon className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              아직 추천 결과가 없습니다
            </h2>
            <p className="text-senior-lg text-gray-600 mb-8">
              전문가 프로필을 먼저 작성하시면 맞춤형 비즈니스 아이디어를 추천해드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/onboarding" className="btn-primary">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                프로필 작성하기
              </Link>
              <button
                onClick={generateNewRecommendations}
                className="btn-outline"
              >
                <RefreshIcon className="h-5 w-5 mr-2" />
                AI 추천 생성
              </button>
            </div>
          </div>
        ) : (
          /* 추천 결과 목록 */
          <div className="space-y-8">
            {recommendations.map((recommendation, index) => (
              <div key={recommendation.id} className="card p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mr-3">
                        추천 #{index + 1}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {recommendation.businessIdea.industry}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {recommendation.businessIdea.title}
                    </h2>
                    <p className="text-senior-lg text-gray-600 mb-4">
                      {recommendation.businessIdea.description}
                    </p>
                  </div>
                  
                  <div className="ml-6 flex flex-col items-end">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getFeasibilityColor(recommendation.feasibilityScore.overall)}`}>
                      <StarIcon className="h-4 w-4 mr-1" />
                      실현 가능성: {getFeasibilityLabel(recommendation.feasibilityScore.overall)}
                    </div>
                    <div className="text-right mt-2">
                      <p className="text-sm text-gray-500">종합 점수</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {recommendation.feasibilityScore.overall}/10
                      </p>
                    </div>
                  </div>
                </div>

                {/* 상세 점수 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">기술적 실현성</span>
                      <span className="text-lg font-bold text-blue-600">
                        {recommendation.feasibilityScore.technical}/10
                      </span>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-900">시장성</span>
                      <span className="text-lg font-bold text-green-600">
                        {recommendation.feasibilityScore.market}/10
                      </span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-yellow-900">수익성</span>
                      <span className="text-lg font-bold text-yellow-600">
                        {recommendation.feasibilityScore.financial}/10
                      </span>
                    </div>
                  </div>
                </div>

                {/* 비즈니스 모델 */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-senior-xl font-semibold text-gray-900 mb-4">
                    비즈니스 모델
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-senior-lg font-medium text-gray-900 mb-2">가치 제안</h4>
                      <p className="text-senior-base text-gray-600">
                        {recommendation.businessModel.valueProposition}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-senior-lg font-medium text-gray-900 mb-2">수익원</h4>
                      <ul className="space-y-1">
                        {recommendation.businessModel.revenueStreams.map((stream, idx) => (
                          <li key={idx} className="text-senior-base text-gray-600 flex items-center">
                            <CurrencyDollarIcon className="h-4 w-4 mr-2 text-green-500" />
                            {stream}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 구현 계획 */}
                <div className="mb-6">
                  <h3 className="text-senior-xl font-semibold text-gray-900 mb-4">
                    구현 계획
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <ClockIcon className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="text-senior-lg font-medium">개발 기간: {recommendation.implementationPlan.totalTimeline}</span>
                      </div>
                      <div className="flex items-center mb-4">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-senior-lg font-medium">
                          예상 비용: {formatCurrency(recommendation.implementationPlan.estimatedCost)}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-senior-base font-medium text-gray-900 mb-2">개발 단계</h4>
                      <div className="space-y-2">
                        {recommendation.implementationPlan.phases.map((phase, idx) => (
                          <div key={idx} className="flex items-center text-senior-base">
                            <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {idx + 1}
                            </span>
                            <span className="text-gray-700">{phase.name} ({phase.duration})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 시장 분석 */}
                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="text-senior-xl font-semibold text-gray-900 mb-4">
                    시장 분석
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-senior-lg font-medium text-gray-900 mb-2 flex items-center">
                        <ChartBarIcon className="h-5 w-5 mr-2 text-blue-600" />
                        시장 규모 및 경쟁
                      </h4>
                      <p className="text-senior-base text-gray-600 mb-3">
                        {recommendation.marketAnalysis.marketSize}
                      </p>
                      <p className="text-senior-base text-gray-600">
                        {recommendation.marketAnalysis.competition}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-senior-lg font-medium text-gray-900 mb-2">기회 요소</h4>
                      <ul className="space-y-1 mb-4">
                        {recommendation.marketAnalysis.opportunities.map((opportunity, idx) => (
                          <li key={idx} className="text-senior-base text-gray-600 flex items-start">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                      <h4 className="text-senior-lg font-medium text-gray-900 mb-2">위험 요소</h4>
                      <ul className="space-y-1">
                        {recommendation.marketAnalysis.risks.map((risk, idx) => (
                          <li key={idx} className="text-senior-base text-gray-600 flex items-start">
                            <XCircleIcon className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                            {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {recommendation.status === 'PRESENTED' && (
                    <button
                      onClick={() => acceptRecommendation(recommendation.id)}
                      className="btn-primary flex items-center justify-center"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" />
                      이 아이디어로 진행하기
                    </button>
                  )}
                  
                  <button
                    onClick={() => setSelectedRecommendation(
                      selectedRecommendation === recommendation.id ? null : recommendation.id
                    )}
                    className="btn-outline flex items-center justify-center"
                  >
                    <DocumentTextIcon className="h-5 w-5 mr-2" />
                    상세 계획서 다운로드
                  </button>
                  
                  <button className="btn-outline flex items-center justify-center">
                    상담 예약하기
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </button>
                </div>

                {/* 상태 표시 */}
                {recommendation.status === 'ACCEPTED' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-senior-base font-medium text-green-800">
                        선택된 아이디어입니다. 프로젝트 관리에서 진행 상황을 확인하세요.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;