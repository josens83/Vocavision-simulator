/**
 * Chapter 5: Audio & Atmosphere - Audio Settings Panel
 * 오디오 설정 UI 컴포넌트
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AudioSettings, VolumeSettings } from '../types';
import { audioManager, defaultAudioSettings } from '../audioManager';
import { colors, borderRadius, shadows } from '../../ui/designTokens';

// ============================================
// 볼륨 슬라이더 컴포넌트
// ============================================

interface VolumeSliderProps {
  label: string;
  icon: string;
  value: number;
  muted: boolean;
  onChange: (value: number) => void;
  onMuteToggle: () => void;
  testButton?: boolean;
  onTest?: () => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
  label,
  icon,
  value,
  muted,
  onChange,
  onMuteToggle,
  testButton,
  onTest
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    backgroundColor: muted ? colors.background.tertiary : colors.background.secondary,
    borderRadius: borderRadius.md,
    opacity: muted ? 0.6 : 1,
    transition: 'all 0.2s ease',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const labelContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '1.25rem',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.text.primary,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: muted ? colors.text.tertiary : colors.primary.main,
    fontFamily: '"JetBrains Mono", monospace',
    minWidth: '45px',
    textAlign: 'right',
  };

  const controlsStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const muteButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: muted ? colors.semantic.warning.bg : 'transparent',
    border: `1px solid ${muted ? colors.semantic.warning.main : colors.border.default}`,
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
  };

  const sliderContainerStyle: React.CSSProperties = {
    flex: 1,
    position: 'relative',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
  };

  const sliderTrackStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '6px',
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  };

  const sliderFillStyle: React.CSSProperties = {
    width: `${muted ? 0 : value}%`,
    height: '100%',
    backgroundColor: muted ? colors.text.tertiary : colors.primary.main,
    borderRadius: borderRadius.full,
    transition: 'width 0.1s ease',
  };

  const sliderInputStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: muted ? 'not-allowed' : 'pointer',
    margin: 0,
  };

  const testButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: colors.text.secondary,
    transition: 'all 0.2s ease',
  };

  const getMuteIcon = (): string => {
    if (muted) return '🔇';
    if (value > 66) return '🔊';
    if (value > 33) return '🔉';
    if (value > 0) return '🔈';
    return '🔇';
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={labelContainerStyle}>
          <span style={iconStyle}>{icon}</span>
          <span style={labelStyle}>{label}</span>
        </div>
        <span style={valueStyle}>{muted ? 'MUTE' : `${value}%`}</span>
      </div>

      <div style={controlsStyle}>
        <button
          type="button"
          onClick={onMuteToggle}
          style={muteButtonStyle}
          title={muted ? '음소거 해제' : '음소거'}
        >
          {getMuteIcon()}
        </button>

        <div style={sliderContainerStyle}>
          <div style={sliderTrackStyle}>
            <div style={sliderFillStyle} />
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={muted ? 0 : value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            style={sliderInputStyle}
            disabled={muted}
          />
        </div>

        {testButton && (
          <button
            type="button"
            onClick={onTest}
            style={testButtonStyle}
            title="테스트"
          >
            ▶
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// 토글 설정 컴포넌트
// ============================================

interface ToggleSettingProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  label,
  description,
  value,
  onChange
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
  };

  const labelContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.text.primary,
  };

  const descStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.tertiary,
  };

  const toggleStyle: React.CSSProperties = {
    position: 'relative',
    width: '44px',
    height: '24px',
    backgroundColor: value ? colors.primary.main : colors.background.tertiary,
    borderRadius: borderRadius.full,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  };

  const toggleKnobStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: value ? '22px' : '2px',
    width: '20px',
    height: '20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '50%',
    transition: 'left 0.2s ease',
    boxShadow: shadows.sm,
  };

  return (
    <div style={containerStyle}>
      <div style={labelContainerStyle}>
        <span style={labelStyle}>{label}</span>
        {description && <span style={descStyle}>{description}</span>}
      </div>

      <div style={toggleStyle} onClick={() => onChange(!value)}>
        <div style={toggleKnobStyle} />
      </div>
    </div>
  );
};

// ============================================
// 선택 설정 컴포넌트
// ============================================

interface SelectSettingProps {
  label: string;
  description?: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const SelectSetting: React.FC<SelectSettingProps> = ({
  label,
  description,
  value,
  options,
  onChange
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    gap: '16px',
  };

  const labelContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    flex: 1,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: colors.text.primary,
  };

  const descStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    color: colors.text.tertiary,
  };

  const selectStyle: React.CSSProperties = {
    padding: '8px 12px',
    backgroundColor: colors.background.tertiary,
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.sm,
    color: colors.text.primary,
    fontSize: '0.875rem',
    cursor: 'pointer',
    minWidth: '140px',
  };

  return (
    <div style={containerStyle}>
      <div style={labelContainerStyle}>
        <span style={labelStyle}>{label}</span>
        {description && <span style={descStyle}>{description}</span>}
      </div>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// ============================================
// 메인 오디오 설정 패널
// ============================================

export interface AudioSettingsPanelProps {
  onClose?: () => void;
}

export const AudioSettingsPanel: React.FC<AudioSettingsPanelProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<AudioSettings>(defaultAudioSettings);

  useEffect(() => {
    setSettings(audioManager.getSettings());
  }, []);

  const handleVolumeChange = useCallback((category: string, volume: number) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...(prev as any)[category], volume }
    }));
    audioManager.setVolume(category as any, volume);
    audioManager.saveSettings();
  }, []);

  const handleMuteToggle = useCallback((category: string) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [category]: { ...(prev as any)[category], muted: !(prev as any)[category].muted }
      };
      return newSettings;
    });
    audioManager.toggleMute(category);
    audioManager.saveSettings();
  }, []);

  const handleBehaviorChange = useCallback(<K extends keyof AudioSettings['behavior']>(
    key: K,
    value: AudioSettings['behavior'][K]
  ) => {
    setSettings(prev => ({
      ...prev,
      behavior: { ...prev.behavior, [key]: value }
    }));
    audioManager.saveSettings();
  }, []);

  const handleReset = useCallback(() => {
    audioManager.resetSettings();
    setSettings(audioManager.getSettings());
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '24px',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    maxWidth: '480px',
    width: '100%',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const closeButtonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: borderRadius.sm,
    cursor: 'pointer',
    color: colors.text.tertiary,
    fontSize: '1.25rem',
  };

  const sectionStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '4px',
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: `1px solid ${colors.border.default}`,
  };

  const resetButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.md,
    color: colors.text.secondary,
    fontSize: '0.875rem',
    cursor: 'pointer',
  };

  const testButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: colors.primary.main,
    border: 'none',
    borderRadius: borderRadius.md,
    color: '#FFFFFF',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          <span>🔊</span> 오디오 설정
        </h2>
        {onClose && (
          <button type="button" onClick={onClose} style={closeButtonStyle}>
            ✕
          </button>
        )}
      </div>

      {/* 볼륨 설정 */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>볼륨</div>
        <VolumeSlider
          label="마스터"
          icon="🔊"
          value={settings.master.volume}
          muted={settings.master.muted}
          onChange={(v) => handleVolumeChange('master', v)}
          onMuteToggle={() => handleMuteToggle('master')}
        />
        <VolumeSlider
          label="음악"
          icon="🎵"
          value={settings.music.volume}
          muted={settings.music.muted}
          onChange={(v) => handleVolumeChange('music', v)}
          onMuteToggle={() => handleMuteToggle('music')}
        />
        <VolumeSlider
          label="효과음"
          icon="🔔"
          value={settings.sfx.volume}
          muted={settings.sfx.muted}
          onChange={(v) => handleVolumeChange('sfx', v)}
          onMuteToggle={() => handleMuteToggle('sfx')}
          testButton={true}
          onTest={() => audioManager.playTestSound('sfx')}
        />
        <VolumeSlider
          label="환경음"
          icon="🌙"
          value={settings.ambience.volume}
          muted={settings.ambience.muted}
          onChange={(v) => handleVolumeChange('ambience', v)}
          onMuteToggle={() => handleMuteToggle('ambience')}
        />
        <VolumeSlider
          label="UI 사운드"
          icon="🖱️"
          value={settings.ui.volume}
          muted={settings.ui.muted}
          onChange={(v) => handleVolumeChange('ui', v)}
          onMuteToggle={() => handleMuteToggle('ui')}
        />
      </div>

      {/* 동작 설정 */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>동작 설정</div>
        <ToggleSetting
          label="창 비활성화 시 음소거"
          description="다른 창으로 전환하면 자동으로 음소거됩니다"
          value={settings.behavior.muteOnFocusLoss}
          onChange={(v) => handleBehaviorChange('muteOnFocusLoss', v)}
        />
        <SelectSetting
          label="다이나믹 레인지"
          description="큰 소리와 작은 소리의 차이"
          value={settings.behavior.dynamicRange}
          options={[
            { value: 'full', label: '전체 (기본)' },
            { value: 'reduced', label: '압축' },
            { value: 'night', label: '야간 모드' }
          ]}
          onChange={(v) => handleBehaviorChange('dynamicRange', v as any)}
        />
        <ToggleSetting
          label="공간 오디오"
          description="좌우 스테레오 효과를 적용합니다"
          value={settings.behavior.spatialAudio}
          onChange={(v) => handleBehaviorChange('spatialAudio', v)}
        />
      </div>

      {/* 하단 버튼 */}
      <div style={footerStyle}>
        <button type="button" onClick={handleReset} style={resetButtonStyle}>
          초기화
        </button>
        <button
          type="button"
          onClick={() => audioManager.playTestSequence()}
          style={testButtonStyle}
        >
          <span>🎵</span> 사운드 테스트
        </button>
      </div>
    </div>
  );
};

export default AudioSettingsPanel;
