/**
 * Chapter 6: Economy & Balance - Difficulty System
 * 난이도 시스템 및 동적 난이도 조절 (DDA)
 */

import {
  DifficultyLevel,
  DifficultySettings,
  DifficultyPreset,
  CustomDifficultyOptions,
  DynamicDifficultyAdjustment,
  DifficultySystem,
} from './types';

// ============================================
// 난이도 프리셋 정의
// ============================================

export const difficultyPresets: DifficultyPreset[] = [
  // 스토리 모드 - 스트레스 없는 경험
  {
    level: 'story',
    settings: {
      level: 'story',
      name: '스토리 모드',
      description: '스타트업의 여정을 즐기세요. 실패 없이 성장을 경험합니다.',

      // 자원 조정 (매우 관대함)
      startingCash: 100000000,    // 1억원
      startingUsers: 100,         // 100명 시작
      energyRecoveryRate: 50,     // 에너지 50 회복/일
      timePerDay: 12,             // 12 행동 포인트/일

      // 수익 조정 (매우 유리)
      revenueMultiplier: 2.0,     // 수익 2배
      conversionRateMultiplier: 2.0,  // 전환율 2배
      churnRateMultiplier: 0.3,   // 이탈률 30%

      // 비용 조정 (매우 낮음)
      costMultiplier: 0.5,        // 비용 50%
      occasionalCostFrequency: 0.2,  // 돌발 비용 20%

      // 이벤트 조정 (긍정적)
      negativeEventFrequency: 0.2,   // 부정 이벤트 20%
      positiveEventFrequency: 2.0,   // 긍정 이벤트 200%
      eventSeverity: 0.3,            // 이벤트 심각도 30%

      // 경쟁 조정 (약함)
      competitorAggression: 0.2,  // 경쟁자 공격성 20%
      marketVolatility: 0.3,      // 시장 변동성 30%

      // 기타
      tutorialEnabled: true,
      hintsEnabled: true,
      autoSaveFrequency: 1,       // 매 턴 자동저장
      undoEnabled: true,
      undoLimit: -1,              // 무제한 되돌리기
    },
  },

  // 이지 모드 - 가벼운 도전
  {
    level: 'easy',
    settings: {
      level: 'easy',
      name: '이지 모드',
      description: '창업을 처음 시작하는 분들께 추천합니다.',

      startingCash: 70000000,     // 7천만원
      startingUsers: 50,          // 50명 시작
      energyRecoveryRate: 40,     // 에너지 40 회복/일
      timePerDay: 10,             // 10 행동 포인트/일

      revenueMultiplier: 1.5,
      conversionRateMultiplier: 1.5,
      churnRateMultiplier: 0.5,

      costMultiplier: 0.7,
      occasionalCostFrequency: 0.5,

      negativeEventFrequency: 0.5,
      positiveEventFrequency: 1.5,
      eventSeverity: 0.5,

      competitorAggression: 0.4,
      marketVolatility: 0.5,

      tutorialEnabled: true,
      hintsEnabled: true,
      autoSaveFrequency: 1,
      undoEnabled: true,
      undoLimit: 10,
    },
  },

  // 노멀 모드 - 균형잡힌 경험
  {
    level: 'normal',
    settings: {
      level: 'normal',
      name: '노멀 모드',
      description: '현실적이면서도 균형 잡힌 스타트업 경험을 제공합니다.',

      startingCash: 50000000,     // 5천만원
      startingUsers: 0,           // 사용자 없이 시작
      energyRecoveryRate: 30,     // 에너지 30 회복/일
      timePerDay: 8,              // 8 행동 포인트/일

      revenueMultiplier: 1.0,
      conversionRateMultiplier: 1.0,
      churnRateMultiplier: 1.0,

      costMultiplier: 1.0,
      occasionalCostFrequency: 1.0,

      negativeEventFrequency: 1.0,
      positiveEventFrequency: 1.0,
      eventSeverity: 1.0,

      competitorAggression: 1.0,
      marketVolatility: 1.0,

      tutorialEnabled: true,
      hintsEnabled: true,
      autoSaveFrequency: 5,
      undoEnabled: true,
      undoLimit: 3,
    },
  },

  // 하드 모드 - 진정한 도전
  {
    level: 'hard',
    settings: {
      level: 'hard',
      name: '하드 모드',
      description: '창업의 현실적인 어려움을 경험하세요.',

      startingCash: 30000000,     // 3천만원
      startingUsers: 0,
      energyRecoveryRate: 25,
      timePerDay: 7,

      revenueMultiplier: 0.8,
      conversionRateMultiplier: 0.8,
      churnRateMultiplier: 1.3,

      costMultiplier: 1.3,
      occasionalCostFrequency: 1.5,

      negativeEventFrequency: 1.5,
      positiveEventFrequency: 0.7,
      eventSeverity: 1.5,

      competitorAggression: 1.5,
      marketVolatility: 1.3,

      tutorialEnabled: false,
      hintsEnabled: true,
      autoSaveFrequency: 10,
      undoEnabled: true,
      undoLimit: 1,
    },
  },

  // 리얼리스틱 모드 - 현실 그대로
  {
    level: 'realistic',
    settings: {
      level: 'realistic',
      name: '리얼리스틱 모드',
      description: '실제 1인 EdTech 창업과 동일한 조건입니다. 생존이 목표입니다.',

      startingCash: 20000000,     // 2천만원 (개인 저축)
      startingUsers: 0,
      energyRecoveryRate: 20,     // 현실적인 회복
      timePerDay: 6,              // 제한된 시간

      revenueMultiplier: 0.7,
      conversionRateMultiplier: 0.6,
      churnRateMultiplier: 1.5,

      costMultiplier: 1.5,
      occasionalCostFrequency: 2.0,  // 예상치 못한 비용 빈번

      negativeEventFrequency: 2.0,
      positiveEventFrequency: 0.5,
      eventSeverity: 2.0,

      competitorAggression: 2.0,
      marketVolatility: 2.0,

      tutorialEnabled: false,
      hintsEnabled: false,
      autoSaveFrequency: 30,
      undoEnabled: false,
      undoLimit: 0,
    },
  },
];

// ============================================
// 기본 DDA 설정
// ============================================

export const defaultDDA: DynamicDifficultyAdjustment = {
  enabled: true,
  targetSuccessRate: 0.6,      // 60% 목표 성공률
  adjustmentSpeed: 0.1,        // 10% 조정 속도
  minDifficulty: 0.3,          // 최소 난이도 30%
  maxDifficulty: 1.5,          // 최대 난이도 150%
  metrics: {
    recentWins: 0,
    recentLosses: 0,
    averageProgress: 0,
    frustrationIndex: 0,
  },
};

// ============================================
// 난이도 시스템 클래스
// ============================================

export class DifficultyManager {
  private currentSettings: DifficultySettings;
  private dda: DynamicDifficultyAdjustment;
  private customOptions: CustomDifficultyOptions | null = null;
  private ddaModifier: number = 1.0;

  // 성과 히스토리 (DDA용)
  private performanceHistory: {
    month: number;
    cashChange: number;
    userChange: number;
    success: boolean;
  }[] = [];

  constructor(level: DifficultyLevel = 'normal') {
    const preset = difficultyPresets.find(p => p.level === level);
    this.currentSettings = preset?.settings || difficultyPresets[2].settings;
    this.dda = { ...defaultDDA };
  }

  // 난이도 설정
  setDifficulty(level: DifficultyLevel): void {
    const preset = difficultyPresets.find(p => p.level === level);
    if (preset) {
      this.currentSettings = { ...preset.settings };
      this.customOptions = null;
    }
  }

  // 커스텀 난이도 설정
  setCustomDifficulty(options: CustomDifficultyOptions): void {
    this.customOptions = options;

    // 기본 노멀 설정에서 시작
    const baseSettings = difficultyPresets[2].settings;

    this.currentSettings = {
      ...baseSettings,
      level: 'normal',  // 커스텀은 level 유지하되 내부적으로 normal 베이스
      name: '커스텀',
      description: '사용자 정의 난이도',

      // 경제 설정
      startingCash: options.economy.startingCash,
      revenueMultiplier: options.economy.revenueMultiplier,
      costMultiplier: options.economy.costMultiplier,

      // 게임플레이 설정
      energyRecoveryRate: options.gameplay.energyRecoveryRate,
      timePerDay: options.gameplay.timePerDay,
      undoEnabled: options.gameplay.undoEnabled,

      // 이벤트 설정
      negativeEventFrequency: options.events.negativeFrequency,
      positiveEventFrequency: options.events.positiveFrequency,
      eventSeverity: options.events.severity,

      // 경쟁 설정
      competitorAggression: options.competition.aggression,
      marketVolatility: options.competition.marketVolatility,
    };
  }

  // DDA 활성화/비활성화
  setDDAEnabled(enabled: boolean): void {
    this.dda.enabled = enabled;
    if (!enabled) {
      this.ddaModifier = 1.0;
    }
  }

  // 성과 기록 (DDA용)
  recordPerformance(
    month: number,
    cashChange: number,
    userChange: number
  ): void {
    const success = cashChange > 0 && userChange >= 0;

    this.performanceHistory.push({ month, cashChange, userChange, success });

    // 최근 10개만 유지
    if (this.performanceHistory.length > 10) {
      this.performanceHistory.shift();
    }

    // DDA 업데이트
    if (this.dda.enabled) {
      this.updateDDA(success);
    }
  }

  // DDA 업데이트
  private updateDDA(success: boolean): void {
    // 최근 성과 집계
    if (success) {
      this.dda.metrics.recentWins++;
    } else {
      this.dda.metrics.recentLosses++;
    }

    // 최근 5턴 기준 성공률 계산
    const recentResults = this.performanceHistory.slice(-5);
    const recentSuccessRate = recentResults.filter(r => r.success).length / Math.max(1, recentResults.length);

    // 평균 진행도 계산
    this.dda.metrics.averageProgress = recentResults.reduce(
      (sum, r) => sum + (r.cashChange > 0 ? 1 : 0),
      0
    ) / Math.max(1, recentResults.length);

    // 좌절 지수 계산
    const consecutiveLosses = this.calculateConsecutiveLosses();
    this.dda.metrics.frustrationIndex = Math.min(1, consecutiveLosses * 0.2);

    // 난이도 조정
    const targetDiff = this.dda.targetSuccessRate - recentSuccessRate;
    const adjustment = targetDiff * this.dda.adjustmentSpeed;

    this.ddaModifier = Math.max(
      this.dda.minDifficulty,
      Math.min(this.dda.maxDifficulty, this.ddaModifier - adjustment)
    );

    // 좌절 지수가 높으면 추가 완화
    if (this.dda.metrics.frustrationIndex > 0.5) {
      this.ddaModifier *= (1 - this.dda.metrics.frustrationIndex * 0.2);
    }
  }

  // 연속 실패 계산
  private calculateConsecutiveLosses(): number {
    let count = 0;
    for (let i = this.performanceHistory.length - 1; i >= 0; i--) {
      if (!this.performanceHistory[i].success) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  // 현재 난이도 설정 조회 (DDA 적용)
  getSettings(): DifficultySettings {
    if (!this.dda.enabled) {
      return { ...this.currentSettings };
    }

    // DDA 수정자 적용
    return {
      ...this.currentSettings,
      revenueMultiplier: this.currentSettings.revenueMultiplier * (1 + (1 - this.ddaModifier) * 0.3),
      costMultiplier: this.currentSettings.costMultiplier * this.ddaModifier,
      negativeEventFrequency: this.currentSettings.negativeEventFrequency * this.ddaModifier,
      positiveEventFrequency: this.currentSettings.positiveEventFrequency * (2 - this.ddaModifier),
      eventSeverity: this.currentSettings.eventSeverity * this.ddaModifier,
      competitorAggression: this.currentSettings.competitorAggression * this.ddaModifier,
    };
  }

  // 원본 설정 조회 (DDA 미적용)
  getRawSettings(): DifficultySettings {
    return { ...this.currentSettings };
  }

  // DDA 상태 조회
  getDDAStatus(): {
    enabled: boolean;
    modifier: number;
    metrics: DynamicDifficultyAdjustment['metrics'];
    recentSuccessRate: number;
  } {
    const recentResults = this.performanceHistory.slice(-5);
    const recentSuccessRate = recentResults.filter(r => r.success).length / Math.max(1, recentResults.length);

    return {
      enabled: this.dda.enabled,
      modifier: this.ddaModifier,
      metrics: { ...this.dda.metrics },
      recentSuccessRate,
    };
  }

  // 시작 자원 계산
  getStartingResources(): {
    cash: number;
    users: number;
    energy: number;
    time: number;
  } {
    const settings = this.getSettings();
    return {
      cash: settings.startingCash,
      users: settings.startingUsers,
      energy: 100,
      time: settings.timePerDay,
    };
  }

  // 수익 계산 수정자
  getRevenueModifier(): number {
    return this.getSettings().revenueMultiplier;
  }

  // 비용 계산 수정자
  getCostModifier(): number {
    return this.getSettings().costMultiplier;
  }

  // 전환율 수정자
  getConversionModifier(): number {
    return this.getSettings().conversionRateMultiplier;
  }

  // 이탈률 수정자
  getChurnModifier(): number {
    return this.getSettings().churnRateMultiplier;
  }

  // 이벤트 확률 수정자
  getEventModifiers(): {
    negative: number;
    positive: number;
    severity: number;
  } {
    const settings = this.getSettings();
    return {
      negative: settings.negativeEventFrequency,
      positive: settings.positiveEventFrequency,
      severity: settings.eventSeverity,
    };
  }

  // 에너지 회복량
  getEnergyRecovery(): number {
    return this.getSettings().energyRecoveryRate;
  }

  // 일일 행동 포인트
  getTimePerDay(): number {
    return this.getSettings().timePerDay;
  }

  // Undo 가능 여부
  canUndo(): boolean {
    return this.getSettings().undoEnabled;
  }

  // Undo 제한
  getUndoLimit(): number {
    return this.getSettings().undoLimit;
  }

  // 난이도 레벨 조회
  getCurrentLevel(): DifficultyLevel {
    return this.currentSettings.level;
  }

  // 난이도 이름
  getDifficultyName(): string {
    return this.currentSettings.name;
  }

  // 난이도 설명
  getDifficultyDescription(): string {
    return this.currentSettings.description;
  }

  // 전체 시스템 상태 조회
  getSystem(): DifficultySystem {
    return {
      current: this.getSettings(),
      presets: difficultyPresets,
      custom: this.customOptions,
      dda: { ...this.dda, metrics: { ...this.dda.metrics } },
    };
  }

  // 리셋
  reset(): void {
    this.setDifficulty('normal');
    this.dda = { ...defaultDDA };
    this.ddaModifier = 1.0;
    this.performanceHistory = [];
  }
}

// ============================================
// 난이도 비교 유틸리티
// ============================================

export function compareDifficulties(
  a: DifficultyLevel,
  b: DifficultyLevel
): number {
  const order: DifficultyLevel[] = ['story', 'easy', 'normal', 'hard', 'realistic'];
  return order.indexOf(a) - order.indexOf(b);
}

export function getDifficultyIndex(level: DifficultyLevel): number {
  const order: DifficultyLevel[] = ['story', 'easy', 'normal', 'hard', 'realistic'];
  return order.indexOf(level);
}

export function getDifficultyColor(level: DifficultyLevel): string {
  const colors: Record<DifficultyLevel, string> = {
    story: '#22c55e',      // green
    easy: '#84cc16',       // lime
    normal: '#3b82f6',     // blue
    hard: '#f97316',       // orange
    realistic: '#ef4444',  // red
  };
  return colors[level];
}

export function getDifficultyIcon(level: DifficultyLevel): string {
  const icons: Record<DifficultyLevel, string> = {
    story: '📖',
    easy: '🌱',
    normal: '⚖️',
    hard: '🔥',
    realistic: '💀',
  };
  return icons[level];
}

export function getDifficultyStars(level: DifficultyLevel): number {
  const stars: Record<DifficultyLevel, number> = {
    story: 1,
    easy: 2,
    normal: 3,
    hard: 4,
    realistic: 5,
  };
  return stars[level];
}

// ============================================
// 난이도 통계 계산
// ============================================

export function calculateDifficultyScore(settings: DifficultySettings): number {
  // 난이도 점수 계산 (0-100)
  let score = 50;  // 기준점

  // 자원 (낮을수록 어려움)
  score -= (settings.startingCash - 50000000) / 1000000;
  score -= settings.startingUsers / 10;
  score -= (settings.energyRecoveryRate - 30) / 2;
  score -= (settings.timePerDay - 8);

  // 경제 (수익 낮고 비용 높을수록 어려움)
  score += (1 - settings.revenueMultiplier) * 20;
  score += (settings.costMultiplier - 1) * 20;
  score += (settings.churnRateMultiplier - 1) * 10;

  // 이벤트
  score += (settings.negativeEventFrequency - 1) * 10;
  score -= (settings.positiveEventFrequency - 1) * 10;
  score += (settings.eventSeverity - 1) * 10;

  // 경쟁
  score += (settings.competitorAggression - 1) * 10;
  score += (settings.marketVolatility - 1) * 5;

  return Math.max(0, Math.min(100, score));
}

export function estimateSuccessRate(settings: DifficultySettings): number {
  // 예상 성공률 계산 (0-1)
  const difficultyScore = calculateDifficultyScore(settings);

  // 난이도 점수를 성공률로 변환 (역비례)
  // 점수 0 = 100% 성공, 점수 100 = 10% 성공
  const baseSuccessRate = 1 - (difficultyScore / 100) * 0.9;

  return Math.max(0.1, Math.min(1, baseSuccessRate));
}

export function estimateAveragePlaytime(settings: DifficultySettings): number {
  // 예상 평균 플레이 시간 (월 단위)
  const successRate = estimateSuccessRate(settings);

  // 성공률이 높을수록 오래 플레이
  // 기본 12개월 + 성공률에 따른 보너스
  return Math.round(12 + successRate * 36);
}

// 싱글톤 인스턴스
export const difficultyManager = new DifficultyManager();

export default DifficultyManager;
