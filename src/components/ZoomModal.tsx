import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomModalProps {
  imageSrc: string | null;
  onClose: () => void;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({ imageSrc, onClose }) => {
  const [scale, setScale] = useState(1.4);

  if (!imageSrc) return null;

  const zoomIn = () => setScale((s) => Math.min(3.0, s + 0.3));
  const zoomOut = () => setScale((s) => Math.max(1.0, s - 0.3));
  const resetZoom = () => setScale(1.0);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-2"
    >
      {/* Top Floating Control Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md flex items-center justify-between p-3 bg-stone-900/90 rounded-2xl border border-stone-800 z-10"
      >
        <span className="text-xs font-semibold text-stone-200">
          Perbesar Detail Wayang ({Math.round(scale * 100)}%)
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetZoom}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-amber-500 text-stone-950 hover:bg-amber-400 font-bold ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pannable & Zoomable Image Area */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex-1 w-full flex items-center justify-center overflow-auto p-2"
      >
        <img
          src={imageSrc}
          alt="Perbesaran Detail Komik"
          style={{ transform: `scale(${scale})`, transformOrigin: 'center center' }}
          className="max-h-[82vh] object-contain transition-transform duration-200 rounded-lg shadow-2xl cursor-grab active:cursor-grabbing"
        />
      </div>

      {/* Bottom hint */}
      <div className="text-[11px] text-stone-400 py-1">
        Sentuh dan geser untuk melihat ukiran tatahan lebih dekat
      </div>
    </div>
  );
};
