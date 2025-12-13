/**
 * Chapter 8: Save/Load & Persistence - Main Entry Point
 * 저장/로드 및 영속성 시스템 메인 엔트리 포인트
 *
 * 이 모듈은 VocaVision 시뮬레이터의 저장/로드 시스템을 제공합니다.
 *
 * 주요 기능:
 * 1. 다중 저장 슬롯 (10개 + 자동저장 + 빠른저장)
 * 2. 자동저장 기능 (설정 가능한 간격)
 * 3. 저장 데이터 압축 (LZ-String 기반)
 * 4. 저장 데이터 마이그레이션 (버전 호환성)
 * 5. 저장 데이터 검증 및 복구
 * 6. 내보내기/가져오기 (파일)
 * 7. 클라우드 동기화 (IndexedDB 로컬, Firebase/Supabase 확장 가능)
 */

// ============================================
// Type Exports
// ============================================

export * from './types';

// ============================================
// Save Manager
// ============================================

export { SaveManager, saveManager } from './saveManager';

// ============================================
// Compression Utilities
// ============================================

export {
  compressData,
  decompressData,
  formatDataSize,
  calculateCompressionRatio,
} from './compression';

// ============================================
// Migration System
// ============================================

export {
  saveMigrations,
  migrateData,
  canMigrate,
  getMigrationPreview,
  sanitizeSaveData,
  createMigrationBackup,
  restoreFromBackup,
} from './migration';

// ============================================
// Cloud Sync
// ============================================

export {
  CloudSyncManager,
  cloudSyncManager,
  IndexedDBProvider,
  type CloudProvider,
  type CloudSyncEvent,
  type CloudSyncEventListener,
  type CloudSyncEventType,
  type SyncConflict,
  type ConflictResolution,
} from './cloudSync';

// ============================================
// 통합 저장 시스템 관리자
// ============================================

import { saveManager, SaveManager } from './saveManager';
import { cloudSyncManager, CloudSyncManager } from './cloudSync';
import {
  SaveData,
  GameStateSave,
  ProgressionStateSave,
  SettingsStateSave,
  SaveSlotPreview,
  SaveResult,
  LoadResult,
  AutoSaveConfig,
  CloudSyncConfig,
  SAVE_CONSTANTS,
} from './types';

/**
 * 통합 저장 시스템
 * SaveManager와 CloudSyncManager를 조율
 */
export class SaveSystem {
  readonly local: SaveManager;
  readonly cloud: CloudSyncManager;

  private autoSaveTimer: ReturnType<typeof setInterval> | null = null;
  private lastAutoSave: Date | null = null;
  private autoSaveConfig: AutoSaveConfig = {
    enabled: true,
    intervalMinutes: 5,
    maxAutoSaves: 3,
    saveOnEvent: true,
    saveOnDayChange: true,
    saveOnQuit: true,
  };

  constructor() {
    this.local = saveManager;
    this.cloud = cloudSyncManager;
  }

  // ============================================
  // 초기화
  // ============================================

  async initialize(): Promise<void> {
    // 클라우드 동기화 초기화
    await this.cloud.initialize();

    // 자동저장 타이머 설정
    this.setupAutoSaveTimer();

    // 페이지 종료 시 저장
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handleBeforeUnload);
    }
  }

  private handleBeforeUnload = (): void => {
    if (this.autoSaveConfig.saveOnQuit) {
      // 동기적으로 저장해야 하므로 localStorage 직접 사용
      // 실제 저장은 현재 게임 상태를 가져와서 처리해야 함
      console.log('Saving on quit...');
    }
  };

  // ============================================
  // 저장/로드 래퍼
  // ============================================

  async save(
    slot: number,
    name: string,
    gameState: GameStateSave,
    progressionState: ProgressionStateSave,
    settingsState: SettingsStateSave,
  ): Promise<SaveResult> {
    const result = await this.local.save(slot, name, gameState, progressionState, settingsState);

    // 클라우드 동기화가 활성화되어 있으면 표시
    if (result.success && this.cloud.isEnabled()) {
      this.cloud.markChange();
    }

    return result;
  }

  async load(slot: number): Promise<LoadResult> {
    return this.local.load(slot);
  }

  async quickSave(
    gameState: GameStateSave,
    progressionState: ProgressionStateSave,
    settingsState: SettingsStateSave,
  ): Promise<SaveResult> {
    return this.local.quickSave(gameState, progressionState, settingsState);
  }

  async quickLoad(): Promise<LoadResult> {
    return this.local.quickLoad();
  }

  // ============================================
  // 자동저장
  // ============================================

  setAutoSaveConfig(config: Partial<AutoSaveConfig>): void {
    this.autoSaveConfig = { ...this.autoSaveConfig, ...config };
    this.local.setAutoSaveConfig(this.autoSaveConfig);
    this.setupAutoSaveTimer();
  }

  getAutoSaveConfig(): AutoSaveConfig {
    return { ...this.autoSaveConfig };
  }

  private setupAutoSaveTimer(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }

    if (this.autoSaveConfig.enabled && this.autoSaveConfig.intervalMinutes > 0) {
      const interval = this.autoSaveConfig.intervalMinutes * 60 * 1000;
      this.autoSaveTimer = setInterval(() => {
        this.triggerAutoSave();
      }, interval);
    }
  }

  private triggerAutoSave(): void {
    // 자동저장 이벤트 발생 - 실제 저장은 게임 루프에서 처리
    this.lastAutoSave = new Date();
    // 이벤트 발생 또는 콜백 호출
  }

  shouldAutoSave(
    trigger: 'interval' | 'event' | 'dayChange',
  ): boolean {
    if (!this.autoSaveConfig.enabled) return false;

    switch (trigger) {
      case 'interval':
        if (!this.lastAutoSave) return true;
        const elapsed = Date.now() - this.lastAutoSave.getTime();
        return elapsed >= this.autoSaveConfig.intervalMinutes * 60 * 1000;
      case 'event':
        return this.autoSaveConfig.saveOnEvent;
      case 'dayChange':
        return this.autoSaveConfig.saveOnDayChange;
      default:
        return false;
    }
  }

  async performAutoSave(
    gameState: GameStateSave,
    progressionState: ProgressionStateSave,
    settingsState: SettingsStateSave,
  ): Promise<SaveResult> {
    const result = await this.local.autoSave(gameState, progressionState, settingsState);
    if (result.success) {
      this.lastAutoSave = new Date();
    }
    return result;
  }

  // ============================================
  // 슬롯 관리
  // ============================================

  getSlots(): SaveSlotPreview[] {
    return this.local.getSlots();
  }

  getAutoSaveSlot(): SaveSlotPreview | null {
    return this.local.getAutoSaveSlot();
  }

  getQuickSaveSlot(): SaveSlotPreview | null {
    return this.local.getQuickSaveSlot();
  }

  deleteSlot(slot: number): boolean {
    const result = this.local.deleteSlot(slot);
    if (result && this.cloud.isEnabled()) {
      this.cloud.deleteSave(slot);
    }
    return result;
  }

  // ============================================
  // 내보내기/가져오기
  // ============================================

  async exportSave(slot: number): Promise<{ success: boolean; data?: string; filename?: string; error?: string }> {
    return this.local.exportSave(slot);
  }

  async importSave(data: string, targetSlot?: number): Promise<{ success: boolean; slot?: number; error?: string; warnings?: string[] }> {
    return this.local.importSave(data, targetSlot);
  }

  // ============================================
  // 클라우드 동기화
  // ============================================

  setCloudConfig(config: Partial<CloudSyncConfig>): void {
    this.cloud.setConfig(config);
  }

  getCloudConfig(): CloudSyncConfig {
    return this.cloud.getConfig();
  }

  async syncToCloud(): Promise<boolean> {
    return this.cloud.sync();
  }

  getCloudStatus() {
    return this.cloud.getStatus();
  }

  // ============================================
  // 유틸리티
  // ============================================

  hasAnySave(): boolean {
    const slots = this.getSlots();
    const autoSave = this.getAutoSaveSlot();
    const quickSave = this.getQuickSaveSlot();

    return slots.some((s) => !s.isEmpty) || autoSave !== null || quickSave !== null;
  }

  getMostRecentSave(): SaveSlotPreview | null {
    const allSlots: SaveSlotPreview[] = [
      ...this.getSlots().filter((s) => !s.isEmpty),
    ];

    const autoSave = this.getAutoSaveSlot();
    if (autoSave) allSlots.push(autoSave);

    const quickSave = this.getQuickSaveSlot();
    if (quickSave) allSlots.push(quickSave);

    if (allSlots.length === 0) return null;

    return allSlots.reduce((most, current) => {
      if (!most.timestamp) return current;
      if (!current.timestamp) return most;
      return current.timestamp > most.timestamp ? current : most;
    });
  }

  // ============================================
  // 정리
  // ============================================

  cleanup(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
    }

    this.local.cleanup();
    this.cloud.cleanup();
  }
}

// 싱글톤 인스턴스
export const saveSystem = new SaveSystem();

export default saveSystem;
