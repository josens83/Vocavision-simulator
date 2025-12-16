/**
 * Chapter 11: Ending & Victory - Type Definitions
 * 엔딩 및 승리 시스템 타입 정의
 */

// ============================================
// 엔딩 타입
// ============================================

export type EndingType =
  | 'victory'          // 승리
  | 'defeat'           // 패배
  | 'special'          // 특별 엔딩
  | 'secret';          // 비밀 엔딩

export type EndingTier =
  | 'legendary'        // 전설 (최고)
  | 'epic'             // 서사시 (훌륭함)
  | 'great'            // 좋음
  | 'good'             // 괜찮음
  | 'neutral'          // 보통
  | 'bad'              // 나쁨
  | 'terrible';        // 최악

// 등급 시스템 (점수 기반)
export type EndingGrade = 'S' | 'A' | 'B' | 'C' | 'D' | 'F';

export interface EndingGradeInfo {
  rank: EndingGrade;
  title: string;
  color: string;
  minScore: number;
}

export const ENDING_GRADES: EndingGradeInfo[] = [
  { rank: 'S', title: '전설적인', color: '#FFD700', minScore: 10000 },
  { rank: 'A', title: '훌륭한', color: '#A855F7', minScore: 7000 },
  { rank: 'B', title: '좋은', color: '#3B82F6', minScore: 5000 },
  { rank: 'C', title: '보통', color: '#22C55E', minScore: 3000 },
  { rank: 'D', title: '미흡한', color: '#6B7280', minScore: 1000 },
  { rank: 'F', title: '실패한', color: '#EF4444', minScore: 0 },
];

export function getGradeFromScore(score: number): EndingGradeInfo {
  return ENDING_GRADES.find(g => score >= g.minScore) || ENDING_GRADES[ENDING_GRADES.length - 1];
}

// ============================================
// 엔딩 조건
// ============================================

export interface EndingCondition {
  type: 'stat' | 'metric' | 'event' | 'time' | 'combination' | 'achievement';
  target: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'includes' | 'excludes';
  value: any;
  weight?: number;     // 점수 계산 시 가중치
}

export interface EndingRequirement {
  conditions: EndingCondition[];
  logic: 'and' | 'or';
}

// ============================================
// 엔딩 정의
// ============================================

export interface Ending {
  id: string;
  type: EndingType;
  tier: EndingTier;
  name: string;
  title: string;       // 표시 제목
  subtitle?: string;   // 부제
  description: string; // 간단한 설명
  narrative: string;   // 상세 스토리/에필로그
  epilogue?: EndingEpilogue;

  // 조건
  requirements: EndingRequirement;
  priority: number;    // 여러 엔딩 충족 시 우선순위

  // 보상
  rewards: EndingReward[];

  // 해금
  unlocksContent?: string[];
  unlocksAchievement?: string;
  unlocksEnding?: string[];  // 다른 엔딩 해금

  // 통계
  rarity: number;      // 희귀도 (낮을수록 희귀)
  averageDay?: number; // 평균 달성 일수

  // 표시
  icon: string;
  color: string;
  backgroundImage?: string;
  music?: string;
  animation?: string;
}

// ============================================
// 에필로그
// ============================================

export interface EndingEpilogue {
  scenes: EpilogueScene[];
  afterCredits?: string;
}

export interface EpilogueScene {
  id: string;
  title?: string;
  content: string;
  image?: string;
  characters?: string[];
  duration?: number;   // 밀리초
  choices?: EpilogueChoice[];
}

export interface EpilogueChoice {
  text: string;
  nextScene?: string;
  effect?: {
    type: string;
    value: any;
  };
}

// ============================================
// 엔딩 보상
// ============================================

export interface EndingReward {
  type: 'legacy_points' | 'unlock' | 'cosmetic' | 'title' | 'achievement' | 'mastery_xp';
  value: number | string;
  description?: string;
}

// ============================================
// 게임 오버 이유
// ============================================

export interface GameOverReason {
  id: string;
  name: string;
  description: string;
  icon: string;
  narrative: string;
  tips: string[];      // 다음에는 이렇게 해보세요
  relatedTutorial?: string;
}

// ============================================
// 승리 조건
// ============================================

export interface VictoryCondition {
  id: string;
  name: string;
  description: string;
  requirements: EndingCondition[];
  checkFrequency: 'tick' | 'day' | 'month' | 'event';
  rewards: EndingReward[];
  unlocksEnding: string;
}

// ============================================
// 플레이스루 통계
// ============================================

export interface PlaythroughStats {
  // 기본 정보
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalPlayTime: number;  // 초
  difficulty: string;
  seed?: string;

  // 비즈니스
  maxUsers: number;
  maxPremiumUsers: number;
  maxCash: number;
  maxRevenue: number;
  totalRevenue: number;
  totalExpenses: number;

  // 이벤트
  eventsEncountered: number;
  eventsSucceeded: number;
  eventsFailed: number;
  crisesOvercome: number;

  // NPC
  npcsMet: number;
  maxRelationships: number;
  partnershipsFormed: number;

  // 스킬
  skillsLeveled: number;
  maxSkillLevel: number;
  mostUsedSkill: string;

  // 기타
  decisionsMade: number;
  tasksCompleted: number;
  achievementsUnlocked: number;

  // 점수 (UI용)
  totalScore?: number;
  grade?: EndingGrade;
}

/**
 * UI용 간소화된 통계 인터페이스
 */
export interface EndingDisplayStats {
  totalScore: number;
  daysPlayed: number;
  playTime: number;  // 초
  totalRevenue: number;
  maxUsers: number;
  actionsPerformed: number;
  achievementsUnlocked: number;
  grade: EndingGrade;
}

/**
 * PlaythroughStats에서 EndingDisplayStats로 변환
 */
export function toDisplayStats(stats: Partial<PlaythroughStats>): EndingDisplayStats {
  const score = stats.totalScore || 0;
  const gradeInfo = getGradeFromScore(score);

  return {
    totalScore: score,
    daysPlayed: stats.totalDays || 0,
    playTime: stats.totalPlayTime || 0,
    totalRevenue: stats.totalRevenue || 0,
    maxUsers: stats.maxUsers || 0,
    actionsPerformed: stats.tasksCompleted || 0,
    achievementsUnlocked: stats.achievementsUnlocked || 0,
    grade: gradeInfo.rank,
  };
}

// ============================================
// 엔딩 결과
// ============================================

export interface EndingResult {
  ending: Ending;
  stats: PlaythroughStats;
  score: number;
  grade: string;       // S, A, B, C, D, F
  rewards: EndingReward[];
  unlockedContent: string[];
  newAchievements: string[];
  comparisonToAverage?: {
    metric: string;
    yourValue: number;
    average: number;
    percentile: number;
  }[];
}

// ============================================
// 뉴게임+ 설정
// ============================================

export interface NewGamePlusConfig {
  enabled: boolean;
  tier: number;        // NG+1, NG+2 등

  // 유지되는 것들
  retainSkills: boolean;
  skillRetentionPercent: number;
  retainCash: boolean;
  cashRetentionPercent: number;
  retainUnlocks: boolean;
  retainRelationships: boolean;
  relationshipRetentionPercent: number;

  // 변경되는 것들
  difficultyMultiplier: number;
  eventFrequencyMultiplier: number;
  costMultiplier: number;
  rewardMultiplier: number;

  // 새로운 콘텐츠
  exclusiveEvents: string[];
  exclusiveNpcs: string[];
  exclusiveEndings: string[];

  // 모디파이어
  activeModifiers: string[];
}

export const DEFAULT_NEWGAMEPLUS_CONFIG: NewGamePlusConfig = {
  enabled: false,
  tier: 0,
  retainSkills: true,
  skillRetentionPercent: 30,
  retainCash: false,
  cashRetentionPercent: 0,
  retainUnlocks: true,
  retainRelationships: false,
  relationshipRetentionPercent: 0,
  difficultyMultiplier: 1.2,
  eventFrequencyMultiplier: 1.1,
  costMultiplier: 1.1,
  rewardMultiplier: 1.2,
  exclusiveEvents: [],
  exclusiveNpcs: [],
  exclusiveEndings: [],
  activeModifiers: [],
};

// ============================================
// 엔딩 이벤트
// ============================================

export type EndingEventType =
  | 'game_over'
  | 'victory_achieved'
  | 'ending_unlocked'
  | 'ending_viewed'
  | 'epilogue_completed'
  | 'credits_completed'
  | 'newgameplus_started';

export interface EndingEvent {
  type: EndingEventType;
  endingId?: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}

export type EndingEventListener = (event: EndingEvent) => void;

// ============================================
// 엔딩 시스템 상태
// ============================================

export interface EndingSystemState {
  seenEndings: string[];
  unlockedEndings: string[];
  lastEnding: EndingResult | null;
  totalPlaythroughs: number;
  victoryCount: number;
  defeatCount: number;
  newGamePlusTier: number;
  bestScores: Record<string, number>;
}

// Alias for backwards compatibility
export type EndingState = EndingSystemState;

// ============================================
// 상수
// ============================================

export const ENDING_CONSTANTS = {
  MAX_NEWGAMEPLUS_TIER: 10,
  SCORE_MULTIPLIER_PER_NG_TIER: 1.5,
  CREDITS_DURATION: 60000,  // 1분
  AUTOSAVE_ON_ENDING: true,
};
