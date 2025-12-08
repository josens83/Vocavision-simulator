/**
 * Chapter 6: Economy & Balance - Cost Model
 * 비용 모델 (한국 시장 기반 현실적인 비용 구조)
 */

import {
  FixedCostCategory,
  FixedCost,
  VariableCostCategory,
  VariableCost,
  OccasionalCostCategory,
  OccasionalCost,
  ScalingCost,
  CostModel,
  MonthlyCostReport,
} from './types';

// ============================================
// 고정 비용 정의 (1인 EdTech 스타트업 기준)
// ============================================

export const fixedCosts: FixedCost[] = [
  // 서버 비용 (AWS/GCP 기준)
  {
    category: 'server',
    name: '기본 서버 (AWS EC2)',
    monthlyCost: 100000,      // 월 10만원 (t3.medium 수준)
    required: true,
    scalable: true,
    scaleThreshold: 1000,     // 1,000 사용자
    scaleMultiplier: 2,
  },
  {
    category: 'server',
    name: '데이터베이스 (RDS)',
    monthlyCost: 80000,       // 월 8만원
    required: true,
    scalable: true,
    scaleThreshold: 5000,
    scaleMultiplier: 2.5,
  },
  {
    category: 'server',
    name: 'CDN (CloudFront)',
    monthlyCost: 30000,       // 월 3만원
    required: false,
    scalable: true,
    scaleThreshold: 10000,
    scaleMultiplier: 3,
  },
  {
    category: 'server',
    name: '스토리지 (S3)',
    monthlyCost: 20000,       // 월 2만원
    required: true,
    scalable: true,
    scaleThreshold: 10000,
    scaleMultiplier: 2,
  },

  // 사무실 비용 (홈오피스 기준)
  {
    category: 'office',
    name: '인터넷 (기가급)',
    monthlyCost: 50000,       // 월 5만원
    required: true,
    scalable: false,
  },
  {
    category: 'office',
    name: '전기/수도',
    monthlyCost: 100000,      // 월 10만원
    required: true,
    scalable: false,
  },

  // 소프트웨어 라이선스
  {
    category: 'software',
    name: 'GitHub Pro',
    monthlyCost: 5000,        // 월 약 5천원
    required: true,
    scalable: false,
  },
  {
    category: 'software',
    name: 'Figma Pro',
    monthlyCost: 15000,       // 월 약 1.5만원
    required: false,
    scalable: false,
  },
  {
    category: 'software',
    name: 'Google Workspace',
    monthlyCost: 7000,        // 월 약 7천원
    required: true,
    scalable: false,
  },
  {
    category: 'software',
    name: '분석 도구 (Mixpanel/Amplitude)',
    monthlyCost: 0,           // 무료 티어 사용
    required: false,
    scalable: true,
    scaleThreshold: 10000,
    scaleMultiplier: 10,      // 유료 전환 시 급증
  },
  {
    category: 'software',
    name: 'Notion',
    monthlyCost: 10000,       // 월 1만원
    required: false,
    scalable: false,
  },
  {
    category: 'software',
    name: 'Slack',
    monthlyCost: 0,           // 무료 티어
    required: false,
    scalable: true,
    scaleThreshold: 10,       // 팀원 10명 이상 시
    scaleMultiplier: 5,
  },

  // 보험
  {
    category: 'insurance',
    name: '개인사업자 보험',
    monthlyCost: 50000,       // 월 5만원
    required: false,
    scalable: false,
  },

  // 회계/세무
  {
    category: 'accounting',
    name: '세무사 기장료',
    monthlyCost: 100000,      // 월 10만원
    required: true,
    scalable: true,
    scaleThreshold: 100000000, // 매출 1억 이상
    scaleMultiplier: 3,
  },

  // 법무
  {
    category: 'legal',
    name: '법률 자문 (기본)',
    monthlyCost: 0,           // 필요시만
    required: false,
    scalable: false,
  },

  // 기본 마케팅
  {
    category: 'marketing_base',
    name: '도메인 & SSL',
    monthlyCost: 5000,        // 월 약 5천원
    required: true,
    scalable: false,
  },
  {
    category: 'marketing_base',
    name: 'SNS 관리 도구',
    monthlyCost: 10000,       // 월 1만원
    required: false,
    scalable: false,
  },
];

// ============================================
// 변동 비용 정의
// ============================================

export const variableCosts: VariableCost[] = [
  // 서버 사용량
  {
    category: 'serverUsage',
    name: 'API 호출 비용',
    unitCost: 0.1,            // 호출당 0.1원
    unit: '1000 API 호출당',
    bulkDiscount: [
      { threshold: 1000000, discount: 0.1 },    // 100만 이상 10% 할인
      { threshold: 10000000, discount: 0.2 },   // 1000만 이상 20% 할인
    ],
  },
  {
    category: 'serverUsage',
    name: 'AI API 비용 (OpenAI/Claude)',
    unitCost: 10,             // 요청당 약 10원
    unit: 'AI 요청당',
    bulkDiscount: [
      { threshold: 100000, discount: 0.15 },
    ],
  },

  // 대역폭
  {
    category: 'bandwidth',
    name: '데이터 전송',
    unitCost: 100,            // GB당 100원
    unit: 'GB당',
    bulkDiscount: [
      { threshold: 1000, discount: 0.2 },      // 1TB 이상 20% 할인
      { threshold: 10000, discount: 0.4 },     // 10TB 이상 40% 할인
    ],
  },
  {
    category: 'bandwidth',
    name: '미디어 스트리밍',
    unitCost: 200,            // GB당 200원
    unit: 'GB당',
  },

  // 결제 수수료
  {
    category: 'paymentFees',
    name: 'PG 수수료 (신용카드)',
    unitCost: 0.033,          // 3.3%
    unit: '결제액 대비 %',
  },
  {
    category: 'paymentFees',
    name: 'PG 수수료 (계좌이체)',
    unitCost: 0.015,          // 1.5%
    unit: '결제액 대비 %',
  },
  {
    category: 'paymentFees',
    name: '인앱 결제 수수료',
    unitCost: 0.30,           // 30% (앱스토어/구글플레이)
    unit: '결제액 대비 %',
  },

  // 고객 지원
  {
    category: 'customerSupport',
    name: '이메일 지원',
    unitCost: 500,            // 티켓당 500원
    unit: '지원 티켓당',
  },
  {
    category: 'customerSupport',
    name: '채팅봇 운영',
    unitCost: 50,             // 대화당 50원
    unit: '대화당',
  },

  // 콘텐츠 제작
  {
    category: 'contentCreation',
    name: '강의 영상 제작',
    unitCost: 500000,         // 강의당 50만원
    unit: '강의당',
  },
  {
    category: 'contentCreation',
    name: '교재 작성',
    unitCost: 200000,         // 교재당 20만원
    unit: '교재당',
  },
  {
    category: 'contentCreation',
    name: '문제 제작',
    unitCost: 5000,           // 문제당 5천원
    unit: '문제당',
  },

  // 프리랜서
  {
    category: 'freelance',
    name: '개발자 (시간제)',
    unitCost: 50000,          // 시간당 5만원
    unit: '시간당',
  },
  {
    category: 'freelance',
    name: '디자이너 (시간제)',
    unitCost: 40000,          // 시간당 4만원
    unit: '시간당',
  },
  {
    category: 'freelance',
    name: '콘텐츠 작가',
    unitCost: 30000,          // 시간당 3만원
    unit: '시간당',
  },
];

// ============================================
// 일회성/비정기 비용 정의
// ============================================

export const occasionalCosts: OccasionalCost[] = [
  // 장비
  {
    category: 'equipment',
    name: '노트북 교체',
    cost: 2500000,            // 250만원
    probability: 0.02,        // 월 2% (약 4년 주기)
    preventable: false,
  },
  {
    category: 'equipment',
    name: '모니터 구매',
    cost: 500000,             // 50만원
    probability: 0.01,
    preventable: false,
  },
  {
    category: 'equipment',
    name: '촬영 장비',
    cost: 1000000,            // 100만원
    probability: 0.01,
    preventable: false,
  },

  // 교육/훈련
  {
    category: 'training',
    name: '온라인 강좌 수강',
    cost: 200000,             // 20만원
    probability: 0.1,         // 월 10%
    preventable: true,
  },
  {
    category: 'training',
    name: '컨퍼런스 참가',
    cost: 300000,             // 30만원
    probability: 0.05,
    preventable: true,
  },

  // 이벤트
  {
    category: 'conference',
    name: '스타트업 행사 참가',
    cost: 100000,             // 10만원
    probability: 0.08,
    preventable: true,
  },
  {
    category: 'conference',
    name: '네트워킹 이벤트',
    cost: 50000,              // 5만원
    probability: 0.1,
    preventable: true,
  },

  // 비상 상황
  {
    category: 'emergency',
    name: '건강 문제 (병원비)',
    cost: 500000,             // 50만원
    probability: 0.03,
    preventable: true,
    preventionCost: 50000,    // 건강검진 5만원
  },
  {
    category: 'emergency',
    name: '가족 경조사',
    cost: 300000,             // 30만원
    probability: 0.05,
    preventable: false,
  },

  // 법적 분쟁
  {
    category: 'legal_dispute',
    name: '저작권 분쟁',
    cost: 5000000,            // 500만원
    probability: 0.01,
    preventable: true,
    preventionCost: 100000,   // 법률 검토 10만원
  },
  {
    category: 'legal_dispute',
    name: '환불/소비자 분쟁',
    cost: 1000000,            // 100만원
    probability: 0.02,
    preventable: true,
    preventionCost: 50000,    // CS 강화
  },

  // 보안 사고
  {
    category: 'security_breach',
    name: '데이터 유출 사고',
    cost: 10000000,           // 1000만원
    probability: 0.005,       // 0.5%
    preventable: true,
    preventionCost: 200000,   // 보안 점검 20만원
    insurance: 5000000,       // 보험 커버 500만원
  },
  {
    category: 'security_breach',
    name: '서버 해킹 시도',
    cost: 2000000,            // 200만원
    probability: 0.02,
    preventable: true,
    preventionCost: 100000,
  },

  // 확장
  {
    category: 'expansion',
    name: '사무실 이전',
    cost: 5000000,            // 500만원
    probability: 0,           // 수동 트리거
    preventable: true,
  },
  {
    category: 'expansion',
    name: '법인 전환',
    cost: 2000000,            // 200만원
    probability: 0,           // 수동 트리거
    preventable: true,
  },
];

// ============================================
// 규모에 따른 비용 변화
// ============================================

export const scalingCosts: ScalingCost[] = [
  // 1,000 사용자 달성
  {
    userThreshold: 1000,
    additionalFixedCosts: [
      {
        category: 'server',
        name: '서버 업그레이드',
        monthlyCost: 50000,
        required: true,
        scalable: true,
        scaleThreshold: 5000,
        scaleMultiplier: 2,
      },
    ],
    costMultiplier: 1.1,
    newRequirements: ['서버 모니터링 필요', '백업 시스템 구축'],
  },

  // 5,000 사용자 달성
  {
    userThreshold: 5000,
    additionalFixedCosts: [
      {
        category: 'software',
        name: '고객 지원 솔루션',
        monthlyCost: 100000,
        required: true,
        scalable: false,
      },
      {
        category: 'server',
        name: '로드 밸런서',
        monthlyCost: 80000,
        required: true,
        scalable: false,
      },
    ],
    costMultiplier: 1.3,
    newRequirements: ['정기 백업 필요', '고객 지원 체계 구축'],
  },

  // 10,000 사용자 달성
  {
    userThreshold: 10000,
    additionalFixedCosts: [
      {
        category: 'software',
        name: '유료 분석 도구',
        monthlyCost: 300000,
        required: true,
        scalable: false,
      },
      {
        category: 'legal',
        name: '개인정보 보호 컨설팅',
        monthlyCost: 200000,
        required: true,
        scalable: false,
      },
    ],
    costMultiplier: 1.5,
    newRequirements: ['개인정보 처리방침 정비', 'ISMS 인증 고려'],
  },

  // 50,000 사용자 달성
  {
    userThreshold: 50000,
    additionalFixedCosts: [
      {
        category: 'server',
        name: '전용 인프라',
        monthlyCost: 2000000,
        required: true,
        scalable: true,
        scaleThreshold: 100000,
        scaleMultiplier: 2,
      },
      {
        category: 'software',
        name: 'CDN 프리미엄',
        monthlyCost: 500000,
        required: true,
        scalable: false,
      },
      {
        category: 'insurance',
        name: '사이버 보험',
        monthlyCost: 300000,
        required: true,
        scalable: false,
      },
    ],
    costMultiplier: 2.0,
    newRequirements: ['24/7 모니터링 필요', '장애 대응 체계 구축'],
  },

  // 100,000 사용자 달성
  {
    userThreshold: 100000,
    additionalFixedCosts: [
      {
        category: 'office',
        name: '사무실 임대',
        monthlyCost: 3000000,
        required: false,
        scalable: false,
      },
      {
        category: 'legal',
        name: '상시 법률 자문',
        monthlyCost: 500000,
        required: true,
        scalable: false,
      },
    ],
    costMultiplier: 2.5,
    newRequirements: ['팀 확장 고려', '법인 전환 권장'],
  },
];

// ============================================
// 통합 비용 모델
// ============================================

export const defaultCostModel: CostModel = {
  fixed: fixedCosts,
  variable: variableCosts,
  occasional: occasionalCosts,
  scaling: scalingCosts,
  taxRate: 0.1,           // 10% (개인사업자 기준)
  emergencyFund: 0.1,     // 비상 자금 10%
};

// ============================================
// 비용 계산 클래스
// ============================================

export interface CostCalculationInput {
  users: number;
  monthlyRevenue: number;
  apiCalls: number;
  aiRequests: number;
  dataTransferGB: number;
  supportTickets: number;
  newContent: number;
  freelanceHours: number;
}

export interface CostCalculationResult {
  fixed: number;
  variable: number;
  occasional: number;
  tax: number;
  total: number;
  perUser: number;
  breakdown: {
    fixedByCategory: Partial<Record<FixedCostCategory, number>>;
    variableByCategory: Partial<Record<VariableCostCategory, number>>;
    occasionalItems: { name: string; cost: number }[];
  };
}

export class CostCalculator {
  private model: CostModel;
  private currentUserThreshold: number = 0;
  private activeScalingCosts: ScalingCost[] = [];

  constructor(model: CostModel = defaultCostModel) {
    this.model = model;
  }

  // 월간 비용 계산
  calculateMonthlyCosts(input: CostCalculationInput): CostCalculationResult {
    // 스케일링 업데이트
    this.updateScalingCosts(input.users);

    // 고정 비용 계산
    const fixedResult = this.calculateFixedCosts(input.users);

    // 변동 비용 계산
    const variableResult = this.calculateVariableCosts(input);

    // 일회성 비용 계산 (확률 기반)
    const occasionalResult = this.calculateOccasionalCosts();

    // 세금 계산
    const preTaxTotal = fixedResult.total + variableResult.total + occasionalResult.total;
    const tax = input.monthlyRevenue > preTaxTotal
      ? (input.monthlyRevenue - preTaxTotal) * this.model.taxRate
      : 0;

    const total = preTaxTotal + tax;
    const perUser = input.users > 0 ? total / input.users : 0;

    return {
      fixed: fixedResult.total,
      variable: variableResult.total,
      occasional: occasionalResult.total,
      tax: Math.round(tax),
      total: Math.round(total),
      perUser: Math.round(perUser),
      breakdown: {
        fixedByCategory: fixedResult.byCategory,
        variableByCategory: variableResult.byCategory,
        occasionalItems: occasionalResult.items,
      },
    };
  }

  // 고정 비용 계산
  private calculateFixedCosts(users: number): {
    total: number;
    byCategory: Partial<Record<FixedCostCategory, number>>;
  } {
    const byCategory: Partial<Record<FixedCostCategory, number>> = {};
    let total = 0;

    // 기본 고정 비용
    for (const cost of this.model.fixed) {
      if (!cost.required && Math.random() > 0.7) continue;  // 비필수는 70%만 적용

      let amount = cost.monthlyCost;

      // 스케일링 적용
      if (cost.scalable && cost.scaleThreshold && users > cost.scaleThreshold) {
        const scaleMultiplier = cost.scaleMultiplier || 1;
        const scaleFactor = Math.floor(users / cost.scaleThreshold);
        amount *= Math.min(scaleFactor * scaleMultiplier, 10);  // 최대 10배
      }

      byCategory[cost.category] = (byCategory[cost.category] || 0) + amount;
      total += amount;
    }

    // 추가 스케일링 비용
    for (const scaling of this.activeScalingCosts) {
      for (const cost of scaling.additionalFixedCosts) {
        byCategory[cost.category] = (byCategory[cost.category] || 0) + cost.monthlyCost;
        total += cost.monthlyCost;
      }

      // 비용 배율 적용
      total *= scaling.costMultiplier;
    }

    return { total: Math.round(total), byCategory };
  }

  // 변동 비용 계산
  private calculateVariableCosts(input: CostCalculationInput): {
    total: number;
    byCategory: Partial<Record<VariableCostCategory, number>>;
  } {
    const byCategory: Partial<Record<VariableCostCategory, number>> = {};
    let total = 0;

    // 서버 사용량
    const apiCost = this.calculateVariableCost('serverUsage', 'API 호출 비용', input.apiCalls / 1000);
    const aiCost = this.calculateVariableCost('serverUsage', 'AI API 비용 (OpenAI/Claude)', input.aiRequests);
    byCategory.serverUsage = apiCost + aiCost;
    total += apiCost + aiCost;

    // 대역폭
    const bandwidthCost = this.calculateVariableCost('bandwidth', '데이터 전송', input.dataTransferGB);
    byCategory.bandwidth = bandwidthCost;
    total += bandwidthCost;

    // 결제 수수료 (수익의 일정 비율)
    const paymentFees = input.monthlyRevenue * 0.035;  // 평균 3.5%
    byCategory.paymentFees = paymentFees;
    total += paymentFees;

    // 고객 지원
    const supportCost = this.calculateVariableCost('customerSupport', '이메일 지원', input.supportTickets);
    byCategory.customerSupport = supportCost;
    total += supportCost;

    // 콘텐츠 제작
    const contentCost = this.calculateVariableCost('contentCreation', '강의 영상 제작', input.newContent);
    byCategory.contentCreation = contentCost;
    total += contentCost;

    // 프리랜서
    const freelanceCost = this.calculateVariableCost('freelance', '개발자 (시간제)', input.freelanceHours);
    byCategory.freelance = freelanceCost;
    total += freelanceCost;

    return { total: Math.round(total), byCategory };
  }

  // 개별 변동 비용 계산
  private calculateVariableCost(
    category: VariableCostCategory,
    name: string,
    units: number
  ): number {
    const cost = this.model.variable.find(
      v => v.category === category && v.name === name
    );

    if (!cost) return 0;

    let totalCost = cost.unitCost * units;

    // 대량 할인 적용
    if (cost.bulkDiscount) {
      for (const discount of cost.bulkDiscount) {
        if (units >= discount.threshold) {
          totalCost *= (1 - discount.discount);
        }
      }
    }

    return totalCost;
  }

  // 일회성 비용 계산
  private calculateOccasionalCosts(): {
    total: number;
    items: { name: string; cost: number }[];
  } {
    const items: { name: string; cost: number }[] = [];
    let total = 0;

    for (const cost of this.model.occasional) {
      if (cost.probability > 0 && Math.random() < cost.probability) {
        let actualCost = cost.cost;

        // 보험 커버리지 적용
        if (cost.insurance) {
          actualCost = Math.max(0, actualCost - cost.insurance);
        }

        items.push({ name: cost.name, cost: actualCost });
        total += actualCost;
      }
    }

    return { total: Math.round(total), items };
  }

  // 스케일링 비용 업데이트
  private updateScalingCosts(users: number): void {
    this.activeScalingCosts = this.model.scaling.filter(
      s => users >= s.userThreshold
    );
  }

  // 예방 가능 비용 계산
  getPreventableCosts(): { name: string; cost: number; preventionCost: number; roi: number }[] {
    return this.model.occasional
      .filter(c => c.preventable && c.preventionCost)
      .map(c => ({
        name: c.name,
        cost: c.cost,
        preventionCost: c.preventionCost!,
        roi: (c.cost * c.probability) / c.preventionCost!,
      }))
      .sort((a, b) => b.roi - a.roi);
  }

  // 비용 최적화 제안
  getOptimizationSuggestions(costs: CostCalculationResult): string[] {
    const suggestions: string[] = [];

    // 고정 비용이 높은 경우
    if (costs.fixed > costs.total * 0.6) {
      suggestions.push('고정 비용 비율이 높습니다. 서비스 최적화를 고려하세요.');
    }

    // 결제 수수료가 높은 경우
    const paymentFees = costs.breakdown.variableByCategory.paymentFees || 0;
    if (paymentFees > costs.total * 0.05) {
      suggestions.push('결제 수수료 비율이 높습니다. 연간 결제 옵션을 고려하세요.');
    }

    // 사용자당 비용이 높은 경우
    if (costs.perUser > 1000) {
      suggestions.push('사용자당 비용이 높습니다. 스케일 효율성을 점검하세요.');
    }

    return suggestions;
  }

  // 손익분기점 계산
  calculateBreakEvenPoint(
    averageRevenuePerUser: number,
    fixedCosts: number,
    variableCostPerUser: number
  ): number {
    const contributionMargin = averageRevenuePerUser - variableCostPerUser;
    if (contributionMargin <= 0) return Infinity;
    return Math.ceil(fixedCosts / contributionMargin);
  }

  // 버닝 레이트 계산
  calculateBurnRate(monthlyRevenue: number, monthlyCosts: number): number {
    return Math.max(0, monthlyCosts - monthlyRevenue);
  }

  // 런웨이 계산 (남은 개월 수)
  calculateRunway(cash: number, burnRate: number): number {
    if (burnRate <= 0) return Infinity;
    return Math.floor(cash / burnRate);
  }

  // 월간 리포트 생성
  generateMonthlyReport(
    month: number,
    year: number,
    input: CostCalculationInput
  ): MonthlyCostReport {
    const costs = this.calculateMonthlyCosts(input);

    return {
      month,
      year,
      fixed: {
        total: costs.fixed,
        byCategory: costs.breakdown.fixedByCategory as Record<FixedCostCategory, number>,
      },
      variable: {
        total: costs.variable,
        byCategory: costs.breakdown.variableByCategory as Record<VariableCostCategory, number>,
      },
      occasional: {
        total: costs.occasional,
        items: costs.breakdown.occasionalItems,
      },
      tax: costs.tax,
      total: costs.total,
      perUser: costs.perUser,
    };
  }

  // 모델 업데이트
  updateModel(updates: Partial<CostModel>): void {
    this.model = {
      ...this.model,
      ...updates,
    };
  }

  getModel(): CostModel {
    return { ...this.model };
  }

  // 스케일링 요구사항 조회
  getScalingRequirements(users: number): string[] {
    const requirements: string[] = [];

    for (const scaling of this.model.scaling) {
      if (users >= scaling.userThreshold) {
        requirements.push(...scaling.newRequirements);
      }
    }

    return [...new Set(requirements)];  // 중복 제거
  }
}

// ============================================
// 유틸리티 함수
// ============================================

export function formatCost(amount: number): string {
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  } else if (amount >= 10000) {
    return `${Math.round(amount / 10000)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export function getCostCategoryName(category: string): string {
  const names: Record<string, string> = {
    server: '서버',
    office: '사무실',
    software: '소프트웨어',
    insurance: '보험',
    accounting: '회계/세무',
    legal: '법무',
    marketing_base: '마케팅',
    serverUsage: '서버 사용량',
    bandwidth: '대역폭',
    paymentFees: '결제 수수료',
    customerSupport: '고객 지원',
    contentCreation: '콘텐츠 제작',
    freelance: '프리랜서',
    equipment: '장비',
    training: '교육',
    conference: '컨퍼런스',
    emergency: '비상',
    legal_dispute: '법적 분쟁',
    security_breach: '보안 사고',
    expansion: '확장',
  };
  return names[category] || category;
}

export function getCostCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    server: '#ef4444',
    office: '#f97316',
    software: '#eab308',
    insurance: '#84cc16',
    accounting: '#22c55e',
    legal: '#14b8a6',
    marketing_base: '#06b6d4',
    serverUsage: '#3b82f6',
    bandwidth: '#6366f1',
    paymentFees: '#8b5cf6',
    customerSupport: '#a855f7',
    contentCreation: '#d946ef',
    freelance: '#ec4899',
    equipment: '#f43f5e',
    training: '#78716c',
    conference: '#737373',
    emergency: '#dc2626',
    legal_dispute: '#b91c1c',
    security_breach: '#991b1b',
    expansion: '#0d9488',
  };
  return colors[category] || '#888888';
}

// 싱글톤 인스턴스
export const costCalculator = new CostCalculator();

export default CostCalculator;
