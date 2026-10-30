import { useState, useEffect, useCallback, useTransition } from 'react';
import { COMIC_PAGES } from './data/comicPages';
import { ReadingMode, DialogueItem } from './types/comic';
import { gamelanSynth } from './audio/gamelanSynth';
import { narratorEngine, NarratorStatus } from './audio/narratorEngine';
import { Header } from './components/Header';
import { FlipBook } from './components/FlipBook';
import { ContinuousScrollView } from './components/ContinuousScrollView';
import { NaratorDock } from './components/NaratorDock';
import { ThumbnailDrawer } from './components/ThumbnailDrawer';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';
import { SummaryModal } from './components/SummaryModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { ZoomModal } from './components/ZoomModal';
import { FirstTapWelcomeModal } from './components/FirstTapWelcomeModal';

export default function App() {
  const [, startTransition] = useTransition();
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [readingMode, setReadingMode] = useState<ReadingMode>('flip');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [bgmVolume, setBgmVolume] = useState<number>(0.45);
  const [isNaratorEnabled, setIsNaratorEnabled] = useState<boolean>(true);
  const [autoNarrateOnPageTurn, setAutoNarrateOnPageTurn] = useState<boolean>(true);
  const [speechRate, setSpeechRate] = useState<number>(1.0);

  // Narration active state
  const [currentDialogue, setCurrentDialogue] = useState<DialogueItem | null>(null);
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const [narratorStatus, setNarratorStatus] = useState<NarratorStatus>('idle');

  // Modals
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [zoomImageSrc, setZoomImageSrc] = useState<string | null>(null);

  const currentPage = COMIC_PAGES[currentPageIndex];

  // Register Narrator callbacks once
  useEffect(() => {
    narratorEngine.registerCallbacks({
      onDialogueStart: (dialogue, idx) => {
        setCurrentDialogue(dialogue);
        setDialogueIndex(idx);
      },
      onDialogueEnd: () => {
        // Dialogue end
      },
      onPageComplete: () => {
        setNarratorStatus('idle');
      },
      onStatusChange: (status) => {
        setNarratorStatus(status);
      },
    });
  }, []);

  // Handle Page Change with automatic sound & narration sync
  const handlePageChange = useCallback(
    (newIndex: number) => {
      if (newIndex < 0 || newIndex >= COMIC_PAGES.length) return;

      startTransition(() => {
        setCurrentPageIndex(newIndex);
      });

      const targetPage = COMIC_PAGES[newIndex];

      // Update Gamelan Backsound Mood dynamically according to the story mood!
      if (!isMuted && gamelanSynth.getIsPlaying()) {
        gamelanSynth.setMood(targetPage.mood);
      }

      // Auto Narrate if enabled and user has interacted
      if (isNaratorEnabled && autoNarrateOnPageTurn && !isFirstVisit) {
        narratorEngine.startPageNarration(targetPage.dialogues, 0);
      } else {
        narratorEngine.stop();
        setCurrentDialogue(targetPage.dialogues[0] || null);
        setDialogueIndex(0);
      }
    },
    [isMuted, isNaratorEnabled, autoNarrateOnPageTurn, isFirstVisit]
  );

  // Start with audio enabled on first user tap
  const handleStartWithSound = () => {
    setIsFirstVisit(false);
    narratorEngine.setUserInteracted(true);
    setIsMuted(false);
    gamelanSynth.startMusic(COMIC_PAGES[0].mood);
    if (isNaratorEnabled) {
      narratorEngine.startPageNarration(COMIC_PAGES[0].dialogues, 0);
    }
  };

  // Start silent
  const handleStartSilent = () => {
    setIsFirstVisit(false);
    setIsMuted(true);
    setIsNaratorEnabled(false);
    gamelanSynth.toggleMute();
    setCurrentDialogue(COMIC_PAGES[0].dialogues[0] || null);
  };

  // Sound Controls
  const handleToggleMute = () => {
    const nextMuted = gamelanSynth.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted && !gamelanSynth.getIsPlaying()) {
      gamelanSynth.startMusic(currentPage.mood);
    }
  };

  const handleVolumeChange = (vol: number) => {
    setBgmVolume(vol);
    gamelanSynth.setVolume(vol);
  };

  // Narator Controls
  const handleToggleNaratorEnabled = () => {
    const nextVal = !isNaratorEnabled;
    setIsNaratorEnabled(nextVal);
    narratorEngine.setAutoNarrate(nextVal);
    if (!nextVal) {
      narratorEngine.stop();
    } else {
      narratorEngine.startPageNarration(currentPage.dialogues, dialogueIndex);
    }
  };

  const handlePlayPause = () => {
    if (narratorStatus === 'speaking') {
      narratorEngine.pause();
    } else if (narratorStatus === 'paused') {
      narratorEngine.resume();
    } else {
      narratorEngine.startPageNarration(currentPage.dialogues, dialogueIndex);
    }
  };

  const handleReplayPage = () => {
    narratorEngine.replayCurrentPage();
  };

  const handleNextDialogue = () => {
    narratorEngine.nextDialogue();
  };

  const handlePrevDialogue = () => {
    narratorEngine.prevDialogue();
  };

  const handleSelectSpecificDialogue = (dialogue: DialogueItem) => {
    if (!isNaratorEnabled) {
      setIsNaratorEnabled(true);
    }
    narratorEngine.speakSingleDialogue(dialogue);
  };

  const handleSpeechRateChange = (rate: number) => {
    setSpeechRate(rate);
    narratorEngine.setRateMultiplier(rate);
  };

  // Keyboard navigation for desktop readers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handlePageChange(currentPageIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePageChange(currentPageIndex - 1);
      } else if (e.key === ' ' && !isFirstVisit) {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, handlePageChange, isFirstVisit, narratorStatus]);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Application Bar */}
      <Header
        currentPage={currentPage.pageNumber}
        totalPages={COMIC_PAGES.length}
        readingMode={readingMode}
        onToggleReadingMode={setReadingMode}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        currentMoodDescription={currentPage.moodDescription}
      />

      {/* Main Comic Reading Stage */}
      <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col items-center justify-start pt-2 pb-24 px-2 sm:px-4">
        {readingMode === 'flip' ? (
          <FlipBook
            pages={COMIC_PAGES}
            currentPageIndex={currentPageIndex}
            onPageChange={handlePageChange}
            activeDialogueId={currentDialogue?.id}
            onSelectDialogue={handleSelectSpecificDialogue}
            onOpenZoom={(src) => setZoomImageSrc(src)}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />
        ) : (
          <ContinuousScrollView
            pages={COMIC_PAGES}
            currentPageIndex={currentPageIndex}
            onPageChange={handlePageChange}
            activeDialogueId={currentDialogue?.id}
            onSelectDialogue={handleSelectSpecificDialogue}
            onOpenZoom={(src) => setZoomImageSrc(src)}
            onOpenQuiz={() => setIsQuizOpen(true)}
          />
        )}
      </main>

      {/* Floating Bottom Thumb Navigation & Narator Dock */}
      <NaratorDock
        currentDialogue={currentDialogue}
        dialogueIndex={dialogueIndex}
        totalDialogues={currentPage.dialogues.length}
        narratorStatus={narratorStatus}
        isNaratorEnabled={isNaratorEnabled}
        onToggleNaratorEnabled={handleToggleNaratorEnabled}
        onPlayPause={handlePlayPause}
        onReplay={handleReplayPage}
        onNextDialogue={handleNextDialogue}
        onPrevDialogue={handlePrevDialogue}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        currentPage={currentPage.pageNumber}
        totalPages={COMIC_PAGES.length}
      />

      {/* Bottom Sheet Drawer for All 10 Pages */}
      <ThumbnailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        pages={COMIC_PAGES}
        currentPageIndex={currentPageIndex}
        onSelectPage={handlePageChange}
      />

      {/* Interactive Quiz Modal for Page 9 or on-demand */}
      <InteractiveQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        questions={COMIC_PAGES[8].quizQuestions || []}
      />

      {/* Educational Study Summary Modal */}
      <SummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
      />

      {/* Sound & Narrator Settings Modal */}
      <AudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        bgmVolume={bgmVolume}
        onVolumeChange={handleVolumeChange}
        isNaratorEnabled={isNaratorEnabled}
        onToggleNarator={handleToggleNaratorEnabled}
        autoNarrateOnPageTurn={autoNarrateOnPageTurn}
        onToggleAutoNarrate={() => setAutoNarrateOnPageTurn((prev) => !prev)}
        speechRate={speechRate}
        onSpeechRateChange={handleSpeechRateChange}
        currentMoodDescription={currentPage.moodDescription}
      />

      {/* Zoom Inspector Modal */}
      <ZoomModal
        imageSrc={zoomImageSrc}
        onClose={() => setZoomImageSrc(null)}
      />

      {/* Welcome & First Touch Audio Unlock Modal */}
      <FirstTapWelcomeModal
        isOpen={isFirstVisit}
        onStartWithSound={handleStartWithSound}
        onStartSilent={handleStartSilent}
      />
    </div>
  );
}
