'use client';

import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, X, Clock, Calendar, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSaveLoad } from '@/game/store/systemIntegration';

interface SaveSlotData {
  slot: number;
  name: string;
  day: number;
  cash: number;
  users: number;
  date: Date;
  exists: boolean;
}

interface SaveLoadModalProps {
  mode: 'save' | 'load';
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('ko-KR').format(Math.round(amount)) + '원';

const formatDate = (date: Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export function SaveLoadModal({ mode, isOpen, onClose, onSuccess }: SaveLoadModalProps) {
  const { saveGame, loadGame, getSaveSlots, deleteSave } = useSaveLoad();
  const [slots, setSlots] = useState<SaveSlotData[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [saveName, setSaveName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSlots();
    }
  }, [isOpen]);

  const loadSlots = async () => {
    try {
      const savedSlots = await getSaveSlots();
      const slotData: SaveSlotData[] = [];

      for (let i = 1; i <= 10; i++) {
        const existing = savedSlots.find((s: any) => s.slot === i);
        if (existing) {
          slotData.push({
            slot: i,
            name: existing.name || `슬롯 ${i}`,
            day: existing.day || 1,
            cash: existing.cash || 0,
            users: existing.users || 0,
            date: new Date(existing.date),
            exists: true,
          });
        } else {
          slotData.push({
            slot: i,
            name: `슬롯 ${i}`,
            day: 0,
            cash: 0,
            users: 0,
            date: new Date(),
            exists: false,
          });
        }
      }

      setSlots(slotData);
    } catch (error) {
      console.error('Failed to load save slots:', error);
    }
  };

  const handleSave = async () => {
    if (selectedSlot === null) return;

    setIsLoading(true);
    try {
      const result = await saveGame(selectedSlot, saveName || `저장 ${selectedSlot}`);
      if (result.success) {
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async () => {
    if (selectedSlot === null) return;

    const slot = slots.find(s => s.slot === selectedSlot);
    if (!slot?.exists) return;

    setIsLoading(true);
    try {
      const result = await loadGame(selectedSlot);
      if (result.success) {
        onSuccess?.();
        onClose();
        // 페이지 새로고침으로 상태 반영
        window.location.reload();
      }
    } catch (error) {
      console.error('Load failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slot: number) => {
    setIsLoading(true);
    try {
      await deleteSave(slot);
      await loadSlots();
      setConfirmDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {mode === 'save' ? (
              <>
                <Save className="w-5 h-5 text-emerald-400" />
                게임 저장
              </>
            ) : (
              <>
                <FolderOpen className="w-5 h-5 text-blue-400" />
                게임 불러오기
              </>
            )}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Save Name Input (save mode only) */}
        {mode === 'save' && selectedSlot !== null && (
          <div className="mb-4">
            <input
              type="text"
              placeholder="저장 이름 (선택사항)"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
            />
          </div>
        )}

        {/* Slot List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {slots.map((slot) => (
            <div key={slot.slot} className="relative">
              <button
                onClick={() => setSelectedSlot(slot.slot)}
                disabled={mode === 'load' && !slot.exists}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedSlot === slot.slot
                    ? 'bg-violet-600/30 border-2 border-violet-500'
                    : slot.exists
                    ? 'bg-gray-700/50 hover:bg-gray-700 border-2 border-transparent'
                    : 'bg-gray-800/30 border-2 border-dashed border-gray-600 opacity-50'
                } ${mode === 'load' && !slot.exists ? 'cursor-not-allowed' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-bold text-sm mb-1">
                      {slot.exists ? slot.name : `빈 슬롯 ${slot.slot}`}
                    </div>
                    {slot.exists ? (
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Day {slot.day}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {formatMoney(slot.cash)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {slot.users}명
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(slot.date)}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">저장 데이터 없음</div>
                    )}
                  </div>

                  {/* Delete Button */}
                  {slot.exists && mode === 'save' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDelete(slot.slot);
                      }}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </button>

              {/* Delete Confirmation */}
              {confirmDelete === slot.slot && (
                <div className="absolute inset-0 bg-red-900/90 rounded-xl flex items-center justify-center gap-2 p-4">
                  <span className="text-sm">삭제할까요?</span>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(slot.slot)}
                    disabled={isLoading}
                  >
                    삭제
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmDelete(null)}
                  >
                    취소
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="gradient"
            className="flex-1"
            onClick={mode === 'save' ? handleSave : handleLoad}
            disabled={
              selectedSlot === null ||
              isLoading ||
              (mode === 'load' && !slots.find(s => s.slot === selectedSlot)?.exists)
            }
          >
            {isLoading ? '처리 중...' : mode === 'save' ? '저장' : '불러오기'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SaveLoadModal;
