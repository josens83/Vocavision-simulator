/**
 * Chapter 5: Audio & Atmosphere - Type Definitions
 * 오디오 시스템 타입 정의
 */

// ============================================
// 기본 오디오 타입
// ============================================

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'lateNight';
export type GamePhase = 'early' | 'mid' | 'late' | 'endgame';
export type Mood = 'neutral' | 'positive' | 'negative' | 'tense' | 'critical' | 'calm' | 'melancholy' | 'focused';
export type Weather = 'clear' | 'rain_light' | 'rain_heavy' | 'windy' | 'snow';

// ============================================
// 음악 시스템 타입
// ============================================

export enum MusicCategory {
  AMBIENT = 'ambient',
  MAIN = 'main',
  WORK = 'work',
  TENSION = 'tension',
  EVENT = 'event',
  VICTORY = 'victory',
  DEFEAT = 'defeat',
  MENU = 'menu'
}

export interface Stem {
  id: string;
  instrument: string;
  file: string;
  layer: number;
  conditions?: {
    minIntensity?: number;
    trigger?: string;
  };
}

export interface DuckingConfig {
  trigger: string;
  amount: number;
  attackTime: number;
  releaseTime: number;
}

export interface MusicTrack {
  id: string;
  name: string;
  category: MusicCategory;
  files: {
    stems: Stem[];
    full?: string;
  };
  properties: {
    bpm: number;
    key: string;
    timeSignature: string;
    duration: number;
    loopPoints: { start: number; end: number };
  };
  conditions: {
    timeOfDay?: TimeOfDay[];
    gamePhase?: GamePhase[];
    mood?: Mood[];
    minIntensity?: number;
    maxIntensity?: number;
  };
  mixing: {
    baseVolume: number;
    ducking: DuckingConfig;
  };
}

export interface MusicLayer {
  id: number;
  name: string;
  alwaysOn?: boolean;
  intensityThreshold?: number;
}

export interface TransitionConfig {
  crossfadeDuration: number;
  layerFadeDuration: number;
  specialTransitions: Record<string, {
    type: 'quick' | 'gradual' | 'cut' | 'slow';
    duration: number;
    effect?: string;
  }>;
}

export interface ContextRule {
  condition: {
    type: string;
    operator?: string;
    value: any;
  };
  action: {
    type: string;
    target?: string;
    transition?: string;
    layer?: string;
    fadeIn?: number;
    overlay?: boolean;
  };
}

export interface AdaptiveMusicSystem {
  tracks: MusicTrack[];
  layers: MusicLayer[];
  transitions: TransitionConfig;
  contextRules: ContextRule[];
}

// ============================================
// 효과음 시스템 타입
// ============================================

export interface SFXSound {
  id: string;
  name: string;
  files: string[];
  category: string;
  properties: {
    volume: number;
    pitch: number;
    pitchVariation: number;
    maxInstances: number;
    cooldown?: number;
  };
  spatial?: {
    position: 'left' | 'center' | 'right';
    distance: number;
  };
}

export interface SFXCategory {
  name: string;
  sounds: SFXSound[];
}

export interface VariationConfig {
  pitchRange: { min: number; max: number };
  volumeRange: { min: number; max: number };
  selectionMode: 'random' | 'round_robin' | 'random_no_repeat';
}

export interface PlaybackRules {
  maxTotalSounds: number;
  priorityLevels: Record<string, number>;
  ducking: {
    enabled: boolean;
    triggerPriority: number;
    amount: number;
    attackTime: number;
    releaseTime: number;
  };
}

export interface SFXLibrary {
  categories: SFXCategory[];
  variations: VariationConfig;
  playbackRules: PlaybackRules;
}

export interface PlayOptions {
  volume?: number;
  pitch?: number;
  pan?: number;
  delay?: number;
  priority?: number;
}

export interface SoundInstance {
  id: string;
  source: AudioBufferSourceNode;
  gain: GainNode;
  startTime: number;
  priority: number;
  stop: () => void;
}

// ============================================
// 앰비언스 시스템 타입
// ============================================

export interface AmbienceLayer {
  id: string;
  file: string;
  volume: number;
  loop: boolean;
  fadeIn: number;
  fadeOut: number;
  randomStart?: boolean;
  duck?: boolean;
}

export interface EnvironmentCondition {
  type: 'location' | 'event' | 'state';
  value: string;
}

export interface AmbienceEnvironment {
  id: string;
  name: string;
  layers: AmbienceLayer[];
  conditions: EnvironmentCondition[];
}

export interface WeatherSound {
  id: string;
  name: string;
  file: string;
  volume: number;
  loop: boolean;
  conditions: { type: string; value: string }[];
  additionalLayers?: {
    file: string;
    volume: number;
    interval: [number, number];
    random?: boolean;
  }[];
}

export interface TimeSound {
  id: string;
  name: string;
  layers: {
    file: string;
    volume: number;
    fadeThrough?: boolean;
    interval?: [number, number];
  }[];
  timeRange: { start: number; end: number };
}

export interface AmbienceSystem {
  environments: AmbienceEnvironment[];
  weatherEffects: WeatherSound[];
  timeOfDayEffects: TimeSound[];
}

export interface AmbienceLayerInstance {
  id: string;
  source: AudioBufferSourceNode;
  gain: GainNode;
  config: AmbienceLayer | WeatherSound | any;
}

// ============================================
// 믹싱 시스템 타입
// ============================================

export interface AudioEffect {
  type: 'lowpass' | 'highpass' | 'compressor' | 'reverb' | 'delay' | 'distortion';
  frequency?: number;
  Q?: number;
  threshold?: number;
  ratio?: number;
  attack?: number;
  release?: number;
  decay?: number;
  wet?: number;
  dry?: number;
}

export interface BusSend {
  target: string;
  amount: number;
}

export interface AudioBus {
  id: string;
  name: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  effects: AudioEffect[];
  sends: BusSend[];
}

export interface CompressorConfig {
  threshold: number;
  ratio: number;
  attack: number;
  release: number;
  knee: number;
  makeupGain: number;
}

export interface LimiterConfig {
  threshold: number;
  release: number;
  lookahead: number;
}

export interface EQBand {
  frequency: number;
  gain: number;
  Q: number;
  type: 'lowshelf' | 'highshelf' | 'peaking';
}

export interface EQConfig {
  bands: EQBand[];
}

export interface MasterChain {
  compressor: CompressorConfig;
  limiter: LimiterConfig;
  eq: EQConfig;
}

export interface DynamicMixingAction {
  bus: string;
  param?: string;
  effect?: string;
  value: number;
  transition: number;
}

export interface DynamicMixingRule {
  trigger: string;
  actions: DynamicMixingAction[];
}

export interface DynamicMixingRules {
  rules: DynamicMixingRule[];
}

export interface MixingSystem {
  busses: AudioBus[];
  masterChain: MasterChain;
  dynamicMixing: DynamicMixingRules;
}

export interface BusNode {
  input: GainNode;
  gain: GainNode;
  pan: StereoPannerNode;
  effects: AudioNode[];
  output: AudioNode;
}

// ============================================
// 사운드 트리거 시스템 타입
// ============================================

export interface TriggerCondition {
  type: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: any;
}

export interface SoundAction {
  type: 'play' | 'stop' | 'fade' | 'crossfade';
  target: string;
  options?: {
    volume?: number;
    delay?: number;
    fadeTime?: number;
    priority?: number;
  };
}

export interface SoundMapping {
  event: string;
  sounds: SoundAction[];
  conditions?: TriggerCondition[];
}

export interface SequenceSound {
  target: string;
  delay: number;
  repeat?: number;
  interval?: number;
}

export interface SoundSequence {
  id: string;
  sounds: SequenceSound[];
  trigger: string;
}

export interface SoundTriggerSystem {
  mappings: SoundMapping[];
  conditions: TriggerCondition[];
  sequences: SoundSequence[];
}

// ============================================
// 오디오 설정 타입
// ============================================

export interface VolumeSettings {
  volume: number;
  muted: boolean;
}

export interface BehaviorSettings {
  muteOnFocusLoss: boolean;
  muteOnMinimize: boolean;
  dynamicRange: 'full' | 'reduced' | 'night';
  spatialAudio: boolean;
  lowLatencyMode: boolean;
}

export interface QualitySettings {
  sampleRate: 44100 | 48000;
  bitDepth: 16 | 24;
  streaming: boolean;
}

export interface AudioSettings {
  master: VolumeSettings;
  music: VolumeSettings;
  sfx: VolumeSettings;
  ambience: VolumeSettings;
  ui: VolumeSettings;
  voice: VolumeSettings;
  behavior: BehaviorSettings;
  quality: QualitySettings;
}

// ============================================
// 오디오 매니저 상태
// ============================================

export interface AudioManagerState {
  initialized: boolean;
  suspended: boolean;
  currentTrack: string | null;
  currentEnvironment: string | null;
  currentWeather: Weather | null;
  intensity: number;
  mood: Mood;
  timeOfDay: TimeOfDay;
  gamePhase: GamePhase;
}

// ============================================
// 이벤트 타입
// ============================================

export type AudioEventType =
  | 'button_click'
  | 'button_hover'
  | 'toggle_on'
  | 'toggle_off'
  | 'tab_switch'
  | 'modal_open'
  | 'modal_close'
  | 'invalid_action'
  | 'action_develop'
  | 'action_marketing'
  | 'action_rest'
  | 'action_server'
  | 'day_advance'
  | 'month_end'
  | 'money_gained'
  | 'money_lost'
  | 'money_critical'
  | 'user_gained'
  | 'user_churned'
  | 'energy_low'
  | 'stress_high'
  | 'server_critical'
  | 'event_appear'
  | 'event_critical'
  | 'event_positive'
  | 'event_resolved'
  | 'choice_hover'
  | 'choice_confirm'
  | 'notification_info'
  | 'notification_success'
  | 'notification_warning'
  | 'notification_error'
  | 'notification_slack'
  | 'notification_email'
  | 'achievement_unlock'
  | 'milestone_reach'
  | 'skill_level_up'
  | 'feature_unlock'
  | 'game_over'
  | 'game_victory'
  | 'typing_start'
  | 'coffee_break'
  | 'game_start';

export default {
  MusicCategory,
};
