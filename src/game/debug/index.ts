/**
 * Chapter 14: Debug & Testing - Main Entry Point
 * 디버그 및 테스트 도구 메인 엔트리 포인트
 *
 * 이 모듈은 VocaVision 시뮬레이터의 디버그 도구를 제공합니다.
 *
 * 주요 기능:
 * 1. 디버그 콘솔 - 로그 출력 및 명령어 실행
 * 2. 상태 인스펙터 - 게임 상태 검사 및 수정
 * 3. 치트 코드 - 개발/테스트용 치트
 * 4. 성능 모니터링 - FPS, 메모리 추적
 * 5. 시간 조작 - 게임 시간 제어
 * 6. 테스트 유틸리티 - 시나리오 테스트
 */

// ============================================
// Type Exports
// ============================================

export * from './types';

// ============================================
// Cheats
// ============================================

export {
  allCheats,
  resourceCheats,
  timeCheats,
  progressionCheats,
  unlockCheats,
  debugCheats,
  funCheats,
  findCheatByCode,
  findCheatById,
  getCheatsByCategory,
  getEnabledCheats,
  getNonDebugCheats,
  KONAMI_CODE,
  checkKonamiCode,
} from './cheats';

// ============================================
// Debug Manager
// ============================================

export {
  DebugManager,
  debugManager,
  type DebugManagerListener,
} from './debugManager';

// ============================================
// Debug UI Props
// ============================================

export interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
  position: 'bottom' | 'right' | 'floating';
  initialTab?: string;
}

export interface DebugConsoleProps {
  logs: Array<{
    id: string;
    timestamp: Date;
    level: string;
    category: string;
    message: string;
  }>;
  onCommand: (command: string) => void;
  commandHistory: string[];
}

export interface StateInspectorProps {
  state: any;
  snapshots: Array<{
    id: string;
    label: string;
    timestamp: Date;
  }>;
  bookmarks: Array<{
    id: string;
    path: string;
    label: string;
  }>;
  onSnapshot: (label: string) => void;
  onRestore: (id: string) => void;
  onBookmark: (path: string, label: string) => void;
  onValueChange: (path: string, value: any) => void;
}

export interface CheatPanelProps {
  cheats: Array<{
    id: string;
    code: string;
    name: string;
    description: string;
    category: string;
    enabled: boolean;
  }>;
  activeCheats: string[];
  onExecute: (cheatId: string, params?: any) => void;
  debugModeEnabled: boolean;
}

export interface PerformanceMonitorProps {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  history: Array<{
    timestamp: Date;
    fps: number;
  }>;
  markers: Array<{
    name: string;
    duration?: number;
  }>;
}

export interface TimeControlProps {
  mode: 'normal' | 'paused' | 'slow' | 'fast' | 'instant';
  speed: number;
  onModeChange: (mode: string) => void;
  onSpeedChange: (speed: number) => void;
}

// ============================================
// 통합 Debug 시스템
// ============================================

import { DebugManager, debugManager } from './debugManager';
import {
  DebugConfig,
  DebugLevel,
  LogEntry,
  LogFilter,
  StateSnapshot,
  CheatResult,
  PerformanceMetrics,
  TimeMode,
  ConsoleOutput,
} from './types';
import { allCheats, CheatCode } from './cheats';

/**
 * 통합 Debug 시스템 인터페이스
 */
export interface DebugSystem {
  // 관리자
  manager: DebugManager;

  // 설정
  enable: () => void;
  disable: () => void;
  isEnabled: () => boolean;
  setConfig: (config: Partial<DebugConfig>) => void;
  getConfig: () => DebugConfig;

  // 로깅
  log: (level: DebugLevel, category: string, message: string, data?: any) => void;
  error: (category: string, message: string, data?: any) => void;
  warn: (category: string, message: string, data?: any) => void;
  info: (category: string, message: string, data?: any) => void;
  debug: (category: string, message: string, data?: any) => void;
  getLogs: (filter?: LogFilter) => LogEntry[];
  clearLogs: () => void;

  // 상태 인스펙션
  createSnapshot: (label: string) => StateSnapshot;
  getSnapshots: () => StateSnapshot[];
  restoreSnapshot: (id: string) => boolean;

  // 치트
  cheats: CheatCode[];
  executeCheat: (codeOrId: string, params?: any) => CheatResult;
  getActiveCheats: () => string[];

  // 성능
  startPerformanceMonitoring: () => void;
  stopPerformanceMonitoring: () => void;
  recordFrame: () => void;
  markStart: (name: string) => void;
  markEnd: (name: string) => number | null;

  // 시간
  setTimeMode: (mode: TimeMode) => void;
  setTimeSpeed: (speed: number) => void;

  // 콘솔
  executeCommand: (command: string) => ConsoleOutput;

  // 패널
  togglePanel: () => void;
}

/**
 * Debug 시스템 생성
 */
export function createDebugSystem(): DebugSystem {
  return {
    manager: debugManager,

    enable: () => debugManager.enable(),
    disable: () => debugManager.disable(),
    isEnabled: () => debugManager.isEnabled(),
    setConfig: (config) => debugManager.setConfig(config),
    getConfig: () => debugManager.getConfig(),

    log: (level, category, message, data) => debugManager.log(level, category, message, data),
    error: (category, message, data) => debugManager.error(category, message, data),
    warn: (category, message, data) => debugManager.warn(category, message, data),
    info: (category, message, data) => debugManager.info(category, message, data),
    debug: (category, message, data) => debugManager.debug(category, message, data),
    getLogs: (filter) => debugManager.getLogs(filter),
    clearLogs: () => debugManager.clearLogs(),

    createSnapshot: (label) => debugManager.createSnapshot(label),
    getSnapshots: () => debugManager.getSnapshots(),
    restoreSnapshot: (id) => debugManager.restoreSnapshot(id),

    cheats: allCheats,
    executeCheat: (codeOrId, params) => debugManager.executeCheat(codeOrId, params),
    getActiveCheats: () => debugManager.getActiveCheats(),

    startPerformanceMonitoring: () => debugManager.startFPSMonitoring(),
    stopPerformanceMonitoring: () => debugManager.stopFPSMonitoring(),
    recordFrame: () => debugManager.recordFrame(),
    markStart: (name) => debugManager.markStart(name),
    markEnd: (name) => debugManager.markEnd(name),

    setTimeMode: (mode) => debugManager.setTimeMode(mode),
    setTimeSpeed: (speed) => debugManager.setTimeSpeed(speed),

    executeCommand: (command) => debugManager.executeCommand(command),

    togglePanel: () => debugManager.togglePanel(),
  };
}

// 싱글톤 인스턴스
export const debugSystem = createDebugSystem();

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 개발 환경에서만 실행
 */
export function devOnly(fn: () => void): void {
  if (process.env.NODE_ENV === 'development' || debugManager.isEnabled()) {
    fn();
  }
}

/**
 * 조건부 로깅
 */
export function conditionalLog(
  condition: boolean,
  level: DebugLevel,
  category: string,
  message: string,
  data?: any,
): void {
  if (condition) {
    debugManager.log(level, category, message, data);
  }
}

/**
 * 성능 측정 데코레이터
 */
export function measurePerformance(name: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      debugManager.markStart(`${name}.${propertyKey}`);
      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result.finally(() => {
          debugManager.markEnd(`${name}.${propertyKey}`);
        });
      }

      debugManager.markEnd(`${name}.${propertyKey}`);
      return result;
    };

    return descriptor;
  };
}

/**
 * 디버그 로그 한글 레벨명
 */
export function getDebugLevelLabel(level: DebugLevel): string {
  const labels: Record<DebugLevel, string> = {
    none: '없음',
    error: '에러',
    warn: '경고',
    info: '정보',
    debug: '디버그',
    trace: '추적',
  };
  return labels[level] || level;
}

/**
 * 치트 카테고리 한글명
 */
export function getCheatCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    resource: '자원',
    time: '시간',
    progression: '진행',
    unlock: '해금',
    debug: '디버그',
    fun: '재미',
  };
  return labels[category] || category;
}

export default debugSystem;
