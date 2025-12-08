/**
 * Chapter 3: Content & Narrative - Story Arc System
 * 장기 스토리라인과 분기 시스템
 */

import type { GameState, Effect } from '../types';

// ============================================
// 스토리 아크 타입 정의
// ============================================

export interface StoryArc {
  id: string;
  title: string;
  description: string;
  icon: string;
  chapters: StoryChapter[];
  unlockCondition: (state: GameState) => boolean;
  completionRewards: Effect[];
  branches?: StoryBranch[];
}

export interface StoryChapter {
  id: string;
  title: string;
  description: string;
  trigger: ChapterTrigger;
  events: StoryEvent[];
  nextChapterId?: string;
  branchPoint?: boolean; // 분기 지점 여부
}

export interface ChapterTrigger {
  type: 'day' | 'users' | 'revenue' | 'reputation' | 'event' | 'npc_relationship';
  value: number | string;
  comparison?: 'gte' | 'lte' | 'eq';
}

export interface StoryEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  choices: StoryChoice[];
  consequences: string[]; // 나중에 영향을 미치는 결정들
}

export interface StoryChoice {
  id: string;
  text: string;
  effects: Effect[];
  resultText: string;
  nextChapterId?: string; // 분기 시 다른 챕터로
  setFlag?: string; // 스토리 플래그 설정
  requiresFlag?: string; // 특정 플래그 필요
}

export interface StoryBranch {
  id: string;
  name: string;
  description: string;
  entryChapterId: string;
  condition: (state: GameState, flags: Set<string>) => boolean;
}

// ============================================
// 스토리 아크 데이터
// ============================================

export const STORY_ARCS: StoryArc[] = [
  // ============================================
  // 1. 투자 유치 여정 (Funding Journey)
  // ============================================
  {
    id: 'funding_journey',
    title: '투자 유치 여정',
    description: '부트스트래핑에서 투자 유치까지, 자금 조달의 기로에 선 이야기',
    icon: '💰',
    unlockCondition: (state) => state.business.users.total > 500 && state.time.totalDays > 60,
    completionRewards: [
      { type: 'skill_business', value: 10 },
      { type: 'reputation', value: 20 },
    ],
    chapters: [
      {
        id: 'funding_ch1',
        title: '첫 번째 갈림길',
        description: '런웨이가 줄어들면서 중요한 결정을 해야 할 때가 왔습니다.',
        trigger: { type: 'day', value: 90, comparison: 'gte' },
        events: [
          {
            id: 'funding_ch1_e1',
            title: '자금 고갈 경고',
            description: '통장 잔고를 보며 한숨이 나옵니다. 이대로 가면 3개월 후면 운영이 어려워집니다. 어떻게 해야 할까요?',
            icon: '⚠️',
            choices: [
              {
                id: 'seek_investment',
                text: '투자 유치를 시작한다',
                effects: [
                  { type: 'stress', value: 20 },
                  { type: 'skill_business', value: 3 },
                ],
                resultText: '투자자들을 만나기 시작했습니다. 피칭 준비가 필요합니다.',
                nextChapterId: 'funding_ch2_invest',
                setFlag: 'chose_investment',
              },
              {
                id: 'bootstrap',
                text: '부트스트래핑을 고수한다',
                effects: [
                  { type: 'stress', value: 10 },
                  { type: 'mental', value: 5 },
                ],
                resultText: '자립의 길을 선택했습니다. 더 빠른 수익화가 필요합니다.',
                nextChapterId: 'funding_ch2_bootstrap',
                setFlag: 'chose_bootstrap',
              },
              {
                id: 'part_time',
                text: '파트타임 일을 병행한다',
                effects: [
                  { type: 'cash', value: 2000000 },
                  { type: 'energy', value: -30 },
                ],
                resultText: '프리랜서 일을 시작했습니다. 힘들지만 자금은 확보됩니다.',
                nextChapterId: 'funding_ch2_hybrid',
                setFlag: 'chose_hybrid',
              },
            ],
            consequences: ['이 선택은 향후 성장 전략에 큰 영향을 미칩니다.'],
          },
        ],
        branchPoint: true,
      },
      // 투자 유치 분기
      {
        id: 'funding_ch2_invest',
        title: '투자자 탐색',
        description: '본격적인 투자 유치가 시작됩니다.',
        trigger: { type: 'event', value: 'funding_ch1_e1' },
        events: [
          {
            id: 'funding_ch2_invest_e1',
            title: '첫 피칭',
            description: '처음으로 진지한 투자자 미팅이 잡혔습니다. 긴장되지만 잘 준비해야 합니다.',
            icon: '🎤',
            choices: [
              {
                id: 'thorough_prep',
                text: '철저히 준비한다 (-30 에너지)',
                effects: [
                  { type: 'energy', value: -30 },
                  { type: 'skill_business', value: 5 },
                ],
                resultText: '밤새 자료를 다듬었습니다. 질문에 대한 답변도 준비했습니다.',
                setFlag: 'pitch_prepared',
              },
              {
                id: 'wing_it',
                text: '실력으로 승부한다',
                effects: [
                  { type: 'stress', value: 10 },
                ],
                resultText: '자신감을 가지고 미팅에 임합니다.',
              },
            ],
            consequences: ['준비 수준이 피칭 결과에 영향을 미칩니다.'],
          },
          {
            id: 'funding_ch2_invest_e2',
            title: '피칭 결과',
            description: '피칭이 끝났습니다. 투자자의 반응은...',
            icon: '📊',
            choices: [
              {
                id: 'positive_response',
                text: '(준비를 잘 했다면) 긍정적 반응을 얻었다',
                effects: [
                  { type: 'mental', value: 20 },
                  { type: 'reputation', value: 10 },
                ],
                resultText: '"흥미롭네요. 팀이 있으면 더 좋았겠지만..." 후속 미팅 제안을 받았습니다!',
                requiresFlag: 'pitch_prepared',
                nextChapterId: 'funding_ch3_negotiation',
              },
              {
                id: 'rejection',
                text: '거절당했다',
                effects: [
                  { type: 'mental', value: -15 },
                  { type: 'skill_business', value: 2 },
                ],
                resultText: '"트랙션이 더 필요해요." 아쉽지만 배운 것이 있습니다.',
                nextChapterId: 'funding_ch2_invest_retry',
              },
            ],
            consequences: [],
          },
        ],
      },
      // 부트스트랩 분기
      {
        id: 'funding_ch2_bootstrap',
        title: '자립의 길',
        description: '투자 없이 스스로 성장하는 길을 선택했습니다.',
        trigger: { type: 'event', value: 'funding_ch1_e1' },
        events: [
          {
            id: 'funding_ch2_bootstrap_e1',
            title: '비용 절감',
            description: '모든 지출을 재검토해야 합니다. 어디를 줄일 수 있을까요?',
            icon: '✂️',
            choices: [
              {
                id: 'cut_infra',
                text: '인프라 비용 최소화',
                effects: [
                  { type: 'cash', value: 200000 },
                  { type: 'stability', value: -10 },
                ],
                resultText: '무료 티어로 다운그레이드. 안정성이 약간 걱정됩니다.',
              },
              {
                id: 'cut_marketing',
                text: '마케팅 비용 중단',
                effects: [
                  { type: 'cash', value: 300000 },
                  { type: 'users', value: -20 },
                ],
                resultText: '유료 광고를 모두 중단했습니다. 자연 유입에 의존합니다.',
              },
              {
                id: 'optimize_all',
                text: '전방위 최적화 (-40 에너지)',
                effects: [
                  { type: 'energy', value: -40 },
                  { type: 'cash', value: 400000 },
                  { type: 'skill_coding', value: 3 },
                ],
                resultText: '모든 것을 최적화했습니다. 힘들었지만 효과적입니다!',
                setFlag: 'bootstrap_optimized',
              },
            ],
            consequences: ['비용 절감 전략이 향후 성장에 영향을 미칩니다.'],
          },
          {
            id: 'funding_ch2_bootstrap_e2',
            title: '수익화 가속',
            description: '더 빨리 돈을 벌어야 합니다. 어떤 전략을 선택하시겠습니까?',
            icon: '💵',
            choices: [
              {
                id: 'premium_push',
                text: '프리미엄 전환 캠페인',
                effects: [
                  { type: 'premium_users', value: 20 },
                  { type: 'reputation', value: -5 },
                ],
                resultText: '적극적인 프로모션으로 전환율이 올랐지만 일부가 불편해합니다.',
              },
              {
                id: 'new_tier',
                text: '새로운 가격 티어 추가',
                effects: [
                  { type: 'energy', value: -25 },
                  { type: 'premium_users', value: 15 },
                  { type: 'cash', value: 500000 },
                ],
                resultText: '연간 구독과 팀 플랜을 추가했습니다!',
                setFlag: 'new_pricing',
              },
              {
                id: 'lifetime',
                text: '평생 구독 한정 판매',
                effects: [
                  { type: 'cash', value: 3000000 },
                ],
                resultText: '대박! 열정적인 사용자들이 평생 구독을 구매했습니다!',
              },
            ],
            consequences: [],
          },
        ],
        nextChapterId: 'funding_ch3_sustainable',
      },
      // 하이브리드 분기
      {
        id: 'funding_ch2_hybrid',
        title: '두 마리 토끼',
        description: '파트타임 일과 스타트업을 병행합니다.',
        trigger: { type: 'event', value: 'funding_ch1_e1' },
        events: [
          {
            id: 'funding_ch2_hybrid_e1',
            title: '균형의 어려움',
            description: '프리랜서 일과 VocaVision 개발 사이에서 시간이 부족합니다.',
            icon: '⚖️',
            choices: [
              {
                id: 'focus_freelance',
                text: '프리랜서 일에 집중 (당장의 수입)',
                effects: [
                  { type: 'cash', value: 3000000 },
                  { type: 'stability', value: -15 },
                  { type: 'users', value: -30 },
                ],
                resultText: '돈은 벌었지만 VocaVision이 정체됩니다.',
              },
              {
                id: 'focus_product',
                text: 'VocaVision에 집중 (장기적 성장)',
                effects: [
                  { type: 'cash', value: 1000000 },
                  { type: 'users', value: 50 },
                  { type: 'stress', value: 15 },
                ],
                resultText: '프리랜서 일을 줄이고 제품에 집중합니다.',
                setFlag: 'hybrid_focus_product',
              },
              {
                id: 'balance',
                text: '균형을 유지한다 (-20 에너지)',
                effects: [
                  { type: 'energy', value: -20 },
                  { type: 'cash', value: 2000000 },
                  { type: 'users', value: 20 },
                ],
                resultText: '힘들지만 양쪽 모두 관리합니다.',
              },
            ],
            consequences: ['이 경험이 시간 관리 능력을 키워줍니다.'],
          },
        ],
        nextChapterId: 'funding_ch3_decision',
      },
      // 최종 챕터들
      {
        id: 'funding_ch3_negotiation',
        title: '투자 협상',
        description: '본격적인 투자 협상이 시작됩니다.',
        trigger: { type: 'event', value: 'funding_ch2_invest_e2' },
        events: [
          {
            id: 'funding_ch3_neg_e1',
            title: '텀시트 검토',
            description: '투자 조건서가 도착했습니다. Pre-money 밸류에이션 5억, 1억 투자에 지분 16.7%.',
            icon: '📄',
            choices: [
              {
                id: 'accept_terms',
                text: '조건 수락',
                effects: [
                  { type: 'cash', value: 100000000 },
                  { type: 'stress', value: -30 },
                  { type: 'reputation', value: 25 },
                ],
                resultText: '투자 유치 성공! 새로운 챕터가 시작됩니다.',
                setFlag: 'got_investment',
              },
              {
                id: 'negotiate',
                text: '협상을 시도한다',
                effects: [
                  { type: 'skill_business', value: 5 },
                  { type: 'stress', value: 15 },
                ],
                resultText: '협상 끝에 15%로 조정! 적은 희석으로 같은 금액을 확보했습니다.',
                setFlag: 'negotiated_terms',
              },
              {
                id: 'walk_away',
                text: '거절한다',
                effects: [
                  { type: 'reputation', value: 5 },
                ],
                resultText: '독립을 선택했습니다. 다른 길을 찾아야 합니다.',
                nextChapterId: 'funding_ch2_bootstrap',
              },
            ],
            consequences: ['이 결정이 회사의 미래 구조를 결정합니다.'],
          },
        ],
      },
      {
        id: 'funding_ch3_sustainable',
        title: '지속가능한 성장',
        description: '자립 경영의 결실을 맺을 때가 왔습니다.',
        trigger: { type: 'revenue', value: 5000000, comparison: 'gte' },
        events: [
          {
            id: 'funding_ch3_sus_e1',
            title: '수익성 달성',
            description: '드디어 MRR이 월 고정 비용을 넘어섰습니다! 프리미엄 없이 성장하고 있습니다.',
            icon: '🎉',
            choices: [
              {
                id: 'celebrate',
                text: '축하하며 계속 성장한다',
                effects: [
                  { type: 'mental', value: 30 },
                  { type: 'reputation', value: 15 },
                ],
                resultText: '부트스트랩의 승리! 많은 창업가들에게 영감을 줍니다.',
                setFlag: 'profitable_bootstrap',
              },
              {
                id: 'reconsider_investment',
                text: '이제 투자를 받을까?',
                effects: [
                  { type: 'skill_business', value: 3 },
                ],
                resultText: '더 좋은 조건으로 투자를 받을 수 있는 위치가 되었습니다.',
                nextChapterId: 'funding_ch3_negotiation',
              },
            ],
            consequences: [],
          },
        ],
      },
    ],
    branches: [
      {
        id: 'investment_path',
        name: '투자 유치',
        description: '외부 자본을 유치하여 빠르게 성장',
        entryChapterId: 'funding_ch2_invest',
        condition: (_, flags) => flags.has('chose_investment'),
      },
      {
        id: 'bootstrap_path',
        name: '부트스트래핑',
        description: '자립적으로 천천히 성장',
        entryChapterId: 'funding_ch2_bootstrap',
        condition: (_, flags) => flags.has('chose_bootstrap'),
      },
    ],
  },

  // ============================================
  // 2. 첫 번째 위기 (First Crisis)
  // ============================================
  {
    id: 'first_crisis',
    title: '첫 번째 위기',
    description: '예상치 못한 위기가 찾아왔습니다. 어떻게 극복할 것인가?',
    icon: '⚡',
    unlockCondition: (state) => state.business.users.total > 1000 && state.time.totalDays > 120,
    completionRewards: [
      { type: 'skill_business', value: 8 },
      { type: 'mental', value: 20 },
    ],
    chapters: [
      {
        id: 'crisis_ch1',
        title: '폭풍 전야',
        description: '모든 것이 순조로워 보이지만...',
        trigger: { type: 'users', value: 1500, comparison: 'gte' },
        events: [
          {
            id: 'crisis_ch1_e1',
            title: '갑작스러운 장애',
            description: '금요일 저녁, 서버가 완전히 다운되었습니다. 모든 사용자가 접속 불가 상태입니다!',
            icon: '🔥',
            choices: [
              {
                id: 'all_night',
                text: '밤새 복구 작업 (-50 에너지)',
                effects: [
                  { type: 'energy', value: -50 },
                  { type: 'stress', value: 30 },
                  { type: 'stability', value: 30 },
                ],
                resultText: '6시간의 사투 끝에 복구! 하지만 녹초가 되었습니다.',
                setFlag: 'crisis_heroic_effort',
              },
              {
                id: 'call_help',
                text: '외부 전문가에게 SOS (-1,000,000원)',
                effects: [
                  { type: 'cash', value: -1000000 },
                  { type: 'stability', value: 40 },
                  { type: 'skill_coding', value: 3 },
                ],
                resultText: '전문가가 빠르게 문제를 해결하고 원인까지 분석해줬습니다.',
                setFlag: 'crisis_expert_help',
              },
              {
                id: 'transparent',
                text: '사용자에게 상황 공유 후 차분히 해결',
                effects: [
                  { type: 'reputation', value: 10 },
                  { type: 'stability', value: 20 },
                  { type: 'users', value: -30 },
                ],
                resultText: '투명한 소통에 대부분 이해해줬지만 일부는 떠났습니다.',
                setFlag: 'crisis_transparent',
              },
            ],
            consequences: ['이 위기를 어떻게 다루느냐가 앞으로의 신뢰에 영향을 미칩니다.'],
          },
        ],
        nextChapterId: 'crisis_ch2',
      },
      {
        id: 'crisis_ch2',
        title: '여파',
        description: '위기 이후의 상황 수습',
        trigger: { type: 'event', value: 'crisis_ch1_e1' },
        events: [
          {
            id: 'crisis_ch2_e1',
            title: '사용자 반응',
            description: '위기 이후 사용자들의 반응이 다양합니다.',
            icon: '👥',
            choices: [
              {
                id: 'personal_apology',
                text: '개인화된 사과 메일 발송',
                effects: [
                  { type: 'energy', value: -15 },
                  { type: 'reputation', value: 15 },
                ],
                resultText: '진심어린 사과에 많은 사용자들이 감동받았습니다.',
              },
              {
                id: 'compensation',
                text: '프리미엄 사용자에게 1개월 무료 연장',
                effects: [
                  { type: 'cash', value: -500000 },
                  { type: 'reputation', value: 20 },
                  { type: 'premium_users', value: 10 },
                ],
                resultText: '실질적 보상에 만족도가 높아졌습니다.',
                setFlag: 'crisis_compensated',
              },
              {
                id: 'incident_report',
                text: '상세한 장애 보고서 공개',
                effects: [
                  { type: 'reputation', value: 25 },
                  { type: 'skill_business', value: 3 },
                ],
                resultText: '투명한 사후 처리에 개발자 커뮤니티에서 호평!',
                setFlag: 'crisis_postmortem',
              },
            ],
            consequences: [],
          },
          {
            id: 'crisis_ch2_e2',
            title: '교훈',
            description: '이번 경험에서 무엇을 배울 것인가?',
            icon: '📚',
            choices: [
              {
                id: 'improve_infra',
                text: '인프라 개선에 투자 (-2,000,000원)',
                effects: [
                  { type: 'cash', value: -2000000 },
                  { type: 'stability', value: 40 },
                  { type: 'server_health', value: 30 },
                ],
                resultText: '이중화와 모니터링 시스템을 구축했습니다!',
                setFlag: 'infra_improved',
              },
              {
                id: 'process',
                text: '장애 대응 프로세스 수립',
                effects: [
                  { type: 'skill_coding', value: 3 },
                  { type: 'stability', value: 20 },
                ],
                resultText: '다음에는 더 빠르게 대응할 수 있습니다.',
              },
              {
                id: 'move_on',
                text: '빨리 잊고 앞으로 나아간다',
                effects: [
                  { type: 'stress', value: -10 },
                ],
                resultText: '과거는 과거일 뿐... 하지만 같은 실수를 반복할 수 있습니다.',
              },
            ],
            consequences: ['위기 관리 능력이 성장의 필수 요소입니다.'],
          },
        ],
      },
    ],
  },

  // ============================================
  // 3. 경쟁사 대결 (Competitor Battle)
  // ============================================
  {
    id: 'competitor_battle',
    title: '경쟁의 시작',
    description: '경쟁사와의 본격적인 경쟁이 시작됩니다.',
    icon: '⚔️',
    unlockCondition: (state) => state.business.users.total > 2000 && state.player.social.reputation > 50,
    completionRewards: [
      { type: 'skill_marketing', value: 8 },
      { type: 'users', value: 500 },
    ],
    chapters: [
      {
        id: 'compete_ch1',
        title: '새로운 경쟁자',
        description: '갑자기 시장에 큰 경쟁자가 나타났습니다.',
        trigger: { type: 'reputation', value: 60, comparison: 'gte' },
        events: [
          {
            id: 'compete_ch1_e1',
            title: '경쟁사 등장',
            description: '"AI 영어 학습의 혁명!" 대기업 계열사가 비슷한 서비스를 출시했습니다. 마케팅 예산이 어마어마합니다.',
            icon: '🏢',
            choices: [
              {
                id: 'differentiate',
                text: '차별화에 집중',
                effects: [
                  { type: 'energy', value: -30 },
                  { type: 'skill_business', value: 5 },
                ],
                resultText: '1인 개발자만의 강점을 찾기 시작했습니다.',
                setFlag: 'compete_differentiate',
              },
              {
                id: 'speed',
                text: '기능 출시 속도로 승부',
                effects: [
                  { type: 'energy', value: -40 },
                  { type: 'stability', value: -10 },
                  { type: 'users', value: 100 },
                ],
                resultText: '빠른 속도로 새 기능들을 출시합니다!',
                setFlag: 'compete_speed',
              },
              {
                id: 'community',
                text: '커뮤니티 결속력 강화',
                effects: [
                  { type: 'reputation', value: 15 },
                  { type: 'users', value: 50 },
                ],
                resultText: '충성 사용자들과의 유대를 강화합니다.',
                setFlag: 'compete_community',
              },
            ],
            consequences: ['대기업과의 경쟁에서 살아남는 방법을 찾아야 합니다.'],
          },
        ],
        nextChapterId: 'compete_ch2',
      },
      {
        id: 'compete_ch2',
        title: '전략 실행',
        description: '선택한 전략을 실행합니다.',
        trigger: { type: 'event', value: 'compete_ch1_e1' },
        events: [
          {
            id: 'compete_ch2_e1',
            title: '반격의 시간',
            description: '전략이 효과를 보이기 시작합니다.',
            icon: '💪',
            choices: [
              {
                id: 'press_advantage',
                text: '공세를 강화한다',
                effects: [
                  { type: 'users', value: 200 },
                  { type: 'reputation', value: 20 },
                  { type: 'energy', value: -30 },
                ],
                resultText: '적극적인 대응이 효과를 보고 있습니다!',
              },
              {
                id: 'niche',
                text: '틈새 시장에 집중한다',
                effects: [
                  { type: 'users', value: 100 },
                  { type: 'premium_users', value: 30 },
                ],
                resultText: '대기업이 신경쓰지 않는 영역을 공략합니다.',
              },
            ],
            consequences: [],
          },
        ],
        nextChapterId: 'compete_ch3',
      },
      {
        id: 'compete_ch3',
        title: '공존과 차별화',
        description: '시장에서 자신만의 위치를 찾았습니다.',
        trigger: { type: 'users', value: 5000, comparison: 'gte' },
        events: [
          {
            id: 'compete_ch3_e1',
            title: '새로운 균형',
            description: '대기업과 공존하면서도 성장하는 방법을 찾았습니다.',
            icon: '⚖️',
            choices: [
              {
                id: 'peace',
                text: '각자의 길을 간다',
                effects: [
                  { type: 'mental', value: 20 },
                  { type: 'stress', value: -20 },
                ],
                resultText: '건강한 경쟁 관계가 형성되었습니다.',
              },
              {
                id: 'partnership',
                text: '협력 가능성을 모색한다',
                effects: [
                  { type: 'skill_business', value: 5 },
                  { type: 'reputation', value: 10 },
                ],
                resultText: '뜻밖의 협업 기회가 생길 수도 있습니다.',
                setFlag: 'open_to_partnership',
              },
            ],
            consequences: [],
          },
        ],
      },
    ],
  },

  // ============================================
  // 4. 성장통 (Growing Pains)
  // ============================================
  {
    id: 'growing_pains',
    title: '성장통',
    description: '급격한 성장에 따른 문제들과 씨름합니다.',
    icon: '📈',
    unlockCondition: (state) => state.business.users.total > 5000,
    completionRewards: [
      { type: 'skill_coding', value: 8 },
      { type: 'stability', value: 30 },
    ],
    chapters: [
      {
        id: 'growth_ch1',
        title: '확장의 고통',
        description: '사용자가 늘어나면서 새로운 문제들이 생깁니다.',
        trigger: { type: 'users', value: 5000, comparison: 'gte' },
        events: [
          {
            id: 'growth_ch1_e1',
            title: '스케일링 문제',
            description: '서버가 점점 느려지고 있습니다. 지금까지의 아키텍처로는 한계가 보입니다.',
            icon: '🐌',
            choices: [
              {
                id: 'refactor',
                text: '대규모 리팩토링 (-80 에너지, 2주)',
                effects: [
                  { type: 'energy', value: -80 },
                  { type: 'stability', value: 50 },
                  { type: 'technical_debt', value: -40 },
                ],
                resultText: '힘든 작업이었지만 시스템이 훨씬 견고해졌습니다!',
                setFlag: 'major_refactor_done',
              },
              {
                id: 'scale_hardware',
                text: '하드웨어 스케일업 (-500,000원/월)',
                effects: [
                  { type: 'cash', value: -500000 },
                  { type: 'stability', value: 20 },
                ],
                resultText: '당장은 해결됐지만 근본적인 문제는 남아있습니다.',
              },
              {
                id: 'hire_help',
                text: '외주 개발자 고용 (-3,000,000원)',
                effects: [
                  { type: 'cash', value: -3000000 },
                  { type: 'stability', value: 40 },
                  { type: 'skill_business', value: 3 },
                ],
                resultText: '처음으로 다른 사람과 협업합니다. 새로운 경험!',
                setFlag: 'first_hire',
              },
            ],
            consequences: ['1인 개발의 한계에 대해 고민하게 됩니다.'],
          },
        ],
        nextChapterId: 'growth_ch2',
      },
      {
        id: 'growth_ch2',
        title: '팀인가, 솔로인가',
        description: '혼자 계속할 것인지 결정해야 합니다.',
        trigger: { type: 'event', value: 'growth_ch1_e1' },
        events: [
          {
            id: 'growth_ch2_e1',
            title: '결정의 순간',
            description: '이제 선택해야 합니다. 1인 개발을 고수할 것인가, 팀을 만들 것인가?',
            icon: '🤔',
            choices: [
              {
                id: 'stay_solo',
                text: '1인 개발을 고수한다',
                effects: [
                  { type: 'stress', value: 20 },
                  { type: 'mental', value: 10 },
                ],
                resultText: '나만의 길을 계속 걷습니다. 힘들지만 의미있는 선택.',
                setFlag: 'solo_forever',
              },
              {
                id: 'build_team',
                text: '첫 팀원을 찾는다',
                effects: [
                  { type: 'energy', value: -30 },
                  { type: 'skill_business', value: 5 },
                  { type: 'stress', value: 15 },
                ],
                resultText: '새로운 장이 열립니다. 처음으로 팀을 만듭니다.',
                setFlag: 'building_team',
                nextChapterId: 'growth_ch3_team',
              },
              {
                id: 'selective_outsource',
                text: '필요할 때만 외주를 쓴다',
                effects: [
                  { type: 'skill_business', value: 3 },
                ],
                resultText: '유연한 접근 방식을 선택했습니다.',
                setFlag: 'hybrid_approach',
              },
            ],
            consequences: ['이 결정이 회사의 방향을 결정합니다.'],
          },
        ],
      },
      {
        id: 'growth_ch3_team',
        title: '첫 팀원',
        description: '처음으로 팀원을 찾습니다.',
        trigger: { type: 'event', value: 'growth_ch2_e1' },
        events: [
          {
            id: 'growth_ch3_e1',
            title: '채용의 어려움',
            description: '작은 스타트업에 합류할 사람을 찾기가 쉽지 않습니다.',
            icon: '👤',
            choices: [
              {
                id: 'senior',
                text: '경력자를 찾는다 (높은 연봉)',
                effects: [
                  { type: 'cash', value: -5000000 },
                  { type: 'stability', value: 30 },
                  { type: 'skill_coding', value: 5 },
                ],
                resultText: '경험 많은 개발자가 합류! 많은 것을 배울 수 있습니다.',
              },
              {
                id: 'junior',
                text: '주니어를 키운다 (시간 투자)',
                effects: [
                  { type: 'cash', value: -2500000 },
                  { type: 'energy', value: -30 },
                  { type: 'skill_business', value: 3 },
                ],
                resultText: '처음부터 함께 성장하는 동료를 얻었습니다.',
              },
              {
                id: 'cofounder',
                text: '공동 창업자를 찾는다',
                effects: [
                  { type: 'skill_business', value: 8 },
                  { type: 'stress', value: -20 },
                ],
                resultText: '혼자가 아닌 둘이서 걸어갑니다!',
                setFlag: 'has_cofounder',
              },
            ],
            consequences: [],
          },
        ],
      },
    ],
  },

  // ============================================
  // 5. 개인의 성장 (Personal Growth)
  // ============================================
  {
    id: 'personal_growth',
    title: '나 자신을 찾아서',
    description: '창업가로서, 그리고 한 인간으로서의 성장 이야기',
    icon: '🌱',
    unlockCondition: (state) => state.time.totalDays > 180,
    completionRewards: [
      { type: 'mental', value: 30 },
      { type: 'health', value: 20 },
    ],
    chapters: [
      {
        id: 'personal_ch1',
        title: '번아웃의 그림자',
        description: '오랜 시간 혼자 달려온 대가가 찾아옵니다.',
        trigger: { type: 'day', value: 200, comparison: 'gte' },
        events: [
          {
            id: 'personal_ch1_e1',
            title: '한계에 다다르다',
            description: '아침에 일어나기가 힘듭니다. 모든 것이 무의미하게 느껴지는 순간들이 있습니다.',
            icon: '😔',
            choices: [
              {
                id: 'acknowledge',
                text: '솔직하게 인정한다',
                effects: [
                  { type: 'mental', value: 10 },
                  { type: 'skill_business', value: 2 },
                ],
                resultText: '문제를 인식하는 것이 첫 걸음입니다.',
                setFlag: 'acknowledged_burnout',
              },
              {
                id: 'push',
                text: '더 열심히 한다',
                effects: [
                  { type: 'mental', value: -20 },
                  { type: 'health', value: -10 },
                  { type: 'stress', value: 30 },
                ],
                resultText: '몸과 마음이 비명을 지르고 있습니다.',
              },
              {
                id: 'break',
                text: '일주일 쉰다',
                effects: [
                  { type: 'energy', value: 50 },
                  { type: 'mental', value: 30 },
                  { type: 'users', value: -20 },
                ],
                resultText: '완전한 휴식 후 다시 태어난 기분입니다.',
                setFlag: 'took_break',
              },
            ],
            consequences: ['자신을 돌보는 것도 창업의 일부입니다.'],
          },
        ],
        nextChapterId: 'personal_ch2',
      },
      {
        id: 'personal_ch2',
        title: '균형 찾기',
        description: '일과 삶의 균형을 다시 생각합니다.',
        trigger: { type: 'event', value: 'personal_ch1_e1' },
        events: [
          {
            id: 'personal_ch2_e1',
            title: '새로운 습관',
            description: '지속가능한 방식을 찾아야 합니다.',
            icon: '🧘',
            choices: [
              {
                id: 'routine',
                text: '규칙적인 생활 패턴 수립',
                effects: [
                  { type: 'health', value: 20 },
                  { type: 'mental', value: 15 },
                  { type: 'energy', value: 10 },
                ],
                resultText: '아침 운동, 정해진 퇴근 시간. 삶이 달라지기 시작합니다.',
              },
              {
                id: 'therapy',
                text: '전문 상담을 받는다 (-200,000원)',
                effects: [
                  { type: 'cash', value: -200000 },
                  { type: 'mental', value: 30 },
                  { type: 'stress', value: -30 },
                ],
                resultText: '전문가와 이야기하면서 많은 것을 깨닫습니다.',
                setFlag: 'got_therapy',
              },
              {
                id: 'community',
                text: '창업가 커뮤니티에 참여',
                effects: [
                  { type: 'mental', value: 20 },
                  { type: 'skill_business', value: 3 },
                ],
                resultText: '같은 고민을 가진 사람들을 만났습니다.',
              },
            ],
            consequences: [],
          },
        ],
        nextChapterId: 'personal_ch3',
      },
      {
        id: 'personal_ch3',
        title: '성장',
        description: '힘든 시간을 거쳐 더 강해졌습니다.',
        trigger: { type: 'event', value: 'personal_ch2_e1' },
        events: [
          {
            id: 'personal_ch3_e1',
            title: '새로운 나',
            description: '어느 날 문득 깨닫습니다. 예전보다 더 단단해진 자신을.',
            icon: '✨',
            choices: [
              {
                id: 'share',
                text: '경험을 나눈다',
                effects: [
                  { type: 'reputation', value: 20 },
                  { type: 'mental', value: 10 },
                ],
                resultText: '블로그에 솔직한 이야기를 공유했더니 많은 공감을 얻었습니다.',
              },
              {
                id: 'forward',
                text: '조용히 앞으로 나아간다',
                effects: [
                  { type: 'mental', value: 20 },
                ],
                resultText: '내면의 성장을 간직하며 계속 걸어갑니다.',
              },
            ],
            consequences: [],
          },
        ],
      },
    ],
  },
];

// ============================================
// 스토리 아크 관리 함수들
// ============================================

export interface StoryProgress {
  arcId: string;
  currentChapterId: string;
  completedChapters: string[];
  flags: Set<string>;
  startedAt: number;
  completedAt?: number;
}

// 새 스토리 아크 시작
export function startStoryArc(arcId: string, currentDay: number): StoryProgress {
  const arc = STORY_ARCS.find(a => a.id === arcId);
  if (!arc) throw new Error(`Story arc not found: ${arcId}`);

  return {
    arcId,
    currentChapterId: arc.chapters[0].id,
    completedChapters: [],
    flags: new Set(),
    startedAt: currentDay,
  };
}

// 챕터 완료
export function completeChapter(
  progress: StoryProgress,
  chapterId: string,
  nextChapterId?: string
): StoryProgress {
  const arc = STORY_ARCS.find(a => a.id === progress.arcId);
  if (!arc) return progress;

  const chapter = arc.chapters.find(c => c.id === chapterId);
  if (!chapter) return progress;

  const newProgress = { ...progress };
  newProgress.completedChapters = [...progress.completedChapters, chapterId];

  // 다음 챕터 결정
  if (nextChapterId) {
    newProgress.currentChapterId = nextChapterId;
  } else if (chapter.nextChapterId) {
    newProgress.currentChapterId = chapter.nextChapterId;
  }

  return newProgress;
}

// 플래그 설정
export function setStoryFlag(progress: StoryProgress, flag: string): StoryProgress {
  const newFlags = new Set(progress.flags);
  newFlags.add(flag);
  return { ...progress, flags: newFlags };
}

// 스토리 아크 완료 체크
export function isArcCompleted(progress: StoryProgress): boolean {
  const arc = STORY_ARCS.find(a => a.id === progress.arcId);
  if (!arc) return false;

  // 마지막 챕터가 완료되었는지 확인
  const lastChapterIds = arc.chapters
    .filter(c => !c.nextChapterId)
    .map(c => c.id);

  return lastChapterIds.some(id => progress.completedChapters.includes(id));
}

// 활성화 가능한 스토리 아크 찾기
export function findAvailableArcs(
  state: GameState,
  activeArcs: Set<string>,
  completedArcs: Set<string>
): StoryArc[] {
  return STORY_ARCS.filter(arc => {
    if (activeArcs.has(arc.id)) return false;
    if (completedArcs.has(arc.id)) return false;
    return arc.unlockCondition(state);
  });
}

// 현재 챕터의 이벤트 가져오기
export function getCurrentChapterEvents(progress: StoryProgress): StoryEvent[] {
  const arc = STORY_ARCS.find(a => a.id === progress.arcId);
  if (!arc) return [];

  const chapter = arc.chapters.find(c => c.id === progress.currentChapterId);
  if (!chapter) return [];

  return chapter.events;
}

// 스토리 아크 정보 가져오기
export function getArcById(arcId: string): StoryArc | undefined {
  return STORY_ARCS.find(arc => arc.id === arcId);
}

export default STORY_ARCS;
