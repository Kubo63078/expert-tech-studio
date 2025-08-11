import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface UsePerformanceReturn {
  metrics: PerformanceMetrics | null;
  isLoading: boolean;
  measurePageLoad: () => void;
  measureUserInteraction: (actionName: string) => () => void;
}

export const usePerformance = (): UsePerformanceReturn => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const performanceObserverRef = useRef<PerformanceObserver | null>(null);

  useEffect(() => {
    // Core Web Vitals 측정
    const measureCoreWebVitals = () => {
      setIsLoading(true);

      // Performance Observer 설정
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          
          entries.forEach((entry) => {
            switch (entry.entryType) {
              case 'navigation':
                const navEntry = entry as PerformanceNavigationTiming;
                setMetrics(prev => ({
                  ...prev!,
                  loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
                  domContentLoaded: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
                }));
                break;

              case 'paint':
                if (entry.name === 'first-contentful-paint') {
                  setMetrics(prev => ({
                    ...prev!,
                    firstContentfulPaint: entry.startTime
                  }));
                }
                break;

              case 'largest-contentful-paint':
                setMetrics(prev => ({
                  ...prev!,
                  largestContentfulPaint: entry.startTime
                }));
                break;

              case 'layout-shift':
                if (!(entry as any).hadRecentInput) {
                  setMetrics(prev => ({
                    ...prev!,
                    cumulativeLayoutShift: (prev?.cumulativeLayoutShift || 0) + (entry as any).value
                  }));
                }
                break;

              case 'first-input':
                setMetrics(prev => ({
                  ...prev!,
                  firstInputDelay: (entry as any).processingStart - entry.startTime
                }));
                break;
            }
          });
        });

        try {
          observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
          performanceObserverRef.current = observer;
        } catch (error) {
          console.warn('Performance Observer not supported:', error);
        }
      }

      // 기본 메트릭 초기화
      setMetrics({
        loadTime: 0,
        domContentLoaded: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0
      });

      setIsLoading(false);
    };

    measureCoreWebVitals();

    return () => {
      if (performanceObserverRef.current) {
        performanceObserverRef.current.disconnect();
      }
    };
  }, []);

  const measurePageLoad = () => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        setMetrics(prev => ({
          ...prev!,
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart
        }));
      }
    }
  };

  const measureUserInteraction = (actionName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 성능 로그 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${actionName}: ${duration.toFixed(2)}ms`);
        
        // 성능 임계값 체크 (200ms)
        if (duration > 200) {
          console.warn(`[Performance Warning] ${actionName} took ${duration.toFixed(2)}ms (> 200ms threshold)`);
        }
      }

      // 성능 데이터를 서버로 전송 (필요시)
      if (duration > 1000) { // 1초 이상 걸린 작업만
        reportPerformanceMetric({
          name: actionName,
          duration,
          timestamp: Date.now()
        });
      }
    };
  };

  return {
    metrics,
    isLoading,
    measurePageLoad,
    measureUserInteraction
  };
};

// 성능 메트릭 리포팅 함수
const reportPerformanceMetric = (metric: {
  name: string;
  duration: number;
  timestamp: number;
}) => {
  // 실제 환경에서는 분석 서비스로 전송
  if (process.env.NODE_ENV === 'production') {
    // 예: Google Analytics, Mixpanel 등으로 전송
    // gtag('event', 'performance_metric', metric);
    console.log('Performance metric reported:', metric);
  }
};

export default usePerformance;