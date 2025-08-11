import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 후 리다이렉트할 경로 (기본은 대시보드)
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 에러가 있으면 입력 시 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error: any) {
      setErrors({ 
        general: error.message || '로그인 중 오류가 발생했습니다.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* 로고 */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ET</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">ExpertTech Studio</span>
          </div>
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          로그인
        </h2>
        <p className="mt-2 text-center text-senior-lg text-gray-600">
          계정에 로그인하여 서비스를 이용하세요
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* 일반 에러 메시지 */}
            {errors.general && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-senior-base text-red-800">{errors.general}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 이메일 입력 */}
            <div>
              <label htmlFor="email" className="block text-senior-lg font-medium text-gray-700">
                이메일 주소
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="예: hong@example.com"
                />
                {errors.email && (
                  <p className="mt-2 text-senior-base text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="password" className="block text-senior-lg font-medium text-gray-700">
                비밀번호
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input-field pr-12 ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="비밀번호를 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-senior-base text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 찾기 링크 */}
            <div className="flex items-center justify-between">
              <div className="text-senior-base">
                <Link to="/forgot-password" className="text-primary-600 hover:text-primary-500">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-senior-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } min-h-[48px]`}
              >
                {isLoading ? '로그인 중...' : '로그인'}
              </button>
            </div>

            {/* 회원가입 링크 */}
            <div className="text-center">
              <p className="text-senior-base text-gray-600">
                아직 계정이 없으신가요?{' '}
                <Link to="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                  회원가입하기
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;