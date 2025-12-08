/**
 * Chapter 6: Economy & Balance - Main Index
 * 경제 시스템 통합 익스포트
 */

// Types
export * from './types';

// Resources
export {
  ResourceManager,
  resourceManager,
  initialResourceSystem,
  initialPrimaryResources,
  initialSecondaryResources,
  initialHiddenResources,
  resourceLimits,
  resourceInteractions,
  calculateResourceScore,
  getResourceCategory,
  formatResourceValue,
  getResourceIcon,
  getResourceColor,
} from './resources';

// Revenue
export {
  RevenueCalculator,
  revenueCalculator,
  defaultRevenueModel,
  subscriptionPlans,
  subscriptionRevenue,
  iapItems,
  iapRevenue,
  b2bContractTemplates,
  b2bRevenue,
  adRevenue,
  formatRevenue,
  getTierName,
  getTierColor,
  getContractTypeName,
  type UserDistribution,
  type RevenueCalculationResult,
} from './revenue';

// Costs
export {
  CostCalculator,
  costCalculator,
  defaultCostModel,
  fixedCosts,
  variableCosts,
  occasionalCosts,
  scalingCosts,
  formatCost,
  getCostCategoryName,
  getCostCategoryColor,
  type CostCalculationInput,
  type CostCalculationResult,
} from './costs';

// Difficulty
export {
  DifficultyManager,
  difficultyManager,
  difficultyPresets,
  defaultDDA,
  compareDifficulties,
  getDifficultyIndex,
  getDifficultyColor,
  getDifficultyIcon,
  getDifficultyStars,
  calculateDifficultyScore,
  estimateSuccessRate,
  estimateAveragePlaytime,
} from './difficulty';

// Progression
export {
  ProgressionManager,
  progressionManager,
  phaseDefinitions,
  milestones,
  idealGrowthCurve,
  getPhaseColor,
  getPhaseIcon,
  getMilestoneIcon,
  formatMilestoneReward,
} from './progression';

// Balance Engine
export {
  BalanceEngine,
  balanceEngine,
  quickBalanceCheck,
  type SimulationConfig,
} from './balanceEngine';

// Financial Simulation
export {
  FinancialSimulator,
  financialSimulator,
  defaultScenarios,
  formatCurrency,
  formatPercentage,
  getHealthStatusColor,
  getHealthStatusIcon,
  type CurrentFinancials,
} from './financialSimulation';

// Economy Statistics
export const ECONOMY_STATISTICS = {
  primaryResources: 5,
  secondaryResources: 6,
  hiddenResources: 5,
  resourceInteractions: 15,
  subscriptionPlans: 4,
  iapItems: 9,
  b2bContractTypes: 4,
  fixedCostCategories: 7,
  variableCostCategories: 6,
  occasionalCostCategories: 6,
  difficultyPresets: 5,
  gamePhases: 5,
  milestones: 20,
  financialScenarios: 5,
};

// Quick start helper
export async function initializeEconomy(): Promise<void> {
  resourceManager.reset();
  difficultyManager.reset();
  progressionManager.reset();
  financialSimulator.reset();
}

// 통합 경제 매니저
export class EconomyManager {
  public resources = resourceManager;
  public revenue = revenueCalculator;
  public costs = costCalculator;
  public difficulty = difficultyManager;
  public progression = progressionManager;
  public balance = balanceEngine;
  public financial = financialSimulator;

  // 초기화
  initialize(difficulty: string = 'normal'): void {
    this.resources.reset();
    this.difficulty.setDifficulty(difficulty as any);
    this.progression.reset();
    this.financial.reset();

    // 난이도 설정 적용
    const startingResources = this.difficulty.getStartingResources();
    this.resources.applyChange({
      resource: 'cash',
      amount: startingResources.cash,
      type: 'absolute',
    });
    this.resources.applyChange({
      resource: 'users',
      amount: startingResources.users,
      type: 'absolute',
    });
  }

  // 월간 업데이트
  processMonth(month: number, year: number): {
    revenue: any;
    costs: any;
    progression: any;
    financial: any;
  } {
    const resources = this.resources.getResources();
    const userDistribution = {
      free: Math.floor(resources.primary.users * 0.85),
      basic: Math.floor(resources.primary.users * 0.10),
      premium: Math.floor(resources.primary.users * 0.04),
      enterprise: Math.floor(resources.primary.users * 0.01),
    };

    // 수익 계산
    const revenueResult = this.revenue.calculateMonthlyRevenue(
      userDistribution,
      [],
      { iapMultiplier: this.difficulty.getRevenueModifier() }
    );

    // 비용 계산
    const costResult = this.costs.calculateMonthlyCosts({
      users: resources.primary.users,
      monthlyRevenue: revenueResult.total,
      apiCalls: resources.primary.users * 100,
      aiRequests: resources.primary.users * 5,
      dataTransferGB: resources.primary.users * 0.1,
      supportTickets: Math.floor(resources.primary.users * 0.01),
      newContent: 2,
      freelanceHours: 10,
    });

    // 난이도 수정자 적용
    const adjustedRevenue = revenueResult.total * this.difficulty.getRevenueModifier();
    const adjustedCosts = costResult.total * this.difficulty.getCostModifier();

    // 자원 업데이트
    this.resources.applyChange({
      resource: 'cash',
      amount: adjustedRevenue - adjustedCosts,
      type: 'relative',
    });

    // 진행도 업데이트
    const progressionResult = this.progression.update({
      users: resources.primary.users,
      monthlyRevenue: adjustedRevenue,
      monthlyCosts: adjustedCosts,
      cash: resources.primary.cash,
      month,
    });

    // 재무 시뮬레이션 업데이트
    this.financial.updateCurrentFinancials({
      cash: resources.primary.cash + (adjustedRevenue - adjustedCosts),
      users: resources.primary.users,
      monthlyRevenue: adjustedRevenue,
      monthlyCosts: adjustedCosts,
      month,
      year,
    });

    // DDA 기록
    this.difficulty.recordPerformance(
      month,
      adjustedRevenue - adjustedCosts,
      0  // 사용자 변화는 별도 계산 필요
    );

    return {
      revenue: { ...revenueResult, adjusted: adjustedRevenue },
      costs: { ...costResult, adjusted: adjustedCosts },
      progression: progressionResult,
      financial: this.financial.getCashFlowStatus(),
    };
  }

  // 상태 조회
  getState(): any {
    return {
      resources: this.resources.getResources(),
      difficulty: this.difficulty.getSystem(),
      progression: this.progression.getSystem(),
      financial: this.financial.getSystem(),
    };
  }

  // 진단
  diagnose(): any {
    const resourceDiagnosis = this.resources.diagnose();
    const financialHealth = this.financial.assessFinancialHealth();
    const progressionStatus = this.progression.compareToIdeal(
      this.progression.getSystem().monthsPlayed,
      this.resources.getResource('users'),
      0  // 수익은 별도 추적 필요
    );

    return {
      resources: resourceDiagnosis,
      financial: financialHealth,
      progression: progressionStatus,
    };
  }
}

// 싱글톤 인스턴스
export const economyManager = new EconomyManager();

export default {
  economyManager,
  resourceManager,
  revenueCalculator,
  costCalculator,
  difficultyManager,
  progressionManager,
  balanceEngine,
  financialSimulator,
  ECONOMY_STATISTICS,
  initializeEconomy,
};
