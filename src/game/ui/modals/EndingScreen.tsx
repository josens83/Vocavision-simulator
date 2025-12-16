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
import {
  Ending,
  EndingTier,
  EndingGrade,
  EndingDisplayStats,
  getGradeFromScore,
  getEndingById,
  getEndingTierLabel,
  getEndingTierColor,
} from '@/game/ending';

interface EndingScreenProps {
  endingId: string;
  stats: Partial<EndingDisplayStats>;
  onNewGame: () => void;
  onNewGamePlus: () => void;
  onMainMenu: () => void;
}

// 등급에 따른 그라데이션 색상
const gradeColors: Record<EndingGrade, string> = {
  S: 'from-amber-400 to-yellow-500',
  A: 'from-purple-400 to-violet-500',
  B: 'from-blue-400 to-cyan-500',
  C: 'from-green-400 to-emerald-500',
  D: 'from-gray-400 to-gray-500',
  F: 'from-red-400 to-red-500',
};

// 등급 한글명
const gradeLabels: Record<EndingGrade, string> = {
  S: '전설',
  A: '훌륭함',
  B: '좋음',
  C: '보통',
  D: '미흡',
  F: '실패',
};

// 티어에 따른 그라데이션 색상
const tierGradients: Record<EndingTier, string> = {
  legendary: 'from-amber-400 to-yellow-500',
  epic: 'from-purple-400 to-violet-500',
  great: 'from-blue-400 to-cyan-500',
  good: 'from-green-400 to-emerald-500',
  neutral: 'from-gray-400 to-gray-500',
  bad: 'from-orange-400 to-orange-500',
  terrible: 'from-red-400 to-red-500',
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

// 기본 엔딩 데이터 생성 (엔딩이 없을 경우)
const getDefaultEnding = (endingId: string): Ending => {
  return {
    id: endingId,
    type: 'special',
    tier: 'neutral',
    name: '여정의 끝',
    title: '게임 종료',
    description: '당신의 스타트업 여정이 막을 내렸습니다.',
    narrative: '모든 여정에는 끝이 있습니다. 이번 경험을 바탕으로 더 나은 도전을 시작해보세요.',
    requirements: { conditions: [], logic: 'and' },
    priority: 0,
    rewards: [],
    icon: '🎯',
    color: '#9CA3AF',
    rarity: 1,
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

  // 엔딩 데이터 로드
  const ending = getEndingById(endingId) || getDefaultEnding(endingId);

  // 점수에서 등급 계산
  const totalScore = stats.totalScore || 0;
  const gradeInfo = getGradeFromScore(totalScore);
  const grade = stats.grade || gradeInfo.rank;

  useEffect(() => {
    // 단계별 애니메이션
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

  const isVictory = ending.type === 'victory' || ending.type === 'special' || ending.type === 'secret';
  const tierGradient = tierGradients[ending.tier] || tierGradients.neutral;
  const gradeGradient = gradeColors[grade] || gradeColors.C;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-auto z-50">
      {/* 배경 효과 */}
      <div className="absolute inset-0 overflow-hidden">
        {isVictory && (
          <>
            {/* 스파클 효과 */}
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
          className={`absolute inset-0 bg-gradient-to-br ${tierGradient} opacity-10`}
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full p-8">
        {/* 등급 뱃지 */}
        <div
          className={`text-center mb-6 transform transition-all duration-1000 ${
            animationPhase >= 1 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}
        >
          <div
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${gradeGradient} shadow-lg`}
          >
            {grade === 'S' ? (
              <Crown className="w-12 h-12 text-white" />
            ) : isVictory ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <span className="text-4xl font-bold text-white">{grade}</span>
            )}
          </div>
          <div className="mt-3 text-sm font-medium text-gray-400">
            {gradeLabels[grade]} 등급
          </div>
        </div>

        {/* 엔딩 제목 */}
        <div
          className={`text-center mb-6 transform transition-all duration-1000 delay-300 ${
            animationPhase >= 2 ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}
        >
          <div className="text-4xl mb-2">{ending.icon}</div>
          <h1
            className={`text-4xl font-bold mb-3 bg-gradient-to-r ${tierGradient} bg-clip-text text-transparent`}
          >
            {ending.name}
          </h1>
          <p className="text-lg text-gray-300">{ending.description}</p>
          <div className="mt-2 text-sm text-gray-500">
            {getEndingTierLabel(ending.tier)} 엔딩
          </div>
        </div>

        {/* 내러티브/에필로그 */}
        {ending.narrative && (
          <div
            className={`bg-gray-800/50 rounded-xl p-6 mb-6 border border-gray-700 transform transition-all duration-1000 delay-500 ${
              animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {ending.narrative}
            </p>
          </div>
        )}

        {/* 통계 */}
        {showDetails && (
          <div className="space-y-4 animate-fadeIn">
            {/* 점수 */}
            <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 rounded-xl p-4 border border-violet-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-violet-400" />
                  <span className="text-lg font-medium">최종 점수</span>
                </div>
                <div className="text-2xl font-bold text-violet-400">
                  {totalScore.toLocaleString()}점
                </div>
              </div>
            </div>

            {/* 통계 그리드 */}
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

            {/* 보상 */}
            {ending.rewards && ending.rewards.length > 0 && (
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400 mb-3">획득한 보상</h3>
                <div className="flex flex-wrap gap-2">
                  {ending.rewards.map((reward, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-amber-600/30 to-yellow-600/30 rounded-full text-sm text-amber-300 border border-amber-500/30"
                    >
                      {reward.type === 'legacy_points' && `🏆 ${reward.value} 포인트`}
                      {reward.type === 'title' && `👑 ${reward.value}`}
                      {reward.type === 'achievement' && `🎖️ ${reward.value}`}
                      {reward.type === 'cosmetic' && `✨ ${reward.value}`}
                      {reward.type === 'mastery_xp' && `⭐ ${reward.value} XP`}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
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
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
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
