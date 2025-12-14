/**
 * Chapter 3: Content & Narrative - Achievements System
 * 게임 업적 데이터 정의
 */

import type { GameState } from '../types';

// ============================================
// 업적 타입 정의
// ============================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  category: AchievementCategory;
  points: number;
  hidden?: boolean;
  condition: (state: GameState) => boolean;
  reward?: AchievementReward;
}

export type AchievementCategory =
  | 'progress'
  | 'users'
  | 'revenue'
  | 'technical'
  | 'business'
  | 'personal'
  | 'special'
  | 'secret';

export interface AchievementReward {
  type: 'cash' | 'reputation' | 'skill' | 'unlock';
  value: number | string;
}

// ============================================
// 업적 데이터
// ============================================

export const ACHIEVEMENTS: Achievement[] = [
  // ============================================
  // 진행 업적 (Progress)
  // ============================================
  {
    id: 'first_day',
    name: '첫 발자국',
    description: '게임을 처음 시작했습니다.',
    icon: '👶',
    rarity: 'common',
    category: 'progress',
    points: 10,
    condition: (state) => state.time.totalDays >= 1,
  },
  {
    id: 'week_one',
    name: '일주일 생존',
    description: '첫 일주일을 버텼습니다.',
    icon: '📅',
    rarity: 'common',
    category: 'progress',
    points: 20,
    condition: (state) => state.time.totalDays >= 7,
  },
  {
    id: 'month_one',
    name: '30일의 여정',
    description: '한 달 동안 서비스를 운영했습니다.',
    icon: '🗓️',
    rarity: 'uncommon',
    category: 'progress',
    points: 50,
    condition: (state) => state.time.totalDays >= 30,
  },
  {
    id: 'quarter',
    name: '분기 달성',
    description: '90일 동안 서비스를 운영했습니다.',
    icon: '📊',
    rarity: 'rare',
    category: 'progress',
    points: 100,
    condition: (state) => state.time.totalDays >= 90,
  },
  {
    id: 'half_year',
    name: '반년의 성과',
    description: '180일 동안 서비스를 운영했습니다.',
    icon: '🏆',
    rarity: 'epic',
    category: 'progress',
    points: 200,
    condition: (state) => state.time.totalDays >= 180,
  },
  {
    id: 'one_year',
    name: '1년차 창업가',
    description: '365일 동안 서비스를 운영했습니다.',
    icon: '🎂',
    rarity: 'legendary',
    category: 'progress',
    points: 500,
    condition: (state) => state.time.totalDays >= 365,
  },

  // ============================================
  // 사용자 업적 (Users)
  // ============================================
  {
    id: 'first_user',
    name: '첫 번째 사용자',
    description: '첫 번째 사용자가 가입했습니다!',
    icon: '👤',
    rarity: 'common',
    category: 'users',
    points: 20,
    condition: (state) => state.business.users.total >= 1,
  },
  {
    id: 'hundred_users',
    name: '100명 돌파',
    description: '누적 사용자 100명을 달성했습니다.',
    icon: '💯',
    rarity: 'uncommon',
    category: 'users',
    points: 50,
    condition: (state) => state.business.users.total >= 100,
  },
  {
    id: 'thousand_users',
    name: '1,000명 커뮤니티',
    description: '사용자 1,000명을 돌파했습니다!',
    icon: '🎊',
    rarity: 'rare',
    category: 'users',
    points: 100,
    condition: (state) => state.business.users.total >= 1000,
  },
  {
    id: 'ten_thousand_users',
    name: '만 명의 학습자',
    description: '10,000명의 사용자가 VocaVision을 사용합니다!',
    icon: '🌟',
    rarity: 'epic',
    category: 'users',
    points: 250,
    condition: (state) => state.business.users.total >= 10000,
  },
  {
    id: 'hundred_thousand',
    name: '10만 돌파',
    description: '100,000명의 사용자를 달성했습니다!',
    icon: '🚀',
    rarity: 'legendary',
    category: 'users',
    points: 500,
    condition: (state) => state.business.users.total >= 100000,
  },
  {
    id: 'first_premium',
    name: '첫 결제',
    description: '첫 번째 유료 사용자가 생겼습니다!',
    icon: '💎',
    rarity: 'uncommon',
    category: 'users',
    points: 50,
    condition: (state) => state.business.users.premium >= 1,
  },
  {
    id: 'hundred_premium',
    name: '프리미엄 100',
    description: '프리미엄 사용자 100명을 달성했습니다.',
    icon: '💠',
    rarity: 'rare',
    category: 'users',
    points: 150,
    condition: (state) => state.business.users.premium >= 100,
  },
  {
    id: 'thousand_premium',
    name: '프리미엄 1,000',
    description: '프리미엄 사용자 1,000명을 달성했습니다!',
    icon: '👑',
    rarity: 'epic',
    category: 'users',
    points: 300,
    condition: (state) => state.business.users.premium >= 1000,
  },

  // ============================================
  // 수익 업적 (Revenue)
  // ============================================
  {
    id: 'first_revenue',
    name: '첫 수익',
    description: '첫 번째 매출이 발생했습니다.',
    icon: '💵',
    rarity: 'uncommon',
    category: 'revenue',
    points: 50,
    condition: (state) => state.business.users.premium >= 1,
  },
  {
    id: 'mrr_million',
    name: 'MRR 100만원',
    description: '월간 반복 매출 100만원을 달성했습니다.',
    icon: '📈',
    rarity: 'rare',
    category: 'revenue',
    points: 100,
    condition: (state) => state.business.users.premium * 9990 >= 1000000,
  },
  {
    id: 'mrr_five_million',
    name: 'MRR 500만원',
    description: '월간 반복 매출 500만원을 달성했습니다.',
    icon: '💰',
    rarity: 'epic',
    category: 'revenue',
    points: 200,
    condition: (state) => state.business.users.premium * 9990 >= 5000000,
  },
  {
    id: 'mrr_ten_million',
    name: 'MRR 1,000만원',
    description: '월간 반복 매출 1,000만원을 달성했습니다!',
    icon: '🤑',
    rarity: 'legendary',
    category: 'revenue',
    points: 500,
    condition: (state) => state.business.users.premium * 9990 >= 10000000,
  },
  {
    id: 'profitable',
    name: '흑자 전환',
    description: '월 수입이 월 지출을 초과했습니다.',
    icon: '📊',
    rarity: 'epic',
    category: 'revenue',
    points: 250,
    condition: (state) => {
      const mrr = state.business.users.premium * 9990;
      const monthlyExpenses = state.business.finance.monthlyExpenses || 1000000;
      return mrr > monthlyExpenses;
    },
  },
  {
    id: 'runway_year',
    name: '연 단위 런웨이',
    description: '런웨이가 12개월 이상입니다.',
    icon: '🛫',
    rarity: 'rare',
    category: 'revenue',
    points: 150,
    condition: (state) => state.business.finance.runway >= 12,
  },

  // ============================================
  // 기술 업적 (Technical)
  // ============================================
  {
    id: 'first_feature',
    name: '기능 완성',
    description: '새로운 기능을 처음 개발했습니다.',
    icon: '🔧',
    rarity: 'common',
    category: 'technical',
    points: 20,
    condition: (state) => state.progress.completedEvents.length >= 1,
  },
  {
    id: 'stable_system',
    name: '안정적인 시스템',
    description: '서버 안정성 95% 이상을 유지합니다.',
    icon: '🛡️',
    rarity: 'rare',
    category: 'technical',
    points: 100,
    condition: (state) => state.business.infrastructure.serverHealth >= 95,
  },
  {
    id: 'no_debt',
    name: '기술 부채 청산',
    description: '기술 부채를 20 이하로 유지합니다.',
    icon: '✨',
    rarity: 'epic',
    category: 'technical',
    points: 150,
    condition: (state) => (state.business.infrastructure as any).technicalDebt <= 20,
  },
  {
    id: 'dev_master',
    name: '개발 마스터',
    description: '코딩 스킬 레벨 50 달성.',
    icon: '💻',
    rarity: 'epic',
    category: 'technical',
    points: 200,
    condition: (state) => state.player.skills.coding >= 50,
  },

  // ============================================
  // 비즈니스 업적 (Business)
  // ============================================
  {
    id: 'first_investment',
    name: '첫 투자',
    description: '투자를 유치했습니다.',
    icon: '🤝',
    rarity: 'rare',
    category: 'business',
    points: 150,
    condition: (state) => state.progress.completedEvents.includes('got_investment'),
  },
  {
    id: 'reputation_high',
    name: '명성 획득',
    description: '평판 점수 80 이상을 달성했습니다.',
    icon: '⭐',
    rarity: 'rare',
    category: 'business',
    points: 100,
    condition: (state) => state.player.social.reputation >= 80,
  },
  {
    id: 'business_master',
    name: '비즈니스 마스터',
    description: '비즈니스 스킬 레벨 50 달성.',
    icon: '📈',
    rarity: 'epic',
    category: 'business',
    points: 200,
    condition: (state) => state.player.skills.business >= 50,
  },
  {
    id: 'marketing_master',
    name: '마케팅 마스터',
    description: '마케팅 스킬 레벨 50 달성.',
    icon: '📢',
    rarity: 'epic',
    category: 'business',
    points: 200,
    condition: (state) => state.player.skills.marketing >= 50,
  },

  // ============================================
  // 개인 업적 (Personal)
  // ============================================
  {
    id: 'work_life_balance',
    name: '워라밸 마스터',
    description: '스트레스 20 이하, 에너지 80 이상 유지.',
    icon: '⚖️',
    rarity: 'rare',
    category: 'personal',
    points: 100,
    condition: (state) =>
      state.player.health.stress <= 20 && state.player.health.energy >= 80,
  },
  {
    id: 'survivor',
    name: '생존자',
    description: '스트레스 90 이상에서 회복했습니다.',
    icon: '💪',
    rarity: 'uncommon',
    category: 'personal',
    points: 50,
    condition: (state) =>
      state.player.health.stress <= 50 &&
      state.progress.completedEvents.includes('acknowledged_burnout'),
  },
  {
    id: 'social_butterfly',
    name: '네트워크 마스터',
    description: '5명 이상의 NPC와 친한 사이 달성.',
    icon: '🦋',
    rarity: 'rare',
    category: 'personal',
    points: 100,
    condition: (state) => {
      // Check relationships - simplified version
      const relationships = state.relationships || {};
      const friendlyCount = Object.values(relationships).filter(
        (r: any) => r.relationship >= 60
      ).length;
      return friendlyCount >= 5;
    },
  },

  // ============================================
  // 특별 업적 (Special)
  // ============================================
  {
    id: 'bootstrap_king',
    name: '부트스트랩 킹',
    description: '투자 없이 수익성을 달성했습니다.',
    icon: '🏰',
    rarity: 'legendary',
    category: 'special',
    points: 500,
    condition: (state) =>
      state.business.users.premium * 9990 >= 5000000 &&
      !state.progress.completedEvents.includes('got_investment'),
  },
  {
    id: 'unicorn',
    name: '유니콘',
    description: '기업가치 10억 달러를 달성했습니다.',
    icon: '🦄',
    rarity: 'legendary',
    category: 'special',
    points: 1000,
    condition: (state) => {
      // Simplified valuation check
      const valuation = state.business.users.total * 50000; // Rough estimate
      return valuation >= 1000000000000; // 1 trillion KRW ≈ 1B USD
    },
  },
  {
    id: 'ipo_success',
    name: 'IPO 성공',
    description: 'IPO를 성공적으로 완료했습니다.',
    icon: '🔔',
    rarity: 'legendary',
    category: 'special',
    points: 1000,
    condition: (state) => state.progress.completedEvents.includes('ipo_success'),
  },

  // ============================================
  // 비밀 업적 (Secret)
  // ============================================
  {
    id: 'konami_master',
    name: '코나미 마스터',
    description: '???',
    icon: '🎮',
    rarity: 'legendary',
    category: 'secret',
    points: 100,
    hidden: true,
    condition: (state) => state.progress.completedEvents.includes('konami_activated'),
  },
  {
    id: 'night_owl',
    name: '올빼미',
    description: '새벽 3시에 플레이했습니다.',
    icon: '🦉',
    rarity: 'rare',
    category: 'secret',
    points: 50,
    hidden: true,
    condition: () => {
      const hour = new Date().getHours();
      return hour >= 2 && hour <= 4;
    },
  },
  {
    id: 'perfectionist',
    name: '완벽주의자',
    description: '모든 일반 업적을 달성했습니다.',
    icon: '💎',
    rarity: 'legendary',
    category: 'secret',
    points: 500,
    hidden: true,
    condition: (state) => {
      const unlockedCount = state.progress.achievements.length;
      const nonSecretCount = ACHIEVEMENTS.filter(
        (a) => a.category !== 'secret'
      ).length;
      return unlockedCount >= nonSecretCount - 5; // Some buffer
    },
  },
];

// ============================================
// 업적 관리 함수
// ============================================

/**
 * ID로 업적 찾기
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * 카테고리별 업적 필터링
 */
export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

/**
 * 희귀도별 업적 필터링
 */
export function getAchievementsByRarity(
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.rarity === rarity);
}

/**
 * 잠금 해제 가능한 업적 체크
 */
export function checkUnlockableAchievements(
  state: GameState,
  unlockedIds: Set<string>
): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => {
    // 이미 해금된 업적 제외
    if (unlockedIds.has(achievement.id)) return false;
    // 조건 체크
    return achievement.condition(state);
  });
}

/**
 * 총 업적 점수 계산
 */
export function calculateTotalPoints(unlockedIds: string[]): number {
  return ACHIEVEMENTS.filter((a) => unlockedIds.includes(a.id)).reduce(
    (sum, a) => sum + a.points,
    0
  );
}

/**
 * 카테고리 한글명
 */
export function getCategoryLabel(category: AchievementCategory): string {
  const labels: Record<AchievementCategory, string> = {
    progress: '진행',
    users: '사용자',
    revenue: '수익',
    technical: '기술',
    business: '비즈니스',
    personal: '개인',
    special: '특별',
    secret: '비밀',
  };
  return labels[category] || category;
}

/**
 * 희귀도 한글명
 */
export function getRarityLabel(
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
): string {
  const labels = {
    common: '일반',
    uncommon: '고급',
    rare: '희귀',
    epic: '영웅',
    legendary: '전설',
  };
  return labels[rarity];
}

// 통계
export const ACHIEVEMENT_STATS = {
  total: ACHIEVEMENTS.length,
  byRarity: {
    common: ACHIEVEMENTS.filter((a) => a.rarity === 'common').length,
    uncommon: ACHIEVEMENTS.filter((a) => a.rarity === 'uncommon').length,
    rare: ACHIEVEMENTS.filter((a) => a.rarity === 'rare').length,
    epic: ACHIEVEMENTS.filter((a) => a.rarity === 'epic').length,
    legendary: ACHIEVEMENTS.filter((a) => a.rarity === 'legendary').length,
  },
  byCategory: {
    progress: ACHIEVEMENTS.filter((a) => a.category === 'progress').length,
    users: ACHIEVEMENTS.filter((a) => a.category === 'users').length,
    revenue: ACHIEVEMENTS.filter((a) => a.category === 'revenue').length,
    technical: ACHIEVEMENTS.filter((a) => a.category === 'technical').length,
    business: ACHIEVEMENTS.filter((a) => a.category === 'business').length,
    personal: ACHIEVEMENTS.filter((a) => a.category === 'personal').length,
    special: ACHIEVEMENTS.filter((a) => a.category === 'special').length,
    secret: ACHIEVEMENTS.filter((a) => a.category === 'secret').length,
  },
  totalPoints: ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0),
};

export default ACHIEVEMENTS;
