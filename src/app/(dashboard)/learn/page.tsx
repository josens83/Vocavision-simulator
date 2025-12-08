'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Volume2,
  RefreshCw,
  Check,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Brain,
} from 'lucide-react';

// Sample words data
const sampleWords = [
  {
    id: '1',
    english: 'Ephemeral',
    korean: '일시적인, 덧없는',
    pronunciation: '/ɪˈfem.ər.əl/',
    example: 'Fame in the modern world is often ephemeral.',
    exampleKorean: '현대 사회에서 명성은 종종 일시적이다.',
    mnemonic: '에페메랄 → "에페(에펠)탑을 보는 순간"은 덧없이 지나간다',
  },
  {
    id: '2',
    english: 'Ubiquitous',
    korean: '어디에나 있는',
    pronunciation: '/juːˈbɪk.wɪ.təs/',
    example: 'Smartphones have become ubiquitous in modern society.',
    exampleKorean: '스마트폰은 현대 사회에서 어디에나 있게 되었다.',
    mnemonic: '유비쿼터스 → "유비(유비쿼터스)가 어디에나" 있다',
  },
  {
    id: '3',
    english: 'Serendipity',
    korean: '뜻밖의 행운',
    pronunciation: '/ˌser.ənˈdɪp.ə.ti/',
    example: 'Finding that rare book was pure serendipity.',
    exampleKorean: '그 희귀한 책을 발견한 것은 순전히 뜻밖의 행운이었다.',
    mnemonic: '세렌디피티 → "세런(서른)에 디피(DP)티를 받는 행운"',
  },
  {
    id: '4',
    english: 'Eloquent',
    korean: '웅변의, 유창한',
    pronunciation: '/ˈel.ə.kwənt/',
    example: 'She gave an eloquent speech about climate change.',
    exampleKorean: '그녀는 기후 변화에 대해 유창한 연설을 했다.',
    mnemonic: '엘로퀀트 → "엘리(엘로)도 웅변(퀀트)에 능하다"',
  },
  {
    id: '5',
    english: 'Meticulous',
    korean: '꼼꼼한, 세심한',
    pronunciation: '/məˈtɪk.jə.ləs/',
    example: 'The artist was meticulous in her attention to detail.',
    exampleKorean: '그 예술가는 세부 사항에 대해 매우 꼼꼼했다.',
    mnemonic: '메티큘러스 → "메(매)일 티끌(티큘)러스를 세심히 청소"',
  },
];

export default function LearnPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [unknownWords, setUnknownWords] = useState<Set<string>>(new Set());

  const currentWord = sampleWords[currentIndex];
  const progress = ((currentIndex + 1) / sampleWords.length) * 100;

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    if (currentIndex < sampleWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      setShowMnemonic(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
      setShowMnemonic(false);
    }
  };

  const handleKnown = () => {
    setKnownWords(new Set([...knownWords, currentWord.id]));
    handleNext();
  };

  const handleUnknown = () => {
    setUnknownWords(new Set([...unknownWords, currentWord.id]));
    handleNext();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="text-center">
              <div className="text-sm text-gray-400">단어 학습</div>
              <div className="text-lg font-bold">{currentIndex + 1} / {sampleWords.length}</div>
            </div>
            <div className="w-10" />
          </div>
          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Flashcard */}
        <div
          className="relative h-[400px] sm:h-[450px] perspective-1000 mb-6 cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-violet-600/30 to-purple-600/30 border border-violet-500/30 p-6 flex flex-col items-center justify-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black mb-4">{currentWord.english}</div>
                <div className="text-gray-400 mb-6">{currentWord.pronunciation}</div>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    speak(currentWord.english);
                  }}
                  className="text-violet-400 hover:text-violet-300"
                >
                  <Volume2 className="w-6 h-6 mr-2" />
                  발음 듣기
                </Button>
              </div>
              <div className="absolute bottom-6 text-sm text-gray-500">
                탭하여 뜻 보기
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 backface-hidden rounded-3xl bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/30 p-6 flex flex-col"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-2">{currentWord.korean}</div>
                <div className="text-xl text-gray-300 mb-4">{currentWord.english}</div>

                <div className="bg-white/5 rounded-xl p-4 mb-4 w-full">
                  <p className="text-gray-300 mb-2 italic">"{currentWord.example}"</p>
                  <p className="text-gray-500 text-sm">{currentWord.exampleKorean}</p>
                </div>

                {showMnemonic ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 w-full">
                    <div className="flex items-center gap-2 text-amber-400 mb-2">
                      <Brain className="w-5 h-5" />
                      <span className="font-semibold">AI 연상법</span>
                    </div>
                    <p className="text-gray-300">{currentWord.mnemonic}</p>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMnemonic(true);
                    }}
                    className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI 연상법 보기
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-gray-400"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            이전
          </Button>

          <Button
            variant="ghost"
            onClick={() => setIsFlipped(!isFlipped)}
            className="text-gray-400"
          >
            <RefreshCw className="w-5 h-5 mr-1" />
            뒤집기
          </Button>

          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={currentIndex === sampleWords.length - 1}
            className="text-gray-400"
          >
            다음
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>

        {/* Answer Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleUnknown}
            className="h-16 border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <X className="w-6 h-6 mr-2" />
            모르겠어요
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleKnown}
            className="h-16 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
          >
            <Check className="w-6 h-6 mr-2" />
            알고 있어요
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-around text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-400">{knownWords.size}</div>
              <div className="text-sm text-gray-500">알고 있는 단어</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-red-400">{unknownWords.size}</div>
              <div className="text-sm text-gray-500">복습 필요</div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <div className="text-2xl font-bold text-gray-400">
                {sampleWords.length - knownWords.size - unknownWords.size}
              </div>
              <div className="text-sm text-gray-500">남은 단어</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
