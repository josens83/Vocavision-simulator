/**
 * Chapter 2: Realism Engine - Probabilistic Event Engine
 * 상황 인식 확률적 이벤트 시스템
 */

import type { GameState, GameEvent, Effect, DecisionOption } from '../types';
import { STARTUP_SURVIVAL_DATA } from '../data/statistics';

// ============================================
// 이벤트 확률 시스템
// ============================================

export interface EventProbability {
  category: EventCategory;
  baseWeight: number;
  events: ProbabilisticEvent[];
}

export type EventCategory = 'technical' | 'business' | 'user' | 'personal' | 'market';

export interface ProbabilisticEvent {
  id: string;
  name: string;
  description: string;
  icon: string;
  severity: 'critical' | 'warning' | 'good' | 'normal';
  probability: (state: GameState) => number;
  condition?: (state: GameState) => boolean;
  choices: EventChoice[];
  minDay?: number;
  maxOccurrences?: number;
}

export interface EventChoice {
  id: string;
  text: string;
  effects: Effect[];
  resultText: string;
  probability?: number; // 선택지별 성공 확률
}

// 카테고리별 기본 가중치
const CATEGORY_WEIGHTS: Record<EventCategory, number> = {
  technical: 25,
  business: 20,
  user: 30,
  personal: 15,
  market: 10,
};

// 상황별 가중치 조정
export function adjustCategoryWeights(state: GameState): Record<EventCategory, number> {
  const weights = { ...CATEGORY_WEIGHTS };

  // 월요일: 기술 이슈 증가
  const dayOfWeek = state.time.currentDate.getDay();
  if (dayOfWeek === 1) {
    weights.technical *= 1.3;
    weights.user *= 0.9;
  }

  // 금요일: 개인 이벤트 증가
  if (dayOfWeek === 5) {
    weights.personal *= 1.4;
    weights.business *= 0.8;
  }

  // 최근 제품 출시: 기술/사용자 이벤트 증가
  // (가정: recentProductLaunch가 있다면)
  const recentLaunch = false;
  if (recentLaunch) {
    weights.technical *= 1.5;
    weights.user *= 1.3;
  }

  // 자금 부족: 비즈니스 이벤트 증가
  if (state.business.finance.runway < 6) {
    weights.business *= 1.5;
    weights.personal *= 1.2;
  }

  // 스트레스 높음: 개인 이벤트 증가
  if (state.player.health.stress > 60) {
    weights.personal *= 1.5;
  }

  return weights;
}

// ============================================
// 확률적 이벤트 데이터
// ============================================

export const PROBABILISTIC_EVENTS: EventProbability[] = [
  // 기술 이벤트
  {
    category: 'technical',
    baseWeight: 25,
    events: [
      {
        id: 'server_outage',
        name: '서버 장애',
        description: '갑자기 서버가 응답하지 않습니다! 사용자들이 접속할 수 없어요.',
        icon: '💥',
        severity: 'critical',
        probability: (state) => (100 - state.business.infrastructure.serverHealth) * 0.005,
        choices: [
          {
            id: 'fix_immediately',
            text: '즉시 수동 복구 (-25 에너지)',
            effects: [
              { type: 'energy', value: -25 },
              { type: 'server_health', value: 30 },
              { type: 'stress', value: 15 },
            ],
            resultText: '2시간의 긴급 작업 끝에 서버가 복구되었습니다!',
          },
          {
            id: 'contact_support',
            text: '호스팅 업체에 연락',
            effects: [
              { type: 'reputation', value: -10 },
              { type: 'users', value: -5 },
            ],
            resultText: '4시간 후 자동 복구되었지만 일부 사용자가 이탈했습니다.',
          },
          {
            id: 'migrate',
            text: '다른 서버로 긴급 이전 (-500,000원)',
            effects: [
              { type: 'cash', value: -500000 },
              { type: 'server_health', value: 50 },
              { type: 'reputation', value: 5 },
            ],
            resultText: '비용이 들었지만 더 안정적인 환경으로 이전했습니다!',
          },
        ],
      },
      {
        id: 'ddos_attack',
        name: 'DDoS 공격',
        description: '서비스에 대량의 악성 트래픽이 유입되고 있습니다!',
        icon: '🔒',
        severity: 'critical',
        probability: (state) => state.business.users.total > 1000 ? 0.001 : 0.0001,
        minDay: 30,
        choices: [
          {
            id: 'cloudflare',
            text: 'Cloudflare 무료 플랜 적용 (-15 에너지)',
            effects: [
              { type: 'energy', value: -15 },
              { type: 'server_health', value: -10 },
            ],
            resultText: '기본적인 방어는 되었지만 일부 영향이 있었습니다.',
          },
          {
            id: 'cloudflare_pro',
            text: 'Cloudflare Pro 구독 (-30,000원/월)',
            effects: [
              { type: 'cash', value: -30000 },
              { type: 'server_health', value: 10 },
            ],
            resultText: 'WAF가 대부분의 공격을 차단했습니다!',
          },
          {
            id: 'wait',
            text: '공격이 끝나길 기다린다',
            effects: [
              { type: 'server_health', value: -30 },
              { type: 'reputation', value: -15 },
              { type: 'users', value: -20 },
            ],
            resultText: '6시간 동안 서비스가 불안정했고 많은 사용자가 떠났습니다.',
          },
        ],
      },
      {
        id: 'dependency_vulnerability',
        name: 'npm 패키지 보안 취약점',
        description: 'Snyk에서 높은 심각도의 취약점이 발견되었습니다!',
        icon: '⚠️',
        severity: 'warning',
        probability: () => 0.01,
        choices: [
          {
            id: 'update_now',
            text: '즉시 패키지 업데이트 (-10 에너지)',
            effects: [
              { type: 'energy', value: -10 },
              { type: 'stability', value: 5 },
            ],
            resultText: '신속하게 취약점을 패치했습니다!',
          },
          {
            id: 'next_release',
            text: '다음 릴리즈에 포함',
            effects: [
              { type: 'stability', value: -5 },
            ],
            resultText: '취약점이 잠시 남아있지만 다음 배포 때 수정할 예정입니다.',
            probability: 0.7,
          },
          {
            id: 'security_audit',
            text: '전체 보안 감사 의뢰 (-1,000,000원)',
            effects: [
              { type: 'cash', value: -1000000 },
              { type: 'stability', value: 20 },
              { type: 'reputation', value: 10 },
            ],
            resultText: '전문 보안 업체의 감사로 여러 취약점을 발견하고 수정했습니다!',
          },
        ],
      },
      {
        id: 'api_rate_limit',
        name: 'OpenAI API 한도 초과',
        description: 'AI 기능 사용량이 급증하여 API 한도에 도달했습니다!',
        icon: '🤖',
        severity: 'warning',
        probability: (state) => state.business.users.dau > 100 ? 0.02 : 0.005,
        choices: [
          {
            id: 'upgrade_plan',
            text: '요금제 업그레이드 (비용 2배)',
            effects: [{ type: 'cash', value: -100000 }],
            resultText: 'API 한도가 늘어나 서비스가 정상화되었습니다.',
          },
          {
            id: 'implement_cache',
            text: '캐싱 시스템 구축 (-30 에너지)',
            effects: [
              { type: 'energy', value: -30 },
              { type: 'skill_coding', value: 2 },
            ],
            resultText: '캐싱으로 API 호출을 50% 줄였습니다!',
          },
          {
            id: 'limit_users',
            text: '사용량 제한 적용',
            effects: [
              { type: 'reputation', value: -10 },
              { type: 'premium_users', value: -2 },
            ],
            resultText: '일부 프리미엄 사용자가 불만을 표시했습니다.',
          },
        ],
      },
    ],
  },

  // 비즈니스 이벤트
  {
    category: 'business',
    baseWeight: 20,
    events: [
      {
        id: 'investor_contact',
        name: '투자자 연락',
        description: '엔젤 투자자가 VocaVision에 관심을 보이고 있습니다!',
        icon: '💰',
        severity: 'good',
        probability: (state) => state.business.users.total > 500 ? 0.02 : 0.005,
        minDay: 30,
        choices: [
          {
            id: 'accept_meeting',
            text: '미팅 수락 (-5 에너지)',
            effects: [
              { type: 'energy', value: -5 },
              { type: 'skill_business', value: 2 },
            ],
            resultText: '투자자와 좋은 대화를 나눴습니다. 후속 미팅을 제안받았습니다!',
          },
          {
            id: 'decline_politely',
            text: '정중히 거절',
            effects: [{ type: 'reputation', value: 2 }],
            resultText: '아직은 독립적으로 성장하기로 했습니다.',
          },
        ],
      },
      {
        id: 'partnership_offer',
        name: '파트너십 제안',
        description: '대형 어학원에서 B2B 제휴를 제안했습니다!',
        icon: '🤝',
        severity: 'good',
        probability: (state) => state.player.social.reputation > 60 ? 0.015 : 0.005,
        minDay: 60,
        choices: [
          {
            id: 'full_partnership',
            text: '전체 계약 (500명, 월 200만원)',
            effects: [
              { type: 'users', value: 500 },
              { type: 'cash', value: 2000000 },
              { type: 'stress', value: 20 },
              { type: 'reputation', value: 15 },
            ],
            resultText: '대형 계약 성사! 관리 부담이 늘었지만 수익이 크게 증가했습니다!',
          },
          {
            id: 'pilot_program',
            text: '파일럿 프로그램 (50명, 무료)',
            effects: [
              { type: 'users', value: 50 },
              { type: 'reputation', value: 5 },
            ],
            resultText: '작게 시작해서 검증해보기로 했습니다.',
          },
          {
            id: 'decline',
            text: '준비가 안 됐다고 거절',
            effects: [{ type: 'reputation', value: -3 }],
            resultText: '기회를 놓쳤지만 현실적인 판단일 수도 있습니다.',
          },
        ],
      },
      {
        id: 'cash_flow_warning',
        name: '현금 흐름 경고',
        description: '이번 달 말 지출이 수입을 크게 초과할 예정입니다.',
        icon: '💸',
        severity: 'warning',
        probability: (state) => state.business.finance.runway < 3 ? 0.1 : 0,
        choices: [
          {
            id: 'cut_costs',
            text: '긴급 비용 절감',
            effects: [
              { type: 'stability', value: -10 },
              { type: 'stress', value: 10 },
            ],
            resultText: '일부 서비스를 축소하여 비용을 줄였습니다.',
          },
          {
            id: 'seek_loan',
            text: '긴급 대출 신청 (+500만원, 이자 발생)',
            effects: [{ type: 'cash', value: 5000000 }],
            resultText: '긴급 자금을 확보했습니다. 매월 이자가 발생합니다.',
          },
          {
            id: 'emergency_fundraise',
            text: '긴급 투자 유치 시도 (-20 에너지)',
            effects: [
              { type: 'energy', value: -20 },
              { type: 'stress', value: 15 },
            ],
            resultText: '투자자들을 만났지만 즉각적인 결과는 없었습니다.',
            probability: 0.3,
          },
        ],
      },
    ],
  },

  // 사용자 이벤트
  {
    category: 'user',
    baseWeight: 30,
    events: [
      {
        id: 'viral_post',
        name: '바이럴 게시물',
        description: '한 사용자의 학습 인증샷이 SNS에서 화제입니다!',
        icon: '🌟',
        severity: 'good',
        probability: (state) => state.business.users.nps > 50 ? 0.01 : 0.003,
        choices: [
          {
            id: 'repost',
            text: '공식 계정으로 리포스트',
            effects: [
              { type: 'users', value: 80 },
              { type: 'premium_users', value: 5 },
              { type: 'reputation', value: 10 },
            ],
            resultText: '자연스러운 홍보 효과! 신규 가입이 급증했습니다!',
          },
          {
            id: 'free_subscription',
            text: '해당 사용자에게 1년 무료 구독 제공',
            effects: [
              { type: 'cash', value: -119880 },
              { type: 'users', value: 120 },
              { type: 'premium_users', value: 8 },
              { type: 'reputation', value: 20 },
            ],
            resultText: '사용자가 감동받아 추가로 홍보해줬습니다! 대박!',
          },
          {
            id: 'observe',
            text: '지켜본다',
            effects: [{ type: 'users', value: 30 }],
            resultText: '조용히 지나갔지만 일부 효과는 있었습니다.',
          },
        ],
      },
      {
        id: 'negative_review',
        name: '부정적인 앱스토어 리뷰',
        description: '1점 리뷰: "단어가 너무 적어요. 환불 원합니다."',
        icon: '⭐',
        severity: 'warning',
        probability: (state) =>
          state.business.product.bugs?.length ? 0.03 : 0.01,
        choices: [
          {
            id: 'respond_refund',
            text: '정중히 답변 + 환불 (-9,990원)',
            effects: [
              { type: 'cash', value: -9990 },
              { type: 'reputation', value: 5 },
            ],
            resultText: '사용자가 리뷰를 3점으로 수정했습니다.',
          },
          {
            id: 'respond_plan',
            text: '단어 추가 계획을 안내',
            effects: [{ type: 'reputation', value: -2 }],
            resultText: '기다려보겠다고 했지만 확신은 없어 보입니다.',
          },
          {
            id: 'ignore',
            text: '무시한다',
            effects: [
              { type: 'reputation', value: -8 },
              { type: 'users', value: -3 },
            ],
            resultText: '다른 잠재 사용자들이 가입을 망설입니다.',
          },
        ],
      },
      {
        id: 'feature_request',
        name: '기능 요청 청원',
        description: '100명 이상의 사용자가 발음 기능을 요청하고 있습니다!',
        icon: '📢',
        severity: 'normal',
        probability: (state) => state.business.users.total > 500 ? 0.015 : 0,
        choices: [
          {
            id: 'implement_basic',
            text: 'Web Speech API로 구현 (-25 에너지)',
            effects: [
              { type: 'energy', value: -25 },
              { type: 'reputation', value: 15 },
              { type: 'premium_users', value: 5 },
            ],
            resultText: '사용자들이 새 기능에 열광합니다!',
          },
          {
            id: 'implement_premium',
            text: 'Google TTS API 연동 (-80,000원/월)',
            effects: [
              { type: 'cash', value: -80000 },
              { type: 'reputation', value: 20 },
              { type: 'premium_users', value: 10 },
            ],
            resultText: '고품질 음성으로 만족도가 크게 올랐습니다!',
          },
          {
            id: 'acknowledge',
            text: '"검토해보겠습니다" 답변',
            effects: [{ type: 'reputation', value: -5 }],
            resultText: '사용자들이 약간 실망한 것 같습니다.',
          },
        ],
      },
      {
        id: 'user_milestone',
        name: '사용자 이정표',
        description: '축하합니다! 사용자 수가 새로운 이정표를 달성했습니다!',
        icon: '🎉',
        severity: 'good',
        probability: (state) => {
          const milestones = [100, 500, 1000, 5000, 10000];
          const total = state.business.users.total;
          for (const m of milestones) {
            if (total >= m && total < m * 1.1) return 0.5;
          }
          return 0;
        },
        choices: [
          {
            id: 'celebrate',
            text: '소셜 미디어에 공유',
            effects: [
              { type: 'users', value: 20 },
              { type: 'reputation', value: 5 },
            ],
            resultText: '팔로워들이 축하 메시지를 보내왔습니다!',
          },
          {
            id: 'discount',
            text: '기념 할인 이벤트 진행',
            effects: [
              { type: 'premium_users', value: 15 },
              { type: 'reputation', value: 10 },
            ],
            resultText: '많은 사용자가 프리미엄으로 전환했습니다!',
          },
        ],
      },
    ],
  },

  // 개인 이벤트
  {
    category: 'personal',
    baseWeight: 15,
    events: [
      {
        id: 'burnout_warning',
        name: '번아웃 징후',
        description: '최근 잠을 제대로 못 잤습니다. 집중력이 떨어지고 실수가 잦아집니다.',
        icon: '😴',
        severity: 'warning',
        probability: (state) => state.player.health.burnoutRisk > 60 ? 0.1 : 0.02,
        choices: [
          {
            id: 'rest_day',
            text: '하루 완전 휴식',
            effects: [
              { type: 'energy', value: 40 },
              { type: 'stress', value: -25 },
              { type: 'mental', value: 15 },
            ],
            resultText: '푹 쉬고 나니 다시 의욕이 생깁니다!',
          },
          {
            id: 'push_through',
            text: '그래도 일한다',
            effects: [
              { type: 'energy', value: -15 },
              { type: 'stress', value: 20 },
              { type: 'stability', value: -5 },
            ],
            resultText: '결국 실수로 버그를 하나 더 만들었습니다...',
          },
          {
            id: 'exercise',
            text: '운동을 다녀온다 (-2시간)',
            effects: [
              { type: 'energy', value: 15 },
              { type: 'stress', value: -15 },
              { type: 'health', value: 5 },
            ],
            resultText: '가벼운 운동 후 머리가 맑아졌습니다!',
          },
        ],
      },
      {
        id: 'health_issue',
        name: '건강 문제',
        description: '최근 불규칙한 생활로 몸에 이상 신호가 왔습니다.',
        icon: '🏥',
        severity: 'warning',
        probability: (state) => state.player.health.physical < 40 ? 0.05 : 0.01,
        choices: [
          {
            id: 'see_doctor',
            text: '병원 방문 (-100,000원, -반나절)',
            effects: [
              { type: 'cash', value: -100000 },
              { type: 'energy', value: -10 },
              { type: 'health', value: 20 },
            ],
            resultText: '다행히 큰 문제는 없었지만 생활 습관 개선이 필요합니다.',
          },
          {
            id: 'ignore',
            text: '무시하고 계속 일한다',
            effects: [
              { type: 'health', value: -10 },
              { type: 'stress', value: 10 },
            ],
            resultText: '증상이 계속됩니다. 나중에 더 심각해질 수 있습니다.',
            probability: 0.6,
          },
        ],
      },
      {
        id: 'skill_breakthrough',
        name: '스킬 돌파',
        description: '집중적인 학습으로 새로운 기술적 통찰을 얻었습니다!',
        icon: '💡',
        severity: 'good',
        probability: () => 0.02,
        choices: [
          {
            id: 'apply_immediately',
            text: '바로 프로젝트에 적용',
            effects: [
              { type: 'skill_coding', value: 5 },
              { type: 'stability', value: 10 },
            ],
            resultText: '새로운 기술로 코드 품질이 크게 향상되었습니다!',
          },
          {
            id: 'document',
            text: '블로그에 정리',
            effects: [
              { type: 'skill_coding', value: 3 },
              { type: 'reputation', value: 5 },
              { type: 'users', value: 10 },
            ],
            resultText: '기술 블로그가 화제가 되어 유입이 늘었습니다!',
          },
        ],
      },
      {
        id: 'media_interview',
        name: '미디어 인터뷰 요청',
        description: 'IT 매체에서 1인 개발자 인터뷰를 요청했습니다.',
        icon: '🎤',
        severity: 'good',
        probability: (state) => state.player.social.reputation > 70 ? 0.01 : 0.002,
        minDay: 60,
        choices: [
          {
            id: 'accept',
            text: '인터뷰에 응한다 (-15 에너지)',
            effects: [
              { type: 'energy', value: -15 },
              { type: 'reputation', value: 25 },
              { type: 'users', value: 100 },
              { type: 'premium_users', value: 8 },
            ],
            resultText: '기사가 나가고 많은 관심을 받았습니다!',
          },
          {
            id: 'written',
            text: '서면 인터뷰로 대체',
            effects: [
              { type: 'reputation', value: 12 },
              { type: 'users', value: 40 },
            ],
            resultText: '효율적으로 처리했고 적당한 홍보 효과를 얻었습니다.',
          },
          {
            id: 'decline',
            text: '정중히 거절',
            effects: [],
            resultText: '기회를 놓쳤지만 시간은 절약했습니다.',
          },
        ],
      },
    ],
  },

  // 시장 이벤트
  {
    category: 'market',
    baseWeight: 10,
    events: [
      {
        id: 'competitor_feature',
        name: '경쟁사 신규 기능',
        description: '경쟁 앱이 AI 이미지 생성 기능을 출시했습니다. SNS에서 화제입니다.',
        icon: '⚔️',
        severity: 'warning',
        probability: () => 0.01,
        choices: [
          {
            id: 'develop_similar',
            text: 'DALL-E 3 연동 개발 (-50 에너지, -500,000원)',
            effects: [
              { type: 'energy', value: -50 },
              { type: 'cash', value: -500000 },
              { type: 'reputation', value: 15 },
              { type: 'users', value: 50 },
            ],
            resultText: '2주 후 더 나은 품질의 기능을 출시했습니다!',
          },
          {
            id: 'differentiate',
            text: '우리만의 강점을 홍보',
            effects: [
              { type: 'reputation', value: 5 },
              { type: 'users', value: 20 },
            ],
            resultText: '차별화된 가치를 강조하니 관심있는 사용자들이 유입되었습니다.',
          },
          {
            id: 'ignore',
            text: '무시하고 원래 로드맵 진행',
            effects: [
              { type: 'users', value: -15 },
              { type: 'reputation', value: -8 },
            ],
            resultText: '일부 사용자들이 경쟁 앱으로 이동했습니다.',
          },
        ],
      },
      {
        id: 'market_trend',
        name: '시장 트렌드 변화',
        description: '"AI 영어 학습"이 검색 트렌드 1위를 기록했습니다!',
        icon: '📈',
        severity: 'good',
        probability: () => 0.005,
        choices: [
          {
            id: 'capitalize',
            text: '트렌드에 맞춰 마케팅 강화 (-200,000원)',
            effects: [
              { type: 'cash', value: -200000 },
              { type: 'users', value: 80 },
              { type: 'premium_users', value: 8 },
            ],
            resultText: '적절한 타이밍! 마케팅 효율이 극대화되었습니다!',
          },
          {
            id: 'observe',
            text: '추세를 지켜본다',
            effects: [{ type: 'users', value: 20 }],
            resultText: '자연스러운 유입 증가를 경험했습니다.',
          },
        ],
      },
      {
        id: 'regulatory_news',
        name: '규제 관련 뉴스',
        description: 'EdTech 서비스에 대한 새로운 개인정보보호 가이드라인이 발표되었습니다.',
        icon: '📋',
        severity: 'normal',
        probability: () => 0.003,
        choices: [
          {
            id: 'comply_early',
            text: '선제적으로 준수 (-30 에너지)',
            effects: [
              { type: 'energy', value: -30 },
              { type: 'reputation', value: 10 },
            ],
            resultText: '빠른 대응으로 사용자 신뢰도가 높아졌습니다!',
          },
          {
            id: 'wait_clarification',
            text: '세부 사항을 기다린다',
            effects: [],
            resultText: '추가 가이드라인이 나올 때까지 기다리기로 했습니다.',
          },
          {
            id: 'hire_consultant',
            text: '법률 자문 의뢰 (-500,000원)',
            effects: [
              { type: 'cash', value: -500000 },
              { type: 'reputation', value: 5 },
            ],
            resultText: '전문가의 조언으로 완벽하게 준비했습니다.',
          },
        ],
      },
    ],
  },
];

// ============================================
// 이벤트 선택 엔진
// ============================================

// 일일 이벤트 발생 확률
const DAILY_EVENT_CHANCE = 0.25; // 25%

// 이벤트 발생 체크
export function checkForEvent(state: GameState): ProbabilisticEvent | null {
  // 기본 이벤트 발생 확률
  if (Math.random() > DAILY_EVENT_CHANCE) {
    return null;
  }

  // 카테고리 가중치 조정
  const weights = adjustCategoryWeights(state);
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  // 카테고리 선택
  let roll = Math.random() * totalWeight;
  let selectedCategory: EventCategory | null = null;

  for (const [category, weight] of Object.entries(weights) as [EventCategory, number][]) {
    roll -= weight;
    if (roll <= 0) {
      selectedCategory = category;
      break;
    }
  }

  if (!selectedCategory) return null;

  // 해당 카테고리의 이벤트 목록
  const categoryData = PROBABILISTIC_EVENTS.find(e => e.category === selectedCategory);
  if (!categoryData) return null;

  // 조건을 만족하고 확률을 통과하는 이벤트 선택
  const eligibleEvents = categoryData.events.filter(event => {
    // 최소 일 수 체크
    if (event.minDay && state.time.totalDays < event.minDay) return false;

    // 조건 체크
    if (event.condition && !event.condition(state)) return false;

    // 확률 체크
    const probability = event.probability(state);
    return Math.random() < probability;
  });

  if (eligibleEvents.length === 0) return null;

  // 랜덤 선택
  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
}

// ProbabilisticEvent를 GameEvent로 변환
export function convertToGameEvent(event: ProbabilisticEvent): GameEvent {
  return {
    id: event.id,
    title: event.name,
    description: event.description,
    icon: event.icon,
    severity: event.severity,
    type: 'random',
    choices: event.choices.map(choice => ({
      id: choice.id,
      text: choice.text,
      effects: {
        immediate: choice.effects,
        delayed: [],
        probability: [],
      },
      resultText: choice.resultText,
      requirements: {},
    })),
  };
}

// 이벤트 발생 및 변환
export function generateDailyEvent(state: GameState): GameEvent | null {
  const event = checkForEvent(state);
  if (!event) return null;

  return convertToGameEvent(event);
}

// ============================================
// Enhanced Event Engine (Chapter 3 통합)
// ============================================

// Enhanced 이벤트 사용 플래그
let useEnhancedEvents = false;
let enhancedEvents: EventProbability[] | null = null;

// Enhanced 이벤트 활성화
export function enableEnhancedEvents(events: EventProbability[]): void {
  useEnhancedEvents = true;
  enhancedEvents = events;
}

// Enhanced 이벤트로 체크
export function checkForEnhancedEvent(state: GameState): ProbabilisticEvent | null {
  const eventsToUse = useEnhancedEvents && enhancedEvents ? enhancedEvents : PROBABILISTIC_EVENTS;

  // 기본 이벤트 발생 확률
  if (Math.random() > DAILY_EVENT_CHANCE) {
    return null;
  }

  // 카테고리 가중치 조정
  const weights = adjustCategoryWeights(state);
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  // 카테고리 선택
  let roll = Math.random() * totalWeight;
  let selectedCategory: EventCategory | null = null;

  for (const [category, weight] of Object.entries(weights) as [EventCategory, number][]) {
    roll -= weight;
    if (roll <= 0) {
      selectedCategory = category;
      break;
    }
  }

  if (!selectedCategory) return null;

  // 해당 카테고리의 이벤트 목록
  const categoryData = eventsToUse.find(e => e.category === selectedCategory);
  if (!categoryData) return null;

  // 조건을 만족하고 확률을 통과하는 이벤트 선택
  const eligibleEvents = categoryData.events.filter(event => {
    // 최소 일 수 체크
    if (event.minDay && state.time.totalDays < event.minDay) return false;

    // 조건 체크
    if (event.condition && !event.condition(state)) return false;

    // 확률 체크
    const probability = event.probability(state);
    return Math.random() < probability;
  });

  if (eligibleEvents.length === 0) return null;

  // 랜덤 선택
  return eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
}

// Enhanced 일일 이벤트 생성
export function generateEnhancedDailyEvent(state: GameState): GameEvent | null {
  const event = checkForEnhancedEvent(state);
  if (!event) return null;

  return convertToGameEvent(event);
}

// 이벤트 통계
export function getEventStatistics(): {
  baseEventsCount: number;
  enhancedEventsCount: number;
  isEnhanced: boolean;
} {
  let baseCount = 0;
  for (const cat of PROBABILISTIC_EVENTS) {
    baseCount += cat.events.length;
  }

  let enhancedCount = 0;
  if (enhancedEvents) {
    for (const cat of enhancedEvents) {
      enhancedCount += cat.events.length;
    }
  }

  return {
    baseEventsCount: baseCount,
    enhancedEventsCount: enhancedCount,
    isEnhanced: useEnhancedEvents,
  };
}
