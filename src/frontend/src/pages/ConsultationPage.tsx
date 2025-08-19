import { useState, useEffect } from 'react';
import { 
  ChevronRightIcon, 
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserIcon,
  BriefcaseIcon,
  LightBulbIcon,
  ChartBarIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { 
  interviewQuestions, 
  defaultQuestionFlow, 
  categoryDescriptions,
  type InterviewQuestion
} from '../data/interviewQuestions';
import { analysisService } from '../services/analysisService';

interface InterviewStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  estimatedTime: string;
}

const ConsultationPage = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'interview' | 'analysis'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // 인터뷰 단계 정의
  const interviewSteps: InterviewStep[] = [
    {
      id: 'basic',
      title: categoryDescriptions.basic.title,
      description: categoryDescriptions.basic.description,
      icon: UserIcon,
      estimatedTime: categoryDescriptions.basic.estimatedTime
    },
    {
      id: 'expertise',
      title: categoryDescriptions.expertise.title,
      description: categoryDescriptions.expertise.description,
      icon: BriefcaseIcon,
      estimatedTime: categoryDescriptions.expertise.estimatedTime
    },
    {
      id: 'business',
      title: categoryDescriptions.business.title,
      description: categoryDescriptions.business.description,
      icon: LightBulbIcon,
      estimatedTime: categoryDescriptions.business.estimatedTime
    },
    {
      id: 'goals',
      title: categoryDescriptions.goals.title,
      description: categoryDescriptions.goals.description,
      icon: ChartBarIcon,
      estimatedTime: categoryDescriptions.goals.estimatedTime
    }
  ];

  // 현재 질문 흐름 (동적으로 변경 가능)
  const [questionFlow, setQuestionFlow] = useState(defaultQuestionFlow);
  const [selectedMultiOptions, setSelectedMultiOptions] = useState<string[]>([]);

  // currentStep이 변경될 때마다 스크롤탑 (모든 단계 전환에 대응)
  useEffect(() => {
    const scrollToTop = () => {
      try {
        window.scrollTo({ 
          top: 0, 
          left: 0, 
          behavior: 'instant' 
        });
      } catch (error) {
        window.scrollTo(0, 0);
      }
      
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // intro → interview, interview → analysis 모든 단계 변경에서 스크롤탑
    if (currentStep !== 'intro') {
      setTimeout(scrollToTop, 0);
      scrollToTop();
    }
  }, [currentStep]);

  const handleStartInterview = () => {
    setCurrentStep('interview');
    
    // 상태 변경 후 즉시 스크롤탑 (같은 페이지 내 상태 변경이므로 수동 처리)
    const scrollToTop = () => {
      try {
        // 방법 1: 즉시 스크롤
        window.scrollTo({ 
          top: 0, 
          left: 0, 
          behavior: 'instant' 
        });
      } catch (error) {
        // 방법 2: 구형 브라우저 fallback
        window.scrollTo(0, 0);
      }
      
      // 방법 3: document 직접 조작 (추가 보장)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };
    
    // DOM 업데이트 후 스크롤 실행
    setTimeout(scrollToTop, 0);
    // 즉시도 한 번 실행 (이중 보장)
    scrollToTop();
  };

  const performAnalysis = async () => {
    try {
      const result = await analysisService.analyzeExpertise(answers);
      setAnalysisResult(result);
      setIsLoading(false);
    } catch (error) {
      console.error('Analysis failed:', error);
      setIsLoading(false);
      // 에러 시에도 목업 결과 표시를 위해 다시 시도
      setTimeout(async () => {
        try {
          const fallbackResult = await analysisService.analyzeExpertise(answers);
          setAnalysisResult(fallbackResult);
        } catch (fallbackError) {
          console.error('Fallback analysis failed:', fallbackError);
        }
      }, 1000);
    }
  };

  const handleAnswerSubmit = (questionId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    setSelectedMultiOptions([]); // 다중 선택 초기화
    
    if (currentQuestionIndex < questionFlow.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // 인터뷰 완료 - AI 분석 시작
      setCurrentStep('analysis');
      setIsLoading(true);
      
      // 실제 AI API 호출
      performAnalysis();
    }
  };

  const handleMultiSelectToggle = (option: string) => {
    setSelectedMultiOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(item => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const getCurrentQuestion = (): InterviewQuestion => {
    const questionId = questionFlow[currentQuestionIndex];
    return interviewQuestions[questionId];
  };

  const getCurrentCategory = () => {
    const question = getCurrentQuestion();
    return question.category;
  };

  const renderIntroPage = () => (
    <div className="max-w-4xl mx-auto container-padding py-12">
      {/* 헤더 섹션 */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-6 py-3 bg-primary-100 text-primary-700 font-semibold rounded-full mb-6">
          <SparklesIcon className="h-5 w-5 mr-2" />
          무료 전문성 분석
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">
          당신의 전문성을 <span className="text-brand">IT 비즈니스로</span><br />
          발전시켜보세요
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
          25년 업계 경험을 바탕으로 개발한 AI 분석 시스템이 
          <strong className="text-neutral-800 font-semibold"> 30분 만에 맞춤형 비즈니스 방향을 제안</strong>해드립니다.
        </p>
      </div>

      {/* 프로세스 단계 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {interviewSteps.map((step, index) => (
          <div key={step.id} className="card touch-spacing text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <step.icon className="h-8 w-8 text-white" />
            </div>
            <div className="text-sm font-bold text-primary-600 mb-2">STEP {index + 1}</div>
            <h3 className="text-lg font-bold text-neutral-900 mb-2">{step.title}</h3>
            <p className="text-neutral-600 text-sm mb-4">{step.description}</p>
            <div className="inline-flex items-center px-3 py-1 bg-accent-50 border border-accent-200 text-accent-700 text-xs font-medium rounded-full">
              <ClockIcon className="h-3 w-3 mr-1" />
              {step.estimatedTime}
            </div>
          </div>
        ))}
      </div>

      {/* 특징 및 보장 사항 */}
      <div className="bg-neutral-50 rounded-2xl p-8 mb-10">
        <h3 className="text-2xl font-bold text-neutral-900 text-center mb-8">
          왜 ExpertTech Studio인가요?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="h-7 w-7 text-white" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">100% 무료 분석</h4>
            <p className="text-sm text-neutral-600">상담료 없이 전문적인 분석 리포트를 받아보세요</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="h-7 w-7 text-white" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">AI 기반 정밀 분석</h4>
            <p className="text-sm text-neutral-600">200+ 성공 사례 데이터로 훈련된 AI가 분석</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="h-7 w-7 text-white" />
            </div>
            <h4 className="font-semibold text-neutral-900 mb-2">즉시 결과 확인</h4>
            <p className="text-sm text-neutral-600">분석 완료 후 바로 맞춤형 비즈니스 플랜 확인</p>
          </div>
        </div>
      </div>

      {/* CTA 버튼 */}
      <div className="text-center">
        <button
          onClick={handleStartInterview}
          className="inline-flex items-center px-10 py-5 bg-primary-600 hover:bg-primary-700 text-white text-2xl font-bold rounded-button shadow-professional hover:shadow-button-hover transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-400/50 group"
        >
          <span className="mr-3 text-2xl">🚀</span>
          전문성 분석 시작하기 (무료)
          <ChevronRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
        </button>
        <p className="text-sm text-neutral-500 mt-4">
          * 언제든 중단하고 나중에 이어서 진행할 수 있습니다
        </p>
      </div>
    </div>
  );

  const renderInterviewPage = () => {
    const currentQuestion = getCurrentQuestion();
    const progress = ((currentQuestionIndex + 1) / questionFlow.length) * 100;
    const currentCategory = getCurrentCategory();

    return (
      <div className="max-w-3xl mx-auto container-padding py-12">
        {/* 카테고리 및 진행률 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-2">
                {categoryDescriptions[currentCategory].title}
              </span>
              <h2 className="text-lg font-semibold text-neutral-700">
                질문 {currentQuestionIndex + 1} / {questionFlow.length}
              </h2>
            </div>
            <span className="text-sm text-neutral-500">{Math.round(progress)}% 완료</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 질문 카드 */}
        <div className="card touch-spacing mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              {currentQuestion.question}
            </h3>
            {currentQuestion.description && (
              <p className="text-neutral-600 mb-4">{currentQuestion.description}</p>
            )}
          </div>

          {/* 답변 입력 영역 */}
          <div className="space-y-4">
            {currentQuestion.type === 'text' && (
              <div>
                <input
                  type="text"
                  placeholder={currentQuestion.placeholder}
                  className="input-field"
                  defaultValue={answers[currentQuestion.id] || ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                      handleAnswerSubmit(currentQuestion.id, e.currentTarget.value);
                    }
                  }}
                />
                <p className="text-sm text-neutral-500 mt-2">
                  Enter를 누르면 다음 질문으로 이동합니다
                </p>
              </div>
            )}

            {currentQuestion.type === 'textarea' && (
              <div>
                <textarea
                  placeholder={currentQuestion.placeholder}
                  className="input-field min-h-[120px] resize-y"
                  defaultValue={answers[currentQuestion.id] || ''}
                  rows={4}
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-neutral-500">
                    자세히 적어주실수록 더 정확한 분석이 가능합니다
                  </p>
                  <button
                    onClick={(e) => {
                      const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                      if (textarea?.value.trim()) {
                        handleAnswerSubmit(currentQuestion.id, textarea.value);
                      }
                    }}
                    className="btn-primary"
                  >
                    다음 →
                  </button>
                </div>
              </div>
            )}

            {currentQuestion.type === 'select' && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSubmit(currentQuestion.id, option)}
                    className={`w-full text-left px-6 py-4 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                      answers[currentQuestion.id] === option
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <span className="text-base font-medium">{option}</span>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion.type === 'multiselect' && (
              <div>
                <div className="space-y-3 mb-4">
                  {currentQuestion.options?.map((option, index) => {
                    const isSelected = selectedMultiOptions.includes(option) || 
                      (answers[currentQuestion.id] && answers[currentQuestion.id].includes(option));
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleMultiSelectToggle(option)}
                        className={`w-full text-left px-6 py-4 border-2 rounded-lg transition-all duration-200 focus:outline-none flex items-center ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                          isSelected ? 'border-primary-500 bg-primary-500' : 'border-neutral-300'
                        }`}>
                          {isSelected && <CheckIcon className="h-3 w-3 text-white" />}
                        </div>
                        <span className="text-base font-medium">{option}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => handleAnswerSubmit(currentQuestion.id, selectedMultiOptions)}
                  disabled={selectedMultiOptions.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  선택 완료 ({selectedMultiOptions.length}개) →
                </button>
              </div>
            )}

            {currentQuestion.type === 'scale' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-neutral-500">1 (매우 낮음)</span>
                  <span className="text-sm text-neutral-500">10 (매우 높음)</span>
                </div>
                <div className="grid grid-cols-10 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <button
                      key={score}
                      onClick={() => handleAnswerSubmit(currentQuestion.id, score)}
                      className={`h-12 rounded-lg border-2 font-bold transition-all duration-200 ${
                        answers[currentQuestion.id] === score
                          ? 'border-primary-500 bg-primary-500 text-white'
                          : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50 text-neutral-600'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-neutral-500 text-center">
                  점수를 클릭해주세요
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 네비게이션 */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(prev => prev - 1);
                setSelectedMultiOptions([]); // 이전 질문으로 돌아갈 때 다중선택 초기화
              }
            }}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 text-neutral-600 hover:text-neutral-800 disabled:text-neutral-400 transition-colors duration-200"
          >
            ← 이전 질문
          </button>
          
          <div className="text-right">
            <div className="text-sm text-neutral-500">
              예상 소요시간: 약 {Math.max(1, Math.ceil((questionFlow.length - currentQuestionIndex) * 0.8))}분
            </div>
            <div className="text-xs text-neutral-400 mt-1">
              {currentQuestion.required && '* 필수 질문'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalysisPage = () => (
    <div className="max-w-4xl mx-auto container-padding py-12 text-center">
      {isLoading ? (
        <>
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <SparklesIcon className="h-10 w-10 text-white animate-spin" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            AI가 분석 중입니다...
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            입력해주신 정보를 바탕으로 맞춤형 비즈니스 기회를 분석하고 있습니다.
          </p>
          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center text-neutral-600">
              <div className="w-4 h-4 bg-success-500 rounded-full mr-3 animate-pulse"></div>
              전문성 강점 분석 완료
            </div>
            <div className="flex items-center text-neutral-600">
              <div className="w-4 h-4 bg-primary-500 rounded-full mr-3 animate-pulse"></div>
              시장 기회 분석 중...
            </div>
            <div className="flex items-center text-neutral-600">
              <div className="w-4 h-4 bg-accent-500 rounded-full mr-3 animate-pulse"></div>
              비즈니스 모델 생성 중...
            </div>
            <div className="flex items-center text-neutral-400">
              <div className="w-4 h-4 bg-neutral-300 rounded-full mr-3"></div>
              맞춤형 리포트 작성 중...
            </div>
          </div>
          
          {/* 분석 중 추가 정보 */}
          <div className="mt-12 bg-primary-50 rounded-2xl p-8 text-left max-w-2xl mx-auto">
            <h3 className="text-lg font-bold text-primary-900 mb-4">분석 중인 내용</h3>
            <div className="space-y-3 text-primary-800">
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-primary-600 mr-3" />
                <span>200개 이상의 성공 사례와 비교 분석</span>
              </div>
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-primary-600 mr-3" />
                <span>시장 동향과 기회 요소 평가</span>
              </div>
              <div className="flex items-center">
                <LightBulbIcon className="h-5 w-5 text-primary-600 mr-3" />
                <span>개인 전문성에 최적화된 비즈니스 모델 생성</span>
              </div>
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-primary-600 mr-3" />
                <span>성공 확률과 위험 요소 계산</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-20 h-20 bg-gradient-to-br from-success-600 to-success-700 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheckIcon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            분석이 완료되었습니다!
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            총 {questionFlow.length}개 질문 분석을 통해 맞춤형 비즈니스 분석 리포트와 추천 모델을 생성했습니다.
          </p>
          
          {/* 실제 분석 결과 표시 */}
          {analysisResult && (
            <>
              {/* 개인화된 통찰 */}
              <div className="bg-primary-50 rounded-2xl p-8 mb-8 max-w-3xl mx-auto text-left">
                <h3 className="text-lg font-bold text-primary-900 mb-4">🎯 맞춤형 분석 결과</h3>
                <div className="text-primary-800 text-lg leading-relaxed mb-6">
                  {analysisResult.personalizedInsight}
                </div>
                
                {/* 점수 및 기본 지표 */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center bg-white rounded-lg p-4">
                    <div className="text-3xl font-bold text-primary-600">{analysisResult.expertiseScore}점</div>
                    <div className="text-sm text-neutral-600">전문성 점수</div>
                  </div>
                  <div className="text-center bg-white rounded-lg p-4">
                    <div className="text-3xl font-bold text-success-600">{analysisResult.successProbability}</div>
                    <div className="text-sm text-neutral-600">예측 성공 확률</div>
                  </div>
                </div>

                {/* 핵심 강점 */}
                <div className="mb-6">
                  <h4 className="font-bold text-primary-900 mb-3">🔥 발견된 핵심 강점</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {analysisResult.keyStrengths.map((strength: string, index: number) => (
                      <div key={index} className="flex items-center text-sm text-primary-700">
                        <CheckIcon className="h-4 w-4 text-success-600 mr-2" />
                        {strength}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 비즈니스 기회 (힌트만) */}
                <div className="bg-accent-50 rounded-lg p-4 border-2 border-accent-200">
                  <h4 className="font-bold text-accent-900 mb-2">💡 발견된 비즈니스 기회</h4>
                  <p className="text-accent-800 mb-3">{analysisResult.businessHint}</p>
                  <p className="text-accent-700 text-sm italic">* 구체적 구현 방법과 기술 스택은 전문가 상담에서 공개됩니다</p>
                </div>
              </div>

              {/* 긴급성 & 차별화 */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 mb-8 max-w-3xl mx-auto">
                <h3 className="text-lg font-bold text-red-900 mb-6">⚠️ 중요한 타이밍 정보</h3>
                
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-900 mb-2">🚨 시장 기회</h4>
                    <p className="text-orange-800">{analysisResult.marketOpportunity}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-900 mb-2">🛡️ ExpertTech만의 장점</h4>
                    <p className="text-blue-800">{analysisResult.exclusiveValue}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                    <h4 className="font-bold text-red-900 mb-2">⏰ 지금 시작해야 하는 이유</h4>
                    <p className="text-red-800">{analysisResult.urgencyFactor}</p>
                  </div>
                </div>
              </div>

              {/* 다음 단계 안내 */}
              <div className="bg-neutral-50 rounded-2xl p-8 mb-8 max-w-3xl mx-auto text-left">
                <h3 className="text-lg font-bold text-neutral-900 mb-4">🔍 더 자세한 정보가 필요하신가요?</h3>
                <p className="text-neutral-700 mb-6 leading-relaxed">
                  {analysisResult.nextStepTeaser}
                </p>
                
                <div className="bg-primary-100 rounded-lg p-4">
                  <h4 className="font-bold text-primary-900 mb-2">전문가 상담에서 추가로 제공되는 내용:</h4>
                  <ul className="text-primary-800 text-sm space-y-1">
                    <li>• 3가지 구체적 비즈니스 모델 상세 설명</li>
                    <li>• 기술 스택 및 개발 로드맵</li>
                    <li>• 파트너사 네트워크 및 협력 방안</li>
                    <li>• 수익 모델 및 ROI 시뮬레이션</li>
                    <li>• 6개월 단계별 실행 계획</li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          {/* CTA 버튼들 */}
          <div className="space-y-4">
            <button 
              onClick={() => window.location.href = '/quick-consultation'}
              className="inline-flex items-center px-10 py-5 bg-accent-600 hover:bg-accent-700 text-white text-xl font-bold rounded-button shadow-professional hover:shadow-button-hover transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-400/50 group"
            >
              <span className="mr-3">🚀</span>
              무료 전문가 상담 신청하기
              <ChevronRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <div className="flex space-x-4 justify-center">
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                홈으로 돌아가기
              </button>
              <button 
                onClick={() => window.location.href = '/quick-consultation'}
                className="btn-primary"
              >
                빠른 상담도 받아보기
              </button>
            </div>
          </div>
          
          <p className="text-sm text-neutral-500 mt-6">
            * 더 자세한 정보는 전문가 상담을 통해 확인하실 수 있습니다
          </p>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep === 'intro' && renderIntroPage()}
      {currentStep === 'interview' && renderInterviewPage()}
      {currentStep === 'analysis' && renderAnalysisPage()}
    </div>
  );
};

export default ConsultationPage;