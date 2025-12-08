import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Brain,
  Target,
  Trophy,
  Flame,
  Clock,
  ChevronRight,
  Gamepad2,
  TrendingUp,
  Zap,
  Crown,
} from 'lucide-react';

// Mock data - In production, fetch from database
const mockStats = {
  wordsLearned: 156,
  wordsToReview: 23,
  currentStreak: 7,
  totalStudyTime: 1240, // minutes
  quizzesTaken: 45,
  averageAccuracy: 87,
  level: 12,
  xp: 2450,
  xpToNextLevel: 3000,
};

const mockRecentWords = [
  { english: 'Ephemeral', korean: '일시적인', status: 'mastered' },
  { english: 'Ubiquitous', korean: '어디에나 있는', status: 'learning' },
  { english: 'Serendipity', korean: '뜻밖의 행운', status: 'review' },
  { english: 'Eloquent', korean: '웅변의, 유창한', status: 'new' },
];

const quickActions = [
  { icon: BookOpen, label: '단어 학습', href: '/learn', color: 'from-violet-500 to-purple-500' },
  { icon: Brain, label: '복습하기', href: '/review', color: 'from-amber-500 to-orange-500' },
  { icon: Target, label: '퀴즈', href: '/quiz', color: 'from-emerald-500 to-teal-500' },
  { icon: Gamepad2, label: '시뮬레이터', href: '/simulator', color: 'from-pink-500 to-rose-500' },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      day: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
      active: i >= 6 - mockStats.currentStreak,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold">VocaVision</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/pricing">
                <Button variant="outline" size="sm" className="hidden sm:flex border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                  <Crown className="w-4 h-4 mr-1" />
                  프리미엄
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                  {session.user.name?.[0] || 'U'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            안녕하세요, {session.user.name?.split(' ')[0] || '학습자'}님! 👋
          </h1>
          <p className="text-gray-400">오늘도 열심히 학습해볼까요?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div className="font-semibold">{action.label}</div>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Streak */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-orange-300">연속 학습</span>
            </div>
            <div className="text-3xl font-black text-orange-400 mb-2">{mockStats.currentStreak}일</div>
            <div className="flex gap-1">
              {streakDays.map((d, i) => (
                <div
                  key={i}
                  className={`flex-1 h-2 rounded-full ${
                    d.active ? 'bg-orange-400' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              {streakDays.map((d, i) => (
                <span key={i}>{d.day}</span>
              ))}
            </div>
          </div>

          {/* Words Learned */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-violet-400" />
              <span className="text-sm text-violet-300">학습한 단어</span>
            </div>
            <div className="text-3xl font-black text-violet-400">{mockStats.wordsLearned}</div>
            <div className="text-sm text-gray-400 mt-1">
              복습 대기: <span className="text-amber-400">{mockStats.wordsToReview}개</span>
            </div>
          </div>

          {/* Accuracy */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-emerald-300">정확도</span>
            </div>
            <div className="text-3xl font-black text-emerald-400">{mockStats.averageAccuracy}%</div>
            <div className="text-sm text-gray-400 mt-1">퀴즈 {mockStats.quizzesTaken}회 완료</div>
          </div>

          {/* Study Time */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-blue-300">총 학습 시간</span>
            </div>
            <div className="text-3xl font-black text-blue-400">
              {Math.floor(mockStats.totalStudyTime / 60)}h {mockStats.totalStudyTime % 60}m
            </div>
            <div className="text-sm text-gray-400 mt-1">이번 주 활동</div>
          </div>
        </div>

        {/* Level Progress */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-xl font-black">
                {mockStats.level}
              </div>
              <div>
                <div className="font-bold text-lg">레벨 {mockStats.level}</div>
                <div className="text-sm text-gray-400">다음 레벨까지 {mockStats.xpToNextLevel - mockStats.xp} XP</div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-amber-400">
                <Zap className="w-4 h-4" />
                <span className="font-bold">{mockStats.xp} XP</span>
              </div>
            </div>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${(mockStats.xp / mockStats.xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>

        {/* Recent Words & Activities */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Words */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">최근 학습 단어</h2>
              <Link href="/learn" className="text-sm text-violet-400 hover:text-violet-300 flex items-center">
                전체 보기 <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {mockRecentWords.map((word) => (
                <div
                  key={word.english}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <div className="font-semibold">{word.english}</div>
                    <div className="text-sm text-gray-400">{word.korean}</div>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      word.status === 'mastered'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : word.status === 'learning'
                        ? 'bg-amber-500/20 text-amber-400'
                        : word.status === 'review'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {word.status === 'mastered' && '완벽'}
                    {word.status === 'learning' && '학습중'}
                    {word.status === 'review' && '복습'}
                    {word.status === 'new' && '신규'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Goals */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">오늘의 목표</h2>
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">새 단어 학습</span>
                  <span className="text-sm text-gray-400">8/10</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">복습 완료</span>
                  <span className="text-sm text-gray-400">15/20</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">퀴즈 완료</span>
                  <span className="text-sm text-gray-400">2/3</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '66%' }} />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10">
              <Link href="/learn">
                <Button variant="gradient" className="w-full">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  학습 계속하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
