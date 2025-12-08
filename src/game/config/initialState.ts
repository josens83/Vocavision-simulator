import type { PlayerStats, BusinessMetrics, TimeState, CostStructure } from '../types';

export const INITIAL_PLAYER_STATS: PlayerStats = {
  health: {
    physical: 80,
    mental: 75,
    energy: 100,
    stress: 20,
    burnoutRisk: 5,
  },
  skills: {
    coding: 60,
    design: 40,
    marketing: 30,
    business: 35,
    communication: 45,
    leadership: 25,
  },
  social: {
    reputation: 70,
    network: [],
    credibility: 50,
  },
  personal: {
    motivation: 85,
    confidence: 70,
    workLifeBalance: 60,
    savings: 3000000, // 개인 비상금 300만원
  },
};

export const INITIAL_BUSINESS_METRICS: BusinessMetrics = {
  finance: {
    cash: 5000000, // 시작 자금 500만원
    monthlyRevenue: 0,
    monthlyExpenses: 95000,
    runway: 52, // 약 52개월
    debt: 0,
    investments: [],
  },
  users: {
    total: 50,
    dau: 25,
    mau: 40,
    premium: 3,
    churnRate: 5,
    nps: 40,
    ltv: 30000,
    cac: 5000,
  },
  product: {
    version: '0.1.0',
    stability: 75,
    features: [
      {
        id: 'words101',
        name: '기본 단어 100개',
        description: '필수 영단어 100개 제공',
        progress: 100,
        impact: { users: 50, revenue: 0, satisfaction: 60 },
      },
      {
        id: 'flashcards',
        name: '플래시카드',
        description: '기본 플래시카드 학습 기능',
        progress: 100,
        impact: { users: 30, revenue: 0, satisfaction: 70 },
      },
    ],
    bugs: [],
    technicalDebt: 20,
    codeQuality: 70,
  },
  infrastructure: {
    serverHealth: 100,
    uptime: 99.5,
    responseTime: 200,
    securityScore: 80,
    scalability: 50,
  },
};

export const INITIAL_TIME_STATE: TimeState = {
  currentDate: new Date(),
  dayPhase: 'morning',
  totalDays: 1,
  tick: 0,
  isPaused: true,
  speed: 1,
};

export const DEFAULT_COST_STRUCTURE: CostStructure = {
  fixed: {
    server: { base: 50000, perUser: 10 },
    domain: 15000,
    email: 5000,
    tools: 20000,
  },
  variable: {
    openai: { perRequest: 50, monthlyBase: 30000 },
    stripe: { percentage: 3.4, fixed: 400 },
    marketing: 0,
  },
  occasional: {
    legal: 500000,
    accounting: 200000,
    design: 1000000,
    development: 3000000,
  },
};

// 난이도별 설정
export const DIFFICULTY_SETTINGS = {
  easy: {
    startingCash: 10000000, // 1천만원
    eventFrequency: 0.08,
    stressMultiplier: 0.7,
    revenueMultiplier: 1.3,
    costMultiplier: 0.8,
    userGrowthBonus: 1.5,
  },
  normal: {
    startingCash: 5000000, // 500만원
    eventFrequency: 0.12,
    stressMultiplier: 1.0,
    revenueMultiplier: 1.0,
    costMultiplier: 1.0,
    userGrowthBonus: 1.0,
  },
  hard: {
    startingCash: 2000000, // 200만원
    eventFrequency: 0.15,
    stressMultiplier: 1.3,
    revenueMultiplier: 0.8,
    costMultiplier: 1.2,
    userGrowthBonus: 0.7,
  },
  realistic: {
    startingCash: 1000000, // 100만원
    eventFrequency: 0.18,
    stressMultiplier: 1.5,
    revenueMultiplier: 0.7,
    costMultiplier: 1.4,
    userGrowthBonus: 0.5,
  },
};

// 게임 오버 조건
export const GAME_OVER_CONDITIONS = [
  {
    type: 'metric' as const,
    target: 'cash',
    operator: '<' as const,
    value: -1000000,
    reason: '💸 파산: 자금이 -100만원 이하로 떨어졌습니다.',
  },
  {
    type: 'metric' as const,
    target: 'serverHealth',
    operator: '<=' as const,
    value: 0,
    reason: '💥 서버 다운: 서버가 완전히 다운되어 복구 불가능 상태가 되었습니다.',
  },
  {
    type: 'stat' as const,
    target: 'reputation',
    operator: '<=' as const,
    value: 0,
    reason: '😢 평판 붕괴: 평판이 바닥으로 떨어졌습니다.',
  },
  {
    type: 'stat' as const,
    target: 'burnoutRisk',
    operator: '>=' as const,
    value: 100,
    reason: '😴 번아웃: 극심한 스트레스로 건강이 악화되었습니다.',
  },
];

// 승리 조건
export const VICTORY_CONDITIONS = [
  {
    type: 'metric' as const,
    target: 'cash',
    operator: '>=' as const,
    value: 500000000,
    victoryType: 'exit',
    description: '🏆 EXIT 성공: 5억원의 자산을 달성했습니다!',
  },
  {
    type: 'metric' as const,
    target: 'users',
    operator: '>=' as const,
    value: 100000,
    victoryType: 'scale',
    description: '🚀 스케일업 성공: 10만 사용자를 달성했습니다!',
  },
  {
    type: 'milestone' as const,
    target: 'sustainable',
    operator: '>=' as const,
    value: 1095, // 3년
    victoryType: 'sustainable',
    description: '🌱 지속가능한 사업: 3년간 안정적인 사업을 운영했습니다!',
  },
];
