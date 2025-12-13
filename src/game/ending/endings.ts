/**
 * Chapter 11: Ending & Victory - Endings Data
 * 엔딩 데이터 정의
 */

import { Ending, GameOverReason, VictoryCondition } from './types';

// ============================================
// 승리 엔딩
// ============================================

export const victoryEndings: Ending[] = [
  // 프리미엄 사용자 승리
  {
    id: 'premium_milestone',
    type: 'victory',
    tier: 'great',
    name: '구독자의 왕',
    title: '🎉 구독자 1,000명 달성!',
    subtitle: '당신의 서비스가 사랑받고 있습니다',
    description: '프리미엄 구독자 1,000명을 달성하며 지속 가능한 비즈니스를 구축했습니다.',
    narrative: `당신은 해냈습니다.

작은 아이디어로 시작한 VocaVision이 이제 1,000명의 유료 구독자를 보유한
진정한 비즈니스가 되었습니다.

매일 수천 명의 사람들이 당신이 만든 앱으로 영어를 공부하고 있습니다.
리뷰에는 감사의 메시지가 가득하고, 사용자들은 당신의 앱 덕분에
영어 실력이 늘었다고 말합니다.

이것은 끝이 아닙니다. 이제 시작입니다.
더 많은 사람들을 도울 수 있는 기회가 당신 앞에 펼쳐져 있습니다.`,
    requirements: {
      conditions: [
        { type: 'metric', target: 'business.users.premium', operator: '>=', value: 1000 },
      ],
      logic: 'and',
    },
    priority: 80,
    rewards: [
      { type: 'legacy_points', value: 500 },
      { type: 'title', value: '구독자의 왕' },
      { type: 'achievement', value: 'premium_milestone' },
      { type: 'mastery_xp', value: 200 },
    ],
    unlocksContent: ['new_game_plus', 'sandbox_mode'],
    unlocksAchievement: 'first_victory',
    icon: '👑',
    color: '#FFD700',
    rarity: 0.15,
    averageDay: 180,
  },

  // 재정 승리
  {
    id: 'financial_freedom',
    type: 'victory',
    tier: 'epic',
    name: '억만장자',
    title: '💰 1억원 달성!',
    subtitle: '재정적 자유를 얻었습니다',
    description: '1억원의 현금을 보유하며 재정적 자유를 달성했습니다.',
    narrative: `계좌 잔고를 확인합니다. 100,000,000원.

불과 몇 달 전만 해도 서버 비용 걱정에 잠을 설치던 당신이
이제 1억원의 현금을 보유한 성공한 창업자가 되었습니다.

돈이 전부는 아닙니다. 하지만 이 자금은 당신에게 자유를 줍니다.
더 큰 도전을 할 자유, 실패해도 다시 일어설 수 있는 여유,
그리고 더 많은 사람들을 도울 수 있는 능력.

VocaVision의 다음 장은 어떤 모습일까요?`,
    requirements: {
      conditions: [
        { type: 'metric', target: 'business.finance.cash', operator: '>=', value: 100000000 },
      ],
      logic: 'and',
    },
    priority: 85,
    rewards: [
      { type: 'legacy_points', value: 700 },
      { type: 'title', value: '억만장자' },
      { type: 'achievement', value: 'financial_freedom' },
      { type: 'cosmetic', value: 'gold_theme' },
      { type: 'mastery_xp', value: 300 },
    ],
    unlocksContent: ['sandbox_unlimited_cash'],
    icon: '💰',
    color: '#4CAF50',
    rarity: 0.08,
    averageDay: 250,
  },

  // 인수 승리
  {
    id: 'acquisition',
    type: 'victory',
    tier: 'legendary',
    name: '성공적 엑싯',
    title: '🏆 인수 제안!',
    subtitle: '대기업이 당신의 회사를 원합니다',
    description: '성공적인 비즈니스를 구축하여 대기업으로부터 인수 제안을 받았습니다.',
    narrative: `예상치 못한 이메일이 도착합니다.

"VocaVision의 창업자님께,

저희 EduTech Korea에서 귀사의 성장과 혁신적인 서비스에
깊은 인상을 받았습니다.

귀사 인수에 관심이 있으며, 조건에 대해 논의하고 싶습니다.
인수 금액으로 50억원을 제안드립니다..."

1년 전, 작은 방에서 홀로 코딩하던 당신.
이제 대기업이 당신의 회사를 원합니다.

수락하면 50억원과 함께 EduTech Korea의 일원이 됩니다.
거절하면 독립적인 성장을 계속할 수 있습니다.

어떤 선택을 하시겠습니까?`,
    epilogue: {
      scenes: [
        {
          id: 'acquisition_choice',
          title: '결정의 순간',
          content: '대기업의 인수 제안. 어떻게 하시겠습니까?',
          choices: [
            {
              text: '인수 제안을 수락한다',
              nextScene: 'acquisition_accept',
              effect: { type: 'cash', value: 5000000000 },
            },
            {
              text: '독립을 유지한다',
              nextScene: 'acquisition_reject',
            },
          ],
        },
        {
          id: 'acquisition_accept',
          title: '새로운 시작',
          content: `계약서에 서명합니다.

VocaVision은 이제 EduTech Korea의 일부가 되었습니다.
당신은 50억원과 함께 Chief Product Officer 직함을 받습니다.

더 큰 자원과 함께 더 많은 학습자들을 도울 수 있게 되었습니다.
혼자서는 불가능했던 글로벌 진출도 이제 현실이 될 것입니다.

이것은 끝이 아닙니다. 새로운 시작입니다.`,
        },
        {
          id: 'acquisition_reject',
          title: '독립의 길',
          content: `정중히 거절 의사를 밝힙니다.

"감사합니다만, VocaVision은 아직 제가 이루고 싶은 것들이 많습니다.
더 성장한 후에 다시 이야기 나눌 기회가 있기를 바랍니다."

독립을 선택했습니다. 쉽지 않은 길이 될 것입니다.
하지만 당신의 비전을 온전히 실현할 수 있습니다.

VocaVision의 이야기는 계속됩니다.`,
        },
      ],
    },
    requirements: {
      conditions: [
        { type: 'time', target: 'time.totalDays', operator: '>=', value: 365 },
        { type: 'metric', target: 'business.users.premium', operator: '>=', value: 500 },
        { type: 'stat', target: 'player.social.reputation', operator: '>=', value: 80 },
        { type: 'metric', target: 'business.finance.cash', operator: '>=', value: 50000000 },
      ],
      logic: 'and',
    },
    priority: 95,
    rewards: [
      { type: 'legacy_points', value: 1000 },
      { type: 'title', value: '성공한 창업자' },
      { type: 'achievement', value: 'successful_exit' },
      { type: 'cosmetic', value: 'legendary_frame' },
      { type: 'mastery_xp', value: 500 },
    ],
    unlocksContent: ['dev_commentary', 'art_gallery'],
    unlocksEnding: ['true_ending'],
    icon: '🏆',
    color: '#9C27B0',
    rarity: 0.05,
    averageDay: 400,
  },

  // 라이프스타일 비즈니스
  {
    id: 'lifestyle_business',
    type: 'victory',
    tier: 'good',
    name: '라이프스타일 비즈니스',
    title: '🏖️ 워라밸 달성!',
    subtitle: '일과 삶의 균형을 찾았습니다',
    description: '안정적인 수익과 함께 건강한 워라밸을 유지하는 비즈니스를 구축했습니다.',
    narrative: `어느 날 문득 깨달았습니다.

지금 충분히 행복하다는 것을.

월 500만원의 안정적인 수익, 스트레스 없는 일상,
좋아하는 일을 하며 살 수 있는 자유.

유니콘이 되지 않아도 괜찮습니다.
수십억 엑싯을 하지 않아도 괜찮습니다.

당신은 당신만의 성공을 정의했습니다.
그리고 그것을 달성했습니다.

이것이 진정한 성공 아닐까요?`,
    requirements: {
      conditions: [
        { type: 'time', target: 'time.totalDays', operator: '>=', value: 365 },
        { type: 'metric', target: 'business.finance.monthlyRevenue', operator: '>=', value: 5000000 },
        { type: 'stat', target: 'player.personal.workLifeBalance', operator: '>=', value: 80 },
        { type: 'stat', target: 'player.health.stress', operator: '<=', value: 30 },
      ],
      logic: 'and',
    },
    priority: 70,
    rewards: [
      { type: 'legacy_points', value: 400 },
      { type: 'title', value: '워라밸 마스터' },
      { type: 'achievement', value: 'lifestyle_business' },
      { type: 'mastery_xp', value: 150 },
    ],
    icon: '🏖️',
    color: '#03A9F4',
    rarity: 0.12,
    averageDay: 400,
  },
];

// ============================================
// 특별 엔딩
// ============================================

export const specialEndings: Ending[] = [
  // 부트스트랩 성공
  {
    id: 'bootstrap_king',
    type: 'special',
    tier: 'epic',
    name: '부트스트랩 왕',
    title: '💪 자력 성공!',
    subtitle: '외부 투자 없이 성공했습니다',
    description: '투자 한 푼 받지 않고 순수 자력으로 성공적인 비즈니스를 구축했습니다.',
    narrative: `투자자들은 당신을 비웃었습니다.
"투자 없이는 불가능해요."

하지만 당신은 해냈습니다.

고객의 돈으로만, 순수한 자력으로 여기까지 왔습니다.
지분 희석 없이, 이사회의 간섭 없이,
오직 당신의 비전대로 회사를 성장시켰습니다.

이것이 진정한 독립입니다.`,
    requirements: {
      conditions: [
        { type: 'metric', target: 'business.users.premium', operator: '>=', value: 500 },
        { type: 'metric', target: 'business.finance.cash', operator: '>=', value: 30000000 },
        { type: 'event', target: 'took_investment', operator: '==', value: false },
      ],
      logic: 'and',
    },
    priority: 90,
    rewards: [
      { type: 'legacy_points', value: 800 },
      { type: 'title', value: '부트스트랩 왕' },
      { type: 'achievement', value: 'bootstrap_success' },
      { type: 'cosmetic', value: 'bootstrap_badge' },
    ],
    icon: '💪',
    color: '#FF5722',
    rarity: 0.03,
  },

  // 바이럴 성공
  {
    id: 'viral_sensation',
    type: 'special',
    tier: 'epic',
    name: '바이럴 센세이션',
    title: '🚀 폭발적 성장!',
    subtitle: '입소문만으로 급성장했습니다',
    description: '마케팅 비용 없이 바이럴로만 폭발적인 성장을 이루었습니다.',
    narrative: `어느 날 갑자기 일어났습니다.

서버가 터질 것 같은 트래픽.
앱스토어 순위 급상승.
SNS에 넘쳐나는 VocaVision 언급.

유명 인플루언서가 우연히 당신의 앱을 소개한 것이 시작이었습니다.
그리고 불처럼 퍼져나갔습니다.

광고비 한 푼 안 쓰고 이 성장을 만들어냈다는 게 믿기지 않습니다.
이것이 제품의 힘입니다.`,
    requirements: {
      conditions: [
        { type: 'metric', target: 'business.users.total', operator: '>=', value: 50000 },
        { type: 'metric', target: 'marketing_spend', operator: '<=', value: 1000000 },
        { type: 'event', target: 'viral_event', operator: '>=', value: 3 },
      ],
      logic: 'and',
    },
    priority: 85,
    rewards: [
      { type: 'legacy_points', value: 600 },
      { type: 'title', value: '바이럴 마스터' },
      { type: 'achievement', value: 'viral_success' },
    ],
    icon: '🚀',
    color: '#E91E63',
    rarity: 0.04,
  },

  // 기술 혁신
  {
    id: 'tech_innovator',
    type: 'special',
    tier: 'great',
    name: '기술 혁신가',
    title: '🔬 기술의 선구자!',
    subtitle: '혁신적인 기술로 시장을 이끌었습니다',
    description: '최고 수준의 기술력으로 업계를 선도하는 제품을 만들었습니다.',
    narrative: `경쟁사들이 당신의 기술을 따라하려 합니다.
하지만 항상 한 발 앞서 있습니다.

AI 기반 맞춤 학습 알고리즘.
음성 인식 발음 교정.
적응형 난이도 시스템.

이 모든 것을 혼자서 만들어냈습니다.
당신은 단순한 창업자가 아닙니다.
진정한 기술 혁신가입니다.`,
    requirements: {
      conditions: [
        { type: 'stat', target: 'player.skills.coding', operator: '>=', value: 90 },
        { type: 'metric', target: 'business.product.codeQuality', operator: '>=', value: 90 },
        { type: 'metric', target: 'business.product.technicalDebt', operator: '<=', value: 20 },
      ],
      logic: 'and',
    },
    priority: 75,
    rewards: [
      { type: 'legacy_points', value: 500 },
      { type: 'title', value: '기술 혁신가' },
      { type: 'achievement', value: 'tech_master' },
      { type: 'mastery_xp', value: 300 },
    ],
    icon: '🔬',
    color: '#2196F3',
    rarity: 0.06,
  },

  // 인맥왕
  {
    id: 'networking_master',
    type: 'special',
    tier: 'good',
    name: '인맥의 제왕',
    title: '🤝 네트워킹 마스터!',
    subtitle: '강력한 네트워크를 구축했습니다',
    description: '업계 최고의 인맥을 구축하여 성공의 기반을 다졌습니다.',
    narrative: `당신의 연락처에는 업계의 거물들이 즐비합니다.

멘토, 투자자, 파트너, 동료 창업자...
그들 모두 당신을 신뢰하고 존경합니다.

비즈니스는 결국 사람입니다.
당신은 그 진리를 증명했습니다.`,
    requirements: {
      conditions: [
        { type: 'stat', target: 'relationships.contacts.length', operator: '>=', value: 20 },
        { type: 'metric', target: 'max_relationship_count', operator: '>=', value: 10 },
        { type: 'stat', target: 'player.social.reputation', operator: '>=', value: 85 },
      ],
      logic: 'and',
    },
    priority: 70,
    rewards: [
      { type: 'legacy_points', value: 400 },
      { type: 'title', value: '인맥의 제왕' },
      { type: 'achievement', value: 'social_butterfly' },
    ],
    icon: '🤝',
    color: '#9C27B0',
    rarity: 0.08,
  },
];

// ============================================
// 비밀 엔딩
// ============================================

export const secretEndings: Ending[] = [
  // 진정한 엔딩
  {
    id: 'true_ending',
    type: 'secret',
    tier: 'legendary',
    name: '진정한 엔딩',
    title: '✨ The True Ending',
    subtitle: '모든 것을 이루었습니다',
    description: '모든 조건을 완벽하게 달성하여 진정한 엔딩에 도달했습니다.',
    narrative: `당신은 모든 것을 해냈습니다.

성공적인 비즈니스.
만족스러운 삶.
의미 있는 관계.
기술적 탁월함.

VocaVision은 단순한 앱을 넘어
수많은 사람들의 삶을 변화시켰습니다.

그리고 그 과정에서 당신 자신도 성장했습니다.
더 나은 개발자, 더 나은 사업가, 더 나은 사람이 되었습니다.

이것이 진정한 성공입니다.

감사합니다. 함께해주셔서.`,
    requirements: {
      conditions: [
        { type: 'achievement', target: 'all_regular_endings', operator: '==', value: true },
        { type: 'metric', target: 'business.users.premium', operator: '>=', value: 1000 },
        { type: 'stat', target: 'player.personal.workLifeBalance', operator: '>=', value: 70 },
        { type: 'stat', target: 'player.social.reputation', operator: '>=', value: 90 },
      ],
      logic: 'and',
    },
    priority: 100,
    rewards: [
      { type: 'legacy_points', value: 2000 },
      { type: 'title', value: '전설의 창업자' },
      { type: 'achievement', value: 'true_ending' },
      { type: 'cosmetic', value: 'legendary_theme' },
    ],
    unlocksContent: ['secret_content', 'developer_room'],
    icon: '✨',
    color: '#FFD700',
    rarity: 0.01,
  },

  // 숨겨진 엔딩: 밤새기의 달인
  {
    id: 'night_owl',
    type: 'secret',
    tier: 'good',
    name: '밤새기의 달인',
    title: '🦉 올빼미 창업자',
    subtitle: '밤은 당신의 시간입니다',
    description: '주로 밤 시간에 플레이하여 발견한 비밀 엔딩.',
    narrative: `새벽 4시의 고요함.
모니터 빛만이 방을 밝히고 있습니다.

밤은 창업자의 친구입니다.
방해받지 않고 집중할 수 있는 시간.
아이디어가 샘솟는 시간.

당신의 가장 좋은 코드는 모두 밤에 작성되었습니다.`,
    requirements: {
      conditions: [
        { type: 'stat', target: 'night_play_count', operator: '>=', value: 50 },
      ],
      logic: 'and',
    },
    priority: 50,
    rewards: [
      { type: 'legacy_points', value: 200 },
      { type: 'title', value: '올빼미' },
      { type: 'cosmetic', value: 'night_theme' },
    ],
    icon: '🦉',
    color: '#3F51B5',
    rarity: 0.1,
  },
];

// ============================================
// 게임 오버 이유
// ============================================

export const gameOverReasons: GameOverReason[] = [
  {
    id: 'bankruptcy',
    name: '파산',
    description: '자금이 -100만원 이하로 떨어졌습니다.',
    icon: '💸',
    narrative: `계좌 잔고: -1,234,567원

더 이상 버틸 수 없습니다.
서버비도, 도메인 비용도 낼 수 없습니다.

VocaVision은 조용히 문을 닫았습니다.

하지만 이것이 끝은 아닙니다.
실패에서 배운 교훈을 가지고 다시 시작할 수 있습니다.`,
    tips: [
      '비용을 줄이고 런웨이를 관리하세요',
      '수익 모델을 다각화하세요',
      '위험한 투자는 신중하게 결정하세요',
    ],
    relatedTutorial: 'business_tutorial',
  },
  {
    id: 'burnout',
    name: '번아웃',
    description: '극심한 스트레스로 더 이상 일할 수 없게 되었습니다.',
    icon: '😴',
    narrative: `몸이 더 이상 말을 듣지 않습니다.

끝없이 일만 하던 당신은 결국 무너졌습니다.
의사는 최소 6개월의 휴식을 권고했습니다.

VocaVision은 운영자 없이 서서히 쇠퇴했습니다.

건강은 가장 중요한 자산입니다.
다음에는 자신을 더 돌보세요.`,
    tips: [
      '정기적으로 휴식을 취하세요',
      '스트레스 관리에 신경 쓰세요',
      '완벽주의를 내려놓으세요',
    ],
    relatedTutorial: 'basic_tutorial',
  },
  {
    id: 'reputation_collapse',
    name: '평판 붕괴',
    description: '평판이 바닥으로 떨어져 회복 불가능해졌습니다.',
    icon: '😢',
    narrative: `앱스토어 평점: ★☆☆☆☆ (1.2)

"쓰레기 앱입니다. 다운받지 마세요."
"돈만 빼가고 제대로 작동도 안 해요."
"최악의 학습 앱, 시간 낭비입니다."

부정적인 리뷰가 넘쳐나고 있습니다.
더 이상 새로운 사용자는 오지 않습니다.

평판은 한 번 무너지면 복구하기 어렵습니다.`,
    tips: [
      '사용자 피드백에 귀 기울이세요',
      '품질 관리를 소홀히 하지 마세요',
      '위기 상황에서 투명하게 소통하세요',
    ],
    relatedTutorial: 'marketing_tutorial',
  },
  {
    id: 'server_crash',
    name: '서버 다운',
    description: '서버가 완전히 다운되어 복구 불가능 상태가 되었습니다.',
    icon: '💥',
    narrative: `ERROR 503: Service Unavailable

서버가 완전히 다운되었습니다.
데이터베이스 손상, 백업 없음.
모든 사용자 데이터가 사라졌습니다.

사용자들은 분노했고,
VocaVision은 역사 속으로 사라졌습니다.`,
    tips: [
      '서버 건강도를 주시하세요',
      '정기적으로 백업하세요',
      '인프라에 투자하세요',
    ],
    relatedTutorial: 'development_tutorial',
  },
  {
    id: 'user_exodus',
    name: '사용자 이탈',
    description: '모든 사용자가 떠났습니다.',
    icon: '👥',
    narrative: `활성 사용자: 0명

마지막 사용자도 떠났습니다.
앱은 텅 빈 채 서버만 돌아가고 있습니다.

사용자 없는 서비스는
존재 의미가 없습니다.`,
    tips: [
      '사용자 리텐션에 신경 쓰세요',
      '정기적인 업데이트로 사용자를 유지하세요',
      '사용자와 소통하세요',
    ],
  },
];

// ============================================
// 승리 조건
// ============================================

export const victoryConditions: VictoryCondition[] = [
  {
    id: 'premium_users',
    name: '프리미엄 사용자 목표',
    description: '프리미엄 구독자 1,000명 달성',
    requirements: [
      { type: 'metric', target: 'business.users.premium', operator: '>=', value: 1000 },
    ],
    checkFrequency: 'day',
    rewards: [{ type: 'legacy_points', value: 500 }],
    unlocksEnding: 'premium_milestone',
  },
  {
    id: 'financial_goal',
    name: '재정 목표',
    description: '현금 1억원 달성',
    requirements: [
      { type: 'metric', target: 'business.finance.cash', operator: '>=', value: 100000000 },
    ],
    checkFrequency: 'day',
    rewards: [{ type: 'legacy_points', value: 700 }],
    unlocksEnding: 'financial_freedom',
  },
  {
    id: 'acquisition_ready',
    name: '인수 조건',
    description: '대기업 인수 조건 충족',
    requirements: [
      { type: 'time', target: 'time.totalDays', operator: '>=', value: 365 },
      { type: 'metric', target: 'business.users.premium', operator: '>=', value: 500 },
      { type: 'stat', target: 'player.social.reputation', operator: '>=', value: 80 },
      { type: 'metric', target: 'business.finance.cash', operator: '>=', value: 50000000 },
    ],
    checkFrequency: 'day',
    rewards: [{ type: 'legacy_points', value: 1000 }],
    unlocksEnding: 'acquisition',
  },
];

// ============================================
// 엔딩 모음
// ============================================

export const allEndings: Ending[] = [
  ...victoryEndings,
  ...specialEndings,
  ...secretEndings,
];

export const getEndingById = (id: string): Ending | undefined => {
  return allEndings.find((e) => e.id === id);
};

export const getEndingsByType = (type: string): Ending[] => {
  return allEndings.filter((e) => e.type === type);
};

export const getEndingsByTier = (tier: string): Ending[] => {
  return allEndings.filter((e) => e.tier === tier);
};

export const getGameOverReasonById = (id: string): GameOverReason | undefined => {
  return gameOverReasons.find((r) => r.id === id);
};
