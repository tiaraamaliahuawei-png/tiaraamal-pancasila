import React, { useState, useRef } from 'react';
import { ComicPageData, DialogueItem } from '../types/comic';
import { ComicPageView } from './ComicPageView';
import { gamelanSynth } from '../audio/gamelanSynth';
import { ChevronLeft, ChevronRight, CornerDownRight } from 'lucide-react';

interface FlipBookProps {
  pages: ComicPageData[];
  currentPageIndex: number;
  onPageChange: (newIndex: number) => void;
  activeDialogueId?: string;
  onSelectDialogue: (dialogue: DialogueItem) => void;
  onOpenZoom?: (imageSrc: string) => void;
  onOpenQuiz?: () => void;
}

export const FlipBook: React.FC<FlipBookProps> = ({
  pages,
  currentPageIndex,
  onPageChange,
  activeDialogueId,
  onSelectDialogue,
  onOpenZoom,
  onOpenQuiz,
}) => {
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);

  // Touch gesture handling
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentPage = pages[currentPageIndex];
  const totalPages = pages.length;

  const handleNext = () => {
    if (currentPageIndex >= totalPages - 1 || isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('next');
    gamelanSynth.playPageFlip();

    setTimeout(() => {
      onPageChange(currentPageIndex + 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 450);
  };

  const handlePrev = () => {
    if (currentPageIndex <= 0 || isFlipping) return;
    setIsFlipping(true);
    setFlipDirection('prev');
    gamelanSynth.playPageFlip();

    setTimeout(() => {
      onPageChange(currentPageIndex - 1);
      setIsFlipping(false);
      setFlipDirection(null);
    }, 450);
  };

  // Touch Swipe Events
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Horizontal swipe threshold: 45px and predominantly horizontal
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      if (deltaX < 0) {
        // Swipe left -> Next Page
        handleNext();
      } else {
        // Swipe right -> Previous Page
        handlePrev();
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Edge tap navigation (tap left 15% or right 15%)
  const handleContainerClick = (e: React.MouseEvent) => {
    if (!containerRef.current || isFlipping) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX > width * 0.85) {
      handleNext();
    } else if (clickX < width * 0.15) {
      handlePrev();
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleContainerClick}
      className="relative w-full max-w-lg mx-auto flex flex-col items-center justify-center px-2 py-1 perspective-1500"
    >
      {/* 3D Flip Paper Stage */}
      <div
        className={`relative w-full flex items-center justify-center transition-transform duration-500 ease-in-out transform-style-3d ${
          isFlipping && flipDirection === 'next'
            ? '-rotate-y-12 scale-[0.98]'
            : isFlipping && flipDirection === 'prev'
            ? 'rotate-y-12 scale-[0.98]'
            : 'rotate-y-0 scale-100'
        }`}
      >
        {/* Book Spine Shadow Left Effect */}
        <div className="absolute -left-1 top-4 bottom-4 w-3 bg-gradient-to-r from-black/60 to-transparent rounded-l pointer-events-none z-20" />

        {/* Comic Page View */}
        <ComicPageView
          page={currentPage}
          activeDialogueId={activeDialogueId}
          onSelectDialogue={onSelectDialogue}
          onOpenZoom={onOpenZoom}
          onOpenQuiz={onOpenQuiz}
        />

        {/* Dynamic Page Flip Shadow Gradient during transition */}
        {isFlipping && (
          <div
            className={`absolute inset-0 z-30 pointer-events-none transition-opacity duration-300 ${
              flipDirection === 'next'
                ? 'bg-gradient-to-r from-transparent via-black/40 to-black/70'
                : 'bg-gradient-to-l from-transparent via-black/40 to-black/70'
            }`}
          />
        )}
      </div>

      {/* Floating Edge Navigation Chevron Buttons (Ergonomic Thumb Targets >= 48px) */}
      <div className="fixed inset-y-1/2 left-2 right-2 max-w-xl mx-auto flex items-center justify-between pointer-events-none z-20">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          disabled={currentPageIndex === 0}
          aria-label="Halaman Sebelumnya"
          className={`pointer-events-auto min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            currentPageIndex === 0
              ? 'opacity-0 pointer-events-none'
              : 'bg-stone-900/80 hover:bg-stone-800 text-stone-200 border-stone-700/80 shadow-lg active:scale-95'
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          disabled={currentPageIndex >= totalPages - 1}
          aria-label="Halaman Berikutnya"
          className={`pointer-events-auto min-w-[48px] min-h-[48px] rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
            currentPageIndex >= totalPages - 1
              ? 'opacity-0 pointer-events-none'
              : 'bg-stone-900/80 hover:bg-stone-800 text-stone-200 border-stone-700/80 shadow-lg active:scale-95'
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Interactive Corner Curl Hint */}
      {currentPageIndex < totalPages - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          title="Balik Halaman Berikutnya"
          className="mt-2 flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-300 py-1 px-3 rounded-full bg-stone-900/60 border border-stone-800 transition-colors"
        >
          <span>Geser layar atau ketuk untuk membalik</span>
          <CornerDownRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
