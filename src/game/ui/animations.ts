/**
 * Chapter 4: UI/UX Excellence - Animation System
 * 애니메이션 유틸리티 및 훅
 */

import { useCallback, useRef, useEffect, useState } from 'react';
import { easings, durations } from './designTokens';

// ============================================
// Easing 함수들
// ============================================

export const easingFunctions = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - (--t) * t * t * t,
  easeInOutQuart: (t: number) =>
    t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
  easeInExpo: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t: number) =>
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? Math.pow(2, 20 * t - 10) / 2
          : (2 - Math.pow(2, -20 * t + 10)) / 2,
  easeOutBounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  easeInBounce: (t: number) => 1 - easingFunctions.easeOutBounce(1 - t),
  easeInOutBounce: (t: number) =>
    t < 0.5
      ? (1 - easingFunctions.easeOutBounce(1 - 2 * t)) / 2
      : (1 + easingFunctions.easeOutBounce(2 * t - 1)) / 2,
  easeOutElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeInElastic: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0
      ? 0
      : t === 1
        ? 1
        : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
  },
};

export type EasingFunction = keyof typeof easingFunctions;

// ============================================
// 애니메이션 유틸리티 함수
// ============================================

export interface AnimateOptions {
  from: number;
  to: number;
  duration: number;
  easing?: EasingFunction;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}

export function animate(options: AnimateOptions): () => void {
  const {
    from,
    to,
    duration,
    easing = 'easeOutCubic',
    onUpdate,
    onComplete,
  } = options;

  const startTime = performance.now();
  const easingFn = easingFunctions[easing];
  let animationId: number;

  const tick = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easingFn(progress);
    const currentValue = from + (to - from) * easedProgress;

    onUpdate(currentValue);

    if (progress < 1) {
      animationId = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  };

  animationId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(animationId);
}

// ============================================
// 숫자 애니메이션 훅
// ============================================

export interface UseAnimatedNumberOptions {
  duration?: number;
  easing?: EasingFunction;
  formatFn?: (value: number) => string;
  delay?: number;
}

export function useAnimatedNumber(
  value: number,
  options: UseAnimatedNumberOptions = {}
): number {
  const {
    duration = 300,
    easing = 'easeOutCubic',
    delay = 0,
  } = options;

  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Cancel any ongoing animation
    if (cancelRef.current) {
      cancelRef.current();
    }

    const startAnimation = () => {
      cancelRef.current = animate({
        from: prevValueRef.current,
        to: value,
        duration,
        easing,
        onUpdate: setDisplayValue,
        onComplete: () => {
          prevValueRef.current = value;
        },
      });
    };

    if (delay > 0) {
      const timeoutId = setTimeout(startAnimation, delay);
      return () => {
        clearTimeout(timeoutId);
        if (cancelRef.current) cancelRef.current();
      };
    }

    startAnimation();

    return () => {
      if (cancelRef.current) cancelRef.current();
    };
  }, [value, duration, easing, delay]);

  return displayValue;
}

// ============================================
// 스프링 애니메이션 훅
// ============================================

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const springPresets: Record<string, SpringConfig> = {
  default: { stiffness: 100, damping: 10, mass: 1 },
  gentle: { stiffness: 120, damping: 14, mass: 1 },
  wobbly: { stiffness: 180, damping: 12, mass: 1 },
  stiff: { stiffness: 210, damping: 20, mass: 1 },
  slow: { stiffness: 280, damping: 60, mass: 1 },
  molasses: { stiffness: 280, damping: 120, mass: 1 },
};

export function useSpring(
  target: number,
  config: SpringConfig | keyof typeof springPresets = 'default'
): number {
  const [value, setValue] = useState(target);
  const velocityRef = useRef(0);
  const targetRef = useRef(target);
  const animationRef = useRef<number>();

  const springConfig = typeof config === 'string' ? springPresets[config] : config;

  useEffect(() => {
    targetRef.current = target;

    const tick = () => {
      const { stiffness, damping, mass } = springConfig;
      const displacement = value - targetRef.current;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * velocityRef.current;
      const acceleration = (springForce + dampingForce) / mass;

      velocityRef.current += acceleration * (1 / 60);
      const nextValue = value + velocityRef.current * (1 / 60);

      setValue(nextValue);

      // Check if animation is complete (settled)
      if (Math.abs(velocityRef.current) < 0.001 && Math.abs(displacement) < 0.001) {
        setValue(targetRef.current);
        return;
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [target, springConfig, value]);

  return value;
}

// ============================================
// 페이드 애니메이션 훅
// ============================================

export interface UseFadeOptions {
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
}

export function useFade(
  visible: boolean,
  options: UseFadeOptions = {}
): { opacity: number; shouldRender: boolean } {
  const { duration = 200, delay = 0, easing = 'easeOutCubic' } = options;

  const [opacity, setOpacity] = useState(visible ? 1 : 0);
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let cancel: (() => void) | null = null;

    if (visible) {
      setShouldRender(true);
      timeoutId = setTimeout(() => {
        cancel = animate({
          from: 0,
          to: 1,
          duration,
          easing,
          onUpdate: setOpacity,
        });
      }, delay);
    } else {
      cancel = animate({
        from: 1,
        to: 0,
        duration,
        easing,
        onUpdate: setOpacity,
        onComplete: () => setShouldRender(false),
      });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (cancel) cancel();
    };
  }, [visible, duration, delay, easing]);

  return { opacity, shouldRender };
}

// ============================================
// 슬라이드 애니메이션 훅
// ============================================

export type SlideDirection = 'up' | 'down' | 'left' | 'right';

export interface UseSlideOptions {
  duration?: number;
  delay?: number;
  distance?: number;
  easing?: EasingFunction;
}

export function useSlide(
  visible: boolean,
  direction: SlideDirection = 'up',
  options: UseSlideOptions = {}
): { transform: string; opacity: number; shouldRender: boolean } {
  const { duration = 300, delay = 0, distance = 20, easing = 'easeOutCubic' } = options;

  const [progress, setProgress] = useState(visible ? 1 : 0);
  const [shouldRender, setShouldRender] = useState(visible);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let cancel: (() => void) | null = null;

    if (visible) {
      setShouldRender(true);
      timeoutId = setTimeout(() => {
        cancel = animate({
          from: 0,
          to: 1,
          duration,
          easing,
          onUpdate: setProgress,
        });
      }, delay);
    } else {
      cancel = animate({
        from: 1,
        to: 0,
        duration,
        easing,
        onUpdate: setProgress,
        onComplete: () => setShouldRender(false),
      });
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (cancel) cancel();
    };
  }, [visible, duration, delay, easing]);

  const getTransform = () => {
    const offset = (1 - progress) * distance;
    switch (direction) {
      case 'up': return `translateY(${offset}px)`;
      case 'down': return `translateY(${-offset}px)`;
      case 'left': return `translateX(${offset}px)`;
      case 'right': return `translateX(${-offset}px)`;
      default: return 'none';
    }
  };

  return {
    transform: getTransform(),
    opacity: progress,
    shouldRender,
  };
}

// ============================================
// 시퀀스 애니메이션 훅
// ============================================

export interface UseStaggerOptions {
  staggerDelay?: number;
  duration?: number;
  easing?: EasingFunction;
}

export function useStagger(
  itemCount: number,
  visible: boolean,
  options: UseStaggerOptions = {}
): number[] {
  const { staggerDelay = 50, duration = 200, easing = 'easeOutCubic' } = options;

  const [progresses, setProgresses] = useState<number[]>(
    Array(itemCount).fill(visible ? 1 : 0)
  );

  useEffect(() => {
    const cancels: (() => void)[] = [];
    const timeouts: NodeJS.Timeout[] = [];

    if (visible) {
      for (let i = 0; i < itemCount; i++) {
        const timeout = setTimeout(() => {
          const cancel = animate({
            from: 0,
            to: 1,
            duration,
            easing,
            onUpdate: (value) => {
              setProgresses((prev) => {
                const next = [...prev];
                next[i] = value;
                return next;
              });
            },
          });
          cancels.push(cancel);
        }, i * staggerDelay);
        timeouts.push(timeout);
      }
    } else {
      // Reverse stagger for exit
      for (let i = itemCount - 1; i >= 0; i--) {
        const timeout = setTimeout(() => {
          const cancel = animate({
            from: 1,
            to: 0,
            duration,
            easing,
            onUpdate: (value) => {
              setProgresses((prev) => {
                const next = [...prev];
                next[i] = value;
                return next;
              });
            },
          });
          cancels.push(cancel);
        }, (itemCount - 1 - i) * staggerDelay);
        timeouts.push(timeout);
      }
    }

    return () => {
      timeouts.forEach(clearTimeout);
      cancels.forEach((cancel) => cancel());
    };
  }, [itemCount, visible, staggerDelay, duration, easing]);

  return progresses;
}

// ============================================
// 펄스/글로우 애니메이션 훅
// ============================================

export interface UsePulseOptions {
  duration?: number;
  minOpacity?: number;
  maxOpacity?: number;
}

export function usePulse(
  active: boolean,
  options: UsePulseOptions = {}
): number {
  const { duration = 1000, minOpacity = 0.5, maxOpacity = 1 } = options;
  const [opacity, setOpacity] = useState(maxOpacity);

  useEffect(() => {
    if (!active) {
      setOpacity(maxOpacity);
      return;
    }

    let phase = 0;
    const tick = () => {
      phase += (1000 / 60) / duration;
      if (phase > 1) phase -= 1;

      // Sine wave for smooth pulsing
      const value = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5;
      setOpacity(minOpacity + value * (maxOpacity - minOpacity));
    };

    const intervalId = setInterval(tick, 1000 / 60);
    return () => clearInterval(intervalId);
  }, [active, duration, minOpacity, maxOpacity]);

  return opacity;
}

// ============================================
// 진동/쉐이크 애니메이션 훅
// ============================================

export interface UseShakeOptions {
  intensity?: number;
  duration?: number;
}

export function useShake(
  trigger: number,
  options: UseShakeOptions = {}
): number {
  const { intensity = 5, duration = 500 } = options;
  const [offset, setOffset] = useState(0);
  const prevTriggerRef = useRef(trigger);

  useEffect(() => {
    if (trigger === prevTriggerRef.current) return;
    prevTriggerRef.current = trigger;

    const startTime = performance.now();
    let animationId: number;

    const tick = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Decaying oscillation
      const decay = 1 - progress;
      const oscillation = Math.sin(progress * Math.PI * 8) * decay;
      setOffset(oscillation * intensity);

      if (progress < 1) {
        animationId = requestAnimationFrame(tick);
      } else {
        setOffset(0);
      }
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [trigger, intensity, duration]);

  return offset;
}

// ============================================
// 카운트다운 애니메이션 훅
// ============================================

export function useCountdown(
  initialSeconds: number,
  autoStart = false
): {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
} {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => Math.max(0, s - 1));
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, seconds]);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setSeconds(initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  return { seconds, isRunning, start, pause, reset };
}

// ============================================
// CSS 애니메이션 키프레임 (인라인 스타일 삽입용)
// ============================================

export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  slideInUp: `
    @keyframes slideInUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  slideInDown: `
    @keyframes slideInDown {
      from { transform: translateY(-20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  slideInLeft: `
    @keyframes slideInLeft {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  slideInRight: `
    @keyframes slideInRight {
      from { transform: translateX(20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { transform: scale(0.9); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,
  scaleOut: `
    @keyframes scaleOut {
      from { transform: scale(1); opacity: 1; }
      to { transform: scale(0.9); opacity: 0; }
    }
  `,
  bounce: `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  shake: `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
  glow: `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px currentColor; }
      50% { box-shadow: 0 0 20px currentColor; }
    }
  `,
};

// 키프레임 스타일 삽입 함수
export function injectKeyframes(): void {
  if (typeof document === 'undefined') return;

  const styleId = 'vocavision-animations';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = Object.values(keyframes).join('\n');
  document.head.appendChild(style);
}

export default {
  easingFunctions,
  springPresets,
  animate,
  useAnimatedNumber,
  useSpring,
  useFade,
  useSlide,
  useStagger,
  usePulse,
  useShake,
  useCountdown,
  keyframes,
  injectKeyframes,
};
