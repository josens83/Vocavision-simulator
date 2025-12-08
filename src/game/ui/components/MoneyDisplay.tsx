/**
 * Chapter 4: UI/UX Excellence - MoneyDisplay Component
 * 돈 표시 컴포넌트 (애니메이션 포함)
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { colors, formatCurrency } from '../designTokens';

export type MoneySize = 'sm' | 'md' | 'lg' | 'xl';
export type MoneyFormat = 'full' | 'short' | 'compact';

export interface MoneyDisplayProps {
  amount: number;
  previousAmount?: number;
  size?: MoneySize;
  showTrend?: boolean;
  showIcon?: boolean;
  animated?: boolean;
  format?: MoneyFormat;
  className?: string;
}

function getSizeStyles(size: MoneySize) {
  switch (size) {
    case 'sm':
      return { fontSize: '1rem', iconSize: '1rem', trendSize: '0.75rem' };
    case 'lg':
      return { fontSize: '1.75rem', iconSize: '1.5rem', trendSize: '1rem' };
    case 'xl':
      return { fontSize: '2.5rem', iconSize: '2rem', trendSize: '1.25rem' };
    default:
      return { fontSize: '1.25rem', iconSize: '1.25rem', trendSize: '0.875rem' };
  }
}

export const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  amount,
  previousAmount,
  size = 'md',
  showTrend = true,
  showIcon = true,
  animated = true,
  format = 'full',
  className = '',
}) => {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevAmountRef = useRef(amount);

  const trend = previousAmount !== undefined ? amount - previousAmount : 0;
  const sizeStyles = getSizeStyles(size);

  // 숫자 애니메이션
  useEffect(() => {
    if (!animated || amount === prevAmountRef.current) {
      setDisplayAmount(amount);
      prevAmountRef.current = amount;
      return;
    }

    setIsAnimating(true);
    const startAmount = prevAmountRef.current;
    const endAmount = amount;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayAmount(Math.round(startAmount + (endAmount - startAmount) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        prevAmountRef.current = amount;
      }
    };

    requestAnimationFrame(animate);
  }, [amount, animated]);

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: sizeStyles.iconSize,
    lineHeight: 1,
  };

  const amountStyle: React.CSSProperties = {
    fontSize: sizeStyles.fontSize,
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    color: amount < 0 ? colors.semantic.danger.main : colors.text.primary,
    transition: 'color 0.3s ease',
  };

  const trendContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: sizeStyles.trendSize,
    color: trend > 0 ? colors.semantic.success.main : colors.semantic.danger.main,
    opacity: isAnimating ? 1 : 0.8,
    transition: 'opacity 0.3s ease',
  };

  const trendIconStyle: React.CSSProperties = {
    transition: 'transform 0.3s ease',
    transform: isAnimating ? (trend > 0 ? 'translateY(-2px)' : 'translateY(2px)') : 'none',
  };

  return (
    <div className={className} style={containerStyle}>
      {showIcon && <span style={iconStyle}>💰</span>}

      <span style={amountStyle}>
        {formatCurrency(displayAmount, format)}
      </span>

      {showTrend && trend !== 0 && (
        <span style={trendContainerStyle}>
          <span style={trendIconStyle}>
            {trend > 0 ? '↑' : '↓'}
          </span>
          <span>
            {formatCurrency(Math.abs(trend), format)}
          </span>
        </span>
      )}
    </div>
  );
};

// 런웨이 표시 컴포넌트
export interface RunwayDisplayProps {
  months: number;
  className?: string;
}

export const RunwayDisplay: React.FC<RunwayDisplayProps> = ({
  months,
  className = '',
}) => {
  const getRunwayColor = () => {
    if (months < 3) return colors.semantic.danger.main;
    if (months < 6) return colors.semantic.warning.main;
    return colors.semantic.success.main;
  };

  const getRunwayStatus = () => {
    if (months < 1) return '위험! 즉시 조치 필요';
    if (months < 3) return '주의 필요';
    if (months < 6) return '관리 필요';
    if (months < 12) return '안정적';
    return '매우 안정적';
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: colors.background.card,
    borderRadius: '8px',
    border: `1px solid ${colors.border.default}`,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '1.5rem',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: getRunwayColor(),
  };

  const statusStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: getRunwayColor(),
    opacity: 0.8,
  };

  return (
    <div className={className} style={containerStyle}>
      <span style={iconStyle}>⏳</span>
      <div style={contentStyle}>
        <span style={labelStyle}>런웨이</span>
        <span style={valueStyle}>
          {months.toFixed(1)}개월
        </span>
        <span style={statusStyle}>{getRunwayStatus()}</span>
      </div>

      {/* 진행 바 */}
      <div style={{
        flex: 1,
        height: '8px',
        backgroundColor: colors.background.tertiary,
        borderRadius: '4px',
        overflow: 'hidden',
        marginLeft: '12px',
      }}>
        <div style={{
          width: `${Math.min(100, (months / 12) * 100)}%`,
          height: '100%',
          backgroundColor: getRunwayColor(),
          borderRadius: '4px',
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  );
};

// MRR 표시 컴포넌트
export interface MRRDisplayProps {
  mrr: number;
  growth?: number;
  className?: string;
}

export const MRRDisplay: React.FC<MRRDisplayProps> = ({
  mrr,
  growth,
  className = '',
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '16px',
    backgroundColor: colors.background.card,
    borderRadius: '12px',
    border: `1px solid ${colors.border.default}`,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: colors.text.primary,
    fontVariantNumeric: 'tabular-nums',
  };

  const growthStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.875rem',
    color: growth && growth >= 0 ? colors.semantic.success.main : colors.semantic.danger.main,
    padding: '4px 8px',
    backgroundColor: growth && growth >= 0 ? colors.semantic.success.bg : colors.semantic.danger.bg,
    borderRadius: '4px',
  };

  const arrStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: colors.text.tertiary,
    marginTop: '4px',
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={headerStyle}>
        <span style={labelStyle}>
          📊 월간 반복 매출 (MRR)
        </span>
        {growth !== undefined && (
          <span style={growthStyle}>
            {growth >= 0 ? '📈' : '📉'}
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
          </span>
        )}
      </div>

      <div style={valueStyle}>
        {formatCurrency(mrr)}
      </div>

      <div style={arrStyle}>
        연간 환산 (ARR): {formatCurrency(mrr * 12)}
      </div>
    </div>
  );
};

export default MoneyDisplay;
