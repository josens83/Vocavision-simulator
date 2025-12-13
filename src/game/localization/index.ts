/**
 * Chapter 13: Localization - Main Entry Point
 * 다국어 지원 시스템 메인 엔트리 포인트
 *
 * 이 모듈은 VocaVision 시뮬레이터의 다국어 지원을 제공합니다.
 *
 * 주요 기능:
 * 1. 다국어 번역 - 10개 언어 지원
 * 2. 복수형 처리 - 언어별 복수 규칙
 * 3. 변수 보간 - 동적 텍스트 삽입
 * 4. 숫자/날짜/통화 포맷팅 - 로케일별 형식
 * 5. RTL 지원 - 오른쪽에서 왼쪽 언어
 */

// ============================================
// Type Exports
// ============================================

export * from './types';

// ============================================
// Translations
// ============================================

export {
  translations,
  getTranslations,
  getAllTranslationKeys,
  findMissingTranslations,
  koKRTranslations,
  enUSTranslations,
} from './translations';

// ============================================
// Localization Manager
// ============================================

export {
  LocalizationManager,
  localizationManager,
  t,
  type LocalizationManagerListener,
} from './localizationManager';

// ============================================
// Localization UI Props
// ============================================

export interface LocaleSelectorProps {
  currentLocale: string;
  locales: Array<{
    code: string;
    name: string;
    nativeName: string;
    flag: string;
  }>;
  onChange: (locale: string) => void;
  showFlags?: boolean;
  showNativeNames?: boolean;
}

export interface TranslatedTextProps {
  i18nKey: string;
  values?: Record<string, any>;
  tag?: keyof JSX.IntrinsicElements;
  className?: string;
}

export interface FormattedNumberProps {
  value: number;
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  compact?: boolean;
}

export interface FormattedDateProps {
  value: Date | string | number;
  style?: 'short' | 'medium' | 'long' | 'full';
  relative?: boolean;
}

export interface PluralTextProps {
  count: number;
  one: string;
  other: string;
  zero?: string;
  few?: string;
  many?: string;
}

// ============================================
// 통합 Localization 시스템
// ============================================

import { LocalizationManager, localizationManager, t } from './localizationManager';
import {
  SupportedLocale,
  LocaleInfo,
  TranslationDictionary,
  InterpolationVariables,
  LOCALE_INFO,
} from './types';

/**
 * 통합 Localization 시스템 인터페이스
 */
export interface LocalizationSystem {
  // 관리자
  manager: LocalizationManager;

  // 번역 함수
  t: (key: string, variables?: InterpolationVariables) => string;

  // 로케일
  getLocale: () => SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  getLocaleInfo: (locale?: SupportedLocale) => LocaleInfo;
  getSupportedLocales: () => SupportedLocale[];

  // 포맷팅
  formatNumber: (value: number) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatPercent: (value: number) => string;
  formatDate: (date: Date, style?: 'short' | 'medium' | 'long' | 'full') => string;
  formatTime: (date: Date) => string;
  formatRelativeTime: (date: Date) => string;
  formatCompact: (value: number) => string;

  // 유틸리티
  hasTranslation: (key: string) => boolean;
  getAllKeys: () => string[];
}

/**
 * Localization 시스템 생성
 */
export function createLocalizationSystem(): LocalizationSystem {
  return {
    manager: localizationManager,

    t: (key, variables) => localizationManager.t(key, variables),

    getLocale: () => localizationManager.getCurrentLocale(),
    setLocale: (locale) => localizationManager.setLocale(locale),
    getLocaleInfo: (locale) => localizationManager.getLocaleInfo(locale),
    getSupportedLocales: () => localizationManager.getSupportedLocales(),

    formatNumber: (value) => localizationManager.formatNumber(value),
    formatCurrency: (value, currency) => localizationManager.formatCurrency(value, undefined, currency),
    formatPercent: (value) => localizationManager.formatPercent(value),
    formatDate: (date, style) => localizationManager.formatDate(date, style),
    formatTime: (date) => localizationManager.formatTime(date),
    formatRelativeTime: (date) => localizationManager.formatRelativeTime(date),
    formatCompact: (value) => localizationManager.formatCompactNumber(value),

    hasTranslation: (key) => localizationManager.hasTranslation(key),
    getAllKeys: () => localizationManager.getAllKeys(),
  };
}

// 싱글톤 인스턴스
export const localizationSystem = createLocalizationSystem();

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 로케일 코드에서 언어 코드 추출
 */
export function getLanguageCode(locale: SupportedLocale): string {
  return locale.split('-')[0];
}

/**
 * 로케일 코드에서 국가 코드 추출
 */
export function getCountryCode(locale: SupportedLocale): string {
  return locale.split('-')[1] || '';
}

/**
 * 언어 목록 가져오기 (UI용)
 */
export function getLanguageList(): Array<{
  code: SupportedLocale;
  name: string;
  nativeName: string;
  flag: string;
}> {
  return Object.values(LOCALE_INFO).map((info) => ({
    code: info.code,
    name: info.name,
    nativeName: info.nativeName,
    flag: info.flag,
  }));
}

/**
 * RTL 언어인지 확인
 */
export function isRTL(locale: SupportedLocale): boolean {
  return LOCALE_INFO[locale]?.direction === 'rtl';
}

/**
 * 번역 진행률 계산
 */
export function calculateTranslationProgress(
  locale: SupportedLocale,
  referenceLocale: SupportedLocale = 'ko-KR',
): number {
  const referenceKeys = localizationManager.getAllKeys(referenceLocale);
  const localeKeys = localizationManager.getAllKeys(locale);

  if (referenceKeys.length === 0) return 100;

  let translatedCount = 0;
  for (const key of referenceKeys) {
    if (localizationManager.hasTranslation(key, locale)) {
      translatedCount++;
    }
  }

  return Math.round((translatedCount / referenceKeys.length) * 100);
}

// ============================================
// React Hook 예시 (주석)
// ============================================

/**
 * useTranslation 훅 사용 예시:
 *
 * ```tsx
 * function MyComponent() {
 *   const { t, locale, setLocale, formatNumber } = useTranslation();
 *
 *   return (
 *     <div>
 *       <h1>{t('game.title')}</h1>
 *       <p>{t('game.day', { count: 5 })}</p>
 *       <p>{formatNumber(10000)}</p>
 *       <button onClick={() => setLocale('en-US')}>English</button>
 *     </div>
 *   );
 * }
 * ```
 */

/**
 * Trans 컴포넌트 사용 예시:
 *
 * ```tsx
 * <Trans i18nKey="welcome" values={{ name: 'User' }}>
 *   Welcome, <strong>{{name}}</strong>!
 * </Trans>
 * ```
 */

export default localizationSystem;
