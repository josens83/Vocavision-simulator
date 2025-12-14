'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Volume2,
  VolumeX,
  Monitor,
  Gamepad2,
  Accessibility,
  Globe,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings, useTranslation } from '@/game/store/systemIntegration';

type SettingsTab = 'audio' | 'display' | 'gameplay' | 'accessibility' | 'locale';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Slider Component
function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500 disabled:opacity-50"
      />
      <span className="text-sm text-gray-400 w-12 text-right">{value}%</span>
    </div>
  );
}

// Toggle Component
function Toggle({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-violet-600' : 'bg-gray-600'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// Select Component
function Select({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-violet-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

// Settings Row Component
function SettingsRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-700/50">
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-xs text-gray-400 mt-1">{description}</div>}
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { getSettings, updateSettings, resetSettings } = useSettings();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('audio');
  const [settings, setSettings] = useState(getSettings());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getSettings());
      setHasChanges(false);
    }
  }, [isOpen]);

  const handleUpdate = (category: string, key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Apply all changes
    Object.keys(settings).forEach((category) => {
      updateSettings(category, settings[category]);
    });
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    resetSettings();
    setSettings(getSettings());
    setHasChanges(true);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'audio', label: '오디오', icon: <Volume2 className="w-4 h-4" /> },
    { id: 'display', label: '화면', icon: <Monitor className="w-4 h-4" /> },
    { id: 'gameplay', label: '게임플레이', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'accessibility', label: '접근성', icon: <Accessibility className="w-4 h-4" /> },
    { id: 'locale', label: '언어', icon: <Globe className="w-4 h-4" /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-violet-400" />
            설정
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-40 bg-gray-800/50 border-r border-gray-700 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-violet-600/30 text-violet-300'
                    : 'hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Audio Settings */}
            {activeTab === 'audio' && (
              <div className="space-y-1">
                <h3 className="text-lg font-semibold mb-4">오디오 설정</h3>

                <SettingsRow label="마스터 볼륨" description="전체 게임 볼륨">
                  <Slider
                    value={settings.audio?.masterVolume ?? 80}
                    onChange={(v) => handleUpdate('audio', 'masterVolume', v)}
                  />
                </SettingsRow>

                <SettingsRow label="음악 볼륨" description="배경 음악 볼륨">
                  <Slider
                    value={settings.audio?.musicVolume ?? 70}
                    onChange={(v) => handleUpdate('audio', 'musicVolume', v)}
                  />
                </SettingsRow>

                <SettingsRow label="효과음 볼륨" description="UI 및 효과음 볼륨">
                  <Slider
                    value={settings.audio?.sfxVolume ?? 80}
                    onChange={(v) => handleUpdate('audio', 'sfxVolume', v)}
                  />
                </SettingsRow>

                <SettingsRow label="음소거">
                  <Toggle
                    checked={settings.audio?.muted ?? false}
                    onChange={(v) => handleUpdate('audio', 'muted', v)}
                  />
                </SettingsRow>
              </div>
            )}

            {/* Display Settings */}
            {activeTab === 'display' && (
              <div className="space-y-1">
                <h3 className="text-lg font-semibold mb-4">화면 설정</h3>

                <SettingsRow label="테마" description="화면 테마 선택">
                  <Select
                    value={settings.display?.theme ?? 'dark'}
                    options={[
                      { value: 'dark', label: '다크' },
                      { value: 'light', label: '라이트' },
                      { value: 'auto', label: '시스템 설정' },
                    ]}
                    onChange={(v) => handleUpdate('display', 'theme', v)}
                  />
                </SettingsRow>

                <SettingsRow label="UI 크기" description="인터페이스 크기 조절">
                  <Select
                    value={settings.display?.uiScale?.toString() ?? '1'}
                    options={[
                      { value: '0.8', label: '작게' },
                      { value: '1', label: '보통' },
                      { value: '1.2', label: '크게' },
                      { value: '1.5', label: '매우 크게' },
                    ]}
                    onChange={(v) => handleUpdate('display', 'uiScale', parseFloat(v))}
                  />
                </SettingsRow>

                <SettingsRow label="애니메이션 효과">
                  <Toggle
                    checked={settings.display?.animations ?? true}
                    onChange={(v) => handleUpdate('display', 'animations', v)}
                  />
                </SettingsRow>

                <SettingsRow label="파티클 효과" description="시각 효과 표시">
                  <Toggle
                    checked={settings.display?.particles ?? true}
                    onChange={(v) => handleUpdate('display', 'particles', v)}
                  />
                </SettingsRow>

                <SettingsRow label="화면 흔들림">
                  <Toggle
                    checked={settings.display?.screenShake ?? true}
                    onChange={(v) => handleUpdate('display', 'screenShake', v)}
                  />
                </SettingsRow>
              </div>
            )}

            {/* Gameplay Settings */}
            {activeTab === 'gameplay' && (
              <div className="space-y-1">
                <h3 className="text-lg font-semibold mb-4">게임플레이 설정</h3>

                <SettingsRow label="난이도" description="게임 난이도">
                  <Select
                    value={settings.gameplay?.difficulty ?? 'normal'}
                    options={[
                      { value: 'easy', label: '쉬움' },
                      { value: 'normal', label: '보통' },
                      { value: 'hard', label: '어려움' },
                      { value: 'hardcore', label: '하드코어' },
                    ]}
                    onChange={(v) => handleUpdate('gameplay', 'difficulty', v)}
                  />
                </SettingsRow>

                <SettingsRow label="자동 저장">
                  <Toggle
                    checked={settings.gameplay?.autoSave ?? true}
                    onChange={(v) => handleUpdate('gameplay', 'autoSave', v)}
                  />
                </SettingsRow>

                <SettingsRow label="자동 저장 간격" description="분 단위">
                  <Select
                    value={settings.gameplay?.autoSaveInterval?.toString() ?? '5'}
                    options={[
                      { value: '1', label: '1분' },
                      { value: '5', label: '5분' },
                      { value: '10', label: '10분' },
                      { value: '15', label: '15분' },
                    ]}
                    onChange={(v) => handleUpdate('gameplay', 'autoSaveInterval', parseInt(v))}
                  />
                </SettingsRow>

                <SettingsRow label="확인 다이얼로그" description="중요 행동 전 확인">
                  <Toggle
                    checked={settings.gameplay?.confirmDialogs ?? true}
                    onChange={(v) => handleUpdate('gameplay', 'confirmDialogs', v)}
                  />
                </SettingsRow>

                <SettingsRow label="튜토리얼 표시">
                  <Toggle
                    checked={settings.gameplay?.showTutorials ?? true}
                    onChange={(v) => handleUpdate('gameplay', 'showTutorials', v)}
                  />
                </SettingsRow>

                <SettingsRow label="힌트 표시">
                  <Toggle
                    checked={settings.gameplay?.showHints ?? true}
                    onChange={(v) => handleUpdate('gameplay', 'showHints', v)}
                  />
                </SettingsRow>
              </div>
            )}

            {/* Accessibility Settings */}
            {activeTab === 'accessibility' && (
              <div className="space-y-1">
                <h3 className="text-lg font-semibold mb-4">접근성 설정</h3>

                <SettingsRow label="모션 감소" description="애니메이션 최소화">
                  <Toggle
                    checked={settings.accessibility?.reduceMotion ?? false}
                    onChange={(v) => handleUpdate('accessibility', 'reduceMotion', v)}
                  />
                </SettingsRow>

                <SettingsRow label="고대비 모드" description="시각적 대비 강화">
                  <Toggle
                    checked={settings.accessibility?.highContrast ?? false}
                    onChange={(v) => handleUpdate('accessibility', 'highContrast', v)}
                  />
                </SettingsRow>

                <SettingsRow label="색맹 모드">
                  <Select
                    value={settings.accessibility?.colorBlindMode ?? 'none'}
                    options={[
                      { value: 'none', label: '없음' },
                      { value: 'protanopia', label: '적색맹' },
                      { value: 'deuteranopia', label: '녹색맹' },
                      { value: 'tritanopia', label: '청색맹' },
                    ]}
                    onChange={(v) => handleUpdate('accessibility', 'colorBlindMode', v)}
                  />
                </SettingsRow>

                <SettingsRow label="큰 텍스트">
                  <Toggle
                    checked={settings.accessibility?.largeText ?? false}
                    onChange={(v) => handleUpdate('accessibility', 'largeText', v)}
                  />
                </SettingsRow>

                <SettingsRow label="화면 낭독기 지원">
                  <Toggle
                    checked={settings.accessibility?.screenReader ?? false}
                    onChange={(v) => handleUpdate('accessibility', 'screenReader', v)}
                  />
                </SettingsRow>

                <SettingsRow label="키보드 전용 모드">
                  <Toggle
                    checked={settings.accessibility?.keyboardOnly ?? false}
                    onChange={(v) => handleUpdate('accessibility', 'keyboardOnly', v)}
                  />
                </SettingsRow>
              </div>
            )}

            {/* Locale Settings */}
            {activeTab === 'locale' && (
              <div className="space-y-1">
                <h3 className="text-lg font-semibold mb-4">언어 설정</h3>

                <SettingsRow label="게임 언어">
                  <Select
                    value={settings.locale?.language ?? 'ko-KR'}
                    options={[
                      { value: 'ko-KR', label: '한국어' },
                      { value: 'en-US', label: 'English (US)' },
                      { value: 'ja-JP', label: '日本語' },
                      { value: 'zh-CN', label: '简体中文' },
                      { value: 'zh-TW', label: '繁體中文' },
                      { value: 'es-ES', label: 'Español' },
                      { value: 'de-DE', label: 'Deutsch' },
                      { value: 'fr-FR', label: 'Français' },
                      { value: 'pt-BR', label: 'Português' },
                      { value: 'ru-RU', label: 'Русский' },
                    ]}
                    onChange={(v) => handleUpdate('locale', 'language', v)}
                  />
                </SettingsRow>

                <SettingsRow label="지역" description="통화 및 숫자 형식">
                  <Select
                    value={settings.locale?.region ?? 'KR'}
                    options={[
                      { value: 'KR', label: '한국' },
                      { value: 'US', label: '미국' },
                      { value: 'JP', label: '일본' },
                      { value: 'CN', label: '중국' },
                      { value: 'EU', label: '유럽' },
                    ]}
                    onChange={(v) => handleUpdate('locale', 'region', v)}
                  />
                </SettingsRow>

                <SettingsRow label="날짜 형식">
                  <Select
                    value={settings.locale?.dateFormat ?? 'YYYY-MM-DD'}
                    options={[
                      { value: 'YYYY-MM-DD', label: '2024-01-15' },
                      { value: 'DD/MM/YYYY', label: '15/01/2024' },
                      { value: 'MM/DD/YYYY', label: '01/15/2024' },
                    ]}
                    onChange={(v) => handleUpdate('locale', 'dateFormat', v)}
                  />
                </SettingsRow>

                <SettingsRow label="24시간제">
                  <Toggle
                    checked={settings.locale?.use24Hour ?? true}
                    onChange={(v) => handleUpdate('locale', 'use24Hour', v)}
                  />
                </SettingsRow>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            초기화
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              variant="gradient"
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
