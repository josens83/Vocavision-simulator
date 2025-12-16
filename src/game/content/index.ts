/**
 * Chapter 3: Content & Narrative - Main Content Index
 * 모든 콘텐츠 시스템 통합 및 익스포트
 */

// Events
export * from './events';
export {
  ENHANCED_PROBABILISTIC_EVENTS,
  ALL_EVENTS,
  EVENT_COUNTS,
  TOTAL_EVENT_COUNT,
  findEventById,
  getEventsByCategory,
  getEventsBySeverity,
  getRandomEvent,
  TECHNICAL_EVENTS,
  BUSINESS_EVENTS,
  USER_EVENTS,
  PERSONAL_EVENTS,
  MARKET_EVENTS,
} from './events';

// NPCs
export * from './npcs';
export {
  NPCS,
  initializeNPCRelationships,
  updateRelationship,
  decayRelationships,
  checkNPCInteraction,
  getRelationshipLevel,
  getNPCById,
} from './npcs';
export type {
  NPC,
  PersonalityTraits,
  NPCInteraction,
  NPCChoice,
  NPCRelationship,
} from './npcs';

// Story Arcs
export * from './storyArcs';
export {
  STORY_ARCS,
  startStoryArc,
  completeChapter,
  setStoryFlag,
  isArcCompleted,
  findAvailableArcs,
  getCurrentChapterEvents,
  getArcById,
} from './storyArcs';
export type {
  StoryArc,
  StoryChapter,
  ChapterTrigger,
  StoryEvent,
  StoryChoice,
  StoryBranch,
  StoryProgress,
} from './storyArcs';

// Achievements
export * from './achievements';
export {
  ACHIEVEMENTS,
  ACHIEVEMENT_STATS,
  getAchievementById,
  getAchievementsByCategory,
  getAchievementsByRarity,
  checkUnlockableAchievements,
  calculateTotalPoints,
  getCategoryLabel,
  getRarityLabel,
} from './achievements';
export type {
  Achievement,
  AchievementCategory,
  AchievementReward,
} from './achievements';

// Content Statistics
export const CONTENT_STATISTICS = {
  totalEvents: 0, // Will be calculated at runtime
  totalNPCs: 10,
  totalStoryArcs: 5,
  eventCategories: ['technical', 'business', 'user', 'personal', 'market'],
};

// Initialize content statistics
import { EVENT_COUNTS } from './events';
CONTENT_STATISTICS.totalEvents = EVENT_COUNTS.total;
