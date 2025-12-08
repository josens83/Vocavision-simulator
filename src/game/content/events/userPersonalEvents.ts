/**
 * Chapter 3: Content & Narrative - User & Personal Events
 * 사용자 관련 이벤트 + 창업자 개인 이벤트 50+ 개
 */

import type { GameState } from '../../types';
import type { ProbabilisticEvent } from '../../systems/eventEngine';

export const USER_EVENTS: ProbabilisticEvent[] = [
  // ============================================
  // 사용자 피드백 이벤트 (12개)
  // ============================================
  {
    id: 'user_five_star_review',
    name: '5점 리뷰!',
    description: '"인생 앱이에요! 매일 단어 공부하는 습관이 생겼어요. 감사합니다!" ⭐⭐⭐⭐⭐',
    icon: '⭐',
    severity: 'good',
    probability: (state) => state.business.users.nps > 50 ? 0.03 : 0.01,
    choices: [
      {
        id: 'thank_reply',
        text: '감사 답글 작성',
        effects: [
          { type: 'reputation', value: 5 },
          { type: 'mental', value: 5 },
        ],
        resultText: '따뜻한 답글을 남겼습니다. 기분이 좋아지네요!',
      },
      {
        id: 'share',
        text: '소셜 미디어에 공유',
        effects: [
          { type: 'reputation', value: 8 },
          { type: 'users', value: 15 },
        ],
        resultText: '좋은 리뷰를 공유했더니 반응이 좋습니다!',
      },
    ],
  },
  {
    id: 'user_feature_confusion',
    name: '기능 혼란 피드백',
    description: '"스트릭 기능이 어디 있는지 모르겠어요. 메뉴가 복잡해요."',
    icon: '😕',
    severity: 'normal',
    probability: (state) => state.business.users.total > 200 ? 0.02 : 0.005,
    choices: [
      {
        id: 'improve_ux',
        text: 'UX 개선 작업 (-25 에너지)',
        effects: [
          { type: 'energy', value: -25 },
          { type: 'reputation', value: 10 },
          { type: 'users', value: 20 },
        ],
        resultText: '네비게이션을 개선하고 가이드 툴팁을 추가했습니다!',
      },
      {
        id: 'add_tutorial',
        text: '튜토리얼 추가 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '신규 사용자용 온보딩 튜토리얼을 만들었습니다.',
      },
      {
        id: 'individual_reply',
        text: '개별 답변으로 안내',
        effects: [
          { type: 'energy', value: -3 },
        ],
        resultText: '친절하게 사용법을 안내해드렸습니다.',
      },
    ],
  },
  {
    id: 'user_bug_report_detail',
    name: '상세한 버그 리포트',
    description: '한 사용자가 재현 단계와 스크린샷까지 포함된 상세한 버그 리포트를 보내왔습니다.',
    icon: '🐛',
    severity: 'normal',
    probability: (state) => (state.business.product.bugs?.length || 0) > 0 ? 0.03 : 0.01,
    choices: [
      {
        id: 'fix_thank',
        text: '즉시 수정 + 감사 표현 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'stability', value: 10 },
          { type: 'reputation', value: 8 },
        ],
        resultText: '빠른 수정! 사용자가 감동받았습니다.',
      },
      {
        id: 'premium_gift',
        text: '1개월 프리미엄 선물 + 수정',
        effects: [
          { type: 'cash', value: -9990 },
          { type: 'stability', value: 10 },
          { type: 'reputation', value: 15 },
        ],
        resultText: '감사의 표시로 프리미엄을 선물했습니다!',
      },
      {
        id: 'acknowledge',
        text: '확인 답변만 보내기',
        effects: [
          { type: 'stability', value: 5 },
        ],
        resultText: '버그를 인지했다고 답변했습니다.',
      },
    ],
  },
  {
    id: 'user_success_story',
    name: '사용자 성공 스토리',
    description: '한 사용자가 VocaVision으로 토익 900점을 달성했다는 후기를 올렸습니다!',
    icon: '🏆',
    severity: 'good',
    probability: (state) => state.business.users.total > 500 ? 0.015 : 0.003,
    choices: [
      {
        id: 'feature_story',
        text: '성공 스토리로 소개 요청',
        effects: [
          { type: 'users', value: 80 },
          { type: 'premium_users', value: 5 },
          { type: 'reputation', value: 15 },
        ],
        resultText: '사례 연구로 만들어 마케팅에 활용했습니다!',
      },
      {
        id: 'congratulate',
        text: '축하 + 소셜 공유',
        effects: [
          { type: 'users', value: 50 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '진심으로 축하했더니 많은 공유가 일어났습니다!',
      },
      {
        id: 'gift',
        text: '축하 선물 (굿즈 발송)',
        effects: [
          { type: 'cash', value: -30000 },
          { type: 'reputation', value: 20 },
          { type: 'users', value: 100 },
        ],
        resultText: '감동받은 사용자가 언박싱 영상까지 올렸습니다!',
      },
    ],
  },
  {
    id: 'user_streak_milestone',
    name: '사용자 스트릭 이정표',
    description: '한 사용자가 365일 연속 학습 스트릭을 달성했습니다!',
    icon: '🔥',
    severity: 'good',
    probability: (state) => state.time.totalDays > 365 && state.business.users.total > 100 ? 0.02 : 0,
    minDay: 365,
    choices: [
      {
        id: 'celebrate',
        text: '공식 축하 + 배지 수여',
        effects: [
          { type: 'reputation', value: 15 },
          { type: 'users', value: 30 },
        ],
        resultText: '특별 배지와 함께 축하했습니다! 입소문이 났어요.',
      },
      {
        id: 'lifetime_premium',
        text: '평생 프리미엄 선물',
        effects: [
          { type: 'reputation', value: 30 },
          { type: 'users', value: 100 },
        ],
        resultText: '헌신적인 사용자에게 최고의 보답! 화제가 되었습니다!',
      },
    ],
  },
  {
    id: 'user_churn_feedback',
    name: '이탈 사용자 피드백',
    description: '프리미엄을 해지한 사용자에게 피드백을 요청했더니 응답이 왔습니다.',
    icon: '📝',
    severity: 'normal',
    probability: (state) => state.business.users.churnRate > 0.05 ? 0.03 : 0.01,
    choices: [
      {
        id: 'address_issue',
        text: '지적한 문제 해결 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'stability', value: 10 },
          { type: 'skill_business', value: 2 },
        ],
        resultText: '피드백을 반영하여 개선했습니다!',
      },
      {
        id: 'discount_offer',
        text: '재가입 할인 제안',
        effects: [
          { type: 'premium_users', value: 1 },
          { type: 'cash', value: -5000 },
        ],
        resultText: '50% 할인 제안에 사용자가 돌아왔습니다!',
        probability: 0.4,
      },
      {
        id: 'thank_feedback',
        text: '피드백에 감사 인사',
        effects: [
          { type: 'skill_business', value: 1 },
        ],
        resultText: '소중한 인사이트를 기록해두었습니다.',
      },
    ],
  },
  {
    id: 'user_comparison_post',
    name: '비교 리뷰 포스트',
    description: '블로거가 VocaVision과 경쟁 앱을 비교하는 포스트를 올렸습니다.',
    icon: '⚖️',
    severity: 'normal',
    probability: (state) => state.business.users.total > 1000 ? 0.015 : 0.003,
    choices: [
      {
        id: 'engage_positive',
        text: '긍정적 부분 강조하며 공유',
        effects: [
          { type: 'reputation', value: 10 },
          { type: 'users', value: 50 },
        ],
        resultText: '객관적인 비교에서 우위를 보였습니다!',
      },
      {
        id: 'address_negative',
        text: '지적된 단점 개선 계획 공유',
        effects: [
          { type: 'reputation', value: 15 },
          { type: 'users', value: 30 },
        ],
        resultText: '투명한 대응에 신뢰가 높아졌습니다.',
      },
      {
        id: 'ignore',
        text: '무대응',
        effects: [],
        resultText: '때로는 침묵이 금입니다.',
      },
    ],
  },

  // ============================================
  // 커뮤니티 이벤트 (8개)
  // ============================================
  {
    id: 'user_discord_growth',
    name: '디스코드 커뮤니티 성장',
    description: 'VocaVision 사용자 디스코드가 1000명을 돌파했습니다!',
    icon: '💬',
    severity: 'good',
    probability: (state) => state.business.users.total > 2000 ? 0.01 : 0,
    minDay: 90,
    choices: [
      {
        id: 'community_event',
        text: '커뮤니티 이벤트 개최 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'reputation', value: 15 },
          { type: 'users', value: 100 },
        ],
        resultText: '단어 암기 챌린지로 활발한 참여가 일어났습니다!',
      },
      {
        id: 'moderator',
        text: '열성 유저를 모더레이터로 임명',
        effects: [
          { type: 'reputation', value: 10 },
          { type: 'stress', value: -10 },
        ],
        resultText: '커뮤니티 관리가 한결 수월해졌습니다.',
      },
    ],
  },
  {
    id: 'user_reddit_mention',
    name: '레딧 언급',
    description: 'r/languagelearning에서 VocaVision을 추천하는 글이 올라왔습니다!',
    icon: '📢',
    severity: 'good',
    probability: (state) => state.player.social.reputation > 50 ? 0.015 : 0.005,
    choices: [
      {
        id: 'engage',
        text: '스레드에 참여하여 답변',
        effects: [
          { type: 'users', value: 100 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '개발자가 직접 답변하니 반응이 좋습니다!',
      },
      {
        id: 'ama',
        text: 'AMA 제안',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'users', value: 200 },
          { type: 'reputation', value: 20 },
        ],
        resultText: '개발 비하인드 스토리에 많은 관심이 쏟아졌습니다!',
      },
      {
        id: 'observe',
        text: '지켜본다',
        effects: [
          { type: 'users', value: 30 },
        ],
        resultText: '자연스러운 유입이 있었습니다.',
      },
    ],
  },
  {
    id: 'user_tiktok_viral',
    name: 'TikTok 바이럴',
    description: '한 학생이 VocaVision으로 공부하는 영상이 10만 조회를 넘었습니다!',
    icon: '📱',
    severity: 'good',
    probability: (state) => state.business.users.nps > 40 ? 0.01 : 0.003,
    choices: [
      {
        id: 'duet',
        text: '공식 계정으로 듀엣/스티치',
        effects: [
          { type: 'users', value: 500 },
          { type: 'reputation', value: 20 },
        ],
        resultText: '젊은 층에게 인지도가 크게 올랐습니다!',
      },
      {
        id: 'collab',
        text: '창작자에게 협업 제안',
        effects: [
          { type: 'cash', value: -100000 },
          { type: 'users', value: 800 },
          { type: 'reputation', value: 25 },
        ],
        resultText: '시리즈 영상 제작으로 지속적인 노출!',
      },
      {
        id: 'thanks',
        text: '댓글로 감사 표시',
        effects: [
          { type: 'users', value: 200 },
        ],
        resultText: '작은 감사 표시가 따뜻하게 전달되었습니다.',
      },
    ],
  },
  {
    id: 'user_study_group',
    name: '자발적 스터디 그룹',
    description: '사용자들이 자발적으로 VocaVision 스터디 그룹을 만들었습니다!',
    icon: '👥',
    severity: 'good',
    probability: (state) => state.business.users.total > 500 ? 0.015 : 0.003,
    choices: [
      {
        id: 'support',
        text: '공식 지원 (교재, 굿즈)',
        effects: [
          { type: 'cash', value: -100000 },
          { type: 'reputation', value: 20 },
          { type: 'users', value: 50 },
        ],
        resultText: '커뮤니티가 더욱 활성화되었습니다!',
      },
      {
        id: 'feature',
        text: '그룹 학습 기능 개발 (-40 에너지)',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'users', value: 100 },
          { type: 'premium_users', value: 10 },
        ],
        resultText: '앱 내 스터디 그룹 기능을 추가했습니다!',
      },
      {
        id: 'encourage',
        text: '격려 메시지만 전달',
        effects: [
          { type: 'reputation', value: 5 },
        ],
        resultText: '응원의 메시지를 보냈습니다.',
      },
    ],
  },

  // ============================================
  // 사용자 문제 이벤트 (5개)
  // ============================================
  {
    id: 'user_angry_email',
    name: '분노의 이메일',
    description: '"결제가 됐는데 프리미엄이 안 풀려요!!! 당장 해결하세요!!!"',
    icon: '😤',
    severity: 'warning',
    probability: (state) => state.business.users.premium > 30 ? 0.02 : 0.01,
    choices: [
      {
        id: 'immediate_fix',
        text: '즉시 확인 + 수동 활성화 (-10 에너지)',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'reputation', value: 5 },
        ],
        resultText: 'Stripe 웹훅 지연이 원인. 수동으로 해결했습니다!',
      },
      {
        id: 'refund_upgrade',
        text: '환불 + 1개월 무료 제공',
        effects: [
          { type: 'cash', value: -9990 },
          { type: 'reputation', value: 10 },
        ],
        resultText: '불편 보상으로 충성 고객이 되었습니다!',
      },
      {
        id: 'calm_reply',
        text: '침착하게 상황 설명',
        effects: [
          { type: 'reputation', value: -5 },
        ],
        resultText: '해명은 했지만 사용자가 아직 불만족합니다.',
        probability: 0.6,
      },
    ],
  },
  {
    id: 'user_data_request',
    name: 'GDPR 데이터 요청',
    description: '유럽 사용자가 자신의 데이터 전체를 요청했습니다.',
    icon: '📊',
    severity: 'normal',
    probability: (state) => state.business.users.total > 1000 ? 0.01 : 0.003,
    choices: [
      {
        id: 'export_tool',
        text: '데이터 내보내기 기능 구현 (-30 에너지)',
        effects: [
          { type: 'energy', value: -30 },
          { type: 'reputation', value: 15 },
          { type: 'stability', value: 10 },
        ],
        resultText: '자동 데이터 내보내기 기능을 추가했습니다!',
      },
      {
        id: 'manual_export',
        text: '수동으로 데이터 추출 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
        ],
        resultText: '일일이 추출해서 보내드렸습니다.',
      },
    ],
  },
  {
    id: 'user_account_hack',
    name: '계정 해킹 신고',
    description: '사용자가 자신의 계정이 해킹당한 것 같다고 신고했습니다.',
    icon: '🔓',
    severity: 'critical',
    probability: (state) => state.business.users.total > 500 ? 0.01 : 0.003,
    choices: [
      {
        id: 'security_audit',
        text: '보안 점검 + 비밀번호 리셋 강제 (-25 에너지)',
        effects: [
          { type: 'energy', value: -25 },
          { type: 'stability', value: 15 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '계정을 복구하고 보안을 강화했습니다.',
      },
      {
        id: 'mfa_implement',
        text: '2FA 의무화 (-40 에너지)',
        effects: [
          { type: 'energy', value: -40 },
          { type: 'stability', value: 25 },
          { type: 'reputation', value: 15 },
        ],
        resultText: '전체 사용자에게 2FA를 적용했습니다!',
      },
      {
        id: 'investigate',
        text: '피싱 여부 조사',
        effects: [
          { type: 'energy', value: -10 },
        ],
        resultText: '조사 결과 피싱 사이트에 당한 것으로 확인.',
      },
    ],
  },
];

export const PERSONAL_EVENTS: ProbabilisticEvent[] = [
  // ============================================
  // 건강/웰빙 이벤트 (10개)
  // ============================================
  {
    id: 'personal_sleep_deprivation',
    name: '수면 부족',
    description: '최근 3일간 평균 4시간밖에 못 잤습니다. 눈이 침침합니다.',
    icon: '😴',
    severity: 'warning',
    probability: (state) => state.player.health.energy < 30 ? 0.1 : 0.02,
    choices: [
      {
        id: 'early_sleep',
        text: '오늘은 일찍 잔다',
        effects: [
          { type: 'energy', value: 30 },
          { type: 'mental', value: 10 },
        ],
        resultText: '8시간 숙면! 컨디션이 많이 좋아졌습니다.',
      },
      {
        id: 'power_nap',
        text: '파워 냅 20분',
        effects: [
          { type: 'energy', value: 10 },
        ],
        resultText: '짧은 낮잠으로 버팁니다.',
      },
      {
        id: 'caffeine',
        text: '커피로 버틴다',
        effects: [
          { type: 'energy', value: 5 },
          { type: 'stress', value: 10 },
          { type: 'health', value: -5 },
        ],
        resultText: '일단은 버티지만 건강이 걱정됩니다...',
      },
    ],
  },
  {
    id: 'personal_back_pain',
    name: '허리 통증',
    description: '장시간 앉아서 일하다 보니 허리가 뻐근합니다.',
    icon: '🪑',
    severity: 'warning',
    probability: (state) => state.player.health.physical < 50 ? 0.05 : 0.01,
    choices: [
      {
        id: 'standing_desk',
        text: '스탠딩 데스크 구매 (-300,000원)',
        effects: [
          { type: 'cash', value: -300000 },
          { type: 'health', value: 15 },
        ],
        resultText: '자세가 좋아지고 건강이 개선되었습니다!',
      },
      {
        id: 'stretch_routine',
        text: '스트레칭 루틴 시작',
        effects: [
          { type: 'health', value: 10 },
          { type: 'energy', value: 5 },
        ],
        resultText: '매시간 스트레칭하니 한결 낫습니다.',
      },
      {
        id: 'ignore',
        text: '무시하고 일한다',
        effects: [
          { type: 'health', value: -10 },
          { type: 'stress', value: 5 },
        ],
        resultText: '증상이 점점 악화되고 있습니다...',
      },
    ],
  },
  {
    id: 'personal_anxiety_attack',
    name: '불안 발작',
    description: '갑자기 가슴이 답답하고 불안감이 밀려옵니다. 아무것도 손에 안 잡힙니다.',
    icon: '💔',
    severity: 'critical',
    probability: (state) => state.player.health.stress > 70 && state.player.health.mental < 40 ? 0.1 : 0.01,
    choices: [
      {
        id: 'professional_help',
        text: '전문 상담 예약 (-100,000원)',
        effects: [
          { type: 'cash', value: -100000 },
          { type: 'mental', value: 30 },
          { type: 'stress', value: -30 },
        ],
        resultText: '전문가와 상담 후 한결 마음이 편해졌습니다.',
      },
      {
        id: 'call_friend',
        text: '친한 친구에게 전화',
        effects: [
          { type: 'mental', value: 15 },
          { type: 'stress', value: -15 },
        ],
        resultText: '이야기를 나누니 마음이 진정되었습니다.',
      },
      {
        id: 'breathing',
        text: '호흡 명상',
        effects: [
          { type: 'stress', value: -10 },
          { type: 'mental', value: 5 },
        ],
        resultText: '깊은 호흡으로 진정했습니다.',
      },
    ],
  },
  {
    id: 'personal_flu',
    name: '감기 기운',
    description: '콧물이 나고 목이 따끔거립니다. 감기가 오려나 봅니다.',
    icon: '🤧',
    severity: 'warning',
    probability: () => 0.02,
    choices: [
      {
        id: 'rest_day',
        text: '하루 푹 쉰다',
        effects: [
          { type: 'energy', value: 20 },
          { type: 'health', value: 10 },
        ],
        resultText: '초기에 쉬니 빨리 나았습니다!',
      },
      {
        id: 'medicine',
        text: '약 먹고 일한다',
        effects: [
          { type: 'cash', value: -15000 },
          { type: 'energy', value: -10 },
          { type: 'stability', value: -5 },
        ],
        resultText: '몸이 안 좋으니 집중이 안 됩니다...',
      },
      {
        id: 'push_through',
        text: '무시하고 일한다',
        effects: [
          { type: 'health', value: -15 },
          { type: 'energy', value: -20 },
        ],
        resultText: '감기가 심해져서 결국 3일을 앓았습니다.',
        probability: 0.7,
      },
    ],
  },
  {
    id: 'personal_good_routine',
    name: '좋은 루틴 형성',
    description: '최근 규칙적인 생활로 컨디션이 좋아지는 걸 느낍니다.',
    icon: '✨',
    severity: 'good',
    probability: (state) => state.player.health.physical > 60 && state.player.health.mental > 60 ? 0.03 : 0,
    choices: [
      {
        id: 'maintain',
        text: '계속 유지한다',
        effects: [
          { type: 'health', value: 10 },
          { type: 'mental', value: 10 },
          { type: 'energy', value: 10 },
        ],
        resultText: '좋은 습관이 자리잡았습니다!',
      },
      {
        id: 'enhance',
        text: '운동을 추가한다',
        effects: [
          { type: 'health', value: 20 },
          { type: 'energy', value: -5 },
        ],
        resultText: '주 3회 운동으로 체력이 더 좋아졌습니다!',
      },
    ],
  },

  // ============================================
  // 관계/소셜 이벤트 (8개)
  // ============================================
  {
    id: 'personal_family_concern',
    name: '가족의 걱정',
    description: '"스타트업 그만두고 취직하는 게 어때?" 가족이 걱정합니다.',
    icon: '👨‍👩‍👧',
    severity: 'normal',
    probability: (state) => state.business.finance.runway < 6 ? 0.03 : 0.01,
    choices: [
      {
        id: 'explain',
        text: '현재 상황과 비전을 설명',
        effects: [
          { type: 'mental', value: 5 },
          { type: 'energy', value: -5 },
        ],
        resultText: '완전히 이해하진 못하지만 응원해주셨습니다.',
      },
      {
        id: 'show_metrics',
        text: '성과 지표를 보여준다',
        effects: [
          { type: 'mental', value: 10 },
        ],
        resultText: '숫자로 보여주니 좀 안심하셨습니다.',
      },
      {
        id: 'distance',
        text: '일단 회피...',
        effects: [
          { type: 'stress', value: 10 },
          { type: 'mental', value: -5 },
        ],
        resultText: '대화를 피했지만 마음이 무겁습니다.',
      },
    ],
  },
  {
    id: 'personal_friend_reunion',
    name: '친구 모임',
    description: '오랜만에 대학 친구들이 모이자고 합니다.',
    icon: '🍻',
    severity: 'normal',
    probability: () => 0.02,
    choices: [
      {
        id: 'go',
        text: '참석한다 (-5 에너지)',
        effects: [
          { type: 'energy', value: -5 },
          { type: 'mental', value: 15 },
          { type: 'stress', value: -10 },
        ],
        resultText: '오랜만에 웃고 떠들어 스트레스가 풀렸습니다!',
      },
      {
        id: 'skip',
        text: '바쁘다고 거절',
        effects: [
          { type: 'mental', value: -5 },
        ],
        resultText: '사회적 관계가 점점 줄어드는 느낌입니다...',
      },
      {
        id: 'short',
        text: '잠깐만 얼굴 비친다',
        effects: [
          { type: 'energy', value: -2 },
          { type: 'mental', value: 5 },
        ],
        resultText: '짧게라도 만나니 기분이 좋습니다.',
      },
    ],
  },
  {
    id: 'personal_dating',
    name: '연애의 기회',
    description: '스타트업 네트워킹에서 만난 사람과 호감이 생겼습니다.',
    icon: '💕',
    severity: 'good',
    probability: (state) => state.player.social.reputation > 40 ? 0.01 : 0.003,
    choices: [
      {
        id: 'pursue',
        text: '데이트 신청 (-10 에너지)',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'mental', value: 20 },
          { type: 'stress', value: -15 },
        ],
        resultText: '좋은 시간을 보냈습니다! 삶의 질이 올라간 느낌.',
        probability: 0.7,
      },
      {
        id: 'focus_work',
        text: '지금은 일에 집중...',
        effects: [
          { type: 'mental', value: -5 },
        ],
        resultText: '기회를 놓쳤지만 사업에 집중합니다.',
      },
    ],
  },
  {
    id: 'personal_mentor_contact',
    name: '멘토의 연락',
    description: '예전에 만났던 시니어 개발자가 "요즘 어떻게 지내?" 연락이 왔습니다.',
    icon: '🧓',
    severity: 'good',
    probability: () => 0.01,
    choices: [
      {
        id: 'meet',
        text: '식사 약속을 잡는다 (-5 에너지)',
        effects: [
          { type: 'energy', value: -5 },
          { type: 'skill_business', value: 3 },
          { type: 'skill_coding', value: 2 },
          { type: 'mental', value: 10 },
        ],
        resultText: '귀한 조언을 많이 들었습니다!',
      },
      {
        id: 'call',
        text: '전화로 안부만',
        effects: [
          { type: 'mental', value: 5 },
          { type: 'skill_business', value: 1 },
        ],
        resultText: '짧지만 의미있는 대화였습니다.',
      },
    ],
  },
  {
    id: 'personal_coworking',
    name: '코워킹 스페이스 초대',
    description: '친구가 운영하는 코워킹 스페이스에서 1주일 무료 이용권을 줬습니다.',
    icon: '🏢',
    severity: 'good',
    probability: () => 0.01,
    choices: [
      {
        id: 'use',
        text: '사용해본다',
        effects: [
          { type: 'energy', value: 5 },
          { type: 'mental', value: 10 },
          { type: 'skill_business', value: 1 },
        ],
        resultText: '새로운 환경에서 집중이 잘 됩니다!',
      },
      {
        id: 'home',
        text: '재택이 편해서 패스',
        effects: [],
        resultText: '익숙한 환경이 최고입니다.',
      },
    ],
  },

  // ============================================
  // 학습/성장 이벤트 (7개)
  // ============================================
  {
    id: 'personal_conference',
    name: '개발자 컨퍼런스',
    description: 'FEConf가 다가옵니다. 참가할까요?',
    icon: '🎤',
    severity: 'normal',
    probability: () => 0.01,
    choices: [
      {
        id: 'attend',
        text: '참가한다 (-50,000원, -8시간)',
        effects: [
          { type: 'cash', value: -50000 },
          { type: 'energy', value: -15 },
          { type: 'skill_coding', value: 5 },
          { type: 'reputation', value: 5 },
        ],
        resultText: '새로운 기술 트렌드를 배우고 네트워킹했습니다!',
      },
      {
        id: 'online',
        text: '온라인 스트리밍으로 시청',
        effects: [
          { type: 'skill_coding', value: 2 },
        ],
        resultText: '집에서 편하게 봤지만 네트워킹은 아쉽습니다.',
      },
      {
        id: 'skip',
        text: '이번엔 패스',
        effects: [],
        resultText: '다음 기회에...',
      },
    ],
  },
  {
    id: 'personal_online_course',
    name: '온라인 강의 발견',
    description: 'Y Combinator Startup School이 무료로 열립니다!',
    icon: '📚',
    severity: 'good',
    probability: () => 0.015,
    choices: [
      {
        id: 'enroll',
        text: '등록하고 수강 (-20 에너지, 2주)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'skill_business', value: 8 },
        ],
        resultText: '실리콘밸리 인사이트를 많이 얻었습니다!',
      },
      {
        id: 'later',
        text: '북마크만 해둔다',
        effects: [],
        resultText: '언젠가 볼 것들이 또 쌓입니다...',
      },
    ],
  },
  {
    id: 'personal_book_insight',
    name: '책에서 인사이트',
    description: '"린 스타트업"을 읽다가 VocaVision에 적용할 아이디어가 떠올랐습니다!',
    icon: '💡',
    severity: 'good',
    probability: () => 0.015,
    choices: [
      {
        id: 'apply',
        text: '바로 적용해본다 (-15 에너지)',
        effects: [
          { type: 'energy', value: -15 },
          { type: 'skill_business', value: 3 },
          { type: 'users', value: 30 },
        ],
        resultText: 'MVP 접근법으로 빠르게 기능을 테스트했습니다!',
      },
      {
        id: 'note',
        text: '노트에 적어둔다',
        effects: [
          { type: 'skill_business', value: 1 },
        ],
        resultText: '나중에 참고할 수 있게 기록해두었습니다.',
      },
    ],
  },
  {
    id: 'personal_podcast_inspiration',
    name: '팟캐스트 영감',
    description: '출퇴근 시간에 들은 창업 팟캐스트에서 좋은 전략을 들었습니다.',
    icon: '🎧',
    severity: 'good',
    probability: () => 0.02,
    choices: [
      {
        id: 'implement',
        text: '바로 실행 (-20 에너지)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'users', value: 50 },
          { type: 'skill_marketing', value: 2 },
        ],
        resultText: '콘텐츠 마케팅 전략이 효과가 있습니다!',
      },
      {
        id: 'research',
        text: '더 조사해본다',
        effects: [
          { type: 'skill_business', value: 2 },
        ],
        resultText: '관련 자료를 더 찾아봤습니다.',
      },
    ],
  },

  // ============================================
  // 기타 개인 이벤트 (5개)
  // ============================================
  {
    id: 'personal_imposter',
    name: '임포스터 신드롬',
    description: '"내가 이걸 해도 되나... 더 뛰어난 사람들이 많은데..."',
    icon: '😰',
    severity: 'warning',
    probability: (state) => state.player.health.mental < 50 ? 0.05 : 0.01,
    choices: [
      {
        id: 'review_progress',
        text: '지금까지 한 것들을 돌아본다',
        effects: [
          { type: 'mental', value: 15 },
        ],
        resultText: '생각보다 많은 것을 이뤘네요. 자신감 회복!',
      },
      {
        id: 'talk',
        text: '동료 창업가에게 털어놓는다',
        effects: [
          { type: 'mental', value: 20 },
          { type: 'stress', value: -10 },
        ],
        resultText: '다들 비슷하게 느낀다는 걸 알게 됐습니다.',
      },
      {
        id: 'push',
        text: '그래도 묵묵히 한다',
        effects: [
          { type: 'stress', value: 10 },
        ],
        resultText: '마음은 무겁지만 계속 전진합니다.',
      },
    ],
  },
  {
    id: 'personal_flow_state',
    name: '몰입 상태',
    description: '오늘따라 코드가 술술 써집니다. 완전 집중!',
    icon: '🌊',
    severity: 'good',
    probability: (state) => state.player.health.energy > 60 && state.player.health.mental > 60 ? 0.05 : 0.01,
    choices: [
      {
        id: 'ride_wave',
        text: '흐름을 탄다 (-20 에너지, 큰 성과)',
        effects: [
          { type: 'energy', value: -20 },
          { type: 'stability', value: 20 },
          { type: 'skill_coding', value: 3 },
        ],
        resultText: '3일 치 작업을 하루에 끝냈습니다!',
      },
      {
        id: 'pace',
        text: '페이스 조절',
        effects: [
          { type: 'stability', value: 10 },
          { type: 'skill_coding', value: 1 },
        ],
        resultText: '적당히 하고 내일을 위해 아껴둡니다.',
      },
    ],
  },
  {
    id: 'personal_side_project',
    name: '사이드 프로젝트 유혹',
    description: '재미있어 보이는 새 프로젝트 아이디어가 떠올랐습니다.',
    icon: '🎯',
    severity: 'normal',
    probability: () => 0.015,
    choices: [
      {
        id: 'focus',
        text: 'VocaVision에 집중 유지',
        effects: [
          { type: 'mental', value: -5 },
        ],
        resultText: '유혹을 이겼습니다. 본업에 집중!',
      },
      {
        id: 'weekend',
        text: '주말에만 살짝 해본다',
        effects: [
          { type: 'energy', value: -10 },
          { type: 'skill_coding', value: 3 },
          { type: 'mental', value: 10 },
        ],
        resultText: '새로운 것을 배우니 재미있네요!',
      },
      {
        id: 'pivot',
        text: '이게 더 좋은데...',
        effects: [
          { type: 'stability', value: -20 },
          { type: 'stress', value: 20 },
        ],
        resultText: '위험한 생각... 집중력이 분산됩니다.',
        probability: 0.3,
      },
    ],
  },
  {
    id: 'personal_celebration',
    name: '작은 승리 자축',
    description: '오늘 목표한 것들을 모두 달성했습니다!',
    icon: '🎉',
    severity: 'good',
    probability: (state) => state.player.health.energy > 50 ? 0.02 : 0.005,
    choices: [
      {
        id: 'treat',
        text: '맛있는 거 먹는다 (-30,000원)',
        effects: [
          { type: 'cash', value: -30000 },
          { type: 'mental', value: 15 },
          { type: 'energy', value: 5 },
        ],
        resultText: '자신에게 주는 작은 보상! 행복합니다.',
      },
      {
        id: 'rest',
        text: '일찍 퇴근한다',
        effects: [
          { type: 'energy', value: 15 },
          { type: 'mental', value: 10 },
        ],
        resultText: '여유있는 저녁 시간을 보냈습니다.',
      },
      {
        id: 'continue',
        text: '모멘텀 유지하며 더 한다',
        effects: [
          { type: 'stability', value: 10 },
          { type: 'energy', value: -10 },
        ],
        resultText: '의지로 밀어붙여 더 많은 것을 했습니다!',
      },
    ],
  },
  {
    id: 'personal_equipment_upgrade',
    name: '장비 업그레이드 고민',
    description: 'M3 MacBook Pro가 나왔습니다. 현재 장비가 느려지기 시작했는데...',
    icon: '💻',
    severity: 'normal',
    probability: () => 0.008,
    choices: [
      {
        id: 'buy',
        text: '새 맥북 구매 (-2,500,000원)',
        effects: [
          { type: 'cash', value: -2500000 },
          { type: 'energy', value: 5 },
          { type: 'mental', value: 10 },
        ],
        resultText: '빌드 시간이 절반으로 줄었습니다! 생산성 UP!',
      },
      {
        id: 'upgrade_ram',
        text: '기존 장비 RAM만 증설 (-300,000원)',
        effects: [
          { type: 'cash', value: -300000 },
        ],
        resultText: '조금 나아졌지만 근본적인 해결은 아닙니다.',
      },
      {
        id: 'wait',
        text: '좀 더 버틴다',
        effects: [
          { type: 'stress', value: 5 },
        ],
        resultText: '아직은 견딜 만합니다.',
      },
    ],
  },
];

export default [...USER_EVENTS, ...PERSONAL_EVENTS];
