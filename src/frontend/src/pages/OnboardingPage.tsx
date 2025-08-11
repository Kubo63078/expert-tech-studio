import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowRightIcon, 
  ArrowLeftIcon,
  UserIcon,
  BriefcaseIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface OnboardingData {
  basicInfo: {
    name: string;
    age: number;
    occupation: string;
    experience: number;
    location: string;
  };
  expertise: {
    industry: string;
    skills: string[];
    achievements: string[];
    network: string[];
  };
  businessIntent: {
    goals: string[];
    budget: number;
    timeline: string;
    targetMarket: string;
  };
}

const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingData>({
    basicInfo: {
      name: '',
      age: 45,
      occupation: '',
      experience: 5,
      location: '',
    },
    expertise: {
      industry: '',
      skills: [],
      achievements: [],
      network: [],
    },
    businessIntent: {
      goals: [],
      budget: 50000000,
      timeline: '6개월',
      targetMarket: '',
    },
  });

  const steps = [
    {
      id: 1,
      title: '기본 정보',
      description: '당신의 기본적인 정보를 알려주세요',
      icon: UserIcon,
    },
    {
      id: 2,
      title: '전문성 분석',
      description: '보유하신 전문 지식과 경험을 입력해주세요',
      icon: BriefcaseIcon,
    },
    {
      id: 3,
      title: '사업 의도',
      description: '원하시는 사업 방향과 목표를 설정해주세요',
      icon: LightBulbIcon,
    },
  ];

  const industries = [
    '부동산', '금융/투자', '의료/건강', '교육/컨설팅', 
    'IT/기술', '제조업', '서비스업', '유통/판매', '기타'
  ];

  const skillSuggestions = {
    '부동산': ['부동산 중개', '투자 분석', '시장 조사', '고객 관리', '계약 관리'],
    '금융/투자': ['자산 관리', '투자 상담', '위험 관리', '세무 기획', '보험 설계'],
    '의료/건강': ['진료', '상담', '건강 관리', '의료 기기', '환자 관리'],
    '교육/컨설팅': ['강의', '컨설팅', '코칭', '교육과정 개발', '평가'],
    'IT/기술': ['소프트웨어 개발', '시스템 관리', '데이터 분석', '네트워크', '보안'],
  };

  const handleInputChange = (section: keyof OnboardingData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // 에러 제거
    const errorKey = `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handleSkillToggle = (skill: string) => {
    const currentSkills = formData.expertise.skills;
    if (currentSkills.includes(skill)) {
      handleInputChange('expertise', 'skills', currentSkills.filter(s => s !== skill));
    } else {
      handleInputChange('expertise', 'skills', [...currentSkills, skill]);
    }
  };

  const handleGoalToggle = (goal: string) => {
    const currentGoals = formData.businessIntent.goals;
    if (currentGoals.includes(goal)) {
      handleInputChange('businessIntent', 'goals', currentGoals.filter(g => g !== goal));
    } else {
      handleInputChange('businessIntent', 'goals', [...currentGoals, goal]);
    }
  };

  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 1:
        if (!formData.basicInfo.name.trim()) {
          newErrors['basicInfo.name'] = '이름을 입력해주세요.';
        }
        if (!formData.basicInfo.occupation.trim()) {
          newErrors['basicInfo.occupation'] = '직업을 입력해주세요.';
        }
        if (!formData.basicInfo.location.trim()) {
          newErrors['basicInfo.location'] = '지역을 입력해주세요.';
        }
        if (formData.basicInfo.age < 30 || formData.basicInfo.age > 70) {
          newErrors['basicInfo.age'] = '30세에서 70세 사이의 나이를 입력해주세요.';
        }
        break;

      case 2:
        if (!formData.expertise.industry) {
          newErrors['expertise.industry'] = '주요 산업 분야를 선택해주세요.';
        }
        if (formData.expertise.skills.length === 0) {
          newErrors['expertise.skills'] = '최소 1개의 전문 기술을 선택해주세요.';
        }
        break;

      case 3:
        if (formData.businessIntent.goals.length === 0) {
          newErrors['businessIntent.goals'] = '사업 목표를 최소 1개 선택해주세요.';
        }
        if (!formData.businessIntent.targetMarket.trim()) {
          newErrors['businessIntent.targetMarket'] = '목표 시장을 입력해주세요.';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // clientProfileService 사용
      const { clientProfileService } = await import('../services/clientProfileService');
      
      await clientProfileService.createProfile({
        basicInfo: formData.basicInfo,
        expertise: formData.expertise,
        businessIntent: formData.businessIntent,
      });

      navigate('/dashboard');
    } catch (error: any) {
      setErrors({ general: error.message || '오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          성함 *
        </label>
        <input
          type="text"
          value={formData.basicInfo.name}
          onChange={(e) => handleInputChange('basicInfo', 'name', e.target.value)}
          className={`input-field ${errors['basicInfo.name'] ? 'border-red-300' : ''}`}
          placeholder="홍길동"
        />
        {errors['basicInfo.name'] && (
          <p className="mt-2 text-senior-base text-red-600">{errors['basicInfo.name']}</p>
        )}
      </div>

      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          나이 *
        </label>
        <input
          type="range"
          min="30"
          max="70"
          value={formData.basicInfo.age}
          onChange={(e) => handleInputChange('basicInfo', 'age', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg slider"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>30세</span>
          <span className="font-medium text-primary-600">{formData.basicInfo.age}세</span>
          <span>70세</span>
        </div>
      </div>

      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          현재 직업/직무 *
        </label>
        <input
          type="text"
          value={formData.basicInfo.occupation}
          onChange={(e) => handleInputChange('basicInfo', 'occupation', e.target.value)}
          className={`input-field ${errors['basicInfo.occupation'] ? 'border-red-300' : ''}`}
          placeholder="예: 부동산 중개인, 세무사, 의사"
        />
        {errors['basicInfo.occupation'] && (
          <p className="mt-2 text-senior-base text-red-600">{errors['basicInfo.occupation']}</p>
        )}
      </div>

      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          경력 (년)
        </label>
        <input
          type="range"
          min="1"
          max="40"
          value={formData.basicInfo.experience}
          onChange={(e) => handleInputChange('basicInfo', 'experience', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg slider"
        />
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>1년</span>
          <span className="font-medium text-primary-600">{formData.basicInfo.experience}년</span>
          <span>40년</span>
        </div>
      </div>

      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          주요 활동 지역 *
        </label>
        <input
          type="text"
          value={formData.basicInfo.location}
          onChange={(e) => handleInputChange('basicInfo', 'location', e.target.value)}
          className={`input-field ${errors['basicInfo.location'] ? 'border-red-300' : ''}`}
          placeholder="예: 서울 강남구, 부산 해운대구"
        />
        {errors['basicInfo.location'] && (
          <p className="mt-2 text-senior-base text-red-600">{errors['basicInfo.location']}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          주요 산업 분야 *
        </label>
        <select
          value={formData.expertise.industry}
          onChange={(e) => handleInputChange('expertise', 'industry', e.target.value)}
          className={`input-field ${errors['expertise.industry'] ? 'border-red-300' : ''}`}
        >
          <option value="">선택해주세요</option>
          {industries.map(industry => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
        {errors['expertise.industry'] && (
          <p className="mt-2 text-senior-base text-red-600">{errors['expertise.industry']}</p>
        )}
      </div>

      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          보유 기술/전문성 * (복수 선택 가능)
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(skillSuggestions[formData.expertise.industry as keyof typeof skillSuggestions] || []).map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => handleSkillToggle(skill)}
              className={`p-3 text-left rounded-lg border transition-all ${
                formData.expertise.skills.includes(skill)
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
        {errors['expertise.skills'] && (
          <p className="mt-2 text-senior-base text-red-600">{errors['expertise.skills']}</p>
        )}
      </div>

      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          주요 성과/실적
        </label>
        <textarea
          rows={3}
          value={formData.expertise.achievements.join('\n')}
          onChange={(e) => handleInputChange('expertise', 'achievements', e.target.value.split('\n').filter(a => a.trim()))}
          className="input-field"
          placeholder="예&#10;- 연매출 10억원 달성&#10;- 고객 만족도 95% 유지&#10;- 업계 우수상 수상"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          사업 목표 * (복수 선택 가능)
        </label>
        {[
          '추가 수익원 확보',
          '디지털 전환',
          '사업 확장',
          '고객 서비스 개선',
          '업무 효율성 향상',
          '새로운 시장 진출'
        ].map(goal => (
          <button
            key={goal}
            type="button"
            onClick={() => handleGoalToggle(goal)}
            className={`w-full p-4 text-left rounded-lg border transition-all mb-2 ${
              formData.businessIntent.goals.includes(goal)
                ? 'bg-primary-50 border-primary-300 text-primary-700'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center">
              <CheckCircleIcon className={`h-5 w-5 mr-3 ${
                formData.businessIntent.goals.includes(goal) ? 'text-primary-600' : 'text-gray-300'
              }`} />
              {goal}
            </div>
          </button>
        ))}
        {errors['businessIntent.goals'] && (
          <p className="mt-2 text-senior-base text-red-600">{errors['businessIntent.goals']}</p>
        )}
      </div>

      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          목표 시장/고객층 *
        </label>
        <input
          type="text"
          value={formData.businessIntent.targetMarket}
          onChange={(e) => handleInputChange('businessIntent', 'targetMarket', e.target.value)}
          className={`input-field ${errors['businessIntent.targetMarket'] ? 'border-red-300' : ''}`}
          placeholder="예: 30-40대 직장인, 중소기업 사장, 시니어층"
        />
        {errors['businessIntent.targetMarket'] && (
          <p className="mt-2 text-senior-base text-red-600">{errors['businessIntent.targetMarket']}</p>
        )}
      </div>

      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          예상 투자 예산
        </label>
        <select
          value={formData.businessIntent.budget}
          onChange={(e) => handleInputChange('businessIntent', 'budget', parseInt(e.target.value))}
          className="input-field"
        >
          <option value={10000000}>1,000만원 이하</option>
          <option value={30000000}>3,000만원 이하</option>
          <option value={50000000}>5,000만원 이하</option>
          <option value={100000000}>1억원 이하</option>
          <option value={200000000}>2억원 이하</option>
          <option value={300000000}>3억원 이상</option>
        </select>
      </div>

      <div>
        <label className="block text-senior-lg font-medium text-gray-700 mb-2">
          희망 런칭 시기
        </label>
        <select
          value={formData.businessIntent.timeline}
          onChange={(e) => handleInputChange('businessIntent', 'timeline', e.target.value)}
          className="input-field"
        >
          <option value="3개월">3개월 이내</option>
          <option value="6개월">6개월 이내</option>
          <option value="1년">1년 이내</option>
          <option value="1년 이상">1년 이상</option>
        </select>
      </div>
    </div>
  );

  return (
    <main id="main-content" className="min-h-screen bg-gray-50 py-8 sm:py-12 container-padding">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <header className="text-center mb-6 sm:mb-8" role="banner">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            전문가 정보 입력
          </h1>
          <p className="text-senior-lg text-gray-600">
            정확한 분석을 위해 상세한 정보를 입력해주세요
          </p>
        </header>

        {/* 진행 단계 표시 */}
        <nav className="mb-6 sm:mb-8" aria-label="양식 진행 단계" role="navigation">
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep >= step.id 
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                  aria-current={currentStep === step.id ? 'step' : undefined}
                  aria-label={`단계 ${step.id}: ${step.title}${currentStep === step.id ? ' (현재)' : currentStep > step.id ? ' (완료)' : ' (미완료)'}`}
                >
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-senior-base font-medium ${
                    currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div 
            className="mt-4 bg-gray-200 rounded-full h-3" 
            role="progressbar" 
            aria-valuenow={(currentStep / 3) * 100} 
            aria-valuemin={0} 
            aria-valuemax={100}
            aria-label="전체 진행률"
          >
            <div 
              className="bg-primary-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </nav>

        {/* 폼 내용 */}
        <section className="card touch-spacing" aria-labelledby="current-step-title">
          <div className="mb-6 spacing-comfortable">
            <h2 id="current-step-title" className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-senior-lg text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {/* 에러 메시지 */}
          {errors.general && (
            <div className="mb-6 alert alert-error" role="alert" aria-live="polite">
              <div className="flex">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0" aria-hidden="true" />
                <div className="ml-3">
                  <p className="text-senior-base text-red-800">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          {/* 단계별 폼 */}
          <form role="form" aria-labelledby="current-step-title">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </form>

          {/* 네비게이션 버튼 */}
          <nav className="flex flex-col sm:flex-row sm:justify-between mt-6 sm:mt-8 gap-4 sm:gap-0" role="navigation" aria-label="단계 네비게이션">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`btn-outline flex items-center justify-center order-2 sm:order-1 ${
                currentStep === 1
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-gray-200'
              }`}
              aria-label="이전 단계로 이동"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" aria-hidden="true" />
              이전
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="btn-primary flex items-center justify-center order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={currentStep === 3 ? '프로필 저장 완료' : '다음 단계로 이동'}
            >
              {currentStep === 3 ? (
                isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true"></div>
                    저장 중...
                  </>
                ) : (
                  '완료'
                )
              ) : (
                <>
                  다음
                  <ArrowRightIcon className="h-5 w-5 ml-2" aria-hidden="true" />
                </>
              )}
            </button>
          </nav>
        </section>
      </div>
    </main>
  );
};

export default OnboardingPage;