'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bug,
  Terminal,
  Settings,
  Play,
  Pause,
  FastForward,
  ChevronUp,
  ChevronDown,
  X,
  Trash2,
  Download,
  Copy,
  Clock,
  Cpu,
  Activity,
  AlertTriangle,
  Info,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDebug } from '@/game/store/systemIntegration';

interface DebugPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'console' | 'cheats' | 'state' | 'performance';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  module: string;
  message: string;
}

interface CheatCode {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
}

// Sample cheat codes
const cheatCodes: CheatCode[] = [
  { id: '1', code: 'MONEY', name: '자금 추가', description: '+1,000,000원', category: 'resource' },
  { id: '2', code: 'USERS', name: '사용자 추가', description: '+1,000명', category: 'resource' },
  { id: '3', code: 'ENERGY', name: '에너지 회복', description: '에너지 100%', category: 'resource' },
  { id: '4', code: 'STRESS', name: '스트레스 제거', description: '스트레스 0%', category: 'resource' },
  { id: '5', code: 'SKIPDAY', name: '다음 날', description: '하루 스킵', category: 'time' },
  { id: '6', code: 'SKIPWEEK', name: '일주일 스킵', description: '7일 스킵', category: 'time' },
  { id: '7', code: 'SKIPMONTH', name: '한 달 스킵', description: '30일 스킵', category: 'time' },
  { id: '8', code: 'GODMODE', name: '갓 모드', description: '무한 자원', category: 'debug' },
  { id: '9', code: 'UNLOCK_ALL', name: '전체 해금', description: '모든 기능 해금', category: 'unlock' },
  { id: '10', code: 'WIN', name: '즉시 승리', description: '최고 엔딩 트리거', category: 'ending' },
  { id: '11', code: 'LOSE', name: '즉시 패배', description: '게임 오버 트리거', category: 'ending' },
];

const logLevelIcons = {
  info: <Info className="w-4 h-4 text-blue-400" />,
  warn: <AlertTriangle className="w-4 h-4 text-yellow-400" />,
  error: <AlertCircle className="w-4 h-4 text-red-400" />,
  debug: <Bug className="w-4 h-4 text-gray-400" />,
};

const logLevelColors = {
  info: 'text-blue-300',
  warn: 'text-yellow-300',
  error: 'text-red-300',
  debug: 'text-gray-400',
};

export function DebugPanel({ isOpen, onClose }: DebugPanelProps) {
  const { executeCheat, executeCommand } = useDebug();
  const [activeTab, setActiveTab] = useState<TabType>('console');
  const [commandInput, setCommandInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample game state for display
  const [gameState] = useState({
    day: 45,
    cash: 2500000,
    users: 15000,
    energy: 75,
    stress: 35,
    actions: 3,
    phase: 'playing',
  });

  // Performance metrics
  const [perfMetrics] = useState({
    fps: 60,
    memory: 128,
    renderTime: 8.5,
    updateTime: 2.3,
  });

  useEffect(() => {
    // Scroll to bottom when new logs are added
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Add some sample logs on mount
  useEffect(() => {
    setLogs([
      { id: '1', timestamp: new Date(), level: 'info', module: 'System', message: 'Debug panel initialized' },
      { id: '2', timestamp: new Date(), level: 'debug', module: 'GameLoop', message: 'Frame rate: 60 FPS' },
      { id: '3', timestamp: new Date(), level: 'info', module: 'SaveSystem', message: 'Auto-save completed' },
    ]);
  }, []);

  const handleCommand = useCallback((command: string) => {
    if (!command.trim()) return;

    // Add to history
    setCommandHistory((prev) => [command, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);

    // Add command to logs
    const cmdLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level: 'info',
      module: 'Console',
      message: `> ${command}`,
    };
    setLogs((prev) => [...prev, cmdLog]);

    // Process command
    const result = executeCommand(command);

    // Add result to logs
    const resultLog: LogEntry = {
      id: (Date.now() + 1).toString(),
      timestamp: new Date(),
      level: result?.success ? 'info' : 'error',
      module: 'Console',
      message: result?.message || 'Command executed',
    };
    setLogs((prev) => [...prev, resultLog]);

    setCommandInput('');
  }, [executeCommand]);

  const handleCheat = useCallback((code: string) => {
    const result = executeCheat(code);

    const log: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level: result?.success ? 'info' : 'error',
      module: 'Cheat',
      message: result?.message || `Cheat executed: ${code}`,
    };
    setLogs((prev) => [...prev, log]);
  }, [executeCheat]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(commandInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommandInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommandInput(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    }
  };

  const clearLogs = () => setLogs([]);

  const exportLogs = () => {
    const content = logs
      .map((log) => `[${log.timestamp.toISOString()}] [${log.level.toUpperCase()}] [${log.module}] ${log.message}`)
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `debug-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'console', label: '콘솔', icon: <Terminal className="w-4 h-4" /> },
    { id: 'cheats', label: '치트', icon: <Bug className="w-4 h-4" /> },
    { id: 'state', label: '상태', icon: <Settings className="w-4 h-4" /> },
    { id: 'performance', label: '성능', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50 transition-all ${
        isMinimized ? 'h-10' : 'h-80'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-10 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-violet-400">
            <Bug className="w-4 h-4" />
            Debug Panel
          </div>

          {/* Tabs */}
          {!isMinimized && (
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors ${
                    activeTab === tab.id
                      ? 'bg-violet-600 text-white'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            {isMinimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isMinimized && (
        <div className="h-[calc(100%-2.5rem)] overflow-hidden">
          {/* Console Tab */}
          {activeTab === 'console' && (
            <div className="flex flex-col h-full">
              {/* Toolbar */}
              <div className="flex items-center gap-2 px-2 py-1 bg-gray-800/50 border-b border-gray-700">
                <button
                  onClick={clearLogs}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
                <button
                  onClick={exportLogs}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>

              {/* Log List */}
              <div className="flex-1 overflow-y-auto p-2 font-mono text-xs">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-2 py-0.5 hover:bg-gray-800/50">
                    <span className="text-gray-500">
                      {log.timestamp.toLocaleTimeString()}
                    </span>
                    {logLevelIcons[log.level]}
                    <span className="text-gray-400">[{log.module}]</span>
                    <span className={logLevelColors[log.level]}>{log.message}</span>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 p-2 bg-gray-800 border-t border-gray-700">
                <span className="text-violet-400">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter command..."
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Cheats Tab */}
          {activeTab === 'cheats' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {cheatCodes.map((cheat) => (
                  <button
                    key={cheat.id}
                    onClick={() => handleCheat(cheat.code)}
                    className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 text-left transition-colors"
                  >
                    <div className="text-xs text-violet-400 font-mono mb-1">{cheat.code}</div>
                    <div className="text-sm font-medium text-white">{cheat.name}</div>
                    <div className="text-xs text-gray-400">{cheat.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* State Tab */}
          {activeTab === 'state' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatBox label="Day" value={gameState.day} />
                <StatBox label="Cash" value={`₩${gameState.cash.toLocaleString()}`} />
                <StatBox label="Users" value={gameState.users.toLocaleString()} />
                <StatBox label="Energy" value={`${gameState.energy}%`} />
                <StatBox label="Stress" value={`${gameState.stress}%`} />
                <StatBox label="Actions" value={gameState.actions} />
                <StatBox label="Phase" value={gameState.phase} />
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Raw State</h3>
                <pre className="bg-gray-800 p-3 rounded-lg text-xs text-gray-300 overflow-x-auto">
                  {JSON.stringify(gameState, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="h-full overflow-y-auto p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <PerfBox
                  icon={<Activity className="w-5 h-5" />}
                  label="FPS"
                  value={perfMetrics.fps}
                  unit="fps"
                  color={perfMetrics.fps >= 60 ? 'green' : perfMetrics.fps >= 30 ? 'yellow' : 'red'}
                />
                <PerfBox
                  icon={<Cpu className="w-5 h-5" />}
                  label="Memory"
                  value={perfMetrics.memory}
                  unit="MB"
                  color={perfMetrics.memory < 200 ? 'green' : perfMetrics.memory < 400 ? 'yellow' : 'red'}
                />
                <PerfBox
                  icon={<Clock className="w-5 h-5" />}
                  label="Render"
                  value={perfMetrics.renderTime}
                  unit="ms"
                  color={perfMetrics.renderTime < 16 ? 'green' : perfMetrics.renderTime < 33 ? 'yellow' : 'red'}
                />
                <PerfBox
                  icon={<Clock className="w-5 h-5" />}
                  label="Update"
                  value={perfMetrics.updateTime}
                  unit="ms"
                  color={perfMetrics.updateTime < 5 ? 'green' : perfMetrics.updateTime < 10 ? 'yellow' : 'red'}
                />
              </div>

              {/* Time Controls */}
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-400 mb-2">시간 제어</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Pause className="w-4 h-4 mr-1" />
                    일시정지
                  </Button>
                  <Button variant="outline" size="sm">
                    <Play className="w-4 h-4 mr-1" />
                    재생
                  </Button>
                  <Button variant="outline" size="sm">
                    <FastForward className="w-4 h-4 mr-1" />
                    2x
                  </Button>
                  <Button variant="outline" size="sm">
                    <FastForward className="w-4 h-4 mr-1" />
                    4x
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className="text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function PerfBox({
  icon,
  label,
  value,
  unit,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  color: 'green' | 'yellow' | 'red';
}) {
  const colorClasses = {
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
      <div className="flex items-center gap-2 text-gray-400 mb-2">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className={`text-xl font-bold ${colorClasses[color]}`}>
        {value}
        <span className="text-xs text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );
}

export default DebugPanel;
