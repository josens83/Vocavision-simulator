// VocaVision Simulator - Core Game Types
// Chapter 1: Core Game Design

// ============================================
// Time System Types
// ============================================

export type DayPhase = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeState {
  currentDate: Date;
  dayPhase: DayPhase;
  totalDays: number;
  tick: number; // 0-47 (48 ticks per day)
  isPaused: boolean;
  speed: 1 | 2 | 4; // Game speed multiplier
}

export interface TimeConfig {
  realTimeToGameTime: number; // 1 real second = X game minutes
  ticksPerDay: number;
  msPerTick: number;
}

// ============================================
// Player Stats Types
// ============================================

export interface HealthStats {
  physical: number; // 0-100
  mental: number; // 0-100
  energy: number; // 0-100
  stress: number; // 0-100
  burnoutRisk: number; // 0-100
}

export interface SkillStats {
  coding: number; // 0-100
  design: number; // 0-100
  marketing: number; // 0-100
  business: number; // 0-100
  communication: number; // 0-100
  leadership: number; // 0-100
}

export interface SocialStats {
  reputation: number; // 0-100
  network: Contact[];
  credibility: number; // 0-100
}

export interface PersonalStats {
  motivation: number; // 0-100
  confidence: number; // 0-100
  workLifeBalance: number; // 0-100
  savings: number; // Personal savings (emergency fund)
}

export interface PlayerStats {
  health: HealthStats;
  skills: SkillStats;
  social: SocialStats;
  personal: PersonalStats;
}

export interface Contact {
  id: string;
  name: string;
  type: 'investor' | 'developer' | 'marketer' | 'mentor' | 'partner' | 'journalist' | 'customer';
  relationship: number; // 0-100
  influence: number; // 0-100
  lastContact: Date;
  specialAbility?: string;
}

// ============================================
// Business Metrics Types
// ============================================

export interface FinanceMetrics {
  cash: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  runway: number; // Months of cash remaining
  debt: number;
  investments: Investment[];
}

export interface Investment {
  id: string;
  investorName: string;
  amount: number;
  equityPercentage: number;
  date: Date;
  terms: string[];
}

export interface UserMetrics {
  total: number;
  dau: number; // Daily Active Users
  mau: number; // Monthly Active Users
  premium: number;
  churnRate: number; // Percentage
  nps: number; // Net Promoter Score -100 to 100
  ltv: number; // Lifetime Value
  cac: number; // Customer Acquisition Cost
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  progress: number; // 0-100
  releaseDate?: Date;
  impact: {
    users: number;
    revenue: number;
    satisfaction: number;
  };
}

export interface Bug {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reportedDate: Date;
  affectedUsers: number;
  status: 'new' | 'investigating' | 'fixing' | 'resolved';
}

export interface ProductMetrics {
  version: string;
  stability: number; // 0-100
  features: Feature[];
  bugs: Bug[];
  technicalDebt: number; // 0-100
  codeQuality: number; // 0-100
}

export interface InfrastructureMetrics {
  serverHealth: number; // 0-100
  uptime: number; // Percentage
  responseTime: number; // Average ms
  securityScore: number; // 0-100
  scalability: number; // 0-100
}

export interface BusinessMetrics {
  finance: FinanceMetrics;
  users: UserMetrics;
  product: ProductMetrics;
  infrastructure: InfrastructureMetrics;
}

// ============================================
// Task System Types
// ============================================

export type TaskCategory =
  | 'development'
  | 'marketing'
  | 'customer_support'
  | 'business'
  | 'learning'
  | 'networking'
  | 'personal'
  | 'emergency';

export type EffectType =
  | 'cash'
  | 'users'
  | 'premium_users'
  | 'reputation'
  | 'stress'
  | 'energy'
  | 'health'
  | 'skill_coding'
  | 'skill_design'
  | 'skill_marketing'
  | 'skill_business'
  | 'skill_communication'
  | 'skill_leadership'
  | 'product_stability'
  | 'server_health'
  | 'technical_debt'
  | 'code_quality'
  | 'brand_awareness'
  | 'nps'
  | 'churn_rate'
  | 'feature_progress'
  | 'bug_fix'
  | 'motivation'
  | 'confidence'
  | 'work_life_balance';

export interface Effect {
  type: EffectType;
  value: number;
  duration?: number; // In game days, if temporary
}

export interface TaskRequirements {
  energy: number;
  skills?: Partial<SkillStats>;
  tools?: string[];
  money?: number;
  time?: number; // Hours
}

export interface TaskOutcomes {
  guaranteed: Effect[];
  possible: { effect: Effect; chance: number }[];
  risks: { effect: Effect; chance: number }[];
}

export interface Task {
  id: string;
  category: TaskCategory;
  name: string;
  description: string;
  icon: string;

  // Time requirements
  estimatedHours: number;
  actualHoursRange: [number, number];
  deadline?: Date;

  // Requirements
  requirements: TaskRequirements;

  // Outcomes
  outcomes: TaskOutcomes;

  // Context
  prerequisite?: string[];
  blockedBy?: string[];
  synergy?: string[];

  // Repeatable
  repeatable: boolean;
  cooldownHours?: number;
  lastCompleted?: Date;
}

export interface ActiveTask {
  task: Task;
  startTime: Date;
  progress: number; // 0-100
  actualHours: number;
  interrupts: string[];
}

// ============================================
// Event & Decision System Types
// ============================================

export type EventSeverity = 'critical' | 'warning' | 'good' | 'normal' | 'info';

export type DecisionType =
  | 'strategic'
  | 'tactical'
  | 'reactive'
  | 'ethical'
  | 'financial'
  | 'hiring'
  | 'pivot';

export interface DecisionOption {
  id: string;
  text: string;
  requirements?: {
    money?: number;
    skills?: Partial<SkillStats>;
    reputation?: number;
  };
  effects: {
    immediate: Effect[];
    delayed: { effect: Effect; delayDays: number }[];
    probability: { effect: Effect; chance: number }[];
  };
  unlocks?: string[];
  blocks?: string[];
  resultText: string;
}

export interface GameEvent {
  id: string;
  type: string;
  severity: EventSeverity;
  title: string;
  description: string;
  icon?: string;

  // Timing
  triggerConditions?: EventTriggerCondition[];
  probability?: number; // Base probability per day
  minDay?: number; // Earliest day this can trigger
  maxOccurrences?: number;

  // Decision
  choices: DecisionOption[];
  timeLimit?: number; // Seconds to decide, or auto-selects worst

  // Metadata
  category: string;
  tags: string[];
}

export interface EventTriggerCondition {
  type: 'stat' | 'metric' | 'day' | 'event_completed' | 'random';
  target: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: number | string | boolean;
}

export interface ScheduledEvent {
  event: GameEvent;
  triggerDate: Date;
  triggered: boolean;
}

export interface DelayedEffect {
  effect: Effect;
  triggerDate: Date;
  source: string;
  applied: boolean;
}

// ============================================
// Notification System Types
// ============================================

export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'event';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: {
    eventId: string;
  };
}

// ============================================
// Achievement & Milestone Types
// ============================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  reward?: Effect[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  day: number;
  achieved: boolean;
  achievedAt?: Date;
}

// ============================================
// Save System Types
// ============================================

export type Difficulty = 'easy' | 'normal' | 'hard' | 'realistic';

export interface GameSaveMeta {
  version: string;
  saveDate: Date;
  playTime: number; // Total minutes played
  difficulty: Difficulty;
  saveName: string;
  slot: number;
}

export interface GameHistory {
  decisions: DecisionRecord[];
  financialHistory: FinancialRecord[];
  metricsSnapshots: MetricsSnapshot[];
}

export interface DecisionRecord {
  eventId: string;
  choiceId: string;
  date: Date;
  outcome: string;
}

export interface FinancialRecord {
  date: Date;
  cash: number;
  revenue: number;
  expenses: number;
  description: string;
}

export interface MetricsSnapshot {
  date: Date;
  users: number;
  premium: number;
  cash: number;
  reputation: number;
}

export interface GameProgress {
  completedEvents: string[];
  unlockedFeatures: string[];
  achievements: Achievement[];
  milestones: Milestone[];
}

export interface GameRelationships {
  contacts: Contact[];
  competitors: Competitor[];
  partners: Partner[];
}

export interface Competitor {
  id: string;
  name: string;
  marketShare: number;
  threatLevel: number;
  features: string[];
}

export interface Partner {
  id: string;
  name: string;
  type: 'b2b' | 'integration' | 'affiliate';
  revenue: number;
  startDate: Date;
}

// ============================================
// Complete Game State
// ============================================

export interface GameState {
  meta: GameSaveMeta;
  time: TimeState;
  player: PlayerStats;
  business: BusinessMetrics;
  progress: GameProgress;
  relationships: GameRelationships;
  history: GameHistory;

  // Active game elements
  currentEvent: GameEvent | null;
  activeTask: ActiveTask | null;
  notifications: Notification[];
  scheduledEvents: ScheduledEvent[];
  delayedEffects: DelayedEffect[];

  // Game status
  gameOver: boolean;
  gameOverReason: string;
  victory: boolean;
  victoryType?: string;
}

// ============================================
// Cost Structure Types
// ============================================

export interface CostStructure {
  fixed: {
    server: { base: number; perUser: number };
    domain: number;
    email: number;
    tools: number;
  };
  variable: {
    openai: { perRequest: number; monthlyBase: number };
    stripe: { percentage: number; fixed: number };
    marketing: number;
  };
  occasional: {
    legal: number;
    accounting: number;
    design: number;
    development: number;
  };
}

// ============================================
// Game Configuration Types
// ============================================

export interface GameConfig {
  difficulty: Difficulty;
  timeConfig: TimeConfig;
  costStructure: CostStructure;
  startingState: {
    cash: number;
    users: number;
    premiumUsers: number;
    skills: Partial<SkillStats>;
  };
  gameOverConditions: GameOverCondition[];
  victoryConditions: VictoryCondition[];
}

export interface GameOverCondition {
  type: 'stat' | 'metric';
  target: string;
  operator: '<' | '>' | '<=' | '>=';
  value: number;
  reason: string;
}

export interface VictoryCondition {
  type: 'stat' | 'metric' | 'milestone';
  target: string;
  operator: '<' | '>' | '<=' | '>=';
  value: number;
  victoryType: string;
  description: string;
}
