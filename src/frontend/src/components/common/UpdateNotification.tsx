import React from 'react';
import { 
  ArrowUpCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';
import { usePWA } from '../../hooks/usePWA';

const UpdateNotification: React.FC = () => {
  const { updateAvailable, updateApp } = usePWA();

  if (!updateAvailable) {
    return null;
  }

  const handleUpdate = async () => {
    await updateApp();
  };

  const handleDismiss = () => {
    // 업데이트 무시 (다음 세션까지)
    localStorage.setItem('update-dismissed', Date.now().toString());
    // 컴포넌트 숨기기 위해 부모 컴포넌트에서 상태 관리 필요
  };

  return (
    <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-40">
      <div className="bg-blue-50 border border-blue-200 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <ArrowUpCircleIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-senior-base font-semibold text-blue-900">
                업데이트 사용 가능
              </h3>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-blue-400 hover:text-blue-600 p-1"
            aria-label="업데이트 알림 닫기"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>

        <p className="text-senior-base text-blue-700 mb-3">
          앱의 새 버전이 있습니다. 최신 기능과 개선사항을 경험해보세요.
        </p>

        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-senior-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            지금 업데이트
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors text-senior-base"
          >
            나중에
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;