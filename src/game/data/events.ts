import type { GameEvent } from '../types';

export const GAME_EVENTS: GameEvent[] = [
  // ============================================
  // Critical Events (긴급 상황)
  // ============================================
  {
    id: 'critical_bug_sm2',
    type: 'bug',
    severity: 'critical',
    title: '🚨 긴급 버그 발생!',
    description:
      'SM-2 알고리즘에서 치명적인 버그가 발견되었습니다. 사용자들의 학습 진행도가 초기화되고 있어요! 빠른 대응이 필요합니다.',
    icon: '🐛',
    category: 'technical',
    tags: ['bug', 'urgent', 'user-impact'],
    probability: 0.05,
    minDay: 7,
    choices: [
      {
        id: 'fix_overnight',
        text: '밤새 직접 수정한다 (-30 에너지, +15 스트레스)',
        effects: {
          immediate: [
            { type: 'energy', value: -30 },
            { type: 'stress', value: 15 },
            { type: 'product_stability', value: 10 },
            { type: 'reputation', value: 5 },
            { type: 'skill_coding', value: 2 },
          ],
          delayed: [],
          probability: [{ effect: { type: 'nps', value: 10 }, chance: 0.7 }],
        },
        resultText:
          '5시간의 디버깅 끝에 버그를 해결했습니다! 사용자들이 빠른 대응에 감사해했습니다.',
      },
      {
        id: 'fix_tomorrow',
        text: '내일 아침에 처리한다',
        effects: {
          immediate: [
            { type: 'reputation', value: -15 },
            { type: 'users', value: -10 },
            { type: 'churn_rate', value: 3 },
          ],
          delayed: [],
          probability: [{ effect: { type: 'premium_users', value: -2 }, chance: 0.5 }],
        },
        resultText:
          '밤사이 SNS에서 불만이 확산되었습니다. 10명의 사용자가 앱을 삭제했습니다.',
      },
      {
        id: 'hire_contractor',
        text: '외주 개발자에게 맡긴다 (-200,000원)',
        requirements: { money: 200000 },
        effects: {
          immediate: [
            { type: 'cash', value: -200000 },
            { type: 'product_stability', value: 8 },
            { type: 'reputation', value: 3 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '비용이 들었지만 전문가가 깔끔하게 해결했습니다. 다음에는 코드 리뷰를 더 철저히 해야겠습니다.',
      },
    ],
  },
  {
    id: 'server_down',
    type: 'server',
    severity: 'critical',
    title: '💥 서버 다운!',
    description:
      'Railway 서버가 갑자기 다운되었습니다! 사용자들이 접속할 수 없어요! 모니터링 대시보드에 경고가 울립니다.',
    icon: '🔥',
    category: 'technical',
    tags: ['server', 'urgent', 'downtime'],
    probability: 0.04,
    minDay: 14,
    choices: [
      {
        id: 'restart_immediately',
        text: '즉시 서버 재시작 (-15 에너지)',
        effects: {
          immediate: [
            { type: 'energy', value: -15 },
            { type: 'server_health', value: 20 },
          ],
          delayed: [],
          probability: [{ effect: { type: 'reputation', value: -3 }, chance: 0.3 }],
        },
        resultText: '10분 만에 복구했습니다! 피해는 크지 않았지만 원인 분석이 필요합니다.',
      },
      {
        id: 'contact_support',
        text: 'Railway 고객센터에 문의',
        effects: {
          immediate: [
            { type: 'server_health', value: -10 },
            { type: 'reputation', value: -8 },
            { type: 'users', value: -5 },
          ],
          delayed: [{ effect: { type: 'server_health', value: 15 }, delayDays: 1 }],
          probability: [],
        },
        resultText:
          '30분 후에야 복구되었습니다. 사용자들이 불안해하며 다른 앱을 찾아보기 시작했습니다.',
      },
      {
        id: 'migrate_vercel',
        text: 'Vercel로 긴급 마이그레이션 (-500,000원)',
        requirements: { money: 500000 },
        effects: {
          immediate: [
            { type: 'cash', value: -500000 },
            { type: 'server_health', value: 40 },
            { type: 'reputation', value: 10 },
            { type: 'energy', value: -40 },
            { type: 'stress', value: 20 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '밤새 마이그레이션을 완료했습니다! 비용이 들었지만 더 안정적인 환경이 되었습니다.',
      },
    ],
  },
  {
    id: 'security_breach',
    type: 'security',
    severity: 'critical',
    title: '🔒 보안 취약점 발견!',
    description:
      'Snyk 스캔에서 높은 심각도의 npm 패키지 취약점이 발견되었습니다! 사용자 데이터가 위험에 노출될 수 있습니다.',
    icon: '🛡️',
    category: 'technical',
    tags: ['security', 'urgent'],
    probability: 0.03,
    minDay: 21,
    choices: [
      {
        id: 'fix_immediately',
        text: '즉시 패키지 업데이트 (-20 에너지)',
        effects: {
          immediate: [
            { type: 'energy', value: -20 },
            { type: 'product_stability', value: -5 },
            { type: 'reputation', value: 5 },
          ],
          delayed: [{ effect: { type: 'product_stability', value: 10 }, delayDays: 3 }],
          probability: [],
        },
        resultText: '신속한 대응으로 보안을 강화했습니다! 일부 기능 테스트가 필요합니다.',
      },
      {
        id: 'schedule_update',
        text: '다음 릴리즈에 포함',
        effects: {
          immediate: [{ type: 'reputation', value: -5 }],
          delayed: [],
          probability: [
            { effect: { type: 'reputation', value: -30 }, chance: 0.15 },
            { effect: { type: 'users', value: -50 }, chance: 0.1 },
          ],
        },
        resultText:
          '일단 넘어갔지만 잠재적 위험이 계속 존재합니다. 데이터 유출이 없기를 바랍니다.',
      },
      {
        id: 'security_audit',
        text: '전문 보안 감사 의뢰 (-1,000,000원)',
        requirements: { money: 1000000 },
        effects: {
          immediate: [
            { type: 'cash', value: -1000000 },
            { type: 'reputation', value: 15 },
          ],
          delayed: [
            { effect: { type: 'product_stability', value: 20 }, delayDays: 14 },
          ],
          probability: [],
        },
        resultText:
          '전문가 감사로 여러 취약점을 발견하고 해결했습니다. 사용자들에게 보안 강화를 공지했습니다.',
      },
    ],
  },

  // ============================================
  // Warning Events (주의 상황)
  // ============================================
  {
    id: 'traffic_spike',
    type: 'traffic',
    severity: 'warning',
    title: '📈 트래픽 폭증!',
    description:
      '유명 유튜버가 VocaVision을 소개했습니다! 트래픽이 10배로 급증하고 있어요. 서버가 버틸 수 있을까요?',
    icon: '🚀',
    category: 'business',
    tags: ['viral', 'opportunity', 'server'],
    probability: 0.04,
    minDay: 30,
    choices: [
      {
        id: 'scale_up',
        text: '서버 스케일업 (-300,000원)',
        requirements: { money: 300000 },
        effects: {
          immediate: [
            { type: 'cash', value: -300000 },
            { type: 'users', value: 200 },
            { type: 'premium_users', value: 15 },
            { type: 'reputation', value: 20 },
            { type: 'server_health', value: 10 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '투자가 결실을 맺었습니다! 200명의 신규 사용자가 가입했고, 15명이 프리미엄에 가입했습니다!',
      },
      {
        id: 'hold_on',
        text: '현재 서버로 버틴다',
        effects: {
          immediate: [
            { type: 'server_health', value: -30 },
            { type: 'users', value: 50 },
            { type: 'reputation', value: -10 },
          ],
          delayed: [],
          probability: [{ effect: { type: 'product_stability', value: -10 }, chance: 0.5 }],
        },
        resultText:
          '서버가 느려지면서 많은 신규 사용자가 이탈했습니다. 기회를 놓친 것 같습니다.',
      },
      {
        id: 'cdn_caching',
        text: 'CDN 캐싱 적용 (-100,000원)',
        requirements: { money: 100000 },
        effects: {
          immediate: [
            { type: 'cash', value: -100000 },
            { type: 'users', value: 150 },
            { type: 'premium_users', value: 10 },
            { type: 'server_health', value: 15 },
            { type: 'reputation', value: 10 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '현명한 선택! 적은 비용으로 효과적으로 대응했습니다. 150명이 새로 가입했습니다.',
      },
    ],
  },
  {
    id: 'bad_review',
    type: 'user',
    severity: 'warning',
    title: '⭐ 부정적인 리뷰',
    description:
      '앱스토어에 1점 리뷰가 달렸습니다: "단어가 100개밖에 없어서 금방 끝났어요. 환불 원합니다." 다른 잠재 고객들이 볼 수 있습니다.',
    icon: '😤',
    category: 'user',
    tags: ['review', 'reputation'],
    probability: 0.08,
    minDay: 14,
    choices: [
      {
        id: 'refund_politely',
        text: '정중히 답변 + 환불 (-9,990원)',
        effects: {
          immediate: [
            { type: 'cash', value: -9990 },
            { type: 'reputation', value: 5 },
            { type: 'premium_users', value: -1 },
          ],
          delayed: [],
          probability: [{ effect: { type: 'reputation', value: 5 }, chance: 0.6 }],
        },
        resultText:
          '고객이 답변에 감동받아 리뷰를 3점으로 수정하고, 새로운 기능이 추가되면 다시 구독하겠다고 했습니다.',
      },
      {
        id: 'explain_roadmap',
        text: '단어 추가 계획을 안내',
        effects: {
          immediate: [{ type: 'reputation', value: -2 }],
          delayed: [],
          probability: [{ effect: { type: 'reputation', value: 3 }, chance: 0.4 }],
        },
        resultText: '기다려보겠다고 했지만 확신은 없어 보입니다. 빠른 개선이 필요합니다.',
      },
      {
        id: 'ignore_review',
        text: '무시한다',
        effects: {
          immediate: [
            { type: 'reputation', value: -10 },
            { type: 'users', value: -5 },
          ],
          delayed: [],
          probability: [{ effect: { type: 'churn_rate', value: 2 }, chance: 0.5 }],
        },
        resultText:
          '무대응이 더 큰 불만을 샀습니다. 다른 잠재 사용자들도 가입을 망설이고 있습니다.',
      },
    ],
  },
  {
    id: 'api_cost_spike',
    type: 'finance',
    severity: 'warning',
    title: '💸 OpenAI API 비용 폭증',
    description:
      'AI 연상법 생성 기능이 인기를 끌면서 API 비용이 예상의 3배입니다! 이번 달 OpenAI 청구서가 90만원이 넘습니다.',
    icon: '💳',
    category: 'finance',
    tags: ['cost', 'api'],
    probability: 0.06,
    minDay: 45,
    choices: [
      {
        id: 'implement_caching',
        text: '캐싱 시스템 구축 (-50 에너지)',
        effects: {
          immediate: [
            { type: 'energy', value: -50 },
            { type: 'stress', value: 15 },
            { type: 'skill_coding', value: 3 },
          ],
          delayed: [{ effect: { type: 'cash', value: 200000 }, delayDays: 30 }],
          probability: [],
        },
        resultText:
          '힘들었지만 캐싱 시스템을 구축해서 비용을 절반으로 줄였습니다! 다음 달부터 절감 효과가 나타납니다.',
      },
      {
        id: 'limit_api',
        text: 'API 호출 제한 설정',
        effects: {
          immediate: [
            { type: 'reputation', value: -10 },
            { type: 'premium_users', value: -3 },
            { type: 'nps', value: -10 },
          ],
          delayed: [],
          probability: [],
        },
        resultText: '프리미엄 사용자들이 불만을 표했습니다. 3명이 구독을 해지했습니다.',
      },
      {
        id: 'pay_full',
        text: '그냥 지불한다 (-900,000원)',
        effects: {
          immediate: [{ type: 'cash', value: -900000 }],
          delayed: [],
          probability: [],
        },
        resultText:
          '비용이 많이 들었지만 서비스 품질은 유지했습니다. 장기적인 해결책이 필요합니다.',
      },
    ],
  },
  {
    id: 'competitor_launch',
    type: 'market',
    severity: 'warning',
    title: '⚔️ 경쟁사 신규 기능',
    description:
      '경쟁 앱 "WordMaster"가 AI 이미지 생성 기능을 출시했습니다. SNS에서 화제가 되고 있습니다. 사용자들이 비교하기 시작했습니다.',
    icon: '⚔️',
    category: 'market',
    tags: ['competition'],
    probability: 0.05,
    minDay: 60,
    choices: [
      {
        id: 'develop_similar',
        text: 'DALL-E 3 연동 개발 (-70 에너지, -500,000원)',
        requirements: { money: 500000 },
        effects: {
          immediate: [
            { type: 'energy', value: -70 },
            { type: 'cash', value: -500000 },
            { type: 'stress', value: 25 },
          ],
          delayed: [
            { effect: { type: 'reputation', value: 25 }, delayDays: 14 },
            { effect: { type: 'users', value: 100 }, delayDays: 14 },
          ],
          probability: [],
        },
        resultText:
          '2주 후 더 나은 품질의 기능을 출시했습니다! 사용자들이 VocaVision의 빠른 대응에 감동했습니다.',
      },
      {
        id: 'promote_strengths',
        text: '우리만의 강점을 홍보',
        effects: {
          immediate: [
            { type: 'reputation', value: 5 },
            { type: 'users', value: 20 },
            { type: 'skill_marketing', value: 2 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          'SM-2 알고리즘의 과학적 학습법을 강조했더니, 진지한 학습자들이 관심을 보였습니다.',
      },
      {
        id: 'ignore_competitor',
        text: '무시하고 원래 로드맵 진행',
        effects: {
          immediate: [
            { type: 'users', value: -20 },
            { type: 'reputation', value: -10 },
          ],
          delayed: [],
          probability: [{ effect: { type: 'churn_rate', value: 3 }, chance: 0.4 }],
        },
        resultText: '일부 사용자들이 경쟁 앱으로 이동했습니다. 시장 변화를 주시해야 합니다.',
      },
    ],
  },
  {
    id: 'burnout_warning',
    type: 'personal',
    severity: 'warning',
    title: '😴 번아웃 징후',
    description:
      '최근 며칠간 잠을 제대로 못 잤습니다. 집중력이 떨어지고 실수가 잦아집니다. 두통과 어깨 통증도 느껴집니다.',
    icon: '😵',
    category: 'health',
    tags: ['burnout', 'health'],
    probability: 0.08,
    minDay: 21,
    triggerConditions: [{ type: 'stat', target: 'stress', operator: '>=', value: 60 }],
    choices: [
      {
        id: 'take_day_off',
        text: '하루 푹 쉰다 (+40 에너지, -20 스트레스)',
        effects: {
          immediate: [
            { type: 'energy', value: 40 },
            { type: 'stress', value: -20 },
            { type: 'health', value: 15 },
            { type: 'work_life_balance', value: 15 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '푹 쉬고 나니 다시 의욕이 생깁니다! 몸과 마음이 한결 가벼워졌습니다.',
      },
      {
        id: 'push_through',
        text: '그래도 일한다',
        effects: {
          immediate: [
            { type: 'energy', value: -20 },
            { type: 'stress', value: 20 },
            { type: 'health', value: -10 },
          ],
          delayed: [],
          probability: [
            { effect: { type: 'product_stability', value: -10 }, chance: 0.4 },
          ],
        },
        resultText:
          '피곤한 상태로 일했더니 결국 실수가 발생했습니다. 건강 관리가 시급합니다.',
      },
      {
        id: 'exercise',
        text: '운동을 다녀온다 (+20 에너지, -10 스트레스)',
        effects: {
          immediate: [
            { type: 'energy', value: 20 },
            { type: 'stress', value: -10 },
            { type: 'health', value: 10 },
            { type: 'motivation', value: 10 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '가벼운 운동 후 머리가 맑아졌습니다! 기분 전환이 되어 다시 집중할 수 있습니다.',
      },
    ],
  },

  // ============================================
  // Good Events (기회)
  // ============================================
  {
    id: 'viral_moment',
    type: 'opportunity',
    severity: 'good',
    title: '🌟 바이럴 기회!',
    description:
      '한 사용자의 학습 인증샷이 트위터에서 500 RT를 기록했습니다! "VocaVision 덕분에 토익 900점 달성!" 이라는 글입니다.',
    icon: '🔥',
    category: 'marketing',
    tags: ['viral', 'opportunity'],
    probability: 0.04,
    minDay: 30,
    choices: [
      {
        id: 'retweet_official',
        text: '공식 계정으로 리트윗',
        effects: {
          immediate: [
            { type: 'users', value: 80 },
            { type: 'premium_users', value: 5 },
            { type: 'reputation', value: 15 },
            { type: 'brand_awareness', value: 10 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '자연스러운 홍보 효과! 80명의 신규 가입이 발생했고 5명이 프리미엄에 가입했습니다.',
      },
      {
        id: 'reward_user',
        text: '1년 무료 구독 제공 (-119,880원)',
        effects: {
          immediate: [
            { type: 'cash', value: -119880 },
            { type: 'users', value: 120 },
            { type: 'premium_users', value: 8 },
            { type: 'reputation', value: 25 },
            { type: 'brand_awareness', value: 15 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '사용자가 감동받아 추가로 홍보해줬습니다! 대박! 120명의 신규 가입이 발생했습니다.',
      },
      {
        id: 'watch_quietly',
        text: '지켜본다',
        effects: {
          immediate: [{ type: 'users', value: 30 }],
          delayed: [],
          probability: [],
        },
        resultText: '조용히 지나갔지만 일부 효과는 있었습니다. 다음 기회를 잘 활용해야겠습니다.',
      },
    ],
  },
  {
    id: 'investment_offer',
    type: 'opportunity',
    severity: 'good',
    title: '💰 투자 제안',
    description:
      '엔젤 투자자가 연락해왔습니다. "VocaVision의 성장 가능성을 보고 5천만원 투자를 제안합니다. 단, 지분 15%를 원합니다."',
    icon: '💼',
    category: 'business',
    tags: ['investment', 'opportunity'],
    probability: 0.02,
    minDay: 90,
    choices: [
      {
        id: 'accept_investment',
        text: '투자 받는다 (+50,000,000원, 지분 15%)',
        effects: {
          immediate: [
            { type: 'cash', value: 50000000 },
            { type: 'stress', value: 30 },
            { type: 'reputation', value: 15 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '자금은 확보했지만 이제 투자자에게 성과를 보여줘야 합니다. 책임감과 압박감이 느껴집니다.',
      },
      {
        id: 'negotiate_terms',
        text: '지분 10%로 협상',
        effects: {
          immediate: [],
          delayed: [],
          probability: [
            {
              effect: { type: 'cash', value: 35000000 },
              chance: 0.6,
            },
            { effect: { type: 'reputation', value: 10 }, chance: 0.6 },
            { effect: { type: 'stress', value: 20 }, chance: 0.6 },
          ],
        },
        resultText:
          '협상 끝에 3500만원에 10% 지분으로 합의했습니다! 비즈니스 감각이 늘어난 것 같습니다.',
      },
      {
        id: 'decline_politely',
        text: '정중히 거절',
        effects: {
          immediate: [{ type: 'reputation', value: 5 }],
          delayed: [],
          probability: [],
        },
        resultText:
          '독립성을 지켰지만 기회비용이 아쉽습니다. 언제든 다시 연락달라고 했습니다.',
      },
    ],
  },
  {
    id: 'media_interview',
    type: 'opportunity',
    severity: 'good',
    title: '🎤 미디어 인터뷰 요청',
    description:
      '유명 IT 매체에서 "1인 개발자 성공 스토리"로 인터뷰를 요청했습니다. 홍보 효과가 클 것 같습니다.',
    icon: '🎙️',
    category: 'marketing',
    tags: ['media', 'opportunity'],
    probability: 0.03,
    minDay: 60,
    choices: [
      {
        id: 'accept_interview',
        text: '인터뷰에 응한다 (-15 에너지)',
        effects: {
          immediate: [
            { type: 'energy', value: -15 },
            { type: 'reputation', value: 30 },
            { type: 'users', value: 100 },
            { type: 'premium_users', value: 8 },
            { type: 'confidence', value: 10 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '기사가 나가고 많은 관심을 받았습니다! 100명의 신규 가입이 발생했습니다.',
      },
      {
        id: 'written_interview',
        text: '서면 인터뷰로 대체',
        effects: {
          immediate: [
            { type: 'reputation', value: 15 },
            { type: 'users', value: 40 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '효율적으로 처리했고 적당한 홍보 효과를 얻었습니다. 40명이 새로 가입했습니다.',
      },
      {
        id: 'decline_interview',
        text: '정중히 거절',
        effects: {
          immediate: [],
          delayed: [],
          probability: [],
        },
        resultText: '기회를 놓쳤지만 시간은 절약했습니다. 다음에 더 준비된 상태로 하겠습니다.',
      },
    ],
  },
  {
    id: 'partnership_offer',
    type: 'opportunity',
    severity: 'good',
    title: '🤝 파트너십 제안',
    description:
      '대형 어학원 "영어왕"에서 B2B 제휴를 제안했습니다. 학생 500명에게 VocaVision을 제공하고 싶다고 합니다.',
    icon: '🏢',
    category: 'business',
    tags: ['partnership', 'b2b'],
    probability: 0.03,
    minDay: 90,
    choices: [
      {
        id: 'full_contract',
        text: '정식 계약 진행 (학생 500명, 월 200만원)',
        effects: {
          immediate: [
            { type: 'users', value: 500 },
            { type: 'cash', value: 2000000 },
            { type: 'stress', value: 20 },
            { type: 'reputation', value: 20 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '대형 계약 성사! 매월 200만원의 안정적인 수익이 생겼습니다. 하지만 B2B 관리 부담도 생겼습니다.',
      },
      {
        id: 'pilot_program',
        text: '파일럿 프로그램 (50명, 무료)',
        effects: {
          immediate: [
            { type: 'users', value: 50 },
            { type: 'reputation', value: 10 },
          ],
          delayed: [{ effect: { type: 'cash', value: 500000 }, delayDays: 60 }],
          probability: [],
        },
        resultText:
          '작게 시작해서 검증해보기로 했습니다. 2달 후 결과가 좋으면 정식 계약을 맺기로 했습니다.',
      },
      {
        id: 'decline_partnership',
        text: '준비가 안 됐다고 거절',
        effects: {
          immediate: [{ type: 'reputation', value: -5 }],
          delayed: [],
          probability: [],
        },
        resultText:
          '아직 B2B를 감당할 준비가 안 됐습니다. 기회를 놓쳤지만 현실적인 판단일 수도 있습니다.',
      },
    ],
  },

  // ============================================
  // Normal Events (일상적인 상황)
  // ============================================
  {
    id: 'user_feedback',
    type: 'user',
    severity: 'normal',
    title: '💬 사용자 피드백',
    description:
      '프리미엄 사용자가 이메일로 요청했습니다: "발음 듣기 기능이 있으면 좋겠어요. 혼자 공부할 때 발음을 확인하고 싶어요."',
    icon: '💡',
    category: 'user',
    tags: ['feedback', 'feature-request'],
    probability: 0.1,
    minDay: 14,
    choices: [
      {
        id: 'implement_web_speech',
        text: 'Web Speech API로 구현 (-20 에너지)',
        effects: {
          immediate: [
            { type: 'energy', value: -20 },
            { type: 'reputation', value: 15 },
            { type: 'premium_users', value: 3 },
            { type: 'nps', value: 10 },
            { type: 'skill_coding', value: 2 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '무료 Web Speech API로 빠르게 구현했습니다! 사용자들이 새 기능에 열광합니다.',
      },
      {
        id: 'implement_google_tts',
        text: 'Google TTS API 연동 (-80,000원/월)',
        effects: {
          immediate: [
            { type: 'cash', value: -80000 },
            { type: 'reputation', value: 20 },
            { type: 'premium_users', value: 5 },
            { type: 'nps', value: 15 },
          ],
          delayed: [],
          probability: [],
        },
        resultText:
          '고품질 음성으로 만족도가 크게 올랐습니다! 5명이 새로 프리미엄에 가입했습니다.',
      },
      {
        id: 'promise_later',
        text: '"검토해보겠습니다" 답변',
        effects: {
          immediate: [{ type: 'reputation', value: -3 }],
          delayed: [],
          probability: [],
        },
        resultText: '사용자가 약간 실망한 것 같습니다. 경쟁 앱은 이미 이 기능이 있다고 합니다.',
      },
    ],
  },
  {
    id: 'minor_bug',
    type: 'bug',
    severity: 'normal',
    title: '🐛 사소한 버그 리포트',
    description:
      'iOS Safari에서 플래시카드 애니메이션이 끊긴다는 신고가 들어왔습니다. 사용성에 약간의 불편함이 있습니다.',
    icon: '🔧',
    category: 'technical',
    tags: ['bug', 'ui'],
    probability: 0.12,
    minDay: 7,
    choices: [
      {
        id: 'fix_now',
        text: '바로 수정한다 (-10 에너지)',
        effects: {
          immediate: [
            { type: 'energy', value: -10 },
            { type: 'reputation', value: 3 },
            { type: 'skill_coding', value: 1 },
          ],
          delayed: [],
          probability: [{ effect: { type: 'nps', value: 5 }, chance: 0.7 }],
        },
        resultText:
          'CSS 최적화로 해결했습니다! 해당 사용자가 감사하다며 5점 리뷰를 남겼습니다.',
      },
      {
        id: 'next_update',
        text: '다음 업데이트에 포함',
        effects: {
          immediate: [{ type: 'reputation', value: -2 }],
          delayed: [],
          probability: [],
        },
        resultText: '사용자는 이해했지만 살짝 실망한 눈치입니다. 빠른 대응이 중요합니다.',
      },
      {
        id: 'cannot_reproduce',
        text: '재현이 안 된다고 답변',
        effects: {
          immediate: [{ type: 'reputation', value: -8 }],
          delayed: [],
          probability: [{ effect: { type: 'churn_rate', value: 1 }, chance: 0.3 }],
        },
        resultText: '사용자가 트위터에 불만을 토로했습니다. 고객 응대에 더 신경 써야겠습니다.',
      },
    ],
  },
  {
    id: 'conference_invitation',
    type: 'opportunity',
    severity: 'good',
    title: '📚 컨퍼런스 초청',
    description:
      '개발자 컨퍼런스에서 "1인 개발자의 EdTech 창업기"라는 주제로 발표 요청이 왔습니다. 네트워킹 기회가 될 수 있습니다.',
    icon: '🎪',
    category: 'networking',
    tags: ['conference', 'speaking'],
    probability: 0.03,
    minDay: 60,
    choices: [
      {
        id: 'accept_speaking',
        text: '발표에 응한다 (-25 에너지, -15 스트레스)',
        effects: {
          immediate: [
            { type: 'energy', value: -25 },
            { type: 'stress', value: 15 },
            { type: 'reputation', value: 20 },
            { type: 'users', value: 50 },
            { type: 'skill_communication', value: 3 },
            { type: 'confidence', value: 10 },
          ],
          delayed: [],
          probability: [{ effect: { type: 'cash', value: 5000000 }, chance: 0.05 }],
        },
        resultText:
          '발표가 좋은 반응을 얻었습니다! 업계에서 인지도가 높아지고 새로운 인맥도 생겼습니다.',
      },
      {
        id: 'decline_speaking',
        text: '시간이 없어서 거절',
        effects: {
          immediate: [],
          delayed: [],
          probability: [],
        },
        resultText: '기회를 놓쳤지만 개발에 집중할 수 있습니다. 다음에 다시 기회가 오겠죠.',
      },
    ],
  },
];

// 이벤트 필터링 헬퍼 함수
export function getAvailableEvents(day: number, completedEvents: string[]): GameEvent[] {
  return GAME_EVENTS.filter((event) => {
    // 최소 일수 체크
    if (event.minDay && day < event.minDay) return false;

    // 최대 발생 횟수 체크
    if (event.maxOccurrences) {
      const occurrences = completedEvents.filter((id) => id === event.id).length;
      if (occurrences >= event.maxOccurrences) return false;
    }

    return true;
  });
}

// 랜덤 이벤트 선택
export function selectRandomEvent(
  day: number,
  completedEvents: string[],
  eventProbabilityMultiplier: number = 1
): GameEvent | null {
  const availableEvents = getAvailableEvents(day, completedEvents);

  for (const event of availableEvents) {
    const probability = (event.probability || 0.1) * eventProbabilityMultiplier;
    if (Math.random() < probability) {
      return event;
    }
  }

  return null;
}

export function getEventById(id: string): GameEvent | undefined {
  return GAME_EVENTS.find((event) => event.id === id);
}
