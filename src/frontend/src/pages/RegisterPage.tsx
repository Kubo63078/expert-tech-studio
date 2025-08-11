import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // 에러가 있으면 입력 시 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = (password: string) => {
    const issues = [];
    if (password.length < 8) issues.push('8자 이상');
    if (!/[A-Z]/.test(password)) issues.push('대문자 포함');
    if (!/[a-z]/.test(password)) issues.push('소문자 포함');
    if (!/[0-9]/.test(password)) issues.push('숫자 포함');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) issues.push('특수문자 포함');
    return issues;
  };

  const getPasswordStrength = (password: string) => {
    const issues = validatePassword(password);
    if (issues.length === 0) return { strength: 'strong', label: '강함', color: 'green' };
    if (issues.length <= 2) return { strength: 'medium', label: '보통', color: 'yellow' };
    return { strength: 'weak', label: '약함', color: 'red' };
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
    } else {
      const passwordIssues = validatePassword(formData.password);
      if (passwordIssues.length > 0) {
        newErrors.password = `비밀번호는 ${passwordIssues.join(', ')}이 필요합니다.`;
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = '서비스 이용약관에 동의해주세요.';
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
      await register(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error: any) {
      setErrors({ 
        general: error.message || '회원가입 중 오류가 발생했습니다.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = formData.password ? getPasswordStrength(formData.password) : null;

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
          회원가입
        </h2>
        <p className="mt-2 text-center text-senior-lg text-gray-600">
          전문가를 위한 AI 기반 비즈니스 플랫폼에 가입하세요
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input-field pr-12 ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="8자 이상, 영문+숫자+특수문자"
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
              
              {/* 비밀번호 강도 표시 */}
              {formData.password && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className={`flex-1 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                      <div 
                        className={`h-full transition-all duration-300 ${
                          passwordStrength.color === 'green' ? 'bg-green-500' :
                          passwordStrength.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ 
                          width: passwordStrength.strength === 'strong' ? '100%' : 
                                passwordStrength.strength === 'medium' ? '66%' : '33%' 
                        }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${
                      passwordStrength.color === 'green' ? 'text-green-600' :
                      passwordStrength.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-2 text-senior-base text-red-600">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-senior-lg font-medium text-gray-700">
                비밀번호 확인
              </label>
              <div className="mt-2 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`input-field pr-12 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
                
                {/* 비밀번호 일치 여부 표시 */}
                {formData.confirmPassword && (
                  <div className="absolute inset-y-0 right-10 flex items-center">
                    {formData.password === formData.confirmPassword ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-senior-base text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 이용약관 동의 */}
            <div>
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className={`h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${errors.agreeToTerms ? 'border-red-300' : ''}`}
                />
                <div className="ml-3">
                  <label htmlFor="agreeToTerms" className="text-senior-base text-gray-700">
                    <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                      서비스 이용약관
                    </Link>과{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                      개인정보 처리방침
                    </Link>에 동의합니다.
                  </label>
                </div>
              </div>
              {errors.agreeToTerms && (
                <p className="mt-2 text-senior-base text-red-600">{errors.agreeToTerms}</p>
              )}
            </div>

            {/* 회원가입 버튼 */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-senior-lg font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                } min-h-[48px]`}
              >
                {isLoading ? '가입 중...' : '회원가입'}
              </button>
            </div>

            {/* 로그인 링크 */}
            <div className="text-center">
              <p className="text-senior-base text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-500 font-medium">
                  로그인하기
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;