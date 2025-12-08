/**
 * Chapter 4: UI/UX Excellence - Design System Tokens
 * 디자인 시스템 기본 토큰 정의
 */

// ============================================
// 컬러 시스템
// ============================================

export const colors = {
  // 기본 팔레트
  primary: {
    main: '#6366F1',
    light: '#818CF8',
    dark: '#4F46E5',
    contrast: '#FFFFFF',
  },

  // 의미 기반 색상
  semantic: {
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    danger: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
      bg: 'rgba(239, 68, 68, 0.1)',
    },
    info: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
  },

  // 게임 상태 색상
  gameState: {
    money: {
      positive: '#10B981',
      negative: '#EF4444',
      neutral: '#6B7280',
    },
    energy: {
      high: '#10B981',
      medium: '#F59E0B',
      low: '#EF4444',
      critical: '#7F1D1D',
    },
    stress: {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#7F1D1D',
    },
    reputation: {
      excellent: '#8B5CF6',
      good: '#10B981',
      neutral: '#6B7280',
      poor: '#F59E0B',
      terrible: '#EF4444',
    },
    server: {
      healthy: '#10B981',
      warning: '#F59E0B',
      critical: '#EF4444',
      down: '#7F1D1D',
    },
  },

  // 배경 시스템
  background: {
    primary: '#0F0F1A',
    secondary: '#1A1A2E',
    tertiary: '#252540',
    card: '#2D2D44',
    elevated: '#383850',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  // 텍스트 계층
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    tertiary: '#64748B',
    disabled: '#475569',
    inverse: '#0F172A',
  },

  // 보더 색상
  border: {
    default: '#3F3F5A',
    light: '#4A4A66',
    focus: '#6366F1',
  },
};

// ============================================
// 타이포그래피
// ============================================

export const typography = {
  fontFamily: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    korean: '"Pretendard", "Noto Sans KR", sans-serif',
  },

  // 모듈러 스케일 (1.25 ratio)
  fontSize: {
    xs: '0.64rem',
    sm: '0.8rem',
    base: '1rem',
    lg: '1.25rem',
    xl: '1.563rem',
    '2xl': '1.953rem',
    '3xl': '2.441rem',
    '4xl': '3.052rem',
    '5xl': '3.815rem',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
};

// ============================================
// 간격 시스템
// ============================================

export const spacing = {
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
};

// ============================================
// 둥근 모서리
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  full: '9999px',
};

// ============================================
// 그림자
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.6)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  glow: {
    success: '0 0 20px rgba(16, 185, 129, 0.4)',
    warning: '0 0 20px rgba(245, 158, 11, 0.4)',
    danger: '0 0 20px rgba(239, 68, 68, 0.4)',
    primary: '0 0 20px rgba(99, 102, 241, 0.4)',
    info: '0 0 20px rgba(59, 130, 246, 0.4)',
  },
};

// ============================================
// 애니메이션 이징
// ============================================

export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
};

// ============================================
// 애니메이션 지속 시간
// ============================================

export const durations = {
  instant: '0ms',
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
  slowest: '1000ms',
};

// ============================================
// Z-index 계층
// ============================================

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  overlay: 900,
  max: 9999,
};

// ============================================
// 브레이크포인트
// ============================================

export const breakpoints = {
  mobile: '639px',
  tablet: '1023px',
  desktop: '1279px',
  wide: '1535px',
};

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: 640px) and (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: 1024px) and (max-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: 1280px)`,
};

// ============================================
// 유틸리티 함수
// ============================================

export function getEnergyColor(value: number): string {
  if (value > 70) return colors.gameState.energy.high;
  if (value > 30) return colors.gameState.energy.medium;
  if (value > 10) return colors.gameState.energy.low;
  return colors.gameState.energy.critical;
}

export function getStressColor(value: number): string {
  if (value < 30) return colors.gameState.stress.low;
  if (value < 60) return colors.gameState.stress.medium;
  if (value < 80) return colors.gameState.stress.high;
  return colors.gameState.stress.critical;
}

export function getServerColor(value: number): string {
  if (value > 70) return colors.gameState.server.healthy;
  if (value > 40) return colors.gameState.server.warning;
  if (value > 10) return colors.gameState.server.critical;
  return colors.gameState.server.down;
}

export function getReputationColor(value: number): string {
  if (value > 80) return colors.gameState.reputation.excellent;
  if (value > 60) return colors.gameState.reputation.good;
  if (value > 40) return colors.gameState.reputation.neutral;
  if (value > 20) return colors.gameState.reputation.poor;
  return colors.gameState.reputation.terrible;
}

export function getMoneyColor(change: number): string {
  if (change > 0) return colors.gameState.money.positive;
  if (change < 0) return colors.gameState.money.negative;
  return colors.gameState.money.neutral;
}

// 통화 포맷
export function formatCurrency(value: number, format: 'full' | 'short' | 'compact' = 'full'): string {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  switch (format) {
    case 'compact':
      if (absValue >= 100000000) return `${sign}${(absValue / 100000000).toFixed(1)}억`;
      if (absValue >= 10000) return `${sign}${(absValue / 10000).toFixed(1)}만`;
      return `${sign}${absValue.toLocaleString()}`;
    case 'short':
      return `${sign}₩${absValue.toLocaleString()}`;
    default:
      return `${sign}${absValue.toLocaleString()}원`;
  }
}

// 숫자 포맷
export function formatNumber(value: number, compact = false): string {
  if (compact) {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

// 퍼센트 포맷
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export default {
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
};
