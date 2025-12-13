/**
 * Chapter 11: Ending & Victory - Ending Manager
 * 엔딩 관리 시스템
 *
 * 이 모듈은 게임 엔딩 조건 검사, 점수 계산, 엔딩 트리거를 관리합니다.
 */

import {
  Ending,
  EndingType,
  EndingTier,
  EndingCondition,
  EndingRequirement,
  EndingReward,
  EndingEpilogue,
  PlaythroughStats,
  NewGamePlusConfig,
  EndingState,
  EndingGrade,
  ENDING_GRADES,
  DEFAULT_NG_PLUS_CONFIG,
} from './types';

import {
  victoryEndings,
  specialEndings,
  secretEndings,
  gameOverReasons,
  victoryConditions,
  getEndingById,
  getEndingsByType,
  getEndingsByTier,
  checkVictoryCondition,
} from './endings';

// ============================================
// Types
// ============================================

export interface EndingCheckResult {
  canEnd: boolean;
  availableEndings: Ending[];
  recommendedEnding: Ending | null;
  gameOverReason: typeof gameOverReasons[number] | null;
  warnings: string[];
}

export interface EndingTriggerResult {
  success: boolean;
  ending: Ending | null;
  stats: PlaythroughStats | null;
  grade: EndingGrade | null;
  rewards: EndingReward[];
  epilogue: EndingEpilogue | null;
  ngPlusConfig: NewGamePlusConfig | null;
  error?: string;
}

export interface EndingManagerListener {
  onEndingAvailable?: (endings: Ending[]) => void;
  onEndingTriggered?: (result: EndingTriggerResult) => void;
  onGameOver?: (reason: typeof gameOverReasons[number]) => void;
  onVictoryConditionMet?: (condition: typeof victoryConditions[number]) => void;
}

// ============================================
// Ending Manager Class
// ============================================

export class EndingManager {
  private state: EndingState;
  private listeners: Set<EndingManagerListener> = new Set();
  private gameStartTime: Date;
  private totalPlayTime: number = 0;
  private decisionHistory: Array<{ id: string; choice: string; timestamp: Date }> = [];
  private eventLog: Array<{ type: string; data: any; timestamp: Date }> = [];

  constructor() {
    this.state = this.createInitialState();
    this.gameStartTime = new Date();
  }

  private createInitialState(): EndingState {
    return {
      currentEnding: null,
      unlockedEndings: [],
      seenEndings: [],
      endingProgress: {},
      playthroughStats: null,
      isGameOver: false,
      gameOverReason: null,
      canContinue: true,
    };
  }

  // ============================================
  // Listener Management
  // ============================================

  addListener(listener: EndingManagerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners<K extends keyof EndingManagerListener>(
    event: K,
    ...args: Parameters<NonNullable<EndingManagerListener[K]>>
  ): void {
    this.listeners.forEach((listener) => {
      const handler = listener[event];
      if (handler) {
        (handler as Function)(...args);
      }
    });
  }

  // ============================================
  // Condition Checking
  // ============================================

  /**
   * 게임 상태를 기반으로 엔딩 조건 검사
   */
  checkEndingConditions(gameState: any): EndingCheckResult {
    const result: EndingCheckResult = {
      canEnd: false,
      availableEndings: [],
      recommendedEnding: null,
      gameOverReason: null,
      warnings: [],
    };

    // 1. 게임 오버 조건 먼저 검사
    const gameOver = this.checkGameOverConditions(gameState);
    if (gameOver) {
      result.gameOverReason = gameOver;
      result.canEnd = true;
      return result;
    }

    // 2. 승리 조건 검사
    const metVictoryConditions = victoryConditions.filter((vc) =>
      checkVictoryCondition(vc.id, gameState),
    );

    if (metVictoryConditions.length > 0) {
      // 승리 조건 알림
      metVictoryConditions.forEach((vc) => {
        this.notifyListeners('onVictoryConditionMet', vc);
      });
    }

    // 3. 사용 가능한 엔딩 수집
    const allEndings = [...victoryEndings, ...specialEndings, ...secretEndings];
    const availableEndings: Ending[] = [];

    for (const ending of allEndings) {
      if (this.checkEndingRequirements(ending, gameState)) {
        availableEndings.push(ending);

        // 진행도 업데이트
        this.state.endingProgress[ending.id] = 100;
      } else {
        // 부분 진행도 계산
        const progress = this.calculateEndingProgress(ending, gameState);
        this.state.endingProgress[ending.id] = progress;
      }
    }

    result.availableEndings = availableEndings;
    result.canEnd = availableEndings.length > 0;

    // 4. 추천 엔딩 선택 (우선순위 기반)
    if (availableEndings.length > 0) {
      result.recommendedEnding = this.selectBestEnding(availableEndings, gameState);
      this.notifyListeners('onEndingAvailable', availableEndings);
    }

    // 5. 경고 생성
    result.warnings = this.generateWarnings(gameState);

    return result;
  }

  /**
   * 개별 엔딩 요구사항 검사
   */
  private checkEndingRequirements(ending: Ending, gameState: any): boolean {
    for (const requirement of ending.requirements) {
      if (!this.checkSingleRequirement(requirement, gameState)) {
        return false;
      }
    }
    return true;
  }

  /**
   * 단일 요구사항 검사
   */
  private checkSingleRequirement(requirement: EndingRequirement, gameState: any): boolean {
    const { type, target, operator, value } = requirement;

    let actualValue: any;

    // 대상 값 가져오기
    switch (type) {
      case 'stat':
        actualValue = this.getNestedValue(gameState.stats || gameState, target);
        break;
      case 'resource':
        actualValue = this.getNestedValue(gameState.resources || gameState, target);
        break;
      case 'achievement':
        actualValue = gameState.achievements?.includes(target) ?? false;
        break;
      case 'ending':
        actualValue = this.state.seenEndings.includes(target);
        break;
      case 'decision':
        actualValue = this.decisionHistory.some((d) => d.id === target);
        break;
      case 'time':
        actualValue = this.getNestedValue(gameState.time || gameState, target);
        break;
      case 'flag':
        actualValue = this.getNestedValue(gameState.flags || gameState, target);
        break;
      default:
        actualValue = this.getNestedValue(gameState, target);
    }

    // 연산자 평가
    return this.evaluateOperator(actualValue, operator, value);
  }

  /**
   * 연산자 평가
   */
  private evaluateOperator(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case '>=':
        return actual >= expected;
      case '<=':
        return actual <= expected;
      case '>':
        return actual > expected;
      case '<':
        return actual < expected;
      case '==':
        return actual == expected;
      case '!=':
        return actual != expected;
      case 'has':
        return Array.isArray(actual) ? actual.includes(expected) : actual === expected;
      case 'not_has':
        return Array.isArray(actual) ? !actual.includes(expected) : actual !== expected;
      case 'between':
        if (Array.isArray(expected) && expected.length === 2) {
          return actual >= expected[0] && actual <= expected[1];
        }
        return false;
      default:
        return actual === expected;
    }
  }

  /**
   * 중첩 객체에서 값 가져오기
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * 엔딩 진행도 계산 (0-100)
   */
  private calculateEndingProgress(ending: Ending, gameState: any): number {
    if (ending.requirements.length === 0) return 100;

    let metCount = 0;
    for (const requirement of ending.requirements) {
      if (this.checkSingleRequirement(requirement, gameState)) {
        metCount++;
      }
    }

    return Math.floor((metCount / ending.requirements.length) * 100);
  }

  /**
   * 게임 오버 조건 검사
   */
  private checkGameOverConditions(gameState: any): typeof gameOverReasons[number] | null {
    for (const reason of gameOverReasons) {
      let allConditionsMet = true;

      for (const condition of reason.conditions) {
        if (!this.evaluateCondition(condition, gameState)) {
          allConditionsMet = false;
          break;
        }
      }

      if (allConditionsMet) {
        return reason;
      }
    }

    return null;
  }

  /**
   * 조건 평가
   */
  private evaluateCondition(condition: EndingCondition, gameState: any): boolean {
    const { type, target, operator, value } = condition;

    let actualValue: any;

    switch (type) {
      case 'stat':
        actualValue = this.getNestedValue(gameState.stats || gameState, target);
        break;
      case 'resource':
        actualValue = this.getNestedValue(gameState.resources || gameState, target);
        break;
      case 'time':
        actualValue = this.getNestedValue(gameState.time || gameState, target);
        break;
      case 'flag':
        actualValue = this.getNestedValue(gameState.flags || gameState, target);
        break;
      case 'comparison':
        const [left, right] = target.split(',').map((t) => t.trim());
        const leftVal = this.getNestedValue(gameState, left);
        const rightVal = this.getNestedValue(gameState, right);
        actualValue = leftVal - rightVal;
        break;
      default:
        actualValue = this.getNestedValue(gameState, target);
    }

    return this.evaluateOperator(actualValue, operator, value);
  }

  /**
   * 최적 엔딩 선택
   */
  private selectBestEnding(availableEndings: Ending[], gameState: any): Ending {
    // 우선순위: secret > special > victory, 그 다음 tier 순서
    const tierPriority: Record<EndingTier, number> = {
      legendary: 4,
      epic: 3,
      rare: 2,
      common: 1,
    };

    const typePriority: Record<EndingType, number> = {
      secret: 3,
      special: 2,
      victory: 1,
      defeat: 0,
    };

    return availableEndings.sort((a, b) => {
      // 타입 우선
      const typeDiff = typePriority[b.type] - typePriority[a.type];
      if (typeDiff !== 0) return typeDiff;

      // 티어 우선
      const tierDiff = tierPriority[b.tier] - tierPriority[a.tier];
      if (tierDiff !== 0) return tierDiff;

      // 점수 보너스 기준
      return (b.scoreBonus || 0) - (a.scoreBonus || 0);
    })[0];
  }

  /**
   * 경고 생성
   */
  private generateWarnings(gameState: any): string[] {
    const warnings: string[] = [];

    // 리소스 부족 경고
    if ((gameState.cash ?? gameState.resources?.cash) < 10000) {
      warnings.push('자금이 부족합니다. 파산 위험이 있습니다.');
    }

    // 체력/스트레스 경고
    if ((gameState.energy ?? gameState.stats?.energy) < 20) {
      warnings.push('체력이 매우 낮습니다. 번아웃 위험이 있습니다.');
    }
    if ((gameState.stress ?? gameState.stats?.stress) > 80) {
      warnings.push('스트레스가 매우 높습니다. 번아웃 위험이 있습니다.');
    }

    // 유저 이탈 경고
    if ((gameState.churnRate ?? gameState.stats?.churnRate) > 0.15) {
      warnings.push('유저 이탈률이 높습니다. 서비스 품질을 개선하세요.');
    }

    return warnings;
  }

  // ============================================
  // Ending Triggering
  // ============================================

  /**
   * 엔딩 트리거
   */
  triggerEnding(endingId: string, gameState: any): EndingTriggerResult {
    const ending = getEndingById(endingId);

    if (!ending) {
      return {
        success: false,
        ending: null,
        stats: null,
        grade: null,
        rewards: [],
        epilogue: null,
        ngPlusConfig: null,
        error: `엔딩을 찾을 수 없습니다: ${endingId}`,
      };
    }

    // 요구사항 재검증
    if (!this.checkEndingRequirements(ending, gameState)) {
      return {
        success: false,
        ending: null,
        stats: null,
        grade: null,
        rewards: [],
        epilogue: null,
        ngPlusConfig: null,
        error: '엔딩 요구사항을 충족하지 못했습니다.',
      };
    }

    // 플레이스루 통계 계산
    const stats = this.calculatePlaythroughStats(gameState, ending);

    // 등급 계산
    const grade = this.calculateGrade(stats.totalScore);

    // 보상 수집
    const rewards = ending.rewards || [];

    // 에필로그 선택
    const epilogue = this.selectEpilogue(ending, gameState);

    // NG+ 설정 생성
    const ngPlusConfig = this.createNGPlusConfig(ending, stats, grade);

    // 상태 업데이트
    this.state.currentEnding = ending;
    this.state.playthroughStats = stats;
    this.state.isGameOver = ending.type === 'defeat';

    if (!this.state.seenEndings.includes(endingId)) {
      this.state.seenEndings.push(endingId);
    }
    if (!this.state.unlockedEndings.includes(endingId)) {
      this.state.unlockedEndings.push(endingId);
    }

    const result: EndingTriggerResult = {
      success: true,
      ending,
      stats,
      grade,
      rewards,
      epilogue,
      ngPlusConfig,
    };

    this.notifyListeners('onEndingTriggered', result);

    return result;
  }

  /**
   * 게임 오버 트리거
   */
  triggerGameOver(reason: typeof gameOverReasons[number], gameState: any): EndingTriggerResult {
    const stats = this.calculatePlaythroughStats(gameState, null);
    const grade = this.calculateGrade(stats.totalScore);

    this.state.isGameOver = true;
    this.state.gameOverReason = reason;
    this.state.playthroughStats = stats;
    this.state.canContinue = reason.canRetry;

    this.notifyListeners('onGameOver', reason);

    return {
      success: true,
      ending: null,
      stats,
      grade,
      rewards: [],
      epilogue: null,
      ngPlusConfig: null,
    };
  }

  // ============================================
  // Score & Grade Calculation
  // ============================================

  /**
   * 플레이스루 통계 계산
   */
  private calculatePlaythroughStats(gameState: any, ending: Ending | null): PlaythroughStats {
    const now = new Date();
    const playTimeMs = now.getTime() - this.gameStartTime.getTime() + this.totalPlayTime;
    const playTimeMinutes = Math.floor(playTimeMs / 60000);

    // 기본 점수 계산
    let baseScore = 0;

    // 자금 기반 점수
    const cash = gameState.cash ?? gameState.resources?.cash ?? 0;
    baseScore += Math.floor(cash / 1000);

    // 유저 기반 점수
    const totalUsers = gameState.totalUsers ?? gameState.stats?.totalUsers ?? 0;
    baseScore += totalUsers * 10;

    // 프리미엄 유저 점수
    const premiumUsers = gameState.premiumUsers ?? gameState.stats?.premiumUsers ?? 0;
    baseScore += premiumUsers * 50;

    // 완료된 프로젝트 점수
    const completedProjects = gameState.completedProjects ?? gameState.stats?.completedProjects ?? 0;
    baseScore += completedProjects * 100;

    // 업적 점수
    const achievements = gameState.achievements ?? [];
    baseScore += achievements.length * 200;

    // 엔딩 보너스
    const endingBonus = ending?.scoreBonus ?? 0;

    // 시간 보너스 (빠른 클리어)
    const daysPlayed = gameState.day ?? gameState.time?.day ?? 1;
    const timeBonus = Math.max(0, 10000 - daysPlayed * 10);

    // 효율성 보너스
    const efficiency = this.calculateEfficiency(gameState);
    const efficiencyBonus = Math.floor(efficiency * 1000);

    const totalScore = baseScore + endingBonus + timeBonus + efficiencyBonus;

    return {
      endingId: ending?.id ?? 'game_over',
      totalScore,
      baseScore,
      endingBonus,
      timeBonus,
      efficiencyBonus,
      playTime: playTimeMinutes,
      daysPlayed,
      totalUsers,
      premiumUsers,
      peakRevenue: gameState.peakRevenue ?? gameState.stats?.peakRevenue ?? 0,
      totalRevenue: gameState.totalRevenue ?? gameState.stats?.totalRevenue ?? 0,
      completedProjects,
      achievementsUnlocked: achievements.length,
      decisionsCount: this.decisionHistory.length,
      crisisResolved: gameState.crisisResolved ?? gameState.stats?.crisisResolved ?? 0,
      partnershipsFormed: gameState.partnerships ?? gameState.stats?.partnerships ?? 0,
      eventsCompleted: this.eventLog.filter((e) => e.type === 'event_completed').length,
    };
  }

  /**
   * 효율성 계산
   */
  private calculateEfficiency(gameState: any): number {
    const revenue = gameState.totalRevenue ?? gameState.stats?.totalRevenue ?? 1;
    const expenses = gameState.totalExpenses ?? gameState.stats?.totalExpenses ?? 1;
    const days = gameState.day ?? gameState.time?.day ?? 1;

    // 수익/지출 비율 * 일수 효율
    const revenueRatio = Math.min(revenue / Math.max(expenses, 1), 5);
    const dayEfficiency = Math.min(365 / Math.max(days, 1), 3);

    return revenueRatio * dayEfficiency / 15; // 0-1 정규화
  }

  /**
   * 등급 계산
   */
  private calculateGrade(score: number): EndingGrade {
    for (const grade of ENDING_GRADES) {
      if (score >= grade.minScore) {
        return grade;
      }
    }
    return ENDING_GRADES[ENDING_GRADES.length - 1];
  }

  /**
   * 에필로그 선택
   */
  private selectEpilogue(ending: Ending, gameState: any): EndingEpilogue | null {
    if (!ending.epilogues || ending.epilogues.length === 0) {
      return null;
    }

    // 조건에 맞는 에필로그 필터링
    const eligibleEpilogues = ending.epilogues.filter((ep) => {
      if (!ep.condition) return true;
      return this.evaluateCondition(ep.condition, gameState);
    });

    if (eligibleEpilogues.length === 0) {
      return ending.epilogues[0]; // 기본 에필로그
    }

    // 랜덤 선택 또는 첫 번째
    return eligibleEpilogues[Math.floor(Math.random() * eligibleEpilogues.length)];
  }

  /**
   * NG+ 설정 생성
   */
  private createNGPlusConfig(
    ending: Ending,
    stats: PlaythroughStats,
    grade: EndingGrade,
  ): NewGamePlusConfig {
    const baseConfig = { ...DEFAULT_NG_PLUS_CONFIG };

    // 등급에 따른 보너스 조정
    const gradeMultiplier = {
      S: 1.5,
      A: 1.3,
      B: 1.1,
      C: 1.0,
      D: 0.9,
      F: 0.8,
    }[grade.rank] ?? 1.0;

    // 엔딩 타입에 따른 추가 보너스
    if (ending.type === 'secret') {
      baseConfig.cashRetention = Math.min(baseConfig.cashRetention * 1.5, 100);
      baseConfig.skillRetention = Math.min(baseConfig.skillRetention * 1.5, 100);
      baseConfig.bonusUnlocks.push('secret_mode');
    } else if (ending.type === 'special') {
      baseConfig.cashRetention = Math.min(baseConfig.cashRetention * 1.2, 100);
    }

    // 등급 적용
    baseConfig.cashRetention = Math.floor(baseConfig.cashRetention * gradeMultiplier);
    baseConfig.skillRetention = Math.floor(baseConfig.skillRetention * gradeMultiplier);

    // 특별 보너스
    if (stats.totalScore >= 100000) {
      baseConfig.bonusUnlocks.push('expert_mode');
    }
    if (stats.daysPlayed <= 180) {
      baseConfig.bonusUnlocks.push('speedrun_badge');
    }
    if (stats.achievementsUnlocked >= 50) {
      baseConfig.bonusUnlocks.push('completionist_badge');
    }

    return baseConfig;
  }

  // ============================================
  // Decision & Event Tracking
  // ============================================

  /**
   * 의사결정 기록
   */
  recordDecision(decisionId: string, choice: string): void {
    this.decisionHistory.push({
      id: decisionId,
      choice,
      timestamp: new Date(),
    });
  }

  /**
   * 이벤트 기록
   */
  recordEvent(type: string, data: any): void {
    this.eventLog.push({
      type,
      data,
      timestamp: new Date(),
    });
  }

  /**
   * 플레이 시간 추가
   */
  addPlayTime(minutes: number): void {
    this.totalPlayTime += minutes * 60000;
  }

  // ============================================
  // State Management
  // ============================================

  getState(): EndingState {
    return { ...this.state };
  }

  setState(state: Partial<EndingState>): void {
    this.state = { ...this.state, ...state };
  }

  getEndingProgress(): Record<string, number> {
    return { ...this.state.endingProgress };
  }

  getSeenEndings(): string[] {
    return [...this.state.seenEndings];
  }

  getUnlockedEndings(): string[] {
    return [...this.state.unlockedEndings];
  }

  isEndingUnlocked(endingId: string): boolean {
    return this.state.unlockedEndings.includes(endingId);
  }

  hasSeenEnding(endingId: string): boolean {
    return this.state.seenEndings.includes(endingId);
  }

  getCurrentEnding(): Ending | null {
    return this.state.currentEnding;
  }

  isGameOver(): boolean {
    return this.state.isGameOver;
  }

  canContinue(): boolean {
    return this.state.canContinue;
  }

  // ============================================
  // Serialization
  // ============================================

  serialize(): object {
    return {
      state: this.state,
      gameStartTime: this.gameStartTime.toISOString(),
      totalPlayTime: this.totalPlayTime,
      decisionHistory: this.decisionHistory.map((d) => ({
        ...d,
        timestamp: d.timestamp.toISOString(),
      })),
      eventLog: this.eventLog.map((e) => ({
        ...e,
        timestamp: e.timestamp.toISOString(),
      })),
    };
  }

  deserialize(data: any): void {
    if (data.state) {
      this.state = data.state;
    }
    if (data.gameStartTime) {
      this.gameStartTime = new Date(data.gameStartTime);
    }
    if (data.totalPlayTime) {
      this.totalPlayTime = data.totalPlayTime;
    }
    if (data.decisionHistory) {
      this.decisionHistory = data.decisionHistory.map((d: any) => ({
        ...d,
        timestamp: new Date(d.timestamp),
      }));
    }
    if (data.eventLog) {
      this.eventLog = data.eventLog.map((e: any) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }));
    }
  }

  // ============================================
  // Reset
  // ============================================

  reset(): void {
    this.state = this.createInitialState();
    this.gameStartTime = new Date();
    this.totalPlayTime = 0;
    this.decisionHistory = [];
    this.eventLog = [];
  }

  /**
   * NG+ 리셋 (일부 데이터 보존)
   */
  resetForNewGamePlus(config: NewGamePlusConfig): void {
    const preservedEndings = [...this.state.seenEndings];
    const preservedUnlocks = [...this.state.unlockedEndings];

    this.state = this.createInitialState();
    this.state.seenEndings = preservedEndings;
    this.state.unlockedEndings = preservedUnlocks;

    this.gameStartTime = new Date();
    this.totalPlayTime = 0;
    // 의사결정과 이벤트는 초기화하되, NG+ 플래그 추가
    this.decisionHistory = [];
    this.eventLog = [{
      type: 'ng_plus_start',
      data: { config, previousEndings: preservedEndings },
      timestamp: new Date(),
    }];
  }
}

// 싱글톤 인스턴스
export const endingManager = new EndingManager();
