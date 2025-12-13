/**
 * Chapter 14: Debug & Testing - Cheat Codes
 * 치트 코드 정의 및 관리
 */

import {
  CheatCode,
  CheatCategory,
  CheatResult,
  CheatParam,
} from './types';

// ============================================
// Cheat Code Definitions
// ============================================

/**
 * 자원 치트
 */
export const resourceCheats: CheatCode[] = [
  {
    id: 'money',
    code: 'showmethemoney',
    name: '자금 추가',
    description: '자금을 추가합니다',
    category: 'resource',
    action: {
      type: 'add',
      target: 'resources.cash',
      value: 100000,
    },
    params: [
      {
        name: 'amount',
        type: 'number',
        default: 100000,
        min: 1000,
        max: 10000000,
      },
    ],
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'users',
    code: 'morepeoplenow',
    name: '유저 추가',
    description: '무료 유저를 추가합니다',
    category: 'resource',
    action: {
      type: 'add',
      target: 'resources.users',
      value: 1000,
    },
    params: [
      {
        name: 'count',
        type: 'number',
        default: 1000,
        min: 100,
        max: 100000,
      },
    ],
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'premium',
    code: 'makethempay',
    name: '프리미엄 유저 추가',
    description: '프리미엄 유저를 추가합니다',
    category: 'resource',
    action: {
      type: 'add',
      target: 'resources.premiumUsers',
      value: 100,
    },
    params: [
      {
        name: 'count',
        type: 'number',
        default: 100,
        min: 10,
        max: 10000,
      },
    ],
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'energy',
    code: 'fullpower',
    name: '체력 회복',
    description: '체력을 최대치로 회복합니다',
    category: 'resource',
    action: {
      type: 'set',
      target: 'stats.energy',
      value: 100,
    },
    enabled: true,
    requiresDebugMode: false,
  },
  {
    id: 'nostress',
    code: 'relaxmode',
    name: '스트레스 제거',
    description: '스트레스를 0으로 만듭니다',
    category: 'resource',
    action: {
      type: 'set',
      target: 'stats.stress',
      value: 0,
    },
    enabled: true,
    requiresDebugMode: false,
  },
];

/**
 * 시간 치트
 */
export const timeCheats: CheatCode[] = [
  {
    id: 'skipday',
    code: 'nextday',
    name: '하루 건너뛰기',
    description: '다음 날로 이동합니다',
    category: 'time',
    action: {
      type: 'trigger',
      target: 'time.advanceDay',
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'skipweek',
    code: 'nextweek',
    name: '일주일 건너뛰기',
    description: '7일 후로 이동합니다',
    category: 'time',
    action: {
      type: 'custom',
      target: 'time.advanceDays',
      value: 7,
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'skipmonth',
    code: 'nextmonth',
    name: '한 달 건너뛰기',
    description: '30일 후로 이동합니다',
    category: 'time',
    action: {
      type: 'custom',
      target: 'time.advanceDays',
      value: 30,
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'setday',
    code: 'gotoday',
    name: '특정 일차로 이동',
    description: '특정 일차로 이동합니다',
    category: 'time',
    action: {
      type: 'set',
      target: 'time.day',
    },
    params: [
      {
        name: 'day',
        type: 'number',
        default: 1,
        min: 1,
        max: 365,
      },
    ],
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'timespeed',
    code: 'warpspeed',
    name: '시간 속도 변경',
    description: '게임 시간 속도를 변경합니다',
    category: 'time',
    action: {
      type: 'set',
      target: 'time.speed',
    },
    params: [
      {
        name: 'speed',
        type: 'select',
        default: 1,
        options: [0.5, 1, 2, 4, 10],
      },
    ],
    enabled: true,
    requiresDebugMode: true,
  },
];

/**
 * 진행 치트
 */
export const progressionCheats: CheatCode[] = [
  {
    id: 'levelup',
    code: 'levelmeup',
    name: '레벨 업',
    description: '레벨을 1 올립니다',
    category: 'progression',
    action: {
      type: 'add',
      target: 'progression.level',
      value: 1,
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'maxlevel',
    code: 'imthebest',
    name: '최대 레벨',
    description: '레벨을 최대로 설정합니다',
    category: 'progression',
    action: {
      type: 'set',
      target: 'progression.level',
      value: 99,
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'allskills',
    code: 'knowitall',
    name: '모든 스킬 습득',
    description: '모든 스킬을 최대 레벨로 습득합니다',
    category: 'progression',
    action: {
      type: 'trigger',
      target: 'skills.unlockAll',
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'xp',
    code: 'morexp',
    name: '경험치 추가',
    description: '경험치를 추가합니다',
    category: 'progression',
    action: {
      type: 'add',
      target: 'progression.experience',
      value: 10000,
    },
    params: [
      {
        name: 'amount',
        type: 'number',
        default: 10000,
        min: 100,
        max: 1000000,
      },
    ],
    enabled: true,
    requiresDebugMode: true,
  },
];

/**
 * 언락 치트
 */
export const unlockCheats: CheatCode[] = [
  {
    id: 'unlockall',
    code: 'openallgates',
    name: '모든 콘텐츠 언락',
    description: '모든 콘텐츠를 언락합니다',
    category: 'unlock',
    action: {
      type: 'trigger',
      target: 'unlocks.all',
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'unlockfeatures',
    code: 'allfeatures',
    name: '모든 기능 언락',
    description: '모든 개발 가능한 기능을 언락합니다',
    category: 'unlock',
    action: {
      type: 'trigger',
      target: 'features.unlockAll',
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'allachievements',
    code: 'achiever',
    name: '모든 업적 달성',
    description: '모든 업적을 달성합니다',
    category: 'unlock',
    action: {
      type: 'trigger',
      target: 'achievements.unlockAll',
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'allendings',
    code: 'theend',
    name: '모든 엔딩 해금',
    description: '모든 엔딩을 해금합니다',
    category: 'unlock',
    action: {
      type: 'trigger',
      target: 'endings.unlockAll',
    },
    enabled: true,
    requiresDebugMode: true,
  },
];

/**
 * 디버그 치트
 */
export const debugCheats: CheatCode[] = [
  {
    id: 'godmode',
    code: 'iddqd',
    name: '무적 모드',
    description: '게임 오버가 되지 않습니다',
    category: 'debug',
    action: {
      type: 'toggle',
      target: 'debug.godMode',
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'nolimits',
    code: 'idkfa',
    name: '제한 해제',
    description: '모든 행동 제한을 해제합니다',
    category: 'debug',
    action: {
      type: 'toggle',
      target: 'debug.noLimits',
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'showstats',
    code: 'stats',
    name: '통계 표시',
    description: '화면에 상세 통계를 표시합니다',
    category: 'debug',
    action: {
      type: 'toggle',
      target: 'debug.showStats',
    },
    enabled: true,
    requiresDebugMode: false,
  },
  {
    id: 'logall',
    code: 'verbose',
    name: '상세 로깅',
    description: '모든 이벤트를 콘솔에 출력합니다',
    category: 'debug',
    action: {
      type: 'toggle',
      target: 'debug.verboseLogging',
    },
    enabled: true,
    requiresDebugMode: true,
  },
  {
    id: 'reset',
    code: 'startover',
    name: '게임 리셋',
    description: '게임을 초기 상태로 리셋합니다',
    category: 'debug',
    action: {
      type: 'trigger',
      target: 'game.reset',
    },
    enabled: true,
    requiresDebugMode: true,
  },
];

/**
 * 재미 치트
 */
export const funCheats: CheatCode[] = [
  {
    id: 'rainbow',
    code: 'colorful',
    name: '레인보우 모드',
    description: 'UI에 레인보우 효과를 적용합니다',
    category: 'fun',
    action: {
      type: 'toggle',
      target: 'effects.rainbow',
    },
    enabled: true,
    requiresDebugMode: false,
  },
  {
    id: 'party',
    code: 'partyhard',
    name: '파티 모드',
    description: '화면에 파티 효과를 적용합니다',
    category: 'fun',
    action: {
      type: 'trigger',
      target: 'effects.party',
    },
    enabled: true,
    requiresDebugMode: false,
  },
  {
    id: 'bighead',
    code: 'bighead',
    name: '빅헤드 모드',
    description: '캐릭터 머리가 커집니다',
    category: 'fun',
    action: {
      type: 'toggle',
      target: 'effects.bigHead',
    },
    enabled: true,
    requiresDebugMode: false,
  },
  {
    id: 'flipscreen',
    code: 'upsidedown',
    name: '화면 뒤집기',
    description: '화면을 180도 뒤집습니다',
    category: 'fun',
    action: {
      type: 'toggle',
      target: 'effects.flipScreen',
    },
    enabled: true,
    requiresDebugMode: false,
  },
];

/**
 * 모든 치트 코드
 */
export const allCheats: CheatCode[] = [
  ...resourceCheats,
  ...timeCheats,
  ...progressionCheats,
  ...unlockCheats,
  ...debugCheats,
  ...funCheats,
];

// ============================================
// Cheat Code Utilities
// ============================================

/**
 * 코드로 치트 찾기
 */
export function findCheatByCode(code: string): CheatCode | undefined {
  return allCheats.find((c) => c.code.toLowerCase() === code.toLowerCase());
}

/**
 * ID로 치트 찾기
 */
export function findCheatById(id: string): CheatCode | undefined {
  return allCheats.find((c) => c.id === id);
}

/**
 * 카테고리별 치트 목록
 */
export function getCheatsByCategory(category: CheatCategory): CheatCode[] {
  return allCheats.filter((c) => c.category === category);
}

/**
 * 활성화된 치트 목록
 */
export function getEnabledCheats(): CheatCode[] {
  return allCheats.filter((c) => c.enabled);
}

/**
 * 디버그 모드 불필요한 치트 목록
 */
export function getNonDebugCheats(): CheatCode[] {
  return allCheats.filter((c) => !c.requiresDebugMode);
}

/**
 * Konami 코드 시퀀스
 */
export const KONAMI_CODE = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'b', 'a'];

/**
 * Konami 코드 체크
 */
export function checkKonamiCode(sequence: string[]): boolean {
  if (sequence.length !== KONAMI_CODE.length) return false;
  return sequence.every((key, i) => key.toLowerCase() === KONAMI_CODE[i]);
}
