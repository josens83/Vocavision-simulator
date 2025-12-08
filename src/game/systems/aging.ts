/**
 * Chapter 2: Realism Engine - Time Aging System
 * 시간에 따른 플레이어, 비즈니스, 제품, 시장 변화
 */

import type { GameState, Effect } from '../types';

// ============================================
// 플레이어 노화
// ============================================

export interface PlayerAgingEffects {
  energyRecoveryRate: number; // 에너지 회복 속도 배수
  stressResistance: number; // 스트레스 저항력 배수
  networkValue: number; // 네트워크 가치 배수
  skillDecay: Record<string, number>; // 스킬 감퇴율
}

// 운영 기간에 따른 플레이어 효과
export function calculatePlayerAgingEffects(totalDays: number): PlayerAgingEffects {
  const years = totalDays / 365;

  return {
    // 오래 운영할수록 에너지 회복이 느려짐 (최대 50% 감소)
    energyRecoveryRate: Math.max(0.5, 1 - years * 0.1),

    // 경험이 쌓이면 스트레스 저항력 증가 (최대 50% 증가)
    stressResistance: Math.min(1.5, 1 + years * 0.1),

    // 네트워크 가치는 시간에 따라 증가
    networkValue: 1 + years * 0.2,

    // 스킬 감퇴율 (사용하지 않으면)
    skillDecay: {
      coding: 0.001, // 일일 0.1%
      design: 0.0015,
      marketing: 0.001,
      business: 0.0005, // 비즈니스 경험은 유지
      communication: 0.0008,
      leadership: 0.0005,
    },
  };
}

// 스킬 감퇴 처리 (사용하지 않은 스킬)
export function applySkillDecay(
  currentSkills: Record<string, number>,
  usedSkills: Set<string>,
  agingEffects: PlayerAgingEffects
): Record<string, number> {
  const newSkills = { ...currentSkills };

  for (const [skill, decay] of Object.entries(agingEffects.skillDecay)) {
    if (!usedSkills.has(skill)) {
      const currentValue = newSkills[skill] || 50;
      // 최소 20까지만 감소
      newSkills[skill] = Math.max(20, currentValue * (1 - decay));
    }
  }

  return newSkills;
}

// 관계 감퇴 (연락하지 않으면)
export function calculateRelationshipDecay(
  daysSinceContact: number
): number {
  if (daysSinceContact <= 7) return 0;
  if (daysSinceContact <= 30) return 0.01;
  if (daysSinceContact <= 90) return 0.03;
  return 0.05;
}

// ============================================
// 비즈니스 노화
// ============================================

export interface BusinessAgingEffects {
  technicalDebtGrowth: number; // 기술 부채 성장률
  brandFreshnessDecay: number; // 브랜드 신선도 감소율
  customerExpectationGrowth: number; // 고객 기대치 상승률
}

// 기술 부채 성장
export function calculateTechnicalDebtGrowth(state: GameState): number {
  let baseRate = 0.5; // 일일 0.5 포인트

  // 빠른 개발은 부채 증가
  const recentTasks = 5; // 가정: 최근 완료한 개발 업무 수
  if (recentTasks > 3) baseRate *= 1.5;

  // 테스트 없으면 부채 증가
  const hasTests = state.business.product.features?.some(
    (f) => f.id.includes('test') || f.id.includes('ci')
  );
  if (!hasTests) baseRate *= 1.3;

  // 오래된 의존성
  const codeQuality = state.business.product.codeQuality || 70;
  if (codeQuality < 60) baseRate *= 1.4;

  return baseRate;
}

// 브랜드 신선도 감소
export function calculateBrandDecay(daysSinceUpdate: number): number {
  if (daysSinceUpdate <= 7) return 0;
  if (daysSinceUpdate <= 30) return 0.005; // 일 0.5%
  if (daysSinceUpdate <= 60) return 0.01; // 일 1%
  return 0.02; // 일 2%
}

// 고객 기대치 상승
export function calculateExpectationGrowth(totalDays: number): number {
  // 매월 2% 상승
  return 1 + (totalDays / 30) * 0.02;
}

// ============================================
// 제품 노화
// ============================================

export interface ProductAgingEffects {
  featureObsolescence: number; // 기능 구식화 정도
  designOutdatedness: number; // 디자인 구식화 정도
  securityVulnerability: number; // 보안 취약점 누적
}

// 기능 구식화 계산
export function calculateFeatureObsolescence(
  featureAge: number, // 일
  competitorHasSimilar: boolean
): number {
  const halfLife = 365; // 1년 후 가치 절반
  let obsolescence = 1 - Math.pow(0.5, featureAge / halfLife);

  if (competitorHasSimilar) {
    obsolescence = Math.min(1, obsolescence * 1.5);
  }

  return obsolescence;
}

// 디자인 트렌드 주기
export function calculateDesignOutdatedness(daysSinceRedesign: number): number {
  const designCycle = 730; // 2년 주기
  const phase = (daysSinceRedesign % designCycle) / designCycle;

  // 사인 곡선으로 트렌드 변화 시뮬레이션
  return Math.max(0, Math.sin(phase * Math.PI) * 0.3);
}

// 보안 취약점 누적
export function calculateSecurityVulnerability(
  state: GameState,
  daysSinceAudit: number
): number {
  let vulnerability = 0;

  // 시간이 지날수록 증가
  vulnerability += daysSinceAudit * 0.001;

  // 사용자가 많을수록 타겟이 됨
  if (state.business.users.total > 1000) vulnerability += 0.1;
  if (state.business.users.total > 10000) vulnerability += 0.2;

  // 보안 점수가 낮으면 증가
  const securityScore = state.business.infrastructure.securityScore || 80;
  if (securityScore < 70) vulnerability += 0.2;
  if (securityScore < 50) vulnerability += 0.3;

  return Math.min(1, vulnerability);
}

// ============================================
// 시장 노화
// ============================================

export interface MarketAgingEffects {
  marketGrowthRate: number; // 시장 성장률
  techEvolutionProbability: number; // 기술 변화 확률
  regulatoryChangeProbability: number; // 규제 변화 확률
}

// 시장 성장률 (EdTech)
export function calculateMarketGrowth(totalDays: number): number {
  const baseGrowth = 0.15 / 365; // 연 15%를 일일로
  const volatility = (Math.random() - 0.5) * 0.001;

  return baseGrowth + volatility;
}

// 기술 대변혁 확률
export function calculateTechEvolutionProbability(totalDays: number): number {
  // 연간 5% 확률
  const annualProbability = 0.05;
  return annualProbability / 365;
}

// ============================================
// 종합 노화 처리
// ============================================

export interface AgingResult {
  effects: Effect[];
  warnings: string[];
  opportunities: string[];
}

// 일일 노화 처리
export function processDailyAging(state: GameState): AgingResult {
  const effects: Effect[] = [];
  const warnings: string[] = [];
  const opportunities: string[] = [];

  const totalDays = state.time.totalDays;
  const playerAging = calculatePlayerAgingEffects(totalDays);

  // 1. 기술 부채 증가
  const techDebtGrowth = calculateTechnicalDebtGrowth(state);
  if (state.business.product.technicalDebt + techDebtGrowth > 50) {
    warnings.push('기술 부채가 누적되고 있습니다. 리팩토링이 필요합니다.');
  }
  effects.push({ type: 'technical_debt', value: techDebtGrowth });

  // 2. 서버 자연 감퇴
  const serverDecay = 0.5 + Math.random() * 0.5;
  effects.push({ type: 'server_health', value: -serverDecay });

  // 3. 제품 안정성 자연 감퇴 (버그 누적)
  if (Math.random() < 0.02) { // 2% 확률로 자연 버그 발생
    effects.push({ type: 'stability', value: -2 });
    warnings.push('코드 노화로 인한 잠재적 버그가 발생할 수 있습니다.');
  }

  // 4. 에너지 자연 회복 (노화 반영)
  const energyRecovery = 5 * playerAging.energyRecoveryRate;
  effects.push({ type: 'energy', value: energyRecovery });

  // 5. 스트레스 자연 감소 (저항력 반영)
  const stressReduction = 2 * playerAging.stressResistance;
  effects.push({ type: 'stress', value: -stressReduction });

  // 6. 장기 운영 보너스
  if (totalDays % 30 === 0) { // 매월
    // 경험 보너스
    effects.push({ type: 'skill_business', value: 1 });

    // 네트워크 가치 증가
    if (playerAging.networkValue > 1.2) {
      opportunities.push('오랜 운영 경험으로 업계 내 인맥이 넓어졌습니다.');
    }
  }

  // 7. 시장 변화 체크
  if (totalDays % 90 === 0) { // 분기마다
    const techEvolutionChance = calculateTechEvolutionProbability(totalDays) * 90;
    if (Math.random() < techEvolutionChance) {
      warnings.push('새로운 기술 트렌드가 등장했습니다. 적응이 필요할 수 있습니다.');
    }
  }

  // 8. 고객 기대치 상승
  const expectationGrowth = calculateExpectationGrowth(totalDays);
  if (expectationGrowth > 1.5) {
    warnings.push('고객 기대치가 높아졌습니다. 제품 개선이 필요합니다.');
  }

  // 9. 디자인 노후화 체크
  const daysSinceRedesign = totalDays; // 가정
  const designOutdatedness = calculateDesignOutdatedness(daysSinceRedesign);
  if (designOutdatedness > 0.2) {
    warnings.push('디자인이 다소 구식으로 느껴질 수 있습니다.');
    effects.push({ type: 'reputation', value: -0.5 });
  }

  // 10. 보안 취약점 체크
  const securityVulnerability = calculateSecurityVulnerability(state, totalDays);
  if (securityVulnerability > 0.3) {
    warnings.push('보안 점검이 필요합니다.');
  }

  return {
    effects,
    warnings: [...new Set(warnings)], // 중복 제거
    opportunities: [...new Set(opportunities)],
  };
}

// 월간 노화 처리
export function processMonthlyAging(state: GameState): AgingResult {
  const effects: Effect[] = [];
  const warnings: string[] = [];
  const opportunities: string[] = [];

  // 1. 사용자 기대치 상승으로 인한 만족도 감소
  effects.push({ type: 'nps', value: -2 });

  // 2. 경쟁 심화
  if (Math.random() < 0.1) { // 10% 확률
    warnings.push('새로운 경쟁자가 시장에 진입했습니다.');
  }

  // 3. 규제 변화 체크
  if (Math.random() < 0.02) { // 2% 확률
    warnings.push('개인정보보호 관련 규제가 강화되었습니다.');
  }

  // 4. 장기 운영 혜택
  const years = state.time.totalDays / 365;
  if (years >= 1) {
    opportunities.push('1년 운영 경험으로 투자자들의 관심이 높아질 수 있습니다.');
  }

  return {
    effects,
    warnings,
    opportunities,
  };
}

// 콘텐츠 신선도 계산
export function calculateContentFreshness(
  lastContentUpdateDays: number,
  totalContentPieces: number
): number {
  // 최근 업데이트가 오래될수록 감소
  const recencyFactor = Math.max(0, 1 - lastContentUpdateDays / 90);

  // 콘텐츠가 많을수록 기본 점수 높음
  const volumeFactor = Math.min(1, totalContentPieces / 100);

  return (recencyFactor * 0.7 + volumeFactor * 0.3) * 100;
}

// 기술 스택 노후화 체크
export function checkTechStackAge(daysSinceLastUpdate: number): {
  status: 'current' | 'outdated' | 'deprecated';
  recommendation: string;
} {
  if (daysSinceLastUpdate < 90) {
    return {
      status: 'current',
      recommendation: '기술 스택이 최신 상태입니다.',
    };
  } else if (daysSinceLastUpdate < 180) {
    return {
      status: 'outdated',
      recommendation: '의존성 업데이트를 고려해보세요.',
    };
  } else {
    return {
      status: 'deprecated',
      recommendation: '긴급하게 기술 스택 업그레이드가 필요합니다!',
    };
  }
}
