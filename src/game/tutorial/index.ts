/**
 * Chapter 9: Tutorial & Onboarding - Main Entry Point
 * 튜토리얼 및 온보딩 시스템 메인 엔트리 포인트
 *
 * 이 모듈은 VocaVision 시뮬레이터의 튜토리얼 및 온보딩 시스템을 제공합니다.
 *
 * 주요 기능:
 * 1. 튜토리얼 시퀀스 - 단계별 가이드
 * 2. 컨텍스트 힌트 - 상황에 맞는 도움말
 * 3. 도움말 시스템 - 주제별 도움말 문서
 * 4. 기능 발견 - 새 기능 언락 알림
 * 5. 온보딩 설정 - 사용자 맞춤 설정
 */

// ============================================
// Type Exports
// ============================================

export * from './types';

// ============================================
// Tutorial Sequences
// ============================================

export {
  tutorials,
  basicTutorial,
  businessTutorial,
  developmentTutorial,
  marketingTutorial,
  crisisManagementTutorial,
  getTutorialById,
  getTutorialsByCategory,
  getTutorialsByTrigger,
} from './sequences';

// ============================================
// Hints & Help
// ============================================

export {
  hints,
  helpCategories,
  helpTopics,
  featureDiscoveries,
  getHintById,
  getHintsByCategory,
  getHelpTopicById,
  getHelpTopicsByCategory,
  searchHelpTopics,
  getFeatureDiscoveryById,
} from './hints';

// ============================================
// Tutorial Manager
// ============================================

export { TutorialManager, tutorialManager } from './tutorialManager';

// ============================================
// 튜토리얼 UI 컴포넌트 Props
// ============================================

export interface TutorialOverlayProps {
  visible: boolean;
  opacity?: number;
  onClick?: () => void;
}

export interface TutorialHighlightProps {
  selector: string;
  padding?: number;
  shape?: 'rect' | 'circle';
  clickThrough?: boolean;
}

export interface TutorialTooltipProps {
  title?: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  target?: string;
  offset?: { x: number; y: number };
  showArrow?: boolean;
  onNext?: () => void;
  onSkip?: () => void;
  canSkip?: boolean;
}

export interface TutorialModalProps {
  title: string;
  content: string;
  icon?: string;
  onNext?: () => void;
  onSkip?: () => void;
  canSkip?: boolean;
  reward?: {
    type: string;
    value: number | string;
  };
}

export interface TutorialProgressProps {
  current: number;
  total: number;
  showPercentage?: boolean;
}

export interface HintNotificationProps {
  hint: {
    id: string;
    title: string;
    content: string;
    icon?: string;
  };
  onDismiss: () => void;
  onLearnMore?: () => void;
}

export interface FeatureAnnouncementProps {
  title: string;
  message: string;
  icon: string;
  onClose: () => void;
  onStartTutorial?: () => void;
}

// ============================================
// 튜토리얼 훅 (React)
// ============================================

/**
 * useTutorial 훅 사용 예시:
 *
 * ```tsx
 * function GameComponent() {
 *   const {
 *     currentStep,
 *     progress,
 *     advanceStep,
 *     skipTutorial,
 *     startTutorial,
 *   } = useTutorial();
 *
 *   // 튜토리얼 단계 렌더링
 *   if (currentStep) {
 *     return <TutorialStep step={currentStep} onNext={advanceStep} />;
 *   }
 *
 *   return <Game />;
 * }
 * ```
 */

// ============================================
// 튜토리얼 시스템 통합
// ============================================

import { TutorialManager, tutorialManager } from './tutorialManager';
import { TutorialSequence, TutorialStep, Hint, FeatureDiscovery, HelpTopic, HelpCategory } from './types';
import { tutorials } from './sequences';
import { hints, helpCategories, helpTopics, featureDiscoveries } from './hints';

/**
 * 튜토리얼 시스템 통합 인터페이스
 */
export interface TutorialSystem {
  // 관리자
  manager: TutorialManager;

  // 데이터
  tutorials: TutorialSequence[];
  hints: Hint[];
  helpCategories: HelpCategory[];
  helpTopics: HelpTopic[];
  featureDiscoveries: FeatureDiscovery[];

  // 메서드
  startTutorial: (id: string) => boolean;
  skipTutorial: () => void;
  getCurrentStep: () => TutorialStep | null;
  advanceStep: (nextId?: string) => boolean;
  checkTriggers: (gameState: any) => TutorialSequence | null;
  checkHints: (gameState: any) => Hint | null;
  checkFeatures: (gameState: any) => FeatureDiscovery | null;
  searchHelp: (query: string) => HelpTopic[];
}

/**
 * 튜토리얼 시스템 생성
 */
export function createTutorialSystem(): TutorialSystem {
  return {
    manager: tutorialManager,
    tutorials,
    hints,
    helpCategories,
    helpTopics,
    featureDiscoveries,

    startTutorial: (id: string) => tutorialManager.startTutorial(id),
    skipTutorial: () => tutorialManager.skipCurrentTutorial(),
    getCurrentStep: () => tutorialManager.getCurrentStep(),
    advanceStep: (nextId?: string) => tutorialManager.advanceStep(nextId),
    checkTriggers: (gameState: any) => tutorialManager.checkTriggers(gameState),
    checkHints: (gameState: any) => tutorialManager.checkHints(gameState),
    checkFeatures: (gameState: any) => tutorialManager.checkFeatureDiscovery(gameState),
    searchHelp: (query: string) => {
      const lowerQuery = query.toLowerCase();
      return helpTopics.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerQuery) ||
          t.summary.toLowerCase().includes(lowerQuery) ||
          t.keywords.some((k) => k.toLowerCase().includes(lowerQuery)),
      );
    },
  };
}

// 싱글톤 시스템 인스턴스
export const tutorialSystem = createTutorialSystem();

export default tutorialSystem;
