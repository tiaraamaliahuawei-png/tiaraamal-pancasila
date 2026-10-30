import React, { useEffect, useRef } from 'react';
import { ComicPageData, DialogueItem } from '../types/comic';
import { ComicPageView } from './ComicPageView';

interface ContinuousScrollViewProps {
  pages: ComicPageData[];
  currentPageIndex: number;
  onPageChange: (index: number) => void;
  activeDialogueId?: string;
  onSelectDialogue: (dialogue: DialogueItem) => void;
  onOpenZoom?: (imageSrc: string) => void;
  onOpenQuiz?: () => void;
}

export const ContinuousScrollView: React.FC<ContinuousScrollViewProps> = ({
  pages,
  currentPageIndex,
  onPageChange,
  activeDialogueId,
  onSelectDialogue,
  onOpenZoom,
  onOpenQuiz,
}) => {
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageIdx = Number(entry.target.getAttribute('data-page-index'));
            if (!isNaN(pageIdx) && pageIdx !== currentPageIndex) {
              onPageChange(pageIdx);
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.55, // Trigger when 55% of the page is in view
      }
    );

    pageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [pages, currentPageIndex, onPageChange]);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 px-2 py-4 pb-28">
      {pages.map((page, index) => (
        <div
          key={page.id}
          ref={(el) => { pageRefs.current[index] = el; }}
          data-page-index={index}
          className="relative flex flex-col items-center"
        >
          {/* Page Badge */}
          <div className="w-full max-w-[480px] flex items-center justify-between text-xs text-stone-400 mb-2 px-1">
            <span className="font-semibold text-amber-400 font-serif">
              Halaman {page.pageNumber} dari {pages.length}
            </span>
            <span className="text-[11px] text-stone-400 truncate max-w-[200px]">
              {page.title}
            </span>
          </div>

          <ComicPageView
            page={page}
            activeDialogueId={activeDialogueId}
            onSelectDialogue={onSelectDialogue}
            onOpenZoom={onOpenZoom}
            onOpenQuiz={onOpenQuiz}
          />

          {/* Divider line between comic pages */}
          {index < pages.length - 1 && (
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-700/40 to-transparent my-4" />
          )}
        </div>
      ))}
    </div>
  );
};
