'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useSaveLoad, useSettings, useTutorial, useEndingCheck, useDebug, useTranslation } from '../store/systemIntegration';
import { SaveLoadModal } from '../ui/modals/SaveLoadModal';
import { SettingsModal } from '../ui/modals/SettingsModal';
import { TutorialOverlay, WelcomeTutorial } from '../ui/modals/TutorialOverlay';
import { EndingScreen } from '../ui/modals/EndingScreen';
import { AchievementPopup, useAchievementPopup as useAchievementPopupHook, Achievement } from '../ui/modals/AchievementPopup';
import { DebugPanel } from '../ui/modals/DebugPanel';
import { checkUnlockableAchievements, ACHIEVEMENTS } from '../content/achievements';

// ============================================
// 게임 컨텍스트 타입
// ============================================

interface GameContextValue {
  // 모달 상태
  showSaveModal: () => void;
  showLoadModal: () => void;
  showSettingsModal: () => void;
  closeAllModals: () => void;

  // 시스템 접근
  saveGame: (slot: number, name?: string) => Promise<any>;
  loadGame: (slot: number) => Promise<any>;

  // 튜토리얼
  startTutorial: (id: string) => void;
  skipTutorial: () => void;

  // 디버그
  toggleDebugPanel: () => void;
  isDebugEnabled: boolean;

  // 엔딩
  checkEnding: () => { triggered: boolean; endingId?: string };

  // 업적
  showAchievement: (achievement: Achievement) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

// ============================================
// 게임 프로바이더
// ============================================

interface GameProviderProps {
  children: React.ReactNode;
  enableDebug?: boolean;
  enableTutorial?: boolean;
}

export function GameProvider({
  children,
  enableDebug = process.env.NODE_ENV === 'development',
  enableTutorial = true
}: GameProviderProps) {
  const store = useGameStore();

  // 모달 상태
  const [saveModalMode, setSaveModalMode] = useState<'save' | 'load' | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [endingData, setEndingData] = useState<{
    endingId: string;
    stats: any;
  } | null>(null);

  // 훅
  const saveLoad = useSaveLoad();
  const settings = useSettings();
  const tutorial = useTutorial();
  const ending = useEndingCheck();
  const debug = useDebug();
  const i18n = useTranslation();

  // 업적 팝업
  const { currentAchievement, showAchievement, dismissAchievement } = useAchievementPopupHook();

  // 이미 해금된 업적 추적
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(
    new Set(store.progress?.achievements || [])
  );

  // 업적 체크 (게임 상태 변경 시)
  useEffect(() => {
    if (!store.progress) return;

    const newUnlockable = checkUnlockableAchievements(
      store as any,
      unlockedAchievements
    );

    if (newUnlockable.length > 0) {
      // 첫 번째 업적 표시
      const firstNew = newUnlockable[0];
      showAchievement({
        id: firstNew.id,
        name: firstNew.name,
        description: firstNew.description,
        icon: firstNew.icon,
        rarity: firstNew.rarity,
        points: firstNew.points,
      });

      // 해금 목록에 추가
      setUnlockedAchievements(prev => {
        const newSet = new Set(prev);
        newUnlockable.forEach(a => newSet.add(a.id));
        return newSet;
      });
    }
  }, [store.time?.totalDays, store.business?.users?.total, store.business?.users?.premium]);

  // 첫 방문 시 웰컴 튜토리얼
  useEffect(() => {
    if (enableTutorial && store.time?.totalDays === 0) {
      const hasSeenTutorial = localStorage.getItem('vocavision_tutorial_seen');
      if (!hasSeenTutorial) {
        setShowWelcome(true);
      }
    }
  }, [enableTutorial, store.time?.totalDays]);

  // 엔딩 체크
  useEffect(() => {
    if (store.gameOver) return;

    const result = ending.checkEndings();
    if (result.triggered && result.endingId) {
      const triggerResult = ending.triggerEnding(result.endingId);
      if (triggerResult.success) {
        setEndingData({
          endingId: result.endingId,
          stats: triggerResult.stats || {
            totalScore: 0,
            daysPlayed: store.time?.totalDays || 0,
            playTime: 0,
            grade: 'C',
          },
        });
      }
    }
  }, [store.time?.totalDays, store.business?.users?.total]);

  // 컨텍스트 값
  const contextValue: GameContextValue = {
    showSaveModal: useCallback(() => setSaveModalMode('save'), []),
    showLoadModal: useCallback(() => setSaveModalMode('load'), []),
    showSettingsModal: useCallback(() => setShowSettings(true), []),
    closeAllModals: useCallback(() => {
      setSaveModalMode(null);
      setShowSettings(false);
      setShowDebug(false);
    }, []),

    saveGame: saveLoad.saveGame,
    loadGame: saveLoad.loadGame,

    startTutorial: tutorial.startTutorial,
    skipTutorial: tutorial.skipTutorial,

    toggleDebugPanel: useCallback(() => setShowDebug(prev => !prev), []),
    isDebugEnabled: enableDebug,

    checkEnding: () => {
      const result = ending.checkEndings();
      return {
        triggered: result.triggered,
        endingId: result.endingId,
      };
    },

    showAchievement,
  };

  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
    localStorage.setItem('vocavision_tutorial_seen', 'true');
  }, []);

  const handleEndingNewGame = useCallback(() => {
    setEndingData(null);
    // Reset game state
    window.location.reload();
  }, []);

  const handleEndingNewGamePlus = useCallback(() => {
    // TODO: Implement NG+ logic
    setEndingData(null);
    window.location.reload();
  }, []);

  const handleEndingMainMenu = useCallback(() => {
    setEndingData(null);
    window.location.href = '/';
  }, []);

  return (
    <GameContext.Provider value={contextValue}>
      {children}

      {/* 저장/불러오기 모달 */}
      {saveModalMode && (
        <SaveLoadModal
          mode={saveModalMode}
          isOpen={true}
          onClose={() => setSaveModalMode(null)}
        />
      )}

      {/* 설정 모달 */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* 웰컴 튜토리얼 */}
      {showWelcome && (
        <WelcomeTutorial onComplete={handleWelcomeComplete} />
      )}

      {/* 튜토리얼 오버레이 */}
      <TutorialOverlay />

      {/* 업적 팝업 */}
      <AchievementPopup
        achievement={currentAchievement}
        onDismiss={dismissAchievement}
      />

      {/* 엔딩 화면 */}
      {endingData && (
        <EndingScreen
          endingId={endingData.endingId}
          stats={endingData.stats}
          onNewGame={handleEndingNewGame}
          onNewGamePlus={handleEndingNewGamePlus}
          onMainMenu={handleEndingMainMenu}
        />
      )}

      {/* 디버그 패널 */}
      {enableDebug && (
        <DebugPanel
          isOpen={showDebug}
          onClose={() => setShowDebug(false)}
        />
      )}

      {/* 키보드 단축키 (디버그용) */}
      {enableDebug && <KeyboardShortcuts onToggleDebug={() => setShowDebug(prev => !prev)} />}
    </GameContext.Provider>
  );
}

// ============================================
// 키보드 단축키 컴포넌트
// ============================================

function KeyboardShortcuts({ onToggleDebug }: { onToggleDebug: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + D: 디버그 패널 토글
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        onToggleDebug();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleDebug]);

  return null;
}

// ============================================
// 훅
// ============================================

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameProvider;
