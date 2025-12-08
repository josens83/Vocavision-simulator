/**
 * Chapter 7: Progression & Engagement - Unlock System
 * 언락 시스템 데이터 및 관리
 */

import {
  UnlockCategory,
  UnlockItem,
  UnlockCondition,
  UnlockPersistence,
  UnlockSystem,
  CosmeticItem,
  CosmeticCategory,
} from './types';

// ============================================
// 게임 모드 언락
// ============================================

const gameModeUnlocks: UnlockItem[] = [
  {
    id: 'new_game_plus',
    name: '뉴 게임+',
    description: '스킬과 일부 자원을 유지한 채 새로 시작',
    icon: '➕',
    condition: { type: 'playthrough_complete', count: 1 },
    benefits: [
      '시작 스킬 레벨 유지 (50% 감소)',
      '시작 자금 +20%',
      '새로운 이벤트 해금',
    ],
  },
  {
    id: 'sandbox_mode',
    name: '샌드박스 모드',
    description: '무제한 자원으로 자유롭게 실험',
    icon: '🏖️',
    condition: { type: 'achievement_points', value: 3500 },
    benefits: [
      '무제한 자금',
      '이벤트 수동 트리거',
      '시간 조작',
      '모든 NPC 즉시 접근',
    ],
  },
  {
    id: 'speedrun_mode',
    name: '스피드런 모드',
    description: '타이머와 함께 빠른 클리어 도전',
    icon: '⏱️',
    condition: { type: 'achievement', id: 'speedrun_record' },
    benefits: [
      '실시간 타이머',
      '스플릿 기록',
      '리더보드 등록',
      '최적화 힌트',
    ],
  },
  {
    id: 'ironman_mode',
    name: '아이언맨 모드',
    description: '자동 저장만, 되돌리기 불가',
    icon: '🦾',
    condition: { type: 'difficulty_complete', difficulty: 'hard' },
    benefits: [
      '보상 +50%',
      '특별 칭호',
      '리더보드 별도 카테고리',
    ],
  },
  {
    id: 'daily_challenge',
    name: '일일 도전',
    description: '매일 새로운 시드로 도전',
    icon: '📅',
    condition: { type: 'days_played', value: 7 },
    benefits: [
      '일일 리더보드',
      '연속 클리어 보너스',
      '특별 보상',
    ],
  },
  {
    id: 'ultimate_mode',
    name: '궁극의 모드',
    description: '모든 난이도 클리어 후 해금되는 최종 도전',
    icon: '💀',
    condition: { type: 'achievement', id: 'all_difficulties' },
    benefits: [
      '모든 모디파이어 활성화',
      '특별 엔딩',
      '영구 리더보드 등재',
    ],
  },
];

// ============================================
// 시작 옵션 언락
// ============================================

const startOptionUnlocks: UnlockItem[] = [
  {
    id: 'start_with_mvp',
    name: 'MVP 시작',
    description: '이미 MVP가 완성된 상태로 시작',
    icon: '📱',
    condition: { type: 'achievement', id: 'survive_quarter' },
    benefits: [
      '기본 기능 구현 완료',
      '첫 10명의 사용자',
      '시작 시점 Day 30',
    ],
  },
  {
    id: 'start_with_funding',
    name: '투자 유치 시작',
    description: '시드 투자를 받은 상태로 시작',
    icon: '💰',
    condition: { type: 'achievement', id: 'investor_backing' },
    benefits: [
      '시작 자금 2천만원',
      '투자자 NPC 관계 40',
      '3개월 내 마일스톤 의무',
    ],
  },
  {
    id: 'start_experienced',
    name: '경험자 시작',
    description: '이전 스타트업 경험이 있는 설정',
    icon: '🎓',
    condition: { type: 'playthroughs', value: 3 },
    benefits: [
      '모든 스킬 +10',
      '멘토 NPC 관계 60',
      '초기 네트워크 3명',
    ],
  },
  {
    id: 'start_hardcore',
    name: '하드코어 시작',
    description: '최소한의 자원으로 시작',
    icon: '💀',
    condition: { type: 'achievement', id: 'minimalist' },
    benefits: [
      '시작 자금 200만원',
      '보상 +100%',
      '특별 엔딩 접근',
    ],
  },
  {
    id: 'start_networked',
    name: '인맥왕 시작',
    description: '다양한 NPC 관계로 시작',
    icon: '🤝',
    condition: { type: 'achievement', id: 'social_butterfly' },
    benefits: [
      '5명의 NPC와 관계 시작',
      '네트워킹 이벤트 빈도 증가',
      '소개팅 기회 증가',
    ],
  },
];

// ============================================
// 게임 기능 언락
// ============================================

const featureUnlocks: UnlockItem[] = [
  {
    id: 'advanced_analytics',
    name: '고급 분석',
    description: '상세한 비즈니스 분석 대시보드',
    icon: '📊',
    condition: { type: 'achievement', id: 'hundred_users' },
    benefits: [
      '코호트 분석',
      'LTV 예측',
      '이탈 예측',
    ],
  },
  {
    id: 'automation',
    name: '자동화',
    description: '반복 작업 자동화 옵션',
    icon: '🤖',
    condition: { type: 'skill_level', skill: 'coding', value: 50 },
    benefits: [
      '자동 버그 수정 (소규모)',
      '자동 고객 응대 (기본)',
      '자동 마케팅 (예약)',
    ],
  },
  {
    id: 'delegate',
    name: '위임',
    description: 'NPC에게 작업 위임',
    icon: '👥',
    condition: { type: 'npc_relationship_count', min_level: 60, count: 3 },
    benefits: [
      '멘토에게 조언 요청',
      '전문가에게 검토 의뢰',
      '네트워크 활용',
    ],
  },
  {
    id: 'forecast',
    name: '예측',
    description: '재무 예측 기능',
    icon: '🔮',
    condition: { type: 'days_survived', value: 90 },
    benefits: [
      '3개월 예측',
      '시나리오 분석',
      '위험 경고',
    ],
  },
  {
    id: 'time_skip',
    name: '시간 건너뛰기',
    description: '이벤트 없는 시간 빠르게 진행',
    icon: '⏩',
    condition: { type: 'playthrough_complete', count: 1 },
    benefits: [
      '주 단위 건너뛰기',
      '월 단위 건너뛰기',
      '자동 최적 선택 (옵션)',
    ],
  },
  {
    id: 'ab_testing',
    name: 'A/B 테스팅',
    description: '마케팅 실험 기능',
    icon: '🔬',
    condition: { type: 'skill_level', skill: 'marketing', value: 60 },
    benefits: [
      '캠페인 비교',
      '최적화 제안',
      '데이터 기반 결정',
    ],
  },
  {
    id: 'investor_dashboard',
    name: '투자자 대시보드',
    description: '투자자 관점의 지표 확인',
    icon: '📈',
    condition: { type: 'achievement', id: 'investor_backing' },
    benefits: [
      '밸류에이션 추적',
      '투자자 관계 관리',
      '피칭 준비 도구',
    ],
  },
];

// ============================================
// 코스메틱 언락
// ============================================

const officeThemes: CosmeticItem[] = [
  { id: 'minimalist', name: '미니멀리스트', condition: { type: 'default' } },
  { id: 'startup_garage', name: '차고 스타트업', condition: { type: 'achievement', id: 'first_user' } },
  { id: 'coworking', name: '코워킹 스페이스', condition: { type: 'users', value: 1000 } },
  { id: 'modern_office', name: '모던 오피스', condition: { type: 'users', value: 10000 } },
  { id: 'penthouse', name: '펜트하우스', condition: { type: 'users', value: 100000 } },
  { id: 'silicon_valley', name: '실리콘밸리', condition: { type: 'achievement', id: 'million_users' } },
  { id: 'retro_arcade', name: '레트로 아케이드', condition: { type: 'achievement', id: 'konami_code' } },
  { id: 'zen_garden', name: '젠 가든', condition: { type: 'achievement', id: 'no_burnout' } },
];

const characterSkins: CosmeticItem[] = [
  { id: 'casual', name: '캐주얼', condition: { type: 'default' } },
  { id: 'formal', name: '포멀', condition: { type: 'achievement', id: 'investor_backing' } },
  { id: 'hoodie', name: '후드티 개발자', condition: { type: 'skill', skill: 'coding', value: 70 } },
  { id: 'suit', name: '정장 CEO', condition: { type: 'achievement', id: 'billion_won_valuation' } },
  { id: 'retro', name: '레트로', condition: { type: 'achievement', id: 'konami_code' } },
  { id: 'athlete', name: '운동복', condition: { type: 'achievement', id: 'no_burnout' } },
  { id: 'creative', name: '크리에이티브', condition: { type: 'skill', skill: 'design', value: 70 } },
];

const uiThemes: CosmeticItem[] = [
  { id: 'default_dark', name: '다크 (기본)', condition: { type: 'default' } },
  { id: 'light', name: '라이트', condition: { type: 'default' } },
  { id: 'midnight', name: '미드나잇', condition: { type: 'achievement', id: 'night_owl' } },
  { id: 'nature', name: '네이처', condition: { type: 'achievement', id: 'no_burnout' } },
  { id: 'retro_terminal', name: '레트로 터미널', condition: { type: 'achievement', id: 'coding_master' } },
  { id: 'golden', name: '골든', condition: { type: 'achievement_points', value: 2000 } },
  { id: 'neon', name: '네온', condition: { type: 'achievement', id: 'viral_success' } },
  { id: 'minimal', name: '미니멀', condition: { type: 'achievement', id: 'minimalist' } },
];

const profileFrames: CosmeticItem[] = [
  { id: 'none', name: '없음', condition: { type: 'default' } },
  { id: 'bronze', name: '브론즈', condition: { type: 'achievement_points', value: 100 } },
  { id: 'silver', name: '실버', condition: { type: 'achievement_points', value: 500 } },
  { id: 'gold', name: '골드', condition: { type: 'achievement_points', value: 2000 } },
  { id: 'platinum', name: '플래티넘', condition: { type: 'achievement_points', value: 5000 } },
  { id: 'diamond', name: '다이아몬드', condition: { type: 'achievement', id: 'hundred_percent' } },
  { id: 'fire', name: '불꽃', condition: { type: 'achievement', id: 'zero_to_hero' } },
  { id: 'star', name: '스타', condition: { type: 'achievement', id: 'million_users' } },
];

const cosmeticCategories: CosmeticCategory[] = [
  {
    id: 'office_themes',
    name: '오피스 테마',
    description: '다양한 작업 공간 테마',
    items: officeThemes,
  },
  {
    id: 'character_skins',
    name: '캐릭터 스킨',
    description: '플레이어 캐릭터 외형',
    items: characterSkins,
  },
  {
    id: 'ui_themes',
    name: 'UI 테마',
    description: '인터페이스 테마',
    items: uiThemes,
  },
  {
    id: 'profile_frames',
    name: '프로필 프레임',
    description: '프로필 테두리',
    items: profileFrames,
  },
];

// ============================================
// 특수 콘텐츠 언락
// ============================================

const specialUnlocks: UnlockItem[] = [
  {
    id: 'developer_commentary',
    name: '개발자 코멘터리',
    description: '게임 개발 비하인드 스토리',
    icon: '🎙️',
    condition: { type: 'achievement_points', value: 1000 },
    content: [
      '이벤트별 개발 의도',
      'NPC 디자인 과정',
      '밸런싱 비화',
      '컷된 콘텐츠',
    ],
  },
  {
    id: 'statistics_center',
    name: '통계 센터',
    description: '전체 플레이 통계',
    icon: '📈',
    condition: { type: 'playthroughs', value: 5 },
    content: [
      '총 플레이 시간',
      '누적 사용자 수',
      '이벤트 선택 분포',
      '사망 원인 통계',
      '글로벌 비교',
    ],
  },
  {
    id: 'npc_gallery',
    name: 'NPC 갤러리',
    description: 'NPC 아트워크와 설정',
    icon: '🖼️',
    condition: { type: 'achievement', id: 'meet_all_npcs' },
    content: [
      '풀 아트워크',
      '캐릭터 설정',
      '숨겨진 스토리',
      '관계도',
    ],
  },
  {
    id: 'ending_gallery',
    name: '엔딩 갤러리',
    description: '달성한 엔딩 모음',
    icon: '🎬',
    condition: { type: 'endings_seen', value: 5 },
    content: [
      '엔딩 일러스트',
      '엔딩 조건 힌트',
      '엔딩 통계',
    ],
  },
  {
    id: 'music_player',
    name: '뮤직 플레이어',
    description: '게임 OST 감상',
    icon: '🎵',
    condition: { type: 'playthroughs', value: 1 },
    content: [
      '전체 OST',
      '미사용 트랙',
      '작곡가 코멘트',
    ],
  },
  {
    id: 'event_editor',
    name: '이벤트 에디터',
    description: '커스텀 이벤트 제작',
    icon: '✏️',
    condition: { type: 'achievement', id: 'seen_it_all' },
    content: [
      '이벤트 템플릿',
      '조건 설정',
      '결과 설정',
      '커뮤니티 공유',
    ],
  },
  {
    id: 'secret_room',
    name: '비밀의 방',
    description: '???',
    icon: '🚪',
    condition: { type: 'achievement', id: 'easter_egg_hunter' },
    content: [
      '숨겨진 미니게임',
      '개발팀 메시지',
      '특별 콘텐츠',
    ],
  },
];

// ============================================
// 언락 카테고리
// ============================================

export const unlockCategories: UnlockCategory[] = [
  {
    id: 'game_modes',
    name: '게임 모드',
    icon: '🎮',
    unlocks: gameModeUnlocks,
  },
  {
    id: 'start_options',
    name: '시작 옵션',
    icon: '🚀',
    unlocks: startOptionUnlocks,
  },
  {
    id: 'features',
    name: '게임 기능',
    icon: '⚙️',
    unlocks: featureUnlocks,
  },
  {
    id: 'cosmetics',
    name: '커스터마이징',
    icon: '🎨',
    items: cosmeticCategories,
  },
  {
    id: 'special',
    name: '특수 콘텐츠',
    icon: '✨',
    unlocks: specialUnlocks,
  },
];

// ============================================
// 영속성 설정
// ============================================

export const unlockPersistence: UnlockPersistence = {
  permanent: [
    'achievements',
    'achievement_points',
    'unlocked_modes',
    'unlocked_cosmetics',
    'statistics',
    'seen_endings',
    'seen_events',
  ],
  newGamePlus: [
    'skill_levels',
    'npc_base_relationships',
    'unlocked_features',
  ],
  perRun: [
    'cash',
    'users',
    'current_relationships',
    'game_day',
    'active_events',
  ],
};

// ============================================
// 통합 언락 시스템
// ============================================

export const unlockSystem: UnlockSystem = {
  categories: unlockCategories,
  persistence: unlockPersistence,
};

// ============================================
// 언락 관리 클래스
// ============================================

export class UnlockManager {
  private unlockedModes: Set<string> = new Set();
  private unlockedStartOptions: Set<string> = new Set();
  private unlockedFeatures: Set<string> = new Set();
  private unlockedCosmetics: Set<string> = new Set();
  private unlockedSpecial: Set<string> = new Set();
  private equippedCosmetics: Record<string, string> = {};

  constructor() {
    // 기본 해금 항목
    this.unlockedCosmetics.add('minimalist');
    this.unlockedCosmetics.add('casual');
    this.unlockedCosmetics.add('default_dark');
    this.unlockedCosmetics.add('light');
    this.unlockedCosmetics.add('none');
  }

  // 조건 체크
  checkCondition(condition: UnlockCondition, state: any): boolean {
    switch (condition.type) {
      case 'default':
        return true;
      case 'achievement':
        return state.achievements?.includes(condition.id);
      case 'achievement_points':
        return (state.achievementPoints || 0) >= (condition.value || 0);
      case 'playthrough_complete':
      case 'playthroughs':
        return (state.playthroughCount || 0) >= (condition.count || condition.value || 1);
      case 'difficulty_complete':
        return state.difficultiesCompleted?.includes(condition.difficulty);
      case 'days_survived':
        return (state.daysSurvived || 0) >= (condition.value || 0);
      case 'days_played':
        return (state.daysPlayed || 0) >= (condition.value || 0);
      case 'users':
        return (state.users || 0) >= (condition.value || 0);
      case 'skill_level':
      case 'skill':
        return (state.skills?.[condition.skill!] || 0) >= (condition.value || 0);
      case 'npc_relationship_count':
        const friendCount = Object.values(state.npcRelationships || {})
          .filter((rel) => (rel as number) >= (condition.min_level || 0)).length;
        return friendCount >= (condition.count || 0);
      case 'endings_seen':
        return (state.endingsSeen?.length || 0) >= (condition.value || 0);
      default:
        return false;
    }
  }

  // 모드 해금
  unlockMode(id: string): boolean {
    if (this.unlockedModes.has(id)) return false;
    this.unlockedModes.add(id);
    return true;
  }

  // 시작 옵션 해금
  unlockStartOption(id: string): boolean {
    if (this.unlockedStartOptions.has(id)) return false;
    this.unlockedStartOptions.add(id);
    return true;
  }

  // 기능 해금
  unlockFeature(id: string): boolean {
    if (this.unlockedFeatures.has(id)) return false;
    this.unlockedFeatures.add(id);
    return true;
  }

  // 코스메틱 해금
  unlockCosmetic(id: string): boolean {
    if (this.unlockedCosmetics.has(id)) return false;
    this.unlockedCosmetics.add(id);
    return true;
  }

  // 특수 콘텐츠 해금
  unlockSpecial(id: string): boolean {
    if (this.unlockedSpecial.has(id)) return false;
    this.unlockedSpecial.add(id);
    return true;
  }

  // 코스메틱 장착
  equipCosmetic(category: string, id: string): boolean {
    if (!this.unlockedCosmetics.has(id)) return false;
    this.equippedCosmetics[category] = id;
    return true;
  }

  // 모든 조건 체크 및 해금
  checkAllUnlocks(state: any): string[] {
    const newlyUnlocked: string[] = [];

    // 모드 체크
    for (const mode of gameModeUnlocks) {
      if (!this.unlockedModes.has(mode.id) && this.checkCondition(mode.condition, state)) {
        this.unlockMode(mode.id);
        newlyUnlocked.push(`mode:${mode.id}`);
      }
    }

    // 시작 옵션 체크
    for (const option of startOptionUnlocks) {
      if (!this.unlockedStartOptions.has(option.id) && this.checkCondition(option.condition, state)) {
        this.unlockStartOption(option.id);
        newlyUnlocked.push(`start:${option.id}`);
      }
    }

    // 기능 체크
    for (const feature of featureUnlocks) {
      if (!this.unlockedFeatures.has(feature.id) && this.checkCondition(feature.condition, state)) {
        this.unlockFeature(feature.id);
        newlyUnlocked.push(`feature:${feature.id}`);
      }
    }

    // 코스메틱 체크
    for (const category of cosmeticCategories) {
      for (const item of category.items) {
        if (!this.unlockedCosmetics.has(item.id) && this.checkCondition(item.condition, state)) {
          this.unlockCosmetic(item.id);
          newlyUnlocked.push(`cosmetic:${item.id}`);
        }
      }
    }

    // 특수 콘텐츠 체크
    for (const special of specialUnlocks) {
      if (!this.unlockedSpecial.has(special.id) && this.checkCondition(special.condition, state)) {
        this.unlockSpecial(special.id);
        newlyUnlocked.push(`special:${special.id}`);
      }
    }

    return newlyUnlocked;
  }

  // 해금 여부 확인
  isUnlocked(type: string, id: string): boolean {
    switch (type) {
      case 'mode': return this.unlockedModes.has(id);
      case 'start': return this.unlockedStartOptions.has(id);
      case 'feature': return this.unlockedFeatures.has(id);
      case 'cosmetic': return this.unlockedCosmetics.has(id);
      case 'special': return this.unlockedSpecial.has(id);
      default: return false;
    }
  }

  // 카테고리별 해금 목록
  getUnlockedModes(): string[] {
    return Array.from(this.unlockedModes);
  }

  getUnlockedStartOptions(): string[] {
    return Array.from(this.unlockedStartOptions);
  }

  getUnlockedFeatures(): string[] {
    return Array.from(this.unlockedFeatures);
  }

  getUnlockedCosmetics(): string[] {
    return Array.from(this.unlockedCosmetics);
  }

  getUnlockedSpecial(): string[] {
    return Array.from(this.unlockedSpecial);
  }

  getEquippedCosmetics(): Record<string, string> {
    return { ...this.equippedCosmetics };
  }

  // 진행률
  getProgress(): Record<string, { unlocked: number; total: number }> {
    return {
      modes: {
        unlocked: this.unlockedModes.size,
        total: gameModeUnlocks.length,
      },
      startOptions: {
        unlocked: this.unlockedStartOptions.size,
        total: startOptionUnlocks.length,
      },
      features: {
        unlocked: this.unlockedFeatures.size,
        total: featureUnlocks.length,
      },
      cosmetics: {
        unlocked: this.unlockedCosmetics.size,
        total: cosmeticCategories.reduce((sum, cat) => sum + cat.items.length, 0),
      },
      special: {
        unlocked: this.unlockedSpecial.size,
        total: specialUnlocks.length,
      },
    };
  }

  // 저장/로드
  serialize(): {
    modes: string[];
    startOptions: string[];
    features: string[];
    cosmetics: string[];
    special: string[];
    equipped: Record<string, string>;
  } {
    return {
      modes: Array.from(this.unlockedModes),
      startOptions: Array.from(this.unlockedStartOptions),
      features: Array.from(this.unlockedFeatures),
      cosmetics: Array.from(this.unlockedCosmetics),
      special: Array.from(this.unlockedSpecial),
      equipped: { ...this.equippedCosmetics },
    };
  }

  deserialize(data: {
    modes: string[];
    startOptions: string[];
    features: string[];
    cosmetics: string[];
    special: string[];
    equipped: Record<string, string>;
  }): void {
    this.unlockedModes = new Set(data.modes);
    this.unlockedStartOptions = new Set(data.startOptions);
    this.unlockedFeatures = new Set(data.features);
    this.unlockedCosmetics = new Set(data.cosmetics);
    this.unlockedSpecial = new Set(data.special);
    this.equippedCosmetics = { ...data.equipped };
  }

  // 리셋 (영구 언락 유지)
  reset(): void {
    // 코스메틱만 기본값으로
    this.equippedCosmetics = {};
  }

  // 완전 리셋
  fullReset(): void {
    this.unlockedModes.clear();
    this.unlockedStartOptions.clear();
    this.unlockedFeatures.clear();
    this.unlockedCosmetics = new Set(['minimalist', 'casual', 'default_dark', 'light', 'none']);
    this.unlockedSpecial.clear();
    this.equippedCosmetics = {};
  }
}

// ============================================
// 유틸리티 함수
// ============================================

export function getUnlockById(id: string): UnlockItem | CosmeticItem | null {
  // 모드에서 찾기
  const mode = gameModeUnlocks.find(m => m.id === id);
  if (mode) return mode;

  // 시작 옵션에서 찾기
  const start = startOptionUnlocks.find(s => s.id === id);
  if (start) return start;

  // 기능에서 찾기
  const feature = featureUnlocks.find(f => f.id === id);
  if (feature) return feature;

  // 코스메틱에서 찾기
  for (const category of cosmeticCategories) {
    const cosmetic = category.items.find(c => c.id === id);
    if (cosmetic) return cosmetic;
  }

  // 특수 콘텐츠에서 찾기
  const special = specialUnlocks.find(s => s.id === id);
  if (special) return special;

  return null;
}

export function getUnlockCategory(id: string): string | null {
  if (gameModeUnlocks.some(m => m.id === id)) return 'modes';
  if (startOptionUnlocks.some(s => s.id === id)) return 'startOptions';
  if (featureUnlocks.some(f => f.id === id)) return 'features';
  for (const category of cosmeticCategories) {
    if (category.items.some(c => c.id === id)) return 'cosmetics';
  }
  if (specialUnlocks.some(s => s.id === id)) return 'special';
  return null;
}

// 싱글톤 인스턴스
export const unlockManager = new UnlockManager();

export default UnlockManager;
