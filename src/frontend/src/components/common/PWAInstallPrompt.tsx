import React, { useState } from 'react';
import { 
  XMarkIcon, 
  ArrowDownOnSquareIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { usePWA } from '../../hooks/usePWA';

const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, installApp, isStandalone } = usePWA();
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  // 이미 설치되었거나 설치 불가능하거나 사용자가 숨겼으면 표시하지 않음
  if (!isInstallable || isStandalone || !isVisible) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      await installApp();
    } catch (error) {
      console.error('설치 중 오류 발생:', error);
    } finally {
      setIsInstalling(false);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // 24시간 후 다시 표시하도록 로컬 스토리지에 저장
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // 24시간 이내에 거절했다면 표시하지 않음
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
              <ArrowDownOnSquareIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-senior-base font-semibold text-gray-900">
                앱으로 설치하기
              </h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="설치 프롬프트 닫기"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <p className="text-senior-base text-gray-600 mb-4">
          ExpertTech Studio를 홈 화면에 추가하여 더 빠르고 편리하게 이용하세요.
        </p>

        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">앱 설치 시 장점:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center">
              <DevicePhoneMobileIcon className="h-4 w-4 mr-2 text-green-500" />
              홈 화면에서 바로 접근
            </li>
            <li className="flex items-center">
              <ComputerDesktopIcon className="h-4 w-4 mr-2 text-green-500" />
              오프라인에서도 기본 기능 사용
            </li>
            <li className="flex items-center">
              <ArrowDownOnSquareIcon className="h-4 w-4 mr-2 text-green-500" />
              빠른 로딩과 부드러운 사용성
            </li>
          </ul>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 btn-primary flex items-center justify-center disabled:opacity-50"
          >
            {isInstalling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                설치 중...
              </>
            ) : (
              <>
                <ArrowDownOnSquareIcon className="h-5 w-5 mr-2" />
                설치하기
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;