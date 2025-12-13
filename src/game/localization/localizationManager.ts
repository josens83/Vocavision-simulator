/**
 * Chapter 13: Localization - Localization Manager
 * 로컬라이제이션 관리자
 *
 * 이 모듈은 다국어 지원, 번역, 포맷팅을 관리합니다.
 */

import {
  SupportedLocale,
  LocaleInfo,
  TranslationDictionary,
  TranslationValue,
  PluralTranslation,
  InterpolationVariables,
  LocalizationConfig,
  LocalizationState,
  LOCALE_INFO,
  DEFAULT_LOCALIZATION_CONFIG,
  PluralCategory,
} from './types';

import { translations, getTranslations } from './translations';

// ============================================
// Localization Manager
// ============================================

export interface LocalizationManagerListener {
  onLocaleChange?: (locale: SupportedLocale, previousLocale: SupportedLocale) => void;
  onTranslationsLoaded?: (locale: SupportedLocale) => void;
  onMissingKey?: (key: string, locale: SupportedLocale) => void;
}

export class LocalizationManager {
  private config: LocalizationConfig;
  private state: LocalizationState;
  private listeners: Set<LocalizationManagerListener> = new Set();
  private pluralRulesCache: Map<SupportedLocale, Intl.PluralRules> = new Map();

  constructor(config: Partial<LocalizationConfig> = {}) {
    this.config = { ...DEFAULT_LOCALIZATION_CONFIG, ...config };
    this.state = this.createInitialState();
    this.initialize();
  }

  private createInitialState(): LocalizationState {
    return {
      currentLocale: this.config.defaultLocale,
      fallbackLocale: this.config.fallbackLocale,
      loadedLocales: [],
      translations: new Map(),
      isLoading: false,
      error: null,
    };
  }

  private initialize(): void {
    // 브라우저 언어 감지
    if (this.config.detectBrowserLocale && typeof navigator !== 'undefined') {
      const browserLocale = this.detectBrowserLocale();
      if (browserLocale && this.config.supportedLocales.includes(browserLocale)) {
        this.state.currentLocale = browserLocale;
      }
    }

    // 로컬 스토리지에서 저장된 언어 로드
    const savedLocale = this.loadSavedLocale();
    if (savedLocale && this.config.supportedLocales.includes(savedLocale)) {
      this.state.currentLocale = savedLocale;
    }

    // 기본 번역 로드
    this.loadLocale(this.state.currentLocale);
    this.loadLocale(this.state.fallbackLocale);
  }

  // ============================================
  // Listener Management
  // ============================================

  addListener(listener: LocalizationManagerListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners<K extends keyof LocalizationManagerListener>(
    event: K,
    ...args: Parameters<NonNullable<LocalizationManagerListener[K]>>
  ): void {
    this.listeners.forEach((listener) => {
      const handler = listener[event];
      if (handler) {
        (handler as Function)(...args);
      }
    });
  }

  // ============================================
  // Locale Management
  // ============================================

  /**
   * 현재 로케일 가져오기
   */
  getCurrentLocale(): SupportedLocale {
    return this.state.currentLocale;
  }

  /**
   * 로케일 정보 가져오기
   */
  getLocaleInfo(locale?: SupportedLocale): LocaleInfo {
    return LOCALE_INFO[locale || this.state.currentLocale];
  }

  /**
   * 지원 로케일 목록
   */
  getSupportedLocales(): SupportedLocale[] {
    return [...this.config.supportedLocales];
  }

  /**
   * 로케일 변경
   */
  setLocale(locale: SupportedLocale): void {
    if (!this.config.supportedLocales.includes(locale)) {
      console.warn(`[i18n] Locale ${locale} is not supported`);
      return;
    }

    if (locale === this.state.currentLocale) return;

    const previousLocale = this.state.currentLocale;
    this.state.currentLocale = locale;

    // 번역 로드
    this.loadLocale(locale);

    // 로컬 스토리지에 저장
    this.saveLocale(locale);

    // 문서 방향 설정
    this.updateDocumentDirection(locale);

    // 알림
    this.notifyListeners('onLocaleChange', locale, previousLocale);

    if (this.config.debug) {
      console.log(`[i18n] Locale changed: ${previousLocale} -> ${locale}`);
    }
  }

  private loadLocale(locale: SupportedLocale): void {
    if (this.state.loadedLocales.includes(locale)) return;

    const dict = getTranslations(locale);
    this.state.translations.set(locale, dict);
    this.state.loadedLocales.push(locale);

    this.notifyListeners('onTranslationsLoaded', locale);
  }

  private detectBrowserLocale(): SupportedLocale | null {
    const languages = navigator.languages || [navigator.language];

    for (const lang of languages) {
      // 정확한 매칭
      if (this.config.supportedLocales.includes(lang as SupportedLocale)) {
        return lang as SupportedLocale;
      }

      // 언어 코드만 매칭 (ko -> ko-KR)
      const langCode = lang.split('-')[0];
      const match = this.config.supportedLocales.find((l) => l.startsWith(langCode));
      if (match) {
        return match;
      }
    }

    return null;
  }

  private loadSavedLocale(): SupportedLocale | null {
    if (typeof localStorage === 'undefined') return null;

    try {
      return localStorage.getItem('vocavision_locale') as SupportedLocale | null;
    } catch {
      return null;
    }
  }

  private saveLocale(locale: SupportedLocale): void {
    if (typeof localStorage === 'undefined') return;

    try {
      localStorage.setItem('vocavision_locale', locale);
    } catch {
      // ignore
    }
  }

  private updateDocumentDirection(locale: SupportedLocale): void {
    if (typeof document === 'undefined') return;

    const info = LOCALE_INFO[locale];
    document.documentElement.dir = info.direction;
    document.documentElement.lang = locale;
  }

  // ============================================
  // Translation
  // ============================================

  /**
   * 번역 가져오기
   */
  t(key: string, variables?: InterpolationVariables, locale?: SupportedLocale): string {
    const targetLocale = locale || this.state.currentLocale;
    const dict = this.state.translations.get(targetLocale);

    let value = this.getNestedValue(dict, key);

    // 폴백 처리
    if (value === undefined && targetLocale !== this.state.fallbackLocale) {
      const fallbackDict = this.state.translations.get(this.state.fallbackLocale);
      value = this.getNestedValue(fallbackDict, key);
    }

    // 값이 없으면 처리
    if (value === undefined) {
      this.handleMissingKey(key, targetLocale);
      return this.config.missingKeyHandler
        ? this.config.missingKeyHandler(key, targetLocale)
        : key;
    }

    // 복수형 처리
    if (typeof value === 'object' && 'other' in value) {
      const count = variables?.count;
      if (typeof count === 'number') {
        value = this.selectPluralForm(value as PluralTranslation, count, targetLocale);
      } else {
        value = (value as PluralTranslation).other;
      }
    }

    // 문자열로 변환
    if (typeof value !== 'string') {
      return key;
    }

    // 보간 처리
    if (variables) {
      value = this.interpolate(value, variables, targetLocale);
    }

    return value;
  }

  /**
   * 복수형 선택
   */
  private selectPluralForm(
    translation: PluralTranslation,
    count: number,
    locale: SupportedLocale,
  ): string {
    const category = this.getPluralCategory(count, locale);

    // 카테고리별 선택
    if (category === 'zero' && translation.zero) return translation.zero;
    if (category === 'one' && translation.one) return translation.one;
    if (category === 'two' && translation.two) return translation.two;
    if (category === 'few' && translation.few) return translation.few;
    if (category === 'many' && translation.many) return translation.many;

    return translation.other;
  }

  private getPluralCategory(count: number, locale: SupportedLocale): PluralCategory {
    let rules = this.pluralRulesCache.get(locale);

    if (!rules) {
      try {
        rules = new Intl.PluralRules(locale);
        this.pluralRulesCache.set(locale, rules);
      } catch {
        return 'other';
      }
    }

    return rules.select(count) as PluralCategory;
  }

  /**
   * 보간 처리
   */
  private interpolate(
    text: string,
    variables: InterpolationVariables,
    locale: SupportedLocale,
  ): string {
    const { prefix = '{{', suffix = '}}' } = this.config.interpolation;
    const regex = new RegExp(`${this.escapeRegex(prefix)}([^}]+)${this.escapeRegex(suffix)}`, 'g');

    return text.replace(regex, (match, key) => {
      const trimmedKey = key.trim();

      // 포맷터 체크 (예: {{count, number}})
      const [varName, formatter] = trimmedKey.split(',').map((s: string) => s.trim());

      const value = variables[varName];
      if (value === undefined) return match;

      // 포맷터 적용
      if (formatter) {
        return this.applyFormatter(value, formatter, locale);
      }

      // Date 처리
      if (value instanceof Date) {
        return this.formatDate(value, 'short', locale);
      }

      return String(value);
    });
  }

  private applyFormatter(
    value: any,
    formatter: string,
    locale: SupportedLocale,
  ): string {
    switch (formatter) {
      case 'number':
        return this.formatNumber(Number(value), locale);
      case 'currency':
        return this.formatCurrency(Number(value), locale);
      case 'percent':
        return this.formatPercent(Number(value), locale);
      case 'date':
        return this.formatDate(value instanceof Date ? value : new Date(value), 'short', locale);
      case 'time':
        return this.formatTime(value instanceof Date ? value : new Date(value), locale);
      case 'ordinal':
        return this.formatOrdinal(Number(value), locale);
      default:
        return String(value);
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private getNestedValue(obj: TranslationDictionary | undefined, path: string): TranslationValue | undefined {
    if (!obj) return undefined;

    // 직접 키 접근
    if (path in obj) {
      return obj[path];
    }

    // 중첩 키 접근
    const keys = path.split('.');
    let current: any = obj;

    for (const key of keys) {
      if (current === undefined || current === null) return undefined;
      current = current[key];
    }

    return current;
  }

  private handleMissingKey(key: string, locale: SupportedLocale): void {
    this.notifyListeners('onMissingKey', key, locale);

    if (this.config.debug) {
      console.warn(`[i18n] Missing translation: ${key} (${locale})`);
    }
  }

  // ============================================
  // Formatting
  // ============================================

  /**
   * 숫자 포맷팅
   */
  formatNumber(value: number, locale?: SupportedLocale): string {
    const targetLocale = locale || this.state.currentLocale;

    try {
      return new Intl.NumberFormat(targetLocale).format(value);
    } catch {
      return value.toString();
    }
  }

  /**
   * 통화 포맷팅
   */
  formatCurrency(value: number, locale?: SupportedLocale, currency?: string): string {
    const targetLocale = locale || this.state.currentLocale;
    const info = LOCALE_INFO[targetLocale];
    const currencyCode = currency || info.currencyCode;

    try {
      return new Intl.NumberFormat(targetLocale, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: currencyCode === 'KRW' || currencyCode === 'JPY' ? 0 : 2,
      }).format(value);
    } catch {
      const symbol = info.numberFormat.currencySymbol;
      const formatted = this.formatNumber(value, targetLocale);
      return info.numberFormat.currencyPosition === 'before'
        ? `${symbol}${formatted}`
        : `${formatted}${symbol}`;
    }
  }

  /**
   * 퍼센트 포맷팅
   */
  formatPercent(value: number, locale?: SupportedLocale): string {
    const targetLocale = locale || this.state.currentLocale;

    try {
      return new Intl.NumberFormat(targetLocale, {
        style: 'percent',
        maximumFractionDigits: 1,
      }).format(value);
    } catch {
      return `${(value * 100).toFixed(1)}%`;
    }
  }

  /**
   * 날짜 포맷팅
   */
  formatDate(
    date: Date,
    style: 'short' | 'medium' | 'long' | 'full' = 'medium',
    locale?: SupportedLocale,
  ): string {
    const targetLocale = locale || this.state.currentLocale;

    const options: Intl.DateTimeFormatOptions = {
      short: { year: 'numeric', month: 'numeric', day: 'numeric' },
      medium: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric' },
      full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    }[style];

    try {
      return new Intl.DateTimeFormat(targetLocale, options).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  }

  /**
   * 시간 포맷팅
   */
  formatTime(date: Date, locale?: SupportedLocale): string {
    const targetLocale = locale || this.state.currentLocale;

    try {
      return new Intl.DateTimeFormat(targetLocale, {
        hour: 'numeric',
        minute: 'numeric',
      }).format(date);
    } catch {
      return date.toLocaleTimeString();
    }
  }

  /**
   * 상대 시간 포맷팅
   */
  formatRelativeTime(date: Date, locale?: SupportedLocale): string {
    const targetLocale = locale || this.state.currentLocale;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    try {
      const rtf = new Intl.RelativeTimeFormat(targetLocale, { numeric: 'auto' });

      if (Math.abs(days) > 0) return rtf.format(-days, 'day');
      if (Math.abs(hours) > 0) return rtf.format(-hours, 'hour');
      if (Math.abs(minutes) > 0) return rtf.format(-minutes, 'minute');
      return rtf.format(-seconds, 'second');
    } catch {
      // 폴백
      if (days > 0) return this.t('time.ago', { time: this.t('time.days', { count: days }) });
      if (hours > 0) return this.t('time.ago', { time: this.t('time.hours', { count: hours }) });
      if (minutes > 0) return this.t('time.ago', { time: this.t('time.minutes', { count: minutes }) });
      return this.t('time.just_now');
    }
  }

  /**
   * 서수 포맷팅
   */
  formatOrdinal(value: number, locale?: SupportedLocale): string {
    const targetLocale = locale || this.state.currentLocale;

    // 영어 서수
    if (targetLocale.startsWith('en')) {
      const suffixes = ['th', 'st', 'nd', 'rd'];
      const v = value % 100;
      return value + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }

    // 한국어는 그냥 숫자
    if (targetLocale.startsWith('ko')) {
      return `${value}번째`;
    }

    // 일본어
    if (targetLocale.startsWith('ja')) {
      return `${value}番目`;
    }

    return value.toString();
  }

  /**
   * 컴팩트 숫자 포맷팅 (1K, 1M 등)
   */
  formatCompactNumber(value: number, locale?: SupportedLocale): string {
    const targetLocale = locale || this.state.currentLocale;

    try {
      return new Intl.NumberFormat(targetLocale, {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value);
    } catch {
      // 폴백
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)}${this.t('number.billion')}`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}${this.t('number.million')}`;
      }
      if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}${this.t('number.thousand')}`;
      }
      return value.toString();
    }
  }

  // ============================================
  // Utility
  // ============================================

  /**
   * 번역 존재 확인
   */
  hasTranslation(key: string, locale?: SupportedLocale): boolean {
    const targetLocale = locale || this.state.currentLocale;
    const dict = this.state.translations.get(targetLocale);
    return this.getNestedValue(dict, key) !== undefined;
  }

  /**
   * 모든 번역 키 가져오기
   */
  getAllKeys(locale?: SupportedLocale): string[] {
    const targetLocale = locale || this.state.currentLocale;
    const dict = this.state.translations.get(targetLocale);
    return dict ? Object.keys(dict) : [];
  }

  /**
   * 설정 가져오기
   */
  getConfig(): LocalizationConfig {
    return { ...this.config };
  }

  /**
   * 설정 업데이트
   */
  setConfig(config: Partial<LocalizationConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

// 싱글톤 인스턴스
export const localizationManager = new LocalizationManager();

// 편의 함수
export const t = (key: string, variables?: InterpolationVariables): string => {
  return localizationManager.t(key, variables);
};
