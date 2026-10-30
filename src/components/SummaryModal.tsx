import React from 'react';
import { X, BookOpen, Sparkles, Check, Palette, Award } from 'lucide-react';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-3xl p-5 sm:p-6 shadow-2xl relative text-stone-100 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 font-serif">
                Rangkuman Seni Rupa Kelas 4
              </h3>
              <p className="text-xs text-stone-400">
                SDIT Al Madani Tapin · Ragam Hias Nusantara
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Rangkuman"
            className="p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Summary Body */}
        <div className="overflow-y-auto pr-1 py-4 space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
          {/* Section 1 */}
          <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/60">
            <h4 className="font-bold text-amber-300 flex items-center gap-2 mb-1.5 font-serif">
              <Sparkles className="w-4 h-4" />
              1. Ragam Hias &amp; Pola
            </h4>
            <p className="text-stone-300">
              <strong>Ragam hias</strong> adalah bentuk hiasan yang disusun menjadi pola tertentu untuk memperindah karya seni. <strong>Pola</strong> adalah susunan bentuk yang diulang atau diatur secara teratur dan berkesinambungan sehingga menciptakan rasa harmoni yang sedap dipandang.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/60">
            <h4 className="font-bold text-amber-300 flex items-center gap-2 mb-1.5 font-serif">
              <Palette className="w-4 h-4" />
              2. Macam Motif &amp; Stilasi
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-stone-300">
              <li><strong>Motif Geometris:</strong> Garis, segitiga, meander, belah ketupat, dan lingkaran teratur.</li>
              <li><strong>Motif Stilasi Flora:</strong> Penggayaan bentuk daun, bunga, sulur, dan kuncup tumbuhan tanpa menghilangkan ciri aslinya.</li>
              <li><strong>Motif Dekoratif:</strong> Bentuk awan (megamendung), lidah api (modang), dan ornamen naga.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/60">
            <h4 className="font-bold text-amber-300 flex items-center gap-2 mb-1.5 font-serif">
              <Check className="w-4 h-4" />
              3. Bagian Wayang Penuh Ragam Hias
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-stone-300">
              <li><strong>Mahkota &amp; Jamang:</strong> Hiasan kepala kesatria dan dewa yang melambangkan keagungan.</li>
              <li><strong>Busana &amp; Dodot:</strong> Kain penutup tubuh dengan motif parang, semen, atau corak khas istana.</li>
              <li><strong>Aksesori:</strong> Kelat bahu naga, gelang praba, dan tali sampur yang rumit.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/60">
            <h4 className="font-bold text-amber-300 flex items-center gap-2 mb-1.5 font-serif">
              <Award className="w-4 h-4" />
              4. Empat Langkah Berkarya Motif Sendiri
            </h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-700">
                <span className="font-bold text-amber-400 block">1. Amati</span>
                <span className="text-[11px] text-stone-400">Pelajari motif wayang asli di sekitar kita.</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-700">
                <span className="font-bold text-amber-400 block">2. Sketsa</span>
                <span className="text-[11px] text-stone-400">Gambarkan bentuk dasar yang sederhana.</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-700">
                <span className="font-bold text-amber-400 block">3. Susun Pola</span>
                <span className="text-[11px] text-stone-400">Ulangi bentuk dengan susunan yang teratur.</span>
              </div>
              <div className="p-2 rounded-xl bg-stone-900 border border-stone-700">
                <span className="font-bold text-amber-400 block">4. Kembangkan</span>
                <span className="text-[11px] text-stone-400">Beri warna, detail garis, dan kreasi orisinalmu!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-stone-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
