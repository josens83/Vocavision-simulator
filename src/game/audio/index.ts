/**
 * Chapter 5: Audio & Atmosphere - Main Index
 * 오디오 시스템 통합 익스포트
 */

// Types
export * from './types';
export {
  MusicCategory,
  type MusicTrack,
  type Stem,
  type DuckingConfig,
  type AdaptiveMusicSystem,
  type MusicLayer,
  type TransitionConfig,
  type ContextRule,
  type SFXSound,
  type SFXCategory,
  type SFXLibrary,
  type PlayOptions,
  type SoundInstance,
  type AmbienceSystem,
  type AmbienceEnvironment,
  type AmbienceLayer,
  type AmbienceLayerInstance,
  type WeatherSound,
  type TimeSound,
  type MixingSystem,
  type AudioBus,
  type MasterChain,
  type AudioEffect,
  type BusNode,
  type SoundTriggerSystem,
  type SoundMapping,
  type SoundAction,
  type TriggerCondition,
  type SoundSequence,
  type AudioSettings,
  type VolumeSettings,
  type BehaviorSettings,
  type QualitySettings,
  type AudioManagerState,
  type AudioEventType,
  type Mood,
  type TimeOfDay,
  type GamePhase,
  type Weather,
} from './types';

// Music Engine
export { MusicEngine, musicEngine, musicTracks, musicLayers, transitionConfig, contextRules } from './musicEngine';

// SFX Engine
export { SFXEngine, sfxEngine, sfxLibrary } from './sfxEngine';

// Ambience Engine
export { AmbienceEngine, ambienceEngine, ambienceSystem } from './ambienceEngine';

// Mixing Engine
export { MixingEngine, mixingEngine, mixingConfig } from './mixingEngine';

// Sound Trigger
export {
  SoundTriggerManager,
  soundTriggerManager,
  soundTriggerConfig,
  type AudioEngines,
  type GameStateForAudio,
} from './soundTrigger';

// Audio Manager
export { AudioManager, audioManager, defaultAudioSettings } from './audioManager';

// Components
export * from './components';

// Audio Statistics
export const AUDIO_STATISTICS = {
  musicTracks: 7,
  musicLayers: 5,
  sfxCategories: 7,
  sfxSounds: 50,
  ambienceEnvironments: 5,
  weatherEffects: 4,
  timeEffects: 4,
  audioBusses: 6,
  soundMappings: 45,
  soundSequences: 3,
};

// Quick start helper
export async function initializeAudio(): Promise<void> {
  const { audioManager } = await import('./audioManager');
  await audioManager.initialize();
  await audioManager.loadSounds();
  audioManager.loadSettings();
}

export default {
  audioManager,
  musicEngine,
  sfxEngine,
  ambienceEngine,
  mixingEngine,
  soundTriggerManager,
  AUDIO_STATISTICS,
  initializeAudio,
};
