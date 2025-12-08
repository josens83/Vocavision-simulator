import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Zap,
  Trophy,
  Users,
  Sparkles,
  BookOpen,
  Target,
  BarChart3,
  Star,
  ArrowRight,
  Check,
  Gamepad2,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI 연상법',
    description: 'AI가 생성한 이미지와 스토리로 단어를 더 쉽게 기억하세요.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'SM-2 알고리즘',
    description: '과학적 간격 반복 학습으로 장기 기억에 효과적으로 저장됩니다.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Target,
    title: '맞춤형 학습',
    description: '나의 수준과 목표에 맞는 개인화된 학습 경험을 제공합니다.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: '상세 통계',
    description: '학습 진행률, 약점 분석, 예측 점수까지 한눈에 확인하세요.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Trophy,
    title: '성취 시스템',
    description: '배지, 레벨업, 스트릭 보상으로 학습 동기를 유지하세요.',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Gamepad2,
    title: '게이미피케이션',
    description: '사업 시뮬레이터 게임으로 재미있게 영어를 배워보세요.',
    color: 'from-indigo-500 to-violet-500',
  },
];

const pricingPlans = [
  {
    name: '무료',
    price: '0',
    description: '기본 기능으로 시작하기',
    features: ['기본 단어 100개', '플래시카드 학습', '일일 퀴즈 3회', '기본 통계'],
    cta: '무료로 시작',
    popular: false,
  },
  {
    name: '베이직',
    price: '4,990',
    period: '/월',
    description: '더 많은 단어와 기능',
    features: [
      '단어 1,000개+',
      '모든 학습 모드',
      '무제한 퀴즈',
      'AI 연상법 50회/월',
      '상세 통계',
      '광고 제거',
    ],
    cta: '베이직 시작',
    popular: false,
  },
  {
    name: '프리미엄',
    price: '9,990',
    period: '/월',
    description: '모든 기능 무제한',
    features: [
      '모든 단어 무제한',
      'AI 연상법 무제한',
      '고급 통계 & 분석',
      '우선 고객 지원',
      '오프라인 학습',
      'API 액세스',
    ],
    cta: '프리미엄 시작',
    popular: true,
  },
  {
    name: '평생이용권',
    price: '199,000',
    period: '(1회)',
    description: '평생 무제한 이용',
    features: [
      '프리미엄 모든 기능',
      '평생 무료 업데이트',
      '신규 기능 우선 체험',
      'VIP 커뮤니티',
    ],
    cta: '평생이용권 구매',
    popular: false,
  },
];

const stats = [
  { value: '10,000+', label: '등록 단어' },
  { value: '50,000+', label: '사용자' },
  { value: '4.9', label: '평점' },
  { value: '95%', label: '학습 유지율' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                VocaVision
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-300 hover:text-white transition">
                기능
              </Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition">
                요금제
              </Link>
              <Link href="/simulator" className="text-gray-300 hover:text-white transition">
                시뮬레이터
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient" size="sm">
                  무료 시작
                </Button>
              </Link>
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <Link href="/login">
                <Button variant="gradient" size="sm">
                  시작하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300">AI 기반 학습 플랫폼</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight">
              영어 단어,{' '}
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI와 함께
              </span>
              <br />
              더 스마트하게 암기하세요
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              AI 연상법과 과학적 간격 반복 학습으로 영어 단어를 효과적으로 암기하세요.
              플래시카드, 퀴즈, 게임으로 재미있게 학습할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="gradient" size="xl" className="w-full sm:w-auto">
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/simulator">
                <Button variant="outline" size="xl" className="w-full sm:w-auto border-white/20 hover:bg-white/10">
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  시뮬레이터 체험
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">강력한 학습 기능</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              VocaVision은 최신 AI 기술과 검증된 학습 방법론을 결합하여
              가장 효과적인 단어 학습 경험을 제공합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">합리적인 요금제</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              무료로 시작하고, 필요에 따라 업그레이드하세요.
              평생이용권으로 한 번의 결제로 평생 사용할 수도 있습니다.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl ${
                  plan.popular
                    ? 'bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-2 border-violet-500'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full text-xs font-bold">
                    인기
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-black">₩{plan.price}</span>
                  {plan.period && <span className="text-gray-400">{plan.period}</span>}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/register">
                  <Button
                    variant={plan.popular ? 'gradient' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-violet-600/20 to-purple-600/20 border border-violet-500/30">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              무료 계정으로 VocaVision의 모든 기본 기능을 체험해보세요.
              신용카드 없이 바로 시작할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button variant="gradient" size="xl">
                  무료로 시작하기
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <span className="font-bold">VocaVision</span>
              </div>
              <p className="text-sm text-gray-500">
                AI 기반 영어 단어 학습 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/learn" className="hover:text-white">단어 학습</Link></li>
                <li><Link href="/quiz" className="hover:text-white">퀴즈</Link></li>
                <li><Link href="/simulator" className="hover:text-white">시뮬레이터</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">고객센터</Link></li>
                <li><Link href="/faq" className="hover:text-white">자주 묻는 질문</Link></li>
                <li><Link href="/contact" className="hover:text-white">문의하기</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">법적 고지</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white">이용약관</Link></li>
                <li><Link href="/privacy" className="hover:text-white">개인정보처리방침</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} VocaVision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
