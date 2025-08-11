import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAInstallPrompt {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  installApp: () => Promise<void>;
  updateAvailable: boolean;
  updateApp: () => Promise<void>;
}

export const usePWA = (): PWAInstallPrompt => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    // PWA 설치 가능 상태 감지
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setInstallPromptEvent(installEvent);
      setIsInstallable(true);
      
      console.log('PWA 설치 프롬프트 준비됨');
    };

    // PWA 설치 완료 감지
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPromptEvent(null);
      console.log('PWA 설치 완료');
    };

    // 온라인/오프라인 상태 감지
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Service Worker 업데이트 감지
    const handleServiceWorkerUpdate = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload();
        });

        navigator.serviceWorker.ready.then((registration) => {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  setWaitingWorker(newWorker);
                }
              });
            }
          });
        });
      }
    };

    // 스탠드얼론 모드 감지
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
    };

    // 이벤트 리스너 등록
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 초기화
    checkStandalone();
    handleServiceWorkerUpdate();

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = useCallback(async () => {
    if (!installPromptEvent) {
      console.warn('설치 프롬프트를 사용할 수 없습니다.');
      return;
    }

    try {
      await installPromptEvent.prompt();
      const choiceResult = await installPromptEvent.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('사용자가 PWA 설치를 수락했습니다.');
        setIsInstalled(true);
      } else {
        console.log('사용자가 PWA 설치를 거절했습니다.');
      }
      
      setIsInstallable(false);
      setInstallPromptEvent(null);
    } catch (error) {
      console.error('PWA 설치 중 오류 발생:', error);
    }
  }, [installPromptEvent]);

  const updateApp = useCallback(async () => {
    if (!waitingWorker) {
      return;
    }

    try {
      // 새로운 Service Worker 활성화
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
      setWaitingWorker(null);
      
      // 페이지 새로고침하여 업데이트 적용
      window.location.reload();
    } catch (error) {
      console.error('앱 업데이트 중 오류 발생:', error);
    }
  }, [waitingWorker]);

  return {
    isInstallable,
    isInstalled,
    isStandalone,
    isOnline,
    installApp,
    updateAvailable,
    updateApp
  };
};

// Service Worker 등록 함수
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker 등록 성공:', registration.scope);
      
      // 업데이트 체크
      registration.addEventListener('updatefound', () => {
        console.log('새로운 Service Worker 버전 발견');
      });

      return registration;
    } catch (error) {
      console.error('Service Worker 등록 실패:', error);
      return null;
    }
  } else {
    console.warn('Service Worker를 지원하지 않는 브라우저입니다.');
    return null;
  }
};