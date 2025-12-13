/**
 * Chapter 8: Save/Load & Persistence - Migration System
 * 저장 데이터 마이그레이션 시스템
 */

import { SaveData, SaveMigration, MigrationResult, SAVE_CONSTANTS } from './types';

// ============================================
// 마이그레이션 함수들
// ============================================

/**
 * 0.9.0 -> 0.9.5 마이그레이션
 * - progressionState 추가
 * - meta.version 형식 변경
 */
function migrate_0_9_0_to_0_9_5(data: SaveData): SaveData {
  const migrated = { ...data };

  // progressionState가 없으면 기본값 추가
  if (!migrated.progressionState) {
    migrated.progressionState = {
      achievements: {
        unlocked: [],
        progress: {},
        points: 0,
      },
      unlocks: {
        permanent: [],
        perRun: [],
      },
      dailyGoals: {
        lastCheckIn: null,
        currentGoals: [],
        streaks: {},
      },
      metaProgression: {
        upgradeLevels: {},
        unlockedKnowledge: [],
        masteryXP: {},
        playerStats: {},
        legacyPoints: 0,
      },
    };
  }

  // 버전 업데이트
  migrated.header.version = '0.9.5';

  return migrated;
}

/**
 * 0.9.5 -> 1.0.0 마이그레이션
 * - settingsState 추가
 * - metaState 구조 변경
 * - gameState.progress 구조 변경
 */
function migrate_0_9_5_to_1_0_0(data: SaveData): SaveData {
  const migrated = { ...data };

  // settingsState가 없으면 기본값 추가
  if (!migrated.settingsState) {
    migrated.settingsState = {
      audio: {
        masterVolume: 0.8,
        musicVolume: 0.6,
        sfxVolume: 0.8,
        ambienceVolume: 0.5,
        muted: false,
      },
      display: {
        theme: 'auto',
        fontSize: 'medium',
        animations: true,
        reducedMotion: false,
      },
      gameplay: {
        autoSave: true,
        autoSaveInterval: 5,
        confirmActions: true,
        showTutorials: true,
        pauseOnEvent: true,
      },
      accessibility: {
        highContrast: false,
        screenReader: false,
        colorBlindMode: 'none',
        keyboardNavigation: true,
      },
    };
  }

  // metaState 구조 업데이트
  if (!migrated.metaState) {
    migrated.metaState = {
      firstPlayDate: new Date().toISOString(),
      totalPlaythroughs: 0,
      totalPlayTime: migrated.gameState?.meta?.playTime || 0,
      endingsSeen: [],
      achievementPoints: migrated.progressionState?.achievements?.points || 0,
      lastPlayDate: new Date().toISOString(),
    };
  }

  // gameState.progress에서 achievements를 string[] 형태로 변환
  if (migrated.gameState?.progress?.achievements) {
    const achievements = migrated.gameState.progress.achievements;
    if (Array.isArray(achievements) && achievements.length > 0 && typeof achievements[0] === 'object') {
      migrated.gameState.progress.achievements = achievements.map((a: any) => a.id || a);
    }
  }

  // 버전 업데이트
  migrated.header.version = '1.0.0';

  return migrated;
}

// ============================================
// 마이그레이션 레지스트리
// ============================================

export const saveMigrations: SaveMigration[] = [
  {
    fromVersion: '0.9.0',
    toVersion: '0.9.5',
    migrate: migrate_0_9_0_to_0_9_5,
    description: 'progressionState 추가, 버전 형식 변경',
  },
  {
    fromVersion: '0.9.5',
    toVersion: '1.0.0',
    migrate: migrate_0_9_5_to_1_0_0,
    description: 'settingsState 추가, metaState 구조 변경, achievements 형식 변경',
  },
];

// ============================================
// 마이그레이션 실행
// ============================================

/**
 * 버전 비교 함수
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 !== p2) return p1 - p2;
  }

  return 0;
}

/**
 * 필요한 마이그레이션 찾기
 */
function findMigrationPath(fromVersion: string, toVersion: string): SaveMigration[] {
  const path: SaveMigration[] = [];
  let currentVersion = fromVersion;

  while (compareVersions(currentVersion, toVersion) < 0) {
    const migration = saveMigrations.find((m) => m.fromVersion === currentVersion);
    if (!migration) {
      throw new Error(`마이그레이션 경로를 찾을 수 없습니다: ${currentVersion} -> ${toVersion}`);
    }
    path.push(migration);
    currentVersion = migration.toVersion;
  }

  return path;
}

/**
 * 데이터 마이그레이션 실행
 */
export function migrateData(data: SaveData, targetVersion: string): SaveData {
  const fromVersion = data.header.version;

  if (fromVersion === targetVersion) {
    return data;
  }

  if (compareVersions(fromVersion, targetVersion) > 0) {
    throw new Error(`다운그레이드는 지원하지 않습니다: ${fromVersion} -> ${targetVersion}`);
  }

  const migrationPath = findMigrationPath(fromVersion, targetVersion);
  let migratedData = data;

  for (const migration of migrationPath) {
    console.log(`Migrating from ${migration.fromVersion} to ${migration.toVersion}`);
    migratedData = migration.migrate(migratedData);
  }

  return migratedData;
}

/**
 * 마이그레이션 가능 여부 확인
 */
export function canMigrate(fromVersion: string, toVersion: string): boolean {
  try {
    findMigrationPath(fromVersion, toVersion);
    return true;
  } catch {
    return false;
  }
}

/**
 * 마이그레이션 미리보기
 */
export function getMigrationPreview(fromVersion: string, toVersion: string): MigrationResult {
  try {
    const path = findMigrationPath(fromVersion, toVersion);
    return {
      success: true,
      fromVersion,
      toVersion,
      warnings: path.map((m) => `${m.fromVersion} -> ${m.toVersion}: ${m.description}`),
    };
  } catch (error) {
    return {
      success: false,
      fromVersion,
      toVersion,
      warnings: [],
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
}

// ============================================
// 데이터 정합성 검사 및 복구
// ============================================

/**
 * 저장 데이터 정합성 검사 및 복구
 */
export function sanitizeSaveData(data: SaveData): { data: SaveData; fixes: string[] } {
  const fixes: string[] = [];
  const sanitized = JSON.parse(JSON.stringify(data)) as SaveData;

  // 헤더 검사
  if (!sanitized.header) {
    sanitized.header = {
      version: SAVE_CONSTANTS.CURRENT_VERSION,
      timestamp: new Date(),
      slot: 0,
      name: '복구된 저장',
      checksum: '',
      compressed: false,
      encrypted: false,
    };
    fixes.push('헤더 복구');
  }

  // gameState 검사
  if (!sanitized.gameState) {
    fixes.push('게임 상태가 누락되어 복구할 수 없습니다.');
    throw new Error('게임 상태가 누락되었습니다.');
  }

  // 필수 필드 검사
  if (!sanitized.gameState.time) {
    sanitized.gameState.time = {
      currentDate: new Date().toISOString(),
      dayPhase: 'morning',
      totalDays: 1,
      tick: 0,
      isPaused: true,
      speed: 1,
    };
    fixes.push('시간 상태 복구');
  }

  if (!sanitized.gameState.player) {
    sanitized.gameState.player = {};
    fixes.push('플레이어 상태 복구 (기본값)');
  }

  if (!sanitized.gameState.business) {
    sanitized.gameState.business = {};
    fixes.push('비즈니스 상태 복구 (기본값)');
  }

  if (!sanitized.gameState.progress) {
    sanitized.gameState.progress = {
      completedEvents: [],
      unlockedFeatures: [],
      achievements: [],
      milestones: [],
    };
    fixes.push('진행 상태 복구');
  }

  // progressionState 검사
  if (!sanitized.progressionState) {
    sanitized.progressionState = {
      achievements: { unlocked: [], progress: {}, points: 0 },
      unlocks: { permanent: [], perRun: [] },
      dailyGoals: { lastCheckIn: null, currentGoals: [], streaks: {} },
      metaProgression: {
        upgradeLevels: {},
        unlockedKnowledge: [],
        masteryXP: {},
        playerStats: {},
        legacyPoints: 0,
      },
    };
    fixes.push('진행 시스템 상태 복구');
  }

  // settingsState 검사
  if (!sanitized.settingsState) {
    sanitized.settingsState = {
      audio: { masterVolume: 0.8, musicVolume: 0.6, sfxVolume: 0.8, ambienceVolume: 0.5, muted: false },
      display: { theme: 'auto', fontSize: 'medium', animations: true, reducedMotion: false },
      gameplay: { autoSave: true, autoSaveInterval: 5, confirmActions: true, showTutorials: true, pauseOnEvent: true },
      accessibility: { highContrast: false, screenReader: false, colorBlindMode: 'none', keyboardNavigation: true },
    };
    fixes.push('설정 상태 복구');
  }

  // metaState 검사
  if (!sanitized.metaState) {
    sanitized.metaState = {
      firstPlayDate: new Date().toISOString(),
      totalPlaythroughs: 0,
      totalPlayTime: 0,
      endingsSeen: [],
      achievementPoints: 0,
      lastPlayDate: new Date().toISOString(),
    };
    fixes.push('메타 상태 복구');
  }

  // 숫자 값 범위 검사
  const gameState = sanitized.gameState as any;

  // 현금 범위 검사
  if (gameState.business?.finance?.cash !== undefined) {
    if (typeof gameState.business.finance.cash !== 'number') {
      gameState.business.finance.cash = 0;
      fixes.push('현금 값 타입 수정');
    }
  }

  // 사용자 수 음수 방지
  if (gameState.business?.users?.total !== undefined) {
    if (gameState.business.users.total < 0) {
      gameState.business.users.total = 0;
      fixes.push('사용자 수 음수 수정');
    }
  }

  // 일수 최소값
  if (gameState.time?.totalDays !== undefined) {
    if (gameState.time.totalDays < 1) {
      gameState.time.totalDays = 1;
      fixes.push('총 일수 최소값 수정');
    }
  }

  return { data: sanitized, fixes };
}

// ============================================
// 백업 생성
// ============================================

/**
 * 마이그레이션 전 백업 생성
 */
export function createMigrationBackup(data: SaveData): string {
  const backup = {
    ...data,
    _backup: {
      createdAt: new Date().toISOString(),
      originalVersion: data.header.version,
      reason: 'pre_migration',
    },
  };

  return JSON.stringify(backup);
}

/**
 * 백업에서 복원
 */
export function restoreFromBackup(backupJson: string): SaveData {
  const backup = JSON.parse(backupJson);
  delete backup._backup;
  return backup as SaveData;
}
