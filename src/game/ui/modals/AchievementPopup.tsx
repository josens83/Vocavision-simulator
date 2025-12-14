'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Trophy, Star, X, Sparkles } from 'lucide-react';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points?: number;
  unlockedAt?: Date;
}

interface AchievementPopupProps {
  achievement: Achievement | null;
  onDismiss: () => void;
  duration?: number;
}

const rarityColors = {
  common: {
    bg: 'from-gray-600 to-gray-700',
    border: 'border-gray-500',
    text: 'text-gray-300',
    glow: '',
  },
  uncommon: {
    bg: 'from-green-600 to-emerald-700',
    border: 'border-green-500',
    text: 'text-green-300',
    glow: 'shadow-green-500/30',
  },
  rare: {
    bg: 'from-blue-600 to-cyan-700',
    border: 'border-blue-500',
    text: 'text-blue-300',
    glow: 'shadow-blue-500/30',
  },
  epic: {
    bg: 'from-purple-600 to-violet-700',
    border: 'border-purple-500',
    text: 'text-purple-300',
    glow: 'shadow-purple-500/30',
  },
  legendary: {
    bg: 'from-amber-500 to-yellow-600',
    border: 'border-amber-400',
    text: 'text-amber-300',
    glow: 'shadow-amber-500/50',
  },
};

const rarityLabels = {
  common: '일반',
  uncommon: '고급',
  rare: '희귀',
  epic: '영웅',
  legendary: '전설',
};

export function AchievementPopup({
  achievement,
  onDismiss,
  duration = 5000,
}: AchievementPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      setIsExiting(false);

      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [achievement, duration]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss();
    }, 300);
  }, [onDismiss]);

  if (!achievement || !isVisible) return null;

  const rarity = achievement.rarity || 'common';
  const colors = rarityColors[rarity];

  return (
    <div
      className={`fixed top-20 right-4 z-50 transform transition-all duration-300 ${
        isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div
        className={`relative bg-gradient-to-br ${colors.bg} rounded-xl p-4 border ${colors.border} shadow-lg ${colors.glow} min-w-[300px] max-w-[400px]`}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 text-white/50 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sparkle effects for legendary */}
        {rarity === 'legendary' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(5)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute w-4 h-4 text-yellow-300 animate-pulse"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div
              className={`w-14 h-14 rounded-lg bg-black/30 flex items-center justify-center text-2xl border ${colors.border}`}
            >
              {achievement.icon || (
                <Trophy className={`w-8 h-8 ${colors.text}`} />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full bg-black/30 ${colors.text}`}
              >
                {rarityLabels[rarity]}
              </span>
              {achievement.points && (
                <span className="text-xs text-white/70 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {achievement.points}
                </span>
              )}
            </div>
            <h3 className="font-bold text-white mb-1 truncate">
              {achievement.name}
            </h3>
            <p className="text-sm text-white/70 line-clamp-2">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-black/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white/50 rounded-full transition-all duration-300"
            style={{
              width: '100%',
              animation: `shrink ${duration}ms linear forwards`,
            }}
          />
        </div>

        {/* Achievement unlocked text */}
        <div className="text-center text-xs text-white/50 mt-2">
          🏆 업적 달성!
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// Achievement List Component (for viewing all achievements)
interface AchievementListProps {
  achievements: Achievement[];
  unlockedIds: string[];
}

export function AchievementList({ achievements, unlockedIds }: AchievementListProps) {
  const unlockedSet = new Set(unlockedIds);

  return (
    <div className="space-y-2">
      {achievements.map((achievement) => {
        const isUnlocked = unlockedSet.has(achievement.id);
        const rarity = achievement.rarity || 'common';
        const colors = rarityColors[rarity];

        return (
          <div
            key={achievement.id}
            className={`flex items-center gap-4 p-3 rounded-lg border transition-all ${
              isUnlocked
                ? `bg-gradient-to-r ${colors.bg} ${colors.border}`
                : 'bg-gray-800/50 border-gray-700 opacity-50'
            }`}
          >
            {/* Icon */}
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
                isUnlocked ? 'bg-black/30' : 'bg-gray-700'
              }`}
            >
              {isUnlocked ? (
                achievement.icon || <Trophy className={`w-6 h-6 ${colors.text}`} />
              ) : (
                '🔒'
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className={`font-medium ${isUnlocked ? 'text-white' : 'text-gray-400'}`}>
                  {isUnlocked ? achievement.name : '???'}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isUnlocked ? `bg-black/30 ${colors.text}` : 'bg-gray-700 text-gray-500'
                  }`}
                >
                  {rarityLabels[rarity]}
                </span>
              </div>
              <p className={`text-sm ${isUnlocked ? 'text-white/70' : 'text-gray-500'}`}>
                {isUnlocked ? achievement.description : '업적을 해금하면 내용이 공개됩니다.'}
              </p>
            </div>

            {/* Points */}
            {achievement.points && (
              <div className="flex items-center gap-1 text-sm">
                <Star className={`w-4 h-4 ${isUnlocked ? colors.text : 'text-gray-500'}`} />
                <span className={isUnlocked ? colors.text : 'text-gray-500'}>
                  {achievement.points}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Achievement Manager Hook
export function useAchievementPopup() {
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  const showAchievement = useCallback((achievement: Achievement) => {
    setQueue((prev) => [...prev, achievement]);
  }, []);

  const dismissAchievement = useCallback(() => {
    setCurrentAchievement(null);
  }, []);

  useEffect(() => {
    if (!currentAchievement && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrentAchievement(next);
      setQueue(rest);
    }
  }, [currentAchievement, queue]);

  return {
    currentAchievement,
    showAchievement,
    dismissAchievement,
  };
}

export default AchievementPopup;
