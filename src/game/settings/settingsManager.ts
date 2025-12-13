/**
 * Chapter 10: Settings & Preferences - Settings Manager
 * 설정 관리자
 */

import {
  GameSettings,
  AudioSettings,
  DisplaySettings,
  GameplaySettings,
  AccessibilitySettings,
  ControlSettings,
  LocaleSettings,
  PrivacySettings,
  KeyBinding,
  SettingsEvent,
  SettingsEventListener,
  SettingsEventType,
  DEFAULT_GAME_SETTINGS,
  DEFAULT_AUDIO_SETTINGS,
  DEFAULT_DISPLAY_SETTINGS,
  DEFAULT_GAMEPLAY_SETTINGS,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  DEFAULT_CONTROL_SETTINGS,
  DEFAULT_LOCALE_SETTINGS,
  DEFAULT_PRIVACY_SETTINGS,
  DEFAULT_KEY_BINDINGS,
  SETTINGS_CONSTANTS,
} from './types';

// ============================================
// 설정 관리자 클래스
// ============================================

export class SettingsManager {
  private settings: GameSettings;
  private eventListeners: Set<SettingsEventListener> = new Set();
  private keyBindingsMap: Map<string, KeyBinding> = new Map();
  private pendingChanges: Map<string, any> = new Map();
  private isDirty: boolean = false;

  constructor() {
    this.settings = this.loadSettings();
    this.buildKeyBindingsMap();
    this.applySystemSettings();
  }

  // ============================================
  // 이벤트 시스템
  // ============================================

  addEventListener(listener: SettingsEventListener): () => void {
    this.eventListeners.add(listener);
    return () => this.eventListeners.delete(listener);
  }

  private emit(
    type: SettingsEventType,
    category?: string,
    key?: string,
    oldValue?: any,
    newValue?: any,
  ): void {
    const event: SettingsEvent = {
      type,
      category,
      key,
      oldValue,
      newValue,
      timestamp: new Date(),
    };
    this.eventListeners.forEach((listener) => listener(event));
  }

  // ============================================
  // 설정 가져오기
  // ============================================

  getSettings(): GameSettings {
    return { ...this.settings };
  }

  getAudio(): AudioSettings {
    return { ...this.settings.audio };
  }

  getDisplay(): DisplaySettings {
    return { ...this.settings.display };
  }

  getGameplay(): GameplaySettings {
    return { ...this.settings.gameplay };
  }

  getAccessibility(): AccessibilitySettings {
    return { ...this.settings.accessibility };
  }

  getControls(): ControlSettings {
    return { ...this.settings.controls };
  }

  getLocale(): LocaleSettings {
    return { ...this.settings.locale };
  }

  getPrivacy(): PrivacySettings {
    return { ...this.settings.privacy };
  }

  // ============================================
  // 개별 설정 값 가져오기
  // ============================================

  get<K extends keyof GameSettings>(category: K): GameSettings[K] {
    return this.settings[category];
  }

  getValue<T>(path: string): T | undefined {
    return path.split('.').reduce((obj: any, key) => obj?.[key], this.settings);
  }

  // ============================================
  // 설정 업데이트
  // ============================================

  updateAudio(updates: Partial<AudioSettings>): void {
    const oldValue = { ...this.settings.audio };
    this.settings.audio = { ...this.settings.audio, ...updates };
    this.markDirty();
    this.emit('settings_changed', 'audio', undefined, oldValue, this.settings.audio);

    // 볼륨 변경 즉시 적용
    this.applyAudioSettings();
  }

  updateDisplay(updates: Partial<DisplaySettings>): void {
    const oldValue = { ...this.settings.display };
    this.settings.display = { ...this.settings.display, ...updates };
    this.markDirty();

    if (updates.theme !== undefined && updates.theme !== oldValue.theme) {
      this.emit('theme_changed', 'display', 'theme', oldValue.theme, updates.theme);
    }

    this.emit('settings_changed', 'display', undefined, oldValue, this.settings.display);
    this.applyDisplaySettings();
  }

  updateGameplay(updates: Partial<GameplaySettings>): void {
    const oldValue = { ...this.settings.gameplay };
    this.settings.gameplay = { ...this.settings.gameplay, ...updates };
    this.markDirty();
    this.emit('settings_changed', 'gameplay', undefined, oldValue, this.settings.gameplay);
  }

  updateAccessibility(updates: Partial<AccessibilitySettings>): void {
    const oldValue = { ...this.settings.accessibility };
    this.settings.accessibility = { ...this.settings.accessibility, ...updates };
    this.markDirty();
    this.emit('settings_changed', 'accessibility', undefined, oldValue, this.settings.accessibility);
    this.applyAccessibilitySettings();
  }

  updateControls(updates: Partial<ControlSettings>): void {
    const oldValue = { ...this.settings.controls };
    this.settings.controls = { ...this.settings.controls, ...updates };
    this.buildKeyBindingsMap();
    this.markDirty();
    this.emit('settings_changed', 'controls', undefined, oldValue, this.settings.controls);
  }

  updateLocale(updates: Partial<LocaleSettings>): void {
    const oldValue = { ...this.settings.locale };
    this.settings.locale = { ...this.settings.locale, ...updates };
    this.markDirty();

    if (updates.language !== undefined && updates.language !== oldValue.language) {
      this.emit('language_changed', 'locale', 'language', oldValue.language, updates.language);
    }

    this.emit('settings_changed', 'locale', undefined, oldValue, this.settings.locale);
  }

  updatePrivacy(updates: Partial<PrivacySettings>): void {
    const oldValue = { ...this.settings.privacy };
    this.settings.privacy = { ...this.settings.privacy, ...updates };
    this.markDirty();
    this.emit('settings_changed', 'privacy', undefined, oldValue, this.settings.privacy);
  }

  // ============================================
  // 키 바인딩
  // ============================================

  getKeyBinding(action: string): KeyBinding | undefined {
    return this.keyBindingsMap.get(action);
  }

  setKeyBinding(action: string, key: string, modifiers: KeyBinding['modifiers'] = {}): void {
    const oldBinding = this.getKeyBinding(action);

    // 기존 바인딩 찾아서 업데이트
    const index = this.settings.controls.keyBindings.findIndex((kb) => kb.action === action);
    const newBinding: KeyBinding = { action, key, modifiers };

    if (index >= 0) {
      this.settings.controls.keyBindings[index] = newBinding;
    } else {
      this.settings.controls.keyBindings.push(newBinding);
    }

    this.keyBindingsMap.set(action, newBinding);
    this.markDirty();
    this.emit('keybinding_changed', 'controls', action, oldBinding, newBinding);
  }

  resetKeyBinding(action: string): void {
    const defaultBinding = DEFAULT_KEY_BINDINGS.find((kb) => kb.action === action);
    if (defaultBinding) {
      this.setKeyBinding(action, defaultBinding.key, defaultBinding.modifiers);
    }
  }

  resetAllKeyBindings(): void {
    this.settings.controls.keyBindings = [...DEFAULT_KEY_BINDINGS];
    this.buildKeyBindingsMap();
    this.markDirty();
    this.emit('settings_changed', 'controls');
  }

  isKeyBindingUsed(key: string, modifiers: KeyBinding['modifiers'] = {}): string | null {
    for (const [action, binding] of this.keyBindingsMap) {
      if (
        binding.key === key &&
        binding.modifiers.ctrl === modifiers.ctrl &&
        binding.modifiers.alt === modifiers.alt &&
        binding.modifiers.shift === modifiers.shift &&
        binding.modifiers.meta === modifiers.meta
      ) {
        return action;
      }
    }
    return null;
  }

  private buildKeyBindingsMap(): void {
    this.keyBindingsMap.clear();
    for (const binding of this.settings.controls.keyBindings) {
      this.keyBindingsMap.set(binding.action, binding);
    }
  }

  // ============================================
  // 키 이벤트 핸들링
  // ============================================

  handleKeyEvent(event: KeyboardEvent): string | null {
    const modifiers: KeyBinding['modifiers'] = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey,
    };

    for (const [action, binding] of this.keyBindingsMap) {
      if (
        binding.key.toLowerCase() === event.key.toLowerCase() &&
        !!binding.modifiers.ctrl === event.ctrlKey &&
        !!binding.modifiers.alt === event.altKey &&
        !!binding.modifiers.shift === event.shiftKey &&
        !!binding.modifiers.meta === event.metaKey
      ) {
        return action;
      }
    }

    return null;
  }

  // ============================================
  // 카테고리별 리셋
  // ============================================

  resetAudio(): void {
    this.settings.audio = { ...DEFAULT_AUDIO_SETTINGS };
    this.markDirty();
    this.emit('settings_reset', 'audio');
    this.applyAudioSettings();
  }

  resetDisplay(): void {
    this.settings.display = { ...DEFAULT_DISPLAY_SETTINGS };
    this.markDirty();
    this.emit('settings_reset', 'display');
    this.applyDisplaySettings();
  }

  resetGameplay(): void {
    this.settings.gameplay = { ...DEFAULT_GAMEPLAY_SETTINGS };
    this.markDirty();
    this.emit('settings_reset', 'gameplay');
  }

  resetAccessibility(): void {
    this.settings.accessibility = { ...DEFAULT_ACCESSIBILITY_SETTINGS };
    this.markDirty();
    this.emit('settings_reset', 'accessibility');
    this.applyAccessibilitySettings();
  }

  resetControls(): void {
    this.settings.controls = { ...DEFAULT_CONTROL_SETTINGS };
    this.buildKeyBindingsMap();
    this.markDirty();
    this.emit('settings_reset', 'controls');
  }

  resetLocale(): void {
    this.settings.locale = { ...DEFAULT_LOCALE_SETTINGS };
    this.markDirty();
    this.emit('settings_reset', 'locale');
  }

  resetPrivacy(): void {
    this.settings.privacy = { ...DEFAULT_PRIVACY_SETTINGS };
    this.markDirty();
    this.emit('settings_reset', 'privacy');
  }

  resetAll(): void {
    this.settings = {
      ...DEFAULT_GAME_SETTINGS,
      lastModified: new Date(),
    };
    this.buildKeyBindingsMap();
    this.saveSettings();
    this.applyAllSettings();
    this.emit('settings_reset');
  }

  // ============================================
  // 설정 적용
  // ============================================

  private applyAllSettings(): void {
    this.applyAudioSettings();
    this.applyDisplaySettings();
    this.applyAccessibilitySettings();
    this.applySystemSettings();
  }

  private applyAudioSettings(): void {
    // 오디오 설정은 AudioManager에서 처리
    // 여기서는 이벤트만 발생
  }

  private applyDisplaySettings(): void {
    if (typeof document === 'undefined') return;

    const { theme, fontSize, reducedMotion, fontFamily } = this.settings.display;

    // 테마 적용
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else if (theme === 'system' || theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
      root.classList.toggle('light', !prefersDark);
    }

    // 폰트 크기 적용
    const fontSizeMap: Record<string, string> = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px',
    };
    root.style.fontSize = fontSizeMap[fontSize] || '16px';

    // 모션 감소 적용
    if (reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // 폰트 패밀리 적용
    if (fontFamily && fontFamily !== 'system-ui') {
      root.style.fontFamily = fontFamily;
    }
  }

  private applyAccessibilitySettings(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const { highContrast, colorBlindMode, largeText, reduceMotion, focusHighlight } =
      this.settings.accessibility;

    // 고대비 모드
    root.classList.toggle('high-contrast', highContrast);

    // 색맹 모드
    root.dataset.colorBlindMode = colorBlindMode;

    // 큰 텍스트
    root.classList.toggle('large-text', largeText);

    // 모션 감소
    root.classList.toggle('reduce-motion', reduceMotion);

    // 포커스 하이라이트
    root.classList.toggle('focus-highlight', focusHighlight);
  }

  private applySystemSettings(): void {
    if (typeof window === 'undefined') return;

    // 시스템 테마 변경 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      if (this.settings.display.theme === 'system' || this.settings.display.theme === 'auto') {
        this.applyDisplaySettings();
      }
    });

    // 시스템 모션 감소 감지
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      if (e.matches && !this.settings.accessibility.reduceMotion) {
        // 시스템에서 모션 감소를 요청하면 자동 적용
        this.updateAccessibility({ reduceMotion: true });
      }
    });
  }

  // ============================================
  // 저장/로드
  // ============================================

  private markDirty(): void {
    this.isDirty = true;
    this.settings.lastModified = new Date();
    this.saveSettings();
  }

  saveSettings(): void {
    try {
      const json = JSON.stringify({
        ...this.settings,
        lastModified: this.settings.lastModified.toISOString(),
      });
      localStorage.setItem(SETTINGS_CONSTANTS.STORAGE_KEY, json);
      this.isDirty = false;
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  private loadSettings(): GameSettings {
    try {
      const json = localStorage.getItem(SETTINGS_CONSTANTS.STORAGE_KEY);
      if (json) {
        const loaded = JSON.parse(json);
        return {
          ...DEFAULT_GAME_SETTINGS,
          ...loaded,
          audio: { ...DEFAULT_AUDIO_SETTINGS, ...loaded.audio },
          display: { ...DEFAULT_DISPLAY_SETTINGS, ...loaded.display },
          gameplay: { ...DEFAULT_GAMEPLAY_SETTINGS, ...loaded.gameplay },
          accessibility: { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...loaded.accessibility },
          controls: {
            ...DEFAULT_CONTROL_SETTINGS,
            ...loaded.controls,
            keyBindings: loaded.controls?.keyBindings || DEFAULT_KEY_BINDINGS,
          },
          locale: { ...DEFAULT_LOCALE_SETTINGS, ...loaded.locale },
          privacy: { ...DEFAULT_PRIVACY_SETTINGS, ...loaded.privacy },
          lastModified: loaded.lastModified ? new Date(loaded.lastModified) : new Date(),
        };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    return { ...DEFAULT_GAME_SETTINGS, lastModified: new Date() };
  }

  // ============================================
  // 내보내기/가져오기
  // ============================================

  exportSettings(): string {
    const exportData = {
      ...this.settings,
      exportDate: new Date().toISOString(),
      exportVersion: SETTINGS_CONSTANTS.VERSION,
    };
    return JSON.stringify(exportData, null, 2);
  }

  importSettings(json: string): { success: boolean; error?: string } {
    try {
      const imported = JSON.parse(json);

      // 버전 확인
      if (imported.exportVersion && imported.exportVersion !== SETTINGS_CONSTANTS.VERSION) {
        console.warn('Settings version mismatch, some settings may not apply correctly');
      }

      // 설정 병합
      this.settings = {
        ...DEFAULT_GAME_SETTINGS,
        ...imported,
        audio: { ...DEFAULT_AUDIO_SETTINGS, ...imported.audio },
        display: { ...DEFAULT_DISPLAY_SETTINGS, ...imported.display },
        gameplay: { ...DEFAULT_GAMEPLAY_SETTINGS, ...imported.gameplay },
        accessibility: { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...imported.accessibility },
        controls: {
          ...DEFAULT_CONTROL_SETTINGS,
          ...imported.controls,
          keyBindings: imported.controls?.keyBindings || DEFAULT_KEY_BINDINGS,
        },
        locale: { ...DEFAULT_LOCALE_SETTINGS, ...imported.locale },
        privacy: { ...DEFAULT_PRIVACY_SETTINGS, ...imported.privacy },
        lastModified: new Date(),
      };

      this.buildKeyBindingsMap();
      this.saveSettings();
      this.applyAllSettings();
      this.emit('settings_imported');

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '설정 가져오기 실패',
      };
    }
  }

  // ============================================
  // 유틸리티
  // ============================================

  hasUnsavedChanges(): boolean {
    return this.isDirty;
  }

  getEffectiveTheme(): 'light' | 'dark' {
    const { theme } = this.settings.display;

    if (theme === 'light') return 'light';
    if (theme === 'dark') return 'dark';

    // auto or system
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    return 'light';
  }

  getEffectiveVolume(type: 'music' | 'sfx' | 'ambience' | 'voice'): number {
    const audio = this.settings.audio;

    if (audio.muted) return 0;

    const typeVolume = (() => {
      switch (type) {
        case 'music':
          return audio.musicMuted ? 0 : audio.musicVolume;
        case 'sfx':
          return audio.sfxMuted ? 0 : audio.sfxVolume;
        case 'ambience':
          return audio.ambienceMuted ? 0 : audio.ambienceVolume;
        case 'voice':
          return audio.voiceMuted ? 0 : audio.voiceVolume;
      }
    })();

    return audio.masterVolume * typeVolume;
  }
}

// 싱글톤 인스턴스
export const settingsManager = new SettingsManager();

export default settingsManager;
