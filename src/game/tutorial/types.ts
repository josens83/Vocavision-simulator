/**
 * Chapter 9: Tutorial & Onboarding - Type Definitions
 * 튜토리얼 및 온보딩 시스템 타입 정의
 */

// ============================================
// 튜토리얼 단계 타입
// ============================================

export type TutorialStepType =
  | 'highlight'      // UI 요소 하이라이트
  | 'tooltip'        // 툴팁 표시
  | 'modal'          // 모달 다이얼로그
  | 'action'         // 특정 액션 요구
  | 'wait'           // 조건 대기
  | 'narrative'      // 내러티브/스토리
  | 'choice'         // 선택지 제공
  | 'reward';        // 보상 지급

export type TutorialTrigger =
  | 'auto'           // 자동 시작
  | 'first_launch'   // 첫 실행
  | 'feature_unlock' // 기능 언락 시
  | 'milestone'      // 마일스톤 달성 시
  | 'manual'         // 수동 시작
  | 'context';       // 상황 기반

export type TutorialCategory =
  | 'basics'         // 기본 조작
  | 'business'       // 비즈니스 관리
  | 'development'    // 개발
  | 'marketing'      // 마케팅
  | 'finance'        // 재무
  | 'advanced'       // 고급 기능
  | 'tips';          // 팁 & 트릭

// ============================================
// 튜토리얼 단계
// ============================================

export interface TutorialStep {
  id: string;
  type: TutorialStepType;
  title?: string;
  content: string;

  // 표시 위치
  target?: string;           // CSS 선택자 또는 요소 ID
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  offset?: { x: number; y: number };

  // 하이라이트
  highlight?: {
    selector: string;
    padding?: number;
    shape?: 'rect' | 'circle' | 'custom';
    clickThrough?: boolean;
  };

  // 액션 요구
  action?: {
    type: string;
    target?: string;
    value?: any;
    timeout?: number;
  };

  // 대기 조건
  waitFor?: {
    condition: string;
    value: any;
    timeout?: number;
    fallback?: string;  // 타임아웃 시 이동할 단계
  };

  // 선택지
  choices?: TutorialChoice[];

  // 보상
  reward?: {
    type: 'cash' | 'skill' | 'item' | 'achievement';
    value: number | string;
  };

  // 진행
  next?: string;             // 다음 단계 ID
  skippable?: boolean;

  // 표시
  showOverlay?: boolean;
  overlayOpacity?: number;
  dismissOnClick?: boolean;
  autoAdvance?: number;      // 밀리초 후 자동 진행
}

export interface TutorialChoice {
  id: string;
  text: string;
  next: string;              // 선택 시 이동할 단계 ID
  effect?: TutorialEffect;
}

export interface TutorialEffect {
  type: string;
  value: any;
}

// ============================================
// 튜토리얼 시퀀스
// ============================================

export interface TutorialSequence {
  id: string;
  name: string;
  description: string;
  category: TutorialCategory;

  // 트리거
  trigger: TutorialTrigger;
  triggerCondition?: {
    type: string;
    value: any;
  };

  // 단계
  steps: TutorialStep[];
  startStep: string;

  // 요구사항
  prerequisites?: string[];  // 필수 선행 튜토리얼
  minDay?: number;

  // 설정
  priority: number;          // 높을수록 우선
  canSkip: boolean;
  canRepeat: boolean;
  showProgress: boolean;

  // 보상
  completionReward?: {
    type: string;
    value: any;
  };
}

// ============================================
// 힌트 시스템
// ============================================

export interface Hint {
  id: string;
  category: TutorialCategory;
  title: string;
  content: string;

  // 표시 조건
  condition?: {
    type: 'stat' | 'metric' | 'event' | 'time' | 'action';
    target: string;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
    value: any;
  };

  // 표시
  displayType: 'tooltip' | 'notification' | 'sidebar' | 'popup';
  position?: string;
  icon?: string;

  // 우선순위 및 제한
  priority: number;
  maxShows: number;
  cooldownMinutes: number;

  // 관련 기능
  relatedFeature?: string;
  relatedTutorial?: string;
  learnMoreUrl?: string;
}

export interface HintState {
  hintId: string;
  showCount: number;
  lastShown: Date | null;
  dismissed: boolean;
}

// ============================================
// 도움말 시스템
// ============================================

export interface HelpTopic {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string;           // 마크다운 지원

  // 메타데이터
  keywords: string[];
  relatedTopics: string[];
  order: number;

  // 미디어
  images?: HelpImage[];
  videos?: HelpVideo[];

  // 상호작용
  interactiveDemo?: string;  // 데모 튜토리얼 ID
}

export interface HelpImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface HelpVideo {
  url: string;
  title: string;
  duration: number;
}

export interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  order: number;
  topics: string[];
}

// ============================================
// 온보딩 설정
// ============================================

export interface OnboardingConfig {
  enabled: boolean;
  showOnFirstLaunch: boolean;
  allowSkip: boolean;
  remindAfterDays: number;

  // 초기 튜토리얼
  initialSequence: string;

  // 컨텍스트 힌트
  contextHints: boolean;
  hintDelay: number;
  maxHintsPerSession: number;

  // 진행 저장
  saveProgress: boolean;
}

export const DEFAULT_ONBOARDING_CONFIG: OnboardingConfig = {
  enabled: true,
  showOnFirstLaunch: true,
  allowSkip: true,
  remindAfterDays: 7,
  initialSequence: 'basic_tutorial',
  contextHints: true,
  hintDelay: 3000,
  maxHintsPerSession: 5,
  saveProgress: true,
};

// ============================================
// 기능 발견
// ============================================

export interface FeatureDiscovery {
  featureId: string;
  name: string;
  description: string;

  // 발견 조건
  unlockCondition: {
    type: 'day' | 'event' | 'stat' | 'metric' | 'action';
    value: any;
  };

  // 표시
  announcement: {
    title: string;
    message: string;
    icon: string;
  };

  // 관련 튜토리얼
  tutorialId?: string;

  // 상태
  importance: 'low' | 'medium' | 'high';
}

// ============================================
// 튜토리얼 진행 상태
// ============================================

export interface TutorialProgress {
  tutorialId: string;
  currentStep: string;
  startedAt: Date;
  completedSteps: string[];
  skipped: boolean;
  completed: boolean;
  completedAt?: Date;
}

export interface TutorialState {
  completedTutorials: string[];
  currentTutorial: TutorialProgress | null;
  tutorialHistory: TutorialProgress[];
  hintStates: Map<string, HintState>;
  discoveredFeatures: string[];
  hintsShownThisSession: number;
  lastHintTime: Date | null;

  // 설정
  tutorialsEnabled: boolean;
  hintsEnabled: boolean;

  // 통계
  totalTutorialsCompleted: number;
  totalHintsViewed: number;
}

// ============================================
// 튜토리얼 이벤트
// ============================================

export type TutorialEventType =
  | 'tutorial_started'
  | 'tutorial_step_completed'
  | 'tutorial_completed'
  | 'tutorial_skipped'
  | 'hint_shown'
  | 'hint_dismissed'
  | 'feature_discovered'
  | 'help_viewed';

export interface TutorialEvent {
  type: TutorialEventType;
  tutorialId?: string;
  stepId?: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}

export type TutorialEventListener = (event: TutorialEvent) => void;

// ============================================
// 상수
// ============================================

export const TUTORIAL_CONSTANTS = {
  DEFAULT_OVERLAY_OPACITY: 0.7,
  DEFAULT_HIGHLIGHT_PADDING: 8,
  DEFAULT_TOOLTIP_OFFSET: 10,
  MAX_HINTS_PER_SESSION: 5,
  HINT_COOLDOWN_MINUTES: 5,
  AUTO_ADVANCE_DEFAULT: 5000,
};
