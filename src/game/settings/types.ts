/**
 * Chapter 10: Settings & Preferences - Type Definitions
 * 설정 시스템 타입 정의
 */

// ============================================
// 오디오 설정
// ============================================

export interface AudioSettings {
  masterVolume: number;      // 0-1
  musicVolume: number;       // 0-1
  sfxVolume: number;         // 0-1
  ambienceVolume: number;    // 0-1
  voiceVolume: number;       // 0-1
  muted: boolean;
  musicMuted: boolean;
  sfxMuted: boolean;
  ambienceMuted: boolean;
  voiceMuted: boolean;
}

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.8,
  ambienceVolume: 0.5,
  voiceVolume: 0.9,
  muted: false,
  musicMuted: false,
  sfxMuted: false,
  ambienceMuted: false,
  voiceMuted: false,
};

// ============================================
// 디스플레이 설정
// ============================================

export type ThemeMode = 'light' | 'dark' | 'auto' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type AnimationSpeed = 'none' | 'reduced' | 'normal' | 'fast';

export interface DisplaySettings {
  theme: ThemeMode;
  fontSize: FontSize;
  fontFamily: string;
  animations: boolean;
  animationSpeed: AnimationSpeed;
  reducedMotion: boolean;
  showFPS: boolean;
  showPerformanceStats: boolean;
  compactMode: boolean;
  sidebarPosition: 'left' | 'right';
  dashboardLayout: 'default' | 'compact' | 'detailed';
}

export const DEFAULT_DISPLAY_SETTINGS: DisplaySettings = {
  theme: 'auto',
  fontSize: 'medium',
  fontFamily: 'system-ui',
  animations: true,
  animationSpeed: 'normal',
  reducedMotion: false,
  showFPS: false,
  showPerformanceStats: false,
  compactMode: false,
  sidebarPosition: 'left',
  dashboardLayout: 'default',
};

// ============================================
// 게임플레이 설정
// ============================================

export interface GameplaySettings {
  // 자동저장
  autoSave: boolean;
  autoSaveInterval: number;  // 분

  // 확인 다이얼로그
  confirmActions: boolean;
  confirmImportantDecisions: boolean;
  confirmQuit: boolean;

  // 튜토리얼
  showTutorials: boolean;
  showHints: boolean;
  showTooltips: boolean;

  // 이벤트 처리
  pauseOnEvent: boolean;
  pauseOnCriticalEvent: boolean;
  eventTimeout: number;      // 초 (0 = 무제한)

  // 시간 설정
  defaultGameSpeed: 1 | 2 | 4;
  pauseOnFocusLoss: boolean;

  // 알림
  showNotifications: boolean;
  notificationDuration: number;  // 초
  notificationSound: boolean;

  // 난이도
  autoAdjustDifficulty: boolean;
  showDifficultyIndicator: boolean;
}

export const DEFAULT_GAMEPLAY_SETTINGS: GameplaySettings = {
  autoSave: true,
  autoSaveInterval: 5,
  confirmActions: true,
  confirmImportantDecisions: true,
  confirmQuit: true,
  showTutorials: true,
  showHints: true,
  showTooltips: true,
  pauseOnEvent: true,
  pauseOnCriticalEvent: true,
  eventTimeout: 0,
  defaultGameSpeed: 1,
  pauseOnFocusLoss: true,
  showNotifications: true,
  notificationDuration: 5,
  notificationSound: true,
  autoAdjustDifficulty: false,
  showDifficultyIndicator: true,
};

// ============================================
// 접근성 설정
// ============================================

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export interface AccessibilitySettings {
  // 시각
  highContrast: boolean;
  colorBlindMode: ColorBlindMode;
  largeText: boolean;
  boldText: boolean;
  underlineLinks: boolean;

  // 모션
  reduceMotion: boolean;
  disableParallax: boolean;
  disableAutoPlay: boolean;

  // 스크린 리더
  screenReaderMode: boolean;
  ariaLabels: boolean;

  // 키보드
  keyboardNavigation: boolean;
  focusHighlight: boolean;
  tabNavigation: boolean;

  // 오디오
  closedCaptions: boolean;
  visualAlerts: boolean;

  // 인지
  simplifiedUI: boolean;
  extendedTimeouts: boolean;
  readingGuide: boolean;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  colorBlindMode: 'none',
  largeText: false,
  boldText: false,
  underlineLinks: false,
  reduceMotion: false,
  disableParallax: false,
  disableAutoPlay: false,
  screenReaderMode: false,
  ariaLabels: true,
  keyboardNavigation: true,
  focusHighlight: true,
  tabNavigation: true,
  closedCaptions: false,
  visualAlerts: false,
  simplifiedUI: false,
  extendedTimeouts: false,
  readingGuide: false,
};

// ============================================
// 컨트롤 설정
// ============================================

export interface KeyBinding {
  action: string;
  key: string;
  modifiers: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
}

export interface ControlSettings {
  keyBindings: KeyBinding[];
  mouseSettings: {
    sensitivity: number;
    invertScroll: boolean;
    doubleClickSpeed: number;
  };
  touchSettings: {
    swipeThreshold: number;
    tapDelay: number;
    longPressDelay: number;
  };
  gamepad: {
    enabled: boolean;
    vibration: boolean;
    deadzone: number;
  };
}

export const DEFAULT_KEY_BINDINGS: KeyBinding[] = [
  { action: 'pause', key: 'Space', modifiers: {} },
  { action: 'speed_1x', key: '1', modifiers: {} },
  { action: 'speed_2x', key: '2', modifiers: {} },
  { action: 'speed_4x', key: '3', modifiers: {} },
  { action: 'menu', key: 'Escape', modifiers: {} },
  { action: 'quick_save', key: 'S', modifiers: { ctrl: true } },
  { action: 'quick_load', key: 'L', modifiers: { ctrl: true } },
  { action: 'help', key: 'F1', modifiers: {} },
  { action: 'stats', key: 'Tab', modifiers: {} },
  { action: 'notifications', key: 'N', modifiers: { ctrl: true } },
  { action: 'settings', key: ',', modifiers: { ctrl: true } },
  { action: 'fullscreen', key: 'F11', modifiers: {} },
  { action: 'mute', key: 'M', modifiers: {} },
  { action: 'screenshot', key: 'P', modifiers: { ctrl: true } },
];

export const DEFAULT_CONTROL_SETTINGS: ControlSettings = {
  keyBindings: DEFAULT_KEY_BINDINGS,
  mouseSettings: {
    sensitivity: 1.0,
    invertScroll: false,
    doubleClickSpeed: 300,
  },
  touchSettings: {
    swipeThreshold: 50,
    tapDelay: 100,
    longPressDelay: 500,
  },
  gamepad: {
    enabled: true,
    vibration: true,
    deadzone: 0.1,
  },
};

// ============================================
// 언어/지역 설정
// ============================================

export interface LocaleSettings {
  language: string;           // ko, en, ja 등
  region: string;             // KR, US, JP 등
  dateFormat: string;         // YYYY-MM-DD, MM/DD/YYYY 등
  timeFormat: '12h' | '24h';
  numberFormat: 'comma' | 'space' | 'period';
  currencyFormat: 'symbol' | 'code' | 'name';
  timezone: string;
}

export const DEFAULT_LOCALE_SETTINGS: LocaleSettings = {
  language: 'ko',
  region: 'KR',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: '24h',
  numberFormat: 'comma',
  currencyFormat: 'symbol',
  timezone: 'Asia/Seoul',
};

// ============================================
// 개인정보 설정
// ============================================

export interface PrivacySettings {
  analytics: boolean;
  crashReports: boolean;
  usageData: boolean;
  personalizedContent: boolean;
  cloudSync: boolean;
  shareStats: boolean;
  leaderboards: boolean;
  socialFeatures: boolean;
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  analytics: true,
  crashReports: true,
  usageData: true,
  personalizedContent: true,
  cloudSync: true,
  shareStats: true,
  leaderboards: true,
  socialFeatures: true,
};

// ============================================
// 전체 설정
// ============================================

export interface GameSettings {
  audio: AudioSettings;
  display: DisplaySettings;
  gameplay: GameplaySettings;
  accessibility: AccessibilitySettings;
  controls: ControlSettings;
  locale: LocaleSettings;
  privacy: PrivacySettings;
  version: string;
  lastModified: Date;
}

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  audio: DEFAULT_AUDIO_SETTINGS,
  display: DEFAULT_DISPLAY_SETTINGS,
  gameplay: DEFAULT_GAMEPLAY_SETTINGS,
  accessibility: DEFAULT_ACCESSIBILITY_SETTINGS,
  controls: DEFAULT_CONTROL_SETTINGS,
  locale: DEFAULT_LOCALE_SETTINGS,
  privacy: DEFAULT_PRIVACY_SETTINGS,
  version: '1.0.0',
  lastModified: new Date(),
};

// ============================================
// 설정 이벤트
// ============================================

export type SettingsEventType =
  | 'settings_changed'
  | 'settings_reset'
  | 'settings_imported'
  | 'settings_exported'
  | 'theme_changed'
  | 'language_changed'
  | 'keybinding_changed';

export interface SettingsEvent {
  type: SettingsEventType;
  category?: string;
  key?: string;
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
}

export type SettingsEventListener = (event: SettingsEvent) => void;

// ============================================
// 설정 카테고리 메타데이터
// ============================================

export interface SettingsMeta {
  id: string;
  category: string;
  name: string;
  description: string;
  type: 'boolean' | 'number' | 'string' | 'select' | 'range' | 'keybinding' | 'color';
  default: any;
  options?: { value: any; label: string }[];
  range?: { min: number; max: number; step: number };
  requiresRestart?: boolean;
  advanced?: boolean;
  experimental?: boolean;
}

export const SETTINGS_CATEGORIES = [
  { id: 'audio', name: '오디오', icon: '🔊', order: 1 },
  { id: 'display', name: '디스플레이', icon: '🖥️', order: 2 },
  { id: 'gameplay', name: '게임플레이', icon: '🎮', order: 3 },
  { id: 'accessibility', name: '접근성', icon: '♿', order: 4 },
  { id: 'controls', name: '컨트롤', icon: '⌨️', order: 5 },
  { id: 'locale', name: '언어/지역', icon: '🌐', order: 6 },
  { id: 'privacy', name: '개인정보', icon: '🔒', order: 7 },
];

// ============================================
// 상수
// ============================================

export const SETTINGS_CONSTANTS = {
  STORAGE_KEY: 'vocavision_settings',
  VERSION: '1.0.0',
  MAX_EXPORT_SIZE: 1024 * 1024,  // 1MB
};
