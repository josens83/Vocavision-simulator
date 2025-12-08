import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { priceId, plan } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: '요금제를 선택해주세요.' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const checkoutSession = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email,
      priceId,
      successUrl: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancelUrl: `${baseUrl}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json(
      { error: '결제 세션 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
