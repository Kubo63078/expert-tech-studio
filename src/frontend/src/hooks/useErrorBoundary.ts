import { useState, useCallback } from 'react';

interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: number;
  userId?: string;
  url: string;
  userAgent: string;
}

export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  const captureError = useCallback((error: Error, errorInfo?: { componentStack?: string }) => {
    const errorReport: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // 에러 로깅
    console.error('Error captured:', errorReport);

    // 개발 환경이 아닐 때만 에러 리포팅 서비스로 전송
    if (process.env.NODE_ENV === 'production') {
      reportError(errorReport);
    }

    setError(error);
  }, []);

  const throwError = useCallback((error: Error) => {
    throw error;
  }, []);

  return {
    error,
    resetError,
    captureError,
    throwError
  };
};

// 에러 리포팅 함수
const reportError = (errorInfo: ErrorInfo) => {
  // 실제 프로덕션에서는 Sentry, Bugsnag 등의 서비스 사용
  try {
    // 예시: 에러 리포팅 API 호출
    fetch('/api/v1/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorInfo),
    }).catch(console.error);
  } catch (e) {
    console.error('Failed to report error:', e);
  }
};