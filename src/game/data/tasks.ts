import type { Task } from '../types';

// ============================================
// Development Tasks
// ============================================

export const developmentTasks: Task[] = [
  {
    id: 'dev_bug_fix',
    category: 'development',
    name: '버그 수정',
    description: '보고된 버그를 디버깅하고 수정합니다. 사용자 만족도와 제품 안정성이 향상됩니다.',
    icon: '🐛',
    estimatedHours: 2,
    actualHoursRange: [1, 6],
    requirements: {
      energy: 20,
      skills: { coding: 30 },
    },
    outcomes: {
      guaranteed: [
        { type: 'product_stability', value: 5 },
        { type: 'skill_coding', value: 1 },
      ],
      possible: [
        { effect: { type: 'reputation', value: 3 }, chance: 0.3 },
        { effect: { type: 'nps', value: 5 }, chance: 0.5 },
        { effect: { type: 'bug_fix', value: 1 }, chance: 0.8 },
      ],
      risks: [
        { effect: { type: 'technical_debt', value: 3 }, chance: 0.1 },
        { effect: { type: 'stress', value: 5 }, chance: 0.15 },
      ],
    },
    repeatable: true,
  },
  {
    id: 'dev_new_feature',
    category: 'development',
    name: '신규 기능 개발',
    description: '로드맵에 있는 새로운 기능을 개발합니다. 사용자 획득과 수익 증대에 기여합니다.',
    icon: '✨',
    estimatedHours: 8,
    actualHoursRange: [6, 20],
    requirements: {
      energy: 40,
      skills: { coding: 50, design: 30 },
    },
    outcomes: {
      guaranteed: [
        { type: 'feature_progress', value: 15 },
        { type: 'skill_coding', value: 2 },
        { type: 'skill_design', value: 1 },
      ],
      possible: [
        { effect: { type: 'users', value: 20 }, chance: 0.4 },
        { effect: { type: 'reputation', value: 5 }, chance: 0.3 },
      ],
      risks: [
        { effect: { type: 'technical_debt', value: 8 }, chance: 0.3 },
        { effect: { type: 'stress', value: 10 }, chance: 0.25 },
      ],
    },
    repeatable: true,
  },
  {
    id: 'dev_refactoring',
    category: 'development',
    name: '코드 리팩토링',
    description: '기술 부채를 줄이고 코드 품질을 향상시킵니다. 장기적으로 개발 속도가 빨라집니다.',
    icon: '🔧',
    estimatedHours: 4,
    actualHoursRange: [3, 8],
    requirements: {
      energy: 25,
      skills: { coding: 60 },
    },
    outcomes: {
      guaranteed: [
        { type: 'technical_debt', value: -10 },
        { type: 'code_quality', value: 8 },
        { type: 'skill_coding', value: 2 },
      ],
      possible: [
        { effect: { type: 'product_stability', value: 5 }, chance: 0.6 },
      ],
      risks: [
        { effect: { type: 'stress', value: 5 }, chance: 0.2 },
      ],
    },
    repeatable: true,
    cooldownHours: 72,
  },
  {
    id: 'dev_performance',
    category: 'development',
    name: '성능 최적화',
    description: '서버 응답 속도와 앱 성능을 개선합니다. 사용자 경험이 향상됩니다.',
    icon: '⚡',
    estimatedHours: 6,
    actualHoursRange: [4, 12],
    requirements: {
      energy: 35,
      skills: { coding: 55 },
    },
    outcomes: {
      guaranteed: [
        { type: 'server_health', value: 10 },
        { type: 'skill_coding', value: 2 },
      ],
      possible: [
        { effect: { type: 'nps', value: 8 }, chance: 0.5 },
        { effect: { type: 'churn_rate', value: -2 }, chance: 0.4 },
      ],
      risks: [
        { effect: { type: 'product_stability', value: -5 }, chance: 0.15 },
      ],
    },
    repeatable: true,
    cooldownHours: 48,
  },
  {
    id: 'dev_security',
    category: 'development',
    name: '보안 점검',
    description: '보안 취약점을 점검하고 패치합니다. 데이터 유출 위험을 방지합니다.',
    icon: '🔒',
    estimatedHours: 3,
    actualHoursRange: [2, 6],
    requirements: {
      energy: 20,
      skills: { coding: 45 },
    },
    outcomes: {
      guaranteed: [
        { type: 'product_stability', value: 3 },
        { type: 'skill_coding', value: 1 },
      ],
      possible: [
        { effect: { type: 'reputation', value: 5 }, chance: 0.3 },
      ],
      risks: [],
    },
    repeatable: true,
    cooldownHours: 168, // 1주일
  },
];

// ============================================
// Marketing Tasks
// ============================================

export const marketingTasks: Task[] = [
  {
    id: 'marketing_content',
    category: 'marketing',
    name: '콘텐츠 마케팅',
    description: '블로그 글, SNS 포스트를 작성합니다. 브랜드 인지도가 상승합니다.',
    icon: '📝',
    estimatedHours: 4,
    actualHoursRange: [3, 8],
    requirements: {
      energy: 25,
      skills: { marketing: 40, communication: 30 },
    },
    outcomes: {
      guaranteed: [
        { type: 'brand_awareness', value: 5 },
        { type: 'skill_marketing', value: 1 },
      ],
      possible: [
        { effect: { type: 'users', value: 30 }, chance: 0.3 },
        { effect: { type: 'reputation', value: 3 }, chance: 0.4 },
      ],
      risks: [
        { effect: { type: 'reputation', value: -5 }, chance: 0.05 },
      ],
    },
    repeatable: true,
  },
  {
    id: 'marketing_paid_ads',
    category: 'marketing',
    name: '유료 광고 집행',
    description: 'Google Ads, Facebook 광고를 집행합니다. 빠른 사용자 획득이 가능합니다.',
    icon: '📢',
    estimatedHours: 2,
    actualHoursRange: [1, 4],
    requirements: {
      energy: 15,
      skills: { marketing: 50 },
      money: 100000,
    },
    outcomes: {
      guaranteed: [
        { type: 'users', value: 30 },
        { type: 'skill_marketing', value: 1 },
      ],
      possible: [
        { effect: { type: 'premium_users', value: 3 }, chance: 0.3 },
        { effect: { type: 'brand_awareness', value: 8 }, chance: 0.5 },
      ],
      risks: [
        { effect: { type: 'cash', value: -50000 }, chance: 0.2 },
      ],
    },
    repeatable: true,
  },
  {
    id: 'marketing_seo',
    category: 'marketing',
    name: 'SEO 최적화',
    description: '검색 엔진 최적화 작업을 수행합니다. 장기적으로 유기적 트래픽이 증가합니다.',
    icon: '🔍',
    estimatedHours: 5,
    actualHoursRange: [4, 10],
    requirements: {
      energy: 30,
      skills: { marketing: 45, coding: 30 },
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_marketing', value: 2 },
      ],
      possible: [
        { effect: { type: 'users', value: 50 }, chance: 0.4 },
        { effect: { type: 'brand_awareness', value: 10 }, chance: 0.5 },
      ],
      risks: [],
    },
    repeatable: true,
    cooldownHours: 168,
  },
  {
    id: 'marketing_community',
    category: 'marketing',
    name: '커뮤니티 활동',
    description: '온라인 커뮤니티에서 활동하며 제품을 자연스럽게 홍보합니다.',
    icon: '👥',
    estimatedHours: 2,
    actualHoursRange: [1, 4],
    requirements: {
      energy: 15,
      skills: { communication: 40 },
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_communication', value: 1 },
      ],
      possible: [
        { effect: { type: 'users', value: 15 }, chance: 0.5 },
        { effect: { type: 'reputation', value: 5 }, chance: 0.4 },
      ],
      risks: [
        { effect: { type: 'reputation', value: -10 }, chance: 0.05 },
      ],
    },
    repeatable: true,
  },
];

// ============================================
// Customer Support Tasks
// ============================================

export const supportTasks: Task[] = [
  {
    id: 'support_tickets',
    category: 'customer_support',
    name: '고객 문의 처리',
    description: '이메일, 채팅으로 들어온 고객 문의에 답변합니다.',
    icon: '💬',
    estimatedHours: 2,
    actualHoursRange: [1, 4],
    requirements: {
      energy: 15,
      skills: { communication: 40 },
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_communication', value: 1 },
      ],
      possible: [
        { effect: { type: 'nps', value: 5 }, chance: 0.5 },
        { effect: { type: 'churn_rate', value: -1 }, chance: 0.4 },
        { effect: { type: 'reputation', value: 3 }, chance: 0.3 },
      ],
      risks: [
        { effect: { type: 'stress', value: 8 }, chance: 0.25 },
      ],
    },
    repeatable: true,
  },
  {
    id: 'support_faq',
    category: 'customer_support',
    name: 'FAQ 문서 작성',
    description: '자주 묻는 질문을 정리하여 문서화합니다. 지원 업무 부담이 줄어듭니다.',
    icon: '📚',
    estimatedHours: 4,
    actualHoursRange: [3, 6],
    requirements: {
      energy: 20,
      skills: { communication: 35 },
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_communication', value: 1 },
        { type: 'nps', value: 3 },
      ],
      possible: [
        { effect: { type: 'churn_rate', value: -2 }, chance: 0.6 },
      ],
      risks: [],
    },
    repeatable: true,
    cooldownHours: 336, // 2주
  },
  {
    id: 'support_feedback',
    category: 'customer_support',
    name: '사용자 피드백 분석',
    description: '사용자 피드백을 수집하고 분석하여 개선점을 찾습니다.',
    icon: '📊',
    estimatedHours: 3,
    actualHoursRange: [2, 5],
    requirements: {
      energy: 20,
      skills: { communication: 30, business: 25 },
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_business', value: 1 },
      ],
      possible: [
        { effect: { type: 'feature_progress', value: 5 }, chance: 0.6 },
        { effect: { type: 'nps', value: 3 }, chance: 0.4 },
      ],
      risks: [],
    },
    repeatable: true,
    cooldownHours: 72,
  },
];

// ============================================
// Business Tasks
// ============================================

export const businessTasks: Task[] = [
  {
    id: 'business_planning',
    category: 'business',
    name: '사업 계획 수립',
    description: '단기/장기 사업 계획을 수립하고 목표를 설정합니다.',
    icon: '📋',
    estimatedHours: 4,
    actualHoursRange: [3, 8],
    requirements: {
      energy: 25,
      skills: { business: 40 },
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_business', value: 2 },
        { type: 'confidence', value: 5 },
      ],
      possible: [
        { effect: { type: 'motivation', value: 10 }, chance: 0.5 },
      ],
      risks: [],
    },
    repeatable: true,
    cooldownHours: 168,
  },
  {
    id: 'business_finance',
    category: 'business',
    name: '재무 관리',
    description: '수입/지출을 분석하고 재무 계획을 세웁니다.',
    icon: '💰',
    estimatedHours: 2,
    actualHoursRange: [1, 4],
    requirements: {
      energy: 15,
      skills: { business: 35 },
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_business', value: 1 },
      ],
      possible: [
        { effect: { type: 'cash', value: 50000 }, chance: 0.3 },
      ],
      risks: [],
    },
    repeatable: true,
    cooldownHours: 168,
  },
  {
    id: 'business_pitch',
    category: 'business',
    name: '투자 유치 준비',
    description: '투자 피칭 자료를 준비합니다. 투자 기회가 열릴 수 있습니다.',
    icon: '🎯',
    estimatedHours: 8,
    actualHoursRange: [6, 16],
    requirements: {
      energy: 40,
      skills: { business: 50, communication: 45 },
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_business', value: 3 },
        { type: 'skill_communication', value: 2 },
      ],
      possible: [
        { effect: { type: 'reputation', value: 10 }, chance: 0.4 },
        { effect: { type: 'cash', value: 5000000 }, chance: 0.1 },
      ],
      risks: [
        { effect: { type: 'stress', value: 15 }, chance: 0.4 },
      ],
    },
    repeatable: true,
    cooldownHours: 720, // 1달
  },
];

// ============================================
// Personal Tasks
// ============================================

export const personalTasks: Task[] = [
  {
    id: 'personal_rest',
    category: 'personal',
    name: '휴식',
    description: '하루를 쉬며 에너지와 건강을 회복합니다.',
    icon: '😴',
    estimatedHours: 8,
    actualHoursRange: [8, 8],
    requirements: {
      energy: 0,
    },
    outcomes: {
      guaranteed: [
        { type: 'energy', value: 50 },
        { type: 'stress', value: -25 },
        { type: 'health', value: 15 },
        { type: 'work_life_balance', value: 10 },
      ],
      possible: [
        { effect: { type: 'motivation', value: 10 }, chance: 0.5 },
      ],
      risks: [],
    },
    repeatable: true,
  },
  {
    id: 'personal_exercise',
    category: 'personal',
    name: '운동',
    description: '운동으로 체력과 정신 건강을 관리합니다.',
    icon: '🏃',
    estimatedHours: 1,
    actualHoursRange: [1, 2],
    requirements: {
      energy: 10,
    },
    outcomes: {
      guaranteed: [
        { type: 'health', value: 10 },
        { type: 'stress', value: -15 },
        { type: 'energy', value: 5 },
      ],
      possible: [
        { effect: { type: 'motivation', value: 8 }, chance: 0.6 },
        { effect: { type: 'confidence', value: 5 }, chance: 0.4 },
      ],
      risks: [],
    },
    repeatable: true,
  },
  {
    id: 'personal_learning',
    category: 'learning',
    name: '자기 계발',
    description: '온라인 강의, 책 등으로 새로운 지식을 습득합니다.',
    icon: '📖',
    estimatedHours: 3,
    actualHoursRange: [2, 5],
    requirements: {
      energy: 20,
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_coding', value: 2 },
        { type: 'skill_business', value: 1 },
      ],
      possible: [
        { effect: { type: 'confidence', value: 5 }, chance: 0.5 },
        { effect: { type: 'motivation', value: 8 }, chance: 0.4 },
      ],
      risks: [],
    },
    repeatable: true,
  },
  {
    id: 'personal_networking',
    category: 'networking',
    name: '네트워킹',
    description: '업계 사람들과 만나 인맥을 쌓습니다.',
    icon: '🤝',
    estimatedHours: 3,
    actualHoursRange: [2, 5],
    requirements: {
      energy: 20,
      skills: { communication: 30 },
    },
    outcomes: {
      guaranteed: [
        { type: 'skill_communication', value: 2 },
      ],
      possible: [
        { effect: { type: 'reputation', value: 5 }, chance: 0.5 },
        { effect: { type: 'confidence', value: 5 }, chance: 0.4 },
      ],
      risks: [
        { effect: { type: 'stress', value: 5 }, chance: 0.2 },
      ],
    },
    repeatable: true,
    cooldownHours: 48,
  },
];

// ============================================
// All Tasks Export
// ============================================

export const ALL_TASKS: Task[] = [
  ...developmentTasks,
  ...marketingTasks,
  ...supportTasks,
  ...businessTasks,
  ...personalTasks,
];

export function getTaskById(id: string): Task | undefined {
  return ALL_TASKS.find((task) => task.id === id);
}

export function getTasksByCategory(category: string): Task[] {
  return ALL_TASKS.filter((task) => task.category === category);
}
