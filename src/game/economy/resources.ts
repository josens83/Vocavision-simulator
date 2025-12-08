/**
 * Chapter 6: Economy & Balance - Resource System
 * 자원 시스템 및 상호작용
 */

import {
  PrimaryResources,
  SecondaryResources,
  HiddenResources,
  ResourceSystem,
  ResourceChange,
  ResourceLimits,
  ResourceInteraction,
  ResourceInteractionMatrix,
} from './types';

// ============================================
// 초기 자원 값
// ============================================

export const initialPrimaryResources: PrimaryResources = {
  cash: 50000000,      // 5천만원 (시드머니)
  users: 0,            // 초기 사용자 없음
  energy: 100,         // 최대 에너지
  time: 8,             // 하루 8 행동 포인트
  reputation: 50,      // 중립 평판
};

export const initialSecondaryResources: SecondaryResources = {
  techDebt: 0,         // 기술 부채 없음
  serverLoad: 0,       // 서버 부하 없음
  contentQuality: 50,  // 기본 콘텐츠 품질
  marketShare: 0,      // 시장 점유율 없음
  brandValue: 10,      // 기본 브랜드 가치
  teamMorale: 80,      // 높은 초기 사기
};

export const initialHiddenResources: HiddenResources = {
  luck: 50,            // 기본 운
  burnoutRisk: 0,      // 번아웃 위험 없음
  viralPotential: 10,  // 낮은 바이럴 잠재력
  investorInterest: 0, // 투자자 관심 없음
  regulatoryRisk: 5,   // 낮은 규제 리스크
};

export const initialResourceSystem: ResourceSystem = {
  primary: { ...initialPrimaryResources },
  secondary: { ...initialSecondaryResources },
  hidden: { ...initialHiddenResources },
};

// ============================================
// 자원 제한 설정
// ============================================

export const resourceLimits: Record<string, ResourceLimits> = {
  // Primary Resources
  cash: { min: -100000000, max: 100000000000, softCap: 10000000000 },
  users: { min: 0, max: 10000000, softCap: 1000000 },
  energy: { min: 0, max: 100, hardCap: 100 },
  time: { min: 0, max: 16, hardCap: 16 },
  reputation: { min: 0, max: 100, hardCap: 100 },

  // Secondary Resources
  techDebt: { min: 0, max: 100, hardCap: 100 },
  serverLoad: { min: 0, max: 100, hardCap: 100 },
  contentQuality: { min: 0, max: 100, hardCap: 100 },
  marketShare: { min: 0, max: 100, hardCap: 100 },
  brandValue: { min: 0, max: 100, hardCap: 100 },
  teamMorale: { min: 0, max: 100, hardCap: 100 },

  // Hidden Resources
  luck: { min: 0, max: 100, hardCap: 100 },
  burnoutRisk: { min: 0, max: 100, hardCap: 100 },
  viralPotential: { min: 0, max: 100, hardCap: 100 },
  investorInterest: { min: 0, max: 100, hardCap: 100 },
  regulatoryRisk: { min: 0, max: 100, hardCap: 100 },
};

// ============================================
// 자원 상호작용 매트릭스
// ============================================

export const resourceInteractions: ResourceInteractionMatrix = [
  // Energy 영향
  {
    source: 'energy',
    target: 'techDebt',
    effect: 0.3,
    threshold: 20,  // 에너지가 20 이하면
    description: '낮은 에너지는 기술 부채를 증가시킵니다',
  },
  {
    source: 'energy',
    target: 'contentQuality',
    effect: 0.2,
    threshold: 30,
    description: '피로한 상태에서는 콘텐츠 품질이 저하됩니다',
  },

  // Tech Debt 영향
  {
    source: 'techDebt',
    target: 'serverLoad',
    effect: 0.4,
    threshold: 50,
    description: '높은 기술 부채는 서버 부하를 증가시킵니다',
  },
  {
    source: 'techDebt',
    target: 'reputation',
    effect: -0.2,
    threshold: 70,
    delay: 2,
    description: '심각한 기술 부채는 평판을 손상시킵니다',
  },

  // Server Load 영향
  {
    source: 'serverLoad',
    target: 'reputation',
    effect: -0.5,
    threshold: 80,
    description: '높은 서버 부하는 사용자 경험을 저하시킵니다',
  },
  {
    source: 'serverLoad',
    target: 'users',
    effect: -0.1,
    threshold: 90,
    description: '서버 과부하는 사용자 이탈을 유발합니다',
  },

  // Content Quality 영향
  {
    source: 'contentQuality',
    target: 'users',
    effect: 0.3,
    threshold: 70,
    description: '높은 콘텐츠 품질은 사용자를 유치합니다',
  },
  {
    source: 'contentQuality',
    target: 'reputation',
    effect: 0.4,
    threshold: 80,
    description: '우수한 콘텐츠는 평판을 높입니다',
  },

  // Reputation 영향
  {
    source: 'reputation',
    target: 'users',
    effect: 0.5,
    threshold: 70,
    description: '좋은 평판은 사용자 유치에 도움됩니다',
  },
  {
    source: 'reputation',
    target: 'brandValue',
    effect: 0.3,
    threshold: 60,
    description: '평판은 브랜드 가치에 영향을 미칩니다',
  },

  // User 영향
  {
    source: 'users',
    target: 'serverLoad',
    effect: 0.01,
    description: '사용자가 많을수록 서버 부하가 증가합니다',
  },
  {
    source: 'users',
    target: 'marketShare',
    effect: 0.001,
    description: '사용자 수가 시장 점유율에 영향을 미칩니다',
  },

  // Team Morale 영향 (1인 기업이지만 자기 동기부여)
  {
    source: 'teamMorale',
    target: 'contentQuality',
    effect: 0.2,
    threshold: 70,
    description: '높은 사기는 작업 품질을 향상시킵니다',
  },
  {
    source: 'teamMorale',
    target: 'energy',
    effect: -0.1,
    threshold: 30,
    description: '낮은 사기는 에너지 회복을 저해합니다',
  },

  // Hidden: Burnout Risk 영향
  {
    source: 'burnoutRisk',
    target: 'energy',
    effect: -0.5,
    threshold: 60,
    description: '번아웃 위험이 높으면 에너지가 감소합니다',
  },
  {
    source: 'burnoutRisk',
    target: 'teamMorale',
    effect: -0.4,
    threshold: 70,
    description: '번아웃 위험은 사기를 저하시킵니다',
  },

  // Hidden: Viral Potential 영향
  {
    source: 'viralPotential',
    target: 'users',
    effect: 0.2,
    threshold: 60,
    description: '바이럴 잠재력이 높으면 사용자가 증가합니다',
  },

  // Hidden: Investor Interest 영향
  {
    source: 'investorInterest',
    target: 'reputation',
    effect: 0.1,
    threshold: 50,
    description: '투자자 관심은 평판을 높입니다',
  },
];

// ============================================
// 자원 관리 클래스
// ============================================

export class ResourceManager {
  private resources: ResourceSystem;
  private pendingEffects: Array<{
    interaction: ResourceInteraction;
    turnsRemaining: number;
  }> = [];

  constructor(initialResources?: ResourceSystem) {
    this.resources = initialResources
      ? JSON.parse(JSON.stringify(initialResources))
      : JSON.parse(JSON.stringify(initialResourceSystem));
  }

  // 자원 가져오기
  getResources(): ResourceSystem {
    return JSON.parse(JSON.stringify(this.resources));
  }

  getPrimaryResources(): PrimaryResources {
    return { ...this.resources.primary };
  }

  getSecondaryResources(): SecondaryResources {
    return { ...this.resources.secondary };
  }

  getHiddenResources(): HiddenResources {
    return { ...this.resources.hidden };
  }

  // 단일 자원 가져오기
  getResource(name: string): number {
    if (name in this.resources.primary) {
      return this.resources.primary[name as keyof PrimaryResources];
    }
    if (name in this.resources.secondary) {
      return this.resources.secondary[name as keyof SecondaryResources];
    }
    if (name in this.resources.hidden) {
      return this.resources.hidden[name as keyof HiddenResources];
    }
    return 0;
  }

  // 자원 변경
  applyChange(change: ResourceChange): number {
    const { resource, amount, type, reason } = change;
    let currentValue = this.getResource(resource);
    let newValue: number;

    switch (type) {
      case 'absolute':
        newValue = amount;
        break;
      case 'relative':
        newValue = currentValue + amount;
        break;
      case 'multiply':
        newValue = currentValue * amount;
        break;
      default:
        newValue = currentValue;
    }

    // 제한 적용
    newValue = this.applyLimits(resource, newValue);

    // 값 설정
    this.setResource(resource, newValue);

    // 상호작용 체크
    this.checkInteractions(resource, newValue);

    return newValue;
  }

  // 다중 자원 변경
  applyChanges(changes: ResourceChange[]): void {
    for (const change of changes) {
      this.applyChange(change);
    }
  }

  // 자원 설정 (내부용)
  private setResource(name: string, value: number): void {
    if (name in this.resources.primary) {
      this.resources.primary[name as keyof PrimaryResources] = value;
    } else if (name in this.resources.secondary) {
      this.resources.secondary[name as keyof SecondaryResources] = value;
    } else if (name in this.resources.hidden) {
      this.resources.hidden[name as keyof HiddenResources] = value;
    }
  }

  // 제한 적용
  private applyLimits(resource: string, value: number): number {
    const limits = resourceLimits[resource];
    if (!limits) return value;

    // 하드 캡 적용
    if (limits.hardCap !== undefined && value > limits.hardCap) {
      return limits.hardCap;
    }

    // 최소/최대 적용
    return Math.max(limits.min, Math.min(limits.max, value));
  }

  // 상호작용 체크
  private checkInteractions(changedResource: string, newValue: number): void {
    for (const interaction of resourceInteractions) {
      if (interaction.source === changedResource) {
        // 임계값 체크
        const meetsThreshold = interaction.threshold === undefined ||
          (interaction.effect > 0 ? newValue >= interaction.threshold : newValue <= interaction.threshold);

        if (meetsThreshold) {
          if (interaction.delay && interaction.delay > 0) {
            // 지연 효과 추가
            this.pendingEffects.push({
              interaction,
              turnsRemaining: interaction.delay,
            });
          } else {
            // 즉시 효과 적용
            this.applyInteractionEffect(interaction, newValue);
          }
        }
      }
    }
  }

  // 상호작용 효과 적용
  private applyInteractionEffect(interaction: ResourceInteraction, sourceValue: number): void {
    const targetValue = this.getResource(interaction.target);
    const effectMultiplier = interaction.threshold
      ? (sourceValue - interaction.threshold) / 100
      : sourceValue / 100;

    const change = interaction.effect * effectMultiplier;
    const newTargetValue = this.applyLimits(
      interaction.target,
      targetValue + change
    );

    this.setResource(interaction.target, newTargetValue);
  }

  // 턴 진행 (지연 효과 처리)
  processTurn(): void {
    const completedEffects: number[] = [];

    this.pendingEffects.forEach((pending, index) => {
      pending.turnsRemaining--;

      if (pending.turnsRemaining <= 0) {
        const sourceValue = this.getResource(pending.interaction.source);
        this.applyInteractionEffect(pending.interaction, sourceValue);
        completedEffects.push(index);
      }
    });

    // 완료된 효과 제거 (역순으로)
    for (let i = completedEffects.length - 1; i >= 0; i--) {
      this.pendingEffects.splice(completedEffects[i], 1);
    }
  }

  // 일일 자원 회복
  processDailyRecovery(settings: {
    energyRecovery: number;
    timeReset: number;
    moraleDecay: number;
  }): void {
    const { energyRecovery, timeReset, moraleDecay } = settings;

    // 에너지 회복
    this.applyChange({
      resource: 'energy',
      amount: energyRecovery,
      type: 'relative',
      reason: 'daily_recovery',
    });

    // 시간 리셋
    this.applyChange({
      resource: 'time',
      amount: timeReset,
      type: 'absolute',
      reason: 'daily_reset',
    });

    // 사기 자연 감소
    this.applyChange({
      resource: 'teamMorale',
      amount: -moraleDecay,
      type: 'relative',
      reason: 'daily_decay',
    });

    // 번아웃 위험 자연 감소
    this.applyChange({
      resource: 'burnoutRisk',
      amount: -2,
      type: 'relative',
      reason: 'daily_recovery',
    });
  }

  // 월간 자원 처리
  processMonthlyUpdate(userGrowth: number, revenueChange: number): void {
    // 기술 부채 자연 증가
    this.applyChange({
      resource: 'techDebt',
      amount: 2,
      type: 'relative',
      reason: 'monthly_accumulation',
    });

    // 서버 부하 조정 (사용자 수 기반)
    const users = this.getResource('users');
    const loadPerUser = 0.001;  // 사용자 1000명당 1% 부하
    this.applyChange({
      resource: 'serverLoad',
      amount: users * loadPerUser,
      type: 'absolute',
      reason: 'user_load',
    });

    // 투자자 관심도 업데이트
    if (userGrowth > 0.1 || revenueChange > 0.2) {
      this.applyChange({
        resource: 'investorInterest',
        amount: 5,
        type: 'relative',
        reason: 'growth_signal',
      });
    }
  }

  // 자원 상태 진단
  diagnose(): {
    warnings: string[];
    critical: string[];
    opportunities: string[];
  } {
    const warnings: string[] = [];
    const critical: string[] = [];
    const opportunities: string[] = [];

    const { primary, secondary, hidden } = this.resources;

    // 크리티컬 체크
    if (primary.cash < 1000000) {
      critical.push('현금이 100만원 미만입니다. 파산 위기!');
    }
    if (primary.energy < 10) {
      critical.push('에너지가 극도로 낮습니다. 휴식이 필요합니다.');
    }
    if (secondary.serverLoad > 90) {
      critical.push('서버 과부하 상태입니다. 즉시 조치가 필요합니다.');
    }
    if (hidden.burnoutRisk > 80) {
      critical.push('번아웃 위험이 매우 높습니다!');
    }

    // 경고 체크
    if (primary.cash < 5000000) {
      warnings.push('현금이 500만원 미만입니다. 비용 관리가 필요합니다.');
    }
    if (primary.energy < 30) {
      warnings.push('에너지가 낮습니다. 휴식을 고려하세요.');
    }
    if (primary.reputation < 30) {
      warnings.push('평판이 낮습니다. 개선이 필요합니다.');
    }
    if (secondary.techDebt > 60) {
      warnings.push('기술 부채가 높습니다. 리팩토링이 필요합니다.');
    }
    if (secondary.serverLoad > 70) {
      warnings.push('서버 부하가 높습니다. 인프라 확장을 고려하세요.');
    }
    if (secondary.contentQuality < 40) {
      warnings.push('콘텐츠 품질이 낮습니다. 품질 개선이 필요합니다.');
    }
    if (secondary.teamMorale < 40) {
      warnings.push('사기가 낮습니다. 동기부여가 필요합니다.');
    }

    // 기회 체크
    if (primary.reputation > 70 && secondary.contentQuality > 70) {
      opportunities.push('평판과 콘텐츠 품질이 높습니다. 마케팅 효과가 높을 것입니다.');
    }
    if (hidden.viralPotential > 60) {
      opportunities.push('바이럴 잠재력이 높습니다. SNS 마케팅을 고려하세요.');
    }
    if (hidden.investorInterest > 50) {
      opportunities.push('투자자들이 관심을 보이고 있습니다.');
    }
    if (secondary.marketShare > 5 && primary.users > 10000) {
      opportunities.push('시장에서 위치를 확보했습니다. 확장을 고려하세요.');
    }

    return { warnings, critical, opportunities };
  }

  // 자원 리셋
  reset(): void {
    this.resources = JSON.parse(JSON.stringify(initialResourceSystem));
    this.pendingEffects = [];
  }

  // 자원 복사
  clone(): ResourceManager {
    const clone = new ResourceManager();
    clone.resources = JSON.parse(JSON.stringify(this.resources));
    clone.pendingEffects = [...this.pendingEffects];
    return clone;
  }

  // 스냅샷 저장
  snapshot(): ResourceSystem {
    return JSON.parse(JSON.stringify(this.resources));
  }

  // 스냅샷 복원
  restore(snapshot: ResourceSystem): void {
    this.resources = JSON.parse(JSON.stringify(snapshot));
  }
}

// ============================================
// 자원 유틸리티 함수
// ============================================

export function calculateResourceScore(resources: ResourceSystem): number {
  const { primary, secondary } = resources;

  // 가중치 적용 점수 계산
  const scores = {
    cash: Math.min(primary.cash / 100000000, 1) * 20,          // 최대 20점 (1억원 기준)
    users: Math.min(primary.users / 100000, 1) * 20,           // 최대 20점 (10만 사용자 기준)
    energy: (primary.energy / 100) * 10,                        // 최대 10점
    reputation: (primary.reputation / 100) * 15,                // 최대 15점
    contentQuality: (secondary.contentQuality / 100) * 15,      // 최대 15점
    techDebt: ((100 - secondary.techDebt) / 100) * 10,         // 최대 10점 (낮을수록 좋음)
    serverHealth: ((100 - secondary.serverLoad) / 100) * 10,   // 최대 10점 (낮을수록 좋음)
  };

  return Object.values(scores).reduce((sum, score) => sum + score, 0);
}

export function getResourceCategory(resource: string): 'primary' | 'secondary' | 'hidden' | null {
  if (resource in initialPrimaryResources) return 'primary';
  if (resource in initialSecondaryResources) return 'secondary';
  if (resource in initialHiddenResources) return 'hidden';
  return null;
}

export function formatResourceValue(resource: string, value: number): string {
  switch (resource) {
    case 'cash':
      if (value >= 100000000) {
        return `${(value / 100000000).toFixed(1)}억원`;
      } else if (value >= 10000) {
        return `${(value / 10000).toFixed(0)}만원`;
      }
      return `${value.toLocaleString()}원`;

    case 'users':
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();

    case 'energy':
    case 'time':
    case 'reputation':
    case 'techDebt':
    case 'serverLoad':
    case 'contentQuality':
    case 'marketShare':
    case 'brandValue':
    case 'teamMorale':
      return `${Math.round(value)}%`;

    default:
      return value.toFixed(1);
  }
}

export function getResourceIcon(resource: string): string {
  const icons: Record<string, string> = {
    cash: '💰',
    users: '👥',
    energy: '⚡',
    time: '⏰',
    reputation: '⭐',
    techDebt: '🔧',
    serverLoad: '🖥️',
    contentQuality: '📚',
    marketShare: '📊',
    brandValue: '🏷️',
    teamMorale: '💪',
    luck: '🍀',
    burnoutRisk: '🔥',
    viralPotential: '🚀',
    investorInterest: '💼',
    regulatoryRisk: '⚖️',
  };
  return icons[resource] || '📌';
}

export function getResourceColor(resource: string, value: number): string {
  // 리소스별 색상 반환 (값에 따라)
  const limits = resourceLimits[resource];
  if (!limits) return '#888888';

  const isInverted = ['techDebt', 'serverLoad', 'burnoutRisk', 'regulatoryRisk'].includes(resource);
  const normalizedValue = isInverted ? (100 - value) : value;

  if (normalizedValue < 25) return '#ef4444';  // red
  if (normalizedValue < 50) return '#f97316';  // orange
  if (normalizedValue < 75) return '#eab308';  // yellow
  return '#22c55e';  // green
}

// 싱글톤 인스턴스
export const resourceManager = new ResourceManager();

export default ResourceManager;
