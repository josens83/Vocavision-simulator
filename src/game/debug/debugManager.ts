/**
 * Chapter 14: Debug & Testing - Debug Manager
 * 디버그 관리자
 *
 * 이 모듈은 디버그 로깅, 상태 검사, 치트 실행을 관리합니다.
 */

import {
  DebugConfig,
  DebugState,
  DebugLevel,
  LogEntry,
  LogFilter,
  LogSource,
  StateSnapshot,
  StateDiff,
  StateBookmark,
  CheatResult,
  PerformanceMetrics,
  PerformanceEntry,
  PerformanceMarker,
  TimeManipulationConfig,
  TimeMode,
  ConsoleCommand,
  ConsoleOutput,
  DebugPanelState,
  DebugPanelTab,
  DEFAULT_DEBUG_CONFIG,
} from './types';

import { allCheats, findCheatByCode, findCheatById, checkKonamiCode } from './cheats';

// ============================================
// Debug Manager
// ============================================

export interface DebugManagerListener {
  onLog?: (entry: LogEntry) => void;
  onSnapshot?: (snapshot: StateSnapshot) => void;
  onCheatActivated?: (cheatId: string, result: CheatResult) => void;
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void;
  onConfigChange?: (config: DebugConfig) => void;
  onPanelToggle?: (isOpen: boolean) => void;
}

export class DebugManager {
  private config: DebugConfig;
  private state: DebugState;
  private listeners: Set<DebugManagerListener> = new Set();
  private fpsInterval: ReturnType<typeof setInterval> | null = null;
  private frameCount = 0;
  private lastFrameTime = 0;
  private commands: Map<string, ConsoleCommand> = new Map();
  private konamiSequence: string[] = [];
  private gameStateGetter: (() => any) | null = null;
  private gameStateSetter: ((state: any) => void) | null = null;

  constructor(config: Partial<DebugConfig> = {}) {
    this.config = { ...DEFAULT_DEBUG_CONFIG, ...config };
    this.state = this.createInitialState();
    this.registerDefaultCommands();
    this.setupKeyboardListener();
  }

  private createInitialState(): DebugState {
    return {
      config: this.config,
      logs: [],
      snapshots: [],
      bookmarks: [],
      activeCheats: [],
      performanceHistory: [],
      markers: [],
      timeConfig: {
        mode: 'normal',
        speed: 1,
        skipAnimations: false,
        instantActions: false,
        autoAdvanceDay: false,
      },
      panel: {
        isOpen: false,
        activeTab: 'console',
        position: 'bottom',
        size: { width: 600, height: 300 },
        opacity: 0.95,
        pinned: false,
      },
      commandHistory: [],
    };
  }

  // ============================================
  // Game State Binding
  // ============================================

  bindGameState(
    getter: () => any,
    setter: (state: any) => void,
  ): void {
    this.gameStateGetter = getter;
    this.gameStateSetter = setter;
  }

  private getGameState(): any {
    return this.gameStateGetter ? this.gameStateGetter() : {};
  }

  private setGameState(state: any): void {
    if (this.gameStateSetter) {
      this.gameStateSetter(state);
    }
  }

  // ============================================
  // Listener Management
  // ============================================

  addListener(listener: DebugManagerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners<K extends keyof DebugManagerListener>(
    event: K,
    ...args: Parameters<NonNullable<DebugManagerListener[K]>>
  ): void {
    this.listeners.forEach((listener) => {
      const handler = listener[event];
      if (handler) {
        (handler as Function)(...args);
      }
    });
  }

  // ============================================
  // Configuration
  // ============================================

  setConfig(config: Partial<DebugConfig>): void {
    this.config = { ...this.config, ...config };
    this.state.config = this.config;

    if (this.config.showFPS && !this.fpsInterval) {
      this.startFPSMonitoring();
    } else if (!this.config.showFPS && this.fpsInterval) {
      this.stopFPSMonitoring();
    }

    this.notifyListeners('onConfigChange', this.config);
  }

  getConfig(): DebugConfig {
    return { ...this.config };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  enable(): void {
    this.setConfig({ enabled: true });
    this.log('info', 'Debug', 'Debug mode enabled');
  }

  disable(): void {
    this.log('info', 'Debug', 'Debug mode disabled');
    this.setConfig({ enabled: false });
  }

  // ============================================
  // Logging
  // ============================================

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  private shouldLog(level: DebugLevel): boolean {
    const levels: DebugLevel[] = ['none', 'error', 'warn', 'info', 'debug', 'trace'];
    const configIndex = levels.indexOf(this.config.level);
    const messageIndex = levels.indexOf(level);
    return messageIndex <= configIndex && messageIndex > 0;
  }

  log(level: DebugLevel, category: string, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      id: this.generateLogId(),
      timestamp: new Date(),
      level,
      category,
      message,
      data,
      source: this.getCallSource(),
    };

    // 로그 추가
    this.state.logs.push(entry);

    // 최대 로그 수 제한
    if (this.state.logs.length > this.config.maxLogEntries) {
      this.state.logs = this.state.logs.slice(-this.config.maxLogEntries);
    }

    // 콘솔 출력
    if (this.config.logToConsole) {
      this.outputToConsole(entry);
    }

    // 리스너 알림
    this.notifyListeners('onLog', entry);

    // 에러 시 일시정지
    if (level === 'error' && this.config.pauseOnError) {
      // 게임 일시정지 로직
    }
  }

  private getCallSource(): LogSource | undefined {
    if (!this.config.enabled) return undefined;

    try {
      const stack = new Error().stack;
      if (!stack) return undefined;

      const lines = stack.split('\n');
      // 3번째 줄이 실제 호출자 (0: Error, 1: getCallSource, 2: log, 3: caller)
      const callerLine = lines[4] || '';
      const match = callerLine.match(/at\s+(.+)\s+\((.+):(\d+):(\d+)\)/);

      if (match) {
        return {
          function: match[1],
          file: match[2],
          line: parseInt(match[3], 10),
        };
      }
    } catch {
      return undefined;
    }

    return undefined;
  }

  private outputToConsole(entry: LogEntry): void {
    const prefix = `[${entry.category}]`;
    const timestamp = entry.timestamp.toISOString().substring(11, 23);

    switch (entry.level) {
      case 'error':
        console.error(`${timestamp} ${prefix}`, entry.message, entry.data || '');
        break;
      case 'warn':
        console.warn(`${timestamp} ${prefix}`, entry.message, entry.data || '');
        break;
      case 'info':
        console.info(`${timestamp} ${prefix}`, entry.message, entry.data || '');
        break;
      case 'debug':
        console.debug(`${timestamp} ${prefix}`, entry.message, entry.data || '');
        break;
      case 'trace':
        console.log(`${timestamp} ${prefix}`, entry.message, entry.data || '');
        break;
    }
  }

  // 편의 메서드
  error(category: string, message: string, data?: any): void {
    this.log('error', category, message, data);
  }

  warn(category: string, message: string, data?: any): void {
    this.log('warn', category, message, data);
  }

  info(category: string, message: string, data?: any): void {
    this.log('info', category, message, data);
  }

  debug(category: string, message: string, data?: any): void {
    this.log('debug', category, message, data);
  }

  trace(category: string, message: string, data?: any): void {
    this.log('trace', category, message, data);
  }

  // 로그 필터링
  getLogs(filter?: LogFilter): LogEntry[] {
    let logs = [...this.state.logs];

    if (filter) {
      if (filter.level) {
        const levels: DebugLevel[] = ['error', 'warn', 'info', 'debug', 'trace'];
        const filterIndex = levels.indexOf(filter.level);
        logs = logs.filter((l) => levels.indexOf(l.level) <= filterIndex);
      }
      if (filter.category) {
        logs = logs.filter((l) => l.category === filter.category);
      }
      if (filter.search) {
        const search = filter.search.toLowerCase();
        logs = logs.filter((l) =>
          l.message.toLowerCase().includes(search) ||
          l.category.toLowerCase().includes(search),
        );
      }
      if (filter.startTime) {
        logs = logs.filter((l) => l.timestamp >= filter.startTime!);
      }
      if (filter.endTime) {
        logs = logs.filter((l) => l.timestamp <= filter.endTime!);
      }
    }

    return logs;
  }

  clearLogs(): void {
    this.state.logs = [];
  }

  // ============================================
  // State Inspection
  // ============================================

  createSnapshot(label: string): StateSnapshot {
    const state = this.getGameState();
    const previousSnapshot = this.state.snapshots[this.state.snapshots.length - 1];

    const snapshot: StateSnapshot = {
      id: `snap_${Date.now()}`,
      timestamp: new Date(),
      label,
      state: JSON.parse(JSON.stringify(state)),
      diff: previousSnapshot ? this.calculateDiff(previousSnapshot.state, state) : undefined,
    };

    this.state.snapshots.push(snapshot);

    // 최대 100개 스냅샷 유지
    if (this.state.snapshots.length > 100) {
      this.state.snapshots.shift();
    }

    this.notifyListeners('onSnapshot', snapshot);
    this.info('Debug', `Snapshot created: ${label}`);

    return snapshot;
  }

  private calculateDiff(oldState: any, newState: any, path: string = ''): StateDiff {
    const diff: StateDiff = {
      added: [],
      removed: [],
      modified: [],
    };

    const oldKeys = new Set(Object.keys(oldState || {}));
    const newKeys = new Set(Object.keys(newState || {}));

    // 추가된 키
    newKeys.forEach((key) => {
      if (!oldKeys.has(key)) {
        diff.added.push(path ? `${path}.${key}` : key);
      }
    });

    // 제거된 키
    oldKeys.forEach((key) => {
      if (!newKeys.has(key)) {
        diff.removed.push(path ? `${path}.${key}` : key);
      }
    });

    // 수정된 키
    oldKeys.forEach((key) => {
      if (newKeys.has(key)) {
        const fullPath = path ? `${path}.${key}` : key;
        const oldVal = oldState[key];
        const newVal = newState[key];

        if (typeof oldVal === 'object' && typeof newVal === 'object') {
          const nestedDiff = this.calculateDiff(oldVal, newVal, fullPath);
          diff.added.push(...nestedDiff.added);
          diff.removed.push(...nestedDiff.removed);
          diff.modified.push(...nestedDiff.modified);
        } else if (oldVal !== newVal) {
          diff.modified.push({
            path: fullPath,
            oldValue: oldVal,
            newValue: newVal,
          });
        }
      }
    });

    return diff;
  }

  getSnapshots(): StateSnapshot[] {
    return [...this.state.snapshots];
  }

  restoreSnapshot(snapshotId: string): boolean {
    const snapshot = this.state.snapshots.find((s) => s.id === snapshotId);
    if (!snapshot) return false;

    this.setGameState(JSON.parse(JSON.stringify(snapshot.state)));
    this.info('Debug', `Restored snapshot: ${snapshot.label}`);
    return true;
  }

  // 북마크
  addBookmark(path: string, label: string): StateBookmark {
    const bookmark: StateBookmark = {
      id: `bm_${Date.now()}`,
      path,
      label,
      value: this.getValueAtPath(this.getGameState(), path),
    };
    this.state.bookmarks.push(bookmark);
    return bookmark;
  }

  getBookmarks(): StateBookmark[] {
    return [...this.state.bookmarks];
  }

  removeBookmark(id: string): void {
    this.state.bookmarks = this.state.bookmarks.filter((b) => b.id !== id);
  }

  private getValueAtPath(obj: any, path: string): any {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }

  private setValueAtPath(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    const target = keys.reduce((o, k) => {
      if (!(k in o)) o[k] = {};
      return o[k];
    }, obj);
    target[lastKey] = value;
  }

  // ============================================
  // Cheat Codes
  // ============================================

  executeCheat(codeOrId: string, params?: Record<string, any>): CheatResult {
    const cheat = findCheatByCode(codeOrId) || findCheatById(codeOrId);

    if (!cheat) {
      return { success: false, message: `Unknown cheat: ${codeOrId}` };
    }

    if (!cheat.enabled) {
      return { success: false, message: `Cheat is disabled: ${cheat.name}` };
    }

    if (cheat.requiresDebugMode && !this.config.enableCheats) {
      return { success: false, message: 'Debug mode required for this cheat' };
    }

    try {
      const state = this.getGameState();
      const changes: Record<string, any> = {};
      const { action } = cheat;

      // 파라미터 처리
      const actionValue = params?.[cheat.params?.[0]?.name || ''] ?? action.value;

      switch (action.type) {
        case 'set':
          this.setValueAtPath(state, action.target, actionValue);
          changes[action.target] = actionValue;
          break;

        case 'add':
          const currentAdd = this.getValueAtPath(state, action.target) || 0;
          const newAdd = currentAdd + actionValue;
          this.setValueAtPath(state, action.target, newAdd);
          changes[action.target] = newAdd;
          break;

        case 'multiply':
          const currentMul = this.getValueAtPath(state, action.target) || 1;
          const newMul = currentMul * actionValue;
          this.setValueAtPath(state, action.target, newMul);
          changes[action.target] = newMul;
          break;

        case 'toggle':
          const currentToggle = this.getValueAtPath(state, action.target) || false;
          const newToggle = !currentToggle;
          this.setValueAtPath(state, action.target, newToggle);
          changes[action.target] = newToggle;
          break;

        case 'trigger':
          // 커스텀 핸들러 호출
          if (action.handler) {
            action.handler(params);
          }
          break;

        case 'custom':
          if (action.handler) {
            action.handler(params);
          }
          break;
      }

      this.setGameState(state);

      // 활성 치트 목록 업데이트
      if (action.type === 'toggle') {
        if (changes[action.target]) {
          if (!this.state.activeCheats.includes(cheat.id)) {
            this.state.activeCheats.push(cheat.id);
          }
        } else {
          this.state.activeCheats = this.state.activeCheats.filter((c) => c !== cheat.id);
        }
      }

      const result: CheatResult = {
        success: true,
        message: `Cheat activated: ${cheat.name}`,
        changes,
      };

      this.notifyListeners('onCheatActivated', cheat.id, result);
      this.info('Cheat', `Activated: ${cheat.name}`, changes);

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.error('Cheat', `Failed to execute: ${cheat.name}`, { error: message });
      return { success: false, message: `Failed: ${message}` };
    }
  }

  getActiveCheats(): string[] {
    return [...this.state.activeCheats];
  }

  deactivateAllCheats(): void {
    for (const cheatId of this.state.activeCheats) {
      const cheat = findCheatById(cheatId);
      if (cheat?.action.type === 'toggle') {
        this.executeCheat(cheatId);
      }
    }
    this.state.activeCheats = [];
  }

  // ============================================
  // Performance Monitoring
  // ============================================

  startFPSMonitoring(): void {
    if (this.fpsInterval) return;

    this.lastFrameTime = performance.now();
    this.frameCount = 0;

    this.fpsInterval = setInterval(() => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      const fps = Math.round((this.frameCount * 1000) / delta);

      const metrics = this.collectPerformanceMetrics(fps, delta / this.frameCount);

      const entry: PerformanceEntry = {
        timestamp: new Date(),
        metrics,
        markers: this.state.markers
          .filter((m) => !m.endTime)
          .map((m) => m.name),
      };

      this.state.performanceHistory.push(entry);

      // 최대 1000개 엔트리 유지
      if (this.state.performanceHistory.length > 1000) {
        this.state.performanceHistory.shift();
      }

      this.notifyListeners('onPerformanceUpdate', metrics);

      this.lastFrameTime = now;
      this.frameCount = 0;
    }, 1000);
  }

  stopFPSMonitoring(): void {
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
      this.fpsInterval = null;
    }
  }

  recordFrame(): void {
    this.frameCount++;
  }

  private collectPerformanceMetrics(fps: number, frameTime: number): PerformanceMetrics {
    const metrics: PerformanceMetrics = { fps, frameTime };

    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      metrics.jsHeapSize = memory?.usedJSHeapSize;
      metrics.heapSize = memory?.totalJSHeapSize;
    }

    if (typeof document !== 'undefined') {
      metrics.domNodes = document.getElementsByTagName('*').length;
    }

    return metrics;
  }

  getPerformanceHistory(): PerformanceEntry[] {
    return [...this.state.performanceHistory];
  }

  markStart(name: string, category: string = 'custom'): void {
    const marker: PerformanceMarker = {
      name,
      startTime: performance.now(),
      category,
    };
    this.state.markers.push(marker);
  }

  markEnd(name: string): number | null {
    const marker = this.state.markers.find((m) => m.name === name && !m.endTime);
    if (!marker) return null;

    marker.endTime = performance.now();
    marker.duration = marker.endTime - marker.startTime;

    this.trace('Performance', `${name}: ${marker.duration.toFixed(2)}ms`);
    return marker.duration;
  }

  // ============================================
  // Time Manipulation
  // ============================================

  setTimeMode(mode: TimeMode): void {
    const speedMap: Record<TimeMode, number> = {
      normal: 1,
      paused: 0,
      slow: 0.5,
      fast: 2,
      instant: 100,
    };

    this.state.timeConfig.mode = mode;
    this.state.timeConfig.speed = speedMap[mode];
    this.state.timeConfig.skipAnimations = mode === 'instant';
    this.state.timeConfig.instantActions = mode === 'instant';

    this.info('Debug', `Time mode: ${mode} (${this.state.timeConfig.speed}x)`);
  }

  setTimeSpeed(speed: number): void {
    this.state.timeConfig.speed = Math.max(0, Math.min(100, speed));
    this.state.timeConfig.mode = speed === 1 ? 'normal' : 'fast';

    this.info('Debug', `Time speed: ${speed}x`);
  }

  getTimeConfig(): TimeManipulationConfig {
    return { ...this.state.timeConfig };
  }

  // ============================================
  // Console Commands
  // ============================================

  private registerDefaultCommands(): void {
    this.registerCommand({
      name: 'help',
      aliases: ['?', 'h'],
      description: 'Show available commands',
      usage: 'help [command]',
      handler: (args) => {
        if (args[0]) {
          const cmd = this.commands.get(args[0]);
          if (cmd) {
            return {
              type: 'info',
              content: `${cmd.name}: ${cmd.description}\nUsage: ${cmd.usage}`,
            };
          }
          return { type: 'error', content: `Unknown command: ${args[0]}` };
        }

        const cmds = Array.from(this.commands.values())
          .map((c) => `${c.name} - ${c.description}`)
          .join('\n');
        return { type: 'info', content: `Available commands:\n${cmds}` };
      },
    });

    this.registerCommand({
      name: 'clear',
      aliases: ['cls'],
      description: 'Clear console',
      usage: 'clear',
      handler: () => {
        this.clearLogs();
        return { type: 'success', content: 'Console cleared' };
      },
    });

    this.registerCommand({
      name: 'cheat',
      aliases: ['c'],
      description: 'Execute a cheat code',
      usage: 'cheat <code> [params...]',
      handler: (args) => {
        if (!args[0]) {
          return { type: 'error', content: 'Usage: cheat <code>' };
        }
        const result = this.executeCheat(args[0]);
        return {
          type: result.success ? 'success' : 'error',
          content: result.message,
        };
      },
    });

    this.registerCommand({
      name: 'cheats',
      description: 'List all cheat codes',
      usage: 'cheats [category]',
      handler: (args) => {
        let cheats = allCheats;
        if (args[0]) {
          cheats = cheats.filter((c) => c.category === args[0]);
        }
        const list = cheats.map((c) => `${c.code} (${c.name}) - ${c.description}`).join('\n');
        return { type: 'info', content: `Cheat codes:\n${list}` };
      },
    });

    this.registerCommand({
      name: 'snapshot',
      aliases: ['snap'],
      description: 'Create a state snapshot',
      usage: 'snapshot [label]',
      handler: (args) => {
        const label = args.join(' ') || `Snapshot ${this.state.snapshots.length + 1}`;
        const snapshot = this.createSnapshot(label);
        return { type: 'success', content: `Created snapshot: ${snapshot.id}` };
      },
    });

    this.registerCommand({
      name: 'restore',
      description: 'Restore a state snapshot',
      usage: 'restore <snapshot_id>',
      handler: (args) => {
        if (!args[0]) {
          return { type: 'error', content: 'Usage: restore <snapshot_id>' };
        }
        const success = this.restoreSnapshot(args[0]);
        return {
          type: success ? 'success' : 'error',
          content: success ? 'Snapshot restored' : 'Snapshot not found',
        };
      },
    });

    this.registerCommand({
      name: 'get',
      description: 'Get a state value',
      usage: 'get <path>',
      handler: (args) => {
        if (!args[0]) {
          return { type: 'error', content: 'Usage: get <path>' };
        }
        const value = this.getValueAtPath(this.getGameState(), args[0]);
        return { type: 'json', content: value };
      },
    });

    this.registerCommand({
      name: 'set',
      description: 'Set a state value',
      usage: 'set <path> <value>',
      handler: (args) => {
        if (args.length < 2) {
          return { type: 'error', content: 'Usage: set <path> <value>' };
        }
        const path = args[0];
        let value: any = args.slice(1).join(' ');

        // 타입 변환 시도
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        else if (!isNaN(Number(value))) value = Number(value);

        const state = this.getGameState();
        this.setValueAtPath(state, path, value);
        this.setGameState(state);

        return { type: 'success', content: `Set ${path} = ${JSON.stringify(value)}` };
      },
    });

    this.registerCommand({
      name: 'time',
      description: 'Set time mode',
      usage: 'time <normal|paused|slow|fast|instant>',
      handler: (args) => {
        const mode = args[0] as TimeMode;
        if (!['normal', 'paused', 'slow', 'fast', 'instant'].includes(mode)) {
          return { type: 'error', content: 'Usage: time <normal|paused|slow|fast|instant>' };
        }
        this.setTimeMode(mode);
        return { type: 'success', content: `Time mode: ${mode}` };
      },
    });

    this.registerCommand({
      name: 'fps',
      description: 'Toggle FPS display',
      usage: 'fps',
      handler: () => {
        this.setConfig({ showFPS: !this.config.showFPS });
        return {
          type: 'success',
          content: `FPS display: ${this.config.showFPS ? 'ON' : 'OFF'}`,
        };
      },
    });
  }

  registerCommand(command: ConsoleCommand): void {
    this.commands.set(command.name, command);
    if (command.aliases) {
      command.aliases.forEach((alias) => {
        this.commands.set(alias, command);
      });
    }
  }

  executeCommand(input: string): ConsoleOutput {
    const parts = input.trim().split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = this.commands.get(commandName);
    if (!command) {
      return { type: 'error', content: `Unknown command: ${commandName}. Type 'help' for available commands.` };
    }

    this.state.commandHistory.push(input);
    if (this.state.commandHistory.length > 100) {
      this.state.commandHistory.shift();
    }

    try {
      return command.handler(args, this.getGameState());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { type: 'error', content: `Error: ${message}` };
    }
  }

  getCommandHistory(): string[] {
    return [...this.state.commandHistory];
  }

  // ============================================
  // Keyboard Listener
  // ============================================

  private setupKeyboardListener(): void {
    if (typeof window === 'undefined') return;

    const keyMap: Record<string, string> = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
      KeyA: 'a',
      KeyB: 'b',
    };

    window.addEventListener('keydown', (e) => {
      const key = keyMap[e.code] || e.key.toLowerCase();

      // 코나미 코드 체크
      this.konamiSequence.push(key);
      if (this.konamiSequence.length > 10) {
        this.konamiSequence.shift();
      }

      if (checkKonamiCode(this.konamiSequence)) {
        this.enable();
        this.setConfig({ enableCheats: true });
        this.info('Debug', 'Konami Code activated! Cheats enabled.');
        this.konamiSequence = [];
      }

      // F12로 디버그 패널 토글
      if (e.key === 'F12' && e.shiftKey) {
        e.preventDefault();
        this.togglePanel();
      }
    });
  }

  // ============================================
  // Panel Control
  // ============================================

  togglePanel(): void {
    this.state.panel.isOpen = !this.state.panel.isOpen;
    this.notifyListeners('onPanelToggle', this.state.panel.isOpen);
  }

  setPanelTab(tab: DebugPanelTab): void {
    this.state.panel.activeTab = tab;
  }

  getPanelState(): DebugPanelState {
    return { ...this.state.panel };
  }

  // ============================================
  // Cleanup
  // ============================================

  cleanup(): void {
    this.stopFPSMonitoring();
    this.listeners.clear();
  }
}

// 싱글톤 인스턴스
export const debugManager = new DebugManager();
