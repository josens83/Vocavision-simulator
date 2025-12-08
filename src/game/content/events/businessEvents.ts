/**
 * Chapter 3: Content & Narrative - Business Events (비즈니스 이벤트)
 * 투자, 파트너십, 재무, 마케팅 관련 50+ 이벤트
 */

import type { GameState } from '../../types';
import type { ProbabilisticEvent } from '../../systems/eventEngine';

export const BUSINESS_EVENTS: ProbabilisticEvent[] = [
  // ============================================
  // 투자 관련 이벤트 (12개)
  // ============================================
  {
    id: 'biz_angel_interest',
    name: '엔젤 투자자 관심',
    description: '스타트업 커뮤니티에서 활동하는 엔젤 투자자가 VocaVision에 대해 물어봤습니다.',
    icon: '😇',
    severity: 'good',
    probability: (state) => state.business.users.total > 300 && state.player.social.reputation > 40 ? 0.02 : 0.005,
    minDay: 30,
    choices: [
      {
        id: 'pitch_meeting',
        text: '피칭 미팅 제안 (-10 에너지)',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'skill_business', value: 3 },
        ],
        resultText: '1시간 미팅을 잡았습니다. 준비가 필요합니다!',
      },
      {
        id: 'send_deck',
        text: '덱 자료 먼저 전송',
        effects: [
          { type: 'energy', value: -5 },
          { type: 'skill_business', value: 1 },
        ],
        resultText: '자료를 보내고 피드백을 기다립니다.',
      },
      {
        id: 'not_ready',
        text: '아직 준비가 안 됐다고 답변',
        effects: [],
        resultText: '나중에 다시 연락달라고 했습니다.',
      },
    ],
  },
  {
    id: 'biz_vc_cold_email',
    name: 'VC 콜드 이메일',
    description: '유명 VC에서 갑자기 이메일이 왔습니다. "VocaVision에 대해 이야기해보고 싶습니다."',
    icon: '📧',
    severity: 'good',
    probability: (state) => state.business.users.total > 1000 ? 0.015 : 0.003,
    minDay: 60,
    choices: [
      {
        id: 'schedule_call',
        text: '콜 일정 잡기',
        effects: [
          { type: 'skill_business', value: 2 },
          { type: 'stress', value: 10 },
        ],
        resultText: '다음 주에 온라인 미팅이 잡혔습니다!',
      },
      {
        id: 'due_diligence',
        text: 'VC 배경 조사 후 답변',
        effects: [
          { type: 'energy', value: -5 },
          { type: 'skill_business', value: 2 },
        ],
        resultText: '신뢰할 만한 VC인지 확인했습니다.',
      },
      {
        id: 'ignore',
        text: '무시한다 (스팸일수도)',
        effects: [],
        resultText: '나중에 알고 보니 진짜였습니다... 아쉬운 기회.',
        probability: 0.3,
      },
    ],
  },
  {
    id: 'biz_investment_offer',
    name: '투자 제안',
    description: '시드 라운드 투자 제안이 들어왔습니다! 3억원에 지분 15%.',
    icon: '💰',
    severity: 'good',
    probability: (state) => state.business.users.premium > 100 && state.player.social.reputation > 60 ? 0.01 : 0,
    minDay: 90,
    choices: [
      {
        id: 'accept',
        text: '제안 수락',
        effects: [
          { type: 'cash', value: 300000000 },
          { type: 'stress', value: -30 },
          { type: 'reputation', value: 20 },
        ],
        resultText: '투자 유치 성공! 이제 더 크게 성장할 수 있습니다!',
      },
      {
        id: 'negotiate',
        text: '협상 시도 (10%로)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'skill_business', value: 4 },
        ],
        resultText: '협상 중입니다... 결과는 며칠 후에.',
        probability: 0.5,
      },
      {
        id: 'decline',
        text: '거절 (자립 경영)',
        effects: [
          { type: 'reputation', value: 5 },
          { type: 'stress', value: 10 },
        ],
        resultText: '독립을 선택했습니다. 더 어렵겠지만 의미있는 선택.',
      },
    ],
  },
  {
    id: 'biz_accelerator_invite',
    name: '액셀러레이터 초대',
    description: 'Y Combinator 스타일의 한국 액셀러레이터 프로그램에 초대받았습니다.',
    icon: '🚀',
    severity: 'good',
    probability: (state) => state.business.users.total > 500 ? 0.008 : 0.002,
    minDay: 45,
    choices: [
      {
        id: 'apply',
        text: '프로그램 참여 (3개월, 지분 5%)',
        effects: [
          { type: 'cash', value: 50000000 },
          { type: 'skill_business', value: 10 },
          { type: 'reputation', value: 25 },
          { type: 'stress', value: 30 },
        ],
        resultText: '3개월간 집중 멘토링! 네트워크가 크게 확장됩니다.',
      },
      {
        id: 'part_time',
        text: '파트타임 참여 요청',
        effects: [
          { type: 'skill_business', value: 5 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '일부 프로그램만 참여하기로 했습니다.',
      },
      {
        id: 'decline',
        text: '지금은 어렵다고 거절',
        effects: [],
        resultText: '다음 배치에 다시 지원할 수 있습니다.',
      },
    ],
  },
  {
    id: 'biz_government_grant',
    name: '정부 지원금 선정',
    description: '중소벤처기업부의 혁신 스타트업 지원 사업에 선정되었습니다!',
    icon: '🏛️',
    severity: 'good',
    probability: (state) => state.time.totalDays > 60 ? 0.008 : 0,
    minDay: 60,
    choices: [
      {
        id: 'full_grant',
        text: '전액 신청 (5천만원, 서류 복잡)',
        effects: [
          { type: 'cash', value: 50000000 },
          { type: 'energy', value: -30 },
          { type: 'stress', value: 15 },
        ],
        resultText: '서류 작업이 힘들었지만 큰 자금을 확보했습니다!',
      },
      {
        id: 'partial',
        text: '소액만 신청 (2천만원, 간단)',
        effects: [
          { type: 'cash', value: 20000000 },
          { type: 'energy', value: -10 },
        ],
        resultText: '간단히 처리하고 도움을 받았습니다.',
      },
      {
        id: 'skip',
        text: '패스 (서류 작업 너무 많음)',
        effects: [],
        resultText: '공짜 돈을 놓쳤지만 시간은 절약했습니다.',
      },
    ],
  },
  {
    id: 'biz_tips_grant',
    name: 'TIPS 프로그램 합격',
    description: 'TIPS 최종 발표에서 합격! 최대 5억원 지원을 받을 수 있습니다.',
    icon: '🎖️',
    severity: 'good',
    probability: (state) => state.business.users.total > 2000 && state.player.social.reputation > 70 ? 0.005 : 0,
    minDay: 120,
    maxOccurrences: 1,
    choices: [
      {
        id: 'accept_tips',
        text: '프로그램 수락',
        effects: [
          { type: 'cash', value: 500000000 },
          { type: 'reputation', value: 30 },
          { type: 'stress', value: 20 },
        ],
        resultText: 'TIPS 지원금 확보! 한국 최고의 스타트업 지원 프로그램입니다!',
      },
    ],
  },

  // ============================================
  // 파트너십/B2B 이벤트 (10개)
  // ============================================
  {
    id: 'biz_school_inquiry',
    name: '학교 도입 문의',
    description: '지역 중학교에서 영어 교육 도구로 VocaVision 도입을 검토하고 싶다고 연락왔습니다.',
    icon: '🏫',
    severity: 'good',
    probability: (state) => state.business.users.total > 500 ? 0.02 : 0.005,
    minDay: 45,
    choices: [
      {
        id: 'pilot',
        text: '파일럿 프로그램 제안 (1학기, 할인)',
        effects: [
          { type: 'users', value: 200 },
          { type: 'reputation', value: 10 },
          { type: 'cash', value: 500000 },
        ],
        resultText: '학생 200명이 VocaVision을 사용하게 됩니다!',
      },
      {
        id: 'full_contract',
        text: '정식 계약 제안',
        effects: [
          { type: 'users', value: 500 },
          { type: 'cash', value: 3000000 },
          { type: 'stress', value: 15 },
        ],
        resultText: '대규모 계약 성사! B2B 매출이 생겼습니다!',
      },
      {
        id: 'defer',
        text: 'B2B 준비가 안 됐다고 답변',
        effects: [
          { type: 'reputation', value: -3 },
        ],
        resultText: '기회를 놓쳤지만 현실적인 판단일 수 있습니다.',
      },
    ],
  },
  {
    id: 'biz_academy_chain',
    name: '학원 체인 제휴 제안',
    description: '전국 50개 지점을 가진 영어 학원 체인에서 제휴를 제안했습니다.',
    icon: '📚',
    severity: 'good',
    probability: (state) => state.player.social.reputation > 50 ? 0.01 : 0.003,
    minDay: 60,
    choices: [
      {
        id: 'exclusive',
        text: '독점 계약 (높은 수수료)',
        effects: [
          { type: 'cash', value: 10000000 },
          { type: 'users', value: 1000 },
          { type: 'reputation', value: 20 },
        ],
        resultText: '대박! 전국 50개 지점에서 VocaVision 사용!',
      },
      {
        id: 'non_exclusive',
        text: '비독점 계약 (유연성 유지)',
        effects: [
          { type: 'cash', value: 5000000 },
          { type: 'users', value: 500 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '다른 학원과도 계약할 수 있는 유연성을 유지했습니다.',
      },
      {
        id: 'too_early',
        text: '아직 이르다고 판단',
        effects: [
          { type: 'stress', value: -10 },
        ],
        resultText: '큰 계약은 나중에... 지금은 제품에 집중합니다.',
      },
    ],
  },
  {
    id: 'biz_publisher_collab',
    name: '출판사 협업 제안',
    description: '유명 교육 출판사에서 단어장 콘텐츠 라이선스 협업을 제안했습니다.',
    icon: '📖',
    severity: 'good',
    probability: (state) => state.business.users.total > 1000 ? 0.01 : 0.002,
    minDay: 60,
    choices: [
      {
        id: 'license_deal',
        text: '라이선스 계약 체결',
        effects: [
          { type: 'cash', value: 8000000 },
          { type: 'reputation', value: 15 },
          { type: 'users', value: 200 },
        ],
        resultText: '공식 콘텐츠 파트너가 되었습니다! 신뢰도 상승!',
      },
      {
        id: 'co_branding',
        text: '공동 브랜딩 제품 개발',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'cash', value: 5000000 },
          { type: 'reputation', value: 25 },
        ],
        resultText: '[출판사명] x VocaVision 특별판 출시!',
      },
      {
        id: 'pass',
        text: '독자 콘텐츠로 가겠다',
        effects: [
          { type: 'reputation', value: 5 },
        ],
        resultText: '독립적인 브랜드 정체성을 유지합니다.',
      },
    ],
  },
  {
    id: 'biz_corporate_training',
    name: '기업 교육 문의',
    description: '대기업 인사팀에서 임직원 영어 학습 도구로 도입을 검토합니다.',
    icon: '🏢',
    severity: 'good',
    probability: (state) => state.business.users.premium > 50 && state.player.social.reputation > 50 ? 0.015 : 0.003,
    minDay: 90,
    choices: [
      {
        id: 'enterprise_plan',
        text: '엔터프라이즈 플랜 제안',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'cash', value: 20000000 },
          { type: 'users', value: 300 },
          { type: 'reputation', value: 15 },
        ],
        resultText: '기업 고객 확보! 안정적인 B2B 매출이 시작됩니다!',
      },
      {
        id: 'standard_discount',
        text: '대량 할인만 제공',
        effects: [
          { type: 'cash', value: 8000000 },
          { type: 'users', value: 200 },
        ],
        resultText: '간단하게 처리했습니다. 엔터프라이즈 기능은 나중에.',
      },
      {
        id: 'not_ready',
        text: '아직 B2B 준비 안 됨',
        effects: [
          { type: 'reputation', value: -5 },
        ],
        resultText: '기회를 놓쳤습니다...',
      },
    ],
  },
  {
    id: 'biz_influencer_collab',
    name: '인플루언서 협업 제안',
    description: '영어 공부 유튜버(구독자 50만)가 협업을 제안했습니다.',
    icon: '🎬',
    severity: 'good',
    probability: (state) => state.player.social.reputation > 40 ? 0.015 : 0.005,
    choices: [
      {
        id: 'paid_sponsorship',
        text: '유료 스폰서십 (-500,000원)',
        effects: [
          { type: 'cash', value: -500000 },
          { type: 'users', value: 500 },
          { type: 'premium_users', value: 30 },
          { type: 'reputation', value: 20 },
        ],
        resultText: '영상이 업로드되고 가입자가 폭증했습니다!',
      },
      {
        id: 'affiliate',
        text: '제휴 마케팅 (매출의 20%)',
        effects: [
          { type: 'users', value: 300 },
          { type: 'premium_users', value: 15 },
        ],
        resultText: '성과 기반 협업! 서로 윈윈입니다.',
      },
      {
        id: 'free_account',
        text: '무료 계정만 제공',
        effects: [
          { type: 'cash', value: -9990 },
          { type: 'users', value: 100 },
        ],
        resultText: '작은 언급이라도 도움이 됩니다.',
      },
    ],
  },

  // ============================================
  // 재무 이벤트 (10개)
  // ============================================
  {
    id: 'biz_revenue_milestone',
    name: 'MRR 이정표 달성',
    description: '축하합니다! 월간 반복 매출(MRR)이 새로운 이정표를 달성했습니다!',
    icon: '🎊',
    severity: 'good',
    probability: (state) => {
      const mrr = state.business.users.premium * 9990;
      const milestones = [1000000, 5000000, 10000000, 50000000];
      for (const m of milestones) {
        if (mrr >= m && mrr < m * 1.1) return 0.5;
      }
      return 0;
    },
    choices: [
      {
        id: 'celebrate',
        text: '소셜 미디어에 공유',
        effects: [
          { type: 'reputation', value: 10 },
          { type: 'users', value: 30 },
        ],
        resultText: '많은 축하와 응원을 받았습니다!',
      },
      {
        id: 'reinvest',
        text: '성장에 재투자',
        effects: [
          { type: 'stability', value: 10 },
        ],
        resultText: '기록만 하고 다시 일에 집중합니다.',
      },
    ],
  },
  {
    id: 'biz_tax_deadline',
    name: '부가세 신고 기한',
    description: '부가세 신고 마감이 다가옵니다. 준비하셨나요?',
    icon: '📋',
    severity: 'warning',
    probability: (state) => {
      const month = state.time.currentDate.getMonth() + 1;
      return (month === 1 || month === 4 || month === 7 || month === 10) ? 0.3 : 0;
    },
    choices: [
      {
        id: 'do_myself',
        text: '직접 홈택스로 신고 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'skill_business', value: 1 },
        ],
        resultText: '몇 시간 고생했지만 해냈습니다!',
      },
      {
        id: 'hire_accountant',
        text: '세무사 의뢰 (-150,000원)',
        effects: [
          { type: 'cash', value: -150000 },
          { type: 'stress', value: -10 },
        ],
        resultText: '전문가가 처리해줍니다. 편하네요!',
      },
      {
        id: 'delay',
        text: '마감 직전에 하자...',
        effects: [
          { type: 'stress', value: 20 },
        ],
        resultText: '나중에 급하게 하게 될 것입니다.',
        probability: 0.5,
      },
    ],
  },
  {
    id: 'biz_cash_low',
    name: '현금 부족 경고',
    description: '현재 런웨이가 3개월 미만입니다. 긴급 조치가 필요합니다.',
    icon: '⚠️',
    severity: 'critical',
    probability: (state) => state.business.finance.runway < 3 ? 0.15 : 0,
    choices: [
      {
        id: 'cost_cut',
        text: '비용 절감 모드',
        effects: [
          { type: 'cash', value: 300000 },
          { type: 'stability', value: -10 },
          { type: 'stress', value: 15 },
        ],
        resultText: '불필요한 구독을 모두 해지했습니다.',
      },
      {
        id: 'emergency_fundraise',
        text: '긴급 자금 조달 시도',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'stress', value: 25 },
          { type: 'skill_business', value: 3 },
        ],
        resultText: '가능한 모든 연락처에 연락하고 있습니다...',
        probability: 0.4,
      },
      {
        id: 'part_time',
        text: '파트타임 프리랜서 시작',
        effects: [
          { type: 'cash', value: 2000000 },
          { type: 'energy', value: -40 },
          { type: 'stress', value: 20 },
        ],
        resultText: '본업과 병행하면 힘들지만 자금은 확보됩니다.',
      },
    ],
  },
  {
    id: 'biz_payment_failed',
    name: '결제 실패 알림',
    description: '프리미엄 사용자 5명의 결제가 실패했습니다.',
    icon: '💳',
    severity: 'warning',
    probability: (state) => state.business.users.premium > 30 ? 0.03 : 0.01,
    choices: [
      {
        id: 'dunning_email',
        text: '자동 재결제 요청 이메일 발송',
        effects: [
          { type: 'premium_users', value: -2 },
        ],
        resultText: '3명은 재결제했지만 2명은 이탈했습니다.',
      },
      {
        id: 'personal_outreach',
        text: '개인 연락으로 확인 (-10 에너지)',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'premium_users', value: -1 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '대부분 카드 문제였습니다. 감사 인사를 받았어요!',
      },
      {
        id: 'auto_cancel',
        text: '자동 구독 취소',
        effects: [
          { type: 'premium_users', value: -5 },
        ],
        resultText: '5명 모두 이탈했습니다...',
      },
    ],
  },
  {
    id: 'biz_price_increase',
    name: '가격 인상 고민',
    description: '운영 비용이 증가하고 있습니다. 가격 인상을 고려해봐야 할까요?',
    icon: '📈',
    severity: 'normal',
    probability: (state) => state.time.totalDays > 90 ? 0.01 : 0,
    minDay: 90,
    choices: [
      {
        id: 'increase_20',
        text: '20% 인상 (9,990원 → 11,990원)',
        effects: [
          { type: 'premium_users', value: -5 },
          { type: 'cash', value: 200000 },
          { type: 'reputation', value: -5 },
        ],
        resultText: '일부 사용자가 떠났지만 매출은 증가했습니다.',
      },
      {
        id: 'grandfather',
        text: '기존 사용자 유지, 신규만 인상',
        effects: [
          { type: 'reputation', value: 10 },
        ],
        resultText: '기존 사용자들이 감사해합니다!',
      },
      {
        id: 'keep_price',
        text: '가격 유지',
        effects: [
          { type: 'stress', value: 5 },
        ],
        resultText: '사용자를 잃지 않지만 수익성이 걱정됩니다.',
      },
    ],
  },
  {
    id: 'biz_refund_request',
    name: '환불 요청',
    description: '"1주일 써봤는데 제 스타일이 아니에요. 환불해주세요."',
    icon: '↩️',
    severity: 'normal',
    probability: (state) => state.business.users.premium > 20 ? 0.025 : 0.01,
    choices: [
      {
        id: 'full_refund',
        text: '전액 환불 (-9,990원)',
        effects: [
          { type: 'cash', value: -9990 },
          { type: 'premium_users', value: -1 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '깔끔하게 환불! 나중에 다시 올 수도 있습니다.',
      },
      {
        id: 'partial',
        text: '부분 환불 + 피드백 요청',
        effects: [
          { type: 'cash', value: -5000 },
          { type: 'premium_users', value: -1 },
          { type: 'skill_business', value: 1 },
        ],
        resultText: '유용한 피드백을 얻었습니다!',
      },
      {
        id: 'deny',
        text: '환불 거부 (정책상)',
        effects: [
          { type: 'reputation', value: -10 },
        ],
        resultText: '부정적인 리뷰가 달릴 수 있습니다.',
        probability: 0.7,
      },
    ],
  },

  // ============================================
  // 마케팅 이벤트 (8개)
  // ============================================
  {
    id: 'biz_app_featured',
    name: '앱스토어 피처드',
    description: 'Apple App Store에서 "오늘의 앱"으로 선정되었습니다!',
    icon: '🍎',
    severity: 'good',
    probability: (state) => state.business.users.total > 2000 && state.player.social.reputation > 70 ? 0.005 : 0.001,
    minDay: 60,
    maxOccurrences: 2,
    choices: [
      {
        id: 'prepare_server',
        text: '서버 증설 + 감사 이벤트',
        effects: [
          { type: 'cash', value: -200000 },
          { type: 'users', value: 3000 },
          { type: 'premium_users', value: 150 },
          { type: 'reputation', value: 30 },
        ],
        resultText: '역대급 가입자 수! 서버도 잘 버텼습니다!',
      },
      {
        id: 'let_it_be',
        text: '있는 그대로 노출',
        effects: [
          { type: 'users', value: 2000 },
          { type: 'premium_users', value: 80 },
          { type: 'server_health', value: -20 },
        ],
        resultText: '엄청난 유입! 하지만 서버가 좀 버거웠습니다.',
      },
    ],
  },
  {
    id: 'biz_product_hunt',
    name: 'Product Hunt 런칭',
    description: 'Product Hunt에 올릴 준비가 되었습니다!',
    icon: '🐱',
    severity: 'good',
    probability: (state) => state.time.totalDays > 45 && state.business.users.total > 200 ? 0.01 : 0,
    minDay: 45,
    maxOccurrences: 1,
    choices: [
      {
        id: 'full_launch',
        text: '대대적 런칭 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'users', value: 500 },
          { type: 'premium_users', value: 25 },
          { type: 'reputation', value: 20 },
        ],
        resultText: 'Top 5 달성! 국제적 인지도가 생겼습니다!',
      },
      {
        id: 'soft_launch',
        text: '조용히 등록만',
        effects: [
          { type: 'users', value: 100 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '작은 반응이지만 글로벌 사용자가 생겼습니다.',
      },
      {
        id: 'wait',
        text: '더 준비되면...',
        effects: [],
        resultText: '나중에 완벽하게 런칭하기로 했습니다.',
      },
    ],
  },
  {
    id: 'biz_google_ads',
    name: 'Google Ads 결과',
    description: '지난 주 Google Ads 캠페인 결과가 나왔습니다.',
    icon: '📊',
    severity: 'normal',
    probability: (state) => state.business.finance.cash > 500000 ? 0.02 : 0,
    choices: [
      {
        id: 'scale_up',
        text: '효과가 좋다면 예산 증가',
        effects: [
          { type: 'cash', value: -300000 },
          { type: 'users', value: 80 },
          { type: 'premium_users', value: 5 },
        ],
        resultText: 'CPA가 좋습니다! 마케팅을 확대합니다.',
      },
      {
        id: 'optimize',
        text: '키워드 최적화 후 유지',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'users', value: 40 },
          { type: 'skill_marketing', value: 2 },
        ],
        resultText: '분석하고 개선점을 찾았습니다.',
      },
      {
        id: 'pause',
        text: '캠페인 일시 중지',
        effects: [
          { type: 'cash', value: 50000 },
        ],
        resultText: '비용을 절약하고 다음 기회를 노립니다.',
      },
    ],
  },
  {
    id: 'biz_seo_opportunity',
    name: 'SEO 기회 발견',
    description: '"영어 단어 외우는 법" 키워드에서 순위가 올라가고 있습니다!',
    icon: '🔍',
    severity: 'good',
    probability: (state) => state.business.users.total > 300 ? 0.02 : 0.005,
    choices: [
      {
        id: 'content_push',
        text: '관련 콘텐츠 집중 생산 (-25 에너지)',
        effects: [
          { type: 'energy', value: -25 },
          { type: 'users', value: 100 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '블로그 시리즈를 작성했습니다! 트래픽 급증!',
      },
      {
        id: 'backlink',
        text: '백링크 구축 시도',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'users', value: 50 },
        ],
        resultText: '관련 사이트들과 링크를 교환했습니다.',
      },
      {
        id: 'observe',
        text: '자연스럽게 지켜본다',
        effects: [
          { type: 'users', value: 30 },
        ],
        resultText: '시간이 지나면서 순위가 더 올랐습니다.',
      },
    ],
  },
  {
    id: 'biz_viral_moment',
    name: '바이럴 기회',
    description: '트위터에서 "AI 영어 학습"에 대한 토론이 트렌딩입니다!',
    icon: '🔥',
    severity: 'good',
    probability: () => 0.008,
    choices: [
      {
        id: 'join_conversation',
        text: '대화에 참여 + 소개',
        effects: [
          { type: 'users', value: 200 },
          { type: 'reputation', value: 15 },
        ],
        resultText: '자연스러운 홍보! 많은 관심을 받았습니다!',
      },
      {
        id: 'ad_reply',
        text: '광고 트윗으로 응수 (-50,000원)',
        effects: [
          { type: 'cash', value: -50000 },
          { type: 'users', value: 150 },
          { type: 'reputation', value: -5 },
        ],
        resultText: '노출은 됐지만 일부가 광고라고 지적했습니다.',
      },
      {
        id: 'watch',
        text: '지켜본다',
        effects: [
          { type: 'users', value: 30 },
        ],
        resultText: '기회를 놓쳤지만 다음에 또 올 것입니다.',
      },
    ],
  },

  // ============================================
  // 경쟁 관련 이벤트 (5개)
  // ============================================
  {
    id: 'biz_competitor_funding',
    name: '경쟁사 투자 유치 뉴스',
    description: '경쟁 앱이 시리즈 A 100억원 투자를 받았습니다!',
    icon: '📰',
    severity: 'warning',
    probability: (state) => state.time.totalDays > 60 ? 0.01 : 0,
    minDay: 60,
    choices: [
      {
        id: 'stay_focused',
        text: '우리 강점에 집중',
        effects: [
          { type: 'stress', value: 10 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '1인 개발의 민첩함이 우리 무기입니다.',
      },
      {
        id: 'differentiate',
        text: '차별화 전략 강화 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'skill_business', value: 3 },
        ],
        resultText: '경쟁사와 다른 USP를 더 부각시켰습니다.',
      },
      {
        id: 'accelerate',
        text: '성장 속도 가속 (-40 에너지)',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'stress', value: 15 },
          { type: 'users', value: 50 },
        ],
        resultText: '위기감을 에너지로! 더 열심히 달립니다.',
      },
    ],
  },
  {
    id: 'biz_competitor_copy',
    name: '경쟁사가 기능 카피',
    description: '우리의 핵심 기능이 경쟁 앱에 그대로 복사되어 나타났습니다!',
    icon: '📋',
    severity: 'warning',
    probability: (state) => state.business.users.total > 1000 ? 0.015 : 0.005,
    minDay: 60,
    choices: [
      {
        id: 'innovate',
        text: '더 혁신적인 기능 개발 (-40 에너지)',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'reputation', value: 15 },
          { type: 'skill_coding', value: 3 },
        ],
        resultText: '한 발 더 앞서갑니다! 이것이 1인 개발의 속도!',
      },
      {
        id: 'legal',
        text: '법적 대응 검토',
        effects: [
          { type: 'cash', value: -300000 },
          { type: 'stress', value: 20 },
        ],
        resultText: '변호사 상담 결과, 법적 보호는 어렵다고 합니다.',
      },
      {
        id: 'public_call',
        text: '공개적으로 언급',
        effects: [
          { type: 'reputation', value: 10 },
          { type: 'users', value: 50 },
        ],
        resultText: '커뮤니티가 우리 편을 들어주었습니다!',
        probability: 0.6,
      },
    ],
  },
  {
    id: 'biz_competitor_shutdown',
    name: '경쟁사 서비스 종료',
    description: '경쟁 앱 중 하나가 갑자기 서비스를 종료했습니다!',
    icon: '💀',
    severity: 'good',
    probability: () => 0.005,
    choices: [
      {
        id: 'acquire_users',
        text: '이탈 사용자 유치 마케팅 (-300,000원)',
        effects: [
          { type: 'cash', value: -300000 },
          { type: 'users', value: 500 },
          { type: 'premium_users', value: 30 },
        ],
        resultText: '대규모 사용자 유입! "대안 앱" 검색 1위!',
      },
      {
        id: 'data_migration',
        text: '데이터 마이그레이션 도구 제공 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'users', value: 300 },
          { type: 'reputation', value: 20 },
        ],
        resultText: '고객 친화적 접근! 좋은 인상을 남겼습니다.',
      },
      {
        id: 'observe',
        text: '자연스럽게 기다린다',
        effects: [
          { type: 'users', value: 100 },
        ],
        resultText: '일부 사용자가 자연스럽게 유입되었습니다.',
      },
    ],
  },
  {
    id: 'biz_acquisition_offer',
    name: '인수 제안',
    description: '대형 교육 기업에서 VocaVision 인수를 제안했습니다!',
    icon: '🤝',
    severity: 'good',
    probability: (state) => state.business.users.premium > 500 && state.player.social.reputation > 80 ? 0.003 : 0,
    minDay: 180,
    maxOccurrences: 1,
    choices: [
      {
        id: 'negotiate',
        text: '협상 시작',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'skill_business', value: 5 },
          { type: 'stress', value: 30 },
        ],
        resultText: '흥미로운 제안... 진지하게 검토해봅니다.',
      },
      {
        id: 'decline',
        text: '정중히 거절',
        effects: [
          { type: 'reputation', value: 15 },
          { type: 'stress', value: -10 },
        ],
        resultText: '아직 할 일이 많습니다. 계속 성장하겠습니다!',
      },
    ],
  },
  {
    id: 'biz_market_expansion',
    name: '해외 시장 기회',
    description: '일본에서 영어 학습 앱에 대한 관심이 급증하고 있습니다.',
    icon: '🌏',
    severity: 'good',
    probability: (state) => state.business.users.total > 3000 ? 0.01 : 0.002,
    minDay: 120,
    choices: [
      {
        id: 'localize',
        text: '일본어 현지화 (-60 에너지, -1,000,000원)',
        effects: [
          { type: 'energy', value: -60 },
          { type: 'cash', value: -1000000 },
          { type: 'users', value: 500 },
          { type: 'reputation', value: 20 },
        ],
        resultText: '일본 App Store에 출시! 새로운 시장이 열립니다!',
      },
      {
        id: 'partner',
        text: '현지 파트너 찾기',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'skill_business', value: 3 },
        ],
        resultText: '일본 현지 파트너와 협의를 시작했습니다.',
      },
      {
        id: 'focus_korea',
        text: '한국 시장에 집중',
        effects: [],
        resultText: '지금은 국내 시장을 탄탄히 하기로 했습니다.',
      },
    ],
  },
];

export default BUSINESS_EVENTS;
