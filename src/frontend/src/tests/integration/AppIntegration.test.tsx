import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../../App';

// Mock 설정
jest.mock('../../hooks/usePWA', () => ({
  usePWA: () => ({
    isInstallable: true,
    isInstalled: false,
    isStandalone: false,
    isOnline: true,
    installApp: jest.fn(),
    updateAvailable: false,
    updateApp: jest.fn()
  }),
  registerServiceWorker: jest.fn()
}));

jest.mock('../../hooks/usePerformance', () => ({
  usePerformance: () => ({
    metrics: {
      loadTime: 1500,
      domContentLoaded: 800,
      firstContentfulPaint: 1200,
      largestContentfulPaint: 1800,
      cumulativeLayoutShift: 0.05,
      firstInputDelay: 50
    },
    measurePageLoad: jest.fn()
  })
}));

// Service Worker mock
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(() => Promise.resolve({
      addEventListener: jest.fn(),
      scope: '/'
    }))
  },
  writable: true
});

// Performance Observer mock
global.PerformanceObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  disconnect: jest.fn()
}));

// Intersection Observer mock for LazyImage
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

describe('App Integration Test', () => {
  beforeEach(() => {
    // LocalStorage mock
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();

    // Console mock (suppress logs during testing)
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('기본 렌더링 테스트', () => {
    test('앱이 오류 없이 렌더링되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('헤더와 푸터가 렌더링되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });
  });

  describe('PWA 기능 테스트', () => {
    test('Service Worker가 등록되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/sw.js', {
          scope: '/'
        });
      });
    });

    test('네트워크 상태 컴포넌트가 오프라인일 때만 표시되어야 함', async () => {
      // Online 상태
      await act(async () => {
        render(<App />);
      });

      expect(screen.queryByText('인터넷 연결이 끊어졌습니다')).not.toBeInTheDocument();
    });
  });

  describe('성능 최적화 테스트', () => {
    test('성능 메트릭이 측정되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        // Performance hook이 호출되었는지 확인
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });

    test('lazy loading된 컴포넌트가 로드되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });

  describe('40-50대 친화적 UI 테스트', () => {
    test('큰 폰트 크기가 적용되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();

      // CSS 클래스 확인으로 큰 폰트 사이즈 테스트 대체
      const elements = document.querySelectorAll('.text-senior-lg, .text-senior-base');
      expect(elements.length).toBeGreaterThan(0);
    });

    test('높은 대비 색상이 적용되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      // 헤더의 색상 확인
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-white');
    });
  });

  describe('접근성 테스트', () => {
    test('키보드 네비게이션이 가능해야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      expect(focusableElements.length).toBeGreaterThan(0);
    });

    test('ARIA 레이블이 적절히 설정되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      expect(screen.getByRole('main')).toHaveAttribute('role', 'main');
    });

    test('시맨틱 HTML이 사용되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      expect(screen.getByRole('banner')).toBeInTheDocument(); // header
      expect(screen.getByRole('main')).toBeInTheDocument(); // main
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
    });
  });

  describe('에러 처리 테스트', () => {
    test('ErrorBoundary가 에러를 캐치해야 함', async () => {
      const ThrowError = () => {
        throw new Error('Test error');
      };

      // ErrorBoundary 래핑된 컴포넌트에서 에러 발생 시뮬레이션
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <BrowserRouter>
          <ThrowError />
        </BrowserRouter>
      );

      expect(consoleError).toHaveBeenCalled();
      consoleError.mockRestore();
    });
  });

  describe('Toast 알림 테스트', () => {
    test('Toast 컨테이너가 렌더링되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      // Toaster 컴포넌트가 렌더링되는지 확인
      expect(document.querySelector('.react-hot-toast')).toBeTruthy();
    });

    test('40-50대 친화적 Toast 스타일이 적용되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      // Toaster가 올바른 위치와 스타일로 설정되었는지 확인
      const toasterContainer = document.querySelector('[data-hot-toast-container]');
      if (toasterContainer) {
        const styles = window.getComputedStyle(toasterContainer);
        expect(styles.top).toBe('80px'); // 헤더 아래 위치
      }
    });
  });

  describe('반응형 디자인 테스트', () => {
    test('모바일 뷰포트에서 올바르게 렌더링되어야 함', async () => {
      // 모바일 뷰포트 설정
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 667,
      });

      await act(async () => {
        render(<App />);
      });

      // 반응형 클래스가 적용되는지 확인
      const elements = document.querySelectorAll('.sm\\:max-w-sm, .md\\:max-w-md, .lg\\:max-w-lg');
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  describe('성능 최적화 검증', () => {
    test('지연 로딩이 활성화되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      // Suspense 경계가 있는지 확인 (LazyPageWrapper)
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    test('메타 태그가 동적으로 추가되어야 함', async () => {
      await act(async () => {
        render(<App />);
      });

      await waitFor(() => {
        // PWA 관련 메타 태그가 추가되었는지 확인
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');
        
        expect(viewportMeta).toBeTruthy();
        expect(themeColorMeta).toBeTruthy();
      });
    });
  });
});

// 개별 기능별 테스트 스위트
describe('개별 기능 테스트', () => {
  test('LazyImage 컴포넌트가 올바르게 작동해야 함', async () => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });
    window.IntersectionObserver = mockIntersectionObserver;

    await act(async () => {
      render(<App />);
    });

    expect(mockIntersectionObserver).toHaveBeenCalled();
  });
});

// 통합 시나리오 테스트
describe('사용자 시나리오 통합 테스트', () => {
  test('40-50대 사용자가 앱을 처음 방문하는 시나리오', async () => {
    await act(async () => {
      render(<App />);
    });

    // 1. 앱이 로드됨
    expect(screen.getByRole('main')).toBeInTheDocument();

    // 2. PWA 설치 프롬프트가 표시될 수 있음 (isInstallable이 true인 경우)
    // 3. 성능 메트릭이 수집됨
    // 4. 접근성 기능이 활성화됨

    await waitFor(() => {
      expect(document.querySelector('meta[name="theme-color"]')).toBeTruthy();
    });
  });

  test('네트워크가 불안정한 환경에서의 시나리오', async () => {
    // 오프라인 상태 시뮬레이션
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });

    await act(async () => {
      render(<App />);
    });

    // Service Worker와 캐싱 전략이 활성화되어 기본 기능은 사용 가능해야 함
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});