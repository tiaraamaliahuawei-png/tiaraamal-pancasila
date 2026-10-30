import React, { useState } from 'react';
import { QuizQuestion } from '../types/comic';
import { gamelanSynth } from '../audio/gamelanSynth';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, AlertCircle, Sparkles, RotateCcw } from 'lucide-react';

interface InteractiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
}

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  isOpen,
  onClose,
  questions,
}) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen || !questions || questions.length === 0) return null;

  const currentQ = questions[currentQIndex];

  const handleSelectOption = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    gamelanSynth.playChime(660);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    const isCorrect = currentQ.options[selectedOption].isCorrect;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      gamelanSynth.playCorrectFanfare();
    } else {
      gamelanSynth.playWrongChime();
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setIsCompleted(true);
      // Trigger festive celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#d97706', '#b45309', '#10b981'],
      });
      gamelanSynth.playCorrectFanfare();
    }
  };

  const handleReset = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsSubmitted(false);
    setIsCompleted(false);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-stone-900 border border-amber-600/40 rounded-2xl p-5 shadow-2xl relative text-stone-100 animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup Kuis"
          className="absolute top-4 right-4 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"
        >
          <X className="w-4 h-4" />
        </button>

        {!isCompleted ? (
          <div>
            {/* Header Badge */}
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-bold text-amber-400 tracking-wide uppercase font-serif">
                  Kuis Seni Rupa · Pertanyaan {currentQIndex + 1} dari {questions.length}
                </span>
                <div className="w-32 bg-stone-800 h-1 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300"
                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-base font-bold text-stone-100 mt-3 mb-4 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="flex flex-col gap-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let optionStyle =
                  'bg-stone-800/80 border-stone-700 text-stone-200 hover:border-amber-500/50 hover:bg-stone-800';

                if (isSubmitted) {
                  if (opt.isCorrect) {
                    optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                  } else if (isSelected && !opt.isCorrect) {
                    optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-amber-950/50 border-amber-500 text-amber-200 shadow-sm';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm font-medium flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{opt.label}</span>
                    {isSubmitted && opt.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 ml-2" />
                    )}
                    {isSubmitted && isSelected && !opt.isCorrect && (
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submit */}
            {isSubmitted && selectedOption !== null && (
              <div className="mt-3 p-3 rounded-xl bg-stone-800/80 border border-stone-700 text-xs leading-relaxed animate-in fade-in">
                <span className="font-bold text-amber-300 block mb-1">
                  {currentQ.options[selectedOption].isCorrect ? 'Hebat! Jawabanmu Benar' : 'Penjelasan:'}
                </span>
                <p className="text-stone-300">
                  {currentQ.options[selectedOption].explanation}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-end gap-2">
              {!isSubmitted ? (
                <button
                  onClick={handleCheckAnswer}
                  disabled={selectedOption === null}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:pointer-events-none text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Periksa Jawaban
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {currentQIndex < questions.length - 1 ? 'Pertanyaan Selanjutnya →' : 'Lihat Hasil Akhir'}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-100 font-serif">
              Selamat! Kamu Teliti Banget!
            </h3>
            <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
              Kamu berhasil menjawab {score} dari {questions.length} pertanyaan dengan sangat baik. Matamu jeli mengamati seni tradisi!
            </p>

            <div className="my-5 p-3 rounded-xl bg-stone-800/80 border border-stone-700 inline-block">
              <span className="text-xs text-stone-400 block">Skor Akhir</span>
              <span className="text-3xl font-extrabold text-amber-400 font-serif">
                {Math.round((score / questions.length) * 100)} / 100
              </span>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba Lagi</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
              >
                Lanjut Membaca
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
