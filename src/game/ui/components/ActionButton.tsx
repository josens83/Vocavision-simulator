/**
 * Chapter 4: UI/UX Excellence - ActionButton Component
 * 게임 액션 버튼 컴포넌트
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { colors, shadows, borderRadius, formatCurrency } from '../designTokens';

export type ActionVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
export type ActionSize = 'sm' | 'md' | 'lg';

export interface ActionCost {
  energy?: number;
  money?: number;
  time?: number;
}

export interface ActionButtonProps {
  id: string;
  icon: string;
  label: string;
  description?: string;
  cost?: ActionCost;
  disabled?: boolean;
  disabledReason?: string;
  cooldown?: number;
  maxCooldown?: number;
  hotkey?: string;
  onClick: () => void;
  variant?: ActionVariant;
  size?: ActionSize;
  fullWidth?: boolean;
  className?: string;
}

function getVariantStyles(variant: ActionVariant, disabled: boolean) {
  const baseStyles = {
    primary: {
      bg: colors.primary.main,
      bgHover: colors.primary.light,
      border: colors.primary.dark,
      text: colors.primary.contrast,
    },
    secondary: {
      bg: colors.background.elevated,
      bgHover: colors.background.card,
      border: colors.border.default,
      text: colors.text.primary,
    },
    danger: {
      bg: colors.semantic.danger.main,
      bgHover: colors.semantic.danger.light,
      border: colors.semantic.danger.dark,
      text: '#FFFFFF',
    },
    success: {
      bg: colors.semantic.success.main,
      bgHover: colors.semantic.success.light,
      border: colors.semantic.success.dark,
      text: '#FFFFFF',
    },
    warning: {
      bg: colors.semantic.warning.main,
      bgHover: colors.semantic.warning.light,
      border: colors.semantic.warning.dark,
      text: '#000000',
    },
  };

  const style = baseStyles[variant];

  if (disabled) {
    return {
      bg: colors.background.tertiary,
      bgHover: colors.background.tertiary,
      border: colors.border.default,
      text: colors.text.disabled,
    };
  }

  return style;
}

function getSizeStyles(size: ActionSize) {
  switch (size) {
    case 'sm':
      return {
        padding: '8px 12px',
        fontSize: '0.875rem',
        iconSize: '1rem',
        gap: '6px',
        minHeight: '36px',
      };
    case 'lg':
      return {
        padding: '16px 24px',
        fontSize: '1.125rem',
        iconSize: '1.5rem',
        gap: '10px',
        minHeight: '56px',
      };
    default:
      return {
        padding: '12px 16px',
        fontSize: '1rem',
        iconSize: '1.25rem',
        gap: '8px',
        minHeight: '44px',
      };
  }
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  id,
  icon,
  label,
  description,
  cost,
  disabled = false,
  disabledReason,
  cooldown,
  maxCooldown,
  hotkey,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressing, setIsPressing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const isOnCooldown = cooldown !== undefined && cooldown > 0;
  const isDisabled = disabled || isOnCooldown;

  const variantStyles = getVariantStyles(variant, isDisabled);
  const sizeStyles = getSizeStyles(size);

  // 단축키 처리
  useEffect(() => {
    if (!hotkey || isDisabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === hotkey.toLowerCase() && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        onClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkey, isDisabled, onClick]);

  const handleClick = useCallback(() => {
    if (!isDisabled) {
      onClick();
    }
  }, [isDisabled, onClick]);

  // 쿨다운 퍼센트
  const cooldownPercent = isOnCooldown && maxCooldown
    ? (cooldown / maxCooldown) * 100
    : 0;

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    width: fullWidth ? '100%' : 'auto',
  };

  const buttonStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizeStyles.gap,
    width: '100%',
    minHeight: sizeStyles.minHeight,
    padding: sizeStyles.padding,
    fontSize: sizeStyles.fontSize,
    fontWeight: 600,
    backgroundColor: isPressing ? variantStyles.bgHover : variantStyles.bg,
    color: variantStyles.text,
    border: `1px solid ${variantStyles.border}`,
    borderRadius: borderRadius.lg,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    transform: isPressing ? 'scale(0.98)' : 'scale(1)',
    boxShadow: isHovered && !isDisabled ? shadows.md : shadows.sm,
    overflow: 'hidden',
    outline: 'none',
  };

  const cooldownOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: `${cooldownPercent}%`,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: 'height 1s linear',
    pointerEvents: 'none',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizeStyles.gap,
    position: 'relative',
    zIndex: 1,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: sizeStyles.iconSize,
    lineHeight: 1,
  };

  const costsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginLeft: '8px',
    paddingLeft: '8px',
    borderLeft: `1px solid ${variantStyles.border}`,
    fontSize: '0.85em',
    opacity: 0.9,
  };

  const costItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  };

  const hotkeyStyle: React.CSSProperties = {
    position: 'absolute',
    top: '4px',
    right: '4px',
    padding: '2px 6px',
    fontSize: '0.7rem',
    fontWeight: 700,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: borderRadius.sm,
    textTransform: 'uppercase',
  };

  const tooltipStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 'calc(100% + 8px)',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '8px 12px',
    backgroundColor: colors.background.elevated,
    color: colors.text.primary,
    fontSize: '0.875rem',
    borderRadius: borderRadius.md,
    boxShadow: shadows.lg,
    whiteSpace: 'nowrap',
    zIndex: 100,
    opacity: showTooltip ? 1 : 0,
    visibility: showTooltip ? 'visible' : 'hidden',
    transition: 'opacity 0.2s, visibility 0.2s',
    pointerEvents: 'none',
  };

  const tooltipArrowStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '-6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: `6px solid ${colors.background.elevated}`,
  };

  return (
    <div className={className} style={containerStyle}>
      <button
        id={id}
        type="button"
        disabled={isDisabled}
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true);
          if (description || disabledReason) {
            setShowTooltip(true);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsPressing(false);
          setShowTooltip(false);
        }}
        onMouseDown={() => setIsPressing(true)}
        onMouseUp={() => setIsPressing(false)}
        style={buttonStyle}
      >
        {/* 쿨다운 오버레이 */}
        {isOnCooldown && (
          <div style={cooldownOverlayStyle} />
        )}

        <div style={contentStyle}>
          <span style={iconStyle}>{icon}</span>
          <span>{label}</span>

          {/* 비용 표시 */}
          {cost && (cost.energy || cost.money || cost.time) && (
            <div style={costsStyle}>
              {cost.energy && (
                <span style={costItemStyle}>
                  ⚡{cost.energy}
                </span>
              )}
              {cost.money && (
                <span style={costItemStyle}>
                  💰{formatCurrency(cost.money, 'compact')}
                </span>
              )}
              {cost.time && (
                <span style={costItemStyle}>
                  ⏱️{cost.time}h
                </span>
              )}
            </div>
          )}
        </div>

        {/* 단축키 표시 */}
        {hotkey && (
          <span style={hotkeyStyle}>{hotkey}</span>
        )}
      </button>

      {/* 툴팁 */}
      {(description || disabledReason) && (
        <div style={tooltipStyle}>
          {isDisabled && disabledReason ? disabledReason : description}
          <div style={tooltipArrowStyle} />
        </div>
      )}
    </div>
  );
};

// 액션 그룹 컴포넌트
export interface ActionGroupProps {
  title: string;
  actions: ActionButtonProps[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export const ActionGroup: React.FC<ActionGroupProps> = ({
  title,
  actions,
  layout = 'vertical',
  collapsible = false,
  defaultCollapsed = false,
  className = '',
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    cursor: collapsible ? 'pointer' : 'default',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const toggleStyle: React.CSSProperties = {
    color: colors.text.tertiary,
    fontSize: '0.75rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  };

  const contentStyle: React.CSSProperties = {
    display: collapsed ? 'none' : layout === 'grid' ? 'grid' : 'flex',
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fit, minmax(200px, 1fr))' : undefined,
    gap: '8px',
    flexWrap: layout === 'horizontal' ? 'wrap' : undefined,
  };

  return (
    <div className={className} style={containerStyle}>
      <div
        style={headerStyle}
        onClick={() => collapsible && setCollapsed(!collapsed)}
      >
        <h3 style={titleStyle}>{title}</h3>
        {collapsible && (
          <button style={toggleStyle}>
            {collapsed ? '▶' : '▼'}
          </button>
        )}
      </div>

      <div style={contentStyle}>
        {actions.map((action) => (
          <ActionButton key={action.id} {...action} fullWidth={layout !== 'horizontal'} />
        ))}
      </div>
    </div>
  );
};

export default ActionButton;
