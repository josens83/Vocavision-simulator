/**
 * System Integration - 모든 게임 시스템 통합
 * 기존 gameStore와 새 시스템들을 연결합니다.
 */

import { useEffect, useCallback } from 'react';
import { useGameStore } from './gameStore';

// 새 시스템 imports
import { saveSystem } from '../save';
import { tutorialSystem, TutorialStep } from '../tutorial';
import { settingsSystem, SettingsState } from '../settings';
import { endingSystem, EndingCheckResult } from '../ending';
import { analyticsSystem } from '../analytics';
import { localizationSystem, t } from '../localization';
import { debugSystem } from '../debug';

// ============================================
// Integration Hooks
// ============================================

/**
 * 전체 시스템 초기화 훅
 */
export function useSystemsInit() {
  const store = useGameStore();

  useEffect(() => {
    // 분석 시스템 초기화
    analyticsSystem.initialize({ debug: false });

    // 디버그 시스템에 게임 상태 바인딩
    debugSystem.manager.bindGameState(
      () => ({
        time: store.time,
        player: store.player,
        business: store.business,
        progress: store.progress,
      }),
      (state) => {
        // 상태 복원 로직
      }
    );

    // 설정 로드
    const settings = settingsSystem.manager.getState();
    if (settings) {
      applySettings(settings);
    }

    debugSystem.info('Integration', 'All systems initialized');

    return () => {
      analyticsSystem.cleanup();
    };
  }, []);
}

/**
 * 분석 추적 훅
 */
export function useAnalyticsTracking() {
  const store = useGameStore();

  useEffect(() => {
    // 게임 시작 시 세션 시작
    if (store.time.totalDays > 0 && !store.gameOver) {
      analyticsSystem.startSession(store.time.totalDays);
    }

    return () => {
      analyticsSystem.endSession();
    };
  }, [store.time.totalDays]);

  // 이벤트 추적
  const trackAction = useCallback((actionName: string, data?: any) => {
    analyticsSystem.track(actionName, data);
  }, []);

  const trackProgression = useCallback((eventName: string, data?: any) => {
    analyticsSystem.trackProgression(eventName as any, data);
  }, []);

  return { trackAction, trackProgression };
}

/**
 * 튜토리얼 훅
 */
export function useTutorial() {
  const store = useGameStore();

  const startTutorial = useCallback((tutorialId: string) => {
    tutorialSystem.startTutorial(tutorialId);
  }, []);

  const getCurrentStep = useCallback((): TutorialStep | null => {
    return tutorialSystem.manager.getCurrentStep();
  }, []);

  const nextStep = useCallback(() => {
    tutorialSystem.manager.nextStep();
  }, []);

  const skipTutorial = useCallback(() => {
    tutorialSystem.manager.skipTutorial();
  }, []);

  const isTutorialActive = useCallback(() => {
    return tutorialSystem.manager.isActive();
  }, []);

  // 튜토리얼 트리거 체크
  useEffect(() => {
    if (store.time.totalDays === 1 && !store.progress.completedEvents.includes('tutorial_complete')) {
      const triggers = tutorialSystem.checkTriggers({
        day: store.time.totalDays,
        cash: store.business.finance.cash,
        users: store.business.users.total,
      });

      if (triggers) {
        startTutorial(triggers.id);
      }
    }
  }, [store.time.totalDays]);

  return {
    startTutorial,
    getCurrentStep,
    nextStep,
    skipTutorial,
    isTutorialActive,
  };
}

/**
 * 저장/불러오기 훅
 */
export function useSaveLoad() {
  const store = useGameStore();

  const saveGame = useCallback(async (slot: number, name?: string) => {
    const gameState = {
      meta: store.meta,
      time: store.time,
      player: store.player,
      business: store.business,
      progress: store.progress,
      relationships: store.relationships,
      history: store.history,
    };

    const result = await saveSystem.save(
      slot,
      name || `Day ${store.time.totalDays}`,
      gameState,
      store.progress,
      settingsSystem.manager.getState()
    );

    if (result.success) {
      analyticsSystem.trackGame('game_save', { slot });
      debugSystem.info('Save', `Game saved to slot ${slot}`);
    }

    return result;
  }, [store]);

  const loadGame = useCallback(async (slot: number) => {
    const result = await saveSystem.load(slot);

    if (result.success && result.data) {
      // Zustand store는 persist로 자동 로드됨
      analyticsSystem.trackGame('game_load', { slot });
      debugSystem.info('Save', `Game loaded from slot ${slot}`);
    }

    return result;
  }, []);

  const getSaveSlots = useCallback(() => {
    return saveSystem.getSaveSlots();
  }, []);

  const deleteSave = useCallback(async (slot: number) => {
    return await saveSystem.deleteSave(slot);
  }, []);

  return {
    saveGame,
    loadGame,
    getSaveSlots,
    deleteSave,
  };
}

/**
 * 설정 훅
 */
export function useSettings() {
  const getSettings = useCallback(() => {
    return settingsSystem.manager.getState();
  }, []);

  const updateSettings = useCallback((category: string, updates: any) => {
    switch (category) {
      case 'audio':
        settingsSystem.manager.updateAudio(updates);
        break;
      case 'display':
        settingsSystem.manager.updateDisplay(updates);
        break;
      case 'gameplay':
        settingsSystem.manager.updateGameplay(updates);
        break;
      case 'accessibility':
        settingsSystem.manager.updateAccessibility(updates);
        break;
      case 'locale':
        settingsSystem.manager.updateLocale(updates);
        if (updates.language) {
          localizationSystem.setLocale(updates.language);
        }
        break;
    }
  }, []);

  const resetSettings = useCallback(() => {
    settingsSystem.manager.reset();
  }, []);

  return {
    getSettings,
    updateSettings,
    resetSettings,
  };
}

/**
 * 엔딩 체크 훅
 */
export function useEndingCheck() {
  const store = useGameStore();

  const checkEndings = useCallback((): EndingCheckResult => {
    const gameState = {
      cash: store.business.finance.cash,
      users: store.business.users.total,
      premiumUsers: store.business.users.premium,
      day: store.time.totalDays,
      reputation: store.player.social.reputation,
      achievements: store.progress.achievements,
      stats: {
        energy: store.player.health.energy,
        stress: store.player.health.stress,
        serverHealth: store.business.infrastructure.serverHealth,
      },
    };

    return endingSystem.checkConditions(gameState);
  }, [store]);

  const triggerEnding = useCallback((endingId: string) => {
    const gameState = {
      cash: store.business.finance.cash,
      users: store.business.users.total,
      premiumUsers: store.business.users.premium,
      day: store.time.totalDays,
      totalRevenue: store.history.financialHistory.reduce((sum, r) => sum + r.revenue, 0),
      achievements: store.progress.achievements,
    };

    const result = endingSystem.triggerEnding(endingId, gameState);

    if (result.success) {
      analyticsSystem.trackProgression('ending_reached', {
        endingId,
        score: result.stats?.totalScore,
        grade: result.grade?.rank,
      });
    }

    return result;
  }, [store]);

  return {
    checkEndings,
    triggerEnding,
  };
}

/**
 * 디버그 훅
 */
export function useDebug() {
  const isDebugEnabled = useCallback(() => {
    return debugSystem.isEnabled();
  }, []);

  const enableDebug = useCallback(() => {
    debugSystem.enable();
  }, []);

  const executeCheat = useCallback((code: string) => {
    return debugSystem.executeCheat(code);
  }, []);

  const executeCommand = useCallback((command: string) => {
    return debugSystem.executeCommand(command);
  }, []);

  const togglePanel = useCallback(() => {
    debugSystem.togglePanel();
  }, []);

  return {
    isDebugEnabled,
    enableDebug,
    executeCheat,
    executeCommand,
    togglePanel,
  };
}

/**
 * 다국어 훅
 */
export function useTranslation() {
  const translate = useCallback((key: string, variables?: Record<string, any>) => {
    return localizationSystem.t(key, variables);
  }, []);

  const setLocale = useCallback((locale: string) => {
    localizationSystem.setLocale(locale as any);
  }, []);

  const getLocale = useCallback(() => {
    return localizationSystem.getLocale();
  }, []);

  const formatNumber = useCallback((value: number) => {
    return localizationSystem.formatNumber(value);
  }, []);

  const formatCurrency = useCallback((value: number) => {
    return localizationSystem.formatCurrency(value);
  }, []);

  return {
    t: translate,
    setLocale,
    getLocale,
    formatNumber,
    formatCurrency,
  };
}

// ============================================
// Helper Functions
// ============================================

function applySettings(settings: SettingsState) {
  // 테마 적용
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', settings.display.theme);

    // 접근성 설정
    if (settings.accessibility.reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
    if (settings.accessibility.highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }

  // 언어 설정
  if (settings.locale?.language) {
    localizationSystem.setLocale(settings.locale.language as any);
  }
}

// ============================================
// Combined Hook
// ============================================

/**
 * 모든 시스템 통합 훅
 */
export function useGameSystems() {
  useSystemsInit();

  const analytics = useAnalyticsTracking();
  const tutorial = useTutorial();
  const saveLoad = useSaveLoad();
  const settings = useSettings();
  const ending = useEndingCheck();
  const debug = useDebug();
  const i18n = useTranslation();

  return {
    analytics,
    tutorial,
    saveLoad,
    settings,
    ending,
    debug,
    i18n,
  };
}

export default useGameSystems;
