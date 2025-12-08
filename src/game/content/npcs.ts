/**
 * Chapter 3: Content & Narrative - NPC System
 * 10명의 반복 등장 캐릭터와 관계 시스템
 */

import type { GameState, Effect } from '../types';

// ============================================
// NPC 타입 정의
// ============================================

export interface NPC {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  personality: PersonalityTraits;
  initialRelationship: number; // -100 ~ 100
  unlockCondition?: (state: GameState) => boolean;
  interactions: NPCInteraction[];
  storyArc?: string[]; // 관련 스토리 아크 ID들
}

export interface PersonalityTraits {
  helpfulness: number; // 도움을 주려는 성향 0-100
  reliability: number; // 신뢰성 0-100
  expertise: string[]; // 전문 분야
  quirks: string[]; // 특이점/개성
}

export interface NPCInteraction {
  id: string;
  title: string;
  description: string;
  type: 'advice' | 'help' | 'conflict' | 'opportunity' | 'random';
  minRelationship?: number; // 최소 관계 점수
  probability: number;
  cooldown: number; // 재등장까지 일 수
  choices: NPCChoice[];
}

export interface NPCChoice {
  id: string;
  text: string;
  relationshipChange: number;
  effects: Effect[];
  resultText: string;
  probability?: number;
}

// ============================================
// NPC 데이터 (10명)
// ============================================

export const NPCS: NPC[] = [
  // 1. 멘토 캐릭터
  {
    id: 'npc_mentor_kim',
    name: '김진우',
    role: '시니어 개발자 / 전 CTO',
    description: '10년차 개발자. 스타트업 CTO 경험이 있으며 후배 양성에 관심이 많습니다.',
    avatar: '👨‍💻',
    personality: {
      helpfulness: 90,
      reliability: 85,
      expertise: ['architecture', 'scaling', 'team_building'],
      quirks: ['커피를 하루 5잔 마심', '새벽에 답장을 잘 함'],
    },
    initialRelationship: 40,
    interactions: [
      {
        id: 'mentor_code_review',
        title: '코드 리뷰 제안',
        description: '김진우님이 코드를 봐주겠다고 합니다.',
        type: 'help',
        minRelationship: 30,
        probability: 0.05,
        cooldown: 14,
        choices: [
          {
            id: 'accept_review',
            text: '코드 리뷰 부탁드립니다',
            relationshipChange: 5,
            effects: [
              { type: 'stability', value: 15 },
              { type: 'skill_coding', value: 3 },
              { type: 'technical_debt', value: -10 },
            ],
            resultText: '날카로운 피드백으로 많은 개선점을 발견했습니다!',
          },
          {
            id: 'not_now',
            text: '지금은 바빠서...',
            relationshipChange: -3,
            effects: [],
            resultText: '김진우님이 살짝 아쉬워하는 것 같습니다.',
          },
        ],
      },
      {
        id: 'mentor_architecture',
        title: '아키텍처 조언',
        description: '"확장성 이슈가 있어 보이네요. 한번 이야기해볼까요?"',
        type: 'advice',
        minRelationship: 50,
        probability: 0.04,
        cooldown: 21,
        choices: [
          {
            id: 'discuss',
            text: '조언 부탁드립니다 (-10 에너지)',
            relationshipChange: 8,
            effects: [
              { type: 'energy', value: -10 },
              { type: 'skill_coding', value: 5 },
              { type: 'stability', value: 20 },
            ],
            resultText: '2시간의 깊은 대화로 많은 인사이트를 얻었습니다!',
          },
          {
            id: 'later',
            text: '다음에 연락드릴게요',
            relationshipChange: -2,
            effects: [],
            resultText: '기회를 미뤘습니다.',
          },
        ],
      },
      {
        id: 'mentor_introduction',
        title: '투자자 소개',
        description: '김진우님이 아는 투자자를 소개해주겠다고 합니다.',
        type: 'opportunity',
        minRelationship: 70,
        probability: 0.02,
        cooldown: 60,
        choices: [
          {
            id: 'meet_investor',
            text: '감사합니다! 미팅 잡아주세요',
            relationshipChange: 10,
            effects: [
              { type: 'skill_business', value: 3 },
              { type: 'reputation', value: 15 },
            ],
            resultText: '투자자와 좋은 첫 미팅을 가졌습니다!',
          },
          {
            id: 'not_ready',
            text: '아직 준비가 안 된 것 같아요',
            relationshipChange: -5,
            effects: [],
            resultText: '김진우님이 아쉬워합니다. 좋은 기회였는데...',
          },
        ],
      },
    ],
    storyArc: ['first_hire', 'scaling_crisis'],
  },

  // 2. 라이벌 캐릭터
  {
    id: 'npc_rival_park',
    name: '박서연',
    role: 'AI 영어학습 스타트업 대표',
    description: '비슷한 시기에 시작한 경쟁사 대표. 야심차고 공격적인 마케팅으로 유명합니다.',
    avatar: '👩‍💼',
    personality: {
      helpfulness: 20,
      reliability: 40,
      expertise: ['marketing', 'fundraising', 'growth_hacking'],
      quirks: ['SNS를 자주 함', '경쟁심이 강함'],
    },
    initialRelationship: 0,
    interactions: [
      {
        id: 'rival_conference',
        title: '컨퍼런스에서 조우',
        description: '박서연 대표가 컨퍼런스에서 인사를 건넵니다. "VocaVision 잘 되고 있어요?"',
        type: 'random',
        probability: 0.03,
        cooldown: 30,
        choices: [
          {
            id: 'friendly',
            text: '네, 덕분에요. 그쪽도요?',
            relationshipChange: 10,
            effects: [
              { type: 'mental', value: -5 },
            ],
            resultText: '가벼운 인사를 나눴습니다. 묘한 긴장감이 있네요.',
          },
          {
            id: 'competitive',
            text: '네, 곧 새 기능 출시해요 (자랑)',
            relationshipChange: -5,
            effects: [
              { type: 'reputation', value: 3 },
            ],
            resultText: '경쟁심을 자극한 것 같습니다.',
          },
          {
            id: 'avoid',
            text: '(피한다)',
            relationshipChange: -3,
            effects: [],
            resultText: '어색하게 피했습니다...',
          },
        ],
      },
      {
        id: 'rival_poach',
        title: '협력 제안 (의심)',
        description: '"같이 협력하면 어떨까요?" 박서연 대표가 협업을 제안합니다.',
        type: 'opportunity',
        minRelationship: 20,
        probability: 0.02,
        cooldown: 60,
        choices: [
          {
            id: 'accept_collab',
            text: '좋은 생각이네요. 구체적으로 이야기해봐요',
            relationshipChange: 15,
            effects: [
              { type: 'users', value: 100 },
              { type: 'skill_business', value: 2 },
            ],
            resultText: '의외로 윈윈 협업이 되었습니다!',
            probability: 0.6,
          },
          {
            id: 'suspicious',
            text: '무슨 의도가 있으신 건가요?',
            relationshipChange: -10,
            effects: [],
            resultText: '박서연 대표가 불쾌해하며 떠났습니다.',
          },
          {
            id: 'decline',
            text: '지금은 어렵겠네요',
            relationshipChange: -5,
            effects: [],
            resultText: '기회를 놓쳤을 수도, 위험을 피했을 수도 있습니다.',
          },
        ],
      },
      {
        id: 'rival_feature_copy',
        title: '기능 카피 논란',
        description: '박서연 대표의 앱에서 VocaVision과 매우 유사한 기능이 출시되었습니다.',
        type: 'conflict',
        probability: 0.015,
        cooldown: 90,
        choices: [
          {
            id: 'public_call',
            text: '공개적으로 문제 제기',
            relationshipChange: -30,
            effects: [
              { type: 'reputation', value: 10 },
              { type: 'users', value: 50 },
              { type: 'stress', value: 20 },
            ],
            resultText: '커뮤니티가 당신 편을 들어줬습니다!',
            probability: 0.7,
          },
          {
            id: 'private',
            text: '개인적으로 연락',
            relationshipChange: -10,
            effects: [
              { type: 'stress', value: 10 },
            ],
            resultText: '"영감을 받았다"고 답변했습니다. 불만족스럽네요.',
          },
          {
            id: 'innovate',
            text: '더 혁신적인 것으로 응수 (-30 에너지)',
            relationshipChange: 0,
            effects: [
              { type: 'energy', value: -30 },
              { type: 'reputation', value: 20 },
              { type: 'users', value: 100 },
            ],
            resultText: '한 발 더 앞서가는 것으로 대응했습니다!',
          },
        ],
      },
    ],
    storyArc: ['competitor_battle'],
  },

  // 3. 투자자 캐릭터
  {
    id: 'npc_investor_lee',
    name: '이준호',
    role: '엔젤 투자자 / 전 창업가',
    description: '교육 스타트업 엑싯 경험이 있는 투자자. 까다롭지만 진심으로 도와줍니다.',
    avatar: '🧔',
    personality: {
      helpfulness: 60,
      reliability: 90,
      expertise: ['finance', 'edtech', 'exit_strategy'],
      quirks: ['숫자에 예민함', '긴 미팅을 싫어함'],
    },
    initialRelationship: 20,
    unlockCondition: (state) => state.business.users.total > 1000,
    interactions: [
      {
        id: 'investor_feedback',
        title: '피칭 피드백',
        description: '이준호님이 피칭 자료에 대한 피드백을 주겠다고 합니다.',
        type: 'advice',
        minRelationship: 30,
        probability: 0.03,
        cooldown: 21,
        choices: [
          {
            id: 'get_feedback',
            text: '피드백 부탁드립니다',
            relationshipChange: 5,
            effects: [
              { type: 'skill_business', value: 4 },
            ],
            resultText: '"숫자가 부족해요. 트랙션을 더 보여주세요." 날카로운 피드백!',
          },
          {
            id: 'not_ready',
            text: '아직 자료가 완성되지 않았어요',
            relationshipChange: -2,
            effects: [],
            resultText: '다음에 연락하기로 했습니다.',
          },
        ],
      },
      {
        id: 'investor_term',
        title: '투자 조건 협상',
        description: '이준호님이 본격적인 투자 협의를 제안합니다.',
        type: 'opportunity',
        minRelationship: 60,
        probability: 0.02,
        cooldown: 90,
        choices: [
          {
            id: 'negotiate_hard',
            text: '조건 협상을 진행합니다',
            relationshipChange: 10,
            effects: [
              { type: 'cash', value: 100000000 },
              { type: 'skill_business', value: 5 },
              { type: 'stress', value: 20 },
            ],
            resultText: '1억 투자 확정! 본격적인 성장의 발판을 마련했습니다!',
          },
          {
            id: 'delay',
            text: '좀 더 트랙션을 쌓고 싶어요',
            relationshipChange: 0,
            effects: [],
            resultText: '이준호님이 이해한다고 합니다. 나중에 다시 논의하기로.',
          },
        ],
      },
    ],
    storyArc: ['funding_journey'],
  },

  // 4. 첫 사용자 캐릭터
  {
    id: 'npc_power_user',
    name: '최민지',
    role: '대학생 / 헤비 유저',
    description: '초창기부터 사용한 충성 사용자. 버그 리포트와 피드백을 열심히 보내줍니다.',
    avatar: '👩‍🎓',
    personality: {
      helpfulness: 95,
      reliability: 80,
      expertise: ['user_experience', 'testing'],
      quirks: ['이모지를 많이 씀', '새벽에 공부함'],
    },
    initialRelationship: 60,
    interactions: [
      {
        id: 'user_bug_detail',
        title: '상세 버그 리포트',
        description: '최민지님이 재현 단계와 스크린샷이 포함된 버그 리포트를 보냈습니다.',
        type: 'help',
        probability: 0.04,
        cooldown: 7,
        choices: [
          {
            id: 'fix_thank',
            text: '즉시 수정하고 감사 표현',
            relationshipChange: 10,
            effects: [
              { type: 'stability', value: 10 },
              { type: 'reputation', value: 5 },
            ],
            resultText: '최민지님이 감동받았습니다! "역시 최고예요 😍"',
          },
          {
            id: 'just_fix',
            text: '수정만 하고 넘어간다',
            relationshipChange: 0,
            effects: [
              { type: 'stability', value: 10 },
            ],
            resultText: '버그는 수정했습니다.',
          },
        ],
      },
      {
        id: 'user_testimonial',
        title: '사용 후기 제안',
        description: '"제 토익 점수 200점 올랐어요! 후기 써도 될까요?" 최민지님의 메시지입니다.',
        type: 'opportunity',
        minRelationship: 70,
        probability: 0.03,
        cooldown: 60,
        choices: [
          {
            id: 'feature_story',
            text: '공식 스토리로 소개해도 될까요?',
            relationshipChange: 15,
            effects: [
              { type: 'users', value: 100 },
              { type: 'reputation', value: 20 },
              { type: 'premium_users', value: 10 },
            ],
            resultText: '생생한 후기가 마케팅에 큰 도움이 됐습니다!',
          },
          {
            id: 'simple_thanks',
            text: '감사해요! 블로그에 올려주세요',
            relationshipChange: 5,
            effects: [
              { type: 'users', value: 30 },
              { type: 'reputation', value: 5 },
            ],
            resultText: '자연스러운 입소문이 났습니다.',
          },
        ],
      },
      {
        id: 'user_beta_tester',
        title: '베타 테스터 자원',
        description: '"새 기능 먼저 테스트해보고 싶어요!" 최민지님의 열정적인 제안입니다.',
        type: 'help',
        minRelationship: 50,
        probability: 0.03,
        cooldown: 30,
        choices: [
          {
            id: 'accept_beta',
            text: '베타 테스터로 초대합니다!',
            relationshipChange: 10,
            effects: [
              { type: 'stability', value: 15 },
            ],
            resultText: '출시 전 많은 버그를 잡았습니다!',
          },
          {
            id: 'not_yet',
            text: '아직 베타 준비가 안 됐어요',
            relationshipChange: -3,
            effects: [],
            resultText: '최민지님이 살짝 실망한 것 같습니다.',
          },
        ],
      },
    ],
    storyArc: ['community_building'],
  },

  // 5. 프리랜서 디자이너
  {
    id: 'npc_designer_yoon',
    name: '윤하은',
    role: 'UI/UX 디자이너 프리랜서',
    description: '센스있는 디자이너. 종종 저렴하게 도와주지만 일정이 불규칙합니다.',
    avatar: '👩‍🎨',
    personality: {
      helpfulness: 70,
      reliability: 50,
      expertise: ['ui_design', 'ux_research', 'branding'],
      quirks: ['일정 관리가 약함', '영감이 왔을 때 일함'],
    },
    initialRelationship: 30,
    interactions: [
      {
        id: 'designer_offer',
        title: '디자인 도움 제안',
        description: '윤하은님이 "랜딩 페이지 리디자인 필요하면 도와줄게요"라고 합니다.',
        type: 'opportunity',
        minRelationship: 40,
        probability: 0.03,
        cooldown: 30,
        choices: [
          {
            id: 'hire',
            text: '부탁드려요! (-500,000원)',
            relationshipChange: 10,
            effects: [
              { type: 'cash', value: -500000 },
              { type: 'reputation', value: 20 },
              { type: 'users', value: 50 },
            ],
            resultText: '깔끔한 새 디자인! 전환율이 올랐습니다!',
          },
          {
            id: 'diy',
            text: '제가 직접 해볼게요',
            relationshipChange: -2,
            effects: [
              { type: 'energy', value: -20 },
            ],
            resultText: '시간은 들지만 비용은 절약했습니다.',
          },
          {
            id: 'later',
            text: '나중에 연락드릴게요',
            relationshipChange: -3,
            effects: [],
            resultText: '일정이 안 맞으면 다음에.',
          },
        ],
      },
      {
        id: 'designer_portfolio',
        title: '포트폴리오 의뢰',
        description: '"VocaVision 작업을 제 포트폴리오에 넣어도 될까요? 대신 다음 작업은 50% 할인해드릴게요."',
        type: 'opportunity',
        minRelationship: 50,
        probability: 0.02,
        cooldown: 60,
        choices: [
          {
            id: 'agree',
            text: '좋아요, 서로 윈윈이네요',
            relationshipChange: 15,
            effects: [
              { type: 'reputation', value: 5 },
            ],
            resultText: '좋은 관계를 유지했습니다. 나중에 도움이 될 거예요!',
          },
          {
            id: 'nda',
            text: 'NDA 때문에 어려울 것 같아요',
            relationshipChange: -5,
            effects: [],
            resultText: '윤하은님이 이해하지만 아쉬워합니다.',
          },
        ],
      },
    ],
    storyArc: ['design_overhaul'],
  },

  // 6. 개발자 커뮤니티 리더
  {
    id: 'npc_community_han',
    name: '한동현',
    role: '개발자 커뮤니티 운영자',
    description: 'GeekNews 스타일 커뮤니티 운영. 영향력 있는 개발자 네트워크를 가지고 있습니다.',
    avatar: '🧑‍💻',
    personality: {
      helpfulness: 65,
      reliability: 75,
      expertise: ['networking', 'content', 'developer_relations'],
      quirks: ['뉴스에 민감함', '직설적임'],
    },
    initialRelationship: 20,
    interactions: [
      {
        id: 'community_feature',
        title: '커뮤니티 소개 제안',
        description: '한동현님이 "VocaVision 개발 스토리 공유해보실래요?"라고 제안합니다.',
        type: 'opportunity',
        minRelationship: 35,
        probability: 0.025,
        cooldown: 45,
        choices: [
          {
            id: 'write_story',
            text: '개발기 작성해볼게요 (-15 에너지)',
            relationshipChange: 15,
            effects: [
              { type: 'energy', value: -15 },
              { type: 'users', value: 200 },
              { type: 'reputation', value: 25 },
            ],
            resultText: '개발자들의 큰 관심! 기술 블로그가 인기글이 됐습니다!',
          },
          {
            id: 'not_ready',
            text: '아직 공유할 단계가 아닌 것 같아요',
            relationshipChange: -3,
            effects: [],
            resultText: '다음 기회에.',
          },
        ],
      },
      {
        id: 'community_ama',
        title: 'AMA 세션 제안',
        description: '"개발자 Q&A 세션 해보실래요? 꽤 인기 있을 것 같은데."',
        type: 'opportunity',
        minRelationship: 55,
        probability: 0.02,
        cooldown: 90,
        choices: [
          {
            id: 'do_ama',
            text: '좋아요! 준비할게요 (-20 에너지)',
            relationshipChange: 20,
            effects: [
              { type: 'energy', value: -20 },
              { type: 'users', value: 300 },
              { type: 'reputation', value: 30 },
              { type: 'skill_business', value: 3 },
            ],
            resultText: '2시간 AMA로 개발자 커뮤니티에서 인지도가 크게 올랐습니다!',
          },
          {
            id: 'maybe_later',
            text: '지금은 시간이 없네요',
            relationshipChange: -5,
            effects: [],
            resultText: '기회를 미뤘습니다.',
          },
        ],
      },
    ],
    storyArc: ['developer_recognition'],
  },

  // 7. 가족 (엄마)
  {
    id: 'npc_family_mom',
    name: '엄마',
    role: '가족',
    description: '항상 걱정하지만 누구보다 응원해주는 엄마.',
    avatar: '👩‍🦳',
    personality: {
      helpfulness: 100,
      reliability: 100,
      expertise: [],
      quirks: ['카톡으로 뉴스 링크 보냄', '밥 먹었냐고 물어봄'],
    },
    initialRelationship: 80,
    interactions: [
      {
        id: 'mom_worry',
        title: '엄마의 걱정',
        description: '"밥은 잘 먹고 다녀? 많이 힘들지? 취직하면 어떻겠니..."',
        type: 'random',
        probability: 0.04,
        cooldown: 14,
        choices: [
          {
            id: 'reassure',
            text: '괜찮아요, 잘 되고 있어요 (근황 설명)',
            relationshipChange: 10,
            effects: [
              { type: 'mental', value: 10 },
              { type: 'stress', value: -5 },
            ],
            resultText: '엄마가 응원해주셨습니다. "우리 아들/딸 최고야~"',
          },
          {
            id: 'honest',
            text: '솔직하게 힘든 점을 털어놓는다',
            relationshipChange: 15,
            effects: [
              { type: 'mental', value: 20 },
              { type: 'stress', value: -15 },
            ],
            resultText: '엄마의 따뜻한 위로를 받았습니다.',
          },
          {
            id: 'brush_off',
            text: '바빠서 나중에 전화할게요',
            relationshipChange: -5,
            effects: [
              { type: 'stress', value: 5 },
            ],
            resultText: '엄마가 서운해하시는 것 같습니다...',
          },
        ],
      },
      {
        id: 'mom_support',
        title: '엄마의 지원',
        description: '"용돈이야, 밥 잘 챙겨먹어." 엄마가 생활비를 보내주셨습니다.',
        type: 'help',
        minRelationship: 70,
        probability: 0.02,
        cooldown: 60,
        choices: [
          {
            id: 'accept_grateful',
            text: '감사히 받겠습니다',
            relationshipChange: 5,
            effects: [
              { type: 'cash', value: 300000 },
              { type: 'mental', value: 15 },
            ],
            resultText: '감사한 마음으로 더 열심히 하겠다고 다짐합니다.',
          },
          {
            id: 'refuse',
            text: '괜찮아요, 저 잘 벌고 있어요',
            relationshipChange: -3,
            effects: [
              { type: 'mental', value: 5 },
            ],
            resultText: '엄마가 걱정하시지만 자립심을 보여줬습니다.',
          },
        ],
      },
    ],
  },

  // 8. 동료 창업가
  {
    id: 'npc_founder_choi',
    name: '최영수',
    role: '동료 1인 창업가',
    description: '다른 분야 1인 SaaS 운영. 서로의 고민을 나눌 수 있는 동료.',
    avatar: '🧑‍🚀',
    personality: {
      helpfulness: 80,
      reliability: 70,
      expertise: ['saas', 'solo_founder', 'productivity'],
      quirks: ['밤에 일함', '스타트업 밈을 좋아함'],
    },
    initialRelationship: 50,
    interactions: [
      {
        id: 'founder_coffee',
        title: '커피챗 제안',
        description: '최영수님이 "요즘 어때요? 커피 한잔 할래요?"라고 연락왔습니다.',
        type: 'random',
        probability: 0.03,
        cooldown: 21,
        choices: [
          {
            id: 'meet',
            text: '만나서 이야기해요',
            relationshipChange: 10,
            effects: [
              { type: 'mental', value: 15 },
              { type: 'skill_business', value: 2 },
              { type: 'stress', value: -10 },
            ],
            resultText: '같은 처지의 동료와 대화하니 힘이 납니다!',
          },
          {
            id: 'busy',
            text: '요즘 너무 바빠서...',
            relationshipChange: -5,
            effects: [],
            resultText: '다음에 만나기로 했습니다.',
          },
        ],
      },
      {
        id: 'founder_collab',
        title: '교차 프로모션 제안',
        description: '"서로 뉴스레터에 소개해주는 거 어때요?"',
        type: 'opportunity',
        minRelationship: 60,
        probability: 0.02,
        cooldown: 45,
        choices: [
          {
            id: 'cross_promo',
            text: '좋은 생각이에요!',
            relationshipChange: 10,
            effects: [
              { type: 'users', value: 80 },
              { type: 'reputation', value: 10 },
            ],
            resultText: '서로의 사용자에게 노출되어 윈윈!',
          },
          {
            id: 'decline',
            text: '타겟이 다를 것 같아서...',
            relationshipChange: -5,
            effects: [],
            resultText: '최영수님이 아쉬워하지만 이해합니다.',
          },
        ],
      },
    ],
    storyArc: ['solo_founder_life'],
  },

  // 9. 기자
  {
    id: 'npc_journalist_jung',
    name: '정아린',
    role: 'IT 전문 기자',
    description: '스타트업 생태계를 취재하는 기자. 좋은 스토리에 관심이 많습니다.',
    avatar: '📰',
    personality: {
      helpfulness: 50,
      reliability: 60,
      expertise: ['media', 'storytelling', 'startup_ecosystem'],
      quirks: ['질문이 날카로움', '마감에 쫓김'],
    },
    initialRelationship: 10,
    unlockCondition: (state) => state.business.users.total > 2000,
    interactions: [
      {
        id: 'journalist_interview',
        title: '인터뷰 요청',
        description: '정아린 기자가 1인 개발자 스타트업 기사를 위해 인터뷰를 요청합니다.',
        type: 'opportunity',
        minRelationship: 20,
        probability: 0.02,
        cooldown: 60,
        choices: [
          {
            id: 'accept_interview',
            text: '인터뷰에 응합니다 (-15 에너지)',
            relationshipChange: 20,
            effects: [
              { type: 'energy', value: -15 },
              { type: 'users', value: 300 },
              { type: 'reputation', value: 30 },
            ],
            resultText: '기사가 나가고 많은 관심을 받았습니다!',
          },
          {
            id: 'written',
            text: '서면 인터뷰로 대체해도 될까요?',
            relationshipChange: 5,
            effects: [
              { type: 'users', value: 100 },
              { type: 'reputation', value: 15 },
            ],
            resultText: '효율적으로 처리했습니다.',
          },
          {
            id: 'decline',
            text: '지금은 어려울 것 같아요',
            relationshipChange: -10,
            effects: [],
            resultText: '기회를 놓쳤습니다.',
          },
        ],
      },
      {
        id: 'journalist_follow',
        title: '후속 기사 제안',
        description: '"VocaVision 성장 스토리 후속 기사 어떠세요?"',
        type: 'opportunity',
        minRelationship: 50,
        probability: 0.015,
        cooldown: 90,
        choices: [
          {
            id: 'feature',
            text: '좋습니다! 자료 준비할게요',
            relationshipChange: 15,
            effects: [
              { type: 'users', value: 500 },
              { type: 'reputation', value: 40 },
              { type: 'energy', value: -20 },
            ],
            resultText: '심층 기사로 큰 홍보 효과!',
          },
        ],
      },
    ],
    storyArc: ['media_spotlight'],
  },

  // 10. 교육 전문가
  {
    id: 'npc_expert_song',
    name: '송지현',
    role: '영어 교육학 교수',
    description: '교육학 전문가. VocaVision의 학습 효과에 관심을 가지고 있습니다.',
    avatar: '👩‍🏫',
    personality: {
      helpfulness: 75,
      reliability: 90,
      expertise: ['education', 'research', 'language_learning'],
      quirks: ['논문 인용을 좋아함', '데이터 중시'],
    },
    initialRelationship: 30,
    unlockCondition: (state) => state.business.users.total > 5000,
    interactions: [
      {
        id: 'expert_research',
        title: '연구 협력 제안',
        description: '송지현 교수가 VocaVision의 학습 효과 연구에 관심을 보입니다.',
        type: 'opportunity',
        minRelationship: 40,
        probability: 0.02,
        cooldown: 60,
        choices: [
          {
            id: 'collaborate',
            text: '연구에 협력하겠습니다',
            relationshipChange: 20,
            effects: [
              { type: 'reputation', value: 30 },
              { type: 'users', value: 100 },
            ],
            resultText: '학술적으로 검증된 효과! 신뢰도가 크게 올랐습니다.',
          },
          {
            id: 'data_only',
            text: '익명화된 데이터만 제공해도 될까요?',
            relationshipChange: 5,
            effects: [
              { type: 'reputation', value: 10 },
            ],
            resultText: '제한적 협력이지만 좋은 시작입니다.',
          },
        ],
      },
      {
        id: 'expert_endorsement',
        title: '전문가 추천',
        description: '"VocaVision의 SM-2 알고리즘 적용이 인상적이에요. 추천사를 써드릴까요?"',
        type: 'opportunity',
        minRelationship: 70,
        probability: 0.015,
        cooldown: 120,
        choices: [
          {
            id: 'accept_endorsement',
            text: '감사합니다! 큰 도움이 될 거예요',
            relationshipChange: 15,
            effects: [
              { type: 'reputation', value: 40 },
              { type: 'users', value: 200 },
              { type: 'premium_users', value: 20 },
            ],
            resultText: '전문가 추천으로 신뢰도가 크게 상승했습니다!',
          },
        ],
      },
    ],
    storyArc: ['academic_validation'],
  },
];

// ============================================
// NPC 관계 관리 함수들
// ============================================

export interface NPCRelationship {
  npcId: string;
  relationship: number;
  lastInteraction: number; // 마지막 상호작용 일수
  interactionHistory: string[]; // 과거 상호작용 ID들
}

// 기본 관계 초기화
export function initializeNPCRelationships(): Record<string, NPCRelationship> {
  const relationships: Record<string, NPCRelationship> = {};

  for (const npc of NPCS) {
    relationships[npc.id] = {
      npcId: npc.id,
      relationship: npc.initialRelationship,
      lastInteraction: 0,
      interactionHistory: [],
    };
  }

  return relationships;
}

// 관계 점수 업데이트
export function updateRelationship(
  relationships: Record<string, NPCRelationship>,
  npcId: string,
  change: number,
  interactionId: string,
  currentDay: number
): Record<string, NPCRelationship> {
  const newRelationships = { ...relationships };

  if (newRelationships[npcId]) {
    newRelationships[npcId] = {
      ...newRelationships[npcId],
      relationship: Math.max(-100, Math.min(100, newRelationships[npcId].relationship + change)),
      lastInteraction: currentDay,
      interactionHistory: [...newRelationships[npcId].interactionHistory, interactionId],
    };
  }

  return newRelationships;
}

// 관계 자연 감소 (오랜만에 연락 안 하면)
export function decayRelationships(
  relationships: Record<string, NPCRelationship>,
  currentDay: number
): Record<string, NPCRelationship> {
  const newRelationships = { ...relationships };

  for (const npcId of Object.keys(newRelationships)) {
    const rel = newRelationships[npcId];
    const daysSinceContact = currentDay - rel.lastInteraction;

    // 30일 이상 연락 없으면 관계 감소
    if (daysSinceContact > 30) {
      const decay = Math.floor((daysSinceContact - 30) / 30) * 2;
      newRelationships[npcId] = {
        ...rel,
        relationship: Math.max(-50, rel.relationship - decay),
      };
    }
  }

  return newRelationships;
}

// 가능한 NPC 이벤트 체크
export function checkNPCInteraction(
  state: GameState,
  relationships: Record<string, NPCRelationship>,
  recentInteractions: Record<string, number> // 쿨다운 체크용
): { npc: NPC; interaction: NPCInteraction } | null {

  // 일일 NPC 이벤트 확률 (25%)
  if (Math.random() > 0.25) return null;

  // 활성화된 NPC들 필터링
  const availableNPCs = NPCS.filter(npc => {
    // 언락 조건 체크
    if (npc.unlockCondition && !npc.unlockCondition(state)) return false;
    return true;
  });

  // 랜덤 순서로 체크
  const shuffled = [...availableNPCs].sort(() => Math.random() - 0.5);

  for (const npc of shuffled) {
    const rel = relationships[npc.id];
    if (!rel) continue;

    for (const interaction of npc.interactions) {
      // 쿨다운 체크
      const lastTime = recentInteractions[`${npc.id}_${interaction.id}`] || 0;
      if (state.time.totalDays - lastTime < interaction.cooldown) continue;

      // 관계 요구사항 체크
      if (interaction.minRelationship && rel.relationship < interaction.minRelationship) continue;

      // 확률 체크
      if (Math.random() < interaction.probability) {
        return { npc, interaction };
      }
    }
  }

  return null;
}

// 관계 레벨 텍스트
export function getRelationshipLevel(relationship: number): string {
  if (relationship >= 80) return '절친한 사이';
  if (relationship >= 60) return '친한 사이';
  if (relationship >= 40) return '친근한 사이';
  if (relationship >= 20) return '아는 사이';
  if (relationship >= 0) return '서먹한 사이';
  if (relationship >= -20) return '불편한 사이';
  return '적대적 관계';
}

// NPC 정보 가져오기
export function getNPCById(npcId: string): NPC | undefined {
  return NPCS.find(npc => npc.id === npcId);
}

export default NPCS;
