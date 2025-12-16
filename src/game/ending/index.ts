/**
 * Chapter 11: Ending & Victory - Main Entry Point
 * 엔딩 및 승리 시스템 메인 엔트리 포인트
 *
 * 이 모듈은 VocaVision 시뮬레이터의 엔딩 시스템을 제공합니다.
 *
 * 주요 기능:
 * 1. 다중 엔딩 - 승리, 특별, 비밀, 패배
 * 2. 엔딩 조건 검사 - 자동 조건 평가
 * 3. 점수 및 등급 시스템
 * 4. 에필로그 및 후일담
 * 5. New Game Plus 설정
 */

// ============================================
// Type Exports
// ============================================

export * from './types';

// ============================================
// Endings Data
// ============================================

export {
  victoryEndings,
  specialEndings,
  secretEndings,
  gameOverReasons,
  victoryConditions,
  allEndings,
  getEndingById,
  getEndingsByType,
  getEndingsByTier,
  checkVictoryCondition,
} from './endings';

// ============================================
// Ending Manager
// ============================================

export {
  EndingManager,
  endingManager,
  type EndingCheckResult,
  type EndingTriggerResult,
  type EndingManagerListener,
} from './endingManager';

// ============================================
// 엔딩 UI 컴포넌트 Props
// ============================================

export interface EndingScreenProps {
  ending: {
    id: string;
    title: string;
    description: string;
    illustration: string;
    type: 'victory' | 'special' | 'secret' | 'defeat';
    tier: 'common' | 'rare' | 'epic' | 'legendary';
  };
  stats: {
    totalScore: number;
    playTime: number;
    daysPlayed: number;
    achievementsUnlocked: number;
  };
  grade: {
    rank: string;
    title: string;
    color: string;
  };
  onNewGame: () => void;
  onNewGamePlus: () => void;
  onMainMenu: () => void;
}

export interface EndingCreditsProps {
  ending: {
    id: string;
    title: string;
  };
  epilogue?: {
    title: string;
    content: string;
    illustration?: string;
  };
  onComplete: () => void;
  autoScroll?: boolean;
  scrollSpeed?: number;
}

export interface EndingRewardDisplayProps {
  rewards: Array<{
    type: string;
    value: string | number;
    icon: string;
    description: string;
  }>;
  onClaim: () => void;
  claimed: boolean;
}

export interface GameOverScreenProps {
  reason: {
    id: string;
    title: string;
    description: string;
    advice: string;
  };
  stats: {
    totalScore: number;
    daysPlayed: number;
  };
  canRetry: boolean;
  onRetry: () => void;
  onMainMenu: () => void;
}

export interface EndingGalleryProps {
  endings: Array<{
    id: string;
    title: string;
    thumbnail: string;
    unlocked: boolean;
    seen: boolean;
    tier: string;
    type: string;
  }>;
  onSelect: (endingId: string) => void;
  filterType?: string;
  sortBy?: 'tier' | 'type' | 'unlockDate';
}

export interface EndingProgressProps {
  progress: Record<string, number>;
  showHints?: boolean;
}

// ============================================
// 엔딩 통계 디스플레이
// ============================================

export interface PlaythroughStatsDisplayProps {
  stats: {
    totalScore: number;
    baseScore: number;
    endingBonus: number;
    timeBonus: number;
    efficiencyBonus: number;
    playTime: number;
    daysPlayed: number;
    totalUsers: number;
    premiumUsers: number;
    peakRevenue: number;
    totalRevenue: number;
    completedProjects: number;
    achievementsUnlocked: number;
    decisionsCount: number;
    crisisResolved: number;
    partnershipsFormed: number;
    eventsCompleted: number;
  };
  animate?: boolean;
  showBreakdown?: boolean;
}

// ============================================
// 엔딩 시스템 통합
// ============================================

import { EndingManager, endingManager, EndingCheckResult, EndingTriggerResult } from './endingManager';
import {
  Ending,
  EndingType,
  EndingTier,
  EndingGrade,
  EndingGradeInfo,
  ENDING_GRADES,
  getGradeFromScore,
  PlaythroughStats,
  EndingDisplayStats,
  toDisplayStats,
  NewGamePlusConfig,
} from './types';

// Re-export types for external use
export type {
  EndingGrade,
  EndingGradeInfo,
  EndingDisplayStats,
  EndingState,
} from './types';
export { ENDING_GRADES, getGradeFromScore, toDisplayStats } from './types';
import {
  victoryEndings,
  specialEndings,
  secretEndings,
  gameOverReasons,
  victoryConditions,
  allEndings,
  getEndingById,
  checkVictoryCondition,
} from './endings';

/**
 * 엔딩 시스템 통합 인터페이스
 */
export interface EndingSystem {
  // 관리자
  manager: EndingManager;

  // 데이터
  endings: {
    victory: typeof victoryEndings;
    special: typeof specialEndings;
    secret: typeof secretEndings;
    gameOver: typeof gameOverReasons;
    all: Ending[];
  };
  victoryConditions: typeof victoryConditions;

  // 메서드
  checkConditions: (gameState: any) => EndingCheckResult;
  triggerEnding: (endingId: string, gameState: any) => EndingTriggerResult;
  getEndingById: (id: string) => Ending | undefined;
  getProgress: () => Record<string, number>;
  getSeenEndings: () => string[];
  getUnlockedEndings: () => string[];
  isGameOver: () => boolean;
  reset: () => void;
  resetForNG: (config: NewGamePlusConfig) => void;
}

/**
 * 엔딩 시스템 생성
 */
export function createEndingSystem(): EndingSystem {
  return {
    manager: endingManager,

    endings: {
      victory: victoryEndings,
      special: specialEndings,
      secret: secretEndings,
      gameOver: gameOverReasons,
      all: allEndings,
    },
    victoryConditions,

    checkConditions: (gameState: any) => endingManager.checkEndingConditions(gameState),
    triggerEnding: (endingId: string, gameState: any) =>
      endingManager.triggerEnding(endingId, gameState),
    getEndingById,
    getProgress: () => endingManager.getEndingProgress(),
    getSeenEndings: () => endingManager.getSeenEndings(),
    getUnlockedEndings: () => endingManager.getUnlockedEndings(),
    isGameOver: () => endingManager.isGameOver(),
    reset: () => endingManager.reset(),
    resetForNG: (config: NewGamePlusConfig) => endingManager.resetForNewGamePlus(config),
  };
}

// 싱글톤 시스템 인스턴스
export const endingSystem = createEndingSystem();

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 엔딩 타입 한글명
 */
export function getEndingTypeLabel(type: EndingType): string {
  const labels: Record<EndingType, string> = {
    victory: '승리',
    special: '특별',
    secret: '비밀',
    defeat: '패배',
  };
  return labels[type] || type;
}

/**
 * 엔딩 티어 한글명
 */
export function getEndingTierLabel(tier: EndingTier): string {
  const labels: Record<EndingTier, string> = {
    legendary: '전설',
    epic: '훌륭함',
    great: '좋음',
    good: '괜찮음',
    neutral: '보통',
    bad: '나쁨',
    terrible: '최악',
  };
  return labels[tier] || tier;
}

/**
 * 엔딩 티어 색상
 */
export function getEndingTierColor(tier: EndingTier): string {
  const colors: Record<EndingTier, string> = {
    legendary: '#FFD700', // gold
    epic: '#A855F7', // purple
    great: '#3B82F6', // blue
    good: '#22C55E', // green
    neutral: '#9CA3AF', // gray
    bad: '#F97316', // orange
    terrible: '#EF4444', // red
  };
  return colors[tier] || '#9CA3AF';
}

/**
 * 점수를 포맷팅
 */
export function formatScore(score: number): string {
  return score.toLocaleString('ko-KR');
}

/**
 * 플레이 시간 포맷팅 (분 -> 시:분)
 */
export function formatPlayTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}시간 ${mins}분`;
  }
  return `${mins}분`;
}

/**
 * 엔딩 조건 요약 생성
 */
export function generateEndingHint(ending: Ending, currentProgress: number): string {
  if (currentProgress >= 100) {
    return '달성 가능!';
  }

  if (currentProgress >= 75) {
    return '거의 다 왔어요...';
  }

  if (currentProgress >= 50) {
    return '절반 이상 진행됨';
  }

  if (currentProgress >= 25) {
    return '조금씩 진전이 있습니다';
  }

  if (ending.hint) {
    return ending.hint;
  }

  return '아직 멀었습니다';
}

export default endingSystem;
