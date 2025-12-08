import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  GameState,
  PlayerStats,
  BusinessMetrics,
  TimeState,
  Effect,
  GameEvent,
  DecisionOption,
  Task,
  ActiveTask,
  Notification,
  DayPhase,
  Difficulty,
  DelayedEffect,
  MetricsSnapshot,
  FinancialRecord,
  DecisionRecord,
} from '../types';
import { INITIAL_PLAYER_STATS, INITIAL_BUSINESS_METRICS, INITIAL_TIME_STATE, DIFFICULTY_SETTINGS } from '../config/initialState';
import { applyEffect, calculateMonthlyCosts, calculateMonthlyRevenue } from '../systems/effects';

interface GameStore extends GameState {
  // Time actions
  tick: () => void;
  pause: () => void;
  resume: () => void;
  togglePause: () => void;
  setSpeed: (speed: 1 | 2 | 4) => void;
  advanceDay: () => void;

  // Player actions
  updatePlayerStat: (category: keyof PlayerStats, stat: string, value: number) => void;
  addEnergy: (amount: number) => void;
  addStress: (amount: number) => void;
  rest: () => void;

  // Business actions
  updateBusinessMetric: (category: keyof BusinessMetrics, metric: string, value: number) => void;
  addCash: (amount: number) => void;
  addUsers: (amount: number) => void;
  addPremiumUsers: (amount: number) => void;
  processMonthlyFinances: () => void;

  // Task actions
  startTask: (task: Task) => void;
  completeTask: () => void;
  cancelTask: () => void;
  updateTaskProgress: (progress: number) => void;

  // Event actions
  triggerEvent: (event: GameEvent) => void;
  handleEventChoice: (choice: DecisionOption) => void;
  dismissEvent: () => void;
  scheduleEvent: (event: GameEvent, delay: number) => void;

  // Effect actions
  applyEffects: (effects: Effect[]) => void;
  scheduleDelayedEffect: (effect: Effect, delayDays: number, source: string) => void;
  processDelayedEffects: () => void;

  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Game control
  initGame: (difficulty: Difficulty) => void;
  initializeGame: (difficulty: Difficulty) => void;
  checkGameOver: () => void;
  checkVictory: () => void;
  saveGame: (slot: number, name?: string) => void;
  loadGame: (slot: number) => void;
  resetGame: () => void;
  continueAfterVictory: () => void;

  // History tracking
  recordDecision: (eventId: string, choiceId: string, outcome: string) => void;
  recordFinancial: (description: string) => void;
  takeMetricsSnapshot: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      meta: {
        version: '1.0.0',
        saveDate: new Date(),
        playTime: 0,
        difficulty: 'normal',
        saveName: '',
        slot: 0,
      },
      time: INITIAL_TIME_STATE,
      player: INITIAL_PLAYER_STATS,
      business: INITIAL_BUSINESS_METRICS,
      progress: {
        completedEvents: [],
        unlockedFeatures: ['words101', 'flashcards'],
        achievements: [],
        milestones: [],
      },
      relationships: {
        contacts: [],
        competitors: [
          { id: 'competitor1', name: 'WordMaster', marketShare: 30, threatLevel: 60, features: ['AI 발음'] },
          { id: 'competitor2', name: 'VocabKing', marketShare: 20, threatLevel: 40, features: ['게임화'] },
        ],
        partners: [],
      },
      history: {
        decisions: [],
        financialHistory: [],
        metricsSnapshots: [],
      },
      currentEvent: null,
      activeTask: null,
      notifications: [],
      scheduledEvents: [],
      delayedEffects: [],
      gameOver: false,
      gameOverReason: '',
      victory: false,
      victoryType: undefined,

      // Time actions
      tick: () => {
        const state = get();
        if (state.time.isPaused || state.gameOver || state.currentEvent) return;

        set((state) => {
          const newTick = (state.time.tick + 1) % 48;
          const newDay = newTick === 0;

          let newPhase: DayPhase = state.time.dayPhase;
          if (newTick >= 0 && newTick < 12) newPhase = 'morning';
          else if (newTick >= 12 && newTick < 24) newPhase = 'afternoon';
          else if (newTick >= 24 && newTick < 36) newPhase = 'evening';
          else newPhase = 'night';

          const newDate = newDay
            ? new Date(state.time.currentDate.getTime() + 86400000)
            : state.time.currentDate;

          return {
            time: {
              ...state.time,
              tick: newTick,
              dayPhase: newPhase,
              currentDate: newDate,
              totalDays: newDay ? state.time.totalDays + 1 : state.time.totalDays,
            },
            meta: {
              ...state.meta,
              playTime: state.meta.playTime + 1,
            },
          };
        });

        // Process day change effects
        const newState = get();
        if (newState.time.tick === 0) {
          get().processDelayedEffects();
          get().checkGameOver();
          get().checkVictory();

          // Monthly processing on day 1 of each month
          if (newState.time.currentDate.getDate() === 1) {
            get().processMonthlyFinances();
          }

          // Daily energy recovery
          set((state) => ({
            player: {
              ...state.player,
              health: {
                ...state.player.health,
                energy: Math.min(100, state.player.health.energy + 10),
                stress: Math.max(0, state.player.health.stress - 3),
              },
            },
          }));
        }
      },

      pause: () => set((state) => ({ time: { ...state.time, isPaused: true } })),

      resume: () => set((state) => ({ time: { ...state.time, isPaused: false } })),

      togglePause: () => set((state) => ({ time: { ...state.time, isPaused: !state.time.isPaused } })),

      setSpeed: (speed) => set((state) => ({ time: { ...state.time, speed } })),

      advanceDay: () => {
        set((state) => ({
          time: {
            ...state.time,
            tick: 0,
            dayPhase: 'morning',
            currentDate: new Date(state.time.currentDate.getTime() + 86400000),
            totalDays: state.time.totalDays + 1,
          },
        }));
        get().processDelayedEffects();
      },

      // Player actions
      updatePlayerStat: (category, stat, value) => {
        set((state) => ({
          player: {
            ...state.player,
            [category]: {
              ...(state.player[category] as Record<string, unknown>),
              [stat]: Math.max(0, Math.min(100, value)),
            },
          },
        }));
      },

      addEnergy: (amount) => {
        set((state) => ({
          player: {
            ...state.player,
            health: {
              ...state.player.health,
              energy: Math.max(0, Math.min(100, state.player.health.energy + amount)),
            },
          },
        }));
      },

      addStress: (amount) => {
        set((state) => ({
          player: {
            ...state.player,
            health: {
              ...state.player.health,
              stress: Math.max(0, Math.min(100, state.player.health.stress + amount)),
              burnoutRisk: Math.max(
                0,
                Math.min(100, state.player.health.burnoutRisk + (amount > 0 ? amount * 0.2 : 0))
              ),
            },
          },
        }));
      },

      rest: () => {
        set((state) => ({
          player: {
            ...state.player,
            health: {
              ...state.player.health,
              energy: Math.min(100, state.player.health.energy + 40),
              stress: Math.max(0, state.player.health.stress - 20),
              physical: Math.min(100, state.player.health.physical + 10),
              mental: Math.min(100, state.player.health.mental + 15),
            },
          },
        }));
        get().advanceDay();
      },

      // Business actions
      updateBusinessMetric: (category, metric, value) => {
        set((state) => ({
          business: {
            ...state.business,
            [category]: {
              ...(state.business[category] as Record<string, unknown>),
              [metric]: value,
            },
          },
        }));
      },

      addCash: (amount) => {
        set((state) => ({
          business: {
            ...state.business,
            finance: {
              ...state.business.finance,
              cash: state.business.finance.cash + amount,
            },
          },
        }));
      },

      addUsers: (amount) => {
        set((state) => {
          const newTotal = Math.max(0, state.business.users.total + amount);
          return {
            business: {
              ...state.business,
              users: {
                ...state.business.users,
                total: newTotal,
                dau: Math.floor(newTotal * (0.3 + Math.random() * 0.2)),
                mau: Math.floor(newTotal * (0.6 + Math.random() * 0.2)),
              },
            },
          };
        });
      },

      addPremiumUsers: (amount) => {
        set((state) => ({
          business: {
            ...state.business,
            users: {
              ...state.business.users,
              premium: Math.max(0, state.business.users.premium + amount),
            },
          },
        }));
      },

      processMonthlyFinances: () => {
        const state = get();
        const revenue = calculateMonthlyRevenue(state.business);
        const expenses = calculateMonthlyCosts(state.business);
        const profit = revenue - expenses;

        set((s) => ({
          business: {
            ...s.business,
            finance: {
              ...s.business.finance,
              cash: s.business.finance.cash + profit,
              monthlyRevenue: revenue,
              monthlyExpenses: expenses,
              runway: expenses > 0 ? Math.floor(s.business.finance.cash / expenses) : 999,
            },
          },
        }));

        get().recordFinancial(`월간 정산: 수익 ${revenue.toLocaleString()}원, 비용 ${expenses.toLocaleString()}원`);
        get().takeMetricsSnapshot();
      },

      // Task actions
      startTask: (task) => {
        const state = get();
        if (state.player.health.energy < task.requirements.energy) {
          get().addNotification({
            type: 'warning',
            title: '에너지 부족',
            message: '이 업무를 수행하기엔 에너지가 부족합니다. 휴식을 취하세요.',
          });
          return;
        }

        if (task.requirements.money && state.business.finance.cash < task.requirements.money) {
          get().addNotification({
            type: 'warning',
            title: '자금 부족',
            message: '이 업무를 수행하기 위한 자금이 부족합니다.',
          });
          return;
        }

        const actualHours =
          task.actualHoursRange[0] +
          Math.random() * (task.actualHoursRange[1] - task.actualHoursRange[0]);

        set({
          activeTask: {
            task,
            startTime: state.time.currentDate,
            progress: 0,
            actualHours,
            interrupts: [],
          },
        });

        get().addEnergy(-task.requirements.energy);
        if (task.requirements.money) {
          get().addCash(-task.requirements.money);
        }
      },

      completeTask: () => {
        const state = get();
        if (!state.activeTask) return;

        const { task } = state.activeTask;

        // Apply guaranteed effects
        get().applyEffects(task.outcomes.guaranteed);

        // Roll for possible effects
        task.outcomes.possible.forEach(({ effect, chance }) => {
          if (Math.random() < chance) {
            get().applyEffects([effect]);
          }
        });

        // Roll for risks
        task.outcomes.risks.forEach(({ effect, chance }) => {
          if (Math.random() < chance) {
            get().applyEffects([effect]);
            get().addNotification({
              type: 'warning',
              title: '문제 발생',
              message: `${task.name} 중 문제가 발생했습니다.`,
            });
          }
        });

        get().addNotification({
          type: 'success',
          title: '업무 완료',
          message: `${task.name}을(를) 완료했습니다!`,
        });

        set({ activeTask: null });
      },

      cancelTask: () => {
        set({ activeTask: null });
      },

      updateTaskProgress: (progress) => {
        set((state) => {
          if (!state.activeTask) return state;
          return {
            activeTask: {
              ...state.activeTask,
              progress: Math.min(100, progress),
            },
          };
        });
      },

      // Event actions
      triggerEvent: (event) => {
        set({ currentEvent: event });
        get().pause();
      },

      handleEventChoice: (choice) => {
        const state = get();
        if (!state.currentEvent) return;

        // Apply immediate effects
        get().applyEffects(choice.effects.immediate);

        // Schedule delayed effects
        choice.effects.delayed.forEach(({ effect, delayDays }) => {
          get().scheduleDelayedEffect(effect, delayDays, state.currentEvent!.id);
        });

        // Roll for probability effects
        choice.effects.probability.forEach(({ effect, chance }) => {
          if (Math.random() < chance) {
            get().applyEffects([effect]);
          }
        });

        // Record decision
        get().recordDecision(state.currentEvent.id, choice.id, choice.resultText);

        // Track completed event
        set((s) => ({
          progress: {
            ...s.progress,
            completedEvents: [...s.progress.completedEvents, state.currentEvent!.id],
          },
        }));

        // Show result
        get().addNotification({
          type: 'info',
          title: state.currentEvent.title,
          message: choice.resultText,
        });

        set({ currentEvent: null });
        get().resume();
      },

      dismissEvent: () => {
        set({ currentEvent: null });
        get().resume();
      },

      scheduleEvent: (event, delay) => {
        const state = get();
        const triggerDate = new Date(state.time.currentDate.getTime() + delay * 86400000);
        set((s) => ({
          scheduledEvents: [...s.scheduledEvents, { event, triggerDate, triggered: false }],
        }));
      },

      // Effect actions
      applyEffects: (effects) => {
        effects.forEach((effect) => {
          const state = get();
          applyEffect(effect, state, set);
        });
      },

      scheduleDelayedEffect: (effect, delayDays, source) => {
        const state = get();
        const triggerDate = new Date(state.time.currentDate.getTime() + delayDays * 86400000);
        set((s) => ({
          delayedEffects: [...s.delayedEffects, { effect, triggerDate, source, applied: false }],
        }));
      },

      processDelayedEffects: () => {
        const state = get();
        const today = state.time.currentDate;

        state.delayedEffects
          .filter((de) => !de.applied && new Date(de.triggerDate) <= today)
          .forEach((de) => {
            get().applyEffects([de.effect]);
          });

        set((s) => ({
          delayedEffects: s.delayedEffects.map((de) =>
            new Date(de.triggerDate) <= today ? { ...de, applied: true } : de
          ),
        }));
      },

      // Notification actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: generateId(),
          timestamp: new Date(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50),
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      // Game control
      initGame: (difficulty) => {
        const settings = DIFFICULTY_SETTINGS[difficulty];

        set({
          meta: {
            version: '1.0.0',
            saveDate: new Date(),
            playTime: 0,
            difficulty,
            saveName: '',
            slot: 0,
          },
          time: { ...INITIAL_TIME_STATE, currentDate: new Date(), isPaused: false },
          player: INITIAL_PLAYER_STATS,
          business: {
            ...INITIAL_BUSINESS_METRICS,
            finance: {
              ...INITIAL_BUSINESS_METRICS.finance,
              cash: settings.startingCash,
            },
          },
          progress: {
            completedEvents: [],
            unlockedFeatures: ['words101', 'flashcards'],
            achievements: [],
            milestones: [],
          },
          currentEvent: null,
          activeTask: null,
          notifications: [],
          scheduledEvents: [],
          delayedEffects: [],
          gameOver: false,
          gameOverReason: '',
          victory: false,
          victoryType: undefined,
          history: {
            decisions: [],
            financialHistory: [],
            metricsSnapshots: [],
          },
        });

        get().takeMetricsSnapshot();
      },

      initializeGame: (difficulty) => {
        get().initGame(difficulty);
      },

      checkGameOver: () => {
        const state = get();

        // Cash below -1,000,000
        if (state.business.finance.cash < -1000000) {
          set({
            gameOver: true,
            gameOverReason: '💸 파산: 자금이 -100만원 이하로 떨어졌습니다. VocaVision은 문을 닫았습니다.',
          });
          return;
        }

        // Server health 0
        if (state.business.infrastructure.serverHealth <= 0) {
          set({
            gameOver: true,
            gameOverReason: '💥 서버 다운: 서버가 완전히 다운되어 복구 불가능 상태가 되었습니다.',
          });
          return;
        }

        // Reputation 0
        if (state.player.social.reputation <= 0) {
          set({
            gameOver: true,
            gameOverReason: '😢 평판 붕괴: 평판이 바닥으로 떨어져 더 이상 사용자를 유치할 수 없게 되었습니다.',
          });
          return;
        }

        // Burnout
        if (state.player.health.burnoutRisk >= 100) {
          set({
            gameOver: true,
            gameOverReason: '😴 번아웃: 극심한 스트레스로 건강이 악화되었습니다. 당분간 휴식이 필요합니다.',
          });
          return;
        }

        // All users churned
        if (state.business.users.total <= 0 && state.time.totalDays > 30) {
          set({
            gameOver: true,
            gameOverReason: '👥 사용자 이탈: 모든 사용자가 떠났습니다. 서비스를 유지할 수 없습니다.',
          });
          return;
        }
      },

      checkVictory: () => {
        const state = get();
        if (state.victory) return; // Already won

        // 1000 premium users
        if (state.business.users.premium >= 1000) {
          set({
            victory: true,
            victoryType: 'users',
          });
          return;
        }

        // 100 million won in cash
        if (state.business.finance.cash >= 100000000) {
          set({
            victory: true,
            victoryType: 'money',
          });
          return;
        }

        // Acquisition offer after 365 days with good metrics
        if (
          state.time.totalDays >= 365 &&
          state.business.users.premium >= 500 &&
          state.player.social.reputation >= 80 &&
          state.business.finance.cash >= 50000000
        ) {
          set({
            victory: true,
            victoryType: 'acquisition',
          });
          return;
        }
      },

      continueAfterVictory: () => {
        set({
          victory: false,
          victoryType: undefined,
        });
      },

      saveGame: (slot, name) => {
        const state = get();
        set({
          meta: {
            ...state.meta,
            saveDate: new Date(),
            saveName: name || `저장 슬롯 ${slot}`,
            slot,
          },
        });
      },

      loadGame: () => {
        // The persist middleware handles this automatically
      },

      resetGame: () => {
        get().initGame('normal');
      },

      // History tracking
      recordDecision: (eventId, choiceId, outcome) => {
        const record: DecisionRecord = {
          eventId,
          choiceId,
          date: get().time.currentDate,
          outcome,
        };
        set((s) => ({
          history: {
            ...s.history,
            decisions: [...s.history.decisions, record],
          },
        }));
      },

      recordFinancial: (description) => {
        const state = get();
        const record: FinancialRecord = {
          date: state.time.currentDate,
          cash: state.business.finance.cash,
          revenue: state.business.finance.monthlyRevenue,
          expenses: state.business.finance.monthlyExpenses,
          description,
        };
        set((s) => ({
          history: {
            ...s.history,
            financialHistory: [...s.history.financialHistory, record].slice(-365),
          },
        }));
      },

      takeMetricsSnapshot: () => {
        const state = get();
        const snapshot: MetricsSnapshot = {
          date: state.time.currentDate,
          users: state.business.users.total,
          premium: state.business.users.premium,
          cash: state.business.finance.cash,
          reputation: state.player.social.reputation,
        };
        set((s) => ({
          history: {
            ...s.history,
            metricsSnapshots: [...s.history.metricsSnapshots, snapshot].slice(-365),
          },
        }));
      },
    }),
    {
      name: 'vocavision-game-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        meta: state.meta,
        time: state.time,
        player: state.player,
        business: state.business,
        progress: state.progress,
        relationships: state.relationships,
        history: state.history,
        scheduledEvents: state.scheduledEvents,
        delayedEffects: state.delayedEffects,
      }),
    }
  )
);
