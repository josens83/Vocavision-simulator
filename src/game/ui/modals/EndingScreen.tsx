'use client';

import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Star,
  Clock,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  RefreshCw,
  Home,
  Sparkles,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEndingCheck } from '@/game/store/systemIntegration';
import { Ending, EndingTier, PlaythroughStats } from '@/game/ending';

interface EndingScreenProps {
  endingId: string;
  stats: PlaythroughStats;
  onNewGame: () => void;
  onNewGamePlus: () => void;
  onMainMenu: () => void;
}

const tierColors: Record<EndingTier, string> = {
  S: 'from-amber-400 to-yellow-500',
  A: 'from-purple-400 to-violet-500',
  B: 'from-blue-400 to-cyan-500',
  C: 'from-green-400 to-emerald-500',
  D: 'from-gray-400 to-gray-500',
  F: 'from-red-400 to-red-500',
};

const tierLabels: Record<EndingTier, string> = {
  S: '전설',
  A: '훌륭함',
  B: '좋음',
  C: '보통',
  D: '미흡',
  F: '실패',
};

const formatNumber = (value: number): string => {
  if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toLocaleString();
};

const formatMoney = (value: number): string => {
  return new Intl.NumberFormat('ko-KR').format(Math.round(value)) + '원';
};

const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
};

// Mock ending data for display
const getEndingData = (endingId: string): Ending => {
  const endings: Record<string, Partial<Ending>> = {
    ipo_success: {
      id: 'ipo_success',
      name: 'IPO 성공',
      description: '성공적인 IPO를 통해 유니콘 기업으로 성장했습니다!',
      type: 'victory',
      tier: 'S',
      epilogue: {
        text: '당신의 회사는 증권시장에 성공적으로 상장되었습니다. 초기 투자자들은 엄청난 수익을 거두었고, 당신은 에듀테크 업계의 전설이 되었습니다.',
        achievements: ['IPO 마스터', '유니콘 창업가', '에듀테크 혁신가'],
      },
    },
    acquisition: {
      id: 'acquisition',
      name: '인수합병',
      description: '대기업에 인수되어 성공적인 EXIT를 달성했습니다.',
      type: 'victory',
      tier: 'A',
      epilogue: {
        text: '글로벌 대기업이 당신의 회사를 인수했습니다. 당신은 큰 부를 얻었고, 새로운 도전을 시작할 수 있게 되었습니다.',
        achievements: ['성공적인 EXIT', '비즈니스 협상가'],
      },
    },
    unicorn: {
      id: 'unicorn',
      name: '유니콘 달성',
      description: '기업가치 10억 달러를 달성한 유니콘 기업이 되었습니다!',
      type: 'special',
      tier: 'S',
      epilogue: {
        text: '당신의 회사는 유니콘 클럽에 가입했습니다. 전 세계가 당신의 성공 스토리에 주목하고 있습니다.',
        achievements: ['유니콘 창업가', '글로벌 리더'],
      },
    },
    bankruptcy: {
      id: 'bankruptcy',
      name: '파산',
      description: '자금이 바닥나 회사가 파산했습니다.',
      type: 'gameOver',
      tier: 'F',
      epilogue: {
        text: '안타깝게도 자금난을 극복하지 못했습니다. 하지만 실패는 성공의 어머니입니다. 다시 도전해보세요!',
        achievements: [],
      },
    },
    burnout: {
      id: 'burnout',
      name: '번아웃',
      description: '과도한 스트레스로 더 이상 경영을 할 수 없게 되었습니다.',
      type: 'gameOver',
      tier: 'D',
      epilogue: {
        text: '건강이 최우선입니다. 번아웃에서 회복한 후, 더 현명하게 도전해보세요.',
        achievements: [],
      },
    },
  };

  const ending = endings[endingId];
  if (ending) {
    return {
      ...ending,
      requirements: [],
      rewards: [],
    } as Ending;
  }

  // Default ending
  return {
    id: endingId,
    name: '여정의 끝',
    description: '당신의 스타트업 여정이 막을 내렸습니다.',
    type: 'special',
    tier: 'C',
    requirements: [],
    rewards: [],
    epilogue: {
      text: '모든 여정에는 끝이 있습니다. 이번 경험을 바탕으로 더 나은 도전을 시작해보세요.',
      achievements: [],
    },
  };
};

export function EndingScreen({
  endingId,
  stats,
  onNewGame,
  onNewGamePlus,
  onMainMenu,
}: EndingScreenProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const ending = getEndingData(endingId);

  useEffect(() => {
    // Staggered animation
    const timer1 = setTimeout(() => setAnimationPhase(1), 500);
    const timer2 = setTimeout(() => setAnimationPhase(2), 1000);
    const timer3 = setTimeout(() => setAnimationPhase(3), 1500);
    const timer4 = setTimeout(() => setShowDetails(true), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  const grade = stats.grade || 'C';
  const isVictory = ending.type === 'victory' || ending.type === 'special';

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-auto">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {isVictory && (
          <>
            {/* Sparkles */}
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              >
                <Sparkles className="w-4 h-4 text-yellow-400/30" />
              </div>
            ))}
          </>
        )}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${tierColors[ending.tier]} opacity-10`}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full p-8">
        {/* Tier Badge */}
        <div
          className={`text-center mb-6 transform transition-all duration-1000 ${
            animationPhase >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}
        >
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${tierColors[ending.tier]} shadow-lg`}
          >
            {ending.tier === 'S' ? (
              <Crown className="w-12 h-12 text-white" />
            ) : isVictory ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <span className="text-4xl font-bold text-white">{ending.tier}</span>
            )}
          </div>
          <div className="mt-3 text-sm font-medium text-gray-400">
            {tierLabels[ending.tier]} 등급
          </div>
        </div>

        {/* Ending Title */}
        <div
          className={`text-center mb-6 transform transition-all duration-1000 delay-300 ${
            animationPhase >= 2 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}
        >
          <h1
            className={`text-4xl font-bold mb-3 bg-gradient-to-r ${tierColors[ending.tier]} bg-clip-text text-transparent`}
          >
            {ending.name}
          </h1>
          <p className="text-lg text-gray-300">{ending.description}</p>
        </div>

        {/* Epilogue */}
        {ending.epilogue && (
          <div
            className={`bg-gray-800/50 rounded-xl p-6 mb-6 border border-gray-700 transform transition-all duration-1000 delay-500 ${
              animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <p className="text-gray-300 leading-relaxed italic">"{ending.epilogue.text}"</p>
          </div>
        )}

        {/* Stats */}
        {showDetails && (
          <div className="space-y-4 animate-fadeIn">
            {/* Score */}
            <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 rounded-xl p-4 border border-violet-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-violet-400" />
                  <span className="text-lg font-medium">최종 점수</span>
                </div>
                <div className="text-2xl font-bold text-violet-400">
                  {stats.totalScore?.toLocaleString() || 0}점
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={<Calendar className="w-5 h-5" />}
                label="플레이 일수"
                value={`${stats.daysPlayed || 0}일`}
                color="blue"
              />
              <StatCard
                icon={<Clock className="w-5 h-5" />}
                label="플레이 시간"
                value={formatTime(stats.playTime || 0)}
                color="cyan"
              />
              <StatCard
                icon={<DollarSign className="w-5 h-5" />}
                label="총 수익"
                value={formatMoney(stats.totalRevenue || 0)}
                color="green"
              />
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="최대 사용자"
                value={formatNumber(stats.maxUsers || 0)}
                color="purple"
              />
              <StatCard
                icon={<TrendingUp className="w-5 h-5" />}
                label="수행한 액션"
                value={`${stats.actionsPerformed || 0}회`}
                color="orange"
              />
              <StatCard
                icon={<Star className="w-5 h-5" />}
                label="달성한 업적"
                value={`${stats.achievementsUnlocked || 0}개`}
                color="yellow"
              />
            </div>

            {/* Achievements */}
            {ending.epilogue?.achievements && ending.epilogue.achievements.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-3">획득한 업적</h3>
                <div className="flex flex-wrap gap-2">
                  {ending.epilogue.achievements.map((achievement, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-amber-600/30 to-yellow-600/30 rounded-full text-sm text-amber-300 border border-amber-500/30"
                    >
                      🏆 {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={onMainMenu}>
                <Home className="w-4 h-4 mr-2" />
                메인 메뉴
              </Button>
              <Button variant="outline" className="flex-1" onClick={onNewGame}>
                <RefreshCw className="w-4 h-4 mr-2" />
                새 게임
              </Button>
              {isVictory && (
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={onNewGamePlus}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  2회차+
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'text-blue-400',
    cyan: 'text-cyan-400',
    green: 'text-green-400',
    purple: 'text-purple-400',
    orange: 'text-orange-400',
    yellow: 'text-yellow-400',
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
      <div className="flex items-center gap-2 mb-1">
        <span className={colorClasses[color]}>{icon}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className={`text-lg font-bold ${colorClasses[color]}`}>{value}</div>
    </div>
  );
}

export default EndingScreen;
