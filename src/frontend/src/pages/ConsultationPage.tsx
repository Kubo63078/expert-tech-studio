import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { SmartInterview } from '../components/SmartInterview';
import { analysisService } from '../services/analysisService';

const ConsultationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'intro' | 'interview' | 'analysis'>('intro');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>('');

  // AI 인터뷰 완료 처리
  const handleInterviewComplete = async (answers: Record<string, string>) => {
    console.log('📋 AI 인터뷰 완료, 답변:', answers);
    setCurrentStep('analysis');
    setIsAnalyzing(true);
    setError('');

    try {
      // AI 인터뷰 답변을 기존 분석 시스템 형식으로 변환
      const analysisAnswers = convertAnswersForAnalysis(answers);
      
      // AI 분석 실행
      const result = await analysisService.analyzeExpertise(analysisAnswers);
      
      console.log('✅ AI 분석 완료:', result);
      
      // 분석 결과 페이지로 이동
      navigate('/analysis-result', { 
        state: { 
          analysisResult: result,
          interviewAnswers: answers,
          interviewType: 'smart_ai'
        } 
      });
    } catch (err) {
      console.error('❌ AI 분석 실패:', err);
      const errorMessage = err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.';
      setError(errorMessage);
      setIsAnalyzing(false);
    }
  };

  // AI 인터뷰 오류 처리
  const handleInterviewError = (errorMessage: string) => {
    console.error('❌ AI 인터뷰 오류:', errorMessage);
    setError(errorMessage);
  };

  // AI 인터뷰 답변을 기존 분석 시스템 형식으로 변환
  const convertAnswersForAnalysis = (smartAnswers: Record<string, string>) => {
    // AI 인터뷰 답변을 기존 analysisService가 이해할 수 있는 형식으로 변환
    const converted: Record<string, any> = {};

    Object.entries(smartAnswers).forEach(([key, value]) => {
      if (key.includes('question')) return; // 질문 텍스트는 제외

      // 키 매핑 (필요시 확장)
      const mappedKey = mapQuestionKey(key, value);
      if (mappedKey) {
        converted[mappedKey] = value;
      }
    });

    // 기본 필수 필드 추가 (AI가 생성하지 않은 경우)
    if (!converted.basic_name) {
      converted.basic_name = '고객'; // 기본값
    }

    console.log('🔄 답변 변환:', { original: smartAnswers, converted });
    return converted;
  };

  // 질문 키 매핑 헬퍼
  const mapQuestionKey = (aiKey: string, value: string): string | null => {
    // AI 질문 답변을 기존 시스템 키로 매핑
    const lowerValue = value.toLowerCase();

    // 전문 분야 매핑
    if (lowerValue.includes('부동산')) return 'expertise_field';
    if (lowerValue.includes('금융') || lowerValue.includes('보험')) return 'expertise_field';
    if (lowerValue.includes('교육') || lowerValue.includes('강의')) return 'expertise_field';
    if (lowerValue.includes('컨설팅')) return 'expertise_field';

    // 비즈니스 관련 매핑
    if (lowerValue.includes('매출') || lowerValue.includes('수익')) return 'business_goal';
    if (lowerValue.includes('고객') || lowerValue.includes('클라이언트')) return 'target_customers';
    if (lowerValue.includes('서비스') || lowerValue.includes('플랫폼')) return 'service_type';

    // 기본 키 반환 (필터링 없이)
    return aiKey;
  };

  // 인트로 화면
  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* 헤더 */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                🎯 AI 맞춤형 전문성 분석
              </h1>
              <p className="text-xl text-gray-600">
                AI가 실시간으로 생성하는 질문을 통해 회원님만의 IT 비즈니스 솔루션을 찾아드립니다
              </p>
            </div>

            {/* 특징 카드들 */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <SparklesIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI 맞춤형 질문</h3>
                <p className="text-gray-600">
                  이전 답변을 분석하여 다음 질문을 지능적으로 생성
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <ClockIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">빠른 완료</h3>
                <p className="text-gray-600">
                  6-8개 핵심 질문으로 5-10분 내 완료
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <ShieldCheckIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">정확한 분석</h3>
                <p className="text-gray-600">
                  선택지 + 기타 방식으로 정확하고 빠른 답변
                </p>
              </div>
            </div>

            {/* 프로세스 안내 */}
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-center mb-6">진행 과정</h2>
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
                  <p className="font-medium">AI 질문 생성</p>
                  <p className="text-sm text-gray-600">맞춤형 질문 시작</p>
                </div>
                <div className="hidden md:block text-gray-400">→</div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
                  <p className="font-medium">스마트 답변</p>
                  <p className="text-sm text-gray-600">선택지 + 기타 입력</p>
                </div>
                <div className="hidden md:block text-gray-400">→</div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
                  <p className="font-medium">AI 분석</p>
                  <p className="text-sm text-gray-600">맞춤 솔루션 도출</p>
                </div>
              </div>
            </div>

            {/* 시작 버튼 */}
            <div className="text-center">
              <button
                onClick={() => setCurrentStep('interview')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
              >
                AI 분석 시작하기 →
              </button>
              <p className="text-sm text-gray-500 mt-4">
                * 소요 시간: 약 5-10분 | 질문 수: 6-8개 (동적 생성)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // AI 인터뷰 진행 화면
  if (currentStep === 'interview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-12">
          <SmartInterview 
            onComplete={handleInterviewComplete}
            onError={handleInterviewError}
          />
          
          {error && (
            <div className="max-w-2xl mx-auto mt-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={() => setCurrentStep('intro')}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium"
                >
                  처음으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 분석 중 화면
  if (currentStep === 'analysis') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
          <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            AI 분석 진행 중...
          </h2>
          <p className="text-gray-600 mb-4">
            {isAnalyzing ? 
              'GPT-4o가 회원님의 답변을 분석하여 맞춤형 비즈니스 솔루션을 생성하고 있습니다.' :
              '분석이 완료되었습니다. 결과 페이지로 이동 중...'
            }
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <p className="text-red-800 mb-2">{error}</p>
              <button
                onClick={() => setCurrentStep('intro')}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                처음으로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};

export default ConsultationPage;