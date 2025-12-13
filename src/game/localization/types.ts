/**
 * Chapter 13: Localization - Type Definitions
 * 다국어 지원 시스템 타입 정의
 */

// ============================================
// Locale Types
// ============================================

/**
 * 지원 언어 코드
 */
export type SupportedLocale =
  | 'ko-KR'  // 한국어
  | 'en-US'  // 영어 (미국)
  | 'en-GB'  // 영어 (영국)
  | 'ja-JP'  // 일본어
  | 'zh-CN'  // 중국어 (간체)
  | 'zh-TW'  // 중국어 (번체)
  | 'es-ES'  // 스페인어
  | 'de-DE'  // 독일어
  | 'fr-FR'  // 프랑스어
  | 'pt-BR'; // 포르투갈어 (브라질)

/**
 * 언어 방향
 */
export type TextDirection = 'ltr' | 'rtl';

/**
 * 로케일 정보
 */
export interface LocaleInfo {
  code: SupportedLocale;
  name: string;
  nativeName: string;
  direction: TextDirection;
  dateFormat: string;
  timeFormat: string;
  numberFormat: NumberFormatOptions;
  currencyCode: string;
  pluralRules: PluralCategory[];
  flag: string;  // emoji flag
}

/**
 * 숫자 형식 옵션
 */
export interface NumberFormatOptions {
  decimalSeparator: string;
  thousandsSeparator: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  percentSymbol: string;
}

/**
 * 복수형 카테고리
 */
export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';

// ============================================
// Translation Types
// ============================================

/**
 * 번역 키
 */
export type TranslationKey = string;

/**
 * 번역 값 (단순 문자열 또는 복수형)
 */
export type TranslationValue = string | PluralTranslation | NestedTranslation;

/**
 * 복수형 번역
 */
export interface PluralTranslation {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/**
 * 중첩 번역
 */
export interface NestedTranslation {
  [key: string]: TranslationValue;
}

/**
 * 번역 사전
 */
export interface TranslationDictionary {
  [key: string]: TranslationValue;
}

/**
 * 전체 번역 데이터
 */
export interface TranslationData {
  locale: SupportedLocale;
  version: string;
  lastUpdated: string;
  translations: TranslationDictionary;
}

// ============================================
// Interpolation Types
// ============================================

/**
 * 보간 변수
 */
export interface InterpolationVariables {
  [key: string]: string | number | boolean | Date;
}

/**
 * 보간 옵션
 */
export interface InterpolationOptions {
  prefix?: string;  // default: '{{'
  suffix?: string;  // default: '}}'
  escapeValue?: boolean;
  formatters?: InterpolationFormatters;
}

/**
 * 보간 포맷터
 */
export interface InterpolationFormatters {
  number?: (value: number, locale: SupportedLocale) => string;
  currency?: (value: number, locale: SupportedLocale, currency?: string) => string;
  date?: (value: Date, locale: SupportedLocale, format?: string) => string;
  time?: (value: Date, locale: SupportedLocale, format?: string) => string;
  percent?: (value: number, locale: SupportedLocale) => string;
  ordinal?: (value: number, locale: SupportedLocale) => string;
}

// ============================================
// Translation Categories
// ============================================

/**
 * 번역 카테고리
 */
export type TranslationCategory =
  | 'common'       // 공통 UI
  | 'game'         // 게임 관련
  | 'business'     // 비즈니스 용어
  | 'ui'           // UI 요소
  | 'tutorial'     // 튜토리얼
  | 'events'       // 이벤트
  | 'achievements' // 업적
  | 'endings'      // 엔딩
  | 'settings'     // 설정
  | 'errors';      // 에러 메시지

/**
 * 번역 항목 메타데이터
 */
export interface TranslationMeta {
  key: string;
  category: TranslationCategory;
  description?: string;
  context?: string;
  maxLength?: number;
  screenshots?: string[];
  variables?: string[];
  notes?: string;
}

// ============================================
// Localization State
// ============================================

/**
 * 로컬라이제이션 상태
 */
export interface LocalizationState {
  currentLocale: SupportedLocale;
  fallbackLocale: SupportedLocale;
  loadedLocales: SupportedLocale[];
  translations: Map<SupportedLocale, TranslationDictionary>;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// Localization Config
// ============================================

/**
 * 로컬라이제이션 설정
 */
export interface LocalizationConfig {
  defaultLocale: SupportedLocale;
  fallbackLocale: SupportedLocale;
  supportedLocales: SupportedLocale[];
  loadPath?: string;
  debug: boolean;
  interpolation: InterpolationOptions;
  detectBrowserLocale: boolean;
  cacheTranslations: boolean;
  missingKeyHandler?: (key: string, locale: SupportedLocale) => string;
}

export const DEFAULT_LOCALIZATION_CONFIG: LocalizationConfig = {
  defaultLocale: 'ko-KR',
  fallbackLocale: 'en-US',
  supportedLocales: ['ko-KR', 'en-US', 'ja-JP', 'zh-CN'],
  debug: false,
  interpolation: {
    prefix: '{{',
    suffix: '}}',
    escapeValue: true,
  },
  detectBrowserLocale: true,
  cacheTranslations: true,
};

// ============================================
// Locale Data
// ============================================

/**
 * 로케일 정보 데이터
 */
export const LOCALE_INFO: Record<SupportedLocale, LocaleInfo> = {
  'ko-KR': {
    code: 'ko-KR',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    dateFormat: 'YYYY년 MM월 DD일',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '₩',
      currencyPosition: 'before',
      percentSymbol: '%',
    },
    currencyCode: 'KRW',
    pluralRules: ['other'],
    flag: '🇰🇷',
  },
  'en-US': {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'h:mm A',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '$',
      currencyPosition: 'before',
      percentSymbol: '%',
    },
    currencyCode: 'USD',
    pluralRules: ['one', 'other'],
    flag: '🇺🇸',
  },
  'en-GB': {
    code: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '£',
      currencyPosition: 'before',
      percentSymbol: '%',
    },
    currencyCode: 'GBP',
    pluralRules: ['one', 'other'],
    flag: '🇬🇧',
  },
  'ja-JP': {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    dateFormat: 'YYYY年MM月DD日',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '¥',
      currencyPosition: 'before',
      percentSymbol: '%',
    },
    currencyCode: 'JPY',
    pluralRules: ['other'],
    flag: '🇯🇵',
  },
  'zh-CN': {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    direction: 'ltr',
    dateFormat: 'YYYY年MM月DD日',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: '¥',
      currencyPosition: 'before',
      percentSymbol: '%',
    },
    currencyCode: 'CNY',
    pluralRules: ['other'],
    flag: '🇨🇳',
  },
  'zh-TW': {
    code: 'zh-TW',
    name: 'Chinese (Traditional)',
    nativeName: '繁體中文',
    direction: 'ltr',
    dateFormat: 'YYYY年MM月DD日',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: '.',
      thousandsSeparator: ',',
      currencySymbol: 'NT$',
      currencyPosition: 'before',
      percentSymbol: '%',
    },
    currencyCode: 'TWD',
    pluralRules: ['other'],
    flag: '🇹🇼',
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
      currencySymbol: '€',
      currencyPosition: 'after',
      percentSymbol: '%',
    },
    currencyCode: 'EUR',
    pluralRules: ['one', 'other'],
    flag: '🇪🇸',
  },
  'de-DE': {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
      currencySymbol: '€',
      currencyPosition: 'after',
      percentSymbol: '%',
    },
    currencyCode: 'EUR',
    pluralRules: ['one', 'other'],
    flag: '🇩🇪',
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: ' ',
      currencySymbol: '€',
      currencyPosition: 'after',
      percentSymbol: '%',
    },
    currencyCode: 'EUR',
    pluralRules: ['one', 'other'],
    flag: '🇫🇷',
  },
  'pt-BR': {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    nativeName: 'Português',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    numberFormat: {
      decimalSeparator: ',',
      thousandsSeparator: '.',
      currencySymbol: 'R$',
      currencyPosition: 'before',
      percentSymbol: '%',
    },
    currencyCode: 'BRL',
    pluralRules: ['one', 'other'],
    flag: '🇧🇷',
  },
};

// ============================================
// Translation Status
// ============================================

/**
 * 번역 상태
 */
export interface TranslationStatus {
  locale: SupportedLocale;
  totalKeys: number;
  translatedKeys: number;
  missingKeys: string[];
  progress: number;  // 0-100
  lastUpdated: Date;
  reviewedKeys: number;
  approvedKeys: number;
}

/**
 * 번역 프로젝트 상태
 */
export interface TranslationProjectStatus {
  locales: TranslationStatus[];
  totalKeys: number;
  averageProgress: number;
  lastUpdated: Date;
}
