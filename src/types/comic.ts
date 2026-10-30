export type SpeakerRole = 'narator' | 'bimo' | 'rara' | 'pak_guru' | 'kakek';

export interface DialogueItem {
  id: string;
  speaker: SpeakerRole;
  speakerName: string;
  avatarBg: string;
  text: string;
  bubbleLocation?: { top: number; left: number }; // percentage coords for highlighting
  panelNumber: number;
}

export interface InteractiveHotspot {
  id: string;
  title: string;
  description: string;
  x: number; // percentage
  y: number; // percentage
  radius?: number;
  highlightCategory?: 'mahkota' | 'busana' | 'aksesori' | 'geometris' | 'flora' | 'tatah' | 'karakter';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export type MusicMood =
  | 'grand-overture'
  | 'curiosity'
  | 'motif-exploration'
  | 'pattern-order'
  | 'vibrant-color'
  | 'craftsmanship'
  | 'heroic-wayang'
  | 'creative-flow'
  | 'quiz-challenge'
  | 'celebration-heritage';

export interface ComicPageData {
  id: number;
  pageNumber: number;
  title: string;
  subtitle: string;
  image: string;
  mood: MusicMood;
  moodDescription: string;
  narrationSummary: string;
  dialogues: DialogueItem[];
  keyConcept?: {
    title: string;
    description: string;
  };
  hotspots?: InteractiveHotspot[];
  quizQuestions?: QuizQuestion[];
}

export type ReadingMode = 'flip' | 'scroll';
