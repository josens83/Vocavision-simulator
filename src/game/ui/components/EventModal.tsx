/**
 * Chapter 4: UI/UX Excellence - EventModal Component
 * 게임 이벤트 모달 컴포넌트
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { colors, shadows, borderRadius, zIndex, formatCurrency } from '../designTokens';
import type { GameEvent, DecisionOption, Effect } from '../../types';

export type EventSeverity = 'critical' | 'warning' | 'good' | 'neutral';

export interface EventModalProps {
  event: GameEvent;
  onChoice: (choiceId: string) => void;
  onClose?: () => void;
  canClose?: boolean;
  playerEnergy?: number;
  playerMoney?: number;
}

const severityStyles: Record<EventSeverity, {
  borderColor: string;
  glowColor: string;
  headerBg: string;
  icon: string;
}> = {
  critical: {
    borderColor: '#EF4444',
    glowColor: 'rgba(239, 68, 68, 0.3)',
    headerBg: 'linear-gradient(135deg, #7F1D1D 0%, #991B1B 100%)',
    icon: '🚨',
  },
  warning: {
    borderColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    headerBg: 'linear-gradient(135deg, #78350F 0%, #92400E 100%)',
    icon: '⚠️',
  },
  good: {
    borderColor: '#10B981',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    headerBg: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
    icon: '✨',
  },
  neutral: {
    borderColor: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.3)',
    headerBg: 'linear-gradient(135deg, #312E81 0%, #3730A3 100%)',
    icon: '📋',
  },
};

const categoryIcons: Record<string, string> = {
  technical: '💻',
  business: '💼',
  user: '👥',
  personal: '🧘',
  market: '📊',
};

// 선택지 버튼 컴포넌트
interface ChoiceButtonProps {
  choice: DecisionOption;
  index: number;
  selected: boolean;
  canAfford: boolean;
  onSelect: () => void;
  onConfirm: () => void;
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  choice,
  index,
  selected,
  canAfford,
  onSelect,
  onConfirm,
}) => {
  const isDisabled = !canAfford;

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    width: '100%',
    textAlign: 'left',
    backgroundColor: selected
      ? colors.primary.dark
      : isDisabled
        ? colors.background.tertiary
        : colors.background.elevated,
    border: selected
      ? `2px solid ${colors.primary.main}`
      : `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.lg,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
  };

  const numberStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: selected ? colors.primary.main : colors.background.card,
    color: selected ? '#FFFFFF' : colors.text.secondary,
    borderRadius: '50%',
    fontSize: '0.875rem',
    fontWeight: 700,
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const textStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 500,
    color: colors.text.primary,
    lineHeight: 1.4,
  };

  const requirementsStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    fontSize: '0.875rem',
  };

  const reqBadgeStyle = (lacking: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: lacking ? colors.semantic.danger.bg : colors.background.tertiary,
    color: lacking ? colors.semantic.danger.main : colors.text.secondary,
    borderRadius: '4px',
  });

  const confirmButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '8px 16px',
    backgroundColor: colors.primary.main,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
  };

  // 요구사항 체크
  const requirements = choice.requirements || {};
  const hasEnergyReq = requirements.energy !== undefined;
  const hasMoneyReq = requirements.cash !== undefined;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => canAfford && (selected ? onConfirm() : onSelect())}
      style={buttonStyle}
    >
      <span style={numberStyle}>{index + 1}</span>

      <div style={contentStyle}>
        <span style={textStyle}>{choice.text}</span>

        {/* 요구사항 표시 */}
        {(hasEnergyReq || hasMoneyReq) && (
          <div style={requirementsStyle}>
            {hasEnergyReq && (
              <span style={reqBadgeStyle(!canAfford)}>
                ⚡ {requirements.energy}
              </span>
            )}
            {hasMoneyReq && (
              <span style={reqBadgeStyle(!canAfford)}>
                💰 {formatCurrency(requirements.cash!, 'compact')}
              </span>
            )}
          </div>
        )}

        {/* 선택 시 확인 버튼 */}
        {selected && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            style={confirmButtonStyle}
          >
            확인 ▶
          </button>
        )}
      </div>
    </button>
  );
};

// 효과 미리보기 컴포넌트
interface EffectPreviewProps {
  effects: Effect[];
}

const EffectPreview: React.FC<EffectPreviewProps> = ({ effects }) => {
  if (!effects || effects.length === 0) return null;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px',
    padding: '8px',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    fontSize: '0.75rem',
  };

  const getEffectIcon = (type: string): string => {
    const icons: Record<string, string> = {
      energy: '⚡',
      cash: '💰',
      stress: '😰',
      health: '❤️',
      users: '👥',
      premium_users: '⭐',
      reputation: '📈',
      stability: '🛡️',
      server_health: '🖥️',
      skill_coding: '💻',
      skill_business: '💼',
      skill_marketing: '📣',
      technical_debt: '🔧',
      mental: '🧠',
    };
    return icons[type] || '•';
  };

  const badgeStyle = (value: number): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '2px 6px',
    backgroundColor: value > 0 ? colors.semantic.success.bg : colors.semantic.danger.bg,
    color: value > 0 ? colors.semantic.success.main : colors.semantic.danger.main,
    borderRadius: '4px',
  });

  return (
    <div style={containerStyle}>
      {effects.map((effect, index) => (
        <span key={index} style={badgeStyle(effect.value)}>
          {getEffectIcon(effect.type)}
          {effect.value > 0 ? '+' : ''}{effect.value}
        </span>
      ))}
    </div>
  );
};

export const EventModal: React.FC<EventModalProps> = ({
  event,
  onChoice,
  onClose,
  canClose = false,
  playerEnergy = 100,
  playerMoney = 10000000,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const severity: EventSeverity = (event.severity as EventSeverity) || 'neutral';
  const style = severityStyles[severity];

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 숫자 키로 선택
      const num = parseInt(e.key);
      if (num >= 1 && num <= event.choices.length) {
        const choice = event.choices[num - 1];
        if (canAffordChoice(choice)) {
          if (selectedChoice === choice.id) {
            handleConfirm(choice.id);
          } else {
            setSelectedChoice(choice.id);
          }
        }
      }

      // Enter로 확인
      if (e.key === 'Enter' && selectedChoice) {
        handleConfirm(selectedChoice);
      }

      // Escape로 닫기
      if (e.key === 'Escape' && canClose) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [event.choices, selectedChoice, canClose]);

  const canAffordChoice = useCallback((choice: DecisionOption): boolean => {
    const requirements = choice.requirements || {};
    if (requirements.energy && playerEnergy < requirements.energy) return false;
    if (requirements.cash && playerMoney < requirements.cash) return false;
    return true;
  }, [playerEnergy, playerMoney]);

  const handleConfirm = useCallback((choiceId: string) => {
    setIsClosing(true);
    setTimeout(() => {
      onChoice(choiceId);
    }, 200);
  }, [onChoice]);

  const handleClose = useCallback(() => {
    if (canClose) {
      setIsClosing(true);
      setTimeout(() => {
        onClose?.();
      }, 200);
    }
  }, [canClose, onClose]);

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.overlay,
    zIndex: zIndex.modal,
    padding: '20px',
    opacity: isClosing ? 0 : 1,
    transition: 'opacity 0.2s ease',
  };

  const modalStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    maxWidth: '560px',
    maxHeight: '90vh',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.xl,
    border: `2px solid ${style.borderColor}`,
    boxShadow: `${shadows.xl}, 0 0 40px ${style.glowColor}`,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transform: isClosing ? 'scale(0.95)' : 'scale(1)',
    transition: 'transform 0.2s ease',
  };

  const headerStyle: React.CSSProperties = {
    background: style.headerBg,
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const categoryStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const bodyStyle: React.CSSProperties = {
    padding: '24px',
    overflowY: 'auto',
    flex: 1,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '1rem',
    lineHeight: 1.6,
    color: colors.text.secondary,
    marginBottom: '24px',
  };

  const choicesContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const footerStyle: React.CSSProperties = {
    padding: '16px 24px',
    borderTop: `1px solid ${colors.border.default}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    color: colors.text.tertiary,
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: 'none',
    borderRadius: '50%',
    color: '#FFFFFF',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  return (
    <div style={overlayStyle} onClick={canClose ? handleClose : undefined}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div style={headerStyle}>
          <div style={categoryStyle}>
            <span>{categoryIcons[event.type || 'random'] || '📋'}</span>
            <span>{event.type || 'Event'}</span>
          </div>

          <h2 style={titleStyle}>
            <span>{style.icon}</span>
            <span>{event.title}</span>
          </h2>

          {canClose && (
            <button
              type="button"
              onClick={handleClose}
              style={closeButtonStyle}
            >
              ✕
            </button>
          )}
        </div>

        {/* 본문 */}
        <div style={bodyStyle}>
          <p style={descriptionStyle}>{event.description}</p>

          {/* 선택지 */}
          <div style={choicesContainerStyle}>
            {event.choices.map((choice, index) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                index={index}
                selected={selectedChoice === choice.id}
                canAfford={canAffordChoice(choice)}
                onSelect={() => setSelectedChoice(choice.id)}
                onConfirm={() => handleConfirm(choice.id)}
              />
            ))}
          </div>
        </div>

        {/* 푸터 */}
        <div style={footerStyle}>
          <span>💡 숫자 키(1-{event.choices.length})로 빠르게 선택</span>
          <span>Enter로 확인</span>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
