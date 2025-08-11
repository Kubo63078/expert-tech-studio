import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 구현에서는 API 호출이 필요합니다
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    
    // 3초 후 폼 초기화
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl shadow-card">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">문의가 접수되었습니다!</h2>
          <p className="text-neutral-600 mb-6 leading-relaxed">
            빠른 시일 내에 담당자가 연락드리겠습니다.
            <br />
            소중한 문의 감사합니다.
          </p>
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors duration-200"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-accent-400">전문가</span>가 
              <br />
              직접 답변드립니다
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 leading-relaxed">
              궁금한 점이 있으시거나 맞춤형 상담이 필요하시면
              <br className="hidden md:block" />
              언제든 연락주세요. 친절하고 상세하게 안내해드립니다.
            </p>
          </div>
        </div>
      </section>

      {/* 연락처 정보 및 문의 양식 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* 연락처 정보 */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">연락처 정보</h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">전화 상담</h3>
                    <p className="text-neutral-600 mb-1">02-1234-5678</p>
                    <p className="text-sm text-neutral-500">평일 9:00 - 18:00</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">이메일</h3>
                    <p className="text-neutral-600 mb-1">contact@experttech.studio</p>
                    <p className="text-sm text-neutral-500">24시간 접수 가능</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">카카오톡 상담</h3>
                    <p className="text-neutral-600 mb-1">@ExpertTech</p>
                    <p className="text-sm text-neutral-500">실시간 채팅 상담</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <GlobeAltIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-2">홈페이지</h3>
                    <p className="text-neutral-600 mb-1">www.experttech-studio.com</p>
                    <p className="text-sm text-neutral-500">온라인 상담 신청</p>
                  </div>
                </div>
              </div>

              {/* 운영 시간 */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <ClockIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <h3 className="font-semibold text-neutral-900">운영 시간</h3>
                </div>
                <div className="space-y-2 text-sm text-neutral-600">
                  <div className="flex justify-between">
                    <span>평일</span>
                    <span>09:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>토요일</span>
                    <span>10:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>일요일 및 공휴일</span>
                    <span>휴무</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-xs text-neutral-500">
                    점심시간: 12:00 - 13:00<br />
                    온라인 문의는 24시간 접수 가능합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 문의 양식 */}
            <div className="lg:col-span-3">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8">온라인 문의</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-3">
                      성함 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="홍길동"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-neutral-700 mb-3">
                      연락처 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="010-1234-5678"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-3">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="hong@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-neutral-700 mb-3">
                      회사/직업
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="홍길동부동산"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-neutral-700 mb-3">
                    문의 유형 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                  >
                    <option value="">문의 유형을 선택해주세요</option>
                    <option value="consultation">무료 상담 신청</option>
                    <option value="service">서비스 관련 문의</option>
                    <option value="pricing">가격 및 패키지 문의</option>
                    <option value="technical">기술적 문의</option>
                    <option value="partnership">파트너십 제안</option>
                    <option value="other">기타 문의</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-neutral-700 mb-3">
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 text-lg border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
                    placeholder="문의하실 내용을 자세히 적어주세요. 전문 분야, 목표, 예산 등을 포함해주시면 더 정확한 답변을 드릴 수 있습니다."
                  />
                </div>

                <div className="bg-primary-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-primary-900 mb-3">📋 더 정확한 상담을 위해 포함해주세요</h3>
                  <ul className="space-y-2 text-sm text-primary-800">
                    <li>• 현재 전문 분야 및 경력</li>
                    <li>• 원하시는 비즈니스 목표</li>
                    <li>• 예상 투자 예산 범위</li>
                    <li>• 희망 런칭 일정</li>
                    <li>• 기타 특별한 요구사항</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-xl hover:bg-primary-700 transition-colors duration-200 shadow-button hover:shadow-button-hover"
                >
                  문의하기
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </button>

                <p className="text-xs text-neutral-500 text-center">
                  문의해주신 내용은 24시간 이내에 검토 후 답변드립니다.
                  급한 문의사항은 전화상담을 이용해주세요.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 오시는 길 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              오시는 길
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              직접 방문 상담도 가능합니다. 사전 예약을 통해 더 자세한 상담을 받아보세요.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* 지도 영역 (실제 구현시 구글맵 또는 네이버맵 API 사용) */}
            <div className="bg-neutral-200 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center text-neutral-500">
                <MapPinIcon className="h-12 w-12 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">지도 영역</p>
                <p className="text-sm">실제 구현시 지도 API 연동</p>
              </div>
            </div>

            {/* 주소 정보 */}
            <div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-8">방문 상담 안내</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <MapPinIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">주소</h4>
                    <p className="text-neutral-600 leading-relaxed">
                      서울특별시 강남구 테헤란로 123<br />
                      ExpertTech 빌딩 5층
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">지하철</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">대중교통</h4>
                    <p className="text-neutral-600 leading-relaxed">
                      2호선 강남역 2번 출구 도보 5분<br />
                      분당선 선릉역 4번 출구 도보 7분
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">P</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">주차 안내</h4>
                    <p className="text-neutral-600 leading-relaxed">
                      건물 지하 1-3층 주차장 이용<br />
                      방문시 2시간 무료 주차 제공
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-accent-50 rounded-2xl border border-accent-200">
                <h4 className="font-semibold text-accent-800 mb-3">💡 방문 상담 예약</h4>
                <p className="text-accent-700 text-sm leading-relaxed mb-4">
                  더 자세하고 개인화된 상담을 원하시면 방문 상담을 예약해주세요.
                  전문 컨설턴트가 1:1로 맞춤형 솔루션을 제안해드립니다.
                </p>
                <Link 
                  to="/consultation"
                  className="inline-flex items-center px-6 py-3 bg-accent-600 text-white text-sm font-semibold rounded-xl hover:bg-accent-700 transition-colors duration-200"
                >
                  방문 상담 예약하기
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 자주 묻는 질문 */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">
              자주 묻는 질문
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              고객들이 가장 궁금해하시는 질문들을 모았습니다.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Q. 개발 비용은 어느 정도인가요?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                A. 프로젝트 규모에 따라 Basic(1,500만원), Advanced(3,000만원), Premium(5,000만원) 패키지로 구성되어 있습니다. 
                무료 상담을 통해 정확한 견적을 제공해드립니다.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Q. 개발 기간은 얼마나 걸리나요?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                A. 패키지에 따라 3-12개월 정도 소요됩니다. Basic은 3-4개월, Advanced는 6-8개월, Premium은 8-12개월이 일반적입니다. 
                프로젝트 복잡도에 따라 조정될 수 있습니다.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Q. IT 지식이 없어도 가능한가요?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                A. 네, 전혀 문제없습니다. 40-50대 고객분들을 위해 특별히 설계된 친화적인 인터페이스와 
                지속적인 교육 지원으로 누구나 쉽게 사용할 수 있습니다.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Q. 런칭 후 지원은 어떻게 되나요?
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                A. 패키지에 따라 3개월-1년간 기술 지원과 비즈니스 컨설팅을 제공합니다. 
                운영 중 발생하는 문제 해결과 지속적인 개선을 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;