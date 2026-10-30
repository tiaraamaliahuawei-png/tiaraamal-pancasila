import React from 'react';
import { ComicPageData } from '../types/comic';
import { X, Music2 } from 'lucide-react';

interface ThumbnailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pages: ComicPageData[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
}

export const ThumbnailDrawer: React.FC<ThumbnailDrawerProps> = ({
  isOpen,
  onClose,
  pages,
  currentPageIndex,
  onSelectPage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col justify-end transition-opacity"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl mx-auto bg-stone-900 border-t border-stone-800 rounded-t-3xl max-h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-250 pb-safe"
      >
        {/* Grab Handle */}
        <div className="w-12 h-1.5 bg-stone-700 rounded-full mx-auto my-3" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-stone-800">
          <div>
            <h3 className="text-base font-bold text-stone-100 font-serif">
              Daftar Halaman Komik
            </h3>
            <p className="text-xs text-stone-400">
              Pilih halaman untuk melompat langsung
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Daftar Halaman"
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnails Grid List */}
        <div className="overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pages.map((page, index) => {
            const isCurrent = index === currentPageIndex;
            return (
              <button
                key={page.id}
                onClick={() => {
                  onSelectPage(index);
                  onClose();
                }}
                className={`flex flex-col text-left rounded-xl overflow-hidden border p-1.5 transition-all group ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                    : 'bg-stone-800/80 border-stone-700/80 hover:border-stone-500'
                }`}
              >
                {/* Thumbnail Image */}
                <div className="relative aspect-[9/14] w-full rounded-lg overflow-hidden bg-stone-950">
                  <img
                    src={page.image}
                    alt={page.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-stone-950/80 text-[10px] font-bold text-amber-300">
                    Hal. {page.pageNumber}
                  </div>
                </div>

                {/* Info Text */}
                <div className="mt-1.5 px-0.5">
                  <h4 className="text-[11px] font-bold text-stone-200 truncate">
                    {page.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5">
                    <Music2 className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="truncate">{page.mood}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
