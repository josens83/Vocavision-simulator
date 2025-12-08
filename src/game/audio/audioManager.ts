/**
 * Chapter 5: Audio & Atmosphere - Audio Manager
 * 통합 오디오 매니저
 */

import {
  AudioSettings,
  AudioManagerState,
  Mood,
  TimeOfDay,
  GamePhase,
  Weather,
  AudioEventType,
} from './types';
import { MusicEngine, musicEngine, musicTracks } from './musicEngine';
import { SFXEngine, sfxEngine } from './sfxEngine';
import { AmbienceEngine, ambienceEngine } from './ambienceEngine';
import { MixingEngine, mixingEngine } from './mixingEngine';
import { SoundTriggerManager, soundTriggerManager, GameStateForAudio } from './soundTrigger';

// ============================================
// 기본 오디오 설정
// ============================================

export const defaultAudioSettings: AudioSettings = {
  master: { volume: 80, muted: false },
  music: { volume: 70, muted: false },
  sfx: { volume: 80, muted: false },
  ambience: { volume: 50, muted: false },
  ui: { volume: 60, muted: false },
  voice: { volume: 100, muted: false },

  behavior: {
    muteOnFocusLoss: true,
    muteOnMinimize: true,
    dynamicRange: 'full',
    spatialAudio: true,
    lowLatencyMode: false
  },

  quality: {
    sampleRate: 44100,
    bitDepth: 16,
    streaming: true
  }
};

// ============================================
// 오디오 매니저 클래스
// ============================================

export class AudioManager {
  private musicEngine: MusicEngine;
  private sfxEngine: SFXEngine;
  private ambienceEngine: AmbienceEngine;
  private mixingEngine: MixingEngine;
  private soundTrigger: SoundTriggerManager;

  private settings: AudioSettings;
  private state: AudioManagerState;
  private initialized: boolean = false;
  private focusHandler: (() => void) | null = null;
  private blurHandler: (() => void) | null = null;

  constructor() {
    this.musicEngine = musicEngine;
    this.sfxEngine = sfxEngine;
    this.ambienceEngine = ambienceEngine;
    this.mixingEngine = mixingEngine;
    this.soundTrigger = soundTriggerManager;

    this.settings = { ...defaultAudioSettings };
    this.state = {
      initialized: false,
      suspended: true,
      currentTrack: null,
      currentEnvironment: null,
      currentWeather: null,
      intensity: 0.5,
      mood: 'neutral',
      timeOfDay: 'morning',
      gamePhase: 'early'
    };
  }

  // 초기화
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // 믹싱 엔진 먼저 초기화
      await this.mixingEngine.initialize();

      // 각 엔진에 버스 연결
      const musicBus = this.mixingEngine.getBus('music');
      const sfxBus = this.mixingEngine.getBus('sfx');
      const ambienceBus = this.mixingEngine.getBus('ambience');

      if (musicBus) {
        await this.musicEngine.initialize(musicBus);
      }
      if (sfxBus) {
        await this.sfxEngine.initialize(sfxBus);
      }
      if (ambienceBus) {
        await this.ambienceEngine.initialize(ambienceBus);
      }

      // 사운드 트리거에 엔진 연결
      this.soundTrigger.setEngines({
        playSound: (id, options) => this.playSound(id, options),
        stopMusic: () => this.stopMusic(),
        fadeMusic: (volume, fadeTime) => this.musicEngine.fadeToVolume(volume, fadeTime),
        crossfadeMusic: (trackId, fadeTime) => this.musicEngine.crossfadeTo(trackId, fadeTime),
        playStinger: (trackId) => this.musicEngine.playStinger(trackId),
        getPreviousTrack: () => this.musicEngine.getPreviousTrack()?.id || null
      });

      // 포커스 이벤트 핸들러 설정
      this.setupFocusHandlers();

      // 설정 적용
      this.applySettings();

      this.initialized = true;
      this.state.initialized = true;
      this.state.suspended = false;

      console.log('AudioManager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
      throw error;
    }
  }

  // 포커스 핸들러 설정
  private setupFocusHandlers(): void {
    if (typeof window === 'undefined') return;

    this.focusHandler = () => {
      if (this.settings.behavior.muteOnFocusLoss && this.state.suspended) {
        this.resume();
      }
    };

    this.blurHandler = () => {
      if (this.settings.behavior.muteOnFocusLoss && !this.state.suspended) {
        this.suspend();
      }
    };

    window.addEventListener('focus', this.focusHandler);
    window.addEventListener('blur', this.blurHandler);
  }

  // 설정 적용
  private applySettings(): void {
    // 볼륨 설정 적용
    const masterMultiplier = this.settings.master.muted ? 0 : this.settings.master.volume / 100;

    if (!this.settings.music.muted) {
      this.mixingEngine.setBusVolume('music', (this.settings.music.volume / 100) * masterMultiplier);
    } else {
      this.mixingEngine.muteBus('music', true);
    }

    if (!this.settings.sfx.muted) {
      this.mixingEngine.setBusVolume('sfx', (this.settings.sfx.volume / 100) * masterMultiplier);
    } else {
      this.mixingEngine.muteBus('sfx', true);
    }

    if (!this.settings.ambience.muted) {
      this.mixingEngine.setBusVolume('ambience', (this.settings.ambience.volume / 100) * masterMultiplier);
    } else {
      this.mixingEngine.muteBus('ambience', true);
    }

    if (!this.settings.ui.muted) {
      this.mixingEngine.setBusVolume('ui', (this.settings.ui.volume / 100) * masterMultiplier);
    } else {
      this.mixingEngine.muteBus('ui', true);
    }
  }

  // 효과음 로드
  async loadSounds(): Promise<void> {
    await this.sfxEngine.loadAll();
  }

  // 효과음 재생
  playSound(id: string, options?: { volume?: number; pan?: number }): string | null {
    if (this.state.suspended) return null;
    return this.sfxEngine.play(id, options);
  }

  // 이벤트 트리거
  trigger(event: AudioEventType | string, data?: any): void {
    if (this.state.suspended) return;
    this.soundTrigger.trigger(event, data);
  }

  // 음악 재생
  async playMusic(trackId?: string): Promise<void> {
    if (!this.initialized) await this.initialize();

    let track;
    if (trackId) {
      track = musicTracks.find(t => t.id === trackId);
    } else {
      track = this.musicEngine.selectTrackForState(
        this.state.mood,
        this.state.timeOfDay,
        this.state.gamePhase
      );
    }

    if (track) {
      await this.musicEngine.loadTrack(track);
      this.musicEngine.play();
      this.state.currentTrack = track.id;
    }
  }

  // 음악 정지
  stopMusic(): void {
    this.musicEngine.stop();
    this.state.currentTrack = null;
  }

  // 음악 일시정지
  pauseMusic(): void {
    this.musicEngine.pause();
  }

  // 음악 재개
  resumeMusic(): void {
    this.musicEngine.resume();
  }

  // 음악 크로스페이드
  async crossfadeMusic(trackId: string, duration?: number): Promise<void> {
    await this.musicEngine.crossfadeTo(trackId, duration);
    this.state.currentTrack = trackId;
  }

  // 스팅어 재생
  async playStinger(trackId: string): Promise<void> {
    await this.musicEngine.playStinger(trackId);
  }

  // 환경 설정
  async setEnvironment(environmentId: string): Promise<void> {
    if (!this.initialized) await this.initialize();
    await this.ambienceEngine.setEnvironment(environmentId);
    this.state.currentEnvironment = environmentId;
  }

  // 날씨 설정
  async setWeather(weather: Weather | null): Promise<void> {
    if (!this.initialized) await this.initialize();
    await this.ambienceEngine.setWeather(weather);
    this.state.currentWeather = weather;
  }

  // 시간대 업데이트
  updateTimeOfDay(hour: number): void {
    this.ambienceEngine.updateTimeOfDay(hour);

    // 시간대 상태 업데이트
    if (hour >= 6 && hour < 12) {
      this.state.timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 18) {
      this.state.timeOfDay = 'afternoon';
    } else if (hour >= 18 && hour < 22) {
      this.state.timeOfDay = 'evening';
    } else {
      this.state.timeOfDay = hour >= 22 || hour < 2 ? 'night' : 'lateNight';
    }
  }

  // 무드 설정
  setMood(mood: Mood): void {
    this.state.mood = mood;

    // 무드에 따른 음악 전환
    if (this.state.currentTrack) {
      const newTrack = this.musicEngine.selectTrackForState(
        mood,
        this.state.timeOfDay,
        this.state.gamePhase
      );

      if (newTrack && newTrack.id !== this.state.currentTrack) {
        this.crossfadeMusic(newTrack.id, 3000);
      }
    }
  }

  // 인텐시티 설정
  setIntensity(intensity: number): void {
    this.state.intensity = intensity;
    this.musicEngine.setIntensity(intensity);
  }

  // 게임 페이즈 설정
  setGamePhase(phase: GamePhase): void {
    this.state.gamePhase = phase;
  }

  // 게임 상태 업데이트
  updateGameState(state: GameStateForAudio): void {
    this.soundTrigger.updateGameState(state);
    this.musicEngine.checkContextRules(state);
  }

  // 볼륨 설정
  setVolume(category: keyof AudioSettings['master'] extends 'volume' ? 'master' | 'music' | 'sfx' | 'ambience' | 'ui' | 'voice' : never, volume: number): void {
    if (category === 'master') {
      this.settings.master.volume = volume;
    } else if (category in this.settings) {
      (this.settings as any)[category].volume = volume;
    }
    this.applySettings();
  }

  // 음소거 토글
  toggleMute(category: string): void {
    if (category === 'master') {
      this.settings.master.muted = !this.settings.master.muted;
    } else if (category in this.settings) {
      (this.settings as any)[category].muted = !(this.settings as any)[category].muted;
    }
    this.applySettings();
  }

  // 전체 일시정지
  async suspend(): Promise<void> {
    this.state.suspended = true;
    await this.mixingEngine.suspend();
  }

  // 전체 재개
  async resume(): Promise<void> {
    this.state.suspended = false;
    await this.mixingEngine.resume();
  }

  // 테스트 사운드 재생
  playTestSound(category: string = 'sfx'): void {
    switch (category) {
      case 'sfx':
        this.playSound('ui_click');
        break;
      case 'music':
        this.playMusic('main_theme');
        break;
      case 'ambience':
        this.setEnvironment('home_office');
        break;
    }
  }

  // 테스트 시퀀스 재생
  playTestSequence(): void {
    this.soundTrigger.playSequence('startup_sequence');
  }

  // 설정 저장
  saveSettings(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('vocavision_audio_settings', JSON.stringify(this.settings));
    }
  }

  // 설정 로드
  loadSettings(): void {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('vocavision_audio_settings');
      if (saved) {
        try {
          this.settings = { ...defaultAudioSettings, ...JSON.parse(saved) };
          this.applySettings();
        } catch (error) {
          console.error('Failed to load audio settings:', error);
        }
      }
    }
  }

  // 설정 초기화
  resetSettings(): void {
    this.settings = { ...defaultAudioSettings };
    this.applySettings();
    this.saveSettings();
  }

  // 설정 조회
  getSettings(): AudioSettings {
    return { ...this.settings };
  }

  // 상태 조회
  getState(): AudioManagerState {
    return { ...this.state };
  }

  // 정리
  dispose(): void {
    // 이벤트 핸들러 제거
    if (typeof window !== 'undefined') {
      if (this.focusHandler) {
        window.removeEventListener('focus', this.focusHandler);
      }
      if (this.blurHandler) {
        window.removeEventListener('blur', this.blurHandler);
      }
    }

    // 엔진 정리
    this.musicEngine.dispose();
    this.sfxEngine.dispose();
    this.ambienceEngine.dispose();
    this.mixingEngine.dispose();

    this.initialized = false;
    this.state.initialized = false;
  }
}

// 싱글톤 인스턴스
export const audioManager = new AudioManager();

export default AudioManager;
