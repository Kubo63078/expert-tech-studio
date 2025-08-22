// AI 분석 서비스 - 백엔드 API 호출
export interface AnalysisResult {
  expertiseScore: number;
  personalizedInsight: string;
  businessHint: string;
  marketOpportunity: string;
  successProbability: string;
  keyStrengths: string[];
  nextStepTeaser: string;
  exclusiveValue: string;
  urgencyFactor: string;
}

export interface UserAnswers {
  [key: string]: any;
}

export class AnalysisService {
  private backendUrl: string;

  constructor() {
    // 백엔드 URL 설정 (개발/프로덕션 자동 감지)
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    
    console.log('🚀 Frontend AI Service initialized:', {
      backendUrl: this.backendUrl,
      mode: import.meta.env.MODE
    });
  }

  /**
   * 백엔드를 통해 사용자 답변 분석 요청
   */
  async analyzeExpertise(answers: UserAnswers): Promise<AnalysisResult> {
    console.log('📡 Requesting AI analysis from backend...');
    
    try {
      const response = await fetch(`${this.backendUrl}/api/ai/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interviewData: answers })
      });

      if (!response.ok) {
        throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Backend analysis failed');
      }

      console.log('✅ AI analysis completed via backend');
      return data.data;
      
    } catch (error) {
      console.error('Backend analysis failed:', error);
      
      // 백엔드 실패시 클라이언트 사이드 폴백
      console.log('🎭 Using client-side fallback analysis');
      return this.getClientFallbackAnalysis(answers);
    }
  }

  /**
   * 백엔드 연결 실패시 클라이언트 사이드 폴백
   */
  private getClientFallbackAnalysis(answers: UserAnswers): AnalysisResult {
    const expertise = answers.expertise_field || answers.expertise_main_field || '전문 분야';
    const name = answers.basic_name || '고객';

    return {
      expertiseScore: 85,
      personalizedInsight: `${name}님의 ${expertise} 분야 전문성은 디지털 비즈니스의 핵심 경쟁력이 될 수 있습니다.`,
      businessHint: `${expertise} × AI 기술 융합으로 차별화된 서비스 플랫폼 구축`,
      marketOpportunity: '전문가 기반 AI 솔루션 시장이 급성장 중이며, 현재가 진입 적기입니다.',
      successProbability: '85% (유사 전문가 평균 성공률 기준)',
      keyStrengths: [
        '축적된 도메인 전문 지식',
        '신뢰할 수 있는 고객 네트워크',
        '실무 기반 문제 해결 능력',
        '시장 요구사항 파악 능력'
      ],
      nextStepTeaser: '구체적인 기술 구현 방안과 비즈니스 모델은 전문가 상담에서 맞춤 제안해드립니다.',
      exclusiveValue: 'ExpertTech의 검증된 개발 파트너와 성공 사례로 빠른 시장 진입이 가능합니다.',
      urgencyFactor: '경쟁 업체 진입 전 선점 효과를 위해 6개월 내 출시가 중요합니다.'
    };
  }
}

// 싱글톤 인스턴스 생성
export const analysisService = new AnalysisService();