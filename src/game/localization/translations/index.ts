/**
 * Chapter 13: Localization - Translations Index
 * 번역 데이터 인덱스
 */

import { SupportedLocale, TranslationDictionary } from '../types';
import { koKRTranslations } from './ko-KR';
import { enUSTranslations } from './en-US';

/**
 * 모든 번역 데이터
 */
export const translations: Record<SupportedLocale, TranslationDictionary> = {
  'ko-KR': koKRTranslations,
  'en-US': enUSTranslations,
  // 나머지 언어는 영어를 폴백으로 사용
  'en-GB': enUSTranslations,
  'ja-JP': koKRTranslations, // TODO: 일본어 번역 추가
  'zh-CN': koKRTranslations, // TODO: 중국어 간체 번역 추가
  'zh-TW': koKRTranslations, // TODO: 중국어 번체 번역 추가
  'es-ES': enUSTranslations, // TODO: 스페인어 번역 추가
  'de-DE': enUSTranslations, // TODO: 독일어 번역 추가
  'fr-FR': enUSTranslations, // TODO: 프랑스어 번역 추가
  'pt-BR': enUSTranslations, // TODO: 포르투갈어 번역 추가
};

/**
 * 번역 데이터 가져오기
 */
export function getTranslations(locale: SupportedLocale): TranslationDictionary {
  return translations[locale] || translations['en-US'];
}

/**
 * 모든 번역 키 가져오기
 */
export function getAllTranslationKeys(): string[] {
  const keys = new Set<string>();
  Object.values(translations).forEach((dict) => {
    Object.keys(dict).forEach((key) => keys.add(key));
  });
  return Array.from(keys).sort();
}

/**
 * 번역 누락 키 찾기
 */
export function findMissingTranslations(
  locale: SupportedLocale,
  referenceLocale: SupportedLocale = 'ko-KR',
): string[] {
  const referenceKeys = Object.keys(translations[referenceLocale] || {});
  const localeKeys = Object.keys(translations[locale] || {});
  return referenceKeys.filter((key) => !localeKeys.includes(key));
}

export { koKRTranslations } from './ko-KR';
export { enUSTranslations } from './en-US';
