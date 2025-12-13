/**
 * Chapter 15: Main Game Screen - Type Definitions
 * 메인 게임 화면 및 통합 타입 정의
 */

// ============================================
// Game State Types
// ============================================

/**
 * 게임 페이즈
 */
export type GamePhase =
  | 'loading'      // 로딩 중
  | 'title'        // 타이틀 화면
  | 'newGame'      // 새 게임 설정
  | 'playing'      // 게임 플레이 중
  | 'paused'       // 일시정지
  | 'event'        // 이벤트 처리 중
  | 'menu'         // 메뉴 열림
  | 'ending'       // 엔딩 화면
  | 'gameOver';    // 게임 오버

/**
 * 게임 속도
 */
export type GameSpeed = 0 | 1 | 2 | 4;

/**
 * 활성 화면 탭
 */
export type ActiveTab =
  | 'overview'     // 개요
  | 'development'  // 개발
  | 'marketing'    // 마케팅
  | 'business'     // 비즈니스
  | 'personal'     // 개인
  | 'analytics';   // 분석

/**
 * 모달 타입
 */
export type ModalType =
  | 'none'
  | 'settings'
  | 'save'
  | 'load'
  | 'achievement'
  | 'event'
  | 'confirm'
  | 'help'
  | 'endDay';

// ============================================
// Core Game State
// ============================================

/**
 * 메인 게임 상태
 */
export interface GameState {
  // 메타
  version: string;
  saveSlot: number | null;
  isNewGame: boolean;
  ngPlusCount: number;

  // 시간
  time: TimeState;

  // 자원
  resources: ResourceState;

  // 통계
  stats: StatsState;

  // 회사/제품
  company: CompanyState;
  product: ProductState;

  // 플레이어
  player: PlayerState;

  // 진행
  progression: ProgressionState;

  // 플래그
  flags: Record<string, boolean>;
}

/**
 * 시간 상태
 */
export interface TimeState {
  day: number;
  week: number;
  month: number;
  year: number;
  dayOfWeek: number;  // 0-6
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  actionsRemaining: number;
  maxActions: number;
  totalDaysPlayed: number;
}

/**
 * 자원 상태
 */
export interface ResourceState {
  cash: number;
  users: number;
  premiumUsers: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  runway: number;  // 남은 개월 수
}

/**
 * 통계 상태
 */
export interface StatsState {
  totalRevenue: number;
  totalExpenses: number;
  peakUsers: number;
  peakRevenue: number;
  totalUsersAcquired: number;
  totalUsersLost: number;
  conversionRate: number;
  churnRate: number;
  arpu: number;
  ltv: number;
  cac: number;
}

/**
 * 회사 상태
 */
export interface CompanyState {
  name: string;
  founded: number;
  reputation: number;
  employeeCount: number;
  officeLevel: number;
  partnerships: string[];
  investments: number;
  valuation: number;
}

/**
 * 제품 상태
 */
export interface ProductState {
  name: string;
  version: string;
  features: string[];
  quality: number;
  uxScore: number;
  contentScore: number;
  technicalDebt: number;
  bugCount: number;
  serverCapacity: number;
  serverLoad: number;
}

/**
 * 플레이어 상태
 */
export interface PlayerState {
  energy: number;
  maxEnergy: number;
  stress: number;
  health: number;
  motivation: number;
  skills: Record<string, number>;
  level: number;
  experience: number;
  experienceToNextLevel: number;
}

/**
 * 진행 상태
 */
export interface ProgressionState {
  completedTutorials: string[];
  unlockedFeatures: string[];
  unlockedActions: string[];
  achievements: string[];
  milestones: string[];
  seenEvents: string[];
  seenEndings: string[];
  decisions: Record<string, string>;
}

// ============================================
// UI State
// ============================================

/**
 * UI 상태
 */
export interface UIState {
  phase: GamePhase;
  activeTab: ActiveTab;
  activeModal: ModalType;
  modalData: any;
  notifications: Notification[];
  isLoading: boolean;
  loadingMessage: string;
  gameSpeed: GameSpeed;
  isPaused: boolean;
  showTutorial: boolean;
  showDebug: boolean;
}

/**
 * 알림
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement';
  title: string;
  message: string;
  icon?: string;
  duration?: number;
  timestamp: Date;
  read: boolean;
  action?: NotificationAction;
}

/**
 * 알림 액션
 */
export interface NotificationAction {
  label: string;
  handler: () => void;
}

// ============================================
// Event System
// ============================================

/**
 * 게임 이벤트
 */
export interface GameEvent {
  id: string;
  type: 'random' | 'scheduled' | 'triggered' | 'story';
  title: string;
  description: string;
  illustration?: string;
  choices: EventChoice[];
  requirements?: EventRequirement[];
  effects?: EventEffect[];
  priority: number;
  once: boolean;
}

/**
 * 이벤트 선택지
 */
export interface EventChoice {
  id: string;
  text: string;
  requirements?: EventRequirement[];
  effects: EventEffect[];
  followUpEvent?: string;
}

/**
 * 이벤트 요구사항
 */
export interface EventRequirement {
  type: 'resource' | 'stat' | 'flag' | 'skill' | 'day';
  target: string;
  operator: '>=' | '<=' | '>' | '<' | '==' | '!=';
  value: number | string | boolean;
}

/**
 * 이벤트 효과
 */
export interface EventEffect {
  type: 'resource' | 'stat' | 'flag' | 'skill' | 'event' | 'unlock' | 'notification';
  target: string;
  operation: 'set' | 'add' | 'multiply';
  value: number | string | boolean;
}

// ============================================
// Action System
// ============================================

/**
 * 게임 액션
 */
export interface GameAction {
  id: string;
  name: string;
  description: string;
  category: 'development' | 'marketing' | 'business' | 'personal';
  icon: string;
  cost: ActionCost;
  effects: ActionEffect[];
  requirements?: ActionRequirement[];
  cooldown?: number;
  lastUsedDay?: number;
}

/**
 * 액션 비용
 */
export interface ActionCost {
  actions?: number;
  energy?: number;
  cash?: number;
  time?: number;
}

/**
 * 액션 효과
 */
export interface ActionEffect {
  type: string;
  target: string;
  value: number | string;
  probability?: number;
}

/**
 * 액션 요구사항
 */
export interface ActionRequirement {
  type: string;
  target: string;
  value: number | string | boolean;
}

// ============================================
// Game Manager Config
// ============================================

/**
 * 게임 매니저 설정
 */
export interface GameManagerConfig {
  autoSave: boolean;
  autoSaveInterval: number;
  enableTutorial: boolean;
  enableAnalytics: boolean;
  enableDebug: boolean;
  difficulty: 'easy' | 'normal' | 'hard';
  startingCash: number;
  dayLength: number;  // 실제 시간 (초)
}

export const DEFAULT_GAME_CONFIG: GameManagerConfig = {
  autoSave: true,
  autoSaveInterval: 5,  // 분
  enableTutorial: true,
  enableAnalytics: true,
  enableDebug: false,
  difficulty: 'normal',
  startingCash: 50000,
  dayLength: 60,  // 1분 = 1일
};

// ============================================
// Initial States
// ============================================

export const INITIAL_TIME_STATE: TimeState = {
  day: 1,
  week: 1,
  month: 1,
  year: 1,
  dayOfWeek: 0,
  timeOfDay: 'morning',
  actionsRemaining: 4,
  maxActions: 4,
  totalDaysPlayed: 0,
};

export const INITIAL_RESOURCE_STATE: ResourceState = {
  cash: 50000,
  users: 0,
  premiumUsers: 0,
  monthlyRevenue: 0,
  monthlyExpenses: 0,
  runway: 12,
};

export const INITIAL_STATS_STATE: StatsState = {
  totalRevenue: 0,
  totalExpenses: 0,
  peakUsers: 0,
  peakRevenue: 0,
  totalUsersAcquired: 0,
  totalUsersLost: 0,
  conversionRate: 0,
  churnRate: 0,
  arpu: 0,
  ltv: 0,
  cac: 0,
};

export const INITIAL_COMPANY_STATE: CompanyState = {
  name: 'VocaVision',
  founded: 1,
  reputation: 50,
  employeeCount: 1,
  officeLevel: 1,
  partnerships: [],
  investments: 0,
  valuation: 0,
};

export const INITIAL_PRODUCT_STATE: ProductState = {
  name: 'VocaVision App',
  version: '0.1.0',
  features: [],
  quality: 50,
  uxScore: 50,
  contentScore: 50,
  technicalDebt: 0,
  bugCount: 0,
  serverCapacity: 1000,
  serverLoad: 0,
};

export const INITIAL_PLAYER_STATE: PlayerState = {
  energy: 100,
  maxEnergy: 100,
  stress: 0,
  health: 100,
  motivation: 100,
  skills: {
    coding: 1,
    design: 1,
    marketing: 1,
    business: 1,
    communication: 1,
  },
  level: 1,
  experience: 0,
  experienceToNextLevel: 100,
};

export const INITIAL_PROGRESSION_STATE: ProgressionState = {
  completedTutorials: [],
  unlockedFeatures: [],
  unlockedActions: ['rest', 'study', 'develop_basic'],
  achievements: [],
  milestones: [],
  seenEvents: [],
  seenEndings: [],
  decisions: {},
};

export const INITIAL_UI_STATE: UIState = {
  phase: 'title',
  activeTab: 'overview',
  activeModal: 'none',
  modalData: null,
  notifications: [],
  isLoading: false,
  loadingMessage: '',
  gameSpeed: 1,
  isPaused: false,
  showTutorial: true,
  showDebug: false,
};

export const INITIAL_GAME_STATE: GameState = {
  version: '1.0.0',
  saveSlot: null,
  isNewGame: true,
  ngPlusCount: 0,
  time: INITIAL_TIME_STATE,
  resources: INITIAL_RESOURCE_STATE,
  stats: INITIAL_STATS_STATE,
  company: INITIAL_COMPANY_STATE,
  product: INITIAL_PRODUCT_STATE,
  player: INITIAL_PLAYER_STATE,
  progression: INITIAL_PROGRESSION_STATE,
  flags: {},
};
