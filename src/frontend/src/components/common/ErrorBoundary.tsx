import React, { Component, ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // 부모 컴포넌트에 에러 전달
    this.props.onError?.(error, errorInfo);

    // 에러 리포팅 (프로덕션 환경)
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo);
    }
  }

  reportError(error: Error, errorInfo: React.ErrorInfo) {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: localStorage.getItem('userId') || undefined
    };

    // 에러 리포팅 서비스로 전송
    fetch('/api/v1/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorReport),
    }).catch(console.error);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  문제가 발생했습니다
                </h2>
                <p className="text-senior-base text-gray-600 mb-6">
                  예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                </p>
                
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mb-6 text-left">
                    <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                      기술적 세부사항
                    </summary>
                    <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-32">
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}

                <div className="space-y-3">
                  <button
                    onClick={this.handleRetry}
                    className="w-full btn-primary"
                  >
                    다시 시도
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="w-full btn-outline"
                  >
                    페이지 새로고침
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500">
                    문제가 계속 발생하면{' '}
                    <a 
                      href="mailto:support@experttech.studio" 
                      className="text-primary-600 hover:text-primary-500"
                    >
                      고객지원
                    </a>
                    에 문의해주세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;