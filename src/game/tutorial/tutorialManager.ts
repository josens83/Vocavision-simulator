/**
 * Chapter 9: Tutorial & Onboarding - Tutorial Manager
 * 튜토리얼 관리자
 */

import {
  TutorialSequence,
  TutorialStep,
  TutorialProgress,
  TutorialState,
  TutorialEvent,
  TutorialEventListener,
  TutorialEventType,
  Hint,
  HintState,
  FeatureDiscovery,
  OnboardingConfig,
  DEFAULT_ONBOARDING_CONFIG,
  TUTORIAL_CONSTANTS,
} from './types';
import { tutorials, getTutorialById } from './sequences';
import { hints, featureDiscoveries } from './hints';

// ============================================
// 튜토리얼 관리자
// ============================================

export class TutorialManager {
  private state: TutorialState;
  private config: OnboardingConfig;
  private eventListeners: Set<TutorialEventListener> = new Set();
  private conditionCheckers: Map<string, (value: any, gameState: any) => boolean> = new Map();

  constructor() {
    this.config = { ...DEFAULT_ONBOARDING_CONFIG };
    this.state = this.getInitialState();
    this.registerDefaultConditionCheckers();
    this.loadState();
  }

  private getInitialState(): TutorialState {
    return {
      completedTutorials: [],
      currentTutorial: null,
      tutorialHistory: [],
      hintStates: new Map(),
      discoveredFeatures: [],
      hintsShownThisSession: 0,
      lastHintTime: null,
      tutorialsEnabled: true,
      hintsEnabled: true,
      totalTutorialsCompleted: 0,
      totalHintsViewed: 0,
    };
  }

  // ============================================
  // 이벤트 시스템
  // ============================================

  addEventListener(listener: TutorialEventListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  private emit(
    type: TutorialEventType,
    tutorialId?: string,
    stepId?: string,
    details?: Record<string, unknown>,
  ): void {
    const event: TutorialEvent = {
      type,
      tutorialId,
      stepId,
      timestamp: new Date(),
      details,
    };
    this.eventListeners.forEach((listener) => listener(event));
  }

  // ============================================
  // 설정
  // ============================================

  setConfig(config: Partial<OnboardingConfig>): void {
    this.config = { ...this.config, ...config };
    this.saveState();
  }

  getConfig(): OnboardingConfig {
    return { ...this.config };
  }

  // ============================================
  // 튜토리얼 시작
  // ============================================

  startTutorial(tutorialId: string, force: boolean = false): boolean {
    if (!this.state.tutorialsEnabled && !force) return false;

    const tutorial = getTutorialById(tutorialId);
    if (!tutorial) return false;

    // 이미 완료된 튜토리얼이고 반복 불가면 시작하지 않음
    if (this.state.completedTutorials.includes(tutorialId) && !tutorial.canRepeat && !force) {
      return false;
    }

    // 선행 조건 확인
    if (tutorial.prerequisites) {
      const missingPrereqs = tutorial.prerequisites.filter(
        (prereq) => !this.state.completedTutorials.includes(prereq),
      );
      if (missingPrereqs.length > 0) {
        console.warn(`Missing prerequisites for tutorial ${tutorialId}:`, missingPrereqs);
        return false;
      }
    }

    // 현재 진행 중인 튜토리얼이 있으면 중단
    if (this.state.currentTutorial) {
      this.skipCurrentTutorial();
    }

    // 튜토리얼 시작
    const progress: TutorialProgress = {
      tutorialId,
      currentStep: tutorial.startStep,
      startedAt: new Date(),
      completedSteps: [],
      skipped: false,
      completed: false,
    };

    this.state.currentTutorial = progress;
    this.emit('tutorial_started', tutorialId, tutorial.startStep);

    return true;
  }

  // ============================================
  // 튜토리얼 진행
  // ============================================

  getCurrentStep(): TutorialStep | null {
    if (!this.state.currentTutorial) return null;

    const tutorial = getTutorialById(this.state.currentTutorial.tutorialId);
    if (!tutorial) return null;

    return tutorial.steps.find((s) => s.id === this.state.currentTutorial!.currentStep) || null;
  }

  getCurrentTutorial(): TutorialSequence | null {
    if (!this.state.currentTutorial) return null;
    return getTutorialById(this.state.currentTutorial.tutorialId) || null;
  }

  getTutorialProgress(): {
    current: number;
    total: number;
    percentage: number;
  } | null {
    if (!this.state.currentTutorial) return null;

    const tutorial = getTutorialById(this.state.currentTutorial.tutorialId);
    if (!tutorial) return null;

    const current = this.state.currentTutorial.completedSteps.length;
    const total = tutorial.steps.length;

    return {
      current,
      total,
      percentage: Math.round((current / total) * 100),
    };
  }

  advanceStep(nextStepId?: string): boolean {
    if (!this.state.currentTutorial) return false;

    const tutorial = getTutorialById(this.state.currentTutorial.tutorialId);
    if (!tutorial) return false;

    const currentStep = this.getCurrentStep();
    if (!currentStep) return false;

    // 현재 단계 완료 처리
    if (!this.state.currentTutorial.completedSteps.includes(currentStep.id)) {
      this.state.currentTutorial.completedSteps.push(currentStep.id);
    }

    this.emit('tutorial_step_completed', tutorial.id, currentStep.id);

    // 다음 단계 결정
    const next = nextStepId || currentStep.next;

    if (next) {
      const nextStep = tutorial.steps.find((s) => s.id === next);
      if (nextStep) {
        this.state.currentTutorial.currentStep = next;
        return true;
      }
    }

    // 다음 단계가 없으면 튜토리얼 완료
    this.completeTutorial();
    return true;
  }

  handleChoice(choiceId: string): boolean {
    const currentStep = this.getCurrentStep();
    if (!currentStep || !currentStep.choices) return false;

    const choice = currentStep.choices.find((c) => c.id === choiceId);
    if (!choice) return false;

    // 효과 적용 (필요시)
    if (choice.effect) {
      // 효과 처리 로직
    }

    // 다음 단계로 이동
    return this.advanceStep(choice.next);
  }

  // ============================================
  // 튜토리얼 완료/스킵
  // ============================================

  completeTutorial(): void {
    if (!this.state.currentTutorial) return;

    const tutorial = getTutorialById(this.state.currentTutorial.tutorialId);
    if (!tutorial) return;

    this.state.currentTutorial.completed = true;
    this.state.currentTutorial.completedAt = new Date();

    if (!this.state.completedTutorials.includes(tutorial.id)) {
      this.state.completedTutorials.push(tutorial.id);
    }

    this.state.tutorialHistory.push({ ...this.state.currentTutorial });
    this.state.totalTutorialsCompleted++;

    this.emit('tutorial_completed', tutorial.id, undefined, {
      reward: tutorial.completionReward,
    });

    this.state.currentTutorial = null;
    this.saveState();
  }

  skipCurrentTutorial(): void {
    if (!this.state.currentTutorial) return;

    const tutorial = getTutorialById(this.state.currentTutorial.tutorialId);
    if (!tutorial) return;

    // 스킵 불가능한 튜토리얼인지 확인
    if (!tutorial.canSkip) {
      console.warn(`Tutorial ${tutorial.id} cannot be skipped`);
      return;
    }

    this.state.currentTutorial.skipped = true;
    this.state.tutorialHistory.push({ ...this.state.currentTutorial });

    this.emit('tutorial_skipped', tutorial.id);

    this.state.currentTutorial = null;
    this.saveState();
  }

  // ============================================
  // 자동 트리거 확인
  // ============================================

  checkTriggers(gameState: any): TutorialSequence | null {
    if (!this.state.tutorialsEnabled) return null;
    if (this.state.currentTutorial) return null;

    // 우선순위 순으로 정렬
    const sortedTutorials = [...tutorials].sort((a, b) => b.priority - a.priority);

    for (const tutorial of sortedTutorials) {
      // 이미 완료된 튜토리얼 스킵
      if (this.state.completedTutorials.includes(tutorial.id) && !tutorial.canRepeat) {
        continue;
      }

      // 트리거 조건 확인
      if (this.checkTriggerCondition(tutorial, gameState)) {
        this.startTutorial(tutorial.id);
        return tutorial;
      }
    }

    return null;
  }

  private checkTriggerCondition(tutorial: TutorialSequence, gameState: any): boolean {
    switch (tutorial.trigger) {
      case 'first_launch':
        return (
          this.state.completedTutorials.length === 0 &&
          this.state.tutorialHistory.length === 0
        );

      case 'milestone':
        if (!tutorial.triggerCondition) return false;
        return this.checkCondition(tutorial.triggerCondition, gameState);

      case 'feature_unlock':
        if (!tutorial.triggerCondition) return false;
        // 기능 언락 확인
        return false; // 실제 구현 필요

      case 'context':
        if (!tutorial.triggerCondition) return false;
        return this.checkCondition(tutorial.triggerCondition, gameState);

      case 'manual':
        return false; // 수동으로만 시작

      default:
        return false;
    }
  }

  // ============================================
  // 힌트 시스템
  // ============================================

  checkHints(gameState: any): Hint | null {
    if (!this.state.hintsEnabled || !this.config.contextHints) return null;

    // 세션당 최대 힌트 수 확인
    if (this.state.hintsShownThisSession >= this.config.maxHintsPerSession) {
      return null;
    }

    // 힌트 딜레이 확인
    if (this.state.lastHintTime) {
      const elapsed = Date.now() - this.state.lastHintTime.getTime();
      if (elapsed < this.config.hintDelay) {
        return null;
      }
    }

    // 우선순위 순으로 정렬
    const sortedHints = [...hints].sort((a, b) => b.priority - a.priority);

    for (const hint of sortedHints) {
      const hintState = this.state.hintStates.get(hint.id);

      // 이미 최대 횟수 표시됨
      if (hintState && hintState.showCount >= hint.maxShows) {
        continue;
      }

      // 쿨다운 확인
      if (hintState && hintState.lastShown) {
        const cooldown = hint.cooldownMinutes * 60 * 1000;
        if (Date.now() - hintState.lastShown.getTime() < cooldown) {
          continue;
        }
      }

      // 무시됨
      if (hintState && hintState.dismissed) {
        continue;
      }

      // 조건 확인
      if (hint.condition && this.checkCondition(hint.condition, gameState)) {
        return hint;
      }
    }

    return null;
  }

  showHint(hintId: string): void {
    let hintState = this.state.hintStates.get(hintId);

    if (!hintState) {
      hintState = {
        hintId,
        showCount: 0,
        lastShown: null,
        dismissed: false,
      };
      this.state.hintStates.set(hintId, hintState);
    }

    hintState.showCount++;
    hintState.lastShown = new Date();

    this.state.hintsShownThisSession++;
    this.state.lastHintTime = new Date();
    this.state.totalHintsViewed++;

    this.emit('hint_shown', undefined, undefined, { hintId });
    this.saveState();
  }

  dismissHint(hintId: string): void {
    let hintState = this.state.hintStates.get(hintId);

    if (!hintState) {
      hintState = {
        hintId,
        showCount: 0,
        lastShown: null,
        dismissed: true,
      };
      this.state.hintStates.set(hintId, hintState);
    } else {
      hintState.dismissed = true;
    }

    this.emit('hint_dismissed', undefined, undefined, { hintId });
    this.saveState();
  }

  // ============================================
  // 기능 발견
  // ============================================

  checkFeatureDiscovery(gameState: any): FeatureDiscovery | null {
    for (const feature of featureDiscoveries) {
      // 이미 발견됨
      if (this.state.discoveredFeatures.includes(feature.featureId)) {
        continue;
      }

      // 조건 확인
      if (this.checkUnlockCondition(feature.unlockCondition, gameState)) {
        return feature;
      }
    }

    return null;
  }

  discoverFeature(featureId: string): void {
    if (this.state.discoveredFeatures.includes(featureId)) return;

    this.state.discoveredFeatures.push(featureId);

    const feature = featureDiscoveries.find((f) => f.featureId === featureId);
    this.emit('feature_discovered', undefined, undefined, { featureId, feature });

    // 관련 튜토리얼 자동 시작
    if (feature?.tutorialId) {
      this.startTutorial(feature.tutorialId);
    }

    this.saveState();
  }

  private checkUnlockCondition(
    condition: FeatureDiscovery['unlockCondition'],
    gameState: any,
  ): boolean {
    switch (condition.type) {
      case 'day':
        return gameState?.time?.totalDays >= condition.value;

      case 'event':
        return gameState?.progress?.completedEvents?.includes(condition.value);

      case 'stat':
      case 'metric':
        if (typeof condition.value === 'object') {
          return Object.entries(condition.value).every(([key, val]) => {
            const actual = this.getNestedValue(gameState, key);
            return actual >= val;
          });
        }
        return false;

      default:
        return false;
    }
  }

  // ============================================
  // 조건 체크 유틸리티
  // ============================================

  private registerDefaultConditionCheckers(): void {
    this.conditionCheckers.set('stat', (condition, gameState) => {
      const value = this.getNestedValue(gameState, condition.target);
      return this.compareValues(value, condition.operator, condition.value);
    });

    this.conditionCheckers.set('metric', (condition, gameState) => {
      const value = this.getNestedValue(gameState, condition.target);
      return this.compareValues(value, condition.operator, condition.value);
    });

    this.conditionCheckers.set('time', (condition, gameState) => {
      const value = this.getNestedValue(gameState, condition.target);
      return this.compareValues(value, condition.operator, condition.value);
    });

    this.conditionCheckers.set('event', (condition, gameState) => {
      return gameState?.progress?.completedEvents?.includes(condition.value);
    });
  }

  private checkCondition(
    condition: { type: string; target?: string; operator?: string; value: any },
    gameState: any,
  ): boolean {
    const checker = this.conditionCheckers.get(condition.type);
    if (checker) {
      return checker(condition, gameState);
    }

    // 기본 조건 확인
    if (condition.target) {
      const value = this.getNestedValue(gameState, condition.target);
      return this.compareValues(value, condition.operator || '>=', condition.value);
    }

    return false;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private compareValues(actual: any, operator: string, expected: any): boolean {
    if (actual === undefined || actual === null) return false;

    switch (operator) {
      case '>':
        return actual > expected;
      case '<':
        return actual < expected;
      case '>=':
        return actual >= expected;
      case '<=':
        return actual <= expected;
      case '==':
        return actual == expected;
      case '===':
        return actual === expected;
      case '!=':
        return actual != expected;
      default:
        return false;
    }
  }

  // ============================================
  // 상태 저장/로드
  // ============================================

  private saveState(): void {
    try {
      const serializable = {
        ...this.state,
        hintStates: Array.from(this.state.hintStates.entries()),
        lastHintTime: this.state.lastHintTime?.toISOString(),
      };
      localStorage.setItem('vocavision_tutorial_state', JSON.stringify(serializable));
      localStorage.setItem('vocavision_onboarding_config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save tutorial state:', error);
    }
  }

  private loadState(): void {
    try {
      const stateJson = localStorage.getItem('vocavision_tutorial_state');
      if (stateJson) {
        const loaded = JSON.parse(stateJson);
        this.state = {
          ...this.state,
          ...loaded,
          hintStates: new Map(loaded.hintStates || []),
          lastHintTime: loaded.lastHintTime ? new Date(loaded.lastHintTime) : null,
        };
      }

      const configJson = localStorage.getItem('vocavision_onboarding_config');
      if (configJson) {
        this.config = { ...this.config, ...JSON.parse(configJson) };
      }
    } catch (error) {
      console.error('Failed to load tutorial state:', error);
    }
  }

  // ============================================
  // 공개 API
  // ============================================

  isComplete(tutorialId: string): boolean {
    return this.state.completedTutorials.includes(tutorialId);
  }

  getCompletedTutorials(): string[] {
    return [...this.state.completedTutorials];
  }

  getDiscoveredFeatures(): string[] {
    return [...this.state.discoveredFeatures];
  }

  getTutorialStats(): {
    completed: number;
    hintsViewed: number;
    featuresDiscovered: number;
  } {
    return {
      completed: this.state.totalTutorialsCompleted,
      hintsViewed: this.state.totalHintsViewed,
      featuresDiscovered: this.state.discoveredFeatures.length,
    };
  }

  setTutorialsEnabled(enabled: boolean): void {
    this.state.tutorialsEnabled = enabled;
    this.saveState();
  }

  setHintsEnabled(enabled: boolean): void {
    this.state.hintsEnabled = enabled;
    this.saveState();
  }

  resetSession(): void {
    this.state.hintsShownThisSession = 0;
    this.state.lastHintTime = null;
  }

  reset(): void {
    this.state = this.getInitialState();
    this.config = { ...DEFAULT_ONBOARDING_CONFIG };
    this.saveState();
  }
}

// 싱글톤 인스턴스
export const tutorialManager = new TutorialManager();

export default tutorialManager;
