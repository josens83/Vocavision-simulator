/**
 * Chapter 2: Realism Engine - Real Cost Structure Data
 * 한국 1인 개발자/스타트업 실제 비용 데이터
 */

// 인프라 비용 (월간, 원 단위)
export const INFRASTRUCTURE_COSTS = {
  // 서버 호스팅
  hosting: {
    vercel: {
      hobby: { monthly: 0, limits: '100GB 대역폭, 상업용 불가' },
      pro: { monthly: 26000, limits: '1TB 대역폭' },
      team: { monthly: 52000, limits: '팀원당' },
    },
    railway: {
      starter: { monthly: 0, credits: 6500 },
      developer: { monthly: 6500, limits: '사용량 기반' },
      team: { monthly: 26000, limits: '팀 기능' },
    },
    aws: {
      minimal: { monthly: 40000, spec: 't3.micro + RDS' },
      standard: { monthly: 130000, spec: 't3.small + RDS + S3' },
      production: { monthly: 400000, spec: '다중 서버' },
    },
    cloudflare: {
      free: { monthly: 0, limits: 'CDN + 기본 보안' },
      pro: { monthly: 26000, limits: 'WAF + 이미지 최적화' },
    },
  },

  // 데이터베이스
  database: {
    supabase: {
      free: { monthly: 0, limits: '500MB, 2개 프로젝트' },
      pro: { monthly: 32500, limits: '8GB, 무제한 API' },
    },
    planetscale: {
      free: { monthly: 0, limits: '5GB' },
      scaler: { monthly: 39000, limits: '10GB' },
    },
    neon: {
      free: { monthly: 0, limits: '0.5GB' },
      launch: { monthly: 24700, limits: '10GB' },
    },
    mongodb: {
      free: { monthly: 0, limits: '512MB' },
      shared: { monthly: 11700, limits: '2GB' },
      dedicated: { monthly: 74100, limits: '10GB' },
    },
  },

  // 도메인 (연간)
  domain: {
    comKr: 22000,
    com: 15000,
    io: 60000,
    app: 20000,
    kr: 18000,
  },

  // 이메일 서비스 (월간)
  email: {
    resend: {
      free: { monthly: 0, limits: '3000/월' },
      pro: { monthly: 26000, limits: '50000/월' },
    },
    sendgrid: {
      free: { monthly: 0, limits: '100/일' },
      essentials: { monthly: 24700, limits: '50000/월' },
    },
    mailgun: {
      free: { monthly: 0, limits: '5000/3개월' },
      foundation: { monthly: 45500, limits: '50000/월' },
    },
  },

  // 모니터링
  monitoring: {
    sentry: {
      free: { monthly: 0, limits: '5000 에러/월' },
      team: { monthly: 33800, limits: '50000/월' },
    },
    logrocket: {
      free: { monthly: 0, limits: '1000 세션/월' },
      team: { monthly: 129000, limits: '10000 세션/월' },
    },
    vercelAnalytics: {
      free: { monthly: 0, limits: '2500 이벤트/월' },
      pro: { monthly: 13000, limits: '25000/월' },
    },
  },

  // 스토리지
  storage: {
    cloudflareR2: {
      free: { monthly: 0, limits: '10GB' },
      paid: { perGB: 19, limits: '무제한' },
    },
    awsS3: {
      perGB: 30,
      transfer: 120, // per GB
    },
  },
};

// API 비용 (사용량 기반)
export const API_COSTS = {
  openai: {
    // USD -> KRW 환율 1300원 기준
    gpt4: {
      input: 39, // per 1K tokens (0.03 USD)
      output: 78, // per 1K tokens (0.06 USD)
    },
    gpt4turbo: {
      input: 13, // per 1K tokens
      output: 39, // per 1K tokens
    },
    gpt35turbo: {
      input: 0.65, // per 1K tokens
      output: 1.95, // per 1K tokens
    },
    dalle3: {
      standard: 52, // per image
      hd: 104, // per image
    },
    whisper: 7.8, // per minute
    tts: {
      standard: 19500, // per 1M characters
      hd: 39000, // per 1M characters
    },
  },

  anthropic: {
    claude3opus: {
      input: 19.5, // per 1K tokens
      output: 97.5, // per 1K tokens
    },
    claude3sonnet: {
      input: 3.9, // per 1K tokens
      output: 19.5, // per 1K tokens
    },
    claude3haiku: {
      input: 0.325, // per 1K tokens
      output: 1.625, // per 1K tokens
    },
  },

  google: {
    speechToText: 7.8, // per 15 seconds
    textToSpeech: {
      standard: 5200, // per 1M characters
      wavenet: 20800, // per 1M characters
    },
    translate: 26000, // per 1M characters
  },

  // 결제 수수료
  stripe: {
    percentage: 0.034, // 3.4%
    fixed: 400, // 원
  },

  // SMS/카카오톡
  alimtalk: {
    perMessage: 8, // 알림톡
    friendTalk: 15, // 친구톡
  },
};

// 법적/행정 비용
export const LEGAL_COSTS = {
  // 사업 등록
  businessRegistration: {
    sole: 0, // 개인사업자 무료
    corporation: 500000, // 법인 설립 최소
    llc: 350000, // 유한회사
  },

  // 필수 신고
  telecoms: 0, // 통신판매업 무료
  personalInfo: 0, // 개인정보처리 등록 무료

  // 지식재산권
  trademark: {
    application: 210000, // 출원료
    registration: 210000, // 등록료
    total: 420000,
  },
  patent: {
    application: 160000,
    examination: 140000,
    registration: 220000,
    total: 520000,
  },

  // 전문 서비스
  accounting: {
    monthlyBookkeeping: 100000, // 기장료
    yearEndSettlement: 300000, // 결산
    taxFiling: 200000, // 세무신고
  },
  legal: {
    hourly: 300000, // 시간당
    contractReview: 500000, // 계약서 검토
    termsOfService: 1000000, // 이용약관 작성
    privacyPolicy: 500000, // 개인정보처리방침
  },

  // 규제 준수 (과태료)
  penalties: {
    personalInfo: 50000000, // 최대
    advertising: 10000000,
    subscription: 5000000,
  },
};

// 마케팅 비용
export const MARKETING_COSTS = {
  // SNS 광고
  ads: {
    facebook: {
      averageCPC: 500,
      averageCPM: 5000,
      minBudget: 10000, // 일
    },
    instagram: {
      averageCPC: 600,
      averageCPM: 6000,
      minBudget: 10000,
    },
    google: {
      averageCPC: 800,
      averageCPM: 3000,
      minBudget: 20000,
    },
    naver: {
      averageCPC: 300,
      averageCPM: 2000,
      minBudget: 30000,
    },
    kakao: {
      averageCPC: 200,
      averageCPM: 1500,
      minBudget: 10000,
    },
    youtube: {
      averageCPV: 30, // 조회당
      averageCPM: 4000,
      minBudget: 50000,
    },
  },

  // 콘텐츠 제작 (외주)
  content: {
    blogPost: 100000,
    youtubeVideo: 500000,
    shortVideo: 200000,
    infographic: 300000,
    ebook: 1000000,
  },

  // PR
  pr: {
    pressRelease: 300000,
    mediaInterview: 0,
    sponsoredArticle: 2000000,
  },

  // 인플루언서
  influencer: {
    micro: { range: [100000, 500000], followers: '1만-10만' },
    mid: { range: [500000, 2000000], followers: '10만-50만' },
    macro: { range: [2000000, 10000000], followers: '50만+' },
  },
};

// 외주 개발 비용
export const OUTSOURCING_COSTS = {
  developer: {
    junior: { hourly: 30000, monthly: 3000000 },
    mid: { hourly: 50000, monthly: 5000000 },
    senior: { hourly: 80000, monthly: 8000000 },
    freelance: { hourly: 60000, project: 'varies' },
  },
  designer: {
    ui: { hourly: 40000, monthly: 4000000 },
    ux: { hourly: 50000, monthly: 5000000 },
    brand: { project: 2000000 },
    logo: { project: 500000 },
  },
  pm: { hourly: 50000, monthly: 5000000 },
  qa: { hourly: 30000, monthly: 3000000 },
};

// 기타 운영 비용
export const OPERATIONAL_COSTS = {
  // 생산성 도구 (월간)
  tools: {
    github: { free: 0, team: 5200 },
    figma: { free: 0, professional: 15600 },
    notion: { free: 0, plus: 10400 },
    slack: { free: 0, pro: 10500 },
    linear: { free: 0, plus: 10400 },
    postman: { free: 0, basic: 15600 },
  },

  // 사무실 (월간)
  office: {
    coworking: { perSeat: 300000 },
    virtualOffice: { monthly: 50000 },
    homeOffice: { setup: 2000000, monthly: 0 },
  },

  // 보험
  insurance: {
    liability: { yearly: 500000 },
    cyber: { yearly: 1000000 },
  },
};

// 비용 계산 유틸리티
export interface CostBreakdown {
  fixed: {
    hosting: number;
    database: number;
    domain: number;
    email: number;
    monitoring: number;
    tools: number;
    legal: number;
    subtotal: number;
  };
  variable: {
    api: number;
    payment: number;
    marketing: number;
    support: number;
    subtotal: number;
  };
  total: number;
  perUser: number;
  runway: number;
}

export interface CostConfig {
  hostingPlan: 'hobby' | 'pro' | 'aws_minimal' | 'aws_standard';
  dbPlan: 'free' | 'pro';
  emailPlan: 'free' | 'pro';
  monitoringPlan: 'free' | 'team';
  domains: number;
  marketingBudget: number;
  apiUsage: {
    gptCalls: number;
    dalleImages: number;
    ttsCalls: number;
  };
}

// 기본 비용 설정
export const DEFAULT_COST_CONFIG: CostConfig = {
  hostingPlan: 'hobby',
  dbPlan: 'free',
  emailPlan: 'free',
  monitoringPlan: 'free',
  domains: 1,
  marketingBudget: 0,
  apiUsage: {
    gptCalls: 100,
    dalleImages: 0,
    ttsCalls: 0,
  },
};

// 사용자 수에 따른 인프라 비용 계산
export function calculateInfrastructureCost(userCount: number): number {
  if (userCount < 100) return 0; // 무료 티어로 충분
  if (userCount < 500) return 50000; // 기본 유료
  if (userCount < 2000) return 150000; // 중급
  if (userCount < 10000) return 400000; // 프로덕션
  return 1000000 + Math.floor(userCount / 10000) * 200000; // 스케일업
}

// API 비용 추정
export function estimateApiCost(
  dailyActiveUsers: number,
  aiFeatureUsage: number // 0-1
): number {
  // 평균 사용자당 일 AI 요청 수
  const avgRequestsPerUser = 3;
  // 요청당 평균 토큰
  const avgTokensPerRequest = 500;

  const dailyRequests = dailyActiveUsers * avgRequestsPerUser * aiFeatureUsage;
  const monthlyRequests = dailyRequests * 30;
  const monthlyTokens = monthlyRequests * avgTokensPerRequest;

  // GPT-3.5 Turbo 비용 (저렴한 옵션)
  const inputCost = (monthlyTokens * 0.5 * API_COSTS.openai.gpt35turbo.input) / 1000;
  const outputCost = (monthlyTokens * 0.5 * API_COSTS.openai.gpt35turbo.output) / 1000;

  return Math.round(inputCost + outputCost);
}

// 결제 수수료 계산
export function calculatePaymentFees(premiumUsers: number, price: number): number {
  const totalRevenue = premiumUsers * price;
  return Math.round(totalRevenue * API_COSTS.stripe.percentage + premiumUsers * API_COSTS.stripe.fixed);
}

// 전체 월간 비용 계산
export function calculateMonthlyCost(
  userCount: number,
  premiumUsers: number,
  config: CostConfig = DEFAULT_COST_CONFIG
): CostBreakdown {
  const fixed = {
    hosting: calculateInfrastructureCost(userCount),
    database: config.dbPlan === 'free' ? 0 : INFRASTRUCTURE_COSTS.database.supabase.pro.monthly,
    domain: Math.round((INFRASTRUCTURE_COSTS.domain.com * config.domains) / 12),
    email: config.emailPlan === 'free' ? 0 : INFRASTRUCTURE_COSTS.email.resend.pro.monthly,
    monitoring: config.monitoringPlan === 'free' ? 0 : INFRASTRUCTURE_COSTS.monitoring.sentry.team.monthly,
    tools: OPERATIONAL_COSTS.tools.github.free + OPERATIONAL_COSTS.tools.notion.free,
    legal: LEGAL_COSTS.accounting.monthlyBookkeeping,
    subtotal: 0,
  };
  fixed.subtotal = Object.values(fixed).reduce((a, b) => a + b, 0) - fixed.subtotal;

  const dau = Math.floor(userCount * 0.3);
  const variable = {
    api: estimateApiCost(dau, 0.5),
    payment: calculatePaymentFees(premiumUsers, 9990),
    marketing: config.marketingBudget,
    support: Math.ceil(userCount / 500) * 50000,
    subtotal: 0,
  };
  variable.subtotal = Object.values(variable).reduce((a, b) => a + b, 0) - variable.subtotal;

  const total = fixed.subtotal + variable.subtotal;

  return {
    fixed,
    variable,
    total,
    perUser: userCount > 0 ? Math.round(total / userCount) : 0,
    runway: 0, // 외부에서 계산
  };
}
