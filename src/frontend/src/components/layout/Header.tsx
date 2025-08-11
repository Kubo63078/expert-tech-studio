import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-card border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-20">
          
          {/* H&R Block 스타일 로고 */}
          <Link 
            to="/" 
            className="flex items-center space-x-4 group focus-visible-ring rounded-xl p-2 transition-all duration-200"
            aria-label="ExpertTech Studio 홈페이지로 이동"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-button transition-all duration-200 group-hover:shadow-button-hover">
              <span className="text-white font-bold text-xl" aria-hidden="true">E</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold text-neutral-900 block leading-tight">ExpertTech</span>
              <span className="text-sm font-medium text-neutral-600 block -mt-1 tracking-wider">STUDIO</span>
            </div>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="주 메뉴">
            <Link to="/" className="nav-link">
              홈
            </Link>
            <Link to="/services" className="nav-link">
              서비스
            </Link>
            <Link to="/about" className="nav-link">
              회사소개
            </Link>
            <Link to="/contact" className="nav-link">
              문의하기
            </Link>
          </nav>

          {/* CTA 버튼 및 모바일 메뉴 */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/consultation" 
              className="hidden sm:inline-flex btn-primary"
            >
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              무료 상담
            </Link>
            
            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-lg text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
          id="mobile-menu"
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="bg-white border-t border-neutral-200 shadow-card">
            <div className="container-padding py-6 space-y-3">
              <Link 
                to="/" 
                className="block px-4 py-4 text-lg font-medium rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                홈
              </Link>
              <Link 
                to="/services" 
                className="block px-4 py-4 text-lg font-medium rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                서비스
              </Link>
              <Link 
                to="/about" 
                className="block px-4 py-4 text-lg font-medium rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                회사소개
              </Link>
              <Link 
                to="/contact" 
                className="block px-4 py-4 text-lg font-medium rounded-lg text-neutral-700 hover:bg-neutral-50 hover:text-primary-600 transition-all duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                문의하기
              </Link>
              <Link 
                to="/consultation" 
                className="block px-4 py-4 bg-primary-600 text-white text-lg font-semibold text-center rounded-lg hover:bg-primary-700 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
                tabIndex={isMobileMenuOpen ? 0 : -1}
              >
                무료 상담 신청
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;