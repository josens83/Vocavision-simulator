/**
 * Chapter 12: Analytics & Telemetry - Event Tracker
 * 이벤트 추적 시스템
 *
 * 이 모듈은 게임 이벤트를 추적하고 배치 처리합니다.
 */

import {
  AnalyticsEvent,
  EventCategory,
  EventPriority,
  EventContext,
  GameEvent,
  BusinessEvent,
  ProgressionEvent,
  EconomyEvent,
  UIEvent,
  ErrorEvent,
  PerformanceEvent,
  AnalyticsConfig,
  DEFAULT_ANALYTICS_CONFIG,
} from './types';

// ============================================
// Event ID Generator
// ============================================

function generateEventId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 9);
  return `evt_${timestamp}_${random}`;
}

// ============================================
// Event Tracker Class
// ============================================

export interface EventTrackerListener {
  onEvent?: (event: AnalyticsEvent) => void;
  onFlush?: (events: AnalyticsEvent[]) => void;
  onError?: (error: string) => void;
  onQueueFull?: () => void;
}

export class EventTracker {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private listeners: Set<EventTrackerListener> = new Set();
  private flushTimer: ReturnType<typeof setInterval> | null = null;
  private sessionId: string;
  private userId?: string;
  private currentContext: Partial<EventContext> = {};
  private eventCounts: Map<string, number> = new Map();

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_ANALYTICS_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
    this.startFlushTimer();
  }

  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 11);
    return `sess_${timestamp}_${random}`;
  }

  // ============================================
  // Configuration
  // ============================================

  setConfig(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    this.restartFlushTimer();
  }

  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  setUserId(userId: string): void {
    if (this.config.hashUserIds) {
      this.userId = this.hashString(userId);
    } else {
      this.userId = userId;
    }
  }

  setContext(context: Partial<EventContext>): void {
    this.currentContext = { ...this.currentContext, ...context };
  }

  getSessionId(): string {
    return this.sessionId;
  }

  newSession(): string {
    this.sessionId = this.generateSessionId();
    this.eventCounts.clear();
    return this.sessionId;
  }

  // ============================================
  // Listener Management
  // ============================================

  addListener(listener: EventTrackerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners<K extends keyof EventTrackerListener>(
    event: K,
    ...args: Parameters<NonNullable<EventTrackerListener[K]>>
  ): void {
    this.listeners.forEach((listener) => {
      const handler = listener[event];
      if (handler) {
        (handler as Function)(...args);
      }
    });
  }

  // ============================================
  // Core Event Tracking
  // ============================================

  /**
   * 이벤트 추적
   */
  track(
    name: string,
    category: EventCategory,
    properties: Record<string, any> = {},
    priority: EventPriority = 'normal',
  ): void {
    if (!this.config.enabled) return;

    // 제외된 이벤트 체크
    if (this.config.excludedEvents.includes(name)) return;

    // 샘플링 체크
    if (!this.shouldSample(category)) return;

    // 이벤트 생성
    const event = this.createEvent(name, category, properties, priority);

    // 속성 필터링
    this.filterProperties(event.properties);

    // 큐에 추가
    this.enqueue(event);

    // 디버그 로깅
    if (this.config.debug) {
      console.log('[Analytics] Event tracked:', event);
    }

    // 리스너 알림
    this.notifyListeners('onEvent', event);

    // 이벤트 카운트 업데이트
    this.eventCounts.set(name, (this.eventCounts.get(name) || 0) + 1);

    // critical 이벤트는 즉시 플러시
    if (priority === 'critical') {
      this.flush();
    }
  }

  /**
   * 이벤트 생성
   */
  private createEvent(
    name: string,
    category: EventCategory,
    properties: Record<string, any>,
    priority: EventPriority,
  ): AnalyticsEvent {
    return {
      id: generateEventId(),
      name,
      category,
      priority,
      timestamp: new Date(),
      sessionId: this.sessionId,
      userId: this.userId,
      properties,
      context: this.buildContext(),
    };
  }

  /**
   * 컨텍스트 빌드
   */
  private buildContext(): EventContext {
    return {
      gameDay: this.currentContext.gameDay ?? 1,
      gamePhase: this.currentContext.gamePhase ?? 'unknown',
      sessionDuration: this.currentContext.sessionDuration ?? 0,
      actionsInSession: this.eventCounts.size,
      platform: this.detectPlatform(),
      version: this.currentContext.version ?? '1.0.0',
      locale: this.currentContext.locale ?? 'ko-KR',
      screen: this.currentContext.screen ?? 'unknown',
      previousScreen: this.currentContext.previousScreen,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      viewportSize:
        typeof window !== 'undefined'
          ? { width: window.innerWidth, height: window.innerHeight }
          : undefined,
    };
  }

  private detectPlatform(): string {
    if (typeof window === 'undefined') return 'server';
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('electron')) return 'desktop';
    if (ua.includes('mobile')) return 'mobile';
    return 'web';
  }

  // ============================================
  // Specialized Track Methods
  // ============================================

  /**
   * 게임 이벤트 추적
   */
  trackGame(name: GameEvent['name'], properties: Record<string, any> = {}): void {
    this.track(name, 'game', properties, name === 'game_end' ? 'high' : 'normal');
  }

  /**
   * 비즈니스 이벤트 추적
   */
  trackBusiness(name: BusinessEvent['name'], properties: Record<string, any> = {}): void {
    this.track(name, 'business', properties, 'normal');
  }

  /**
   * 진행 이벤트 추적
   */
  trackProgression(name: ProgressionEvent['name'], properties: Record<string, any> = {}): void {
    const priority: EventPriority = ['achievement_unlocked', 'ending_reached'].includes(name)
      ? 'high'
      : 'normal';
    this.track(name, 'progression', properties, priority);
  }

  /**
   * 경제 이벤트 추적
   */
  trackEconomy(name: EconomyEvent['name'], properties: Record<string, any> = {}): void {
    this.track(name, 'economy', properties, 'normal');
  }

  /**
   * UI 이벤트 추적
   */
  trackUI(name: UIEvent['name'], properties: Record<string, any> = {}): void {
    this.track(name, 'ui', properties, 'low');
  }

  /**
   * 에러 이벤트 추적
   */
  trackError(
    errorType: string,
    errorMessage: string,
    severity: 'fatal' | 'error' | 'warning' = 'error',
    additionalProps: Record<string, any> = {},
  ): void {
    const priority: EventPriority = severity === 'fatal' ? 'critical' : 'high';

    this.track(
      'error',
      'error',
      {
        errorType,
        errorMessage,
        severity,
        errorStack: new Error().stack,
        ...additionalProps,
      },
      priority,
    );
  }

  /**
   * 성능 이벤트 추적
   */
  trackPerformance(
    metric: string,
    duration: number,
    threshold?: number,
    additionalProps: Record<string, any> = {},
  ): void {
    this.track(
      'performance',
      'performance',
      {
        metric,
        duration,
        threshold,
        exceededThreshold: threshold !== undefined && duration > threshold,
        ...additionalProps,
      },
      'low',
    );
  }

  /**
   * 페이지/화면 뷰 추적
   */
  trackScreenView(screen: string, properties: Record<string, any> = {}): void {
    const previousScreen = this.currentContext.screen;
    this.currentContext.screen = screen;
    this.currentContext.previousScreen = previousScreen;

    this.track(
      'screen_view',
      'ui',
      {
        screen,
        previousScreen,
        ...properties,
      },
      'normal',
    );
  }

  /**
   * 타이밍 추적
   */
  trackTiming(category: string, variable: string, duration: number, label?: string): void {
    this.track(
      'timing',
      'performance',
      {
        timingCategory: category,
        timingVariable: variable,
        timingValue: duration,
        timingLabel: label,
      },
      'low',
    );
  }

  // ============================================
  // Queue Management
  // ============================================

  private enqueue(event: AnalyticsEvent): void {
    // 큐 크기 체크
    if (this.eventQueue.length >= this.config.maxQueueSize) {
      this.notifyListeners('onQueueFull');

      // 오래된 low priority 이벤트 제거
      const lowPriorityIndex = this.eventQueue.findIndex((e) => e.priority === 'low');
      if (lowPriorityIndex !== -1) {
        this.eventQueue.splice(lowPriorityIndex, 1);
      } else {
        // 가장 오래된 이벤트 제거
        this.eventQueue.shift();
      }
    }

    this.eventQueue.push(event);

    // 배치 크기 도달 시 플러시
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    }
  }

  getQueueSize(): number {
    return this.eventQueue.length;
  }

  getQueue(): AnalyticsEvent[] {
    return [...this.eventQueue];
  }

  clearQueue(): void {
    this.eventQueue = [];
  }

  // ============================================
  // Flush Management
  // ============================================

  private startFlushTimer(): void {
    if (this.config.flushInterval > 0) {
      this.flushTimer = setInterval(() => {
        this.flush();
      }, this.config.flushInterval);
    }
  }

  private restartFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.startFlushTimer();
  }

  /**
   * 이벤트 큐 플러시
   */
  flush(): AnalyticsEvent[] {
    if (this.eventQueue.length === 0) return [];

    const events = [...this.eventQueue];
    this.eventQueue = [];

    // 리스너에게 알림
    this.notifyListeners('onFlush', events);

    if (this.config.debug) {
      console.log('[Analytics] Flushed events:', events.length);
    }

    return events;
  }

  // ============================================
  // Sampling & Filtering
  // ============================================

  private shouldSample(category: EventCategory): boolean {
    let rate = this.config.samplingRate;

    // 카테고리별 샘플링 레이트
    if (category === 'error') {
      rate = this.config.errorSamplingRate;
    } else if (category === 'performance') {
      rate = this.config.performanceSamplingRate;
    }

    return Math.random() < rate;
  }

  private filterProperties(properties: Record<string, any>): void {
    for (const key of this.config.excludedProperties) {
      if (key in properties) {
        delete properties[key];
      }
    }
  }

  // ============================================
  // Utility
  // ============================================

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return 'u_' + Math.abs(hash).toString(36);
  }

  getEventCount(eventName?: string): number {
    if (eventName) {
      return this.eventCounts.get(eventName) || 0;
    }
    let total = 0;
    this.eventCounts.forEach((count) => {
      total += count;
    });
    return total;
  }

  // ============================================
  // Cleanup
  // ============================================

  cleanup(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // 남은 이벤트 플러시
    this.flush();
  }
}

// 싱글톤 인스턴스
export const eventTracker = new EventTracker();
