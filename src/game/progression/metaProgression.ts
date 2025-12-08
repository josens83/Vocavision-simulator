/**
 * Chapter 7: Progression & Engagement - Meta Progression System
 * 메타 진행 시스템 - 영구 업그레이드, 마스터리 트랙, 전역 통계, 리더보드
 */

import {
  MetaProgression,
  LegacySystem,
  PermanentUpgrade,
  KnowledgeUnlock,
  MasteryTrack,
  GlobalStats,
  LeaderboardConfig,
  AchievementReward,
} from './types';

// ============================================
// 영구 업그레이드 시스템
// ============================================

export const permanentUpgrades: PermanentUpgrade[] = [
  // 자원 관련 업그레이드
  {
    id: 'starting_cash_bonus',
    name: '시드 자금',
    description: '게임 시작 시 추가 현금 보유',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+500,000원', cost: 100 },
      { level: 2, effect: '+1,000,000원', cost: 250 },
      { level: 3, effect: '+2,000,000원', cost: 500 },
      { level: 4, effect: '+3,000,000원', cost: 1000 },
      { level: 5, effect: '+5,000,000원', cost: 2000 },
    ],
  },
  {
    id: 'starting_energy_bonus',
    name: '체력 관리',
    description: '게임 시작 시 추가 에너지',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+5 에너지', cost: 75 },
      { level: 2, effect: '+10 에너지', cost: 175 },
      { level: 3, effect: '+15 에너지', cost: 350 },
      { level: 4, effect: '+20 에너지', cost: 700 },
    ],
  },
  {
    id: 'resource_efficiency',
    name: '자원 효율성',
    description: '모든 자원 소비 감소',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '-5% 자원 소비', cost: 150 },
      { level: 2, effect: '-10% 자원 소비', cost: 350 },
      { level: 3, effect: '-15% 자원 소비', cost: 700 },
    ],
  },

  // 스킬 관련 업그레이드
  {
    id: 'skill_retention',
    name: '경험의 지혜',
    description: '새 게임에서 스킬 일부 유지',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '스킬 10% 유지', cost: 200 },
      { level: 2, effect: '스킬 20% 유지', cost: 500 },
      { level: 3, effect: '스킬 30% 유지', cost: 1000 },
      { level: 4, effect: '스킬 40% 유지 (뉴게임+ 전용)', cost: 2000 },
    ],
  },
  {
    id: 'skill_growth_rate',
    name: '빠른 학습',
    description: '스킬 성장 속도 증가',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+10% 스킬 경험치', cost: 125 },
      { level: 2, effect: '+20% 스킬 경험치', cost: 300 },
      { level: 3, effect: '+30% 스킬 경험치', cost: 600 },
      { level: 4, effect: '+50% 스킬 경험치', cost: 1200 },
    ],
  },
  {
    id: 'starting_skills',
    name: '업계 경험',
    description: '시작 시 추가 스킬 포인트',
    currency: 'legacy_points',
    requires: 'skill_retention',
    levels: [
      { level: 1, effect: '+3 스킬 포인트', cost: 300 },
      { level: 2, effect: '+6 스킬 포인트', cost: 600 },
      { level: 3, effect: '+10 스킬 포인트', cost: 1200 },
    ],
  },

  // 이벤트 관련 업그레이드
  {
    id: 'event_preview',
    name: '직감',
    description: '다가올 이벤트를 미리 확인',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '1일 후 이벤트 미리보기', cost: 250 },
      { level: 2, effect: '2일 후 이벤트 미리보기', cost: 600 },
      { level: 3, effect: '3일 후 이벤트 미리보기', cost: 1200 },
    ],
  },
  {
    id: 'better_event_outcomes',
    name: '협상력',
    description: '이벤트 결과 개선 확률 증가',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+5% 긍정적 결과', cost: 175 },
      { level: 2, effect: '+10% 긍정적 결과', cost: 400 },
      { level: 3, effect: '+15% 긍정적 결과', cost: 800 },
    ],
  },
  {
    id: 'crisis_resistance',
    name: '위기 대응력',
    description: '위기 이벤트 피해 감소',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '-10% 위기 피해', cost: 150 },
      { level: 2, effect: '-20% 위기 피해', cost: 350 },
      { level: 3, effect: '-30% 위기 피해', cost: 700 },
    ],
  },

  // NPC 관련 업그레이드
  {
    id: 'relationship_bonus',
    name: '사교성',
    description: 'NPC 관계 시작값 증가',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+5 관계도 시작', cost: 100 },
      { level: 2, effect: '+10 관계도 시작', cost: 250 },
      { level: 3, effect: '+15 관계도 시작', cost: 500 },
    ],
  },
  {
    id: 'relationship_growth',
    name: '친화력',
    description: '관계도 상승 속도 증가',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+15% 관계도 성장', cost: 125 },
      { level: 2, effect: '+30% 관계도 성장', cost: 300 },
      { level: 3, effect: '+50% 관계도 성장', cost: 600 },
    ],
  },
  {
    id: 'npc_unlock_bonus',
    name: '인맥 확장',
    description: '새 NPC 등장 확률 증가',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+10% NPC 등장', cost: 150 },
      { level: 2, effect: '+25% NPC 등장', cost: 350 },
      { level: 3, effect: '+50% NPC 등장', cost: 700 },
    ],
  },

  // 비즈니스 관련 업그레이드
  {
    id: 'revenue_boost',
    name: '수익 최적화',
    description: '모든 수익 증가',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+3% 수익', cost: 200 },
      { level: 2, effect: '+6% 수익', cost: 450 },
      { level: 3, effect: '+10% 수익', cost: 900 },
      { level: 4, effect: '+15% 수익', cost: 1800 },
    ],
  },
  {
    id: 'cost_reduction',
    name: '비용 절감',
    description: '모든 비용 감소',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '-3% 비용', cost: 175 },
      { level: 2, effect: '-6% 비용', cost: 400 },
      { level: 3, effect: '-10% 비용', cost: 800 },
    ],
  },
  {
    id: 'user_acquisition',
    name: '마케팅 효율',
    description: '사용자 획득 속도 증가',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+5% 사용자 획득', cost: 150 },
      { level: 2, effect: '+10% 사용자 획득', cost: 350 },
      { level: 3, effect: '+15% 사용자 획득', cost: 700 },
      { level: 4, effect: '+20% 사용자 획득', cost: 1400 },
    ],
  },

  // 특수 업그레이드
  {
    id: 'unlock_insight',
    name: '통찰력',
    description: '숨겨진 선택지 확인',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '희귀 선택지 표시', cost: 500 },
      { level: 2, effect: '비밀 선택지 표시', cost: 1000 },
      { level: 3, effect: '모든 선택지 표시', cost: 2000 },
    ],
  },
  {
    id: 'luck_bonus',
    name: '행운',
    description: '전체적인 확률 보너스',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+2% 성공 확률', cost: 250 },
      { level: 2, effect: '+4% 성공 확률', cost: 600 },
      { level: 3, effect: '+7% 성공 확률', cost: 1200 },
      { level: 4, effect: '+10% 성공 확률', cost: 2400 },
    ],
  },
  {
    id: 'time_bonus',
    name: '시간 관리',
    description: '하루 추가 행동 포인트',
    currency: 'legacy_points',
    levels: [
      { level: 1, effect: '+1 행동 포인트', cost: 400 },
      { level: 2, effect: '+2 행동 포인트', cost: 1000 },
      { level: 3, effect: '+3 행동 포인트', cost: 2500 },
    ],
  },
];

// ============================================
// 지식 언락 시스템
// ============================================

export const knowledgeUnlocks: KnowledgeUnlock[] = [
  // 이전 플레이 기억
  {
    id: 'remember_npc_preferences',
    desc: 'NPC 취향 정보를 기억',
    permanent: true,
  },
  {
    id: 'remember_event_outcomes',
    desc: '이벤트 결과 이력 확인 가능',
    permanent: true,
  },
  {
    id: 'remember_successful_strategies',
    desc: '성공한 전략 노트 유지',
    permanent: true,
  },
  {
    id: 'remember_market_patterns',
    desc: '시장 패턴 정보 유지',
    permanent: true,
  },

  // 게임 정보 표시
  {
    id: 'show_hidden_stats',
    desc: '숨겨진 스탯 표시',
    permanent: true,
  },
  {
    id: 'show_probability_info',
    desc: '성공 확률 표시',
    permanent: true,
  },
  {
    id: 'show_optimal_timing',
    desc: '최적 타이밍 힌트 표시',
    permanent: true,
  },
  {
    id: 'show_relationship_tips',
    desc: 'NPC 호감도 변화 예측',
    permanent: true,
  },

  // 전략 가이드
  {
    id: 'tutorial_skip',
    desc: '튜토리얼 건너뛰기 가능',
    permanent: true,
  },
  {
    id: 'strategy_notes',
    desc: '플레이 중 전략 노트 작성',
    permanent: true,
  },
  {
    id: 'meta_knowledge',
    desc: '게임 메타 정보 접근',
    permanent: true,
  },
];

// ============================================
// 마스터리 트랙 시스템
// ============================================

export const masteryTracks: MasteryTrack[] = [
  {
    id: 'entrepreneur',
    name: '기업가',
    description: '사업 운영 전반의 마스터리',
    icon: '💼',
    milestones: [
      {
        level: 1,
        name: '초보 창업자',
        xp: 0,
        reward: { type: 'title', value: '초보 창업자' },
      },
      {
        level: 5,
        name: '떠오르는 CEO',
        xp: 500,
        reward: { type: 'cosmetic', value: 'frame_bronze_business' },
      },
      {
        level: 10,
        name: '숙련된 사업가',
        xp: 1500,
        reward: { type: 'perk', value: 'business_insight' },
      },
      {
        level: 15,
        name: '산업의 선구자',
        xp: 3500,
        reward: { type: 'cosmetic', value: 'frame_silver_business' },
      },
      {
        level: 20,
        name: '전설적 기업가',
        xp: 7000,
        reward: { type: 'title', value: '사업의 달인' },
      },
      {
        level: 25,
        name: '비즈니스 마스터',
        xp: 12000,
        reward: { type: 'cosmetic', value: 'frame_gold_business' },
      },
      {
        level: 30,
        name: 'CEO of CEOs',
        xp: 20000,
        reward: { type: 'special_ending', value: 'legendary_entrepreneur' },
      },
    ],
    xpSources: [
      { action: '성공적인 플레이스루 완료', xp: 100 },
      { action: '수익 마일스톤 달성', xp: 25 },
      { action: '사용자 마일스톤 달성', xp: 25 },
      { action: '투자 유치', xp: 50 },
      { action: '성공적 엑싯', xp: 200 },
      { action: '사업 관련 이벤트 성공', xp: 15 },
      { action: '월간 흑자 달성', xp: 10 },
    ],
  },
  {
    id: 'developer',
    name: '개발자',
    description: '기술 및 제품 개발 마스터리',
    icon: '💻',
    milestones: [
      {
        level: 1,
        name: '코딩 입문자',
        xp: 0,
        reward: { type: 'title', value: '코딩 입문자' },
      },
      {
        level: 5,
        name: '주니어 개발자',
        xp: 400,
        reward: { type: 'cosmetic', value: 'frame_bronze_tech' },
      },
      {
        level: 10,
        name: '시니어 개발자',
        xp: 1200,
        reward: { type: 'perk', value: 'code_efficiency' },
      },
      {
        level: 15,
        name: '테크 리드',
        xp: 2800,
        reward: { type: 'cosmetic', value: 'frame_silver_tech' },
      },
      {
        level: 20,
        name: '아키텍트',
        xp: 5600,
        reward: { type: 'title', value: '코드의 마법사' },
      },
      {
        level: 25,
        name: 'CTO급 개발자',
        xp: 10000,
        reward: { type: 'cosmetic', value: 'frame_gold_tech' },
      },
      {
        level: 30,
        name: '전설의 해커',
        xp: 17000,
        reward: { type: 'special_ending', value: 'tech_legend' },
      },
    ],
    xpSources: [
      { action: '코딩 스킬 레벨업', xp: 20 },
      { action: '제품 버전 릴리즈', xp: 40 },
      { action: '기술 부채 해결', xp: 30 },
      { action: '새 기능 구현', xp: 25 },
      { action: '버그 수정', xp: 10 },
      { action: '성능 최적화 완료', xp: 35 },
      { action: '개발 관련 이벤트 성공', xp: 15 },
    ],
  },
  {
    id: 'growth_hacker',
    name: '그로스 해커',
    description: '마케팅 및 사용자 성장 마스터리',
    icon: '📈',
    milestones: [
      {
        level: 1,
        name: '마케팅 초보',
        xp: 0,
        reward: { type: 'title', value: '마케팅 초보' },
      },
      {
        level: 5,
        name: '성장 분석가',
        xp: 450,
        reward: { type: 'cosmetic', value: 'frame_bronze_growth' },
      },
      {
        level: 10,
        name: '그로스 매니저',
        xp: 1300,
        reward: { type: 'perk', value: 'viral_boost' },
      },
      {
        level: 15,
        name: '마케팅 전문가',
        xp: 3000,
        reward: { type: 'cosmetic', value: 'frame_silver_growth' },
      },
      {
        level: 20,
        name: 'CMO급 그로서',
        xp: 6000,
        reward: { type: 'title', value: '바이럴의 제왕' },
      },
      {
        level: 25,
        name: '그로스 해커 마스터',
        xp: 11000,
        reward: { type: 'cosmetic', value: 'frame_gold_growth' },
      },
      {
        level: 30,
        name: '전설의 마케터',
        xp: 18000,
        reward: { type: 'special_ending', value: 'growth_master' },
      },
    ],
    xpSources: [
      { action: '사용자 1,000명 획득', xp: 15 },
      { action: '바이럴 이벤트 발생', xp: 50 },
      { action: '마케팅 캠페인 성공', xp: 35 },
      { action: '전환율 개선', xp: 25 },
      { action: '리텐션 목표 달성', xp: 30 },
      { action: '마케팅 스킬 레벨업', xp: 20 },
      { action: '프레스 커버리지 획득', xp: 40 },
    ],
  },
  {
    id: 'survivor',
    name: '서바이버',
    description: '위기 극복 및 생존 마스터리',
    icon: '🛡️',
    milestones: [
      {
        level: 1,
        name: '생존자',
        xp: 0,
        reward: { type: 'title', value: '생존자' },
      },
      {
        level: 5,
        name: '회복 전문가',
        xp: 350,
        reward: { type: 'cosmetic', value: 'frame_bronze_survival' },
      },
      {
        level: 10,
        name: '위기 관리자',
        xp: 1000,
        reward: { type: 'perk', value: 'crisis_veteran' },
      },
      {
        level: 15,
        name: '불사조',
        xp: 2300,
        reward: { type: 'cosmetic', value: 'frame_silver_survival' },
      },
      {
        level: 20,
        name: '난관 돌파자',
        xp: 4500,
        reward: { type: 'title', value: '불굴의 의지' },
      },
      {
        level: 25,
        name: '전설의 서바이버',
        xp: 8000,
        reward: { type: 'cosmetic', value: 'frame_gold_survival' },
      },
      {
        level: 30,
        name: '불멸의 창업자',
        xp: 14000,
        reward: { type: 'special_ending', value: 'immortal_survivor' },
      },
    ],
    xpSources: [
      { action: '위기 이벤트 극복', xp: 30 },
      { action: '파산 직전에서 회복', xp: 75 },
      { action: '30일 이상 생존', xp: 20 },
      { action: '어려운 난이도 클리어', xp: 80 },
      { action: '도전 모드 완료', xp: 100 },
      { action: '연속 적자에서 흑자 전환', xp: 40 },
      { action: '스트레스 위험 수준에서 회복', xp: 25 },
    ],
  },
  {
    id: 'networker',
    name: '네트워커',
    description: '인간관계 및 네트워킹 마스터리',
    icon: '🤝',
    milestones: [
      {
        level: 1,
        name: '첫 인연',
        xp: 0,
        reward: { type: 'title', value: '첫 인연' },
      },
      {
        level: 5,
        name: '인맥 수집가',
        xp: 300,
        reward: { type: 'cosmetic', value: 'frame_bronze_social' },
      },
      {
        level: 10,
        name: '관계 전문가',
        xp: 900,
        reward: { type: 'perk', value: 'social_charm' },
      },
      {
        level: 15,
        name: '커뮤니티 리더',
        xp: 2000,
        reward: { type: 'cosmetic', value: 'frame_silver_social' },
      },
      {
        level: 20,
        name: '인플루언서',
        xp: 4000,
        reward: { type: 'title', value: '인맥의 제왕' },
      },
      {
        level: 25,
        name: '네트워킹 마스터',
        xp: 7500,
        reward: { type: 'cosmetic', value: 'frame_gold_social' },
      },
      {
        level: 30,
        name: '전설의 커넥터',
        xp: 13000,
        reward: { type: 'special_ending', value: 'legendary_networker' },
      },
    ],
    xpSources: [
      { action: '새 NPC 만남', xp: 15 },
      { action: 'NPC 호감도 최대 달성', xp: 50 },
      { action: '멘토 관계 형성', xp: 40 },
      { action: '파트너십 체결', xp: 35 },
      { action: '투자자 영입', xp: 45 },
      { action: 'NPC 이벤트 성공', xp: 20 },
      { action: '커뮤니티 이벤트 참여', xp: 25 },
    ],
  },
];

// ============================================
// 전역 통계 시스템
// ============================================

export const globalStats: GlobalStats = {
  cumulative: [
    { id: 'total_playtime', name: '총 플레이 시간', format: 'time' },
    { id: 'total_playthroughs', name: '총 플레이스루 횟수' },
    { id: 'total_users_acquired', name: '누적 획득 사용자' },
    { id: 'total_revenue_earned', name: '누적 총 수익', format: 'currency' },
    { id: 'total_events_handled', name: '처리한 총 이벤트' },
    { id: 'total_decisions_made', name: '내린 총 결정' },
    { id: 'total_npcs_met', name: '만난 총 NPC' },
    { id: 'total_skills_gained', name: '획득한 총 스킬 레벨' },
    { id: 'total_achievements_earned', name: '획득한 총 업적' },
    { id: 'total_days_survived', name: '생존한 총 일수' },
    { id: 'total_crises_overcome', name: '극복한 총 위기' },
    { id: 'total_funding_raised', name: '유치한 총 투자금', format: 'currency' },
  ],
  records: [
    { id: 'max_users', name: '최다 사용자 수', type: 'max' },
    { id: 'max_revenue', name: '최고 월 수익', format: 'currency', type: 'max' },
    { id: 'max_valuation', name: '최고 기업가치', format: 'currency', type: 'max' },
    { id: 'longest_survival', name: '최장 생존 일수', type: 'max' },
    { id: 'fastest_profitability', name: '최단 흑자 전환', type: 'min' },
    { id: 'fastest_10k_users', name: '최단 10,000 사용자', type: 'min' },
    { id: 'fastest_100k_users', name: '최단 100,000 사용자', type: 'min' },
    { id: 'fastest_exit', name: '최단 성공적 엑싯', type: 'min' },
    { id: 'highest_skill', name: '최고 단일 스킬 레벨', type: 'max' },
    { id: 'most_npcs_single_run', name: '단일 런 최다 NPC', type: 'max' },
    { id: 'longest_streak', name: '최장 연속 흑자', type: 'max' },
  ],
  distributions: [
    { id: 'ending_distribution', name: '엔딩 분포' },
    { id: 'difficulty_distribution', name: '난이도 분포' },
    { id: 'death_cause_distribution', name: '실패 원인 분포' },
    { id: 'play_style_distribution', name: '플레이 스타일 분포' },
    { id: 'skill_preference_distribution', name: '스킬 선호도 분포' },
  ],
};

// ============================================
// 리더보드 시스템
// ============================================

export const leaderboardConfig: LeaderboardConfig = {
  categories: [
    {
      id: 'highest_users',
      name: '최다 사용자',
      metric: 'max_users',
      periods: ['daily', 'weekly', 'monthly', 'all_time'],
      filters: ['all', 'difficulty', 'mode'],
    },
    {
      id: 'highest_revenue',
      name: '최고 수익',
      metric: 'max_revenue',
      periods: ['daily', 'weekly', 'monthly', 'all_time'],
      filters: ['all', 'difficulty', 'mode'],
    },
    {
      id: 'fastest_success',
      name: '최단 성공',
      metric: 'days_to_success',
      periods: ['weekly', 'monthly', 'all_time'],
      filters: ['all', 'difficulty'],
    },
    {
      id: 'longest_survival',
      name: '최장 생존',
      metric: 'survival_days',
      periods: ['weekly', 'monthly', 'all_time'],
      filters: ['all', 'difficulty', 'mode'],
    },
    {
      id: 'achievement_points',
      name: '업적 포인트',
      metric: 'total_achievement_points',
      periods: ['all_time'],
      filters: ['all'],
    },
    {
      id: 'speedrun',
      name: '스피드런',
      metric: 'speedrun_time',
      periods: ['weekly', 'monthly', 'all_time'],
      filters: ['category'],
      requires: 'speedrun_mode',
    },
    {
      id: 'ironman',
      name: '아이언맨',
      metric: 'ironman_score',
      periods: ['monthly', 'all_time'],
      filters: ['difficulty'],
      requires: 'ironman_mode',
    },
    {
      id: 'daily_challenge',
      name: '일일 도전',
      metric: 'daily_challenge_score',
      periods: ['daily'],
      filters: ['none'],
      requires: 'daily_challenge_mode',
    },
  ],
  display: {
    entriesPerPage: 25,
    showRank: true,
    showDelta: true,
    highlightFriends: true,
    highlightSelf: true,
  },
  privacy: {
    anonymousOption: true,
    friendsOnly: true,
    optOut: true,
  },
};

// ============================================
// Legacy 시스템 통합
// ============================================

export const legacySystem: LegacySystem = {
  permanentUpgrades,
  knowledgeUnlocks,
};

// ============================================
// 메타 진행 시스템 통합
// ============================================

export const metaProgression: MetaProgression = {
  legacy: legacySystem,
  masteryTracks,
  globalStats,
  leaderboards: leaderboardConfig,
};

// ============================================
// 메타 진행 관리자
// ============================================

export class MetaProgressionManager {
  private upgradeLevels: Map<string, number> = new Map();
  private unlockedKnowledge: Set<string> = new Set();
  private masteryXP: Map<string, number> = new Map();
  private playerStats: Map<string, number> = new Map();
  private legacyPoints: number = 0;

  constructor() {
    // 초기화
    permanentUpgrades.forEach((upgrade) => {
      this.upgradeLevels.set(upgrade.id, 0);
    });

    masteryTracks.forEach((track) => {
      this.masteryXP.set(track.id, 0);
    });
  }

  // ============================================
  // Legacy Points 관리
  // ============================================

  addLegacyPoints(points: number): void {
    this.legacyPoints += points;
  }

  getLegacyPoints(): number {
    return this.legacyPoints;
  }

  calculateLegacyPointsFromRun(runResult: {
    ending: string;
    days: number;
    users: number;
    revenue: number;
    difficulty: string;
    achievements: string[];
  }): number {
    let points = 0;

    // 기본 완료 보너스
    if (runResult.ending !== 'bankruptcy') {
      points += 50;
    }

    // 성공적 엔딩 보너스
    if (
      runResult.ending === 'acquisition' ||
      runResult.ending === 'ipo' ||
      runResult.ending === 'lifestyle'
    ) {
      points += 100;
    }

    // 난이도 배율
    const difficultyMultipliers: Record<string, number> = {
      story: 0.5,
      normal: 1.0,
      hard: 1.5,
      expert: 2.0,
      nightmare: 3.0,
    };
    const multiplier = difficultyMultipliers[runResult.difficulty] || 1.0;

    // 사용자 수 보너스
    points += Math.floor(runResult.users / 1000);

    // 수익 보너스
    points += Math.floor(runResult.revenue / 10000000);

    // 생존 일수 보너스
    points += Math.floor(runResult.days / 10);

    // 업적 보너스
    points += runResult.achievements.length * 5;

    return Math.floor(points * multiplier);
  }

  // ============================================
  // 영구 업그레이드 관리
  // ============================================

  getUpgradeLevel(upgradeId: string): number {
    return this.upgradeLevels.get(upgradeId) || 0;
  }

  canPurchaseUpgrade(upgradeId: string): { canPurchase: boolean; reason?: string } {
    const upgrade = permanentUpgrades.find((u) => u.id === upgradeId);
    if (!upgrade) {
      return { canPurchase: false, reason: '존재하지 않는 업그레이드입니다.' };
    }

    const currentLevel = this.getUpgradeLevel(upgradeId);
    if (currentLevel >= upgrade.levels.length) {
      return { canPurchase: false, reason: '최대 레벨에 도달했습니다.' };
    }

    // 선행 조건 확인
    if (upgrade.requires) {
      const requiredLevel = this.getUpgradeLevel(upgrade.requires);
      if (requiredLevel === 0) {
        const requiredUpgrade = permanentUpgrades.find((u) => u.id === upgrade.requires);
        return {
          canPurchase: false,
          reason: `'${requiredUpgrade?.name || upgrade.requires}' 업그레이드가 필요합니다.`,
        };
      }
    }

    const nextLevel = upgrade.levels[currentLevel];
    if (this.legacyPoints < nextLevel.cost) {
      return {
        canPurchase: false,
        reason: `레거시 포인트가 부족합니다. (필요: ${nextLevel.cost}, 보유: ${this.legacyPoints})`,
      };
    }

    return { canPurchase: true };
  }

  purchaseUpgrade(upgradeId: string): boolean {
    const { canPurchase } = this.canPurchaseUpgrade(upgradeId);
    if (!canPurchase) return false;

    const upgrade = permanentUpgrades.find((u) => u.id === upgradeId)!;
    const currentLevel = this.getUpgradeLevel(upgradeId);
    const nextLevel = upgrade.levels[currentLevel];

    this.legacyPoints -= nextLevel.cost;
    this.upgradeLevels.set(upgradeId, currentLevel + 1);

    return true;
  }

  getUpgradeEffect(upgradeId: string): string | null {
    const upgrade = permanentUpgrades.find((u) => u.id === upgradeId);
    if (!upgrade) return null;

    const level = this.getUpgradeLevel(upgradeId);
    if (level === 0) return null;

    return upgrade.levels[level - 1].effect;
  }

  getAllUpgradeEffects(): Record<string, string> {
    const effects: Record<string, string> = {};

    permanentUpgrades.forEach((upgrade) => {
      const effect = this.getUpgradeEffect(upgrade.id);
      if (effect) {
        effects[upgrade.id] = effect;
      }
    });

    return effects;
  }

  // ============================================
  // 지식 언락 관리
  // ============================================

  unlockKnowledge(knowledgeId: string): boolean {
    const knowledge = knowledgeUnlocks.find((k) => k.id === knowledgeId);
    if (!knowledge) return false;

    this.unlockedKnowledge.add(knowledgeId);
    return true;
  }

  isKnowledgeUnlocked(knowledgeId: string): boolean {
    return this.unlockedKnowledge.has(knowledgeId);
  }

  getUnlockedKnowledge(): string[] {
    return Array.from(this.unlockedKnowledge);
  }

  // ============================================
  // 마스터리 트랙 관리
  // ============================================

  addMasteryXP(trackId: string, xp: number): { levelUp: boolean; newLevel: number } {
    const track = masteryTracks.find((t) => t.id === trackId);
    if (!track) return { levelUp: false, newLevel: 0 };

    const currentXP = this.masteryXP.get(trackId) || 0;
    const newXP = currentXP + xp;
    this.masteryXP.set(trackId, newXP);

    const oldLevel = this.getMasteryLevel(trackId);
    const newLevel = this.calculateMasteryLevel(track, newXP);

    return {
      levelUp: newLevel > oldLevel,
      newLevel,
    };
  }

  getMasteryLevel(trackId: string): number {
    const track = masteryTracks.find((t) => t.id === trackId);
    if (!track) return 0;

    const xp = this.masteryXP.get(trackId) || 0;
    return this.calculateMasteryLevel(track, xp);
  }

  private calculateMasteryLevel(track: MasteryTrack, xp: number): number {
    let level = 0;
    for (const milestone of track.milestones) {
      if (xp >= milestone.xp) {
        level = milestone.level;
      }
    }
    return level;
  }

  getMasteryProgress(trackId: string): {
    level: number;
    currentXP: number;
    nextLevelXP: number | null;
    progress: number;
  } {
    const track = masteryTracks.find((t) => t.id === trackId);
    if (!track) {
      return { level: 0, currentXP: 0, nextLevelXP: null, progress: 0 };
    }

    const xp = this.masteryXP.get(trackId) || 0;
    const level = this.calculateMasteryLevel(track, xp);

    // 다음 레벨 XP 찾기
    const nextMilestone = track.milestones.find((m) => m.xp > xp);
    const currentMilestone = track.milestones.find((m) => m.level === level);

    if (!nextMilestone) {
      return { level, currentXP: xp, nextLevelXP: null, progress: 100 };
    }

    const baseXP = currentMilestone?.xp || 0;
    const progress = ((xp - baseXP) / (nextMilestone.xp - baseXP)) * 100;

    return {
      level,
      currentXP: xp,
      nextLevelXP: nextMilestone.xp,
      progress: Math.min(100, progress),
    };
  }

  getMasteryRewards(trackId: string): AchievementReward[] {
    const track = masteryTracks.find((t) => t.id === trackId);
    if (!track) return [];

    const level = this.getMasteryLevel(trackId);
    return track.milestones.filter((m) => m.level <= level).map((m) => m.reward);
  }

  // ============================================
  // 전역 통계 관리
  // ============================================

  updateStat(statId: string, value: number, type: 'set' | 'add' | 'max' | 'min' = 'add'): void {
    const current = this.playerStats.get(statId) || 0;

    switch (type) {
      case 'set':
        this.playerStats.set(statId, value);
        break;
      case 'add':
        this.playerStats.set(statId, current + value);
        break;
      case 'max':
        this.playerStats.set(statId, Math.max(current, value));
        break;
      case 'min':
        if (current === 0) {
          this.playerStats.set(statId, value);
        } else {
          this.playerStats.set(statId, Math.min(current, value));
        }
        break;
    }
  }

  getStat(statId: string): number {
    return this.playerStats.get(statId) || 0;
  }

  getAllStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.playerStats.forEach((value, key) => {
      stats[key] = value;
    });
    return stats;
  }

  // ============================================
  // 플레이 완료 처리
  // ============================================

  processPlaythroughComplete(result: {
    ending: string;
    days: number;
    users: number;
    revenue: number;
    difficulty: string;
    achievements: string[];
    masteryActions: Array<{ trackId: string; action: string }>;
  }): {
    legacyPointsEarned: number;
    masteryLevelUps: Array<{ trackId: string; newLevel: number }>;
    newKnowledge: string[];
  } {
    // 레거시 포인트 계산 및 추가
    const legacyPoints = this.calculateLegacyPointsFromRun(result);
    this.addLegacyPoints(legacyPoints);

    // 통계 업데이트
    this.updateStat('total_playthroughs', 1, 'add');
    this.updateStat('total_days_survived', result.days, 'add');
    this.updateStat('total_users_acquired', result.users, 'add');
    this.updateStat('total_revenue_earned', result.revenue, 'add');
    this.updateStat('max_users', result.users, 'max');
    this.updateStat('max_revenue', result.revenue, 'max');
    this.updateStat('longest_survival', result.days, 'max');

    // 마스터리 XP 추가
    const masteryLevelUps: Array<{ trackId: string; newLevel: number }> = [];
    result.masteryActions.forEach(({ trackId, action }) => {
      const track = masteryTracks.find((t) => t.id === trackId);
      if (!track) return;

      const xpSource = track.xpSources.find((s) => s.action === action);
      if (xpSource) {
        const { levelUp, newLevel } = this.addMasteryXP(trackId, xpSource.xp);
        if (levelUp) {
          masteryLevelUps.push({ trackId, newLevel });
        }
      }
    });

    // 새로운 지식 언락 확인
    const newKnowledge: string[] = [];
    const playthroughs = this.getStat('total_playthroughs');

    if (playthroughs >= 1 && !this.isKnowledgeUnlocked('tutorial_skip')) {
      this.unlockKnowledge('tutorial_skip');
      newKnowledge.push('tutorial_skip');
    }
    if (playthroughs >= 3 && !this.isKnowledgeUnlocked('remember_event_outcomes')) {
      this.unlockKnowledge('remember_event_outcomes');
      newKnowledge.push('remember_event_outcomes');
    }
    if (playthroughs >= 5 && !this.isKnowledgeUnlocked('show_probability_info')) {
      this.unlockKnowledge('show_probability_info');
      newKnowledge.push('show_probability_info');
    }

    return {
      legacyPointsEarned: legacyPoints,
      masteryLevelUps,
      newKnowledge,
    };
  }

  // ============================================
  // 상태 직렬화
  // ============================================

  serialize(): {
    upgradeLevels: Record<string, number>;
    unlockedKnowledge: string[];
    masteryXP: Record<string, number>;
    playerStats: Record<string, number>;
    legacyPoints: number;
  } {
    return {
      upgradeLevels: Object.fromEntries(this.upgradeLevels),
      unlockedKnowledge: Array.from(this.unlockedKnowledge),
      masteryXP: Object.fromEntries(this.masteryXP),
      playerStats: Object.fromEntries(this.playerStats),
      legacyPoints: this.legacyPoints,
    };
  }

  deserialize(data: ReturnType<MetaProgressionManager['serialize']>): void {
    this.upgradeLevels = new Map(Object.entries(data.upgradeLevels));
    this.unlockedKnowledge = new Set(data.unlockedKnowledge);
    this.masteryXP = new Map(Object.entries(data.masteryXP));
    this.playerStats = new Map(Object.entries(data.playerStats));
    this.legacyPoints = data.legacyPoints;
  }
}

// 싱글톤 인스턴스
export const metaProgressionManager = new MetaProgressionManager();

export default metaProgression;
