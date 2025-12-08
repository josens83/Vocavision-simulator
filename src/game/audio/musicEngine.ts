/**
 * Chapter 5: Audio & Atmosphere - Adaptive Music Engine
 * 적응형 음악 엔진
 */

import {
  MusicTrack,
  MusicCategory,
  Stem,
  DuckingConfig,
  AdaptiveMusicSystem,
  MusicLayer,
  TransitionConfig,
  ContextRule,
  Mood,
  TimeOfDay,
  GamePhase,
} from './types';

// ============================================
// 음악 트랙 데이터
// ============================================

export const musicTracks: MusicTrack[] = [
  // === 메인 테마 ===
  {
    id: 'main_theme',
    name: 'VocaVision Theme',
    category: MusicCategory.MAIN,
    files: {
      stems: [
        { id: 'piano', instrument: 'Piano', file: 'main_theme_piano.ogg', layer: 0 },
        { id: 'guitar', instrument: 'Acoustic Guitar', file: 'main_theme_guitar.ogg', layer: 1, conditions: { minIntensity: 0.3 } },
        { id: 'bass', instrument: 'Bass', file: 'main_theme_bass.ogg', layer: 2, conditions: { minIntensity: 0.5 } },
        { id: 'drums', instrument: 'Lo-fi Drums', file: 'main_theme_drums.ogg', layer: 3, conditions: { minIntensity: 0.7 } },
        { id: 'synth', instrument: 'Synth Pad', file: 'main_theme_synth.ogg', layer: 4, conditions: { minIntensity: 0.9 } }
      ]
    },
    properties: {
      bpm: 85,
      key: 'C major',
      timeSignature: '4/4',
      duration: 180,
      loopPoints: { start: 8, end: 172 }
    },
    conditions: {
      timeOfDay: ['morning', 'afternoon'],
      gamePhase: ['early', 'mid'],
      mood: ['neutral', 'positive']
    },
    mixing: {
      baseVolume: 0.6,
      ducking: { trigger: 'event', amount: -12, attackTime: 0.5, releaseTime: 1 }
    }
  },

  // === 일상 업무 BGM ===
  {
    id: 'daily_work_01',
    name: 'Coding Session',
    category: MusicCategory.WORK,
    files: {
      stems: [
        { id: 'lofi_beat', instrument: 'Lo-fi Beat', file: 'work_lofi_beat.ogg', layer: 0 },
        { id: 'keys', instrument: 'Electric Piano', file: 'work_keys.ogg', layer: 0 },
        { id: 'vinyl', instrument: 'Vinyl Crackle', file: 'work_vinyl.ogg', layer: 0 },
        { id: 'melody', instrument: 'Synth Lead', file: 'work_melody.ogg', layer: 1, conditions: { minIntensity: 0.4 } }
      ]
    },
    properties: {
      bpm: 75,
      key: 'G major',
      timeSignature: '4/4',
      duration: 240,
      loopPoints: { start: 0, end: 240 }
    },
    conditions: {
      timeOfDay: ['morning', 'afternoon', 'evening'],
      mood: ['neutral', 'focused']
    },
    mixing: {
      baseVolume: 0.5,
      ducking: { trigger: 'notification', amount: -6, attackTime: 0.2, releaseTime: 0.5 }
    }
  },

  // === 긴장 상황 BGM ===
  {
    id: 'tension_01',
    name: 'Server Crisis',
    category: MusicCategory.TENSION,
    files: {
      stems: [
        { id: 'pulse', instrument: 'Heartbeat Pulse', file: 'tension_pulse.ogg', layer: 0 },
        { id: 'drone', instrument: 'Dark Drone', file: 'tension_drone.ogg', layer: 0 },
        { id: 'glitch', instrument: 'Glitch FX', file: 'tension_glitch.ogg', layer: 1, conditions: { minIntensity: 0.5 } },
        { id: 'strings', instrument: 'Tense Strings', file: 'tension_strings.ogg', layer: 2, conditions: { minIntensity: 0.7 } },
        { id: 'alarm', instrument: 'Alarm Tone', file: 'tension_alarm.ogg', layer: 3, conditions: { minIntensity: 0.9 } }
      ]
    },
    properties: {
      bpm: 120,
      key: 'D minor',
      timeSignature: '4/4',
      duration: 120,
      loopPoints: { start: 0, end: 120 }
    },
    conditions: {
      mood: ['tense', 'critical']
    },
    mixing: {
      baseVolume: 0.7,
      ducking: { trigger: 'choice', amount: -18, attackTime: 0.3, releaseTime: 0.8 }
    }
  },

  // === 밤 시간 BGM ===
  {
    id: 'night_ambient',
    name: 'Late Night Coding',
    category: MusicCategory.AMBIENT,
    files: {
      stems: [
        { id: 'ambient', instrument: 'Night Ambience', file: 'night_ambient.ogg', layer: 0 },
        { id: 'piano', instrument: 'Soft Piano', file: 'night_piano.ogg', layer: 0 },
        { id: 'rain', instrument: 'Rain (Optional)', file: 'night_rain.ogg', layer: 1, conditions: { trigger: 'weather_rain' } }
      ]
    },
    properties: {
      bpm: 60,
      key: 'A minor',
      timeSignature: '4/4',
      duration: 300,
      loopPoints: { start: 0, end: 300 }
    },
    conditions: {
      timeOfDay: ['night', 'lateNight'],
      mood: ['calm', 'melancholy', 'focused']
    },
    mixing: {
      baseVolume: 0.4,
      ducking: { trigger: 'any', amount: -3, attackTime: 0.5, releaseTime: 1 }
    }
  },

  // === 성공/달성 스팅어 ===
  {
    id: 'victory_01',
    name: 'Milestone Reached',
    category: MusicCategory.VICTORY,
    files: {
      stems: [
        { id: 'fanfare', instrument: 'Triumphant Fanfare', file: 'victory_fanfare.ogg', layer: 0 },
        { id: 'chimes', instrument: 'Celebration Chimes', file: 'victory_chimes.ogg', layer: 0 }
      ]
    },
    properties: {
      bpm: 140,
      key: 'C major',
      timeSignature: '4/4',
      duration: 8,
      loopPoints: { start: 0, end: 0 }
    },
    conditions: {},
    mixing: {
      baseVolume: 0.8,
      ducking: { trigger: 'none', amount: 0, attackTime: 0, releaseTime: 0 }
    }
  },

  // === 실패/게임오버 ===
  {
    id: 'defeat_01',
    name: 'Game Over',
    category: MusicCategory.DEFEAT,
    files: {
      stems: [
        { id: 'sad_piano', instrument: 'Melancholy Piano', file: 'defeat_piano.ogg', layer: 0 },
        { id: 'strings', instrument: 'Sad Strings', file: 'defeat_strings.ogg', layer: 0 }
      ]
    },
    properties: {
      bpm: 50,
      key: 'A minor',
      timeSignature: '4/4',
      duration: 15,
      loopPoints: { start: 0, end: 0 }
    },
    conditions: {},
    mixing: {
      baseVolume: 0.6,
      ducking: { trigger: 'none', amount: 0, attackTime: 0, releaseTime: 0 }
    }
  },

  // === 메뉴 BGM ===
  {
    id: 'menu_theme',
    name: 'Menu Theme',
    category: MusicCategory.MENU,
    files: {
      stems: [
        { id: 'ambient', instrument: 'Ambient Pad', file: 'menu_ambient.ogg', layer: 0 },
        { id: 'melody', instrument: 'Simple Melody', file: 'menu_melody.ogg', layer: 0 }
      ]
    },
    properties: {
      bpm: 70,
      key: 'E major',
      timeSignature: '4/4',
      duration: 120,
      loopPoints: { start: 0, end: 120 }
    },
    conditions: {},
    mixing: {
      baseVolume: 0.5,
      ducking: { trigger: 'ui', amount: -3, attackTime: 0.1, releaseTime: 0.3 }
    }
  }
];

// ============================================
// 레이어 및 전환 설정
// ============================================

export const musicLayers: MusicLayer[] = [
  { id: 0, name: 'Base', alwaysOn: true },
  { id: 1, name: 'Light', intensityThreshold: 0.3 },
  { id: 2, name: 'Medium', intensityThreshold: 0.5 },
  { id: 3, name: 'Heavy', intensityThreshold: 0.7 },
  { id: 4, name: 'Climax', intensityThreshold: 0.9 }
];

export const transitionConfig: TransitionConfig = {
  crossfadeDuration: 2000,
  layerFadeDuration: 1000,
  specialTransitions: {
    toTension: { type: 'quick', duration: 500, effect: 'filter_sweep' },
    fromTension: { type: 'gradual', duration: 3000, effect: 'reverb_tail' },
    toVictory: { type: 'cut', duration: 0, effect: 'stinger' },
    toDefeat: { type: 'slow', duration: 4000, effect: 'lowpass_fade' }
  }
};

export const contextRules: ContextRule[] = [
  {
    condition: { type: 'serverHealth', operator: '<', value: 30 },
    action: { type: 'switchTrack', target: 'tension_01', transition: 'toTension' }
  },
  {
    condition: { type: 'burnoutRisk', operator: '>', value: 80 },
    action: { type: 'addLayer', layer: 'stress_layer', fadeIn: 2000 }
  },
  {
    condition: { type: 'event', value: 'critical' },
    action: { type: 'switchTrack', target: 'tension_01', transition: 'quick' }
  },
  {
    condition: { type: 'milestone' },
    action: { type: 'playStinger', target: 'victory_01', overlay: true }
  },
  {
    condition: { type: 'timeOfDay', value: 'night' },
    action: { type: 'switchTrack', target: 'night_ambient', transition: 'gradual' }
  }
];

// ============================================
// 음악 엔진 클래스
// ============================================

export class MusicEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrack: MusicTrack | null = null;
  private previousTrack: MusicTrack | null = null;
  private stems: Map<string, AudioBufferSourceNode> = new Map();
  private stemGains: Map<string, GainNode> = new Map();
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private intensity: number = 0.5;
  private isPlaying: boolean = false;
  private startTime: number = 0;
  private outputNode: GainNode | null = null;

  constructor() {
    // AudioContext는 사용자 인터랙션 후 초기화
  }

  // 초기화
  async initialize(outputNode?: GainNode): Promise<void> {
    if (this.audioContext) return;

    this.audioContext = new AudioContext();
    this.masterGain = this.audioContext.createGain();

    if (outputNode) {
      this.outputNode = outputNode;
      this.masterGain.connect(outputNode);
    } else {
      this.masterGain.connect(this.audioContext.destination);
    }
  }

  // 출력 노드 연결
  connectOutput(outputNode: GainNode): void {
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain.connect(outputNode);
      this.outputNode = outputNode;
    }
  }

  // 트랙 로드
  async loadTrack(track: MusicTrack): Promise<void> {
    if (!this.audioContext) {
      await this.initialize();
    }

    const loadPromises = track.files.stems.map(async (stem) => {
      const cacheKey = `music/${stem.file}`;

      if (this.bufferCache.has(cacheKey)) {
        return { stem, audioBuffer: this.bufferCache.get(cacheKey)! };
      }

      try {
        const response = await fetch(`/audio/music/${stem.file}`);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
        this.bufferCache.set(cacheKey, audioBuffer);
        return { stem, audioBuffer };
      } catch (error) {
        console.warn(`Failed to load stem: ${stem.file}`, error);
        return null;
      }
    });

    const loadedStems = (await Promise.all(loadPromises)).filter(Boolean) as { stem: Stem; audioBuffer: AudioBuffer }[];

    // 기존 스템 정리
    this.cleanupStems();

    // 스템별 노드 생성
    loadedStems.forEach(({ stem, audioBuffer }) => {
      const source = this.audioContext!.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = track.properties.loopPoints.end > 0;

      if (source.loop) {
        source.loopStart = track.properties.loopPoints.start;
        source.loopEnd = track.properties.loopPoints.end;
      }

      const gain = this.audioContext!.createGain();
      gain.gain.value = this.shouldPlayStem(stem) ? 1 : 0;

      source.connect(gain);
      gain.connect(this.masterGain!);

      this.stems.set(stem.id, source);
      this.stemGains.set(stem.id, gain);
    });

    this.currentTrack = track;
    this.masterGain!.gain.value = track.mixing.baseVolume;
  }

  // 스템 정리
  private cleanupStems(): void {
    this.stems.forEach((source) => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // 이미 정지됨
      }
    });
    this.stemGains.forEach((gain) => gain.disconnect());
    this.stems.clear();
    this.stemGains.clear();
  }

  // 스템 재생 여부 확인
  private shouldPlayStem(stem: Stem): boolean {
    if (stem.layer === 0) return true;
    if (stem.conditions?.minIntensity && this.intensity < stem.conditions.minIntensity) {
      return false;
    }
    return true;
  }

  // 재생 시작
  play(): void {
    if (!this.audioContext || this.stems.size === 0) return;

    this.startTime = this.audioContext.currentTime;
    this.stems.forEach((source) => {
      try {
        source.start(this.startTime);
      } catch (e) {
        // 이미 시작됨
      }
    });
    this.isPlaying = true;
  }

  // 정지
  stop(): void {
    this.cleanupStems();
    this.isPlaying = false;
    this.currentTrack = null;
  }

  // 일시정지 (볼륨 페이드)
  pause(fadeTime: number = 0.5): void {
    if (!this.masterGain || !this.audioContext) return;

    this.masterGain.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + fadeTime
    );
    this.isPlaying = false;
  }

  // 재개
  resume(fadeTime: number = 0.5): void {
    if (!this.masterGain || !this.audioContext || !this.currentTrack) return;

    this.masterGain.gain.linearRampToValueAtTime(
      this.currentTrack.mixing.baseVolume,
      this.audioContext.currentTime + fadeTime
    );
    this.isPlaying = true;
  }

  // 인텐시티 조절
  setIntensity(value: number): void {
    this.intensity = Math.max(0, Math.min(1, value));

    if (!this.currentTrack || !this.audioContext) return;

    this.currentTrack.files.stems.forEach((stem) => {
      const gain = this.stemGains.get(stem.id);
      if (!gain) return;

      const shouldPlay = this.shouldPlayStem(stem);
      const targetVolume = shouldPlay ? 1 : 0;

      gain.gain.linearRampToValueAtTime(
        targetVolume,
        this.audioContext!.currentTime + 1
      );
    });
  }

  // 트랙 전환 (크로스페이드)
  async crossfadeTo(trackId: string, duration: number = 2000): Promise<void> {
    const newTrack = musicTracks.find(t => t.id === trackId);
    if (!newTrack || !this.audioContext || !this.masterGain) return;

    this.previousTrack = this.currentTrack;
    const fadeOutTime = duration / 1000;

    // 현재 트랙 페이드 아웃
    this.masterGain.gain.linearRampToValueAtTime(
      0,
      this.audioContext.currentTime + fadeOutTime
    );

    // 대기 후 새 트랙 로드
    await this.delay(duration / 2);

    // 현재 트랙 정리
    this.cleanupStems();

    // 새 트랙 로드 및 재생
    await this.loadTrack(newTrack);
    this.play();

    // 페이드 인
    this.masterGain.gain.value = 0;
    this.masterGain.gain.linearRampToValueAtTime(
      newTrack.mixing.baseVolume,
      this.audioContext.currentTime + fadeOutTime
    );
  }

  // 스팅어 재생 (오버레이)
  async playStinger(trackId: string): Promise<void> {
    const stinger = musicTracks.find(t => t.id === trackId);
    if (!stinger || !this.audioContext) return;

    // 현재 음악 덕킹
    if (this.currentTrack && this.masterGain) {
      const currentVolume = this.masterGain.gain.value;
      this.masterGain.gain.linearRampToValueAtTime(
        currentVolume * 0.3,
        this.audioContext.currentTime + 0.3
      );

      // 스팅어 종료 후 복원
      setTimeout(() => {
        if (this.masterGain && this.audioContext) {
          this.masterGain.gain.linearRampToValueAtTime(
            currentVolume,
            this.audioContext.currentTime + 0.5
          );
        }
      }, stinger.properties.duration * 1000);
    }

    // 스팅어 재생
    for (const stem of stinger.files.stems) {
      const cacheKey = `music/${stem.file}`;
      let audioBuffer = this.bufferCache.get(cacheKey);

      if (!audioBuffer) {
        try {
          const response = await fetch(`/audio/music/${stem.file}`);
          const arrayBuffer = await response.arrayBuffer();
          audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          this.bufferCache.set(cacheKey, audioBuffer);
        } catch (error) {
          console.warn(`Failed to load stinger: ${stem.file}`);
          continue;
        }
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      const gain = this.audioContext.createGain();
      gain.gain.value = stinger.mixing.baseVolume;

      source.connect(gain);
      gain.connect(this.outputNode || this.audioContext.destination);

      source.start();
    }
  }

  // 덕킹 적용
  applyDucking(config: DuckingConfig): void {
    if (!this.masterGain || !this.audioContext) return;

    const targetVolume = this.decibelToLinear(
      this.linearToDecibel(this.masterGain.gain.value) + config.amount
    );

    this.masterGain.gain.linearRampToValueAtTime(
      targetVolume,
      this.audioContext.currentTime + config.attackTime
    );
  }

  // 덕킹 해제
  releaseDucking(config: DuckingConfig): void {
    if (!this.currentTrack || !this.masterGain || !this.audioContext) return;

    this.masterGain.gain.linearRampToValueAtTime(
      this.currentTrack.mixing.baseVolume,
      this.audioContext.currentTime + config.releaseTime
    );
  }

  // 볼륨 페이드
  fadeToVolume(targetVolume: number, fadeTime: number): void {
    if (!this.masterGain || !this.audioContext) return;

    this.masterGain.gain.linearRampToValueAtTime(
      targetVolume,
      this.audioContext.currentTime + fadeTime
    );
  }

  // 마스터 볼륨 설정
  setVolume(volume: number): void {
    if (!this.masterGain || !this.audioContext) return;

    this.masterGain.gain.linearRampToValueAtTime(
      volume,
      this.audioContext.currentTime + 0.1
    );
  }

  // 상태에 따른 트랙 선택
  selectTrackForState(mood: Mood, timeOfDay: TimeOfDay, gamePhase: GamePhase): MusicTrack | null {
    const eligibleTracks = musicTracks.filter(track => {
      const { conditions } = track;

      // 무드 체크
      if (conditions.mood && conditions.mood.length > 0) {
        if (!conditions.mood.includes(mood)) return false;
      }

      // 시간대 체크
      if (conditions.timeOfDay && conditions.timeOfDay.length > 0) {
        if (!conditions.timeOfDay.includes(timeOfDay)) return false;
      }

      // 게임 페이즈 체크
      if (conditions.gamePhase && conditions.gamePhase.length > 0) {
        if (!conditions.gamePhase.includes(gamePhase)) return false;
      }

      return true;
    });

    if (eligibleTracks.length === 0) {
      // 기본 트랙 반환
      return musicTracks.find(t => t.id === 'daily_work_01') || null;
    }

    // 랜덤 선택
    return eligibleTracks[Math.floor(Math.random() * eligibleTracks.length)];
  }

  // 컨텍스트 규칙 확인
  checkContextRules(gameState: any): void {
    for (const rule of contextRules) {
      if (this.evaluateCondition(rule.condition, gameState)) {
        this.executeAction(rule.action);
        break; // 첫 번째 일치하는 규칙만 실행
      }
    }
  }

  private evaluateCondition(condition: any, gameState: any): boolean {
    const value = this.getStateValue(condition.type, gameState);

    if (condition.operator) {
      switch (condition.operator) {
        case '<': return value < condition.value;
        case '>': return value > condition.value;
        case '<=': return value <= condition.value;
        case '>=': return value >= condition.value;
        case '==': return value === condition.value;
        default: return false;
      }
    }

    return value === condition.value;
  }

  private getStateValue(type: string, gameState: any): any {
    switch (type) {
      case 'serverHealth': return gameState?.business?.infrastructure?.serverHealth;
      case 'burnoutRisk': return gameState?.player?.health?.burnoutRisk;
      case 'event': return gameState?.currentEvent?.severity;
      case 'milestone': return gameState?.milestoneReached;
      case 'timeOfDay': return gameState?.world?.timeOfDay;
      default: return null;
    }
  }

  private executeAction(action: any): void {
    switch (action.type) {
      case 'switchTrack':
        const transition = transitionConfig.specialTransitions[action.transition];
        this.crossfadeTo(action.target, transition?.duration || 2000);
        break;
      case 'playStinger':
        this.playStinger(action.target);
        break;
      case 'addLayer':
        // 레이어 추가 로직
        break;
    }
  }

  // 유틸리티
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private decibelToLinear(db: number): number {
    return Math.pow(10, db / 20);
  }

  private linearToDecibel(linear: number): number {
    return 20 * Math.log10(Math.max(linear, 0.0001));
  }

  // 상태 조회
  getCurrentTrack(): MusicTrack | null {
    return this.currentTrack;
  }

  getPreviousTrack(): MusicTrack | null {
    return this.previousTrack;
  }

  getIntensity(): number {
    return this.intensity;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // 정리
  dispose(): void {
    this.stop();
    this.bufferCache.clear();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// 싱글톤 인스턴스
export const musicEngine = new MusicEngine();

export default MusicEngine;
