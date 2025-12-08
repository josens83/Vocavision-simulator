/**
 * Chapter 4: UI/UX Excellence - Main UI Index
 * 모든 UI 시스템 통합 익스포트
 */

// Design System Tokens
export * from './designTokens';
export {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  easings,
  durations,
  zIndex,
  breakpoints,
  mediaQueries,
  getEnergyColor,
  getStressColor,
  getServerColor,
  getReputationColor,
  getMoneyColor,
  formatCurrency,
  formatNumber,
  formatPercent,
} from './designTokens';

// Components
export * from './components';

// Animations
export * from './animations';
export {
  easingFunctions,
  springPresets,
  animate,
  useAnimatedNumber,
  useSpring,
  useFade,
  useSlide,
  useStagger,
  usePulse,
  useShake,
  useCountdown,
  keyframes,
  injectKeyframes,
} from './animations';
export type {
  AnimateOptions,
  UseAnimatedNumberOptions,
  SpringConfig,
  UseFadeOptions,
  SlideDirection,
  UseSlideOptions,
  UseStaggerOptions,
  UsePulseOptions,
  UseShakeOptions,
  EasingFunction,
} from './animations';

// Accessibility
export * from './accessibility';
export {
  colorBlindPalettes,
  getAccessibleColor,
  defaultAccessibilitySettings,
  useKeyboardNavigation,
  useFocusTrap,
  useScreenReaderAnnouncement,
  useReducedMotion,
  useHighContrast,
  useKeyboardShortcuts,
  useFocusVisible,
  ariaLabels,
  accessibilityStyles,
  textSizeMultipliers,
  getScaledFontSize,
  accessibilityChecklist,
} from './accessibility';
export type {
  ColorBlindMode,
  AccessibilitySettings,
  AccessibilityContextValue,
  KeyboardNavigationOptions,
  ShortcutDefinition,
} from './accessibility';

// UI Statistics
export const UI_STATISTICS = {
  designTokens: {
    colors: 50,
    typography: 5,
    spacing: 14,
    shadows: 8,
    easings: 7,
    zIndex: 11,
  },
  components: {
    core: 6, // StatBar, MetricCard, ActionButton, MoneyDisplay, RunwayDisplay, MRRDisplay
    modal: 1, // EventModal
    toast: 5, // ToastProvider, ToastContainer, useToast, AchievementNotification, MilestoneNotification
    widgets: 8, // WidgetContainer, Finance, Activity, Calendar, UserStats, ServerStats, PlayerStats, QuickActions
  },
  animations: {
    easingFunctions: 15,
    hooks: 8,
    keyframes: 13,
  },
  accessibility: {
    colorBlindModes: 5,
    hooks: 7,
    utilities: 10,
  },
  totalComponents: 20,
};

export default {
  UI_STATISTICS,
};
