import { DialogueItem, SpeakerRole } from '../types/comic';

export type NarratorStatus = 'idle' | 'speaking' | 'paused';

interface NarratorCallbacks {
  onDialogueStart?: (dialogue: DialogueItem, index: number, total: number) => void;
  onDialogueEnd?: (dialogue: DialogueItem) => void;
  onPageComplete?: () => void;
  onStatusChange?: (status: NarratorStatus) => void;
}

class NarratorEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private indonesianVoice: SpeechSynthesisVoice | null = null;
  private queue: DialogueItem[] = [];
  private currentIndex: number = 0;
  private status: NarratorStatus = 'idle';
  private callbacks: NarratorCallbacks = {};
  private globalRateMultiplier: number = 1.0;
  private isAutoNarrateEnabled: boolean = true;
  private hasUserInteracted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Prioritize Indonesian voices: id-ID, id, or in-ID
    this.indonesianVoice =
      this.voices.find(
        (v) =>
          v.lang.toLowerCase().includes('id') ||
          v.lang.toLowerCase().includes('in') ||
          v.name.toLowerCase().includes('indonesia')
      ) ||
      this.voices.find((v) => v.lang.startsWith('id')) ||
      null;
  }

  public registerCallbacks(cbs: NarratorCallbacks) {
    this.callbacks = { ...this.callbacks, ...cbs };
  }

  public setUserInteracted(val: boolean = true) {
    this.hasUserInteracted = val;
  }

  public getHasUserInteracted(): boolean {
    return this.hasUserInteracted;
  }

  public setAutoNarrate(enabled: boolean) {
    this.isAutoNarrateEnabled = enabled;
  }

  public getAutoNarrate(): boolean {
    return this.isAutoNarrateEnabled;
  }

  public setRateMultiplier(rate: number) {
    this.globalRateMultiplier = Math.max(0.6, Math.min(1.6, rate));
  }

  public getRateMultiplier(): number {
    return this.globalRateMultiplier;
  }

  public getStatus(): NarratorStatus {
    return this.status;
  }

  public getCurrentDialogue(): DialogueItem | null {
    if (this.queue.length > 0 && this.currentIndex < this.queue.length) {
      return this.queue[this.currentIndex];
    }
    return null;
  }

  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  public getTotalDialogues(): number {
    return this.queue.length;
  }

  private getCharacterPitchAndRate(speaker: SpeakerRole): { pitch: number; rate: number } {
    switch (speaker) {
      case 'bimo':
        // Energetic boy pupil
        return { pitch: 1.15, rate: 1.02 * this.globalRateMultiplier };
      case 'rara':
        // Cheerful girl pupil
        return { pitch: 1.25, rate: 0.98 * this.globalRateMultiplier };
      case 'pak_guru':
        // Articulate, warm teacher
        return { pitch: 0.92, rate: 0.95 * this.globalRateMultiplier };
      case 'kakek':
        // Gentle, venerable master artisan
        return { pitch: 0.78, rate: 0.86 * this.globalRateMultiplier };
      case 'narator':
      default:
        // Balanced, clear narrator voice
        return { pitch: 1.0, rate: 0.96 * this.globalRateMultiplier };
    }
  }

  /**
   * Start narrating all dialogues of a page
   */
  public startPageNarration(dialogues: DialogueItem[], startIndex: number = 0) {
    this.stop();
    if (!dialogues || dialogues.length === 0) return;

    this.queue = [...dialogues];
    this.currentIndex = Math.max(0, Math.min(startIndex, dialogues.length - 1));
    this.speakCurrent();
  }

  /**
   * Speak a specific dialogue immediately
   */
  public speakSingleDialogue(dialogue: DialogueItem) {
    this.stop();
    this.queue = [dialogue];
    this.currentIndex = 0;
    this.speakCurrent();
  }

  private speakCurrent() {
    if (!this.synth) {
      console.warn('SpeechSynthesis is not supported on this browser.');
      return;
    }

    if (this.currentIndex >= this.queue.length) {
      this.status = 'idle';
      this.callbacks.onStatusChange?.('idle');
      this.callbacks.onPageComplete?.();
      return;
    }

    const currentItem = this.queue[this.currentIndex];
    const { pitch, rate } = this.getCharacterPitchAndRate(currentItem.speaker);

    // Cancel any ongoing speech
    this.synth.cancel();

    // Prepare speech text with speaker cue if narrator
    let spokenText = currentItem.text;
    if (currentItem.speaker === 'pak_guru') {
      spokenText = `Pak Guru berkata: ${currentItem.text}`;
    } else if (currentItem.speaker === 'kakek') {
      spokenText = `Kakek Pengrajin berkata: ${currentItem.text}`;
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    this.currentUtterance = utterance;

    if (this.indonesianVoice) {
      utterance.voice = this.indonesianVoice;
      utterance.lang = 'id-ID';
    } else {
      utterance.lang = 'id-ID';
    }

    utterance.pitch = pitch;
    utterance.rate = rate;

    utterance.onstart = () => {
      this.status = 'speaking';
      this.callbacks.onStatusChange?.('speaking');
      this.callbacks.onDialogueStart?.(currentItem, this.currentIndex, this.queue.length);
    };

    utterance.onend = () => {
      this.callbacks.onDialogueEnd?.(currentItem);

      // Delay briefly between dialogues for natural conversational breathing
      if (this.status === 'speaking') {
        setTimeout(() => {
          if (this.status === 'speaking') {
            this.currentIndex++;
            this.speakCurrent();
          }
        }, 650);
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis utterance error:', e);
      this.callbacks.onDialogueEnd?.(currentItem);
      // Advance so narration doesn't get stuck
      if (this.status === 'speaking') {
        this.currentIndex++;
        this.speakCurrent();
      }
    };

    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.status === 'speaking') {
      this.synth.pause();
      this.status = 'paused';
      this.callbacks.onStatusChange?.('paused');
    }
  }

  public resume() {
    if (this.synth && this.status === 'paused') {
      this.synth.resume();
      this.status = 'speaking';
      this.callbacks.onStatusChange?.('speaking');
    } else if (this.status === 'idle' && this.queue.length > 0) {
      this.speakCurrent();
    }
  }

  public nextDialogue() {
    if (this.currentIndex < this.queue.length - 1) {
      this.stop();
      this.currentIndex++;
      this.status = 'speaking';
      this.speakCurrent();
    }
  }

  public prevDialogue() {
    if (this.currentIndex > 0) {
      this.stop();
      this.currentIndex--;
      this.status = 'speaking';
      this.speakCurrent();
    }
  }

  public replayCurrentPage() {
    this.stop();
    this.currentIndex = 0;
    this.status = 'speaking';
    this.speakCurrent();
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.status = 'idle';
    this.currentUtterance = null;
    this.callbacks.onStatusChange?.('idle');
  }
}

export const narratorEngine = new NarratorEngine();
