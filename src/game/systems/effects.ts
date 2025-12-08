import type { Effect, GameState, BusinessMetrics } from '../types';
import { DEFAULT_COST_STRUCTURE } from '../config/initialState';

type SetState = (fn: (state: GameState) => Partial<GameState>) => void;

export function applyEffect(effect: Effect, state: GameState, set: SetState): void {
  const { type, value } = effect;

  switch (type) {
    // 재무 관련
    case 'cash':
      set((s) => ({
        business: {
          ...s.business,
          finance: {
            ...s.business.finance,
            cash: s.business.finance.cash + value,
          },
        },
      }));
      break;

    // 사용자 관련
    case 'users':
      set((s) => {
        const newTotal = Math.max(0, s.business.users.total + value);
        return {
          business: {
            ...s.business,
            users: {
              ...s.business.users,
              total: newTotal,
              dau: Math.floor(newTotal * (0.3 + Math.random() * 0.2)),
              mau: Math.floor(newTotal * (0.6 + Math.random() * 0.2)),
            },
          },
        };
      });
      break;

    case 'premium_users':
      set((s) => ({
        business: {
          ...s.business,
          users: {
            ...s.business.users,
            premium: Math.max(0, s.business.users.premium + value),
          },
        },
      }));
      break;

    // 플레이어 건강 관련
    case 'stress':
      set((s) => ({
        player: {
          ...s.player,
          health: {
            ...s.player.health,
            stress: Math.max(0, Math.min(100, s.player.health.stress + value)),
            burnoutRisk: Math.max(
              0,
              Math.min(100, s.player.health.burnoutRisk + (value > 0 ? value * 0.2 : 0))
            ),
          },
        },
      }));
      break;

    case 'energy':
      set((s) => ({
        player: {
          ...s.player,
          health: {
            ...s.player.health,
            energy: Math.max(0, Math.min(100, s.player.health.energy + value)),
          },
        },
      }));
      break;

    case 'health':
      set((s) => ({
        player: {
          ...s.player,
          health: {
            ...s.player.health,
            physical: Math.max(0, Math.min(100, s.player.health.physical + value)),
            mental: Math.max(0, Math.min(100, s.player.health.mental + value * 0.5)),
          },
        },
      }));
      break;

    // 평판 관련
    case 'reputation':
      set((s) => ({
        player: {
          ...s.player,
          social: {
            ...s.player.social,
            reputation: Math.max(0, Math.min(100, s.player.social.reputation + value)),
          },
        },
      }));
      break;

    // 스킬 관련
    case 'skill_coding':
      set((s) => ({
        player: {
          ...s.player,
          skills: {
            ...s.player.skills,
            coding: Math.max(0, Math.min(100, s.player.skills.coding + value)),
          },
        },
      }));
      break;

    case 'skill_design':
      set((s) => ({
        player: {
          ...s.player,
          skills: {
            ...s.player.skills,
            design: Math.max(0, Math.min(100, s.player.skills.design + value)),
          },
        },
      }));
      break;

    case 'skill_marketing':
      set((s) => ({
        player: {
          ...s.player,
          skills: {
            ...s.player.skills,
            marketing: Math.max(0, Math.min(100, s.player.skills.marketing + value)),
          },
        },
      }));
      break;

    case 'skill_business':
      set((s) => ({
        player: {
          ...s.player,
          skills: {
            ...s.player.skills,
            business: Math.max(0, Math.min(100, s.player.skills.business + value)),
          },
        },
      }));
      break;

    case 'skill_communication':
      set((s) => ({
        player: {
          ...s.player,
          skills: {
            ...s.player.skills,
            communication: Math.max(0, Math.min(100, s.player.skills.communication + value)),
          },
        },
      }));
      break;

    case 'skill_leadership':
      set((s) => ({
        player: {
          ...s.player,
          skills: {
            ...s.player.skills,
            leadership: Math.max(0, Math.min(100, s.player.skills.leadership + value)),
          },
        },
      }));
      break;

    // 제품 관련
    case 'product_stability':
      set((s) => ({
        business: {
          ...s.business,
          product: {
            ...s.business.product,
            stability: Math.max(0, Math.min(100, s.business.product.stability + value)),
          },
        },
      }));
      break;

    case 'server_health':
      set((s) => ({
        business: {
          ...s.business,
          infrastructure: {
            ...s.business.infrastructure,
            serverHealth: Math.max(0, Math.min(100, s.business.infrastructure.serverHealth + value)),
          },
        },
      }));
      break;

    case 'technical_debt':
      set((s) => ({
        business: {
          ...s.business,
          product: {
            ...s.business.product,
            technicalDebt: Math.max(0, Math.min(100, s.business.product.technicalDebt + value)),
          },
        },
      }));
      break;

    case 'code_quality':
      set((s) => ({
        business: {
          ...s.business,
          product: {
            ...s.business.product,
            codeQuality: Math.max(0, Math.min(100, s.business.product.codeQuality + value)),
          },
        },
      }));
      break;

    // 브랜드 관련
    case 'brand_awareness':
      // 브랜드 인지도는 사용자 증가와 평판에 영향
      set((s) => ({
        player: {
          ...s.player,
          social: {
            ...s.player.social,
            reputation: Math.max(0, Math.min(100, s.player.social.reputation + value * 0.3)),
          },
        },
        business: {
          ...s.business,
          users: {
            ...s.business.users,
            total: Math.max(0, s.business.users.total + Math.floor(value * 2)),
          },
        },
      }));
      break;

    case 'nps':
      set((s) => ({
        business: {
          ...s.business,
          users: {
            ...s.business.users,
            nps: Math.max(-100, Math.min(100, s.business.users.nps + value)),
          },
        },
      }));
      break;

    case 'churn_rate':
      set((s) => ({
        business: {
          ...s.business,
          users: {
            ...s.business.users,
            churnRate: Math.max(0, Math.min(100, s.business.users.churnRate + value)),
          },
        },
      }));
      break;

    case 'feature_progress':
      // 현재 개발 중인 기능의 진행률 증가
      set((s) => {
        const features = [...s.business.product.features];
        const inProgressFeature = features.find((f) => f.progress < 100);
        if (inProgressFeature) {
          inProgressFeature.progress = Math.min(100, inProgressFeature.progress + value);
        }
        return {
          business: {
            ...s.business,
            product: {
              ...s.business.product,
              features,
            },
          },
        };
      });
      break;

    case 'bug_fix':
      set((s) => {
        const bugs = [...s.business.product.bugs];
        const fixCount = Math.abs(value);
        for (let i = 0; i < fixCount && bugs.length > 0; i++) {
          const criticalBug = bugs.findIndex((b) => b.severity === 'critical');
          const highBug = bugs.findIndex((b) => b.severity === 'high');
          const indexToRemove = criticalBug !== -1 ? criticalBug : highBug !== -1 ? highBug : 0;
          bugs.splice(indexToRemove, 1);
        }
        return {
          business: {
            ...s.business,
            product: {
              ...s.business.product,
              bugs,
              stability: Math.min(100, s.business.product.stability + fixCount * 5),
            },
          },
        };
      });
      break;

    // 개인 상태 관련
    case 'motivation':
      set((s) => ({
        player: {
          ...s.player,
          personal: {
            ...s.player.personal,
            motivation: Math.max(0, Math.min(100, s.player.personal.motivation + value)),
          },
        },
      }));
      break;

    case 'confidence':
      set((s) => ({
        player: {
          ...s.player,
          personal: {
            ...s.player.personal,
            confidence: Math.max(0, Math.min(100, s.player.personal.confidence + value)),
          },
        },
      }));
      break;

    case 'work_life_balance':
      set((s) => ({
        player: {
          ...s.player,
          personal: {
            ...s.player.personal,
            workLifeBalance: Math.max(0, Math.min(100, s.player.personal.workLifeBalance + value)),
          },
        },
      }));
      break;

    default:
      console.warn(`Unknown effect type: ${type}`);
  }
}

// 월간 비용 계산
export function calculateMonthlyCosts(business: BusinessMetrics): number {
  const costs = DEFAULT_COST_STRUCTURE;
  const users = business.users.total;

  // 고정 비용
  const serverCost = costs.fixed.server.base + (users * costs.fixed.server.perUser);
  const domainCost = Math.ceil(costs.fixed.domain / 12);
  const emailCost = costs.fixed.email;
  const toolsCost = costs.fixed.tools;

  // 변동 비용 (API 사용량 등)
  const openaiCost = costs.variable.openai.monthlyBase + (users * 10); // 사용자당 API 비용

  // 총 비용
  return serverCost + domainCost + emailCost + toolsCost + openaiCost;
}

// 월간 수익 계산
export function calculateMonthlyRevenue(business: BusinessMetrics): number {
  const premiumUsers = business.users.premium;
  const subscriptionPrice = 9990; // 월 9,990원

  // 구독 수익
  const subscriptionRevenue = premiumUsers * subscriptionPrice;

  // Stripe 수수료 차감
  const stripeFee = subscriptionRevenue * (DEFAULT_COST_STRUCTURE.variable.stripe.percentage / 100);
  const stripeFixed = premiumUsers * DEFAULT_COST_STRUCTURE.variable.stripe.fixed;

  return Math.floor(subscriptionRevenue - stripeFee - stripeFixed);
}

// 서버 상태 자연 감소
export function calculateServerDecay(currentHealth: number, users: number): number {
  const baseDecay = 0.5; // 기본 감소율
  const userLoadDecay = users / 5000; // 사용자 1000명당 0.2% 감소
  return Math.max(0, currentHealth - baseDecay - userLoadDecay);
}

// 이탈률 계산
export function calculateChurnRate(business: BusinessMetrics): number {
  const baseChurn = 5; // 기본 5%
  const stabilityBonus = (business.product.stability - 50) / 10; // 안정성 보너스
  const npsBonus = business.users.nps / 20; // NPS 보너스
  const bugPenalty = business.product.bugs.filter((b) => b.severity === 'critical').length * 2;

  return Math.max(0, Math.min(30, baseChurn - stabilityBonus - npsBonus + bugPenalty));
}

// 사용자 자연 증가/감소
export function calculateUserGrowth(business: BusinessMetrics, reputation: number): number {
  const baseGrowth = Math.floor(Math.random() * 5) - 1; // -1 ~ 3
  const reputationBonus = Math.floor((reputation - 50) / 10);
  const churnLoss = Math.floor(business.users.total * (business.users.churnRate / 100 / 30));

  return baseGrowth + reputationBonus - churnLoss;
}
