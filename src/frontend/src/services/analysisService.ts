// 프리미엄 LLM 기반 전문성 분석 서비스 (GPT-4o 메인)
import { costMonitor } from './costMonitor';
interface AnalysisResult {
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

interface UserAnswers {
  [key: string]: any;
}

interface ModelConfig {
  primary: string;
  fallbacks: string[];
  maxTokens: number;
}

export class AnalysisService {
  private openaiKey: string;
  private huggingFaceKey: string;
  private openaiUrl: string;
  private huggingFaceUrl: string;
  private modelConfig: ModelConfig;

  constructor() {
    // 환경변수에서 API 키 로드
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.huggingFaceKey = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';
    this.openaiUrl = 'https://api.openai.com/v1/chat/completions';
    this.huggingFaceUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large';
    
    // 모델 설정 (환경변수로 변경 가능)
    this.modelConfig = {
      primary: import.meta.env.VITE_PRIMARY_MODEL || 'gpt-4o',
      fallbacks: ['gpt-4o-mini', 'huggingface', 'mock'],
      maxTokens: 2000
    };
    
    console.log('🚀 Premium LLM Service initialized:', {
      primaryModel: this.modelConfig.primary,
      hasOpenAI: !!this.openaiKey,
      hasHuggingFace: !!this.huggingFaceKey,
      fallbackChain: 'GPT-4o → GPT-4o-mini → HuggingFace → Mock'
    });
  }

  /**
   * 사용자 답변을 기반으로 전문성 분석 수행
   */
  async analyzeExpertise(answers: UserAnswers): Promise<AnalysisResult> {
    // 프리미엄 폴백 체인: GPT-4o → GPT-4o-mini → Hugging Face → Mock
    const prompt = this.buildStrategicPrompt(answers);
    
    try {
      if (this.openaiKey) {
        // 1차: GPT-4o 시도
        try {
          console.log('🚀 Using GPT-4o (Premium Quality)');
          const result = await this.callOpenAI(prompt, 'gpt-4o');
          return this.parseAnalysisResult(result, answers);
        } catch (error) {
          console.warn('GPT-4o failed, trying GPT-4o-mini:', error);
          
          // 2차: GPT-4o-mini 폴백
          try {
            console.log('🔄 Fallback to GPT-4o-mini');
            const result = await this.callOpenAI(prompt, 'gpt-4o-mini');
            return this.parseAnalysisResult(result, answers);
          } catch (miniError) {
            console.warn('GPT-4o-mini failed, trying Hugging Face:', miniError);
            throw miniError; // 다음 폴백으로 진행
          }
        }
      }
      
      // 3차: Hugging Face 폴백
      if (this.huggingFaceKey) {
        console.log('🤗 Using Hugging Face (API Key)');
        const result = await this.callHuggingFace(prompt);
        return this.parseAnalysisResult(result, answers);
      } else {
        console.log('🎭 Using Hugging Face (Anonymous)');
        const result = await this.callHuggingFaceAnonymous(prompt);
        return this.parseAnalysisResult(result, answers);
      }
    } catch (error) {
      // 4차: Mock 폴백
      console.error('All LLM services failed, using intelligent mock:', error);
      return this.getMockAnalysis(answers);
    }
  }

  /**
   * GPT-4o 최적화된 전략적 프롬프트 생성
   */
  private buildStrategicPrompt(answers: UserAnswers): string {
    const expertise = answers.expertise_main_field || '전문 분야';
    const years = answers.expertise_years || '경력';
    const name = answers.basic_name || '고객';

    return `당신은 ExpertTech Studio의 수석 AI 분석가입니다. ${name}님(${expertise}, ${years})을 위한 프리미엄 비즈니스 분석을 수행합니다.

**핵심 전략**:
• 골디락스 원리: 관심 유발하되 완전 공개 금지
• 개인화 분석: 구체적 경험 기반 맞춤 통찰
• 긴급성 조성: 현재 시점의 기회 비용 강조
• 차별화 가치: ExpertTech만의 독점 우위 부각

**사용자 프로필**:
${JSON.stringify(answers, null, 2)}

**출력 형식** (정확한 JSON):
{
  "expertiseScore": 85,
  "personalizedInsight": "${name}님의 ${expertise} ${years} 경험을 활용한 구체적 통찰 (90자)",
  "businessHint": "${expertise} × AI/플랫폼 융합의 명확한 방향성 (70자)",
  "marketOpportunity": "현재 시점의 시장 타이밍과 기회 (90자)",
  "successProbability": "87% (동일 배경 성공률 기준)",
  "keyStrengths": ["강점1", "강점2", "강점3", "강점4"],
  "nextStepTeaser": "구체적 기술스택/파트너사/로드맵 정보 필요성 (110자)",
  "exclusiveValue": "ExpertTech 독점 자산/네트워크 가치 (90자)",
  "urgencyFactor": "지금 시작해야 하는 명확한 이유 (90자)"
}

**중요**: 유효한 JSON만 반환, 추가 텍스트 금지.`;
  }

  /**
   * OpenAI API 호출 (GPT-4o 및 GPT-4o-mini 지원) with 비용 모니터링
   */
  private async callOpenAI(prompt: string, model: string = 'gpt-4o'): Promise<string> {
    const startTime = Date.now();
    
    const response = await fetch(this.openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.openaiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: '당신은 40-50대 전문가를 위한 IT 비즈니스 분석 전문가입니다. 전략적이고 개인화된 분석 결과를 JSON 형식으로 제공합니다. 높은 품질의 통찰력 있는 분석으로 사용자가 신뢰할 수 있는 비즈니스 방향을 제시해주세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: model === 'gpt-4o' ? 2000 : 1500 // GPT-4o는 더 긴 응답 허용
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error (${model}): ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error(`Invalid OpenAI response format for ${model}`);
    }

    // 비용 모니터링 및 사용량 기록
    const usage = data.usage;
    if (usage) {
      const costAlert = costMonitor.recordUsage(
        model,
        usage.prompt_tokens || 0,
        usage.completion_tokens || 0
      );
      
      if (costAlert) {
        console.warn(`💰 Cost Alert: ${costAlert.message}`);
        
        // 심각한 경우 알림 표시 (실제 환경에서는 UI 알림으로 변경)
        if (costAlert.type === 'critical') {
          console.error('🚨 Critical: Daily budget almost exceeded!');
        }
      }
    }

    const responseTime = Date.now() - startTime;
    console.log(`✅ ${model} Response: ${responseTime}ms, Tokens: ${usage?.total_tokens || 'unknown'}`);
    
    return data.choices[0].message.content;
  }

  /**
   * Hugging Face API 호출 (유료 계정)
   */
  private async callHuggingFace(prompt: string): Promise<string> {
    // 좀 더 적합한 모델 사용
    const modelUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';
    
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.huggingFaceKey}`
      },
      body: JSON.stringify({
        inputs: this.adaptPromptForHuggingFace(prompt),
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data[0]?.generated_text || '';
  }

  /**
   * Hugging Face API 호출 (무료, 익명)
   */
  private async callHuggingFaceAnonymous(prompt: string): Promise<string> {
    // 무료로 사용 가능한 텍스트 생성 모델
    const modelUrl = 'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill';
    
    try {
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: this.adaptPromptForHuggingFace(prompt)
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face Anonymous API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Hugging Face 모델들의 응답 형식이 다양하므로 적절히 파싱
      let result = '';
      if (Array.isArray(data)) {
        result = data[0]?.generated_text || data[0]?.text || '';
      } else if (data.generated_text) {
        result = data.generated_text;
      } else {
        result = JSON.stringify(data);
      }
      
      return result || this.generateFallbackResponse(prompt);
    } catch (error) {
      console.warn('Hugging Face API failed, generating smart fallback:', error);
      return this.generateFallbackResponse(prompt);
    }
  }

  /**
   * Hugging Face용 프롬프트 적응
   */
  private adaptPromptForHuggingFace(prompt: string): string {
    // Hugging Face 모델은 보통 더 짧고 직접적인 프롬프트를 선호
    return `Generate business analysis in JSON format for a Korean professional. 
Include: expertiseScore (75-95), personalizedInsight, businessHint, successProbability, keyStrengths array.
Make it personalized and motivating.`;
  }

  /**
   * 스마트 폴백 응답 생성 (LLM 실패시)
   */
  private generateFallbackResponse(prompt: string): string {
    // 프롬프트에서 사용자 정보 추출하여 개인화된 JSON 생성
    const mockResponses = [
      `{
        "expertiseScore": 87,
        "personalizedInsight": "풍부한 경험과 전문성이 IT 비즈니스의 핵심 차별화 요소가 될 것입니다.",
        "businessHint": "전문 분야 × AI 기술 융합으로 새로운 시장 기회 창출 가능",
        "marketOpportunity": "디지털 전환 가속화로 전문가 기반 IT 서비스 수요 급증",
        "successProbability": "85% (유사 배경 전문가 성공 사례 기준)",
        "keyStrengths": ["축적된 전문 지식", "고객 신뢰도", "시장 이해도", "실무 경험"],
        "nextStepTeaser": "구체적인 기술 구현과 비즈니스 모델은 전문가 상담에서 맞춤 설계해드립니다.",
        "exclusiveValue": "ExpertTech만의 검증된 파트너 네트워크와 성공 사례 데이터베이스",
        "urgencyFactor": "시장 선점을 위한 골든타임, 6개월 내 진입 필수"
      }`,
      `{
        "expertiseScore": 82,
        "personalizedInsight": "오랜 경력에서 쌓인 통찰력이 혁신적인 IT 솔루션의 기반이 됩니다.",
        "businessHint": "기존 업무 프로세스 자동화 및 AI 기반 효율성 향상 서비스",
        "marketOpportunity": "전문 서비스업의 디지털화 전환으로 새로운 비즈니스 모델 부상",
        "successProbability": "83% (동일 분야 디지털 전환 성공률 기준)",
        "keyStrengths": ["도메인 전문성", "네트워킹 능력", "문제 해결 능력", "사업 감각"],
        "nextStepTeaser": "세부 구현 전략과 투자 계획은 1:1 전문가 상담에서 공개됩니다.",
        "exclusiveValue": "25년 축적된 개발 노하우와 독점 기술 파트너십 네트워크",
        "urgencyFactor": "경쟁사 진입 전 시장 선점 기회, 현재가 최적 타이밍"
      }`
    ];
    
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  /**
   * LLM 응답을 파싱하여 구조화된 결과 반환
   */
  private parseAnalysisResult(llmResponse: string, answers: UserAnswers): AnalysisResult {
    try {
      // JSON 파싱 시도
      const parsed = JSON.parse(llmResponse);
      
      // 필수 필드 검증
      const required = ['expertiseScore', 'personalizedInsight', 'businessHint'];
      for (const field of required) {
        if (!parsed[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return {
        expertiseScore: parseInt(parsed.expertiseScore) || 85,
        personalizedInsight: parsed.personalizedInsight || '',
        businessHint: parsed.businessHint || '',
        marketOpportunity: parsed.marketOpportunity || '',
        successProbability: parsed.successProbability || '85%',
        keyStrengths: parsed.keyStrengths || [],
        nextStepTeaser: parsed.nextStepTeaser || '',
        exclusiveValue: parsed.exclusiveValue || '',
        urgencyFactor: parsed.urgencyFactor || ''
      };
    } catch (error) {
      console.error('Failed to parse LLM response:', error);
      return this.getMockAnalysis(answers);
    }
  }

  /**
   * 개발/에러 시 사용할 목업 분석 결과
   */
  private getMockAnalysis(answers: UserAnswers): AnalysisResult {
    const expertise = answers.expertise_field || '전문 분야';
    const name = answers.basic_name || '고객';

    return {
      expertiseScore: 87,
      personalizedInsight: `${name}님의 ${expertise} 분야 경험은 AI 기술과 융합했을 때 강력한 차별화 요소가 됩니다.`,
      businessHint: `${expertise} × AI 융합 서비스, 개인 맞춤형 솔루션 플랫폼`,
      marketOpportunity: `${expertise} AI 시장이 향후 18개월 내 급성장 예상, 선점 효과 극대화 구간`,
      successProbability: '84% (유사 배경 전문가 6개월 평균 성과 기준)',
      keyStrengths: [
        '장기간 축적된 전문 지식',
        '타겟 고객층 이해도',
        '신뢰 기반 네트워크',
        '실무 경험 기반 통찰력'
      ],
      nextStepTeaser: '구체적인 AI 기술 스택, 파트너사 연결, 6개월 개발 로드맵은 전문가 상담에서 맞춤 설계해드립니다.',
      exclusiveValue: 'ExpertTech만의 AI 개발사 네트워크와 200+ 성공 사례 데이터로 3개월 내 MVP 출시 가능',
      urgencyFactor: '현재 경쟁사 진입 전 골든타임, 6개월 내 시장 선점 필수'
    };
  }
}

// 싱글톤 인스턴스 생성
export const analysisService = new AnalysisService();