/**
 * Chapter 12: Analytics & Telemetry - Session Manager
 * 세션 및 유저 프로필 관리
 *
 * 이 모듈은 세션 추적, 유저 프로필 관리를 처리합니다.
 */

import {
  SessionData,
  UserProfile,
  PrivacyConsent,
  AnalyticsConfig,
  DEFAULT_ANALYTICS_CONFIG,
} from './types';

// ============================================
// Session Manager
// ============================================

export interface SessionManagerListener {
  onSessionStart?: (session: SessionData) => void;
  onSessionEnd?: (session: SessionData) => void;
  onSessionUpdate?: (session: SessionData) => void;
  onUserIdentified?: (user: UserProfile) => void;
  onConsentChanged?: (consent: PrivacyConsent) => void;
}

export class SessionManager {
  private config: AnalyticsConfig;
  private currentSession: SessionData | null = null;
  private currentUser: UserProfile | null = null;
  private consent: PrivacyConsent;
  private listeners: Set<SessionManagerListener> = new Set();
  private sessionTimer: ReturnType<typeof setInterval> | null = null;
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private lastActivity: Date = new Date();

  // 세션 설정
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30분 비활동 시 세션 종료
  private readonly SESSION_UPDATE_INTERVAL = 10 * 1000; // 10초마다 세션 업데이트

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_ANALYTICS_CONFIG, ...config };
    this.consent = this.loadConsent();
  }

  // ============================================
  // Listener Management
  // ============================================

  addListener(listener: SessionManagerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners<K extends keyof SessionManagerListener>(
    event: K,
    ...args: Parameters<NonNullable<SessionManagerListener[K]>>
  ): void {
    this.listeners.forEach((listener) => {
      const handler = listener[event];
      if (handler) {
        (handler as Function)(...args);
      }
    });
  }

  // ============================================
  // Session Management
  // ============================================

  /**
   * 세션 시작
   */
  startSession(sessionId: string, startDay: number = 1): SessionData {
    // 기존 세션 종료
    if (this.currentSession) {
      this.endSession();
    }

    const now = new Date();

    this.currentSession = {
      id: sessionId,
      userId: this.currentUser?.id,
      startTime: now,
      duration: 0,
      eventsCount: 0,
      errorsCount: 0,
      screenViews: 0,
      actionsPerformed: 0,
      startDay,
      endDay: startDay,
      daysProgressed: 0,
      isEngaged: false,
      engagementScore: 0,
      platform: this.detectPlatform(),
      version: this.config.storageKey.split('_')[1] || '1.0.0',
      locale: this.getLocale(),
      referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      conversionEvents: [],
    };

    // 세션 업데이트 타이머 시작
    this.startSessionTimer();

    // 비활동 타이머 시작
    this.resetInactivityTimer();

    // 저장
    this.saveSession();

    // 알림
    this.notifyListeners('onSessionStart', this.currentSession);

    if (this.config.debug) {
      console.log('[Analytics] Session started:', this.currentSession.id);
    }

    return this.currentSession;
  }

  /**
   * 세션 종료
   */
  endSession(): SessionData | null {
    if (!this.currentSession) return null;

    const session = this.currentSession;
    session.endTime = new Date();
    session.duration = session.endTime.getTime() - session.startTime.getTime();

    // 참여도 점수 계산
    session.engagementScore = this.calculateEngagementScore(session);
    session.isEngaged = session.engagementScore >= 50;

    // 타이머 정리
    this.stopSessionTimer();
    this.clearInactivityTimer();

    // 유저 프로필 업데이트
    if (this.currentUser) {
      this.updateUserWithSession(session);
    }

    // 저장
    this.saveSession();
    this.saveSessionHistory(session);

    // 알림
    this.notifyListeners('onSessionEnd', session);

    if (this.config.debug) {
      console.log('[Analytics] Session ended:', session.id, 'Duration:', session.duration);
    }

    this.currentSession = null;
    return session;
  }

  /**
   * 세션 업데이트
   */
  updateSession(updates: Partial<SessionData>): void {
    if (!this.currentSession) return;

    this.currentSession = { ...this.currentSession, ...updates };

    // 진행도 업데이트
    if (updates.endDay !== undefined) {
      this.currentSession.daysProgressed = this.currentSession.endDay - this.currentSession.startDay;
    }

    // 알림
    this.notifyListeners('onSessionUpdate', this.currentSession);
  }

  /**
   * 이벤트 기록
   */
  recordEvent(eventName: string): void {
    if (!this.currentSession) return;

    this.currentSession.eventsCount++;
    this.recordActivity();

    // 전환 이벤트 체크
    const conversionEvents = [
      'game_start',
      'day_end',
      'achievement_unlocked',
      'ending_reached',
    ];
    if (conversionEvents.includes(eventName) && !this.currentSession.conversionEvents.includes(eventName)) {
      this.currentSession.conversionEvents.push(eventName);
    }
  }

  /**
   * 에러 기록
   */
  recordError(): void {
    if (!this.currentSession) return;
    this.currentSession.errorsCount++;
  }

  /**
   * 화면 뷰 기록
   */
  recordScreenView(): void {
    if (!this.currentSession) return;
    this.currentSession.screenViews++;
    this.recordActivity();
  }

  /**
   * 액션 기록
   */
  recordAction(): void {
    if (!this.currentSession) return;
    this.currentSession.actionsPerformed++;
    this.recordActivity();
  }

  /**
   * 활동 기록 (비활동 타이머 리셋)
   */
  recordActivity(): void {
    this.lastActivity = new Date();
    this.resetInactivityTimer();
  }

  // ============================================
  // Session Timer
  // ============================================

  private startSessionTimer(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }

    this.sessionTimer = setInterval(() => {
      if (this.currentSession) {
        this.currentSession.duration = Date.now() - this.currentSession.startTime.getTime();
        this.saveSession();
      }
    }, this.SESSION_UPDATE_INTERVAL);
  }

  private stopSessionTimer(): void {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }
  }

  private resetInactivityTimer(): void {
    this.clearInactivityTimer();

    this.inactivityTimer = setTimeout(() => {
      if (this.config.debug) {
        console.log('[Analytics] Session timeout due to inactivity');
      }
      this.endSession();
    }, this.SESSION_TIMEOUT);
  }

  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
  }

  // ============================================
  // User Profile Management
  // ============================================

  /**
   * 유저 식별
   */
  identifyUser(userId: string): UserProfile {
    // 기존 프로필 로드 시도
    const existingProfile = this.loadUserProfile(userId);

    if (existingProfile) {
      this.currentUser = existingProfile;
      this.currentUser.lastSeenAt = new Date();
    } else {
      // 새 프로필 생성
      this.currentUser = this.createUserProfile(userId);
    }

    // 세션에 유저 ID 연결
    if (this.currentSession) {
      this.currentSession.userId = this.currentUser.id;
    }

    // 저장
    this.saveUserProfile();

    // 알림
    this.notifyListeners('onUserIdentified', this.currentUser);

    return this.currentUser;
  }

  private createUserProfile(userId: string): UserProfile {
    const now = new Date();

    return {
      id: this.config.hashUserIds ? this.hashString(userId) : userId,
      createdAt: now,
      lastSeenAt: now,
      totalSessions: 0,
      totalPlayTime: 0,
      averageSessionDuration: 0,
      highestDay: 1,
      endingsReached: [],
      achievementsUnlocked: [],
      preferredActions: [],
      playStyle: 'unknown',
      skillLevel: 'beginner',
      cohort: this.generateCohortId(now),
      segments: [],
      abTestGroups: {},
    };
  }

  private updateUserWithSession(session: SessionData): void {
    if (!this.currentUser) return;

    this.currentUser.totalSessions++;
    this.currentUser.totalPlayTime += Math.floor(session.duration / 60000);
    this.currentUser.averageSessionDuration = Math.floor(
      this.currentUser.totalPlayTime / this.currentUser.totalSessions,
    );
    this.currentUser.lastSeenAt = new Date();

    if (session.endDay > this.currentUser.highestDay) {
      this.currentUser.highestDay = session.endDay;
    }

    // 스킬 레벨 업데이트
    this.currentUser.skillLevel = this.calculateSkillLevel(this.currentUser);

    // 플레이 스타일 업데이트
    this.currentUser.playStyle = this.analyzePlayStyle(session);

    this.saveUserProfile();
  }

  /**
   * 유저 업적 추가
   */
  addUserAchievement(achievementId: string): void {
    if (!this.currentUser) return;
    if (!this.currentUser.achievementsUnlocked.includes(achievementId)) {
      this.currentUser.achievementsUnlocked.push(achievementId);
      this.saveUserProfile();
    }
  }

  /**
   * 유저 엔딩 추가
   */
  addUserEnding(endingId: string): void {
    if (!this.currentUser) return;
    if (!this.currentUser.endingsReached.includes(endingId)) {
      this.currentUser.endingsReached.push(endingId);
      this.saveUserProfile();
    }
  }

  /**
   * A/B 테스트 그룹 설정
   */
  setABTestGroup(testId: string, variant: string): void {
    if (!this.currentUser) return;
    this.currentUser.abTestGroups[testId] = variant;
    this.saveUserProfile();
  }

  /**
   * 유저 세그먼트 추가
   */
  addUserSegment(segment: string): void {
    if (!this.currentUser) return;
    if (!this.currentUser.segments.includes(segment)) {
      this.currentUser.segments.push(segment);
      this.saveUserProfile();
    }
  }

  // ============================================
  // Consent Management
  // ============================================

  /**
   * 동의 설정
   */
  setConsent(consent: Partial<PrivacyConsent>): void {
    this.consent = {
      ...this.consent,
      ...consent,
      consentDate: new Date(),
    };

    this.saveConsent();
    this.notifyListeners('onConsentChanged', this.consent);
  }

  getConsent(): PrivacyConsent {
    return { ...this.consent };
  }

  hasConsent(type: keyof Pick<PrivacyConsent, 'analytics' | 'performance' | 'personalization' | 'errorReporting' | 'abTesting'>): boolean {
    return this.consent[type] ?? false;
  }

  private loadConsent(): PrivacyConsent {
    if (typeof localStorage === 'undefined') {
      return this.getDefaultConsent();
    }

    try {
      const saved = localStorage.getItem(`${this.config.storageKey}_consent`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('[Analytics] Failed to load consent:', e);
    }

    return this.getDefaultConsent();
  }

  private getDefaultConsent(): PrivacyConsent {
    return {
      analytics: true,
      performance: true,
      personalization: false,
      errorReporting: true,
      abTesting: true,
      consentVersion: '1.0',
      dataRetentionDays: 365,
      allowExport: true,
      allowDeletion: true,
    };
  }

  private saveConsent(): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem(`${this.config.storageKey}_consent`, JSON.stringify(this.consent));
    } catch (e) {
      console.error('[Analytics] Failed to save consent:', e);
    }
  }

  // ============================================
  // Calculations
  // ============================================

  private calculateEngagementScore(session: SessionData): number {
    let score = 0;

    // 세션 길이 (최대 30점)
    const durationMinutes = session.duration / 60000;
    score += Math.min(durationMinutes * 2, 30);

    // 이벤트 수 (최대 25점)
    score += Math.min(session.eventsCount * 0.5, 25);

    // 화면 뷰 (최대 15점)
    score += Math.min(session.screenViews * 3, 15);

    // 액션 수 (최대 20점)
    score += Math.min(session.actionsPerformed * 2, 20);

    // 진행도 (최대 10점)
    score += Math.min(session.daysProgressed * 2, 10);

    return Math.min(Math.round(score), 100);
  }

  private calculateSkillLevel(user: UserProfile): UserProfile['skillLevel'] {
    const score =
      user.totalSessions * 2 +
      user.highestDay * 3 +
      user.achievementsUnlocked.length * 5 +
      user.endingsReached.length * 10;

    if (score >= 200) return 'expert';
    if (score >= 100) return 'advanced';
    if (score >= 30) return 'intermediate';
    return 'beginner';
  }

  private analyzePlayStyle(session: SessionData): UserProfile['playStyle'] {
    // 세션 데이터 기반 플레이 스타일 분석
    const actionsPerMinute = session.actionsPerformed / Math.max(session.duration / 60000, 1);
    const progressRate = session.daysProgressed / Math.max(session.duration / 3600000, 1);

    if (actionsPerMinute > 5 && progressRate > 10) {
      return 'aggressive';
    } else if (actionsPerMinute < 2 && progressRate < 5) {
      return 'conservative';
    } else {
      return 'balanced';
    }
  }

  // ============================================
  // Storage
  // ============================================

  private saveSession(): void {
    if (typeof localStorage === 'undefined' || !this.currentSession) return;

    try {
      localStorage.setItem(
        `${this.config.storageKey}_current_session`,
        JSON.stringify(this.currentSession),
      );
    } catch (e) {
      console.error('[Analytics] Failed to save session:', e);
    }
  }

  private saveSessionHistory(session: SessionData): void {
    if (typeof localStorage === 'undefined') return;

    try {
      const historyKey = `${this.config.storageKey}_session_history`;
      const existing = localStorage.getItem(historyKey);
      const history: SessionData[] = existing ? JSON.parse(existing) : [];

      // 최근 100개만 유지
      history.unshift(session);
      if (history.length > 100) {
        history.pop();
      }

      localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (e) {
      console.error('[Analytics] Failed to save session history:', e);
    }
  }

  private saveUserProfile(): void {
    if (typeof localStorage === 'undefined' || !this.currentUser) return;

    try {
      localStorage.setItem(
        `${this.config.storageKey}_user_${this.currentUser.id}`,
        JSON.stringify(this.currentUser),
      );
    } catch (e) {
      console.error('[Analytics] Failed to save user profile:', e);
    }
  }

  private loadUserProfile(userId: string): UserProfile | null {
    if (typeof localStorage === 'undefined') return null;

    try {
      const hashedId = this.config.hashUserIds ? this.hashString(userId) : userId;
      const saved = localStorage.getItem(`${this.config.storageKey}_user_${hashedId}`);
      if (saved) {
        const profile = JSON.parse(saved);
        profile.createdAt = new Date(profile.createdAt);
        profile.lastSeenAt = new Date(profile.lastSeenAt);
        return profile;
      }
    } catch (e) {
      console.error('[Analytics] Failed to load user profile:', e);
    }

    return null;
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

  private detectPlatform(): string {
    if (typeof window === 'undefined') return 'server';
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('electron')) return 'desktop';
    if (ua.includes('mobile')) return 'mobile';
    return 'web';
  }

  private getLocale(): string {
    if (typeof navigator !== 'undefined') {
      return navigator.language || 'ko-KR';
    }
    return 'ko-KR';
  }

  private generateCohortId(date: Date): string {
    const year = date.getFullYear();
    const week = this.getWeekNumber(date);
    return `${year}W${week.toString().padStart(2, '0')}`;
  }

  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  // ============================================
  // Getters
  // ============================================

  getCurrentSession(): SessionData | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser ? { ...this.currentUser } : null;
  }

  getSessionHistory(): SessionData[] {
    if (typeof localStorage === 'undefined') return [];

    try {
      const historyKey = `${this.config.storageKey}_session_history`;
      const existing = localStorage.getItem(historyKey);
      return existing ? JSON.parse(existing) : [];
    } catch (e) {
      return [];
    }
  }

  // ============================================
  // Cleanup
  // ============================================

  cleanup(): void {
    this.endSession();
    this.stopSessionTimer();
    this.clearInactivityTimer();
  }
}

// 싱글톤 인스턴스
export const sessionManager = new SessionManager();
