import React from 'react';
import { Sparkles, Volume2, Mic, BookOpen, ChevronRight } from 'lucide-react';

interface FirstTapWelcomeModalProps {
  isOpen: boolean;
  onStartWithSound: () => void;
  onStartSilent: () => void;
}

export const FirstTapWelcomeModal: React.FC<FirstTapWelcomeModalProps> = ({
  isOpen,
  onStartWithSound,
  onStartSilent,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-stone-900 border border-amber-600/40 rounded-3xl p-6 text-center text-stone-100 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-250">
        {/* Decorative corner cultural motifs */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/15 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-600/15 to-transparent rounded-tr-full pointer-events-none" />

        {/* Hero Wayang Icon Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 mx-auto flex items-center justify-center shadow-lg shadow-amber-900/40 mb-3 border border-amber-300/40">
          <BookOpen className="w-8 h-8 text-stone-950" />
        </div>

        {/* Title */}
        <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase font-serif">
          SDIT Al Madani Tapin · Seni Rupa
        </span>
        <h2 className="text-xl font-bold text-stone-100 mt-1 mb-2 font-serif">
          Wayang Kok Penuh Hiasan?
        </h2>
        <p className="text-xs text-stone-300 leading-relaxed mb-5">
          Komik flip book interaktif untuk belajar ragam hias nusantara dengan narator suara dan alunan musik gamelan otomatis!
        </p>

        {/* Feature Highlights */}
        <div className="space-y-2 text-left mb-6">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-stone-200">
              Backsound gamelan dinamis berganti di setiap babak
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <Mic className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-stone-200">
              Narator suara otomatis membaca dialog karakter
            </span>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-800/80 border border-stone-700/60">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-stone-200">
              Kuis &amp; titik interaktif mengenal ornamen wayang
            </span>
          </div>
        </div>

        {/* Primary Start Action */}
        <button
          onClick={onStartWithSound}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/30 transition-transform active:scale-[0.98] mb-2"
        >
          <span>Mulai Membaca Bersuara</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Silent alternative */}
        <button
          onClick={onStartSilent}
          className="text-xs text-stone-400 hover:text-stone-200 transition-colors py-1"
        >
          Membaca Hening Tanpa Suara
        </button>
      </div>
    </div>
  );
};
