/**
 * Chapter 6: Economy & Balance - Financial Simulation
 * 재무 시뮬레이션 및 예측 시스템
 */

import {
  FinancialForecast,
  FinancialScenario,
  CashFlowStatus,
  FinancialSimulation,
} from './types';

// ============================================
// 기본 시나리오 정의
// ============================================

export const defaultScenarios: Omit<FinancialScenario, 'forecast'>[] = [
  {
    id: 'conservative',
    name: '보수적 시나리오',
    description: '낮은 성장률과 높은 비용 증가를 가정합니다.',
    assumptions: {
      userGrowthRate: 0.03,       // 월 3% 성장
      revenueGrowthRate: 0.04,    // 월 4% 수익 성장
      costGrowthRate: 0.05,       // 월 5% 비용 증가
      churnRate: 0.08,            // 8% 이탈률
      conversionRate: 0.03,       // 3% 전환율
    },
  },
  {
    id: 'base',
    name: '기본 시나리오',
    description: '현재 추세가 유지된다고 가정합니다.',
    assumptions: {
      userGrowthRate: 0.08,       // 월 8% 성장
      revenueGrowthRate: 0.10,    // 월 10% 수익 성장
      costGrowthRate: 0.06,       // 월 6% 비용 증가
      churnRate: 0.05,            // 5% 이탈률
      conversionRate: 0.05,       // 5% 전환율
    },
  },
  {
    id: 'optimistic',
    name: '낙관적 시나리오',
    description: '높은 성장률과 효율적인 비용 관리를 가정합니다.',
    assumptions: {
      userGrowthRate: 0.15,       // 월 15% 성장
      revenueGrowthRate: 0.18,    // 월 18% 수익 성장
      costGrowthRate: 0.04,       // 월 4% 비용 증가
      churnRate: 0.03,            // 3% 이탈률
      conversionRate: 0.08,       // 8% 전환율
    },
  },
  {
    id: 'viral',
    name: '바이럴 시나리오',
    description: '급격한 성장이 발생하는 경우를 가정합니다.',
    assumptions: {
      userGrowthRate: 0.30,       // 월 30% 성장
      revenueGrowthRate: 0.25,    // 월 25% 수익 성장
      costGrowthRate: 0.15,       // 월 15% 비용 증가 (스케일링)
      churnRate: 0.04,            // 4% 이탈률
      conversionRate: 0.06,       // 6% 전환율
    },
  },
  {
    id: 'crisis',
    name: '위기 시나리오',
    description: '시장 침체나 경쟁 심화 상황을 가정합니다.',
    assumptions: {
      userGrowthRate: -0.02,      // 월 2% 감소
      revenueGrowthRate: -0.03,   // 월 3% 수익 감소
      costGrowthRate: 0.02,       // 월 2% 비용 증가
      churnRate: 0.15,            // 15% 이탈률
      conversionRate: 0.02,       // 2% 전환율
    },
  },
];

// ============================================
// 재무 시뮬레이션 클래스
// ============================================

export interface CurrentFinancials {
  cash: number;
  users: number;
  monthlyRevenue: number;
  monthlyCosts: number;
  month: number;
  year: number;
}

export class FinancialSimulator {
  private scenarios: FinancialScenario[] = [];
  private historicalData: FinancialSimulation['historicalData'] = [];
  private currentCashFlow: CashFlowStatus;
  private activeScenario: string | null = null;

  constructor() {
    // 초기 캐시플로우 상태
    this.currentCashFlow = {
      current: 0,
      projected30Days: 0,
      projected90Days: 0,
      burnRate: 0,
      runway: Infinity,
      breakEvenPoint: null,
      isHealthy: true,
    };

    // 기본 시나리오 초기화
    this.initializeScenarios();
  }

  // 시나리오 초기화
  private initializeScenarios(): void {
    this.scenarios = defaultScenarios.map(s => ({
      ...s,
      forecast: [],
    }));
  }

  // 현재 재무 상태 업데이트
  updateCurrentFinancials(financials: CurrentFinancials): void {
    // 히스토리 기록
    this.historicalData.push({
      month: financials.month,
      year: financials.year,
      revenue: financials.monthlyRevenue,
      costs: financials.monthlyCosts,
      profit: financials.monthlyRevenue - financials.monthlyCosts,
      cash: financials.cash,
      users: financials.users,
    });

    // 최근 12개월만 유지
    if (this.historicalData.length > 12) {
      this.historicalData.shift();
    }

    // 캐시플로우 상태 업데이트
    this.updateCashFlowStatus(financials);

    // 모든 시나리오 재계산
    this.recalculateForecasts(financials);
  }

  // 캐시플로우 상태 업데이트
  private updateCashFlowStatus(financials: CurrentFinancials): void {
    const { cash, monthlyRevenue, monthlyCosts } = financials;
    const burnRate = Math.max(0, monthlyCosts - monthlyRevenue);
    const runway = burnRate > 0 ? Math.floor(cash / burnRate) : Infinity;

    // 30일/90일 예측
    const projected30Days = cash + (monthlyRevenue - monthlyCosts);
    const projected90Days = cash + (monthlyRevenue - monthlyCosts) * 3;

    // 손익분기점 계산
    let breakEvenPoint: number | null = null;
    if (monthlyRevenue < monthlyCosts) {
      // 현재 적자 상태 - 언제 흑자 전환할 수 있을지 계산
      const baseScenario = this.scenarios.find(s => s.id === 'base');
      if (baseScenario) {
        const { revenueGrowthRate, costGrowthRate } = baseScenario.assumptions;
        let projectedRevenue = monthlyRevenue;
        let projectedCosts = monthlyCosts;

        for (let m = 1; m <= 36; m++) {
          projectedRevenue *= (1 + revenueGrowthRate);
          projectedCosts *= (1 + costGrowthRate);
          if (projectedRevenue >= projectedCosts) {
            breakEvenPoint = m;
            break;
          }
        }
      }
    }

    this.currentCashFlow = {
      current: cash,
      projected30Days,
      projected90Days,
      burnRate,
      runway,
      breakEvenPoint,
      isHealthy: runway >= 6 && projected30Days > 0,
    };
  }

  // 예측 재계산
  private recalculateForecasts(financials: CurrentFinancials): void {
    for (const scenario of this.scenarios) {
      scenario.forecast = this.generateForecast(financials, scenario.assumptions, 12);
    }
  }

  // 예측 생성
  private generateForecast(
    current: CurrentFinancials,
    assumptions: FinancialScenario['assumptions'],
    months: number
  ): FinancialForecast[] {
    const forecasts: FinancialForecast[] = [];
    let { cash, users, monthlyRevenue, monthlyCosts, month, year } = current;

    for (let i = 1; i <= months; i++) {
      // 다음 달 계산
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }

      // 사용자 성장 (이탈 반영)
      const newUsers = Math.floor(users * assumptions.userGrowthRate);
      const churnedUsers = Math.floor(users * assumptions.churnRate);
      users = Math.max(0, users + newUsers - churnedUsers);

      // 수익 성장
      monthlyRevenue = Math.max(0, monthlyRevenue * (1 + assumptions.revenueGrowthRate));

      // 비용 성장
      monthlyCosts = monthlyCosts * (1 + assumptions.costGrowthRate);

      // 이익
      const profit = monthlyRevenue - monthlyCosts;

      // 현금 업데이트
      cash += profit;

      // 신뢰도 계산 (멀어질수록 낮아짐)
      const confidence = Math.max(0.3, 1 - (i * 0.05));

      forecasts.push({
        month,
        year,
        projectedRevenue: Math.round(monthlyRevenue),
        projectedCosts: Math.round(monthlyCosts),
        projectedProfit: Math.round(profit),
        projectedCash: Math.round(cash),
        projectedUsers: Math.round(users),
        confidence,
      });
    }

    return forecasts;
  }

  // 커스텀 시나리오 추가
  addCustomScenario(
    name: string,
    description: string,
    assumptions: FinancialScenario['assumptions']
  ): string {
    const id = `custom_${Date.now()}`;
    const scenario: FinancialScenario = {
      id,
      name,
      description,
      assumptions,
      forecast: [],
    };

    this.scenarios.push(scenario);
    return id;
  }

  // 시나리오 제거
  removeScenario(id: string): boolean {
    const index = this.scenarios.findIndex(s => s.id === id);
    if (index !== -1 && this.scenarios[index].id.startsWith('custom_')) {
      this.scenarios.splice(index, 1);
      if (this.activeScenario === id) {
        this.activeScenario = null;
      }
      return true;
    }
    return false;
  }

  // 활성 시나리오 설정
  setActiveScenario(id: string | null): void {
    if (id === null || this.scenarios.find(s => s.id === id)) {
      this.activeScenario = id;
    }
  }

  // 시나리오 비교
  compareScenarios(scenarioIds?: string[]): {
    scenarios: FinancialScenario[];
    comparison: {
      month: number;
      year: number;
      values: Record<string, {
        revenue: number;
        costs: number;
        profit: number;
        cash: number;
        users: number;
      }>;
    }[];
  } {
    const targetScenarios = scenarioIds
      ? this.scenarios.filter(s => scenarioIds.includes(s.id))
      : this.scenarios;

    const comparison: {
      month: number;
      year: number;
      values: Record<string, any>;
    }[] = [];

    // 가장 긴 예측 기간 찾기
    const maxLength = Math.max(...targetScenarios.map(s => s.forecast.length));

    for (let i = 0; i < maxLength; i++) {
      const values: Record<string, any> = {};

      for (const scenario of targetScenarios) {
        const forecast = scenario.forecast[i];
        if (forecast) {
          values[scenario.id] = {
            revenue: forecast.projectedRevenue,
            costs: forecast.projectedCosts,
            profit: forecast.projectedProfit,
            cash: forecast.projectedCash,
            users: forecast.projectedUsers,
          };
        }
      }

      if (Object.keys(values).length > 0) {
        const firstForecast = targetScenarios[0]?.forecast[i];
        comparison.push({
          month: firstForecast?.month || 0,
          year: firstForecast?.year || 0,
          values,
        });
      }
    }

    return {
      scenarios: targetScenarios,
      comparison,
    };
  }

  // 민감도 분석
  runSensitivityAnalysis(
    current: CurrentFinancials,
    variable: keyof FinancialScenario['assumptions'],
    range: { min: number; max: number; steps: number }
  ): {
    variable: string;
    values: number[];
    results: {
      value: number;
      month12Cash: number;
      month12Revenue: number;
      breakEvenMonth: number | null;
    }[];
  } {
    const baseScenario = this.scenarios.find(s => s.id === 'base')!;
    const stepSize = (range.max - range.min) / range.steps;
    const results: {
      value: number;
      month12Cash: number;
      month12Revenue: number;
      breakEvenMonth: number | null;
    }[] = [];
    const values: number[] = [];

    for (let i = 0; i <= range.steps; i++) {
      const value = range.min + (stepSize * i);
      values.push(value);

      const modifiedAssumptions = {
        ...baseScenario.assumptions,
        [variable]: value,
      };

      const forecast = this.generateForecast(current, modifiedAssumptions, 12);
      const month12 = forecast[11];

      // 손익분기점 찾기
      let breakEvenMonth: number | null = null;
      for (let j = 0; j < forecast.length; j++) {
        if (forecast[j].projectedProfit > 0) {
          breakEvenMonth = j + 1;
          break;
        }
      }

      results.push({
        value,
        month12Cash: month12?.projectedCash || 0,
        month12Revenue: month12?.projectedRevenue || 0,
        breakEvenMonth,
      });
    }

    return {
      variable,
      values,
      results,
    };
  }

  // 재무 건전성 평가
  assessFinancialHealth(): {
    overall: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    score: number;
    factors: {
      factor: string;
      status: 'positive' | 'neutral' | 'negative';
      value: string;
      suggestion?: string;
    }[];
  } {
    const factors: {
      factor: string;
      status: 'positive' | 'neutral' | 'negative';
      value: string;
      suggestion?: string;
    }[] = [];

    let score = 50;  // 기본 점수

    // 런웨이 평가
    if (this.currentCashFlow.runway >= 18) {
      factors.push({
        factor: '런웨이',
        status: 'positive',
        value: `${this.currentCashFlow.runway}개월`,
      });
      score += 20;
    } else if (this.currentCashFlow.runway >= 12) {
      factors.push({
        factor: '런웨이',
        status: 'neutral',
        value: `${this.currentCashFlow.runway}개월`,
      });
      score += 10;
    } else if (this.currentCashFlow.runway >= 6) {
      factors.push({
        factor: '런웨이',
        status: 'negative',
        value: `${this.currentCashFlow.runway}개월`,
        suggestion: '비용 절감 또는 추가 자금 확보 필요',
      });
      score -= 10;
    } else {
      factors.push({
        factor: '런웨이',
        status: 'negative',
        value: `${this.currentCashFlow.runway}개월`,
        suggestion: '긴급 자금 조달 필요',
      });
      score -= 30;
    }

    // 수익성 평가
    if (this.historicalData.length > 0) {
      const recent = this.historicalData[this.historicalData.length - 1];
      const profitMargin = recent.revenue > 0
        ? (recent.profit / recent.revenue) * 100
        : -100;

      if (profitMargin >= 20) {
        factors.push({
          factor: '수익성',
          status: 'positive',
          value: `이익률 ${profitMargin.toFixed(1)}%`,
        });
        score += 15;
      } else if (profitMargin >= 0) {
        factors.push({
          factor: '수익성',
          status: 'neutral',
          value: `이익률 ${profitMargin.toFixed(1)}%`,
        });
        score += 5;
      } else {
        factors.push({
          factor: '수익성',
          status: 'negative',
          value: `손실률 ${Math.abs(profitMargin).toFixed(1)}%`,
          suggestion: '수익 증대 또는 비용 절감 필요',
        });
        score -= 15;
      }

      // 성장성 평가
      if (this.historicalData.length >= 3) {
        const recent3 = this.historicalData.slice(-3);
        const revenueGrowth = recent3[0].revenue > 0
          ? ((recent3[2].revenue - recent3[0].revenue) / recent3[0].revenue) * 100
          : 0;

        if (revenueGrowth >= 30) {
          factors.push({
            factor: '성장성',
            status: 'positive',
            value: `3개월 수익 성장 ${revenueGrowth.toFixed(1)}%`,
          });
          score += 15;
        } else if (revenueGrowth >= 0) {
          factors.push({
            factor: '성장성',
            status: 'neutral',
            value: `3개월 수익 성장 ${revenueGrowth.toFixed(1)}%`,
          });
          score += 5;
        } else {
          factors.push({
            factor: '성장성',
            status: 'negative',
            value: `3개월 수익 감소 ${Math.abs(revenueGrowth).toFixed(1)}%`,
            suggestion: '마케팅 강화 또는 제품 개선 필요',
          });
          score -= 15;
        }
      }
    }

    // 현금 보유량 평가
    const cashThreshold = 10000000;  // 1천만원 기준
    if (this.currentCashFlow.current >= cashThreshold * 5) {
      factors.push({
        factor: '현금 보유',
        status: 'positive',
        value: `${(this.currentCashFlow.current / 10000).toFixed(0)}만원`,
      });
      score += 10;
    } else if (this.currentCashFlow.current >= cashThreshold) {
      factors.push({
        factor: '현금 보유',
        status: 'neutral',
        value: `${(this.currentCashFlow.current / 10000).toFixed(0)}만원`,
      });
    } else {
      factors.push({
        factor: '현금 보유',
        status: 'negative',
        value: `${(this.currentCashFlow.current / 10000).toFixed(0)}만원`,
        suggestion: '긴급 자금 확보 필요',
      });
      score -= 20;
    }

    // 종합 평가
    score = Math.max(0, Math.min(100, score));
    let overall: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';

    if (score >= 80) {
      overall = 'excellent';
    } else if (score >= 60) {
      overall = 'good';
    } else if (score >= 40) {
      overall = 'fair';
    } else if (score >= 20) {
      overall = 'poor';
    } else {
      overall = 'critical';
    }

    return { overall, score, factors };
  }

  // 시스템 상태 조회
  getSystem(): FinancialSimulation {
    return {
      currentCashFlow: { ...this.currentCashFlow },
      scenarios: this.scenarios.map(s => ({
        ...s,
        forecast: [...s.forecast],
      })),
      activeScenario: this.activeScenario,
      historicalData: [...this.historicalData],
    };
  }

  // 특정 시나리오 조회
  getScenario(id: string): FinancialScenario | undefined {
    return this.scenarios.find(s => s.id === id);
  }

  // 활성 시나리오 예측 조회
  getActiveForecast(): FinancialForecast[] {
    if (!this.activeScenario) {
      const baseScenario = this.scenarios.find(s => s.id === 'base');
      return baseScenario?.forecast || [];
    }

    const active = this.scenarios.find(s => s.id === this.activeScenario);
    return active?.forecast || [];
  }

  // 캐시플로우 상태 조회
  getCashFlowStatus(): CashFlowStatus {
    return { ...this.currentCashFlow };
  }

  // 히스토리 조회
  getHistoricalData(): FinancialSimulation['historicalData'] {
    return [...this.historicalData];
  }

  // 리셋
  reset(): void {
    this.historicalData = [];
    this.activeScenario = null;
    this.currentCashFlow = {
      current: 0,
      projected30Days: 0,
      projected90Days: 0,
      burnRate: 0,
      runway: Infinity,
      breakEvenPoint: null,
      isHealthy: true,
    };
    this.initializeScenarios();
  }
}

// ============================================
// 유틸리티 함수
// ============================================

export function formatCurrency(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  } else if (amount >= 10000) {
    return `${Math.round(amount / 10000)}만원`;
  } else if (amount < 0) {
    return `-${formatCurrency(Math.abs(amount))}`;
  }
  return `${amount.toLocaleString()}원`;
}

export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getHealthStatusColor(
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
): string {
  const colors = {
    excellent: '#22c55e',
    good: '#84cc16',
    fair: '#eab308',
    poor: '#f97316',
    critical: '#ef4444',
  };
  return colors[status];
}

export function getHealthStatusIcon(
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
): string {
  const icons = {
    excellent: '💪',
    good: '👍',
    fair: '😐',
    poor: '😟',
    critical: '🆘',
  };
  return icons[status];
}

// 싱글톤 인스턴스
export const financialSimulator = new FinancialSimulator();

export default FinancialSimulator;
