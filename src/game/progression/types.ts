/**
 * Chapter 7: Progression & Engagement - Type Definitions
 * 진행 및 참여 시스템 타입 정의
 */

// ============================================
// 업적 시스템 타입
// ============================================

export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'secret';

export type AchievementCategory =
  | 'milestones'
  | 'skills'
  | 'events'
  | 'relationships'
  | 'challenges'
  | 'secret'
  | 'meta';

export type ConditionOperator = '>' | '>=' | '==' | '<' | '<=' | '!=';

export interface AchievementCondition {
  type: string;
  operator?: ConditionOperator;
  value?: number | string | boolean;
  skill?: string;
  skills?: string[];
  event?: string;
  choice?: string;
  npc_type?: string;
  required?: string[];
  all?: AchievementCondition[];
  any?: AchievementCondition[];
  sequence?: AchievementCondition[];
  requirement?: string;
}

export type RewardType =
  | 'points'
  | 'unlock'
  | 'title'
  | 'cosmetic'
  | 'perk'
  | 'skill_boost'
  | 'ending_unlock'
  | 'special_ending'
  | 'achievement_unlock'
  | 'cash'
  | 'users'
  | 'energy';

export interface AchievementReward {
  type: RewardType;
  value?: number | string;
  target?: string;
  skill?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  hint?: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  condition: AchievementCondition;
  rewards: AchievementReward[];
  points: number;
  hidden: boolean;
  repeatable: boolean;
  maxRepeats?: number;
  unlockedAt?: Date;
  progress?: number;
  progressMax?: number;
  repeatCount?: number;
}

export interface AchievementCategoryConfig {
  id: AchievementCategory;
  name: string;
  icon: string;
  description: string;
  achievements: Achievement[];
}

export interface AchievementDisplay {
  showProgress: boolean;
  showRarity: boolean;
  showPoints: boolean;
  notificationDuration: number;
  rarityColors: Record<AchievementRarity, string>;
  rarityLabels: Record<AchievementRarity, string>;
}

export interface PointTierReward {
  points: number;
  reward: AchievementReward;
}

export interface AchievementRewardSystem {
  types: Record<RewardType, { description: string; [key: string]: any }>;
  pointTiers: PointTierReward[];
}

export interface AchievementSystem {
  categories: AchievementCategoryConfig[];
  rewards: AchievementRewardSystem;
  display: AchievementDisplay;
}

// ============================================
// 언락 시스템 타입
// ============================================

export type UnlockConditionType =
  | 'default'
  | 'achievement'
  | 'achievement_points'
  | 'playthrough_complete'
  | 'playthroughs'
  | 'difficulty_complete'
  | 'days_survived'
  | 'days_played'
  | 'users'
  | 'skill_level'
  | 'skill'
  | 'npc_relationship'
  | 'npc_relationship_count'
  | 'endings_seen'
  | 'meta';

export interface UnlockCondition {
  type: UnlockConditionType;
  id?: string;
  value?: number;
  count?: number;
  difficulty?: string;
  skill?: string;
  min_level?: number;
}

export interface UnlockItem {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  condition: UnlockCondition;
  benefits?: string[];
  content?: string[];
}

export interface CosmeticItem {
  id: string;
  name: string;
  condition: UnlockCondition;
}

export interface CosmeticCategory {
  id: string;
  name: string;
  description: string;
  items: CosmeticItem[];
}

export interface UnlockCategory {
  id: string;
  name: string;
  icon: string;
  unlocks?: UnlockItem[];
  items?: CosmeticCategory[] | CosmeticItem[];
}

export interface UnlockPersistence {
  permanent: string[];
  newGamePlus: string[];
  perRun: string[];
}

export interface UnlockSystem {
  categories: UnlockCategory[];
  persistence: UnlockPersistence;
}

// ============================================
// 일일/주간 시스템 타입
// ============================================

export type GoalTier = 'easy' | 'medium' | 'hard' | 'bonus';

export interface GoalCondition {
  type: string;
  value?: number;
}

export interface GoalReward {
  points?: number;
  bonus?: string;
  cosmetic?: string;
  title?: string;
  unlock?: string;
  perk?: string;
}

export interface Goal {
  id: string;
  desc: string;
  condition: GoalCondition;
  reward: GoalReward;
}

export interface GoalTierConfig {
  tier: GoalTier;
  goals: Goal[];
}

export interface DailyGoalConfig {
  goalsPerDay: number;
  refreshTime: string;
  goalPool: GoalTierConfig[];
  bonusGoal: {
    frequency: number;
    goals: Goal[];
  };
  completionRewards: {
    allThree: GoalReward;
    streak: Record<number, GoalReward>;
  };
}

export interface WeeklyGoalConfig {
  goalsPerWeek: number;
  refreshDay: string;
  goals: Goal[];
  completionRewards: {
    allFive: GoalReward;
  };
}

export interface StreakReward {
  days?: number;
  months?: number;
  reward: GoalReward;
}

export interface StreakType {
  id: string;
  name: string;
  description: string;
  rewards: StreakReward[];
  gracePeriod?: number;
}

export interface StreakConfig {
  types: StreakType[];
  onBreak: {
    showMessage: boolean;
    offerRecovery: {
      enabled: boolean;
      cost: { type: string; value: number };
      maxPerMonth: number;
    };
  };
}

export interface TimeBonus {
  time: [number, number];
  bonus: string;
  desc: string;
}

export interface ReturnBonus {
  days: number;
  bonus: {
    cash?: number;
    energy?: number;
    all_resources?: number;
    message: string;
  };
}

export interface BonusConfig {
  firstOfDay: {
    bonus: string;
    message: string;
  };
  returnBonus: {
    afterDays: number;
    rewards: ReturnBonus[];
  };
  timeBonus: Record<string, TimeBonus>;
}

export interface DailySystem {
  dailyGoals: DailyGoalConfig;
  weeklyGoals: WeeklyGoalConfig;
  streaks: StreakConfig;
  bonuses: BonusConfig;
}

// ============================================
// 메타 진행 시스템 타입
// ============================================

export interface UpgradeLevel {
  level: number;
  effect: string;
  cost: number;
}

export interface PermanentUpgrade {
  id: string;
  name: string;
  description: string;
  levels: UpgradeLevel[];
  currency: string;
  requires?: string;
  currentLevel?: number;
}

export interface KnowledgeUnlock {
  id: string;
  desc: string;
  permanent: boolean;
  unlocked?: boolean;
}

export interface LegacySystem {
  permanentUpgrades: PermanentUpgrade[];
  knowledgeUnlocks: KnowledgeUnlock[];
}

export interface MasteryMilestone {
  level: number;
  name: string;
  xp: number;
  reward: AchievementReward;
}

export interface XPSource {
  action: string;
  xp: number;
}

export interface MasteryTrack {
  id: string;
  name: string;
  description: string;
  icon: string;
  milestones: MasteryMilestone[];
  xpSources: XPSource[];
  currentXP?: number;
  currentLevel?: number;
}

export interface StatConfig {
  id: string;
  name: string;
  format?: string;
  type?: 'max' | 'min';
}

export interface GlobalStats {
  cumulative: StatConfig[];
  records: StatConfig[];
  distributions: StatConfig[];
}

export interface LeaderboardCategory {
  id: string;
  name: string;
  metric: string;
  periods: string[];
  filters: string[];
  requires?: string;
}

export interface LeaderboardConfig {
  categories: LeaderboardCategory[];
  display: {
    entriesPerPage: number;
    showRank: boolean;
    showDelta: boolean;
    highlightFriends: boolean;
    highlightSelf: boolean;
  };
  privacy: {
    anonymousOption: boolean;
    friendsOnly: boolean;
    optOut: boolean;
  };
}

export interface MetaProgression {
  legacy: LegacySystem;
  masteryTracks: MasteryTrack[];
  globalStats: GlobalStats;
  leaderboards: LeaderboardConfig;
}

// ============================================
// 리플레이 가치 시스템 타입
// ============================================

export interface EventVariance {
  poolSize: number;
  perPlaythrough: number;
  guaranteedEvents: number;
  randomEvents: number;
  conditionalEvents: Record<string, number>;
}

export interface NPCVariance {
  totalNpcs: number;
  perPlaythrough: number;
  guaranteed: number;
  random: number;
  personalityVariance: number;
  relationshipStartVariance: number;
}

export interface MarketVariance {
  economicCycles: string[];
  competitorAggression: { min: number; max: number };
  trendStrength: { min: number; max: number };
  seasonalVariance: number;
}

export interface SeedConfig {
  useSeed: boolean;
  shareable: boolean;
  dailySeed: boolean;
}

export interface VarianceSystem {
  events: EventVariance;
  npcs: NPCVariance;
  market: MarketVariance;
  seed: SeedConfig;
}

export interface ExclusiveContent {
  id: string;
  name: string;
  trigger: { type: string; [key: string]: any };
  exclusive: {
    events: string[];
    npcs: string[];
    endings: string[];
  };
}

export interface ChallengeRule {
  type: string;
  action?: string;
  allowed?: boolean;
  days?: number;
  metric?: string;
  value?: number;
  choices?: string[];
}

export interface ChallengeMilestone {
  users?: number;
  reward: GoalReward;
}

export interface ChallengeMode {
  id: string;
  name: string;
  description: string;
  rules: ChallengeRule[];
  rewards: {
    completion: GoalReward & { achievement?: string };
    milestone?: ChallengeMilestone[];
  };
}

export interface GameModifier {
  id: string;
  name: string;
  description: string;
  effect: Record<string, any>;
  difficulty: number;
  rewardMultiplier: number;
}

export interface ReplayValue {
  variance: VarianceSystem;
  exclusiveContent: ExclusiveContent[];
  challenges: ChallengeMode[];
  modifiers: GameModifier[];
}

// ============================================
// 소셜 시스템 타입
// ============================================

export interface ShareTemplate {
  title: string;
  description: string;
  image: string;
  includeStats?: string[] | boolean;
  spoilerWarning?: boolean;
}

export interface ShareableContent {
  id: string;
  name: string;
  template: ShareTemplate;
  platforms: string[];
  requires?: string;
}

export interface ShareIncentive {
  reward: GoalReward;
  oneTime?: boolean;
  maxPerWeek?: number;
  clickThreshold?: number;
}

export interface SharingConfig {
  shareable: ShareableContent[];
  incentives: {
    firstShare: ShareIncentive;
    weeklyShare: ShareIncentive;
    viralBonus: ShareIncentive;
  };
}

export interface CommunityFeature {
  id: string;
  name: string;
  description: string;
  format?: string;
  shareOptions?: string[];
  editor?: boolean;
  voting?: boolean;
  moderation?: boolean;
  requires?: string;
  rewards?: Record<string, { per: number; reward: GoalReward }>;
}

export interface CommunityChallengeRewards {
  participation: GoalReward;
  top100: GoalReward;
  top10: GoalReward & { cosmetic?: string };
  winner: GoalReward & { title?: string };
}

export interface CommunityChallenge {
  frequency: string;
  types: { id: string; desc: string }[];
  rewards: CommunityChallengeRewards;
}

export interface CommunityConfig {
  features: CommunityFeature[];
  communityChallenge: CommunityChallenge;
}

export interface CrossPromoReward {
  condition: string;
  gameReward: Record<string, any>;
  vocavisionReward?: Record<string, any>;
  reward?: GoalReward;
}

export interface CrossPromoConfig {
  enabled: boolean;
  rewards: Record<string, CrossPromoReward>;
}

export interface SocialSystem {
  sharing: SharingConfig;
  community: CommunityConfig;
  crossPromotion: CrossPromoConfig;
}

// ============================================
// 참여도 목표 타입
// ============================================

export interface TargetMetric {
  target: number;
  min: number;
}

export interface EngagementTargets {
  retention: Record<string, TargetMetric>;
  session: Record<string, TargetMetric>;
  progression: Record<string, TargetMetric>;
  social: Record<string, TargetMetric>;
  monetization: Record<string, TargetMetric>;
}

// ============================================
// 통합 진행 시스템 상태
// ============================================

export interface ActiveGoal extends Goal {
  progress: number;
  completed: boolean;
  tier: GoalTier;
}

export interface StreakState {
  id: string;
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  recoveredThisMonth: number;
}

export interface PlayerStats {
  totalPlaytime: number;
  totalUsersAcquired: number;
  totalRevenueEarned: number;
  totalEventsHandled: number;
  totalDecisionsMade: number;
  totalNpcsMet: number;
  totalSkillsGained: number;
  totalBankruptcies: number;
  totalSuccesses: number;
  maxUsers: number;
  maxRevenue: number;
  maxValuation: number;
  longestSurvival: number;
  fastestProfitability: number | null;
  fastest10kUsers: number | null;
}

export interface ProgressionState {
  // 업적
  achievements: Record<string, Achievement>;
  achievementPoints: number;
  recentAchievements: string[];

  // 언락
  unlockedModes: string[];
  unlockedFeatures: string[];
  unlockedCosmetics: string[];
  equippedCosmetics: Record<string, string>;

  // 일일/주간
  dailyGoals: ActiveGoal[];
  weeklyGoals: ActiveGoal[];
  dailyGoalsRefreshAt: Date;
  weeklyGoalsRefreshAt: Date;
  streaks: Record<string, StreakState>;

  // 메타 진행
  permanentUpgrades: Record<string, number>;
  masteryXP: Record<string, number>;
  knowledgeUnlocked: string[];

  // 통계
  stats: PlayerStats;
  playthroughCount: number;
  endingsSeen: string[];
  eventsSeen: string[];
  difficultiesCompleted: string[];

  // 소셜
  shareCount: number;
  lastShareDate: Date | null;
}

// ============================================
// 액션 타입
// ============================================

export type ProgressionAction =
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'ADD_ACHIEVEMENT_PROGRESS'; payload: { id: string; progress: number } }
  | { type: 'UNLOCK_MODE'; payload: string }
  | { type: 'UNLOCK_FEATURE'; payload: string }
  | { type: 'UNLOCK_COSMETIC'; payload: string }
  | { type: 'EQUIP_COSMETIC'; payload: { category: string; id: string } }
  | { type: 'UPDATE_DAILY_GOAL'; payload: { id: string; progress: number } }
  | { type: 'UPDATE_WEEKLY_GOAL'; payload: { id: string; progress: number } }
  | { type: 'REFRESH_DAILY_GOALS' }
  | { type: 'REFRESH_WEEKLY_GOALS' }
  | { type: 'UPDATE_STREAK'; payload: { id: string; increment: boolean } }
  | { type: 'RECOVER_STREAK'; payload: string }
  | { type: 'PURCHASE_UPGRADE'; payload: { id: string; level: number } }
  | { type: 'ADD_MASTERY_XP'; payload: { trackId: string; xp: number } }
  | { type: 'ADD_KNOWLEDGE'; payload: string }
  | { type: 'UPDATE_STATS'; payload: Partial<PlayerStats> }
  | { type: 'COMPLETE_PLAYTHROUGH'; payload: { ending: string; difficulty: string } }
  | { type: 'RECORD_SHARE' }
  | { type: 'RESET_PROGRESSION' };

export default ProgressionState;
