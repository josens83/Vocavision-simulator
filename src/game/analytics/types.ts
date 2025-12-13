/**
 * Chapter 12: Analytics & Telemetry - Type Definitions
 * 분석 및 텔레메트리 타입 정의
 */

// ============================================
// Event Types
// ============================================

/**
 * 이벤트 카테고리
 */
export type EventCategory =
  | 'game'        // 게임 이벤트
  | 'ui'          // UI 상호작용
  | 'business'    // 비즈니스 액션
  | 'progression' // 진행 이벤트
  | 'economy'     // 경제 이벤트
  | 'social'      // 소셜 기능
  | 'error'       // 에러 및 예외
  | 'performance' // 성능 메트릭
  | 'engagement'  // 참여도
  | 'custom';     // 커스텀 이벤트

/**
 * 이벤트 우선순위
 */
export type EventPriority = 'critical' | 'high' | 'normal' | 'low';

/**
 * 기본 분석 이벤트
 */
export interface AnalyticsEvent {
  id: string;
  name: string;
  category: EventCategory;
  priority: EventPriority;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  properties: Record<string, any>;
  context: EventContext;
}

/**
 * 이벤트 컨텍스트
 */
export interface EventContext {
  // 게임 상태
  gameDay: number;
  gamePhase: string;

  // 세션 정보
  sessionDuration: number;
  actionsInSession: number;

  // 환경
  platform: string;
  version: string;
  locale: string;

  // 페이지/화면
  screen: string;
  previousScreen?: string;

  // 기술 정보
  userAgent?: string;
  viewportSize?: { width: number; height: number };
}

// ============================================
// Predefined Events
// ============================================

/**
 * 게임 이벤트
 */
export interface GameEvent extends AnalyticsEvent {
  category: 'game';
  name:
    | 'game_start'
    | 'game_end'
    | 'game_save'
    | 'game_load'
    | 'game_pause'
    | 'game_resume'
    | 'day_start'
    | 'day_end'
    | 'phase_change'
    | 'action_performed';
}

/**
 * 비즈니스 이벤트
 */
export interface BusinessEvent extends AnalyticsEvent {
  category: 'business';
  name:
    | 'feature_developed'
    | 'marketing_launched'
    | 'hire_employee'
    | 'fire_employee'
    | 'partnership_formed'
    | 'investment_received'
    | 'product_launched'
    | 'pricing_changed';
}

/**
 * 진행 이벤트
 */
export interface ProgressionEvent extends AnalyticsEvent {
  category: 'progression';
  name:
    | 'level_up'
    | 'achievement_unlocked'
    | 'milestone_reached'
    | 'skill_learned'
    | 'unlock_obtained'
    | 'tutorial_step'
    | 'tutorial_complete'
    | 'ending_reached';
}

/**
 * 경제 이벤트
 */
export interface EconomyEvent extends AnalyticsEvent {
  category: 'economy';
  name:
    | 'revenue_earned'
    | 'expense_incurred'
    | 'balance_changed'
    | 'user_acquired'
    | 'user_converted'
    | 'user_churned'
    | 'subscription_started'
    | 'subscription_cancelled';
}

/**
 * UI 이벤트
 */
export interface UIEvent extends AnalyticsEvent {
  category: 'ui';
  name:
    | 'button_click'
    | 'menu_open'
    | 'menu_close'
    | 'modal_open'
    | 'modal_close'
    | 'tab_switch'
    | 'scroll'
    | 'hover'
    | 'drag_drop'
    | 'keyboard_shortcut';
}

/**
 * 에러 이벤트
 */
export interface ErrorEvent extends AnalyticsEvent {
  category: 'error';
  name:
    | 'js_error'
    | 'api_error'
    | 'validation_error'
    | 'game_error'
    | 'save_error'
    | 'load_error';
  properties: {
    errorType: string;
    errorMessage: string;
    errorStack?: string;
    severity: 'fatal' | 'error' | 'warning';
    [key: string]: any;
  };
}

/**
 * 성능 이벤트
 */
export interface PerformanceEvent extends AnalyticsEvent {
  category: 'performance';
  name:
    | 'page_load'
    | 'render_time'
    | 'api_latency'
    | 'fps_drop'
    | 'memory_warning'
    | 'long_task';
  properties: {
    duration: number;
    metric: string;
    threshold?: number;
    [key: string]: any;
  };
}

// ============================================
// Session & User
// ============================================

/**
 * 세션 데이터
 */
export interface SessionData {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;

  // 세션 메트릭
  eventsCount: number;
  errorsCount: number;
  screenViews: number;
  actionsPerformed: number;

  // 진행 정보
  startDay: number;
  endDay: number;
  daysProgressed: number;

  // 참여도
  isEngaged: boolean;
  engagementScore: number;

  // 기술 정보
  platform: string;
  version: string;
  locale: string;
  referrer?: string;

  // 퍼널
  funnelStage?: string;
  conversionEvents: string[];
}

/**
 * 유저 프로필 (익명화됨)
 */
export interface UserProfile {
  id: string;
  createdAt: Date;
  lastSeenAt: Date;

  // 세션 통계
  totalSessions: number;
  totalPlayTime: number;
  averageSessionDuration: number;

  // 진행 통계
  highestDay: number;
  endingsReached: string[];
  achievementsUnlocked: string[];

  // 행동 패턴
  preferredActions: string[];
  playStyle: 'aggressive' | 'balanced' | 'conservative' | 'unknown';
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';

  // 코호트
  cohort: string;
  segments: string[];

  // A/B 테스트
  abTestGroups: Record<string, string>;
}

// ============================================
// Metrics & Aggregations
// ============================================

/**
 * 집계 메트릭
 */
export interface AggregatedMetrics {
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'all_time';
  startDate: Date;
  endDate: Date;

  // 세션 메트릭
  sessions: {
    total: number;
    unique: number;
    averageDuration: number;
    bounceRate: number;
  };

  // 이벤트 메트릭
  events: {
    total: number;
    byCategory: Record<EventCategory, number>;
    topEvents: Array<{ name: string; count: number }>;
  };

  // 진행 메트릭
  progression: {
    averageDay: number;
    completionRate: number;
    endingsDistribution: Record<string, number>;
  };

  // 참여도 메트릭
  engagement: {
    dau: number;  // 일일 활성 유저
    wau: number;  // 주간 활성 유저
    mau: number;  // 월간 활성 유저
    retentionD1: number;
    retentionD7: number;
    retentionD30: number;
  };

  // 경제 메트릭 (인게임)
  economy: {
    averageRevenue: number;
    averageExpenses: number;
    averageBalance: number;
    averageUsers: number;
  };
}

/**
 * 퍼널 분석
 */
export interface FunnelAnalysis {
  id: string;
  name: string;
  steps: FunnelStep[];
  totalEntries: number;
  totalCompletions: number;
  conversionRate: number;
  averageTimeToComplete: number;
}

export interface FunnelStep {
  order: number;
  name: string;
  eventName: string;
  entries: number;
  exits: number;
  conversionRate: number;
  dropOffRate: number;
  averageTimeInStep: number;
}

/**
 * 코호트 분석
 */
export interface CohortAnalysis {
  cohortId: string;
  cohortDate: Date;
  size: number;

  // 리텐션 데이터
  retention: {
    day: number;
    users: number;
    rate: number;
  }[];

  // 행동 데이터
  behavior: {
    averageSessionsPerUser: number;
    averagePlayTime: number;
    averageProgress: number;
  };
}

// ============================================
// A/B Testing
// ============================================

/**
 * A/B 테스트 설정
 */
export interface ABTest {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';

  // 변형
  variants: ABVariant[];

  // 설정
  trafficAllocation: number;  // 0-100%
  targetAudience?: string;  // 세그먼트 ID

  // 메트릭
  primaryMetric: string;
  secondaryMetrics: string[];

  // 기간
  startDate: Date;
  endDate?: Date;

  // 결과
  winner?: string;
  confidence?: number;
}

export interface ABVariant {
  id: string;
  name: string;
  weight: number;  // 0-100
  config: Record<string, any>;

  // 결과
  participants: number;
  conversions: number;
  conversionRate: number;
  metricValue: number;
}

// ============================================
// Privacy & Consent
// ============================================

/**
 * 개인정보 동의 설정
 */
export interface PrivacyConsent {
  analytics: boolean;
  performance: boolean;
  personalization: boolean;
  errorReporting: boolean;
  abTesting: boolean;

  // 동의 정보
  consentDate?: Date;
  consentVersion: string;

  // 데이터 관리
  dataRetentionDays: number;
  allowExport: boolean;
  allowDeletion: boolean;
}

/**
 * 데이터 내보내기 요청
 */
export interface DataExportRequest {
  id: string;
  userId: string;
  requestDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completedDate?: Date;
  downloadUrl?: string;
  expiresAt?: Date;
}

/**
 * 데이터 삭제 요청
 */
export interface DataDeletionRequest {
  id: string;
  userId: string;
  requestDate: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  completedDate?: Date;
  dataDeleted: string[];  // 삭제된 데이터 종류
}

// ============================================
// Analytics Configuration
// ============================================

/**
 * 분석 설정
 */
export interface AnalyticsConfig {
  // 기본 설정
  enabled: boolean;
  debug: boolean;

  // 이벤트 설정
  batchSize: number;
  flushInterval: number;  // ms
  maxQueueSize: number;

  // 샘플링
  samplingRate: number;  // 0-1
  errorSamplingRate: number;
  performanceSamplingRate: number;

  // 필터링
  excludedEvents: string[];
  excludedProperties: string[];

  // 개인정보
  anonymizeIp: boolean;
  hashUserIds: boolean;

  // 저장소
  storageKey: string;
  maxStorageSize: number;  // bytes

  // 엔드포인트 (로컬 전용)
  endpoint?: string;
}

export const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  enabled: true,
  debug: false,

  batchSize: 10,
  flushInterval: 30000,
  maxQueueSize: 100,

  samplingRate: 1.0,
  errorSamplingRate: 1.0,
  performanceSamplingRate: 0.1,

  excludedEvents: [],
  excludedProperties: ['password', 'creditCard', 'ssn'],

  anonymizeIp: true,
  hashUserIds: true,

  storageKey: 'vocavision_analytics',
  maxStorageSize: 5 * 1024 * 1024,  // 5MB
};

// ============================================
// Analytics State
// ============================================

/**
 * 분석 시스템 상태
 */
export interface AnalyticsState {
  // 현재 세션
  currentSession: SessionData | null;

  // 현재 유저
  currentUser: UserProfile | null;

  // 이벤트 큐
  eventQueue: AnalyticsEvent[];

  // 동의 상태
  consent: PrivacyConsent;

  // 설정
  config: AnalyticsConfig;

  // 상태
  isInitialized: boolean;
  lastFlush: Date | null;
  errors: string[];
}

// ============================================
// Real-time Dashboard
// ============================================

/**
 * 실시간 대시보드 데이터
 */
export interface RealtimeDashboard {
  // 현재 상태
  activeSessions: number;
  eventsPerMinute: number;
  errorsPerMinute: number;

  // 최근 이벤트
  recentEvents: AnalyticsEvent[];

  // 실시간 차트 데이터
  eventsTimeline: { timestamp: Date; count: number }[];
  sessionsTimeline: { timestamp: Date; count: number }[];

  // 현재 화면 분포
  screenDistribution: Record<string, number>;

  // 현재 게임 진행 분포
  dayDistribution: Record<string, number>;
}

// ============================================
// Heatmap & Behavior
// ============================================

/**
 * 히트맵 데이터
 */
export interface HeatmapData {
  screen: string;
  period: { start: Date; end: Date };
  interactions: HeatmapPoint[];
  totalInteractions: number;
}

export interface HeatmapPoint {
  x: number;
  y: number;
  count: number;
  type: 'click' | 'hover' | 'scroll';
}

/**
 * 사용자 여정
 */
export interface UserJourney {
  userId: string;
  sessionId: string;
  steps: JourneyStep[];
  startTime: Date;
  endTime?: Date;
  outcome: 'complete' | 'abandon' | 'ongoing';
}

export interface JourneyStep {
  order: number;
  timestamp: Date;
  screen: string;
  action: string;
  duration: number;
  properties?: Record<string, any>;
}
