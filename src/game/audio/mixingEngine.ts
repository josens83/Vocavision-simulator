/**
 * Chapter 5: Audio & Atmosphere - Mixing Engine
 * 오디오 믹싱 엔진
 */

import {
  MixingSystem,
  AudioBus,
  MasterChain,
  DynamicMixingRules,
  AudioEffect,
  BusNode,
} from './types';

// ============================================
// 믹싱 시스템 설정
// ============================================

export const mixingConfig: MixingSystem = {
  busses: [
    {
      id: 'music',
      name: 'Music',
      volume: 0.7,
      pan: 0,
      mute: false,
      solo: false,
      effects: [
        { type: 'lowpass', frequency: 18000, Q: 0.7 },
        { type: 'highpass', frequency: 40, Q: 0.7 }
      ],
      sends: [
        { target: 'reverb', amount: 0.2 }
      ]
    },
    {
      id: 'sfx',
      name: 'Sound Effects',
      volume: 0.8,
      pan: 0,
      mute: false,
      solo: false,
      effects: [
        { type: 'compressor', threshold: -12, ratio: 3, attack: 0.01, release: 0.1 }
      ],
      sends: []
    },
    {
      id: 'ambience',
      name: 'Ambience',
      volume: 0.5,
      pan: 0,
      mute: false,
      solo: false,
      effects: [
        { type: 'lowpass', frequency: 12000, Q: 0.5 }
      ],
      sends: [
        { target: 'reverb', amount: 0.3 }
      ]
    },
    {
      id: 'ui',
      name: 'UI Sounds',
      volume: 0.6,
      pan: 0,
      mute: false,
      solo: false,
      effects: [],
      sends: []
    },
    {
      id: 'voice',
      name: 'Voice/Dialogue',
      volume: 1.0,
      pan: 0,
      mute: false,
      solo: false,
      effects: [
        { type: 'compressor', threshold: -18, ratio: 2.5, attack: 0.005, release: 0.15 },
        { type: 'highpass', frequency: 80, Q: 0.7 }
      ],
      sends: []
    },
    {
      id: 'reverb',
      name: 'Reverb Bus',
      volume: 1.0,
      pan: 0,
      mute: false,
      solo: false,
      effects: [],
      sends: []
    }
  ],

  masterChain: {
    compressor: {
      threshold: -6,
      ratio: 2,
      attack: 0.01,
      release: 0.25,
      knee: 6,
      makeupGain: 2
    },
    limiter: {
      threshold: -1,
      release: 0.1,
      lookahead: 0.005
    },
    eq: {
      bands: [
        { frequency: 60, gain: 1, Q: 0.7, type: 'lowshelf' },
        { frequency: 250, gain: -1, Q: 1, type: 'peaking' },
        { frequency: 3000, gain: 2, Q: 1, type: 'peaking' },
        { frequency: 10000, gain: 1.5, Q: 0.7, type: 'highshelf' }
      ]
    }
  },

  dynamicMixing: {
    rules: [
      {
        trigger: 'event_active',
        actions: [
          { bus: 'ambience', param: 'volume', value: 0.2, transition: 0.5 },
          { bus: 'music', param: 'volume', value: 0.4, transition: 1 }
        ]
      },
      {
        trigger: 'critical_notification',
        actions: [
          { bus: 'music', param: 'volume', value: 0.3, transition: 0.2 },
          { bus: 'ambience', param: 'volume', value: 0.1, transition: 0.2 },
          { bus: 'sfx', param: 'volume', value: 0.5, transition: 0.2 }
        ]
      },
      {
        trigger: 'game_paused',
        actions: [
          { bus: 'music', effect: 'lowpass', param: 'frequency', value: 800, transition: 0.5 },
          { bus: 'ambience', param: 'volume', value: 0.1, transition: 0.5 }
        ]
      },
      {
        trigger: 'event_resolved',
        actions: [
          { bus: 'ambience', param: 'volume', value: 0.5, transition: 1 },
          { bus: 'music', param: 'volume', value: 0.7, transition: 1.5 }
        ]
      }
    ]
  }
};

// ============================================
// 믹싱 엔진 클래스
// ============================================

export class MixingEngine {
  private audioContext: AudioContext | null = null;
  private busNodes: Map<string, BusNode> = new Map();
  private masterCompressor: DynamicsCompressorNode | null = null;
  private masterLimiter: DynamicsCompressorNode | null = null;
  private masterGain: GainNode | null = null;
  private masterEQ: BiquadFilterNode[] = [];
  private initialized: boolean = false;
  private originalBusVolumes: Map<string, number> = new Map();

  constructor() {
    // AudioContext는 사용자 인터랙션 후 초기화
  }

  // 초기화
  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.audioContext = new AudioContext();
    await this.setupMasterChain();
    await this.setupBusses();

    this.initialized = true;
  }

  // 마스터 체인 설정
  private async setupMasterChain(): Promise<void> {
    if (!this.audioContext) return;

    // 마스터 게인
    this.masterGain = this.audioContext.createGain();

    // EQ 체인
    let lastEQNode: AudioNode = this.masterGain;
    for (const band of mixingConfig.masterChain.eq.bands) {
      const eq = this.audioContext.createBiquadFilter();
      eq.type = band.type === 'lowshelf' ? 'lowshelf' :
                band.type === 'highshelf' ? 'highshelf' : 'peaking';
      eq.frequency.value = band.frequency;
      eq.gain.value = band.gain;
      eq.Q.value = band.Q;

      lastEQNode.connect(eq);
      lastEQNode = eq;
      this.masterEQ.push(eq);
    }

    // 컴프레서
    this.masterCompressor = this.audioContext.createDynamicsCompressor();
    const comp = mixingConfig.masterChain.compressor;
    this.masterCompressor.threshold.value = comp.threshold;
    this.masterCompressor.ratio.value = comp.ratio;
    this.masterCompressor.attack.value = comp.attack;
    this.masterCompressor.release.value = comp.release;
    this.masterCompressor.knee.value = comp.knee;

    // 리미터 (컴프레서로 구현)
    this.masterLimiter = this.audioContext.createDynamicsCompressor();
    const lim = mixingConfig.masterChain.limiter;
    this.masterLimiter.threshold.value = lim.threshold;
    this.masterLimiter.ratio.value = 20;
    this.masterLimiter.attack.value = 0.001;
    this.masterLimiter.release.value = lim.release;

    // 연결
    lastEQNode.connect(this.masterCompressor);
    this.masterCompressor.connect(this.masterLimiter);
    this.masterLimiter.connect(this.audioContext.destination);
  }

  // 버스 설정
  private async setupBusses(): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    for (const busConfig of mixingConfig.busses) {
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = busConfig.volume;

      const panNode = this.audioContext.createStereoPanner();
      panNode.pan.value = busConfig.pan;

      // 이펙트 체인
      let lastNode: AudioNode = gainNode;
      const effects: AudioNode[] = [];

      for (const effectConfig of busConfig.effects) {
        const effectNode = this.createEffect(effectConfig);
        if (effectNode) {
          lastNode.connect(effectNode);
          lastNode = effectNode;
          effects.push(effectNode);
        }
      }

      lastNode.connect(panNode);
      panNode.connect(this.masterGain);

      // 원래 볼륨 저장
      this.originalBusVolumes.set(busConfig.id, busConfig.volume);

      this.busNodes.set(busConfig.id, {
        input: gainNode,
        gain: gainNode,
        pan: panNode,
        effects,
        output: panNode
      });
    }

    // 센드 연결
    for (const busConfig of mixingConfig.busses) {
      if (busConfig.sends.length === 0) continue;

      const sourceBus = this.busNodes.get(busConfig.id);
      if (!sourceBus) continue;

      for (const send of busConfig.sends) {
        const targetBus = this.busNodes.get(send.target);
        if (!targetBus) continue;

        const sendGain = this.audioContext.createGain();
        sendGain.gain.value = send.amount;

        sourceBus.output.connect(sendGain);
        sendGain.connect(targetBus.input);
      }
    }
  }

  // 이펙트 노드 생성
  private createEffect(config: AudioEffect): AudioNode | null {
    if (!this.audioContext) return null;

    switch (config.type) {
      case 'lowpass':
      case 'highpass':
        const filter = this.audioContext.createBiquadFilter();
        filter.type = config.type;
        filter.frequency.value = config.frequency || 1000;
        filter.Q.value = config.Q || 1;
        return filter;

      case 'compressor':
        const comp = this.audioContext.createDynamicsCompressor();
        comp.threshold.value = config.threshold || -24;
        comp.ratio.value = config.ratio || 4;
        comp.attack.value = config.attack || 0.003;
        comp.release.value = config.release || 0.25;
        return comp;

      default:
        return null;
    }
  }

  // 버스 가져오기
  getBus(busId: string): GainNode | null {
    return this.busNodes.get(busId)?.input || null;
  }

  // 버스 볼륨 조절
  setBusVolume(busId: string, volume: number, transition: number = 0): void {
    const bus = this.busNodes.get(busId);
    if (!bus || !this.audioContext) return;

    if (transition > 0) {
      bus.gain.gain.linearRampToValueAtTime(
        volume,
        this.audioContext.currentTime + transition
      );
    } else {
      bus.gain.gain.value = volume;
    }
  }

  // 버스 음소거
  muteBus(busId: string, muted: boolean): void {
    const bus = this.busNodes.get(busId);
    if (!bus || !this.audioContext) return;

    if (muted) {
      bus.gain.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + 0.1
      );
    } else {
      const originalVolume = this.originalBusVolumes.get(busId) || 1;
      bus.gain.gain.linearRampToValueAtTime(
        originalVolume,
        this.audioContext.currentTime + 0.1
      );
    }
  }

  // 동적 믹싱 규칙 적용
  applyRule(trigger: string): void {
    const rule = mixingConfig.dynamicMixing.rules.find(r => r.trigger === trigger);
    if (!rule) return;

    for (const action of rule.actions) {
      if (action.param === 'volume') {
        this.setBusVolume(action.bus, action.value, action.transition);
      } else if (action.effect && action.param) {
        // 이펙트 파라미터 조절
        this.setEffectParam(action.bus, action.effect, action.param, action.value, action.transition);
      }
    }
  }

  // 이펙트 파라미터 조절
  private setEffectParam(
    busId: string,
    effectType: string,
    param: string,
    value: number,
    transition: number
  ): void {
    const bus = this.busNodes.get(busId);
    if (!bus || !this.audioContext) return;

    for (const effect of bus.effects) {
      if (effect instanceof BiquadFilterNode && effectType === 'lowpass') {
        if (param === 'frequency') {
          if (transition > 0) {
            effect.frequency.linearRampToValueAtTime(
              value,
              this.audioContext.currentTime + transition
            );
          } else {
            effect.frequency.value = value;
          }
        }
      }
    }
  }

  // 마스터 볼륨 설정
  setMasterVolume(volume: number): void {
    if (!this.masterGain || !this.audioContext) return;

    this.masterGain.gain.linearRampToValueAtTime(
      volume,
      this.audioContext.currentTime + 0.1
    );
  }

  // 모든 버스 볼륨 복원
  resetAllBusses(): void {
    this.originalBusVolumes.forEach((volume, busId) => {
      this.setBusVolume(busId, volume, 0.5);
    });
  }

  // AudioContext 상태 조회
  getState(): AudioContextState | null {
    return this.audioContext?.state || null;
  }

  // AudioContext 재개
  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // AudioContext 일시정지
  async suspend(): Promise<void> {
    if (this.audioContext?.state === 'running') {
      await this.audioContext.suspend();
    }
  }

  // 정리
  dispose(): void {
    // 모든 버스 연결 해제
    this.busNodes.forEach(bus => {
      bus.input.disconnect();
      bus.pan.disconnect();
      bus.effects.forEach(effect => effect.disconnect());
    });
    this.busNodes.clear();

    // 마스터 체인 정리
    this.masterEQ.forEach(eq => eq.disconnect());
    this.masterEQ = [];

    if (this.masterCompressor) {
      this.masterCompressor.disconnect();
      this.masterCompressor = null;
    }

    if (this.masterLimiter) {
      this.masterLimiter.disconnect();
      this.masterLimiter = null;
    }

    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }

    // AudioContext 정리
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.initialized = false;
  }

  // 버스 목록 조회
  getBusIds(): string[] {
    return Array.from(this.busNodes.keys());
  }

  // 초기화 상태 확인
  isInitialized(): boolean {
    return this.initialized;
  }
}

// 싱글톤 인스턴스
export const mixingEngine = new MixingEngine();

export default MixingEngine;
