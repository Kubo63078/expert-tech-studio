import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import SkipLink from '../common/SkipLink';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  // 키보드 접근성: Escape 키로 모바일 메뉴 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  // 모바일 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !mobileMenuButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
      <SkipLink href="#main-content">본문으로 바로가기</SkipLink>
      <header className="bg-white shadow-sm border-b border-gray-200" role="banner">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="flex justify-between items-center h-18 sm:h-20">
            {/* 로고 */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center space-x-3 text-xl sm:text-2xl font-bold text-primary-600 hover:text-primary-700 focus-visible-ring rounded-lg p-2 transition-colors"
                aria-label="ExpertTech Studio 홈페이지로 이동"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-base sm:text-lg" aria-hidden="true">ET</span>
                </div>
                <span className="hidden sm:block">ExpertTech Studio</span>
              </Link>
            </div>

            {/* 데스크톱 네비게이션 */}
            <nav className="hidden md:flex items-center space-x-2" role="navigation" aria-label="주 메뉴">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
                    aria-current={isActive('/dashboard') ? 'page' : undefined}
                  >
                    대시보드
                  </Link>
                  <Link 
                    to="/recommendations" 
                    className={`nav-link ${isActive('/recommendations') ? 'active' : ''}`}
                    aria-current={isActive('/recommendations') ? 'page' : undefined}
                  >
                    추천 결과
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                    aria-current={isActive('/profile') ? 'page' : undefined}
                  >
                    프로필
                  </Link>
                  
                  {/* 사용자 메뉴 */}
                  <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
                    <div className="flex items-center space-x-2" role="status" aria-label="현재 사용자">
                      <UserIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                      <span className="text-senior-base text-gray-700 font-medium">
                        {user?.email}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus-visible-ring min-h-[48px] min-w-[48px]"
                      title="로그아웃"
                      aria-label="로그아웃"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-outline">
                    로그인
                  </Link>
                  <Link to="/register" className="btn-primary">
                    회원가입
                  </Link>
                </>
              )}
            </nav>

            {/* 모바일 메뉴 버튼 */}
            <div className="md:hidden">
              <button
                ref={mobileMenuButtonRef}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-3 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[48px] min-w-[48px]"
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
            ref={mobileMenuRef}
            className={`md:hidden transition-all duration-200 ease-in-out ${
              isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
            id="mobile-menu"
            aria-hidden={!isMobileMenuOpen}
          >
            <div className="container-padding py-4 border-t border-gray-200 spacing-comfortable">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`nav-link block w-full rounded-md ${isActive('/dashboard') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                    aria-current={isActive('/dashboard') ? 'page' : undefined}
                  >
                    대시보드
                  </Link>
                  <Link 
                    to="/recommendations" 
                    className={`nav-link block w-full rounded-md ${isActive('/recommendations') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                    aria-current={isActive('/recommendations') ? 'page' : undefined}
                  >
                    추천 결과
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`nav-link block w-full rounded-md ${isActive('/profile') ? 'active' : ''}`}
                    onClick={closeMobileMenu}
                    aria-current={isActive('/profile') ? 'page' : undefined}
                  >
                    프로필
                  </Link>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200 spacing-comfortable">
                    <div className="flex items-center touch-spacing rounded-md bg-gray-50" role="status" aria-label="현재 사용자">
                      <UserIcon className="h-5 w-5 text-gray-500 mr-3" aria-hidden="true" />
                      <span className="text-senior-base text-gray-700">
                        {user?.email}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left touch-spacing text-red-600 hover:bg-red-50 rounded-md transition-colors flex items-center focus-visible-ring"
                      aria-label="로그아웃"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" aria-hidden="true" />
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="btn-outline block w-full text-center mb-4"
                    onClick={closeMobileMenu}
                  >
                    로그인
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary block w-full text-center"
                    onClick={closeMobileMenu}
                  >
                    회원가입
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;