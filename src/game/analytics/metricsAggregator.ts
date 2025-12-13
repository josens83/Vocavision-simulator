/**
 * Chapter 12: Analytics & Telemetry - Metrics Aggregator
 * 메트릭 집계 및 분석
 *
 * 이 모듈은 이벤트 데이터를 분석하고 메트릭을 계산합니다.
 */

import {
  AnalyticsEvent,
  SessionData,
  UserProfile,
  AggregatedMetrics,
  FunnelAnalysis,
  FunnelStep,
  CohortAnalysis,
  EventCategory,
  RealtimeDashboard,
  HeatmapData,
  HeatmapPoint,
  UserJourney,
  JourneyStep,
} from './types';

// ============================================
// Metrics Aggregator Class
// ============================================

export class MetricsAggregator {
  private events: AnalyticsEvent[] = [];
  private sessions: SessionData[] = [];
  private users: Map<string, UserProfile> = new Map();
  private funnels: Map<string, FunnelAnalysis> = new Map();

  // ============================================
  // Data Ingestion
  // ============================================

  /**
   * 이벤트 데이터 추가
   */
  addEvents(events: AnalyticsEvent[]): void {
    this.events.push(...events);

    // 메모리 관리: 최대 10000개 이벤트 유지
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000);
    }
  }

  /**
   * 세션 데이터 추가
   */
  addSession(session: SessionData): void {
    this.sessions.push(session);

    // 최대 1000개 세션 유지
    if (this.sessions.length > 1000) {
      this.sessions = this.sessions.slice(-1000);
    }
  }

  /**
   * 유저 프로필 업데이트
   */
  updateUser(user: UserProfile): void {
    this.users.set(user.id, user);
  }

  // ============================================
  // Aggregated Metrics
  // ============================================

  /**
   * 기간별 메트릭 집계
   */
  getAggregatedMetrics(
    period: AggregatedMetrics['period'] = 'daily',
    date?: Date,
  ): AggregatedMetrics {
    const now = date || new Date();
    const { startDate, endDate } = this.getPeriodRange(period, now);

    // 기간 내 이벤트 필터링
    const periodEvents = this.events.filter(
      (e) => e.timestamp >= startDate && e.timestamp <= endDate,
    );

    // 기간 내 세션 필터링
    const periodSessions = this.sessions.filter(
      (s) => s.startTime >= startDate && s.startTime <= endDate,
    );

    return {
      period,
      startDate,
      endDate,
      sessions: this.calculateSessionMetrics(periodSessions),
      events: this.calculateEventMetrics(periodEvents),
      progression: this.calculateProgressionMetrics(periodSessions),
      engagement: this.calculateEngagementMetrics(periodSessions),
      economy: this.calculateEconomyMetrics(periodEvents),
    };
  }

  private getPeriodRange(
    period: AggregatedMetrics['period'],
    date: Date,
  ): { startDate: Date; endDate: Date } {
    const endDate = new Date(date);
    const startDate = new Date(date);

    switch (period) {
      case 'hourly':
        startDate.setHours(startDate.getHours() - 1);
        break;
      case 'daily':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'weekly':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'monthly':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'all_time':
        startDate.setFullYear(2000);
        break;
    }

    return { startDate, endDate };
  }

  private calculateSessionMetrics(sessions: SessionData[]): AggregatedMetrics['sessions'] {
    const total = sessions.length;
    const uniqueUsers = new Set(sessions.map((s) => s.userId).filter(Boolean)).size;

    const durations = sessions.map((s) => s.duration).filter((d) => d > 0);
    const averageDuration = durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

    // 바운스 세션: 1분 미만 & 이벤트 3개 미만
    const bounceSessions = sessions.filter(
      (s) => s.duration < 60000 && s.eventsCount < 3,
    ).length;
    const bounceRate = total > 0 ? bounceSessions / total : 0;

    return {
      total,
      unique: uniqueUsers,
      averageDuration: Math.round(averageDuration),
      bounceRate: Math.round(bounceRate * 100) / 100,
    };
  }

  private calculateEventMetrics(events: AnalyticsEvent[]): AggregatedMetrics['events'] {
    const total = events.length;

    // 카테고리별 집계
    const byCategory: Record<EventCategory, number> = {
      game: 0,
      ui: 0,
      business: 0,
      progression: 0,
      economy: 0,
      social: 0,
      error: 0,
      performance: 0,
      engagement: 0,
      custom: 0,
    };

    const eventCounts = new Map<string, number>();

    events.forEach((e) => {
      byCategory[e.category] = (byCategory[e.category] || 0) + 1;
      eventCounts.set(e.name, (eventCounts.get(e.name) || 0) + 1);
    });

    // 상위 이벤트
    const topEvents = Array.from(eventCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      total,
      byCategory,
      topEvents,
    };
  }

  private calculateProgressionMetrics(sessions: SessionData[]): AggregatedMetrics['progression'] {
    if (sessions.length === 0) {
      return {
        averageDay: 0,
        completionRate: 0,
        endingsDistribution: {},
      };
    }

    const totalDays = sessions.reduce((sum, s) => sum + s.endDay, 0);
    const averageDay = totalDays / sessions.length;

    // 완료율 (엔딩 도달 세션)
    const completedSessions = sessions.filter((s) =>
      s.conversionEvents.includes('ending_reached'),
    ).length;
    const completionRate = completedSessions / sessions.length;

    // 엔딩 분포 (유저 프로필에서)
    const endingsDistribution: Record<string, number> = {};
    this.users.forEach((user) => {
      user.endingsReached.forEach((ending) => {
        endingsDistribution[ending] = (endingsDistribution[ending] || 0) + 1;
      });
    });

    return {
      averageDay: Math.round(averageDay * 10) / 10,
      completionRate: Math.round(completionRate * 100) / 100,
      endingsDistribution,
    };
  }

  private calculateEngagementMetrics(sessions: SessionData[]): AggregatedMetrics['engagement'] {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 활성 유저 계산
    const dauUsers = new Set(
      sessions.filter((s) => s.startTime >= dayAgo).map((s) => s.userId).filter(Boolean),
    );
    const wauUsers = new Set(
      sessions.filter((s) => s.startTime >= weekAgo).map((s) => s.userId).filter(Boolean),
    );
    const mauUsers = new Set(
      sessions.filter((s) => s.startTime >= monthAgo).map((s) => s.userId).filter(Boolean),
    );

    // 리텐션 계산 (간소화된 버전)
    const retentionD1 = this.calculateRetention(sessions, 1);
    const retentionD7 = this.calculateRetention(sessions, 7);
    const retentionD30 = this.calculateRetention(sessions, 30);

    return {
      dau: dauUsers.size,
      wau: wauUsers.size,
      mau: mauUsers.size,
      retentionD1,
      retentionD7,
      retentionD30,
    };
  }

  private calculateRetention(sessions: SessionData[], days: number): number {
    // 간소화된 리텐션 계산
    // 첫 번째 세션 이후 N일 뒤에 돌아온 유저 비율
    const userFirstSession = new Map<string, Date>();
    const userReturnedAfter = new Set<string>();

    sessions.forEach((s) => {
      if (!s.userId) return;

      if (!userFirstSession.has(s.userId)) {
        userFirstSession.set(s.userId, s.startTime);
      } else {
        const firstTime = userFirstSession.get(s.userId)!;
        const daysDiff = (s.startTime.getTime() - firstTime.getTime()) / (24 * 60 * 60 * 1000);
        if (daysDiff >= days) {
          userReturnedAfter.add(s.userId);
        }
      }
    });

    const totalUsers = userFirstSession.size;
    return totalUsers > 0 ? Math.round((userReturnedAfter.size / totalUsers) * 100) / 100 : 0;
  }

  private calculateEconomyMetrics(events: AnalyticsEvent[]): AggregatedMetrics['economy'] {
    const economyEvents = events.filter((e) => e.category === 'economy');

    let totalRevenue = 0;
    let totalExpenses = 0;
    let revenueCount = 0;
    let expenseCount = 0;
    let totalUsers = 0;
    let userCount = 0;

    economyEvents.forEach((e) => {
      if (e.name === 'revenue_earned') {
        totalRevenue += e.properties.amount || 0;
        revenueCount++;
      } else if (e.name === 'expense_incurred') {
        totalExpenses += e.properties.amount || 0;
        expenseCount++;
      } else if (e.name === 'user_acquired') {
        totalUsers += e.properties.count || 1;
        userCount++;
      }
    });

    return {
      averageRevenue: revenueCount > 0 ? Math.round(totalRevenue / revenueCount) : 0,
      averageExpenses: expenseCount > 0 ? Math.round(totalExpenses / expenseCount) : 0,
      averageBalance: Math.round(totalRevenue - totalExpenses),
      averageUsers: userCount > 0 ? Math.round(totalUsers / userCount) : 0,
    };
  }

  // ============================================
  // Funnel Analysis
  // ============================================

  /**
   * 퍼널 정의
   */
  defineFunnel(
    id: string,
    name: string,
    stepEvents: { name: string; eventName: string }[],
  ): void {
    const steps: FunnelStep[] = stepEvents.map((step, index) => ({
      order: index + 1,
      name: step.name,
      eventName: step.eventName,
      entries: 0,
      exits: 0,
      conversionRate: 0,
      dropOffRate: 0,
      averageTimeInStep: 0,
    }));

    this.funnels.set(id, {
      id,
      name,
      steps,
      totalEntries: 0,
      totalCompletions: 0,
      conversionRate: 0,
      averageTimeToComplete: 0,
    });
  }

  /**
   * 퍼널 분석 실행
   */
  analyzeFunnel(funnelId: string): FunnelAnalysis | null {
    const funnel = this.funnels.get(funnelId);
    if (!funnel) return null;

    // 세션별 퍼널 진행 분석
    const sessionFunnels = new Map<string, { steps: number[]; times: Date[] }>();

    // 이벤트를 세션별로 그룹화하고 퍼널 단계 추적
    this.events.forEach((event) => {
      const stepIndex = funnel.steps.findIndex((s) => s.eventName === event.name);
      if (stepIndex === -1) return;

      if (!sessionFunnels.has(event.sessionId)) {
        sessionFunnels.set(event.sessionId, { steps: [], times: [] });
      }

      const sessionData = sessionFunnels.get(event.sessionId)!;
      sessionData.steps.push(stepIndex);
      sessionData.times.push(event.timestamp);
    });

    // 각 단계별 진입/이탈 계산
    const stepEntries = new Array(funnel.steps.length).fill(0);
    const stepCompletions = new Array(funnel.steps.length).fill(0);
    const stepTimes: number[][] = funnel.steps.map(() => []);

    sessionFunnels.forEach((data) => {
      let maxStep = -1;
      let prevTime: Date | null = null;

      // 순서대로 단계 진행 확인
      data.steps.forEach((step, i) => {
        if (step === maxStep + 1) {
          maxStep = step;
          stepEntries[step]++;

          if (prevTime) {
            const timeDiff = data.times[i].getTime() - prevTime.getTime();
            stepTimes[step - 1].push(timeDiff);
          }
          prevTime = data.times[i];
        }
      });

      // 완료된 단계 기록
      for (let i = 0; i <= maxStep; i++) {
        stepCompletions[i]++;
      }
    });

    // 퍼널 메트릭 계산
    funnel.totalEntries = stepEntries[0];
    funnel.totalCompletions = stepEntries[funnel.steps.length - 1] || 0;
    funnel.conversionRate = funnel.totalEntries > 0
      ? funnel.totalCompletions / funnel.totalEntries
      : 0;

    funnel.steps.forEach((step, i) => {
      step.entries = stepEntries[i];
      step.exits = stepEntries[i] - (stepEntries[i + 1] || stepCompletions[i]);
      step.conversionRate = stepEntries[i] > 0 && stepEntries[i + 1]
        ? stepEntries[i + 1] / stepEntries[i]
        : i === funnel.steps.length - 1 ? 1 : 0;
      step.dropOffRate = 1 - step.conversionRate;
      step.averageTimeInStep = stepTimes[i].length > 0
        ? stepTimes[i].reduce((a, b) => a + b, 0) / stepTimes[i].length
        : 0;
    });

    // 전체 완료 시간 계산
    let totalCompletionTime = 0;
    let completionCount = 0;

    sessionFunnels.forEach((data) => {
      if (data.steps.includes(funnel.steps.length - 1) && data.steps.includes(0)) {
        const firstIndex = data.steps.indexOf(0);
        const lastIndex = data.steps.lastIndexOf(funnel.steps.length - 1);
        if (firstIndex < lastIndex) {
          totalCompletionTime += data.times[lastIndex].getTime() - data.times[firstIndex].getTime();
          completionCount++;
        }
      }
    });

    funnel.averageTimeToComplete = completionCount > 0
      ? totalCompletionTime / completionCount
      : 0;

    return funnel;
  }

  /**
   * 모든 퍼널 목록
   */
  getFunnels(): FunnelAnalysis[] {
    return Array.from(this.funnels.values());
  }

  // ============================================
  // Cohort Analysis
  // ============================================

  /**
   * 코호트 분석
   */
  analyzeCohort(cohortId: string): CohortAnalysis | null {
    // 코호트에 속한 유저 찾기
    const cohortUsers: UserProfile[] = [];
    this.users.forEach((user) => {
      if (user.cohort === cohortId) {
        cohortUsers.push(user);
      }
    });

    if (cohortUsers.length === 0) return null;

    // 코호트 날짜 파싱 (YYYY.WW 형식)
    const [year, week] = cohortId.match(/(\d{4})W(\d{2})/)?.slice(1).map(Number) || [2024, 1];
    const cohortDate = this.getDateFromWeek(year, week);

    // 리텐션 계산
    const retention = this.calculateCohortRetention(cohortUsers, cohortDate);

    // 행동 메트릭 계산
    const behavior = {
      averageSessionsPerUser: cohortUsers.reduce((sum, u) => sum + u.totalSessions, 0) / cohortUsers.length,
      averagePlayTime: cohortUsers.reduce((sum, u) => sum + u.totalPlayTime, 0) / cohortUsers.length,
      averageProgress: cohortUsers.reduce((sum, u) => sum + u.highestDay, 0) / cohortUsers.length,
    };

    return {
      cohortId,
      cohortDate,
      size: cohortUsers.length,
      retention,
      behavior,
    };
  }

  private calculateCohortRetention(
    users: UserProfile[],
    startDate: Date,
  ): CohortAnalysis['retention'] {
    const retention: CohortAnalysis['retention'] = [];
    const daysToCheck = [1, 3, 7, 14, 30];

    daysToCheck.forEach((day) => {
      const cutoffDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
      const returnedUsers = users.filter((u) => u.lastSeenAt >= cutoffDate).length;
      const rate = users.length > 0 ? returnedUsers / users.length : 0;

      retention.push({
        day,
        users: returnedUsers,
        rate: Math.round(rate * 100) / 100,
      });
    });

    return retention;
  }

  private getDateFromWeek(year: number, week: number): Date {
    const date = new Date(year, 0, 1);
    date.setDate(date.getDate() + (week - 1) * 7);
    return date;
  }

  // ============================================
  // Real-time Dashboard
  // ============================================

  /**
   * 실시간 대시보드 데이터
   */
  getRealtimeDashboard(): RealtimeDashboard {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);

    // 활성 세션
    const activeSessions = this.sessions.filter(
      (s) => !s.endTime && s.startTime >= new Date(now.getTime() - 30 * 60000),
    ).length;

    // 최근 1분 이벤트/에러
    const recentEvents = this.events.filter((e) => e.timestamp >= oneMinuteAgo);
    const eventsPerMinute = recentEvents.length;
    const errorsPerMinute = recentEvents.filter((e) => e.category === 'error').length;

    // 최근 5분 이벤트 (UI용)
    const displayEvents = this.events
      .filter((e) => e.timestamp >= fiveMinutesAgo)
      .slice(-50);

    // 이벤트 타임라인 (5분, 30초 간격)
    const eventsTimeline = this.createTimeline(fiveMinutesAgo, now, 30000);

    // 세션 타임라인
    const sessionsTimeline = this.createSessionsTimeline(fiveMinutesAgo, now, 30000);

    // 화면 분포
    const screenDistribution: Record<string, number> = {};
    this.sessions
      .filter((s) => !s.endTime)
      .forEach((s) => {
        const screen = 'unknown'; // 실제로는 마지막 screen_view 이벤트에서 가져옴
        screenDistribution[screen] = (screenDistribution[screen] || 0) + 1;
      });

    // 게임 일차 분포
    const dayDistribution: Record<string, number> = {};
    this.sessions
      .filter((s) => !s.endTime)
      .forEach((s) => {
        const dayBucket = Math.floor(s.endDay / 30) * 30;
        const label = `Day ${dayBucket}-${dayBucket + 29}`;
        dayDistribution[label] = (dayDistribution[label] || 0) + 1;
      });

    return {
      activeSessions,
      eventsPerMinute,
      errorsPerMinute,
      recentEvents: displayEvents,
      eventsTimeline,
      sessionsTimeline,
      screenDistribution,
      dayDistribution,
    };
  }

  private createTimeline(
    start: Date,
    end: Date,
    intervalMs: number,
  ): { timestamp: Date; count: number }[] {
    const timeline: { timestamp: Date; count: number }[] = [];
    let current = start.getTime();

    while (current <= end.getTime()) {
      const next = current + intervalMs;
      const count = this.events.filter(
        (e) => e.timestamp.getTime() >= current && e.timestamp.getTime() < next,
      ).length;
      timeline.push({ timestamp: new Date(current), count });
      current = next;
    }

    return timeline;
  }

  private createSessionsTimeline(
    start: Date,
    end: Date,
    intervalMs: number,
  ): { timestamp: Date; count: number }[] {
    const timeline: { timestamp: Date; count: number }[] = [];
    let current = start.getTime();

    while (current <= end.getTime()) {
      const checkTime = new Date(current);
      const count = this.sessions.filter(
        (s) => s.startTime <= checkTime && (!s.endTime || s.endTime >= checkTime),
      ).length;
      timeline.push({ timestamp: checkTime, count });
      current += intervalMs;
    }

    return timeline;
  }

  // ============================================
  // User Journey
  // ============================================

  /**
   * 유저 여정 추적
   */
  getUserJourney(sessionId: string): UserJourney | null {
    const sessionEvents = this.events
      .filter((e) => e.sessionId === sessionId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    if (sessionEvents.length === 0) return null;

    const session = this.sessions.find((s) => s.id === sessionId);
    if (!session) return null;

    const steps: JourneyStep[] = [];
    let prevTime = session.startTime;

    sessionEvents.forEach((event, index) => {
      steps.push({
        order: index + 1,
        timestamp: event.timestamp,
        screen: event.context.screen,
        action: event.name,
        duration: event.timestamp.getTime() - prevTime.getTime(),
        properties: event.properties,
      });
      prevTime = event.timestamp;
    });

    const hasEnding = sessionEvents.some((e) => e.name === 'ending_reached');
    const outcome: UserJourney['outcome'] = session.endTime
      ? hasEnding
        ? 'complete'
        : 'abandon'
      : 'ongoing';

    return {
      userId: session.userId || 'anonymous',
      sessionId,
      steps,
      startTime: session.startTime,
      endTime: session.endTime,
      outcome,
    };
  }

  // ============================================
  // Heatmap (Simplified)
  // ============================================

  /**
   * 히트맵 데이터 생성 (간소화)
   */
  generateHeatmap(
    screen: string,
    startDate: Date,
    endDate: Date,
  ): HeatmapData {
    const screenEvents = this.events.filter(
      (e) =>
        e.context.screen === screen &&
        e.timestamp >= startDate &&
        e.timestamp <= endDate &&
        e.category === 'ui',
    );

    const points: HeatmapPoint[] = [];
    const pointCounts = new Map<string, number>();

    screenEvents.forEach((e) => {
      if (e.properties.x !== undefined && e.properties.y !== undefined) {
        // 그리드로 정규화 (10px 단위)
        const gridX = Math.floor(e.properties.x / 10) * 10;
        const gridY = Math.floor(e.properties.y / 10) * 10;
        const key = `${gridX},${gridY}`;
        pointCounts.set(key, (pointCounts.get(key) || 0) + 1);
      }
    });

    pointCounts.forEach((count, key) => {
      const [x, y] = key.split(',').map(Number);
      points.push({
        x,
        y,
        count,
        type: 'click',
      });
    });

    return {
      screen,
      period: { start: startDate, end: endDate },
      interactions: points,
      totalInteractions: screenEvents.length,
    };
  }

  // ============================================
  // Data Export
  // ============================================

  /**
   * 모든 데이터 내보내기
   */
  exportData(): {
    events: AnalyticsEvent[];
    sessions: SessionData[];
    users: UserProfile[];
    funnels: FunnelAnalysis[];
  } {
    return {
      events: [...this.events],
      sessions: [...this.sessions],
      users: Array.from(this.users.values()),
      funnels: Array.from(this.funnels.values()),
    };
  }

  /**
   * 데이터 가져오기
   */
  importData(data: {
    events?: AnalyticsEvent[];
    sessions?: SessionData[];
    users?: UserProfile[];
  }): void {
    if (data.events) {
      this.events = data.events.map((e) => ({
        ...e,
        timestamp: new Date(e.timestamp),
      }));
    }
    if (data.sessions) {
      this.sessions = data.sessions.map((s) => ({
        ...s,
        startTime: new Date(s.startTime),
        endTime: s.endTime ? new Date(s.endTime) : undefined,
      }));
    }
    if (data.users) {
      data.users.forEach((u) => {
        this.users.set(u.id, {
          ...u,
          createdAt: new Date(u.createdAt),
          lastSeenAt: new Date(u.lastSeenAt),
        });
      });
    }
  }

  // ============================================
  // Cleanup
  // ============================================

  clear(): void {
    this.events = [];
    this.sessions = [];
    this.users.clear();
    this.funnels.clear();
  }
}

// 싱글톤 인스턴스
export const metricsAggregator = new MetricsAggregator();
