/**
 * Chapter 6: Economy & Balance - Type Definitions
 * 경제 시스템 타입 정의
 */

// ============================================
// 자원 타입
// ============================================

// 주요 자원
export interface PrimaryResources {
  cash: number;           // 현금 (원)
  users: number;          // 총 사용자 수
  energy: number;         // 에너지 (0-100)
  time: number;           // 남은 행동 포인트
  reputation: number;     // 평판 (0-100)
}

// 보조 자원
export interface SecondaryResources {
  techDebt: number;       // 기술 부채 (0-100)
  serverLoad: number;     // 서버 부하 (0-100)
  contentQuality: number; // 콘텐츠 품질 (0-100)
  marketShare: number;    // 시장 점유율 (0-100)
  brandValue: number;     // 브랜드 가치 (0-100)
  teamMorale: number;     // 팀 사기 (0-100, 1인이지만 미래 확장성)
}

// 히든 자원 (내부 계산용)
export interface HiddenResources {
  luck: number;           // 운 (이벤트 확률 조정)
  burnoutRisk: number;    // 번아웃 위험도
  viralPotential: number; // 바이럴 잠재력
  investorInterest: number; // 투자자 관심도
  regulatoryRisk: number; // 규제 리스크
}

// 통합 자원 시스템
export interface ResourceSystem {
  primary: PrimaryResources;
  secondary: SecondaryResources;
  hidden: HiddenResources;
}

// 자원 변화
export interface ResourceChange {
  resource: keyof PrimaryResources | keyof SecondaryResources | keyof HiddenResources;
  amount: number;
  type: 'absolute' | 'relative' | 'multiply';
  reason?: string;
}

// 자원 제한
export interface ResourceLimits {
  min: number;
  max: number;
  softCap?: number;  // 소프트 캡 (이 이상은 감소율 적용)
  hardCap?: number;  // 하드 캡 (절대 초과 불가)
}

// ============================================
// 자원 상호작용
// ============================================

export interface ResourceInteraction {
  source: keyof PrimaryResources | keyof SecondaryResources;
  target: keyof PrimaryResources | keyof SecondaryResources;
  effect: number;      // 영향력 (-1 ~ 1)
  threshold?: number;  // 트리거 임계값
  delay?: number;      // 지연 턴 수
  description: string;
}

// 자원 상호작용 매트릭스
export type ResourceInteractionMatrix = ResourceInteraction[];

// ============================================
// 수익 모델
// ============================================

// 구독 등급
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';

// 구독 플랜
export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;          // 월 가격 (원)
  features: string[];
  userLimit?: number;     // 동시 접속 제한
  contentAccess: number;  // 콘텐츠 접근률 (0-100)
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
}

// 구독 수익 모델
export interface SubscriptionRevenue {
  plans: SubscriptionPlan[];
  conversionRates: Record<SubscriptionTier, number>;  // 무료→유료 전환율
  churnRates: Record<SubscriptionTier, number>;       // 이탈률 (월간)
  upgradeRates: Record<SubscriptionTier, number>;     // 업그레이드율
  downgradeRates: Record<SubscriptionTier, number>;   // 다운그레이드율
}

// IAP 아이템 타입
export type IAPItemType = 'consumable' | 'non-consumable' | 'subscription';

// IAP 아이템
export interface IAPItem {
  id: string;
  name: string;
  type: IAPItemType;
  price: number;
  description: string;
  effect: ResourceChange[];
  purchaseLimit?: number;  // 구매 제한
  cooldown?: number;       // 재구매 쿨다운 (일)
}

// IAP 수익 모델
export interface IAPRevenue {
  items: IAPItem[];
  whaleThreshold: number;     // 고래 사용자 기준 금액
  purchaseProbability: number; // 기본 구매 확률
  averageSpend: number;        // 평균 구매 금액
}

// B2B 계약 타입
export type B2BContractType = 'license' | 'partnership' | 'whiteLabel' | 'api';

// B2B 계약
export interface B2BContract {
  id: string;
  type: B2BContractType;
  clientName: string;
  monthlyFee: number;
  duration: number;          // 계약 기간 (개월)
  userCount?: number;        // 사용자 수 (라이선스)
  revenueShare?: number;     // 수익 분배율 (파트너십)
  requirements: string[];
  maintenanceRequired: boolean;
}

// B2B 수익 모델
export interface B2BRevenue {
  contracts: B2BContract[];
  acquisitionCost: number;    // 고객 획득 비용
  renewalRate: number;        // 재계약율
  averageContractValue: number;
}

// 광고 타입
export type AdType = 'banner' | 'interstitial' | 'rewarded' | 'native';

// 광고 수익 모델
export interface AdRevenue {
  enabled: boolean;
  types: AdType[];
  cpm: Record<AdType, number>;           // 1000회 노출당 수익
  fillRate: Record<AdType, number>;      // 광고 채움률
  userTolerance: number;                 // 사용자 광고 허용도 (0-100)
  premiumAdFree: boolean;                // 프리미엄 광고 제거 여부
}

// 통합 수익 모델
export interface RevenueModel {
  subscription: SubscriptionRevenue;
  iap: IAPRevenue;
  b2b: B2BRevenue;
  ads: AdRevenue;
}

// 월간 수익 리포트
export interface MonthlyRevenueReport {
  month: number;
  year: number;
  subscription: {
    total: number;
    byTier: Record<SubscriptionTier, number>;
    newSubscribers: number;
    churned: number;
  };
  iap: {
    total: number;
    transactions: number;
    averageTransaction: number;
  };
  b2b: {
    total: number;
    activeContracts: number;
    newContracts: number;
    renewals: number;
  };
  ads: {
    total: number;
    impressions: number;
    clicks: number;
  };
  total: number;
  growth: number;  // 전월 대비 성장률
}

// ============================================
// 비용 모델
// ============================================

// 고정 비용 카테고리
export type FixedCostCategory =
  | 'server'           // 서버 비용
  | 'office'           // 사무실
  | 'software'         // 소프트웨어 라이선스
  | 'insurance'        // 보험
  | 'accounting'       // 회계/세무
  | 'legal'            // 법무
  | 'marketing_base';  // 기본 마케팅

// 고정 비용
export interface FixedCost {
  category: FixedCostCategory;
  name: string;
  monthlyCost: number;
  required: boolean;        // 필수 여부
  scalable: boolean;        // 확장 가능 여부
  scaleThreshold?: number;  // 확장 트리거 (사용자 수)
  scaleMultiplier?: number; // 확장 배율
}

// 변동 비용 카테고리
export type VariableCostCategory =
  | 'serverUsage'      // 서버 사용량
  | 'bandwidth'        // 대역폭
  | 'paymentFees'      // 결제 수수료
  | 'customerSupport'  // 고객 지원
  | 'contentCreation'  // 콘텐츠 제작
  | 'freelance';       // 프리랜서

// 변동 비용
export interface VariableCost {
  category: VariableCostCategory;
  name: string;
  unitCost: number;         // 단위당 비용
  unit: string;             // 단위 (예: "사용자당", "GB당")
  minimumUnits?: number;    // 최소 단위
  maximumUnits?: number;    // 최대 단위
  bulkDiscount?: {          // 대량 할인
    threshold: number;
    discount: number;
  }[];
}

// 일회성 비용 카테고리
export type OccasionalCostCategory =
  | 'equipment'        // 장비
  | 'training'         // 교육/훈련
  | 'conference'       // 컨퍼런스/이벤트
  | 'emergency'        // 비상 상황
  | 'legal_dispute'    // 법적 분쟁
  | 'security_breach'  // 보안 사고
  | 'expansion';       // 확장

// 일회성 비용
export interface OccasionalCost {
  category: OccasionalCostCategory;
  name: string;
  cost: number;
  probability: number;      // 발생 확률 (월간)
  preventable: boolean;     // 예방 가능 여부
  preventionCost?: number;  // 예방 비용
  insurance?: number;       // 보험 커버리지
}

// 규모에 따른 비용 변화
export interface ScalingCost {
  userThreshold: number;    // 사용자 수 기준
  additionalFixedCosts: FixedCost[];
  costMultiplier: number;   // 비용 배율
  newRequirements: string[];
}

// 통합 비용 모델
export interface CostModel {
  fixed: FixedCost[];
  variable: VariableCost[];
  occasional: OccasionalCost[];
  scaling: ScalingCost[];
  taxRate: number;          // 세율
  emergencyFund: number;    // 비상 자금 비율
}

// 월간 비용 리포트
export interface MonthlyCostReport {
  month: number;
  year: number;
  fixed: {
    total: number;
    byCategory: Record<FixedCostCategory, number>;
  };
  variable: {
    total: number;
    byCategory: Record<VariableCostCategory, number>;
  };
  occasional: {
    total: number;
    items: { name: string; cost: number }[];
  };
  tax: number;
  total: number;
  perUser: number;  // 사용자당 비용
}

// ============================================
// 난이도 시스템
// ============================================

export type DifficultyLevel = 'story' | 'easy' | 'normal' | 'hard' | 'realistic';

// 난이도 설정
export interface DifficultySettings {
  level: DifficultyLevel;
  name: string;
  description: string;

  // 자원 조정
  startingCash: number;
  startingUsers: number;
  energyRecoveryRate: number;
  timePerDay: number;

  // 수익 조정
  revenueMultiplier: number;
  conversionRateMultiplier: number;
  churnRateMultiplier: number;

  // 비용 조정
  costMultiplier: number;
  occasionalCostFrequency: number;

  // 이벤트 조정
  negativeEventFrequency: number;
  positiveEventFrequency: number;
  eventSeverity: number;

  // 경쟁 조정
  competitorAggression: number;
  marketVolatility: number;

  // 기타
  tutorialEnabled: boolean;
  hintsEnabled: boolean;
  autoSaveFrequency: number;
  undoEnabled: boolean;
  undoLimit: number;
}

// 커스텀 난이도 옵션
export interface CustomDifficultyOptions {
  economy: {
    startingCash: number;
    revenueMultiplier: number;
    costMultiplier: number;
  };
  gameplay: {
    energyRecoveryRate: number;
    timePerDay: number;
    undoEnabled: boolean;
  };
  events: {
    negativeFrequency: number;
    positiveFrequency: number;
    severity: number;
  };
  competition: {
    aggression: number;
    marketVolatility: number;
  };
}

// 난이도 프리셋
export interface DifficultyPreset {
  level: DifficultyLevel;
  settings: DifficultySettings;
}

// 동적 난이도 조절 (DDA)
export interface DynamicDifficultyAdjustment {
  enabled: boolean;
  targetSuccessRate: number;  // 목표 성공률 (0-1)
  adjustmentSpeed: number;    // 조정 속도 (0-1)
  minDifficulty: number;      // 최소 난이도 (0-1)
  maxDifficulty: number;      // 최대 난이도 (0-1)
  metrics: {
    recentWins: number;
    recentLosses: number;
    averageProgress: number;
    frustrationIndex: number;
  };
}

// 난이도 시스템
export interface DifficultySystem {
  current: DifficultySettings;
  presets: DifficultyPreset[];
  custom: CustomDifficultyOptions | null;
  dda: DynamicDifficultyAdjustment;
}

// ============================================
// 진행도 시스템
// ============================================

export type GamePhase = 'early' | 'growth' | 'scaling' | 'mature' | 'exit';

// 게임 단계 정의
export interface PhaseDefinition {
  phase: GamePhase;
  name: string;
  description: string;
  userThreshold: { min: number; max: number };
  revenueThreshold: { min: number; max: number };
  monthThreshold: { min: number; max: number };
  challenges: string[];
  opportunities: string[];
  unlockedFeatures: string[];
}

// 마일스톤
export interface Milestone {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'revenue' | 'product' | 'personal' | 'business';
  requirement: {
    type: string;
    value: number;
    comparison: '>' | '>=' | '==' | '<' | '<=';
  };
  reward: {
    type: 'cash' | 'users' | 'reputation' | 'unlock' | 'achievement';
    value: number | string;
  };
  achieved: boolean;
  achievedAt?: Date;
}

// 성장 곡선 포인트
export interface GrowthCurvePoint {
  month: number;
  expectedUsers: number;
  expectedRevenue: number;
  expectedCosts: number;
  variance: number;  // 허용 편차
}

// 진행도 곡선
export interface ProgressionCurve {
  type: 'linear' | 'exponential' | 'sigmoid' | 'custom';
  points: GrowthCurvePoint[];
  idealPath: GrowthCurvePoint[];
  actualPath: GrowthCurvePoint[];
}

// 진행도 시스템
export interface ProgressionSystem {
  currentPhase: GamePhase;
  phases: PhaseDefinition[];
  milestones: Milestone[];
  curve: ProgressionCurve;
  monthsPlayed: number;
  totalDaysPlayed: number;
}

// ============================================
// 밸런스 테스팅
// ============================================

// 시뮬레이션 결과
export interface SimulationResult {
  id: string;
  difficulty: DifficultyLevel;
  seed: number;

  // 결과 통계
  monthsPlayed: number;
  finalUsers: number;
  finalCash: number;
  finalRevenue: number;
  peakUsers: number;
  peakRevenue: number;

  // 결과 분류
  outcome: 'success' | 'failure' | 'stagnation';
  failureReason?: string;

  // 상세 데이터
  monthlyData: {
    month: number;
    users: number;
    revenue: number;
    costs: number;
    cash: number;
    events: string[];
  }[];

  // 메타데이터
  runTime: number;
  timestamp: Date;
}

// 밸런스 메트릭
export interface BalanceMetrics {
  difficulty: DifficultyLevel;
  sampleSize: number;

  // 성공률
  successRate: number;
  averagePlaytime: number;
  medianPlaytime: number;

  // 경제 지표
  averageFinalCash: number;
  averageFinalUsers: number;
  averageMonthlyRevenue: number;
  revenueVariance: number;

  // 게임플레이 지표
  averageEventsPerGame: number;
  mostCommonFailure: string;
  bottleneckPoints: number[];

  // 밸런스 점수
  overallScore: number;  // 0-100
  economyScore: number;
  progressionScore: number;
  engagementScore: number;
}

// 밸런스 경고
export interface BalanceWarning {
  type: 'critical' | 'warning' | 'info';
  category: string;
  message: string;
  affectedDifficulty: DifficultyLevel[];
  suggestion: string;
}

// 밸런스 테스팅 시스템
export interface BalanceTestingSystem {
  simulations: SimulationResult[];
  metrics: Record<DifficultyLevel, BalanceMetrics>;
  warnings: BalanceWarning[];
  lastTestRun: Date | null;
  autoTestEnabled: boolean;
}

// ============================================
// 재무 시뮬레이션
// ============================================

// 재무 예측
export interface FinancialForecast {
  month: number;
  year: number;
  projectedRevenue: number;
  projectedCosts: number;
  projectedProfit: number;
  projectedCash: number;
  projectedUsers: number;
  confidence: number;  // 신뢰도 (0-1)
}

// 재무 시나리오
export interface FinancialScenario {
  id: string;
  name: string;
  description: string;
  assumptions: {
    userGrowthRate: number;
    revenueGrowthRate: number;
    costGrowthRate: number;
    churnRate: number;
    conversionRate: number;
  };
  forecast: FinancialForecast[];
}

// 캐시플로우 상태
export interface CashFlowStatus {
  current: number;
  projected30Days: number;
  projected90Days: number;
  burnRate: number;         // 월간 소진율
  runway: number;           // 남은 개월 수
  breakEvenPoint: number | null;  // 손익분기점 (월)
  isHealthy: boolean;
}

// 재무 시뮬레이션 시스템
export interface FinancialSimulation {
  currentCashFlow: CashFlowStatus;
  scenarios: FinancialScenario[];
  activeScenario: string | null;
  historicalData: {
    month: number;
    year: number;
    revenue: number;
    costs: number;
    profit: number;
    cash: number;
    users: number;
  }[];
}

// ============================================
// 이벤트 타입
// ============================================

export type EconomyEventType =
  | 'resource_change'
  | 'revenue_change'
  | 'cost_change'
  | 'difficulty_change'
  | 'milestone_achieved'
  | 'phase_transition'
  | 'balance_warning'
  | 'financial_alert';

export interface EconomyEvent {
  type: EconomyEventType;
  timestamp: Date;
  data: any;
  description: string;
}

// ============================================
// 통합 경제 시스템
// ============================================

export interface EconomyState {
  resources: ResourceSystem;
  revenue: RevenueModel;
  costs: CostModel;
  difficulty: DifficultySystem;
  progression: ProgressionSystem;
  balance: BalanceTestingSystem;
  financial: FinancialSimulation;

  // 히스토리
  revenueHistory: MonthlyRevenueReport[];
  costHistory: MonthlyCostReport[];
  eventLog: EconomyEvent[];
}

// 경제 액션
export type EconomyAction =
  | { type: 'UPDATE_RESOURCE'; payload: ResourceChange }
  | { type: 'UPDATE_RESOURCES'; payload: ResourceChange[] }
  | { type: 'SET_DIFFICULTY'; payload: DifficultyLevel }
  | { type: 'SET_CUSTOM_DIFFICULTY'; payload: CustomDifficultyOptions }
  | { type: 'ACHIEVE_MILESTONE'; payload: string }
  | { type: 'TRANSITION_PHASE'; payload: GamePhase }
  | { type: 'ADD_REVENUE_REPORT'; payload: MonthlyRevenueReport }
  | { type: 'ADD_COST_REPORT'; payload: MonthlyCostReport }
  | { type: 'RUN_SIMULATION'; payload: SimulationResult }
  | { type: 'UPDATE_FORECAST'; payload: FinancialForecast[] }
  | { type: 'RESET_ECONOMY' };

export default EconomyState;
