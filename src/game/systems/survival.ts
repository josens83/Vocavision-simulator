/**
 * Chapter 2: Realism Engine - Survival Probability Calculator
 * 실제 스타트업 생존율 기반 동적 리스크 계산
 */

import type { GameState } from '../types';
import { STARTUP_SURVIVAL_DATA, EDTECH_BENCHMARKS } from '../data/statistics';

export interface FailureProbability {
  cashRunOut: number;
  burnout: number;
  competitorTakeover: number;
  technicalFailure: number;
  legalIssue: number;
  marketDisappear: number;
  userChurn: number;
  total: number;
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number; // 0-100
  factors: RiskFactor[];
  recommendations: string[];
}

export interface RiskFactor {
  name: string;
  severity: number; // 0-100
  trend: 'improving' | 'stable' | 'worsening';
  description: string;
}

// 일일 기본 리스크 (0.1%)
const BASE_DAILY_RISK = 0.001;

// 사용자 성장률 계산
export function calculateUserGrowthRate(state: GameState): number {
  const history = state.history.metricsSnapshots;
  if (history.length < 2) return 0;

  const recent = history[history.length - 1];
  const previous = history[Math.max(0, history.length - 30)]; // 30일 전

  if (previous.users === 0) return 0;
  return (recent.users - previous.users) / previous.users;
}

// 현금 소진 리스크 계산
export function calculateCashRunoutRisk(state: GameState): number {
  const { runway } = state.business.finance;

  if (runway <= 0) return 1.0;
  if (runway <= 1) return 0.8;
  if (runway <= 3) return 0.5;
  if (runway <= 6) return 0.2;
  if (runway <= 12) return 0.05;
  return 0.01;
}

// 경쟁 리스크 계산
export function calculateCompetitionRisk(state: GameState): number {
  let risk = 0.05; // 기본 5%

  // 경쟁사 대비 제품 품질
  const productScore = state.business.product.stability * 0.5 + state.player.social.reputation * 0.5;

  if (productScore < 50) risk += 0.15;
  else if (productScore < 70) risk += 0.05;

  // 시장 점유율 (작을수록 위험)
  const estimatedMarketShare = state.business.users.total / 100000; // 가정: TAM 10만
  if (estimatedMarketShare < 0.01) risk += 0.1;

  // 차별화 (기능 수)
  const featureCount = state.business.product.features?.length || 2;
  if (featureCount < 3) risk += 0.05;

  return Math.min(0.5, risk);
}

// 법적 리스크 계산
export function calculateLegalRisk(state: GameState): number {
  let risk = 0.01; // 기본 1%

  // 개인정보 처리 (사용자 수에 따라)
  if (state.business.users.total > 1000) risk += 0.02;
  if (state.business.users.total > 10000) risk += 0.03;

  // 보안 점수
  const securityScore = state.business.infrastructure.securityScore || 80;
  if (securityScore < 70) risk += 0.05;
  if (securityScore < 50) risk += 0.1;

  return Math.min(0.2, risk);
}

// 동적 일일 리스크 계산
export function calculateDailyRisk(state: GameState): number {
  let riskMultiplier = 1.0;

  // 자금 상황
  const runway = state.business.finance.runway;
  if (runway < 1) riskMultiplier *= 5.0;
  else if (runway < 3) riskMultiplier *= 2.5;
  else if (runway < 6) riskMultiplier *= 1.5;

  // 사용자 성장
  const userGrowthRate = calculateUserGrowthRate(state);
  if (userGrowthRate < -0.1) riskMultiplier *= 2.0;
  else if (userGrowthRate < 0) riskMultiplier *= 1.5;
  else if (userGrowthRate < 0.05) riskMultiplier *= 1.2;

  // 제품 안정성
  if (state.business.product.stability < 30) riskMultiplier *= 2.0;
  else if (state.business.product.stability < 50) riskMultiplier *= 1.5;
  else if (state.business.product.stability < 70) riskMultiplier *= 1.2;

  // 창업자 상태
  if (state.player.health.burnoutRisk > 80) riskMultiplier *= 3.0;
  else if (state.player.health.burnoutRisk > 60) riskMultiplier *= 2.0;
  else if (state.player.health.burnoutRisk > 40) riskMultiplier *= 1.3;

  if (state.player.health.mental < 20) riskMultiplier *= 2.0;
  else if (state.player.health.mental < 40) riskMultiplier *= 1.5;

  // 평판
  if (state.player.social.reputation < 20) riskMultiplier *= 2.5;
  else if (state.player.social.reputation < 40) riskMultiplier *= 1.5;

  // 서버 상태
  if (state.business.infrastructure.serverHealth < 50) riskMultiplier *= 1.5;

  // 운영 기간 (초기가 더 위험)
  const monthsRunning = Math.floor(state.time.totalDays / 30);
  if (monthsRunning < 3) riskMultiplier *= 1.5;
  else if (monthsRunning < 6) riskMultiplier *= 1.2;
  else if (monthsRunning > 24) riskMultiplier *= 0.8; // 안정화

  return BASE_DAILY_RISK * riskMultiplier;
}

// 월간 리스크 계산
export function calculateMonthlyRisk(state: GameState): number {
  const dailyRisk = calculateDailyRisk(state);
  // 30일 동안 매일 살아남을 확률의 역
  const monthlysurvivalProb = Math.pow(1 - dailyRisk, 30);
  return 1 - monthlysurvivalProb;
}

// 실패 확률 분석
export function getFailureProbability(state: GameState): FailureProbability {
  const cashRunOut = calculateCashRunoutRisk(state);
  const burnout = state.player.health.burnoutRisk / 100;
  const competitorTakeover = calculateCompetitionRisk(state);
  const technicalFailure = ((100 - state.business.product.stability) / 100) * 0.3;
  const legalIssue = calculateLegalRisk(state);
  const marketDisappear = 0.02; // 시장 소멸은 낮은 확률
  const userChurn =
    state.business.users.churnRate > EDTECH_BENCHMARKS.poorChurnRate
      ? 0.2
      : state.business.users.churnRate > EDTECH_BENCHMARKS.averageChurnRate
        ? 0.1
        : 0.02;

  // 총 실패 확률 (독립 사건 가정 X, 가중 평균)
  const total = Math.min(
    0.95,
    cashRunOut * 0.35 +
      burnout * 0.15 +
      competitorTakeover * 0.15 +
      technicalFailure * 0.1 +
      legalIssue * 0.05 +
      marketDisappear * 0.05 +
      userChurn * 0.15
  );

  return {
    cashRunOut,
    burnout,
    competitorTakeover,
    technicalFailure,
    legalIssue,
    marketDisappear,
    userChurn,
    total,
  };
}

// 종합 리스크 평가
export function assessRisk(state: GameState): RiskAssessment {
  const failureProb = getFailureProbability(state);
  const factors: RiskFactor[] = [];
  const recommendations: string[] = [];

  // 자금 리스크
  const cashRisk = failureProb.cashRunOut * 100;
  if (cashRisk > 10) {
    factors.push({
      name: '자금 고갈 위험',
      severity: cashRisk,
      trend: state.business.finance.runway < state.business.finance.cash / state.business.finance.monthlyExpenses ? 'improving' : 'worsening',
      description: `런웨이 ${state.business.finance.runway}개월`,
    });
    if (cashRisk > 30) {
      recommendations.push('투자 유치 또는 비용 절감 필요');
    }
  }

  // 번아웃 리스크
  const burnoutRisk = failureProb.burnout * 100;
  if (burnoutRisk > 20) {
    factors.push({
      name: '번아웃 위험',
      severity: burnoutRisk,
      trend: state.player.health.stress > 50 ? 'worsening' : 'stable',
      description: `스트레스 ${state.player.health.stress}%`,
    });
    recommendations.push('휴식을 취하고 스트레스 관리 필요');
  }

  // 제품 리스크
  const productRisk = failureProb.technicalFailure * 100;
  if (productRisk > 10) {
    factors.push({
      name: '기술 장애 위험',
      severity: productRisk,
      trend: state.business.product.stability < 70 ? 'worsening' : 'stable',
      description: `안정성 ${state.business.product.stability}%`,
    });
    recommendations.push('버그 수정 및 테스트 강화 필요');
  }

  // 사용자 이탈 리스크
  const churnRisk = failureProb.userChurn * 100;
  if (churnRisk > 10) {
    factors.push({
      name: '사용자 이탈 위험',
      severity: churnRisk,
      trend:
        state.business.users.churnRate > EDTECH_BENCHMARKS.averageChurnRate ? 'worsening' : 'stable',
      description: `이탈률 ${(state.business.users.churnRate * 100).toFixed(1)}%`,
    });
    recommendations.push('리텐션 개선 및 사용자 피드백 수집 필요');
  }

  // 경쟁 리스크
  const compRisk = failureProb.competitorTakeover * 100;
  if (compRisk > 15) {
    factors.push({
      name: '경쟁 위험',
      severity: compRisk,
      trend: 'stable',
      description: '경쟁사 대비 차별화 부족',
    });
    recommendations.push('제품 차별화 및 마케팅 강화 필요');
  }

  // 총점 계산
  const score = Math.round(failureProb.total * 100);

  let level: RiskAssessment['level'];
  if (score >= 50) level = 'critical';
  else if (score >= 30) level = 'high';
  else if (score >= 15) level = 'medium';
  else level = 'low';

  return {
    level,
    score,
    factors: factors.sort((a, b) => b.severity - a.severity),
    recommendations,
  };
}

// 생존 가능성 예측 (일 단위)
export function predictSurvival(state: GameState, days: number): number {
  const dailyRisk = calculateDailyRisk(state);
  return Math.pow(1 - dailyRisk, days);
}

// 실패 원인 분석 (게임 오버 시)
export function analyzeFailure(state: GameState): string[] {
  const reasons: string[] = [];
  const prob = getFailureProbability(state);

  if (state.business.finance.cash < -1000000) {
    reasons.push(
      `자금 고갈 (29% 창업 실패 원인): 최종 잔고 ${state.business.finance.cash.toLocaleString()}원`
    );
  }

  if (state.player.health.burnoutRisk >= 100) {
    reasons.push(
      `번아웃 (8% 창업 실패 원인): 스트레스 ${state.player.health.stress}%, 에너지 ${state.player.health.energy}%`
    );
  }

  if (state.business.infrastructure.serverHealth <= 0) {
    reasons.push(
      `기술 장애 (17% 창업 실패 원인): 서버 상태 ${state.business.infrastructure.serverHealth}%`
    );
  }

  if (state.player.social.reputation <= 0) {
    reasons.push(
      `평판 붕괴 (14% 고객 무시 원인): 평판 ${state.player.social.reputation}`
    );
  }

  if (state.business.users.total <= 0) {
    reasons.push(
      `시장 수요 없음 (42% 창업 실패 원인): 모든 사용자 이탈`
    );
  }

  return reasons;
}

// 벤치마크 대비 성과 분석
export function compareToBenchmarks(state: GameState): Record<string, { value: number; benchmark: number; status: 'good' | 'average' | 'poor' }> {
  const metrics: Record<string, { value: number; benchmark: number; status: 'good' | 'average' | 'poor' }> = {};

  // CAC
  const cac = state.business.users.cac;
  metrics['CAC (고객획득비용)'] = {
    value: cac,
    benchmark: EDTECH_BENCHMARKS.averageCAC,
    status: cac <= EDTECH_BENCHMARKS.goodCAC ? 'good' : cac <= EDTECH_BENCHMARKS.averageCAC ? 'average' : 'poor',
  };

  // LTV
  const ltv = state.business.users.ltv;
  metrics['LTV (고객생애가치)'] = {
    value: ltv,
    benchmark: EDTECH_BENCHMARKS.averageLTV,
    status: ltv >= EDTECH_BENCHMARKS.goodLTV ? 'good' : ltv >= EDTECH_BENCHMARKS.averageLTV ? 'average' : 'poor',
  };

  // 이탈률
  const churnRate = state.business.users.churnRate;
  metrics['월간 이탈률'] = {
    value: churnRate * 100,
    benchmark: EDTECH_BENCHMARKS.averageChurnRate * 100,
    status: churnRate <= EDTECH_BENCHMARKS.goodChurnRate ? 'good' : churnRate <= EDTECH_BENCHMARKS.averageChurnRate ? 'average' : 'poor',
  };

  // 전환율
  const conversionRate = state.business.users.premium / Math.max(1, state.business.users.total);
  metrics['무료→유료 전환율'] = {
    value: conversionRate * 100,
    benchmark: EDTECH_BENCHMARKS.averageConversionRate * 100,
    status: conversionRate >= EDTECH_BENCHMARKS.goodConversionRate ? 'good' : conversionRate >= EDTECH_BENCHMARKS.averageConversionRate ? 'average' : 'poor',
  };

  // NPS
  const nps = state.business.users.nps;
  metrics['NPS (순추천지수)'] = {
    value: nps,
    benchmark: 30,
    status: nps >= 50 ? 'good' : nps >= 30 ? 'average' : 'poor',
  };

  return metrics;
}
