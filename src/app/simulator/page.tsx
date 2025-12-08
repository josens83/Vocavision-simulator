'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pause, Play, RotateCcw, Trophy, Info } from 'lucide-react';

interface GameState {
  day: number;
  money: number;
  users: number;
  premiumUsers: number;
  dailyActiveUsers: number;
  serverHealth: number;
  reputation: number;
  stress: number;
  energy: number;
  devProgress: {
    errorHandling: number;
    performance: number;
    security: number;
    testing: number;
    cicd: number;
  };
  features: {
    words101: boolean;
    flashcards: boolean;
    quiz: boolean;
    achievements: boolean;
    mobileApp: boolean;
    aiMnemonics: boolean;
  };
  costs: {
    server: number;
    api: number;
    domain: number;
  };
  stats: {
    totalRevenue: number;
    totalExpenses: number;
    bugsFixed: number;
    ticketsResolved: number;
  };
  currentEvent: GameEvent | null;
  gameOver: boolean;
  gameOverReason: string;
  showResult: string | null;
}

interface GameChoice {
  text: string;
  effect: Partial<GameState>;
  result: string;
}

interface GameEvent {
  id: string;
  type: string;
  severity: string;
  title: string;
  description: string;
  choices: GameChoice[];
}

const INITIAL_STATE: GameState = {
  day: 1,
  money: 5000000,
  users: 50,
  premiumUsers: 3,
  dailyActiveUsers: 25,
  serverHealth: 100,
  reputation: 70,
  stress: 20,
  energy: 100,
  devProgress: { errorHandling: 0, performance: 0, security: 0, testing: 0, cicd: 0 },
  features: { words101: true, flashcards: true, quiz: false, achievements: false, mobileApp: false, aiMnemonics: false },
  costs: { server: 50000, api: 30000, domain: 15000 },
  stats: { totalRevenue: 0, totalExpenses: 0, bugsFixed: 0, ticketsResolved: 0 },
  currentEvent: null,
  gameOver: false,
  gameOverReason: '',
  showResult: null,
};

const EVENTS: GameEvent[] = [
  {
    id: 'critical_bug', type: 'bug', severity: 'critical',
    title: '🚨 긴급 버그 발생!',
    description: 'SM-2 알고리즘에서 치명적인 버그가 발견되었습니다. 사용자들의 학습 진행도가 초기화되고 있어요!',
    choices: [
      { text: '밤새 직접 수정한다 (-30 에너지)', effect: { energy: -30, stress: 10, serverHealth: 10, reputation: 5 }, result: '5시간 디버깅 끝에 해결! 사용자들이 빠른 대응에 감사해했습니다.' },
      { text: '내일 아침에 처리한다', effect: { reputation: -15, users: -5, premiumUsers: -1 }, result: '밤사이 5명의 사용자가 불만을 품고 떠났습니다...' },
      { text: '외주 개발자에게 맡긴다 (-200,000원)', effect: { money: -200000, reputation: 5 }, result: '비용이 들었지만 전문가가 깔끔하게 해결했습니다.' },
    ],
  },
  {
    id: 'minor_bug', type: 'bug', severity: 'minor',
    title: '🐛 사소한 버그 리포트',
    description: 'iOS Safari에서 플래시카드 애니메이션이 끊긴다는 신고가 들어왔습니다.',
    choices: [
      { text: '바로 수정한다 (-10 에너지)', effect: { energy: -10, reputation: 3 }, result: 'CSS 최적화로 해결! 해당 사용자가 5점 리뷰를 남겼습니다.' },
      { text: '다음 업데이트에 포함', effect: { reputation: -2 }, result: '사용자는 이해했지만 살짝 실망한 눈치입니다.' },
      { text: '재현이 안 된다고 답변', effect: { reputation: -8 }, result: '사용자가 트위터에 불만을 토로했습니다.' },
    ],
  },
  {
    id: 'server_down', type: 'server', severity: 'critical',
    title: '💥 서버 다운!',
    description: 'Railway 서버가 갑자기 다운되었습니다! 사용자들이 접속할 수 없어요!',
    choices: [
      { text: '즉시 서버 재시작 (-15 에너지)', effect: { energy: -15, serverHealth: 20 }, result: '10분 만에 복구! 피해는 크지 않았습니다.' },
      { text: 'Railway 고객센터에 문의', effect: { serverHealth: -10, reputation: -5 }, result: '30분 후 자동 복구되었지만 사용자들이 불안해합니다.' },
      { text: 'Vercel로 긴급 마이그레이션 (-500,000원)', effect: { money: -500000, serverHealth: 40, reputation: 10 }, result: '시간과 비용이 들었지만 더 안정적인 환경이 되었습니다!' },
    ],
  },
  {
    id: 'traffic_spike', type: 'server', severity: 'warning',
    title: '📈 트래픽 폭증!',
    description: '유명 유튜버가 VocaVision을 소개했습니다! 트래픽이 10배입니다!',
    choices: [
      { text: '서버 스케일업 (-300,000원)', effect: { money: -300000, users: 200, premiumUsers: 15, reputation: 20 }, result: '200명의 새 사용자가 가입했습니다!' },
      { text: '현재 서버로 버틴다', effect: { serverHealth: -30, users: 50, reputation: -10 }, result: '서버가 느려지면서 많은 신규 사용자가 이탈했습니다...' },
      { text: 'CDN 캐싱 적용 (-100,000원)', effect: { money: -100000, users: 150, premiumUsers: 10, serverHealth: 10 }, result: '현명한 선택! 적은 비용으로 효과적으로 대응했습니다.' },
    ],
  },
  {
    id: 'user_feedback', type: 'user', severity: 'normal',
    title: '💬 사용자 피드백',
    description: '프리미엄 사용자가 "발음 기능이 있으면 좋겠다"고 요청했습니다.',
    choices: [
      { text: 'Web Speech API로 구현 (-20 에너지)', effect: { energy: -20, reputation: 15, premiumUsers: 3 }, result: '사용자들이 새 기능에 열광합니다!' },
      { text: '"검토해보겠습니다" 답변', effect: { reputation: -3 }, result: '사용자가 약간 실망한 것 같습니다.' },
      { text: 'Google TTS API 연동 (-80,000원/월)', effect: { money: -80000, reputation: 20, premiumUsers: 5 }, result: '고품질 음성으로 만족도가 크게 올랐습니다!' },
    ],
  },
  {
    id: 'bad_review', type: 'user', severity: 'warning',
    title: '⭐ 부정적인 리뷰',
    description: '앱스토어 1점 리뷰: "단어가 100개밖에 없어서 금방 끝났어요. 환불 원합니다."',
    choices: [
      { text: '정중히 답변 + 환불 (-9,990원)', effect: { money: -9990, reputation: 5 }, result: '사용자가 리뷰를 3점으로 수정했습니다.' },
      { text: '단어 추가 계획을 안내', effect: { reputation: -2 }, result: '기다려보겠다고 했지만 확신은 없어 보입니다.' },
      { text: '무시한다', effect: { reputation: -10, users: -3 }, result: '다른 잠재 사용자들이 가입을 망설입니다...' },
    ],
  },
  {
    id: 'viral_moment', type: 'opportunity', severity: 'good',
    title: '🌟 바이럴 기회!',
    description: '한 사용자의 학습 인증샷이 트위터에서 500 RT를 기록했습니다!',
    choices: [
      { text: '공식 계정으로 리트윗', effect: { users: 80, premiumUsers: 5, reputation: 15 }, result: '자연스러운 홍보 효과! 신규 가입이 급증했습니다.' },
      { text: '1년 무료 구독 제공 (-119,880원)', effect: { money: -119880, users: 120, premiumUsers: 8, reputation: 25 }, result: '사용자가 감동받아 추가로 홍보해줬습니다! 대박!' },
      { text: '지켜본다', effect: { users: 30 }, result: '조용히 지나갔지만 일부 효과는 있었습니다.' },
    ],
  },
  {
    id: 'api_cost_spike', type: 'finance', severity: 'warning',
    title: '💸 OpenAI API 비용 폭증',
    description: 'AI 연상법 생성 기능이 인기를 끌면서 API 비용이 예상의 3배입니다!',
    choices: [
      { text: '캐싱 시스템 구축 (-50 에너지)', effect: { energy: -50 }, result: '힘들었지만 비용을 절반으로 줄였습니다!' },
      { text: 'API 호출 제한 설정', effect: { reputation: -10, premiumUsers: -2 }, result: '일부 프리미엄 사용자가 해지했습니다.' },
      { text: '그냥 지불한다 (-90,000원)', effect: { money: -90000 }, result: '비용이 들었지만 서비스 품질은 유지했습니다.' },
    ],
  },
  {
    id: 'investment_offer', type: 'opportunity', severity: 'good',
    title: '💰 투자 제안',
    description: '엔젤 투자자가 5천만원 투자를 제안했습니다. 단, 지분 15%를 원합니다.',
    choices: [
      { text: '투자 받는다 (+50,000,000원)', effect: { money: 50000000, stress: 30 }, result: '자금은 확보했지만 성과를 내야 한다는 압박감이...' },
      { text: '지분 10%로 협상', effect: { money: 35000000, stress: 20, reputation: 10 }, result: '3500만원에 10% 지분으로 합의했습니다!' },
      { text: '정중히 거절', effect: { reputation: 5 }, result: '독립성을 지켰지만 기회비용이 아쉽습니다.' },
    ],
  },
  {
    id: 'security_issue', type: 'security', severity: 'critical',
    title: '🔒 보안 취약점 발견',
    description: 'Snyk 스캔에서 높은 심각도의 npm 패키지 취약점이 발견되었습니다!',
    choices: [
      { text: '즉시 패키지 업데이트 (-20 에너지)', effect: { energy: -20, reputation: 5 }, result: '신속한 대응으로 보안을 강화했습니다!' },
      { text: '다음 릴리즈에 포함', effect: { reputation: -5, serverHealth: -5 }, result: '잠재적 위험이 계속 존재합니다...' },
      { text: '보안 감사 의뢰 (-1,000,000원)', effect: { money: -1000000, reputation: 15 }, result: '전문 감사로 여러 취약점을 해결했습니다!' },
    ],
  },
  {
    id: 'competitor_launch', type: 'market', severity: 'warning',
    title: '⚔️ 경쟁사 신규 기능',
    description: '경쟁 앱이 AI 이미지 생성 기능을 출시했습니다. SNS에서 화제입니다.',
    choices: [
      { text: 'DALL-E 3 연동 개발 (-70 에너지, -500,000원)', effect: { energy: -70, money: -500000, reputation: 20 }, result: '2주 후 더 나은 품질의 기능을 출시했습니다!' },
      { text: '우리만의 강점을 홍보', effect: { reputation: 5, users: 20 }, result: '차별화된 가치를 강조하니 관심있는 사용자들이 유입되었습니다.' },
      { text: '무시하고 원래 로드맵 진행', effect: { users: -15, reputation: -10 }, result: '일부 사용자들이 경쟁 앱으로 이동했습니다...' },
    ],
  },
  {
    id: 'burnout', type: 'personal', severity: 'warning',
    title: '😴 번아웃 징후',
    description: '최근 며칠간 잠을 제대로 못 잤습니다. 집중력이 떨어지고 실수가 잦아집니다.',
    choices: [
      { text: '하루 휴식 (+40 에너지)', effect: { energy: 40, stress: -20 }, result: '푹 쉬고 나니 다시 의욕이 생깁니다!' },
      { text: '그래도 일한다', effect: { energy: -20, stress: 20 }, result: '결국 실수로 버그를 하나 더 만들었습니다...' },
      { text: '운동을 다녀온다', effect: { energy: 20, stress: -10 }, result: '가벼운 운동 후 머리가 맑아졌습니다!' },
    ],
  },
  {
    id: 'media_interview', type: 'opportunity', severity: 'good',
    title: '🎤 미디어 인터뷰 요청',
    description: 'IT 매체에서 1인 개발자 인터뷰를 요청했습니다.',
    choices: [
      { text: '인터뷰에 응한다 (-15 에너지)', effect: { energy: -15, reputation: 30, users: 100, premiumUsers: 8 }, result: '기사가 나가고 많은 관심을 받았습니다!' },
      { text: '서면 인터뷰로 대체', effect: { reputation: 15, users: 40 }, result: '효율적으로 처리했고 적당한 홍보 효과를 얻었습니다.' },
      { text: '정중히 거절', effect: {}, result: '기회를 놓쳤지만 시간은 절약했습니다.' },
    ],
  },
  {
    id: 'partnership', type: 'opportunity', severity: 'good',
    title: '🤝 파트너십 제안',
    description: '대형 어학원에서 B2B 제휴를 제안했습니다.',
    choices: [
      { text: '계약 진행 (학생 500명, 월 200만원)', effect: { users: 500, money: 2000000, stress: 20, reputation: 20 }, result: '대형 계약 성사! 하지만 관리 부담도 생겼습니다.' },
      { text: '파일럿 프로그램 (50명, 무료)', effect: { users: 50, reputation: 10 }, result: '작게 시작해서 검증해보기로 했습니다.' },
      { text: '준비가 안 됐다고 거절', effect: { reputation: -5 }, result: '기회를 놓쳤지만 현실적인 판단일 수도 있습니다.' },
    ],
  },
];

const formatMoney = (amount: number) => new Intl.NumberFormat('ko-KR').format(amount) + '원';

const StatBar = ({ label, value, max, color, icon }: { label: string; value: number; max: number; color: string; icon: string }) => (
  <div className="mb-2">
    <div className="flex justify-between text-xs mb-1">
      <span className="text-gray-400">{icon} {label}</span>
      <span className="text-white font-bold">{Math.round(value)}/{max}</span>
    </div>
    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
    </div>
  </div>
);

export default function SimulatorPage() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [isPaused, setIsPaused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const monthlyRevenue = state.premiumUsers * 9990;
  const monthlyCosts = state.costs.server + state.costs.api + Math.round(state.costs.domain / 12);

  useEffect(() => {
    if (isPaused || state.gameOver || state.currentEvent || state.showResult) return;

    const interval = setInterval(() => {
      setState(prev => {
        const n = { ...prev, day: prev.day + 1 };
        n.energy = Math.min(100, prev.energy + 8);
        n.stress = Math.max(0, prev.stress - 2);

        const userGrowth = Math.floor(Math.random() * 5) - 1;
        n.users = Math.max(0, prev.users + userGrowth);
        n.dailyActiveUsers = Math.floor(n.users * (0.3 + Math.random() * 0.3));

        if (Math.random() < 0.08) n.premiumUsers = prev.premiumUsers + Math.floor(Math.random() * 2);
        n.serverHealth = Math.max(0, prev.serverHealth - (Math.random() * 2));

        if (prev.day % 30 === 0) {
          const revenue = prev.premiumUsers * 9990;
          const expenses = prev.costs.server + prev.costs.api + Math.round(prev.costs.domain / 12);
          n.money = prev.money + revenue - expenses;
          n.stats = { ...prev.stats, totalRevenue: prev.stats.totalRevenue + revenue, totalExpenses: prev.stats.totalExpenses + expenses };
        }

        if (Math.random() < 0.12) {
          n.currentEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        }

        if (n.money < -1000000) { n.gameOver = true; n.gameOverReason = '💸 자금이 -100만원 이하로 떨어졌습니다. 파산으로 VocaVision은 문을 닫았습니다...'; }
        else if (n.serverHealth <= 0) { n.gameOver = true; n.gameOverReason = '💥 서버가 완전히 다운되어 복구 불가능 상태가 되었습니다...'; }
        else if (n.reputation <= 0) { n.gameOver = true; n.gameOverReason = '😢 평판이 바닥으로 떨어져 더 이상 사용자를 유치할 수 없게 되었습니다...'; }
        else if (n.stress >= 100) { n.gameOver = true; n.gameOverReason = '😴 극심한 스트레스로 건강이 악화되었습니다. 당분간 휴식이 필요합니다...'; }

        return n;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, state.gameOver, state.currentEvent, state.showResult]);

  const handleChoice = useCallback((choice: GameChoice) => {
    setState(prev => {
      const n = { ...prev };
      const effect = choice.effect as Record<string, number>;
      if (effect.money) n.money += effect.money;
      if (effect.users) n.users += effect.users;
      if (effect.premiumUsers) n.premiumUsers = Math.max(0, prev.premiumUsers + effect.premiumUsers);
      if (effect.energy) n.energy = Math.max(0, Math.min(100, prev.energy + effect.energy));
      if (effect.stress) n.stress = Math.max(0, Math.min(100, prev.stress + effect.stress));
      if (effect.reputation) n.reputation = Math.max(0, Math.min(100, prev.reputation + effect.reputation));
      if (effect.serverHealth) n.serverHealth = Math.max(0, Math.min(100, prev.serverHealth + effect.serverHealth));
      n.currentEvent = null;
      n.showResult = choice.result;
      return n;
    });
  }, []);

  const handleAction = useCallback((action: string) => {
    setState(prev => {
      const n = { ...prev };
      if (action === 'develop' && prev.energy >= 20) {
        n.energy = prev.energy - 20;
        const keys = Object.keys(prev.devProgress) as (keyof typeof prev.devProgress)[];
        const key = keys[Math.floor(Math.random() * keys.length)];
        n.devProgress = { ...prev.devProgress, [key]: Math.min(100, prev.devProgress[key] + 10) };
      } else if (action === 'marketing' && prev.money >= 100000) {
        n.money = prev.money - 100000;
        const newUsers = Math.floor(Math.random() * 30) + 10;
        n.users = prev.users + newUsers;
        n.premiumUsers = prev.premiumUsers + Math.floor(newUsers * 0.05);
      } else if (action === 'server' && prev.energy >= 15) {
        n.energy = prev.energy - 15;
        n.serverHealth = Math.min(100, prev.serverHealth + 20);
      } else if (action === 'rest') {
        n.day = prev.day + 1;
        n.energy = Math.min(100, prev.energy + 40);
        n.stress = Math.max(0, prev.stress - 15);
      }
      return n;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white p-4 safe-top safe-bottom">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              VocaVision 🚀
            </h1>
            <p className="text-xs text-gray-500">1인 EdTech 사업 시뮬레이터</p>
          </div>
        </div>
        <div className="text-right flex items-center gap-2">
          <div>
            <div className="text-xl sm:text-2xl font-black">Day {state.day}</div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHelp(true)}
              className="text-gray-400 hover:text-white"
            >
              <Info className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPaused(!isPaused)}
              className="text-gray-400 hover:text-white"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-gray-800/50 rounded-xl p-2 sm:p-3 text-center">
          <div className="text-base sm:text-lg">💰</div>
          <div className={`text-xs sm:text-sm font-bold ${state.money < 500000 ? 'text-red-400' : 'text-emerald-400'}`}>
            {formatMoney(state.money)}
          </div>
          <div className="text-xs text-gray-500 hidden sm:block">잔고</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-2 sm:p-3 text-center">
          <div className="text-base sm:text-lg">👥</div>
          <div className="text-xs sm:text-sm font-bold">{state.users}</div>
          <div className="text-xs text-gray-500 hidden sm:block">사용자</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-2 sm:p-3 text-center">
          <div className="text-base sm:text-lg">⭐</div>
          <div className="text-xs sm:text-sm font-bold text-amber-400">{state.premiumUsers}</div>
          <div className="text-xs text-gray-500 hidden sm:block">프리미엄</div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-2 sm:p-3 text-center">
          <div className="text-base sm:text-lg">📊</div>
          <div className="text-xs sm:text-sm font-bold">{state.dailyActiveUsers}</div>
          <div className="text-xs text-gray-500 hidden sm:block">DAU</div>
        </div>
      </div>

      {/* Status Bars */}
      <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4 mb-4">
        <StatBar label="에너지" value={state.energy} max={100} color="bg-emerald-500" icon="⚡" />
        <StatBar label="스트레스" value={state.stress} max={100} color="bg-red-500" icon="😰" />
        <StatBar label="서버 상태" value={state.serverHealth} max={100} color="bg-blue-500" icon="🖥️" />
        <StatBar label="평판" value={state.reputation} max={100} color="bg-purple-500" icon="⭐" />
      </div>

      {/* Monthly Finance */}
      <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4 mb-4">
        <div className="text-xs text-gray-400 mb-2">📈 월간 재정</div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-emerald-500/20 rounded-lg p-2">
            <div className="text-emerald-400 font-bold">{formatMoney(monthlyRevenue)}</div>
            <div className="text-gray-500">수익</div>
          </div>
          <div className="bg-red-500/20 rounded-lg p-2">
            <div className="text-red-400 font-bold">{formatMoney(monthlyCosts)}</div>
            <div className="text-gray-500">비용</div>
          </div>
          <div className={`${monthlyRevenue >= monthlyCosts ? 'bg-blue-500/20' : 'bg-orange-500/20'} rounded-lg p-2`}>
            <div className={`${monthlyRevenue >= monthlyCosts ? 'text-blue-400' : 'text-orange-400'} font-bold`}>
              {formatMoney(monthlyRevenue - monthlyCosts)}
            </div>
            <div className="text-gray-500">순이익</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => handleAction('develop')}
          disabled={state.energy < 20}
          className="bg-violet-600 hover:bg-violet-500 disabled:bg-gray-700 disabled:opacity-50 rounded-xl p-2 sm:p-3 text-center transition-all active:scale-95"
        >
          <div className="text-base sm:text-lg">💻</div>
          <div className="text-xs">개발</div>
        </button>
        <button
          onClick={() => handleAction('marketing')}
          disabled={state.money < 100000}
          className="bg-amber-600 hover:bg-amber-500 disabled:bg-gray-700 disabled:opacity-50 rounded-xl p-2 sm:p-3 text-center transition-all active:scale-95"
        >
          <div className="text-base sm:text-lg">📢</div>
          <div className="text-xs">마케팅</div>
        </button>
        <button
          onClick={() => handleAction('server')}
          disabled={state.energy < 15}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:opacity-50 rounded-xl p-2 sm:p-3 text-center transition-all active:scale-95"
        >
          <div className="text-base sm:text-lg">🔧</div>
          <div className="text-xs">서버점검</div>
        </button>
        <button
          onClick={() => handleAction('rest')}
          className="bg-emerald-600 hover:bg-emerald-500 rounded-xl p-2 sm:p-3 text-center transition-all active:scale-95"
        >
          <div className="text-base sm:text-lg">😴</div>
          <div className="text-xs">휴식</div>
        </button>
      </div>

      {/* Development Progress */}
      <div className="bg-gray-800/30 rounded-xl p-3 sm:p-4">
        <div className="text-xs text-gray-400 mb-2">🛠️ 개발 진행률</div>
        <div className="grid grid-cols-5 gap-1">
          {Object.entries(state.devProgress).map(([key, val]) => (
            <div key={key} className="text-center">
              <div className="h-10 sm:h-12 bg-gray-700 rounded relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-500 to-purple-500 transition-all" style={{ height: `${val}%` }} />
              </div>
              <div className="text-xs text-gray-500 mt-1">{val}%</div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>에러</span><span>성능</span><span>보안</span><span>테스트</span><span>CI/CD</span>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">🎮 게임 방법</h2>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h3 className="font-bold text-white mb-1">📊 관리해야 할 것들</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>자금:</strong> 500만원으로 시작, 서버비/API 비용 지출</li>
                  <li><strong>에너지:</strong> 일하면 소모, 휴식으로 회복</li>
                  <li><strong>스트레스:</strong> 100이 되면 게임 오버!</li>
                  <li><strong>서버 상태:</strong> 관리 안 하면 다운됨</li>
                  <li><strong>평판:</strong> 0이 되면 게임 오버!</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">🎲 게임 오버 조건</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>자금 -100만원 이하 (파산)</li>
                  <li>서버 상태 0 (완전 다운)</li>
                  <li>평판 0 (악평 확산)</li>
                  <li>스트레스 100 (번아웃)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">🎯 팁</h3>
                <p>랜덤 이벤트에 현명하게 대응하고, 에너지와 자금 관리를 잘 해서 최대한 오래 생존하세요!</p>
              </div>
            </div>
            <Button
              onClick={() => setShowHelp(false)}
              className="w-full mt-4"
              variant="gradient"
            >
              확인
            </Button>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {state.currentEvent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className={`bg-gradient-to-br ${
            state.currentEvent.severity === 'critical' ? 'from-red-900/90 to-red-950/90 border-red-500/50' :
            state.currentEvent.severity === 'warning' ? 'from-amber-900/90 to-amber-950/90 border-amber-500/50' :
            state.currentEvent.severity === 'good' ? 'from-emerald-900/90 to-emerald-950/90 border-emerald-500/50' :
            'from-blue-900/90 to-blue-950/90 border-blue-500/50'
          } border rounded-2xl p-5 max-w-sm w-full`}>
            <h2 className="text-xl font-bold mb-2">{state.currentEvent.title}</h2>
            <p className="text-sm text-gray-300 mb-4">{state.currentEvent.description}</p>
            <div className="space-y-2">
              {state.currentEvent.choices.map((choice, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(choice)}
                  className="w-full p-3 bg-gray-800/80 hover:bg-gray-700 rounded-xl text-left text-sm transition-all active:scale-98"
                >
                  {choice.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {state.showResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-5 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-3">📋 결과</h3>
            <p className="text-sm text-gray-300 mb-4">{state.showResult}</p>
            <Button
              onClick={() => setState(p => ({ ...p, showResult: null }))}
              className="w-full"
              variant="gradient"
            >
              확인
            </Button>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {state.gameOver && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-red-500/30 rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-2xl font-black text-red-400 mb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6" /> 게임 오버
            </h2>
            <p className="text-sm text-gray-300 mb-4">{state.gameOverReason}</p>
            <div className="bg-gray-700/50 rounded-xl p-3 mb-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>생존 일수: <span className="text-white font-bold">{state.day}일</span></div>
                <div>최종 사용자: <span className="text-white font-bold">{state.users}명</span></div>
                <div>총 수익: <span className="text-emerald-400">{formatMoney(state.stats.totalRevenue)}</span></div>
                <div>총 지출: <span className="text-red-400">{formatMoney(state.stats.totalExpenses)}</span></div>
              </div>
            </div>
            <Button
              onClick={() => setState(INITIAL_STATE)}
              className="w-full"
              variant="gradient"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 시작하기
            </Button>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-600 mt-4">
        💡 에너지/자금/평판/서버 관리가 핵심! 0이 되면 게임 오버
      </div>
    </div>
  );
}
