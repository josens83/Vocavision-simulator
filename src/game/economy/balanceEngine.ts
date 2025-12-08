/**
 * Chapter 6: Economy & Balance - Balance Engine
 * 밸런스 테스팅 및 시뮬레이션 엔진
 */

import {
  DifficultyLevel,
  SimulationResult,
  BalanceMetrics,
  BalanceWarning,
  BalanceTestingSystem,
} from './types';
import { ResourceManager, initialResourceSystem } from './resources';
import { RevenueCalculator, UserDistribution } from './revenue';
import { CostCalculator } from './costs';
import { DifficultyManager, difficultyPresets } from './difficulty';
import { ProgressionManager } from './progression';

// ============================================
// 시뮬레이션 설정
// ============================================

export interface SimulationConfig {
  difficulty: DifficultyLevel;
  maxMonths: number;
  seed?: number;
  verbose?: boolean;
}

// ============================================
// 밸런스 엔진 클래스
// ============================================

export class BalanceEngine {
  private simulations: SimulationResult[] = [];
  private metrics: Partial<Record<DifficultyLevel, BalanceMetrics>> = {};
  private warnings: BalanceWarning[] = [];
  private lastTestRun: Date | null = null;

  // 간단한 난수 생성기 (시드 기반)
  private createRNG(seed: number): () => number {
    let s = seed;
    return () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  }

  // 단일 게임 시뮬레이션
  runSimulation(config: SimulationConfig): SimulationResult {
    const { difficulty, maxMonths, seed = Date.now(), verbose = false } = config;
    const startTime = Date.now();

    // 난수 생성기
    const random = this.createRNG(seed);

    // 난이도 매니저
    const difficultyManager = new DifficultyManager(difficulty);
    const settings = difficultyManager.getSettings();

    // 자원 매니저
    const resources = new ResourceManager();
    resources.applyChange({
      resource: 'cash',
      amount: settings.startingCash,
      type: 'absolute',
    });
    resources.applyChange({
      resource: 'users',
      amount: settings.startingUsers,
      type: 'absolute',
    });

    // 계산기들
    const revenueCalc = new RevenueCalculator();
    const costCalc = new CostCalculator();
    const progression = new ProgressionManager();

    // 시뮬레이션 상태
    let currentMonth = 0;
    let outcome: 'success' | 'failure' | 'stagnation' = 'stagnation';
    let failureReason: string | undefined;

    // 사용자 분포
    let userDistribution: UserDistribution = {
      free: settings.startingUsers,
      basic: 0,
      premium: 0,
      enterprise: 0,
    };

    // 월별 데이터
    const monthlyData: SimulationResult['monthlyData'] = [];

    // 추적 변수
    let peakUsers = settings.startingUsers;
    let peakRevenue = 0;
    let stagnationMonths = 0;
    let previousUsers = settings.startingUsers;

    // 시뮬레이션 루프
    while (currentMonth < maxMonths) {
      currentMonth++;

      const currentResources = resources.getResources();
      const totalUsers = Object.values(userDistribution).reduce((a, b) => a + b, 0);

      // 사용자 성장 시뮬레이션
      const baseGrowthRate = 0.05 + (random() * 0.1);  // 5-15% 기본 성장
      const contentQualityBonus = currentResources.secondary.contentQuality / 200;
      const reputationBonus = currentResources.primary.reputation / 200;
      const marketingBonus = random() * 0.05;

      const growthRate = (baseGrowthRate + contentQualityBonus + reputationBonus + marketingBonus)
        * settings.conversionRateMultiplier;

      const newUsers = Math.floor(totalUsers * growthRate + random() * 50);

      // 이탈 계산
      const churnedUsers = Math.floor(
        totalUsers * 0.05 * settings.churnRateMultiplier * (1 + random() * 0.5)
      );

      // 새 분포 계산
      userDistribution = revenueCalc.predictUserDistribution(
        userDistribution,
        Math.max(0, newUsers - churnedUsers),
        currentResources.secondary.contentQuality,
        currentResources.primary.reputation
      );

      const newTotalUsers = Object.values(userDistribution).reduce((a, b) => a + b, 0);

      // 수익 계산
      const revenue = revenueCalc.calculateMonthlyRevenue(userDistribution, []);
      const monthlyRevenue = Math.round(revenue.total * settings.revenueMultiplier);

      // 비용 계산
      const costs = costCalc.calculateMonthlyCosts({
        users: newTotalUsers,
        monthlyRevenue,
        apiCalls: newTotalUsers * 100,
        aiRequests: newTotalUsers * 5,
        dataTransferGB: newTotalUsers * 0.1,
        supportTickets: Math.floor(newTotalUsers * 0.01),
        newContent: Math.floor(random() * 3),
        freelanceHours: Math.floor(random() * 10),
      });
      const monthlyCosts = Math.round(costs.total * settings.costMultiplier);

      // 돌발 비용
      let occasionalCost = 0;
      if (random() < 0.1 * settings.occasionalCostFrequency) {
        occasionalCost = Math.floor(500000 + random() * 2000000);
      }

      // 현금 업데이트
      const netCashFlow = monthlyRevenue - monthlyCosts - occasionalCost;
      resources.applyChange({
        resource: 'cash',
        amount: netCashFlow,
        type: 'relative',
      });

      // 사용자 수 업데이트
      resources.applyChange({
        resource: 'users',
        amount: newTotalUsers,
        type: 'absolute',
      });

      // 품질 변화 (랜덤)
      resources.applyChange({
        resource: 'contentQuality',
        amount: (random() - 0.4) * 5,
        type: 'relative',
      });

      // 평판 변화
      resources.applyChange({
        resource: 'reputation',
        amount: (newTotalUsers > previousUsers ? 1 : -1) * (1 + random()),
        type: 'relative',
      });

      // 이벤트 발생
      const events: string[] = [];
      if (random() < 0.2 * settings.negativeEventFrequency) {
        events.push('negative_event');
        resources.applyChange({
          resource: 'cash',
          amount: -Math.floor(1000000 * settings.eventSeverity * random()),
          type: 'relative',
        });
      }
      if (random() < 0.15 * settings.positiveEventFrequency) {
        events.push('positive_event');
        resources.applyChange({
          resource: 'users',
          amount: Math.floor(100 * random()),
          type: 'relative',
        });
      }

      // 데이터 기록
      const currentCash = resources.getResource('cash');
      monthlyData.push({
        month: currentMonth,
        users: newTotalUsers,
        revenue: monthlyRevenue,
        costs: monthlyCosts + occasionalCost,
        cash: currentCash,
        events,
      });

      // 피크 업데이트
      if (newTotalUsers > peakUsers) peakUsers = newTotalUsers;
      if (monthlyRevenue > peakRevenue) peakRevenue = monthlyRevenue;

      // 정체 체크
      if (newTotalUsers <= previousUsers * 1.01) {
        stagnationMonths++;
      } else {
        stagnationMonths = 0;
      }
      previousUsers = newTotalUsers;

      // 종료 조건 체크
      if (currentCash < 0) {
        outcome = 'failure';
        failureReason = '현금 고갈 (파산)';
        break;
      }

      if (stagnationMonths >= 6) {
        outcome = 'stagnation';
        failureReason = '6개월 연속 성장 정체';
        break;
      }

      // 성공 조건 체크
      if (newTotalUsers >= 100000 && currentCash >= 1000000000) {
        outcome = 'success';
        break;
      }

      if (verbose && currentMonth % 6 === 0) {
        console.log(`Month ${currentMonth}: Users=${newTotalUsers}, Cash=${currentCash}, Revenue=${monthlyRevenue}`);
      }
    }

    // 최종 결과가 없으면 정체로 판정
    if (outcome === 'stagnation' && !failureReason) {
      const finalUsers = resources.getResource('users');
      if (finalUsers < 1000) {
        outcome = 'failure';
        failureReason = '성장 실패';
      } else if (finalUsers >= 50000) {
        outcome = 'success';
      }
    }

    const result: SimulationResult = {
      id: `sim_${seed}_${difficulty}`,
      difficulty,
      seed,
      monthsPlayed: currentMonth,
      finalUsers: resources.getResource('users'),
      finalCash: resources.getResource('cash'),
      finalRevenue: monthlyData.length > 0 ? monthlyData[monthlyData.length - 1].revenue : 0,
      peakUsers,
      peakRevenue,
      outcome,
      failureReason,
      monthlyData,
      runTime: Date.now() - startTime,
      timestamp: new Date(),
    };

    this.simulations.push(result);
    return result;
  }

  // 배치 시뮬레이션 실행
  runBatchSimulations(
    difficulty: DifficultyLevel,
    count: number = 100,
    maxMonths: number = 48
  ): BalanceMetrics {
    const results: SimulationResult[] = [];

    for (let i = 0; i < count; i++) {
      const result = this.runSimulation({
        difficulty,
        maxMonths,
        seed: Date.now() + i * 1000,
        verbose: false,
      });
      results.push(result);
    }

    // 메트릭 계산
    const successCount = results.filter(r => r.outcome === 'success').length;
    const playtimes = results.map(r => r.monthsPlayed);
    const finalCashes = results.map(r => r.finalCash);
    const finalUsers = results.map(r => r.finalUsers);
    const revenues = results.map(r => r.finalRevenue);

    // 실패 원인 분석
    const failureReasons = results
      .filter(r => r.failureReason)
      .map(r => r.failureReason!);
    const failureCounts = failureReasons.reduce((acc, reason) => {
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const mostCommonFailure = Object.entries(failureCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // 병목 구간 분석
    const bottleneckPoints: number[] = [];
    const monthlyFailures = results
      .filter(r => r.outcome === 'failure')
      .map(r => r.monthsPlayed);
    const monthCounts = monthlyFailures.reduce((acc, month) => {
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    Object.entries(monthCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .forEach(([month]) => bottleneckPoints.push(parseInt(month)));

    // 점수 계산
    const economyScore = Math.min(100, (this.average(finalCashes) / 100000000) * 50 + successCount);
    const progressionScore = Math.min(100, (this.average(playtimes) / maxMonths) * 100);
    const engagementScore = Math.min(100, (successCount / count) * 100 + (1 - this.variance(playtimes) / maxMonths) * 20);
    const overallScore = (economyScore + progressionScore + engagementScore) / 3;

    const metrics: BalanceMetrics = {
      difficulty,
      sampleSize: count,
      successRate: successCount / count,
      averagePlaytime: this.average(playtimes),
      medianPlaytime: this.median(playtimes),
      averageFinalCash: this.average(finalCashes),
      averageFinalUsers: this.average(finalUsers),
      averageMonthlyRevenue: this.average(revenues),
      revenueVariance: this.variance(revenues),
      averageEventsPerGame: results.reduce((sum, r) =>
        sum + r.monthlyData.reduce((s, m) => s + m.events.length, 0), 0) / count,
      mostCommonFailure,
      bottleneckPoints,
      overallScore,
      economyScore,
      progressionScore,
      engagementScore,
    };

    this.metrics[difficulty] = metrics;
    return metrics;
  }

  // 전체 밸런스 테스트
  runFullBalanceTest(): BalanceTestingSystem {
    this.lastTestRun = new Date();
    this.warnings = [];

    const difficulties: DifficultyLevel[] = ['story', 'easy', 'normal', 'hard', 'realistic'];

    for (const difficulty of difficulties) {
      const metrics = this.runBatchSimulations(difficulty, 50, 48);
      this.analyzeMetrics(difficulty, metrics);
    }

    return this.getSystem();
  }

  // 메트릭 분석 및 경고 생성
  private analyzeMetrics(difficulty: DifficultyLevel, metrics: BalanceMetrics): void {
    // 성공률 체크
    const targetSuccessRates: Record<DifficultyLevel, [number, number]> = {
      story: [0.9, 1.0],
      easy: [0.7, 0.9],
      normal: [0.4, 0.7],
      hard: [0.2, 0.5],
      realistic: [0.05, 0.3],
    };

    const [minRate, maxRate] = targetSuccessRates[difficulty];

    if (metrics.successRate < minRate) {
      this.warnings.push({
        type: 'warning',
        category: 'success_rate',
        message: `${difficulty} 모드의 성공률(${(metrics.successRate * 100).toFixed(1)}%)이 목표(${minRate * 100}%)보다 낮습니다.`,
        affectedDifficulty: [difficulty],
        suggestion: '초기 자원을 늘리거나 비용을 줄이는 것을 고려하세요.',
      });
    }

    if (metrics.successRate > maxRate) {
      this.warnings.push({
        type: 'info',
        category: 'success_rate',
        message: `${difficulty} 모드의 성공률(${(metrics.successRate * 100).toFixed(1)}%)이 목표(${maxRate * 100}%)보다 높습니다.`,
        affectedDifficulty: [difficulty],
        suggestion: '난이도를 약간 높이는 것을 고려하세요.',
      });
    }

    // 플레이타임 체크
    if (metrics.averagePlaytime < 6) {
      this.warnings.push({
        type: 'critical',
        category: 'playtime',
        message: `${difficulty} 모드의 평균 플레이타임(${metrics.averagePlaytime.toFixed(1)}개월)이 너무 짧습니다.`,
        affectedDifficulty: [difficulty],
        suggestion: '초기 현금 부족이나 너무 빠른 비용 증가가 원인일 수 있습니다.',
      });
    }

    // 병목 구간 체크
    if (metrics.bottleneckPoints.length > 0 && metrics.bottleneckPoints[0] < 6) {
      this.warnings.push({
        type: 'warning',
        category: 'bottleneck',
        message: `${difficulty} 모드에서 초반(${metrics.bottleneckPoints[0]}개월)에 많은 실패가 발생합니다.`,
        affectedDifficulty: [difficulty],
        suggestion: '초기 단계의 비용을 낮추거나 수익 구조를 개선하세요.',
      });
    }

    // 경제 밸런스 체크
    if (metrics.economyScore < 40) {
      this.warnings.push({
        type: 'critical',
        category: 'economy',
        message: `${difficulty} 모드의 경제 밸런스 점수(${metrics.economyScore.toFixed(0)})가 낮습니다.`,
        affectedDifficulty: [difficulty],
        suggestion: '수익과 비용 구조를 재검토하세요.',
      });
    }
  }

  // 유틸리티: 평균
  private average(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  // 유틸리티: 중앙값
  private median(arr: number[]): number {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  // 유틸리티: 분산
  private variance(arr: number[]): number {
    if (arr.length === 0) return 0;
    const avg = this.average(arr);
    return arr.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / arr.length;
  }

  // 시스템 상태 조회
  getSystem(): BalanceTestingSystem {
    return {
      simulations: this.simulations.slice(-100),  // 최근 100개만
      metrics: this.metrics as Record<DifficultyLevel, BalanceMetrics>,
      warnings: this.warnings,
      lastTestRun: this.lastTestRun,
      autoTestEnabled: false,
    };
  }

  // 특정 난이도 메트릭 조회
  getMetrics(difficulty: DifficultyLevel): BalanceMetrics | undefined {
    return this.metrics[difficulty];
  }

  // 경고 조회
  getWarnings(): BalanceWarning[] {
    return [...this.warnings];
  }

  // 시뮬레이션 결과 조회
  getSimulations(limit?: number): SimulationResult[] {
    if (limit) {
      return this.simulations.slice(-limit);
    }
    return [...this.simulations];
  }

  // 밸런스 리포트 생성
  generateBalanceReport(): string {
    let report = '# VocaVision 밸런스 리포트\n\n';
    report += `생성 시간: ${new Date().toLocaleString()}\n\n`;

    // 난이도별 요약
    report += '## 난이도별 요약\n\n';
    report += '| 난이도 | 성공률 | 평균 플레이타임 | 경제 점수 | 종합 점수 |\n';
    report += '|--------|--------|-----------------|-----------|----------|\n';

    const difficulties: DifficultyLevel[] = ['story', 'easy', 'normal', 'hard', 'realistic'];
    for (const diff of difficulties) {
      const m = this.metrics[diff];
      if (m) {
        report += `| ${diff} | ${(m.successRate * 100).toFixed(1)}% | ${m.averagePlaytime.toFixed(1)}개월 | ${m.economyScore.toFixed(0)} | ${m.overallScore.toFixed(0)} |\n`;
      }
    }

    // 경고
    if (this.warnings.length > 0) {
      report += '\n## 밸런스 경고\n\n';
      for (const warning of this.warnings) {
        const icon = warning.type === 'critical' ? '🔴' : warning.type === 'warning' ? '🟡' : '🔵';
        report += `${icon} **${warning.category}**: ${warning.message}\n`;
        report += `   - 제안: ${warning.suggestion}\n\n`;
      }
    }

    // 주요 병목 구간
    report += '## 주요 병목 구간\n\n';
    for (const diff of difficulties) {
      const m = this.metrics[diff];
      if (m && m.bottleneckPoints.length > 0) {
        report += `- ${diff}: ${m.bottleneckPoints.join(', ')}개월\n`;
      }
    }

    return report;
  }

  // 리셋
  reset(): void {
    this.simulations = [];
    this.metrics = {};
    this.warnings = [];
    this.lastTestRun = null;
  }
}

// ============================================
// 빠른 밸런스 체크 유틸리티
// ============================================

export function quickBalanceCheck(difficulty: DifficultyLevel): {
  isBalanced: boolean;
  issues: string[];
} {
  const engine = new BalanceEngine();
  const metrics = engine.runBatchSimulations(difficulty, 20, 24);
  const issues: string[] = [];

  // 성공률 체크
  const targetRates: Record<DifficultyLevel, number> = {
    story: 0.9,
    easy: 0.7,
    normal: 0.5,
    hard: 0.3,
    realistic: 0.1,
  };

  if (Math.abs(metrics.successRate - targetRates[difficulty]) > 0.2) {
    issues.push(`성공률이 목표(${targetRates[difficulty] * 100}%)와 ${Math.abs(metrics.successRate - targetRates[difficulty]) * 100}% 차이`);
  }

  // 플레이타임 체크
  if (metrics.averagePlaytime < 6) {
    issues.push('평균 플레이타임이 6개월 미만');
  }

  // 경제 점수 체크
  if (metrics.economyScore < 40) {
    issues.push('경제 밸런스 점수가 40 미만');
  }

  return {
    isBalanced: issues.length === 0,
    issues,
  };
}

// 싱글톤 인스턴스
export const balanceEngine = new BalanceEngine();

export default BalanceEngine;
