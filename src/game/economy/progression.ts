/**
 * Chapter 6: Economy & Balance - Progression System
 * 진행도 곡선 및 마일스톤 시스템
 */

import {
  GamePhase,
  PhaseDefinition,
  Milestone,
  GrowthCurvePoint,
  ProgressionCurve,
  ProgressionSystem,
} from './types';

// ============================================
// 게임 단계 정의
// ============================================

export const phaseDefinitions: PhaseDefinition[] = [
  // Early Stage (초기)
  {
    phase: 'early',
    name: '초기 단계',
    description: '아이디어를 현실로 만드는 시작점. MVP 개발과 첫 사용자 확보가 목표입니다.',
    userThreshold: { min: 0, max: 500 },
    revenueThreshold: { min: 0, max: 1000000 },      // 월 100만원 미만
    monthThreshold: { min: 0, max: 6 },
    challenges: [
      'MVP 완성 압박',
      '제한된 자원',
      '시장 검증 불확실성',
      '혼자 모든 것을 해야 함',
    ],
    opportunities: [
      '빠른 피벗 가능',
      '낮은 고정비용',
      '자유로운 의사결정',
      '창업 지원금 활용',
    ],
    unlockedFeatures: [
      '기본 개발',
      '기본 마케팅',
      '무료 플랜',
      '이메일 지원',
    ],
  },

  // Growth Stage (성장)
  {
    phase: 'growth',
    name: '성장 단계',
    description: 'PMF를 찾고 성장 엔진에 불을 붙이는 단계입니다.',
    userThreshold: { min: 500, max: 5000 },
    revenueThreshold: { min: 1000000, max: 10000000 },  // 월 100만~1000만원
    monthThreshold: { min: 3, max: 18 },
    challenges: [
      '기술 부채 관리',
      '고객 지원 부담 증가',
      '서버 확장 필요',
      '경쟁자 출현',
    ],
    opportunities: [
      '입소문 마케팅',
      '유료 전환 시작',
      '초기 B2B 기회',
      '언론 노출 가능성',
    ],
    unlockedFeatures: [
      '베이직 플랜',
      'AI 기능',
      '분석 대시보드',
      '자동화 도구',
    ],
  },

  // Scaling Stage (확장)
  {
    phase: 'scaling',
    name: '확장 단계',
    description: '검증된 비즈니스 모델을 확장하는 단계입니다.',
    userThreshold: { min: 5000, max: 50000 },
    revenueThreshold: { min: 10000000, max: 100000000 }, // 월 1000만~1억원
    monthThreshold: { min: 12, max: 36 },
    challenges: [
      '팀 확장 필요성',
      '인프라 비용 급증',
      '품질 유지 어려움',
      '번아웃 위험',
    ],
    opportunities: [
      'B2B 계약 확대',
      '시리즈 A 투자',
      '해외 진출 가능',
      '파트너십 기회',
    ],
    unlockedFeatures: [
      '프리미엄 플랜',
      'B2B 라이선스',
      'API 제공',
      '화이트라벨',
    ],
  },

  // Mature Stage (성숙)
  {
    phase: 'mature',
    name: '성숙 단계',
    description: '안정적인 수익과 시장 지위를 확보한 단계입니다.',
    userThreshold: { min: 50000, max: 500000 },
    revenueThreshold: { min: 100000000, max: 1000000000 }, // 월 1억~10억원
    monthThreshold: { min: 24, max: 60 },
    challenges: [
      '성장 둔화',
      '시장 포화',
      '혁신 유지 어려움',
      '대기업 진입',
    ],
    opportunities: [
      '인수합병 제안',
      '신규 사업 확장',
      '글로벌 진출',
      '플랫폼화',
    ],
    unlockedFeatures: [
      '엔터프라이즈 플랜',
      '글로벌 서비스',
      'M&A 옵션',
      '자회사 설립',
    ],
  },

  // Exit Stage (엑싯)
  {
    phase: 'exit',
    name: '엑싯 단계',
    description: '성공적인 엑싯을 준비하거나 새로운 도전을 시작합니다.',
    userThreshold: { min: 500000, max: Infinity },
    revenueThreshold: { min: 1000000000, max: Infinity }, // 월 10억원 이상
    monthThreshold: { min: 36, max: Infinity },
    challenges: [
      '엑싯 협상',
      '기업가치 극대화',
      '이해관계자 조율',
      '레거시 관리',
    ],
    opportunities: [
      'IPO',
      '대기업 인수',
      '2차 창업',
      '엔젤 투자자 전환',
    ],
    unlockedFeatures: [
      'IPO 옵션',
      'M&A 협상',
      '투자 모드',
      '명예의 전당',
    ],
  },
];

// ============================================
// 마일스톤 정의
// ============================================

export const milestones: Milestone[] = [
  // 사용자 마일스톤
  {
    id: 'first_user',
    name: '첫 번째 사용자',
    description: '첫 사용자가 가입했습니다!',
    category: 'users',
    requirement: { type: 'users', value: 1, comparison: '>=' },
    reward: { type: 'achievement', value: 'first_user' },
    achieved: false,
  },
  {
    id: 'users_100',
    name: '100명 돌파',
    description: '사용자 100명을 달성했습니다.',
    category: 'users',
    requirement: { type: 'users', value: 100, comparison: '>=' },
    reward: { type: 'reputation', value: 5 },
    achieved: false,
  },
  {
    id: 'users_1000',
    name: '1,000명 커뮤니티',
    description: '사용자 1,000명! 커뮤니티가 형성되기 시작합니다.',
    category: 'users',
    requirement: { type: 'users', value: 1000, comparison: '>=' },
    reward: { type: 'cash', value: 1000000 },
    achieved: false,
  },
  {
    id: 'users_10000',
    name: '만 명 사용자',
    description: '사용자 10,000명 달성! 본격적인 스타트업이 되었습니다.',
    category: 'users',
    requirement: { type: 'users', value: 10000, comparison: '>=' },
    reward: { type: 'unlock', value: 'b2b_license' },
    achieved: false,
  },
  {
    id: 'users_100000',
    name: '십만 사용자',
    description: '사용자 100,000명! 유니콘을 향해 달려갑니다.',
    category: 'users',
    requirement: { type: 'users', value: 100000, comparison: '>=' },
    reward: { type: 'achievement', value: 'unicorn_path' },
    achieved: false,
  },

  // 수익 마일스톤
  {
    id: 'first_revenue',
    name: '첫 수익',
    description: '첫 유료 사용자가 생겼습니다!',
    category: 'revenue',
    requirement: { type: 'monthlyRevenue', value: 1, comparison: '>' },
    reward: { type: 'achievement', value: 'first_dollar' },
    achieved: false,
  },
  {
    id: 'revenue_1m',
    name: '월 100만원',
    description: '월 매출 100만원 달성!',
    category: 'revenue',
    requirement: { type: 'monthlyRevenue', value: 1000000, comparison: '>=' },
    reward: { type: 'reputation', value: 5 },
    achieved: false,
  },
  {
    id: 'revenue_10m',
    name: '월 1,000만원',
    description: '월 매출 1,000만원! 생존 가능한 비즈니스입니다.',
    category: 'revenue',
    requirement: { type: 'monthlyRevenue', value: 10000000, comparison: '>=' },
    reward: { type: 'cash', value: 5000000 },
    achieved: false,
  },
  {
    id: 'revenue_100m',
    name: '월 1억원',
    description: '월 매출 1억원 돌파! 시리즈 A 준비가 됐습니다.',
    category: 'revenue',
    requirement: { type: 'monthlyRevenue', value: 100000000, comparison: '>=' },
    reward: { type: 'unlock', value: 'series_a' },
    achieved: false,
  },
  {
    id: 'revenue_1b',
    name: '월 10억원',
    description: '월 매출 10억원! 유니콘의 문턱에 섰습니다.',
    category: 'revenue',
    requirement: { type: 'monthlyRevenue', value: 1000000000, comparison: '>=' },
    reward: { type: 'achievement', value: 'unicorn' },
    achieved: false,
  },

  // 제품 마일스톤
  {
    id: 'mvp_complete',
    name: 'MVP 완성',
    description: '첫 번째 버전을 출시했습니다!',
    category: 'product',
    requirement: { type: 'productVersion', value: 1, comparison: '>=' },
    reward: { type: 'reputation', value: 10 },
    achieved: false,
  },
  {
    id: 'feature_ai',
    name: 'AI 기능 도입',
    description: 'AI 기반 학습 기능을 추가했습니다.',
    category: 'product',
    requirement: { type: 'aiFeatureEnabled', value: 1, comparison: '==' },
    reward: { type: 'users', value: 500 },
    achieved: false,
  },
  {
    id: 'content_100',
    name: '콘텐츠 100개',
    description: '학습 콘텐츠 100개를 제작했습니다.',
    category: 'product',
    requirement: { type: 'contentCount', value: 100, comparison: '>=' },
    reward: { type: 'reputation', value: 5 },
    achieved: false,
  },

  // 개인 마일스톤
  {
    id: 'survive_month',
    name: '첫 달 생존',
    description: '첫 달을 버텨냈습니다!',
    category: 'personal',
    requirement: { type: 'monthsPlayed', value: 1, comparison: '>=' },
    reward: { type: 'achievement', value: 'survivor' },
    achieved: false,
  },
  {
    id: 'survive_year',
    name: '1년 생존',
    description: '1년을 버텨냈습니다! 대부분의 스타트업보다 오래 살아남았습니다.',
    category: 'personal',
    requirement: { type: 'monthsPlayed', value: 12, comparison: '>=' },
    reward: { type: 'cash', value: 10000000 },
    achieved: false,
  },
  {
    id: 'no_burnout',
    name: '건강한 창업',
    description: '6개월 동안 번아웃 없이 운영했습니다.',
    category: 'personal',
    requirement: { type: 'healthyMonths', value: 6, comparison: '>=' },
    reward: { type: 'reputation', value: 10 },
    achieved: false,
  },

  // 비즈니스 마일스톤
  {
    id: 'first_b2b',
    name: '첫 B2B 계약',
    description: '첫 기업 고객을 확보했습니다!',
    category: 'business',
    requirement: { type: 'b2bContracts', value: 1, comparison: '>=' },
    reward: { type: 'cash', value: 5000000 },
    achieved: false,
  },
  {
    id: 'profitable',
    name: '손익분기점',
    description: '드디어 흑자 전환! 지속 가능한 비즈니스입니다.',
    category: 'business',
    requirement: { type: 'isProfitable', value: 1, comparison: '==' },
    reward: { type: 'achievement', value: 'profitable' },
    achieved: false,
  },
  {
    id: 'investment',
    name: '첫 투자 유치',
    description: '투자를 받았습니다! 성장의 연료를 확보했습니다.',
    category: 'business',
    requirement: { type: 'investmentReceived', value: 1, comparison: '>=' },
    reward: { type: 'achievement', value: 'funded' },
    achieved: false,
  },
];

// ============================================
// 이상적인 성장 곡선
// ============================================

export const idealGrowthCurve: GrowthCurvePoint[] = [
  { month: 0, expectedUsers: 0, expectedRevenue: 0, expectedCosts: 500000, variance: 0.5 },
  { month: 1, expectedUsers: 50, expectedRevenue: 0, expectedCosts: 550000, variance: 0.5 },
  { month: 2, expectedUsers: 150, expectedRevenue: 100000, expectedCosts: 580000, variance: 0.5 },
  { month: 3, expectedUsers: 350, expectedRevenue: 300000, expectedCosts: 600000, variance: 0.4 },
  { month: 4, expectedUsers: 600, expectedRevenue: 600000, expectedCosts: 650000, variance: 0.4 },
  { month: 5, expectedUsers: 1000, expectedRevenue: 1000000, expectedCosts: 700000, variance: 0.4 },
  { month: 6, expectedUsers: 1500, expectedRevenue: 1500000, expectedCosts: 800000, variance: 0.3 },
  { month: 9, expectedUsers: 3000, expectedRevenue: 3500000, expectedCosts: 1200000, variance: 0.3 },
  { month: 12, expectedUsers: 6000, expectedRevenue: 7000000, expectedCosts: 2000000, variance: 0.3 },
  { month: 18, expectedUsers: 15000, expectedRevenue: 20000000, expectedCosts: 5000000, variance: 0.25 },
  { month: 24, expectedUsers: 35000, expectedRevenue: 50000000, expectedCosts: 15000000, variance: 0.25 },
  { month: 36, expectedUsers: 80000, expectedRevenue: 150000000, expectedCosts: 50000000, variance: 0.2 },
  { month: 48, expectedUsers: 150000, expectedRevenue: 350000000, expectedCosts: 120000000, variance: 0.2 },
];

// ============================================
// 진행도 관리 클래스
// ============================================

export class ProgressionManager {
  private currentPhase: GamePhase = 'early';
  private milestones: Milestone[];
  private actualPath: GrowthCurvePoint[] = [];
  private monthsPlayed: number = 0;
  private totalDaysPlayed: number = 0;

  constructor() {
    this.milestones = JSON.parse(JSON.stringify(milestones));
  }

  // 상태 업데이트
  update(state: {
    users: number;
    monthlyRevenue: number;
    monthlyCosts: number;
    cash: number;
    month: number;
  }): {
    phaseChanged: boolean;
    newPhase?: GamePhase;
    achievedMilestones: Milestone[];
  } {
    const result = {
      phaseChanged: false,
      newPhase: undefined as GamePhase | undefined,
      achievedMilestones: [] as Milestone[],
    };

    // 실제 경로 기록
    this.actualPath.push({
      month: state.month,
      expectedUsers: state.users,
      expectedRevenue: state.monthlyRevenue,
      expectedCosts: state.monthlyCosts,
      variance: 0,
    });

    this.monthsPlayed = state.month;

    // 단계 업데이트
    const newPhase = this.determinePhase(state.users, state.monthlyRevenue, state.month);
    if (newPhase !== this.currentPhase) {
      result.phaseChanged = true;
      result.newPhase = newPhase;
      this.currentPhase = newPhase;
    }

    // 마일스톤 체크
    result.achievedMilestones = this.checkMilestones(state);

    return result;
  }

  // 단계 결정
  private determinePhase(users: number, revenue: number, month: number): GamePhase {
    // 역순으로 체크 (가장 높은 단계부터)
    for (let i = phaseDefinitions.length - 1; i >= 0; i--) {
      const phase = phaseDefinitions[i];
      const meetsUsers = users >= phase.userThreshold.min;
      const meetsRevenue = revenue >= phase.revenueThreshold.min;
      const meetsMonth = month >= phase.monthThreshold.min;

      // 최소 2개 조건 충족 시 해당 단계
      const conditionsMet = [meetsUsers, meetsRevenue, meetsMonth].filter(Boolean).length;
      if (conditionsMet >= 2) {
        return phase.phase;
      }
    }

    return 'early';
  }

  // 마일스톤 체크
  private checkMilestones(state: any): Milestone[] {
    const achieved: Milestone[] = [];

    for (const milestone of this.milestones) {
      if (milestone.achieved) continue;

      const value = this.getMilestoneValue(milestone.requirement.type, state);
      const meetsRequirement = this.compareValue(
        value,
        milestone.requirement.comparison,
        milestone.requirement.value
      );

      if (meetsRequirement) {
        milestone.achieved = true;
        milestone.achievedAt = new Date();
        achieved.push(milestone);
      }
    }

    return achieved;
  }

  // 마일스톤 값 조회
  private getMilestoneValue(type: string, state: any): number {
    const mappings: Record<string, () => number> = {
      users: () => state.users,
      monthlyRevenue: () => state.monthlyRevenue,
      monthsPlayed: () => this.monthsPlayed,
      cash: () => state.cash,
      productVersion: () => state.productVersion || 0,
      contentCount: () => state.contentCount || 0,
      b2bContracts: () => state.b2bContracts || 0,
      isProfitable: () => state.monthlyRevenue > state.monthlyCosts ? 1 : 0,
      aiFeatureEnabled: () => state.aiFeatureEnabled ? 1 : 0,
      investmentReceived: () => state.investmentReceived ? 1 : 0,
      healthyMonths: () => state.healthyMonths || 0,
    };

    const getter = mappings[type];
    return getter ? getter() : 0;
  }

  // 값 비교
  private compareValue(actual: number, comparison: string, target: number): boolean {
    switch (comparison) {
      case '>': return actual > target;
      case '>=': return actual >= target;
      case '==': return actual === target;
      case '<': return actual < target;
      case '<=': return actual <= target;
      default: return false;
    }
  }

  // 현재 단계 조회
  getCurrentPhase(): PhaseDefinition {
    return phaseDefinitions.find(p => p.phase === this.currentPhase)!;
  }

  // 다음 단계 조회
  getNextPhase(): PhaseDefinition | null {
    const currentIndex = phaseDefinitions.findIndex(p => p.phase === this.currentPhase);
    if (currentIndex < phaseDefinitions.length - 1) {
      return phaseDefinitions[currentIndex + 1];
    }
    return null;
  }

  // 다음 단계까지 진행률
  getProgressToNextPhase(users: number, revenue: number): number {
    const next = this.getNextPhase();
    if (!next) return 1;

    const current = this.getCurrentPhase();

    const userProgress = Math.min(1,
      (users - current.userThreshold.min) /
      (next.userThreshold.min - current.userThreshold.min)
    );

    const revenueProgress = Math.min(1,
      (revenue - current.revenueThreshold.min) /
      (next.revenueThreshold.min - current.revenueThreshold.min)
    );

    return Math.max(userProgress, revenueProgress);
  }

  // 미달성 마일스톤 조회
  getPendingMilestones(): Milestone[] {
    return this.milestones.filter(m => !m.achieved);
  }

  // 달성 마일스톤 조회
  getAchievedMilestones(): Milestone[] {
    return this.milestones.filter(m => m.achieved);
  }

  // 카테고리별 마일스톤 조회
  getMilestonesByCategory(category: Milestone['category']): Milestone[] {
    return this.milestones.filter(m => m.category === category);
  }

  // 다음 마일스톤 조회
  getNextMilestone(category?: Milestone['category']): Milestone | null {
    const pending = category
      ? this.getPendingMilestones().filter(m => m.category === category)
      : this.getPendingMilestones();

    return pending[0] || null;
  }

  // 이상적 곡선 대비 성과 비교
  compareToIdeal(month: number, users: number, revenue: number): {
    userPerformance: number;    // 1.0 = 이상적, <1 = 뒤처짐, >1 = 앞서감
    revenuePerformance: number;
    overallPerformance: number;
    status: 'ahead' | 'on_track' | 'behind' | 'critical';
  } {
    // 해당 월의 이상적 값 보간
    const idealPoint = this.interpolateIdealPoint(month);

    const userPerformance = idealPoint.expectedUsers > 0
      ? users / idealPoint.expectedUsers
      : users > 0 ? 2 : 1;

    const revenuePerformance = idealPoint.expectedRevenue > 0
      ? revenue / idealPoint.expectedRevenue
      : revenue > 0 ? 2 : 1;

    const overallPerformance = (userPerformance + revenuePerformance) / 2;

    let status: 'ahead' | 'on_track' | 'behind' | 'critical';
    if (overallPerformance >= 1.2) {
      status = 'ahead';
    } else if (overallPerformance >= 0.8) {
      status = 'on_track';
    } else if (overallPerformance >= 0.5) {
      status = 'behind';
    } else {
      status = 'critical';
    }

    return {
      userPerformance,
      revenuePerformance,
      overallPerformance,
      status,
    };
  }

  // 이상적 곡선 보간
  private interpolateIdealPoint(month: number): GrowthCurvePoint {
    // 정확히 일치하는 월 찾기
    const exact = idealGrowthCurve.find(p => p.month === month);
    if (exact) return exact;

    // 보간 필요
    let before = idealGrowthCurve[0];
    let after = idealGrowthCurve[idealGrowthCurve.length - 1];

    for (let i = 0; i < idealGrowthCurve.length - 1; i++) {
      if (idealGrowthCurve[i].month <= month && idealGrowthCurve[i + 1].month > month) {
        before = idealGrowthCurve[i];
        after = idealGrowthCurve[i + 1];
        break;
      }
    }

    // 선형 보간
    const ratio = (month - before.month) / (after.month - before.month);
    return {
      month,
      expectedUsers: Math.round(before.expectedUsers + (after.expectedUsers - before.expectedUsers) * ratio),
      expectedRevenue: Math.round(before.expectedRevenue + (after.expectedRevenue - before.expectedRevenue) * ratio),
      expectedCosts: Math.round(before.expectedCosts + (after.expectedCosts - before.expectedCosts) * ratio),
      variance: before.variance + (after.variance - before.variance) * ratio,
    };
  }

  // 성장 속도 계산
  calculateGrowthRate(): {
    userGrowth: number;
    revenueGrowth: number;
  } {
    if (this.actualPath.length < 2) {
      return { userGrowth: 0, revenueGrowth: 0 };
    }

    const current = this.actualPath[this.actualPath.length - 1];
    const previous = this.actualPath[this.actualPath.length - 2];

    const userGrowth = previous.expectedUsers > 0
      ? (current.expectedUsers - previous.expectedUsers) / previous.expectedUsers
      : current.expectedUsers > 0 ? 1 : 0;

    const revenueGrowth = previous.expectedRevenue > 0
      ? (current.expectedRevenue - previous.expectedRevenue) / previous.expectedRevenue
      : current.expectedRevenue > 0 ? 1 : 0;

    return { userGrowth, revenueGrowth };
  }

  // 전체 시스템 상태 조회
  getSystem(): ProgressionSystem {
    return {
      currentPhase: this.currentPhase,
      phases: phaseDefinitions,
      milestones: this.milestones,
      curve: {
        type: 'exponential',
        points: idealGrowthCurve,
        idealPath: idealGrowthCurve,
        actualPath: this.actualPath,
      },
      monthsPlayed: this.monthsPlayed,
      totalDaysPlayed: this.totalDaysPlayed,
    };
  }

  // 일 진행
  advanceDay(): void {
    this.totalDaysPlayed++;
  }

  // 리셋
  reset(): void {
    this.currentPhase = 'early';
    this.milestones = JSON.parse(JSON.stringify(milestones));
    this.actualPath = [];
    this.monthsPlayed = 0;
    this.totalDaysPlayed = 0;
  }
}

// ============================================
// 유틸리티 함수
// ============================================

export function getPhaseColor(phase: GamePhase): string {
  const colors: Record<GamePhase, string> = {
    early: '#22c55e',     // green
    growth: '#3b82f6',    // blue
    scaling: '#8b5cf6',   // purple
    mature: '#f59e0b',    // amber
    exit: '#ef4444',      // red
  };
  return colors[phase];
}

export function getPhaseIcon(phase: GamePhase): string {
  const icons: Record<GamePhase, string> = {
    early: '🌱',
    growth: '🚀',
    scaling: '📈',
    mature: '🏢',
    exit: '🏆',
  };
  return icons[phase];
}

export function getMilestoneIcon(category: Milestone['category']): string {
  const icons: Record<Milestone['category'], string> = {
    users: '👥',
    revenue: '💰',
    product: '📦',
    personal: '🎯',
    business: '🤝',
  };
  return icons[category];
}

export function formatMilestoneReward(reward: Milestone['reward']): string {
  switch (reward.type) {
    case 'cash':
      return `+${(reward.value as number).toLocaleString()}원`;
    case 'users':
      return `+${reward.value} 사용자`;
    case 'reputation':
      return `+${reward.value} 평판`;
    case 'unlock':
      return `🔓 ${reward.value} 해금`;
    case 'achievement':
      return `🏅 ${reward.value} 획득`;
    default:
      return String(reward.value);
  }
}

// 싱글톤 인스턴스
export const progressionManager = new ProgressionManager();

export default ProgressionManager;
