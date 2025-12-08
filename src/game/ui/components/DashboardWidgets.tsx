/**
 * Chapter 4: UI/UX Excellence - Dashboard Widgets
 * 대시보드 위젯 컴포넌트들
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { colors, shadows, borderRadius, formatCurrency, formatNumber, formatPercent, getMoneyColor, getEnergyColor, getStressColor } from '../designTokens';

// ============================================
// 공통 위젯 컨테이너
// ============================================

export interface WidgetContainerProps {
  title?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  collapsible?: boolean;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  noPadding?: boolean;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  title,
  icon,
  action,
  collapsible = false,
  defaultExpanded = true,
  children,
  size = 'medium',
  noPadding = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const containerStyle: React.CSSProperties = {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    border: `1px solid ${colors.border.default}`,
    overflow: 'hidden',
    boxShadow: shadows.md,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: expanded ? `1px solid ${colors.border.default}` : 'none',
  };

  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: size === 'small' ? '0.875rem' : '1rem',
    fontWeight: 600,
    color: colors.text.primary,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: size === 'small' ? '1rem' : '1.125rem',
  };

  const actionButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.sm,
    color: colors.text.secondary,
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  const collapseButtonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: 'none',
    color: colors.text.tertiary,
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
    transition: 'transform 0.2s ease',
  };

  const bodyStyle: React.CSSProperties = {
    padding: noPadding ? 0 : '16px',
    display: expanded ? 'block' : 'none',
  };

  return (
    <div style={containerStyle}>
      {(title || action || collapsible) && (
        <div style={headerStyle}>
          <div style={titleContainerStyle}>
            {collapsible && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                style={collapseButtonStyle}
              >
                ▼
              </button>
            )}
            {icon && <span style={iconStyle}>{icon}</span>}
            {title && <span style={titleStyle}>{title}</span>}
          </div>

          {action && (
            <button
              type="button"
              onClick={action.onClick}
              style={actionButtonStyle}
            >
              {action.label}
            </button>
          )}
        </div>
      )}

      <div style={bodyStyle}>
        {children}
      </div>
    </div>
  );
};

// ============================================
// 재무 위젯
// ============================================

export interface FinanceWidgetProps {
  cash: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  runway: number;
  revenueHistory?: number[];
  onDetails?: () => void;
}

export const FinanceWidget: React.FC<FinanceWidgetProps> = ({
  cash,
  monthlyRevenue,
  monthlyExpenses,
  runway,
  revenueHistory = [],
  onDetails,
}) => {
  const netIncome = monthlyRevenue - monthlyExpenses;

  const mainMetricStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 700,
    color: colors.text.primary,
    fontFamily: '"JetBrains Mono", monospace',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  };

  const gridItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
  };

  const smallLabelStyle: React.CSSProperties = {
    fontSize: '0.6875rem',
    color: colors.text.tertiary,
  };

  const smallValueStyle = (value: number): React.CSSProperties => ({
    fontSize: '1rem',
    fontWeight: 600,
    color: getMoneyColor(value),
    fontFamily: '"JetBrains Mono", monospace',
  });

  const runwayStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: runway <= 3 ? colors.semantic.danger.bg : runway <= 6 ? colors.semantic.warning.bg : colors.background.tertiary,
    borderRadius: borderRadius.md,
    border: `1px solid ${runway <= 3 ? colors.semantic.danger.main : runway <= 6 ? colors.semantic.warning.main : 'transparent'}`,
  };

  const runwayIconStyle: React.CSSProperties = {
    fontSize: '1.5rem',
  };

  const runwayContentStyle: React.CSSProperties = {
    flex: 1,
  };

  const runwayLabelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.secondary,
  };

  const runwayValueStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: runway <= 3 ? colors.semantic.danger.main : runway <= 6 ? colors.semantic.warning.main : colors.text.primary,
  };

  // Mini sparkline
  const renderSparkline = () => {
    if (revenueHistory.length < 2) return null;

    const maxVal = Math.max(...revenueHistory);
    const minVal = Math.min(...revenueHistory);
    const range = maxVal - minVal || 1;

    const width = 80;
    const height = 24;
    const points = revenueHistory.map((val, i) => {
      const x = (i / (revenueHistory.length - 1)) * width;
      const y = height - ((val - minVal) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} style={{ marginLeft: 'auto' }}>
        <polyline
          points={points}
          fill="none"
          stroke={colors.semantic.success.main}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <WidgetContainer
      title="재무 현황"
      icon="💰"
      action={onDetails ? { label: '상세', onClick: onDetails } : undefined}
    >
      <div style={mainMetricStyle}>
        <span style={labelStyle}>보유 자금</span>
        <span style={valueStyle}>{formatCurrency(cash, 'short')}</span>
      </div>

      <div style={gridStyle}>
        <div style={gridItemStyle}>
          <span style={smallLabelStyle}>월 수익</span>
          <span style={smallValueStyle(monthlyRevenue)}>
            {monthlyRevenue > 0 ? '+' : ''}{formatCurrency(monthlyRevenue, 'compact')}
          </span>
        </div>
        <div style={gridItemStyle}>
          <span style={smallLabelStyle}>월 지출</span>
          <span style={smallValueStyle(-monthlyExpenses)}>
            -{formatCurrency(monthlyExpenses, 'compact')}
          </span>
        </div>
        <div style={gridItemStyle}>
          <span style={smallLabelStyle}>월 순이익</span>
          <span style={smallValueStyle(netIncome)}>
            {netIncome > 0 ? '+' : ''}{formatCurrency(netIncome, 'compact')}
          </span>
        </div>
        <div style={gridItemStyle}>
          <span style={smallLabelStyle}>수익 추이</span>
          {renderSparkline()}
        </div>
      </div>

      <div style={runwayStyle}>
        <span style={runwayIconStyle}>
          {runway <= 3 ? '🚨' : runway <= 6 ? '⚠️' : '📅'}
        </span>
        <div style={runwayContentStyle}>
          <div style={runwayLabelStyle}>런웨이</div>
          <div style={runwayValueStyle}>
            {runway <= 0 ? '자금 고갈!' : `${runway}개월`}
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

// ============================================
// 활동 피드 위젯
// ============================================

export interface ActivityItem {
  id: string;
  type: 'event' | 'decision' | 'milestone' | 'notification';
  icon: string;
  title: string;
  description?: string;
  timestamp: number;
  severity?: 'normal' | 'warning' | 'critical' | 'success';
}

export interface ActivityFeedWidgetProps {
  activities: ActivityItem[];
  maxItems?: number;
  onViewAll?: () => void;
}

export const ActivityFeedWidget: React.FC<ActivityFeedWidgetProps> = ({
  activities,
  maxItems = 5,
  onViewAll,
}) => {
  const displayItems = activities.slice(0, maxItems);

  const listStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const itemStyle = (severity: string = 'normal'): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: severity === 'critical' ? colors.semantic.danger.bg :
                     severity === 'warning' ? colors.semantic.warning.bg :
                     severity === 'success' ? colors.semantic.success.bg :
                     'transparent',
    borderRadius: borderRadius.md,
    transition: 'background-color 0.2s ease',
  });

  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    fontSize: '1rem',
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.text.primary,
    lineHeight: 1.3,
  };

  const descStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.secondary,
    marginTop: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const timeStyle: React.CSSProperties = {
    fontSize: '0.6875rem',
    color: colors.text.tertiary,
    flexShrink: 0,
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  const emptyStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '32px',
    color: colors.text.tertiary,
    fontSize: '0.875rem',
  };

  return (
    <WidgetContainer
      title="활동 기록"
      icon="📋"
      action={onViewAll ? { label: '전체보기', onClick: onViewAll } : undefined}
      noPadding
    >
      {displayItems.length === 0 ? (
        <div style={emptyStyle}>아직 활동 기록이 없습니다</div>
      ) : (
        <div style={listStyle}>
          {displayItems.map((item) => (
            <div key={item.id} style={itemStyle(item.severity)}>
              <div style={iconContainerStyle}>{item.icon}</div>
              <div style={contentStyle}>
                <div style={titleStyle}>{item.title}</div>
                {item.description && (
                  <div style={descStyle}>{item.description}</div>
                )}
              </div>
              <span style={timeStyle}>{formatTime(item.timestamp)}</span>
            </div>
          ))}
        </div>
      )}
    </WidgetContainer>
  );
};

// ============================================
// 캘린더/일정 위젯
// ============================================

export interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  icon?: string;
  type: 'deadline' | 'meeting' | 'milestone' | 'payment' | 'other';
}

export interface CalendarWidgetProps {
  currentDay: number;
  currentWeek: number;
  events?: CalendarEvent[];
  onDayClick?: (day: number) => void;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  currentDay,
  currentWeek,
  events = [],
  onDayClick,
}) => {
  // 일주일 표시 (현재 주)
  const weekDays = ['월', '화', '수', '목', '금', '토', '일'];
  const startDay = (currentWeek - 1) * 7 + 1;

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  };

  const weekLabelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: colors.text.primary,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  };

  const dayHeaderStyle: React.CSSProperties = {
    fontSize: '0.6875rem',
    color: colors.text.tertiary,
    textAlign: 'center',
    padding: '4px',
  };

  const dayStyle = (dayNum: number, isCurrentDay: boolean, hasEvent: boolean): React.CSSProperties => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: '1',
    backgroundColor: isCurrentDay ? colors.primary.main : hasEvent ? colors.background.tertiary : 'transparent',
    borderRadius: borderRadius.md,
    cursor: onDayClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
  });

  const dayNumStyle = (isCurrentDay: boolean): React.CSSProperties => ({
    fontSize: '0.875rem',
    fontWeight: isCurrentDay ? 700 : 500,
    color: isCurrentDay ? '#FFFFFF' : colors.text.primary,
  });

  const eventDotStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '4px',
    width: '4px',
    height: '4px',
    backgroundColor: colors.semantic.warning.main,
    borderRadius: '50%',
  };

  // 해당 주의 이벤트들
  const upcomingStyle: React.CSSProperties = {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: `1px solid ${colors.border.default}`,
  };

  const upcomingTitleStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.tertiary,
    marginBottom: '8px',
  };

  const eventItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
    marginBottom: '4px',
    fontSize: '0.8125rem',
  };

  const eventIconStyle: React.CSSProperties = {
    fontSize: '1rem',
  };

  const eventTypeIcons: Record<string, string> = {
    deadline: '⏰',
    meeting: '📅',
    milestone: '🎯',
    payment: '💳',
    other: '📌',
  };

  const upcomingEvents = events.filter(e => e.day >= currentDay).slice(0, 3);

  return (
    <WidgetContainer title="일정" icon="📆">
      <div style={headerStyle}>
        <span style={weekLabelStyle}>Week {currentWeek}</span>
      </div>

      <div style={gridStyle}>
        {weekDays.map((day) => (
          <div key={day} style={dayHeaderStyle}>{day}</div>
        ))}
        {weekDays.map((_, idx) => {
          const dayNum = startDay + idx;
          const isCurrentDay = dayNum === currentDay;
          const dayEvents = events.filter(e => e.day === dayNum);
          const hasEvent = dayEvents.length > 0;

          return (
            <div
              key={dayNum}
              style={dayStyle(dayNum, isCurrentDay, hasEvent)}
              onClick={() => onDayClick?.(dayNum)}
            >
              <span style={dayNumStyle(isCurrentDay)}>{dayNum}</span>
              {hasEvent && !isCurrentDay && <span style={eventDotStyle} />}
            </div>
          );
        })}
      </div>

      {upcomingEvents.length > 0 && (
        <div style={upcomingStyle}>
          <div style={upcomingTitleStyle}>다가오는 일정</div>
          {upcomingEvents.map((event) => (
            <div key={event.id} style={eventItemStyle}>
              <span style={eventIconStyle}>
                {event.icon || eventTypeIcons[event.type]}
              </span>
              <span style={{ flex: 1, color: colors.text.primary }}>{event.title}</span>
              <span style={{ color: colors.text.tertiary, fontSize: '0.75rem' }}>
                Day {event.day}
              </span>
            </div>
          ))}
        </div>
      )}
    </WidgetContainer>
  );
};

// ============================================
// 사용자 통계 위젯
// ============================================

export interface UserStatsWidgetProps {
  totalUsers: number;
  premiumUsers: number;
  activeUsers: number;
  churnRate: number;
  userGrowth?: number[];
  onDetails?: () => void;
}

export const UserStatsWidget: React.FC<UserStatsWidgetProps> = ({
  totalUsers,
  premiumUsers,
  activeUsers,
  churnRate,
  userGrowth = [],
  onDetails,
}) => {
  const conversionRate = totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;
  const retentionRate = 100 - churnRate;

  const mainMetricStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    marginBottom: '16px',
  };

  const bigNumberStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: colors.text.primary,
    fontFamily: '"JetBrains Mono", monospace',
  };

  const growthStyle = (positive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: positive ? colors.semantic.success.bg : colors.semantic.danger.bg,
    color: positive ? colors.semantic.success.main : colors.semantic.danger.main,
    borderRadius: borderRadius.sm,
    fontSize: '0.75rem',
    fontWeight: 600,
  });

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  };

  const statItemStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '12px',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: '0.6875rem',
    color: colors.text.tertiary,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: colors.text.primary,
  };

  // 간단한 성장 표시
  const lastGrowth = userGrowth.length >= 2
    ? userGrowth[userGrowth.length - 1] - userGrowth[userGrowth.length - 2]
    : 0;

  return (
    <WidgetContainer
      title="사용자 현황"
      icon="👥"
      action={onDetails ? { label: '분석', onClick: onDetails } : undefined}
    >
      <div style={mainMetricStyle}>
        <span style={bigNumberStyle}>{formatNumber(totalUsers)}</span>
        {lastGrowth !== 0 && (
          <span style={growthStyle(lastGrowth > 0)}>
            {lastGrowth > 0 ? '↑' : '↓'} {Math.abs(lastGrowth)}
          </span>
        )}
      </div>

      <div style={gridStyle}>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>⭐ 프리미엄</span>
          <span style={statValueStyle}>{formatNumber(premiumUsers)}</span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>📊 전환율</span>
          <span style={statValueStyle}>{formatPercent(conversionRate)}</span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>🟢 활성</span>
          <span style={statValueStyle}>{formatNumber(activeUsers)}</span>
        </div>
        <div style={statItemStyle}>
          <span style={statLabelStyle}>💪 유지율</span>
          <span style={{
            ...statValueStyle,
            color: retentionRate >= 80 ? colors.semantic.success.main :
                   retentionRate >= 60 ? colors.semantic.warning.main :
                   colors.semantic.danger.main
          }}>
            {formatPercent(retentionRate)}
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};

// ============================================
// 서버/시스템 상태 위젯
// ============================================

export interface ServerStatsWidgetProps {
  serverHealth: number;
  uptime: number;
  responseTime: number;
  errorRate: number;
  technicalDebt: number;
  onAlert?: () => void;
}

export const ServerStatsWidget: React.FC<ServerStatsWidgetProps> = ({
  serverHealth,
  uptime,
  responseTime,
  errorRate,
  technicalDebt,
  onAlert,
}) => {
  const getHealthStatus = () => {
    if (serverHealth >= 80) return { label: '양호', color: colors.semantic.success.main, icon: '🟢' };
    if (serverHealth >= 50) return { label: '주의', color: colors.semantic.warning.main, icon: '🟡' };
    return { label: '위험', color: colors.semantic.danger.main, icon: '🔴' };
  };

  const status = getHealthStatus();

  const headerMetricStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    backgroundColor: serverHealth < 50 ? colors.semantic.danger.bg : colors.background.tertiary,
    borderRadius: borderRadius.md,
    marginBottom: '16px',
  };

  const statusStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const statusTextStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 600,
    color: status.color,
  };

  const healthBarContainer: React.CSSProperties = {
    flex: 1,
    maxWidth: '120px',
    height: '8px',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginLeft: '16px',
  };

  const healthBarFill: React.CSSProperties = {
    width: `${serverHealth}%`,
    height: '100%',
    backgroundColor: status.color,
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  };

  const metricStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
  };

  const metricLabelStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.secondary,
  };

  const metricValueStyle = (good: boolean, bad: boolean = false): React.CSSProperties => ({
    fontSize: '0.875rem',
    fontWeight: 600,
    color: bad ? colors.semantic.danger.main : good ? colors.semantic.success.main : colors.text.primary,
  });

  return (
    <WidgetContainer
      title="서버 상태"
      icon="🖥️"
      action={onAlert && serverHealth < 70 ? { label: '알림', onClick: onAlert } : undefined}
    >
      <div style={headerMetricStyle}>
        <div style={statusStyle}>
          <span>{status.icon}</span>
          <span style={statusTextStyle}>{status.label}</span>
        </div>
        <div style={healthBarContainer}>
          <div style={healthBarFill} />
        </div>
        <span style={{ marginLeft: '8px', fontWeight: 600, color: status.color }}>
          {serverHealth}%
        </span>
      </div>

      <div style={gridStyle}>
        <div style={metricStyle}>
          <span style={metricLabelStyle}>가동률</span>
          <span style={metricValueStyle(uptime >= 99.5, uptime < 95)}>
            {uptime.toFixed(2)}%
          </span>
        </div>
        <div style={metricStyle}>
          <span style={metricLabelStyle}>응답시간</span>
          <span style={metricValueStyle(responseTime < 200, responseTime > 500)}>
            {responseTime}ms
          </span>
        </div>
        <div style={metricStyle}>
          <span style={metricLabelStyle}>에러율</span>
          <span style={metricValueStyle(errorRate < 1, errorRate > 5)}>
            {errorRate.toFixed(2)}%
          </span>
        </div>
        <div style={metricStyle}>
          <span style={metricLabelStyle}>기술부채</span>
          <span style={metricValueStyle(technicalDebt < 30, technicalDebt > 70)}>
            {technicalDebt}%
          </span>
        </div>
      </div>
    </WidgetContainer>
  );
};

// ============================================
// 플레이어 스탯 요약 위젯
// ============================================

export interface PlayerStatsWidgetProps {
  energy: number;
  maxEnergy: number;
  stress: number;
  health: number;
  skills: {
    coding: number;
    business: number;
    marketing: number;
  };
  onRest?: () => void;
}

export const PlayerStatsWidget: React.FC<PlayerStatsWidgetProps> = ({
  energy,
  maxEnergy,
  stress,
  health,
  skills,
  onRest,
}) => {
  const energyPercent = (energy / maxEnergy) * 100;

  const barContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '16px',
  };

  const barRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const barLabelStyle: React.CSSProperties = {
    width: '60px',
    fontSize: '0.75rem',
    color: colors.text.secondary,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  };

  const barTrackStyle: React.CSSProperties = {
    flex: 1,
    height: '8px',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  };

  const barFillStyle = (value: number, color: string): React.CSSProperties => ({
    width: `${value}%`,
    height: '100%',
    backgroundColor: color,
    borderRadius: borderRadius.full,
    transition: 'width 0.3s ease',
  });

  const valueStyle: React.CSSProperties = {
    width: '40px',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.text.primary,
    textAlign: 'right',
  };

  const skillsStyle: React.CSSProperties = {
    paddingTop: '12px',
    borderTop: `1px solid ${colors.border.default}`,
  };

  const skillsTitleStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.tertiary,
    marginBottom: '8px',
  };

  const skillsGridStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
  };

  const skillBadgeStyle = (level: number): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    gap: '4px',
  });

  const skillIconStyle: React.CSSProperties = {
    fontSize: '1.25rem',
  };

  const skillValueStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: colors.text.primary,
  };

  return (
    <WidgetContainer
      title="상태"
      icon="🧘"
      action={onRest && energy < 30 ? { label: '휴식', onClick: onRest } : undefined}
    >
      <div style={barContainerStyle}>
        <div style={barRowStyle}>
          <span style={barLabelStyle}>⚡ 에너지</span>
          <div style={barTrackStyle}>
            <div style={barFillStyle(energyPercent, getEnergyColor(energyPercent))} />
          </div>
          <span style={valueStyle}>{energy}/{maxEnergy}</span>
        </div>

        <div style={barRowStyle}>
          <span style={barLabelStyle}>😰 스트레스</span>
          <div style={barTrackStyle}>
            <div style={barFillStyle(stress, getStressColor(stress))} />
          </div>
          <span style={valueStyle}>{stress}%</span>
        </div>

        <div style={barRowStyle}>
          <span style={barLabelStyle}>❤️ 건강</span>
          <div style={barTrackStyle}>
            <div style={barFillStyle(health, getEnergyColor(health))} />
          </div>
          <span style={valueStyle}>{health}%</span>
        </div>
      </div>

      <div style={skillsStyle}>
        <div style={skillsTitleStyle}>스킬 레벨</div>
        <div style={skillsGridStyle}>
          <div style={skillBadgeStyle(skills.coding)}>
            <span style={skillIconStyle}>💻</span>
            <span style={skillValueStyle}>{skills.coding}</span>
          </div>
          <div style={skillBadgeStyle(skills.business)}>
            <span style={skillIconStyle}>💼</span>
            <span style={skillValueStyle}>{skills.business}</span>
          </div>
          <div style={skillBadgeStyle(skills.marketing)}>
            <span style={skillIconStyle}>📣</span>
            <span style={skillValueStyle}>{skills.marketing}</span>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
};

// ============================================
// 빠른 행동 위젯
// ============================================

export interface QuickAction {
  id: string;
  icon: string;
  label: string;
  energyCost?: number;
  disabled?: boolean;
  hotkey?: string;
  onClick: () => void;
}

export interface QuickActionsWidgetProps {
  actions: QuickAction[];
  currentEnergy: number;
}

export const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({
  actions,
  currentEnergy,
}) => {
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
  };

  const actionStyle = (disabled: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 8px',
    backgroundColor: disabled ? colors.background.tertiary : colors.background.elevated,
    border: `1px solid ${disabled ? colors.border.default : colors.border.light}`,
    borderRadius: borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s ease',
  });

  const iconStyle: React.CSSProperties = {
    fontSize: '1.5rem',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.6875rem',
    color: colors.text.secondary,
    textAlign: 'center',
  };

  const costStyle = (canAfford: boolean): React.CSSProperties => ({
    fontSize: '0.625rem',
    color: canAfford ? colors.text.tertiary : colors.semantic.danger.main,
  });

  const hotkeyStyle: React.CSSProperties = {
    position: 'absolute',
    top: '4px',
    right: '4px',
    fontSize: '0.5rem',
    color: colors.text.tertiary,
    backgroundColor: colors.background.card,
    padding: '1px 4px',
    borderRadius: '2px',
  };

  return (
    <WidgetContainer title="빠른 행동" icon="⚡">
      <div style={gridStyle}>
        {actions.map((action) => {
          const canAfford = !action.energyCost || currentEnergy >= action.energyCost;
          const disabled = action.disabled || !canAfford;

          return (
            <button
              key={action.id}
              type="button"
              disabled={disabled}
              onClick={action.onClick}
              style={{ ...actionStyle(disabled), position: 'relative' }}
            >
              {action.hotkey && <span style={hotkeyStyle}>{action.hotkey}</span>}
              <span style={iconStyle}>{action.icon}</span>
              <span style={labelStyle}>{action.label}</span>
              {action.energyCost && (
                <span style={costStyle(canAfford)}>⚡{action.energyCost}</span>
              )}
            </button>
          );
        })}
      </div>
    </WidgetContainer>
  );
};

export default {
  WidgetContainer,
  FinanceWidget,
  ActivityFeedWidget,
  CalendarWidget,
  UserStatsWidget,
  ServerStatsWidget,
  PlayerStatsWidget,
  QuickActionsWidget,
};
