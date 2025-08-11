import React from 'react';
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
import { usePWA } from '../../hooks/usePWA';

const NetworkStatus: React.FC = () => {
  const { isOnline } = usePWA();

  if (isOnline) {
    return null; // 온라인일 때는 표시하지 않음
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <p className="text-senior-base font-medium text-yellow-800">
                인터넷 연결이 끊어졌습니다
              </p>
              <p className="text-sm text-yellow-700">
                일부 기능이 제한될 수 있습니다. 네트워크 연결을 확인해주세요.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-yellow-700">
              <div className="relative">
                <WifiIcon className="h-5 w-5" />
                <div className="absolute inset-0 border border-red-500 border-opacity-60" 
                     style={{
                       background: 'linear-gradient(45deg, transparent 46%, red 49%, red 51%, transparent 54%)'
                     }} 
                />
              </div>
              <span className="ml-2 text-sm">오프라인</span>
            </div>
            
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-3 py-1.5 border border-yellow-300 text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
              aria-label="페이지 새로고침"
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" />
              새로고침
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;