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
import { GameProvider, useGame } from '@/game/providers/GameProvider';
import { useAudio, useTranslation } from '@/game/store/systemIntegration';
import { AchievementList } from '@/game/ui/modals/AchievementPopup';
import { ACHIEVEMENTS, calculateTotalPoints } from '@/game/content/achievements';

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
  onClick,
  onSound
}: {
  category: TaskCategory;
  icon: React.ReactNode;
  label: string;
  selected: boolean;
  onClick: () => void;
  onSound?: () => void;
}) => (
  <button
    onClick={() => {
      onSound?.();
      onClick();
    }}
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

// Main simulator page wrapper with GameProvider
export default function SimulatorPage() {
  return (
    <GameProvider enableDebug={true} enableTutorial={true}>
      <SimulatorContent />
    </GameProvider>
  );
}

// Actual simulator content
function SimulatorContent() {
  const store = useGameStore();
  const game = useGame();
  const audio = useAudio();
  const { t, formatCurrency } = useTranslation();

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(true);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [selectedTaskCategory, setSelectedTaskCategory] = useState<TaskCategory>('development');

  // Initialize game on mount - check for NG+ data
  useEffect(() => {
    // Check for NG+ data first
    const ngPlusData = localStorage.getItem('vocavision_ngplus_data');
    if (ngPlusData) {
      try {
        const ngPlusStats = JSON.parse(ngPlusData);
        localStorage.removeItem('vocavision_ngplus_data'); // 사용 후 제거
        store.initGamePlus(ngPlusStats);
        setShowDifficultyModal(false);
        return;
      } catch (e) {
        console.error('NG+ 데이터 파싱 실패:', e);
        localStorage.removeItem('vocavision_ngplus_data');
      }
    }

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
          // Play event sound based on severity
          if (randomEvent.severity === 'critical') {
            audio.game.eventCritical();
          } else if (randomEvent.severity === 'good') {
            audio.game.eventPositive();
          } else {
            audio.game.eventAppear();
          }
          store.triggerEvent(randomEvent);
        }
      }
    }, store.time.speed === 1 ? 2000 : store.time.speed === 2 ? 1000 : 500);

    return () => clearInterval(interval);
  }, [store.time.isPaused, store.gameOver, store.currentEvent, store.time.speed, audio]);

  const handleStartGame = useCallback((difficulty: Difficulty) => {
    audio.ui.click();
    audio.playMusic('main_theme');
    store.initializeGame(difficulty);
    setShowDifficultyModal(false);
  }, [store, audio]);

  const handleTaskSelect = useCallback((task: Task) => {
    if (store.player.health.energy < task.requirements.energy) {
      audio.ui.error();
      alert(t('ui.alert.no_energy'));
      return;
    }
    if (task.requirements.money && store.business.finance.cash < task.requirements.money) {
      audio.ui.error();
      alert(t('ui.alert.no_money'));
      return;
    }
    audio.ui.click();
    audio.game.taskComplete();
    store.startTask(task);
    setShowTaskModal(false);
  }, [store, audio, t]);

  const handleEventChoice = useCallback((choice: DecisionOption) => {
    audio.ui.click();
    audio.ui.modalClose();
    store.handleEventChoice(choice);
  }, [store, audio]);

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
              {t('ui.difficulty.title')}
            </h2>
            <p className="text-gray-400 text-center text-sm mb-6">
              {t('ui.difficulty.subtitle')}
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleStartGame('easy')}
                onMouseEnter={() => audio.ui.hover()}
                className="w-full p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-xl text-left hover:bg-emerald-600/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-emerald-400">{t('ui.difficulty.easy')}</div>
                    <div className="text-xs text-gray-400">{t('ui.difficulty.easy_desc')}</div>
                  </div>
                  <span className="text-2xl">🌱</span>
                </div>
              </button>

              <button
                onClick={() => handleStartGame('normal')}
                onMouseEnter={() => audio.ui.hover()}
                className="w-full p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl text-left hover:bg-blue-600/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-blue-400">{t('ui.difficulty.normal')}</div>
                    <div className="text-xs text-gray-400">{t('ui.difficulty.normal_desc')}</div>
                  </div>
                  <span className="text-2xl">⚖️</span>
                </div>
              </button>

              <button
                onClick={() => handleStartGame('hard')}
                onMouseEnter={() => audio.ui.hover()}
                className="w-full p-4 bg-amber-600/20 border border-amber-500/30 rounded-xl text-left hover:bg-amber-600/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-amber-400">{t('ui.difficulty.hard')}</div>
                    <div className="text-xs text-gray-400">{t('ui.difficulty.hard_desc')}</div>
                  </div>
                  <span className="text-2xl">🔥</span>
                </div>
              </button>

              <button
                onClick={() => handleStartGame('realistic')}
                onMouseEnter={() => audio.ui.hover()}
                className="w-full p-4 bg-red-600/20 border border-red-500/30 rounded-xl text-left hover:bg-red-600/30 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-red-400">{t('ui.difficulty.realistic')}</div>
                    <div className="text-xs text-gray-400">{t('ui.difficulty.realistic_desc')}</div>
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
                <h1 className="text-lg font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-2">
                  {t('ui.title')}
                  {(store.meta as any)?.ngPlusTier > 0 && (
                    <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
                      NG+{(store.meta as any).ngPlusTier}
                    </span>
                  )}
                </h1>
                <p className="text-xs text-gray-500">{t('ui.subtitle')}</p>
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
                onClick={() => {
                  audio.ui.click();
                  audio.ui.modalOpen();
                  setShowAchievementsModal(true);
                }}
                className="text-gray-400 hover:text-white"
              >
                <Trophy className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  audio.ui.click();
                  audio.ui.modalOpen();
                  setShowHelpModal(true);
                }}
                className="text-gray-400 hover:text-white"
              >
                <Info className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  audio.ui.click();
                  audio.ui.modalOpen();
                  game.showSettingsModal();
                }}
                className="text-gray-400 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  store.time.isPaused ? audio.ui.toggleOn() : audio.ui.toggleOff();
                  store.togglePause();
                }}
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
            <div className="text-xs text-gray-500">{t('ui.business.balance')}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-blue-400" />
            <div className="text-sm font-bold">{formatNumber(store.business.users.total)}</div>
            <div className="text-xs text-gray-500">{t('ui.business.users')}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <Star className="w-5 h-5 mx-auto mb-1 text-amber-400" />
            <div className="text-sm font-bold text-amber-400">{formatNumber(store.business.users.premium)}</div>
            <div className="text-xs text-gray-500">{t('ui.business.premium')}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-purple-400" />
            <div className="text-sm font-bold">{store.player.social.reputation}</div>
            <div className="text-xs text-gray-500">{t('ui.business.reputation')}</div>
          </div>
        </div>

        {/* Player Stats */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-sm font-semibold">{t('ui.player.status')}</span>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <StatBar
              label={t('ui.player.energy')}
              value={store.player.health.energy}
              max={100}
              color="bg-emerald-500"
              icon={<Zap className="w-3 h-3" />}
              warning
            />
            <StatBar
              label={t('ui.player.stress')}
              value={store.player.health.stress}
              max={100}
              color="bg-red-500"
              icon={<AlertTriangle className="w-3 h-3" />}
            />
            <StatBar
              label={t('ui.player.physical')}
              value={store.player.health.physical}
              max={100}
              color="bg-pink-500"
              icon={<Heart className="w-3 h-3" />}
              warning
            />
            <StatBar
              label={t('ui.player.mental')}
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
            <span className="text-sm font-semibold">{t('ui.business.status')}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-emerald-500/20 rounded-lg p-2">
              <div className="text-emerald-400 font-bold">{formatMoney(monthlyRevenue)}</div>
              <div className="text-gray-500">{t('ui.business.monthly_revenue')}</div>
            </div>
            <div className="bg-red-500/20 rounded-lg p-2">
              <div className="text-red-400 font-bold">{formatMoney(monthlyCosts)}</div>
              <div className="text-gray-500">{t('ui.business.monthly_cost')}</div>
            </div>
            <div className={`${monthlyProfit >= 0 ? 'bg-blue-500/20' : 'bg-orange-500/20'} rounded-lg p-2`}>
              <div className={`${monthlyProfit >= 0 ? 'text-blue-400' : 'text-orange-400'} font-bold`}>
                {monthlyProfit >= 0 ? '+' : ''}{formatMoney(monthlyProfit)}
              </div>
              <div className="text-gray-500">{t('ui.business.net_profit')}</div>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="mt-3">
            <StatBar
              label={t('ui.business.server_status')}
              value={store.business.infrastructure.serverHealth}
              max={100}
              color="bg-blue-500"
              icon={<Server className="w-3 h-3" />}
              warning
            />
            <StatBar
              label={t('ui.business.product_stability')}
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
                <span className="text-sm font-semibold">{t('ui.task.in_progress')}</span>
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
            onClick={() => {
              audio.ui.click();
              audio.ui.modalOpen();
              setShowTaskModal(true);
            }}
            variant="gradient"
            className="w-full py-6 text-lg"
            disabled={store.time.isPaused}
          >
            <Briefcase className="w-5 h-5 mr-2" />
            {t('ui.task.select_button')}
          </Button>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => {
              audio.ui.click();
              store.applyEffects([{ type: 'energy', value: 30 }]);
              store.tick();
              store.tick();
            }}
            disabled={store.time.isPaused || store.activeTask !== null}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:opacity-50 rounded-xl p-3 text-center transition-all active:scale-95"
          >
            <div className="text-lg">😴</div>
            <div className="text-xs">{t('ui.action.rest')}</div>
          </button>
          <button
            onClick={() => {
              if (store.player.health.energy >= 10) {
                audio.ui.click();
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
            <div className="text-xs">{t('ui.action.exercise')}</div>
          </button>
          <button
            onClick={() => {
              if (store.business.finance.cash >= 100000) {
                audio.ui.click();
                audio.game.moneyLoss();
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
            <div className="text-xs">{t('ui.action.marketing')}</div>
          </button>
          <button
            onClick={() => {
              if (store.player.health.energy >= 15) {
                audio.ui.click();
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
            <div className="text-xs">{t('ui.action.server_check')}</div>
          </button>
        </div>

        {/* Skills */}
        <div className="bg-gray-800/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold">{t('ui.skills')}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {Object.entries(store.player.skills).map(([skill, value]) => (
              <div key={skill} className="bg-gray-700/30 rounded-lg p-2">
                <div className="text-white font-bold">{Math.round(value)}</div>
                <div className="text-gray-500 capitalize">
                  {t(`ui.skill.${skill}`)}
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
            <h2 className="text-xl font-bold mb-4">{t('ui.task.select')}</h2>

            {/* Category Tabs */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              <CategoryButton
                category="development"
                icon={<span>💻</span>}
                label={t('ui.task.category.development')}
                selected={selectedTaskCategory === 'development'}
                onClick={() => setSelectedTaskCategory('development')}
                onSound={audio.ui.tabSwitch}
              />
              <CategoryButton
                category="marketing"
                icon={<span>📢</span>}
                label={t('ui.task.category.marketing')}
                selected={selectedTaskCategory === 'marketing'}
                onClick={() => setSelectedTaskCategory('marketing')}
                onSound={audio.ui.tabSwitch}
              />
              <CategoryButton
                category="customer_support"
                icon={<span>💬</span>}
                label={t('ui.task.category.customer_support')}
                selected={selectedTaskCategory === 'customer_support'}
                onClick={() => setSelectedTaskCategory('customer_support')}
                onSound={audio.ui.tabSwitch}
              />
              <CategoryButton
                category="business"
                icon={<span>💼</span>}
                label={t('ui.task.category.business')}
                selected={selectedTaskCategory === 'business'}
                onClick={() => setSelectedTaskCategory('business')}
                onSound={audio.ui.tabSwitch}
              />
              <CategoryButton
                category="personal"
                icon={<span>🧘</span>}
                label={t('ui.task.category.personal')}
                selected={selectedTaskCategory === 'personal'}
                onClick={() => setSelectedTaskCategory('personal')}
                onSound={audio.ui.tabSwitch}
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
                    onClick={() => {
                      if (!canAfford) {
                        audio.ui.error();
                      }
                      handleTaskSelect(task);
                    }}
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
              onClick={() => {
                audio.ui.click();
                audio.ui.modalClose();
                setShowTaskModal(false);
              }}
              variant="outline"
              className="mt-4"
            >
              {t('common.close')}
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
                  onClick={() => {
                    audio.ui.click();
                    handleEventChoice(choice);
                  }}
                  className="w-full p-3 bg-gray-800/80 hover:bg-gray-700 rounded-xl text-left text-sm transition-all active:scale-98"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Modal */}
      {showAchievementsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-5 max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                {t('achievement.list_title') || '업적'}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">
                  {store.progress?.achievements?.length || 0}/{ACHIEVEMENTS.length}
                </span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {calculateTotalPoints(store.progress?.achievements || [])}
                </span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <AchievementList
                achievements={ACHIEVEMENTS.map(a => ({
                  id: a.id,
                  name: a.name,
                  description: a.description,
                  icon: a.icon,
                  rarity: a.rarity,
                  points: a.points,
                }))}
                unlockedIds={store.progress?.achievements || []}
              />
            </div>
            <Button
              onClick={() => {
                audio.ui.click();
                audio.ui.modalClose();
                setShowAchievementsModal(false);
              }}
              variant="outline"
              className="mt-4"
            >
              {t('common.close')}
            </Button>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{t('ui.help.title')}</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h3 className="font-bold text-white mb-1">{t('ui.help.goal_title')}</h3>
                <p>{t('ui.help.goal_desc')}</p>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{t('ui.help.manage_title')}</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('ui.help.manage_energy')}</li>
                  <li>{t('ui.help.manage_stress')}</li>
                  <li>{t('ui.help.manage_server')}</li>
                  <li>{t('ui.help.manage_reputation')}</li>
                  <li>{t('ui.help.manage_cash')}</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{t('ui.help.tips_title')}</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>{t('ui.help.tip1')}</li>
                  <li>{t('ui.help.tip2')}</li>
                  <li>{t('ui.help.tip3')}</li>
                </ul>
              </div>
            </div>
            <Button
              onClick={() => {
                audio.ui.click();
                audio.ui.modalClose();
                setShowHelpModal(false);
              }}
              className="w-full mt-4"
              variant="gradient"
            >
              {t('common.confirm')}
            </Button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {store.gameOver && !store.victory && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-black text-red-400 mb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6" /> {t('ui.game_over.title')}
            </h2>
            <p className="text-sm text-gray-300 mb-4">{store.gameOverReason}</p>
            <div className="bg-gray-700/50 rounded-xl p-3 mb-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>{t('ui.game_over.survival_days')}: <span className="text-white font-bold">{store.time.totalDays}</span></div>
                <div>{t('ui.game_over.final_users')}: <span className="text-white font-bold">{formatNumber(store.business.users.total)}</span></div>
                <div>{t('ui.game_over.final_premium')}: <span className="text-amber-400">{formatNumber(store.business.users.premium)}</span></div>
                <div>{t('ui.game_over.final_balance')}: <span className={store.business.finance.cash >= 0 ? 'text-emerald-400' : 'text-red-400'}>{formatMoney(store.business.finance.cash)}</span></div>
              </div>
            </div>
            <Button
              onClick={() => {
                audio.ui.click();
                audio.stopMusic();
                store.resetGame();
                setShowDifficultyModal(true);
              }}
              className="w-full"
              variant="gradient"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('ui.game_over.restart')}
            </Button>
          </div>
        </div>
      )}

      {/* Victory Modal - Now handled by GameProvider's EndingScreen */}
      {store.victory && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 border border-amber-500/50 rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-black text-amber-400 mb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6" /> {t('ui.victory.title')}
            </h2>
            <p className="text-sm text-gray-200 mb-2">
              {store.victoryType === 'users' && t('ui.victory.users_desc')}
              {store.victoryType === 'money' && t('ui.victory.money_desc')}
              {store.victoryType === 'acquisition' && t('ui.victory.acquisition_desc')}
            </p>
            <p className="text-xs text-amber-200 mb-4">{t('ui.victory.success_message')}</p>
            <div className="bg-gray-700/50 rounded-xl p-3 mb-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>{t('ui.victory.total_days')}: <span className="text-white font-bold">{store.time.totalDays}</span></div>
                <div>{t('ui.game_over.final_users')}: <span className="text-white font-bold">{formatNumber(store.business.users.total)}</span></div>
                <div>{t('ui.game_over.final_premium')}: <span className="text-amber-400">{formatNumber(store.business.users.premium)}</span></div>
                <div>{t('ui.game_over.final_balance')}: <span className="text-emerald-400">{formatMoney(store.business.finance.cash)}</span></div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  audio.ui.click();
                  audio.stopMusic();
                  store.resetGame();
                  setShowDifficultyModal(true);
                }}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('ui.victory.new_game')}
              </Button>
              <Button
                onClick={() => {
                  audio.ui.click();
                  // Continue playing
                  store.continueAfterVictory();
                }}
                variant="gradient"
                className="flex-1"
              >
                {t('ui.victory.continue')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer tip */}
      <div className="text-center text-xs text-gray-600 py-4">
        {t('ui.footer.tip')} • {t('ui.footer.debug')}
      </div>
    </div>
  );
}
