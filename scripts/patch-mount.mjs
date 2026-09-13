import fs from "node:fs";

let src = fs.readFileSync("src/lib/course/mount-app.ts", "utf8");

if (!src.includes('from "./dom"')) {
  src = src.replace(
    'from "./utils";',
    `from "./utils";
import { el, els, maybeEl } from "./dom";`,
  );
}

// Prefer typed helpers for common ids/selectors inside mount
const replacements = [
  ['document.querySelector("[data-close-modal]")', 'el<HTMLButtonElement>("[data-close-modal]")'],
  ['document.querySelector("#modal-layer")', 'el<HTMLElement>("#modal-layer")'],
  ['document.querySelector("#new-category-name")', 'el<HTMLInputElement>("#new-category-name")'],
  ['document.querySelector("#create-category")', 'el<HTMLButtonElement>("#create-category")'],
  ['document.querySelector("#category-form")', 'el<HTMLFormElement>("#category-form")'],
  ['document.querySelector("#browse-back")', 'el<HTMLButtonElement>("#browse-back")'],
  ['document.querySelector("#add-word")', 'el<HTMLButtonElement>("#add-word")'],
  ['document.querySelector("#delete-category")', 'el<HTMLButtonElement>("#delete-category")'],
  ['document.querySelector("#category-quiz")', 'el<HTMLButtonElement>("#category-quiz")'],
  ['document.querySelector("#word-search")', 'el<HTMLInputElement>("#word-search")'],
  ['document.querySelector("#clear-search")', 'el<HTMLButtonElement>("#clear-search")'],
  ['document.querySelector("#empty-add")', 'maybeEl<HTMLButtonElement>("#empty-add")'],
  ['document.querySelector("#word-form")', 'el<HTMLFormElement>("#word-form")'],
  ['document.querySelector("#new-es")', 'el<HTMLInputElement>("#new-es")'],
  ['document.querySelector("#new-gr")', 'el<HTMLInputElement>("#new-gr")'],
  ['document.querySelector("#create-word")', 'el<HTMLButtonElement>("#create-word")'],
  ['document.querySelector("#empty-mistakes-back")', 'el<HTMLButtonElement>("#empty-mistakes-back")'],
  ['document.querySelector("#empty-mistakes-home")', 'el<HTMLButtonElement>("#empty-mistakes-home")'],
  ['document.querySelector("#quiz-back")', 'el<HTMLButtonElement>("#quiz-back")'],
  ['document.querySelector("#fill-answer")', 'maybeEl<HTMLInputElement>("#fill-answer")'],
  ['document.querySelector("#submit-fill")', 'maybeEl<HTMLButtonElement>("#submit-fill")'],
  ['document.querySelector("#grammar-back")', 'el<HTMLButtonElement>("#grammar-back")'],
  ['document.querySelector("#grammar-restart")', 'el<HTMLButtonElement>("#grammar-restart")'],
  ['document.querySelector("#grammar-home")', 'el<HTMLButtonElement>("#grammar-home")'],
  ['document.querySelector("#grammar-next")', 'maybeEl<HTMLButtonElement>("#grammar-next")'],
  ['document.querySelector("#dialogues-back")', 'el<HTMLButtonElement>("#dialogues-back")'],
  ['document.querySelector("#dialogue-back")', 'el<HTMLButtonElement>("#dialogue-back")'],
  ['document.querySelector("#dialogue-home")', 'el<HTMLButtonElement>("#dialogue-home")'],
  ['document.querySelector("#dialogue-restart")', 'el<HTMLButtonElement>("#dialogue-restart")'],
  ['document.querySelector("#dialogue-list")', 'el<HTMLButtonElement>("#dialogue-list")'],
  ['document.querySelector("#dialogue-next")', 'maybeEl<HTMLButtonElement>("#dialogue-next")'],
  ['document.querySelector("#dialogue-speak-choice")', 'maybeEl<HTMLButtonElement>("#dialogue-speak-choice")'],
  ['document.querySelector("#dialogue-mic")', 'maybeEl<HTMLButtonElement>("#dialogue-mic")'],
  ['document.querySelector("#speaking-back")', 'el<HTMLButtonElement>("#speaking-back")'],
  ['document.querySelector("#speaking-list")', 'el<HTMLButtonElement>("#speaking-list")'],
  ['document.querySelector("#start-mic")', 'el<HTMLButtonElement>("#start-mic")'],
  ['document.querySelector("#next-speaking")', 'maybeEl<HTMLButtonElement>("#next-speaking")'],
  ['document.querySelector("#settings-back")', 'el<HTMLButtonElement>("#settings-back")'],
  ['document.querySelector("#setting-theme")', 'el<HTMLSelectElement>("#setting-theme")'],
  ['document.querySelector("#setting-font")', 'el<HTMLSelectElement>("#setting-font")'],
  ['document.querySelector("#setting-rate")', 'el<HTMLSelectElement>("#setting-rate")'],
  ['document.querySelector("#setting-accent")', 'el<HTMLSelectElement>("#setting-accent")'],
  ['document.querySelector("#setting-one-hand")', 'el<HTMLButtonElement>("#setting-one-hand")'],
  ['document.querySelector("#export-progress")', 'el<HTMLButtonElement>("#export-progress")'],
  ['document.querySelector("#import-progress")', 'el<HTMLButtonElement>("#import-progress")'],
  ['document.querySelector("#unit-quiz")', 'el<HTMLButtonElement>("#unit-quiz")'],
  ['document.querySelector("#all-quiz")', 'el<HTMLButtonElement>("#all-quiz")'],
  ['document.querySelector("#mistakes-quiz")', 'el<HTMLButtonElement>("#mistakes-quiz")'],
  ['document.querySelector("#dialogues-link")', 'el<HTMLButtonElement>("#dialogues-link")'],
  ['document.querySelector("#speaking-link")', 'el<HTMLButtonElement>("#speaking-link")'],
  ['document.querySelector("#settings-link")', 'el<HTMLButtonElement>("#settings-link")'],
  ['document.querySelector("#backup-link")', 'el<HTMLButtonElement>("#backup-link")'],
  ['document.querySelector("#add-category")', 'el<HTMLButtonElement>("#add-category")'],
];

for (const [from, to] of replacements) {
  src = src.split(from).join(to);
}

src = src.replaceAll(
  'document.querySelectorAll("[data-unit]").forEach((button) => button.addEventListener("click", () => { activeUnit = Number(button.dataset.unit); render(); }));',
  'els<HTMLElement>("[data-unit]").forEach((button) => button.addEventListener("click", () => { activeUnit = Number(button.dataset.unit); render(); }));',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-browse]").forEach((button) => button.addEventListener("click", () => go("#browse/" + button.dataset.browse)));',
  'els<HTMLElement>("[data-browse]").forEach((button) => button.addEventListener("click", () => go("#browse/" + button.dataset.browse)));',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-quiz]").forEach((button) => button.addEventListener("click", () => go("#quiz/" + button.dataset.quiz)));',
  'els<HTMLElement>("[data-quiz]").forEach((button) => button.addEventListener("click", () => go("#quiz/" + button.dataset.quiz)));',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-grammar]").forEach((button) => button.addEventListener("click", () => go("#grammar/" + button.dataset.grammar)));',
  'els<HTMLElement>("[data-grammar]").forEach((button) => button.addEventListener("click", () => go("#grammar/" + button.dataset.grammar)));',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-color]").forEach((button) => button.addEventListener("click", () => { modal.color = button.dataset.color; render(); }));',
  'els<HTMLElement>("[data-color]").forEach((button) => button.addEventListener("click", () => { if (modal && modal.type === "category") { modal.color = button.dataset.color ?? PRESET_COLORS[0]; render(); } }));',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => flashFeedback(button.dataset.answer === q.answer)));',
  'els<HTMLElement>("[data-answer]").forEach((button) => button.addEventListener("click", () => flashFeedback(button.dataset.answer === q.answer)));',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-match-left]").forEach((button) => button.addEventListener("click", () => { session.matchSelected = button.dataset.matchLeft; renderQuiz(session.catId); }));',
  'els<HTMLElement>("[data-match-left]").forEach((button) => button.addEventListener("click", () => { session.matchSelected = button.dataset.matchLeft ?? null; renderQuiz(session.catId); }));',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-match-right]").forEach((button) => button.addEventListener("click", () => {',
  'els<HTMLElement>("[data-match-right]").forEach((button) => button.addEventListener("click", () => {',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-grammar-answer]").forEach((button) => button.addEventListener("click", () => {',
  'els<HTMLElement>("[data-grammar-answer]").forEach((button) => button.addEventListener("click", () => {',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-dialogue]").forEach((button) => button.addEventListener("click", () => go("#dialogue/" + button.dataset.dialogue)));',
  'els<HTMLElement>("[data-dialogue]").forEach((button) => button.addEventListener("click", () => go("#dialogue/" + button.dataset.dialogue)));',
);
src = src.replaceAll(
  'document.querySelectorAll("[data-choice-index]").forEach((button) => button.addEventListener("click", () => {',
  'els<HTMLElement>("[data-choice-index]").forEach((button) => button.addEventListener("click", () => {',
);

// modal color in templates
src = src.replaceAll(
  "modal.color === color",
  '(modal && modal.type === "category" ? modal.color : "") === color',
);
src = src.replaceAll(
  "color: modal.color || PRESET_COLORS[0]",
  'color: (modal && modal.type === "category" ? modal.color : PRESET_COLORS[0]) || PRESET_COLORS[0]',
);

// renderMC third arg
src = src.replace(
  "function renderMC(q: BaseQuizQuestion, session: QuizSession): string {",
  "function renderMC(q: BaseQuizQuestion, session: QuizSession, _accent?: string): string {",
);

// load() parsed categories typing
src = src.replace(
  "categories = parsed.some((cat) => cat.unit === 2) ? parsed : [...parsed, ...clone(UNIT2_CATEGORIES)];",
  "const parsedCategories = parsed as Category[]; categories = parsedCategories.some((cat: Category) => cat.unit === 2) ? parsedCategories : [...parsedCategories, ...clone(UNIT2_CATEGORIES)];",
);

// event target id checks
src = src.replaceAll(
  'if (event.target.id === "modal-layer") closeModal();',
  'if ((event.target as HTMLElement).id === "modal-layer") closeModal();',
);

// settings change handlers
src = src.replaceAll(
  '(event) => { settings.theme = event.target.value;',
  '(event) => { settings.theme = (event.target as HTMLSelectElement).value as Settings["theme"];',
);
src = src.replaceAll(
  '(event) => { settings.fontScale = event.target.value;',
  '(event) => { settings.fontScale = (event.target as HTMLSelectElement).value as Settings["fontScale"];',
);
src = src.replaceAll(
  '(event) => { settings.speechRate = event.target.value;',
  '(event) => { settings.speechRate = (event.target as HTMLSelectElement).value as Settings["speechRate"];',
);
src = src.replaceAll(
  '(event) => { settings.accent = event.target.value;',
  '(event) => { settings.accent = (event.target as HTMLSelectElement).value as Settings["accent"];',
);

// optional chaining for maybeEl uses that previously assumed non-null for emptyAdd
src = src.replace(
  "if (emptyAdd) emptyAdd.addEventListener",
  "if (emptyAdd) emptyAdd.addEventListener",
);

// attachSpeakerEvents already patched in earlier generation maybe
if (!src.includes("querySelectorAll<HTMLElement>")) {
  // already handled
}

// Fix options/left access with fallbacks in template strings - patch function bodies for choice renders
src = src.replace(
  "q.options.map((option) =>",
  "(q.options ?? []).map((option) =>",
);
src = src.replaceAll(
  "(q.options ?? []).map((option) =>",
  "(q.options ?? []).map((option) =>",
);

// For match renderer - ensure pairs/left/right
src = src.replace(
  "function renderMatch(q: BaseQuizQuestion, session: QuizSession, accent: string): string {",
  "function renderMatch(q: BaseQuizQuestion, session: QuizSession, accent: string): string {\n      const left = q.left ?? [];\n      const right = q.right ?? [];\n      const pairs = q.pairs ?? [];",
);
src = src.replace(
  "q.left.map((word, index) =>",
  "left.map((word) =>",
);
src = src.replace(
  "q.right.map((gr) => { const pair = q.pairs.find((item) => item.gr === gr);",
  "right.map((gr) => { const pair = pairs.find((item) => item.gr === gr);",
);
src = src.replace(
  "${session.matchMatched.size}/${q.pairs.length} ζευγάρια",
  "${session.matchMatched.size}/${pairs.length} ζευγάρια",
);

// match events use q.pairs
src = src.replace(
  "const pair = q.pairs.find((item) => item.es === session.matchSelected);",
  "const pair = (q.pairs ?? []).find((item) => item.es === session.matchSelected);",
);
src = src.replace(
  "if (session.matchMatched.size === q.pairs.length)",
  "if (session.matchMatched.size === (q.pairs ?? []).length)",
);
src = src.replace(
  "q.pairs.forEach((item) => resolveMistake(item));",
  "(q.pairs ?? []).forEach((item) => resolveMistake(item));",
);

// flashFeedback item optional
src = src.replaceAll(
  "resolveMistake(session.question.item);",
  "resolveMistake(session.question.item);",
);

// Direction access on choice questions in renderers - add guards via casts where needed
src = src.replace(
  "function renderMC(q: BaseQuizQuestion, session: QuizSession, _accent?: string): string {\n      const label = q.direction === \"es2gr\"",
  'function renderMC(q: BaseQuizQuestion, session: QuizSession, _accent?: string): string {\n      if (q.type === "match") return "";\n      const label = q.direction === "es2gr"',
);
src = src.replace(
  "function renderFill(q: BaseQuizQuestion, session: QuizSession, accent: string): string {\n      const border",
  'function renderFill(q: BaseQuizQuestion, session: QuizSession, accent: string): string {\n      if (q.type === "match") return "";\n      const border',
);
src = src.replace(
  "function renderTyping(q: BaseQuizQuestion, session: QuizSession, accent: string): string {\n      const border",
  'function renderTyping(q: BaseQuizQuestion, session: QuizSession, accent: string): string {\n      if (q.type === "match") return "";\n      const border',
);
src = src.replace(
  "function renderChoice(q: BaseQuizQuestion, session: QuizSession, label: string): string {\n      return",
  'function renderChoice(q: BaseQuizQuestion, session: QuizSession, label: string): string {\n      if (q.type === "match") return "";\n      return',
);
src = src.replace(
  "function renderListen(q: BaseQuizQuestion, session: QuizSession, accent: string): string {\n      return",
  'function renderListen(q: BaseQuizQuestion, session: QuizSession, accent: string): string {\n      if (q.type === "match") return "";\n      return',
);

fs.writeFileSync("src/lib/course/mount-app.ts", src);
console.log("patched mount-app.ts");
