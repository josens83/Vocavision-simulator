/**
 * Chapter 15: Main Game Screen - Core Module Entry Point
 * 코어 모듈 메인 엔트리 포인트
 *
 * 이 모듈은 VocaVision 시뮬레이터의 코어 게임 시스템을 제공합니다.
 *
 * 주요 기능:
 * 1. Game Manager - 모든 시스템 통합 관리
 * 2. Game State - 통합 게임 상태
 * 3. UI State - UI 상태 관리
 * 4. Game Loop - 게임 루프 및 시간 관리
 * 5. Event System - 이벤트 큐 및 처리
 */

// ============================================
// Type Exports
// ============================================

export * from './types';

// ============================================
// Game Manager
// ============================================

export {
  GameManager,
  gameManager,
  type GameManagerListener,
} from './gameManager';

// ============================================
// Game Screen Props
// ============================================

export interface GameScreenProps {
  onQuit: () => void;
}

export interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  onLoadGame: () => void;
  onSettings: () => void;
  hasSaveData: boolean;
}

export interface MainGameUIProps {
  state: import('./types').GameState;
  ui: import('./types').UIState;
  onAction: (actionId: string) => void;
  onEndDay: () => void;
  onOpenMenu: () => void;
  onTabChange: (tab: import('./types').ActiveTab) => void;
}

export interface HeaderBarProps {
  day: number;
  cash: number;
  users: number;
  energy: number;
  stress: number;
  actionsRemaining: number;
  maxActions: number;
  onMenuClick: () => void;
  onSettingsClick: () => void;
}

export interface ResourcePanelProps {
  resources: import('./types').ResourceState;
  stats: import('./types').StatsState;
}

export interface ActionPanelProps {
  actions: import('./types').GameAction[];
  onActionSelect: (action: import('./types').GameAction) => void;
  canExecute: (action: import('./types').GameAction) => boolean;
  category: string;
}

export interface EventModalProps {
  event: import('./types').GameEvent;
  onChoice: (choiceId: string) => void;
  canSelectChoice: (choice: import('./types').EventChoice) => boolean;
}

export interface NotificationToastProps {
  notification: import('./types').Notification;
  onDismiss: () => void;
}

export interface EndDayModalProps {
  summary: {
    actionsPerformed: number;
    resourceChanges: Record<string, number>;
    events: string[];
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export interface GameOverScreenProps {
  reason: string;
  stats: import('./types').StatsState;
  onRetry: () => void;
  onMainMenu: () => void;
}

export interface EndingScreenProps {
  ending: {
    id: string;
    title: string;
    description: string;
    type: string;
    tier: string;
  };
  stats: {
    totalScore: number;
    grade: string;
    playTime: number;
    daysPlayed: number;
  };
  onNewGame: () => void;
  onNewGamePlus: () => void;
  onMainMenu: () => void;
}

// ============================================
// Re-exports from other modules
// ============================================

// Save System
export { saveSystem, SaveSystem } from '../save';

// Tutorial System
export { tutorialSystem, TutorialManager } from '../tutorial';

// Settings System
export { settingsSystem, SettingsManager } from '../settings';

// Ending System
export { endingSystem, EndingManager } from '../ending';

// Analytics System
export { analyticsSystem } from '../analytics';

// Localization System
export { localizationSystem, t } from '../localization';

// Debug System
export { debugSystem, DebugManager } from '../debug';

// ============================================
// Main Game Integration
// ============================================

import { GameManager, gameManager } from './gameManager';
import {
  GameState,
  UIState,
  GamePhase,
  ActiveTab,
  GameAction,
  GameEvent,
  Notification,
  INITIAL_GAME_STATE,
  INITIAL_UI_STATE,
} from './types';

/**
 * 통합 Game 시스템 인터페이스
 */
export interface GameSystem {
  // 관리자
  manager: GameManager;

  // 게임 라이프사이클
  startNewGame: () => void;
  loadGame: (slot: number) => Promise<boolean>;
  saveGame: (slot: number, name?: string) => Promise<boolean>;
  pauseGame: () => void;
  resumeGame: () => void;
  quitGame: () => void;

  // 상태 접근
  getState: () => GameState;
  getUI: () => UIState;

  // UI 제어
  setPhase: (phase: GamePhase) => void;
  setActiveTab: (tab: ActiveTab) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
  setGameSpeed: (speed: 0 | 1 | 2 | 4) => void;

  // 게임플레이
  executeAction: (action: GameAction) => boolean;
  endDay: () => void;
  handleEventChoice: (event: GameEvent, choiceId: string) => void;

  // 알림
  notify: (message: string, type?: string, title?: string) => void;
  dismissNotification: (id: string) => void;

  // 엔딩
  triggerEnding: (endingId: string) => void;
}

/**
 * Game 시스템 생성
 */
export function createGameSystem(): GameSystem {
  return {
    manager: gameManager,

    startNewGame: () => gameManager.startNewGame(),
    loadGame: (slot) => gameManager.loadGame(slot),
    saveGame: (slot, name) => gameManager.saveGame(slot, name),
    pauseGame: () => gameManager.pauseGame(),
    resumeGame: () => gameManager.resumeGame(),
    quitGame: () => gameManager.quitGame(),

    getState: () => gameManager.getState(),
    getUI: () => gameManager.getUI(),

    setPhase: (phase) => gameManager.setPhase(phase),
    setActiveTab: (tab) => gameManager.setActiveTab(tab),
    openModal: (type, data) => gameManager.openModal(type as any, data),
    closeModal: () => gameManager.closeModal(),
    setGameSpeed: (speed) => gameManager.setGameSpeed(speed),

    executeAction: (action) => gameManager.executeAction(action),
    endDay: () => gameManager.endDay(),
    handleEventChoice: (event, choiceId) => gameManager.handleEventChoice(event, choiceId),

    notify: (message, type, title) => gameManager.notify(message, type as any, title),
    dismissNotification: (id) => gameManager.dismissNotification(id),

    triggerEnding: (endingId) => gameManager.triggerEnding(endingId),
  };
}

// 싱글톤 인스턴스
export const gameSystem = createGameSystem();

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 게임 상태 요약 생성
 */
export function createStateSummary(state: GameState): string {
  return `Day ${state.time.day} | Cash: ${formatCurrency(state.resources.cash)} | Users: ${formatNumber(state.resources.users)}`;
}

/**
 * 통화 포맷팅
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * 숫자 포맷팅
 */
export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
}

/**
 * 퍼센트 포맷팅
 */
export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/**
 * 게임 페이즈 한글명
 */
export function getPhaseLabel(phase: GamePhase): string {
  const labels: Record<GamePhase, string> = {
    loading: '로딩 중',
    title: '타이틀',
    newGame: '새 게임',
    playing: '플레이 중',
    paused: '일시정지',
    event: '이벤트',
    menu: '메뉴',
    ending: '엔딩',
    gameOver: '게임 오버',
  };
  return labels[phase] || phase;
}

/**
 * 탭 한글명
 */
export function getTabLabel(tab: ActiveTab): string {
  const labels: Record<ActiveTab, string> = {
    overview: '개요',
    development: '개발',
    marketing: '마케팅',
    business: '비즈니스',
    personal: '개인',
    analytics: '분석',
  };
  return labels[tab] || tab;
}

export default gameSystem;
