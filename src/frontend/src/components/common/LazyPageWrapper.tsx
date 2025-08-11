import React, { Suspense } from 'react';
import LoadingSpinner from '../ui/LoadingSpinner';

interface LazyPageWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 지연 로딩 페이지를 위한 래퍼 컴포넌트
 * 40-50대 사용자를 위한 로딩 상태 최적화
 */
const LazyPageWrapper: React.FC<LazyPageWrapperProps> = ({ 
  children, 
  fallback 
}) => {
  const defaultFallback = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-senior-lg text-gray-600 font-medium">
          페이지를 불러오는 중입니다...
        </p>
        <p className="mt-2 text-senior-base text-gray-500">
          잠시만 기다려주세요
        </p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

export default LazyPageWrapper;