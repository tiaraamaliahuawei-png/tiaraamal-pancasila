import React from 'react';
import { BookOpen, ScrollText, Volume2, VolumeX, Sparkles, SlidersHorizontal, BookCheck } from 'lucide-react';
import { ReadingMode } from '../types/comic';

interface HeaderProps {
  currentPage: number;
  totalPages: number;
  readingMode: ReadingMode;
  onToggleReadingMode: (mode: ReadingMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onOpenSummary: () => void;
  onOpenQuiz?: () => void;
  currentMoodDescription?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  totalPages,
  readingMode,
  onToggleReadingMode,
  isMuted,
  onToggleMute,
  onOpenSettings,
  onOpenSummary,
  onOpenQuiz,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-stone-900/90 backdrop-blur-md border-b border-stone-800/80 px-3 sm:px-6 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md shadow-amber-900/30 shrink-0">
            <span className="text-sm font-bold text-amber-100 font-serif">WK</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-stone-100 truncate tracking-tight font-serif">
              Wayang &amp; Ragam Hias
            </h1>
            <p className="text-[11px] text-stone-400 truncate hidden xs:block">
              SDIT Al Madani Tapin · Kelas 4
            </p>
          </div>
        </div>

        {/* Middle & Right Actions Zone */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quiz button indicator when on Page 9 */}
          {currentPage === 9 && onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              aria-label="Buka Kuis Interaktif"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors shadow-sm animate-pulse"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mulai Kuis</span>
              <span className="sm:hidden">Kuis</span>
            </button>
          )}

          {/* Reading Mode Segmented Control */}
          <div className="flex items-center bg-stone-800 p-0.5 rounded-lg border border-stone-700/60">
            <button
              onClick={() => onToggleReadingMode('flip')}
              title="Mode Flip 3D"
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                readingMode === 'flip'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleReadingMode('scroll')}
              title="Mode Gulir (Scroll)"
              className={`p-1.5 rounded-md text-xs font-medium transition-all ${
                readingMode === 'scroll'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <ScrollText className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Sound Mute Toggle */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Nyalakan Musik Gamelan' : 'Bisukan Musik'}
            className={`p-2 rounded-lg text-xs font-medium transition-colors border ${
              isMuted
                ? 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                : 'bg-amber-950/70 text-amber-300 border-amber-800/60 hover:bg-amber-900/60'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Rangkuman Materi */}
          <button
            onClick={onOpenSummary}
            title="Rangkuman Materi Seni Rupa"
            className="p-2 rounded-lg bg-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-700/80 transition-colors border border-stone-700/60"
          >
            <BookCheck className="w-4 h-4" />
          </button>

          {/* Audio & Narrator Settings */}
          <button
            onClick={onOpenSettings}
            title="Pengaturan Suara &amp; Narator"
            className="p-2 rounded-lg bg-stone-800 text-stone-300 hover:text-stone-100 hover:bg-stone-700/80 transition-colors border border-stone-700/60"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Thin Progress bar at top edge */}
      <div className="w-full bg-stone-800/80 h-1 mt-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-300 ease-out"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>
    </header>
  );
};
