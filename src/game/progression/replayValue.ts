/**
 * Chapter 7: Progression & Engagement - Replay Value System
 * 리플레이 가치 시스템 - 변동성, 독점 콘텐츠, 도전 모드, 게임 수정자
 */

import {
  ReplayValue,
  VarianceSystem,
  EventVariance,
  NPCVariance,
  MarketVariance,
  SeedConfig,
  ExclusiveContent,
  ChallengeMode,
  ChallengeRule,
  GameModifier,
  GoalReward,
} from './types';

// ============================================
// 변동성 시스템 - 이벤트
// ============================================

export const eventVariance: EventVariance = {
  poolSize: 200,
  perPlaythrough: 45,
  guaranteedEvents: 8,
  randomEvents: 25,
  conditionalEvents: {
    skill_based: 5,
    relationship_based: 4,
    time_based: 3,
  },
};

// ============================================
// 변동성 시스템 - NPC
// ============================================

export const npcVariance: NPCVariance = {
  totalNpcs: 50,
  perPlaythrough: 15,
  guaranteed: 5,
  random: 10,
  personalityVariance: 0.3, // 30% 성격 변동
  relationshipStartVariance: 0.2, // 20% 초기 관계도 변동
};

// ============================================
// 변동성 시스템 - 시장
// ============================================

export const marketVariance: MarketVariance = {
  economicCycles: ['boom', 'stable', 'recession', 'recovery'],
  competitorAggression: { min: 0.5, max: 1.5 },
  trendStrength: { min: 0.7, max: 1.3 },
  seasonalVariance: 0.15,
};

// ============================================
// 시드 설정
// ============================================

export const seedConfig: SeedConfig = {
  useSeed: true,
  shareable: true,
  dailySeed: true,
};

// ============================================
// 변동성 시스템 통합
// ============================================

export const varianceSystem: VarianceSystem = {
  events: eventVariance,
  npcs: npcVariance,
  market: marketVariance,
  seed: seedConfig,
};

// ============================================
// 독점 콘텐츠
// ============================================

export const exclusiveContent: ExclusiveContent[] = [
  // 시작 조건별 독점 콘텐츠
  {
    id: 'tech_background',
    name: '기술 배경',
    trigger: { type: 'start_choice', value: 'tech_founder' },
    exclusive: {
      events: ['hackathon_invite', 'tech_conference', 'developer_community'],
      npcs: ['senior_developer', 'tech_blogger', 'open_source_maintainer'],
      endings: ['tech_unicorn'],
    },
  },
  {
    id: 'business_background',
    name: '비즈니스 배경',
    trigger: { type: 'start_choice', value: 'business_founder' },
    exclusive: {
      events: ['investor_dinner', 'startup_pitch', 'business_mentorship'],
      npcs: ['serial_entrepreneur', 'angel_investor', 'business_consultant'],
      endings: ['business_empire'],
    },
  },
  {
    id: 'education_background',
    name: '교육 배경',
    trigger: { type: 'start_choice', value: 'educator_founder' },
    exclusive: {
      events: ['education_conference', 'school_partnership', 'curriculum_review'],
      npcs: ['education_professor', 'school_principal', 'curriculum_designer'],
      endings: ['education_revolution'],
    },
  },

  // 플레이 스타일별 독점 콘텐츠
  {
    id: 'aggressive_growth',
    name: '공격적 성장',
    trigger: { type: 'play_style', growth_rate: 'high', risk_tolerance: 'high' },
    exclusive: {
      events: ['viral_opportunity', 'aggressive_investor', 'market_disruption'],
      npcs: ['growth_hacker_legend', 'risk_taker_investor'],
      endings: ['hypergrowth_exit'],
    },
  },
  {
    id: 'sustainable_path',
    name: '지속가능한 경로',
    trigger: { type: 'play_style', growth_rate: 'steady', risk_tolerance: 'low' },
    exclusive: {
      events: ['long_term_partnership', 'community_building', 'organic_growth'],
      npcs: ['patient_mentor', 'impact_investor'],
      endings: ['sustainable_success'],
    },
  },

  // 시즌/시간별 독점 콘텐츠
  {
    id: 'new_year_special',
    name: '새해 특별',
    trigger: { type: 'real_date', month: 1, day_range: [1, 7] },
    exclusive: {
      events: ['new_year_resolution', 'annual_review', 'fresh_start_bonus'],
      npcs: [],
      endings: [],
    },
  },
  {
    id: 'spring_launch',
    name: '봄 출시',
    trigger: { type: 'real_date', month_range: [3, 5] },
    exclusive: {
      events: ['spring_conference', 'education_fair', 'new_semester_rush'],
      npcs: ['spring_intern'],
      endings: [],
    },
  },
  {
    id: 'summer_grind',
    name: '여름 집중',
    trigger: { type: 'real_date', month_range: [6, 8] },
    exclusive: {
      events: ['summer_camp_partnership', 'vacation_mode', 'summer_intern_program'],
      npcs: ['summer_intern'],
      endings: [],
    },
  },
  {
    id: 'fall_growth',
    name: '가을 성장',
    trigger: { type: 'real_date', month_range: [9, 11] },
    exclusive: {
      events: ['back_to_school', 'fall_demo_day', 'conference_season'],
      npcs: [],
      endings: [],
    },
  },
  {
    id: 'year_end_crunch',
    name: '연말 크런치',
    trigger: { type: 'real_date', month: 12 },
    exclusive: {
      events: ['year_end_review', 'holiday_campaign', 'tax_planning'],
      npcs: ['accountant_special'],
      endings: [],
    },
  },

  // 업적 기반 독점 콘텐츠
  {
    id: 'veteran_player',
    name: '베테랑 플레이어',
    trigger: { type: 'achievement', id: 'hundred_percent' },
    exclusive: {
      events: ['meta_event', 'developer_message', 'secret_ending_trigger'],
      npcs: ['game_developer_npc'],
      endings: ['true_ending'],
    },
  },
  {
    id: 'speedrunner',
    name: '스피드러너',
    trigger: { type: 'achievement', id: 'speed_runner' },
    exclusive: {
      events: ['speedrun_route', 'time_skip_option'],
      npcs: [],
      endings: ['speedrun_special'],
    },
  },
];

// ============================================
// 도전 모드
// ============================================

export const challengeModes: ChallengeMode[] = [
  {
    id: 'bootstrap_challenge',
    name: '부트스트랩 챌린지',
    description: '외부 투자 없이 성공하기',
    rules: [
      { type: 'restriction', action: 'accept_investment', allowed: false },
      { type: 'goal', metric: 'revenue', value: 50000000 },
      { type: 'time_limit', days: 365 },
    ],
    rewards: {
      completion: {
        points: 500,
        title: '부트스트랩 마스터',
        achievement: 'bootstrap_success',
      },
      milestone: [
        { users: 1000, reward: { points: 50 } },
        { users: 5000, reward: { points: 100 } },
        { users: 10000, reward: { points: 150 } },
      ],
    },
  },
  {
    id: 'speedrun_challenge',
    name: '스피드런',
    description: '최단 시간 내 10,000 사용자 달성',
    rules: [
      { type: 'goal', metric: 'users', value: 10000 },
      { type: 'time_limit', days: 90 },
    ],
    rewards: {
      completion: {
        points: 400,
        title: '스피드 데몬',
        achievement: 'speed_runner',
      },
    },
  },
  {
    id: 'minimalist_challenge',
    name: '미니멀리스트',
    description: '최소한의 기능으로 성공하기',
    rules: [
      { type: 'restriction', action: 'add_feature', choices: ['core_only'] },
      { type: 'goal', metric: 'users', value: 5000 },
      { type: 'goal', metric: 'satisfaction', value: 80 },
    ],
    rewards: {
      completion: {
        points: 350,
        title: '에센셜리스트',
        achievement: 'minimalist_master',
      },
    },
  },
  {
    id: 'relationship_master',
    name: '관계의 달인',
    description: '모든 NPC와 최대 관계도 달성',
    rules: [
      { type: 'goal', metric: 'all_npc_max_relationship', value: 1 },
      { type: 'condition', value: 'meet_all_available_npcs' as any },
    ],
    rewards: {
      completion: {
        points: 600,
        title: '인맥왕',
        achievement: 'social_butterfly',
      },
    },
  },
  {
    id: 'perfectionist',
    name: '완벽주의자',
    description: '모든 스킬 최대 레벨 달성',
    rules: [{ type: 'goal', metric: 'all_skills_max', value: 1 }],
    rewards: {
      completion: {
        points: 700,
        title: '마스터 오브 올',
        achievement: 'jack_of_all_trades',
      },
    },
  },
  {
    id: 'crisis_survivor',
    name: '위기 생존자',
    description: '5개 이상의 위기 이벤트 극복',
    rules: [{ type: 'goal', metric: 'crises_overcome', value: 5 }],
    rewards: {
      completion: {
        points: 450,
        title: '불사조',
        achievement: 'crisis_manager',
      },
    },
  },
  {
    id: 'no_marketing',
    name: '입소문만으로',
    description: '마케팅 비용 없이 10,000 사용자 달성',
    rules: [
      { type: 'restriction', action: 'marketing_spend', allowed: false },
      { type: 'goal', metric: 'users', value: 10000 },
    ],
    rewards: {
      completion: {
        points: 500,
        title: '바이럴 마스터',
        achievement: 'viral_success',
      },
    },
  },
  {
    id: 'one_shot',
    name: '원샷 원킬',
    description: '단 한 번의 결정 실수도 없이 성공',
    rules: [
      { type: 'restriction', action: 'undo', allowed: false },
      { type: 'restriction', action: 'reload', allowed: false },
      { type: 'goal', metric: 'successful_ending', value: 1 },
    ],
    rewards: {
      completion: {
        points: 800,
        title: '무결점 CEO',
        achievement: 'perfect_game',
      },
    },
  },
  {
    id: 'night_owl_run',
    name: '야행성 런',
    description: '밤 시간대에만 플레이하여 클리어',
    rules: [
      { type: 'condition', value: 'play_only_at_night' as any },
      { type: 'goal', metric: 'successful_ending', value: 1 },
    ],
    rewards: {
      completion: {
        points: 300,
        cosmetic: 'theme_night_owl',
        achievement: 'night_owl',
      },
    },
  },
  {
    id: 'daily_challenge',
    name: '일일 도전',
    description: '매일 새로운 시드와 조건으로 도전',
    rules: [
      { type: 'seed', value: 'daily' as any },
      { type: 'modifier', value: 'random_daily' as any },
    ],
    rewards: {
      completion: {
        points: 100,
      },
    },
  },
];

// ============================================
// 게임 수정자 (모디파이어)
// ============================================

export const gameModifiers: GameModifier[] = [
  // 난이도 증가 수정자
  {
    id: 'double_costs',
    name: '비용 2배',
    description: '모든 비용이 2배가 됩니다',
    effect: { cost_multiplier: 2.0 },
    difficulty: 2,
    rewardMultiplier: 1.5,
  },
  {
    id: 'half_revenue',
    name: '수익 절반',
    description: '모든 수익이 절반이 됩니다',
    effect: { revenue_multiplier: 0.5 },
    difficulty: 2,
    rewardMultiplier: 1.5,
  },
  {
    id: 'aggressive_competition',
    name: '치열한 경쟁',
    description: '경쟁자가 매우 공격적입니다',
    effect: { competitor_aggression: 2.0 },
    difficulty: 1,
    rewardMultiplier: 1.25,
  },
  {
    id: 'volatile_market',
    name: '불안정한 시장',
    description: '시장 변동이 극심합니다',
    effect: { market_volatility: 2.0 },
    difficulty: 1,
    rewardMultiplier: 1.25,
  },
  {
    id: 'limited_time',
    name: '시간 제한',
    description: '게임 일수가 절반으로 제한됩니다',
    effect: { max_days_multiplier: 0.5 },
    difficulty: 2,
    rewardMultiplier: 1.5,
  },
  {
    id: 'no_second_chances',
    name: '기회는 한 번',
    description: '실패한 이벤트 재도전 불가',
    effect: { event_retry: false },
    difficulty: 1,
    rewardMultiplier: 1.2,
  },
  {
    id: 'harsh_critics',
    name: '혹독한 비평가',
    description: '사용자 리뷰가 더 엄격합니다',
    effect: { review_severity: 1.5 },
    difficulty: 1,
    rewardMultiplier: 1.2,
  },
  {
    id: 'resource_scarcity',
    name: '자원 부족',
    description: '시작 자원이 절반입니다',
    effect: { starting_resources_multiplier: 0.5 },
    difficulty: 2,
    rewardMultiplier: 1.4,
  },

  // 난이도 감소 수정자 (보상 감소)
  {
    id: 'generous_market',
    name: '관대한 시장',
    description: '시장이 더 우호적입니다',
    effect: { market_friendliness: 1.5 },
    difficulty: -1,
    rewardMultiplier: 0.75,
  },
  {
    id: 'extra_time',
    name: '추가 시간',
    description: '게임 일수가 50% 증가합니다',
    effect: { max_days_multiplier: 1.5 },
    difficulty: -1,
    rewardMultiplier: 0.8,
  },
  {
    id: 'lucky_start',
    name: '행운의 시작',
    description: '시작 자원이 50% 증가합니다',
    effect: { starting_resources_multiplier: 1.5 },
    difficulty: -1,
    rewardMultiplier: 0.8,
  },

  // 특수 수정자 (게임 변형)
  {
    id: 'chaos_mode',
    name: '카오스 모드',
    description: '모든 것이 무작위입니다',
    effect: { all_random: true, variance_multiplier: 3.0 },
    difficulty: 2,
    rewardMultiplier: 1.3,
  },
  {
    id: 'story_focus',
    name: '스토리 집중',
    description: '더 많은 스토리 이벤트 발생',
    effect: { story_event_frequency: 2.0, random_event_frequency: 0.5 },
    difficulty: 0,
    rewardMultiplier: 1.0,
  },
  {
    id: 'simulation_focus',
    name: '시뮬레이션 집중',
    description: '수치 중심의 하드코어 경영',
    effect: { story_event_frequency: 0.5, economic_detail: 2.0 },
    difficulty: 1,
    rewardMultiplier: 1.1,
  },
  {
    id: 'relationship_focus',
    name: '관계 집중',
    description: 'NPC 관계가 더 중요해집니다',
    effect: { npc_impact: 2.0, npc_frequency: 1.5 },
    difficulty: 0,
    rewardMultiplier: 1.0,
  },
  {
    id: 'tech_focus',
    name: '기술 집중',
    description: '기술 관련 이벤트와 스킬 중요도 증가',
    effect: { tech_event_frequency: 2.0, tech_skill_impact: 1.5 },
    difficulty: 0,
    rewardMultiplier: 1.0,
  },
  {
    id: 'marketing_focus',
    name: '마케팅 집중',
    description: '마케팅 관련 이벤트와 스킬 중요도 증가',
    effect: { marketing_event_frequency: 2.0, marketing_skill_impact: 1.5 },
    difficulty: 0,
    rewardMultiplier: 1.0,
  },
];

// ============================================
// 리플레이 가치 시스템 통합
// ============================================

export const replayValue: ReplayValue = {
  variance: varianceSystem,
  exclusiveContent,
  challenges: challengeModes,
  modifiers: gameModifiers,
};

// ============================================
// 리플레이 가치 관리자
// ============================================

export class ReplayValueManager {
  private activeChallenges: Set<string> = new Set();
  private activeModifiers: Set<string> = new Set();
  private completedChallenges: Map<string, number> = new Map(); // challenge id -> best score/time
  private currentSeed: string | null = null;

  // ============================================
  // 시드 관리
  // ============================================

  generateSeed(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  getDailySeed(): string {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    // Simple hash function for date
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).toUpperCase().padStart(8, '0');
  }

  setSeed(seed: string): void {
    this.currentSeed = seed;
  }

  getSeed(): string {
    if (!this.currentSeed) {
      this.currentSeed = this.generateSeed();
    }
    return this.currentSeed;
  }

  // Seeded random number generator
  seededRandom(seed: string, index: number = 0): number {
    const combinedSeed = seed + index.toString();
    let hash = 0;
    for (let i = 0; i < combinedSeed.length; i++) {
      const char = combinedSeed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash % 1000000) / 1000000;
  }

  // ============================================
  // 변동성 적용
  // ============================================

  generatePlaythroughVariance(seed: string): {
    events: string[];
    npcs: string[];
    marketCycle: string;
    modifiers: Record<string, number>;
  } {
    const variance = varianceSystem;

    // 이벤트 선택
    const eventPool: string[] = []; // Would be populated from actual event data
    const selectedEvents: string[] = [];

    // 보장 이벤트 선택
    for (let i = 0; i < variance.events.guaranteedEvents; i++) {
      // Select guaranteed events (placeholder)
      selectedEvents.push(`guaranteed_event_${i}`);
    }

    // 랜덤 이벤트 선택
    for (let i = 0; i < variance.events.randomEvents; i++) {
      const random = this.seededRandom(seed, i);
      selectedEvents.push(`random_event_${Math.floor(random * variance.events.poolSize)}`);
    }

    // NPC 선택
    const selectedNPCs: string[] = [];
    for (let i = 0; i < variance.npcs.guaranteed; i++) {
      selectedNPCs.push(`guaranteed_npc_${i}`);
    }
    for (let i = 0; i < variance.npcs.random; i++) {
      const random = this.seededRandom(seed, 1000 + i);
      selectedNPCs.push(`random_npc_${Math.floor(random * variance.npcs.totalNpcs)}`);
    }

    // 시장 사이클 선택
    const cycleRandom = this.seededRandom(seed, 2000);
    const marketCycle =
      variance.market.economicCycles[
        Math.floor(cycleRandom * variance.market.economicCycles.length)
      ];

    // 수정자 계산
    const competitorRandom = this.seededRandom(seed, 3000);
    const trendRandom = this.seededRandom(seed, 3001);

    const modifiers = {
      competitorAggression:
        variance.market.competitorAggression.min +
        competitorRandom *
          (variance.market.competitorAggression.max - variance.market.competitorAggression.min),
      trendStrength:
        variance.market.trendStrength.min +
        trendRandom * (variance.market.trendStrength.max - variance.market.trendStrength.min),
      seasonalVariance:
        1 + (this.seededRandom(seed, 3002) - 0.5) * 2 * variance.market.seasonalVariance,
    };

    return {
      events: selectedEvents,
      npcs: selectedNPCs,
      marketCycle,
      modifiers,
    };
  }

  // ============================================
  // 독점 콘텐츠 관리
  // ============================================

  getAvailableExclusiveContent(context: {
    startChoice?: string;
    playStyle?: { growthRate: string; riskTolerance: string };
    realDate?: Date;
    achievements?: string[];
  }): ExclusiveContent[] {
    const available: ExclusiveContent[] = [];

    for (const content of exclusiveContent) {
      if (this.checkExclusiveTrigger(content.trigger, context)) {
        available.push(content);
      }
    }

    return available;
  }

  private checkExclusiveTrigger(
    trigger: { type: string; [key: string]: any },
    context: {
      startChoice?: string;
      playStyle?: { growthRate: string; riskTolerance: string };
      realDate?: Date;
      achievements?: string[];
    },
  ): boolean {
    switch (trigger.type) {
      case 'start_choice':
        return context.startChoice === trigger.value;

      case 'play_style':
        return (
          context.playStyle?.growthRate === trigger.growth_rate &&
          context.playStyle?.riskTolerance === trigger.risk_tolerance
        );

      case 'real_date': {
        if (!context.realDate) return false;
        const month = context.realDate.getMonth() + 1;
        const day = context.realDate.getDate();

        if (trigger.month && trigger.month !== month) return false;
        if (
          trigger.month_range &&
          (month < trigger.month_range[0] || month > trigger.month_range[1])
        ) {
          return false;
        }
        if (trigger.day_range && (day < trigger.day_range[0] || day > trigger.day_range[1])) {
          return false;
        }
        return true;
      }

      case 'achievement':
        return context.achievements?.includes(trigger.id) || false;

      default:
        return false;
    }
  }

  // ============================================
  // 도전 모드 관리
  // ============================================

  startChallenge(challengeId: string): boolean {
    const challenge = challengeModes.find((c) => c.id === challengeId);
    if (!challenge) return false;

    this.activeChallenges.add(challengeId);
    return true;
  }

  endChallenge(challengeId: string): void {
    this.activeChallenges.delete(challengeId);
  }

  getActiveChallenges(): ChallengeMode[] {
    return challengeModes.filter((c) => this.activeChallenges.has(c.id));
  }

  checkChallengeRules(
    challengeId: string,
    gameState: Record<string, any>,
  ): { valid: boolean; violations: string[] } {
    const challenge = challengeModes.find((c) => c.id === challengeId);
    if (!challenge) return { valid: false, violations: ['도전을 찾을 수 없습니다'] };

    const violations: string[] = [];

    for (const rule of challenge.rules) {
      if (!this.checkRule(rule, gameState)) {
        violations.push(this.getRuleViolationMessage(rule));
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }

  private checkRule(rule: ChallengeRule, gameState: Record<string, any>): boolean {
    switch (rule.type) {
      case 'restriction':
        if (rule.action && rule.allowed === false) {
          return !gameState[`did_${rule.action}`];
        }
        return true;

      case 'goal':
        if (rule.metric && rule.value !== undefined) {
          return (gameState[rule.metric] || 0) >= rule.value;
        }
        return true;

      case 'time_limit':
        return (gameState.days || 0) <= (rule.days || Infinity);

      default:
        return true;
    }
  }

  private getRuleViolationMessage(rule: ChallengeRule): string {
    switch (rule.type) {
      case 'restriction':
        return `금지된 행동 수행: ${rule.action}`;
      case 'goal':
        return `목표 미달성: ${rule.metric} >= ${rule.value}`;
      case 'time_limit':
        return `시간 제한 초과: ${rule.days}일`;
      default:
        return '규칙 위반';
    }
  }

  completeChallenge(
    challengeId: string,
    score: number,
  ): { success: boolean; rewards: GoalReward; isNewRecord: boolean } {
    const challenge = challengeModes.find((c) => c.id === challengeId);
    if (!challenge) {
      return { success: false, rewards: {}, isNewRecord: false };
    }

    const previousBest = this.completedChallenges.get(challengeId);
    const isNewRecord = previousBest === undefined || score > previousBest;

    if (isNewRecord) {
      this.completedChallenges.set(challengeId, score);
    }

    this.endChallenge(challengeId);

    return {
      success: true,
      rewards: challenge.rewards.completion,
      isNewRecord,
    };
  }

  // ============================================
  // 수정자 관리
  // ============================================

  activateModifier(modifierId: string): boolean {
    const modifier = gameModifiers.find((m) => m.id === modifierId);
    if (!modifier) return false;

    this.activeModifiers.add(modifierId);
    return true;
  }

  deactivateModifier(modifierId: string): void {
    this.activeModifiers.delete(modifierId);
  }

  getActiveModifiers(): GameModifier[] {
    return gameModifiers.filter((m) => this.activeModifiers.has(m.id));
  }

  getTotalDifficultyModifier(): number {
    let total = 0;
    for (const modifier of this.getActiveModifiers()) {
      total += modifier.difficulty;
    }
    return total;
  }

  getTotalRewardMultiplier(): number {
    let multiplier = 1.0;
    for (const modifier of this.getActiveModifiers()) {
      multiplier *= modifier.rewardMultiplier;
    }
    return multiplier;
  }

  getCombinedModifierEffects(): Record<string, any> {
    const combined: Record<string, any> = {};

    for (const modifier of this.getActiveModifiers()) {
      for (const [key, value] of Object.entries(modifier.effect)) {
        if (typeof value === 'number') {
          if (key.includes('multiplier')) {
            combined[key] = (combined[key] || 1) * value;
          } else {
            combined[key] = (combined[key] || 0) + value;
          }
        } else if (typeof value === 'boolean') {
          combined[key] = combined[key] || value;
        } else {
          combined[key] = value;
        }
      }
    }

    return combined;
  }

  // ============================================
  // 리플레이 통계
  // ============================================

  getReplayStats(): {
    completedChallenges: number;
    totalChallenges: number;
    unlockedExclusiveContent: number;
    totalExclusiveContent: number;
    uniqueSeeds: number;
  } {
    return {
      completedChallenges: this.completedChallenges.size,
      totalChallenges: challengeModes.length,
      unlockedExclusiveContent: 0, // Would be tracked separately
      totalExclusiveContent: exclusiveContent.length,
      uniqueSeeds: 0, // Would be tracked separately
    };
  }

  // ============================================
  // 상태 직렬화
  // ============================================

  serialize(): {
    completedChallenges: Record<string, number>;
    currentSeed: string | null;
  } {
    return {
      completedChallenges: Object.fromEntries(this.completedChallenges),
      currentSeed: this.currentSeed,
    };
  }

  deserialize(data: ReturnType<ReplayValueManager['serialize']>): void {
    this.completedChallenges = new Map(Object.entries(data.completedChallenges));
    this.currentSeed = data.currentSeed;
  }
}

// 싱글톤 인스턴스
export const replayValueManager = new ReplayValueManager();

export default replayValue;
