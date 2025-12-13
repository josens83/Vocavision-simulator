/**
 * Chapter 8: Save/Load & Persistence - Type Definitions
 * 저장/로드 및 영속성 시스템 타입 정의
 */

// ============================================
// 저장 슬롯 타입
// ============================================

export interface SaveSlot {
  id: number;
  name: string;
  isEmpty: boolean;
  timestamp: Date;
  playTime: number; // 총 플레이 시간 (초)
  difficulty: string;
  day: number;
  users: number;
  cash: number;
  thumbnail?: string; // Base64 스크린샷
  version: string;
  checksum: string;
}

export interface SaveSlotPreview {
  id: number;
  name: string;
  isEmpty: boolean;
  timestamp: Date | null;
  preview: {
    day: number;
    users: number;
    cash: number;
    difficulty: string;
    playTime: number;
  } | null;
}

// ============================================
// 저장 데이터 타입
// ============================================

export interface SaveHeader {
  version: string;
  timestamp: Date;
  slot: number;
  name: string;
  checksum: string;
  compressed: boolean;
  encrypted: boolean;
}

export interface SaveData {
  header: SaveHeader;
  gameState: GameStateSave;
  progressionState: ProgressionStateSave;
  settingsState: SettingsStateSave;
  metaState: MetaStateSave;
}

export interface GameStateSave {
  meta: {
    version: string;
    saveDate: string;
    playTime: number;
    difficulty: string;
    saveName: string;
    slot: number;
  };
  time: {
    currentDate: string;
    dayPhase: string;
    totalDays: number;
    tick: number;
    isPaused: boolean;
    speed: number;
  };
  player: Record<string, unknown>;
  business: Record<string, unknown>;
  progress: {
    completedEvents: string[];
    unlockedFeatures: string[];
    achievements: string[];
    milestones: string[];
  };
  relationships: Record<string, unknown>;
  history: Record<string, unknown>;
  scheduledEvents: unknown[];
  delayedEffects: unknown[];
  gameOver: boolean;
  gameOverReason: string;
  victory: boolean;
  victoryType?: string;
}

export interface ProgressionStateSave {
  achievements: {
    unlocked: string[];
    progress: Record<string, number>;
    points: number;
  };
  unlocks: {
    permanent: string[];
    perRun: string[];
  };
  dailyGoals: {
    lastCheckIn: string | null;
    currentGoals: unknown[];
    streaks: Record<string, unknown>;
  };
  metaProgression: {
    upgradeLevels: Record<string, number>;
    unlockedKnowledge: string[];
    masteryXP: Record<string, number>;
    playerStats: Record<string, number>;
    legacyPoints: number;
  };
}

export interface SettingsStateSave {
  audio: {
    masterVolume: number;
    musicVolume: number;
    sfxVolume: number;
    ambienceVolume: number;
    muted: boolean;
  };
  display: {
    theme: string;
    fontSize: string;
    animations: boolean;
    reducedMotion: boolean;
  };
  gameplay: {
    autoSave: boolean;
    autoSaveInterval: number;
    confirmActions: boolean;
    showTutorials: boolean;
    pauseOnEvent: boolean;
  };
  accessibility: {
    highContrast: boolean;
    screenReader: boolean;
    colorBlindMode: string;
    keyboardNavigation: boolean;
  };
}

export interface MetaStateSave {
  firstPlayDate: string;
  totalPlaythroughs: number;
  totalPlayTime: number;
  endingsSeen: string[];
  achievementPoints: number;
  lastPlayDate: string;
}

// ============================================
// 자동저장 설정
// ============================================

export interface AutoSaveConfig {
  enabled: boolean;
  intervalMinutes: number;
  maxAutoSaves: number;
  saveOnEvent: boolean;
  saveOnDayChange: boolean;
  saveOnQuit: boolean;
}

export const DEFAULT_AUTOSAVE_CONFIG: AutoSaveConfig = {
  enabled: true,
  intervalMinutes: 5,
  maxAutoSaves: 3,
  saveOnEvent: true,
  saveOnDayChange: true,
  saveOnQuit: true,
};

// ============================================
// 클라우드 동기화
// ============================================

export interface CloudSyncConfig {
  enabled: boolean;
  provider: 'none' | 'local' | 'firebase' | 'supabase';
  autoSync: boolean;
  syncInterval: number; // 분
  conflictResolution: 'local' | 'cloud' | 'newest' | 'ask';
}

export interface CloudSyncStatus {
  lastSync: Date | null;
  syncing: boolean;
  error: string | null;
  pendingChanges: number;
}

export const DEFAULT_CLOUD_SYNC_CONFIG: CloudSyncConfig = {
  enabled: false,
  provider: 'local',
  autoSync: false,
  syncInterval: 15,
  conflictResolution: 'newest',
};

// ============================================
// 저장 작업 결과
// ============================================

export interface SaveResult {
  success: boolean;
  slot: number;
  timestamp: Date;
  error?: string;
  size?: number; // 바이트
}

export interface LoadResult {
  success: boolean;
  slot: number;
  data?: SaveData;
  error?: string;
  migrated?: boolean;
  originalVersion?: string;
}

export interface ExportResult {
  success: boolean;
  data?: string;
  filename?: string;
  error?: string;
}

export interface ImportResult {
  success: boolean;
  slot?: number;
  error?: string;
  warnings?: string[];
}

// ============================================
// 저장 마이그레이션
// ============================================

export interface SaveMigration {
  fromVersion: string;
  toVersion: string;
  migrate: (data: SaveData) => SaveData;
  description: string;
}

export interface MigrationResult {
  success: boolean;
  fromVersion: string;
  toVersion: string;
  warnings: string[];
  error?: string;
}

// ============================================
// 저장 검증
// ============================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  fatal: boolean;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}

// ============================================
// 저장 이벤트
// ============================================

export type SaveEventType =
  | 'save_start'
  | 'save_complete'
  | 'save_error'
  | 'load_start'
  | 'load_complete'
  | 'load_error'
  | 'autosave'
  | 'sync_start'
  | 'sync_complete'
  | 'sync_error'
  | 'migration_complete'
  | 'slot_deleted';

export interface SaveEvent {
  type: SaveEventType;
  slot?: number;
  timestamp: Date;
  details?: Record<string, unknown>;
}

export type SaveEventListener = (event: SaveEvent) => void;

// ============================================
// 저장 시스템 상태
// ============================================

export interface SaveSystemState {
  slots: SaveSlot[];
  autoSaveSlot: SaveSlot | null;
  quickSaveSlot: SaveSlot | null;
  cloudSyncStatus: CloudSyncStatus;
  lastOperation: SaveEvent | null;
  isProcessing: boolean;
}

// ============================================
// 상수
// ============================================

export const SAVE_CONSTANTS = {
  MAX_SLOTS: 10,
  AUTO_SAVE_SLOT: -1,
  QUICK_SAVE_SLOT: -2,
  CURRENT_VERSION: '1.0.0',
  STORAGE_KEY_PREFIX: 'vocavision_save_',
  SETTINGS_KEY: 'vocavision_settings',
  META_KEY: 'vocavision_meta',
  MAX_SAVE_SIZE: 5 * 1024 * 1024, // 5MB
  CHECKSUM_ALGORITHM: 'SHA-256',
};

export const SUPPORTED_VERSIONS = ['0.9.0', '0.9.5', '1.0.0'];
