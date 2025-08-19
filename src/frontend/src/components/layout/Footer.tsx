import { Link } from 'react-router-dom';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-100 mt-auto">
      <div className="max-w-7xl mx-auto container-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* H&R Block 스타일 회사 정보 */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-button">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-neutral-100 block">ExpertTech</span>
                <span className="text-sm font-medium text-neutral-400 block -mt-1 tracking-wider">STUDIO</span>
              </div>
            </div>
            
            <p className="text-neutral-300 text-base mb-6 max-w-md leading-relaxed">
              40-50대 중년층 전문가들이 자신만의 IT 비즈니스를 시작할 수 있도록 
              AI 기반 맞춤형 솔루션을 제공하는 전문 개발 에이전시입니다.
            </p>
            
            <div className="bg-primary-700 bg-opacity-50 rounded-lg p-4 border border-primary-600">
              <p className="text-primary-200 text-base font-medium">
                당신의 전문성을 IT 비즈니스로 확장하세요
              </p>
            </div>
          </div>

          {/* 서비스 링크 */}
          <div>
            <h3 className="text-lg font-bold text-neutral-100 mb-6 border-b border-neutral-700 pb-2">
              핵심 서비스
            </h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/services/analysis"
                  className="flex items-center text-neutral-300 hover:text-primary-300 transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 group-hover:bg-primary-500 transition-colors duration-200"></span>
                  전문성 분석 & 평가
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/recommendations"
                  className="flex items-center text-neutral-300 hover:text-primary-300 transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 group-hover:bg-primary-500 transition-colors duration-200"></span>
                  AI 기반 비즈니스 추천
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/development"
                  className="flex items-center text-neutral-300 hover:text-primary-300 transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 group-hover:bg-primary-500 transition-colors duration-200"></span>
                  맞춤형 솔루션 개발
                </Link>
              </li>
              <li>
                <Link 
                  to="/services/support"
                  className="flex items-center text-neutral-300 hover:text-primary-300 transition-colors duration-200 group"
                >
                  <span className="w-2 h-2 bg-primary-600 rounded-full mr-3 group-hover:bg-primary-500 transition-colors duration-200"></span>
                  런칭 & 운영 지원
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div>
            <h3 className="text-lg font-bold text-neutral-100 mb-6 border-b border-neutral-700 pb-2">
              고객 지원
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="tel:1588-1234"
                  className="flex items-center text-neutral-300 hover:text-primary-300 transition-colors duration-200"
                >
                  <PhoneIcon className="h-5 w-5 mr-3 text-neutral-500" />
                  전화 상담: 1588-1234
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@experttech.studio"
                  className="flex items-center text-neutral-300 hover:text-primary-300 transition-colors duration-200"
                >
                  <EnvelopeIcon className="h-5 w-5 mr-3 text-neutral-500" />
                  이메일 문의
                </a>
              </li>
              <li>
                <Link 
                  to="/faq"
                  className="flex items-center text-neutral-300 hover:text-primary-300 transition-colors duration-200"
                >
                  <ShieldCheckIcon className="h-5 w-5 mr-3 text-neutral-500" />
                  자주 묻는 질문
                </Link>
              </li>
            </ul>

            {/* 영업시간 정보 */}
            <div className="mt-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
              <h4 className="text-sm font-semibold text-neutral-200 mb-2">고객 지원 시간</h4>
              <p className="text-sm text-neutral-400">
                평일: 09:00 - 18:00<br />
                토요일: 09:00 - 13:00<br />
                일요일 및 공휴일: 휴무
              </p>
            </div>
          </div>
        </div>

        {/* 하단 구분선 및 법적 정보 */}
        <div className="border-t border-neutral-700 pt-8 mt-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            
            {/* 저작권 및 회사 정보 */}
            <div className="space-y-2">
              <p className="text-neutral-400 text-sm">
                © {currentYear} ExpertTech Studio. All rights reserved.
              </p>
              <div className="flex items-center text-neutral-500 text-sm">
                <MapPinIcon className="h-4 w-4 mr-2" />
                서울특별시 강남구 테헤란로 123, 456호
              </div>
              <p className="text-neutral-500 text-sm">
                사업자등록번호: 123-45-67890 | 대표: 홍길동 | 통신판매업신고: 2024-서울강남-1234
              </p>
            </div>
            
            {/* 법적 링크들 */}
            <div className="flex flex-wrap items-center space-x-6">
              <Link 
                to="/privacy"
                className="text-neutral-400 text-sm hover:text-primary-300 transition-colors duration-200 flex items-center"
              >
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                개인정보처리방침
              </Link>
              <Link 
                to="/terms"
                className="text-neutral-400 text-sm hover:text-primary-300 transition-colors duration-200"
              >
                이용약관
              </Link>
            </div>
          </div>

          {/* 신뢰성 배지 */}
          <div className="flex justify-center items-center mt-8 pt-6 border-t border-neutral-800">
            <div className="flex items-center space-x-8 text-neutral-500 text-xs">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-1 text-success-500" />
                SSL 보안 인증
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-1 text-success-500" />
                개인정보보호 인증
              </div>
              <div className="flex items-center">
                <ShieldCheckIcon className="h-4 w-4 mr-1 text-success-500" />
                ISO 27001 인증
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;