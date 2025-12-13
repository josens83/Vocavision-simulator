/**
 * Chapter 10: Settings & Preferences - Main Entry Point
 * 설정 시스템 메인 엔트리 포인트
 *
 * 이 모듈은 VocaVision 시뮬레이터의 설정 시스템을 제공합니다.
 *
 * 주요 기능:
 * 1. 오디오 설정 - 볼륨, 음소거
 * 2. 디스플레이 설정 - 테마, 폰트, 애니메이션
 * 3. 게임플레이 설정 - 자동저장, 확인 다이얼로그
 * 4. 접근성 설정 - 고대비, 색맹 모드, 모션 감소
 * 5. 컨트롤 설정 - 키 바인딩, 마우스
 * 6. 언어/지역 설정 - 언어, 날짜 형식
 * 7. 개인정보 설정 - 분석, 클라우드 동기화
 */

// ============================================
// Type Exports
// ============================================

export * from './types';

// ============================================
// Settings Manager
// ============================================

export { SettingsManager, settingsManager } from './settingsManager';

// ============================================
// 설정 UI 프리셋
// ============================================

import {
  AudioSettings,
  DisplaySettings,
  GameplaySettings,
  AccessibilitySettings,
  DEFAULT_AUDIO_SETTINGS,
  DEFAULT_DISPLAY_SETTINGS,
  DEFAULT_GAMEPLAY_SETTINGS,
  DEFAULT_ACCESSIBILITY_SETTINGS,
} from './types';

/**
 * 성능 최적화 프리셋
 */
export const PERFORMANCE_PRESET: Partial<DisplaySettings> = {
  animations: false,
  animationSpeed: 'none',
  reducedMotion: true,
  showFPS: true,
  showPerformanceStats: true,
};

/**
 * 접근성 프리셋
 */
export const ACCESSIBILITY_PRESET: Partial<AccessibilitySettings> = {
  highContrast: true,
  largeText: true,
  boldText: true,
  reduceMotion: true,
  focusHighlight: true,
  extendedTimeouts: true,
  keyboardNavigation: true,
};

/**
 * 스트리머 프리셋
 */
export const STREAMER_PRESET: Partial<DisplaySettings & GameplaySettings> = {
  compactMode: true,
  pauseOnFocusLoss: false,
  showNotifications: true,
  notificationDuration: 3,
};

/**
 * 저시력 프리셋
 */
export const LOW_VISION_PRESET: Partial<AccessibilitySettings & DisplaySettings> = {
  largeText: true,
  boldText: true,
  highContrast: true,
  fontSize: 'extra-large',
  animations: false,
};

// ============================================
// 설정 UI 컴포넌트 Props
// ============================================

export interface SettingsSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  showValue?: boolean;
  unit?: string;
}

export interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export interface SettingsSelectProps<T> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  disabled?: boolean;
}

export interface KeyBindingInputProps {
  action: string;
  label: string;
  currentKey: string;
  currentModifiers: {
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
    meta?: boolean;
  };
  onBind: (key: string, modifiers: KeyBindingInputProps['currentModifiers']) => void;
  onReset: () => void;
  isConflicting?: boolean;
  conflictAction?: string;
}

export interface SettingsPanelProps {
  category: string;
  title: string;
  icon?: string;
  children: React.ReactNode;
}

// ============================================
// 설정 변경 효과 적용
// ============================================

import { settingsManager } from './settingsManager';

/**
 * CSS 변수로 테마 적용
 */
export function applyCSSTheme(theme: 'light' | 'dark'): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  if (theme === 'dark') {
    root.style.setProperty('--bg-primary', '#0f0f0f');
    root.style.setProperty('--bg-secondary', '#1a1a1a');
    root.style.setProperty('--text-primary', '#ffffff');
    root.style.setProperty('--text-secondary', '#a0a0a0');
    root.style.setProperty('--accent', '#6366f1');
    root.style.setProperty('--border', '#333333');
  } else {
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f5f5f5');
    root.style.setProperty('--text-primary', '#0f0f0f');
    root.style.setProperty('--text-secondary', '#666666');
    root.style.setProperty('--accent', '#4f46e5');
    root.style.setProperty('--border', '#e0e0e0');
  }
}

/**
 * 색맹 모드 필터 적용
 */
export function applyColorBlindFilter(mode: string): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  const filters: Record<string, string> = {
    none: 'none',
    protanopia: 'url(#protanopia)',
    deuteranopia: 'url(#deuteranopia)',
    tritanopia: 'url(#tritanopia)',
    achromatopsia: 'grayscale(100%)',
  };

  root.style.filter = filters[mode] || 'none';
}

/**
 * 모션 감소 CSS 적용
 */
export function applyReducedMotion(reduce: boolean): void {
  if (typeof document === 'undefined') return;

  const style = document.getElementById('reduced-motion-style') || document.createElement('style');
  style.id = 'reduced-motion-style';

  if (reduce) {
    style.textContent = `
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
  } else {
    style.textContent = '';
  }

  if (!style.parentNode) {
    document.head.appendChild(style);
  }
}

// ============================================
// 설정 시스템 통합
// ============================================

export interface SettingsSystem {
  manager: typeof settingsManager;
  applyCSSTheme: typeof applyCSSTheme;
  applyColorBlindFilter: typeof applyColorBlindFilter;
  applyReducedMotion: typeof applyReducedMotion;
  presets: {
    performance: typeof PERFORMANCE_PRESET;
    accessibility: typeof ACCESSIBILITY_PRESET;
    streamer: typeof STREAMER_PRESET;
    lowVision: typeof LOW_VISION_PRESET;
  };
}

export const settingsSystem: SettingsSystem = {
  manager: settingsManager,
  applyCSSTheme,
  applyColorBlindFilter,
  applyReducedMotion,
  presets: {
    performance: PERFORMANCE_PRESET,
    accessibility: ACCESSIBILITY_PRESET,
    streamer: STREAMER_PRESET,
    lowVision: LOW_VISION_PRESET,
  },
};

export default settingsSystem;
