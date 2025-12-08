/**
 * Chapter 7: Progression & Engagement - Achievement System
 * 업적 시스템 데이터 및 관리
 */

import {
  Achievement,
  AchievementCategory,
  AchievementCategoryConfig,
  AchievementRarity,
  AchievementDisplay,
  AchievementRewardSystem,
  AchievementSystem,
  AchievementCondition,
} from './types';

// ============================================
// 업적 표시 설정
// ============================================

export const achievementDisplay: AchievementDisplay = {
  showProgress: true,
  showRarity: true,
  showPoints: true,
  notificationDuration: 5000,

  rarityColors: {
    common: '#9CA3AF',
    uncommon: '#10B981',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
    secret: '#EC4899',
  },

  rarityLabels: {
    common: '일반',
    uncommon: '고급',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설',
    secret: '비밀',
  },
};

// ============================================
// 보상 시스템 설정
// ============================================

export const achievementRewards: AchievementRewardSystem = {
  types: {
    points: { description: '업적 포인트 - 총 진행도 표시', currency: false },
    unlock: { description: '새로운 기능/콘텐츠 해금', permanent: true },
    title: { description: '표시 가능한 칭호', equippable: true },
    cosmetic: { description: '시각적 커스터마이징', equippable: true },
    perk: { description: '영구적 보너스', permanent: true },
    skill_boost: { description: '스킬 보너스', immediate: true },
    ending_unlock: { description: '새 엔딩 경로 해금', permanent: true },
    special_ending: { description: '특별 엔딩 해금', permanent: true },
    achievement_unlock: { description: '업적 해금', permanent: true },
    cash: { description: '현금 보상', immediate: true },
    users: { description: '사용자 보상', immediate: true },
    energy: { description: '에너지 보상', immediate: true },
  },

  pointTiers: [
    { points: 100, reward: { type: 'cosmetic', target: 'bronze_frame' } },
    { points: 250, reward: { type: 'unlock', target: 'custom_difficulty' } },
    { points: 500, reward: { type: 'cosmetic', target: 'silver_frame' } },
    { points: 1000, reward: { type: 'unlock', target: 'developer_commentary' } },
    { points: 2000, reward: { type: 'cosmetic', target: 'gold_frame' } },
    { points: 3500, reward: { type: 'unlock', target: 'sandbox_mode' } },
    { points: 5000, reward: { type: 'cosmetic', target: 'platinum_frame' } },
  ],
};

// ============================================
// 마일스톤 업적
// ============================================

const milestoneAchievements: Achievement[] = [
  // 사용자 마일스톤
  {
    id: 'first_user',
    name: '첫 번째 사용자',
    description: '첫 번째 사용자를 획득했습니다',
    icon: '👤',
    category: 'milestones',
    rarity: 'common',
    condition: { type: 'users_total', operator: '>=', value: 1 },
    rewards: [{ type: 'points', value: 10 }],
    points: 10,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'hundred_users',
    name: '세 자릿수',
    description: '100명의 사용자를 달성했습니다',
    icon: '👥',
    category: 'milestones',
    rarity: 'common',
    condition: { type: 'users_total', operator: '>=', value: 100 },
    rewards: [
      { type: 'points', value: 25 },
      { type: 'unlock', target: 'advanced_analytics' },
    ],
    points: 25,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'thousand_users',
    name: '천 명의 동지',
    description: '1,000명의 사용자를 달성했습니다',
    icon: '🎉',
    category: 'milestones',
    rarity: 'uncommon',
    condition: { type: 'users_total', operator: '>=', value: 1000 },
    rewards: [
      { type: 'points', value: 50 },
      { type: 'unlock', target: 'npc_investor_contact' },
      { type: 'title', value: '커뮤니티 빌더' },
    ],
    points: 50,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'ten_thousand_users',
    name: '만 명 돌파',
    description: '10,000명의 사용자를 달성했습니다',
    icon: '🚀',
    category: 'milestones',
    rarity: 'rare',
    condition: { type: 'users_total', operator: '>=', value: 10000 },
    rewards: [
      { type: 'points', value: 100 },
      { type: 'unlock', target: 'b2b_sales' },
      { type: 'cosmetic', target: 'office_upgrade_2' },
    ],
    points: 100,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'hundred_thousand_users',
    name: '10만 제국',
    description: '100,000명의 사용자를 달성했습니다',
    icon: '👑',
    category: 'milestones',
    rarity: 'epic',
    condition: { type: 'users_total', operator: '>=', value: 100000 },
    rewards: [
      { type: 'points', value: 250 },
      { type: 'unlock', target: 'acquisition_offers' },
      { type: 'ending_unlock', target: 'market_leader' },
    ],
    points: 250,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'million_users',
    name: '밀리언 클럽',
    description: '1,000,000명의 사용자를 달성했습니다',
    icon: '💎',
    category: 'milestones',
    rarity: 'legendary',
    condition: { type: 'users_total', operator: '>=', value: 1000000 },
    rewards: [
      { type: 'points', value: 500 },
      { type: 'unlock', target: 'ipo_path' },
      { type: 'special_ending', target: 'tech_giant' },
    ],
    points: 500,
    hidden: false,
    repeatable: false,
  },

  // 수익 마일스톤
  {
    id: 'first_revenue',
    name: '첫 수익',
    description: '첫 번째 유료 사용자를 획득했습니다',
    icon: '💰',
    category: 'milestones',
    rarity: 'common',
    condition: { type: 'premium_users', operator: '>=', value: 1 },
    rewards: [{ type: 'points', value: 20 }],
    points: 20,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'million_won_revenue',
    name: '월 100만원',
    description: '월 매출 100만원을 달성했습니다',
    icon: '📈',
    category: 'milestones',
    rarity: 'uncommon',
    condition: { type: 'monthly_revenue', operator: '>=', value: 1000000 },
    rewards: [
      { type: 'points', value: 50 },
      { type: 'unlock', target: 'hire_first_employee' },
    ],
    points: 50,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'profitable',
    name: '흑자 전환',
    description: '월간 순이익이 양수가 되었습니다',
    icon: '✨',
    category: 'milestones',
    rarity: 'rare',
    condition: { type: 'monthly_profit', operator: '>', value: 0 },
    rewards: [
      { type: 'points', value: 75 },
      { type: 'unlock', target: 'expansion_options' },
      { type: 'title', value: '수익성 있는 창업자' },
    ],
    points: 75,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'billion_won_valuation',
    name: '10억 가치',
    description: '회사 가치가 10억원을 넘었습니다',
    icon: '🏆',
    category: 'milestones',
    rarity: 'epic',
    condition: { type: 'company_valuation', operator: '>=', value: 1000000000 },
    rewards: [
      { type: 'points', value: 150 },
      { type: 'unlock', target: 'series_a' },
    ],
    points: 150,
    hidden: false,
    repeatable: false,
  },

  // 시간 마일스톤
  {
    id: 'survive_month',
    name: '첫 달 생존',
    description: '30일을 버텼습니다',
    icon: '📅',
    category: 'milestones',
    rarity: 'common',
    condition: { type: 'days_survived', operator: '>=', value: 30 },
    rewards: [{ type: 'points', value: 15 }],
    points: 15,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'survive_quarter',
    name: '분기 생존',
    description: '90일을 버텼습니다',
    icon: '📆',
    category: 'milestones',
    rarity: 'uncommon',
    condition: { type: 'days_survived', operator: '>=', value: 90 },
    rewards: [
      { type: 'points', value: 30 },
      { type: 'unlock', target: 'quarterly_report' },
    ],
    points: 30,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'survive_year',
    name: '1년 생존',
    description: '365일을 버텼습니다 (상위 37.3%)',
    icon: '🎂',
    category: 'milestones',
    rarity: 'rare',
    condition: { type: 'days_survived', operator: '>=', value: 365 },
    rewards: [
      { type: 'points', value: 100 },
      { type: 'unlock', target: 'year_in_review' },
      { type: 'title', value: '생존자' },
    ],
    points: 100,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'survive_three_years',
    name: '3년 생존',
    description: '1,095일을 버텼습니다 (상위 29.1%)',
    icon: '🏅',
    category: 'milestones',
    rarity: 'epic',
    condition: { type: 'days_survived', operator: '>=', value: 1095 },
    rewards: [
      { type: 'points', value: 200 },
      { type: 'unlock', target: 'veteran_perks' },
    ],
    points: 200,
    hidden: false,
    repeatable: false,
  },
];

// ============================================
// 스킬 업적
// ============================================

const skillAchievements: Achievement[] = [
  {
    id: 'jack_of_all_trades',
    name: '팔방미인',
    description: '모든 스킬을 30 이상으로 올렸습니다',
    icon: '🎭',
    category: 'skills',
    rarity: 'uncommon',
    condition: {
      type: 'all_skills_min',
      value: 30,
      skills: ['coding', 'design', 'marketing', 'business', 'communication'],
    },
    rewards: [
      { type: 'points', value: 50 },
      { type: 'perk', target: 'versatility_bonus' },
    ],
    points: 50,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'coding_master',
    name: '코딩 마스터',
    description: '코딩 스킬 80 달성',
    icon: '💻',
    category: 'skills',
    rarity: 'rare',
    condition: { type: 'skill_level', skill: 'coding', operator: '>=', value: 80 },
    rewards: [
      { type: 'points', value: 75 },
      { type: 'unlock', target: 'advanced_features' },
      { type: 'title', value: '10x 개발자' },
    ],
    points: 75,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'design_master',
    name: '디자인 마스터',
    description: '디자인 스킬 80 달성',
    icon: '🎨',
    category: 'skills',
    rarity: 'rare',
    condition: { type: 'skill_level', skill: 'design', operator: '>=', value: 80 },
    rewards: [
      { type: 'points', value: 75 },
      { type: 'unlock', target: 'premium_ui' },
      { type: 'title', value: 'UX 마스터' },
    ],
    points: 75,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'marketing_guru',
    name: '마케팅 구루',
    description: '마케팅 스킬 80 달성',
    icon: '📢',
    category: 'skills',
    rarity: 'rare',
    condition: { type: 'skill_level', skill: 'marketing', operator: '>=', value: 80 },
    rewards: [
      { type: 'points', value: 75 },
      { type: 'unlock', target: 'viral_campaigns' },
      { type: 'perk', target: 'marketing_efficiency' },
    ],
    points: 75,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'business_mogul',
    name: '비즈니스 거물',
    description: '비즈니스 스킬 80 달성',
    icon: '💼',
    category: 'skills',
    rarity: 'rare',
    condition: { type: 'skill_level', skill: 'business', operator: '>=', value: 80 },
    rewards: [
      { type: 'points', value: 75 },
      { type: 'unlock', target: 'enterprise_deals' },
    ],
    points: 75,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'max_skill',
    name: '정점에 서다',
    description: '아무 스킬이나 100 달성',
    icon: '⭐',
    category: 'skills',
    rarity: 'epic',
    condition: { type: 'any_skill_level', operator: '>=', value: 100 },
    rewards: [
      { type: 'points', value: 150 },
      { type: 'title', value: '마스터' },
      { type: 'cosmetic', target: 'golden_badge' },
    ],
    points: 150,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'all_max_skills',
    name: '전설의 창업자',
    description: '모든 스킬 100 달성',
    icon: '👑',
    category: 'skills',
    rarity: 'legendary',
    condition: {
      type: 'all_skills_min',
      value: 100,
      skills: ['coding', 'design', 'marketing', 'business', 'communication', 'leadership'],
    },
    rewards: [
      { type: 'points', value: 500 },
      { type: 'special_ending', target: 'legend' },
      { type: 'unlock', target: 'new_game_plus_hard' },
    ],
    points: 500,
    hidden: false,
    repeatable: false,
  },
];

// ============================================
// 이벤트 업적
// ============================================

const eventAchievements: Achievement[] = [
  {
    id: 'event_handler',
    name: '이벤트 핸들러',
    description: '100개의 이벤트를 처리했습니다',
    icon: '📋',
    category: 'events',
    rarity: 'common',
    condition: { type: 'events_handled', operator: '>=', value: 100 },
    rewards: [{ type: 'points', value: 25 }],
    points: 25,
    hidden: false,
    repeatable: true,
    maxRepeats: 10,
  },
  {
    id: 'crisis_manager',
    name: '위기 관리자',
    description: '10개의 치명적 이벤트를 성공적으로 해결했습니다',
    icon: '🚨',
    category: 'events',
    rarity: 'uncommon',
    condition: { type: 'critical_events_resolved', operator: '>=', value: 10 },
    rewards: [
      { type: 'points', value: 50 },
      { type: 'perk', target: 'crisis_resistance' },
    ],
    points: 50,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'viral_success',
    name: '바이럴 성공',
    description: '바이럴 이벤트를 경험했습니다',
    icon: '🔥',
    category: 'events',
    rarity: 'rare',
    condition: { type: 'event_experienced', event: 'viral_moment' },
    rewards: [
      { type: 'points', value: 75 },
      { type: 'unlock', target: 'influencer_contacts' },
    ],
    points: 75,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'perfect_month',
    name: '완벽한 한 달',
    description: '한 달 동안 모든 이벤트를 최적의 선택으로 해결했습니다',
    icon: '💯',
    category: 'events',
    rarity: 'epic',
    condition: { type: 'perfect_event_streak', value: 30 },
    rewards: [
      { type: 'points', value: 150 },
      { type: 'title', value: '완벽주의자' },
    ],
    points: 150,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'seen_it_all',
    name: '다 봤다',
    description: '500개의 고유 이벤트를 경험했습니다',
    icon: '👁️',
    category: 'events',
    rarity: 'legendary',
    condition: { type: 'unique_events_seen', operator: '>=', value: 500 },
    rewards: [
      { type: 'points', value: 300 },
      { type: 'unlock', target: 'event_editor' },
    ],
    points: 300,
    hidden: false,
    repeatable: false,
  },
];

// ============================================
// NPC 관계 업적
// ============================================

const relationshipAchievements: Achievement[] = [
  {
    id: 'first_friend',
    name: '첫 번째 친구',
    description: 'NPC와 친구 관계(40+)가 되었습니다',
    icon: '😊',
    category: 'relationships',
    rarity: 'common',
    condition: { type: 'npc_relationship', operator: '>=', value: 40 },
    rewards: [{ type: 'points', value: 20 }],
    points: 20,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'trusted_partner',
    name: '신뢰받는 파트너',
    description: 'NPC와 신뢰 관계(80+)를 구축했습니다',
    icon: '🤝',
    category: 'relationships',
    rarity: 'uncommon',
    condition: { type: 'npc_relationship', operator: '>=', value: 80 },
    rewards: [
      { type: 'points', value: 50 },
      { type: 'unlock', target: 'exclusive_opportunities' },
    ],
    points: 50,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'social_butterfly',
    name: '사교계의 나비',
    description: '10명의 NPC와 친구 이상 관계를 유지하고 있습니다',
    icon: '🦋',
    category: 'relationships',
    rarity: 'rare',
    condition: { type: 'npc_friends_count', operator: '>=', value: 10 },
    rewards: [
      { type: 'points', value: 75 },
      { type: 'perk', target: 'networking_bonus' },
    ],
    points: 75,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'mentor_bond',
    name: '스승과 제자',
    description: '멘토 NPC와 최대 친밀도를 달성했습니다',
    icon: '🎓',
    category: 'relationships',
    rarity: 'rare',
    condition: { type: 'npc_max_relationship', npc_type: 'mentor' },
    rewards: [
      { type: 'points', value: 75 },
      { type: 'skill_boost', skill: 'all', value: 5 },
    ],
    points: 75,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'investor_backing',
    name: '투자자의 신뢰',
    description: '투자자 NPC로부터 투자를 받았습니다',
    icon: '💵',
    category: 'relationships',
    rarity: 'uncommon',
    condition: { type: 'event_completed', event: 'investment_received' },
    rewards: [
      { type: 'points', value: 50 },
      { type: 'unlock', target: 'follow_on_investment' },
    ],
    points: 50,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'meet_all_npcs',
    name: '모두의 친구',
    description: '게임 내 모든 NPC를 만났습니다',
    icon: '🌟',
    category: 'relationships',
    rarity: 'epic',
    condition: { type: 'all_npcs_met' },
    rewards: [
      { type: 'points', value: 150 },
      { type: 'unlock', target: 'npc_gallery' },
      { type: 'title', value: '커넥터' },
    ],
    points: 150,
    hidden: false,
    repeatable: false,
  },
];

// ============================================
// 도전 업적
// ============================================

const challengeAchievements: Achievement[] = [
  {
    id: 'bootstrap_success',
    name: '부트스트랩 성공',
    description: '외부 투자 없이 흑자 전환에 성공했습니다',
    icon: '🥾',
    category: 'challenges',
    rarity: 'rare',
    condition: {
      type: 'compound',
      all: [
        { type: 'monthly_profit', operator: '>', value: 0 },
        { type: 'total_investment', operator: '==', value: 0 },
      ],
    },
    rewards: [
      { type: 'points', value: 100 },
      { type: 'title', value: '부트스트래퍼' },
      { type: 'unlock', target: 'bootstrap_mode' },
    ],
    points: 100,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'speed_runner',
    name: '스피드 러너',
    description: '100일 이내에 10,000 사용자를 달성했습니다',
    icon: '⚡',
    category: 'challenges',
    rarity: 'epic',
    condition: {
      type: 'compound',
      all: [
        { type: 'users_total', operator: '>=', value: 10000 },
        { type: 'days_survived', operator: '<=', value: 100 },
      ],
    },
    rewards: [
      { type: 'points', value: 200 },
      { type: 'title', value: '로켓 성장' },
    ],
    points: 200,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'minimalist',
    name: '미니멀리스트',
    description: '초기 자금의 절반만 사용하고 흑자 전환',
    icon: '📦',
    category: 'challenges',
    rarity: 'rare',
    condition: {
      type: 'compound',
      all: [
        { type: 'monthly_profit', operator: '>', value: 0 },
        { type: 'total_spending', operator: '<', value: 2500000 },
      ],
    },
    rewards: [
      { type: 'points', value: 100 },
      { type: 'unlock', target: 'low_budget_start' },
    ],
    points: 100,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'no_burnout',
    name: '워라밸 마스터',
    description: '1년 동안 번아웃 없이 운영했습니다',
    icon: '☯️',
    category: 'challenges',
    rarity: 'rare',
    condition: {
      type: 'compound',
      all: [
        { type: 'days_survived', operator: '>=', value: 365 },
        { type: 'burnout_count', operator: '==', value: 0 },
      ],
    },
    rewards: [
      { type: 'points', value: 100 },
      { type: 'perk', target: 'stress_resistance' },
      { type: 'title', value: '균형 잡힌 창업자' },
    ],
    points: 100,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'zero_to_hero',
    name: '제로 투 히어로',
    description: '파산 직전에서 회복하여 흑자 전환',
    icon: '🦸',
    category: 'challenges',
    rarity: 'epic',
    condition: {
      type: 'compound',
      sequence: [
        { type: 'cash', operator: '<', value: 100000 },
        { type: 'monthly_profit', operator: '>', value: 1000000 },
      ],
    },
    rewards: [
      { type: 'points', value: 150 },
      { type: 'title', value: '불사조' },
      { type: 'unlock', target: 'comeback_story' },
    ],
    points: 150,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'perfect_game',
    name: '퍼펙트 게임',
    description: '한 번도 적자 없이 1년 운영',
    icon: '💎',
    category: 'challenges',
    rarity: 'legendary',
    condition: {
      type: 'compound',
      all: [
        { type: 'days_survived', operator: '>=', value: 365 },
        { type: 'deficit_months', operator: '==', value: 0 },
      ],
    },
    rewards: [
      { type: 'points', value: 300 },
      { type: 'special_ending', target: 'perfect' },
      { type: 'unlock', target: 'golden_save_slot' },
    ],
    points: 300,
    hidden: false,
    repeatable: false,
  },
];

// ============================================
// 숨겨진 업적
// ============================================

const secretAchievements: Achievement[] = [
  {
    id: 'night_owl',
    name: '올빼미',
    description: '???',
    hint: '밤을 새워본 적 있나요?',
    icon: '🦉',
    category: 'secret',
    rarity: 'secret',
    condition: { type: 'consecutive_late_nights', value: 7 },
    rewards: [
      { type: 'points', value: 30 },
      { type: 'cosmetic', target: 'dark_theme_special' },
    ],
    points: 30,
    hidden: true,
    repeatable: false,
  },
  {
    id: 'coffee_addict',
    name: '카페인 중독',
    description: '???',
    hint: '커피를 정말 좋아하시나 봐요',
    icon: '☕',
    category: 'secret',
    rarity: 'secret',
    condition: { type: 'coffee_consumed', operator: '>=', value: 100 },
    rewards: [
      { type: 'points', value: 25 },
      { type: 'perk', target: 'coffee_efficiency' },
    ],
    points: 25,
    hidden: true,
    repeatable: false,
  },
  {
    id: 'easter_egg_hunter',
    name: '이스터에그 헌터',
    description: '???',
    hint: '숨겨진 것들을 찾아보세요',
    icon: '🥚',
    category: 'secret',
    rarity: 'secret',
    condition: { type: 'easter_eggs_found', operator: '>=', value: 10 },
    rewards: [
      { type: 'points', value: 100 },
      { type: 'unlock', target: 'secret_room' },
    ],
    points: 100,
    hidden: true,
    repeatable: false,
  },
  {
    id: 'reject_acquisition',
    name: '포기하지 않아',
    description: '???',
    hint: '때로는 거절도 용기입니다',
    icon: '✊',
    category: 'secret',
    rarity: 'secret',
    condition: { type: 'event_choice', event: 'acquisition_offer', choice: 'reject' },
    rewards: [
      { type: 'points', value: 50 },
      { type: 'title', value: '독립 창업자' },
    ],
    points: 50,
    hidden: true,
    repeatable: false,
  },
  {
    id: 'bankruptcy_comeback',
    name: '불굴의 의지',
    description: '???',
    hint: '실패는 성공의 어머니',
    icon: '🔥',
    category: 'secret',
    rarity: 'secret',
    condition: { type: 'meta', requirement: 'bankruptcy_then_million_users' },
    rewards: [
      { type: 'points', value: 200 },
      { type: 'special_ending', target: 'comeback_king' },
      { type: 'title', value: '불굴의 창업자' },
    ],
    points: 200,
    hidden: true,
    repeatable: false,
  },
  {
    id: 'konami_code',
    name: '???',
    description: '???',
    hint: '↑↑↓↓←→←→BA',
    icon: '🎮',
    category: 'secret',
    rarity: 'secret',
    condition: { type: 'konami_code_entered' },
    rewards: [
      { type: 'points', value: 10 },
      { type: 'cosmetic', target: 'retro_mode' },
    ],
    points: 10,
    hidden: true,
    repeatable: false,
  },
  {
    id: 'speedrun_record',
    name: '세계 기록',
    description: '???',
    hint: '얼마나 빨리 할 수 있을까요?',
    icon: '🏃',
    category: 'secret',
    rarity: 'secret',
    condition: { type: 'speedrun_time', operator: '<', value: 3600 },
    rewards: [
      { type: 'points', value: 150 },
      { type: 'title', value: '스피드스터' },
      { type: 'unlock', target: 'speedrun_mode' },
    ],
    points: 150,
    hidden: true,
    repeatable: false,
  },
  {
    id: 'procrastinator',
    name: '프로크래스티네이터',
    description: '???',
    hint: '가끔은 아무것도 안 하는 게...',
    icon: '😴',
    category: 'secret',
    rarity: 'secret',
    condition: { type: 'skip_days', value: 7 },
    rewards: [
      { type: 'points', value: 15 },
    ],
    points: 15,
    hidden: true,
    repeatable: false,
  },
];

// ============================================
// 메타 업적
// ============================================

const metaAchievements: Achievement[] = [
  {
    id: 'first_playthrough',
    name: '첫 번째 여정',
    description: '게임을 처음 완료했습니다',
    icon: '🎬',
    category: 'meta',
    rarity: 'common',
    condition: { type: 'playthroughs_completed', operator: '>=', value: 1 },
    rewards: [
      { type: 'points', value: 50 },
      { type: 'unlock', target: 'new_game_plus' },
    ],
    points: 50,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'second_chance',
    name: '세컨드 찬스',
    description: '뉴 게임+를 시작했습니다',
    icon: '🔄',
    category: 'meta',
    rarity: 'common',
    condition: { type: 'new_game_plus_started' },
    rewards: [{ type: 'points', value: 25 }],
    points: 25,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'all_endings',
    name: '모든 결말',
    description: '모든 엔딩을 봤습니다',
    icon: '📚',
    category: 'meta',
    rarity: 'epic',
    condition: { type: 'endings_seen', operator: '>=', value: 15 },
    rewards: [
      { type: 'points', value: 250 },
      { type: 'unlock', target: 'ending_gallery' },
      { type: 'special_ending', target: 'true_ending' },
    ],
    points: 250,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'all_difficulties',
    name: '난이도 마스터',
    description: '모든 난이도에서 클리어했습니다',
    icon: '🎖️',
    category: 'meta',
    rarity: 'legendary',
    condition: {
      type: 'difficulties_completed',
      required: ['story', 'easy', 'normal', 'hard', 'realistic'],
    },
    rewards: [
      { type: 'points', value: 500 },
      { type: 'unlock', target: 'ultimate_mode' },
      { type: 'title', value: '그랜드마스터' },
    ],
    points: 500,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'hundred_percent',
    name: '100% 완료',
    description: '모든 업적을 달성했습니다',
    icon: '🏆',
    category: 'meta',
    rarity: 'legendary',
    condition: { type: 'all_achievements_unlocked' },
    rewards: [
      { type: 'points', value: 1000 },
      { type: 'title', value: '완벽주의자' },
      { type: 'cosmetic', target: 'platinum_badge' },
      { type: 'special_ending', target: 'completionist' },
    ],
    points: 1000,
    hidden: false,
    repeatable: false,
  },
  {
    id: 'veteran_player',
    name: '베테랑 플레이어',
    description: '10회 플레이스루 완료',
    icon: '🎮',
    category: 'meta',
    rarity: 'rare',
    condition: { type: 'playthroughs_completed', operator: '>=', value: 10 },
    rewards: [
      { type: 'points', value: 100 },
      { type: 'title', value: '베테랑' },
    ],
    points: 100,
    hidden: false,
    repeatable: false,
  },
];

// ============================================
// 카테고리 설정
// ============================================

export const achievementCategories: AchievementCategoryConfig[] = [
  {
    id: 'milestones',
    name: '마일스톤',
    icon: '🏁',
    description: '중요한 이정표 달성',
    achievements: milestoneAchievements,
  },
  {
    id: 'skills',
    name: '스킬 마스터리',
    icon: '📚',
    description: '능력 향상 관련 업적',
    achievements: skillAchievements,
  },
  {
    id: 'events',
    name: '이벤트 마스터',
    icon: '📬',
    description: '이벤트 관련 업적',
    achievements: eventAchievements,
  },
  {
    id: 'relationships',
    name: '인맥 관리',
    icon: '🤝',
    description: 'NPC 관계 관련 업적',
    achievements: relationshipAchievements,
  },
  {
    id: 'challenges',
    name: '도전과제',
    icon: '🎯',
    description: '특별한 도전 달성',
    achievements: challengeAchievements,
  },
  {
    id: 'secret',
    name: '???',
    icon: '❓',
    description: '발견해야 하는 숨겨진 업적',
    achievements: secretAchievements,
  },
  {
    id: 'meta',
    name: '메타 진행',
    icon: '🔄',
    description: '여러 플레이를 통한 업적',
    achievements: metaAchievements,
  },
];

// ============================================
// 통합 업적 시스템
// ============================================

export const achievementSystem: AchievementSystem = {
  categories: achievementCategories,
  rewards: achievementRewards,
  display: achievementDisplay,
};

// ============================================
// 업적 관리 클래스
// ============================================

export class AchievementManager {
  private achievements: Map<string, Achievement> = new Map();
  private unlockedAchievements: Set<string> = new Set();
  private achievementPoints: number = 0;

  constructor() {
    this.initializeAchievements();
  }

  private initializeAchievements(): void {
    for (const category of achievementCategories) {
      for (const achievement of category.achievements) {
        this.achievements.set(achievement.id, { ...achievement });
      }
    }
  }

  // 모든 업적 조회
  getAllAchievements(): Achievement[] {
    return Array.from(this.achievements.values());
  }

  // 카테고리별 업적 조회
  getAchievementsByCategory(category: AchievementCategory): Achievement[] {
    return this.getAllAchievements().filter(a => a.category === category);
  }

  // 해금된 업적 조회
  getUnlockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(a => this.unlockedAchievements.has(a.id));
  }

  // 미해금 업적 조회 (히든 제외)
  getLockedAchievements(): Achievement[] {
    return this.getAllAchievements().filter(
      a => !this.unlockedAchievements.has(a.id) && !a.hidden
    );
  }

  // 업적 해금
  unlockAchievement(id: string): Achievement | null {
    const achievement = this.achievements.get(id);
    if (!achievement) return null;

    if (this.unlockedAchievements.has(id)) {
      // 반복 가능한 업적 처리
      if (achievement.repeatable) {
        const current = achievement.repeatCount || 0;
        if (!achievement.maxRepeats || current < achievement.maxRepeats) {
          achievement.repeatCount = current + 1;
          this.achievementPoints += achievement.points;
          return achievement;
        }
      }
      return null;
    }

    achievement.unlockedAt = new Date();
    this.unlockedAchievements.add(id);
    this.achievementPoints += achievement.points;

    return achievement;
  }

  // 업적 진행도 업데이트
  updateProgress(id: string, progress: number): Achievement | null {
    const achievement = this.achievements.get(id);
    if (!achievement || this.unlockedAchievements.has(id)) return null;

    achievement.progress = progress;

    // 조건 충족 시 자동 해금
    if (achievement.progressMax && progress >= achievement.progressMax) {
      return this.unlockAchievement(id);
    }

    return achievement;
  }

  // 조건 체크
  checkCondition(condition: AchievementCondition, state: any): boolean {
    switch (condition.type) {
      case 'users_total':
        return this.compareValue(state.users, condition.operator!, condition.value as number);
      case 'premium_users':
        return this.compareValue(state.premiumUsers, condition.operator!, condition.value as number);
      case 'monthly_revenue':
        return this.compareValue(state.monthlyRevenue, condition.operator!, condition.value as number);
      case 'monthly_profit':
        return this.compareValue(state.monthlyProfit, condition.operator!, condition.value as number);
      case 'days_survived':
        return this.compareValue(state.daysSurvived, condition.operator!, condition.value as number);
      case 'skill_level':
        return this.compareValue(
          state.skills?.[condition.skill!] || 0,
          condition.operator!,
          condition.value as number
        );
      case 'any_skill_level':
        return Object.values(state.skills || {}).some(
          (level) => this.compareValue(level as number, condition.operator!, condition.value as number)
        );
      case 'all_skills_min':
        return (condition.skills || []).every(
          (skill) => (state.skills?.[skill] || 0) >= (condition.value as number)
        );
      case 'npc_relationship':
        return Object.values(state.npcRelationships || {}).some(
          (rel) => this.compareValue(rel as number, condition.operator!, condition.value as number)
        );
      case 'events_handled':
        return this.compareValue(state.eventsHandled, condition.operator!, condition.value as number);
      case 'playthroughs_completed':
        return this.compareValue(state.playthroughsCompleted, condition.operator!, condition.value as number);
      case 'compound':
        if (condition.all) {
          return condition.all.every(c => this.checkCondition(c, state));
        }
        if (condition.any) {
          return condition.any.some(c => this.checkCondition(c, state));
        }
        return false;
      default:
        return false;
    }
  }

  private compareValue(actual: number, operator: string, target: number): boolean {
    switch (operator) {
      case '>': return actual > target;
      case '>=': return actual >= target;
      case '==': return actual === target;
      case '<': return actual < target;
      case '<=': return actual <= target;
      case '!=': return actual !== target;
      default: return false;
    }
  }

  // 모든 업적 조건 체크 및 해금
  checkAllAchievements(state: any): Achievement[] {
    const newlyUnlocked: Achievement[] = [];

    for (const [id, achievement] of this.achievements) {
      if (this.unlockedAchievements.has(id) && !achievement.repeatable) continue;

      if (this.checkCondition(achievement.condition, state)) {
        const unlocked = this.unlockAchievement(id);
        if (unlocked) {
          newlyUnlocked.push(unlocked);
        }
      }
    }

    return newlyUnlocked;
  }

  // 포인트 조회
  getAchievementPoints(): number {
    return this.achievementPoints;
  }

  // 진행률 조회
  getProgress(): { unlocked: number; total: number; percentage: number } {
    const total = this.achievements.size;
    const unlocked = this.unlockedAchievements.size;
    return {
      unlocked,
      total,
      percentage: Math.round((unlocked / total) * 100),
    };
  }

  // 희귀도별 통계
  getRarityStats(): Record<AchievementRarity, { unlocked: number; total: number }> {
    const stats: Record<AchievementRarity, { unlocked: number; total: number }> = {
      common: { unlocked: 0, total: 0 },
      uncommon: { unlocked: 0, total: 0 },
      rare: { unlocked: 0, total: 0 },
      epic: { unlocked: 0, total: 0 },
      legendary: { unlocked: 0, total: 0 },
      secret: { unlocked: 0, total: 0 },
    };

    for (const achievement of this.achievements.values()) {
      stats[achievement.rarity].total++;
      if (this.unlockedAchievements.has(achievement.id)) {
        stats[achievement.rarity].unlocked++;
      }
    }

    return stats;
  }

  // 저장/로드
  serialize(): { unlocked: string[]; points: number; progress: Record<string, number> } {
    const progress: Record<string, number> = {};
    for (const [id, achievement] of this.achievements) {
      if (achievement.progress) {
        progress[id] = achievement.progress;
      }
    }

    return {
      unlocked: Array.from(this.unlockedAchievements),
      points: this.achievementPoints,
      progress,
    };
  }

  deserialize(data: { unlocked: string[]; points: number; progress: Record<string, number> }): void {
    this.unlockedAchievements = new Set(data.unlocked);
    this.achievementPoints = data.points;

    for (const [id, progress] of Object.entries(data.progress)) {
      const achievement = this.achievements.get(id);
      if (achievement) {
        achievement.progress = progress;
      }
    }
  }

  // 리셋
  reset(): void {
    this.unlockedAchievements.clear();
    this.achievementPoints = 0;
    this.initializeAchievements();
  }
}

// 싱글톤 인스턴스
export const achievementManager = new AchievementManager();

export default AchievementManager;
