/**
 * Chapter 4: UI/UX Excellence - MetricCard Component
 * 메트릭 표시용 카드 컴포넌트
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { colors, shadows, borderRadius, formatCurrency, formatNumber, formatPercent } from '../designTokens';

export type MetricStatus = 'good' | 'warning' | 'danger' | 'neutral' | 'info';

export interface MetricTrend {
  value: number;
  period: string;
}

export interface MetricCardProps {
  icon: string;
  label: string;
  value: string | number;
  subValue?: string;
  trend?: MetricTrend;
  status?: MetricStatus;
  onClick?: () => void;
  expandable?: boolean;
  sparklineData?: number[];
  format?: 'number' | 'currency' | 'percent' | 'raw';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function getStatusColor(status: MetricStatus): string {
  switch (status) {
    case 'good':
      return colors.semantic.success.main;
    case 'warning':
      return colors.semantic.warning.main;
    case 'danger':
      return colors.semantic.danger.main;
    case 'info':
      return colors.semantic.info.main;
    default:
      return colors.text.tertiary;
  }
}

function getStatusBg(status: MetricStatus): string {
  switch (status) {
    case 'good':
      return colors.semantic.success.bg;
    case 'warning':
      return colors.semantic.warning.bg;
    case 'danger':
      return colors.semantic.danger.bg;
    case 'info':
      return colors.semantic.info.bg;
    default:
      return colors.background.card;
  }
}

// 간단한 스파크라인 컴포넌트
const Sparkline: React.FC<{ data: number[]; color: MetricStatus }> = ({ data, color }) => {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const height = 24;
  const width = 80;
  const padding = 2;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - ((value - min) / range) * (height - padding * 2) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke={getStatusColor(color)}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  label,
  value,
  subValue,
  trend,
  status = 'neutral',
  onClick,
  expandable = false,
  sparklineData,
  format = 'raw',
  size = 'md',
  className = '',
}) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  // 숫자 값 애니메이션
  useEffect(() => {
    if (typeof value !== 'number' || value === prevValueRef.current) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    const startValue = typeof prevValueRef.current === 'number' ? prevValueRef.current : 0;
    const endValue = value;
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.round(startValue + (endValue - startValue) * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValueRef.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  // 값 포맷팅
  const formattedValue = (() => {
    if (typeof displayValue === 'string') return displayValue;
    switch (format) {
      case 'currency':
        return formatCurrency(displayValue, 'compact');
      case 'percent':
        return formatPercent(displayValue);
      case 'number':
        return formatNumber(displayValue);
      default:
        return String(displayValue);
    }
  })();

  const sizeStyles = {
    sm: { padding: '12px', iconSize: '1.25rem', valueSize: '1.25rem', labelSize: '0.75rem' },
    md: { padding: '16px', iconSize: '1.5rem', valueSize: '1.5rem', labelSize: '0.875rem' },
    lg: { padding: '20px', iconSize: '2rem', valueSize: '2rem', labelSize: '1rem' },
  }[size];

  const containerStyle: React.CSSProperties = {
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.lg,
    padding: sizeStyles.padding,
    border: `1px solid ${colors.border.default}`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    transform: isHovered && onClick ? 'translateY(-2px)' : 'none',
    boxShadow: isHovered && onClick ? shadows.lg : shadows.sm,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  };

  const iconLabelStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: colors.text.secondary,
    fontSize: sizeStyles.labelSize,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: sizeStyles.iconSize,
  };

  const bodyStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: trend || sparklineData ? '12px' : 0,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: sizeStyles.valueSize,
    fontWeight: 700,
    color: colors.text.primary,
    fontVariantNumeric: 'tabular-nums',
  };

  const subValueStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: colors.text.tertiary,
  };

  const trendStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.875rem',
    color: trend && trend.value >= 0 ? colors.semantic.success.main : colors.semantic.danger.main,
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px',
    paddingTop: '8px',
    borderTop: `1px solid ${colors.border.default}`,
  };

  // 상태 인디케이터
  const statusIndicatorStyle: React.CSSProperties = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: getStatusColor(status),
    boxShadow: `0 0 8px ${getStatusColor(status)}`,
  };

  return (
    <div
      className={`metric-card ${className}`}
      style={containerStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <div style={iconLabelStyle}>
          <span style={iconStyle}>{icon}</span>
          <span>{label}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={statusIndicatorStyle} />
          {expandable && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: colors.text.tertiary,
                cursor: 'pointer',
                padding: '4px',
                fontSize: '0.75rem',
              }}
            >
              {expanded ? '▼' : '▶'}
            </button>
          )}
        </div>
      </div>

      <div style={bodyStyle}>
        <span style={valueStyle}>{formattedValue}</span>
        {subValue && <span style={subValueStyle}>{subValue}</span>}
      </div>

      {(trend || sparklineData) && (
        <div style={footerStyle}>
          {trend && (
            <div style={trendStyle}>
              <span>{trend.value >= 0 ? '📈' : '📉'}</span>
              <span>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>
              <span style={{ color: colors.text.tertiary }}>{trend.period}</span>
            </div>
          )}

          {sparklineData && (
            <Sparkline data={sparklineData} color={status} />
          )}
        </div>
      )}

      {expanded && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: `1px solid ${colors.border.default}`,
            color: colors.text.secondary,
            fontSize: '0.875rem',
          }}
        >
          {/* 확장된 상세 정보 슬롯 */}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
