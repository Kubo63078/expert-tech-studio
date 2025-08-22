import React, { useState, useEffect } from 'react';
import { conversationManager } from '../services/conversationManager';

interface Question {
  id: string;
  question: string;
  purpose: string;
  options: string[];
  allowCustom: boolean;
  customPlaceholder?: string;
}

interface ConversationState {
  isActive: boolean;
  currentQuestion: Question | null;
  answers: any[];
  questionCount: number;
  isComplete: boolean;
  startTime: number;
}

interface SmartInterviewProps {
  onComplete: (answers: Record<string, string>) => void;
  onError?: (error: string) => void;
}

export const SmartInterview: React.FC<SmartInterviewProps> = ({ onComplete, onError }) => {
  const [state, setState] = useState<ConversationState | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // 상태 변경 리스너 등록
    const handleStateChange = (newState: ConversationState) => {
      setState(newState);
      
      if (newState.isComplete) {
        const answers = conversationManager.getAnswersForAnalysis();
        onComplete(answers);
      }
    };

    // 상태 메시지 콜백 등록
    const handleStatusMessage = (message: string) => {
      setLoadingMessage(message);
    };

    conversationManager.addListener(handleStateChange);
    conversationManager.setStatusCallback(handleStatusMessage);

    return () => {
      conversationManager.removeListener(handleStateChange);
    };
  }, [onComplete]);

  // 인터뷰 시작
  const handleStartInterview = async () => {
    setIsLoading(true);
    setError('');
    setLoadingMessage('AI 질문 생성 중...');
    
    try {
      await conversationManager.startInterview();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '인터뷰를 시작할 수 없습니다.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 답변 제출
  const handleSubmitAnswer = async () => {
    if (!selectedOption) {
      setError('답변을 선택해주세요.');
      return;
    }

    if (selectedOption === '기타' && !customAnswer.trim()) {
      setError('구체적인 답변을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');
    setLoadingMessage('다음 질문 생성 중...');

    try {
      await conversationManager.submitAnswer(selectedOption, customAnswer);
      
      // 다음 질문을 위해 초기화
      setSelectedOption('');
      setCustomAnswer('');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '답변을 처리할 수 없습니다.';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // 진행률 계산
  const getProgress = () => {
    if (!state) return { percentage: 0, current: 0, estimated: 6 };
    return conversationManager.getProgress();
  };

  // 인터뷰 시작 전 화면
  if (!state || !state.isActive) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎯 AI 맞춤형 전문성 분석
          </h2>
          <p className="text-gray-600 mb-6">
            AI가 회원님의 답변을 분석하여 맞춤형 질문을 생성합니다.<br/>
            약 5-10분 소요되며, 6-8개의 핵심 질문으로 구성됩니다.
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 mt-1">✨</div>
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-2">특별한 인터뷰 방식</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• AI가 이전 답변을 분석하여 다음 질문을 생성</li>
                  <li>• 선택지 + 기타 옵션으로 빠르고 정확한 답변</li>
                  <li>• 회원님의 전문성에 최적화된 비즈니스 솔루션 도출</li>
                </ul>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <button
            onClick={handleStartInterview}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            {isLoading ? (loadingMessage || '준비 중...') : '분석 시작하기'}
          </button>
          
          {isLoading && loadingMessage && (
            <div className="mt-3 text-sm text-blue-600 animate-pulse">
              {loadingMessage}
            </div>
          )}
        </div>
      </div>
    );
  }

  // 인터뷰 완료 화면
  if (state.isComplete) {
    const duration = ((Date.now() - state.startTime) / 1000).toFixed(1);
    
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            분석 완료!
          </h2>
          <p className="text-gray-600 mb-6">
            총 {state.questionCount}개 질문으로 {duration}초 만에 완료되었습니다.<br/>
            AI가 회원님의 답변을 분석하여 맞춤형 비즈니스 솔루션을 생성 중입니다.
          </p>
          
          <div className="animate-pulse text-blue-600">
            분석 결과를 생성하는 중...
          </div>
        </div>
      </div>
    );
  }

  const progress = getProgress();
  const currentQuestion = state.currentQuestion;

  if (!currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">다음 질문을 생성하는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 진행률 표시 */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            질문 {progress.current} / {progress.estimated}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progress.percentage)}% 완료
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* 질문 섹션 */}
      <div className="mb-8">
        <div className="bg-blue-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-blue-600 font-medium mb-2">
            📋 {currentQuestion.purpose}
          </p>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {currentQuestion.question}
        </h3>

        {/* 선택지 */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, index) => (
            <label 
              key={index}
              className={`block p-4 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                selectedOption === option 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => {
                    setSelectedOption(e.target.value);
                    if (e.target.value !== '기타') {
                      setCustomAnswer('');
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-900">{option}</span>
              </div>
            </label>
          ))}
        </div>

        {/* 기타 입력창 */}
        {selectedOption === '기타' && currentQuestion.allowCustom && (
          <div className="mb-6">
            <textarea
              value={customAnswer}
              onChange={(e) => setCustomAnswer(e.target.value)}
              placeholder={currentQuestion.customPlaceholder || '구체적으로 설명해주세요'}
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
            />
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* 버튼 영역 */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => conversationManager.goToPreviousQuestion()}
            disabled={state.questionCount <= 1 || isLoading}
            className="text-gray-500 hover:text-gray-700 disabled:text-gray-300 font-medium"
          >
            ← 이전 질문
          </button>

          <div className="flex flex-col items-end">
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedOption || isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              {isLoading ? (loadingMessage || '처리 중...') : '다음'}
            </button>
            
            {isLoading && loadingMessage && (
              <div className="mt-2 text-xs text-blue-600 animate-pulse">
                {loadingMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};