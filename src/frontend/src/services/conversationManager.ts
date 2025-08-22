// 대화 상태 관리 및 인터뷰 플로우 제어
import { aiInterviewer } from './aiInterviewer';

interface Question {
  id: string;
  question: string;
  purpose: string;
  options: string[];
  allowCustom: boolean;
  customPlaceholder?: string;
}

interface Answer {
  questionId: string;
  selectedOption?: string;
  customAnswer?: string;
  finalAnswer: string;
  timestamp: number;
}

interface ConversationState {
  isActive: boolean;
  currentQuestion: Question | null;
  answers: Answer[];
  questionCount: number;
  isComplete: boolean;
  startTime: number;
}

export class ConversationManager {
  private state: ConversationState;
  private listeners: Array<(state: ConversationState) => void> = [];
  private statusCallback?: (message: string) => void;

  constructor() {
    this.state = {
      isActive: false,
      currentQuestion: null,
      answers: [],
      questionCount: 0,
      isComplete: false,
      startTime: 0
    };
  }

  /**
   * 상태 메시지 콜백 등록
   */
  setStatusCallback(callback: (message: string) => void) {
    this.statusCallback = callback;
    aiInterviewer.setStatusCallback(callback);
  }

  /**
   * 인터뷰 시작
   */
  async startInterview(): Promise<void> {
    console.log('🎯 AI 맞춤형 인터뷰 시작');
    
    this.state = {
      isActive: true,
      currentQuestion: null,
      answers: [],
      questionCount: 0,
      isComplete: false,
      startTime: Date.now()
    };

    try {
      // AI가 첫 질문 생성
      const firstQuestion = await aiInterviewer.generateFirstQuestion();
      this.state.currentQuestion = firstQuestion;
      this.state.questionCount = 1;
      
      console.log('✅ 첫 질문 생성 완료:', firstQuestion.question);
      this.notifyListeners();
    } catch (error) {
      console.error('❌ 인터뷰 시작 실패:', error);
      throw new Error('인터뷰를 시작할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  /**
   * 답변 제출 및 다음 질문 생성
   */
  async submitAnswer(selectedOption?: string, customAnswer?: string): Promise<void> {
    if (!this.state.currentQuestion) {
      throw new Error('현재 질문이 없습니다.');
    }

    // 최종 답변 결정
    let finalAnswer: string;
    if (selectedOption === '기타' && customAnswer) {
      finalAnswer = customAnswer;
    } else if (selectedOption) {
      finalAnswer = selectedOption;
    } else {
      throw new Error('답변을 선택해주세요.');
    }

    // 답변 저장
    const answer: Answer = {
      questionId: this.state.currentQuestion.id,
      selectedOption,
      customAnswer,
      finalAnswer,
      timestamp: Date.now()
    };

    this.state.answers.push(answer);
    console.log(`📝 답변 저장: ${this.state.currentQuestion.question} → ${finalAnswer}`);

    try {
      // 다음 질문 생성
      const context = this.buildContext();
      const nextQuestion = await aiInterviewer.generateNextQuestion(context);

      if (nextQuestion) {
        this.state.currentQuestion = nextQuestion;
        this.state.questionCount++;
        console.log(`🎯 다음 질문 생성 (${this.state.questionCount}개째):`, nextQuestion.question);
      } else {
        // 인터뷰 완료
        this.state.currentQuestion = null;
        this.state.isComplete = true;
        this.state.isActive = false;
        
        const duration = (Date.now() - this.state.startTime) / 1000;
        console.log(`✅ 인터뷰 완료! (${this.state.questionCount}개 질문, ${duration.toFixed(1)}초 소요)`);
      }

      this.notifyListeners();
    } catch (error) {
      console.error('❌ 다음 질문 생성 실패:', error);
      throw new Error('다음 질문을 생성할 수 없습니다. 잠시 후 다시 시도해주세요.');
    }
  }

  /**
   * 이전 질문으로 돌아가기
   */
  goToPreviousQuestion(): void {
    if (this.state.answers.length === 0) {
      return;
    }

    // 마지막 답변 제거
    this.state.answers.pop();
    this.state.questionCount--;

    // 이전 질문 복원 (실제로는 AI가 다시 생성해야 함)
    console.log('⬅️ 이전 질문으로 돌아가기');
    this.notifyListeners();
  }

  /**
   * 인터뷰 중단
   */
  stopInterview(): void {
    this.state.isActive = false;
    this.state.currentQuestion = null;
    console.log('⏹️ 인터뷰 중단');
    this.notifyListeners();
  }

  /**
   * 현재 상태 조회
   */
  getState(): ConversationState {
    return { ...this.state };
  }

  /**
   * 답변 데이터 조회 (분석용)
   */
  getAnswersForAnalysis(): Record<string, string> {
    const result: Record<string, string> = {};
    
    this.state.answers.forEach((answer, index) => {
      result[`q${index + 1}`] = answer.finalAnswer;
      result[`q${index + 1}_question`] = answer.questionId;
    });

    return result;
  }

  /**
   * 진행률 계산
   */
  getProgress(): { current: number; estimated: number; percentage: number } {
    const current = this.state.questionCount;
    const estimated = Math.max(6, Math.min(8, current + 2)); // 동적 예상 총 질문수
    const percentage = Math.min(100, (current / estimated) * 100);

    return { current, estimated, percentage };
  }

  /**
   * 상태 변경 리스너 등록
   */
  addListener(listener: (state: ConversationState) => void): void {
    this.listeners.push(listener);
  }

  /**
   * 상태 변경 리스너 제거
   */
  removeListener(listener: (state: ConversationState) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * 컨텍스트 구성 (AI 질문 생성용)
   */
  private buildContext() {
    const answers: Record<string, string> = {};
    this.state.answers.forEach((answer, index) => {
      answers[`질문${index + 1}`] = answer.finalAnswer;
    });

    return {
      answers,
      questionCount: this.state.questionCount,
      currentFocus: this.inferCurrentFocus(),
      industry: this.inferIndustry(),
      expertise: this.inferExpertise(),
      businessGoal: this.inferBusinessGoal()
    };
  }

  /**
   * 현재 포커스 추론
   */
  private inferCurrentFocus(): string {
    const answerCount = this.state.answers.length;
    
    if (answerCount <= 2) return '전문성 파악';
    if (answerCount <= 4) return '비즈니스 방향성';
    if (answerCount <= 6) return '실행 계획';
    return '최종 확인';
  }

  /**
   * 업계 추론
   */
  private inferIndustry(): string | undefined {
    const firstAnswer = this.state.answers[0]?.finalAnswer || '';
    
    if (firstAnswer.includes('부동산')) return '부동산';
    if (firstAnswer.includes('금융') || firstAnswer.includes('보험')) return '금융';
    if (firstAnswer.includes('교육') || firstAnswer.includes('강의')) return '교육';
    if (firstAnswer.includes('컨설팅')) return '컨설팅';
    
    return undefined;
  }

  /**
   * 전문성 추론
   */
  private inferExpertise(): string | undefined {
    return this.state.answers.find(a => 
      a.finalAnswer.includes('전문') || 
      a.finalAnswer.includes('특화') ||
      a.finalAnswer.includes('경력')
    )?.finalAnswer;
  }

  /**
   * 비즈니스 목표 추론
   */
  private inferBusinessGoal(): string | undefined {
    return this.state.answers.find(a => 
      a.finalAnswer.includes('매출') || 
      a.finalAnswer.includes('수익') ||
      a.finalAnswer.includes('고객')
    )?.finalAnswer;
  }

  /**
   * 리스너들에게 상태 변경 알림
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getState()));
  }
}

// 싱글톤 인스턴스
export const conversationManager = new ConversationManager();