/**
 * Chapter 7: Progression & Engagement - Daily/Weekly Goals System
 * 일일/주간 목표 및 연속 기록 시스템
 */

import {
  Goal,
  GoalTier,
  GoalTierConfig,
  GoalReward,
  ActiveGoal,
  DailyGoalConfig,
  WeeklyGoalConfig,
  StreakConfig,
  StreakType,
  StreakState,
  BonusConfig,
  DailySystem,
} from './types';

// ============================================
// 일일 목표 풀
// ============================================

const easyGoals: Goal[] = [
  {
    id: 'play_session',
    desc: '30분 이상 플레이하기',
    condition: { type: 'session_time', value: 30 },
    reward: { points: 5 },
  },
  {
    id: 'complete_task',
    desc: '작업 3개 완료하기',
    condition: { type: 'tasks_completed', value: 3 },
    reward: { points: 5 },
  },
  {
    id: 'handle_event',
    desc: '이벤트 2개 처리하기',
    condition: { type: 'events_handled', value: 2 },
    reward: { points: 5 },
  },
  {
    id: 'earn_revenue',
    desc: '수익 발생시키기',
    condition: { type: 'revenue_earned', value: 1 },
    reward: { points: 5 },
  },
  {
    id: 'save_game',
    desc: '게임 저장하기',
    condition: { type: 'game_saved' },
    reward: { points: 5 },
  },
  {
    id: 'check_analytics',
    desc: '분석 대시보드 확인하기',
    condition: { type: 'analytics_viewed' },
    reward: { points: 5 },
  },
  {
    id: 'rest_once',
    desc: '휴식 1회 하기',
    condition: { type: 'rest_taken', value: 1 },
    reward: { points: 5 },
  },
];

const mediumGoals: Goal[] = [
  {
    id: 'gain_users',
    desc: '사용자 50명 획득',
    condition: { type: 'users_gained', value: 50 },
    reward: { points: 15 },
  },
  {
    id: 'earn_profit',
    desc: '순이익 10만원 달성',
    condition: { type: 'profit_earned', value: 100000 },
    reward: { points: 15 },
  },
  {
    id: 'skill_up',
    desc: '아무 스킬 레벨업',
    condition: { type: 'skill_gained' },
    reward: { points: 15 },
  },
  {
    id: 'npc_interact',
    desc: 'NPC와 상호작용',
    condition: { type: 'npc_interaction' },
    reward: { points: 15 },
  },
  {
    id: 'survive_week',
    desc: '일주일 생존하기',
    condition: { type: 'days_advanced', value: 7 },
    reward: { points: 15 },
  },
  {
    id: 'improve_quality',
    desc: '콘텐츠 품질 5 향상',
    condition: { type: 'quality_improved', value: 5 },
    reward: { points: 15 },
  },
  {
    id: 'marketing_campaign',
    desc: '마케팅 캠페인 실행',
    condition: { type: 'marketing_run' },
    reward: { points: 15 },
  },
  {
    id: 'fix_bugs',
    desc: '버그 3개 수정',
    condition: { type: 'bugs_fixed', value: 3 },
    reward: { points: 15 },
  },
];

const hardGoals: Goal[] = [
  {
    id: 'no_stress',
    desc: '스트레스 50 이하 유지',
    condition: { type: 'stress_max', value: 50 },
    reward: { points: 30, bonus: 'stress_reduction' },
  },
  {
    id: 'perfect_events',
    desc: '모든 이벤트 최선 선택',
    condition: { type: 'perfect_choices', value: 5 },
    reward: { points: 30 },
  },
  {
    id: 'growth_rate',
    desc: '일일 성장률 5% 달성',
    condition: { type: 'growth_rate', value: 0.05 },
    reward: { points: 30 },
  },
  {
    id: 'efficient_day',
    desc: '에너지 20 이상으로 하루 마감',
    condition: { type: 'end_day_energy', value: 20 },
    reward: { points: 30 },
  },
  {
    id: 'big_decision',
    desc: '중요 결정 성공적 처리',
    condition: { type: 'major_decision_success' },
    reward: { points: 30, bonus: 'reputation_boost' },
  },
  {
    id: 'no_deficit',
    desc: '적자 없이 하루 마감',
    condition: { type: 'no_deficit_day' },
    reward: { points: 30 },
  },
  {
    id: 'max_productivity',
    desc: '모든 행동 포인트 사용',
    condition: { type: 'all_actions_used' },
    reward: { points: 30 },
  },
];

const bonusGoals: Goal[] = [
  {
    id: 'viral_moment',
    desc: '바이럴 이벤트 트리거',
    condition: { type: 'viral_triggered' },
    reward: { points: 100, cosmetic: 'daily_star' },
  },
  {
    id: 'zero_to_hundred',
    desc: '하루에 사용자 100명 획득',
    condition: { type: 'daily_users', value: 100 },
    reward: { points: 100 },
  },
  {
    id: 'perfect_balance',
    desc: '모든 자원 50% 이상 유지',
    condition: { type: 'all_resources_above', value: 50 },
    reward: { points: 100 },
  },
  {
    id: 'lucky_day',
    desc: '3개 연속 긍정 이벤트',
    condition: { type: 'consecutive_positive_events', value: 3 },
    reward: { points: 100, bonus: 'luck_boost' },
  },
];

// ============================================
// 일일 목표 설정
// ============================================

export const dailyGoalConfig: DailyGoalConfig = {
  goalsPerDay: 3,
  refreshTime: '00:00',

  goalPool: [
    { tier: 'easy', goals: easyGoals },
    { tier: 'medium', goals: mediumGoals },
    { tier: 'hard', goals: hardGoals },
  ],

  bonusGoal: {
    frequency: 0.2,
    goals: bonusGoals,
  },

  completionRewards: {
    allThree: {
      points: 20,
      bonus: 'daily_chest',
    },
    streak: {
      3: { points: 30, title: '3일 연속' },
      7: { points: 75, cosmetic: 'weekly_badge' },
      14: { points: 150, unlock: 'streak_perk' },
      30: { points: 500, cosmetic: 'monthly_frame' },
    },
  },
};

// ============================================
// 주간 목표
// ============================================

const weeklyGoals: Goal[] = [
  // 누적 목표
  {
    id: 'weekly_users',
    desc: '주간 사용자 500명 획득',
    condition: { type: 'weekly_users_gained', value: 500 },
    reward: { points: 50 },
  },
  {
    id: 'weekly_revenue',
    desc: '주간 매출 100만원',
    condition: { type: 'weekly_revenue', value: 1000000 },
    reward: { points: 50 },
  },
  {
    id: 'weekly_events',
    desc: '이벤트 20개 처리',
    condition: { type: 'weekly_events', value: 20 },
    reward: { points: 50 },
  },
  {
    id: 'weekly_skills',
    desc: '스킬 포인트 10 획득',
    condition: { type: 'weekly_skill_points', value: 10 },
    reward: { points: 50 },
  },
  {
    id: 'weekly_network',
    desc: 'NPC 3명과 관계 개선',
    condition: { type: 'weekly_npc_improved', value: 3 },
    reward: { points: 50 },
  },

  // 유지 목표
  {
    id: 'weekly_healthy',
    desc: '번아웃 없이 일주일',
    condition: { type: 'no_burnout_week' },
    reward: { points: 75 },
  },
  {
    id: 'weekly_profitable',
    desc: '매일 흑자 유지',
    condition: { type: 'daily_profit_week' },
    reward: { points: 75 },
  },
  {
    id: 'weekly_growth',
    desc: '매일 사용자 증가',
    condition: { type: 'daily_growth_week' },
    reward: { points: 75 },
  },
  {
    id: 'weekly_balanced',
    desc: '워라밸 유지 (스트레스 60 이하)',
    condition: { type: 'weekly_stress_below', value: 60 },
    reward: { points: 75 },
  },
  {
    id: 'weekly_engaged',
    desc: '매일 로그인',
    condition: { type: 'daily_login_week' },
    reward: { points: 75 },
  },
];

export const weeklyGoalConfig: WeeklyGoalConfig = {
  goalsPerWeek: 5,
  refreshDay: 'monday',
  goals: weeklyGoals,
  completionRewards: {
    allFive: {
      points: 100,
      bonus: 'weekly_chest',
    },
  },
};

// ============================================
// 연속 기록 설정
// ============================================

const streakTypes: StreakType[] = [
  {
    id: 'login',
    name: '로그인 연속',
    description: '매일 게임 실행',
    rewards: [
      { days: 3, reward: { points: 10 } },
      { days: 7, reward: { points: 25, bonus: 'energy_boost' } },
      { days: 14, reward: { points: 50 } },
      { days: 30, reward: { points: 100, cosmetic: 'streak_30_badge' } },
      { days: 60, reward: { points: 200 } },
      { days: 100, reward: { points: 500, cosmetic: 'streak_100_badge', title: '헌신적인 창업자' } },
    ],
    gracePeriod: 1,
  },
  {
    id: 'daily_complete',
    name: '일일 목표 연속',
    description: '매일 모든 일일 목표 완료',
    rewards: [
      { days: 3, reward: { points: 15 } },
      { days: 7, reward: { points: 40, perk: 'daily_bonus_xp' } },
      { days: 14, reward: { points: 100 } },
      { days: 30, reward: { points: 250, cosmetic: 'completionist_badge' } },
    ],
    gracePeriod: 0,
  },
  {
    id: 'profitable',
    name: '연속 흑자',
    description: '게임 내 연속 흑자 월수',
    rewards: [
      { months: 3, reward: { points: 50 } },
      { months: 6, reward: { points: 100, title: '안정적 사업가' } },
      { months: 12, reward: { points: 300 } },
    ],
  },
  {
    id: 'no_stress',
    name: '스트레스 관리',
    description: '연속 저스트레스 유지',
    rewards: [
      { days: 7, reward: { points: 30 } },
      { days: 14, reward: { points: 60, bonus: 'stress_resistance' } },
      { days: 30, reward: { points: 150, title: '마음의 평화' } },
    ],
    gracePeriod: 1,
  },
];

export const streakConfig: StreakConfig = {
  types: streakTypes,
  onBreak: {
    showMessage: true,
    offerRecovery: {
      enabled: true,
      cost: { type: 'achievement_points', value: 50 },
      maxPerMonth: 2,
    },
  },
};

// ============================================
// 보너스 설정
// ============================================

export const bonusConfig: BonusConfig = {
  firstOfDay: {
    bonus: 'energy_full',
    message: '좋은 아침이에요! 에너지가 가득 찼습니다.',
  },

  returnBonus: {
    afterDays: 3,
    rewards: [
      { days: 3, bonus: { cash: 100000, message: '돌아오셨네요! 작은 선물입니다.' } },
      { days: 7, bonus: { cash: 300000, energy: 100, message: '오랜만이에요! 푸짐한 복귀 보상!' } },
      { days: 30, bonus: { cash: 1000000, all_resources: 100, message: '다시 만나서 반가워요! 특별 보상!' } },
    ],
  },

  timeBonus: {
    morning: { time: [6, 9], bonus: 'planning_efficiency', desc: '아침 계획 보너스' },
    lunchtime: { time: [12, 13], bonus: 'social_bonus', desc: '네트워킹 시간' },
    evening: { time: [18, 21], bonus: 'reflection_xp', desc: '회고 경험치 보너스' },
    lateNight: { time: [0, 3], bonus: 'creativity_boost', desc: '심야 창의력 보너스 (주의: 건강 감소)' },
  },
};

// ============================================
// 통합 일일 시스템
// ============================================

export const dailySystem: DailySystem = {
  dailyGoals: dailyGoalConfig,
  weeklyGoals: weeklyGoalConfig,
  streaks: streakConfig,
  bonuses: bonusConfig,
};

// ============================================
// 일일 목표 관리 클래스
// ============================================

export class DailyGoalManager {
  private activeDaily: ActiveGoal[] = [];
  private activeWeekly: ActiveGoal[] = [];
  private dailyRefreshAt: Date;
  private weeklyRefreshAt: Date;
  private streaks: Map<string, StreakState> = new Map();
  private lastLoginDate: Date | null = null;
  private streakRecoveriesThisMonth: number = 0;

  constructor() {
    this.dailyRefreshAt = this.getNextDailyRefresh();
    this.weeklyRefreshAt = this.getNextWeeklyRefresh();
    this.initializeStreaks();
  }

  private initializeStreaks(): void {
    for (const type of streakTypes) {
      this.streaks.set(type.id, {
        id: type.id,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null,
        recoveredThisMonth: 0,
      });
    }
  }

  private getNextDailyRefresh(): Date {
    const now = new Date();
    const next = new Date(now);
    next.setHours(0, 0, 0, 0);
    if (now >= next) {
      next.setDate(next.getDate() + 1);
    }
    return next;
  }

  private getNextWeeklyRefresh(): Date {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
    const next = new Date(now);
    next.setDate(next.getDate() + daysUntilMonday);
    next.setHours(0, 0, 0, 0);
    return next;
  }

  // 일일 목표 생성
  generateDailyGoals(seed?: number): ActiveGoal[] {
    const rng = seed !== undefined ? this.seededRandom(seed) : Math.random;

    this.activeDaily = [];

    // Easy 목표 1개
    const easyIndex = Math.floor(rng() * easyGoals.length);
    this.activeDaily.push({
      ...easyGoals[easyIndex],
      progress: 0,
      completed: false,
      tier: 'easy',
    });

    // Medium 목표 1개
    const mediumIndex = Math.floor(rng() * mediumGoals.length);
    this.activeDaily.push({
      ...mediumGoals[mediumIndex],
      progress: 0,
      completed: false,
      tier: 'medium',
    });

    // Hard 목표 1개
    const hardIndex = Math.floor(rng() * hardGoals.length);
    this.activeDaily.push({
      ...hardGoals[hardIndex],
      progress: 0,
      completed: false,
      tier: 'hard',
    });

    // 보너스 목표 (20% 확률)
    if (rng() < dailyGoalConfig.bonusGoal.frequency) {
      const bonusIndex = Math.floor(rng() * bonusGoals.length);
      this.activeDaily.push({
        ...bonusGoals[bonusIndex],
        progress: 0,
        completed: false,
        tier: 'bonus',
      });
    }

    this.dailyRefreshAt = this.getNextDailyRefresh();
    return this.activeDaily;
  }

  // 주간 목표 생성
  generateWeeklyGoals(seed?: number): ActiveGoal[] {
    const rng = seed !== undefined ? this.seededRandom(seed) : Math.random;

    this.activeWeekly = [];
    const shuffled = [...weeklyGoals].sort(() => rng() - 0.5);
    const selected = shuffled.slice(0, weeklyGoalConfig.goalsPerWeek);

    for (const goal of selected) {
      this.activeWeekly.push({
        ...goal,
        progress: 0,
        completed: false,
        tier: 'medium',
      });
    }

    this.weeklyRefreshAt = this.getNextWeeklyRefresh();
    return this.activeWeekly;
  }

  private seededRandom(seed: number): () => number {
    return () => {
      seed = Math.sin(seed) * 10000;
      return seed - Math.floor(seed);
    };
  }

  // 목표 진행 업데이트
  updateGoalProgress(goalId: string, progress: number, isWeekly: boolean = false): ActiveGoal | null {
    const goals = isWeekly ? this.activeWeekly : this.activeDaily;
    const goal = goals.find(g => g.id === goalId);

    if (!goal || goal.completed) return null;

    goal.progress = progress;

    // 조건 충족 확인
    if (goal.condition.value !== undefined && progress >= goal.condition.value) {
      goal.completed = true;
    } else if (goal.condition.value === undefined && progress > 0) {
      goal.completed = true;
    }

    return goal;
  }

  // 모든 일일 목표 완료 확인
  areAllDailyComplete(): boolean {
    return this.activeDaily
      .filter(g => g.tier !== 'bonus')
      .every(g => g.completed);
  }

  // 모든 주간 목표 완료 확인
  areAllWeeklyComplete(): boolean {
    return this.activeWeekly.every(g => g.completed);
  }

  // 연속 기록 체크인
  checkInStreak(streakId: string): {
    newStreak: number;
    rewardEarned: GoalReward | null;
    broken: boolean;
  } {
    const streak = this.streaks.get(streakId);
    if (!streak) return { newStreak: 0, rewardEarned: null, broken: false };

    const now = new Date();
    const lastCheckIn = streak.lastCheckIn;
    const streakType = streakTypes.find(t => t.id === streakId);

    if (!streakType) return { newStreak: 0, rewardEarned: null, broken: false };

    let broken = false;

    if (lastCheckIn) {
      const daysSinceLastCheckIn = Math.floor(
        (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastCheckIn > 1 + (streakType.gracePeriod || 0)) {
        // 연속 기록 깨짐
        broken = true;
        streak.currentStreak = 1;
      } else if (daysSinceLastCheckIn >= 1) {
        // 정상 체크인
        streak.currentStreak++;
      }
      // daysSinceLastCheckIn < 1 이면 이미 오늘 체크인 함
    } else {
      streak.currentStreak = 1;
    }

    streak.lastCheckIn = now;
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    // 보상 확인
    let rewardEarned: GoalReward | null = null;
    for (const reward of streakType.rewards) {
      const targetDays = reward.days || (reward.months ? reward.months * 30 : 0);
      if (streak.currentStreak === targetDays) {
        rewardEarned = reward.reward;
        break;
      }
    }

    return { newStreak: streak.currentStreak, rewardEarned, broken };
  }

  // 연속 기록 복구
  recoverStreak(streakId: string, points: number): boolean {
    const streak = this.streaks.get(streakId);
    if (!streak) return false;

    const cost = streakConfig.onBreak.offerRecovery.cost.value;
    if (points < cost) return false;
    if (streak.recoveredThisMonth >= streakConfig.onBreak.offerRecovery.maxPerMonth) return false;

    streak.currentStreak = Math.max(1, streak.currentStreak);
    streak.lastCheckIn = new Date();
    streak.recoveredThisMonth++;

    return true;
  }

  // 시간대 보너스 확인
  getTimeBonus(): { id: string; bonus: string; desc: string } | null {
    const hour = new Date().getHours();

    for (const [id, config] of Object.entries(bonusConfig.timeBonus)) {
      if (hour >= config.time[0] && hour < config.time[1]) {
        return { id, bonus: config.bonus, desc: config.desc };
      }
    }

    return null;
  }

  // 복귀 보너스 확인
  getReturnBonus(lastPlayDate: Date | null): {
    days: number;
    bonus: { cash?: number; energy?: number; all_resources?: number; message: string };
  } | null {
    if (!lastPlayDate) return null;

    const now = new Date();
    const daysSinceLastPlay = Math.floor(
      (now.getTime() - lastPlayDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastPlay < bonusConfig.returnBonus.afterDays) return null;

    // 가장 높은 티어의 보상 반환
    const sortedRewards = [...bonusConfig.returnBonus.rewards].sort((a, b) => b.days - a.days);
    for (const reward of sortedRewards) {
      if (daysSinceLastPlay >= reward.days) {
        return { days: daysSinceLastPlay, bonus: reward.bonus };
      }
    }

    return null;
  }

  // 새로고침 필요 여부
  needsDailyRefresh(): boolean {
    return new Date() >= this.dailyRefreshAt;
  }

  needsWeeklyRefresh(): boolean {
    return new Date() >= this.weeklyRefreshAt;
  }

  // 현재 상태 조회
  getDailyGoals(): ActiveGoal[] {
    return [...this.activeDaily];
  }

  getWeeklyGoals(): ActiveGoal[] {
    return [...this.activeWeekly];
  }

  getStreak(id: string): StreakState | undefined {
    return this.streaks.get(id);
  }

  getAllStreaks(): StreakState[] {
    return Array.from(this.streaks.values());
  }

  // 일일 완료 보상 계산
  getDailyCompletionReward(): GoalReward | null {
    if (!this.areAllDailyComplete()) return null;
    return dailyGoalConfig.completionRewards.allThree;
  }

  // 연속 기록 보상 조회
  getStreakReward(streakId: string): GoalReward | null {
    const streak = this.streaks.get(streakId);
    if (!streak) return null;

    const streakRewards = dailyGoalConfig.completionRewards.streak;
    return streakRewards[streak.currentStreak as keyof typeof streakRewards] || null;
  }

  // 저장/로드
  serialize(): {
    activeDaily: ActiveGoal[];
    activeWeekly: ActiveGoal[];
    dailyRefreshAt: string;
    weeklyRefreshAt: string;
    streaks: Record<string, StreakState>;
    lastLoginDate: string | null;
    streakRecoveriesThisMonth: number;
  } {
    const streaksObj: Record<string, StreakState> = {};
    for (const [id, state] of this.streaks) {
      streaksObj[id] = {
        ...state,
        lastCheckIn: state.lastCheckIn,
      };
    }

    return {
      activeDaily: this.activeDaily,
      activeWeekly: this.activeWeekly,
      dailyRefreshAt: this.dailyRefreshAt.toISOString(),
      weeklyRefreshAt: this.weeklyRefreshAt.toISOString(),
      streaks: streaksObj,
      lastLoginDate: this.lastLoginDate?.toISOString() || null,
      streakRecoveriesThisMonth: this.streakRecoveriesThisMonth,
    };
  }

  deserialize(data: {
    activeDaily: ActiveGoal[];
    activeWeekly: ActiveGoal[];
    dailyRefreshAt: string;
    weeklyRefreshAt: string;
    streaks: Record<string, StreakState>;
    lastLoginDate: string | null;
    streakRecoveriesThisMonth: number;
  }): void {
    this.activeDaily = data.activeDaily;
    this.activeWeekly = data.activeWeekly;
    this.dailyRefreshAt = new Date(data.dailyRefreshAt);
    this.weeklyRefreshAt = new Date(data.weeklyRefreshAt);
    this.lastLoginDate = data.lastLoginDate ? new Date(data.lastLoginDate) : null;
    this.streakRecoveriesThisMonth = data.streakRecoveriesThisMonth;

    this.streaks.clear();
    for (const [id, state] of Object.entries(data.streaks)) {
      this.streaks.set(id, {
        ...state,
        lastCheckIn: state.lastCheckIn ? new Date(state.lastCheckIn) : null,
      });
    }
  }

  // 리셋
  reset(): void {
    this.activeDaily = [];
    this.activeWeekly = [];
    this.dailyRefreshAt = this.getNextDailyRefresh();
    this.weeklyRefreshAt = this.getNextWeeklyRefresh();
  }

  // 월간 리셋 (연속 기록 복구 횟수)
  monthlyReset(): void {
    this.streakRecoveriesThisMonth = 0;
    for (const streak of this.streaks.values()) {
      streak.recoveredThisMonth = 0;
    }
  }
}

// 싱글톤 인스턴스
export const dailyGoalManager = new DailyGoalManager();

export default DailyGoalManager;
