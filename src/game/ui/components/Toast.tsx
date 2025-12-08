/**
 * Chapter 4: UI/UX Excellence - Toast Notification System
 * 토스트 알림 시스템 컴포넌트
 */

'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { colors, shadows, borderRadius, zIndex, durations, easings, formatCurrency } from '../designTokens';

// ============================================
// 타입 정의
// ============================================

export type ToastType = 'success' | 'warning' | 'danger' | 'info' | 'achievement' | 'milestone';
export type ToastPosition = 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center';

export interface ToastData {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  icon?: string;
  duration?: number;
  progress?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export interface ToastContextValue {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  success: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  danger: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  achievement: (title: string, message?: string) => string;
  milestone: (title: string, message?: string) => string;
  moneyChange: (amount: number, reason?: string) => string;
  statChange: (stat: string, value: number, icon?: string) => string;
}

// ============================================
// 토스트 스타일
// ============================================

const toastStyles: Record<ToastType, {
  bg: string;
  border: string;
  icon: string;
  iconBg: string;
  glow?: string;
}> = {
  success: {
    bg: colors.background.elevated,
    border: colors.semantic.success.main,
    icon: '✓',
    iconBg: colors.semantic.success.bg,
    glow: shadows.glow.success,
  },
  warning: {
    bg: colors.background.elevated,
    border: colors.semantic.warning.main,
    icon: '⚠',
    iconBg: colors.semantic.warning.bg,
    glow: shadows.glow.warning,
  },
  danger: {
    bg: colors.background.elevated,
    border: colors.semantic.danger.main,
    icon: '✕',
    iconBg: colors.semantic.danger.bg,
    glow: shadows.glow.danger,
  },
  info: {
    bg: colors.background.elevated,
    border: colors.semantic.info.main,
    icon: 'ℹ',
    iconBg: colors.semantic.info.bg,
    glow: shadows.glow.info,
  },
  achievement: {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #312e81 100%)',
    border: '#A855F7',
    icon: '🏆',
    iconBg: 'rgba(168, 85, 247, 0.2)',
    glow: '0 0 30px rgba(168, 85, 247, 0.5)',
  },
  milestone: {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #064e3b 100%)',
    border: '#10B981',
    icon: '🎯',
    iconBg: 'rgba(16, 185, 129, 0.2)',
    glow: shadows.glow.success,
  },
};

// ============================================
// 개별 토스트 컴포넌트
// ============================================

interface ToastItemProps {
  toast: ToastData;
  onRemove: () => void;
  position: ToastPosition;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  const style = toastStyles[toast.type];
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    // 진입 애니메이션
    requestAnimationFrame(() => setIsVisible(true));

    // 자동 닫기
    if (duration > 0) {
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          handleClose();
        }
      }, 50);

      return () => clearInterval(progressInterval);
    }
  }, [duration]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      toast.onClose?.();
      onRemove();
    }, 200);
  }, [toast, onRemove]);

  const getSlideDirection = () => {
    if (position.includes('right')) return isVisible && !isExiting ? 0 : 100;
    if (position.includes('center')) return 0;
    return isVisible && !isExiting ? 0 : -100;
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '320px',
    maxWidth: '420px',
    background: style.bg,
    borderRadius: borderRadius.lg,
    border: `1px solid ${style.border}`,
    boxShadow: `${shadows.xl}, ${style.glow || 'none'}`,
    overflow: 'hidden',
    transform: `translateX(${getSlideDirection()}%)`,
    opacity: isVisible && !isExiting ? 1 : 0,
    transition: `transform 0.3s ${easings.easeOut}, opacity 0.2s ease`,
    pointerEvents: 'auto',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
  };

  const iconContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: style.iconBg,
    borderRadius: borderRadius.md,
    fontSize: '1.25rem',
    flexShrink: 0,
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: colors.text.primary,
    lineHeight: 1.3,
  };

  const messageStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: colors.text.secondary,
    lineHeight: 1.4,
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '24px',
    height: '24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: borderRadius.sm,
    color: colors.text.tertiary,
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s ease',
    flexShrink: 0,
  };

  const actionButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    margin: '0 16px 12px',
    backgroundColor: style.border,
    color: '#FFFFFF',
    border: 'none',
    borderRadius: borderRadius.md,
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  };

  const progressStyle: React.CSSProperties = {
    height: '3px',
    backgroundColor: colors.background.tertiary,
  };

  const progressBarStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: style.border,
    width: `${progress}%`,
    transition: 'width 0.05s linear',
  };

  return (
    <div style={containerStyle} role="alert" aria-live="polite">
      <div style={headerStyle}>
        <div style={iconContainerStyle}>
          {toast.icon || style.icon}
        </div>

        <div style={contentStyle}>
          <div style={titleStyle}>{toast.title}</div>
          {toast.message && <div style={messageStyle}>{toast.message}</div>}
        </div>

        <button
          type="button"
          onClick={handleClose}
          style={closeButtonStyle}
          aria-label="알림 닫기"
        >
          ✕
        </button>
      </div>

      {toast.action && (
        <button
          type="button"
          onClick={() => {
            toast.action!.onClick();
            handleClose();
          }}
          style={actionButtonStyle}
        >
          {toast.action.label}
        </button>
      )}

      {toast.progress !== false && duration > 0 && (
        <div style={progressStyle}>
          <div style={progressBarStyle} />
        </div>
      )}
    </div>
  );
};

// ============================================
// 토스트 컨테이너 컴포넌트
// ============================================

export interface ToastContainerProps {
  position?: ToastPosition;
  maxVisible?: number;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  maxVisible = 5,
}) => {
  const { toasts } = useToast();

  const visibleToasts = toasts.slice(0, maxVisible);

  const getPositionStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '20px',
      zIndex: zIndex.toast,
      pointerEvents: 'none',
    };

    switch (position) {
      case 'top-right':
        return { ...base, top: 0, right: 0 };
      case 'top-center':
        return { ...base, top: 0, left: '50%', transform: 'translateX(-50%)' };
      case 'bottom-right':
        return { ...base, bottom: 0, right: 0, flexDirection: 'column-reverse' };
      case 'bottom-center':
        return { ...base, bottom: 0, left: '50%', transform: 'translateX(-50%)', flexDirection: 'column-reverse' };
      default:
        return { ...base, top: 0, right: 0 };
    }
  };

  const { removeToast } = useToast();

  return (
    <div style={getPositionStyle()}>
      {visibleToasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
          position={position}
        />
      ))}
    </div>
  );
};

// ============================================
// 토스트 Context
// ============================================

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

let toastIdCounter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, 'id'>): string => {
    const id = `toast-${++toastIdCounter}-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // 편의 메서드들
  const success = useCallback((title: string, message?: string) => {
    return addToast({ type: 'success', title, message });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    return addToast({ type: 'warning', title, message });
  }, [addToast]);

  const danger = useCallback((title: string, message?: string) => {
    return addToast({ type: 'danger', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    return addToast({ type: 'info', title, message });
  }, [addToast]);

  const achievement = useCallback((title: string, message?: string) => {
    return addToast({
      type: 'achievement',
      title,
      message,
      duration: 8000,
      icon: '🏆',
    });
  }, [addToast]);

  const milestone = useCallback((title: string, message?: string) => {
    return addToast({
      type: 'milestone',
      title,
      message,
      duration: 6000,
      icon: '🎯',
    });
  }, [addToast]);

  const moneyChange = useCallback((amount: number, reason?: string) => {
    const isPositive = amount > 0;
    return addToast({
      type: isPositive ? 'success' : 'danger',
      title: `${isPositive ? '+' : ''}${formatCurrency(amount, 'compact')}`,
      message: reason,
      icon: '💰',
      duration: 3000,
    });
  }, [addToast]);

  const statChange = useCallback((stat: string, value: number, icon?: string) => {
    const isPositive = value > 0;
    return addToast({
      type: isPositive ? 'success' : 'warning',
      title: `${stat} ${isPositive ? '+' : ''}${value}`,
      icon: icon || (isPositive ? '📈' : '📉'),
      duration: 3000,
    });
  }, [addToast]);

  const value: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    warning,
    danger,
    info,
    achievement,
    milestone,
    moneyChange,
    statChange,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

// ============================================
// 특수 알림 컴포넌트
// ============================================

// 업적 달성 알림
export interface AchievementNotificationProps {
  title: string;
  description: string;
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  onClose?: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  title,
  description,
  icon = '🏆',
  rarity = 'common',
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 6000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const rarityColors: Record<string, { border: string; glow: string; badge: string }> = {
    common: { border: '#6B7280', glow: 'rgba(107, 114, 128, 0.4)', badge: '#6B7280' },
    rare: { border: '#3B82F6', glow: 'rgba(59, 130, 246, 0.4)', badge: '#3B82F6' },
    epic: { border: '#A855F7', glow: 'rgba(168, 85, 247, 0.4)', badge: '#A855F7' },
    legendary: { border: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)', badge: '#F59E0B' },
  };

  const colors = rarityColors[rarity];

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) scale(${isVisible ? 1 : 0.8})`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    padding: '32px 48px',
    background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(49, 46, 129, 0.98) 100%)',
    borderRadius: borderRadius.xl,
    border: `2px solid ${colors.border}`,
    boxShadow: `0 0 60px ${colors.glow}`,
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.3s ease',
    zIndex: zIndex.overlay,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '4rem',
    animation: 'bounce 0.6s ease infinite',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#FFFFFF',
    textAlign: 'center',
  };

  const descStyle: React.CSSProperties = {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  };

  const badgeStyle: React.CSSProperties = {
    padding: '4px 12px',
    backgroundColor: colors.badge,
    color: '#FFFFFF',
    borderRadius: borderRadius.full,
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: zIndex.modalBackdrop,
        }}
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose?.(), 300);
        }}
      />

      <div style={containerStyle}>
        <span style={badgeStyle}>{rarity}</span>
        <div style={iconStyle}>{icon}</div>
        <div style={titleStyle}>🎉 {title}</div>
        <div style={descStyle}>{description}</div>
      </div>
    </>
  );
};

// 마일스톤 달성 알림
export interface MilestoneNotificationProps {
  title: string;
  value: string | number;
  icon?: string;
  onClose?: () => void;
}

export const MilestoneNotification: React.FC<MilestoneNotificationProps> = ({
  title,
  value,
  icon = '🎯',
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20%',
    left: '50%',
    transform: `translateX(-50%) translateY(${isVisible ? 0 : -20}px)`,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '20px 32px',
    background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(6, 95, 70, 0.95) 100%)',
    borderRadius: borderRadius.xl,
    border: `2px solid ${colors.semantic.success.main}`,
    boxShadow: `${shadows.xl}, ${shadows.glow.success}`,
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.4s ease',
    zIndex: zIndex.toast,
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '2.5rem',
  };

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: colors.semantic.success.light,
    fontWeight: 500,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#FFFFFF',
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>{icon}</div>
      <div style={contentStyle}>
        <div style={labelStyle}>{title}</div>
        <div style={valueStyle}>{value}</div>
      </div>
    </div>
  );
};

export default ToastContainer;
