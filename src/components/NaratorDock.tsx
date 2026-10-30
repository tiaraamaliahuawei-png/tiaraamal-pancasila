import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Layers,
  Mic,
  MicOff,
} from 'lucide-react';
import { DialogueItem } from '../types/comic';
import { NarratorStatus } from '../audio/narratorEngine';

interface NaratorDockProps {
  currentDialogue: DialogueItem | null;
  dialogueIndex: number;
  totalDialogues: number;
  narratorStatus: NarratorStatus;
  isNaratorEnabled: boolean;
  onToggleNaratorEnabled: () => void;
  onPlayPause: () => void;
  onReplay: () => void;
  onNextDialogue: () => void;
  onPrevDialogue: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenDrawer: () => void;
  currentPage: number;
  totalPages: number;
}

export const NaratorDock: React.FC<NaratorDockProps> = ({
  currentDialogue,
  dialogueIndex,
  totalDialogues,
  narratorStatus,
  isNaratorEnabled,
  onToggleNaratorEnabled,
  onPlayPause,
  onReplay,
  onNextDialogue,
  onPrevDialogue,
  isMuted,
  onToggleMute,
  onOpenDrawer,
  currentPage,
  totalPages,
}) => {
  const isSpeaking = narratorStatus === 'speaking';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-stone-800/80 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-lg mx-auto px-3 pt-2 pb-2">
        {/* Live Narration Subtitle Box */}
        {isNaratorEnabled && currentDialogue && (
          <div className="mb-2 p-2 rounded-xl bg-stone-900/90 border border-amber-600/30 flex items-center gap-2.5 transition-all">
            {/* Animated Speaker Avatar with Sound Waves */}
            <div className="relative shrink-0">
              <div
                className={`w-8 h-8 rounded-full ${currentDialogue.avatarBg} flex items-center justify-center text-xs font-bold text-white shadow`}
              >
                {currentDialogue.speakerName.charAt(0)}
              </div>
              {isSpeaking && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
                </span>
              )}
            </div>

            {/* Subtitle Dialogue Text */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-[11px] mb-0.5">
                <span className="font-bold text-amber-300 font-serif truncate">
                  {currentDialogue.speakerName}
                </span>
                <span className="text-[10px] text-stone-400 shrink-0">
                  {dialogueIndex + 1} / {totalDialogues}
                </span>
              </div>
              <p className="text-xs text-stone-100 line-clamp-2 leading-tight">
                &ldquo;{currentDialogue.text}&rdquo;
              </p>
            </div>

            {/* Mini sound wave animation indicator */}
            {isSpeaking && (
              <div className="flex items-end gap-0.5 h-4 shrink-0 px-1">
                <div className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_100ms] h-2" />
                <div className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_300ms] h-4" />
                <div className="w-0.5 bg-amber-400 rounded-full animate-[bounce_0.6s_infinite_200ms] h-3" />
              </div>
            )}
          </div>
        )}

        {/* Thumb Control Bar */}
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {/* Left: Quick Page Drawer & Backsound toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenDrawer}
              aria-label="Buka Daftar Halaman"
              className="min-w-[44px] min-h-[44px] rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 flex flex-col items-center justify-center text-[10px] font-medium border border-stone-800 transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-[9px] text-stone-400 mt-0.5">
                {currentPage}/{totalPages}
              </span>
            </button>

            <button
              onClick={onToggleMute}
              aria-label={isMuted ? 'Nyalakan Musik' : 'Bisukan Musik'}
              className={`min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center border transition-colors ${
                isMuted
                  ? 'bg-stone-900 text-stone-500 border-stone-800'
                  : 'bg-stone-900 text-amber-400 border-amber-900/40 hover:bg-stone-800'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Center: Dialogue & Narration Controls */}
          <div className="flex items-center gap-1.5 bg-stone-900/90 p-1 rounded-2xl border border-stone-800">
            {/* Prev dialogue */}
            <button
              onClick={onPrevDialogue}
              disabled={!isNaratorEnabled || dialogueIndex <= 0}
              aria-label="Dialog Sebelumnya"
              className="min-w-[40px] min-h-[40px] rounded-xl text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Main Play/Pause Primary Action Button (>= 48px) */}
            <button
              onClick={onPlayPause}
              disabled={!isNaratorEnabled}
              aria-label={isSpeaking ? 'Jeda Narator' : 'Putar Narator'}
              className="min-w-[48px] min-h-[48px] rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-stone-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/25 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              {isSpeaking ? (
                <Pause className="w-5 h-5 fill-stone-950" />
              ) : (
                <Play className="w-5 h-5 fill-stone-950 ml-0.5" />
              )}
            </button>

            {/* Next dialogue */}
            <button
              onClick={onNextDialogue}
              disabled={!isNaratorEnabled || dialogueIndex >= totalDialogues - 1}
              aria-label="Dialog Selanjutnya"
              className="min-w-[40px] min-h-[40px] rounded-xl text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Replay current page dialogues */}
            <button
              onClick={onReplay}
              disabled={!isNaratorEnabled}
              aria-label="Ulangi Suara Halaman Ini"
              className="min-w-[40px] min-h-[40px] rounded-xl text-stone-400 hover:text-stone-200 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Narator Master Toggle Switch */}
          <div className="flex items-center">
            <button
              onClick={onToggleNaratorEnabled}
              aria-label={isNaratorEnabled ? 'Matikan Narator' : 'Aktifkan Narator'}
              className={`min-w-[44px] min-h-[44px] rounded-xl flex flex-col items-center justify-center transition-all border ${
                isNaratorEnabled
                  ? 'bg-amber-950/70 border-amber-600/50 text-amber-300 shadow-sm'
                  : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
              }`}
            >
              {isNaratorEnabled ? (
                <>
                  <Mic className="w-4 h-4 text-amber-400" />
                  <span className="text-[9px] font-semibold text-amber-300 mt-0.5">ON</span>
                </>
              ) : (
                <>
                  <MicOff className="w-4 h-4 text-stone-500" />
                  <span className="text-[9px] font-semibold text-stone-500 mt-0.5">OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
