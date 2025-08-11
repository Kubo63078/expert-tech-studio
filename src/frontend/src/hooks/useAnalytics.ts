import { useCallback, useEffect } from 'react';
import { usePerformance } from './usePerformance';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
  customData?: Record<string, any>;
}

interface UserSegment {
  ageGroup: '40-45' | '46-50' | '51-55' | '55+';
  profession: string;
  techComfort: 'low' | 'medium' | 'high';
  deviceType: 'mobile' | 'tablet' | 'desktop';
  networkSpeed: 'slow' | 'medium' | 'fast';
}

interface PerformanceAnalytics {
  // 성능 메트릭
  trackPageLoad: (pageName: string) => void;
  trackUserInteraction: (action: string, element: string) => void;
  trackError: (error: Error, context?: string) => void;
  trackConversion: (goalName: string, value?: number) => void;
  
  // 사용자 행동 분석
  trackEngagement: (duration: number, interactions: number) => void;
  trackFeatureUsage: (feature: string, success: boolean) => void;
  trackDropOff: (step: string, reason?: string) => void;
  
  // 40-50대 특화 메트릭
  trackAccessibilityUsage: (feature: string) => void;
  trackAssistiveNavigation: (method: string) => void;
  trackContentReadability: (score: number, adjustments: string[]) => void;
}

/**
 * 40-50대 사용자 특화 성능 분석 훅
 * GDPR 준수 및 프라이버시 중심 설계
 */
export const useAnalytics = (): PerformanceAnalytics => {
  const { metrics, measurePageLoad } = usePerformance();

  // 사용자 세그먼트 감지
  const detectUserSegment = useCallback((): Partial<UserSegment> => {
    const userAgent = navigator.userAgent;
    const connection = (navigator as any).connection || (navigator as any).mozConnection;
    
    return {
      deviceType: /Mobile|Android|iPhone|iPad/.test(userAgent) 
        ? (/iPad/.test(userAgent) ? 'tablet' : 'mobile') 
        : 'desktop',
      networkSpeed: connection 
        ? (connection.effectiveType === '4g' ? 'fast' : 
           connection.effectiveType === '3g' ? 'medium' : 'slow')
        : 'medium'
    };
  }, []);

  // 이벤트 전송 함수
  const sendEvent = useCallback(async (event: AnalyticsEvent) => {
    // 개발 환경에서는 콘솔에만 로그
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', event);
      return;
    }

    // 프라이버시를 위해 로컬에서만 저장 (서버로 전송하지 않음)
    try {
      const analyticsData = localStorage.getItem('experttech_analytics') || '[]';
      const events = JSON.parse(analyticsData);
      
      events.push({
        ...event,
        timestamp: Date.now(),
        userSegment: detectUserSegment(),
        sessionId: sessionStorage.getItem('session_id') || 'anonymous'
      });

      // 최대 1000개 이벤트만 저장 (메모리 관리)
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }

      localStorage.setItem('experttech_analytics', JSON.stringify(events));
    } catch (error) {
      console.warn('Analytics storage error:', error);
    }
  }, [detectUserSegment]);

  // 페이지 로드 성능 추적
  const trackPageLoad = useCallback((pageName: string) => {
    measurePageLoad();
    
    // 성능 메트릭이 수집되면 분석 이벤트 전송
    setTimeout(() => {
      sendEvent({
        category: 'Performance',
        action: 'Page Load',
        label: pageName,
        customData: {
          ...metrics,
          isSlowConnection: (navigator as any).connection?.effectiveType === '2g',
          isLowEndDevice: navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2
        }
      });
    }, 1000);
  }, [measurePageLoad, metrics, sendEvent]);

  // 사용자 상호작용 추적
  const trackUserInteraction = useCallback((action: string, element: string) => {
    sendEvent({
      category: 'User Interaction',
      action,
      label: element,
      customData: {
        timestamp: Date.now(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    });
  }, [sendEvent]);

  // 오류 추적
  const trackError = useCallback((error: Error, context?: string) => {
    sendEvent({
      category: 'Error',
      action: 'JavaScript Error',
      label: context || 'Unknown',
      customData: {
        message: error.message,
        stack: error.stack,
        userAgent: navigator.userAgent,
        url: window.location.href
      }
    });
  }, [sendEvent]);

  // 목표 달성 추적
  const trackConversion = useCallback((goalName: string, value?: number) => {
    sendEvent({
      category: 'Conversion',
      action: 'Goal Completed',
      label: goalName,
      value,
      customData: {
        sessionDuration: Date.now() - (performance.timeOrigin || 0)
      }
    });
  }, [sendEvent]);

  // 참여도 추적
  const trackEngagement = useCallback((duration: number, interactions: number) => {
    sendEvent({
      category: 'Engagement',
      action: 'Session Analysis',
      value: duration,
      customData: {
        interactions,
        engagementRate: interactions / (duration / 1000 / 60), // 분당 상호작용 수
        bounceRate: interactions === 0 ? 1 : 0
      }
    });
  }, [sendEvent]);

  // 기능 사용 추적
  const trackFeatureUsage = useCallback((feature: string, success: boolean) => {
    sendEvent({
      category: 'Feature Usage',
      action: success ? 'Success' : 'Failed',
      label: feature,
      customData: {
        attemptTime: Date.now()
      }
    });
  }, [sendEvent]);

  // 이탈 지점 추적
  const trackDropOff = useCallback((step: string, reason?: string) => {
    sendEvent({
      category: 'User Flow',
      action: 'Drop Off',
      label: step,
      customData: {
        reason,
        timeOnStep: Date.now()
      }
    });
  }, [sendEvent]);

  // 접근성 기능 사용 추적
  const trackAccessibilityUsage = useCallback((feature: string) => {
    sendEvent({
      category: 'Accessibility',
      action: 'Feature Used',
      label: feature,
      customData: {
        hasReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        hasHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        fontSize: parseFloat(getComputedStyle(document.documentElement).fontSize)
      }
    });
  }, [sendEvent]);

  // 보조 네비게이션 추적
  const trackAssistiveNavigation = useCallback((method: string) => {
    sendEvent({
      category: 'Navigation',
      action: 'Assistive Method',
      label: method,
      customData: {
        isKeyboardUser: method.includes('keyboard'),
        isScreenReader: method.includes('screen-reader'),
        isVoiceControl: method.includes('voice')
      }
    });
  }, [sendEvent]);

  // 콘텐츠 가독성 추적
  const trackContentReadability = useCallback((score: number, adjustments: string[]) => {
    sendEvent({
      category: 'Content',
      action: 'Readability Analysis',
      value: score,
      customData: {
        adjustments,
        fontSizeAdjusted: adjustments.includes('font-size'),
        contrastAdjusted: adjustments.includes('contrast'),
        spacingAdjusted: adjustments.includes('spacing')
      }
    });
  }, [sendEvent]);

  // 전역 오류 처리기 등록
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), event.filename);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(event.reason), 'Promise Rejection');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackError]);

  // 페이지 가시성 추적
  useEffect(() => {
    let startTime = Date.now();
    let interactionCount = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const duration = Date.now() - startTime;
        trackEngagement(duration, interactionCount);
      } else {
        startTime = Date.now();
        interactionCount = 0;
      }
    };

    const handleUserInteraction = () => {
      interactionCount++;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [trackEngagement]);

  return {
    trackPageLoad,
    trackUserInteraction,
    trackError,
    trackConversion,
    trackEngagement,
    trackFeatureUsage,
    trackDropOff,
    trackAccessibilityUsage,
    trackAssistiveNavigation,
    trackContentReadability
  };
};

// 분석 데이터 내보내기 (관리자용)
export const exportAnalyticsData = () => {
  try {
    const data = localStorage.getItem('experttech_analytics');
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `experttech-analytics-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Export failed:', error);
  }
};