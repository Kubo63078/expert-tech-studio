import { useState } from 'react';
import { 
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendedModel?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  preferredTime: string;
  interestedModel: string;
  additionalNotes: string;
}

const ConsultationModal = ({ isOpen, onClose, recommendedModel = '' }: ConsultationModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    preferredTime: '',
    interestedModel: recommendedModel,
    additionalNotes: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 실제로는 API 호출, 여기서는 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 로컬 스토리지에 저장 (실제 구현 시 백엔드 API 호출)
    const consultationData = {
      ...formData,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    const existingConsultations = JSON.parse(localStorage.getItem('consultations') || '[]');
    existingConsultations.push(consultationData);
    localStorage.setItem('consultations', JSON.stringify(existingConsultations));
    
    console.log('상담 신청 데이터:', consultationData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      preferredTime: '',
      interestedModel: recommendedModel,
      additionalNotes: ''
    });
    setIsSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">무료 전문 상담 신청</h2>
              <p className="text-neutral-600">전문 컨설턴트와 1:1 맞춤 상담을 받아보세요</p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 text-2xl p-2"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 이름 */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <UserIcon className="h-4 w-4 inline mr-2" />
                  성함 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="홍길동"
                  className="input-field"
                  required
                />
              </div>

              {/* 이메일 */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <EnvelopeIcon className="h-4 w-4 inline mr-2" />
                  이메일 *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="input-field"
                  required
                />
              </div>

              {/* 연락처 */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <PhoneIcon className="h-4 w-4 inline mr-2" />
                  연락처 *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  className="input-field"
                  required
                />
              </div>

              {/* 희망 상담 시간 */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <CalendarDaysIcon className="h-4 w-4 inline mr-2" />
                  희망 상담 시간 *
                </label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">시간대를 선택해주세요</option>
                  <option value="morning">오전 (09:00 - 12:00)</option>
                  <option value="afternoon">오후 (13:00 - 17:00)</option>
                  <option value="evening">저녁 (18:00 - 21:00)</option>
                  <option value="flexible">시간 조율 가능</option>
                </select>
              </div>

              {/* 관심 비즈니스 모델 */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  관심 비즈니스 모델
                </label>
                <input
                  type="text"
                  name="interestedModel"
                  value={formData.interestedModel}
                  onChange={handleInputChange}
                  placeholder="AI 기반 부동산 투자 분석 플랫폼"
                  className="input-field"
                />
                <p className="text-sm text-neutral-500 mt-1">
                  분석 결과에서 관심있는 비즈니스 모델을 적어주세요
                </p>
              </div>

              {/* 추가 문의사항 */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  추가 문의사항
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="상담 시 중점적으로 논의하고 싶은 내용이 있다면 자유롭게 작성해주세요"
                  className="input-field min-h-[100px] resize-y"
                  rows={4}
                />
              </div>

              {/* 안내 사항 */}
              <div className="bg-primary-50 rounded-lg p-4">
                <h4 className="font-semibold text-primary-900 mb-2">상담 진행 안내</h4>
                <ul className="text-sm text-primary-800 space-y-1">
                  <li>• 영업일 기준 1-2일 내 연락드립니다</li>
                  <li>• 화상 또는 전화 상담 (약 30-60분 소요)</li>
                  <li>• 맞춤형 비즈니스 실행 계획을 제공합니다</li>
                  <li>• 상담료는 완전 무료입니다</li>
                </ul>
              </div>

              {/* 제출 버튼 */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn-secondary"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      신청 중...
                    </>
                  ) : (
                    '상담 신청하기'
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* 성공 메시지 */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-4">
                상담 신청이 완료되었습니다!
              </h3>
              <p className="text-neutral-600 mb-6 max-w-md mx-auto">
                <strong className="text-neutral-800">{formData.name}</strong>님의 상담 신청을 접수했습니다.<br />
                영업일 기준 1-2일 내에 <strong className="text-neutral-800">{formData.phone}</strong>로 연락드리겠습니다.
              </p>
              
              <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                <h4 className="font-semibold text-neutral-900 mb-2">신청 정보 요약</h4>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p><span className="font-medium">희망 시간:</span> {
                    formData.preferredTime === 'morning' ? '오전 (09:00-12:00)' :
                    formData.preferredTime === 'afternoon' ? '오후 (13:00-17:00)' :
                    formData.preferredTime === 'evening' ? '저녁 (18:00-21:00)' :
                    '시간 조율 가능'
                  }</p>
                  {formData.interestedModel && (
                    <p><span className="font-medium">관심 모델:</span> {formData.interestedModel}</p>
                  )}
                </div>
              </div>

              <button
                onClick={resetAndClose}
                className="btn-primary"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationModal;