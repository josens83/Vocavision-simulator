/**
 * Chapter 4: UI/UX Excellence - StatBar Component
 * 스탯 표시용 프로그레스 바 컴포넌트
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';
import { colors, getEnergyColor, getStressColor, getServerColor, getReputationColor } from '../designTokens';

export type StatBarColor = 'energy' | 'stress' | 'health' | 'reputation' | 'server' | 'primary' | 'success' | 'warning' | 'danger';
export type StatBarSize = 'sm' | 'md' | 'lg';
export type StatBarVariant = 'default' | 'gradient' | 'segmented';

export interface StatBarProps {
  label: string;
  value: number;
  max: number;
  icon: string;
  color: StatBarColor;
  showValue?: boolean;
  showChange?: number;
  animated?: boolean;
  size?: StatBarSize;
  variant?: StatBarVariant;
  inverted?: boolean; // 스트레스 같이 낮을수록 좋은 경우
  showWarning?: boolean;
  className?: string;
}

function getColorForValue(color: StatBarColor, value: number, max: number, inverted: boolean): string {
  const percentage = inverted ? 100 - (value / max) * 100 : (value / max) * 100;

  switch (color) {
    case 'energy':
      return getEnergyColor(percentage);
    case 'stress':
      return getStressColor(inverted ? 100 - percentage : percentage);
    case 'server':
      return getServerColor(percentage);
    case 'reputation':
      return getReputationColor(percentage);
    case 'health':
      if (percentage > 60) return colors.semantic.success.main;
      if (percentage > 30) return colors.semantic.warning.main;
      return colors.semantic.danger.main;
    case 'primary':
      return colors.primary.main;
    case 'success':
      return colors.semantic.success.main;
    case 'warning':
      return colors.semantic.warning.main;
    case 'danger':
      return colors.semantic.danger.main;
    default:
      return colors.primary.main;
  }
}

function getSizeStyles(size: StatBarSize) {
  switch (size) {
    case 'sm':
      return { height: '6px', fontSize: '0.75rem', gap: '4px' };
    case 'lg':
      return { height: '12px', fontSize: '1rem', gap: '8px' };
    default:
      return { height: '8px', fontSize: '0.875rem', gap: '6px' };
  }
}

export const StatBar: React.FC<StatBarProps> = ({
  label,
  value,
  max,
  icon,
  color,
  showValue = true,
  showChange,
  animated = true,
  size = 'md',
  variant = 'gradient',
  inverted = false,
  showWarning = true,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

  const percentage = Math.min(100, Math.max(0, (displayValue / max) * 100));
  const barColor = getColorForValue(color, displayValue, max, inverted);
  const sizeStyles = getSizeStyles(size);

  // 위험 구간 체크
  const isDanger = inverted
    ? percentage > 80
    : percentage < 20;

  // 값 애니메이션
  useEffect(() => {
    if (!animated || value === prevValueRef.current) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    setIsAnimating(true);
    const startValue = prevValueRef.current;
    const endValue = value;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.round(startValue + (endValue - startValue) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        prevValueRef.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value, animated]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: sizeStyles.gap,
    width: '100%',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: sizeStyles.fontSize,
  };

  const labelContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: colors.text.secondary,
  };

  const valueContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const valueStyle: React.CSSProperties = {
    color: colors.text.primary,
    fontWeight: 600,
    fontVariantNumeric: 'tabular-nums',
  };

  const maxStyle: React.CSSProperties = {
    color: colors.text.tertiary,
    fontSize: '0.85em',
  };

  const changeStyle: React.CSSProperties = {
    fontSize: '0.85em',
    fontWeight: 500,
    color: showChange && showChange > 0
      ? colors.semantic.success.main
      : colors.semantic.danger.main,
  };

  const trackStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: sizeStyles.height,
    backgroundColor: colors.background.tertiary,
    borderRadius: '9999px',
    overflow: 'hidden',
  };

  const fillStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: `${percentage}%`,
    backgroundColor: barColor,
    borderRadius: '9999px',
    transition: animated ? 'width 0.5s ease-out' : 'none',
    boxShadow: isDanger && showWarning ? `0 0 10px ${barColor}` : 'none',
  };

  if (variant === 'gradient') {
    fillStyle.background = `linear-gradient(90deg, ${barColor}88, ${barColor})`;
  }

  const dangerZoneStyle: React.CSSProperties = {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '20%',
    background: `linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.2))`,
    pointerEvents: 'none',
  };

  const segmentStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    display: 'flex',
    width: '100%',
    pointerEvents: 'none',
  };

  return (
    <div className={`stat-bar ${className}`} style={containerStyle}>
      <div style={headerStyle}>
        <div style={labelContainerStyle}>
          <span>{icon}</span>
          <span>{label}</span>
        </div>

        <div style={valueContainerStyle}>
          {showValue && (
            <span style={valueStyle}>
              {Math.round(displayValue)}
              <span style={maxStyle}>/{max}</span>
            </span>
          )}
          {showChange !== undefined && showChange !== 0 && (
            <span style={changeStyle}>
              {showChange > 0 ? '+' : ''}{showChange}
            </span>
          )}
        </div>
      </div>

      <div style={trackStyle}>
        <div style={fillStyle} />

        {/* 위험 구간 표시 */}
        {showWarning && !inverted && (
          <div style={dangerZoneStyle} />
        )}

        {/* 세그먼트 표시 */}
        {variant === 'segmented' && (
          <div style={segmentStyle}>
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  borderRight: i < 9 ? `1px solid ${colors.background.primary}` : 'none',
                }}
              />
            ))}
          </div>
        )}

        {/* 펄스 애니메이션 (위험 상태) */}
        {isDanger && showWarning && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '9999px',
              animation: 'pulse-danger 2s ease-in-out infinite',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StatBar;
