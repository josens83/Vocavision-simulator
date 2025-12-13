/**
 * Chapter 8: Save/Load & Persistence - Cloud Sync System
 * 클라우드 동기화 시스템
 */

import {
  CloudSyncConfig,
  CloudSyncStatus,
  SaveData,
  SaveSlot,
  DEFAULT_CLOUD_SYNC_CONFIG,
  SAVE_CONSTANTS,
} from './types';

// ============================================
// 클라우드 동기화 이벤트
// ============================================

export type CloudSyncEventType =
  | 'sync_started'
  | 'sync_progress'
  | 'sync_completed'
  | 'sync_failed'
  | 'conflict_detected'
  | 'conflict_resolved';

export interface CloudSyncEvent {
  type: CloudSyncEventType;
  timestamp: Date;
  details?: Record<string, unknown>;
}

export type CloudSyncEventListener = (event: CloudSyncEvent) => void;

// ============================================
// 동기화 충돌
// ============================================

export interface SyncConflict {
  slotId: number;
  localData: SaveSlot;
  cloudData: SaveSlot;
  localTimestamp: Date;
  cloudTimestamp: Date;
}

export type ConflictResolution = 'use_local' | 'use_cloud' | 'use_newest' | 'merge';

// ============================================
// 클라우드 프로바이더 인터페이스
// ============================================

export interface CloudProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;

  // 저장/로드
  uploadSave(slot: number, data: string): Promise<boolean>;
  downloadSave(slot: number): Promise<string | null>;
  deleteSave(slot: number): Promise<boolean>;

  // 메타데이터
  listSaves(): Promise<SaveSlot[]>;
  getSaveMetadata(slot: number): Promise<SaveSlot | null>;

  // 동기화
  getLastSyncTime(): Promise<Date | null>;
  setLastSyncTime(time: Date): Promise<void>;
}

// ============================================
// IndexedDB 로컬 프로바이더
// ============================================

export class IndexedDBProvider implements CloudProvider {
  name = 'IndexedDB';
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'VocaVisionSaves';
  private readonly STORE_NAME = 'saves';
  private readonly META_STORE = 'metadata';

  async isAvailable(): Promise<boolean> {
    return typeof indexedDB !== 'undefined';
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, 1);

      request.onerror = () => {
        console.error('IndexedDB open failed');
        resolve(false);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          db.createObjectStore(this.STORE_NAME, { keyPath: 'slot' });
        }

        if (!db.objectStoreNames.contains(this.META_STORE)) {
          db.createObjectStore(this.META_STORE, { keyPath: 'key' });
        }
      };
    });
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async uploadSave(slot: number, data: string): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put({ slot, data, timestamp: new Date().toISOString() });

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  async downloadSave(slot: number): Promise<string | null> {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(slot);

      request.onsuccess = () => {
        resolve(request.result?.data || null);
      };
      request.onerror = () => resolve(null);
    });
  }

  async deleteSave(slot: number): Promise<boolean> {
    if (!this.db) return false;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(slot);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  async listSaves(): Promise<SaveSlot[]> {
    if (!this.db) return [];

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result || [];
        resolve(
          results.map((r: any) => ({
            id: r.slot,
            name: `슬롯 ${r.slot + 1}`,
            isEmpty: false,
            timestamp: new Date(r.timestamp),
            playTime: 0,
            difficulty: 'normal',
            day: 0,
            users: 0,
            cash: 0,
            version: SAVE_CONSTANTS.CURRENT_VERSION,
            checksum: '',
          })),
        );
      };
      request.onerror = () => resolve([]);
    });
  }

  async getSaveMetadata(slot: number): Promise<SaveSlot | null> {
    const saves = await this.listSaves();
    return saves.find((s) => s.id === slot) || null;
  }

  async getLastSyncTime(): Promise<Date | null> {
    if (!this.db) return null;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.META_STORE], 'readonly');
      const store = transaction.objectStore(this.META_STORE);
      const request = store.get('lastSyncTime');

      request.onsuccess = () => {
        resolve(request.result?.value ? new Date(request.result.value) : null);
      };
      request.onerror = () => resolve(null);
    });
  }

  async setLastSyncTime(time: Date): Promise<void> {
    if (!this.db) return;

    return new Promise((resolve) => {
      const transaction = this.db!.transaction([this.META_STORE], 'readwrite');
      const store = transaction.objectStore(this.META_STORE);
      store.put({ key: 'lastSyncTime', value: time.toISOString() });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => resolve();
    });
  }
}

// ============================================
// 클라우드 동기화 관리자
// ============================================

export class CloudSyncManager {
  private config: CloudSyncConfig = DEFAULT_CLOUD_SYNC_CONFIG;
  private status: CloudSyncStatus = {
    lastSync: null,
    syncing: false,
    error: null,
    pendingChanges: 0,
  };
  private provider: CloudProvider | null = null;
  private eventListeners: Set<CloudSyncEventListener> = new Set();
  private syncTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.loadConfig();
  }

  // ============================================
  // 이벤트 시스템
  // ============================================

  addEventListener(listener: CloudSyncEventListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  private emit(type: CloudSyncEventType, details?: Record<string, unknown>): void {
    const event: CloudSyncEvent = { type, timestamp: new Date(), details };
    this.eventListeners.forEach((listener) => listener(event));
  }

  // ============================================
  // 설정 관리
  // ============================================

  getConfig(): CloudSyncConfig {
    return { ...this.config };
  }

  setConfig(config: Partial<CloudSyncConfig>): void {
    this.config = { ...this.config, ...config };
    this.saveConfig();
    this.setupAutoSync();
  }

  private loadConfig(): void {
    try {
      const json = localStorage.getItem(`${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}cloud_config`);
      if (json) {
        this.config = { ...DEFAULT_CLOUD_SYNC_CONFIG, ...JSON.parse(json) };
      }
    } catch (error) {
      console.error('Failed to load cloud sync config:', error);
    }
  }

  private saveConfig(): void {
    try {
      localStorage.setItem(`${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}cloud_config`, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save cloud sync config:', error);
    }
  }

  // ============================================
  // 프로바이더 관리
  // ============================================

  async initialize(): Promise<boolean> {
    if (!this.config.enabled) return false;

    switch (this.config.provider) {
      case 'local':
        this.provider = new IndexedDBProvider();
        break;
      // TODO: Firebase, Supabase 등 추가 프로바이더 구현
      default:
        return false;
    }

    const isAvailable = await this.provider.isAvailable();
    if (!isAvailable) {
      this.provider = null;
      return false;
    }

    const connected = await this.provider.connect();
    if (connected) {
      this.setupAutoSync();
      this.status.lastSync = await this.provider.getLastSyncTime();
    }

    return connected;
  }

  async disconnect(): Promise<void> {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }

    if (this.provider) {
      await this.provider.disconnect();
      this.provider = null;
    }
  }

  private setupAutoSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }

    if (this.config.enabled && this.config.autoSync && this.provider) {
      const interval = this.config.syncInterval * 60 * 1000;
      this.syncTimer = setInterval(() => this.sync(), interval);
    }
  }

  // ============================================
  // 동기화
  // ============================================

  async sync(): Promise<boolean> {
    if (!this.provider || this.status.syncing) return false;

    this.status.syncing = true;
    this.status.error = null;
    this.emit('sync_started');

    try {
      // 로컬 저장 목록 가져오기
      const localSlots = this.getLocalSlots();

      // 클라우드 저장 목록 가져오기
      const cloudSlots = await this.provider.listSaves();

      // 충돌 감지 및 해결
      const conflicts = this.detectConflicts(localSlots, cloudSlots);

      for (const conflict of conflicts) {
        await this.resolveConflict(conflict);
      }

      // 로컬 -> 클라우드 업로드
      for (const slot of localSlots) {
        if (!slot.isEmpty) {
          const data = localStorage.getItem(`${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}${slot.id}`);
          if (data) {
            await this.provider.uploadSave(slot.id, data);
          }
        }
      }

      // 동기화 완료
      this.status.lastSync = new Date();
      this.status.pendingChanges = 0;
      await this.provider.setLastSyncTime(this.status.lastSync);

      this.emit('sync_completed');
      return true;
    } catch (error) {
      this.status.error = error instanceof Error ? error.message : '동기화 실패';
      this.emit('sync_failed', { error: this.status.error });
      return false;
    } finally {
      this.status.syncing = false;
    }
  }

  private getLocalSlots(): SaveSlot[] {
    try {
      const indexJson = localStorage.getItem(`${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}index`);
      if (indexJson) {
        return JSON.parse(indexJson);
      }
    } catch (error) {
      console.error('Failed to get local slots:', error);
    }
    return [];
  }

  private detectConflicts(local: SaveSlot[], cloud: SaveSlot[]): SyncConflict[] {
    const conflicts: SyncConflict[] = [];

    for (const localSlot of local) {
      const cloudSlot = cloud.find((c) => c.id === localSlot.id);
      if (cloudSlot && !localSlot.isEmpty && !cloudSlot.isEmpty) {
        const localTime = new Date(localSlot.timestamp);
        const cloudTime = new Date(cloudSlot.timestamp);

        // 타임스탬프가 다르면 충돌
        if (Math.abs(localTime.getTime() - cloudTime.getTime()) > 1000) {
          conflicts.push({
            slotId: localSlot.id,
            localData: localSlot,
            cloudData: cloudSlot,
            localTimestamp: localTime,
            cloudTimestamp: cloudTime,
          });
        }
      }
    }

    return conflicts;
  }

  private async resolveConflict(conflict: SyncConflict): Promise<void> {
    this.emit('conflict_detected', { slotId: conflict.slotId });

    let resolution: 'local' | 'cloud';

    switch (this.config.conflictResolution) {
      case 'local':
        resolution = 'local';
        break;
      case 'cloud':
        resolution = 'cloud';
        break;
      case 'newest':
        resolution =
          conflict.localTimestamp > conflict.cloudTimestamp ? 'local' : 'cloud';
        break;
      case 'ask':
        // TODO: UI를 통해 사용자에게 선택 요청
        resolution =
          conflict.localTimestamp > conflict.cloudTimestamp ? 'local' : 'cloud';
        break;
      default:
        resolution = 'local';
    }

    if (resolution === 'cloud' && this.provider) {
      // 클라우드 데이터로 로컬 덮어쓰기
      const cloudData = await this.provider.downloadSave(conflict.slotId);
      if (cloudData) {
        localStorage.setItem(`${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}${conflict.slotId}`, cloudData);
      }
    }

    this.emit('conflict_resolved', { slotId: conflict.slotId, resolution });
  }

  // ============================================
  // 개별 저장 동기화
  // ============================================

  async uploadSave(slot: number): Promise<boolean> {
    if (!this.provider) return false;

    const data = localStorage.getItem(`${SAVE_CONSTANTS.STORAGE_KEY_PREFIX}${slot}`);
    if (!data) return false;

    return this.provider.uploadSave(slot, data);
  }

  async downloadSave(slot: number): Promise<string | null> {
    if (!this.provider) return null;

    return this.provider.downloadSave(slot);
  }

  async deleteSave(slot: number): Promise<boolean> {
    if (!this.provider) return false;

    return this.provider.deleteSave(slot);
  }

  // ============================================
  // 상태 조회
  // ============================================

  getStatus(): CloudSyncStatus {
    return { ...this.status };
  }

  isEnabled(): boolean {
    return this.config.enabled && this.provider !== null;
  }

  markChange(): void {
    this.status.pendingChanges++;
  }

  // ============================================
  // 클린업
  // ============================================

  cleanup(): void {
    this.disconnect();
    this.eventListeners.clear();
  }
}

// 싱글톤 인스턴스
export const cloudSyncManager = new CloudSyncManager();

export default cloudSyncManager;
