/**
 * Chapter 7: Progression & Engagement - Social System
 * 소셜 & 공유 시스템 - 공유, 커뮤니티, 크로스 프로모션
 */

import {
  SocialSystem,
  SharingConfig,
  ShareableContent,
  ShareTemplate,
  ShareIncentive,
  CommunityConfig,
  CommunityFeature,
  CommunityChallenge,
  CrossPromoConfig,
  GoalReward,
} from './types';

// ============================================
// 공유 가능 콘텐츠
// ============================================

export const shareableContent: ShareableContent[] = [
  // 업적 공유
  {
    id: 'share_achievement',
    name: '업적 공유',
    template: {
      title: '보카비전에서 업적 달성!',
      description: '{{achievement_name}} 업적을 달성했습니다!',
      image: 'achievement_card',
      includeStats: ['total_playtime', 'achievement_count'],
    },
    platforms: ['twitter', 'facebook', 'instagram', 'kakaotalk', 'link'],
  },
  // 엔딩 공유
  {
    id: 'share_ending',
    name: '엔딩 공유',
    template: {
      title: '보카비전 스토리 완료!',
      description: '{{ending_name}} 엔딩에 도달했습니다!',
      image: 'ending_card',
      includeStats: ['days_survived', 'max_users', 'final_revenue'],
      spoilerWarning: true,
    },
    platforms: ['twitter', 'facebook', 'instagram', 'kakaotalk', 'link'],
    requires: 'playthrough_complete',
  },
  // 마일스톤 공유
  {
    id: 'share_milestone',
    name: '마일스톤 공유',
    template: {
      title: '보카비전 마일스톤 달성!',
      description: '{{milestone_name}}을 달성했습니다!',
      image: 'milestone_card',
      includeStats: ['current_day', 'current_users'],
    },
    platforms: ['twitter', 'facebook', 'kakaotalk', 'link'],
  },
  // 도전 완료 공유
  {
    id: 'share_challenge',
    name: '도전 완료 공유',
    template: {
      title: '보카비전 도전 클리어!',
      description: '{{challenge_name}} 도전을 완료했습니다!',
      image: 'challenge_card',
      includeStats: ['completion_time', 'score'],
    },
    platforms: ['twitter', 'facebook', 'instagram', 'kakaotalk', 'link'],
    requires: 'challenge_complete',
  },
  // 스크린샷 공유
  {
    id: 'share_screenshot',
    name: '스크린샷 공유',
    template: {
      title: '보카비전의 한 장면',
      description: '나의 보카비전 순간',
      image: 'user_screenshot',
      includeStats: false,
    },
    platforms: ['twitter', 'facebook', 'instagram', 'kakaotalk', 'link'],
  },
  // 시드 공유
  {
    id: 'share_seed',
    name: '시드 공유',
    template: {
      title: '이 시드로 도전해보세요!',
      description: '시드: {{seed}} - 나와 같은 조건으로 플레이해보세요!',
      image: 'seed_card',
      includeStats: ['seed', 'difficulty', 'modifiers'],
    },
    platforms: ['twitter', 'kakaotalk', 'link', 'discord'],
  },
  // 리더보드 순위 공유
  {
    id: 'share_leaderboard',
    name: '리더보드 순위 공유',
    template: {
      title: '보카비전 리더보드 {{rank}}위!',
      description: '{{leaderboard_name}}에서 {{rank}}위를 달성했습니다!',
      image: 'leaderboard_card',
      includeStats: ['rank', 'score', 'category'],
    },
    platforms: ['twitter', 'facebook', 'kakaotalk', 'link'],
    requires: 'leaderboard_rank',
  },
  // 플레이 통계 공유
  {
    id: 'share_stats',
    name: '플레이 통계 공유',
    template: {
      title: '나의 보카비전 여정',
      description: '총 플레이 시간: {{total_playtime}}',
      image: 'stats_card',
      includeStats: true,
    },
    platforms: ['twitter', 'facebook', 'instagram', 'kakaotalk', 'link'],
  },
];

// ============================================
// 공유 인센티브
// ============================================

export const sharingIncentives: SharingConfig['incentives'] = {
  firstShare: {
    reward: { points: 50, cosmetic: 'frame_social_starter' },
    oneTime: true,
  },
  weeklyShare: {
    reward: { points: 25 },
    maxPerWeek: 3,
  },
  viralBonus: {
    reward: { points: 100, title: '인플루언서' },
    clickThreshold: 100,
  },
};

// ============================================
// 공유 설정 통합
// ============================================

export const sharingConfig: SharingConfig = {
  shareable: shareableContent,
  incentives: sharingIncentives,
};

// ============================================
// 커뮤니티 기능
// ============================================

export const communityFeatures: CommunityFeature[] = [
  {
    id: 'seed_sharing',
    name: '시드 공유',
    description: '플레이스루 시드를 공유하고 다른 플레이어의 시드로 도전',
    format: 'seed_code',
    shareOptions: ['copy', 'qr', 'social'],
  },
  {
    id: 'screenshot_gallery',
    name: '스크린샷 갤러리',
    description: '멋진 순간을 캡처하고 공유',
    editor: true,
    shareOptions: ['gallery', 'social'],
  },
  {
    id: 'strategy_guides',
    name: '전략 가이드',
    description: '플레이어가 작성한 전략 가이드',
    voting: true,
    moderation: true,
    rewards: {
      upvote: { per: 10, reward: { points: 5 } },
      featured: { per: 1, reward: { points: 100, title: '가이드 작성자' } },
    },
  },
  {
    id: 'event_editor',
    name: '이벤트 에디터',
    description: '커스텀 이벤트 생성 및 공유',
    editor: true,
    moderation: true,
    requires: 'event_editor_unlock',
    rewards: {
      download: { per: 100, reward: { points: 50 } },
      featured: { per: 1, reward: { points: 200, cosmetic: 'badge_creator' } },
    },
  },
  {
    id: 'daily_discussion',
    name: '일일 토론',
    description: '일일 도전에 대한 토론 공간',
  },
  {
    id: 'achievement_showcase',
    name: '업적 쇼케이스',
    description: '희귀 업적을 자랑하고 달성 방법 공유',
    voting: true,
  },
  {
    id: 'ending_collection',
    name: '엔딩 컬렉션',
    description: '발견한 엔딩 공유 (스포일러 경고 포함)',
    moderation: true,
  },
];

// ============================================
// 커뮤니티 챌린지
// ============================================

export const communityChallenge: CommunityChallenge = {
  frequency: 'weekly',
  types: [
    { id: 'highest_users', desc: '가장 많은 사용자 달성' },
    { id: 'fastest_profit', desc: '가장 빠른 흑자 전환' },
    { id: 'longest_survival', desc: '가장 오래 생존' },
    { id: 'bootstrap_king', desc: '부트스트랩으로 최고 수익' },
    { id: 'social_master', desc: '가장 많은 NPC 최대 관계도' },
    { id: 'skill_collector', desc: '가장 높은 총 스킬 레벨' },
    { id: 'event_handler', desc: '가장 많은 이벤트 성공' },
    { id: 'crisis_survivor', desc: '가장 많은 위기 극복' },
  ],
  rewards: {
    participation: { points: 25 },
    top100: { points: 50 },
    top10: { points: 150, cosmetic: 'frame_weekly_top10' },
    winner: { points: 500, title: '주간 챔피언' },
  },
};

// ============================================
// 커뮤니티 설정 통합
// ============================================

export const communityConfig: CommunityConfig = {
  features: communityFeatures,
  communityChallenge,
};

// ============================================
// 크로스 프로모션
// ============================================

export const crossPromotion: CrossPromoConfig = {
  enabled: true,
  rewards: {
    vocavision_app_link: {
      condition: '실제 보카비전 앱 연동',
      gameReward: {
        unlock: 'vocavision_crossover_content',
        cosmetic: 'character_vocavision_mascot',
        bonus: 'vocabulary_boost',
      },
      vocavisionReward: {
        premium_trial: '7일',
        special_content: 'startup_vocabulary',
      },
    },
    newsletter_signup: {
      condition: '뉴스레터 구독',
      gameReward: {
        points: 100,
        cosmetic: 'badge_newsletter',
      },
    },
    social_follow: {
      condition: 'SNS 팔로우',
      gameReward: {
        points: 50,
        cosmetic: 'frame_social_follower',
      },
    },
    friend_referral: {
      condition: '친구 초대',
      gameReward: {
        points: 200,
        cosmetic: 'frame_referrer',
      },
      reward: { cash: 1000000 },
    },
    beta_tester: {
      condition: '베타 테스터 참여',
      gameReward: {
        title: '베타 테스터',
        cosmetic: 'badge_beta_tester',
        unlock: 'beta_exclusive_content',
      },
    },
  },
};

// ============================================
// 소셜 시스템 통합
// ============================================

export const socialSystem: SocialSystem = {
  sharing: sharingConfig,
  community: communityConfig,
  crossPromotion,
};

// ============================================
// 소셜 시스템 관리자
// ============================================

export class SocialSystemManager {
  private shareCount: number = 0;
  private weeklyShareCount: number = 0;
  private lastShareDate: Date | null = null;
  private weekStartDate: Date | null = null;
  private earnedIncentives: Set<string> = new Set();
  private communityContributions: Map<string, number> = new Map();
  private crossPromoCompleted: Set<string> = new Set();

  // ============================================
  // 공유 기능
  // ============================================

  canShare(contentId: string): { canShare: boolean; reason?: string } {
    const content = shareableContent.find((c) => c.id === contentId);
    if (!content) {
      return { canShare: false, reason: '공유 콘텐츠를 찾을 수 없습니다.' };
    }

    // 요구사항 확인 (실제 구현에서는 게임 상태 확인)
    if (content.requires) {
      // Placeholder - would check actual game state
    }

    return { canShare: true };
  }

  generateShareContent(
    contentId: string,
    data: Record<string, any>,
  ): { title: string; description: string; image: string; url: string } | null {
    const content = shareableContent.find((c) => c.id === contentId);
    if (!content) return null;

    // 템플릿 변수 치환
    let title = content.template.title;
    let description = content.template.description;

    for (const [key, value] of Object.entries(data)) {
      title = title.replace(`{{${key}}}`, String(value));
      description = description.replace(`{{${key}}}`, String(value));
    }

    return {
      title,
      description,
      image: content.template.image,
      url: `https://vocavision-simulator.com/share/${contentId}/${data.share_id || ''}`,
    };
  }

  recordShare(contentId: string, platform: string): GoalReward[] {
    const rewards: GoalReward[] = [];

    this.shareCount++;

    // 주간 카운트 관리
    const now = new Date();
    if (
      !this.weekStartDate ||
      now.getTime() - this.weekStartDate.getTime() > 7 * 24 * 60 * 60 * 1000
    ) {
      this.weekStartDate = now;
      this.weeklyShareCount = 0;
    }
    this.weeklyShareCount++;

    this.lastShareDate = now;

    // 첫 공유 보상
    if (this.shareCount === 1 && !this.earnedIncentives.has('firstShare')) {
      this.earnedIncentives.add('firstShare');
      rewards.push(sharingIncentives.firstShare.reward);
    }

    // 주간 공유 보상
    if (this.weeklyShareCount <= (sharingIncentives.weeklyShare.maxPerWeek || 3)) {
      rewards.push(sharingIncentives.weeklyShare.reward);
    }

    return rewards;
  }

  recordViralSuccess(clicks: number): GoalReward | null {
    const threshold = sharingIncentives.viralBonus.clickThreshold || 100;

    if (clicks >= threshold && !this.earnedIncentives.has('viralBonus')) {
      this.earnedIncentives.add('viralBonus');
      return sharingIncentives.viralBonus.reward;
    }

    return null;
  }

  getShareStats(): {
    totalShares: number;
    weeklyShares: number;
    lastShareDate: Date | null;
    earnedIncentives: string[];
  } {
    return {
      totalShares: this.shareCount,
      weeklyShares: this.weeklyShareCount,
      lastShareDate: this.lastShareDate,
      earnedIncentives: Array.from(this.earnedIncentives),
    };
  }

  // ============================================
  // 커뮤니티 기능
  // ============================================

  getAvailableFeatures(unlockedFeatures: string[]): CommunityFeature[] {
    return communityFeatures.filter((f) => !f.requires || unlockedFeatures.includes(f.requires));
  }

  recordContribution(featureId: string, type: string): GoalReward | null {
    const feature = communityFeatures.find((f) => f.id === featureId);
    if (!feature || !feature.rewards) return null;

    const rewardConfig = feature.rewards[type];
    if (!rewardConfig) return null;

    const key = `${featureId}_${type}`;
    const currentCount = (this.communityContributions.get(key) || 0) + 1;
    this.communityContributions.set(key, currentCount);

    // 임계값 도달 시 보상
    if (currentCount % rewardConfig.per === 0) {
      return rewardConfig.reward;
    }

    return null;
  }

  // ============================================
  // 커뮤니티 챌린지
  // ============================================

  getCurrentChallenge(): { id: string; desc: string; endDate: Date } | null {
    // 주간 도전 선택 (요일 기반)
    const now = new Date();
    const weekNumber = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
    const challengeIndex = weekNumber % communityChallenge.types.length;
    const challenge = communityChallenge.types[challengeIndex];

    // 주 끝 계산
    const dayOfWeek = now.getDay();
    const daysUntilSunday = 7 - dayOfWeek;
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + daysUntilSunday);
    endDate.setHours(23, 59, 59, 999);

    return {
      id: challenge.id,
      desc: challenge.desc,
      endDate,
    };
  }

  getChallengeReward(rank: number): GoalReward {
    if (rank === 1) {
      return communityChallenge.rewards.winner;
    } else if (rank <= 10) {
      return communityChallenge.rewards.top10;
    } else if (rank <= 100) {
      return communityChallenge.rewards.top100;
    }
    return communityChallenge.rewards.participation;
  }

  // ============================================
  // 크로스 프로모션
  // ============================================

  getAvailableCrossPromo(): string[] {
    if (!crossPromotion.enabled) return [];

    return Object.keys(crossPromotion.rewards).filter((id) => !this.crossPromoCompleted.has(id));
  }

  completeCrossPromo(promoId: string): { gameReward: Record<string, any> } | null {
    if (!crossPromotion.enabled) return null;

    const promo = crossPromotion.rewards[promoId];
    if (!promo) return null;

    if (this.crossPromoCompleted.has(promoId)) return null;

    this.crossPromoCompleted.add(promoId);

    return {
      gameReward: promo.gameReward,
    };
  }

  getCrossPromoStatus(): {
    available: string[];
    completed: string[];
    totalRewards: number;
  } {
    const available = this.getAvailableCrossPromo();
    const completed = Array.from(this.crossPromoCompleted);

    return {
      available,
      completed,
      totalRewards: completed.length,
    };
  }

  // ============================================
  // 시드 공유 기능
  // ============================================

  generateSeedShareLink(
    seed: string,
    options: { difficulty?: string; modifiers?: string[] } = {},
  ): string {
    const params = new URLSearchParams();
    params.set('seed', seed);
    if (options.difficulty) params.set('difficulty', options.difficulty);
    if (options.modifiers?.length) params.set('modifiers', options.modifiers.join(','));

    return `https://vocavision-simulator.com/play?${params.toString()}`;
  }

  parseSeedShareLink(url: string): {
    seed: string;
    difficulty?: string;
    modifiers?: string[];
  } | null {
    try {
      const urlObj = new URL(url);
      const seed = urlObj.searchParams.get('seed');
      if (!seed) return null;

      return {
        seed,
        difficulty: urlObj.searchParams.get('difficulty') || undefined,
        modifiers: urlObj.searchParams.get('modifiers')?.split(',') || undefined,
      };
    } catch {
      return null;
    }
  }

  // ============================================
  // 상태 직렬화
  // ============================================

  serialize(): {
    shareCount: number;
    weeklyShareCount: number;
    lastShareDate: string | null;
    weekStartDate: string | null;
    earnedIncentives: string[];
    communityContributions: Record<string, number>;
    crossPromoCompleted: string[];
  } {
    return {
      shareCount: this.shareCount,
      weeklyShareCount: this.weeklyShareCount,
      lastShareDate: this.lastShareDate?.toISOString() || null,
      weekStartDate: this.weekStartDate?.toISOString() || null,
      earnedIncentives: Array.from(this.earnedIncentives),
      communityContributions: Object.fromEntries(this.communityContributions),
      crossPromoCompleted: Array.from(this.crossPromoCompleted),
    };
  }

  deserialize(data: ReturnType<SocialSystemManager['serialize']>): void {
    this.shareCount = data.shareCount;
    this.weeklyShareCount = data.weeklyShareCount;
    this.lastShareDate = data.lastShareDate ? new Date(data.lastShareDate) : null;
    this.weekStartDate = data.weekStartDate ? new Date(data.weekStartDate) : null;
    this.earnedIncentives = new Set(data.earnedIncentives);
    this.communityContributions = new Map(Object.entries(data.communityContributions));
    this.crossPromoCompleted = new Set(data.crossPromoCompleted);
  }
}

// 싱글톤 인스턴스
export const socialSystemManager = new SocialSystemManager();

export default socialSystem;
