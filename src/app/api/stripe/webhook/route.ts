import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('Stripe-Signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;

        if (userId && subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await prisma.subscription.update({
            where: { userId },
            data: {
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscriptionId,
              stripePriceId: subscription.items.data[0].price.id,
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              plan: getPlanFromPriceId(subscription.items.data[0].price.id),
              status: 'ACTIVE',
            },
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              status: 'ACTIVE',
            },
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscriptionId },
            data: {
              status: 'PAST_DUE',
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            plan: getPlanFromPriceId(subscription.items.data[0].price.id),
            status: subscription.status === 'active' ? 'ACTIVE' :
                    subscription.status === 'past_due' ? 'PAST_DUE' :
                    subscription.status === 'canceled' ? 'CANCELED' : 'INACTIVE',
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            plan: 'FREE',
            status: 'CANCELED',
            stripeSubscriptionId: null,
            stripePriceId: null,
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

function getPlanFromPriceId(priceId: string): 'FREE' | 'BASIC' | 'PREMIUM' | 'LIFETIME' {
  const priceMapping: Record<string, 'BASIC' | 'PREMIUM' | 'LIFETIME'> = {
    [process.env.STRIPE_PRICE_BASIC_MONTHLY!]: 'BASIC',
    [process.env.STRIPE_PRICE_BASIC_YEARLY!]: 'BASIC',
    [process.env.STRIPE_PRICE_PREMIUM_MONTHLY!]: 'PREMIUM',
    [process.env.STRIPE_PRICE_PREMIUM_YEARLY!]: 'PREMIUM',
    [process.env.STRIPE_PRICE_LIFETIME!]: 'LIFETIME',
  };

  return priceMapping[priceId] || 'FREE';
}
