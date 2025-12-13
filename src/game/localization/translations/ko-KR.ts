/**
 * Chapter 13: Localization - Korean Translations
 * 한국어 번역 데이터
 */

import { TranslationDictionary } from '../types';

export const koKRTranslations: TranslationDictionary = {
  // ============================================
  // Common
  // ============================================
  'common.confirm': '확인',
  'common.cancel': '취소',
  'common.save': '저장',
  'common.load': '불러오기',
  'common.delete': '삭제',
  'common.close': '닫기',
  'common.back': '뒤로',
  'common.next': '다음',
  'common.previous': '이전',
  'common.yes': '예',
  'common.no': '아니오',
  'common.ok': '확인',
  'common.apply': '적용',
  'common.reset': '초기화',
  'common.search': '검색',
  'common.filter': '필터',
  'common.sort': '정렬',
  'common.edit': '편집',
  'common.copy': '복사',
  'common.paste': '붙여넣기',
  'common.cut': '잘라내기',
  'common.undo': '실행 취소',
  'common.redo': '다시 실행',
  'common.select_all': '모두 선택',
  'common.none': '없음',
  'common.all': '전체',
  'common.loading': '로딩 중...',
  'common.error': '오류',
  'common.success': '성공',
  'common.warning': '경고',
  'common.info': '정보',
  'common.new': '새로 만들기',
  'common.continue': '계속하기',
  'common.skip': '건너뛰기',
  'common.retry': '다시 시도',
  'common.help': '도움말',
  'common.settings': '설정',
  'common.about': '정보',

  // ============================================
  // Game
  // ============================================
  'game.title': 'VocaVision',
  'game.subtitle': '어학 스타트업 시뮬레이터',
  'game.new_game': '새 게임',
  'game.continue_game': '이어하기',
  'game.load_game': '게임 불러오기',
  'game.save_game': '게임 저장',
  'game.quit': '게임 종료',
  'game.pause': '일시정지',
  'game.resume': '계속하기',
  'game.day': '{{count}}일차',
  'game.week': '{{count}}주차',
  'game.month': '{{count}}개월',
  'game.year': '{{count}}년차',
  'game.morning': '오전',
  'game.afternoon': '오후',
  'game.evening': '저녁',
  'game.night': '밤',
  'game.end_day': '하루 마무리',
  'game.next_day': '다음 날로',
  'game.time_remaining': '남은 시간: {{hours}}시간 {{minutes}}분',
  'game.action_points': '행동력: {{current}}/{{max}}',

  // ============================================
  // Stats & Resources
  // ============================================
  'stats.energy': '체력',
  'stats.stress': '스트레스',
  'stats.health': '건강',
  'stats.motivation': '동기',
  'stats.creativity': '창의성',
  'stats.focus': '집중력',
  'stats.reputation': '평판',
  'stats.influence': '영향력',
  'stats.experience': '경험치',
  'stats.level': '레벨',

  'resource.cash': '자금',
  'resource.users': '유저',
  'resource.premium_users': '프리미엄 유저',
  'resource.revenue': '수익',
  'resource.expenses': '지출',
  'resource.profit': '순이익',
  'resource.mrr': '월간 반복 수익 (MRR)',
  'resource.arr': '연간 반복 수익 (ARR)',
  'resource.ltv': '고객 생애 가치 (LTV)',
  'resource.cac': '고객 획득 비용 (CAC)',
  'resource.churn': '이탈률',
  'resource.conversion': '전환율',

  // ============================================
  // Actions
  // ============================================
  'action.develop': '개발하기',
  'action.market': '마케팅',
  'action.analyze': '분석하기',
  'action.rest': '휴식',
  'action.study': '학습',
  'action.network': '네트워킹',
  'action.hire': '채용',
  'action.fire': '해고',
  'action.invest': '투자',
  'action.research': '연구',
  'action.plan': '기획',
  'action.design': '디자인',
  'action.test': '테스트',
  'action.deploy': '배포',
  'action.support': '고객 지원',
  'action.pitch': '투자 유치',
  'action.partner': '제휴',

  // ============================================
  // Features
  // ============================================
  'feature.flashcards': '플래시카드',
  'feature.quiz': '퀴즈',
  'feature.listening': '듣기 연습',
  'feature.speaking': '말하기 연습',
  'feature.writing': '쓰기 연습',
  'feature.reading': '읽기 연습',
  'feature.vocabulary': '어휘',
  'feature.grammar': '문법',
  'feature.pronunciation': '발음',
  'feature.conversation': '회화',
  'feature.ai_tutor': 'AI 튜터',
  'feature.gamification': '게이미피케이션',
  'feature.social': '소셜 기능',
  'feature.analytics': '학습 분석',
  'feature.certification': '자격증 준비',

  // ============================================
  // Marketing
  // ============================================
  'marketing.campaign': '캠페인',
  'marketing.social_media': '소셜 미디어',
  'marketing.content': '콘텐츠 마케팅',
  'marketing.seo': 'SEO',
  'marketing.ads': '광고',
  'marketing.influencer': '인플루언서 마케팅',
  'marketing.email': '이메일 마케팅',
  'marketing.pr': 'PR',
  'marketing.viral': '바이럴 마케팅',
  'marketing.referral': '추천 프로그램',
  'marketing.partnership': '제휴 마케팅',

  // ============================================
  // Skills
  // ============================================
  'skill.coding': '코딩',
  'skill.design': '디자인',
  'skill.marketing': '마케팅',
  'skill.business': '비즈니스',
  'skill.communication': '커뮤니케이션',
  'skill.leadership': '리더십',
  'skill.analytics': '분석',
  'skill.creativity': '창의성',
  'skill.negotiation': '협상',
  'skill.time_management': '시간 관리',

  // ============================================
  // Events
  // ============================================
  'event.opportunity': '기회',
  'event.crisis': '위기',
  'event.competitor': '경쟁자',
  'event.partnership': '제휴 제안',
  'event.investor': '투자자',
  'event.media': '미디어 취재',
  'event.user_feedback': '유저 피드백',
  'event.bug_report': '버그 리포트',
  'event.server_issue': '서버 문제',
  'event.viral_moment': '바이럴 순간',

  // ============================================
  // Achievements
  // ============================================
  'achievement.first_user': '첫 번째 유저',
  'achievement.first_revenue': '첫 수익',
  'achievement.hundred_users': '100명 달성',
  'achievement.thousand_users': '1,000명 달성',
  'achievement.first_premium': '첫 프리미엄 유저',
  'achievement.profitable': '흑자 전환',
  'achievement.viral': '바이럴 달성',
  'achievement.feature_complete': '기능 완성',
  'achievement.partnership': '첫 제휴',
  'achievement.investment': '투자 유치',
  'achievement.description.first_user': '첫 번째 유저를 획득했습니다!',
  'achievement.description.first_revenue': '첫 수익을 올렸습니다!',

  // ============================================
  // Endings
  // ============================================
  'ending.victory': '승리',
  'ending.defeat': '패배',
  'ending.special': '특별 엔딩',
  'ending.secret': '비밀 엔딩',
  'ending.title.premium_milestone': '프리미엄 마일스톤',
  'ending.title.financial_freedom': '재정적 자유',
  'ending.title.acquisition': '성공적인 인수',
  'ending.title.lifestyle_business': '라이프스타일 비즈니스',
  'ending.title.bankruptcy': '파산',
  'ending.title.burnout': '번아웃',
  'ending.congratulations': '축하합니다!',
  'ending.game_over': '게임 오버',
  'ending.score': '최종 점수: {{score}}',
  'ending.grade': '등급: {{grade}}',
  'ending.new_game_plus': '2회차 플레이',
  'ending.main_menu': '메인 메뉴',

  // ============================================
  // Tutorial
  // ============================================
  'tutorial.welcome': 'VocaVision에 오신 것을 환영합니다!',
  'tutorial.intro': '당신은 이제 어학 학습 앱을 만드는 1인 창업자입니다.',
  'tutorial.basics': '기본 조작 방법을 알아볼까요?',
  'tutorial.energy': '체력은 행동을 수행할 때 소모됩니다. 휴식으로 회복하세요.',
  'tutorial.development': '개발 탭에서 새로운 기능을 추가할 수 있습니다.',
  'tutorial.marketing': '마케팅으로 유저를 획득하세요.',
  'tutorial.business': '비즈니스 탭에서 수익화 전략을 세우세요.',
  'tutorial.next_step': '다음 단계로 이동하시겠습니까?',
  'tutorial.skip_all': '튜토리얼 건너뛰기',

  // ============================================
  // Settings
  // ============================================
  'settings.title': '설정',
  'settings.audio': '오디오',
  'settings.audio.master': '마스터 볼륨',
  'settings.audio.music': '음악',
  'settings.audio.sfx': '효과음',
  'settings.audio.voice': '음성',
  'settings.audio.mute': '음소거',
  'settings.display': '화면',
  'settings.display.theme': '테마',
  'settings.display.theme.light': '라이트',
  'settings.display.theme.dark': '다크',
  'settings.display.theme.system': '시스템 설정',
  'settings.display.font_size': '글꼴 크기',
  'settings.display.animations': '애니메이션',
  'settings.gameplay': '게임플레이',
  'settings.gameplay.auto_save': '자동 저장',
  'settings.gameplay.auto_save_interval': '자동 저장 간격',
  'settings.gameplay.confirm_dialogs': '확인 다이얼로그',
  'settings.accessibility': '접근성',
  'settings.accessibility.high_contrast': '고대비',
  'settings.accessibility.reduced_motion': '모션 감소',
  'settings.accessibility.screen_reader': '스크린 리더 지원',
  'settings.language': '언어',
  'settings.language.select': '언어 선택',
  'settings.controls': '조작',
  'settings.controls.keybindings': '키 설정',
  'settings.privacy': '개인정보',
  'settings.privacy.analytics': '분석 데이터 수집',
  'settings.privacy.crash_reports': '오류 보고',
  'settings.reset_defaults': '기본값으로 초기화',

  // ============================================
  // Save/Load
  // ============================================
  'save.title': '저장 관리',
  'save.slot': '슬롯 {{number}}',
  'save.empty': '빈 슬롯',
  'save.auto': '자동 저장',
  'save.quick': '빠른 저장',
  'save.confirm': '이 슬롯에 저장하시겠습니까?',
  'save.overwrite': '기존 데이터를 덮어쓰시겠습니까?',
  'save.success': '저장되었습니다.',
  'save.failed': '저장에 실패했습니다.',
  'load.confirm': '이 저장 데이터를 불러오시겠습니까?',
  'load.success': '불러왔습니다.',
  'load.failed': '불러오기에 실패했습니다.',
  'delete.confirm': '이 저장 데이터를 삭제하시겠습니까?',

  // ============================================
  // Errors
  // ============================================
  'error.generic': '오류가 발생했습니다.',
  'error.network': '네트워크 오류가 발생했습니다.',
  'error.save': '저장 중 오류가 발생했습니다.',
  'error.load': '불러오는 중 오류가 발생했습니다.',
  'error.invalid_data': '유효하지 않은 데이터입니다.',
  'error.not_found': '찾을 수 없습니다.',
  'error.permission': '권한이 없습니다.',
  'error.timeout': '시간 초과되었습니다.',
  'error.try_again': '다시 시도해 주세요.',

  // ============================================
  // Time & Date
  // ============================================
  'time.seconds': '{{count}}초',
  'time.minutes': '{{count}}분',
  'time.hours': '{{count}}시간',
  'time.days': '{{count}}일',
  'time.weeks': '{{count}}주',
  'time.months': '{{count}}개월',
  'time.years': '{{count}}년',
  'time.ago': '{{time}} 전',
  'time.remaining': '{{time}} 남음',
  'time.just_now': '방금',
  'time.today': '오늘',
  'time.yesterday': '어제',
  'time.tomorrow': '내일',

  // ============================================
  // Numbers
  // ============================================
  'number.thousand': '천',
  'number.million': '백만',
  'number.billion': '십억',
  'number.trillion': '조',

  // ============================================
  // Notifications
  // ============================================
  'notification.new_user': '새로운 유저가 가입했습니다!',
  'notification.new_revenue': '{{amount}}의 수익이 발생했습니다!',
  'notification.level_up': '레벨 업! 레벨 {{level}}이 되었습니다.',
  'notification.achievement': '업적 달성: {{name}}',
  'notification.event': '새로운 이벤트: {{name}}',
  'notification.reminder': '알림: {{message}}',
};

export default koKRTranslations;
