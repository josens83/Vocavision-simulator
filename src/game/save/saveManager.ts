/**
 * Chapter 8: Save/Load & Persistence - Save Manager
 * 저장 관리자 - 저장/로드/자동저장/클라우드 동기화
 */

import {
  SaveSlot,
  SaveSlotPreview,
  SaveData,
  SaveHeader,
  GameStateSave,
  ProgressionStateSave,
  SettingsStateSave,
  MetaStateSave,
  AutoSaveConfig,
  CloudSyncConfig,
  CloudSyncStatus,
  SaveResult,
  LoadResult,
  ExportResult,
  ImportResult,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  SaveEvent,
  SaveEventListener,
  SaveEventType,
  SaveSystemState,
  SAVE_CONSTANTS,
  DEFAULT_AUTOSAVE_CONFIG,
  DEFAULT_CLOUD_SYNC_CONFIG,
  SUPPORTED_VERSIONS,
} from './types';
import { saveMigrations, migrateData } from './migration';
import { compressData, decompressData } from './compression';

// ============================================
// 저장 관리자 클래스
// ============================================

export class SaveManager {
  private slots: Map<number, SaveSlot> = new Map();
  private autoSaveConfig: AutoSaveConfig = DEFAULT_AUTOSAVE_CONFIG;
  private cloudSyncConfig: CloudSyncConfig = DEFAULT_CLOUD_SYNC_CONFIG;
  private cloudSyncStatus: CloudSyncStatus = {
    lastSync: null,
    syncing: false,
    error: null,
    pendingChanges: 0,
  };
  private eventListeners: Set<SaveEventListener> = new Set();
  private autoSaveTimer: ReturnType<typeof setInterval> | null = null;
  private isProcessing: boolean = false;

  constructor() {
    this.loadSlotIndex();
    this.setupAutoSave();
  }

  // ============================================
  // 이벤트 시스템
  // ============================================

  addEventListener(listener: SaveEventListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  private emit(type: SaveEventType, slot?: number, details?: Record<string, unknown>): void {
    const event: SaveEvent = {
      type,
      slot,
      timestamp: new Date(),
      details,
    };
    this.eventListeners.forEach((listener) => listener(event));
  }

  // ============================================
  // 슬롯 관리
  // ============================================

  private loadSlotIndex(): void {
    try {
      const indexJson = localStorage.getItem(`${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}index`);
      if (indexJson) {
        const index = JSON.parse(indexJson) as SaveSlot[];
        index.forEach((slot) => {
          this.slots.set(slot.id, {
            ...slot,
            timestamp: new Date(slot.timestamp),
          });
        });
      }
    } catch (error) {
      console.error('Failed to load save slot index:', error);
    }
  }

  private saveSlotIndex(): void {
    try {
      const index = Array.from(this.slots.values());
      localStorage.setItem(`${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}index`, JSON.stringify(index));
    } catch (error) {
      console.error('Failed to save slot index:', error);
    }
  }

  getSlots(): SaveSlotPreview[] {
    const previews: SaveSlotPreview[] = [];

    for (let i = 0; i < SAVE_CONSTANTS.MAX_SLOTS; i++) {
      const slot = this.slots.get(i);
      if (slot && !slot.isEmpty) {
        previews.push({
          id: i,
          name: slot.name,
          isEmpty: false,
          timestamp: slot.timestamp,
          preview: {
            day: slot.day,
            users: slot.users,
            cash: slot.cash,
            difficulty: slot.difficulty,
            playTime: slot.playTime,
          },
        });
      } else {
        previews.push({
          id: i,
          name: `슬롯 ${i + 1}`,
          isEmpty: true,
          timestamp: null,
          preview: null,
        });
      }
    }

    return previews;
  }

  getAutoSaveSlot(): SaveSlotPreview | null {
    const slot = this.slots.get(SAVE_CONSTANTS.AUTO_SAVE_SLOT);
    if (!slot || slot.isEmpty) return null;

    return {
      id: SAVE_CONSTANTS.AUTO_SAVE_SLOT,
      name: '자동 저장',
      isEmpty: false,
      timestamp: slot.timestamp,
      preview: {
        day: slot.day,
        users: slot.users,
        cash: slot.cash,
        difficulty: slot.difficulty,
        playTime: slot.playTime,
      },
    };
  }

  getQuickSaveSlot(): SaveSlotPreview | null {
    const slot = this.slots.get(SAVE_CONSTANTS.QUICK_SAVE_SLOT);
    if (!slot || slot.isEmpty) return null;

    return {
      id: SAVE_CONSTANTS.QUICK_SAVE_SLOT,
      name: '빠른 저장',
      isEmpty: false,
      timestamp: slot.timestamp,
      preview: {
        day: slot.day,
        users: slot.users,
        cash: slot.cash,
        difficulty: slot.difficulty,
        playTime: slot.playTime,
      },
    };
  }

  // ============================================
  // 저장
  // ============================================

  async save(
    slot: number,
    name: string,
    gameState: GameStateSave,
    progressionState: ProgressionStateSave,
    settingsState: SettingsStateSave,
  ): Promise<SaveResult> {
    if (this.isProcessing) {
      return { success: false, slot, timestamp: new Date(), error: '다른 저장 작업이 진행 중입니다.' };
    }

    this.isProcessing = true;
    this.emit('save_start', slot);

    try {
      // 메타 상태 로드 또는 생성
      const metaState = this.loadMetaState();

      // 저장 데이터 구성
      const saveData: SaveData = {
        header: {
          version: SAVE_CONSTANTS.CURRENT_VERSION,
          timestamp: new Date(),
          slot,
          name,
          checksum: '',
          compressed: true,
          encrypted: false,
        },
        gameState,
        progressionState,
        settingsState,
        metaState,
      };

      // 체크섬 계산
      saveData.header.checksum = await this.calculateChecksum(saveData);

      // 압축
      const compressed = await compressData(JSON.stringify(saveData));

      // 크기 확인
      if (compressed.length > SAVE_CONSTANTS.MAX_SAVE_SIZE) {
        throw new Error('저장 데이터가 최대 크기를 초과했습니다.');
      }

      // 저장
      const storageKey = `${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}${slot}`;
      localStorage.setItem(storageKey, compressed);

      // 슬롯 정보 업데이트
      const slotInfo: SaveSlot = {
        id: slot,
        name,
        isEmpty: false,
        timestamp: new Date(),
        playTime: gameState.meta.playTime,
        difficulty: gameState.meta.difficulty,
        day: gameState.time.totalDays,
        users: (gameState.business as any).users?.total || 0,
        cash: (gameState.business as any).finance?.cash || 0,
        version: SAVE_CONSTANTS.CURRENT_VERSION,
        checksum: saveData.header.checksum,
      };

      this.slots.set(slot, slotInfo);
      this.saveSlotIndex();

      // 메타 상태 업데이트
      this.updateMetaState(metaState);

      this.emit('save_complete', slot, { size: compressed.length });

      return {
        success: true,
        slot,
        timestamp: new Date(),
        size: compressed.length,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      this.emit('save_error', slot, { error: errorMessage });
      return { success: false, slot, timestamp: new Date(), error: errorMessage };
    } finally {
      this.isProcessing = false;
    }
  }

  async quickSave(
    gameState: GameStateSave,
    progressionState: ProgressionStateSave,
    settingsState: SettingsStateSave,
  ): Promise<SaveResult> {
    return this.save(
      SAVE_CONSTANTS.QUICK_SAVE_SLOT,
      '빠른 저장',
      gameState,
      progressionState,
      settingsState,
    );
  }

  async autoSave(
    gameState: GameStateSave,
    progressionState: ProgressionStateSave,
    settingsState: SettingsStateSave,
  ): Promise<SaveResult> {
    if (!this.autoSaveConfig.enabled) {
      return { success: false, slot: SAVE_CONSTANTS.AUTO_SAVE_SLOT, timestamp: new Date(), error: '자동 저장이 비활성화되어 있습니다.' };
    }

    const result = await this.save(
      SAVE_CONSTANTS.AUTO_SAVE_SLOT,
      '자동 저장',
      gameState,
      progressionState,
      settingsState,
    );

    if (result.success) {
      this.emit('autosave', SAVE_CONSTANTS.AUTO_SAVE_SLOT);
    }

    return result;
  }

  // ============================================
  // 로드
  // ============================================

  async load(slot: number): Promise<LoadResult> {
    if (this.isProcessing) {
      return { success: false, slot, error: '다른 작업이 진행 중입니다.' };
    }

    this.isProcessing = true;
    this.emit('load_start', slot);

    try {
      const storageKey = `${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}${slot}`;
      const compressed = localStorage.getItem(storageKey);

      if (!compressed) {
        throw new Error('저장 데이터를 찾을 수 없습니다.');
      }

      // 압축 해제
      const jsonString = await decompressData(compressed);
      let saveData: SaveData = JSON.parse(jsonString);

      // 버전 확인 및 마이그레이션
      let migrated = false;
      let originalVersion = saveData.header.version;

      if (saveData.header.version !== SAVE_CONSTANTS.CURRENT_VERSION) {
        if (!SUPPORTED_VERSIONS.includes(saveData.header.version)) {
          throw new Error(`지원하지 않는 버전입니다: ${saveData.header.version}`);
        }

        saveData = migrateData(saveData, SAVE_CONSTANTS.CURRENT_VERSION);
        migrated = true;
      }

      // 체크섬 검증
      const expectedChecksum = saveData.header.checksum;
      saveData.header.checksum = '';
      const actualChecksum = await this.calculateChecksum(saveData);

      if (expectedChecksum !== actualChecksum) {
        console.warn('저장 데이터 체크섬 불일치. 데이터가 손상되었을 수 있습니다.');
      }

      saveData.header.checksum = expectedChecksum;

      // 데이터 검증
      const validation = this.validateSaveData(saveData);
      if (!validation.valid) {
        const fatalErrors = validation.errors.filter((e) => e.fatal);
        if (fatalErrors.length > 0) {
          throw new Error(`저장 데이터 검증 실패: ${fatalErrors[0].message}`);
        }
      }

      this.emit('load_complete', slot, { migrated, originalVersion });

      return {
        success: true,
        slot,
        data: saveData,
        migrated,
        originalVersion,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      this.emit('load_error', slot, { error: errorMessage });
      return { success: false, slot, error: errorMessage };
    } finally {
      this.isProcessing = false;
    }
  }

  async quickLoad(): Promise<LoadResult> {
    return this.load(SAVE_CONSTANTS.QUICK_SAVE_SLOT);
  }

  async loadAutoSave(): Promise<LoadResult> {
    return this.load(SAVE_CONSTANTS.AUTO_SAVE_SLOT);
  }

  // ============================================
  // 삭제
  // ============================================

  deleteSlot(slot: number): boolean {
    try {
      const storageKey = `${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}${slot}`;
      localStorage.removeItem(storageKey);

      this.slots.delete(slot);
      this.saveSlotIndex();

      this.emit('slot_deleted', slot);

      return true;
    } catch (error) {
      console.error('Failed to delete save slot:', error);
      return false;
    }
  }

  deleteAllSlots(): boolean {
    try {
      for (let i = -2; i < SAVE_CONSTANTS.MAX_SLOTS; i++) {
        const storageKey = `${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}${i}`;
        localStorage.removeItem(storageKey);
      }

      this.slots.clear();
      this.saveSlotIndex();

      return true;
    } catch (error) {
      console.error('Failed to delete all save slots:', error);
      return false;
    }
  }

  // ============================================
  // 내보내기/가져오기
  // ============================================

  async exportSave(slot: number): Promise<ExportResult> {
    try {
      const loadResult = await this.load(slot);
      if (!loadResult.success || !loadResult.data) {
        return { success: false, error: loadResult.error };
      }

      const exportData = {
        ...loadResult.data,
        exportDate: new Date().toISOString(),
        exportVersion: SAVE_CONSTANTS.CURRENT_VERSION,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const base64 = btoa(unescape(encodeURIComponent(jsonString)));

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `vocavision_save_${slot}_${timestamp}.vsave`;

      return {
        success: true,
        data: base64,
        filename,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      return { success: false, error: errorMessage };
    }
  }

  async importSave(data: string, targetSlot?: number): Promise<ImportResult> {
    try {
      // Base64 디코딩
      const jsonString = decodeURIComponent(escape(atob(data)));
      const importData = JSON.parse(jsonString);

      // 버전 확인
      const version = importData.header?.version || importData.exportVersion;
      if (!SUPPORTED_VERSIONS.includes(version)) {
        return { success: false, error: `지원하지 않는 버전입니다: ${version}` };
      }

      const warnings: string[] = [];

      // 마이그레이션 필요 시
      let saveData = importData as SaveData;
      if (version !== SAVE_CONSTANTS.CURRENT_VERSION) {
        saveData = migrateData(saveData, SAVE_CONSTANTS.CURRENT_VERSION);
        warnings.push(`버전 ${version}에서 ${SAVE_CONSTANTS.CURRENT_VERSION}으로 마이그레이션되었습니다.`);
      }

      // 검증
      const validation = this.validateSaveData(saveData);
      if (!validation.valid) {
        const fatalErrors = validation.errors.filter((e) => e.fatal);
        if (fatalErrors.length > 0) {
          return { success: false, error: fatalErrors[0].message };
        }
        warnings.push(...validation.warnings.map((w) => w.message));
      }

      // 슬롯 결정
      const slot = targetSlot !== undefined ? targetSlot : this.findEmptySlot();
      if (slot === -1) {
        return { success: false, error: '빈 저장 슬롯이 없습니다.' };
      }

      // 저장
      const compressed = await compressData(JSON.stringify(saveData));
      const storageKey = `${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}${slot}`;
      localStorage.setItem(storageKey, compressed);

      // 슬롯 정보 업데이트
      const slotInfo: SaveSlot = {
        id: slot,
        name: saveData.header.name || `가져온 저장 ${slot + 1}`,
        isEmpty: false,
        timestamp: new Date(),
        playTime: saveData.gameState.meta.playTime,
        difficulty: saveData.gameState.meta.difficulty,
        day: saveData.gameState.time.totalDays,
        users: (saveData.gameState.business as any).users?.total || 0,
        cash: (saveData.gameState.business as any).finance?.cash || 0,
        version: SAVE_CONSTANTS.CURRENT_VERSION,
        checksum: saveData.header.checksum,
      };

      this.slots.set(slot, slotInfo);
      this.saveSlotIndex();

      return {
        success: true,
        slot,
        warnings: warnings.length > 0 ? warnings : undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      return { success: false, error: `가져오기 실패: ${errorMessage}` };
    }
  }

  private findEmptySlot(): number {
    for (let i = 0; i < SAVE_CONSTANTS.MAX_SLOTS; i++) {
      if (!this.slots.has(i) || this.slots.get(i)?.isEmpty) {
        return i;
      }
    }
    return -1;
  }

  // ============================================
  // 검증
  // ============================================

  validateSaveData(data: SaveData): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // 헤더 검증
    if (!data.header) {
      errors.push({ field: 'header', message: '저장 헤더가 없습니다.', fatal: true });
      return { valid: false, errors, warnings };
    }

    if (!data.header.version) {
      errors.push({ field: 'header.version', message: '버전 정보가 없습니다.', fatal: true });
    }

    // 게임 상태 검증
    if (!data.gameState) {
      errors.push({ field: 'gameState', message: '게임 상태가 없습니다.', fatal: true });
    } else {
      if (!data.gameState.time) {
        errors.push({ field: 'gameState.time', message: '시간 상태가 없습니다.', fatal: true });
      }

      if (!data.gameState.player) {
        errors.push({ field: 'gameState.player', message: '플레이어 상태가 없습니다.', fatal: true });
      }

      if (!data.gameState.business) {
        errors.push({ field: 'gameState.business', message: '비즈니스 상태가 없습니다.', fatal: true });
      }

      // 값 범위 검증
      const cash = (data.gameState.business as any)?.finance?.cash;
      if (typeof cash === 'number' && cash < -10000000) {
        warnings.push({
          field: 'gameState.business.finance.cash',
          message: '비정상적으로 낮은 자금',
          suggestion: '게임 상태를 확인하세요.',
        });
      }
    }

    // 진행 상태 검증
    if (!data.progressionState) {
      warnings.push({
        field: 'progressionState',
        message: '진행 상태가 없습니다. 기본값이 사용됩니다.',
      });
    }

    return {
      valid: errors.filter((e) => e.fatal).length === 0,
      errors,
      warnings,
    };
  }

  // ============================================
  // 자동저장 설정
  // ============================================

  setAutoSaveConfig(config: Partial<AutoSaveConfig>): void {
    this.autoSaveConfig = { ...this.autoSaveConfig, ...config };
    this.setupAutoSave();
    this.saveAutoSaveConfig();
  }

  getAutoSaveConfig(): AutoSaveConfig {
    return { ...this.autoSaveConfig };
  }

  private setupAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }

    // 자동저장은 게임 루프에서 호출하므로 여기서는 타이머 설정하지 않음
  }

  private saveAutoSaveConfig(): void {
    try {
      localStorage.setItem(
        `${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}autosave_config`,
        JSON.stringify(this.autoSaveConfig),
      );
    } catch (error) {
      console.error('Failed to save autosave config:', error);
    }
  }

  private loadAutoSaveConfig(): void {
    try {
      const json = localStorage.getItem(`${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}autosave_config`);
      if (json) {
        this.autoSaveConfig = { ...DEFAULT_AUTOSAVE_CONFIG, ...JSON.parse(json) };
      }
    } catch (error) {
      console.error('Failed to load autosave config:', error);
    }
  }

  // ============================================
  // 메타 상태 관리
  // ============================================

  private loadMetaState(): MetaStateSave {
    try {
      const json = localStorage.getItem(SAVE_CONSTANTS.META_KEY);
      if (json) {
        return JSON.parse(json);
      }
    } catch (error) {
      console.error('Failed to load meta state:', error);
    }

    return {
      firstPlayDate: new Date().toISOString(),
      totalPlaythroughs: 0,
      totalPlayTime: 0,
      endingsSeen: [],
      achievementPoints: 0,
      lastPlayDate: new Date().toISOString(),
    };
  }

  private updateMetaState(metaState: MetaStateSave): void {
    try {
      metaState.lastPlayDate = new Date().toISOString();
      localStorage.setItem(SAVE_CONSTANTS.META_KEY, JSON.stringify(metaState));
    } catch (error) {
      console.error('Failed to update meta state:', error);
    }
  }

  // ============================================
  // 체크섬 계산
  // ============================================

  private async calculateChecksum(data: SaveData): Promise<string> {
    const dataWithoutChecksum = { ...data, header: { ...data.header, checksum: '' } };
    const jsonString = JSON.stringify(dataWithoutChecksum);

    // 브라우저 환경에서 SHA-256 사용
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(jsonString);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }

    // 폴백: 간단한 해시
    let hash = 0;
    for (let i = 0; i < jsonString.length; i++) {
      const char = jsonString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  // ============================================
  // 상태 조회
  // ============================================

  getSystemState(): SaveSystemState {
    return {
      slots: Array.from(this.slots.values()),
      autoSaveSlot: this.slots.get(SAVE_CONSTANTS.AUTO_SAVE_SLOT) || null,
      quickSaveSlot: this.slots.get(SAVE_CONSTANTS.QUICK_SAVE_SLOT) || null,
      cloudSyncStatus: { ...this.cloudSyncStatus },
      lastOperation: null,
      isProcessing: this.isProcessing,
    };
  }

  isSlotEmpty(slot: number): boolean {
    const slotData = this.slots.get(slot);
    return !slotData || slotData.isEmpty;
  }

  // ============================================
  // 클린업
  // ============================================

  cleanup(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
    this.eventListeners.clear();
  }
}

// 싱글톤 인스턴스
export const saveManager = new SaveManager();

export default saveManager;
