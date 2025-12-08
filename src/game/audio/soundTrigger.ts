/**
 * Chapter 5: Audio & Atmosphere - Sound Trigger System
 * 이벤트-사운드 매핑 시스템
 */

import {
  SoundTriggerSystem,
  SoundMapping,
  SoundAction,
  TriggerCondition,
  SoundSequence,
  AudioEventType,
} from './types';

// ============================================
// 사운드 트리거 데이터
// ============================================

export const soundTriggerConfig: SoundTriggerSystem = {
  mappings: [
    // === UI 이벤트 ===
    { event: 'button_click', sounds: [{ type: 'play', target: 'ui_click' }] },
    { event: 'button_hover', sounds: [{ type: 'play', target: 'ui_hover' }] },
    { event: 'toggle_on', sounds: [{ type: 'play', target: 'ui_toggle_on' }] },
    { event: 'toggle_off', sounds: [{ type: 'play', target: 'ui_toggle_off' }] },
    { event: 'tab_switch', sounds: [{ type: 'play', target: 'ui_tab_switch' }] },
    { event: 'modal_open', sounds: [{ type: 'play', target: 'ui_modal_open' }] },
    { event: 'modal_close', sounds: [{ type: 'play', target: 'ui_modal_close' }] },
    { event: 'invalid_action', sounds: [{ type: 'play', target: 'ui_error' }] },

    // === 게임플레이 이벤트 ===
    {
      event: 'action_develop',
      sounds: [
        { type: 'play', target: 'action_develop' },
        { type: 'play', target: 'keyboard_typing', options: { delay: 200, volume: 0.3 } }
      ]
    },
    { event: 'action_marketing', sounds: [{ type: 'play', target: 'action_marketing' }] },
    { event: 'action_rest', sounds: [{ type: 'play', target: 'action_rest' }] },
    { event: 'action_server', sounds: [{ type: 'play', target: 'action_server_maintain' }] },

    // === 시간 이벤트 ===
    { event: 'day_advance', sounds: [{ type: 'play', target: 'day_pass' }] },
    { event: 'month_end', sounds: [{ type: 'play', target: 'month_pass' }] },

    // === 자원 변화 ===
    {
      event: 'money_gained',
      sounds: [{ type: 'play', target: 'money_gain' }],
      conditions: [{ type: 'amount', operator: '>', value: 0 }]
    },
    {
      event: 'money_lost',
      sounds: [{ type: 'play', target: 'money_loss' }],
      conditions: [{ type: 'amount', operator: '>', value: 100000 }]
    },
    {
      event: 'money_critical',
      sounds: [{ type: 'play', target: 'notif_critical' }],
      conditions: [{ type: 'balance', operator: '<', value: 500000 }]
    },
    { event: 'user_gained', sounds: [{ type: 'play', target: 'user_gain' }] },
    { event: 'user_churned', sounds: [{ type: 'play', target: 'user_loss' }] },

    // === 상태 경고 ===
    {
      event: 'energy_low',
      sounds: [{ type: 'play', target: 'energy_low' }],
      conditions: [{ type: 'energy', operator: '<', value: 20 }]
    },
    {
      event: 'stress_high',
      sounds: [{ type: 'play', target: 'stress_high' }],
      conditions: [{ type: 'stress', operator: '>', value: 80 }]
    },
    {
      event: 'server_critical',
      sounds: [
        { type: 'play', target: 'notif_critical' },
        { type: 'crossfade', target: 'tension_01', options: { fadeTime: 1 } }
      ],
      conditions: [{ type: 'serverHealth', operator: '<', value: 30 }]
    },

    // === 이벤트 발생 ===
    { event: 'event_appear', sounds: [{ type: 'play', target: 'event_appear' }] },
    {
      event: 'event_critical',
      sounds: [
        { type: 'play', target: 'event_critical' },
        { type: 'crossfade', target: 'tension_01', options: { fadeTime: 0.5 } }
      ]
    },
    { event: 'event_positive', sounds: [{ type: 'play', target: 'event_positive' }] },
    { event: 'choice_hover', sounds: [{ type: 'play', target: 'choice_select' }] },
    { event: 'choice_confirm', sounds: [{ type: 'play', target: 'choice_confirm' }] },
    {
      event: 'event_resolved',
      sounds: [
        { type: 'crossfade', target: 'previous_track', options: { fadeTime: 2 } }
      ]
    },

    // === 알림 ===
    { event: 'notification_info', sounds: [{ type: 'play', target: 'notif_info' }] },
    { event: 'notification_success', sounds: [{ type: 'play', target: 'notif_success' }] },
    { event: 'notification_warning', sounds: [{ type: 'play', target: 'notif_warning' }] },
    { event: 'notification_error', sounds: [{ type: 'play', target: 'notif_error' }] },
    { event: 'notification_slack', sounds: [{ type: 'play', target: 'notif_slack' }] },
    { event: 'notification_email', sounds: [{ type: 'play', target: 'notif_email' }] },

    // === 성취/마일스톤 ===
    {
      event: 'achievement_unlock',
      sounds: [
        { type: 'play', target: 'achievement_unlock' },
        { type: 'fade', target: 'music', options: { volume: 0.3, fadeTime: 0.3 } }
      ]
    },
    {
      event: 'milestone_reach',
      sounds: [
        { type: 'play', target: 'milestone_reach' },
        { type: 'play', target: 'victory_fanfare', options: { delay: 500 } }
      ]
    },
    { event: 'skill_level_up', sounds: [{ type: 'play', target: 'level_up' }] },
    { event: 'feature_unlock', sounds: [{ type: 'play', target: 'feature_unlock' }] },

    // === 게임 상태 ===
    {
      event: 'game_over',
      sounds: [
        { type: 'stop', target: 'music' },
        { type: 'play', target: 'game_over', options: { delay: 500 } }
      ]
    },
    {
      event: 'game_victory',
      sounds: [
        { type: 'stop', target: 'music' },
        { type: 'play', target: 'victory_fanfare' }
      ]
    },

    // === 다이제틱 ===
    { event: 'typing_start', sounds: [{ type: 'play', target: 'keyboard_typing' }] },
    {
      event: 'coffee_break',
      sounds: [
        { type: 'play', target: 'coffee_pour' },
        { type: 'play', target: 'coffee_sip', options: { delay: 2000 } }
      ]
    }
  ],

  conditions: [],

  sequences: [
    {
      id: 'startup_sequence',
      sounds: [
        { target: 'ui_modal_open', delay: 500 },
        { target: 'notif_info', delay: 1500 }
      ],
      trigger: 'game_start'
    },
    {
      id: 'month_end_sequence',
      sounds: [
        { target: 'month_pass', delay: 0 },
        { target: 'money_gain', delay: 500 },
        { target: 'stats_reveal', delay: 1000, repeat: 5, interval: 200 }
      ],
      trigger: 'month_summary'
    },
    {
      id: 'level_up_sequence',
      sounds: [
        { target: 'level_up', delay: 0 },
        { target: 'notif_success', delay: 300 }
      ],
      trigger: 'skill_level_up'
    }
  ]
};

// ============================================
// 사운드 트리거 매니저 클래스
// ============================================

export interface AudioEngines {
  playSound: (id: string, options?: any) => void;
  stopMusic: () => void;
  fadeMusic: (volume: number, fadeTime: number) => void;
  crossfadeMusic: (trackId: string, fadeTime: number) => void;
  playStinger: (trackId: string) => void;
  getPreviousTrack: () => string | null;
}

export interface GameStateForAudio {
  player?: {
    health?: {
      energy?: number;
      stress?: number;
    };
  };
  business?: {
    finance?: {
      cash?: number;
    };
    infrastructure?: {
      serverHealth?: number;
    };
  };
}

export class SoundTriggerManager {
  private engines: AudioEngines | null = null;
  private gameState: GameStateForAudio = {};
  private enabled: boolean = true;

  constructor() {}

  // 엔진 연결
  setEngines(engines: AudioEngines): void {
    this.engines = engines;
  }

  // 활성화/비활성화
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  // 이벤트 트리거
  trigger(event: AudioEventType | string, data?: any): void {
    if (!this.enabled || !this.engines) return;

    const mapping = soundTriggerConfig.mappings.find(m => m.event === event);
    if (!mapping) return;

    // 조건 확인
    if (mapping.conditions && !this.checkConditions(mapping.conditions, data)) {
      return;
    }

    // 사운드 액션 실행
    for (const action of mapping.sounds) {
      this.executeAction(action);
    }
  }

  // 조건 확인
  private checkConditions(conditions: TriggerCondition[], data?: any): boolean {
    return conditions.every(condition => {
      const value = this.getConditionValue(condition.type, data);

      switch (condition.operator) {
        case '>': return value > condition.value;
        case '<': return value < condition.value;
        case '>=': return value >= condition.value;
        case '<=': return value <= condition.value;
        case '==': return value === condition.value;
        case '!=': return value !== condition.value;
        default: return false;
      }
    });
  }

  // 조건 값 가져오기
  private getConditionValue(type: string, data?: any): any {
    switch (type) {
      case 'amount':
        return data?.amount;
      case 'balance':
        return this.gameState.business?.finance?.cash;
      case 'energy':
        return this.gameState.player?.health?.energy;
      case 'stress':
        return this.gameState.player?.health?.stress;
      case 'serverHealth':
        return this.gameState.business?.infrastructure?.serverHealth;
      default:
        return data?.[type];
    }
  }

  // 액션 실행
  private executeAction(action: SoundAction): void {
    if (!this.engines) return;

    const delay = action.options?.delay || 0;

    setTimeout(() => {
      switch (action.type) {
        case 'play':
          this.engines!.playSound(action.target, {
            volume: action.options?.volume
          });
          break;

        case 'stop':
          if (action.target === 'music') {
            this.engines!.stopMusic();
          }
          break;

        case 'fade':
          if (action.target === 'music') {
            this.engines!.fadeMusic(
              action.options?.volume || 0,
              action.options?.fadeTime || 1
            );
          }
          break;

        case 'crossfade':
          const target = action.target === 'previous_track'
            ? this.engines!.getPreviousTrack() || 'daily_work_01'
            : action.target;

          this.engines!.crossfadeMusic(
            target,
            (action.options?.fadeTime || 2) * 1000
          );
          break;
      }
    }, delay);
  }

  // 시퀀스 재생
  playSequence(sequenceId: string): void {
    if (!this.enabled || !this.engines) return;

    const sequence = soundTriggerConfig.sequences.find(s => s.id === sequenceId);
    if (!sequence) return;

    for (const sound of sequence.sounds) {
      const playSound = (index: number = 0) => {
        setTimeout(() => {
          this.engines!.playSound(sound.target);

          if (sound.repeat && index < sound.repeat - 1) {
            setTimeout(() => playSound(index + 1), sound.interval || 0);
          }
        }, sound.delay + (index * (sound.interval || 0)));
      };

      playSound();
    }
  }

  // 게임 상태 업데이트
  updateGameState(state: GameStateForAudio): void {
    this.gameState = state;
  }

  // 특정 이벤트 트리거에 의한 시퀀스 확인 및 재생
  checkSequenceTrigger(trigger: string): void {
    const sequence = soundTriggerConfig.sequences.find(s => s.trigger === trigger);
    if (sequence) {
      this.playSequence(sequence.id);
    }
  }

  // 매핑 목록 조회
  getMappings(): SoundMapping[] {
    return soundTriggerConfig.mappings;
  }

  // 시퀀스 목록 조회
  getSequences(): SoundSequence[] {
    return soundTriggerConfig.sequences;
  }
}

// 싱글톤 인스턴스
export const soundTriggerManager = new SoundTriggerManager();

export default SoundTriggerManager;
