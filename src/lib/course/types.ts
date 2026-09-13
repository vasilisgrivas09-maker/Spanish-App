export interface VocabItem {
  es: string;
  gr: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  unit: number;
  items: VocabItem[];
}

export interface Stats {
  totalCorrect: number;
  totalAnswered: number;
  xp: number;
}

export type ThemeSetting = "dark" | "light";
export type FontScaleSetting = "normal" | "large" | "xl";
export type SpeechRateSetting = "slow" | "normal" | "fast";
export type AccentSetting = "es-ES" | "es-MX";

export interface Settings {
  theme: ThemeSetting;
  fontScale: FontScaleSetting;
  speechRate: SpeechRateSetting;
  accent: AccentSetting;
  oneHanded: boolean;
}

export interface GrammarQuestion {
  prompt: string;
  answer: string;
  options: string[];
  explanation: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  subtitle: string;
  intro: string;
  points: string[];
  examples: string[];
  questions: GrammarQuestion[];
}

export interface DialogueChoice {
  es: string;
  gr: string;
  correct?: boolean;
}

export interface DialogueTurn {
  speaker: string;
  es: string;
  gr: string;
  choices: DialogueChoice[];
}

export interface Dialogue {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  turns: DialogueTurn[];
}

export interface SpeakingPhrase {
  es: string;
  gr: string;
  focus: string;
}

export interface SentenceQuestion {
  prompt: string;
  answer: string;
  gr: string;
  item: VocabItem;
}

export interface ErrorQuestion {
  prompt: string;
  answer: string;
  options: string[];
  item: VocabItem;
}

export interface GenderQuestion {
  prompt: string;
  answer: string;
  options: string[];
  item: VocabItem;
}

export interface TrapQuestion {
  prompt: string;
  answer: string;
  options: string[];
  item: VocabItem;
}

export type QuizDirection = "es2gr" | "gr2es";

export type QuizQuestionType =
  | "mc"
  | "fill"
  | "type"
  | "sentence"
  | "error"
  | "gender"
  | "trap"
  | "listen"
  | "match";

export interface BaseQuizQuestion {
  type: QuizQuestionType;
  prompt: string;
  answer: string;
  direction: QuizDirection;
  item?: VocabItem;
  options?: string[];
  left?: string[];
  right?: string[];
  pairs?: VocabItem[];
}

export type FeedbackState = "correct" | "wrong" | null;

export interface QuizSession {
  catId: string;
  question: BaseQuizQuestion;
  score: { correct: number; total: number };
  streak: number;
  feedback: FeedbackState;
  fillText: string;
  matchSelected: string | null;
  matchMatched: Set<string>;
}

export interface GrammarSession {
  id: string;
  index: number;
  score: number;
  selected: string | null;
}

export interface DialogueSession {
  id: string;
  index: number;
  selected: number | null;
  feedback: FeedbackState;
  voice: SpeechResult | null;
  history: Array<{ prompt: DialogueTurn; choice: DialogueChoice }>;
}

export interface SpeakingSession {
  index: number;
  result: SpeechResult | null;
  status: string;
}

export interface SpeechResult {
  transcript?: string;
  score?: number;
  expected?: string;
  error?: string;
}

export type CategoryModal = { type: "category"; color: string };
export type WordModal = { type: "word" };
export type ModalState = CategoryModal | WordModal | null;

export interface ProgressBackup {
  format: "espanol-course-backup";
  version: 1;
  exportedAt: string;
  categories: Category[];
  stats: Stats;
  mistakes: VocabItem[];
  settings: Settings;
}

declare global {
  interface Window {
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
    __spanishRecognition?: SpeechRecognition | null;
    go?: (hash: string) => void;
  }
}
