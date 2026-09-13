import fs from "node:fs";

let logic = fs.readFileSync("src/lib/course/_raw-logic.js", "utf8");

// Remove helpers now provided by utils (keep behavior identical via imports)
const removeFns = [
  /function clone\(value\) \{ return JSON\.parse\(JSON\.stringify\(value\)\); \}\n/,
  /function esc\(value\) \{\n[\s\S]*?\n    \}\n/,
  /function generateId\(\) \{ return Date\.now\(\)\.toString\(\) \+ Math\.random\(\)\.toString\(36\)\.slice\(2, 11\); \}\n/,
  /function totalWords\(list\) \{ return list\.reduce\(\(sum, cat\) => sum \+ cat\.items\.length, 0\); \}\n/,
  /function normalizeAnswer\(value\) \{\n[\s\S]*?\n    \}\n/,
  /function shuffle\(list\) \{\n[\s\S]*?\n    \}\n/,
  /function speechRate\(\) \{\n[\s\S]*?\n    \}\n/,
  /function normalizeSpeech\(value\) \{\n[\s\S]*?\n    \}\n/,
  /function compareSpeech\(spoken, expected\) \{\n[\s\S]*?\n    \}\n/,
  /function mistakeKey\(item\) \{ return item\.es \+ "\|\|" \+ item\.gr; \}\n/,
];

for (const re of removeFns) {
  if (!re.test(logic)) {
    console.warn("pattern not found", re);
  }
  logic = logic.replace(re, "");
}

// Replace #app lookups
logic = logic.replaceAll('document.querySelector("#app")', "root");

// speechRate() calls -> speechRateFromSetting(settings.speechRate)
logic = logic.replaceAll("speechRate()", "speechRateFromSetting(settings.speechRate)");

// Fix INITIAL_CATEGORIES reference - already imported
logic = logic.replace(
  "let categories = clone(INITIAL_CATEGORIES);",
  "let categories: Category[] = clone(INITIAL_CATEGORIES);",
);
logic = logic.replace(
  "let stats = { totalCorrect: 0, totalAnswered: 0, xp: 0 };",
  "let stats: Stats = { totalCorrect: 0, totalAnswered: 0, xp: 0 };",
);
logic = logic.replace("let loaded = false;", "let loaded = false;");
logic = logic.replace("let activeUnit = 1;", "let activeUnit = 1;");
logic = logic.replace('let browseSearch = "";', 'let browseSearch = "";');
logic = logic.replace("let modal = null;", "let modal: ModalState = null;");
logic = logic.replace("let quizSession = null;", "let quizSession: QuizSession | null = null;");
logic = logic.replace("let grammarSession = null;", "let grammarSession: GrammarSession | null = null;");
logic = logic.replace("let mistakes = [];", "let mistakes: VocabItem[] = [];");
logic = logic.replace(
  'let settings = { theme: "dark", fontScale: "normal", speechRate: "normal", accent: "es-ES", oneHanded: false };',
  'let settings: Settings = { theme: "dark", fontScale: "normal", speechRate: "normal", accent: "es-ES", oneHanded: false };',
);
logic = logic.replace("let dialogueSession = null;", "let dialogueSession: DialogueSession | null = null;");
logic = logic.replace("let speakingSession = null;", "let speakingSession: SpeakingSession | null = null;");

// Function signatures that need typing for TS
logic = logic.replace(
  "function save() {",
  "function save(): void {",
);
logic = logic.replace(
  "function load() {",
  "function load(): void {",
);
logic = logic.replace(
  "function updateState() { save(); render(); }",
  "function updateState(): void { save(); render(); }",
);
logic = logic.replace(
  "function go(hash) { location.hash = hash; }",
  "function go(hash: string): void { location.hash = hash; }",
);
logic = logic.replace(
  "function closeModal() { modal = null; render(); }",
  "function closeModal(): void { modal = null; render(); }",
);
logic = logic.replace(
  "function applySettings() {",
  "function applySettings(): void {",
);
logic = logic.replace(
  "function speak(text) {",
  "function speak(text: string): void {",
);
logic = logic.replace(
  "function speechRecognitionAvailable() {",
  "function speechRecognitionAvailable(): boolean {",
);
logic = logic.replace(
  "function startRecognition(expected, onDone) {",
  "function startRecognition(expected: string, onDone: (result: SpeechResult) => void): void {",
);
logic = logic.replace(
  "function addMistake(item) {",
  "function addMistake(item: VocabItem | undefined): void {",
);
logic = logic.replace(
  "function resolveMistake(item) {",
  "function resolveMistake(item: VocabItem | undefined): void {",
);
logic = logic.replace(
  "function attachSpeakerEvents() {",
  "function attachSpeakerEvents(): void {",
);
logic = logic.replace(
  "function render() {",
  "function render(): void {",
);
logic = logic.replace(
  "function renderHome() {",
  "function renderHome(): void {",
);
logic = logic.replace(
  "function renderCategoryCard(cat) {",
  "function renderCategoryCard(cat: Category): string {",
);
logic = logic.replace(
  "function renderCategoryModal() {",
  "function renderCategoryModal(): string {",
);
logic = logic.replace(
  "function attachModalEvents() {",
  "function attachModalEvents(): void {",
);
logic = logic.replace(
  "function renderBrowse(catId) {",
  "function renderBrowse(catId: string): void {",
);
logic = logic.replace(
  "function renderWordModal(cat) {",
  "function renderWordModal(cat: Category): string {",
);
logic = logic.replace(
  "function attachWordModalEvents(cat) {",
  "function attachWordModalEvents(cat: Category): void {",
);
logic = logic.replace(
  "function getPool(catId) {",
  "function getPool(catId: string): VocabItem[] {",
);
logic = logic.replace(
  "function genQuestion(pool) {",
  "function genQuestion(pool: VocabItem[]): BaseQuizQuestion {",
);
logic = logic.replace(
  "function genMC(pool) {",
  "function genMC(pool: VocabItem[]): BaseQuizQuestion {",
);
logic = logic.replace(
  "function genFill(pool) {",
  "function genFill(pool: VocabItem[]): BaseQuizQuestion {",
);
logic = logic.replace(
  "function genTyping(pool) {",
  "function genTyping(pool: VocabItem[]): BaseQuizQuestion {",
);
logic = logic.replace(
  "function genSentence() {",
  "function genSentence(): BaseQuizQuestion {",
);
logic = logic.replace(
  "function genError() {",
  "function genError(): BaseQuizQuestion {",
);
logic = logic.replace(
  "function genGender() {",
  "function genGender(): BaseQuizQuestion {",
);
logic = logic.replace(
  "function genTrap() {",
  "function genTrap(): BaseQuizQuestion {",
);
logic = logic.replace(
  "function genListen(pool) {",
  "function genListen(pool: VocabItem[]): BaseQuizQuestion {",
);
logic = logic.replace(
  "function genMatch(pool) {",
  "function genMatch(pool: VocabItem[]): BaseQuizQuestion {",
);
logic = logic.replace(
  "function newQuizSession(catId) {",
  "function newQuizSession(catId: string): QuizSession {",
);
logic = logic.replace(
  "function renderQuiz(catId) {",
  "function renderQuiz(catId: string): void {",
);
logic = logic.replace(
  "function renderMC(q, session) {",
  "function renderMC(q: BaseQuizQuestion, session: QuizSession): string {",
);
logic = logic.replace(
  "function renderFill(q, session, accent) {",
  "function renderFill(q: BaseQuizQuestion, session: QuizSession, accent: string): string {",
);
logic = logic.replace(
  "function renderTyping(q, session, accent) {",
  "function renderTyping(q: BaseQuizQuestion, session: QuizSession, accent: string): string {",
);
logic = logic.replace(
  "function renderChoice(q, session, label) {",
  "function renderChoice(q: BaseQuizQuestion, session: QuizSession, label: string): string {",
);
logic = logic.replace(
  "function renderListen(q, session, accent) {",
  "function renderListen(q: BaseQuizQuestion, session: QuizSession, accent: string): string {",
);
logic = logic.replace(
  "function renderMatch(q, session, accent) {",
  "function renderMatch(q: BaseQuizQuestion, session: QuizSession, accent: string): string {",
);
logic = logic.replace(
  "function attachQuizEvents(q, accent) {",
  "function attachQuizEvents(q: BaseQuizQuestion, accent: string): void {",
);
logic = logic.replace(
  "function flashFeedback(correct) {",
  "function flashFeedback(correct: boolean): void {",
);
logic = logic.replace(
  "function handleFill() {",
  "function handleFill(): void {",
);
logic = logic.replace(
  "function nextQuestion() {",
  "function nextQuestion(): void {",
);
logic = logic.replace(
  "function renderGrammar(lessonId) {",
  "function renderGrammar(lessonId: string): void {",
);
logic = logic.replace(
  "function renderDialogues() {",
  "function renderDialogues(): void {",
);
logic = logic.replace(
  "function renderDialogue(dialogueId) {",
  "function renderDialogue(dialogueId: string): void {",
);
logic = logic.replace(
  "function renderSpeaking() {",
  "function renderSpeaking(): void {",
);
logic = logic.replace(
  "function exportProgress() {",
  "function exportProgress(): void {",
);
logic = logic.replace(
  "function importProgress() {",
  "function importProgress(): void {",
);
logic = logic.replace(
  "function renderSettings() {",
  "function renderSettings(): void {",
);

// Fix catch empty bindings
logic = logic.replaceAll("catch (_)", "catch");
logic = logic.replaceAll("catch (_)", "catch");

// import validation in importProgress
logic = logic.replace(
  `const payload = JSON.parse(await file.text());
          if (!payload || !Array.isArray(payload.categories) || !payload.stats) throw new Error("invalid");
          if (!confirm("Η εισαγωγή θα αντικαταστήσει την τρέχουσα πρόοδο και τις δικές σου κατηγορίες. Συνέχεια;")) return;
          categories = payload.categories; stats = { ...stats, ...payload.stats }; mistakes = Array.isArray(payload.mistakes) ? payload.mistakes : [];
          if (payload.settings) settings = { ...settings, ...payload.settings };`,
  `const payload = parseProgressBackup(JSON.parse(await file.text()));
          if (!confirm("Η εισαγωγή θα αντικαταστήσει την τρέχουσα πρόοδο και τις δικές σου κατηγορίες. Συνέχεια;")) return;
          categories = payload.categories; stats = { ...stats, ...payload.stats }; mistakes = payload.mistakes;
          settings = { ...settings, ...payload.settings };`,
);

// DOM event helpers - cast querySelector results carefully via as HTMLElement where needed
// Replace common patterns for TS
logic = logic.replaceAll(
  'document.querySelectorAll("[data-speak]").forEach((button) => button.addEventListener("click", (event) => {\n        event.stopPropagation();\n        speak(button.dataset.speak);\n      }));',
  `document.querySelectorAll<HTMLElement>("[data-speak]").forEach((button) => button.addEventListener("click", (event) => {
        event.stopPropagation();
        speak(button.dataset.speak ?? "");
      }));`,
);

const header = `import {
  DIALOGUES,
  ERROR_QUESTIONS,
  GENDER_QUESTIONS,
  GRAMMAR_LESSONS,
  INITIAL_CATEGORIES,
  PRESET_COLORS,
  SENTENCE_QUESTIONS,
  SPEAKING_PHRASES,
  STORAGE_KEY_CATEGORIES,
  STORAGE_KEY_MISTAKES,
  STORAGE_KEY_SETTINGS,
  STORAGE_KEY_STATS,
  TRAP_QUESTIONS,
  UNIT2_CATEGORIES,
  CATEGORY_ICONS,
} from "./data";
import { parseProgressBackup } from "./backup";
import type {
  BaseQuizQuestion,
  Category,
  DialogueChoice,
  DialogueSession,
  DialogueTurn,
  GrammarSession,
  ModalState,
  QuizSession,
  Settings,
  SpeakingSession,
  SpeechResult,
  Stats,
  VocabItem,
} from "./types";
import {
  clone,
  compareSpeech,
  esc,
  generateId,
  mistakeKey,
  normalizeAnswer,
  normalizeSpeech,
  shuffle,
  speechRateFromSetting,
  totalWords,
} from "./utils";

export function mountSpanishCourse(root: HTMLElement): () => void {
`;

const footer = `
  const onHashChange = (): void => {
    browseSearch = "";
    render();
  };

  load();
  window.addEventListener("hashchange", onHashChange);
  window.go = go;
  render();

  return () => {
    window.removeEventListener("hashchange", onHashChange);
    if (window.__spanishRecognition) {
      window.__spanishRecognition.abort();
      window.__spanishRecognition = null;
    }
    if (window.go === go) {
      delete window.go;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };
}
`;

// Remove original bootstrapping at end
logic = logic.replace(
  /load\(\);\n\s*window\.addEventListener\("hashchange", \(\) => \{ browseSearch = ""; render\(\); \}\);\n\s*window\.go = go;\n\s*render\(\);\s*$/,
  "",
);

const output = `${header}\n${logic}\n${footer}\n`;
fs.writeFileSync("src/lib/course/mount-app.ts", output);
console.log("wrote mount-app.ts", output.length);
