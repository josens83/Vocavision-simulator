/**
 * Chapter 7: Progression & Engagement - Main Entry Point
 * 진행 및 참여 시스템 메인 엔트리 포인트
 *
 * 이 모듈은 VocaVision 시뮬레이터의 진행 및 참여 시스템을 제공합니다.
 *
 * 주요 시스템:
 * 1. 업적 시스템 (Achievements) - 60+ 업적, 7개 카테고리, 희귀도 시스템
 * 2. 언락 시스템 (Unlocks) - 게임 모드, 시작 옵션, 기능, 코스메틱
 * 3. 일일/주간 시스템 (Daily/Weekly) - 목표, 스트릭, 보너스
 * 4. 메타 진행 시스템 (Meta Progression) - 영구 업그레이드, 마스터리 트랙
 * 5. 리플레이 가치 시스템 (Replay Value) - 변동성, 도전 모드, 수정자
 * 6. 소셜 시스템 (Social) - 공유, 커뮤니티, 크로스 프로모션
 */

// ============================================
// Type Exports
// ============================================

export * from './types';

// ============================================
// Achievement System
// ============================================

export {
  achievementSystem,
  achievementCategories,
  milestoneAchievements,
  skillAchievements,
  eventAchievements,
  relationshipAchievements,
  challengeAchievements,
  secretAchievements,
  metaAchievements,
  achievementDisplay,
  achievementRewardSystem,
  AchievementManager,
  achievementManager,
} from './achievements';

// ============================================
// Unlock System
// ============================================

export {
  unlockSystem,
  gameModeUnlocks,
  startOptionUnlocks,
  featureUnlocks,
  cosmeticUnlocks,
  specialContentUnlocks,
  unlockPersistence,
  UnlockManager,
  unlockManager,
} from './unlocks';

// ============================================
// Daily/Weekly System
// ============================================

export {
  dailySystem,
  dailyGoalConfig,
  weeklyGoalConfig,
  streakConfig,
  bonusConfig,
  easyGoals,
  mediumGoals,
  hardGoals,
  bonusGoals,
  weeklyGoals,
  DailyGoalManager,
  dailyGoalManager,
} from './dailyGoals';

// ============================================
// Meta Progression System
// ============================================

export {
  metaProgression,
  legacySystem,
  permanentUpgrades,
  knowledgeUnlocks,
  masteryTracks,
  globalStats,
  leaderboardConfig,
  MetaProgressionManager,
  metaProgressionManager,
} from './metaProgression';

// ============================================
// Replay Value System
// ============================================

export {
  replayValue,
  varianceSystem,
  eventVariance,
  npcVariance,
  marketVariance,
  seedConfig,
  exclusiveContent,
  challengeModes,
  gameModifiers,
  ReplayValueManager,
  replayValueManager,
} from './replayValue';

// ============================================
// Social System
// ============================================

export {
  socialSystem,
  sharingConfig,
  shareableContent,
  communityConfig,
  communityFeatures,
  communityChallenge,
  crossPromotion,
  SocialSystemManager,
  socialSystemManager,
} from './socialSystem';

// ============================================
// 통합 진행 시스템 관리자
// ============================================

import { achievementManager, AchievementManager } from './achievements';
import { unlockManager, UnlockManager } from './unlocks';
import { dailyGoalManager, DailyGoalManager } from './dailyGoals';
import { metaProgressionManager, MetaProgressionManager } from './metaProgression';
import { replayValueManager, ReplayValueManager } from './replayValue';
import { socialSystemManager, SocialSystemManager } from './socialSystem';
import { ProgressionState, ProgressionAction, PlayerStats, GoalReward } from './types';

/**
 * 통합 진행 시스템 관리자
 * 모든 하위 시스템을 조율하고 통합 상태를 관리
 */
export class ProgressionSystemManager {
  readonly achievements: AchievementManager;
  readonly unlocks: UnlockManager;
  readonly dailyGoals: DailyGoalManager;
  readonly metaProgression: MetaProgressionManager;
  readonly replayValue: ReplayValueManager;
  readonly social: SocialSystemManager;

  private listeners: Array<(action: ProgressionAction) => void> = [];

  constructor() {
    this.achievements = achievementManager;
    this.unlocks = unlockManager;
    this.dailyGoals = dailyGoalManager;
    this.metaProgression = metaProgressionManager;
    this.replayValue = replayValueManager;
    this.social = socialSystemManager;
  }

  // ============================================
  // 이벤트 시스템
  // ============================================

  subscribe(listener: (action: ProgressionAction) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private dispatch(action: ProgressionAction): void {
    this.listeners.forEach((listener) => listener(action));
  }

  // ============================================
  // 게임 이벤트 처리
  // ============================================

  /**
   * 게임 시작 시 호출
   */
  onGameStart(options: { seed?: string; difficulty: string; modifiers?: string[] }): void {
    // 시드 설정
    if (options.seed) {
      this.replayValue.setSeed(options.seed);
    }

    // 수정자 활성화
    options.modifiers?.forEach((mod) => {
      this.replayValue.activateModifier(mod);
    });

    // 일일 목표 체크
    this.dailyGoals.checkInToday();
  }

  /**
   * 게임 액션 발생 시 호출
   */
  onGameAction(
    action: string,
    data: Record<string, any>,
  ): {
    achievementsUnlocked: string[];
    goalsCompleted: string[];
    rewards: GoalReward[];
  } {
    const result = {
      achievementsUnlocked: [] as string[],
      goalsCompleted: [] as string[],
      rewards: [] as GoalReward[],
    };

    // 업적 체크
    const gameState = this.buildGameState(data);
    const unlockedAchievements = this.achievements.checkAllAchievements(gameState);
    result.achievementsUnlocked = unlockedAchievements;

    // 일일/주간 목표 진행
    // 액션에 따른 목표 진행 업데이트
    this.updateGoalProgress(action, data);

    // 마스터리 XP 추가
    this.addMasteryXPForAction(action, data);

    return result;
  }

  /**
   * 게임 완료 시 호출
   */
  onGameComplete(result: {
    ending: string;
    days: number;
    users: number;
    revenue: number;
    difficulty: string;
    achievements: string[];
    stats: PlayerStats;
  }): {
    legacyPointsEarned: number;
    newUnlocks: string[];
    masteryLevelUps: Array<{ trackId: string; newLevel: number }>;
  } {
    // 메타 진행 처리
    const masteryActions = this.buildMasteryActions(result);
    const metaResult = this.metaProgression.processPlaythroughComplete({
      ...result,
      masteryActions,
    });

    // 언락 체크
    const newUnlocks = this.checkNewUnlocks(result);

    // 업적 체크
    this.achievements.checkAllAchievements({
      playthroughs: this.metaProgression.getStat('total_playthroughs'),
      ending: result.ending,
      endingsSeen: [result.ending],
      difficulty: result.difficulty,
      difficultiesCompleted: [result.difficulty],
      ...result.stats,
    });

    // 일일 목표 완료 체크
    const { allCompleted } = this.dailyGoals.getDailyGoalProgress();
    if (allCompleted) {
      this.dailyGoals.updateStreak('daily_complete', true);
    }

    return {
      legacyPointsEarned: metaResult.legacyPointsEarned,
      newUnlocks,
      masteryLevelUps: metaResult.masteryLevelUps,
    };
  }

  // ============================================
  // 헬퍼 메서드
  // ============================================

  private buildGameState(data: Record<string, any>): Record<string, any> {
    return {
      ...data,
      unlockedAchievements: this.achievements.getUnlockedAchievements(),
    };
  }

  private updateGoalProgress(action: string, data: Record<string, any>): void {
    // 액션에 따른 목표 진행 매핑
    const goalProgressMap: Record<string, { goalId: string; progress: number }[]> = {
      acquire_users: [{ goalId: 'daily_users', progress: data.amount || 0 }],
      earn_revenue: [{ goalId: 'daily_revenue', progress: data.amount || 0 }],
      handle_event: [{ goalId: 'daily_events', progress: 1 }],
      level_up_skill: [{ goalId: 'daily_skill', progress: 1 }],
    };

    const progressUpdates = goalProgressMap[action];
    if (progressUpdates) {
      progressUpdates.forEach(({ goalId, progress }) => {
        this.dailyGoals.updateGoalProgress(goalId, progress);
      });
    }
  }

  private addMasteryXPForAction(action: string, data: Record<string, any>): void {
    // 액션에 따른 마스터리 XP 매핑
    const xpMap: Record<string, { trackId: string; xp: number }[]> = {
      earn_revenue: [{ trackId: 'entrepreneur', xp: 5 }],
      acquire_users: [{ trackId: 'growth_hacker', xp: 3 }],
      level_up_coding: [{ trackId: 'developer', xp: 10 }],
      overcome_crisis: [{ trackId: 'survivor', xp: 15 }],
      max_npc_relationship: [{ trackId: 'networker', xp: 20 }],
    };

    const xpUpdates = xpMap[action];
    if (xpUpdates) {
      xpUpdates.forEach(({ trackId, xp }) => {
        this.metaProgression.addMasteryXP(trackId, xp);
      });
    }
  }

  private buildMasteryActions(
    result: Record<string, any>,
  ): Array<{ trackId: string; action: string }> {
    const actions: Array<{ trackId: string; action: string }> = [];

    // 기업가 트랙
    if (result.ending !== 'bankruptcy') {
      actions.push({ trackId: 'entrepreneur', action: '성공적인 플레이스루 완료' });
    }
    if (result.ending === 'acquisition' || result.ending === 'ipo') {
      actions.push({ trackId: 'entrepreneur', action: '성공적 엑싯' });
    }

    // 서바이버 트랙
    if (result.days >= 30) {
      actions.push({ trackId: 'survivor', action: '30일 이상 생존' });
    }
    if (result.difficulty === 'hard' || result.difficulty === 'expert') {
      actions.push({ trackId: 'survivor', action: '어려운 난이도 클리어' });
    }

    return actions;
  }

  private checkNewUnlocks(result: Record<string, any>): string[] {
    const unlocked: string[] = [];
    const context = {
      playthroughs: this.metaProgression.getStat('total_playthroughs'),
      achievementPoints: this.achievements.getTotalPoints(),
      endingsSeen: [result.ending],
      difficultiesCompleted: [result.difficulty],
      maxUsers: result.users,
      // 추가 컨텍스트...
    };

    // 모든 언락 카테고리 체크
    const newUnlocks = this.unlocks.checkAndUnlock(context);
    unlocked.push(...newUnlocks);

    return unlocked;
  }

  // ============================================
  // 상태 관리
  // ============================================

  getFullState(): {
    achievements: ReturnType<AchievementManager['serialize']>;
    unlocks: ReturnType<UnlockManager['serialize']>;
    dailyGoals: ReturnType<DailyGoalManager['serialize']>;
    metaProgression: ReturnType<MetaProgressionManager['serialize']>;
    replayValue: ReturnType<ReplayValueManager['serialize']>;
    social: ReturnType<SocialSystemManager['serialize']>;
  } {
    return {
      achievements: this.achievements.serialize(),
      unlocks: this.unlocks.serialize(),
      dailyGoals: this.dailyGoals.serialize(),
      metaProgression: this.metaProgression.serialize(),
      replayValue: this.replayValue.serialize(),
      social: this.social.serialize(),
    };
  }

  loadFullState(state: ReturnType<ProgressionSystemManager['getFullState']>): void {
    this.achievements.deserialize(state.achievements);
    this.unlocks.deserialize(state.unlocks);
    this.dailyGoals.deserialize(state.dailyGoals);
    this.metaProgression.deserialize(state.metaProgression);
    this.replayValue.deserialize(state.replayValue);
    this.social.deserialize(state.social);
  }

  // ============================================
  // 통계 및 요약
  // ============================================

  getProgressionSummary(): {
    achievementProgress: { unlocked: number; total: number; points: number };
    unlockProgress: { unlocked: number; total: number };
    masteryProgress: Array<{ trackId: string; level: number; progress: number }>;
    streakStatus: Array<{ id: string; current: number; longest: number }>;
    challengeProgress: { completed: number; total: number };
  } {
    // 업적 진행
    const unlockedAchievements = this.achievements.getUnlockedAchievements();
    const totalAchievements = this.achievements.getAllAchievements().length;

    // 언락 진행
    const unlockedItems = this.unlocks.getAllUnlocked();
    const totalUnlocks = this.unlocks.getTotalUnlockCount();

    // 마스터리 진행
    const masteryProgress = ['entrepreneur', 'developer', 'growth_hacker', 'survivor', 'networker']
      .map((trackId) => {
        const progress = this.metaProgression.getMasteryProgress(trackId);
        return {
          trackId,
          level: progress.level,
          progress: progress.progress,
        };
      });

    // 스트릭 상태
    const streakStatus = this.dailyGoals.getAllStreakStatus().map((s) => ({
      id: s.id,
      current: s.currentStreak,
      longest: s.longestStreak,
    }));

    // 도전 진행
    const replayStats = this.replayValue.getReplayStats();

    return {
      achievementProgress: {
        unlocked: unlockedAchievements.length,
        total: totalAchievements,
        points: this.achievements.getTotalPoints(),
      },
      unlockProgress: {
        unlocked: unlockedItems.length,
        total: totalUnlocks,
      },
      masteryProgress,
      streakStatus,
      challengeProgress: {
        completed: replayStats.completedChallenges,
        total: replayStats.totalChallenges,
      },
    };
  }

  // ============================================
  // 참여도 목표 달성 체크
  // ============================================

  checkEngagementTargets(): Record<
    string,
    { current: number; target: number; met: boolean }
  > {
    const targets: Record<string, { current: number; target: number; met: boolean }> = {};

    // D1 리텐션 (예시)
    const d1Retention = 0.45; // 실제로는 서버에서 계산
    targets['d1_retention'] = {
      current: d1Retention,
      target: 0.4,
      met: d1Retention >= 0.4,
    };

    // 일일 세션 (예시)
    const dailySessions = 2.5;
    targets['daily_sessions'] = {
      current: dailySessions,
      target: 2,
      met: dailySessions >= 2,
    };

    // 업적 획득률
    const achievementRate =
      this.achievements.getUnlockedAchievements().length /
      this.achievements.getAllAchievements().length;
    targets['achievement_rate'] = {
      current: achievementRate,
      target: 0.3,
      met: achievementRate >= 0.3,
    };

    return targets;
  }
}

// 싱글톤 인스턴스
export const progressionSystem = new ProgressionSystemManager();

export default progressionSystem;
