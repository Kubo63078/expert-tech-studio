import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 정보 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ET</span>
              </div>
              <span className="text-xl font-bold text-gray-800">ExpertTech Studio</span>
            </div>
            <p className="text-gray-600 text-senior-base mb-4 max-w-md">
              40-50대 중년층 전문가들이 자신만의 IT 비즈니스를 시작할 수 있도록 
              AI 기반 맞춤형 솔루션을 제공하는 개발 에이전시입니다.
            </p>
            <p className="text-gray-500 text-base">
              당신의 전문성을 IT 비즈니스로 확장하세요.
            </p>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="text-senior-lg font-semibold text-gray-800 mb-4">서비스</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-600 text-senior-base hover:text-primary-600 cursor-pointer transition-colors">
                  비즈니스 분석
                </span>
              </li>
              <li>
                <span className="text-gray-600 text-senior-base hover:text-primary-600 cursor-pointer transition-colors">
                  AI 추천 시스템
                </span>
              </li>
              <li>
                <span className="text-gray-600 text-senior-base hover:text-primary-600 cursor-pointer transition-colors">
                  맞춤형 개발
                </span>
              </li>
              <li>
                <span className="text-gray-600 text-senior-base hover:text-primary-600 cursor-pointer transition-colors">
                  운영 지원
                </span>
              </li>
            </ul>
          </div>

          {/* 지원 */}
          <div>
            <h3 className="text-senior-lg font-semibold text-gray-800 mb-4">지원</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-600 text-senior-base hover:text-primary-600 cursor-pointer transition-colors">
                  자주 묻는 질문
                </span>
              </li>
              <li>
                <span className="text-gray-600 text-senior-base hover:text-primary-600 cursor-pointer transition-colors">
                  사용 가이드
                </span>
              </li>
              <li>
                <span className="text-gray-600 text-senior-base hover:text-primary-600 cursor-pointer transition-colors">
                  고객 지원
                </span>
              </li>
              <li>
                <span className="text-gray-600 text-senior-base hover:text-primary-600 cursor-pointer transition-colors">
                  문의하기
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 및 저작권 */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-senior-base">
              © {currentYear} ExpertTech Studio. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6">
              <span className="text-gray-500 text-base hover:text-primary-600 cursor-pointer transition-colors">
                개인정보처리방침
              </span>
              <span className="text-gray-500 text-base hover:text-primary-600 cursor-pointer transition-colors">
                이용약관
              </span>
              <span className="text-gray-500 text-base hover:text-primary-600 cursor-pointer transition-colors">
                쿠키 정책
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;