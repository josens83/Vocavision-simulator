/**
 * Chapter 2: Realism Engine - User Behavior Model
 * AARRR 프레임워크 기반 사용자 행동 시뮬레이션
 */

import type { GameState } from '../types';
import { EDTECH_BENCHMARKS, VIRAL_BENCHMARKS, getSeasonalityMultiplier } from '../data/statistics';

// ============================================
// ACQUISITION (획득)
// ============================================

export interface AcquisitionResult {
  organic: number;
  paid: number;
  viral: number;
  total: number;
  cost: number;
  breakdown: {
    seo: number;
    wordOfMouth: number;
    appStore: number;
    social: number;
    ads: number;
    referral: number;
  };
}

// 일일 자연 유입 계산
export function calculateDailyOrganic(state: GameState): number {
  const base = 3; // 기본 일일 3명
  let multiplier = 1.0;

  // SEO 효과 (콘텐츠 양)
  const contentPieces = state.business.product.features?.length || 2;
  multiplier += contentPieces * 0.05;

  // 앱스토어 평점 효과 (가정: rating은 1-5)
  const rating = state.business.product.stability / 20; // 0-100 -> 1-5
  const ratingKey = `rating${Math.round(rating)}` as keyof typeof EDTECH_BENCHMARKS.ratingMultiplier;
  multiplier *= EDTECH_BENCHMARKS.ratingMultiplier[ratingKey] || 1.0;

  // 계절성
  const month = state.time.currentDate.getMonth() + 1;
  multiplier *= getSeasonalityMultiplier(month);

  // 브랜드 인지도 (평판 기반)
  multiplier *= 0.7 + (state.player.social.reputation / 100) * 0.6;

  // 시장 노출 (사용자 수에 따른 입소문)
  if (state.business.users.total > 100) {
    multiplier += Math.log10(state.business.users.total) * 0.3;
  }

  // 랜덤 변동 (±20%)
  const randomVariation = 0.8 + Math.random() * 0.4;

  return Math.max(0, Math.floor(base * multiplier * randomVariation));
}

// 유료 광고 효과 계산
export function calculatePaidAcquisition(
  adSpend: number,
  state: GameState
): { users: number; cost: number } {
  if (adSpend <= 0) return { users: 0, cost: 0 };

  // 기본 CPA (Cost Per Acquisition)
  const baseCPA = EDTECH_BENCHMARKS.averageCAC;

  // 광고 효율성 (제품 품질, 타겟팅에 따라)
  let efficiency = 1.0;

  // 제품 품질이 높으면 전환율 상승
  efficiency *= 0.7 + (state.business.product.stability / 100) * 0.6;

  // 경쟁 상황 (경쟁이 심하면 CPA 상승)
  efficiency *= 0.8; // 경쟁 시장 가정

  // 계절성
  const month = state.time.currentDate.getMonth() + 1;
  efficiency *= getSeasonalityMultiplier(month);

  const actualCPA = baseCPA / efficiency;
  const users = Math.floor(adSpend / actualCPA);

  return { users, cost: adSpend };
}

// 바이럴 유입 계산
export function calculateViralAcquisition(state: GameState): number {
  const activeUsers = state.business.users.dau;

  // K-factor 계산
  let k = VIRAL_BENCHMARKS.averageK;

  // NPS에 따른 조정
  k *= 1 + (state.business.users.nps - 30) / 100;

  // 공유 기능이 있으면 보너스
  const hasShareFeature = state.business.product.features?.some(
    (f) => f.id === 'social_share'
  );
  if (hasShareFeature) k *= 1.3;

  // 리퍼럴 프로그램이 있으면 보너스
  const hasReferral = state.business.product.features?.some(
    (f) => f.id === 'referral_program'
  );
  if (hasReferral) k *= 1.5;

  // 일일 바이럴 유입
  const dailyViral = Math.floor(activeUsers * k * 0.01);

  return Math.max(0, dailyViral);
}

// 일일 총 획득 계산
export function calculateDailyAcquisition(
  state: GameState,
  adSpend: number = 0
): AcquisitionResult {
  const organic = calculateDailyOrganic(state);
  const paid = calculatePaidAcquisition(adSpend, state);
  const viral = calculateViralAcquisition(state);

  // 세부 분류
  const seo = Math.floor(organic * 0.4);
  const wordOfMouth = Math.floor(organic * 0.3);
  const appStore = Math.floor(organic * 0.2);
  const social = organic - seo - wordOfMouth - appStore;

  return {
    organic,
    paid: paid.users,
    viral,
    total: organic + paid.users + viral,
    cost: paid.cost,
    breakdown: {
      seo,
      wordOfMouth,
      appStore,
      social,
      ads: paid.users,
      referral: viral,
    },
  };
}

// ============================================
// ACTIVATION (활성화)
// ============================================

export interface ActivationResult {
  activated: number;
  activationRate: number;
  funnel: {
    signup: number;
    profileComplete: number;
    firstLesson: number;
    ahaMoment: number;
  };
}

// 활성화율 계산
export function calculateActivationRate(state: GameState): number {
  let rate = EDTECH_BENCHMARKS.onboardingFunnel.firstLesson; // 기본 50%

  // 온보딩 품질 (제품 안정성 기반)
  rate *= 0.8 + (state.business.product.stability / 100) * 0.4;

  // 첫인상 (응답 속도)
  const responseTime = state.business.infrastructure.responseTime || 200;
  if (responseTime < 100) rate *= 1.2;
  else if (responseTime > 500) rate *= 0.8;
  else if (responseTime > 1000) rate *= 0.5;

  // 콘텐츠 품질
  const contentQuality = state.business.product.codeQuality || 70;
  rate *= 0.8 + (contentQuality / 100) * 0.4;

  return Math.min(0.8, Math.max(0.1, rate));
}

// 신규 사용자 활성화 처리
export function processActivation(
  newUsers: number,
  state: GameState
): ActivationResult {
  const activationRate = calculateActivationRate(state);

  const funnel = {
    signup: newUsers,
    profileComplete: Math.floor(newUsers * EDTECH_BENCHMARKS.onboardingFunnel.profileComplete),
    firstLesson: Math.floor(newUsers * EDTECH_BENCHMARKS.onboardingFunnel.firstLesson),
    ahaMoment: Math.floor(newUsers * EDTECH_BENCHMARKS.onboardingFunnel.ahaMoment),
  };

  return {
    activated: Math.floor(newUsers * activationRate),
    activationRate,
    funnel,
  };
}

// ============================================
// RETENTION (리텐션)
// ============================================

export interface RetentionResult {
  retained: number;
  churned: number;
  churnRate: number;
  factors: {
    bugs: number;
    support: number;
    competition: number;
    engagement: number;
  };
}

// 일일 이탈률 계산
export function calculateDailyChurn(state: GameState): number {
  const baseChurn = 0.003; // 일일 0.3% 기본 이탈 (월 9%)

  let churnMultiplier = 1.0;

  // 버그 수
  const bugCount = state.business.product.bugs?.length || 0;
  churnMultiplier += bugCount * 0.1;

  // 서버 안정성
  const uptime = state.business.infrastructure.uptime || 99.5;
  if (uptime < 99) churnMultiplier += 0.3;
  if (uptime < 95) churnMultiplier += 0.5;

  // 고객 지원 품질 (응답 시간)
  const supportResponseHours = 24; // 가정
  if (supportResponseHours > 48) churnMultiplier += 0.3;
  else if (supportResponseHours > 24) churnMultiplier += 0.1;

  // 콘텐츠 신선도 (마지막 업데이트 이후 일수)
  const daysSinceUpdate = 30; // 가정
  if (daysSinceUpdate > 60) churnMultiplier += 0.2;
  if (daysSinceUpdate > 90) churnMultiplier += 0.3;

  // NPS 기반 조정
  if (state.business.users.nps < 0) churnMultiplier += 0.3;
  else if (state.business.users.nps < 20) churnMultiplier += 0.1;
  else if (state.business.users.nps > 50) churnMultiplier *= 0.7;

  // 기능 풍부함
  const featureCount = state.business.product.features?.length || 2;
  if (featureCount < 3) churnMultiplier += 0.1;

  return baseChurn * churnMultiplier;
}

// 일일 리텐션 처리
export function processRetention(state: GameState): RetentionResult {
  const churnRate = calculateDailyChurn(state);
  const totalUsers = state.business.users.total;
  const churned = Math.floor(totalUsers * churnRate);
  const retained = totalUsers - churned;

  return {
    retained,
    churned,
    churnRate,
    factors: {
      bugs: (state.business.product.bugs?.length || 0) > 0 ? 0.3 : 0,
      support: 0.1,
      competition: 0.2,
      engagement: 0.4,
    },
  };
}

// ============================================
// REVENUE (수익)
// ============================================

export interface RevenueResult {
  newPremium: number;
  conversionRate: number;
  mrr: number;
  arpu: number;
  ltv: number;
}

// 무료→유료 전환 계산
export function calculateConversion(state: GameState): number {
  let rate = EDTECH_BENCHMARKS.averageConversionRate; // 2.3%

  // 제품 가치
  const productValue = state.business.product.stability / 100;
  rate *= 0.5 + productValue;

  // 프리미엄 기능 매력도
  const premiumFeatures = state.business.product.features?.filter(
    (f) => f.impact?.revenue && f.impact.revenue > 0
  ).length || 0;
  rate *= 1 + premiumFeatures * 0.1;

  // 무료 사용 제한이 있으면 전환율 상승
  const hasLimit = true; // 가정
  if (hasLimit) rate *= 1.5;

  // 가격 민감도
  const price = 9990;
  const optimalPrice = 9900;
  rate *= Math.pow(optimalPrice / price, 0.5);

  // 경쟁사 가격 대비
  const competitorPrice = 12000; // 가정
  if (price < competitorPrice) rate *= 1.1;

  return Math.min(0.15, Math.max(0.005, rate));
}

// 일일 수익 처리
export function processRevenue(state: GameState): RevenueResult {
  const freeUsers = state.business.users.total - state.business.users.premium;
  const conversionRate = calculateConversion(state);
  const newPremium = Math.floor(freeUsers * conversionRate * (1 / 30)); // 월간 전환율을 일일로

  const mrr = state.business.users.premium * 9990;
  const arpu = state.business.users.total > 0 ? mrr / state.business.users.total : 0;

  // LTV 계산 (평균 구독 기간 * ARPU)
  const avgSubscriptionMonths = 1 / Math.max(0.01, state.business.users.churnRate);
  const ltv = 9990 * avgSubscriptionMonths;

  return {
    newPremium,
    conversionRate,
    mrr,
    arpu,
    ltv,
  };
}

// ============================================
// REFERRAL (추천)
// ============================================

export interface ReferralResult {
  referrals: number;
  kFactor: number;
  npsImpact: number;
}

// 추천 계산
export function processReferral(state: GameState): ReferralResult {
  const activeUsers = state.business.users.dau;

  // K-factor
  let k = VIRAL_BENCHMARKS.averageK;
  k *= 1 + (state.business.users.nps - 30) / 100;

  const referrals = calculateViralAcquisition(state);

  return {
    referrals,
    kFactor: k,
    npsImpact: state.business.users.nps > 50 ? 0.2 : state.business.users.nps > 30 ? 0.1 : 0,
  };
}

// ============================================
// 종합 일일 처리
// ============================================

export interface DailyUserMetrics {
  acquisition: AcquisitionResult;
  activation: ActivationResult;
  retention: RetentionResult;
  revenue: RevenueResult;
  referral: ReferralResult;
  netChange: number;
  newTotal: number;
}

export function processDailyUserMetrics(
  state: GameState,
  adSpend: number = 0
): DailyUserMetrics {
  // 1. 획득
  const acquisition = calculateDailyAcquisition(state, adSpend);

  // 2. 활성화
  const activation = processActivation(acquisition.total, state);

  // 3. 리텐션
  const retention = processRetention(state);

  // 4. 수익
  const revenue = processRevenue(state);

  // 5. 추천
  const referral = processReferral(state);

  // 순 변화
  const netChange = activation.activated - retention.churned + referral.referrals;
  const newTotal = Math.max(0, state.business.users.total + netChange);

  return {
    acquisition,
    activation,
    retention,
    revenue,
    referral,
    netChange,
    newTotal,
  };
}

// NPS 계산 (간단한 모델)
export function calculateNPS(state: GameState): number {
  let nps = 30; // 기준점

  // 제품 품질
  nps += (state.business.product.stability - 70) * 0.5;

  // 고객 지원
  // nps += supportQuality * 10;

  // 버그
  const bugCount = state.business.product.bugs?.length || 0;
  nps -= bugCount * 5;

  // 가격 대비 가치
  const valueRatio = state.business.users.ltv / 9990;
  if (valueRatio > 2) nps += 10;
  else if (valueRatio < 1) nps -= 10;

  return Math.max(-100, Math.min(100, nps));
}

// DAU/MAU 비율 계산
export function calculateEngagementRatio(state: GameState): number {
  if (state.business.users.mau === 0) return 0;
  return state.business.users.dau / state.business.users.mau;
}

// 사용자 코호트 분석 (간단한 버전)
export function analyzeUserCohort(
  state: GameState,
  daysSinceSignup: number
): { retention: number; conversion: number } {
  const retention = EDTECH_BENCHMARKS.retentionCurve[
    `day${daysSinceSignup}` as keyof typeof EDTECH_BENCHMARKS.retentionCurve
  ] || 0.04;

  // 오래된 사용자일수록 전환율 낮음 (이미 전환했거나 안 할 사람)
  const conversion = calculateConversion(state) * Math.pow(0.95, daysSinceSignup / 7);

  return { retention, conversion };
}
