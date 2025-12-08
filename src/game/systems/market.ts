/**
 * Chapter 2: Realism Engine - Market Dynamics Simulation
 * 경쟁사 AI, 거시경제, 트렌드, 규제 시뮬레이션
 */

import type { GameState, Effect } from '../types';
import { COMPETITOR_DATA } from '../data/statistics';

// ============================================
// 거시 경제 시뮬레이션
// ============================================

export interface EconomicState {
  phase: 'expansion' | 'peak' | 'contraction' | 'trough';
  exchangeRate: number; // USD/KRW
  interestRate: number;
  consumerConfidence: number; // 0-100
  inflationRate: number;
}

export interface EconomicEffects {
  adCostMultiplier: number;
  conversionMultiplier: number;
  investmentAvailability: number;
  customerSpending: number;
}

// 경기 사이클 효과
const ECONOMIC_PHASE_EFFECTS: Record<EconomicState['phase'], EconomicEffects> = {
  expansion: {
    adCostMultiplier: 1.2,
    conversionMultiplier: 1.15,
    investmentAvailability: 1.4,
    customerSpending: 1.1,
  },
  peak: {
    adCostMultiplier: 1.4,
    conversionMultiplier: 1.0,
    investmentAvailability: 1.2,
    customerSpending: 1.0,
  },
  contraction: {
    adCostMultiplier: 0.8,
    conversionMultiplier: 0.85,
    investmentAvailability: 0.6,
    customerSpending: 0.85,
  },
  trough: {
    adCostMultiplier: 0.6,
    conversionMultiplier: 0.75,
    investmentAvailability: 0.4,
    customerSpending: 0.75,
  },
};

// 기본 경제 상태
export const DEFAULT_ECONOMIC_STATE: EconomicState = {
  phase: 'expansion',
  exchangeRate: 1300, // USD/KRW
  interestRate: 0.035, // 3.5%
  consumerConfidence: 70,
  inflationRate: 0.03, // 3%
};

// 경제 상태 업데이트 (일일)
export function updateEconomicState(current: EconomicState): EconomicState {
  const newState = { ...current };

  // 환율 변동 (±0.5%)
  newState.exchangeRate *= 1 + (Math.random() - 0.5) * 0.01;
  newState.exchangeRate = Math.max(1100, Math.min(1500, newState.exchangeRate));

  // 소비자 신뢰도 변동 (±1)
  newState.consumerConfidence += (Math.random() - 0.5) * 2;
  newState.consumerConfidence = Math.max(30, Math.min(100, newState.consumerConfidence));

  // 경기 사이클 전환 (낮은 확률)
  if (Math.random() < 0.002) { // 0.2% 일일 전환 확률
    const phases: EconomicState['phase'][] = ['expansion', 'peak', 'contraction', 'trough'];
    const currentIndex = phases.indexOf(current.phase);
    newState.phase = phases[(currentIndex + 1) % phases.length];
  }

  return newState;
}

// 경제 효과 가져오기
export function getEconomicEffects(state: EconomicState): EconomicEffects {
  const baseEffects = ECONOMIC_PHASE_EFFECTS[state.phase];

  // 금리 영향
  const interestImpact = 1 - (state.interestRate - 0.02) * 5;

  return {
    ...baseEffects,
    investmentAvailability: baseEffects.investmentAvailability * interestImpact,
    customerSpending: baseEffects.customerSpending * (state.consumerConfidence / 70),
  };
}

// ============================================
// 경쟁사 AI
// ============================================

export interface CompetitorAction {
  competitorId: string;
  competitorName: string;
  type: 'feature_launch' | 'price_cut' | 'marketing_campaign' | 'partnership' | 'acquisition';
  description: string;
  impact: Effect[];
}

// 경쟁사 행동 시뮬레이션
export function simulateCompetitorActions(state: GameState): CompetitorAction | null {
  const actions: CompetitorAction[] = [];

  for (const competitor of COMPETITOR_DATA) {
    if (competitor.aggressiveness === 0) continue;

    // 우리가 성장하면 대응 확률 증가
    const ourGrowthRate = state.business.users.total / 1000; // 간단한 지표
    const responseChance = competitor.aggressiveness * ourGrowthRate * 0.01;

    if (Math.random() < responseChance) {
      // 행동 유형 결정
      const actionTypes: CompetitorAction['type'][] = [
        'feature_launch',
        'price_cut',
        'marketing_campaign',
      ];
      const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];

      let action: CompetitorAction;

      switch (actionType) {
        case 'feature_launch':
          action = {
            competitorId: competitor.id,
            competitorName: competitor.name,
            type: 'feature_launch',
            description: `${competitor.name}이(가) 새로운 기능을 출시했습니다!`,
            impact: [
              { type: 'reputation', value: -5 },
              { type: 'users', value: -Math.floor(state.business.users.total * 0.02) },
            ],
          };
          break;

        case 'price_cut':
          action = {
            competitorId: competitor.id,
            competitorName: competitor.name,
            type: 'price_cut',
            description: `${competitor.name}이(가) 가격을 30% 인하했습니다!`,
            impact: [
              { type: 'premium_users', value: -Math.floor(state.business.users.premium * 0.05) },
            ],
          };
          break;

        case 'marketing_campaign':
          action = {
            competitorId: competitor.id,
            competitorName: competitor.name,
            type: 'marketing_campaign',
            description: `${competitor.name}이(가) 대규모 마케팅 캠페인을 시작했습니다!`,
            impact: [
              { type: 'reputation', value: -3 },
            ],
          };
          break;

        default:
          continue;
      }

      actions.push(action);
    }
  }

  // 하나의 액션만 반환 (가장 영향력 있는 것)
  if (actions.length > 0) {
    return actions[Math.floor(Math.random() * actions.length)];
  }

  return null;
}

// 신규 경쟁자 진입 체크
export function checkNewCompetitor(state: GameState): boolean {
  // 시장이 성장하고 있으면 신규 진입 확률 증가
  const marketGrowth = state.business.users.total > 500 ? 1.5 : 1.0;
  const probability = 0.001 * marketGrowth; // 일일 0.1%

  return Math.random() < probability;
}

// ============================================
// 트렌드 시스템
// ============================================

export interface TrendState {
  ai: number; // 0-1 관심도
  mobile: number;
  gamification: number;
  remoteWork: number;
  selfImprovement: number;
}

export const DEFAULT_TRENDS: TrendState = {
  ai: 0.85,
  mobile: 0.95,
  gamification: 0.65,
  remoteWork: 0.7,
  selfImprovement: 0.75,
};

// 트렌드 업데이트
export function updateTrends(current: TrendState): TrendState {
  return {
    ai: Math.min(1, current.ai + 0.001 + (Math.random() - 0.4) * 0.01),
    mobile: Math.min(1, current.mobile + (Math.random() - 0.5) * 0.005),
    gamification: Math.min(1, current.gamification + 0.0005 + (Math.random() - 0.5) * 0.01),
    remoteWork: Math.min(1, current.remoteWork + (Math.random() - 0.5) * 0.01),
    selfImprovement: Math.min(1, current.selfImprovement + (Math.random() - 0.5) * 0.005),
  };
}

// 트렌드 점수 계산 (제품의 트렌드 적합도)
export function calculateTrendScore(state: GameState, trends: TrendState): number {
  let score = 50; // 기준점

  // AI 기능이 있으면 보너스
  const hasAI = state.business.product.features?.some(
    (f) => f.id.includes('ai') || f.name.includes('AI')
  );
  if (hasAI) score += trends.ai * 20;

  // 모바일 최적화
  const hasMobile = state.business.product.features?.some(
    (f) => f.id === 'mobile_app' || f.id === 'pwa'
  );
  if (hasMobile) score += trends.mobile * 15;

  // 게임화 요소
  const hasGamification = state.business.product.features?.some(
    (f) => f.id.includes('streak') || f.id.includes('achievement') || f.id.includes('leaderboard')
  );
  if (hasGamification) score += trends.gamification * 15;

  // 자기계발 트렌드와의 적합성 (기본 적용)
  score += trends.selfImprovement * 10;

  return Math.min(100, score);
}

// ============================================
// 규제 시스템
// ============================================

export interface RegulatoryState {
  personalInfoCompliance: boolean;
  advertisingCompliance: boolean;
  subscriptionCompliance: boolean;
  inspectionRisk: number; // 0-1
}

export interface RegulatoryEvent {
  type: 'inspection' | 'warning' | 'fine' | 'new_regulation';
  description: string;
  penalty?: number;
  requiredAction?: string;
}

// 규제 검사 체크
export function checkRegulatoryEvent(
  state: GameState,
  regulatory: RegulatoryState
): RegulatoryEvent | null {
  // 사용자가 많을수록 검사 확률 증가
  const userFactor = Math.min(3, state.business.users.total / 5000);
  const inspectionProbability = 0.001 * userFactor * regulatory.inspectionRisk;

  if (Math.random() < inspectionProbability) {
    // 어떤 규제 위반인지 확인
    if (!regulatory.personalInfoCompliance) {
      return {
        type: 'fine',
        description: '개인정보보호법 위반으로 과태료가 부과되었습니다.',
        penalty: 5000000 + Math.floor(Math.random() * 10000000),
        requiredAction: '개인정보 처리방침 정비 필요',
      };
    }

    if (!regulatory.advertisingCompliance) {
      return {
        type: 'warning',
        description: '표시광고법 위반 경고를 받았습니다.',
        requiredAction: '광고 문구 수정 필요',
      };
    }

    // 일반 검사
    return {
      type: 'inspection',
      description: '정기 규제 검사가 진행 중입니다.',
    };
  }

  // 신규 규제 발표 (낮은 확률)
  if (Math.random() < 0.0005) {
    return {
      type: 'new_regulation',
      description: 'EdTech 서비스에 대한 새로운 규제가 발표되었습니다.',
      requiredAction: '90일 내 준수 필요',
    };
  }

  return null;
}

// ============================================
// 시장 점유율 계산
// ============================================

export function calculateMarketShare(state: GameState): number {
  // TAM (Total Addressable Market) 가정: 100만 명
  const TAM = 1000000;
  return (state.business.users.total / TAM) * 100;
}

// 경쟁 강도 지수
export function calculateCompetitionIntensity(): number {
  let intensity = 0;

  for (const competitor of COMPETITOR_DATA) {
    intensity += competitor.marketShare * competitor.aggressiveness;
  }

  return Math.min(1, intensity);
}

// ============================================
// 투자 환경
// ============================================

export interface InvestmentOffer {
  type: 'angel' | 'seed' | 'series_a';
  amount: number;
  equity: number;
  conditions: string[];
  deadline: number; // days to decide
}

// 투자 제안 생성
export function generateInvestmentOffer(
  state: GameState,
  economic: EconomicState
): InvestmentOffer | null {
  // 투자 받을 자격 체크
  const mrr = state.business.users.premium * 9990;
  const growthRate = 0.1; // 가정

  // 최소 조건
  if (mrr < 1000000 && state.business.users.total < 500) {
    return null;
  }

  // 투자 유형 결정
  let type: InvestmentOffer['type'];
  let amount: number;
  let equity: number;

  if (mrr < 5000000) {
    type = 'angel';
    amount = 50000000 + Math.floor(Math.random() * 100000000);
    equity = 0.08 + Math.random() * 0.07;
  } else if (mrr < 30000000) {
    type = 'seed';
    amount = 300000000 + Math.floor(Math.random() * 400000000);
    equity = 0.12 + Math.random() * 0.08;
  } else {
    type = 'series_a';
    amount = 1500000000 + Math.floor(Math.random() * 1500000000);
    equity = 0.18 + Math.random() * 0.12;
  }

  // 경제 상황에 따른 조정
  const economicEffects = getEconomicEffects(economic);
  amount = Math.floor(amount * economicEffects.investmentAvailability);
  equity = equity / economicEffects.investmentAvailability;

  const conditions: string[] = [];

  if (type === 'seed' || type === 'series_a') {
    conditions.push('이사회 참여');
  }

  if (growthRate < 0.15) {
    conditions.push('분기별 성장 목표 달성');
  }

  if (mrr < 10000000) {
    conditions.push('6개월 내 MRR 2배 달성');
  }

  return {
    type,
    amount,
    equity,
    conditions,
    deadline: 14, // 14일 내 결정
  };
}

// ============================================
// 시장 이벤트 생성
// ============================================

export interface MarketEvent {
  type: 'competitor_action' | 'economic_shift' | 'trend_change' | 'regulatory' | 'investment';
  title: string;
  description: string;
  effects: Effect[];
}

// 일일 시장 이벤트 체크
export function checkMarketEvents(
  state: GameState,
  economic: EconomicState,
  trends: TrendState
): MarketEvent | null {
  // 경쟁사 행동
  const competitorAction = simulateCompetitorActions(state);
  if (competitorAction) {
    return {
      type: 'competitor_action',
      title: `경쟁사 동향: ${competitorAction.competitorName}`,
      description: competitorAction.description,
      effects: competitorAction.impact,
    };
  }

  // 트렌드 급변 (낮은 확률)
  if (Math.random() < 0.002) {
    const trendNames = ['AI', '모바일', '게임화', '자기계발'];
    const randomTrend = trendNames[Math.floor(Math.random() * trendNames.length)];
    const isPositive = Math.random() > 0.5;

    return {
      type: 'trend_change',
      title: `트렌드 변화: ${randomTrend}`,
      description: isPositive
        ? `${randomTrend} 관련 시장 관심이 급증하고 있습니다!`
        : `${randomTrend} 관련 시장 관심이 감소하고 있습니다.`,
      effects: isPositive
        ? [{ type: 'users', value: 20 }, { type: 'reputation', value: 5 }]
        : [{ type: 'users', value: -10 }],
    };
  }

  return null;
}
