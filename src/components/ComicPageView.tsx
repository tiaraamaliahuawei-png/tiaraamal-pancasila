import React, { useState } from 'react';
import { ComicPageData, DialogueItem, InteractiveHotspot } from '../types/comic';
import { gamelanSynth } from '../audio/gamelanSynth';
import { Volume2, Info, X, Lightbulb, Sparkles, ZoomIn } from 'lucide-react';

interface ComicPageViewProps {
  page: ComicPageData;
  activeDialogueId?: string;
  onSelectDialogue: (dialogue: DialogueItem) => void;
  onOpenZoom?: (imageSrc: string) => void;
  onOpenQuiz?: () => void;
}

export const ComicPageView: React.FC<ComicPageViewProps> = ({
  page,
  activeDialogueId,
  onSelectDialogue,
  onOpenZoom,
  onOpenQuiz,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<InteractiveHotspot | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleHotspotClick = (e: React.MouseEvent, hotspot: InteractiveHotspot) => {
    e.stopPropagation();
    gamelanSynth.playChime(784); // G note chime
    setActiveHotspot(activeHotspot?.id === hotspot.id ? null : hotspot);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-start select-none">
      {/* Comic Page Canvas */}
      <div className="relative w-full max-w-[480px] bg-stone-900 rounded-xl overflow-hidden shadow-2xl border border-stone-800/80 aspect-[9/16]">
        {/* Placeholder skeleton before image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-900 flex items-center justify-center animate-pulse">
            <span className="text-xs text-stone-500 font-medium">Memuat Halaman {page.pageNumber}...</span>
          </div>
        )}

        {/* Main Comic Image */}
        <img
          src={page.image}
          alt={`Komik Ragam Hias Halaman ${page.pageNumber}: ${page.title}`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Zoom trigger icon in top right corner */}
        {onOpenZoom && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenZoom(page.image);
            }}
            title="Perbesar Tampilan Komik"
            className="absolute top-3 right-3 p-2 rounded-full bg-stone-950/70 hover:bg-stone-900 text-stone-200 backdrop-blur-md border border-stone-700/60 transition-transform active:scale-95 shadow-lg"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        )}

        {/* Interactive Hotspots Layer */}
        {page.hotspots?.map((spot) => (
          <div
            key={spot.id}
            style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto"
          >
            <button
              onClick={(e) => handleHotspotClick(e, spot)}
              aria-label={`Detail: ${spot.title}`}
              className="relative group p-1"
            >
              <span className="absolute inset-0 rounded-full bg-amber-400/40 animate-ping" />
              <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] shadow-lg shadow-amber-500/40 border border-amber-300">
                <Info className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        ))}

        {/* Active Hotspot Modal/Popover Card */}
        {activeHotspot && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-x-3 bottom-14 z-20 p-3.5 rounded-xl bg-stone-900/95 border border-amber-500/40 backdrop-blur-md shadow-2xl text-stone-100 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-xs font-bold">
                  ★
                </div>
                <h4 className="text-xs font-bold text-amber-300 font-serif">
                  {activeHotspot.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="p-1 rounded-md text-stone-400 hover:text-stone-100 hover:bg-stone-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              {activeHotspot.description}
            </p>
          </div>
        )}

        {/* Page 9 Quiz CTA Floating Button over image */}
        {page.id === 9 && onOpenQuiz && (
          <div className="absolute inset-x-4 bottom-14 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuiz();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/25 border border-amber-300 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-stone-950" />
              <span>Jawab Kuis Interaktif Halaman Ini!</span>
            </button>
          </div>
        )}
      </div>

      {/* Tap-to-Speak Dialogues Quick Row (Mobile Friendly) */}
      <div className="w-full max-w-[480px] mt-2 px-1">
        <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1 px-1">
          <span>Ketuk balon dialog untuk mendengarkan:</span>
          <span className="text-amber-400/90 font-medium">
            {page.dialogues.length} percakapan
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {page.dialogues.map((item, idx) => {
            const isActive = activeDialogueId === item.id;
            return (
              <button
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDialogue(item);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-semibold'
                    : 'bg-stone-800/90 text-stone-300 border-stone-700/60 hover:bg-stone-700 hover:text-stone-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${item.avatarBg}`} />
                <span className="truncate max-w-[130px]">{item.speakerName}</span>
                <Volume2 className={`w-3 h-3 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Concept Bottom Note */}
      {page.keyConcept && (
        <div className="w-full max-w-[480px] mt-2 p-2.5 rounded-lg bg-stone-900/80 border border-amber-900/40 flex items-start gap-2.5 shadow-sm">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-amber-300 block font-serif">
              {page.keyConcept.title}
            </span>
            <p className="text-[11px] text-stone-300 leading-snug">
              {page.keyConcept.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
