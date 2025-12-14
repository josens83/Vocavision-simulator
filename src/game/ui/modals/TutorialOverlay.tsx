'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, SkipForward, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTutorial } from '@/game/store/systemIntegration';
import { TutorialStep } from '@/game/tutorial';

interface TutorialOverlayProps {
  isVisible?: boolean;
}

interface HighlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TutorialOverlay({ isVisible = true }: TutorialOverlayProps) {
  const { getCurrentStep, nextStep, skipTutorial, isTutorialActive } = useTutorial();
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);
  const [highlightPosition, setHighlightPosition] = useState<HighlightPosition | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const step = getCurrentStep();
    setCurrentStep(step);

    if (step?.highlightSelector) {
      const element = document.querySelector(step.highlightSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setHighlightPosition({
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16,
        });

        // Calculate tooltip position
        calculateTooltipPosition(rect, step.position || 'bottom');
      } else {
        setHighlightPosition(null);
        // Center the tooltip if no element to highlight
        setTooltipPosition({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 200,
        });
      }
    } else {
      setHighlightPosition(null);
      setTooltipPosition({
        top: window.innerHeight / 2 - 100,
        left: window.innerWidth / 2 - 200,
      });
    }
  }, [isVisible, getCurrentStep]);

  const calculateTooltipPosition = (
    elementRect: DOMRect,
    position: 'top' | 'bottom' | 'left' | 'right' | 'center'
  ) => {
    const tooltipWidth = 400;
    const tooltipHeight = 200;
    const padding = 20;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = elementRect.top - tooltipHeight - padding;
        left = elementRect.left + elementRect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = elementRect.bottom + padding;
        left = elementRect.left + elementRect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = elementRect.top + elementRect.height / 2 - tooltipHeight / 2;
        left = elementRect.left - tooltipWidth - padding;
        break;
      case 'right':
        top = elementRect.top + elementRect.height / 2 - tooltipHeight / 2;
        left = elementRect.right + padding;
        break;
      case 'center':
      default:
        top = window.innerHeight / 2 - tooltipHeight / 2;
        left = window.innerWidth / 2 - tooltipWidth / 2;
        break;
    }

    // Keep tooltip in viewport
    top = Math.max(padding, Math.min(window.innerHeight - tooltipHeight - padding, top));
    left = Math.max(padding, Math.min(window.innerWidth - tooltipWidth - padding, left));

    setTooltipPosition({ top, left });
  };

  const handleNext = () => {
    nextStep();
    const step = getCurrentStep();
    setCurrentStep(step);
  };

  const handleSkip = () => {
    skipTutorial();
    setCurrentStep(null);
  };

  if (!isVisible || !isTutorialActive() || !currentStep) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dark overlay with cutout for highlighted element */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <mask id="tutorial-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {highlightPosition && (
              <rect
                x={highlightPosition.left}
                y={highlightPosition.top}
                width={highlightPosition.width}
                height={highlightPosition.height}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.7)"
          mask="url(#tutorial-mask)"
        />
      </svg>

      {/* Highlight border */}
      {highlightPosition && (
        <div
          className="absolute border-2 border-violet-500 rounded-lg pointer-events-none animate-pulse"
          style={{
            top: highlightPosition.top,
            left: highlightPosition.left,
            width: highlightPosition.width,
            height: highlightPosition.height,
          }}
        />
      )}

      {/* Tutorial Tooltip */}
      <div
        ref={tooltipRef}
        className="absolute pointer-events-auto"
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          width: '400px',
        }}
      >
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl border border-violet-500/30 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-violet-900/30 border-b border-violet-500/20">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-violet-400" />
              <span className="font-bold text-violet-300">{currentStep.title}</span>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-gray-300 text-sm leading-relaxed">{currentStep.content}</p>

            {/* Tips */}
            {currentStep.tips && currentStep.tips.length > 0 && (
              <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                <div className="text-xs font-medium text-blue-400 mb-2">💡 팁</div>
                <ul className="text-xs text-blue-300 space-y-1">
                  {currentStep.tips.map((tip, index) => (
                    <li key={index}>• {tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-800/50 border-t border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {currentStep.stepNumber} / {currentStep.totalSteps || '?'}
              </span>
              {/* Progress dots */}
              <div className="flex gap-1">
                {Array.from({ length: currentStep.totalSteps || 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i < (currentStep.stepNumber || 1) ? 'bg-violet-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-xs text-gray-400 hover:text-gray-300"
              >
                <SkipForward className="w-3 h-3 mr-1" />
                건너뛰기
              </Button>
              <Button variant="gradient" size="sm" onClick={handleNext} className="text-xs">
                {currentStep.isLastStep ? (
                  '완료'
                ) : (
                  <>
                    다음
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Arrow pointing to highlighted element */}
        {highlightPosition && currentStep.position && (
          <div
            className="absolute w-4 h-4 bg-gray-800 border-l border-t border-violet-500/30 transform rotate-45"
            style={getArrowStyle(currentStep.position)}
          />
        )}
      </div>
    </div>
  );
}

function getArrowStyle(position: 'top' | 'bottom' | 'left' | 'right' | 'center'): React.CSSProperties {
  switch (position) {
    case 'top':
      return { bottom: '-8px', left: '50%', marginLeft: '-8px', transform: 'rotate(225deg)' };
    case 'bottom':
      return { top: '-8px', left: '50%', marginLeft: '-8px', transform: 'rotate(45deg)' };
    case 'left':
      return { right: '-8px', top: '50%', marginTop: '-8px', transform: 'rotate(135deg)' };
    case 'right':
      return { left: '-8px', top: '50%', marginTop: '-8px', transform: 'rotate(-45deg)' };
    default:
      return { display: 'none' };
  }
}

// Welcome Tutorial Component
export function WelcomeTutorial({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: 'VocaVision에 오신 것을 환영합니다!',
      content:
        '당신은 1인 에듀테크 스타트업의 창업자입니다. 영어 학습 앱 "VocaVision"을 성공시켜 유니콘 기업으로 성장시키는 것이 목표입니다.',
      image: '🚀',
    },
    {
      title: '일일 행동',
      content:
        '매일 제한된 행동 포인트로 개발, 마케팅, 비즈니스 활동을 수행합니다. 현명하게 선택하세요!',
      image: '⚡',
    },
    {
      title: '자원 관리',
      content:
        '현금, 사용자, 에너지, 스트레스를 균형있게 관리하세요. 자원이 바닥나면 게임 오버입니다.',
      image: '💰',
    },
    {
      title: '성장과 엔딩',
      content:
        '다양한 엔딩이 준비되어 있습니다. IPO, 인수합병, 유니콘 달성 등 여러 경로로 성공할 수 있습니다!',
      image: '🏆',
    },
    {
      title: '준비 완료!',
      content: '이제 시작할 준비가 되었습니다. 행운을 빕니다, 창업자님!',
      image: '🎮',
    },
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md w-full text-center">
        {/* Icon */}
        <div className="text-6xl mb-6">{steps[step].image}</div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
          {steps[step].title}
        </h2>

        {/* Content */}
        <p className="text-gray-300 mb-8 leading-relaxed">{steps[step].content}</p>

        {/* Progress */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === step ? 'bg-violet-500' : i < step ? 'bg-violet-400/50' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </Button>
          )}
          <Button variant="gradient" onClick={handleNext}>
            {step === steps.length - 1 ? '시작하기' : '다음'}
            {step < steps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>

        {/* Skip */}
        {step < steps.length - 1 && (
          <button
            onClick={onComplete}
            className="mt-4 text-sm text-gray-500 hover:text-gray-400 transition-colors"
          >
            건너뛰기
          </button>
        )}
      </div>
    </div>
  );
}

export default TutorialOverlay;
