/**
 * Web Audio Procedural Gamelan & Nusantara Ambient Music Engine
 * 100% Client-side synthetic sound generation for zero-latency, reliable audio.
 */

import { MusicMood } from '../types/comic';

// Pentatonic Frequencies (Hz) for Indonesian Gamelan tuning
// Slendro Tuning (roughly equal 5-tone temperament)
const SLENDRO_NOTES = {
  barang_low: 261.63, // 1 (C4)
  gulu: 293.66,       // 2 (D4)
  dhadha: 329.63,     // 3 (E4)
  lima: 392.0,        // 5 (G4)
  nem: 440.0,         // 6 (A4)
  barang_high: 523.25,// 1' (C5)
  gulu_high: 587.33,  // 2' (D5)
  dhadha_high: 659.25,// 3' (E5)
  lima_high: 783.99,  // 5' (G5)
};

// Pelog Tuning (7-tone with expressive minor intervals)
const PELOG_NOTES = {
  penunggul: 247.0, // B3
  gulu: 277.0,      // C#4
  dhadha: 311.0,    // Eb4
  pelog: 370.0,     // F#4
  lima: 415.0,      // G#4
  nem: 466.0,       // Bb4
  barang: 554.0,    // C#5
};

class GamelanSynthEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private bgmVolume: number = 0.45;
  private currentMood: MusicMood = 'grand-overture';
  private loopTimer: number | null = null;
  private isPlaying: boolean = false;
  private step: number = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- Physical Instrument Synthesizers ---

  /**
   * Saron / Metallophone: Metallic bronze sound with rich inharmonic overtones
   */
  public playSaron(freq: number, duration: number = 2.0, velocity: number = 0.5) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, t);
    voiceGain.gain.linearRampToValueAtTime(velocity, t + 0.008);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    voiceGain.connect(this.bgmGain);

    // Fundamental strike
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, t);
    osc1.connect(voiceGain);
    osc1.start(t);
    osc1.stop(t + duration);

    // Bronze overtone 1 (2.76x fundamental - typical bronze bar mode)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.76, t);
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(velocity * 0.4, t);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.4);
    osc2.connect(g2);
    g2.connect(voiceGain);
    osc2.start(t);
    osc2.stop(t + duration * 0.4);

    // Bronze high shimmer (5.4x fundamental)
    const osc3 = this.ctx.createOscillator();
    osc3.type = 'triangle';
    osc3.frequency.setValueAtTime(freq * 5.4, t);
    const g3 = this.ctx.createGain();
    g3.gain.setValueAtTime(velocity * 0.15, t);
    g3.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.2);
    osc3.connect(g3);
    g3.connect(voiceGain);
    osc3.start(t);
    osc3.stop(t + duration * 0.2);
  }

  /**
   * Bonang: Kettle gongs with rounded resonant "ping" and subtle pitch droop
   */
  public playBonang(freq: number, duration: number = 1.2, velocity: number = 0.4) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0.0001, t);
    voiceGain.gain.linearRampToValueAtTime(velocity, t + 0.005);
    voiceGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    voiceGain.connect(this.bgmGain);

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    // Subtle bonang envelope pitch drop
    osc.frequency.setValueAtTime(freq * 1.02, t);
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.04);
    osc.connect(voiceGain);
    osc.start(t);
    osc.stop(t + duration);

    // Pot harmonic
    const potOsc = this.ctx.createOscillator();
    potOsc.type = 'triangle';
    potOsc.frequency.setValueAtTime(freq * 3.12, t);
    const potGain = this.ctx.createGain();
    potGain.gain.setValueAtTime(velocity * 0.25, t);
    potGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.35);
    potOsc.connect(potGain);
    potGain.connect(voiceGain);
    potOsc.start(t);
    potOsc.stop(t + duration * 0.35);
  }

  /**
   * Gong Ageng: Deep resonant bass gong with long decaying wash
   */
  public playGong(freq: number = 65.4, duration: number = 4.5, velocity: number = 0.65) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const gongGain = this.ctx.createGain();
    gongGain.gain.setValueAtTime(0.0001, t);
    gongGain.gain.linearRampToValueAtTime(velocity, t + 0.06);
    gongGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    gongGain.connect(this.bgmGain);

    // Deep sub fundamental
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    // Subtle beat frequency (ombak)
    osc.frequency.linearRampToValueAtTime(freq - 1.2, t + duration);
    osc.connect(gongGain);
    osc.start(t);
    osc.stop(t + duration);

    // Low octave
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq * 1.5, t);
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(velocity * 0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.0001, t + duration * 0.7);
    subOsc.connect(subGain);
    subGain.connect(gongGain);
    subOsc.start(t);
    subOsc.stop(t + duration * 0.7);
  }

  /**
   * Suling Bambu: Breath vibrato bamboo flute
   */
  public playSuling(freq: number, duration: number = 2.2, velocity: number = 0.3) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const sulingGain = this.ctx.createGain();
    sulingGain.gain.setValueAtTime(0.0001, t);
    sulingGain.gain.linearRampToValueAtTime(velocity, t + 0.12);
    sulingGain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    sulingGain.connect(this.bgmGain);

    // Flute tone
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    // LFO for expressive Indonesian vibrato
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(4.8, t); // 4.8 Hz vibrato
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(freq * 0.015, t); // mild pitch flutter
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start(t);
    lfo.stop(t + duration);

    osc.connect(sulingGain);
    osc.start(t);
    osc.stop(t + duration);
  }

  /**
   * Kendang: Indonesian rhythmic hand drum
   */
  public playKendang(type: 'dung' | 'tak' | 'tung', velocity: number = 0.4) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const drumGain = this.ctx.createGain();
    drumGain.connect(this.bgmGain);

    if (type === 'dung') {
      // Deep resonant drum center stroke
      drumGain.gain.setValueAtTime(velocity * 0.6, t);
      drumGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(65, t + 0.3);
      osc.connect(drumGain);
      osc.start(t);
      osc.stop(t + 0.4);
    } else if (type === 'tak') {
      // Sharp slap rim
      drumGain.gain.setValueAtTime(velocity * 0.4, t);
      drumGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(140, t + 0.08);
      osc.connect(drumGain);
      osc.start(t);
      osc.stop(t + 0.08);
    } else {
      // High open ping "tung"
      drumGain.gain.setValueAtTime(velocity * 0.45, t);
      drumGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.exponentialRampToValueAtTime(180, t + 0.2);
      osc.connect(drumGain);
      osc.start(t);
      osc.stop(t + 0.25);
    }
  }

  /**
   * Tatah Wood/Iron Tap: Artisan workshop sound for page 6
   */
  public playTatahTap() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const tapGain = this.ctx.createGain();
    tapGain.gain.setValueAtTime(0.2, t);
    tapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    tapGain.connect(this.sfxGain);

    const osc = this.ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);

    // Highpass filter for crisp metal chisel tap
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, t);

    osc.connect(filter);
    filter.connect(tapGain);
    osc.start(t);
    osc.stop(t + 0.06);
  }

  // --- Sound Effects (SFX) ---

  /**
   * Realistic Book Page Turn Sound
   */
  public playPageFlip() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter sweep mimicking paper flutter
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, t);
    filter.frequency.exponentialRampToValueAtTime(2600, t + 0.08);
    filter.frequency.exponentialRampToValueAtTime(800, t + 0.18);
    filter.Q.setValueAtTime(1.8, t);

    const flipGain = this.ctx.createGain();
    flipGain.gain.setValueAtTime(0.0001, t);
    flipGain.gain.linearRampToValueAtTime(0.35, t + 0.03);
    flipGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

    noise.connect(filter);
    filter.connect(flipGain);
    flipGain.connect(this.sfxGain);

    noise.start(t);
  }

  /**
   * UI Chime on selecting hotspot or button
   */
  public playChime(pitch: number = 880) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    g.connect(this.sfxGain);

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, t);
    osc.connect(g);
    osc.start(t);
    osc.stop(t + 0.6);
  }

  /**
   * Quiz Correct Fanfare: Pentatonic ascending celebratory chime
   */
  public playCorrectFanfare() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const notes = [SLENDRO_NOTES.gulu, SLENDRO_NOTES.dhadha, SLENDRO_NOTES.lima, SLENDRO_NOTES.barang_high];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playBonang(freq, 0.8, 0.5);
      }, idx * 110);
    });
  }

  /**
   * Quiz Incorrect Chime
   */
  public playWrongChime() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    this.playBonang(PELOG_NOTES.gulu, 0.6, 0.4);
    setTimeout(() => {
      this.playBonang(PELOG_NOTES.penunggul, 0.8, 0.4);
    }, 150);
  }

  // --- Dynamic Procedural Backsound Loops for Moods ---

  private tickMoodLoop() {
    if (!this.isPlaying || this.isMuted || !this.ctx) return;

    const s = this.step;
    this.step = (this.step + 1) % 16;

    // Mood-specific musical sequences
    switch (this.currentMood) {
      case 'grand-overture': {
        // Page 1: Welcoming Grand Gamelan (Gong on beat 0, majestic Saron & Bonang)
        if (s === 0) {
          this.playGong(65.4, 5.0, 0.7);
          this.playKendang('dung', 0.5);
        }
        if (s % 4 === 0) {
          const notes = [SLENDRO_NOTES.nem, SLENDRO_NOTES.lima, SLENDRO_NOTES.dhadha, SLENDRO_NOTES.barang_high];
          this.playSaron(notes[(s / 4) % notes.length], 2.2, 0.45);
        }
        if (s % 2 === 0) {
          this.playBonang(s % 4 === 0 ? SLENDRO_NOTES.gulu_high : SLENDRO_NOTES.dhadha, 1.0, 0.3);
        }
        if (s === 8) {
          this.playSuling(SLENDRO_NOTES.nem, 2.5, 0.28);
        }
        break;
      }

      case 'curiosity': {
        // Page 2: Inquisitive, light, airy Pelog tones
        if (s === 0) this.playGong(82.4, 3.5, 0.4);
        if (s % 2 === 0) {
          const pelogScale = [PELOG_NOTES.dhadha, PELOG_NOTES.lima, PELOG_NOTES.barang, PELOG_NOTES.nem];
          this.playBonang(pelogScale[s % 4], 0.9, 0.35);
        }
        if (s === 6 || s === 14) {
          this.playKendang('tak', 0.25);
        }
        break;
      }

      case 'motif-exploration': {
        // Page 3: Playful exploratory Slendro chimes
        if (s === 0) this.playGong(73.4, 4.0, 0.5);
        const slendroArp = [
          SLENDRO_NOTES.gulu,
          SLENDRO_NOTES.dhadha,
          SLENDRO_NOTES.lima,
          SLENDRO_NOTES.nem,
          SLENDRO_NOTES.barang_high,
          SLENDRO_NOTES.lima_high,
        ];
        this.playSaron(slendroArp[s % slendroArp.length], 1.5, 0.35);
        if (s % 4 === 2) this.playBonang(SLENDRO_NOTES.dhadha_high, 0.8, 0.25);
        if (s % 8 === 4) this.playKendang('tung', 0.3);
        break;
      }

      case 'pattern-order': {
        // Page 4: Strict, rhythmic, harmonic repeating pattern
        if (s === 0 || s === 8) this.playKendang('dung', 0.4);
        if (s % 2 === 0) {
          // Ordered 4-note motif repeating like wallpaper pattern
          const pattern = [SLENDRO_NOTES.dhadha, SLENDRO_NOTES.lima, SLENDRO_NOTES.nem, SLENDRO_NOTES.lima];
          this.playSaron(pattern[(s / 2) % pattern.length], 1.2, 0.4);
        }
        if (s % 4 === 1) this.playBonang(SLENDRO_NOTES.barang_high, 0.8, 0.25);
        break;
      }

      case 'vibrant-color': {
        // Page 5: Warm dual-color tones (Rich resonance)
        if (s === 0) this.playGong(65.4, 4.5, 0.6);
        if (s % 4 === 0) {
          // Harmonies simulating warm gold and cool blue
          this.playSaron(PELOG_NOTES.lima, 2.0, 0.35);
          this.playBonang(PELOG_NOTES.barang, 1.2, 0.3);
        } else if (s % 4 === 2) {
          this.playSaron(PELOG_NOTES.dhadha, 1.8, 0.35);
          this.playBonang(PELOG_NOTES.gulu, 1.0, 0.25);
        }
        if (s === 4 || s === 12) this.playSuling(PELOG_NOTES.nem, 2.0, 0.25);
        break;
      }

      case 'craftsmanship': {
        // Page 6: Master artisan workshop - meditative quiet with rhythmic chisel taps!
        if (s === 0) this.playGong(55.0, 4.0, 0.4);
        if (s % 3 === 0) {
          // Delicate rhythmic chisel tap on leather
          this.playTatahTap();
        }
        if (s % 8 === 0) {
          this.playBonang(SLENDRO_NOTES.lima, 1.8, 0.25);
        }
        if (s === 8) {
          this.playSuling(SLENDRO_NOTES.gulu, 2.5, 0.2);
        }
        break;
      }

      case 'heroic-wayang': {
        // Page 7: Epic, bold, noble Manyura scale for Arjuna & Bima
        if (s === 0) {
          this.playGong(65.4, 5.0, 0.7);
          this.playKendang('dung', 0.6);
        }
        if (s % 4 === 0) {
          this.playKendang('tak', 0.4);
          this.playSaron(SLENDRO_NOTES.barang_low, 2.0, 0.5);
        }
        if (s % 2 === 1) {
          this.playBonang(SLENDRO_NOTES.nem, 1.0, 0.35);
        }
        if (s === 6) {
          this.playSaron(SLENDRO_NOTES.lima_high, 2.0, 0.45);
        }
        break;
      }

      case 'creative-flow': {
        // Page 8: Inspiring bamboo flute and bright bells
        if (s === 0) this.playGong(73.4, 4.0, 0.45);
        if (s === 2 || s === 10) {
          this.playSuling(SLENDRO_NOTES.dhadha_high, 2.8, 0.32);
        }
        if (s % 2 === 0) {
          this.playBonang(SLENDRO_NOTES.lima, 1.0, 0.28);
        }
        if (s % 4 === 2) {
          this.playKendang('tung', 0.25);
        }
        break;
      }

      case 'quiz-challenge': {
        // Page 9: Bouncy, upbeat gamelan game tempo
        if (s % 2 === 0) {
          const notes = [SLENDRO_NOTES.gulu, SLENDRO_NOTES.dhadha, SLENDRO_NOTES.lima, SLENDRO_NOTES.nem];
          this.playBonang(notes[(s / 2) % notes.length], 0.7, 0.4);
        }
        if (s % 4 === 1) this.playKendang('tak', 0.3);
        if (s % 8 === 0) this.playKendang('dung', 0.45);
        break;
      }

      case 'celebration-heritage': {
        // Page 10: Grand celebration finale of Indonesian culture
        if (s === 0 || s === 8) {
          this.playGong(65.4, 5.0, 0.75);
          this.playKendang('dung', 0.55);
        }
        if (s % 2 === 0) {
          const festiveMelody = [
            SLENDRO_NOTES.nem,
            SLENDRO_NOTES.lima,
            SLENDRO_NOTES.barang_high,
            SLENDRO_NOTES.dhadha_high,
            SLENDRO_NOTES.lima_high,
            SLENDRO_NOTES.nem,
            SLENDRO_NOTES.lima,
            SLENDRO_NOTES.gulu,
          ];
          this.playSaron(festiveMelody[(s / 2) % festiveMelody.length], 1.8, 0.5);
          this.playBonang(SLENDRO_NOTES.dhadha, 1.0, 0.35);
        }
        if (s === 4 || s === 12) {
          this.playSuling(SLENDRO_NOTES.lima_high, 2.2, 0.3);
          this.playKendang('tung', 0.35);
        }
        break;
      }
    }
  }

  // --- Public Control Methods ---

  public startMusic(mood: MusicMood) {
    this.initContext();
    this.currentMood = mood;
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.step = 0;

    // Tick every 420ms (roughly 71 BPM, traditional gamelan irama lancaran tempo)
    const intervalMs = mood === 'quiz-challenge' ? 320 : mood === 'craftsmanship' ? 480 : 420;

    this.loopTimer = window.setInterval(() => {
      this.tickMoodLoop();
    }, intervalMs);
  }

  public setMood(mood: MusicMood) {
    this.currentMood = mood;
    // Reschedule interval if tempo differs
    if (this.isPlaying) {
      this.stopMusic();
      this.startMusic(mood);
    }
  }

  public stopMusic() {
    this.isPlaying = false;
    if (this.loopTimer !== null) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.bgmVolume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const gamelanSynth = new GamelanSynthEngine();
