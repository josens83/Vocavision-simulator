/**
 * Chapter 12: Analytics & Telemetry - Main Entry Point
 * 분석 및 텔레메트리 시스템 메인 엔트리 포인트
 *
 * 이 모듈은 VocaVision 시뮬레이터의 분석 시스템을 제공합니다.
 *
 * 주요 기능:
 * 1. 이벤트 추적 - 게임 내 모든 이벤트 추적
 * 2. 세션 관리 - 세션 시작/종료/통계
 * 3. 유저 프로필 - 익명화된 유저 데이터
 * 4. 메트릭 집계 - 기간별 통계
 * 5. 퍼널 분석 - 전환율 분석
 * 6. 코호트 분석 - 그룹별 분석
 * 7. 개인정보 관리 - 동의/삭제/내보내기
 */

// ============================================
// Type Exports
// ============================================

export * from './types';

// ============================================
// Event Tracker
// ============================================

export {
  EventTracker,
  eventTracker,
  type EventTrackerListener,
} from './eventTracker';

// ============================================
// Session Manager
// ============================================

export {
  SessionManager,
  sessionManager,
  type SessionManagerListener,
} from './sessionManager';

// ============================================
// Metrics Aggregator
// ============================================

export {
  MetricsAggregator,
  metricsAggregator,
} from './metricsAggregator';

// ============================================
// Analytics UI Props
// ============================================

export interface AnalyticsDashboardProps {
  metrics: {
    dau: number;
    wau: number;
    mau: number;
    averageSessionDuration: number;
    bounceRate: number;
    retentionD1: number;
    retentionD7: number;
  };
  charts: {
    eventsTimeline: { timestamp: Date; count: number }[];
    sessionsTimeline: { timestamp: Date; count: number }[];
  };
  period: 'daily' | 'weekly' | 'monthly';
  onPeriodChange: (period: 'daily' | 'weekly' | 'monthly') => void;
}

export interface FunnelVisualizationProps {
  funnel: {
    name: string;
    steps: {
      name: string;
      entries: number;
      conversionRate: number;
      dropOffRate: number;
    }[];
    totalConversionRate: number;
  };
  colorScheme?: 'blue' | 'green' | 'purple';
}

export interface CohortTableProps {
  cohorts: {
    cohortId: string;
    size: number;
    retention: { day: number; rate: number }[];
  }[];
  highlightThreshold?: number;
}

export interface EventLogProps {
  events: {
    id: string;
    name: string;
    category: string;
    timestamp: Date;
    properties: Record<string, any>;
  }[];
  maxDisplay?: number;
  onEventClick?: (eventId: string) => void;
  filter?: string;
}

export interface ConsentBannerProps {
  consent: {
    analytics: boolean;
    performance: boolean;
    personalization: boolean;
  };
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onCustomize: () => void;
}

export interface PrivacySettingsProps {
  consent: {
    analytics: boolean;
    performance: boolean;
    personalization: boolean;
    errorReporting: boolean;
  };
  onConsentChange: (key: string, value: boolean) => void;
  onExportData: () => void;
  onDeleteData: () => void;
}

// ============================================
// 통합 Analytics 시스템
// ============================================

import { EventTracker, eventTracker } from './eventTracker';
import { SessionManager, sessionManager } from './sessionManager';
import { MetricsAggregator, metricsAggregator } from './metricsAggregator';
import {
  AnalyticsConfig,
  AnalyticsEvent,
  SessionData,
  UserProfile,
  PrivacyConsent,
  AggregatedMetrics,
  FunnelAnalysis,
  CohortAnalysis,
  RealtimeDashboard,
  DEFAULT_ANALYTICS_CONFIG,
} from './types';

/**
 * 통합 Analytics 시스템 인터페이스
 */
export interface AnalyticsSystem {
  // 컴포넌트
  tracker: EventTracker;
  session: SessionManager;
  metrics: MetricsAggregator;

  // 설정
  config: AnalyticsConfig;

  // 초기화
  initialize: (config?: Partial<AnalyticsConfig>) => void;

  // 이벤트 추적
  track: (name: string, properties?: Record<string, any>) => void;
  trackGame: (name: string, properties?: Record<string, any>) => void;
  trackBusiness: (name: string, properties?: Record<string, any>) => void;
  trackProgression: (name: string, properties?: Record<string, any>) => void;
  trackEconomy: (name: string, properties?: Record<string, any>) => void;
  trackUI: (name: string, properties?: Record<string, any>) => void;
  trackError: (type: string, message: string, severity?: 'fatal' | 'error' | 'warning') => void;
  trackPerformance: (metric: string, duration: number, threshold?: number) => void;
  trackScreen: (screen: string, properties?: Record<string, any>) => void;

  // 세션
  startSession: (startDay?: number) => SessionData;
  endSession: () => SessionData | null;
  updateSession: (updates: Partial<SessionData>) => void;
  getCurrentSession: () => SessionData | null;

  // 유저
  identify: (userId: string) => UserProfile;
  getCurrentUser: () => UserProfile | null;

  // 메트릭
  getMetrics: (period?: AggregatedMetrics['period']) => AggregatedMetrics;
  getDashboard: () => RealtimeDashboard;

  // 퍼널
  defineFunnel: (id: string, name: string, steps: { name: string; eventName: string }[]) => void;
  analyzeFunnel: (id: string) => FunnelAnalysis | null;

  // 코호트
  analyzeCohort: (cohortId: string) => CohortAnalysis | null;

  // 개인정보
  setConsent: (consent: Partial<PrivacyConsent>) => void;
  getConsent: () => PrivacyConsent;
  exportUserData: () => object;
  deleteUserData: () => void;

  // 정리
  cleanup: () => void;
}

/**
 * Analytics 시스템 생성
 */
export function createAnalyticsSystem(): AnalyticsSystem {
  let config: AnalyticsConfig = { ...DEFAULT_ANALYTICS_CONFIG };
  let isInitialized = false;

  // 이벤트 플러시 시 메트릭에 추가
  eventTracker.addListener({
    onFlush: (events) => {
      metricsAggregator.addEvents(events);
    },
    onEvent: () => {
      sessionManager.recordEvent('event');
    },
  });

  // 세션 종료 시 메트릭에 추가
  sessionManager.addListener({
    onSessionEnd: (session) => {
      metricsAggregator.addSession(session);
    },
    onUserIdentified: (user) => {
      metricsAggregator.updateUser(user);
    },
  });

  return {
    tracker: eventTracker,
    session: sessionManager,
    metrics: metricsAggregator,
    config,

    initialize: (userConfig?: Partial<AnalyticsConfig>) => {
      if (isInitialized) return;

      if (userConfig) {
        config = { ...config, ...userConfig };
        eventTracker.setConfig(config);
      }

      isInitialized = true;

      if (config.debug) {
        console.log('[Analytics] System initialized');
      }
    },

    // 이벤트 추적 메서드
    track: (name, properties = {}) => {
      eventTracker.track(name, 'custom', properties);
    },
    trackGame: (name, properties = {}) => {
      eventTracker.trackGame(name as any, properties);
    },
    trackBusiness: (name, properties = {}) => {
      eventTracker.trackBusiness(name as any, properties);
    },
    trackProgression: (name, properties = {}) => {
      eventTracker.trackProgression(name as any, properties);
    },
    trackEconomy: (name, properties = {}) => {
      eventTracker.trackEconomy(name as any, properties);
    },
    trackUI: (name, properties = {}) => {
      eventTracker.trackUI(name as any, properties);
    },
    trackError: (type, message, severity = 'error') => {
      eventTracker.trackError(type, message, severity);
    },
    trackPerformance: (metric, duration, threshold) => {
      eventTracker.trackPerformance(metric, duration, threshold);
    },
    trackScreen: (screen, properties = {}) => {
      eventTracker.trackScreenView(screen, properties);
      sessionManager.recordScreenView();
    },

    // 세션 메서드
    startSession: (startDay = 1) => {
      const sessionId = eventTracker.newSession();
      return sessionManager.startSession(sessionId, startDay);
    },
    endSession: () => sessionManager.endSession(),
    updateSession: (updates) => sessionManager.updateSession(updates),
    getCurrentSession: () => sessionManager.getCurrentSession(),

    // 유저 메서드
    identify: (userId) => {
      eventTracker.setUserId(userId);
      return sessionManager.identifyUser(userId);
    },
    getCurrentUser: () => sessionManager.getCurrentUser(),

    // 메트릭 메서드
    getMetrics: (period = 'daily') => metricsAggregator.getAggregatedMetrics(period),
    getDashboard: () => metricsAggregator.getRealtimeDashboard(),

    // 퍼널 메서드
    defineFunnel: (id, name, steps) => metricsAggregator.defineFunnel(id, name, steps),
    analyzeFunnel: (id) => metricsAggregator.analyzeFunnel(id),

    // 코호트 메서드
    analyzeCohort: (cohortId) => metricsAggregator.analyzeCohort(cohortId),

    // 개인정보 메서드
    setConsent: (consent) => sessionManager.setConsent(consent),
    getConsent: () => sessionManager.getConsent(),
    exportUserData: () => {
      const user = sessionManager.getCurrentUser();
      const sessions = sessionManager.getSessionHistory();
      return {
        user,
        sessions,
        exportDate: new Date().toISOString(),
      };
    },
    deleteUserData: () => {
      const user = sessionManager.getCurrentUser();
      if (user && typeof localStorage !== 'undefined') {
        localStorage.removeItem(`${config.storageKey}_user_${user.id}`);
      }
      sessionManager.endSession();
    },

    // 정리
    cleanup: () => {
      eventTracker.cleanup();
      sessionManager.cleanup();
    },
  };
}

// 싱글톤 인스턴스
export const analyticsSystem = createAnalyticsSystem();

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 이벤트 카테고리 한글명
 */
export function getEventCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    game: '게임',
    ui: 'UI',
    business: '비즈니스',
    progression: '진행',
    economy: '경제',
    social: '소셜',
    error: '에러',
    performance: '성능',
    engagement: '참여',
    custom: '커스텀',
  };
  return labels[category] || category;
}

/**
 * 시간 포맷팅
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes % 60}분`;
  } else if (minutes > 0) {
    return `${minutes}분 ${seconds % 60}초`;
  }
  return `${seconds}초`;
}

/**
 * 백분율 포맷팅
 */
export function formatPercentage(rate: number, decimals: number = 1): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

/**
 * 숫자 축약 포맷팅
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

// ============================================
// 사전 정의된 퍼널
// ============================================

/**
 * 기본 퍼널 설정
 */
export function setupDefaultFunnels(): void {
  // 온보딩 퍼널
  analyticsSystem.defineFunnel('onboarding', '온보딩 퍼널', [
    { name: '게임 시작', eventName: 'game_start' },
    { name: '첫 번째 날 완료', eventName: 'day_end' },
    { name: '첫 번째 기능 개발', eventName: 'feature_developed' },
    { name: '첫 번째 마케팅', eventName: 'marketing_launched' },
    { name: '첫 번째 주 완료', eventName: 'milestone_reached' },
  ]);

  // 전환 퍼널
  analyticsSystem.defineFunnel('conversion', '전환 퍼널', [
    { name: '게임 시작', eventName: 'game_start' },
    { name: '튜토리얼 완료', eventName: 'tutorial_complete' },
    { name: '첫 수익', eventName: 'revenue_earned' },
    { name: '첫 업적', eventName: 'achievement_unlocked' },
    { name: '엔딩 도달', eventName: 'ending_reached' },
  ]);

  // 리텐션 퍼널
  analyticsSystem.defineFunnel('retention', '리텐션 퍼널', [
    { name: '첫 세션', eventName: 'game_start' },
    { name: '세션 완료', eventName: 'game_end' },
    { name: '두 번째 세션', eventName: 'game_start' },
    { name: '업적 획득', eventName: 'achievement_unlocked' },
    { name: '장기 플레이어', eventName: 'milestone_reached' },
  ]);
}

export default analyticsSystem;
