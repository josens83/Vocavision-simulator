/**
 * Chapter 3: Content & Narrative - Events Index
 * 모든 이벤트 통합 및 익스포트
 */

import { TECHNICAL_EVENTS } from './technicalEvents';
import { BUSINESS_EVENTS } from './businessEvents';
import { USER_EVENTS, PERSONAL_EVENTS } from './userPersonalEvents';
import type { ProbabilisticEvent, EventCategory, EventProbability } from '../../systems/eventEngine';

// 모든 이벤트 통합
export const ALL_EVENTS = {
  technical: TECHNICAL_EVENTS,
  business: BUSINESS_EVENTS,
  user: USER_EVENTS,
  personal: PERSONAL_EVENTS,
};

// 카테고리별 이벤트 확률 데이터
export const ENHANCED_PROBABILISTIC_EVENTS: EventProbability[] = [
  {
    category: 'technical',
    baseWeight: 25,
    events: TECHNICAL_EVENTS,
  },
  {
    category: 'business',
    baseWeight: 20,
    events: BUSINESS_EVENTS,
  },
  {
    category: 'user',
    baseWeight: 30,
    events: USER_EVENTS,
  },
  {
    category: 'personal',
    baseWeight: 15,
    events: PERSONAL_EVENTS,
  },
];

// 이벤트 총 개수
export const TOTAL_EVENT_COUNT =
  TECHNICAL_EVENTS.length +
  BUSINESS_EVENTS.length +
  USER_EVENTS.length +
  PERSONAL_EVENTS.length;

// 카테고리별 이벤트 개수
export const EVENT_COUNTS = {
  technical: TECHNICAL_EVENTS.length,
  business: BUSINESS_EVENTS.length,
  user: USER_EVENTS.length,
  personal: PERSONAL_EVENTS.length,
  total: TOTAL_EVENT_COUNT,
};

// 이벤트 ID로 찾기
export function findEventById(eventId: string): ProbabilisticEvent | undefined {
  for (const events of Object.values(ALL_EVENTS)) {
    const found = events.find(e => e.id === eventId);
    if (found) return found;
  }
  return undefined;
}

// 카테고리로 이벤트 필터링
export function getEventsByCategory(category: EventCategory): ProbabilisticEvent[] {
  return ALL_EVENTS[category] || [];
}

// 심각도별 이벤트 필터링
export function getEventsBySeverity(severity: 'critical' | 'warning' | 'good' | 'normal'): ProbabilisticEvent[] {
  const allEvents = [
    ...TECHNICAL_EVENTS,
    ...BUSINESS_EVENTS,
    ...USER_EVENTS,
    ...PERSONAL_EVENTS,
  ];
  return allEvents.filter(e => e.severity === severity);
}

// 랜덤 이벤트 선택 (테스트/디버그용)
export function getRandomEvent(): ProbabilisticEvent {
  const allEvents = [
    ...TECHNICAL_EVENTS,
    ...BUSINESS_EVENTS,
    ...USER_EVENTS,
    ...PERSONAL_EVENTS,
  ];
  return allEvents[Math.floor(Math.random() * allEvents.length)];
}

// 익스포트
export { TECHNICAL_EVENTS, BUSINESS_EVENTS, USER_EVENTS, PERSONAL_EVENTS };
export default ENHANCED_PROBABILISTIC_EVENTS;
