/**
 * Chapter 4: UI/UX Excellence - Accessibility System
 * 접근성 기능 및 유틸리티
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ============================================
// 색맹 모드 타입 정의
// ============================================

export type ColorBlindMode =
  | 'none'
  | 'protanopia'     // 적색맹
  | 'deuteranopia'   // 녹색맹
  | 'tritanopia'     // 청색맹
  | 'achromatopsia'; // 전색맹

// ============================================
// 색맹 모드별 색상 변환
// ============================================

// 색맹 모드별 색상 매핑
export const colorBlindPalettes: Record<ColorBlindMode, Record<string, string>> = {
  none: {},
  protanopia: {
    // 적색맹: 빨강을 노랑/주황으로 대체
    '#EF4444': '#F59E0B', // danger -> warning 계열
    '#DC2626': '#D97706',
    '#F87171': '#FBBF24',
    '#10B981': '#3B82F6', // success -> blue 계열
    '#059669': '#2563EB',
    '#34D399': '#60A5FA',
  },
  deuteranopia: {
    // 녹색맹: 초록을 파랑으로 대체
    '#10B981': '#3B82F6',
    '#059669': '#2563EB',
    '#34D399': '#60A5FA',
    '#EF4444': '#F59E0B', // 빨강은 주황으로
    '#DC2626': '#D97706',
  },
  tritanopia: {
    // 청색맹: 파랑을 녹색으로, 노랑을 빨강으로
    '#3B82F6': '#10B981',
    '#2563EB': '#059669',
    '#60A5FA': '#34D399',
    '#F59E0B': '#EF4444',
    '#FBBF24': '#F87171',
  },
  achromatopsia: {
    // 전색맹: 명도 기반 회색조
    '#EF4444': '#4B5563', // 어두운 회색
    '#DC2626': '#374151',
    '#F87171': '#6B7280',
    '#10B981': '#9CA3AF', // 밝은 회색
    '#059669': '#6B7280',
    '#34D399': '#D1D5DB',
    '#F59E0B': '#9CA3AF',
    '#FBBF24': '#D1D5DB',
    '#3B82F6': '#6B7280',
    '#2563EB': '#4B5563',
    '#6366F1': '#4B5563',
  },
};

// 색상 변환 함수
export function getAccessibleColor(color: string, mode: ColorBlindMode): string {
  if (mode === 'none') return color;
  return colorBlindPalettes[mode][color.toUpperCase()] ||
         colorBlindPalettes[mode][color.toLowerCase()] ||
         color;
}

// ============================================
// 접근성 설정 타입
// ============================================

export interface AccessibilitySettings {
  colorBlindMode: ColorBlindMode;
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReaderMode: boolean;
  focusIndicators: boolean;
  hapticFeedback: boolean;
  audioDescriptions: boolean;
  autoPlayAnimations: boolean;
  textSpacing: 'normal' | 'wide' | 'wider';
  cursorSize: 'normal' | 'large' | 'xlarge';
}

export const defaultAccessibilitySettings: AccessibilitySettings = {
  colorBlindMode: 'none',
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  screenReaderMode: false,
  focusIndicators: true,
  hapticFeedback: true,
  audioDescriptions: false,
  autoPlayAnimations: true,
  textSpacing: 'normal',
  cursorSize: 'normal',
};

// ============================================
// 접근성 Context
// ============================================

export interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  resetSettings: () => void;
  getAccessibleColor: (color: string) => string;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
}

// ============================================
// 키보드 네비게이션 훅
// ============================================

export interface KeyboardNavigationOptions {
  containerRef: React.RefObject<HTMLElement>;
  itemSelector?: string;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  onSelect?: (element: HTMLElement, index: number) => void;
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions) {
  const {
    containerRef,
    itemSelector = '[role="menuitem"], [role="option"], button, a',
    orientation = 'vertical',
    loop = true,
    onSelect,
  } = options;

  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getItems = () =>
      Array.from(container.querySelectorAll<HTMLElement>(itemSelector)).filter(
        (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
      );

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = getItems();
      if (items.length === 0) return;

      let nextIndex = focusedIndex;
      const currentIndex = Math.max(0, focusedIndex);

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            nextIndex = loop
              ? (currentIndex + 1) % items.length
              : Math.min(currentIndex + 1, items.length - 1);
          }
          break;

        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            nextIndex = loop
              ? (currentIndex - 1 + items.length) % items.length
              : Math.max(currentIndex - 1, 0);
          }
          break;

        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            nextIndex = loop
              ? (currentIndex + 1) % items.length
              : Math.min(currentIndex + 1, items.length - 1);
          }
          break;

        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            nextIndex = loop
              ? (currentIndex - 1 + items.length) % items.length
              : Math.max(currentIndex - 1, 0);
          }
          break;

        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;

        case 'End':
          e.preventDefault();
          nextIndex = items.length - 1;
          break;

        case 'Enter':
        case ' ':
          if (focusedIndex >= 0 && focusedIndex < items.length) {
            e.preventDefault();
            onSelect?.(items[focusedIndex], focusedIndex);
          }
          break;

        default:
          return;
      }

      if (nextIndex !== focusedIndex && items[nextIndex]) {
        setFocusedIndex(nextIndex);
        items[nextIndex].focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, itemSelector, orientation, loop, focusedIndex, onSelect]);

  return {
    focusedIndex,
    setFocusedIndex,
    resetFocus: () => setFocusedIndex(-1),
  };
}

// ============================================
// 포커스 트랩 훅
// ============================================

export function useFocusTrap(
  containerRef: React.RefObject<HTMLElement>,
  active: boolean = true
) {
  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const getFocusableElements = () =>
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusableElements();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // Focus first element on mount
    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, active]);
}

// ============================================
// 스크린 리더 알림 훅
// ============================================

export function useScreenReaderAnnouncement() {
  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (typeof document === 'undefined') return;

      // 기존 알림 요소 제거
      const existingAnnouncement = document.getElementById('sr-announcement');
      existingAnnouncement?.remove();

      // 새 알림 요소 생성
      const announcement = document.createElement('div');
      announcement.id = 'sr-announcement';
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      `;

      document.body.appendChild(announcement);

      // 약간의 지연 후 내용 설정 (스크린 리더가 인식하도록)
      requestAnimationFrame(() => {
        announcement.textContent = message;
      });

      // 알림 후 제거
      setTimeout(() => announcement.remove(), 1000);
    },
    []
  );

  return announce;
}

// ============================================
// 모션 환경설정 감지 훅
// ============================================

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// ============================================
// 고대비 모드 감지 훅
// ============================================

export function useHighContrast(): boolean {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-contrast: more)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
}

// ============================================
// 키보드 단축키 훅
// ============================================

export interface ShortcutDefinition {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  action: () => void;
  description?: string;
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutDefinition[],
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 입력 필드에서는 무시
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrl === (e.ctrlKey || e.metaKey);
        const shiftMatch = !!shortcut.shift === e.shiftKey;
        const altMatch = !!shortcut.alt === e.altKey;

        if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
          e.preventDefault();
          shortcut.action();
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

// ============================================
// 포커스 가시성 훅
// ============================================

export function useFocusVisible(): boolean {
  const [hadKeyboardEvent, setHadKeyboardEvent] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onKeyDown = () => setHadKeyboardEvent(true);
    const onPointerDown = () => setHadKeyboardEvent(false);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return hadKeyboardEvent;
}

// ============================================
// ARIA 레이블 생성 유틸리티
// ============================================

export const ariaLabels = {
  // 게임 상태
  energy: (value: number, max: number) =>
    `에너지 ${value} / ${max}. ${value < 20 ? '에너지가 매우 낮습니다.' : ''}`,

  stress: (value: number) =>
    `스트레스 ${value}%. ${value > 80 ? '스트레스가 매우 높습니다. 휴식이 필요합니다.' : ''}`,

  health: (value: number) =>
    `건강 ${value}%. ${value < 30 ? '건강이 매우 낮습니다. 주의가 필요합니다.' : ''}`,

  money: (value: number) =>
    `보유 자금 ${value.toLocaleString()}원`,

  runway: (months: number) =>
    `런웨이 ${months}개월. ${months <= 3 ? '주의: 자금이 곧 고갈됩니다.' : ''}`,

  serverHealth: (value: number) =>
    `서버 상태 ${value}%. ${value < 50 ? '서버 상태가 좋지 않습니다.' : ''}`,

  // 버튼/액션
  actionButton: (label: string, energyCost?: number, disabled?: boolean) => {
    let description = label;
    if (energyCost) description += `, 에너지 ${energyCost} 필요`;
    if (disabled) description += ' (비활성화됨)';
    return description;
  },

  // 이벤트
  eventChoice: (text: string, index: number, canAfford: boolean) =>
    `선택지 ${index + 1}: ${text}. ${canAfford ? '선택 가능' : '자원이 부족합니다'}`,

  // 네비게이션
  menuItem: (label: string, selected: boolean) =>
    `${label}${selected ? ', 선택됨' : ''}`,

  // 알림
  notification: (type: string, title: string) =>
    `${type} 알림: ${title}`,
};

// ============================================
// 접근성 스타일 유틸리티
// ============================================

export const accessibilityStyles = {
  // 시각적으로 숨기지만 스크린 리더는 읽음
  visuallyHidden: {
    position: 'absolute' as const,
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    border: 0,
  },

  // 포커스 표시 스타일
  focusRing: {
    outline: '2px solid #6366F1',
    outlineOffset: '2px',
  },

  // 고대비 모드 포커스
  highContrastFocusRing: {
    outline: '3px solid #FFFFFF',
    outlineOffset: '3px',
  },

  // 스킵 링크 스타일
  skipLink: {
    position: 'absolute' as const,
    top: '-40px',
    left: 0,
    background: '#000000',
    color: '#FFFFFF',
    padding: '8px',
    zIndex: 10000,
    transition: 'top 0.3s',
    '&:focus': {
      top: 0,
    },
  },
};

// ============================================
// 텍스트 크기 조정 유틸리티
// ============================================

export const textSizeMultipliers = {
  normal: 1,
  large: 1.25,
  xlarge: 1.5,
};

export function getScaledFontSize(
  baseSizeRem: number,
  largeText: boolean
): string {
  const multiplier = largeText ? textSizeMultipliers.large : textSizeMultipliers.normal;
  return `${baseSizeRem * multiplier}rem`;
}

// ============================================
// 접근성 체크리스트 (개발용)
// ============================================

export const accessibilityChecklist = {
  interactive: [
    'focusable: 모든 인터랙티브 요소는 키보드로 접근 가능해야 함',
    'labels: 모든 폼 요소는 레이블이 있어야 함',
    'feedback: 액션 결과는 시각적/청각적 피드백 제공',
    'contrast: 텍스트와 배경의 대비율 4.5:1 이상',
  ],
  navigation: [
    'skipLinks: 메인 콘텐츠로 바로가기 링크 제공',
    'landmarks: 적절한 ARIA 랜드마크 사용',
    'headings: 논리적인 제목 구조',
    'focusOrder: 논리적인 포커스 순서',
  ],
  content: [
    'altText: 모든 이미지에 대체 텍스트',
    'language: 문서 언어 지정',
    'timing: 시간 제한 있는 콘텐츠에 조절 옵션',
    'errors: 명확한 오류 메시지와 복구 방법',
  ],
};

export default {
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
};
