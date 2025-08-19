import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BoltIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  ClockIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';

interface QuickConsultationData {
  name: string;
  email: string;
  phone: string;
  expertise_field: string;
  idea_description: string;
  target_customers: string;
  budget_range: string;
  consultation_timing: string;
  main_concerns: string[];
  contact_preference: string;
}

const QuickConsultationPage = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'success' | 'error'>('form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState<QuickConsultationData>({
    name: '',
    email: '',
    phone: '',
    expertise_field: '',
    idea_description: '',
    target_customers: '',
    budget_range: '',
    consultation_timing: '',
    main_concerns: [],
    contact_preference: ''
  });

  const expertiseFields = [
    '부동산 (중개, 투자, 개발)',
    '금융/보험 (은행, 증권, 보험)',
    '법무/세무 (변호사, 세무사, 회계사)',
    '의료/헬스케어 (의사, 간호사, 의료진)',
    '교육 (교사, 교수, 강사)',
    '컨설팅 (경영, 전략, 전문 컨설턴트)',
    '제조업 (생산, 품질, 기술)',
    '서비스업 (요식업, 미용, 서비스)',
    '공공기관 (공무원, 공기업)',
    '기타'
  ];

  const targetCustomersOptions = [
    '개인 고객 (B2C)',
    '소상공인/자영업자',
    '중소기업',
    '대기업',
    '정부기관/공공기관',
    '동종업계 전문가들',
    '일반 소비자',
    '특정 연령대 (시니어, 청년 등)'
  ];

  const budgetRanges = [
    '500만원 이하',
    '500만원 - 1,500만원',
    '1,500만원 - 3,000만원',
    '3,000만원 - 5,000만원',
    '5,000만원 이상'
  ];

  const consultationTimings = [
    '1주일 이내',
    '2주일 이내',
    '1개월 이내',
    '2-3개월 이내',
    '시기는 유연함'
  ];

  const concernsOptions = [
    '기술적 구현 방법',
    '시장 경쟁력 분석',
    '초기 고객 확보',
    '수익 모델 설계',
    '필요한 투자 규모',
    '개발 기간 및 일정',
    '법적/규제 문제',
    '마케팅 전략'
  ];

  const contactPreferences = [
    '전화 상담',
    '화상 회의 (Zoom/Teams)',
    '이메일 상담',
    '대면 미팅'
  ];

  const handleInputChange = (field: keyof QuickConsultationData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConcernToggle = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      main_concerns: prev.main_concerns.includes(concern)
        ? prev.main_concerns.filter(c => c !== concern)
        : [...prev.main_concerns, concern]
    }));
  };

  const validateForm = (): boolean => {
    const required = ['name', 'email', 'expertise_field', 'idea_description', 'target_customers', 'budget_range', 'consultation_timing', 'contact_preference'];
    
    for (const field of required) {
      if (!formData[field as keyof QuickConsultationData] || 
          (typeof formData[field as keyof QuickConsultationData] === 'string' && 
           (formData[field as keyof QuickConsultationData] as string).trim() === '')) {
        return false;
      }
    }

    // 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    // 아이디어 설명 최소 길이 체크
    if (formData.idea_description.trim().length < 20) {
      setErrorMessage('아이디어 설명을 20자 이상 작성해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      if (!errorMessage) {
        setErrorMessage('모든 필수 항목을 입력해주세요.');
      }
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('quick_consultations')
        .insert([formData]);

      if (error) {
        console.error('Supabase error:', error);
        setErrorMessage('상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        setCurrentStep('error');
      } else {
        setCurrentStep('success');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrorMessage('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setCurrentStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto container-padding text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-success-600 to-success-700 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <CheckCircleIcon className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            상담 신청이 완료되었습니다!
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8">
            <strong className="text-neutral-800">24시간 이내</strong>에 전문 컨설턴트가 직접 연락드리겠습니다.
          </p>

          <div className="bg-success-50 rounded-2xl p-8 mb-8 text-left">
            <h3 className="text-lg font-bold text-success-900 mb-4">다음 단계</h3>
            <div className="space-y-3 text-success-800">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">1</div>
                <span>전문가가 아이디어를 사전 검토</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">2</div>
                <span>맞춤형 상담 일정 조율</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center mr-3 text-white text-sm font-bold">3</div>
                <span>구체적인 실행 방안 논의</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="text-center p-4 bg-white rounded-lg border border-neutral-200">
              <ClockIcon className="h-8 w-8 text-accent-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-neutral-900">24시간</div>
              <div className="text-sm text-neutral-600">최대 응답 시간</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-neutral-200">
              <ShieldCheckIcon className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-neutral-900">100% 무료</div>
              <div className="text-sm text-neutral-600">상담 비용</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="btn-secondary">
              홈으로 돌아가기
            </Link>
            <Link to="/consultation" className="btn-primary">
              심층 분석도 받아보기
            </Link>
          </div>

          <p className="text-sm text-neutral-500 mt-6">
            궁금한 점이 있으시면 언제든 <a href="tel:1588-1234" className="text-primary-600 hover:underline">1588-1234</a>로 연락주세요
          </p>
        </div>
      </div>
    );
  }

  if (currentStep === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto container-padding text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <ExclamationTriangleIcon className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">
            오류가 발생했습니다
          </h1>
          
          <p className="text-xl text-neutral-600 mb-8">
            {errorMessage}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentStep('form')}
              className="btn-primary"
            >
              다시 시도하기
            </button>
            <Link to="/" className="btn-secondary">
              홈으로 돌아가기
            </Link>
          </div>

          <p className="text-sm text-neutral-500 mt-6">
            문제가 지속되면 <a href="tel:1588-1234" className="text-primary-600 hover:underline">1588-1234</a>로 연락주세요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto container-padding">
        
        {/* 헤더 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-6 py-3 bg-accent-100 text-accent-700 font-semibold rounded-full mb-6">
            <BoltIcon className="h-5 w-5 mr-2" />
            아이디어 빠른 상담
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6">
            이미 구상하신 아이디어를<br />
            <span className="text-accent-600">전문가와 빠르게</span> 검토해보세요
          </h1>
          
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-8">
            간단한 정보만 입력하면 <strong className="text-neutral-800 font-semibold">24시간 내</strong>에
            전문 컨설턴트가 아이디어를 검토하고 구체적인 상담을 제공해드립니다.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">5분</div>
              <div className="text-sm text-neutral-600">소요 시간</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">24시간</div>
              <div className="text-sm text-neutral-600">내 연락</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">무료</div>
              <div className="text-sm text-neutral-600">상담 비용</div>
            </div>
          </div>
        </div>

        {/* 뒤로가기 버튼 */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-neutral-600 hover:text-neutral-800 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            홈으로 돌아가기
          </Link>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. 기본 정보 */}
          <div className="card touch-spacing">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">기본 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  성함 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="예: 김전문"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  이메일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="expert@example.com"
                  className="input-field"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  연락처
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="010-1234-5678"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  전문 분야 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.expertise_field}
                  onChange={(e) => handleInputChange('expertise_field', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">전문 분야를 선택해주세요</option>
                  {expertiseFields.map((field) => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 2. 아이디어 설명 */}
          <div className="card touch-spacing">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">아이디어 설명</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                구상하고 계신 아이디어를 자세히 설명해주세요 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.idea_description}
                onChange={(e) => handleInputChange('idea_description', e.target.value)}
                placeholder="예: 강남지역 투자용 부동산 정보를 제공하는 AI 플랫폼을 만들고 싶습니다. 실시간 시세 분석과 투자 수익률 계산 기능을 포함하려고 합니다..."
                className="input-field min-h-[120px] resize-y"
                rows={4}
                required
              />
              <p className="text-sm text-neutral-500 mt-2">
                최소 20자 이상 작성해주세요. 구체적일수록 더 정확한 상담이 가능합니다.
              </p>
            </div>
          </div>

          {/* 3. 타겟 고객 */}
          <div className="card touch-spacing">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">사업 계획</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  주요 타겟 고객 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.target_customers}
                  onChange={(e) => handleInputChange('target_customers', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">타겟 고객을 선택해주세요</option>
                  {targetCustomersOptions.map((target) => (
                    <option key={target} value={target}>{target}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  초기 투자 예산 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.budget_range}
                  onChange={(e) => handleInputChange('budget_range', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">예산 범위를 선택해주세요</option>
                  {budgetRanges.map((budget) => (
                    <option key={budget} value={budget}>{budget}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 4. 상담 선호도 */}
          <div className="card touch-spacing">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">상담 선호도</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  상담 희망 시기 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.consultation_timing}
                  onChange={(e) => handleInputChange('consultation_timing', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">상담 시기를 선택해주세요</option>
                  {consultationTimings.map((timing) => (
                    <option key={timing} value={timing}>{timing}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  선호하는 상담 방식 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.contact_preference}
                  onChange={(e) => handleInputChange('contact_preference', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">상담 방식을 선택해주세요</option>
                  {contactPreferences.map((pref) => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 5. 주요 고민사항 */}
          <div className="card touch-spacing">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6">주요 고민사항</h3>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-4">
                가장 궁금하거나 걱정되는 부분을 선택해주세요 (복수 선택 가능)
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {concernsOptions.map((concern) => (
                  <button
                    key={concern}
                    type="button"
                    onClick={() => handleConcernToggle(concern)}
                    className={`text-left px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
                      formData.main_concerns.includes(concern)
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        formData.main_concerns.includes(concern) 
                          ? 'border-primary-500 bg-primary-500' 
                          : 'border-neutral-300'
                      }`}>
                        {formData.main_concerns.includes(concern) && (
                          <CheckCircleIcon className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{concern}</span>
                    </div>
                  </button>
                ))}
              </div>
              
              {formData.main_concerns.length > 0 && (
                <p className="text-sm text-primary-600 mt-3">
                  {formData.main_concerns.length}개 항목 선택됨
                </p>
              )}
            </div>
          </div>

          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-red-700 font-medium">{errorMessage}</span>
              </div>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-10 py-5 bg-accent-600 hover:bg-accent-700 disabled:bg-neutral-400 disabled:cursor-not-allowed text-white text-2xl font-bold rounded-button shadow-professional hover:shadow-button-hover transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-400/50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  제출 중...
                </>
              ) : (
                <>
                  <BoltIcon className="h-6 w-6 mr-3" />
                  빠른 상담 신청하기
                </>
              )}
            </button>
            
            <p className="text-sm text-neutral-500 mt-4">
              * 24시간 이내에 전문 컨설턴트가 직접 연락드립니다
            </p>
          </div>

        </form>

        {/* 추가 안내 */}
        <div className="mt-12 bg-neutral-50 rounded-2xl p-8">
          <h3 className="text-lg font-bold text-neutral-900 mb-4 text-center">왜 빠른 상담인가요?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <ClockIcon className="h-8 w-8 text-accent-600 mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 mb-2">시간 절약</h4>
              <p className="text-sm text-neutral-600">25개 질문 대신 핵심만 간단하게</p>
            </div>
            <div>
              <PhoneIcon className="h-8 w-8 text-primary-600 mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 mb-2">즉시 응답</h4>
              <p className="text-sm text-neutral-600">24시간 내 전문가 직접 연락</p>
            </div>
            <div>
              <BoltIcon className="h-8 w-8 text-success-600 mx-auto mb-3" />
              <h4 className="font-semibold text-neutral-900 mb-2">맞춤 상담</h4>
              <p className="text-sm text-neutral-600">아이디어에 특화된 구체적 조언</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default QuickConsultationPage;