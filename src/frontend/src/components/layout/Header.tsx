import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  BoltIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConsultationDropdownOpen, setIsConsultationDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsConsultationDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown when mobile menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsConsultationDropdownOpen(false);
    }
  }, [isMobileMenuOpen]);

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
            {/* 상담 드롭다운 (데스크톱) */}
            <div className="hidden sm:block relative" ref={dropdownRef}>
              <button 
                onClick={() => {
                  setIsConsultationDropdownOpen(!isConsultationDropdownOpen);
                  setIsMobileMenuOpen(false);
                }}
                className="inline-flex items-center btn-primary"
                aria-expanded={isConsultationDropdownOpen}
                aria-haspopup="true"
              >
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                무료 상담
                <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform duration-200 ${
                  isConsultationDropdownOpen ? 'rotate-180' : ''
                }`} />
              </button>

              {/* 드롭다운 메뉴 */}
              {isConsultationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-professional border border-neutral-200 overflow-hidden z-50">
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-neutral-700 mb-3">상담 유형을 선택해주세요</h3>
                    <div className="space-y-2">
                      <Link 
                        to="/consultation"
                        onClick={() => setIsConsultationDropdownOpen(false)}
                        className="block px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200 group"
                      >
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-primary-200 transition-colors duration-200">
                            <MagnifyingGlassIcon className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-neutral-900 group-hover:text-primary-700">전문성 심층 분석</div>
                            <div className="text-xs text-neutral-600">25개 질문으로 완전한 분석 (30분)</div>
                          </div>
                        </div>
                      </Link>
                      
                      <Link 
                        to="/quick-consultation"
                        onClick={() => setIsConsultationDropdownOpen(false)}
                        className="block px-4 py-3 rounded-lg hover:bg-accent-50 transition-colors duration-200 group"
                      >
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-accent-200 transition-colors duration-200">
                            <BoltIcon className="h-4 w-4 text-accent-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-neutral-900 group-hover:text-accent-700">아이디어 빠른 상담</div>
                            <div className="text-xs text-neutral-600">간단한 아이디어 검토 (5분)</div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsConsultationDropdownOpen(false);
              }}
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
              {/* 모바일 상담 옵션들 */}
              <div className="space-y-2">
                <Link 
                  to="/consultation" 
                  className="block px-4 py-4 bg-primary-600 text-white text-lg font-semibold text-center rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  <div className="flex items-center justify-center">
                    <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                    전문성 심층 분석
                  </div>
                  <div className="text-sm font-normal text-primary-100 mt-1">25개 질문 완전 분석 (30분)</div>
                </Link>
                
                <Link 
                  to="/quick-consultation" 
                  className="block px-4 py-4 bg-accent-600 text-white text-lg font-semibold text-center rounded-lg hover:bg-accent-700 transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                >
                  <div className="flex items-center justify-center">
                    <BoltIcon className="h-5 w-5 mr-2" />
                    아이디어 빠른 상담
                  </div>
                  <div className="text-sm font-normal text-accent-100 mt-1">간단한 아이디어 검토 (5분)</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;