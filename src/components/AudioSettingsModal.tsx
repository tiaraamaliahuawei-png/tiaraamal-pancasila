import React from 'react';
import { X, Volume2, Mic, Music2, Gauge, Check } from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  bgmVolume: number;
  onVolumeChange: (vol: number) => void;
  isNaratorEnabled: boolean;
  onToggleNarator: () => void;
  autoNarrateOnPageTurn: boolean;
  onToggleAutoNarrate: () => void;
  speechRate: number;
  onSpeechRateChange: (rate: number) => void;
  currentMoodDescription?: string;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
  bgmVolume,
  onVolumeChange,
  isNaratorEnabled,
  onToggleNarator,
  autoNarrateOnPageTurn,
  onToggleAutoNarrate,
  speechRate,
  onSpeechRateChange,
  currentMoodDescription,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-2xl relative text-stone-100 animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Music2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100 font-serif">
                Pengaturan Suara &amp; Narator
              </h3>
              <p className="text-xs text-stone-400">
                Atur kenyamanan membaca dan musik nusantara
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Pengaturan"
            className="p-2 rounded-full bg-stone-800 text-stone-400 hover:text-stone-100 hover:bg-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs sm:text-sm">
          {/* Active Mood Info */}
          {currentMoodDescription && (
            <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-900/40 text-stone-300">
              <span className="font-bold text-amber-400 block text-xs mb-1 font-serif">
                Suasana Musik Halaman Ini:
              </span>
              <p className="text-xs text-stone-300 leading-snug">
                {currentMoodDescription}
              </p>
            </div>
          )}

          {/* Backsound Gamelan Controls */}
          <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-stone-200">Musik Gamelan Otomatis</span>
              </div>
              <button
                onClick={onToggleMute}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  !isMuted
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-700 text-stone-400'
                }`}
              >
                {!isMuted ? 'Aktif' : 'Mati'}
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                <span>Volume Musik</span>
                <span>{Math.round(bgmVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={bgmVolume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
              />
            </div>
          </div>

          {/* Voice Narrator Controls */}
          <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-stone-200">Narator Suara Bahasa Indonesia</span>
              </div>
              <button
                onClick={onToggleNarator}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  isNaratorEnabled
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-700 text-stone-400'
                }`}
              >
                {isNaratorEnabled ? 'Aktif' : 'Mati'}
              </button>
            </div>

            {/* Auto Read on Page Turn */}
            <div className="flex items-center justify-between pt-1 border-t border-stone-700/40">
              <span className="text-xs text-stone-300">
                Otomatis Membaca Saat Balik Halaman
              </span>
              <button
                onClick={onToggleAutoNarrate}
                className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                  autoNarrateOnPageTurn
                    ? 'bg-amber-500 border-amber-400 text-stone-950'
                    : 'bg-stone-800 border-stone-700 text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Speech Rate buttons */}
            <div className="pt-1 border-t border-stone-700/40">
              <div className="flex items-center justify-between text-xs text-stone-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-stone-400" />
                  Kecepatan Suara
                </span>
                <span>{speechRate}x</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0.85, 1.0, 1.15].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onSpeechRateChange(rate)}
                    className={`py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      speechRate === rate
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm'
                        : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    {rate === 0.85 ? 'Santai' : rate === 1.0 ? 'Normal' : 'Cepat'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
