'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Check,
  X,
  Timer,
  Trophy,
  RotateCcw,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface Question {
  id: string;
  english: string;
  korean: string;
  options: string[];
  correctIndex: number;
}

const sampleQuestions: Question[] = [
  {
    id: '1',
    english: 'Ephemeral',
    korean: '일시적인',
    options: ['영원한', '일시적인', '거대한', '미세한'],
    correctIndex: 1,
  },
  {
    id: '2',
    english: 'Ubiquitous',
    korean: '어디에나 있는',
    options: ['희귀한', '독특한', '어디에나 있는', '숨겨진'],
    correctIndex: 2,
  },
  {
    id: '3',
    english: 'Serendipity',
    korean: '뜻밖의 행운',
    options: ['불행', '뜻밖의 행운', '계획된 성공', '실패'],
    correctIndex: 1,
  },
  {
    id: '4',
    english: 'Eloquent',
    korean: '유창한',
    options: ['조용한', '시끄러운', '유창한', '더듬는'],
    correctIndex: 2,
  },
  {
    id: '5',
    english: 'Meticulous',
    korean: '꼼꼼한',
    options: ['대충하는', '꼼꼼한', '게으른', '성급한'],
    correctIndex: 1,
  },
  {
    id: '6',
    english: 'Leverage',
    korean: '활용하다',
    options: ['무시하다', '활용하다', '파괴하다', '숨기다'],
    correctIndex: 1,
  },
  {
    id: '7',
    english: 'Hypothesis',
    korean: '가설',
    options: ['결론', '가설', '증거', '사실'],
    correctIndex: 1,
  },
  {
    id: '8',
    english: 'Paradigm',
    korean: '패러다임',
    options: ['패러다임', '예외', '실수', '무작위'],
    correctIndex: 0,
  },
  {
    id: '9',
    english: 'Negotiate',
    korean: '협상하다',
    options: ['거부하다', '무시하다', '협상하다', '포기하다'],
    correctIndex: 2,
  },
  {
    id: '10',
    english: 'Implement',
    korean: '구현하다',
    options: ['구현하다', '제거하다', '지연하다', '취소하다'],
    correctIndex: 0,
  },
];

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const currentQuestion = sampleQuestions[currentIndex];
  const progress = ((currentIndex + 1) / sampleQuestions.length) * 100;

  useEffect(() => {
    if (isAnswered || isQuizComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIndex, isAnswered, isQuizComplete]);

  const handleTimeout = () => {
    setIsAnswered(true);
    setAnswers([...answers, false]);
    setTimeout(() => handleNext(), 1500);
  };

  const handleAnswer = (index: number) => {
    if (isAnswered) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;
    if (isCorrect) {
      setScore(score + 10);
    }
    setAnswers([...answers, isCorrect]);
  };

  const handleNext = () => {
    if (currentIndex < sampleQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(15);
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setTimeLeft(15);
    setIsQuizComplete(false);
    setAnswers([]);
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) {
      return selectedAnswer === index
        ? 'border-violet-500 bg-violet-500/20'
        : 'border-white/10 hover:border-white/30 hover:bg-white/5';
    }

    if (index === currentQuestion.correctIndex) {
      return 'border-emerald-500 bg-emerald-500/20';
    }

    if (selectedAnswer === index && index !== currentQuestion.correctIndex) {
      return 'border-red-500 bg-red-500/20';
    }

    return 'border-white/10 opacity-50';
  };

  if (isQuizComplete) {
    const percentage = Math.round((score / (sampleQuestions.length * 10)) * 100);
    const correctCount = answers.filter(Boolean).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold mb-2">퀴즈 완료!</h1>
            <p className="text-gray-400">수고하셨습니다!</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6">
            <div className="text-center mb-6">
              <div className="text-6xl font-black bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                {percentage}%
              </div>
              <div className="text-gray-400 mt-1">정확도</div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">{correctCount}</div>
                <div className="text-sm text-gray-500">정답</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {sampleQuestions.length - correctCount}
                </div>
                <div className="text-sm text-gray-500">오답</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{score}</div>
                <div className="text-sm text-gray-500">점수</div>
              </div>
            </div>

            {/* Answer Review */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-sm text-gray-400 mb-3">문제별 결과</div>
              <div className="flex flex-wrap gap-2">
                {answers.map((correct, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                대시보드
              </Button>
            </Link>
            <Button onClick={handleRestart} variant="gradient" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              다시 풀기
            </Button>
          </div>

          {/* XP Earned */}
          <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-semibold">+{score} XP 획득!</span>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="text-sm text-gray-400">퀴즈</div>
              <div className="text-lg font-bold">{currentIndex + 1} / {sampleQuestions.length}</div>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">{score}</span>
            </div>
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
        {/* Timer */}
        <div className="flex justify-center mb-8">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${
              timeLeft <= 5 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-300'
            }`}
          >
            <Timer className="w-5 h-5" />
            <span className="font-bold text-xl">{timeLeft}초</span>
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <div className="text-sm text-gray-400 mb-2">다음 단어의 뜻은?</div>
          <div className="text-4xl sm:text-5xl font-black mb-2">{currentQuestion.english}</div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${getOptionStyle(
                index
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
                {isAnswered && index === currentQuestion.correctIndex && (
                  <Check className="w-6 h-6 text-emerald-400" />
                )}
                {isAnswered &&
                  selectedAnswer === index &&
                  index !== currentQuestion.correctIndex && (
                    <X className="w-6 h-6 text-red-400" />
                  )}
              </div>
            </button>
          ))}
        </div>

        {/* Next Button */}
        {isAnswered && (
          <Button onClick={handleNext} variant="gradient" className="w-full" size="lg">
            {currentIndex < sampleQuestions.length - 1 ? (
              <>
                다음 문제
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                결과 보기
                <Trophy className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        )}

        {/* Answer Feedback */}
        {isAnswered && (
          <div
            className={`mt-6 p-4 rounded-xl ${
              selectedAnswer === currentQuestion.correctIndex
                ? 'bg-emerald-500/10 border border-emerald-500/30'
                : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === currentQuestion.correctIndex ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span className="font-semibold text-emerald-400">정답입니다!</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-400" />
                  <span className="font-semibold text-red-400">틀렸습니다</span>
                </>
              )}
            </div>
            <p className="text-gray-300 text-sm">
              <strong>{currentQuestion.english}</strong>의 뜻은 <strong>"{currentQuestion.korean}"</strong>입니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
