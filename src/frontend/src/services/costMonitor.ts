// LLM 비용 모니터링 및 예산 관리 시스템
interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  estimatedCost: number;
  model: string;
  timestamp: number;
}

interface CostAlert {
  type: 'warning' | 'critical';
  message: string;
  currentCost: number;
  threshold: number;
}

export class CostMonitor {
  private dailyBudget: number;
  private monthlyBudget: number;
  private storageKey: string = 'llm_usage_stats';

  constructor(dailyBudget: number = 10, monthlyBudget: number = 300) {
    this.dailyBudget = dailyBudget; // USD
    this.monthlyBudget = monthlyBudget; // USD
  }

  /**
   * API 호출 비용 계산 및 기록
   */
  recordUsage(model: string, inputTokens: number, outputTokens: number): CostAlert | null {
    const cost = this.calculateCost(model, inputTokens, outputTokens);
    const stats = this.getUsageStats();
    
    // 오늘 사용량 업데이트
    const today = new Date().toDateString();
    if (!stats[today]) {
      stats[today] = {
        totalRequests: 0,
        totalTokens: 0,
        estimatedCost: 0,
        model: model,
        timestamp: Date.now()
      };
    }
    
    stats[today].totalRequests += 1;
    stats[today].totalTokens += inputTokens + outputTokens;
    stats[today].estimatedCost += cost;
    
    this.saveUsageStats(stats);
    
    // 예산 초과 확인
    return this.checkBudgetLimits(stats[today].estimatedCost);
  }

  /**
   * 모델별 토큰 비용 계산
   */
  private calculateCost(model: string, inputTokens: number, outputTokens: number): number {
    const pricing: { [key: string]: { input: number; output: number } } = {
      'gpt-4o': { input: 2.5 / 1000000, output: 10 / 1000000 }, // per token
      'gpt-4o-mini': { input: 0.15 / 1000000, output: 0.6 / 1000000 },
      'claude-3.5-sonnet': { input: 3 / 1000000, output: 15 / 1000000 }
    };

    const modelPricing = pricing[model] || pricing['gpt-4o-mini']; // fallback
    return (inputTokens * modelPricing.input) + (outputTokens * modelPricing.output);
  }

  /**
   * 예산 한도 확인
   */
  private checkBudgetLimits(dailyCost: number): CostAlert | null {
    if (dailyCost >= this.dailyBudget * 0.9) {
      return {
        type: 'critical',
        message: `일일 예산 90% 초과! 현재: $${dailyCost.toFixed(2)}, 한도: $${this.dailyBudget}`,
        currentCost: dailyCost,
        threshold: this.dailyBudget
      };
    } else if (dailyCost >= this.dailyBudget * 0.7) {
      return {
        type: 'warning',
        message: `일일 예산 70% 도달. 현재: $${dailyCost.toFixed(2)}, 한도: $${this.dailyBudget}`,
        currentCost: dailyCost,
        threshold: this.dailyBudget
      };
    }
    
    return null;
  }

  /**
   * 저장된 사용량 통계 조회
   */
  private getUsageStats(): { [date: string]: UsageStats } {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load usage stats:', error);
      return {};
    }
  }

  /**
   * 사용량 통계 저장
   */
  private saveUsageStats(stats: { [date: string]: UsageStats }): void {
    try {
      // 30일 이상된 데이터 정리
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const cleanedStats: { [date: string]: UsageStats } = {};
      
      Object.entries(stats).forEach(([date, data]) => {
        if (data.timestamp > thirtyDaysAgo) {
          cleanedStats[date] = data;
        }
      });
      
      localStorage.setItem(this.storageKey, JSON.stringify(cleanedStats));
    } catch (error) {
      console.error('Failed to save usage stats:', error);
    }
  }

  /**
   * 오늘 사용량 조회
   */
  getTodayUsage(): UsageStats | null {
    const stats = this.getUsageStats();
    const today = new Date().toDateString();
    return stats[today] || null;
  }

  /**
   * 월간 사용량 조회
   */
  getMonthlyUsage(): { cost: number; requests: number; tokens: number } {
    const stats = this.getUsageStats();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    let totalCost = 0;
    let totalRequests = 0;
    let totalTokens = 0;
    
    Object.entries(stats).forEach(([date, data]) => {
      const statDate = new Date(date);
      if (statDate.getMonth() === currentMonth && statDate.getFullYear() === currentYear) {
        totalCost += data.estimatedCost;
        totalRequests += data.totalRequests;
        totalTokens += data.totalTokens;
      }
    });
    
    return { cost: totalCost, requests: totalRequests, tokens: totalTokens };
  }

  /**
   * 예산 업데이트
   */
  updateBudgets(daily: number, monthly: number): void {
    this.dailyBudget = daily;
    this.monthlyBudget = monthly;
    console.log(`💰 Budget updated: Daily $${daily}, Monthly $${monthly}`);
  }

  /**
   * 비용 절약 추천
   */
  getSavingRecommendations(): string[] {
    const monthlyUsage = this.getMonthlyUsage();
    const recommendations: string[] = [];
    
    if (monthlyUsage.cost > this.monthlyBudget * 0.8) {
      recommendations.push('GPT-4o-mini로 일시 전환 권장');
      recommendations.push('캐싱 시스템 활성화 권장');
    }
    
    if (monthlyUsage.requests > 1000) {
      recommendations.push('결과 캐싱으로 중복 요청 방지');
    }
    
    return recommendations;
  }
}

// 싱글톤 인스턴스
export const costMonitor = new CostMonitor();