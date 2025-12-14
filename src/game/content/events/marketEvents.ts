/**
 * Chapter 3: Content & Narrative - Market Events (시장/산업 이벤트)
 * 시장 트렌드, 규제, 산업 동향 관련 이벤트
 */

import type { GameState } from '../../types';
import type { ProbabilisticEvent } from '../../systems/eventEngine';

export const MARKET_EVENTS: ProbabilisticEvent[] = [
  // ============================================
  // 시장 트렌드 이벤트 (10개)
  // ============================================
  {
    id: 'market_ai_hype',
    name: 'AI 학습 열풍',
    description: 'ChatGPT 열풍 이후 AI 기반 학습 도구에 대한 관심이 폭발적으로 증가하고 있습니다!',
    icon: '🤖',
    severity: 'good',
    probability: () => 0.01,
    minDay: 30,
    maxOccurrences: 2,
    choices: [
      {
        id: 'ride_wave',
        text: 'AI 기능 강조 마케팅',
        effects: [
          { type: 'users', value: 500 },
          { type: 'reputation', value: 20 },
        ],
        resultText: '트렌드에 맞춰 AI 기능을 홍보했습니다! 가입자 폭증!',
      },
      {
        id: 'differentiate',
        text: '"진짜 학습" 가치 어필',
        effects: [
          { type: 'reputation', value: 30 },
          { type: 'premium_users', value: 20 },
        ],
        resultText: '과대광고가 아닌 실제 효과를 강조해 신뢰를 얻었습니다.',
      },
      {
        id: 'ignore',
        text: '원래대로 운영',
        effects: [],
        resultText: '트렌드를 놓쳤지만 본질에 충실합니다.',
      },
    ],
  },
  {
    id: 'market_english_fever',
    name: '영어 학습 시즌',
    description: '새 학기가 시작되며 영어 학습에 대한 관심이 크게 높아졌습니다!',
    icon: '📚',
    severity: 'good',
    probability: (state) => {
      const month = state.time.currentDate.getMonth() + 1;
      return (month === 2 || month === 3 || month === 9) ? 0.15 : 0;
    },
    choices: [
      {
        id: 'promo',
        text: '시즌 프로모션 진행 (-300,000원)',
        effects: [
          { type: 'cash', value: -300000 },
          { type: 'users', value: 300 },
          { type: 'premium_users', value: 30 },
        ],
        resultText: '신학기 할인으로 많은 신규 가입자를 확보했습니다!',
      },
      {
        id: 'content',
        text: '시즌 맞춤 콘텐츠 제작 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'users', value: 150 },
          { type: 'reputation', value: 15 },
        ],
        resultText: '"새 학기 영어 완성" 콘텐츠가 호응을 얻었습니다!',
      },
    ],
  },
  {
    id: 'market_toeic_season',
    name: 'TOEIC 시험 시즌',
    description: '취업 시즌이 다가오면서 TOEIC 준비생이 급증하고 있습니다.',
    icon: '📝',
    severity: 'good',
    probability: (state) => {
      const month = state.time.currentDate.getMonth() + 1;
      return (month === 4 || month === 10 || month === 11) ? 0.1 : 0;
    },
    choices: [
      {
        id: 'toeic_feature',
        text: 'TOEIC 특화 기능 추가 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'users', value: 400 },
          { type: 'premium_users', value: 40 },
        ],
        resultText: 'TOEIC 빈출 단어 모드가 대호응!',
      },
      {
        id: 'partnership',
        text: '학원과 제휴 프로모션',
        effects: [
          { type: 'users', value: 200 },
          { type: 'cash', value: 500000 },
        ],
        resultText: '어학원과 협업으로 B2B 매출이 생겼습니다.',
      },
    ],
  },
  {
    id: 'market_economy_downturn',
    name: '경기 침체',
    description: '경제 불황으로 소비자들이 지출을 줄이고 있습니다.',
    icon: '📉',
    severity: 'warning',
    probability: () => 0.005,
    choices: [
      {
        id: 'price_freeze',
        text: '가격 동결 선언',
        effects: [
          { type: 'reputation', value: 15 },
          { type: 'users', value: 50 },
        ],
        resultText: '어려운 시기에 가격을 올리지 않겠다는 발표가 호평!',
      },
      {
        id: 'discount',
        text: '경제적 어려움 할인',
        effects: [
          { type: 'cash', value: -200000 },
          { type: 'users', value: 100 },
          { type: 'reputation', value: 20 },
        ],
        resultText: '취업준비생, 학생 할인이 좋은 이미지를 만들었습니다.',
      },
      {
        id: 'value_focus',
        text: '가성비 강조 마케팅',
        effects: [
          { type: 'premium_users', value: 20 },
        ],
        resultText: '"한 달 만원으로 영어 마스터" 메시지가 효과적!',
      },
    ],
  },
  {
    id: 'market_regulation',
    name: '교육 앱 규제 논의',
    description: '정부에서 교육 앱에 대한 규제를 논의하고 있습니다. 개인정보 보호와 콘텐츠 품질 기준이 강화될 수 있습니다.',
    icon: '⚖️',
    severity: 'warning',
    probability: () => 0.008,
    minDay: 60,
    choices: [
      {
        id: 'proactive',
        text: '선제적 대응 (규정 준수 강화)',
        effects: [
          { type: 'cash', value: -500000 },
          { type: 'reputation', value: 25 },
          { type: 'stability', value: 20 },
        ],
        resultText: '규제 전에 미리 대응! 모범 사례로 언론에 소개되었습니다.',
      },
      {
        id: 'wait',
        text: '상황을 지켜본다',
        effects: [
          { type: 'stress', value: 10 },
        ],
        resultText: '아직 확정된 건 없으니 기다려봅니다.',
      },
      {
        id: 'association',
        text: '업계 협회 활동 참여',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'skill_business', value: 3 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '에듀테크 협회에서 의견을 내기 시작했습니다.',
      },
    ],
  },
  {
    id: 'market_platform_change',
    name: '앱스토어 정책 변경',
    description: 'Apple이 인앱 결제 수수료를 15%로 인하했습니다! (소규모 개발자 대상)',
    icon: '🍎',
    severity: 'good',
    probability: () => 0.005,
    minDay: 90,
    maxOccurrences: 1,
    choices: [
      {
        id: 'apply',
        text: '소규모 개발자 프로그램 신청',
        effects: [
          { type: 'cash', value: 300000 },
        ],
        resultText: '수수료 15% 절감! 마진이 개선되었습니다.',
      },
    ],
  },
  {
    id: 'market_viral_content',
    name: '바이럴 콘텐츠 기회',
    description: '영어 학습 관련 밈이 SNS에서 유행하고 있습니다!',
    icon: '🎬',
    severity: 'good',
    probability: () => 0.015,
    choices: [
      {
        id: 'create_content',
        text: '트렌드에 맞는 콘텐츠 제작 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'users', value: 200 },
          { type: 'reputation', value: 15 },
        ],
        resultText: '재미있는 콘텐츠가 공유되며 인지도 상승!',
      },
      {
        id: 'sponsored',
        text: '인플루언서와 협업 (-200,000원)',
        effects: [
          { type: 'cash', value: -200000 },
          { type: 'users', value: 400 },
        ],
        resultText: '유명 인플루언서가 VocaVision을 언급했습니다!',
      },
    ],
  },
  {
    id: 'market_competitor_exit',
    name: '경쟁사 시장 철수',
    description: '주요 경쟁사 중 하나가 한국 시장에서 철수를 발표했습니다.',
    icon: '🚪',
    severity: 'good',
    probability: () => 0.005,
    minDay: 120,
    choices: [
      {
        id: 'acquire_users',
        text: '이탈 사용자 공략 캠페인 (-500,000원)',
        effects: [
          { type: 'cash', value: -500000 },
          { type: 'users', value: 800 },
          { type: 'premium_users', value: 50 },
        ],
        resultText: '경쟁사 사용자 대거 유입! 시장 점유율 상승!',
      },
      {
        id: 'data_migration',
        text: '데이터 마이그레이션 도구 제공',
        effects: [
          { type: 'energy', value: -25 },
          { type: 'users', value: 500 },
          { type: 'reputation', value: 25 },
        ],
        resultText: '사용자 친화적 대응으로 좋은 인상을 남겼습니다.',
      },
    ],
  },
  {
    id: 'market_new_platform',
    name: '새 플랫폼 등장',
    description: '애플 비전 프로가 출시되었습니다. 새로운 플랫폼을 지원해야 할까요?',
    icon: '🥽',
    severity: 'normal',
    probability: () => 0.003,
    minDay: 180,
    choices: [
      {
        id: 'early_adopt',
        text: '얼리 어답터로 진출 (-60 에너지, -2,000,000원)',
        effects: [
          { type: 'energy', value: -60 },
          { type: 'cash', value: -2000000 },
          { type: 'reputation', value: 35 },
          { type: 'users', value: 100 },
        ],
        resultText: 'VR 영어 학습! 새로운 시장을 개척합니다!',
      },
      {
        id: 'watch',
        text: '시장 반응을 지켜본다',
        effects: [],
        resultText: '아직 때가 아닌 것 같습니다.',
      },
    ],
  },
  {
    id: 'market_global_event',
    name: '글로벌 이벤트 영향',
    description: '국제 행사로 인해 영어 학습에 대한 관심이 높아지고 있습니다.',
    icon: '🌍',
    severity: 'good',
    probability: () => 0.01,
    choices: [
      {
        id: 'themed_content',
        text: '관련 테마 콘텐츠 제작',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'users', value: 200 },
        ],
        resultText: '시의적절한 콘텐츠로 관심을 받았습니다!',
      },
      {
        id: 'event_promo',
        text: '이벤트 프로모션',
        effects: [
          { type: 'cash', value: -100000 },
          { type: 'users', value: 150 },
        ],
        resultText: '특별 이벤트로 신규 가입자가 늘었습니다.',
      },
    ],
  },

  // ============================================
  // 산업 동향 이벤트 (5개)
  // ============================================
  {
    id: 'market_edtech_conference',
    name: '에듀테크 컨퍼런스',
    description: '국내 최대 에듀테크 컨퍼런스가 열립니다. 참가하시겠습니까?',
    icon: '🎤',
    severity: 'good',
    probability: (state) => state.time.totalDays > 60 ? 0.02 : 0,
    choices: [
      {
        id: 'speaker',
        text: '발표자로 참여 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'reputation', value: 35 },
          { type: 'users', value: 150 },
          { type: 'skill_business', value: 5 },
        ],
        resultText: '발표가 호평! 많은 관계자들의 관심을 받았습니다.',
      },
      {
        id: 'booth',
        text: '부스 운영 (-15 에너지, -300,000원)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'cash', value: -300000 },
          { type: 'users', value: 100 },
          { type: 'reputation', value: 15 },
        ],
        resultText: '부스에서 많은 관심을 받았습니다!',
      },
      {
        id: 'attend',
        text: '참관만 한다',
        effects: [
          { type: 'skill_business', value: 3 },
        ],
        resultText: '유용한 정보와 네트워크를 얻었습니다.',
      },
    ],
  },
  {
    id: 'market_funding_news',
    name: '에듀테크 투자 붐',
    description: '에듀테크 분야에 투자금이 몰리고 있습니다. 경쟁사들이 대규모 투자를 유치하고 있습니다.',
    icon: '💸',
    severity: 'warning',
    probability: () => 0.008,
    minDay: 90,
    choices: [
      {
        id: 'seek_funding',
        text: '투자 유치 준비',
        effects: [
          { type: 'skill_business', value: 4 },
          { type: 'stress', value: 15 },
        ],
        resultText: '투자 덱을 준비하기 시작했습니다.',
      },
      {
        id: 'bootstrap',
        text: '부트스트랩 정신 유지',
        effects: [
          { type: 'mental', value: 10 },
        ],
        resultText: '독립적인 성장을 계속합니다.',
      },
    ],
  },
  {
    id: 'market_acquisition_wave',
    name: '인수합병 소식',
    description: '대기업들이 에듀테크 스타트업을 적극적으로 인수하고 있습니다.',
    icon: '🤝',
    severity: 'normal',
    probability: (state) => state.business.users.total > 5000 ? 0.01 : 0,
    minDay: 180,
    choices: [
      {
        id: 'open',
        text: '인수 제안에 열린 태도',
        effects: [
          { type: 'skill_business', value: 3 },
        ],
        resultText: '만약 좋은 제안이 온다면 고려해볼 의향이 있습니다.',
      },
      {
        id: 'focus',
        text: '독립적 성장에 집중',
        effects: [
          { type: 'reputation', value: 10 },
        ],
        resultText: '우리만의 길을 계속 걸어갑니다.',
      },
    ],
  },
  {
    id: 'market_tech_breakthrough',
    name: '기술 혁신',
    description: '새로운 AI 모델이 공개되어 교육 앱에 혁신적인 기능을 추가할 수 있게 되었습니다.',
    icon: '⚡',
    severity: 'good',
    probability: () => 0.01,
    minDay: 60,
    choices: [
      {
        id: 'integrate',
        text: '새 기술 통합 (-40 에너지, -500,000원)',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'cash', value: -500000 },
          { type: 'reputation', value: 25 },
          { type: 'users', value: 300 },
        ],
        resultText: 'AI 기반 실시간 발음 교정 기능 추가! 혁신적!',
      },
      {
        id: 'research',
        text: '기술 연구만 진행',
        effects: [
          { type: 'skill_coding', value: 5 },
        ],
        resultText: '새 기술을 공부하고 나중에 적용하기로 했습니다.',
      },
    ],
  },
  {
    id: 'market_social_trend',
    name: '소셜 미디어 트렌드',
    description: '"영어 공부 브이로그"가 틱톡에서 유행하고 있습니다!',
    icon: '📱',
    severity: 'good',
    probability: () => 0.02,
    choices: [
      {
        id: 'challenge',
        text: '#VocaVision챌린지 시작',
        effects: [
          { type: 'users', value: 250 },
          { type: 'reputation', value: 15 },
        ],
        resultText: '챌린지가 퍼지면서 브랜드 인지도 상승!',
      },
      {
        id: 'ugc',
        text: 'UGC(사용자 콘텐츠) 장려',
        effects: [
          { type: 'users', value: 150 },
          { type: 'premium_users', value: 10 },
        ],
        resultText: '사용자들이 자발적으로 VocaVision 후기를 올리기 시작!',
      },
    ],
  },
];

export default MARKET_EVENTS;
