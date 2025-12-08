/**
 * Chapter 5: Audio & Atmosphere - Sound Effects Engine
 * 효과음 엔진
 */

import {
  SFXSound,
  SFXCategory,
  SFXLibrary,
  PlayOptions,
  SoundInstance,
  VariationConfig,
  PlaybackRules,
} from './types';

// ============================================
// 효과음 라이브러리 데이터
// ============================================

export const sfxLibrary: SFXLibrary = {
  categories: [
    // === UI 효과음 ===
    {
      name: 'ui',
      sounds: [
        {
          id: 'ui_click',
          name: 'Button Click',
          files: ['ui_click_01.ogg', 'ui_click_02.ogg', 'ui_click_03.ogg'],
          category: 'ui',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0.05, maxInstances: 3 }
        },
        {
          id: 'ui_hover',
          name: 'Button Hover',
          files: ['ui_hover_01.ogg'],
          category: 'ui',
          properties: { volume: 0.3, pitch: 1.1, pitchVariation: 0, maxInstances: 2 }
        },
        {
          id: 'ui_toggle_on',
          name: 'Toggle On',
          files: ['ui_toggle_on.ogg'],
          category: 'ui',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'ui_toggle_off',
          name: 'Toggle Off',
          files: ['ui_toggle_off.ogg'],
          category: 'ui',
          properties: { volume: 0.5, pitch: 0.9, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'ui_tab_switch',
          name: 'Tab Switch',
          files: ['ui_tab.ogg'],
          category: 'ui',
          properties: { volume: 0.4, pitch: 1, pitchVariation: 0.02, maxInstances: 2 }
        },
        {
          id: 'ui_modal_open',
          name: 'Modal Open',
          files: ['ui_modal_open.ogg'],
          category: 'ui',
          properties: { volume: 0.6, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'ui_modal_close',
          name: 'Modal Close',
          files: ['ui_modal_close.ogg'],
          category: 'ui',
          properties: { volume: 0.5, pitch: 0.95, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'ui_error',
          name: 'Error/Invalid',
          files: ['ui_error.ogg'],
          category: 'ui',
          properties: { volume: 0.6, pitch: 1, pitchVariation: 0, maxInstances: 1, cooldown: 500 }
        }
      ]
    },

    // === 게임플레이 효과음 ===
    {
      name: 'gameplay',
      sounds: [
        {
          id: 'action_develop',
          name: 'Develop/Code',
          files: ['action_typing_01.ogg', 'action_typing_02.ogg', 'action_typing_03.ogg'],
          category: 'gameplay',
          properties: { volume: 0.4, pitch: 1, pitchVariation: 0.1, maxInstances: 1 }
        },
        {
          id: 'action_marketing',
          name: 'Marketing Action',
          files: ['action_marketing.ogg'],
          category: 'gameplay',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0.05, maxInstances: 1 }
        },
        {
          id: 'action_rest',
          name: 'Rest/Sleep',
          files: ['action_rest.ogg'],
          category: 'gameplay',
          properties: { volume: 0.4, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'action_server_maintain',
          name: 'Server Maintenance',
          files: ['action_server.ogg'],
          category: 'gameplay',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0.03, maxInstances: 1 }
        },
        {
          id: 'day_pass',
          name: 'Day Pass',
          files: ['time_day.ogg'],
          category: 'gameplay',
          properties: { volume: 0.3, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'month_pass',
          name: 'Month End',
          files: ['time_month.ogg'],
          category: 'gameplay',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'money_gain',
          name: 'Money Gain',
          files: ['money_gain_01.ogg', 'money_gain_02.ogg'],
          category: 'gameplay',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0.1, maxInstances: 3 }
        },
        {
          id: 'money_loss',
          name: 'Money Loss',
          files: ['money_loss.ogg'],
          category: 'gameplay',
          properties: { volume: 0.5, pitch: 0.9, pitchVariation: 0.05, maxInstances: 2 }
        },
        {
          id: 'user_gain',
          name: 'User Gain',
          files: ['user_gain.ogg'],
          category: 'gameplay',
          properties: { volume: 0.4, pitch: 1, pitchVariation: 0.1, maxInstances: 5 }
        },
        {
          id: 'user_loss',
          name: 'User Churn',
          files: ['user_loss.ogg'],
          category: 'gameplay',
          properties: { volume: 0.4, pitch: 0.8, pitchVariation: 0.05, maxInstances: 2 }
        },
        {
          id: 'energy_low',
          name: 'Low Energy Warning',
          files: ['energy_low.ogg'],
          category: 'gameplay',
          properties: { volume: 0.6, pitch: 1, pitchVariation: 0, maxInstances: 1, cooldown: 5000 }
        },
        {
          id: 'stress_high',
          name: 'High Stress Warning',
          files: ['stress_high.ogg'],
          category: 'gameplay',
          properties: { volume: 0.6, pitch: 1, pitchVariation: 0, maxInstances: 1, cooldown: 5000 }
        }
      ]
    },

    // === 알림 효과음 ===
    {
      name: 'notification',
      sounds: [
        {
          id: 'notif_info',
          name: 'Info Notification',
          files: ['notif_info.ogg'],
          category: 'notification',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0, maxInstances: 2 }
        },
        {
          id: 'notif_success',
          name: 'Success Notification',
          files: ['notif_success.ogg'],
          category: 'notification',
          properties: { volume: 0.6, pitch: 1, pitchVariation: 0, maxInstances: 2 }
        },
        {
          id: 'notif_warning',
          name: 'Warning Notification',
          files: ['notif_warning.ogg'],
          category: 'notification',
          properties: { volume: 0.7, pitch: 1, pitchVariation: 0, maxInstances: 2 }
        },
        {
          id: 'notif_error',
          name: 'Error Notification',
          files: ['notif_error.ogg'],
          category: 'notification',
          properties: { volume: 0.7, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'notif_critical',
          name: 'Critical Alert',
          files: ['notif_critical.ogg'],
          category: 'notification',
          properties: { volume: 0.8, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'notif_slack',
          name: 'Slack-like Notification',
          files: ['notif_slack.ogg'],
          category: 'notification',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0, maxInstances: 3 }
        },
        {
          id: 'notif_email',
          name: 'Email Notification',
          files: ['notif_email.ogg'],
          category: 'notification',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0, maxInstances: 2 }
        }
      ]
    },

    // === 이벤트 효과음 ===
    {
      name: 'event',
      sounds: [
        {
          id: 'event_appear',
          name: 'Event Appear',
          files: ['event_appear.ogg'],
          category: 'event',
          properties: { volume: 0.6, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'event_critical',
          name: 'Critical Event',
          files: ['event_critical.ogg'],
          category: 'event',
          properties: { volume: 0.8, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'event_positive',
          name: 'Positive Event',
          files: ['event_positive.ogg'],
          category: 'event',
          properties: { volume: 0.6, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'choice_select',
          name: 'Choice Select',
          files: ['choice_select.ogg'],
          category: 'event',
          properties: { volume: 0.5, pitch: 1, pitchVariation: 0.05, maxInstances: 1 }
        },
        {
          id: 'choice_confirm',
          name: 'Choice Confirm',
          files: ['choice_confirm.ogg'],
          category: 'event',
          properties: { volume: 0.6, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        }
      ]
    },

    // === 성취 효과음 ===
    {
      name: 'achievement',
      sounds: [
        {
          id: 'achievement_unlock',
          name: 'Achievement Unlock',
          files: ['achievement_unlock.ogg'],
          category: 'achievement',
          properties: { volume: 0.8, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'milestone_reach',
          name: 'Milestone Reached',
          files: ['milestone.ogg'],
          category: 'achievement',
          properties: { volume: 0.8, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'level_up',
          name: 'Skill Level Up',
          files: ['level_up.ogg'],
          category: 'achievement',
          properties: { volume: 0.7, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'feature_unlock',
          name: 'Feature Unlocked',
          files: ['feature_unlock.ogg'],
          category: 'achievement',
          properties: { volume: 0.7, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        }
      ]
    },

    // === 다이제틱 효과음 ===
    {
      name: 'diegetic',
      sounds: [
        {
          id: 'keyboard_typing',
          name: 'Keyboard Typing',
          files: [
            'keyboard_01.ogg', 'keyboard_02.ogg', 'keyboard_03.ogg',
            'keyboard_04.ogg', 'keyboard_05.ogg', 'keyboard_06.ogg'
          ],
          category: 'diegetic',
          properties: { volume: 0.2, pitch: 1, pitchVariation: 0.15, maxInstances: 5 }
        },
        {
          id: 'mouse_click',
          name: 'Mouse Click',
          files: ['mouse_click.ogg'],
          category: 'diegetic',
          properties: { volume: 0.15, pitch: 1, pitchVariation: 0.1, maxInstances: 3 }
        },
        {
          id: 'coffee_pour',
          name: 'Coffee Pour',
          files: ['coffee_pour.ogg'],
          category: 'diegetic',
          properties: { volume: 0.4, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'coffee_sip',
          name: 'Coffee Sip',
          files: ['coffee_sip.ogg'],
          category: 'diegetic',
          properties: { volume: 0.3, pitch: 1, pitchVariation: 0.1, maxInstances: 1 }
        },
        {
          id: 'server_fan',
          name: 'Server Room Fan',
          files: ['server_fan_loop.ogg'],
          category: 'diegetic',
          properties: { volume: 0.2, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'door_open',
          name: 'Office Door',
          files: ['door_open.ogg'],
          category: 'diegetic',
          properties: { volume: 0.4, pitch: 1, pitchVariation: 0.05, maxInstances: 1 }
        },
        {
          id: 'phone_vibrate',
          name: 'Phone Vibrate',
          files: ['phone_vibrate.ogg'],
          category: 'diegetic',
          properties: { volume: 0.4, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        }
      ]
    },

    // === 게임 결과 효과음 ===
    {
      name: 'result',
      sounds: [
        {
          id: 'game_over',
          name: 'Game Over',
          files: ['game_over.ogg'],
          category: 'result',
          properties: { volume: 0.7, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'victory_fanfare',
          name: 'Victory Fanfare',
          files: ['victory_fanfare.ogg'],
          category: 'result',
          properties: { volume: 0.8, pitch: 1, pitchVariation: 0, maxInstances: 1 }
        },
        {
          id: 'stats_reveal',
          name: 'Stats Reveal',
          files: ['stats_tick.ogg'],
          category: 'result',
          properties: { volume: 0.4, pitch: 1, pitchVariation: 0.2, maxInstances: 5 }
        }
      ]
    }
  ],

  variations: {
    pitchRange: { min: 0.9, max: 1.1 },
    volumeRange: { min: 0.9, max: 1.0 },
    selectionMode: 'random_no_repeat'
  },

  playbackRules: {
    maxTotalSounds: 16,
    priorityLevels: {
      critical: 5,
      notification: 4,
      event: 3,
      gameplay: 2,
      ui: 1,
      diegetic: 0
    },
    ducking: {
      enabled: true,
      triggerPriority: 4,
      amount: -6,
      attackTime: 0.05,
      releaseTime: 0.2
    }
  }
};

// ============================================
// 효과음 엔진 클래스
// ============================================

export class SFXEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private buffers: Map<string, AudioBuffer[]> = new Map();
  private activeSounds: Map<string, SoundInstance[]> = new Map();
  private lastPlayed: Map<string, number> = new Map();
  private variationIndex: Map<string, number> = new Map();
  private outputNode: GainNode | null = null;
  private totalActiveSounds: number = 0;

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

  // 사운드 로드
  async loadSound(sound: SFXSound): Promise<void> {
    if (!this.audioContext) {
      await this.initialize();
    }

    const loadPromises = sound.files.map(async (file) => {
      try {
        const response = await fetch(`/audio/sfx/${file}`);
        const arrayBuffer = await response.arrayBuffer();
        return await this.audioContext!.decodeAudioData(arrayBuffer);
      } catch (error) {
        console.warn(`Failed to load SFX: ${file}`, error);
        return null;
      }
    });

    const buffers = (await Promise.all(loadPromises)).filter(Boolean) as AudioBuffer[];

    if (buffers.length > 0) {
      this.buffers.set(sound.id, buffers);
      this.activeSounds.set(sound.id, []);
      this.variationIndex.set(sound.id, 0);
    }
  }

  // 전체 카테고리 로드
  async loadCategory(categoryName: string): Promise<void> {
    const category = sfxLibrary.categories.find(c => c.name === categoryName);
    if (!category) return;

    await Promise.all(category.sounds.map(sound => this.loadSound(sound)));
  }

  // 모든 효과음 로드
  async loadAll(): Promise<void> {
    for (const category of sfxLibrary.categories) {
      await this.loadCategory(category.name);
    }
  }

  // 사운드 재생
  play(id: string, options?: PlayOptions): string | null {
    const sound = this.getSoundById(id);
    if (!sound) {
      console.warn(`Sound not found: ${id}`);
      return null;
    }

    const buffers = this.buffers.get(id);
    if (!buffers || buffers.length === 0) {
      console.warn(`Sound not loaded: ${id}`);
      return null;
    }

    if (!this.audioContext || !this.masterGain) {
      console.warn('Audio context not initialized');
      return null;
    }

    // 쿨다운 체크
    if (sound.properties.cooldown) {
      const lastTime = this.lastPlayed.get(id) || 0;
      if (Date.now() - lastTime < sound.properties.cooldown) {
        return null;
      }
    }

    // 최대 동시 재생 체크
    const active = this.activeSounds.get(id) || [];
    if (active.length >= sound.properties.maxInstances) {
      const oldest = active.shift();
      oldest?.stop();
      this.totalActiveSounds--;
    }

    // 전체 최대 사운드 체크
    if (this.totalActiveSounds >= sfxLibrary.playbackRules.maxTotalSounds) {
      this.removeLowestPrioritySound();
    }

    // 변형 선택 (연속 재생 방지)
    const variationIdx = this.getNextVariation(id, buffers.length);
    const buffer = buffers[variationIdx];

    // 피치 변형 적용
    const pitchVariation = sound.properties.pitchVariation;
    const basePitch = options?.pitch || sound.properties.pitch;
    const pitch = basePitch + (Math.random() * pitchVariation * 2 - pitchVariation);

    // 오디오 노드 생성
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = pitch;

    const gain = this.audioContext.createGain();
    const volume = (options?.volume ?? 1) * sound.properties.volume;
    gain.gain.value = volume;

    // 스테레오 위치 (옵션)
    let lastNode: AudioNode = gain;
    if (sound.spatial || options?.pan !== undefined) {
      const panner = this.audioContext.createStereoPanner();
      panner.pan.value = options?.pan ?? this.getSpatialPan(sound.spatial);
      gain.connect(panner);
      lastNode = panner;
    }

    source.connect(gain);
    lastNode.connect(this.masterGain);

    // 딜레이 적용
    const delay = options?.delay || 0;
    const startTime = this.audioContext.currentTime + (delay / 1000);
    source.start(startTime);

    // 인스턴스 추적
    const instanceId = `${id}-${Date.now()}-${Math.random()}`;
    const priority = options?.priority ?? sfxLibrary.playbackRules.priorityLevels[sound.category] ?? 1;

    const instance: SoundInstance = {
      id: instanceId,
      source,
      gain,
      startTime,
      priority,
      stop: () => {
        gain.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 0.05);
        setTimeout(() => {
          try {
            source.stop();
          } catch (e) {
            // 이미 정지됨
          }
        }, 50);
      }
    };

    active.push(instance);
    this.activeSounds.set(id, active);
    this.lastPlayed.set(id, Date.now());
    this.totalActiveSounds++;

    // 종료 시 정리
    source.onended = () => {
      const instances = this.activeSounds.get(id) || [];
      const idx = instances.findIndex(i => i.id === instanceId);
      if (idx > -1) {
        instances.splice(idx, 1);
        this.totalActiveSounds--;
      }
    };

    return instanceId;
  }

  // 특정 인스턴스 정지
  stopInstance(instanceId: string): void {
    for (const [soundId, instances] of this.activeSounds) {
      const instance = instances.find(i => i.id === instanceId);
      if (instance) {
        instance.stop();
        const idx = instances.indexOf(instance);
        if (idx > -1) {
          instances.splice(idx, 1);
          this.totalActiveSounds--;
        }
        break;
      }
    }
  }

  // 특정 사운드의 모든 인스턴스 정지
  stopSound(soundId: string): void {
    const instances = this.activeSounds.get(soundId);
    if (!instances) return;

    instances.forEach(instance => instance.stop());
    this.totalActiveSounds -= instances.length;
    this.activeSounds.set(soundId, []);
  }

  // 모든 사운드 정지
  stopAll(): void {
    this.activeSounds.forEach((instances) => {
      instances.forEach(instance => instance.stop());
    });
    this.activeSounds.clear();
    this.totalActiveSounds = 0;

    // 다시 초기화
    sfxLibrary.categories.forEach(category => {
      category.sounds.forEach(sound => {
        this.activeSounds.set(sound.id, []);
      });
    });
  }

  // 가장 낮은 우선순위 사운드 제거
  private removeLowestPrioritySound(): void {
    let lowestPriority = Infinity;
    let lowestInstance: SoundInstance | null = null;
    let lowestSoundId: string | null = null;

    this.activeSounds.forEach((instances, soundId) => {
      instances.forEach(instance => {
        if (instance.priority < lowestPriority) {
          lowestPriority = instance.priority;
          lowestInstance = instance;
          lowestSoundId = soundId;
        }
      });
    });

    if (lowestInstance && lowestSoundId) {
      lowestInstance.stop();
      const instances = this.activeSounds.get(lowestSoundId) || [];
      const idx = instances.indexOf(lowestInstance);
      if (idx > -1) {
        instances.splice(idx, 1);
        this.totalActiveSounds--;
      }
    }
  }

  // 연속 재생 방지 변형 선택
  private getNextVariation(id: string, total: number): number {
    if (total === 1) return 0;

    let current = this.variationIndex.get(id) || 0;
    let next: number;

    switch (sfxLibrary.variations.selectionMode) {
      case 'round_robin':
        next = (current + 1) % total;
        break;
      case 'random_no_repeat':
        do {
          next = Math.floor(Math.random() * total);
        } while (next === current && total > 1);
        break;
      default:
        next = Math.floor(Math.random() * total);
    }

    this.variationIndex.set(id, next);
    return next;
  }

  // 스테레오 위치 계산
  private getSpatialPan(spatial?: { position: string }): number {
    if (!spatial) return 0;

    switch (spatial.position) {
      case 'left': return -0.5;
      case 'right': return 0.5;
      default: return 0;
    }
  }

  // 사운드 ID로 검색
  private getSoundById(id: string): SFXSound | undefined {
    for (const category of sfxLibrary.categories) {
      const sound = category.sounds.find(s => s.id === id);
      if (sound) return sound;
    }
    return undefined;
  }

  // 볼륨 설정
  setVolume(volume: number): void {
    if (!this.masterGain || !this.audioContext) return;

    this.masterGain.gain.linearRampToValueAtTime(
      volume,
      this.audioContext.currentTime + 0.1
    );
  }

  // 카테고리 음소거
  muteCategory(categoryName: string, muted: boolean): void {
    // 카테고리별 게인 노드가 없으므로 개별 사운드 제어
    // 실제 구현에서는 카테고리별 서브믹스 버스 사용 권장
  }

  // 테스트 사운드 재생
  playTestSound(): void {
    this.play('ui_click');
  }

  // 로드 상태 확인
  isLoaded(soundId: string): boolean {
    return this.buffers.has(soundId);
  }

  // 통계 조회
  getStats(): { totalLoaded: number; totalActive: number } {
    return {
      totalLoaded: this.buffers.size,
      totalActive: this.totalActiveSounds
    };
  }

  // 정리
  dispose(): void {
    this.stopAll();
    this.buffers.clear();
    this.lastPlayed.clear();
    this.variationIndex.clear();

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// 싱글톤 인스턴스
export const sfxEngine = new SFXEngine();

export default SFXEngine;
