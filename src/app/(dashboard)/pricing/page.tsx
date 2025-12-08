'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Crown, Sparkles, Zap, Star } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: '무료',
    price: '0',
    period: '',
    description: '기본 기능으로 시작하기',
    features: [
      '기본 단어 100개',
      '플래시카드 학습',
      '일일 퀴즈 3회',
      '기본 통계',
    ],
    notIncluded: ['AI 연상법', '오프라인 학습', '광고 제거'],
    popular: false,
    color: 'from-gray-500 to-gray-600',
  },
  {
    id: 'basic',
    name: '베이직',
    price: '4,990',
    yearlyPrice: '39,900',
    period: '/월',
    description: '더 많은 단어와 기능',
    features: [
      '단어 1,000개+',
      '모든 학습 모드',
      '무제한 퀴즈',
      'AI 연상법 50회/월',
      '상세 학습 통계',
      '광고 제거',
    ],
    notIncluded: ['오프라인 학습', 'API 액세스'],
    popular: false,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'premium',
    name: '프리미엄',
    price: '9,990',
    yearlyPrice: '79,900',
    period: '/월',
    description: '모든 기능 무제한',
    features: [
      '모든 단어 무제한',
      '모든 학습 모드',
      '무제한 퀴즈',
      'AI 연상법 무제한',
      '고급 통계 & 분석',
      '우선 고객 지원',
      '오프라인 학습',
      'API 액세스',
    ],
    notIncluded: [],
    popular: true,
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'lifetime',
    name: '평생이용권',
    price: '199,000',
    period: '(1회)',
    description: '평생 무제한 이용',
    features: [
      '프리미엄 모든 기능',
      '평생 무료 업데이트',
      '신규 기능 우선 체험',
      'VIP 커뮤니티 액세스',
      '1:1 학습 상담',
    ],
    notIncluded: [],
    popular: false,
    color: 'from-amber-500 to-orange-500',
  },
];

export default function PricingPage() {
  const { data: session } = useSession();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (planId: string, priceId?: string) => {
    if (!session) {
      window.location.href = '/login?callbackUrl=/pricing';
      return;
    }

    if (planId === 'free') return;

    setIsLoading(planId);

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceId || `price_${planId}_${billingCycle}`,
          plan: planId,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">요금제</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-6">
            <Crown className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-violet-300">더 많은 기능 잠금 해제</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            당신에게 맞는 요금제를 선택하세요
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            무료로 시작하고, 필요에 따라 업그레이드하세요.
            연간 결제 시 17% 할인됩니다.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center p-1 bg-white/5 rounded-full">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              월간
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              연간
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl ${
                plan.popular
                  ? 'bg-gradient-to-br from-violet-600/20 to-purple-600/20 border-2 border-violet-500'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  인기
                </div>
              )}

              <div className="mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                  {plan.id === 'free' && <Zap className="w-6 h-6" />}
                  {plan.id === 'basic' && <Sparkles className="w-6 h-6" />}
                  {plan.id === 'premium' && <Crown className="w-6 h-6" />}
                  {plan.id === 'lifetime' && <Star className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-black">
                  ₩{billingCycle === 'yearly' && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
                </span>
                {plan.period && (
                  <span className="text-gray-400">
                    {billingCycle === 'yearly' && plan.yearlyPrice ? '/년' : plan.period}
                  </span>
                )}
                {billingCycle === 'yearly' && plan.yearlyPrice && (
                  <div className="text-sm text-emerald-400 mt-1">
                    월 ₩{Math.round(parseInt(plan.yearlyPrice.replace(',', '')) / 12).toLocaleString()} (연 결제)
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 opacity-50">
                    <span className="w-5 h-5 flex items-center justify-center text-gray-500 shrink-0">—</span>
                    <span className="text-sm text-gray-500 line-through">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={isLoading === plan.id}
                variant={plan.popular ? 'gradient' : 'outline'}
                className="w-full"
              >
                {isLoading === plan.id ? (
                  '처리 중...'
                ) : plan.id === 'free' ? (
                  '현재 플랜'
                ) : (
                  `${plan.name} 시작하기`
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ / Features Comparison */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold mb-4">자주 묻는 질문</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold mb-2">환불 정책은 어떻게 되나요?</h4>
              <p className="text-sm text-gray-400">
                결제 후 7일 이내에 환불 요청 시 전액 환불해드립니다.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold mb-2">플랜 변경이 가능한가요?</h4>
              <p className="text-sm text-gray-400">
                언제든지 상위 플랜으로 업그레이드하거나 하위 플랜으로 다운그레이드할 수 있습니다.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold mb-2">평생이용권은 정말 평생인가요?</h4>
              <p className="text-sm text-gray-400">
                네! 한 번 결제하시면 서비스가 유지되는 한 평생 프리미엄 기능을 이용하실 수 있습니다.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
              <h4 className="font-semibold mb-2">결제 수단은 무엇이 있나요?</h4>
              <p className="text-sm text-gray-400">
                신용카드, 체크카드, 간편결제(카카오페이, 네이버페이 등)를 지원합니다.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
