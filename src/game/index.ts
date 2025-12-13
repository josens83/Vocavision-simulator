/**
 * VocaVision Simulator - Main Game Module
 * 메인 게임 모듈 통합 엔트리 포인트
 *
 * 이 파일은 VocaVision 시뮬레이터의 모든 게임 시스템을 통합하여 내보냅니다.
 *
 * 포함된 시스템:
 * - Chapter 1-7: Core Gameplay (이전 구현)
 * - Chapter 8: Save/Load & Persistence
 * - Chapter 9: Tutorial & Onboarding
 * - Chapter 10: Settings & Preferences
 * - Chapter 11: Ending & Victory
 * - Chapter 12: Analytics & Telemetry
 * - Chapter 13: Localization
 * - Chapter 14: Debug & Testing
 * - Chapter 15: Main Game Screen (Core Integration)
 */

// ============================================
// Core Game System (Chapter 15)
// ============================================

export {
  // Game Manager
  GameManager,
  gameManager,

  // Game System
  gameSystem,
  createGameSystem,
  type GameSystem,
  type GameManagerListener,

  // Types
  type GameState,
  type UIState,
  type TimeState,
  type ResourceState,
  type StatsState,
  type CompanyState,
  type ProductState,
  type PlayerState,
  type ProgressionState,
  type GamePhase,
  type ActiveTab,
  type ModalType,
  type GameSpeed,
  type Notification,
  type GameEvent,
  type GameAction,
  type EventChoice,
  type EventEffect,
  type ActionCost,
  type ActionEffect,

  // Initial States
  INITIAL_GAME_STATE,
  INITIAL_UI_STATE,
  INITIAL_TIME_STATE,
  INITIAL_RESOURCE_STATE,
  INITIAL_STATS_STATE,
  INITIAL_COMPANY_STATE,
  INITIAL_PRODUCT_STATE,
  INITIAL_PLAYER_STATE,
  INITIAL_PROGRESSION_STATE,

  // Config
  type GameManagerConfig,
  DEFAULT_GAME_CONFIG,

  // Utils
  createStateSummary,
  formatCurrency,
  formatNumber,
  formatPercent,
  getPhaseLabel,
  getTabLabel,

  // UI Props
  type GameScreenProps,
  type TitleScreenProps,
  type MainGameUIProps,
  type HeaderBarProps,
  type ResourcePanelProps,
  type ActionPanelProps,
  type EventModalProps,
  type NotificationToastProps,
  type EndDayModalProps,
  type GameOverScreenProps,
  type EndingScreenProps,
} from './core';

// ============================================
// Save System (Chapter 8)
// ============================================

export {
  SaveSystem,
  SaveManager,
  saveSystem,
  saveManager,
  CloudSyncManager,
  cloudSyncManager,
  compressData,
  decompressData,
  migrateData,
  type SaveData,
  type SaveSlotPreview,
  type SaveResult,
  type LoadResult,
  type AutoSaveConfig,
  type CloudSyncConfig,
} from './save';

// ============================================
// Tutorial System (Chapter 9)
// ============================================

export {
  TutorialManager,
  tutorialManager,
  tutorialSystem,
  createTutorialSystem,
  tutorials,
  hints,
  helpTopics,
  helpCategories,
  featureDiscoveries,
  getTutorialById,
  getHintById,
  type TutorialSystem,
  type TutorialSequence,
  type TutorialStep,
  type Hint,
  type HelpTopic,
  type FeatureDiscovery,
} from './tutorial';

// ============================================
// Settings System (Chapter 10)
// ============================================

export {
  SettingsManager,
  settingsManager,
  settingsSystem,
  applyCSSTheme,
  applyColorBlindFilter,
  applyReducedMotion,
  PERFORMANCE_PRESET,
  ACCESSIBILITY_PRESET,
  STREAMER_PRESET,
  LOW_VISION_PRESET,
  type SettingsSystem,
  type AudioSettings,
  type DisplaySettings,
  type GameplaySettings,
  type AccessibilitySettings,
  type ControlSettings,
  type LocaleSettings,
  type PrivacySettings,
  type KeyBinding,
} from './settings';

// ============================================
// Ending System (Chapter 11)
// ============================================

export {
  EndingManager,
  endingManager,
  endingSystem,
  createEndingSystem,
  victoryEndings,
  specialEndings,
  secretEndings,
  gameOverReasons,
  victoryConditions,
  allEndings,
  getEndingById,
  getEndingsByType,
  getEndingsByTier,
  getEndingTypeLabel,
  getEndingTierLabel,
  getEndingTierColor,
  formatScore,
  formatPlayTime,
  type EndingSystem,
  type Ending,
  type EndingType,
  type EndingTier,
  type EndingCondition,
  type EndingRequirement,
  type EndingReward,
  type EndingEpilogue,
  type EndingState,
  type EndingGrade,
  type PlaythroughStats,
  type NewGamePlusConfig,
  type EndingCheckResult,
  type EndingTriggerResult,
} from './ending';

// ============================================
// Analytics System (Chapter 12)
// ============================================

export {
  EventTracker,
  eventTracker,
  SessionManager,
  sessionManager,
  MetricsAggregator,
  metricsAggregator,
  analyticsSystem,
  createAnalyticsSystem,
  setupDefaultFunnels,
  getEventCategoryLabel,
  formatDuration,
  formatPercentage,
  type AnalyticsSystem,
  type AnalyticsEvent,
  type SessionData,
  type UserProfile,
  type AggregatedMetrics,
  type FunnelAnalysis,
  type CohortAnalysis,
  type PrivacyConsent,
  type AnalyticsConfig,
  type EventCategory,
  type EventPriority,
} from './analytics';

// ============================================
// Localization System (Chapter 13)
// ============================================

export {
  LocalizationManager,
  localizationManager,
  localizationSystem,
  createLocalizationSystem,
  t,
  translations,
  getTranslations,
  koKRTranslations,
  enUSTranslations,
  getLanguageList,
  getLanguageCode,
  getCountryCode,
  isRTL,
  calculateTranslationProgress,
  type LocalizationSystem,
  type SupportedLocale,
  type LocaleInfo,
  type TranslationDictionary,
  type InterpolationVariables,
  type LocalizationConfig,
  LOCALE_INFO,
} from './localization';

// ============================================
// Debug System (Chapter 14)
// ============================================

export {
  DebugManager,
  debugManager,
  debugSystem,
  createDebugSystem,
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
  KONAMI_CODE,
  checkKonamiCode,
  devOnly,
  conditionalLog,
  measurePerformance,
  getDebugLevelLabel,
  getCheatCategoryLabel,
  type DebugSystem,
  type DebugConfig,
  type DebugLevel,
  type LogEntry,
  type LogFilter,
  type StateSnapshot,
  type CheatCode,
  type CheatResult,
  type PerformanceMetrics,
  type TimeMode,
  type ConsoleCommand,
  type ConsoleOutput,
} from './debug';

// ============================================
// Default Export
// ============================================

/**
 * VocaVision 게임 시스템 통합 객체
 */
export const VocaVision = {
  // Core
  game: () => import('./core').then((m) => m.gameSystem),

  // Save
  save: () => import('./save').then((m) => m.saveSystem),

  // Tutorial
  tutorial: () => import('./tutorial').then((m) => m.tutorialSystem),

  // Settings
  settings: () => import('./settings').then((m) => m.settingsSystem),

  // Ending
  ending: () => import('./ending').then((m) => m.endingSystem),

  // Analytics
  analytics: () => import('./analytics').then((m) => m.analyticsSystem),

  // Localization
  localization: () => import('./localization').then((m) => m.localizationSystem),

  // Debug
  debug: () => import('./debug').then((m) => m.debugSystem),

  // Version
  version: '1.0.0',
};

export default VocaVision;
