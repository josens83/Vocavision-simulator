/**
 * Chapter 2: Realism Engine - Startup Statistics Data
 * 실제 한국 스타트업 통계 및 EdTech 산업 데이터 기반
 */

// 한국 스타트업 생존율 데이터 (중소벤처기업부 통계 기반)
export const STARTUP_SURVIVAL_DATA = {
  korea: {
    year1: 0.627, // 1년 후 생존율 62.7%
    year2: 0.472, // 2년 후 생존율 47.2%
    year3: 0.389, // 3년 후 생존율 38.9%
    year5: 0.291, // 5년 후 생존율 29.1%
    year10: 0.178, // 10년 후 생존율 17.8%
  },

  // 실패 원인 분포 (CB Insights + 한국 데이터 기반)
  failureReasons: {
    noMarketNeed: 0.42, // 시장 수요 없음 42%
    ranOutOfCash: 0.29, // 자금 고갈 29%
    wrongTeam: 0.23, // 팀 문제 23%
    competition: 0.19, // 경쟁 19%
    pricing: 0.18, // 가격 문제 18%
    poorProduct: 0.17, // 제품 품질 17%
    noBusinessModel: 0.17, // 비즈니스 모델 없음 17%
    poorMarketing: 0.14, // 마케팅 실패 14%
    ignoreCustomers: 0.14, // 고객 무시 14%
    badTiming: 0.13, // 타이밍 문제 13%
    burnout: 0.08, // 번아웃 8%
  },

  // 월별 기본 생존 확률 (처음 12개월)
  monthlyBaseFailureRate: [
    0.05, // 월 1: 5%
    0.04, // 월 2: 4%
    0.04, // 월 3: 4%
    0.035, // 월 4: 3.5%
    0.035, // 월 5: 3.5%
    0.03, // 월 6: 3%
    0.03, // 월 7: 3%
    0.025, // 월 8: 2.5%
    0.025, // 월 9: 2.5%
    0.02, // 월 10: 2%
    0.02, // 월 11: 2%
    0.02, // 월 12: 2%
  ],
};

// EdTech 특화 데이터 (산업 평균)
export const EDTECH_BENCHMARKS = {
  // 고객 획득 비용 (원)
  averageCAC: 45000,
  goodCAC: 25000, // 상위 25%
  poorCAC: 80000, // 하위 25%

  // 고객 생애 가치 (원)
  averageLTV: 180000,
  goodLTV: 300000,
  poorLTV: 80000,

  // LTV/CAC 비율
  healthyLTVCAC: 3.0, // 건강한 비율
  minimumLTVCAC: 1.5, // 최소한의 비율

  // 월간 이탈률 (Churn Rate)
  averageChurnRate: 0.073, // 7.3%
  goodChurnRate: 0.04, // 4%
  poorChurnRate: 0.12, // 12%

  // 무료→유료 전환율
  averageConversionRate: 0.023, // 2.3%
  goodConversionRate: 0.05, // 5%
  poorConversionRate: 0.01, // 1%

  // 사용자당 월평균 수익 (ARPU)
  averageARPU: 12500,
  premiumARPU: 9990, // 프리미엄 구독료

  // 무료 사용자 가치
  freeUserValue: 500, // 광고, 데이터, 바이럴

  // 앱스토어 평점별 전환율 배수
  ratingMultiplier: {
    rating5: 1.5,
    rating4: 1.2,
    rating3: 1.0,
    rating2: 0.5,
    rating1: 0.2,
  },

  // 계절성 (월별 수요 변동)
  seasonality: {
    jan: 1.3, // 새해 결심
    feb: 1.1,
    mar: 0.9, // 학기 시작
    apr: 0.85,
    may: 0.8,
    jun: 0.7, // 여름방학 시작
    jul: 0.65,
    aug: 0.75,
    sep: 1.2, // 새학기
    oct: 1.1,
    nov: 1.0,
    dec: 0.85,
  } as Record<string, number>,

  // 온보딩 퍼널 벤치마크
  onboardingFunnel: {
    signup: 1.0, // 가입 완료
    profileComplete: 0.7, // 프로필 완성
    firstLesson: 0.5, // 첫 레슨 완료
    levelTest: 0.4, // 레벨 테스트 완료
    firstWeekActive: 0.3, // 첫 주 활성
    ahaMoment: 0.2, // '아하' 순간 도달
  },

  // 리텐션 커브 (업계 평균)
  retentionCurve: {
    day1: 0.4, // 40%
    day3: 0.25, // 25%
    day7: 0.15, // 15%
    day14: 0.1, // 10%
    day30: 0.07, // 7%
    day60: 0.05, // 5%
    day90: 0.04, // 4%
  },
};

// SaaS 일반 벤치마크
export const SAAS_BENCHMARKS = {
  // 성장 지표
  goodGrowthRate: 0.15, // 월 15%
  greatGrowthRate: 0.3, // 월 30%
  hypergrowthRate: 0.5, // 월 50%

  // Rule of 40 (성장률 + 이익률 > 40%)
  ruleOf40Target: 40,

  // 그로스 마진
  averageGrossMargin: 0.75, // 75%
  goodGrossMargin: 0.85, // 85%

  // NPS (Net Promoter Score)
  averageNPS: 30,
  goodNPS: 50,
  excellentNPS: 70,

  // 지원 티켓
  ticketsPerUser: 0.05, // 월 5%의 사용자가 지원 요청
  avgResolutionTime: 24, // 시간

  // DAU/MAU 비율 (건강한 참여도)
  healthyEngagement: 0.3, // 30%
  goodEngagement: 0.5, // 50%
};

// 바이럴 계수 벤치마크
export const VIRAL_BENCHMARKS = {
  // K-factor (바이럴 계수)
  averageK: 0.3,
  goodK: 0.6,
  viralK: 1.0, // 1 이상이면 자연 성장

  // 추천 전환율
  referralConversion: 0.15, // 추천받은 사람의 15%가 가입

  // 소셜 공유율
  shareRate: 0.05, // 활성 사용자의 5%가 공유
};

// 투자 관련 벤치마크
export const INVESTMENT_BENCHMARKS = {
  // Pre-seed
  preSeed: {
    typical: 100000000, // 1억
    range: { min: 50000000, max: 300000000 },
    equity: { min: 0.05, max: 0.15 },
  },

  // Seed
  seed: {
    typical: 500000000, // 5억
    range: { min: 200000000, max: 1000000000 },
    equity: { min: 0.1, max: 0.25 },
  },

  // Series A
  seriesA: {
    typical: 3000000000, // 30억
    range: { min: 1000000000, max: 5000000000 },
    equity: { min: 0.15, max: 0.3 },
  },

  // 투자자가 보는 지표
  investorCriteria: {
    minimumMRR: 10000000, // 월 1천만원 MRR
    minimumGrowth: 0.1, // 월 10% 성장
    minimumUsers: 1000, // 1000 사용자
    minimumRetention: 0.05, // 5% 월 리텐션
  },
};

// 시간대별 사용 패턴
export const USAGE_PATTERNS = {
  hourly: {
    0: 0.1,
    1: 0.05,
    2: 0.02,
    3: 0.02,
    4: 0.02,
    5: 0.05,
    6: 0.15,
    7: 0.4,
    8: 0.6,
    9: 0.5,
    10: 0.4,
    11: 0.35,
    12: 0.5,
    13: 0.45,
    14: 0.4,
    15: 0.35,
    16: 0.4,
    17: 0.5,
    18: 0.7,
    19: 0.85,
    20: 1.0, // 피크
    21: 0.9,
    22: 0.7,
    23: 0.4,
  } as Record<number, number>,

  // 요일별 패턴
  daily: {
    sunday: 0.9,
    monday: 1.0,
    tuesday: 1.05,
    wednesday: 1.0,
    thursday: 0.95,
    friday: 0.8,
    saturday: 0.7,
  } as Record<string, number>,
};

// 경쟁사 데이터 (가상)
export const COMPETITOR_DATA = [
  {
    id: 'quizlit',
    name: 'QuizLit',
    type: 'direct' as const,
    marketShare: 0.25,
    strengths: ['브랜드 인지도', '콘텐츠 양', '글로벌 서비스'],
    weaknesses: ['비싼 가격', '한국 특화 부족'],
    pricing: 14900,
    userBase: 500000,
    aggressiveness: 0.7,
    featureCopySpeed: 60, // 일
  },
  {
    id: 'hackers',
    name: '해커스보카',
    type: 'indirect' as const,
    marketShare: 0.15,
    strengths: ['시험 특화', '오프라인 연계', '인지도'],
    weaknesses: ['젊은 층 약함', '앱 UX'],
    pricing: 12900,
    userBase: 300000,
    aggressiveness: 0.4,
    featureCopySpeed: 120,
  },
  {
    id: 'anki',
    name: 'Anki',
    type: 'opensource' as const,
    marketShare: 0.1,
    strengths: ['무료', '충성 사용자', '유연성'],
    weaknesses: ['진입 장벽', 'UX', '콘텐츠 없음'],
    pricing: 0,
    userBase: 100000,
    aggressiveness: 0,
    featureCopySpeed: Infinity,
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    type: 'indirect' as const,
    marketShare: 0.2,
    strengths: ['게임화', '브랜드', '무료 모델'],
    weaknesses: ['단어 특화 아님', '심화 학습 부족'],
    pricing: 9900,
    userBase: 800000,
    aggressiveness: 0.8,
    featureCopySpeed: 45,
  },
];

// 월 이름 헬퍼
export function getMonthKey(month: number): string {
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return months[month - 1] || 'jan';
}

// 계절성 계수 가져오기
export function getSeasonalityMultiplier(month: number): number {
  const key = getMonthKey(month);
  return EDTECH_BENCHMARKS.seasonality[key] || 1.0;
}

// 리텐션 비율 가져오기
export function getRetentionRate(daysSinceSignup: number): number {
  const curve = EDTECH_BENCHMARKS.retentionCurve;

  if (daysSinceSignup <= 1) return curve.day1;
  if (daysSinceSignup <= 3) return curve.day3;
  if (daysSinceSignup <= 7) return curve.day7;
  if (daysSinceSignup <= 14) return curve.day14;
  if (daysSinceSignup <= 30) return curve.day30;
  if (daysSinceSignup <= 60) return curve.day60;
  return curve.day90;
}
