/**
 * Chapter 6: Economy & Balance - Revenue Model
 * 수익 모델 (한국 EdTech 시장 기반)
 */

import {
  SubscriptionTier,
  SubscriptionPlan,
  SubscriptionRevenue,
  IAPItem,
  IAPRevenue,
  B2BContract,
  B2BContractType,
  B2BRevenue,
  AdType,
  AdRevenue,
  RevenueModel,
  MonthlyRevenueReport,
} from './types';

// ============================================
// 구독 플랜 정의 (한국 EdTech 가격대 반영)
// ============================================

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    tier: 'free',
    name: '무료 체험',
    price: 0,
    features: [
      '기본 학습 콘텐츠 접근',
      '하루 5개 레슨 제한',
      '광고 포함',
      '커뮤니티 포럼 접근',
    ],
    userLimit: 1,
    contentAccess: 20,
    supportLevel: 'community',
  },
  {
    tier: 'basic',
    name: '베이직',
    price: 9900,  // 월 9,900원
    features: [
      '전체 학습 콘텐츠 접근',
      '무제한 레슨',
      '광고 제거',
      '진도 추적',
      '이메일 지원',
    ],
    userLimit: 1,
    contentAccess: 70,
    supportLevel: 'email',
  },
  {
    tier: 'premium',
    name: '프리미엄',
    price: 19900,  // 월 19,900원
    features: [
      '전체 콘텐츠 무제한 접근',
      'AI 맞춤 학습',
      '1:1 화상 튜터링 (월 2회)',
      '수료증 발급',
      '우선 지원',
      '오프라인 학습 모드',
    ],
    userLimit: 2,
    contentAccess: 100,
    supportLevel: 'priority',
  },
  {
    tier: 'enterprise',
    name: '기업/교육기관',
    price: 99000,  // 월 99,000원 (단체 최소 5명)
    features: [
      '무제한 사용자',
      '관리자 대시보드',
      '학습 분석 리포트',
      'LMS 연동',
      '전담 매니저',
      '맞춤 콘텐츠 개발',
    ],
    contentAccess: 100,
    supportLevel: 'dedicated',
  },
];

// 구독 전환/이탈률 (월간)
export const subscriptionRevenue: SubscriptionRevenue = {
  plans: subscriptionPlans,
  conversionRates: {
    free: 0,        // N/A (기준점)
    basic: 0.05,    // 무료 → 베이직 5%
    premium: 0.02,  // 무료 → 프리미엄 2%
    enterprise: 0.001,  // B2B는 별도 채널
  },
  churnRates: {
    free: 0.30,     // 무료 사용자 30% 이탈
    basic: 0.08,    // 베이직 8% 이탈
    premium: 0.04,  // 프리미엄 4% 이탈
    enterprise: 0.02,   // 기업 2% 이탈
  },
  upgradeRates: {
    free: 0.05,     // → 유료
    basic: 0.03,    // → 프리미엄
    premium: 0.01,  // → 기업
    enterprise: 0,  // 최상위
  },
  downgradeRates: {
    free: 0,        // 최하위
    basic: 0.02,    // → 무료
    premium: 0.03,  // → 베이직
    enterprise: 0.01,  // → 프리미엄
  },
};

// ============================================
// IAP 아이템 정의
// ============================================

export const iapItems: IAPItem[] = [
  // 소모품
  {
    id: 'energy_pack_small',
    name: '에너지 충전 (소)',
    type: 'consumable',
    price: 1000,
    description: '에너지 20 회복',
    effect: [{ resource: 'energy', amount: 20, type: 'relative' }],
    cooldown: 1,
  },
  {
    id: 'energy_pack_large',
    name: '에너지 충전 (대)',
    type: 'consumable',
    price: 3000,
    description: '에너지 완전 회복',
    effect: [{ resource: 'energy', amount: 100, type: 'absolute' }],
    cooldown: 3,
  },
  {
    id: 'marketing_boost',
    name: '마케팅 부스트',
    type: 'consumable',
    price: 5000,
    description: '24시간 동안 사용자 획득률 2배',
    effect: [{ resource: 'viralPotential', amount: 30, type: 'relative' }],
    cooldown: 7,
  },
  {
    id: 'server_upgrade_instant',
    name: '긴급 서버 확장',
    type: 'consumable',
    price: 10000,
    description: '서버 부하 50% 감소',
    effect: [{ resource: 'serverLoad', amount: -50, type: 'relative' }],
    cooldown: 30,
  },
  {
    id: 'reputation_repair',
    name: '평판 회복 캠페인',
    type: 'consumable',
    price: 8000,
    description: '평판 15 회복',
    effect: [{ resource: 'reputation', amount: 15, type: 'relative' }],
    cooldown: 14,
  },

  // 비소모품 (영구)
  {
    id: 'premium_theme',
    name: '프리미엄 테마 팩',
    type: 'non-consumable',
    price: 15000,
    description: '특별 UI 테마 해금',
    effect: [],
    purchaseLimit: 1,
  },
  {
    id: 'analytics_dashboard',
    name: '고급 분석 대시보드',
    type: 'non-consumable',
    price: 30000,
    description: '심층 비즈니스 분석 도구 해금',
    effect: [],
    purchaseLimit: 1,
  },
  {
    id: 'automation_pack',
    name: '자동화 팩',
    type: 'non-consumable',
    price: 50000,
    description: '반복 작업 자동화 기능 해금',
    effect: [],
    purchaseLimit: 1,
  },

  // 구독 (게임 내 앱 구독)
  {
    id: 'vip_membership',
    name: 'VIP 멤버십',
    type: 'subscription',
    price: 9900,
    description: '매일 보너스 자원 + 특별 이벤트 참여',
    effect: [
      { resource: 'luck', amount: 10, type: 'relative' },
      { resource: 'energy', amount: 10, type: 'relative' },
    ],
  },
];

export const iapRevenue: IAPRevenue = {
  items: iapItems,
  whaleThreshold: 100000,    // 10만원 이상 = 고래
  purchaseProbability: 0.02, // 2% 기본 구매 확률
  averageSpend: 5000,        // 평균 구매액 5,000원
};

// ============================================
// B2B 계약 템플릿
// ============================================

export const b2bContractTemplates: Omit<B2BContract, 'id' | 'clientName'>[] = [
  {
    type: 'license',
    monthlyFee: 500000,      // 월 50만원
    duration: 12,
    userCount: 50,
    requirements: ['기업 사업자등록증', '최소 50명 이상'],
    maintenanceRequired: true,
  },
  {
    type: 'license',
    monthlyFee: 2000000,     // 월 200만원
    duration: 12,
    userCount: 200,
    requirements: ['기업 사업자등록증', '최소 200명 이상'],
    maintenanceRequired: true,
  },
  {
    type: 'partnership',
    monthlyFee: 0,           // 수익 분배 모델
    duration: 24,
    revenueShare: 0.3,       // 30% 수익 분배
    requirements: ['파트너 계약서', '공동 마케팅 참여'],
    maintenanceRequired: false,
  },
  {
    type: 'whiteLabel',
    monthlyFee: 5000000,     // 월 500만원
    duration: 24,
    requirements: ['브랜딩 가이드라인', '기술 지원 계약'],
    maintenanceRequired: true,
  },
  {
    type: 'api',
    monthlyFee: 1000000,     // 월 100만원
    duration: 12,
    requirements: ['API 이용약관 동의', '보안 감사 통과'],
    maintenanceRequired: true,
  },
];

export const b2bRevenue: B2BRevenue = {
  contracts: [],  // 실제 계약은 게임 진행 중 생성
  acquisitionCost: 5000000,  // 고객 획득 비용 500만원
  renewalRate: 0.75,         // 75% 재계약율
  averageContractValue: 12000000,  // 평균 계약 가치 1,200만원/년
};

// ============================================
// 광고 수익 설정
// ============================================

export const adRevenue: AdRevenue = {
  enabled: true,
  types: ['banner', 'interstitial', 'rewarded', 'native'],
  cpm: {
    banner: 500,        // 배너: CPM 500원
    interstitial: 2000, // 전면: CPM 2,000원
    rewarded: 5000,     // 보상형: CPM 5,000원
    native: 1500,       // 네이티브: CPM 1,500원
  },
  fillRate: {
    banner: 0.85,       // 85% 채움률
    interstitial: 0.70, // 70%
    rewarded: 0.90,     // 90%
    native: 0.75,       // 75%
  },
  userTolerance: 50,    // 광고 허용도 50%
  premiumAdFree: true,  // 유료 사용자 광고 제거
};

// ============================================
// 통합 수익 모델
// ============================================

export const defaultRevenueModel: RevenueModel = {
  subscription: subscriptionRevenue,
  iap: iapRevenue,
  b2b: b2bRevenue,
  ads: adRevenue,
};

// ============================================
// 수익 계산 클래스
// ============================================

export interface UserDistribution {
  free: number;
  basic: number;
  premium: number;
  enterprise: number;
}

export interface RevenueCalculationResult {
  subscription: number;
  iap: number;
  b2b: number;
  ads: number;
  total: number;
  breakdown: {
    subscriptionByTier: Record<SubscriptionTier, number>;
    iapTransactions: number;
    b2bActiveContracts: number;
    adImpressions: number;
  };
}

export class RevenueCalculator {
  private model: RevenueModel;

  constructor(model: RevenueModel = defaultRevenueModel) {
    this.model = model;
  }

  // 월간 수익 계산
  calculateMonthlyRevenue(
    userDistribution: UserDistribution,
    activeB2BContracts: B2BContract[],
    options?: {
      iapMultiplier?: number;
      adMultiplier?: number;
      seasonalFactor?: number;
    }
  ): RevenueCalculationResult {
    const { iapMultiplier = 1, adMultiplier = 1, seasonalFactor = 1 } = options || {};

    // 구독 수익
    const subscriptionByTier: Record<SubscriptionTier, number> = {
      free: 0,
      basic: userDistribution.basic * this.model.subscription.plans[1].price,
      premium: userDistribution.premium * this.model.subscription.plans[2].price,
      enterprise: userDistribution.enterprise * this.model.subscription.plans[3].price,
    };
    const subscriptionTotal = Object.values(subscriptionByTier).reduce((a, b) => a + b, 0);

    // IAP 수익
    const totalPaidUsers = userDistribution.basic + userDistribution.premium;
    const iapTransactions = Math.floor(
      totalPaidUsers * this.model.iap.purchaseProbability * iapMultiplier * seasonalFactor
    );
    const iapTotal = iapTransactions * this.model.iap.averageSpend;

    // B2B 수익
    const b2bTotal = activeB2BContracts.reduce((sum, contract) => {
      return sum + contract.monthlyFee;
    }, 0);

    // 광고 수익 (무료 사용자만)
    const freeUsers = userDistribution.free;
    const dailyImpressions = freeUsers * 5;  // 사용자당 일평균 5회 노출
    const monthlyImpressions = dailyImpressions * 30;

    let adTotal = 0;
    if (this.model.ads.enabled) {
      // 광고 유형별 분배 (배너 60%, 전면 20%, 보상형 15%, 네이티브 5%)
      const distribution = { banner: 0.6, interstitial: 0.2, rewarded: 0.15, native: 0.05 };

      for (const [type, ratio] of Object.entries(distribution)) {
        const adType = type as AdType;
        const impressions = monthlyImpressions * ratio;
        const filledImpressions = impressions * this.model.ads.fillRate[adType];
        adTotal += (filledImpressions / 1000) * this.model.ads.cpm[adType];
      }

      adTotal *= adMultiplier * (this.model.ads.userTolerance / 100);
    }

    const total = subscriptionTotal + iapTotal + b2bTotal + adTotal;

    return {
      subscription: Math.round(subscriptionTotal),
      iap: Math.round(iapTotal),
      b2b: Math.round(b2bTotal),
      ads: Math.round(adTotal),
      total: Math.round(total),
      breakdown: {
        subscriptionByTier,
        iapTransactions,
        b2bActiveContracts: activeB2BContracts.length,
        adImpressions: Math.round(monthlyImpressions),
      },
    };
  }

  // 사용자 분포 예측 (다음 달)
  predictUserDistribution(
    current: UserDistribution,
    newUsers: number,
    contentQuality: number,
    reputation: number
  ): UserDistribution {
    const qualityMultiplier = contentQuality / 100;
    const reputationMultiplier = reputation / 100;
    const combinedMultiplier = (qualityMultiplier + reputationMultiplier) / 2;

    // 이탈 계산
    const churnedFree = Math.floor(current.free * this.model.subscription.churnRates.free);
    const churnedBasic = Math.floor(current.basic * this.model.subscription.churnRates.basic);
    const churnedPremium = Math.floor(current.premium * this.model.subscription.churnRates.premium);
    const churnedEnterprise = Math.floor(current.enterprise * this.model.subscription.churnRates.enterprise);

    // 전환 계산
    const convertedToBasic = Math.floor(
      current.free * this.model.subscription.conversionRates.basic * combinedMultiplier
    );
    const convertedToPremium = Math.floor(
      current.free * this.model.subscription.conversionRates.premium * combinedMultiplier
    );
    const upgradedToPremium = Math.floor(
      current.basic * this.model.subscription.upgradeRates.basic * combinedMultiplier
    );
    const downgradedToBasic = Math.floor(
      current.premium * this.model.subscription.downgradeRates.premium
    );
    const downgradedToFree = Math.floor(
      current.basic * this.model.subscription.downgradeRates.basic
    );

    // 새로운 분포 계산
    const newDistribution: UserDistribution = {
      free: Math.max(0,
        current.free
        - churnedFree
        - convertedToBasic
        - convertedToPremium
        + newUsers * 0.95  // 새 사용자의 95%는 무료
        + downgradedToFree
      ),
      basic: Math.max(0,
        current.basic
        - churnedBasic
        - upgradedToPremium
        + convertedToBasic
        + downgradedToBasic
        + Math.floor(newUsers * 0.04)  // 새 사용자의 4%는 베이직
      ),
      premium: Math.max(0,
        current.premium
        - churnedPremium
        - downgradedToBasic
        + convertedToPremium
        + upgradedToPremium
        + Math.floor(newUsers * 0.01)  // 새 사용자의 1%는 프리미엄
      ),
      enterprise: Math.max(0,
        current.enterprise
        - churnedEnterprise
        // 기업 고객은 B2B 영업으로 별도 획득
      ),
    };

    return newDistribution;
  }

  // ARPU (사용자당 평균 수익) 계산
  calculateARPU(revenue: RevenueCalculationResult, totalUsers: number): number {
    if (totalUsers === 0) return 0;
    return revenue.total / totalUsers;
  }

  // ARPPU (유료 사용자당 평균 수익) 계산
  calculateARPPU(revenue: RevenueCalculationResult, paidUsers: number): number {
    if (paidUsers === 0) return 0;
    const paidRevenue = revenue.subscription + revenue.iap;
    return paidRevenue / paidUsers;
  }

  // LTV (고객 생애 가치) 계산
  calculateLTV(tier: SubscriptionTier): number {
    const plan = this.model.subscription.plans.find(p => p.tier === tier);
    if (!plan) return 0;

    const churnRate = this.model.subscription.churnRates[tier];
    if (churnRate === 0) return plan.price * 24;  // 최대 2년

    const averageLifetime = 1 / churnRate;  // 평균 구독 기간 (월)
    return plan.price * averageLifetime;
  }

  // CAC (고객 획득 비용) 대비 LTV 비율
  calculateLTVtoCACRatio(tier: SubscriptionTier, cac: number): number {
    const ltv = this.calculateLTV(tier);
    if (cac === 0) return Infinity;
    return ltv / cac;
  }

  // MRR (월간 반복 수익) 계산
  calculateMRR(userDistribution: UserDistribution): number {
    return (
      userDistribution.basic * this.model.subscription.plans[1].price +
      userDistribution.premium * this.model.subscription.plans[2].price +
      userDistribution.enterprise * this.model.subscription.plans[3].price
    );
  }

  // ARR (연간 반복 수익) 계산
  calculateARR(userDistribution: UserDistribution): number {
    return this.calculateMRR(userDistribution) * 12;
  }

  // 수익 성장률 계산
  calculateGrowthRate(currentRevenue: number, previousRevenue: number): number {
    if (previousRevenue === 0) return currentRevenue > 0 ? 1 : 0;
    return (currentRevenue - previousRevenue) / previousRevenue;
  }

  // 월간 리포트 생성
  generateMonthlyReport(
    month: number,
    year: number,
    userDistribution: UserDistribution,
    previousDistribution: UserDistribution | null,
    activeContracts: B2BContract[]
  ): MonthlyRevenueReport {
    const revenue = this.calculateMonthlyRevenue(userDistribution, activeContracts);
    const totalUsers = Object.values(userDistribution).reduce((a, b) => a + b, 0);
    const previousTotal = previousDistribution
      ? Object.values(previousDistribution).reduce((a, b) => a + b, 0)
      : 0;

    return {
      month,
      year,
      subscription: {
        total: revenue.subscription,
        byTier: revenue.breakdown.subscriptionByTier,
        newSubscribers: Math.max(0, totalUsers - previousTotal),
        churned: previousDistribution
          ? Math.max(0, previousTotal - totalUsers + (totalUsers - previousTotal))
          : 0,
      },
      iap: {
        total: revenue.iap,
        transactions: revenue.breakdown.iapTransactions,
        averageTransaction: revenue.breakdown.iapTransactions > 0
          ? revenue.iap / revenue.breakdown.iapTransactions
          : 0,
      },
      b2b: {
        total: revenue.b2b,
        activeContracts: revenue.breakdown.b2bActiveContracts,
        newContracts: 0,  // 실제 게임에서 추적
        renewals: 0,
      },
      ads: {
        total: revenue.ads,
        impressions: revenue.breakdown.adImpressions,
        clicks: Math.floor(revenue.breakdown.adImpressions * 0.02),  // 2% CTR
      },
      total: revenue.total,
      growth: 0,  // 이전 달 데이터로 계산 필요
    };
  }

  // 수익 모델 업데이트
  updateModel(updates: Partial<RevenueModel>): void {
    this.model = {
      ...this.model,
      ...updates,
    };
  }

  getModel(): RevenueModel {
    return { ...this.model };
  }
}

// ============================================
// 유틸리티 함수
// ============================================

export function formatRevenue(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  } else if (amount >= 10000) {
    return `${Math.round(amount / 10000)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export function getTierName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    free: '무료',
    basic: '베이직',
    premium: '프리미엄',
    enterprise: '기업',
  };
  return names[tier];
}

export function getTierColor(tier: SubscriptionTier): string {
  const colors: Record<SubscriptionTier, string> = {
    free: '#9ca3af',      // gray
    basic: '#3b82f6',     // blue
    premium: '#8b5cf6',   // purple
    enterprise: '#f59e0b', // amber
  };
  return colors[tier];
}

export function getContractTypeName(type: B2BContractType): string {
  const names: Record<B2BContractType, string> = {
    license: '라이선스',
    partnership: '파트너십',
    whiteLabel: '화이트라벨',
    api: 'API',
  };
  return names[type];
}

// 싱글톤 인스턴스
export const revenueCalculator = new RevenueCalculator();

export default RevenueCalculator;
