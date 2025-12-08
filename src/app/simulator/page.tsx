'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Pause, Play, RotateCcw, Trophy, Info,
  Clock, Briefcase, Users, DollarSign, Server, Heart,
  Brain, Zap, TrendingUp, Settings, Save, FolderOpen,
  CheckCircle, AlertTriangle, Star, Target, Calendar
} from 'lucide-react';
import { useGameStore } from '@/game/store/gameStore';
import { TASKS } from '@/game/data/tasks';
import { EVENTS } from '@/game/data/events';
import {
  Task, TaskCategory, GameEvent, DecisionOption,
  DayPhase, Difficulty
} from '@/game/types';

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('ko-KR').format(Math.round(amount)) + '원';

const formatNumber = (num: number) =>
  new Intl.NumberFormat('ko-KR').format(Math.round(num));

const getDayPhaseIcon = (phase: DayPhase) => {
  switch (phase) {
    case 'morning': return '🌅';
    case 'afternoon': return '☀️';
    case 'evening': return '🌆';
    case 'night': return '🌙';
  }
};

const getDayPhaseLabel = (phase: DayPhase) => {
  switch (phase) {
    case 'morning': return '아침';
    case 'afternoon': return '오후';
    case 'evening': return '저녁';
    case 'night': return '밤';
  }
};

const StatBar = ({
  label, value, max, color, icon, warning = false
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ReactNode;
  warning?: boolean;
}) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-400 flex items-center gap-1">
        {icon} {label}
      </span>
      <span className={`font-bold ${warning && value < max * 0.3 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
        {Math.round(value)}/{max}
      </span>
    </div>
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
      />
    </div>
  </div>
);

const CategoryButton = ({
  category,
  icon,
  label,
  selected,
  onClick
}: {
  category: TaskCategory;
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg text-xs transition-all ${
      selected
        ? 'bg-violet-600 text-white'
        : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
    }`}
  >
    <div className="flex flex-col items-center gap-1">
      {icon}
      <span>{label}</span>
    </div>
  </button>
);

export default function SimulatorPage() {
  const store = useGameStore();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<TaskCategory>('development');
  const [showSaveSlots, setShowSaveSlots] = useState(false);
  const [showLoadSlots, setShowLoadSlots] = useState(false);

  // Initialize game on mount
  useEffect(() => {
    // Check if game has been initialized
    if (store.time.totalDays === 0) {
      setShowDifficultyModal(true);
    } else {
      setShowDifficultyModal(false);
    }
  }, []);

  // Game tick effect
  useEffect(() => {
    if (store.time.isPaused || store.gameOver || store.currentEvent) return;

    const interval = setInterval(() => {
      store.tick();

      // Random event trigger (12% chance per tick)
      if (Math.random() < 0.12 && !store.currentEvent && !store.activeTask) {
        const eligibleEvents = EVENTS.filter(e => {
          if (e.minDay && store.time.totalDays < e.minDay) return false;
          return true;
        });
        if (eligibleEvents.length > 0) {
          const randomEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
          store.triggerEvent(randomEvent);
        }
      }
    }, store.time.speed === 1 ? 2000 : store.time.speed === 2 ? 1000 : 500);

    return () => clearInterval(interval);
  }, [store.time.isPaused, store.gameOver, store.currentEvent, store.time.speed]);

  const handleStartGame = useCallback((difficulty: Difficulty) => {
    store.initializeGame(difficulty);
    setShowDifficultyModal(false);
  }, [store]);

  const handleTaskSelect = useCallback((task: Task) => {
    if (store.player.health.energy < task.requirements.energy) {
      alert('에너지가 부족합니다!');
      return;
    }
    if (task.requirements.money && store.business.finance.cash < task.requirements.money) {
      alert('자금이 부족합니다!');
      return;
    }
    store.startTask(task);
    setShowTaskModal(false);
  }, [store]);

  const handleEventChoice = useCallback((choice: DecisionOption) => {
    store.handleEventChoice(choice);
  }, [store]);

  const monthlyRevenue = store.business.users.premium * 9990;
  const monthlyCosts =
    store.business.infrastructure.serverHealth > 0
      ? 50000 + Math.floor(store.business.users.total / 100) * 5000
      : 0;
  const monthlyProfit = monthlyRevenue - monthlyCosts;

  // Filter tasks by category
  const filteredTasks = TASKS.filter(t => t.category === selectedTaskCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Difficulty Selection Modal */}
      {showDifficultyModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-black text-center mb-2">
              VocaVision Simulator
            </h2>
            <p className="text-gray-400 text-center text-sm mb-6">
              1인 EdTech 사업 시뮬레이터
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleStartGame('easy')}
                className="w-full p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-left hover:bg-emerald-600/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-emerald-400">쉬움</div>
                    <div className="text-xs text-gray-400">초기 자금 1천만원, 여유로운 시작</div>
                  </div>
                  <span className="text-2xl">🌱</span>
                </div>
              </button>

              <button
                onClick={() => handleStartGame('normal')}
                className="w-full p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl text-left hover:bg-blue-600/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-blue-400">보통</div>
                    <div className="text-xs text-gray-400">초기 자금 500만원, 균형잡힌 도전</div>
                  </div>
                  <span className="text-2xl">⚖️</span>
                </div>
              </button>

              <button
                onClick={() => handleStartGame('hard')}
                className="w-full p-4 bg-amber-600/20 border border-amber-500/30 rounded-xl text-left hover:bg-amber-600/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-amber-400">어려움</div>
                    <div className="text-xs text-gray-400">초기 자금 200만원, 생존이 목표</div>
                  </div>
                  <span className="text-2xl">🔥</span>
                </div>
              </button>

              <button
                onClick={() => handleStartGame('realistic')}
                className="w-full p-4 bg-red-600/20 border border-red-500/30 rounded-xl text-left hover:bg-red-600/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-red-400">현실</div>
                    <div className="text-xs text-gray-400">초기 자금 100만원, 실제 창업 체험</div>
                  </div>
                  <span className="text-2xl">💀</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                  VocaVision
                </h1>
                <p className="text-xs text-gray-500">1인 EdTech 시뮬레이터</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Time Display */}
              <div className="text-right mr-2">
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="font-bold">Day {store.time.totalDays}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {getDayPhaseIcon(store.time.dayPhase)} {getDayPhaseLabel(store.time.dayPhase)}
                </div>
              </div>

              {/* Controls */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHelpModal(true)}
                className="text-gray-400 hover:text-white"
              >
                <Info className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettingsModal(true)}
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={store.togglePause}
                className="text-gray-400 hover:text-white"
              >
                {store.time.isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <DollarSign className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
            <div className={`text-sm font-bold ${store.business.finance.cash < 500000 ? 'text-red-400' : 'text-emerald-400'}`}>
              {formatMoney(store.business.finance.cash)}
            </div>
            <div className="text-xs text-gray-500">잔고</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
            <div className="text-sm font-bold">{formatNumber(store.business.users.total)}</div>
            <div className="text-xs text-gray-500">사용자</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1 text-amber-400" />
            <div className="text-sm font-bold text-amber-400">{formatNumber(store.business.users.premium)}</div>
            <div className="text-xs text-gray-500">프리미엄</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-400" />
            <div className="text-sm font-bold">{store.player.social.reputation}</div>
            <div className="text-xs text-gray-500">평판</div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-semibold">플레이어 상태</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <StatBar
              label="에너지"
              value={store.player.health.energy}
              max={100}
              color="bg-emerald-500"
              icon={<Zap className="w-3 h-3" />}
              warning
            />
            <StatBar
              label="스트레스"
              value={store.player.health.stress}
              max={100}
              color="bg-red-500"
              icon={<AlertTriangle className="w-3 h-3" />}
            />
            <StatBar
              label="체력"
              value={store.player.health.physical}
              max={100}
              color="bg-pink-500"
              icon={<Heart className="w-3 h-3" />}
              warning
            />
            <StatBar
              label="정신력"
              value={store.player.health.mental}
              max={100}
              color="bg-blue-500"
              icon={<Brain className="w-3 h-3" />}
              warning
            />
          </div>
        </div>

        {/* Business Metrics */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold">비즈니스 현황</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-emerald-500/20 rounded-lg p-2">
              <div className="text-emerald-400 font-bold">{formatMoney(monthlyRevenue)}</div>
              <div className="text-gray-500">월 수익</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-2">
              <div className="text-red-400 font-bold">{formatMoney(monthlyCosts)}</div>
              <div className="text-gray-500">월 비용</div>
            </div>
            <div className={`${monthlyProfit >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'} rounded-lg p-2`}>
              <div className={`${monthlyProfit >= 0 ? 'text-blue-400' : 'text-orange-400'} font-bold`}>
                {monthlyProfit >= 0 ? '+' : ''}{formatMoney(monthlyProfit)}
              </div>
              <div className="text-gray-500">순이익</div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="mt-3">
            <StatBar
              label="서버 상태"
              value={store.business.infrastructure.serverHealth}
              max={100}
              color="bg-blue-500"
              icon={<Server className="w-3 h-3" />}
              warning
            />
            <StatBar
              label="제품 안정성"
              value={store.business.product.stability}
              max={100}
              color="bg-purple-500"
              icon={<CheckCircle className="w-3 h-3" />}
            />
          </div>
        </div>

        {/* Current Task */}
        {store.activeTask && (
          <div className="bg-violet-600/20 border border-violet-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400 animate-spin" />
                <span className="text-sm font-semibold">진행 중인 업무</span>
              </div>
              <span className="text-xs text-gray-400">
                {Math.round(store.activeTask.progress)}%
              </span>
            </div>
            <div className="text-lg font-bold mb-1">{store.activeTask.task.name}</div>
            <div className="text-xs text-gray-400 mb-2">{store.activeTask.task.description}</div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
                style={{ width: `${store.activeTask.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        {!store.activeTask && (
          <Button
            onClick={() => setShowTaskModal(true)}
            variant="gradient"
            className="w-full py-6 text-lg"
            disabled={store.time.isPaused}
          >
            <Briefcase className="w-5 h-5 mr-2" />
            업무 선택하기
          </Button>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => {
              store.applyEffects([{ type: 'energy', value: 30 }]);
              store.tick();
              store.tick();
            }}
            disabled={store.time.isPaused || store.activeTask !== null}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:opacity-50 rounded-xl p-3 text-center transition-all active:scale-95"
          >
            <div className="text-lg">😴</div>
            <div className="text-xs">휴식</div>
          </button>
          <button
            onClick={() => {
              if (store.player.health.energy >= 10) {
                store.applyEffects([
                  { type: 'energy', value: -10 },
                  { type: 'stress', value: -15 },
                  { type: 'health', value: 5 },
                ]);
              }
            }}
            disabled={store.time.isPaused || store.player.health.energy < 10}
            className="bg-pink-600 hover:bg-pink-500 disabled:bg-gray-700 disabled:opacity-50 rounded-xl p-3 text-center transition-all active:scale-95"
          >
            <div className="text-lg">🏃</div>
            <div className="text-xs">운동</div>
          </button>
          <button
            onClick={() => {
              if (store.business.finance.cash >= 100000) {
                store.applyEffects([
                  { type: 'cash', value: -100000 },
                  { type: 'users', value: Math.floor(Math.random() * 20) + 10 },
                  { type: 'reputation', value: 5 },
                ]);
              }
            }}
            disabled={store.time.isPaused || store.business.finance.cash < 100000}
            className="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:opacity-50 rounded-xl p-3 text-center transition-all active:scale-95"
          >
            <div className="text-lg">📢</div>
            <div className="text-xs">마케팅</div>
          </button>
          <button
            onClick={() => {
              if (store.player.health.energy >= 15) {
                store.applyEffects([
                  { type: 'energy', value: -15 },
                  { type: 'server_health', value: 20 },
                ]);
              }
            }}
            disabled={store.time.isPaused || store.player.health.energy < 15}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:opacity-50 rounded-xl p-3 text-center transition-all active:scale-95"
          >
            <div className="text-lg">🔧</div>
            <div className="text-xs">서버점검</div>
          </button>
        </div>

        {/* Skills */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold">스킬</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {Object.entries(store.player.skills).map(([skill, value]) => (
              <div key={skill} className="bg-gray-700/30 rounded-lg p-2">
                <div className="text-white font-bold">{Math.round(value)}</div>
                <div className="text-gray-500 capitalize">
                  {skill === 'coding' && '코딩'}
                  {skill === 'design' && '디자인'}
                  {skill === 'marketing' && '마케팅'}
                  {skill === 'business' && '비즈니스'}
                  {skill === 'communication' && '소통'}
                  {skill === 'leadership' && '리더십'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Task Selection Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-5 max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold mb-4">업무 선택</h2>

            {/* Category Tabs */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <CategoryButton
                category="development"
                icon={<span>💻</span>}
                label="개발"
                selected={selectedTaskCategory === 'development'}
                onClick={() => setSelectedTaskCategory('development')}
              />
              <CategoryButton
                category="marketing"
                icon={<span>📢</span>}
                label="마케팅"
                selected={selectedTaskCategory === 'marketing'}
                onClick={() => setSelectedTaskCategory('marketing')}
              />
              <CategoryButton
                category="customer_support"
                icon={<span>💬</span>}
                label="고객지원"
                selected={selectedTaskCategory === 'customer_support'}
                onClick={() => setSelectedTaskCategory('customer_support')}
              />
              <CategoryButton
                category="business"
                icon={<span>💼</span>}
                label="비즈니스"
                selected={selectedTaskCategory === 'business'}
                onClick={() => setSelectedTaskCategory('business')}
              />
              <CategoryButton
                category="personal"
                icon={<span>🧘</span>}
                label="개인"
                selected={selectedTaskCategory === 'personal'}
                onClick={() => setSelectedTaskCategory('personal')}
              />
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredTasks.map(task => {
                const canAfford =
                  store.player.health.energy >= task.requirements.energy &&
                  (!task.requirements.money || store.business.finance.cash >= task.requirements.money);

                return (
                  <button
                    key={task.id}
                    onClick={() => handleTaskSelect(task)}
                    disabled={!canAfford}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      canAfford
                        ? 'bg-gray-700/50 hover:bg-gray-700'
                        : 'bg-gray-800/50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-bold flex items-center gap-2">
                          <span>{task.icon}</span>
                          {task.name}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">{task.description}</div>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className={`${store.player.health.energy >= task.requirements.energy ? 'text-emerald-400' : 'text-red-400'}`}>
                        ⚡ {task.requirements.energy}
                      </span>
                      <span className="text-gray-400">
                        🕐 {task.estimatedHours}시간
                      </span>
                      {task.requirements.money && (
                        <span className={`${store.business.finance.cash >= task.requirements.money ? 'text-emerald-400' : 'text-red-400'}`}>
                          💰 {formatMoney(task.requirements.money)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={() => setShowTaskModal(false)}
              variant="outline"
              className="mt-4"
            >
              닫기
            </Button>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {store.currentEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className={`bg-gradient-to-br ${
            store.currentEvent.severity === 'critical' ? 'from-red-900/90 to-red-950/90 border-red-500/50' :
            store.currentEvent.severity === 'warning' ? 'from-amber-900/90 to-amber-950/90 border-amber-500/50' :
            store.currentEvent.severity === 'good' ? 'from-emerald-900/90 to-emerald-950/90 border-emerald-500/50' :
            'from-blue-900/90 to-blue-950/90 border-blue-500/50'
          } border rounded-2xl p-5 max-w-sm w-full`}>
            <h2 className="text-xl font-bold mb-2">
              {store.currentEvent.icon} {store.currentEvent.title}
            </h2>
            <p className="text-sm text-gray-300 mb-4">{store.currentEvent.description}</p>
            <div className="space-y-2">
              {store.currentEvent.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleEventChoice(choice)}
                  className="w-full p-3 bg-gray-800/80 hover:bg-gray-700 rounded-xl text-left text-sm transition-all active:scale-98"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">게임 방법</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h3 className="font-bold text-white mb-1">게임 목표</h3>
                <p>VocaVision 서비스를 성공적으로 운영하여 프리미엄 사용자 1,000명을 확보하거나 현금 1억원을 모으세요!</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">관리해야 할 것들</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>에너지:</strong> 업무 수행에 필요, 휴식으로 회복</li>
                  <li><strong>스트레스:</strong> 100이 되면 번아웃!</li>
                  <li><strong>서버 상태:</strong> 0이 되면 서비스 중단!</li>
                  <li><strong>평판:</strong> 0이 되면 게임 오버!</li>
                  <li><strong>자금:</strong> -100만원이 되면 파산!</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">팁</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>에너지를 잘 관리하며 업무를 선택하세요</li>
                  <li>랜덤 이벤트에 현명하게 대응하세요</li>
                  <li>개발과 마케팅의 균형을 맞추세요</li>
                </ul>
              </div>
            </div>
            <Button
              onClick={() => setShowHelpModal(false)}
              className="w-full mt-4"
              variant="gradient"
            >
              확인
            </Button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-5 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">설정</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">게임 속도</label>
                <div className="flex gap-2">
                  {[1, 2, 4].map(speed => (
                    <button
                      key={speed}
                      onClick={() => store.setSpeed(speed as 1 | 2 | 4)}
                      className={`flex-1 p-2 rounded-lg ${
                        store.time.speed === speed
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    store.saveGame(1);
                    alert('저장 완료!');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  저장
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('저장된 게임을 불러올까요?')) {
                      store.loadGame(1);
                    }
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  불러오기
                </Button>
              </div>

              <Button
                onClick={() => {
                  if (confirm('게임을 다시 시작할까요? 저장되지 않은 진행 상황은 사라집니다.')) {
                    store.resetGame();
                    setShowSettingsModal(false);
                    setShowDifficultyModal(true);
                  }
                }}
                variant="outline"
                className="w-full text-red-400 border-red-500/30 hover:bg-red-500/10"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                새 게임
              </Button>
            </div>

            <Button
              onClick={() => setShowSettingsModal(false)}
              className="w-full mt-4"
              variant="gradient"
            >
              닫기
            </Button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {store.gameOver && !store.victory && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-black text-red-400 mb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6" /> 게임 오버
            </h2>
            <p className="text-sm text-gray-300 mb-4">{store.gameOverReason}</p>
            <div className="bg-gray-700/50 rounded-xl p-3 mb-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>생존 일수: <span className="text-white font-bold">{store.time.totalDays}일</span></div>
                <div>최종 사용자: <span className="text-white font-bold">{formatNumber(store.business.users.total)}명</span></div>
                <div>프리미엄: <span className="text-amber-400">{formatNumber(store.business.users.premium)}명</span></div>
                <div>최종 잔고: <span className={store.business.finance.cash >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatMoney(store.business.finance.cash)}</span></div>
              </div>
            </div>
            <Button
              onClick={() => {
                store.resetGame();
                setShowDifficultyModal(true);
              }}
              className="w-full"
              variant="gradient"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 시작하기
            </Button>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {store.victory && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 border border-amber-500/50 rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-black text-amber-400 mb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6" /> 축하합니다!
            </h2>
            <p className="text-sm text-gray-200 mb-2">
              {store.victoryType === 'users' && '1,000명의 프리미엄 사용자를 확보했습니다!'}
              {store.victoryType === 'money' && '1억원의 현금을 모았습니다!'}
              {store.victoryType === 'acquisition' && '대기업에 인수되었습니다!'}
            </p>
            <p className="text-xs text-amber-200 mb-4">VocaVision을 성공적인 EdTech 서비스로 성장시켰습니다!</p>
            <div className="bg-gray-700/50 rounded-xl p-3 mb-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>총 일수: <span className="text-white font-bold">{store.time.totalDays}일</span></div>
                <div>최종 사용자: <span className="text-white font-bold">{formatNumber(store.business.users.total)}명</span></div>
                <div>프리미엄: <span className="text-amber-400">{formatNumber(store.business.users.premium)}명</span></div>
                <div>최종 잔고: <span className="text-emerald-400">{formatMoney(store.business.finance.cash)}</span></div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  store.resetGame();
                  setShowDifficultyModal(true);
                }}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                새 게임
              </Button>
              <Button
                onClick={() => {
                  // Continue playing
                  store.continueAfterVictory();
                }}
                variant="gradient"
                className="flex-1"
              >
                계속 플레이
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer tip */}
      <div className="text-center text-xs text-gray-600 py-4">
        에너지/스트레스/서버/평판/자금 관리가 핵심!
      </div>
    </div>
  );
}
