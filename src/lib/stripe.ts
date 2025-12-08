import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

export const PLANS = {
  FREE: {
    name: '무료',
    description: '기본 학습 기능',
    price: 0,
    features: [
      '기본 단어 100개',
      '플래시카드 학습',
      '일일 퀴즈 3회',
      '학습 통계 기본',
    ],
    limits: {
      words: 100,
      dailyQuizzes: 3,
      aiMnemonics: 0,
    },
  },
  BASIC: {
    name: '베이직',
    description: '더 많은 단어와 기능',
    priceMonthly: 4990,
    priceYearly: 39900,
    stripePriceMonthly: process.env.STRIPE_PRICE_BASIC_MONTHLY,
    stripePriceYearly: process.env.STRIPE_PRICE_BASIC_YEARLY,
    features: [
      '단어 1,000개 이상',
      '모든 학습 모드',
      '무제한 퀴즈',
      'AI 연상법 월 50회',
      '상세 학습 통계',
      '광고 제거',
    ],
    limits: {
      words: 1000,
      dailyQuizzes: -1,
      aiMnemonics: 50,
    },
  },
  PREMIUM: {
    name: '프리미엄',
    description: '모든 기능 무제한',
    priceMonthly: 9990,
    priceYearly: 79900,
    stripePriceMonthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY,
    stripePriceYearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
    features: [
      '모든 단어 무제한',
      '모든 학습 모드',
      '무제한 퀴즈',
      'AI 연상법 무제한',
      '고급 통계 및 분석',
      '우선 고객 지원',
      '오프라인 학습',
      'API 액세스',
    ],
    limits: {
      words: -1,
      dailyQuizzes: -1,
      aiMnemonics: -1,
    },
  },
  LIFETIME: {
    name: '평생이용권',
    description: '한 번 결제로 평생 사용',
    priceOnce: 199000,
    stripePriceOnce: process.env.STRIPE_PRICE_LIFETIME,
    features: [
      '프리미엄의 모든 기능',
      '평생 무료 업데이트',
      '신규 기능 우선 체험',
      'VIP 커뮤니티 액세스',
    ],
    limits: {
      words: -1,
      dailyQuizzes: -1,
      aiMnemonics: -1,
    },
  },
};

export async function createCheckoutSession({
  userId,
  email,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  email: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
    subscription_data: {
      metadata: {
        userId,
      },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    locale: 'ko',
  });

  return session;
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId);
}
