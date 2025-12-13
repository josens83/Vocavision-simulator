/**
 * Chapter 9: Tutorial & Onboarding - Tutorial Sequences
 * 튜토리얼 시퀀스 정의
 */

import { TutorialSequence, TutorialStep } from './types';

// ============================================
// 기본 튜토리얼
// ============================================

export const basicTutorial: TutorialSequence = {
  id: 'basic_tutorial',
  name: '기본 가이드',
  description: 'VocaVision 시뮬레이터의 기본 조작을 배웁니다.',
  category: 'basics',
  trigger: 'first_launch',
  priority: 100,
  canSkip: true,
  canRepeat: true,
  showProgress: true,
  startStep: 'welcome',
  steps: [
    {
      id: 'welcome',
      type: 'modal',
      title: '🎮 VocaVision 시뮬레이터에 오신 것을 환영합니다!',
      content: `여러분은 이제 1인 에듀테크 스타트업 "VocaVision"의 창업자입니다.

영어 단어 학습 앱을 만들어 성공적인 비즈니스로 성장시켜 보세요!

이 튜토리얼에서 기본적인 게임 조작 방법을 알려드립니다.`,
      showOverlay: true,
      overlayOpacity: 0.8,
      next: 'dashboard_intro',
    },
    {
      id: 'dashboard_intro',
      type: 'highlight',
      title: '📊 대시보드',
      content: '이곳은 대시보드입니다. 현재 비즈니스 상태를 한눈에 확인할 수 있어요.',
      highlight: {
        selector: '[data-tutorial="dashboard"]',
        padding: 10,
        shape: 'rect',
      },
      position: 'bottom',
      next: 'stats_intro',
    },
    {
      id: 'stats_intro',
      type: 'highlight',
      title: '❤️ 상태 바',
      content: `상단의 상태 바에서 중요한 지표들을 확인하세요:

• 💰 현금: 보유 자금
• 👥 사용자: 총 사용자 수
• ⚡ 에너지: 업무 수행에 필요한 에너지
• 😰 스트레스: 높으면 번아웃 위험!`,
      highlight: {
        selector: '[data-tutorial="stats-bar"]',
        padding: 5,
        shape: 'rect',
      },
      position: 'bottom',
      next: 'time_intro',
    },
    {
      id: 'time_intro',
      type: 'highlight',
      title: '⏰ 시간 관리',
      content: `게임은 실시간으로 진행됩니다.

• ⏸️ 일시정지: 언제든지 멈출 수 있어요
• ▶️ 재생: 게임 진행
• ⏩ 배속: 1x, 2x, 4x 속도 조절`,
      highlight: {
        selector: '[data-tutorial="time-controls"]',
        padding: 5,
        shape: 'rect',
      },
      position: 'left',
      next: 'actions_intro',
    },
    {
      id: 'actions_intro',
      type: 'highlight',
      title: '🎯 액션 선택',
      content: `왼쪽 메뉴에서 다양한 액션을 선택할 수 있습니다:

• 💻 개발: 앱 기능 개발
• 📢 마케팅: 사용자 유치
• 💼 비즈니스: 사업 관리
• 📚 학습: 스킬 향상
• 😴 휴식: 에너지 회복`,
      highlight: {
        selector: '[data-tutorial="action-menu"]',
        padding: 10,
        shape: 'rect',
      },
      position: 'right',
      next: 'energy_warning',
    },
    {
      id: 'energy_warning',
      type: 'tooltip',
      title: '⚠️ 에너지 관리',
      content: `에너지가 부족하면 업무를 수행할 수 없어요!

에너지가 낮아지면 휴식을 취하세요.
스트레스가 너무 높아지면 번아웃으로 게임 오버될 수 있습니다.`,
      position: 'center',
      showOverlay: true,
      next: 'events_intro',
    },
    {
      id: 'events_intro',
      type: 'modal',
      title: '📨 이벤트 시스템',
      content: `게임 중 다양한 이벤트가 발생합니다!

• 🎉 좋은 기회
• ⚠️ 위기 상황
• 🤝 협력 제안

각 이벤트에서 현명한 선택을 해주세요.
여러분의 선택이 비즈니스의 미래를 결정합니다!`,
      showOverlay: true,
      next: 'goal_intro',
    },
    {
      id: 'goal_intro',
      type: 'modal',
      title: '🎯 게임 목표',
      content: `다음 목표 중 하나를 달성하면 승리합니다:

• 👑 프리미엄 사용자 1,000명 달성
• 💰 현금 1억원 보유
• 🏆 1년 후 인수 제안 (특정 조건 충족 시)

주의: 파산, 번아웃, 평판 붕괴 시 게임 오버!`,
      showOverlay: true,
      next: 'first_action',
    },
    {
      id: 'first_action',
      type: 'action',
      title: '✨ 첫 번째 액션',
      content: '이제 직접 해볼까요? 아무 액션이나 하나 선택해보세요!',
      action: {
        type: 'click',
        target: '[data-tutorial="action-button"]',
        timeout: 30000,
      },
      highlight: {
        selector: '[data-tutorial="action-menu"]',
        padding: 10,
        shape: 'rect',
        clickThrough: true,
      },
      next: 'tutorial_complete',
    },
    {
      id: 'tutorial_complete',
      type: 'reward',
      title: '🎉 튜토리얼 완료!',
      content: `축하합니다! 기본 튜토리얼을 완료했습니다.

보상으로 보너스 현금을 드립니다!

더 자세한 도움말은 메뉴의 "도움말"에서 확인하세요.
행운을 빕니다! 🚀`,
      reward: {
        type: 'cash',
        value: 500000,
      },
      showOverlay: true,
    },
  ],
  completionReward: {
    type: 'achievement',
    value: 'tutorial_complete',
  },
};

// ============================================
// 비즈니스 튜토리얼
// ============================================

export const businessTutorial: TutorialSequence = {
  id: 'business_tutorial',
  name: '비즈니스 관리',
  description: '수익과 비용 관리 방법을 배웁니다.',
  category: 'business',
  trigger: 'milestone',
  triggerCondition: {
    type: 'users',
    value: 100,
  },
  priority: 80,
  canSkip: true,
  canRepeat: true,
  showProgress: true,
  startStep: 'finance_intro',
  steps: [
    {
      id: 'finance_intro',
      type: 'modal',
      title: '💰 재무 관리',
      content: `축하합니다! 사용자가 100명을 넘었습니다!

이제 본격적으로 비즈니스 관리에 대해 알아볼까요?

수익과 비용의 균형이 중요합니다.`,
      showOverlay: true,
      next: 'revenue_explain',
    },
    {
      id: 'revenue_explain',
      type: 'tooltip',
      title: '📈 수익 구조',
      content: `VocaVision의 수익원:

• 💎 프리미엄 구독: 월 9,900원 / 년 99,000원
• 🛒 인앱 결제: 추가 콘텐츠 판매
• 🤝 B2B: 학교/기업 단체 라이선스
• 📺 광고: 무료 사용자 대상`,
      position: 'center',
      showOverlay: true,
      next: 'cost_explain',
    },
    {
      id: 'cost_explain',
      type: 'tooltip',
      title: '📉 비용 구조',
      content: `주요 비용 항목:

• 🖥️ 서버: 사용자 수에 따라 증가
• 🔧 도구: 개발/마케팅 도구 비용
• 📢 마케팅: 사용자 획득 비용
• 🤖 AI API: OpenAI 등 API 비용

런웨이(현금이 버틸 수 있는 개월 수)를 항상 확인하세요!`,
      position: 'center',
      showOverlay: true,
      next: 'runway_warning',
    },
    {
      id: 'runway_warning',
      type: 'tooltip',
      title: '⚠️ 런웨이 관리',
      content: `런웨이가 3개월 이하로 떨어지면 위험합니다!

대응 방법:
• 비용 절감
• 수익 증대
• 투자 유치

파산하면 게임 오버입니다!`,
      position: 'center',
      showOverlay: true,
      next: 'business_complete',
    },
    {
      id: 'business_complete',
      type: 'modal',
      title: '✅ 비즈니스 기초 완료',
      content: `재무 관리의 기초를 배웠습니다!

핵심 포인트:
• 수익 > 비용 유지
• 런웨이 3개월 이상 확보
• 지속 가능한 성장 추구`,
      showOverlay: true,
    },
  ],
};

// ============================================
// 개발 튜토리얼
// ============================================

export const developmentTutorial: TutorialSequence = {
  id: 'development_tutorial',
  name: '앱 개발',
  description: '앱 기능 개발과 기술 부채 관리를 배웁니다.',
  category: 'development',
  trigger: 'feature_unlock',
  triggerCondition: {
    type: 'feature',
    value: 'development_menu',
  },
  priority: 70,
  canSkip: true,
  canRepeat: true,
  showProgress: true,
  startStep: 'dev_intro',
  steps: [
    {
      id: 'dev_intro',
      type: 'modal',
      title: '💻 앱 개발',
      content: `개발 메뉴에서 다양한 기능을 개발할 수 있습니다.

• 새 기능 추가
• 버그 수정
• 성능 최적화
• 기술 부채 해결`,
      showOverlay: true,
      next: 'feature_dev',
    },
    {
      id: 'feature_dev',
      type: 'tooltip',
      title: '✨ 기능 개발',
      content: `새 기능을 추가하면:
• 사용자 만족도 증가
• 사용자 유치 효과
• 경쟁력 강화

하지만 개발에는 시간과 에너지가 필요합니다.`,
      position: 'center',
      showOverlay: true,
      next: 'tech_debt',
    },
    {
      id: 'tech_debt',
      type: 'tooltip',
      title: '⚠️ 기술 부채',
      content: `빠르게 개발하면 기술 부채가 쌓입니다.

기술 부채가 높으면:
• 버그 발생률 증가
• 개발 속도 저하
• 서버 안정성 하락

정기적으로 리팩토링하세요!`,
      position: 'center',
      showOverlay: true,
      next: 'dev_complete',
    },
    {
      id: 'dev_complete',
      type: 'modal',
      title: '✅ 개발 기초 완료',
      content: `개발 관리의 기초를 배웠습니다!

균형이 중요합니다:
• 새 기능 vs 안정성
• 속도 vs 품질
• 기능 vs 기술 부채`,
      showOverlay: true,
    },
  ],
};

// ============================================
// 마케팅 튜토리얼
// ============================================

export const marketingTutorial: TutorialSequence = {
  id: 'marketing_tutorial',
  name: '마케팅 전략',
  description: '사용자 획득과 리텐션 전략을 배웁니다.',
  category: 'marketing',
  trigger: 'milestone',
  triggerCondition: {
    type: 'users',
    value: 500,
  },
  priority: 75,
  canSkip: true,
  canRepeat: true,
  showProgress: true,
  startStep: 'marketing_intro',
  steps: [
    {
      id: 'marketing_intro',
      type: 'modal',
      title: '📢 마케팅 전략',
      content: `사용자 500명 달성! 이제 본격적인 성장이 필요합니다.

마케팅은 사용자 획득의 핵심입니다.

효율적인 마케팅으로 빠르게 성장하세요!`,
      showOverlay: true,
      next: 'acquisition',
    },
    {
      id: 'acquisition',
      type: 'tooltip',
      title: '👥 사용자 획득',
      content: `사용자 획득 채널:

• 📱 앱스토어 최적화 (ASO)
• 📺 유료 광고
• 🌐 소셜 미디어
• 📝 콘텐츠 마케팅
• 🗣️ 입소문 (바이럴)

각 채널의 CAC(고객획득비용)를 비교하세요!`,
      position: 'center',
      showOverlay: true,
      next: 'retention',
    },
    {
      id: 'retention',
      type: 'tooltip',
      title: '🔄 리텐션',
      content: `새 사용자를 유치하는 것보다
기존 사용자를 유지하는 것이 5배 저렴합니다!

리텐션 향상 방법:
• 푸시 알림 최적화
• 게이미피케이션
• 개인화된 경험
• 정기적인 콘텐츠 업데이트`,
      position: 'center',
      showOverlay: true,
      next: 'metrics',
    },
    {
      id: 'metrics',
      type: 'tooltip',
      title: '📊 핵심 지표',
      content: `마케팅 핵심 지표:

• DAU/MAU: 활성 사용자
• CAC: 고객 획득 비용
• LTV: 고객 생애 가치
• Churn: 이탈률
• NPS: 순추천지수

LTV > CAC가 되어야 지속 가능합니다!`,
      position: 'center',
      showOverlay: true,
      next: 'marketing_complete',
    },
    {
      id: 'marketing_complete',
      type: 'modal',
      title: '✅ 마케팅 기초 완료',
      content: `마케팅 전략의 기초를 배웠습니다!

기억하세요:
• 획득 + 리텐션 균형
• LTV > CAC 유지
• 데이터 기반 의사결정`,
      showOverlay: true,
    },
  ],
};

// ============================================
// 위기 관리 튜토리얼
// ============================================

export const crisisManagementTutorial: TutorialSequence = {
  id: 'crisis_management',
  name: '위기 관리',
  description: '위기 상황 대처 방법을 배웁니다.',
  category: 'advanced',
  trigger: 'context',
  triggerCondition: {
    type: 'event',
    value: 'crisis_event',
  },
  priority: 90,
  canSkip: false,
  canRepeat: false,
  showProgress: false,
  startStep: 'crisis_intro',
  steps: [
    {
      id: 'crisis_intro',
      type: 'modal',
      title: '⚠️ 위기 상황!',
      content: `위기가 발생했습니다!

침착하게 대응하세요.
위기는 기회가 될 수도 있습니다.

현명한 선택으로 위기를 극복하세요!`,
      showOverlay: true,
      next: 'crisis_tips',
    },
    {
      id: 'crisis_tips',
      type: 'tooltip',
      title: '💡 위기 대처 팁',
      content: `위기 대처 요령:

1. 현재 상황 파악
2. 선택지별 결과 예측
3. 장기적 영향 고려
4. 리소스 확인 후 결정

때로는 비용이 들더라도
평판을 지키는 것이 중요합니다.`,
      position: 'center',
      showOverlay: true,
    },
  ],
};

// ============================================
// 튜토리얼 레지스트리
// ============================================

export const tutorials: TutorialSequence[] = [
  basicTutorial,
  businessTutorial,
  developmentTutorial,
  marketingTutorial,
  crisisManagementTutorial,
];

export const getTutorialById = (id: string): TutorialSequence | undefined => {
  return tutorials.find((t) => t.id === id);
};

export const getTutorialsByCategory = (category: string): TutorialSequence[] => {
  return tutorials.filter((t) => t.category === category);
};

export const getTutorialsByTrigger = (trigger: string): TutorialSequence[] => {
  return tutorials.filter((t) => t.trigger === trigger);
};
