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

interface CostMonitor {
  recordUsage(model: string, promptTokens: number, completionTokens: number): any;
}

// 간단한 비용 모니터링 구현
const costMonitor: CostMonitor = {
  recordUsage: (model: string, promptTokens: number, completionTokens: number) => {
    const cost = calculateCost(model, promptTokens, completionTokens);
    console.log(`💰 ${model} Usage: ${promptTokens + completionTokens} tokens, ~$${cost.toFixed(4)}`);
    
    // 비용 알림 로직 (간단한 구현)
    if (cost > 0.1) {
      return {
        type: 'warning',
        message: `High cost detected: $${cost.toFixed(4)}`
      };
    }
    return null;
  }
};

function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  // OpenAI 요금 (2024 기준, 대략적)
  const rates = {
    'gpt-4o': { prompt: 0.005 / 1000, completion: 0.015 / 1000 },
    'gpt-4o-mini': { prompt: 0.00015 / 1000, completion: 0.0006 / 1000 }
  };
  
  const rate = rates[model as keyof typeof rates] || rates['gpt-4o-mini'];
  return (promptTokens * rate.prompt) + (completionTokens * rate.completion);
}

export class AiAnalysisService {
  private openaiKey: string;
  private huggingFaceKey: string;
  private openaiUrl: string;
  private modelConfig: ModelConfig;
  private metrics = {
    totalRequests: 0,
    successfulParses: 0,
    failedParses: 0
  };

  constructor() {
    // 환경변수에서 API 키 로드
    this.openaiKey = process.env.OPENAI_API_KEY || '';
    this.huggingFaceKey = process.env.HUGGINGFACE_API_KEY || '';
    this.openaiUrl = 'https://api.openai.com/v1/chat/completions';
    
    // 모델 설정
    this.modelConfig = {
      primary: process.env.PRIMARY_MODEL || 'gpt-4o',
      fallbacks: ['gpt-4o-mini', 'huggingface', 'mock'],
      maxTokens: 2000
    };
    
    console.log('🚀 Backend AI Analysis Service initialized:', {
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
      
      // 3차: Hugging Face 폴백 (여기서는 Skip - 복잡성 때문에)
      console.log('🎭 Skipping Hugging Face, using intelligent mock');
      throw new Error('No OpenAI API key available');
      
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
    const expertise = answers.expertise_main_field || answers.expertise_field || '전문 분야';
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

**반드시 지켜주세요**: 
- 순수한 JSON 객체만 반환
- 코드블록(\`\`\`) 금지
- 설명이나 추가 텍스트 금지
- { 로 시작해서 } 로 끝나는 JSON만 반환
- "I'm sorry" 같은 텍스트 절대 금지`;
  }

  /**
   * OpenAI API 호출 (GPT-4o 및 GPT-4o-mini 지원)
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
        max_tokens: model === 'gpt-4o' ? 2000 : 1500,
        response_format: { type: "json_object" }
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
      }
    }

    const responseTime = Date.now() - startTime;
    console.log(`✅ ${model} Response: ${responseTime}ms, Tokens: ${usage?.total_tokens || 'unknown'}`);
    
    return data.choices[0].message.content;
  }

  /**
   * LLM 응답을 파싱하여 구조화된 결과 반환
   */
  private parseAnalysisResult(llmResponse: string, answers: UserAnswers): AnalysisResult {
    try {
      // 1단계: 응답 정리
      let cleanedResponse = llmResponse.trim();
      
      // 2단계: 다양한 텍스트 패턴 제거
      const unwantedPatterns = [
        /^I'm sorry[^{]*/i,
        /^Here is[^{]*/i,
        /^다음은[^{]*/,
        /^아래는[^{]*/,
        /^JSON 응답[^{]*/,
        /^분석 결과[^{]*/,
        /```json\s*/g,
        /```\s*/g,
        /\s*```$/g
      ];
      
      for (const pattern of unwantedPatterns) {
        cleanedResponse = cleanedResponse.replace(pattern, '');
      }
      
      // 3단계: JSON 객체 추출 (첫 번째 { 부터 마지막 } 까지)
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedResponse = jsonMatch[0];
      }
      
      // 4단계: JSON 수정 시도 (trailing comma 제거)
      cleanedResponse = cleanedResponse.replace(/,(\s*[}\]])/g, '$1');
      
      // 5단계: JSON 파싱 시도
      const parsed = JSON.parse(cleanedResponse);
      
      // 필수 필드 검증
      const required = ['expertiseScore', 'personalizedInsight', 'businessHint'];
      for (const field of required) {
        if (!parsed[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // 성공 메트릭 기록
      this.metrics.totalRequests++;
      this.metrics.successfulParses++;
      
      console.log(`✅ JSON 파싱 성공 (성공률: ${(this.metrics.successfulParses / this.metrics.totalRequests * 100).toFixed(1)}%)`);

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
      console.error('❌ JSON 파싱 실패:', {
        error: error.message,
        originalResponse: llmResponse.substring(0, 200) + (llmResponse.length > 200 ? '...' : ''),
        cleanedResponse: cleanedResponse?.substring(0, 200) + (cleanedResponse?.length > 200 ? '...' : ''),
        responseLength: llmResponse.length
      });
      
      // 실패 메트릭 기록
      this.metrics.totalRequests++;
      this.metrics.failedParses++;
      
      console.warn(`🔄 JSON 파싱 실패 - Mock으로 폴백 (성공률: ${(this.metrics.successfulParses / this.metrics.totalRequests * 100).toFixed(1)}%)`);
      
      return this.getMockAnalysis(answers);
    }
  }

  /**
   * 개발/에러 시 사용할 목업 분석 결과 (public method for fallback)
   */
  public getMockAnalysis(answers: UserAnswers): AnalysisResult {
    const expertise = answers.expertise_field || answers.expertise_main_field || '전문 분야';
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
export const aiAnalysisService = new AiAnalysisService();
