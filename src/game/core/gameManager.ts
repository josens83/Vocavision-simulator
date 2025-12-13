/**
 * Chapter 15: Main Game Screen - Game Manager
 * 게임 매니저 - 모든 시스템 통합
 *
 * 이 모듈은 VocaVision의 모든 게임 시스템을 통합하여 관리합니다.
 */

import {
  GameState,
  UIState,
  TimeState,
  GamePhase,
  ActiveTab,
  ModalType,
  Notification,
  GameEvent,
  GameAction,
  GameManagerConfig,
  DEFAULT_GAME_CONFIG,
  INITIAL_GAME_STATE,
  INITIAL_UI_STATE,
} from './types';

// 시스템 imports
import { saveSystem } from '../save';
import { tutorialSystem } from '../tutorial';
import { settingsSystem } from '../settings';
import { endingSystem } from '../ending';
import { analyticsSystem } from '../analytics';
import { localizationSystem, t } from '../localization';
import { debugSystem } from '../debug';

// ============================================
// Game Manager
// ============================================

export interface GameManagerListener {
  onStateChange?: (state: GameState, previousState: GameState) => void;
  onUIChange?: (ui: UIState) => void;
  onPhaseChange?: (phase: GamePhase, previousPhase: GamePhase) => void;
  onDayStart?: (day: number) => void;
  onDayEnd?: (day: number) => void;
  onEvent?: (event: GameEvent) => void;
  onNotification?: (notification: Notification) => void;
  onGameOver?: (reason: string) => void;
  onEnding?: (endingId: string) => void;
}

export class GameManager {
  private config: GameManagerConfig;
  private state: GameState;
  private ui: UIState;
  private listeners: Set<GameManagerListener> = new Set();
  private gameLoopTimer: ReturnType<typeof setInterval> | null = null;
  private autoSaveTimer: ReturnType<typeof setInterval> | null = null;
  private eventQueue: GameEvent[] = [];
  private isProcessingEvent = false;
  private lastTickTime = 0;

  constructor(config: Partial<GameManagerConfig> = {}) {
    this.config = { ...DEFAULT_GAME_CONFIG, ...config };
    this.state = { ...INITIAL_GAME_STATE };
    this.ui = { ...INITIAL_UI_STATE };

    this.initializeSystems();
  }

  // ============================================
  // System Integration
  // ============================================

  private initializeSystems(): void {
    // 디버그 시스템에 게임 상태 바인딩
    debugSystem.manager.bindGameState(
      () => this.state,
      (state) => this.setState(state),
    );

    // 분석 시스템 초기화
    if (this.config.enableAnalytics) {
      analyticsSystem.initialize({ debug: this.config.enableDebug });
    }

    // 저장 시스템 초기화
    saveSystem.initialize().catch((err) => {
      debugSystem.error('GameManager', 'Failed to initialize save system', err);
    });

    // 설정 로드
    const savedSettings = settingsSystem.manager.getState();
    if (savedSettings) {
      // 설정 적용
    }

    debugSystem.info('GameManager', 'All systems initialized');
  }

  // ============================================
  // Listener Management
  // ============================================

  addListener(listener: GameManagerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners<K extends keyof GameManagerListener>(
    event: K,
    ...args: Parameters<NonNullable<GameManagerListener[K]>>
  ): void {
    this.listeners.forEach((listener) => {
      const handler = listener[event];
      if (handler) {
        (handler as Function)(...args);
      }
    });
  }

  // ============================================
  // Game Lifecycle
  // ============================================

  /**
   * 새 게임 시작
   */
  startNewGame(playerName?: string): void {
    debugSystem.info('GameManager', 'Starting new game');

    // 상태 초기화
    this.state = { ...INITIAL_GAME_STATE };
    this.ui = { ...INITIAL_UI_STATE };

    // 난이도에 따른 시작 자원 설정
    this.applyDifficultySettings();

    // 튜토리얼 활성화
    if (this.config.enableTutorial) {
      tutorialSystem.startTutorial('basic');
      this.ui.showTutorial = true;
    }

    // 분석 이벤트
    if (this.config.enableAnalytics) {
      analyticsSystem.startSession(this.state.time.day);
      analyticsSystem.trackGame('game_start', { difficulty: this.config.difficulty });
    }

    // 게임 루프 시작
    this.setPhase('playing');
    this.startGameLoop();

    // 자동 저장 시작
    if (this.config.autoSave) {
      this.startAutoSave();
    }

    this.notify(t('notification.new_user'));
  }

  /**
   * 게임 로드
   */
  async loadGame(slot: number): Promise<boolean> {
    debugSystem.info('GameManager', `Loading game from slot ${slot}`);

    const result = await saveSystem.load(slot);
    if (!result.success || !result.data) {
      debugSystem.error('GameManager', 'Failed to load game', result.error);
      return false;
    }

    // 상태 복원
    this.state = result.data.gameState;
    this.state.saveSlot = slot;
    this.state.isNewGame = false;

    // 분석 세션 시작
    if (this.config.enableAnalytics) {
      analyticsSystem.startSession(this.state.time.day);
      analyticsSystem.trackGame('game_load', { slot, day: this.state.time.day });
    }

    // 게임 루프 시작
    this.setPhase('playing');
    this.startGameLoop();

    if (this.config.autoSave) {
      this.startAutoSave();
    }

    return true;
  }

  /**
   * 게임 저장
   */
  async saveGame(slot: number, name?: string): Promise<boolean> {
    debugSystem.info('GameManager', `Saving game to slot ${slot}`);

    const result = await saveSystem.save(
      slot,
      name || `Day ${this.state.time.day}`,
      this.state,
      this.state.progression,
      settingsSystem.manager.getState(),
    );

    if (result.success) {
      this.state.saveSlot = slot;
      analyticsSystem.trackGame('game_save', { slot });
      this.notify(t('save.success'), 'success');
    } else {
      debugSystem.error('GameManager', 'Failed to save game', result.error);
      this.notify(t('save.failed'), 'error');
    }

    return result.success;
  }

  /**
   * 게임 일시정지
   */
  pauseGame(): void {
    if (this.ui.phase !== 'playing') return;

    this.ui.isPaused = true;
    this.stopGameLoop();
    this.setPhase('paused');

    analyticsSystem.trackGame('game_pause', { day: this.state.time.day });
  }

  /**
   * 게임 재개
   */
  resumeGame(): void {
    if (this.ui.phase !== 'paused') return;

    this.ui.isPaused = false;
    this.startGameLoop();
    this.setPhase('playing');

    analyticsSystem.trackGame('game_resume', { day: this.state.time.day });
  }

  /**
   * 게임 종료
   */
  quitGame(): void {
    debugSystem.info('GameManager', 'Quitting game');

    this.stopGameLoop();
    this.stopAutoSave();

    if (this.config.enableAnalytics) {
      analyticsSystem.endSession();
    }

    this.setPhase('title');
    this.state = { ...INITIAL_GAME_STATE };
    this.ui = { ...INITIAL_UI_STATE };
  }

  // ============================================
  // Game Loop
  // ============================================

  private startGameLoop(): void {
    if (this.gameLoopTimer) return;

    this.lastTickTime = Date.now();

    this.gameLoopTimer = setInterval(() => {
      this.tick();
    }, 1000 / 60);  // 60 FPS

    debugSystem.debug('GameManager', 'Game loop started');
  }

  private stopGameLoop(): void {
    if (this.gameLoopTimer) {
      clearInterval(this.gameLoopTimer);
      this.gameLoopTimer = null;
    }
  }

  private tick(): void {
    if (this.ui.isPaused || this.ui.phase !== 'playing') return;

    const now = Date.now();
    const deltaTime = (now - this.lastTickTime) / 1000;
    this.lastTickTime = now;

    // 성능 추적
    debugSystem.recordFrame();

    // 게임 속도 적용
    const adjustedDelta = deltaTime * this.ui.gameSpeed;

    // 시간 업데이트
    this.updateTime(adjustedDelta);

    // 이벤트 처리
    this.processEventQueue();

    // 상태 체크
    this.checkGameConditions();
  }

  private updateTime(deltaTime: number): void {
    // 하루가 config.dayLength 초라고 가정
    // 실제로는 시간 진행 없이 액션 기반으로만 진행
  }

  // ============================================
  // Day Management
  // ============================================

  /**
   * 하루 시작
   */
  startDay(): void {
    this.notifyListeners('onDayStart', this.state.time.day);

    // 행동력 리셋
    this.state.time.actionsRemaining = this.state.time.maxActions;
    this.state.time.timeOfDay = 'morning';

    // 일간 이벤트 체크
    this.checkDailyEvents();

    // 튜토리얼 트리거 체크
    const tutorial = tutorialSystem.checkTriggers(this.state);
    if (tutorial) {
      tutorialSystem.startTutorial(tutorial.id);
    }

    // 분석
    analyticsSystem.trackGame('day_start', {
      day: this.state.time.day,
      cash: this.state.resources.cash,
      users: this.state.resources.users,
    });

    debugSystem.debug('GameManager', `Day ${this.state.time.day} started`);
  }

  /**
   * 하루 종료
   */
  endDay(): void {
    this.notifyListeners('onDayEnd', this.state.time.day);

    // 일간 정산
    this.processDailySettlement();

    // 시간 진행
    this.advanceDay();

    // 자동저장
    if (this.config.autoSave && saveSystem.shouldAutoSave('dayChange')) {
      this.performAutoSave();
    }

    // 분석
    analyticsSystem.trackGame('day_end', {
      day: this.state.time.day - 1,
      cash: this.state.resources.cash,
      users: this.state.resources.users,
    });

    // 새로운 날 시작
    this.startDay();
  }

  private advanceDay(): void {
    const previousState = { ...this.state };

    this.state.time.day++;
    this.state.time.totalDaysPlayed++;
    this.state.time.dayOfWeek = (this.state.time.dayOfWeek + 1) % 7;

    // 주간 체크
    if (this.state.time.day % 7 === 1) {
      this.state.time.week++;
      this.processWeeklySettlement();
    }

    // 월간 체크
    if (this.state.time.day % 30 === 1) {
      this.state.time.month++;
      this.processMonthlySettlement();
    }

    // 연간 체크
    if (this.state.time.day % 365 === 1 && this.state.time.day > 1) {
      this.state.time.year++;
    }

    this.notifyListeners('onStateChange', this.state, previousState);
  }

  // ============================================
  // Settlement
  // ============================================

  private processDailySettlement(): void {
    // 플레이어 상태 회복
    this.state.player.energy = Math.min(
      this.state.player.energy + 20,
      this.state.player.maxEnergy,
    );

    // 스트레스 자연 감소
    this.state.player.stress = Math.max(0, this.state.player.stress - 5);

    // 유저 성장/이탈
    this.processUserGrowth();
  }

  private processWeeklySettlement(): void {
    debugSystem.debug('GameManager', `Week ${this.state.time.week} settlement`);

    // 주간 리포트 생성
    // 경쟁사 동향 업데이트
  }

  private processMonthlySettlement(): void {
    debugSystem.debug('GameManager', `Month ${this.state.time.month} settlement`);

    // 수익/지출 정산
    const profit = this.state.resources.monthlyRevenue - this.state.resources.monthlyExpenses;
    this.state.resources.cash += profit;
    this.state.stats.totalRevenue += this.state.resources.monthlyRevenue;
    this.state.stats.totalExpenses += this.state.resources.monthlyExpenses;

    // 런웨이 계산
    if (this.state.resources.monthlyExpenses > 0) {
      this.state.resources.runway = Math.floor(
        this.state.resources.cash / this.state.resources.monthlyExpenses,
      );
    }

    // 월간 수익 리셋
    this.state.resources.monthlyRevenue = 0;
    this.state.resources.monthlyExpenses = 0;

    // 분석 이벤트
    analyticsSystem.trackEconomy('balance_changed', {
      profit,
      cash: this.state.resources.cash,
      runway: this.state.resources.runway,
    });
  }

  private processUserGrowth(): void {
    // 자연 유저 성장 (바이럴, 입소문)
    const organicGrowth = Math.floor(this.state.resources.users * 0.01);

    // 이탈 처리
    const churnedUsers = Math.floor(
      this.state.resources.users * this.state.stats.churnRate,
    );

    // 전환 처리
    const newPremium = Math.floor(
      (this.state.resources.users - this.state.resources.premiumUsers) *
      this.state.stats.conversionRate,
    );

    // 적용
    this.state.resources.users += organicGrowth - churnedUsers;
    this.state.resources.premiumUsers += newPremium;
    this.state.stats.totalUsersAcquired += organicGrowth;
    this.state.stats.totalUsersLost += churnedUsers;

    // 피크 업데이트
    if (this.state.resources.users > this.state.stats.peakUsers) {
      this.state.stats.peakUsers = this.state.resources.users;
    }
  }

  // ============================================
  // Action Execution
  // ============================================

  /**
   * 액션 실행
   */
  executeAction(action: GameAction): boolean {
    // 요구사항 체크
    if (!this.canExecuteAction(action)) {
      return false;
    }

    debugSystem.debug('GameManager', `Executing action: ${action.id}`);

    // 비용 지불
    if (action.cost.actions) {
      this.state.time.actionsRemaining -= action.cost.actions;
    }
    if (action.cost.energy) {
      this.state.player.energy -= action.cost.energy;
    }
    if (action.cost.cash) {
      this.state.resources.cash -= action.cost.cash;
    }

    // 효과 적용
    for (const effect of action.effects) {
      this.applyEffect(effect);
    }

    // 쿨다운 설정
    if (action.cooldown) {
      action.lastUsedDay = this.state.time.day;
    }

    // 경험치 획득
    this.gainExperience(10);

    // 분석
    analyticsSystem.track('action_performed', {
      actionId: action.id,
      category: action.category,
    });

    return true;
  }

  canExecuteAction(action: GameAction): boolean {
    // 행동력 체크
    if (action.cost.actions && this.state.time.actionsRemaining < action.cost.actions) {
      return false;
    }

    // 체력 체크
    if (action.cost.energy && this.state.player.energy < action.cost.energy) {
      return false;
    }

    // 자금 체크
    if (action.cost.cash && this.state.resources.cash < action.cost.cash) {
      return false;
    }

    // 쿨다운 체크
    if (action.cooldown && action.lastUsedDay) {
      if (this.state.time.day - action.lastUsedDay < action.cooldown) {
        return false;
      }
    }

    // 요구사항 체크
    if (action.requirements) {
      for (const req of action.requirements) {
        if (!this.checkRequirement(req)) {
          return false;
        }
      }
    }

    return true;
  }

  private applyEffect(effect: any): void {
    const { type, target, value, probability } = effect;

    // 확률 체크
    if (probability !== undefined && Math.random() > probability) {
      return;
    }

    // 효과 적용
    const path = target.split('.');
    let obj: any = this.state;

    for (let i = 0; i < path.length - 1; i++) {
      obj = obj[path[i]];
    }

    const key = path[path.length - 1];
    const currentValue = obj[key];

    if (type === 'set') {
      obj[key] = value;
    } else if (type === 'add') {
      obj[key] = (currentValue || 0) + value;
    } else if (type === 'multiply') {
      obj[key] = (currentValue || 1) * value;
    }
  }

  private checkRequirement(req: any): boolean {
    const { type, target, operator, value } = req;

    const path = target.split('.');
    let actualValue: any = this.state;

    for (const key of path) {
      actualValue = actualValue?.[key];
    }

    switch (operator) {
      case '>=': return actualValue >= value;
      case '<=': return actualValue <= value;
      case '>': return actualValue > value;
      case '<': return actualValue < value;
      case '==': return actualValue == value;
      case '!=': return actualValue != value;
      default: return true;
    }
  }

  // ============================================
  // Experience & Leveling
  // ============================================

  private gainExperience(amount: number): void {
    this.state.player.experience += amount;

    // 레벨업 체크
    while (this.state.player.experience >= this.state.player.experienceToNextLevel) {
      this.levelUp();
    }
  }

  private levelUp(): void {
    this.state.player.experience -= this.state.player.experienceToNextLevel;
    this.state.player.level++;
    this.state.player.experienceToNextLevel = Math.floor(
      this.state.player.experienceToNextLevel * 1.5,
    );

    // 스탯 증가
    this.state.player.maxEnergy += 5;
    this.state.time.maxActions += (this.state.player.level % 5 === 0 ? 1 : 0);

    this.notify(
      t('notification.level_up', { level: this.state.player.level }),
      'success',
    );

    analyticsSystem.trackProgression('level_up', {
      level: this.state.player.level,
    });
  }

  // ============================================
  // Events
  // ============================================

  private checkDailyEvents(): void {
    // 랜덤 이벤트 체크
    if (Math.random() < 0.2) {
      // 20% 확률로 랜덤 이벤트
      // this.queueEvent(randomEvent);
    }

    // 스케줄된 이벤트 체크
    // 트리거 조건 이벤트 체크
  }

  queueEvent(event: GameEvent): void {
    this.eventQueue.push(event);
    this.eventQueue.sort((a, b) => b.priority - a.priority);
  }

  private processEventQueue(): void {
    if (this.isProcessingEvent || this.eventQueue.length === 0) return;

    const event = this.eventQueue.shift()!;
    this.triggerEvent(event);
  }

  private triggerEvent(event: GameEvent): void {
    this.isProcessingEvent = true;
    this.ui.activeModal = 'event';
    this.ui.modalData = event;

    this.notifyListeners('onEvent', event);
    this.notifyListeners('onUIChange', this.ui);

    debugSystem.debug('GameManager', `Event triggered: ${event.id}`);
  }

  handleEventChoice(event: GameEvent, choiceId: string): void {
    const choice = event.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // 효과 적용
    for (const effect of choice.effects) {
      this.applyEffect(effect);
    }

    // 이벤트 기록
    if (event.once) {
      this.state.progression.seenEvents.push(event.id);
    }

    // 후속 이벤트
    if (choice.followUpEvent) {
      // 후속 이벤트 큐잉
    }

    // 모달 닫기
    this.isProcessingEvent = false;
    this.closeModal();
  }

  // ============================================
  // Game Conditions
  // ============================================

  private checkGameConditions(): void {
    // 엔딩 조건 체크
    const endingCheck = endingSystem.checkConditions(this.state);

    if (endingCheck.gameOverReason) {
      this.handleGameOver(endingCheck.gameOverReason);
      return;
    }

    if (endingCheck.canEnd && endingCheck.recommendedEnding) {
      // 엔딩 가능 알림 (자동 트리거하지 않음)
      debugSystem.debug('GameManager', `Ending available: ${endingCheck.recommendedEnding.id}`);
    }
  }

  triggerEnding(endingId: string): void {
    const result = endingSystem.triggerEnding(endingId, this.state);

    if (result.success && result.ending) {
      this.stopGameLoop();
      this.stopAutoSave();

      this.ui.phase = 'ending';
      this.ui.modalData = result;

      analyticsSystem.trackProgression('ending_reached', {
        endingId,
        score: result.stats?.totalScore,
        grade: result.grade?.rank,
      });

      this.notifyListeners('onEnding', endingId);
      this.notifyListeners('onUIChange', this.ui);
    }
  }

  private handleGameOver(reason: any): void {
    this.stopGameLoop();
    this.stopAutoSave();

    endingSystem.triggerEnding(reason.id, this.state);

    this.setPhase('gameOver');
    this.ui.modalData = reason;

    analyticsSystem.trackGame('game_end', {
      reason: reason.id,
      day: this.state.time.day,
    });

    this.notifyListeners('onGameOver', reason.id);
  }

  // ============================================
  // UI Management
  // ============================================

  setPhase(phase: GamePhase): void {
    const previousPhase = this.ui.phase;
    this.ui.phase = phase;

    this.notifyListeners('onPhaseChange', phase, previousPhase);
    this.notifyListeners('onUIChange', this.ui);
  }

  setActiveTab(tab: ActiveTab): void {
    this.ui.activeTab = tab;
    this.notifyListeners('onUIChange', this.ui);
  }

  openModal(type: ModalType, data?: any): void {
    this.ui.activeModal = type;
    this.ui.modalData = data;
    this.notifyListeners('onUIChange', this.ui);
  }

  closeModal(): void {
    this.ui.activeModal = 'none';
    this.ui.modalData = null;
    this.notifyListeners('onUIChange', this.ui);
  }

  setGameSpeed(speed: 0 | 1 | 2 | 4): void {
    this.ui.gameSpeed = speed;
    this.ui.isPaused = speed === 0;
    this.notifyListeners('onUIChange', this.ui);
  }

  // ============================================
  // Notifications
  // ============================================

  notify(message: string, type: Notification['type'] = 'info', title?: string): void {
    const notification: Notification = {
      id: `notif_${Date.now()}`,
      type,
      title: title || this.getNotificationTitle(type),
      message,
      timestamp: new Date(),
      read: false,
      duration: 3000,
    };

    this.ui.notifications.push(notification);

    // 최대 50개 유지
    if (this.ui.notifications.length > 50) {
      this.ui.notifications.shift();
    }

    this.notifyListeners('onNotification', notification);
    this.notifyListeners('onUIChange', this.ui);
  }

  private getNotificationTitle(type: Notification['type']): string {
    const titles: Record<Notification['type'], string> = {
      info: t('common.info'),
      success: t('common.success'),
      warning: t('common.warning'),
      error: t('common.error'),
      achievement: t('achievement.unlocked'),
    };
    return titles[type];
  }

  dismissNotification(id: string): void {
    this.ui.notifications = this.ui.notifications.filter((n) => n.id !== id);
    this.notifyListeners('onUIChange', this.ui);
  }

  // ============================================
  // Auto Save
  // ============================================

  private startAutoSave(): void {
    if (this.autoSaveTimer) return;

    const interval = this.config.autoSaveInterval * 60 * 1000;

    this.autoSaveTimer = setInterval(() => {
      this.performAutoSave();
    }, interval);
  }

  private stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  private async performAutoSave(): Promise<void> {
    const result = await saveSystem.performAutoSave(
      this.state,
      this.state.progression,
      settingsSystem.manager.getState(),
    );

    if (result.success) {
      debugSystem.debug('GameManager', 'Auto-save completed');
    } else {
      debugSystem.error('GameManager', 'Auto-save failed', result.error);
    }
  }

  // ============================================
  // Difficulty
  // ============================================

  private applyDifficultySettings(): void {
    const multipliers = {
      easy: { cash: 1.5, growth: 1.3, churn: 0.7 },
      normal: { cash: 1.0, growth: 1.0, churn: 1.0 },
      hard: { cash: 0.7, growth: 0.8, churn: 1.3 },
    };

    const mult = multipliers[this.config.difficulty];

    this.state.resources.cash = Math.floor(this.config.startingCash * mult.cash);
    // 추가 난이도 설정 적용
  }

  // ============================================
  // State Management
  // ============================================

  getState(): GameState {
    return { ...this.state };
  }

  setState(state: GameState): void {
    const previousState = this.state;
    this.state = state;
    this.notifyListeners('onStateChange', this.state, previousState);
  }

  getUI(): UIState {
    return { ...this.ui };
  }

  // ============================================
  // Cleanup
  // ============================================

  cleanup(): void {
    this.stopGameLoop();
    this.stopAutoSave();

    if (this.config.enableAnalytics) {
      analyticsSystem.cleanup();
    }

    saveSystem.cleanup();
    debugSystem.manager.cleanup();

    this.listeners.clear();
  }
}

// 싱글톤 인스턴스
export const gameManager = new GameManager();
