/**
 * Chapter 5: Audio & Atmosphere - Ambience Engine
 * 환경 사운드 엔진
 */

import {
  AmbienceSystem,
  AmbienceEnvironment,
  AmbienceLayer,
  AmbienceLayerInstance,
  WeatherSound,
  TimeSound,
  Weather,
} from './types';

// ============================================
// 앰비언스 데이터
// ============================================

export const ambienceSystem: AmbienceSystem = {
  environments: [
    // === 홈 오피스 ===
    {
      id: 'home_office',
      name: 'Home Office',
      layers: [
        {
          id: 'room_tone',
          file: 'amb_room_tone.ogg',
          volume: 0.15,
          loop: true,
          fadeIn: 2,
          fadeOut: 2
        },
        {
          id: 'computer_hum',
          file: 'amb_computer_hum.ogg',
          volume: 0.1,
          loop: true,
          fadeIn: 1,
          fadeOut: 1
        },
        {
          id: 'ac_fan',
          file: 'amb_ac_fan.ogg',
          volume: 0.08,
          loop: true,
          fadeIn: 3,
          fadeOut: 3,
          duck: true
        },
        {
          id: 'clock_tick',
          file: 'amb_clock_tick.ogg',
          volume: 0.05,
          loop: true,
          fadeIn: 1,
          fadeOut: 1,
          duck: true
        }
      ],
      conditions: [
        { type: 'location', value: 'home' }
      ]
    },

    // === 카페 ===
    {
      id: 'cafe',
      name: 'Coffee Shop',
      layers: [
        {
          id: 'cafe_chatter',
          file: 'amb_cafe_chatter.ogg',
          volume: 0.2,
          loop: true,
          fadeIn: 3,
          fadeOut: 3,
          duck: true
        },
        {
          id: 'cafe_music',
          file: 'amb_cafe_music.ogg',
          volume: 0.1,
          loop: true,
          fadeIn: 2,
          fadeOut: 2,
          duck: true
        },
        {
          id: 'espresso_machine',
          file: 'amb_espresso.ogg',
          volume: 0.15,
          loop: false,
          fadeIn: 0.5,
          fadeOut: 0.5,
          randomStart: true
        }
      ],
      conditions: [
        { type: 'event', value: 'cafe_meeting' }
      ]
    },

    // === 컨퍼런스 ===
    {
      id: 'conference',
      name: 'Conference Hall',
      layers: [
        {
          id: 'crowd_murmur',
          file: 'amb_crowd_murmur.ogg',
          volume: 0.25,
          loop: true,
          fadeIn: 3,
          fadeOut: 3
        },
        {
          id: 'distant_speaker',
          file: 'amb_distant_speaker.ogg',
          volume: 0.1,
          loop: true,
          fadeIn: 2,
          fadeOut: 2,
          duck: true
        }
      ],
      conditions: [
        { type: 'event', value: 'conference' }
      ]
    },

    // === 공유 오피스 ===
    {
      id: 'coworking',
      name: 'Coworking Space',
      layers: [
        {
          id: 'office_ambience',
          file: 'amb_office_ambience.ogg',
          volume: 0.15,
          loop: true,
          fadeIn: 2,
          fadeOut: 2
        },
        {
          id: 'keyboards',
          file: 'amb_keyboards.ogg',
          volume: 0.08,
          loop: true,
          fadeIn: 1,
          fadeOut: 1,
          duck: true
        },
        {
          id: 'printer',
          file: 'amb_printer.ogg',
          volume: 0.06,
          loop: false,
          fadeIn: 0.5,
          fadeOut: 0.5,
          randomStart: true
        }
      ],
      conditions: [
        { type: 'event', value: 'coworking' }
      ]
    },

    // === 서버실 ===
    {
      id: 'server_room',
      name: 'Server Room',
      layers: [
        {
          id: 'server_fans',
          file: 'amb_server_fans.ogg',
          volume: 0.3,
          loop: true,
          fadeIn: 2,
          fadeOut: 2
        },
        {
          id: 'server_beeps',
          file: 'amb_server_beeps.ogg',
          volume: 0.1,
          loop: true,
          fadeIn: 1,
          fadeOut: 1
        },
        {
          id: 'cooling',
          file: 'amb_cooling.ogg',
          volume: 0.15,
          loop: true,
          fadeIn: 3,
          fadeOut: 3
        }
      ],
      conditions: [
        { type: 'event', value: 'server_emergency' }
      ]
    }
  ],

  // 날씨 효과
  weatherEffects: [
    {
      id: 'rain_light',
      name: 'Light Rain',
      file: 'weather_rain_light.ogg',
      volume: 0.2,
      loop: true,
      conditions: [{ type: 'weather', value: 'rain_light' }]
    },
    {
      id: 'rain_heavy',
      name: 'Heavy Rain',
      file: 'weather_rain_heavy.ogg',
      volume: 0.35,
      loop: true,
      conditions: [{ type: 'weather', value: 'rain_heavy' }],
      additionalLayers: [
        { file: 'weather_thunder.ogg', volume: 0.4, interval: [30, 120], random: true }
      ]
    },
    {
      id: 'wind',
      name: 'Wind',
      file: 'weather_wind.ogg',
      volume: 0.15,
      loop: true,
      conditions: [{ type: 'weather', value: 'windy' }]
    },
    {
      id: 'snow',
      name: 'Snowy (Indoor)',
      file: 'weather_snow_indoor.ogg',
      volume: 0.1,
      loop: true,
      conditions: [{ type: 'weather', value: 'snow' }]
    }
  ],

  // 시간대 효과
  timeOfDayEffects: [
    {
      id: 'morning',
      name: 'Morning',
      layers: [
        { file: 'time_birds_morning.ogg', volume: 0.1, fadeThrough: true },
        { file: 'time_distant_traffic.ogg', volume: 0.08 }
      ],
      timeRange: { start: 6, end: 10 }
    },
    {
      id: 'afternoon',
      name: 'Afternoon',
      layers: [
        { file: 'time_city_afternoon.ogg', volume: 0.1 }
      ],
      timeRange: { start: 12, end: 17 }
    },
    {
      id: 'evening',
      name: 'Evening',
      layers: [
        { file: 'time_evening_crickets.ogg', volume: 0.08 },
        { file: 'time_distant_city.ogg', volume: 0.06 }
      ],
      timeRange: { start: 18, end: 21 }
    },
    {
      id: 'night',
      name: 'Late Night',
      layers: [
        { file: 'time_night_quiet.ogg', volume: 0.05 },
        { file: 'time_occasional_car.ogg', volume: 0.04, interval: [60, 180] }
      ],
      timeRange: { start: 22, end: 5 }
    }
  ]
};

// ============================================
// 앰비언스 엔진 클래스
// ============================================

export class AmbienceEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeLayers: Map<string, AmbienceLayerInstance> = new Map();
  private currentEnvironment: string | null = null;
  private weatherLayer: AmbienceLayerInstance | null = null;
  private timeLayers: AmbienceLayerInstance[] = [];
  private currentTimeEffect: string | null = null;
  private bufferCache: Map<string, AudioBuffer> = new Map();
  private outputNode: GainNode | null = null;
  private randomLayerIntervals: Map<string, NodeJS.Timeout> = new Map();

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

  // 오디오 버퍼 로드
  private async loadBuffer(file: string): Promise<AudioBuffer | null> {
    const cacheKey = `ambience/${file}`;

    if (this.bufferCache.has(cacheKey)) {
      return this.bufferCache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`/audio/ambience/${file}`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      this.bufferCache.set(cacheKey, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load ambience: ${file}`, error);
      return null;
    }
  }

  // 환경 전환
  async setEnvironment(environmentId: string): Promise<void> {
    if (this.currentEnvironment === environmentId) return;

    if (!this.audioContext) {
      await this.initialize();
    }

    const environment = ambienceSystem.environments.find(e => e.id === environmentId);
    if (!environment) {
      console.warn(`Environment not found: ${environmentId}`);
      return;
    }

    // 현재 환경 페이드 아웃
    if (this.currentEnvironment) {
      await this.fadeOutCurrentEnvironment();
    }

    // 새 환경 로드 및 시작
    this.currentEnvironment = environmentId;

    for (const layer of environment.layers) {
      await this.loadAndPlayLayer(layer);
    }
  }

  // 레이어 로드 및 재생
  private async loadAndPlayLayer(layer: AmbienceLayer): Promise<void> {
    if (!this.audioContext || !this.masterGain) return;

    const audioBuffer = await this.loadBuffer(layer.file);
    if (!audioBuffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = layer.loop;

    if (layer.randomStart && layer.loop) {
      const randomOffset = Math.random() * audioBuffer.duration;
      source.loopStart = randomOffset;
    }

    const gain = this.audioContext.createGain();
    gain.gain.value = 0;

    source.connect(gain);
    gain.connect(this.masterGain);

    source.start();

    // 페이드 인
    gain.gain.linearRampToValueAtTime(
      layer.volume,
      this.audioContext.currentTime + layer.fadeIn
    );

    this.activeLayers.set(layer.id, {
      id: layer.id,
      source,
      gain,
      config: layer
    });
  }

  // 현재 환경 페이드 아웃
  private async fadeOutCurrentEnvironment(): Promise<void> {
    if (!this.audioContext) return;

    const fadePromises: Promise<void>[] = [];

    this.activeLayers.forEach((instance, id) => {
      const promise = new Promise<void>((resolve) => {
        instance.gain.gain.linearRampToValueAtTime(
          0,
          this.audioContext!.currentTime + instance.config.fadeOut
        );

        setTimeout(() => {
          try {
            instance.source.stop();
            instance.source.disconnect();
            instance.gain.disconnect();
          } catch (e) {
            // 이미 정지됨
          }
          resolve();
        }, instance.config.fadeOut * 1000);
      });

      fadePromises.push(promise);
    });

    await Promise.all(fadePromises);
    this.activeLayers.clear();
  }

  // 날씨 효과 설정
  async setWeather(weatherId: Weather | null): Promise<void> {
    if (!this.audioContext || !this.masterGain) {
      await this.initialize();
    }

    // 현재 날씨 페이드 아웃
    if (this.weatherLayer) {
      this.weatherLayer.gain.gain.linearRampToValueAtTime(
        0,
        this.audioContext!.currentTime + 2
      );
      setTimeout(() => {
        try {
          this.weatherLayer?.source.stop();
          this.weatherLayer?.source.disconnect();
          this.weatherLayer?.gain.disconnect();
        } catch (e) {
          // 이미 정지됨
        }
      }, 2000);
      this.weatherLayer = null;
    }

    // 랜덤 레이어 인터벌 정리
    this.randomLayerIntervals.forEach(interval => clearInterval(interval));
    this.randomLayerIntervals.clear();

    if (!weatherId || weatherId === 'clear') return;

    const weather = ambienceSystem.weatherEffects.find(w => w.id === weatherId);
    if (!weather) return;

    const audioBuffer = await this.loadBuffer(weather.file);
    if (!audioBuffer) return;

    const source = this.audioContext!.createBufferSource();
    source.buffer = audioBuffer;
    source.loop = weather.loop;

    const gain = this.audioContext!.createGain();
    gain.gain.value = 0;

    source.connect(gain);
    gain.connect(this.masterGain!);

    source.start();

    // 페이드 인
    gain.gain.linearRampToValueAtTime(
      weather.volume,
      this.audioContext!.currentTime + 3
    );

    this.weatherLayer = {
      id: weather.id,
      source,
      gain,
      config: weather
    };

    // 추가 레이어 (천둥 등) 처리
    if (weather.additionalLayers) {
      this.startRandomLayers(weather.additionalLayers);
    }
  }

  // 랜덤 간격 레이어 (천둥 등)
  private startRandomLayers(layers: any[]): void {
    layers.forEach((layer, index) => {
      const scheduleNext = () => {
        const [min, max] = layer.interval;
        const delay = (Math.random() * (max - min) + min) * 1000;

        const timeout = setTimeout(async () => {
          if (!this.weatherLayer || !this.audioContext || !this.masterGain) return;

          const audioBuffer = await this.loadBuffer(layer.file);
          if (!audioBuffer) return;

          const source = this.audioContext.createBufferSource();
          source.buffer = audioBuffer;

          const gain = this.audioContext.createGain();
          gain.gain.value = layer.volume;

          source.connect(gain);
          gain.connect(this.masterGain);

          source.start();
          scheduleNext();
        }, delay);

        this.randomLayerIntervals.set(`random_${index}`, timeout);
      };

      scheduleNext();
    });
  }

  // 시간대 업데이트
  updateTimeOfDay(hour: number): void {
    const timeEffect = ambienceSystem.timeOfDayEffects.find(t => {
      if (t.timeRange.start < t.timeRange.end) {
        return hour >= t.timeRange.start && hour < t.timeRange.end;
      } else {
        // 자정 걸치는 경우 (예: 22-5)
        return hour >= t.timeRange.start || hour < t.timeRange.end;
      }
    });

    if (timeEffect && this.currentTimeEffect !== timeEffect.id) {
      this.transitionTimeEffect(timeEffect);
    }
  }

  // 시간대 효과 전환
  private async transitionTimeEffect(timeEffect: TimeSound): Promise<void> {
    if (!this.audioContext || !this.masterGain) {
      await this.initialize();
    }

    // 현재 시간대 레이어 페이드 아웃
    for (const layer of this.timeLayers) {
      layer.gain.gain.linearRampToValueAtTime(
        0,
        this.audioContext!.currentTime + 2
      );
      setTimeout(() => {
        try {
          layer.source.stop();
          layer.source.disconnect();
          layer.gain.disconnect();
        } catch (e) {
          // 이미 정지됨
        }
      }, 2000);
    }
    this.timeLayers = [];

    // 새 시간대 레이어 로드
    this.currentTimeEffect = timeEffect.id;

    for (const layerConfig of timeEffect.layers) {
      const audioBuffer = await this.loadBuffer(layerConfig.file);
      if (!audioBuffer) continue;

      const source = this.audioContext!.createBufferSource();
      source.buffer = audioBuffer;
      source.loop = true;

      const gain = this.audioContext!.createGain();
      gain.gain.value = 0;

      source.connect(gain);
      gain.connect(this.masterGain!);

      source.start();

      // 페이드 인
      gain.gain.linearRampToValueAtTime(
        layerConfig.volume,
        this.audioContext!.currentTime + 3
      );

      this.timeLayers.push({
        id: timeEffect.id,
        source,
        gain,
        config: layerConfig
      });
    }
  }

  // 덕킹 적용 (이벤트 발생 시)
  applyDucking(amount: number = 0.3, fadeTime: number = 0.5): void {
    if (!this.audioContext) return;

    this.activeLayers.forEach(layer => {
      if (layer.config.duck) {
        const currentVolume = layer.gain.gain.value;
        layer.gain.gain.linearRampToValueAtTime(
          currentVolume * amount,
          this.audioContext!.currentTime + fadeTime
        );
      }
    });
  }

  // 덕킹 해제
  releaseDucking(fadeTime: number = 0.5): void {
    if (!this.audioContext) return;

    this.activeLayers.forEach(layer => {
      if (layer.config.duck) {
        layer.gain.gain.linearRampToValueAtTime(
          layer.config.volume,
          this.audioContext!.currentTime + fadeTime
        );
      }
    });
  }

  // 볼륨 조절
  setVolume(volume: number): void {
    if (!this.masterGain || !this.audioContext) return;

    this.masterGain.gain.linearRampToValueAtTime(
      volume,
      this.audioContext.currentTime + 0.5
    );
  }

  // 현재 환경 조회
  getCurrentEnvironment(): string | null {
    return this.currentEnvironment;
  }

  // 현재 시간대 효과 조회
  getCurrentTimeEffect(): string | null {
    return this.currentTimeEffect;
  }

  // 정리
  async dispose(): Promise<void> {
    // 모든 레이어 정지
    await this.fadeOutCurrentEnvironment();

    // 날씨 레이어 정지
    if (this.weatherLayer) {
      try {
        this.weatherLayer.source.stop();
        this.weatherLayer.source.disconnect();
        this.weatherLayer.gain.disconnect();
      } catch (e) {
        // 이미 정지됨
      }
      this.weatherLayer = null;
    }

    // 시간대 레이어 정지
    for (const layer of this.timeLayers) {
      try {
        layer.source.stop();
        layer.source.disconnect();
        layer.gain.disconnect();
      } catch (e) {
        // 이미 정지됨
      }
    }
    this.timeLayers = [];

    // 랜덤 인터벌 정리
    this.randomLayerIntervals.forEach(interval => clearTimeout(interval));
    this.randomLayerIntervals.clear();

    // 캐시 정리
    this.bufferCache.clear();

    // AudioContext 정리
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.currentEnvironment = null;
    this.currentTimeEffect = null;
  }

  // 모든 환경 목록 조회
  getAvailableEnvironments(): string[] {
    return ambienceSystem.environments.map(e => e.id);
  }

  // 모든 날씨 효과 목록 조회
  getAvailableWeatherEffects(): string[] {
    return ambienceSystem.weatherEffects.map(w => w.id);
  }
}

// 싱글톤 인스턴스
export const ambienceEngine = new AmbienceEngine();

export default AmbienceEngine;
