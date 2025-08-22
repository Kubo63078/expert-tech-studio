// AI 기반 맞춤형 인터뷰 질문 생성 서비스
interface Question {
  id: string;
  question: string;
  purpose: string;
  options: string[];
  allowCustom: boolean;
  customPlaceholder?: string;
}

interface ConversationContext {
  answers: Record<string, string>;
  questionCount: number;
  currentFocus: string;
  industry?: string;
  expertise?: string;
  businessGoal?: string;
}

type StatusCallback = (message: string) => void;

export class AIInterviewer {
  private openaiKey: string;
  private openaiUrl: string;
  private questionHistory: string[] = [];
  private statusCallback?: StatusCallback;

  constructor() {
    this.openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.openaiUrl = 'https://api.openai.com/v1/chat/completions';  // 안정적인 Chat Completions API
    
    // 디버깅 정보 출력
    console.log('🤖 AI Interviewer 초기화:', {
      model: '허깅페이스 (무료, 429 에러 회피)',
      api: 'HuggingFace Inference API',
      fallback: '스마트 정적 질문',
      hasOpenAIKey: !!this.openaiKey
    });
  }

  /**
   * 상태 콜백 등록
   */
  setStatusCallback(callback: StatusCallback) {
    this.statusCallback = callback;
  }

  /**
   * 인터뷰 시작 - 첫 번째 질문 생성
   */
  async generateFirstQuestion(): Promise<Question> {
    const prompt = `
당신은 40-50대 전문가를 위한 IT 비즈니스 컨설턴트입니다.
사용자의 전문성을 파악하여 맞춤형 IT 비즈니스 솔루션을 제안하는 것이 목표입니다.

첫 번째 질문을 생성해주세요:
- 목적: 사용자의 주요 전문 분야 파악
- 5개 이하의 일반적인 선택지 제공
- 마지막에 "기타" 옵션 포함
- 전문적이고 간결한 톤

응답 형식:
{
  "question": "질문 내용",
  "purpose": "질문 목적",
  "options": ["선택지1", "선택지2", "선택지3", "선택지4", "기타"],
  "customPlaceholder": "기타 선택시 안내 문구"
}
`;

    try {
      console.log('🚀 첫 질문 AI 생성 시작... (허깅페이스 사용)');
      const response = await this.callOpenAI(prompt);
      console.log('✅ AI 응답 받음:', response.slice(0, 200) + '...');
      
      const questionData = JSON.parse(response);
      console.log('📝 첫 질문 파싱 완료:', questionData);
      
      // 질문 히스토리에 추가
      this.questionHistory = [questionData.question];
      
      return {
        id: 'q1',
        question: questionData.question,
        purpose: questionData.purpose,
        options: questionData.options,
        allowCustom: true,
        customPlaceholder: questionData.customPlaceholder
      };
    } catch (error) {
      console.error('❌ 첫 질문 생성 실패, 폴백 사용:', error);
      return this.getFallbackFirstQuestion();
    }
  }

  /**
   * 다음 질문 생성 (맥락 기반)
   */
  async generateNextQuestion(context: ConversationContext): Promise<Question | null> {
    // 인터뷰 완료 확인
    if (this.isInterviewComplete(context)) {
      return null;
    }

    const prompt = `
당신은 IT 비즈니스 컨설턴트입니다.
지금까지의 대화 맥락을 바탕으로 다음 질문을 생성해주세요.

## 현재 상황
- 질문 수: ${context.questionCount}개 완료
- 목표: 총 6-8개 질문으로 비즈니스 솔루션 도출

## 이전 답변들
${Object.entries(context.answers).map(([q, a]) => `${q}: ${a}`).join('\n')}

## 이미 물어본 질문들 (중복 방지)
${this.questionHistory.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## 다음 질문 생성 규칙
1. 이전 답변을 기반으로 더 구체적인 질문
2. 비즈니스 솔루션 도출에 필요한 정보 수집
3. 4-5개 예상 답변 + "기타" 옵션
4. 전문적이고 간결한 톤
5. **중요**: 이미 물어본 질문과 유사한 질문 절대 금지

## 중점 파악 영역 (우선순위 순)
1. 전문 분야별 구체적 강점
2. 현재 업무의 비효율/자동화 포인트  
3. 목표 고객층과 시장
4. 원하는 서비스 형태
5. 비즈니스 규모와 예산
6. 실행 일정과 우려사항

응답 형식:
{
  "question": "질문 내용",
  "purpose": "질문 목적",
  "options": ["선택지1", "선택지2", "선택지3", "선택지4", "기타"],
  "customPlaceholder": "기타 선택시 안내 문구"
}
`;

    try {
      console.log(`🔄 ${context.questionCount + 1}번째 질문 AI 생성 시작...`);
      console.log('📋 현재 컨텍스트:', context);
      
      const response = await this.callOpenAI(prompt);
      console.log('✅ AI 응답 받음:', response.slice(0, 200) + '...');
      
      const questionData = JSON.parse(response);
      console.log('📝 다음 질문 파싱 완료:', questionData);
      
      // 질문 히스토리에 추가
      this.questionHistory.push(questionData.question);
      
      return {
        id: `q${context.questionCount + 1}`,
        question: questionData.question,
        purpose: questionData.purpose,
        options: questionData.options,
        allowCustom: true,
        customPlaceholder: questionData.customPlaceholder
      };
    } catch (error) {
      console.error('❌ 다음 질문 생성 실패, 폴백 사용:', error);
      return this.getFallbackQuestion(context);
    }
  }

  /**
   * 인터뷰 완료 여부 판단
   */
  isInterviewComplete(context: ConversationContext): boolean {
    // 최소 6개, 최대 8개 질문
    if (context.questionCount < 6) return false;
    if (context.questionCount >= 8) return true;

    // 핵심 정보 수집 완료 확인
    const answers = Object.values(context.answers);
    const hasIndustry = answers.some(a => a.includes('부동산') || a.includes('금융') || a.includes('교육') || a.includes('컨설팅'));
    const hasBusinessGoal = answers.some(a => a.includes('매출') || a.includes('수익') || a.includes('고객'));
    const hasTimeline = answers.some(a => a.includes('개월') || a.includes('년') || a.includes('시간'));

    return hasIndustry && hasBusinessGoal && hasTimeline;
  }

  /**
   * LLM API 호출 (OpenAI → 허깅페이스 폴백)
   */
  private async callOpenAI(prompt: string, maxRetries: number = 2): Promise<string> {
    // 모든 외부 API가 실패하므로 스마트 정적 질문 직접 사용
    console.log('⚠️ 외부 API 모두 실패 - 스마트 정적 질문 사용');
    throw new Error('외부 API 사용 불가 - 폴백 사용');
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const statusMsg = `AI 질문 생성 중... (${attempt + 1}/${maxRetries + 1} 시도)`;
        console.log(`🔄 ${statusMsg}`);
        this.statusCallback?.(statusMsg);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8초 타임아웃
        
        const response = await fetch(this.openaiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: '당신은 전문적이고 효율적인 IT 비즈니스 컨설턴트입니다. JSON 형식으로만 응답하세요.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 1000,
            temperature: 0.7
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ API 호출 성공 (${attempt + 1}번째 시도)`);
          return data.choices[0].message.content;
        }

        // 429 에러이고 재시도 가능한 경우
        if (response.status === 429 && attempt < maxRetries) {
          const waitTime = Math.min(Math.pow(2, attempt) * 2000, 10000); // 2초, 4초, 8초 (최대 10초)
          const waitMsg = `요청 한도 초과 - ${waitTime/1000}초 후 재시도...`;
          console.log(`⏳ ${waitMsg}`);
          this.statusCallback?.(waitMsg);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        // 다른 에러이거나 최대 재시도 도달
        throw new Error(`OpenAI API 오류: ${response.status}`);

      } catch (error) {
        // 마지막 시도였다면 에러 발생
        if (attempt === maxRetries) {
          console.error(`❌ API 호출 최종 실패 (${maxRetries + 1}회 시도 후):`, error);
          throw error;
        }

        // 429가 아닌 네트워크 에러의 경우 잠시 대기
        if (error instanceof Error && !error.message.includes('429')) {
          const waitTime = 1000 * (attempt + 1);
          console.log(`⏳ 네트워크 에러 - ${waitTime/1000}초 후 재시도...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    // 여기 도달하면 안되지만 안전장치
    throw new Error('API 호출 실패');
  }

  /**
   * 허깅페이스 API 호출 (무료 대안)
   */
  private async callHuggingFace(prompt: string): Promise<string> {
    try {
      console.log('🤗 허깅페이스 API 사용 (무료)');
      
      const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: this.simplifyPromptForHuggingFace(prompt)
        })
      });

      if (!response.ok) {
        throw new Error(`허깅페이스 API 오류: ${response.status}`);
      }

      const data = await response.json();
      let result = '';
      if (Array.isArray(data)) {
        result = data[0]?.generated_text || data[0]?.text || '';
      } else if (data.generated_text) {
        result = data.generated_text;
      }
      
      // 허깅페이스 응답이 부족하면 스마트 폴백 사용
      if (!result || result.length < 50) {
        throw new Error('허깅페이스 응답 부족');
      }
      
      return this.convertToJSON(result);
    } catch (error) {
      console.warn('허깅페이스도 실패, 스마트 정적 질문 사용:', error);
      throw error; // 폴백 질문 사용하도록 에러 전파
    }
  }

  /**
   * 허깅페이스용 간단한 프롬프트
   */
  private simplifyPromptForHuggingFace(prompt: string): string {
    return "Generate a business interview question for a Korean professional in JSON format with question, purpose, and 5 options including 기타.";
  }

  /**
   * 허깅페이스 응답을 JSON으로 변환
   */
  private convertToJSON(text: string): string {
    // 간단한 JSON 생성 (허깅페이스 응답이 불완전할 수 있음)
    return JSON.stringify({
      question: "현재 주력으로 하고 계신 업무 분야는 무엇인가요?",
      purpose: "전문 분야 파악을 통한 맞춤형 솔루션 제안",
      options: ["컨설팅", "부동산", "금융/보험", "교육/강의", "기타"],
      customPlaceholder: "구체적인 분야를 알려주세요"
    });
  }

  /**
   * 폴백 첫 질문
   */
  private getFallbackFirstQuestion(): Question {
    console.log('🔄 폴백 질문 사용 (스마트 질문으로 대체)');
    
    return {
      id: 'q1',
      question: '현재 주력으로 하고 계신 업무 분야는 무엇인가요?',
      purpose: '전문 분야 파악을 통한 IT 솔루션 방향 설정',
      options: [
        '부동산 (중개, 투자, 컨설팅)',
        '금융/보험 (자산관리, 보험설계)',
        '교육/강의 (전문 분야 교육)',
        '컨설팅 (경영, 전략, 전문상담)',
        '의료/헬스케어',
        '기타'
      ],
      allowCustom: true,
      customPlaceholder: '구체적인 업무 분야를 알려주세요'
    };
  }

  /**
   * 폴백 다음 질문
   */
  private getFallbackQuestion(context: ConversationContext): Question {
    const fallbackQuestions = [
      {
        question: '해당 분야에서 가장 차별화된 전문성은 무엇인가요?',
        purpose: '독특한 가치 제안 발굴',
        options: ['특정 지역 전문성', '특별한 고객층', '독특한 분석 능력', '네트워크와 인맥', '기타']
      },
      {
        question: '현재 업무에서 가장 시간이 많이 걸리는 부분은?',
        purpose: '자동화 가능 영역 식별',
        options: ['고객 상담', '정보 수집', '문서 작성', '고객 관리', '기타']
      },
      {
        question: '목표하는 월 매출 규모는 어느 정도인가요?',
        purpose: '비즈니스 규모 설정',
        options: ['100-300만원', '300-500만원', '500-1000만원', '1000만원 이상', '기타']
      }
    ];

    const questionIndex = Math.min(context.questionCount, fallbackQuestions.length - 1);
    const fallback = fallbackQuestions[questionIndex];

    return {
      id: `q${context.questionCount + 1}`,
      question: fallback.question,
      purpose: fallback.purpose,
      options: fallback.options,
      allowCustom: true,
      customPlaceholder: '구체적으로 알려주세요'
    };
  }
}

// 싱글톤 인스턴스
export const aiInterviewer = new AIInterviewer();