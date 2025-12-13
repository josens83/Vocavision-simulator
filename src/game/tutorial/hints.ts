/**
 * Chapter 9: Tutorial & Onboarding - Hints System
 * 힌트 및 컨텍스트 도움말 시스템
 */

import { Hint, HelpTopic, HelpCategory, FeatureDiscovery } from './types';

// ============================================
// 컨텍스트 힌트
// ============================================

export const hints: Hint[] = [
  // 에너지 관련 힌트
  {
    id: 'low_energy',
    category: 'basics',
    title: '에너지가 부족해요!',
    content: '에너지가 낮으면 업무 효율이 떨어집니다. 휴식을 취해 에너지를 회복하세요.',
    condition: {
      type: 'stat',
      target: 'player.health.energy',
      operator: '<',
      value: 30,
    },
    displayType: 'notification',
    icon: '⚡',
    priority: 90,
    maxShows: 3,
    cooldownMinutes: 30,
    relatedTutorial: 'basic_tutorial',
  },
  {
    id: 'high_stress',
    category: 'basics',
    title: '스트레스 경고!',
    content: '스트레스가 높습니다. 방치하면 번아웃이 올 수 있어요. 휴식을 취하거나 취미 활동을 하세요.',
    condition: {
      type: 'stat',
      target: 'player.health.stress',
      operator: '>',
      value: 70,
    },
    displayType: 'notification',
    icon: '😰',
    priority: 95,
    maxShows: 5,
    cooldownMinutes: 20,
  },
  {
    id: 'burnout_warning',
    category: 'basics',
    title: '번아웃 위험!',
    content: '번아웃 직전입니다! 지금 당장 휴식을 취하세요. 번아웃되면 게임 오버입니다.',
    condition: {
      type: 'stat',
      target: 'player.health.burnoutRisk',
      operator: '>',
      value: 80,
    },
    displayType: 'popup',
    icon: '🚨',
    priority: 100,
    maxShows: 10,
    cooldownMinutes: 5,
  },

  // 자금 관련 힌트
  {
    id: 'low_cash',
    category: 'finance',
    title: '자금이 부족해요!',
    content: '현금이 얼마 남지 않았습니다. 비용을 줄이거나 수익을 늘려야 합니다.',
    condition: {
      type: 'metric',
      target: 'business.finance.cash',
      operator: '<',
      value: 1000000,
    },
    displayType: 'notification',
    icon: '💰',
    priority: 85,
    maxShows: 3,
    cooldownMinutes: 60,
    relatedTutorial: 'business_tutorial',
  },
  {
    id: 'short_runway',
    category: 'finance',
    title: '런웨이 경고!',
    content: '런웨이가 3개월 미만입니다. 곧 자금이 바닥날 수 있어요!',
    condition: {
      type: 'metric',
      target: 'business.finance.runway',
      operator: '<',
      value: 3,
    },
    displayType: 'popup',
    icon: '⏰',
    priority: 92,
    maxShows: 5,
    cooldownMinutes: 30,
  },

  // 사용자 관련 힌트
  {
    id: 'high_churn',
    category: 'marketing',
    title: '사용자 이탈률 증가!',
    content: '이탈률이 높아지고 있습니다. 제품 개선이나 리텐션 마케팅이 필요해요.',
    condition: {
      type: 'metric',
      target: 'business.users.churnRate',
      operator: '>',
      value: 10,
    },
    displayType: 'notification',
    icon: '📉',
    priority: 75,
    maxShows: 3,
    cooldownMinutes: 120,
    relatedTutorial: 'marketing_tutorial',
  },
  {
    id: 'low_nps',
    category: 'marketing',
    title: '고객 만족도 하락!',
    content: 'NPS가 낮습니다. 사용자 피드백을 확인하고 개선이 필요한 부분을 찾아보세요.',
    condition: {
      type: 'metric',
      target: 'business.users.nps',
      operator: '<',
      value: 20,
    },
    displayType: 'notification',
    icon: '😕',
    priority: 70,
    maxShows: 3,
    cooldownMinutes: 180,
  },

  // 제품 관련 힌트
  {
    id: 'high_tech_debt',
    category: 'development',
    title: '기술 부채 경고!',
    content: '기술 부채가 쌓이고 있습니다. 리팩토링을 통해 기술 부채를 줄이세요.',
    condition: {
      type: 'metric',
      target: 'business.product.technicalDebt',
      operator: '>',
      value: 60,
    },
    displayType: 'notification',
    icon: '🔧',
    priority: 65,
    maxShows: 3,
    cooldownMinutes: 240,
    relatedTutorial: 'development_tutorial',
  },
  {
    id: 'low_stability',
    category: 'development',
    title: '제품 안정성 저하!',
    content: '앱 안정성이 떨어지고 있습니다. 버그 수정과 테스팅에 시간을 투자하세요.',
    condition: {
      type: 'metric',
      target: 'business.product.stability',
      operator: '<',
      value: 70,
    },
    displayType: 'notification',
    icon: '🐛',
    priority: 72,
    maxShows: 3,
    cooldownMinutes: 120,
  },

  // 서버 관련 힌트
  {
    id: 'server_warning',
    category: 'development',
    title: '서버 과부하!',
    content: '서버에 부하가 걸리고 있습니다. 인프라 업그레이드를 고려하세요.',
    condition: {
      type: 'metric',
      target: 'business.infrastructure.serverHealth',
      operator: '<',
      value: 50,
    },
    displayType: 'popup',
    icon: '🖥️',
    priority: 88,
    maxShows: 5,
    cooldownMinutes: 60,
  },

  // 시간 관련 힌트
  {
    id: 'first_week',
    category: 'tips',
    title: '첫 주 팁',
    content: '첫 주에는 개발에 집중하세요. MVP(최소 기능 제품)를 완성하는 것이 중요합니다!',
    condition: {
      type: 'time',
      target: 'time.totalDays',
      operator: '==',
      value: 7,
    },
    displayType: 'notification',
    icon: '💡',
    priority: 50,
    maxShows: 1,
    cooldownMinutes: 0,
  },
  {
    id: 'first_month',
    category: 'tips',
    title: '첫 달 회고',
    content: '첫 달이 지났습니다! 지금까지의 성과를 돌아보고 다음 전략을 세워보세요.',
    condition: {
      type: 'time',
      target: 'time.totalDays',
      operator: '==',
      value: 30,
    },
    displayType: 'notification',
    icon: '📅',
    priority: 55,
    maxShows: 1,
    cooldownMinutes: 0,
  },

  // 스킬 관련 힌트
  {
    id: 'skill_reminder',
    category: 'tips',
    title: '스킬 향상 필요',
    content: '스킬을 향상시키면 업무 효율이 올라갑니다. 학습 시간을 갖는 것도 좋아요!',
    condition: {
      type: 'action',
      target: 'learning_count',
      operator: '==',
      value: 0,
    },
    displayType: 'sidebar',
    icon: '📚',
    priority: 40,
    maxShows: 2,
    cooldownMinutes: 1440, // 24시간
  },

  // 네트워킹 힌트
  {
    id: 'networking_tip',
    category: 'tips',
    title: '네트워킹의 중요성',
    content: '다른 사람들과 네트워킹하면 좋은 기회를 얻을 수 있어요. 커뮤니티에 참여해보세요!',
    condition: {
      type: 'stat',
      target: 'relationships.contacts.length',
      operator: '==',
      value: 0,
    },
    displayType: 'sidebar',
    icon: '🤝',
    priority: 35,
    maxShows: 2,
    cooldownMinutes: 2880, // 48시간
  },
];

// ============================================
// 도움말 카테고리
// ============================================

export const helpCategories: HelpCategory[] = [
  {
    id: 'getting_started',
    name: '시작하기',
    icon: '🚀',
    description: '게임 시작과 기본 조작법',
    order: 1,
    topics: ['what_is_vocavision', 'basic_controls', 'game_objectives', 'day_cycle'],
  },
  {
    id: 'business',
    name: '비즈니스 관리',
    icon: '💼',
    description: '수익, 비용, 재무 관리',
    order: 2,
    topics: ['revenue_model', 'cost_structure', 'runway', 'investment'],
  },
  {
    id: 'development',
    name: '개발',
    icon: '💻',
    description: '앱 개발과 기술 관리',
    order: 3,
    topics: ['feature_development', 'bug_fixing', 'tech_debt', 'infrastructure'],
  },
  {
    id: 'marketing',
    name: '마케팅',
    icon: '📢',
    description: '사용자 획득과 성장',
    order: 4,
    topics: ['user_acquisition', 'retention', 'metrics', 'viral_marketing'],
  },
  {
    id: 'player',
    name: '플레이어 관리',
    icon: '👤',
    description: '에너지, 스트레스, 스킬',
    order: 5,
    topics: ['energy_management', 'stress_burnout', 'skills', 'networking'],
  },
  {
    id: 'events',
    name: '이벤트 & 결정',
    icon: '📨',
    description: '이벤트 시스템과 의사결정',
    order: 6,
    topics: ['event_types', 'decision_making', 'consequences', 'crisis_management'],
  },
  {
    id: 'advanced',
    name: '고급 전략',
    icon: '🎯',
    description: '승리 전략과 고급 팁',
    order: 7,
    topics: ['victory_conditions', 'game_over', 'strategies', 'achievements'],
  },
];

// ============================================
// 도움말 주제
// ============================================

export const helpTopics: HelpTopic[] = [
  // 시작하기
  {
    id: 'what_is_vocavision',
    category: 'getting_started',
    title: 'VocaVision 시뮬레이터란?',
    summary: '게임의 기본 개념과 배경',
    content: `# VocaVision 시뮬레이터

VocaVision 시뮬레이터는 **1인 에듀테크 스타트업 경영 시뮬레이션 게임**입니다.

## 게임 배경

당신은 "VocaVision"이라는 영어 단어 학습 앱의 창업자입니다.
혼자서 개발, 마케팅, 비즈니스를 모두 해내며 스타트업을 성장시켜야 합니다.

## 주요 특징

- **리얼리즘**: 실제 스타트업 운영과 유사한 경험
- **의사결정**: 다양한 이벤트와 결정의 연속
- **성장 시뮬레이션**: 0에서 시작해 성공적인 비즈니스로
- **다중 엔딩**: 여러 가지 결말 가능

## 게임 목표

프리미엄 사용자 1,000명 달성, 현금 1억원 보유, 또는 성공적인 인수 제안을 받으면 승리합니다.`,
    keywords: ['소개', '게임', '시작', '개요', '배경'],
    relatedTopics: ['basic_controls', 'game_objectives'],
    order: 1,
  },
  {
    id: 'basic_controls',
    category: 'getting_started',
    title: '기본 조작법',
    summary: '게임 인터페이스와 조작 방법',
    content: `# 기본 조작법

## 시간 조작

- **일시정지 (⏸️)**: 게임 일시 중지
- **재생 (▶️)**: 게임 진행
- **배속 (⏩)**: 1x, 2x, 4x 속도 조절

## 액션 선택

왼쪽 메뉴에서 다양한 액션을 선택할 수 있습니다:

| 카테고리 | 설명 |
|---------|------|
| 💻 개발 | 앱 기능 개발, 버그 수정 |
| 📢 마케팅 | 사용자 유치 활동 |
| 💼 비즈니스 | 사업 관리, 미팅 |
| 📚 학습 | 스킬 향상 |
| 😴 휴식 | 에너지 회복 |

## 이벤트 응답

이벤트가 발생하면 게임이 일시정지됩니다.
선택지를 클릭해 응답하세요.

## 키보드 단축키

- \`Space\`: 일시정지/재생 토글
- \`1-4\`: 배속 조절
- \`Esc\`: 메뉴 열기`,
    keywords: ['조작', '컨트롤', '단축키', '인터페이스', 'UI'],
    relatedTopics: ['what_is_vocavision', 'day_cycle'],
    order: 2,
  },
  {
    id: 'game_objectives',
    category: 'getting_started',
    title: '게임 목표',
    summary: '승리 조건과 실패 조건',
    content: `# 게임 목표

## 승리 조건 (하나만 달성하면 승리!)

1. **👑 프리미엄 사용자 1,000명**
   - 유료 구독자 1,000명 달성

2. **💰 현금 1억원**
   - 보유 현금 100,000,000원 이상

3. **🏆 인수 제안**
   - 365일 경과
   - 프리미엄 사용자 500명 이상
   - 평판 80 이상
   - 현금 5,000만원 이상

## 실패 조건 (게임 오버)

- **💸 파산**: 현금이 -100만원 이하
- **💥 서버 다운**: 서버 건강도 0
- **😢 평판 붕괴**: 평판 0
- **😴 번아웃**: 번아웃 위험 100%
- **👥 사용자 이탈**: 30일 후 사용자 0명

## 팁

승리를 위해 균형 잡힌 전략이 필요합니다.
하나에만 집중하면 다른 부분에서 문제가 발생할 수 있어요!`,
    keywords: ['목표', '승리', '실패', '게임오버', '조건'],
    relatedTopics: ['victory_conditions', 'game_over'],
    order: 3,
  },

  // 비즈니스
  {
    id: 'revenue_model',
    category: 'business',
    title: '수익 모델',
    summary: 'VocaVision의 수익 구조',
    content: `# 수익 모델

VocaVision은 다양한 수익원을 가지고 있습니다.

## 구독 수익 (주요 수익원)

| 플랜 | 가격 | 특징 |
|------|------|------|
| 월간 | 9,900원 | 언제든 해지 가능 |
| 연간 | 99,000원 | 월 8,250원 (17% 할인) |

## 인앱 결제

- 추가 콘텐츠 팩
- 프리미엄 기능
- 광고 제거

## B2B 수익

- 학교 단체 라이선스
- 기업 교육 프로그램

## 광고 수익

- 무료 사용자 대상 광고
- 너무 많은 광고는 이탈률 증가!

## 수익 최적화 팁

1. 전환율을 높이세요 (무료 → 유료)
2. 연간 구독을 유도하세요
3. B2B 파트너십을 적극 활용하세요`,
    keywords: ['수익', '구독', '결제', 'B2B', '광고'],
    relatedTopics: ['cost_structure', 'runway'],
    order: 1,
  },
  {
    id: 'cost_structure',
    category: 'business',
    title: '비용 구조',
    summary: '운영에 필요한 비용 항목',
    content: `# 비용 구조

## 고정 비용 (매월)

| 항목 | 비용 | 비고 |
|------|------|------|
| 서버 기본 | 월 50,000원 | + 사용자당 추가 |
| 도메인 | 월 1,500원 | |
| 이메일 | 월 10,000원 | |
| 개발 도구 | 월 30,000원 | |

## 변동 비용

- **서버 확장**: 사용자 증가 시
- **AI API**: 사용량에 비례
- **결제 수수료**: 수익의 3-5%

## 임시 비용

- 법률 자문: 필요시
- 디자인 외주: 필요시
- 마케팅 캠페인: 선택시

## 비용 절감 팁

1. 초기에는 최소한의 비용으로 시작
2. 사용자 증가에 맞춰 서버 확장
3. 불필요한 도구 구독 정리`,
    keywords: ['비용', '지출', '서버', '운영비'],
    relatedTopics: ['revenue_model', 'runway'],
    order: 2,
  },

  // 개발
  {
    id: 'feature_development',
    category: 'development',
    title: '기능 개발',
    summary: '새로운 기능을 개발하는 방법',
    content: `# 기능 개발

## 개발 프로세스

1. **기능 선택**: 개발할 기능 선택
2. **개발 시작**: 에너지 소모
3. **진행**: 시간 경과
4. **완료**: 효과 적용

## 기능 유형

- **핵심 기능**: 사용자 가치 직접 제공
- **편의 기능**: 사용성 향상
- **수익 기능**: 결제 관련

## 개발 시 고려사항

- 예상 시간 vs 실제 시간
- 필요 스킬 레벨
- 기술 부채 영향

## 개발 스킬의 중요성

코딩 스킬이 높으면:
- 개발 시간 단축
- 버그 발생 감소
- 품질 향상`,
    keywords: ['개발', '기능', '코딩', '프로그래밍'],
    relatedTopics: ['tech_debt', 'bug_fixing'],
    order: 1,
  },
  {
    id: 'tech_debt',
    category: 'development',
    title: '기술 부채',
    summary: '기술 부채 이해와 관리',
    content: `# 기술 부채

## 기술 부채란?

빠른 개발을 위해 품질을 희생하면서 쌓이는 "빚"입니다.
나중에 반드시 갚아야 합니다.

## 기술 부채의 영향

| 기술 부채 | 영향 |
|----------|------|
| 0-30% | 정상 |
| 30-60% | 개발 속도 저하 |
| 60-80% | 버그 증가, 불안정 |
| 80-100% | 심각한 문제 발생 |

## 기술 부채 해결

- **리팩토링**: 코드 정리
- **테스트 작성**: 안정성 확보
- **문서화**: 유지보수 용이

## 예방 전략

1. 적정 속도로 개발
2. 정기적 리팩토링
3. 코드 리뷰 시간 확보`,
    keywords: ['기술부채', '리팩토링', '품질', '유지보수'],
    relatedTopics: ['feature_development', 'infrastructure'],
    order: 3,
  },
];

// ============================================
// 기능 발견
// ============================================

export const featureDiscoveries: FeatureDiscovery[] = [
  {
    featureId: 'premium_conversion',
    name: '프리미엄 전환',
    description: '무료 사용자를 유료 사용자로 전환할 수 있습니다.',
    unlockCondition: {
      type: 'metric',
      value: { 'business.users.total': 50 },
    },
    announcement: {
      title: '🎉 프리미엄 전환 기능!',
      message: '이제 무료 사용자를 프리미엄으로 전환할 수 있습니다!',
      icon: '💎',
    },
    tutorialId: 'business_tutorial',
    importance: 'high',
  },
  {
    featureId: 'marketing_campaigns',
    name: '마케팅 캠페인',
    description: '본격적인 마케팅 캠페인을 실행할 수 있습니다.',
    unlockCondition: {
      type: 'day',
      value: 14,
    },
    announcement: {
      title: '📢 마케팅 캠페인 해금!',
      message: '다양한 마케팅 캠페인으로 사용자를 유치하세요!',
      icon: '📢',
    },
    tutorialId: 'marketing_tutorial',
    importance: 'high',
  },
  {
    featureId: 'investor_meetings',
    name: '투자자 미팅',
    description: '투자자와 만나 펀딩을 받을 수 있습니다.',
    unlockCondition: {
      type: 'metric',
      value: { 'business.users.total': 200, 'player.social.reputation': 50 },
    },
    announcement: {
      title: '🤝 투자자 미팅 가능!',
      message: '이제 투자자들과 미팅하고 펀딩을 받을 수 있습니다!',
      icon: '💰',
    },
    importance: 'high',
  },
  {
    featureId: 'team_hiring',
    name: '팀 채용',
    description: '팀원을 고용할 수 있습니다.',
    unlockCondition: {
      type: 'metric',
      value: { 'business.finance.cash': 30000000 },
    },
    announcement: {
      title: '👥 팀 채용 시작!',
      message: '자금이 충분해졌습니다. 팀원을 고용해보세요!',
      icon: '👥',
    },
    importance: 'medium',
  },
  {
    featureId: 'b2b_sales',
    name: 'B2B 영업',
    description: '학교와 기업에 단체 라이선스를 판매할 수 있습니다.',
    unlockCondition: {
      type: 'metric',
      value: { 'business.users.premium': 100 },
    },
    announcement: {
      title: '🏢 B2B 영업 해금!',
      message: '학교와 기업에 대량 판매할 수 있습니다!',
      icon: '🏢',
    },
    importance: 'medium',
  },
];

// ============================================
// 유틸리티 함수
// ============================================

export const getHintById = (id: string): Hint | undefined => {
  return hints.find((h) => h.id === id);
};

export const getHintsByCategory = (category: string): Hint[] => {
  return hints.filter((h) => h.category === category);
};

export const getHelpTopicById = (id: string): HelpTopic | undefined => {
  return helpTopics.find((t) => t.id === id);
};

export const getHelpTopicsByCategory = (category: string): HelpTopic[] => {
  return helpTopics.filter((t) => t.category === category);
};

export const searchHelpTopics = (query: string): HelpTopic[] => {
  const lowerQuery = query.toLowerCase();
  return helpTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(lowerQuery) ||
      t.summary.toLowerCase().includes(lowerQuery) ||
      t.keywords.some((k) => k.toLowerCase().includes(lowerQuery)),
  );
};

export const getFeatureDiscoveryById = (id: string): FeatureDiscovery | undefined => {
  return featureDiscoveries.find((f) => f.featureId === id);
};
