/**
 * Chapter 14: Debug & Testing - Type Definitions
 * 디버그 및 테스트 도구 타입 정의
 */

// ============================================
// Debug Mode
// ============================================

/**
 * 디버그 모드 레벨
 */
export type DebugLevel = 'none' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * 디버그 설정
 */
export interface DebugConfig {
  enabled: boolean;
  level: DebugLevel;
  showPanel: boolean;
  showFPS: boolean;
  showStats: boolean;
  showTimeline: boolean;
  logToConsole: boolean;
  logToFile: boolean;
  pauseOnError: boolean;
  breakOnWarning: boolean;
  enableCheats: boolean;
  enableTimeManipulation: boolean;
  maxLogEntries: number;
  persistLogs: boolean;
}

export const DEFAULT_DEBUG_CONFIG: DebugConfig = {
  enabled: false,
  level: 'warn',
  showPanel: false,
  showFPS: false,
  showStats: false,
  showTimeline: false,
  logToConsole: true,
  logToFile: false,
  pauseOnError: false,
  breakOnWarning: false,
  enableCheats: false,
  enableTimeManipulation: false,
  maxLogEntries: 1000,
  persistLogs: false,
};

// ============================================
// Log Types
// ============================================

/**
 * 로그 엔트리
 */
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: DebugLevel;
  category: string;
  message: string;
  data?: any;
  stack?: string;
  source?: LogSource;
}

/**
 * 로그 소스
 */
export interface LogSource {
  file?: string;
  line?: number;
  function?: string;
  module?: string;
}

/**
 * 로그 필터
 */
export interface LogFilter {
  level?: DebugLevel;
  category?: string;
  search?: string;
  startTime?: Date;
  endTime?: Date;
}

// ============================================
// Game State Inspector
// ============================================

/**
 * 상태 스냅샷
 */
export interface StateSnapshot {
  id: string;
  timestamp: Date;
  label: string;
  state: any;
  diff?: StateDiff;
}

/**
 * 상태 변경 diff
 */
export interface StateDiff {
  added: string[];
  removed: string[];
  modified: Array<{
    path: string;
    oldValue: any;
    newValue: any;
  }>;
}

/**
 * 상태 경로 북마크
 */
export interface StateBookmark {
  id: string;
  path: string;
  label: string;
  value?: any;
}

// ============================================
// Cheat Codes
// ============================================

/**
 * 치트 코드 정의
 */
export interface CheatCode {
  id: string;
  code: string;
  name: string;
  description: string;
  category: CheatCategory;
  action: CheatAction;
  params?: CheatParam[];
  enabled: boolean;
  requiresDebugMode: boolean;
}

/**
 * 치트 카테고리
 */
export type CheatCategory =
  | 'resource'     // 자원 치트
  | 'time'         // 시간 치트
  | 'progression'  // 진행 치트
  | 'unlock'       // 언락 치트
  | 'debug'        // 디버그 치트
  | 'fun';         // 재미 치트

/**
 * 치트 액션
 */
export interface CheatAction {
  type: 'set' | 'add' | 'multiply' | 'toggle' | 'trigger' | 'custom';
  target: string;
  value?: any;
  handler?: (params?: any) => void;
}

/**
 * 치트 파라미터
 */
export interface CheatParam {
  name: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  default?: any;
  options?: any[];
  min?: number;
  max?: number;
}

/**
 * 치트 실행 결과
 */
export interface CheatResult {
  success: boolean;
  message: string;
  changes?: Record<string, any>;
}

// ============================================
// Time Manipulation
// ============================================

/**
 * 시간 조작 모드
 */
export type TimeMode = 'normal' | 'paused' | 'slow' | 'fast' | 'instant';

/**
 * 시간 조작 설정
 */
export interface TimeManipulationConfig {
  mode: TimeMode;
  speed: number;  // 1.0 = normal, 0.5 = half, 2.0 = double
  skipAnimations: boolean;
  instantActions: boolean;
  autoAdvanceDay: boolean;
}

// ============================================
// Performance Monitoring
// ============================================

/**
 * 성능 메트릭
 */
export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  heapSize?: number;
  jsHeapSize?: number;
  domNodes?: number;
  eventListeners?: number;
  activeTimers?: number;
}

/**
 * 성능 타임라인 엔트리
 */
export interface PerformanceEntry {
  timestamp: Date;
  metrics: PerformanceMetrics;
  markers: string[];
}

/**
 * 성능 마커
 */
export interface PerformanceMarker {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  category: string;
}

// ============================================
// Test Utilities
// ============================================

/**
 * 테스트 시나리오
 */
export interface TestScenario {
  id: string;
  name: string;
  description: string;
  steps: TestStep[];
  expectedResult: any;
  tags: string[];
}

/**
 * 테스트 단계
 */
export interface TestStep {
  order: number;
  action: string;
  params?: Record<string, any>;
  wait?: number;
  assertion?: TestAssertion;
}

/**
 * 테스트 어서션
 */
export interface TestAssertion {
  type: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'exists' | 'custom';
  target: string;
  expected: any;
  message?: string;
}

/**
 * 테스트 결과
 */
export interface TestResult {
  scenarioId: string;
  passed: boolean;
  duration: number;
  steps: TestStepResult[];
  error?: string;
}

/**
 * 테스트 단계 결과
 */
export interface TestStepResult {
  order: number;
  passed: boolean;
  duration: number;
  error?: string;
  actual?: any;
  expected?: any;
}

// ============================================
// Debug Panel State
// ============================================

/**
 * 디버그 패널 탭
 */
export type DebugPanelTab =
  | 'console'      // 콘솔 로그
  | 'state'        // 상태 인스펙터
  | 'cheats'       // 치트 코드
  | 'performance'  // 성능 모니터링
  | 'timeline'     // 타임라인
  | 'test';        // 테스트

/**
 * 디버그 패널 상태
 */
export interface DebugPanelState {
  isOpen: boolean;
  activeTab: DebugPanelTab;
  position: 'bottom' | 'right' | 'floating';
  size: { width: number; height: number };
  opacity: number;
  pinned: boolean;
}

// ============================================
// Console Commands
// ============================================

/**
 * 콘솔 명령어
 */
export interface ConsoleCommand {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  params?: CommandParam[];
  handler: (args: string[], context: any) => ConsoleOutput;
}

/**
 * 명령어 파라미터
 */
export interface CommandParam {
  name: string;
  type: 'string' | 'number' | 'boolean';
  required: boolean;
  description: string;
  default?: any;
}

/**
 * 콘솔 출력
 */
export interface ConsoleOutput {
  type: 'success' | 'error' | 'info' | 'warning' | 'table' | 'json';
  content: string | any;
  timestamp?: Date;
}

// ============================================
// Event Triggers
// ============================================

/**
 * 트리거 가능한 이벤트
 */
export interface TriggerableEvent {
  id: string;
  name: string;
  category: string;
  description: string;
  params?: EventParam[];
}

/**
 * 이벤트 파라미터
 */
export interface EventParam {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object';
  description: string;
  default?: any;
}

// ============================================
// Debug State
// ============================================

/**
 * 디버그 시스템 상태
 */
export interface DebugState {
  config: DebugConfig;
  logs: LogEntry[];
  snapshots: StateSnapshot[];
  bookmarks: StateBookmark[];
  activeCheats: string[];
  performanceHistory: PerformanceEntry[];
  markers: PerformanceMarker[];
  timeConfig: TimeManipulationConfig;
  panel: DebugPanelState;
  commandHistory: string[];
}
