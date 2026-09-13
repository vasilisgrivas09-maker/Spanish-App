import {
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
  DialogueSession,
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
  shuffle,
  speechRateFromSetting,
  totalWords,
} from "./utils";
import { el, els, maybeEl } from "./dom";

export function mountSpanishCourse(root: HTMLElement): () => void {

let categories: Category[] = clone(INITIAL_CATEGORIES);
    let stats: Stats = { totalCorrect: 0, totalAnswered: 0, xp: 0 };
    let loaded = false;
    let activeUnit = 1;
    let browseSearch = "";
    let modal: ModalState = null;
    let quizSession: QuizSession | null = null;
    let grammarSession: GrammarSession | null = null;
    let mistakes: VocabItem[] = [];
    let settings: Settings = { theme: "dark", fontScale: "normal", speechRate: "normal", accent: "es-ES", oneHanded: false };
    let dialogueSession: DialogueSession | null = null;
    let speakingSession: SpeakingSession | null = null;

                            function save(): void {
      try {
        localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
        localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
        localStorage.setItem(STORAGE_KEY_MISTAKES, JSON.stringify(mistakes));
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      } catch {}
    }
    function load(): void {
      try {
        const storedCategories = localStorage.getItem(STORAGE_KEY_CATEGORIES);
        const storedStats = localStorage.getItem(STORAGE_KEY_STATS);
        const storedMistakes = localStorage.getItem(STORAGE_KEY_MISTAKES);
        if (storedCategories) {
          const parsed = JSON.parse(storedCategories);
          const parsedCategories = parsed as Category[]; categories = parsedCategories.some((cat: Category) => cat.unit === 2) ? parsedCategories : [...parsedCategories, ...clone(UNIT2_CATEGORIES)];
        }
        if (storedStats) stats = { ...stats, ...JSON.parse(storedStats) };
        if (storedMistakes) mistakes = JSON.parse(storedMistakes);
        const storedSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);
        if (storedSettings) settings = { ...settings, ...JSON.parse(storedSettings) };
      } catch {}
      loaded = true;
      applySettings();
    }
    function updateState(): void { save(); render(); }
    function go(hash: string): void { location.hash = hash; }
    function closeModal(): void { modal = null; render(); }
    function applySettings(): void {
      document.documentElement.dataset.theme = settings.theme === "light" ? "light" : "dark";
      document.documentElement.dataset.font = settings.fontScale === "xl" ? "xl" : settings.fontScale === "large" ? "large" : "normal";
      document.documentElement.dataset.oneHand = settings.oneHanded ? "true" : "false";
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", settings.theme === "light" ? "#f5f6fa" : "#070714");
    }
        function speak(text: string): void {
      if (!("speechSynthesis" in window) || !text) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = settings.accent || "es-ES";
      utterance.rate = speechRateFromSetting(settings.speechRate);
      window.speechSynthesis.speak(utterance);
    }
    function speechRecognitionAvailable(): boolean {
      return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    }
    function startRecognition(expected: string, onDone: (result: SpeechResult) => void): void {
      const RecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!RecognitionCtor) {
        onDone({ error: "Ο browser δεν υποστηρίζει αναγνώριση ομιλίας. Δοκίμασε Chrome ή Edge." });
        return;
      }
      if (window.__spanishRecognition) window.__spanishRecognition.abort();
      const recognition = new RecognitionCtor();
      window.__spanishRecognition = recognition;
      recognition.lang = settings.accent || "es-ES";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript ?? "";
        onDone({ transcript, score: compareSpeech(transcript, expected), expected });
      };
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => onDone({ error: event.error === "not-allowed" ? "Χρειάζεται άδεια για το μικρόφωνο." : "Δεν ακούστηκε καθαρά. Δοκίμασε ξανά." });
      recognition.onend = () => { if (window.__spanishRecognition === recognition) window.__spanishRecognition = null; };
      recognition.start();
    }
        function addMistake(item: VocabItem | undefined): void {
      if (!item) return;
      if (!mistakes.some((entry) => mistakeKey(entry) === mistakeKey(item))) mistakes.push({ es: item.es, gr: item.gr });
    }
    function resolveMistake(item: VocabItem | undefined): void {
      if (!item) return;
      mistakes = mistakes.filter((entry) => mistakeKey(entry) !== mistakeKey(item));
    }
    function attachSpeakerEvents(): void {
      document.querySelectorAll<HTMLElement>("[data-speak]").forEach((button) => button.addEventListener("click", (event) => {
        event.stopPropagation();
        speak(button.dataset.speak ?? "");
      }));
    }

    function render(): void {
      if (!loaded) return;
      const route = location.hash || "#home";
      if (route.startsWith("#browse/")) renderBrowse(route.slice(7));
      else if (route.startsWith("#quiz/")) renderQuiz(route.slice(6));
      else if (route.startsWith("#grammar/")) renderGrammar(route.slice(9));
      else if (route === "#dialogues") renderDialogues();
      else if (route.startsWith("#dialogue/")) renderDialogue(route.slice(9));
      else if (route === "#speaking") renderSpeaking();
      else if (route === "#settings") renderSettings();
      else renderHome();
    }

    function renderHome(): void {
      quizSession = null;
      grammarSession = null;
      const unitCats = categories.filter((cat) => (cat.unit || 1) === activeUnit);
      const all = totalWords(categories);
      const unitCount = totalWords(unitCats);
      const accuracy = stats.totalAnswered > 0 ? Math.round(stats.totalCorrect / stats.totalAnswered * 100) : null;
      root.innerHTML = `
        <section class="screen">
          <header class="header">
            <div><h1 class="header-title"><span>Español</span> Course</h1><p class="header-sub">Το προσωπικό σου μάθημα</p></div>
            <div class="header-right"><div class="xp-text">⚡ ${stats.xp} XP</div>${accuracy !== null ? `<div class="accuracy-text">${accuracy}% ακρίβεια</div>` : ""}<div class="words-text">${all} λέξεις σύνολο</div></div>
          </header>
          <div class="tabs">
            <button class="tab ${activeUnit === 1 ? "active" : ""}" data-unit="1"><span class="tab-title">Ενότητα 1</span><span class="tab-sub">${totalWords(categories.filter((c) => (c.unit || 1) === 1))} λέξεις</span></button>
            <button class="tab ${activeUnit === 2 ? "active" : ""}" data-unit="2"><span class="tab-title">Ενότητα 2</span><span class="tab-sub">${totalWords(categories.filter((c) => c.unit === 2))} λέξεις</span></button>
          </div>
          <div class="scroll"><div class="content">
            <button class="big-button" id="unit-quiz"><span><span class="big-button-title">Quiz — Ενότητα ${activeUnit}</span><span class="big-button-sub">${unitCount} λέξεις · Όλοι οι τύποι ασκήσεων</span></span><span class="arrow">▶</span></button>
            <button class="all-button" id="all-quiz"><span>🌍 Quiz — Όλο το Λεξιλόγιο (${all} λέξεις)</span><span class="arrow">→</span></button>
            <button class="review-button" id="mistakes-quiz" ${mistakes.length ? "" : "disabled"}><span>↻ &nbsp; Επανάληψη λαθών (${mistakes.length})</span><span>→</span></button>
             <div class="quick-grid">
               <button class="quick-card" id="dialogues-link"><span class="quick-card-icon">💬</span><span class="quick-card-title">Μικροί διάλογοι</span><span class="quick-card-sub">Γραπτή και προφορική εξάσκηση</span></button>
               <button class="quick-card" id="speaking-link"><span class="quick-card-icon">🎙️</span><span class="quick-card-title">Προφορική εξάσκηση</span><span class="quick-card-sub">Μίλησε και πάρε βαθμολογία</span></button>
               <button class="quick-card" id="settings-link"><span class="quick-card-icon">⚙️</span><span class="quick-card-title">Ρυθμίσεις</span><span class="quick-card-sub">Θέμα, ήχος και προσβασιμότητα</span></button>
               <button class="quick-card" id="backup-link"><span class="quick-card-icon">💾</span><span class="quick-card-title">Backup προόδου</span><span class="quick-card-sub">Export ή import αρχείου JSON</span></button>
             </div>
            <div class="section-header"><span class="section-label">ΚΑΤΗΓΟΡΙΕΣ — ΕΝΟΤΗΤΑ ${activeUnit}</span><button class="round-button" id="add-category" aria-label="Προσθήκη κατηγορίας">+</button></div>
            ${unitCats.length ? unitCats.map(renderCategoryCard).join("") : `<div class="empty-state">Δεν υπάρχουν κατηγορίες ακόμα</div>`}
            <div class="section-header" style="margin-top:24px"><span class="section-label">ΜΙΚΡΑ ΜΑΘΗΜΑΤΑ ΓΡΑΜΜΑΤΙΚΗΣ</span></div>
            <div class="grammar-grid">${GRAMMAR_LESSONS.map((lesson) => `<button class="grammar-card" data-grammar="${lesson.id}"><span class="grammar-card-title">${lesson.title}</span><span class="grammar-card-sub">${lesson.subtitle}</span></button>`).join("")}</div>
          </div></div>
        </section>
        ${modal ? renderCategoryModal() : ""}
      `;
      els<HTMLElement>("[data-unit]").forEach((button) => button.addEventListener("click", () => { activeUnit = Number(button.dataset.unit); render(); }));
      el<HTMLButtonElement>("#unit-quiz").addEventListener("click", () => go("#quiz/unit" + activeUnit));
      el<HTMLButtonElement>("#all-quiz").addEventListener("click", () => go("#quiz/all"));
      el<HTMLButtonElement>("#mistakes-quiz").addEventListener("click", () => { if (mistakes.length) go("#quiz/mistakes"); });
       el<HTMLButtonElement>("#dialogues-link").addEventListener("click", () => go("#dialogues"));
       el<HTMLButtonElement>("#speaking-link").addEventListener("click", () => go("#speaking"));
       el<HTMLButtonElement>("#settings-link").addEventListener("click", () => go("#settings"));
       el<HTMLButtonElement>("#backup-link").addEventListener("click", exportProgress);
      el<HTMLButtonElement>("#add-category").addEventListener("click", () => { modal = { type: "category", color: PRESET_COLORS[0] ?? "#FF6B35" }; render(); });
      els<HTMLElement>("[data-browse]").forEach((button) => button.addEventListener("click", () => go("#browse/" + button.dataset.browse)));
      els<HTMLElement>("[data-quiz]").forEach((button) => button.addEventListener("click", () => go("#quiz/" + button.dataset.quiz)));
      els<HTMLElement>("[data-grammar]").forEach((button) => button.addEventListener("click", () => go("#grammar/" + button.dataset.grammar)));
      attachModalEvents();
    }
    function renderCategoryCard(cat: Category): string {
      const icon = CATEGORY_ICONS[cat.id] || "▣";
      return `<article class="category-card" style="border-color:${esc(cat.color)}44"><div class="category-icon" style="color:${esc(cat.color)};background:${esc(cat.color)}22">${icon}</div><div class="category-info"><p class="category-name">${esc(cat.name)}</p><div class="category-count">${cat.items.length} λέξεις</div></div><div class="category-actions"><button class="browse-button" data-browse="${esc(cat.id)}" aria-label="Περιήγηση">☷</button><button class="quiz-button" data-quiz="${esc(cat.id)}" style="color:${esc(cat.color)};background:${esc(cat.color)}22;border:1px solid ${esc(cat.color)}55">Quiz <span>→</span></button></div></article>`;
    }
    function renderCategoryModal(): string {
      return `<div class="modal-layer" id="modal-layer"><form class="modal" id="category-form"><div class="modal-header"><h2 class="modal-title">Νέα Κατηγορία — Ενότητα ${activeUnit}</h2><button type="button" class="close-button" data-close-modal>×</button></div><label class="input-label">Όνομα κατηγορίας</label><input class="text-input" id="new-category-name" placeholder="π.χ. Αριθμοί" autofocus /><label class="input-label">Χρώμα</label><div class="color-row">${PRESET_COLORS.map((color) => `<button type="button" class="color-dot ${(modal && modal.type === "category" ? modal.color : "") === color ? "selected" : ""}" data-color="${color}" style="background:${color}"></button>`).join("")}</div><button class="create-button" id="create-category" type="submit" disabled>Δημιουργία</button></form></div>`;
    }
    function attachModalEvents(): void {
      if (!modal) return;
      el<HTMLButtonElement>("[data-close-modal]").addEventListener("click", closeModal);
      el<HTMLElement>("#modal-layer").addEventListener("click", (event) => { if ((event.target as HTMLElement).id === "modal-layer") closeModal(); });
      const input = el<HTMLInputElement>("#new-category-name");
      const create = el<HTMLButtonElement>("#create-category");
      input.addEventListener("input", () => { create.disabled = !input.value.trim(); });
      els<HTMLElement>("[data-color]").forEach((button) => button.addEventListener("click", () => { if (modal && modal.type === "category") { modal.color = button.dataset.color ?? PRESET_COLORS[0] ?? "#FF6B35"; render(); } }));
      el<HTMLFormElement>("#category-form").addEventListener("submit", (event) => {
        event.preventDefault();
        if (!input.value.trim()) return;
        categories.push({ id: generateId(), name: input.value.trim(), color: (modal && modal.type === "category" ? modal.color : PRESET_COLORS[0]) || PRESET_COLORS[0] || "#FF6B35", unit: activeUnit, items: [] });
        modal = null; updateState();
      });
    }

    function renderBrowse(catId: string): void {
      quizSession = null;
      const cat = categories.find((item) => item.id === catId);
      if (!cat) { root.innerHTML = `<section class="screen"><div class="empty-state">Κατηγορία δεν βρέθηκε<br><button class="quiz-button" onclick="go('#home')">Πίσω</button></div></section>`; return; }
      const query = browseSearch.trim().toLowerCase();
      const filtered = query ? cat.items.filter((item) => item.es.toLowerCase().includes(query) || item.gr.toLowerCase().includes(query)) : cat.items;
      root.innerHTML = `
        <section class="screen">
          <header class="sub-header"><button class="back-button" id="browse-back">‹</button><div class="sub-header-center"><h1 class="sub-header-title" style="color:${esc(cat.color)}">${esc(cat.name)}</h1><p class="sub-header-sub">${cat.items.length} λέξεις</p></div><button class="icon-button" id="add-word" style="color:${esc(cat.color)};background:${esc(cat.color)}22;border:1px solid ${esc(cat.color)}55">+</button><button class="icon-button" id="delete-category" style="color:var(--error)">⌫</button></header>
          <div class="search-wrap"><span class="search-icon">⌕</span><input class="search-input" id="word-search" placeholder="Αναζήτηση λέξης..." value="${esc(browseSearch)}" /><button class="clear-search" id="clear-search" ${browseSearch ? "" : "hidden"}>×</button></div>
          <div class="scroll"><div class="word-list">${filtered.length ? filtered.map((item) => `<div class="word-row"><div class="word-side"><span class="word-text es">${esc(item.es)}</span><button class="speaker-button" data-speak="${esc(item.es)}" aria-label="Άκουσε την προφορά">🔊</button><span class="lang-tag">ES</span></div><span style="color:var(--muted)">→</span><div class="word-side"><span class="word-text gr">${esc(item.gr)}</span><span class="lang-tag gr">GR</span></div></div>`).join("") : `<div class="empty-state">⌕<br>${query ? "Δεν βρέθηκαν λέξεις" : "Δεν υπάρχουν λέξεις ακόμα"}${!query ? `<br><button class="quiz-button" id="empty-add" style="color:${esc(cat.color)}">Προσθήκη λέξης</button>` : ""}</div>`}</div></div>
          <div class="bottom-bar"><button class="bottom-quiz" id="category-quiz" style="background:${esc(cat.color)}">▶ &nbsp; Quiz αυτής της κατηγορίας</button></div>
        </section>
        ${modal ? renderWordModal(cat) : ""}
      `;
      el<HTMLButtonElement>("#browse-back").addEventListener("click", () => go("#home"));
      el<HTMLButtonElement>("#add-word").addEventListener("click", () => { modal = { type: "word" }; render(); });
      el<HTMLButtonElement>("#delete-category").addEventListener("click", () => {
        if (confirm(`Να διαγραφεί η κατηγορία "${cat.name}" με ${cat.items.length} λέξεις;`)) {
          categories = categories.filter((item) => item.id !== cat.id); save(); go("#home");
        }
      });
      el<HTMLButtonElement>("#category-quiz").addEventListener("click", () => go("#quiz/" + cat.id));
      const searchInput = el<HTMLInputElement>("#word-search");
      searchInput.addEventListener("input", () => { browseSearch = searchInput.value; renderBrowse(catId); });
      el<HTMLButtonElement>("#clear-search").addEventListener("click", () => { browseSearch = ""; renderBrowse(catId); });
      const emptyAdd = maybeEl<HTMLButtonElement>("#empty-add");
      if (emptyAdd) emptyAdd.addEventListener("click", () => { modal = { type: "word" }; render(); });
      attachSpeakerEvents();
      attachWordModalEvents(cat);
    }
    function renderWordModal(cat: Category): string {
      return `<div class="modal-layer" id="modal-layer"><form class="modal" id="word-form"><div class="modal-header"><h2 class="modal-title">Νέα Λέξη</h2><button type="button" class="close-button" data-close-modal>×</button></div><label class="input-label">Ισπανικά</label><input class="text-input" id="new-es" placeholder="π.χ. casa" autocomplete="off" autofocus /><label class="input-label">Ελληνικά</label><input class="text-input" id="new-gr" placeholder="π.χ. σπίτι" autocomplete="off" /><button class="create-button" id="create-word" type="submit" style="background:${esc(cat.color)}" disabled>Προσθήκη</button></form></div>`;
    }
    function attachWordModalEvents(cat: Category): void {
      if (!modal) return;
      el<HTMLButtonElement>("[data-close-modal]").addEventListener("click", closeModal);
      el<HTMLElement>("#modal-layer").addEventListener("click", (event) => { if ((event.target as HTMLElement).id === "modal-layer") closeModal(); });
      const es = el<HTMLInputElement>("#new-es"), gr = el<HTMLInputElement>("#new-gr"), create = el<HTMLButtonElement>("#create-word");
      const updateButton = () => { create.disabled = !es.value.trim() || !gr.value.trim(); };
      es.addEventListener("input", updateButton); gr.addEventListener("input", updateButton);
      el<HTMLFormElement>("#word-form").addEventListener("submit", (event) => {
        event.preventDefault();
        if (!es.value.trim() || !gr.value.trim()) return;
        cat.items.push({ es: es.value.trim(), gr: gr.value.trim() });
        modal = null; updateState();
        setTimeout(() => renderBrowse(cat.id), 0);
      });
    }

    function getPool(catId: string): VocabItem[] {
      if (catId === "all") return categories.flatMap((cat) => cat.items);
      if (catId === "unit1") return categories.filter((cat) => (cat.unit || 1) === 1).flatMap((cat) => cat.items);
      if (catId === "unit2") return categories.filter((cat) => cat.unit === 2).flatMap((cat) => cat.items);
      if (catId === "mistakes") return mistakes;
      const cat = categories.find((item) => item.id === catId);
      return cat ? cat.items : [];
    }
    function genQuestion(pool: VocabItem[]): BaseQuizQuestion {
      if (!pool.length) return { type: "fill", prompt: "Δεν υπάρχουν λέξεις", answer: "", direction: "es2gr" };
      if (pool.length < 4) return genFill(pool);
      const type = ["mc", "mc", "fill", "match", "listen", "type", "sentence", "error", "gender", "trap"][Math.floor(Math.random() * 10)];
      if (type === "mc") return genMC(pool);
      if (type === "match") return genMatch(pool);
      if (type === "listen") return genListen(pool);
      if (type === "type") return genTyping(pool);
      if (type === "sentence") return genSentence();
      if (type === "error") return genError();
      if (type === "gender") return genGender();
      if (type === "trap") return genTrap();
      return genFill(pool);
    }
    function genMC(pool: VocabItem[]): BaseQuizQuestion {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const direction = Math.random() > .5 ? "es2gr" : "gr2es";
      const from = direction === "es2gr" ? "es" : "gr", to = direction === "es2gr" ? "gr" : "es";
      const others = shuffle(pool.filter((entry) => entry[to] !== item[to])).slice(0, 3);
      return { type:"mc", prompt:item[from], answer:item[to], options:shuffle([item[to], ...others.map((entry) => entry[to])]), direction, item };
    }
    function genFill(pool: VocabItem[]): BaseQuizQuestion {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const direction = Math.random() > .5 ? "es2gr" : "gr2es";
      const from = direction === "es2gr" ? "es" : "gr", to = direction === "es2gr" ? "gr" : "es";
      return { type:"fill", prompt:item[from], answer:item[to], direction, item };
    }
    function genTyping(pool: VocabItem[]): BaseQuizQuestion {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const direction = Math.random() > .5 ? "gr2es" : "es2gr";
      const from = direction === "es2gr" ? "es" : "gr", to = direction === "es2gr" ? "gr" : "es";
      return { type:"type", prompt:item[from], answer:item[to], direction, item };
    }
    function genSentence(): BaseQuizQuestion {
      const example = SENTENCE_QUESTIONS[Math.floor(Math.random() * SENTENCE_QUESTIONS.length)];
      return { type:"sentence", prompt:example.prompt, answer:example.answer, direction:"gr2es", item:example.item };
    }
    function genError(): BaseQuizQuestion {
      const example = ERROR_QUESTIONS[Math.floor(Math.random() * ERROR_QUESTIONS.length)];
      return { type:"error", prompt:example.prompt, answer:example.answer, options:shuffle(example.options), direction:"gr2es", item:example.item };
    }
    function genGender(): BaseQuizQuestion {
      const example = GENDER_QUESTIONS[Math.floor(Math.random() * GENDER_QUESTIONS.length)];
      return { type:"gender", prompt:example.prompt, answer:example.answer, options:shuffle(example.options), direction:"gr2es", item:example.item };
    }
    function genTrap(): BaseQuizQuestion {
      const example = TRAP_QUESTIONS[Math.floor(Math.random() * TRAP_QUESTIONS.length)];
      return { type:"trap", prompt:example.prompt, answer:example.answer, options:shuffle(example.options), direction:"gr2es", item:example.item };
    }
    function genListen(pool: VocabItem[]): BaseQuizQuestion {
      const item = pool[Math.floor(Math.random() * pool.length)];
      const others = shuffle(pool.filter((entry) => entry.gr !== item.gr)).slice(0, 3);
      return { type:"listen", prompt:item.es, answer:item.gr, options:shuffle([item.gr, ...others.map((entry) => entry.gr)]), direction:"es2gr", item };
    }
    function genMatch(pool: VocabItem[]): BaseQuizQuestion {
      const seen = new Set(), items = [];
      for (const item of shuffle(pool)) {
        const key = normalizeAnswer(item.gr);
        if (!seen.has(key)) { seen.add(key); items.push(item); }
        if (items.length === 5) break;
      }
      return { type:"match", prompt:"", answer:"", direction:"es2gr", left:items.map((item) => item.es), right:shuffle(items.map((item) => item.gr)), pairs:items };
    }
    function newQuizSession(catId: string): QuizSession {
      const pool = getPool(catId);
      return { catId, question:genQuestion(pool), score:{correct:0,total:0}, streak:0, feedback:null, fillText:"", matchSelected:null, matchMatched:new Set() };
    }
    function renderQuiz(catId: string): void {
      if (catId === "mistakes" && !mistakes.length) {
        quizSession = null;
        root.innerHTML = `<section class="screen"><header class="sub-header"><button class="back-button" id="empty-mistakes-back">‹</button><div class="sub-header-center"><h1 class="sub-header-title">Οι λέξεις που κάνω λάθος</h1></div></header><div class="empty-state">Δεν έχεις αποθηκευμένα λάθη ακόμα.<br><button class="quiz-button" id="empty-mistakes-home" style="color:var(--primary)">Πίσω στην αρχική</button></div></section>`;
        el<HTMLButtonElement>("#empty-mistakes-back").addEventListener("click", () => go("#home"));
        el<HTMLButtonElement>("#empty-mistakes-home").addEventListener("click", () => go("#home"));
        return;
      }
      if (!quizSession || quizSession.catId !== catId) quizSession = newQuizSession(catId);
      const session = quizSession, q = session.question;
      const cat = catId !== "all" && catId !== "mistakes" && !catId.startsWith("unit") ? categories.find((item) => item.id === catId) : null;
      const accent = cat ? cat.color : "#FF6B35";
      const quizTitle = catId === "mistakes" ? "Οι λέξεις που κάνω λάθος" : cat ? cat.name : "Όλες οι κατηγορίες";
      const accuracy = session.score.total ? Math.round(session.score.correct / session.score.total * 100) : null;
      const progress = session.score.total ? session.score.correct / session.score.total * 100 : 0;
      let body = "";
      if (q.type === "mc") body = renderMC(q, session, accent);
      if (q.type === "fill") body = renderFill(q, session, accent);
      if (q.type === "type") body = renderTyping(q, session, accent);
      if (q.type === "sentence") body = renderTyping(q, session, accent);
      if (q.type === "error") body = renderChoice(q, session, "Διόρθωσε τη φράση");
      if (q.type === "gender") body = renderChoice(q, session, "Διάκριση γένους");
      if (q.type === "trap") body = renderChoice(q, session, "Πρόσεχε τις παρόμοιες λέξεις");
      if (q.type === "match") body = renderMatch(q, session, accent);
      if (q.type === "listen") body = renderListen(q, session, accent);
      root.innerHTML = `<section class="screen quiz-screen"><header class="sub-header"><button class="back-button" id="quiz-back">‹</button><div class="sub-header-center"><h1 class="sub-header-title">${esc(quizTitle)}</h1>${accuracy !== null ? `<p class="sub-header-sub">${accuracy}% ακρίβεια</p>` : ""}</div><div class="quiz-header-badges"><span class="badge correct">${session.score.correct}</span><span class="badge wrong">${session.score.total - session.score.correct}</span>${session.streak >= 3 ? `<span class="badge streak">${session.streak}x</span>` : ""}</div></header><div class="progress-bg"><div class="progress-fill" style="width:${progress}%;background:${esc(accent)}"></div></div><div class="scroll"><div class="question-wrap"><div class="question-card ${session.feedback ? session.feedback + "-bg" : ""}">${body}</div><div class="question-count">Ερώτηση #${session.score.total + 1}${session.score.total ? `  ·  ${session.score.correct}/${session.score.total} σωστές` : "  ·  Ξεκινάς!"}</div></div></div></section>`;
      el<HTMLButtonElement>("#quiz-back").addEventListener("click", () => go("#home"));
      attachQuizEvents(q, accent);
    }
    function renderMC(q: BaseQuizQuestion, session: QuizSession, _accent?: string): string {
      if (q.type === "match") return "";
      const label = q.direction === "es2gr" ? "Ισπανικά → Ελληνικά" : "Ελληνικά → Ισπανικά";
      return `<div class="type-label">${label}</div><div class="prompt-box"><span class="prompt-text">${esc(q.prompt)}</span>${q.direction === "es2gr" ? `<button class="speaker-button" data-speak="${esc(q.prompt)}" aria-label="Άκουσε την προφορά">🔊</button>` : ""}</div><div class="options-grid">${(q.options ?? []).map((option) => `<button class="option-button ${session.feedback ? option === q.answer ? "correct" : "wrong" : ""}" data-answer="${esc(option)}" ${session.feedback ? "disabled" : ""}>${esc(option)}</button>`).join("")}</div>`;
    }
    function renderFill(q: BaseQuizQuestion, session: QuizSession, accent: string): string {
      if (q.type === "match") return "";
      const border = session.feedback ? session.feedback === "correct" ? "#2ecc71" : "#e74c3c" : accent + "66";
      return `<div class="type-label">Συμπλήρωσε το κενό</div><div class="prompt-box"><span class="prompt-text">${esc(q.prompt)}</span>${q.direction === "es2gr" ? `<button class="speaker-button" data-speak="${esc(q.prompt)}" aria-label="Άκουσε την προφορά">🔊</button>` : ""}</div>${session.feedback ? `<p class="feedback-hint ${session.feedback}">${session.feedback === "correct" ? "Σωστό!" : "Σωστό: " + esc(q.answer)}</p>` : ""}<input class="fill-input" id="fill-answer" style="border-color:${border}" placeholder="${q.direction === "es2gr" ? "Γράψε ελληνικά..." : "Escribe en español..."}" value="${esc(session.fillText)}" ${session.feedback ? "disabled" : ""} autocomplete="off" autocapitalize="none" /><button class="submit-button" id="submit-fill" style="background:${esc(accent)};opacity:${session.fillText.trim() ? 1 : .5}" ${!session.fillText.trim() || session.feedback ? "disabled" : ""}>Έλεγχος ✓</button>`;
    }
    function renderTyping(q: BaseQuizQuestion, session: QuizSession, accent: string): string {
      if (q.type === "match") return "";
      const border = session.feedback ? session.feedback === "correct" ? "#2ecc71" : "#e74c3c" : accent + "66";
      const label = q.type === "sentence" ? "Μετάφραση μέσα σε πρόταση" : q.direction === "es2gr" ? "Πληκτρολόγησε ελληνικά" : "Πληκτρολόγησε ισπανικά";
      return `<div class="type-label">${label}</div><div class="prompt-box"><span class="prompt-text">${esc(q.prompt)}</span>${q.direction === "es2gr" ? `<button class="speaker-button" data-speak="${esc(q.prompt)}" aria-label="Άκουσε την ισπανική πρόταση">🔊</button>` : ""}</div>${session.feedback ? `<p class="feedback-hint ${session.feedback}">${session.feedback === "correct" ? "Σωστό!" : "Σωστό: " + esc(q.answer)}</p>` : ""}<input class="fill-input" id="fill-answer" style="border-color:${border}" placeholder="${q.direction === "es2gr" ? "Γράψε ελληνικά..." : "Escribe en español..."}" value="${esc(session.fillText)}" ${session.feedback ? "disabled" : ""} autocomplete="off" autocapitalize="none" /><button class="submit-button" id="submit-fill" style="background:${esc(accent)};opacity:${session.fillText.trim() ? 1 : .5}" ${!session.fillText.trim() || session.feedback ? "disabled" : ""}>Έλεγχος ✓</button>`;
    }
    function renderChoice(q: BaseQuizQuestion, session: QuizSession, label: string): string {
      if (q.type === "match") return "";
      const options = q.options ?? [];
      return `<div class="type-label">${label}</div><div class="prompt-box"><span class="prompt-text" style="font-size:21px">${esc(q.prompt)}</span></div><div class="options-grid">${options.map((option) => `<button class="option-button ${session.feedback ? option === q.answer ? "correct" : "wrong" : ""}" data-answer="${esc(option)}" ${session.feedback ? "disabled" : ""}>${esc(option)}</button>`).join("")}</div>`;
    }
    function renderListen(q: BaseQuizQuestion, session: QuizSession, accent: string): string {
      if (q.type === "match") return "";
      const options = q.options ?? [];
      return `<div class="type-label">Άκουσε και επίλεξε</div><div class="prompt-box" style="flex-direction:column;gap:10px"><button class="speaker-button" data-speak="${esc(q.prompt)}" style="width:52px;height:52px;border-radius:50%;font-size:24px" aria-label="Άκουσε την ισπανική λέξη">🔊</button><span style="color:var(--muted);font-size:13px">Πάτησε το ηχείο για να ακούσεις τη λέξη</span></div><div class="options-grid">${options.map((option) => `<button class="option-button ${session.feedback ? option === q.answer ? "correct" : "wrong" : ""}" data-answer="${esc(option)}" ${session.feedback ? "disabled" : ""}>${esc(option)}</button>`).join("")}</div>`;
    }
    function renderMatch(q: BaseQuizQuestion, session: QuizSession, accent: string): string {
      const left = q.left ?? [];
      const right = q.right ?? [];
      const pairs = q.pairs ?? [];
      return `<div class="type-label">Ταίριαξε τα ζευγάρια</div><div class="match-grid"><div class="match-col">${left.map((word: string) => { const matched = session.matchMatched.has(word); return `<button class="match-button ${matched ? "matched" : session.matchSelected === word ? "selected" : ""}" data-match-left="${esc(word)}" ${matched ? "disabled" : ""}>${esc(word)}</button>`; }).join("")}</div><div class="match-col">${right.map((gr: string) => { const pair = pairs.find((item: VocabItem) => item.gr === gr); const matched = pair ? session.matchMatched.has(pair.es) : false; return `<button class="match-button ${matched ? "matched" : ""}" data-match-right="${esc(gr)}" ${matched ? "disabled" : ""}>${esc(gr)}</button>`; }).join("")}</div></div><div class="match-progress">${session.matchMatched.size}/${pairs.length} ζευγάρια</div>`;
    }
    function attachQuizEvents(q: BaseQuizQuestion, accent: string): void {
      const session = quizSession;
      if (!session) return;
      els<HTMLElement>("[data-answer]").forEach((button) => button.addEventListener("click", () => flashFeedback(button.dataset.answer === q.answer)));
      attachSpeakerEvents();
      if (q.type === "listen" && !session.feedback) setTimeout(() => speak(q.prompt), 150);
      const fill = maybeEl<HTMLInputElement>("#fill-answer");
      if (fill) {
        fill.addEventListener("input", () => {
          session.fillText = fill.value;
          const submitButton = maybeEl<HTMLButtonElement>("#submit-fill");
          if (!submitButton) return;
          submitButton.disabled = !fill.value.trim();
          submitButton.style.opacity = fill.value.trim() ? "1" : ".5";
        });
        fill.addEventListener("keydown", (event) => { if (event.key === "Enter" && fill.value.trim()) handleFill(); });
      }
      const submit = maybeEl<HTMLButtonElement>("#submit-fill");
      if (submit) submit.addEventListener("click", handleFill);
      els<HTMLElement>("[data-match-left]").forEach((button) => button.addEventListener("click", () => { session.matchSelected = button.dataset.matchLeft ?? null; renderQuiz(session.catId); }));
      els<HTMLElement>("[data-match-right]").forEach((button) => button.addEventListener("click", () => {
        if (!session.matchSelected) return;
        const pair = (q.pairs ?? []).find((item: VocabItem) => item.es === session.matchSelected);
        if (!pair) return;
        if (pair.gr === button.dataset.matchRight) {
          session.matchMatched.add(session.matchSelected); session.matchSelected = null;
          if (session.matchMatched.size === (q.pairs ?? []).length) {
            session.score.correct++; session.score.total++; session.streak++; stats.xp += 50; stats.totalCorrect++; stats.totalAnswered++;
            (q.pairs ?? []).forEach((item: VocabItem) => resolveMistake(item));
            save();
            setTimeout(() => nextQuestion(), 500);
          } else renderQuiz(session.catId);
        } else {
          addMistake(pair);
          session.matchSelected = null;
          save();
          renderQuiz(session.catId);
        }
      }));
    }
    function flashFeedback(correct: boolean): void {
      const session = quizSession;
      if (!session || session.feedback) return;
      session.feedback = correct ? "correct" : "wrong";
      session.score.total++;
      if (correct) {
        session.score.correct++; session.streak++; stats.xp += 10;
        resolveMistake(session.question.item);
      } else {
        session.streak = 0;
        addMistake(session.question.item);
      }
      stats.totalAnswered++; if (correct) stats.totalCorrect++;
      save(); renderQuiz(session.catId);
      setTimeout(() => nextQuestion(), correct ? 600 : 1200);
    }
    function handleFill(): void {
      const session = quizSession;
      if (!session || session.feedback || !session.fillText.trim()) return;
      flashFeedback(normalizeAnswer(session.fillText) === normalizeAnswer(session.question.answer));
    }
    function nextQuestion(): void {
      if (!quizSession) return;
      quizSession.question = genQuestion(getPool(quizSession.catId));
      quizSession.feedback = null; quizSession.fillText = ""; quizSession.matchSelected = null; quizSession.matchMatched = new Set();
      renderQuiz(quizSession.catId);
    }

    function renderGrammar(lessonId: string): void {
      quizSession = null;
      const lesson = GRAMMAR_LESSONS.find((item) => item.id === lessonId);
      if (!lesson) { go("#home"); return; }
      if (!grammarSession || grammarSession.id !== lessonId) grammarSession = { id: lessonId, index: 0, score: 0, selected: null };
      const session = grammarSession;
      const question = lesson.questions[session.index];
      let quizBody;
      if (!question) {
        quizBody = `<div class="grammar-result"><h2>Μπράβο!</h2><p>Ολοκλήρωσες το μάθημα «${esc(lesson.title)}».</p><p>${session.score}/${lesson.questions.length} σωστές απαντήσεις</p><button class="grammar-next" id="grammar-restart">Ξανά το quiz</button><button class="grammar-next" id="grammar-home" style="background:var(--secondary);color:var(--primary)">Πίσω στην αρχική</button></div>`;
      } else {
        const answered = session.selected !== null;
        quizBody = `<div class="grammar-question"><div class="type-label">Quiz γραμματικής · ${session.index + 1}/${lesson.questions.length}</div><p class="grammar-question-text">${esc(question.prompt)}</p><div class="grammar-options">${question.options.map((option) => `<button class="grammar-option ${answered ? option === question.answer ? "correct" : option === session.selected ? "wrong" : "" : ""}" data-grammar-answer="${esc(option)}" ${answered ? "disabled" : ""}>${esc(option)}</button>`).join("")}</div>${answered ? `<p class="grammar-explanation">${esc(question.explanation)}</p><button class="grammar-next" id="grammar-next">${session.index + 1 === lesson.questions.length ? "Ολοκλήρωση" : "Επόμενη ερώτηση"} →</button>` : ""}</div>`;
      }
      root.innerHTML = `<section class="screen"><header class="sub-header"><button class="back-button" id="grammar-back">‹</button><div class="sub-header-center"><h1 class="sub-header-title">${esc(lesson.title)}</h1><p class="sub-header-sub">${esc(lesson.subtitle)}</p></div></header><div class="scroll"><div class="question-wrap"><div class="lesson-card"><h2>${esc(lesson.title)}</h2><p>${esc(lesson.intro)}</p><ul class="lesson-points">${lesson.points.map((point) => `<li>${esc(point)}</li>`).join("")}</ul>${lesson.examples.map((example) => `<div class="lesson-example">${esc(example)}</div>`).join("")}</div>${quizBody}</div></div></section>`;
      el<HTMLButtonElement>("#grammar-back").addEventListener("click", () => go("#home"));
      if (!question) {
        el<HTMLButtonElement>("#grammar-restart").addEventListener("click", () => { grammarSession = { id: lessonId, index: 0, score: 0, selected: null }; renderGrammar(lessonId); });
        el<HTMLButtonElement>("#grammar-home").addEventListener("click", () => go("#home"));
        return;
      }
      els<HTMLElement>("[data-grammar-answer]").forEach((button) => button.addEventListener("click", () => {
        if (!grammarSession || grammarSession.selected !== null) return;
        grammarSession.selected = button.dataset.grammarAnswer ?? null;
        if (grammarSession.selected === question.answer) { grammarSession.score++; stats.xp += 5; stats.totalCorrect++; }
        stats.totalAnswered++;
        save();
        renderGrammar(lessonId);
      }));
      const next = maybeEl<HTMLButtonElement>("#grammar-next");
      if (next) next.addEventListener("click", () => {
        if (!grammarSession) return;
        grammarSession.index++;
        grammarSession.selected = null;
        renderGrammar(lessonId);
      });
    }

    function renderDialogues(): void {
      quizSession = null;
      dialogueSession = null;
      root.innerHTML = `<section class="screen"><header class="sub-header"><button class="back-button" id="dialogues-back">‹</button><div class="sub-header-center"><h1 class="sub-header-title">Μικροί διάλογοι</h1><p class="sub-header-sub">Γραπτή και προφορική εξάσκηση με απλό λεξιλόγιο</p></div></header><div class="scroll"><div class="content"><div class="lesson-card"><h2>Μίλησε σαν να είσαι εκεί</h2><p>Διάβασε τη φράση, άκουσε την προφορά και διάλεξε την απάντηση που ταιριάζει. Μετά μπορείς να την πεις και δυνατά.</p></div><div class="dialogue-grid">${DIALOGUES.map((dialogue) => `<button class="dialogue-card" data-dialogue="${dialogue.id}"><span class="dialogue-card-icon">${dialogue.icon}</span><span class="dialogue-card-title">${dialogue.title}</span><span class="dialogue-card-sub">${dialogue.subtitle} · ${dialogue.turns.length} βήματα</span></button>`).join("")}</div></div></div></section>`;
      el<HTMLButtonElement>("#dialogues-back").addEventListener("click", () => go("#home"));
      els<HTMLElement>("[data-dialogue]").forEach((button) => button.addEventListener("click", () => go("#dialogue/" + button.dataset.dialogue)));
    }

    function renderDialogue(dialogueId: string): void {
      quizSession = null;
      const dialogue = DIALOGUES.find((item) => item.id === dialogueId);
      if (!dialogue) { go("#dialogues"); return; }
      if (!dialogueSession || dialogueSession.id !== dialogueId) dialogueSession = { id: dialogueId, index: 0, selected: null, feedback: null, voice: null, history: [] };
      const session = dialogueSession;
      const current = dialogue.turns[session.index];
      const finished = !current;
      const history = session.history.map((entry) => `<div class="bubble user"><span class="bubble-speaker">ΕΣΥ</span><div class="bubble-es">${esc(entry.choice.es)} <button class="speaker-button" data-speak="${esc(entry.choice.es)}" aria-label="Άκουσε την απάντηση">🔊</button></div><div class="bubble-gr">${esc(entry.choice.gr)}</div></div>`).join("");
      let body = `<div class="conversation">${dialogue.turns.slice(0, session.index).map((turn, index) => `<div class="bubble other"><span class="bubble-speaker">${esc(turn.speaker)}</span><div class="bubble-es">${esc(turn.es)} <button class="speaker-button" data-speak="${esc(turn.es)}" aria-label="Άκουσε τη φράση">🔊</button></div><div class="bubble-gr">${esc(turn.gr)}</div></div>${history && session.history[index] ? `<div class="bubble user"><span class="bubble-speaker">ΕΣΥ</span><div class="bubble-es">${esc(session.history[index].choice.es)} <button class="speaker-button" data-speak="${esc(session.history[index].choice.es)}" aria-label="Άκουσε την απάντηση">🔊</button></div><div class="bubble-gr">${esc(session.history[index].choice.gr)}</div></div>` : ""}`).join("")}</div>`;
      if (finished) {
        body += `<div class="grammar-result"><h2>Διάλογος ολοκληρώθηκε!</h2><p>Έκανες εξάσκηση στη σκηνή «${esc(dialogue.title)}».</p><button class="grammar-next" id="dialogue-restart">Ξανά τον διάλογο</button><button class="grammar-next" id="dialogue-list" style="background:var(--secondary);color:var(--primary)">Άλλος διάλογος</button></div>`;
      } else {
      body += `<div class="bubble other"><span class="bubble-speaker">${esc(current.speaker)}</span><div class="bubble-es">${esc(current.es)} <button class="speaker-button" data-speak="${esc(current.es)}" aria-label="Άκουσε τη φράση">🔊</button></div><div class="bubble-gr">${esc(current.gr)}</div></div><div class="dialogue-prompt"><h2>Τι θα απαντήσεις;</h2><div class="choice-list">${current.choices.map((choice, index) => `<button class="choice-button ${session.feedback ? choice.correct ? "correct" : session.selected === index ? "wrong" : "" : ""}" data-choice-index="${index}" ${session.feedback ? "disabled" : ""}><span class="choice-es">${esc(choice.es)}</span><span class="choice-gr">${esc(choice.gr)}</span></button>`).join("")}</div>${session.feedback ? `<p class="feedback-hint ${session.feedback}">${session.feedback === "correct" ? "Σωστή επιλογή!" : "Αυτή η απάντηση δεν ταιριάζει εδώ."}</p><div class="dialogue-actions"><button class="secondary-button" id="dialogue-speak-choice">🔊 Άκουσε την επιλογή</button><button class="secondary-button" id="dialogue-mic">🎙️ Πες την</button></div>${session.voice ? `<div class="speech-result"><strong>Αναγνώριση:</strong> ${esc(session.voice.transcript || session.voice.error || "")}${session.voice.score !== undefined ? `<br><span class="score-ring">${session.voice.score}%</span> ομοιότητα` : ""}</div>` : ""}<button class="grammar-next" id="dialogue-next">${session.index + 1 === dialogue.turns.length ? "Ολοκλήρωση" : "Επόμενο"} →</button>` : ""}</div>`;
      }
      root.innerHTML = `<section class="screen"><header class="sub-header"><button class="back-button" id="dialogue-back">‹</button><div class="sub-header-center"><h1 class="sub-header-title">${dialogue.icon} ${esc(dialogue.title)}</h1><p class="sub-header-sub">Βήμα ${Math.min(session.index + 1, dialogue.turns.length)} από ${dialogue.turns.length}</p></div><button class="icon-button" id="dialogue-home" aria-label="Λίστα διαλόγων">☷</button></header><div class="scroll"><div class="question-wrap">${body}</div></div></section>`;
      el<HTMLButtonElement>("#dialogue-back").addEventListener("click", () => go("#dialogues"));
      el<HTMLButtonElement>("#dialogue-home").addEventListener("click", () => go("#dialogues"));
      attachSpeakerEvents();
      if (finished) {
        el<HTMLButtonElement>("#dialogue-restart").addEventListener("click", () => { dialogueSession = { id: dialogueId, index: 0, selected: null, feedback: null, voice: null, history: [] }; renderDialogue(dialogueId); });
        el<HTMLButtonElement>("#dialogue-list").addEventListener("click", () => go("#dialogues"));
        return;
      }
      els<HTMLElement>("[data-choice-index]").forEach((button) => button.addEventListener("click", () => {
        if (!dialogueSession || !current) return;
        const index = Number(button.dataset.choiceIndex);
        const choice = current.choices[index];
        if (!choice) return;
        dialogueSession.selected = index;
        dialogueSession.feedback = choice.correct ? "correct" : "wrong";
        dialogueSession.voice = null;
        stats.totalAnswered++;
        if (choice.correct) { stats.totalCorrect++; stats.xp += 8; }
        save(); renderDialogue(dialogueId);
      }));
      const next = maybeEl<HTMLButtonElement>("#dialogue-next");
      if (next) next.addEventListener("click", () => {
        if (!dialogueSession || !current || dialogueSession.selected === null) return;
        const selectedChoice = current.choices[dialogueSession.selected];
        if (!selectedChoice) return;
        dialogueSession.history.push({ prompt: current, choice: selectedChoice });
        dialogueSession.index++;
        dialogueSession.selected = null; dialogueSession.feedback = null; dialogueSession.voice = null;
        renderDialogue(dialogueId);
      });
      const speakChoice = maybeEl<HTMLButtonElement>("#dialogue-speak-choice");
      if (speakChoice) speakChoice.addEventListener("click", () => {
        if (!dialogueSession || !current || dialogueSession.selected === null) return;
        const selectedChoice = current.choices[dialogueSession.selected];
        if (selectedChoice) speak(selectedChoice.es);
      });
      const mic = maybeEl<HTMLButtonElement>("#dialogue-mic");
      if (mic) mic.addEventListener("click", () => {
        if (!dialogueSession || !current || dialogueSession.selected === null) return;
        const selectedChoice = current.choices[dialogueSession.selected];
        if (!selectedChoice) return;
        mic.disabled = true; mic.textContent = "🎙️ Ακρόαση...";
        startRecognition(selectedChoice.es, (result) => {
          if (!dialogueSession) return;
          dialogueSession.voice = result;
          renderDialogue(dialogueId);
        });
      });
    }

    function renderSpeaking(): void {
      quizSession = null;
      if (!speakingSession) speakingSession = { index: 0, result: null, status: "" };
      const activeSpeaking = speakingSession;
      const phrase = SPEAKING_PHRASES[activeSpeaking.index % SPEAKING_PHRASES.length];
      if (!phrase) return;
      const result = activeSpeaking.result;
      const focusText = phrase.focus === "rr" ? "rr / r" : phrase.focus;
      root.innerHTML = `<section class="screen"><header class="sub-header"><button class="back-button" id="speaking-back">‹</button><div class="sub-header-center"><h1 class="sub-header-title">Προφορική εξάσκηση</h1><p class="sub-header-sub">Φράση ${activeSpeaking.index + 1} · εστίαση στον ήχο ${focusText}</p></div><button class="icon-button" id="speaking-list" aria-label="Επόμενη φράση">↻</button></header><div class="scroll"><div class="question-wrap"><div class="speech-card"><div class="type-label">Άκουσε · διάβασε · μίλησε</div><div class="speech-target">${esc(phrase.es)} <button class="speaker-button" data-speak="${esc(phrase.es)}" aria-label="Άκουσε τη φράση">🔊</button></div><div class="speech-translation">${esc(phrase.gr)}</div><button class="mic-button" id="start-mic" aria-label="Ξεκίνα την προφορική εξάσκηση">🎙️</button><div class="speech-status">${esc(activeSpeaking.status || (speechRecognitionAvailable() ? "Πάτησε το μικρόφωνο και διάβασε τη φράση." : "Η αναγνώριση ομιλίας δεν είναι διαθέσιμη σε αυτόν τον browser."))}</div>${result ? `<div class="speech-result"><strong>Ο browser άκουσε:</strong> ${esc(result.transcript || result.error || "")}${result.score !== undefined ? `<p><span class="score-ring">${result.score}%</span> ομοιότητα με τη φράση</p><small>Ο έλεγχος βασίζεται στη μεταγραφή του browser. Οι ήχοι ${esc(focusText)} χρειάζονται ιδιαίτερη προσοχή στην επόμενη προσπάθεια.</small>` : ""}</div><button class="grammar-next" id="next-speaking">Επόμενη φράση →</button>` : ""}</div><div class="lesson-card"><h2>Μικρό tip προφοράς</h2><p>Πες τη φράση αργά και καθαρά. Το αποτέλεσμα είναι ενδεικτικό, επειδή κάθε browser αναγνωρίζει την ομιλία με διαφορετικό τρόπο.</p></div></div></div></section>`;
      el<HTMLButtonElement>("#speaking-back").addEventListener("click", () => go("#home"));
      el<HTMLButtonElement>("#speaking-list").addEventListener("click", () => { if (!speakingSession) return; speakingSession.index = (speakingSession.index + 1) % SPEAKING_PHRASES.length; speakingSession.result = null; speakingSession.status = ""; renderSpeaking(); });
      attachSpeakerEvents();
      el<HTMLButtonElement>("#start-mic").addEventListener("click", () => {
        if (!speakingSession) return;
        speakingSession.status = "Ακούω… μίλησε τώρα.";
        speakingSession.result = null;
        renderSpeaking();
        startRecognition(phrase.es, (recognitionResult) => { if (!speakingSession) return; speakingSession.result = recognitionResult; speakingSession.status = recognitionResult.error || "Η προσπάθεια ολοκληρώθηκε."; renderSpeaking(); });
      });
      const next = maybeEl<HTMLButtonElement>("#next-speaking");
      if (next) next.addEventListener("click", () => { if (!speakingSession) return; speakingSession.index = (speakingSession.index + 1) % SPEAKING_PHRASES.length; speakingSession.result = null; speakingSession.status = ""; renderSpeaking(); });
    }

    function exportProgress(): void {
      const payload = { format: "espanol-course-backup", version: 1, exportedAt: new Date().toISOString(), categories, stats, mistakes, settings };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = "espanol-course-progress.json"; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 500);
    }
    function importProgress(): void {
      const input = document.createElement("input");
      input.type = "file"; input.accept = "application/json,.json";
      input.addEventListener("change", async () => {
        const file = input.files && input.files[0];
        if (!file) return;
        try {
          const payload = parseProgressBackup(JSON.parse(await file.text()));
          if (!confirm("Η εισαγωγή θα αντικαταστήσει την τρέχουσα πρόοδο και τις δικές σου κατηγορίες. Συνέχεια;")) return;
          categories = payload.categories; stats = { ...stats, ...payload.stats }; mistakes = payload.mistakes;
          settings = { ...settings, ...payload.settings };
          save(); applySettings(); alert("Η πρόοδος εισήχθη επιτυχώς."); render();
        } catch { alert("Το αρχείο δεν είναι έγκυρο backup του Español Course."); }
      });
      input.click();
    }
    function renderSettings(): void {
      quizSession = null;
      root.innerHTML = `<section class="screen"><header class="sub-header"><button class="back-button" id="settings-back">‹</button><div class="sub-header-center"><h1 class="sub-header-title">Ρυθμίσεις</h1><p class="sub-header-sub">Προσωπική, προσβάσιμη εμπειρία μάθησης</p></div></header><div class="scroll"><div class="content"><div class="settings-list">
        <div class="settings-row"><div class="settings-label"><strong>Θέμα εμφάνισης</strong><small>Επίλεξε σκοτεινό ή φωτεινό περιβάλλον.</small></div><select class="settings-select" id="setting-theme"><option value="dark" ${settings.theme === "dark" ? "selected" : ""}>Σκοτεινό</option><option value="light" ${settings.theme === "light" ? "selected" : ""}>Φωτεινό</option></select></div>
        <div class="settings-row"><div class="settings-label"><strong>Μέγεθος γραμματοσειράς</strong><small>Μεγαλύτερο κείμενο για πιο άνετη ανάγνωση.</small></div><select class="settings-select" id="setting-font"><option value="normal" ${settings.fontScale === "normal" ? "selected" : ""}>Κανονικό</option><option value="large" ${settings.fontScale === "large" ? "selected" : ""}>Μεγάλο</option><option value="xl" ${settings.fontScale === "xl" ? "selected" : ""}>Πολύ μεγάλο</option></select></div>
        <div class="settings-row"><div class="settings-label"><strong>Ταχύτητα προφοράς</strong><small>Αργή, κανονική ή γρήγορη ισπανική εκφώνηση.</small></div><select class="settings-select" id="setting-rate"><option value="slow" ${settings.speechRate === "slow" ? "selected" : ""}>Αργή</option><option value="normal" ${settings.speechRate === "normal" ? "selected" : ""}>Κανονική</option><option value="fast" ${settings.speechRate === "fast" ? "selected" : ""}>Γρήγορη</option></select></div>
        <div class="settings-row"><div class="settings-label"><strong>Ισπανική προφορά</strong><small>Επηρεάζει την ακρόαση και την αναγνώριση φωνής.</small></div><select class="settings-select" id="setting-accent"><option value="es-ES" ${settings.accent === "es-ES" ? "selected" : ""}>Ισπανία</option><option value="es-MX" ${settings.accent === "es-MX" ? "selected" : ""}>Λατινική Αμερική</option></select></div>
        <div class="settings-row"><div class="settings-label"><strong>Λειτουργία ενός χεριού</strong><small>Περισσότερος χώρος αφής και πιο άνετη χρήση στο κινητό.</small></div><button class="settings-toggle ${settings.oneHanded ? "on" : ""}" id="setting-one-hand">${settings.oneHanded ? "Ενεργή" : "Ανενεργή"}</button></div>
      </div><div class="backup-row"><button class="backup-button" id="export-progress">⬇ Export JSON</button><button class="backup-button" id="import-progress">⬆ Import JSON</button></div><div class="lesson-card" style="margin-top:16px"><h2>Συμβατότητα μικροφώνου</h2><p>${speechRecognitionAvailable() ? "Ο browser σου υποστηρίζει αναγνώριση ομιλίας. Θα ζητήσει άδεια μικροφώνου όταν ξεκινήσεις." : "Για την προφορική αξιολόγηση χρησιμοποίησε Chrome ή Edge. Η ακρόαση με ηχεία λειτουργεί και χωρίς μικρόφωνο."}</p></div></div></div></section>`;
      el<HTMLButtonElement>("#settings-back").addEventListener("click", () => go("#home"));
      el<HTMLSelectElement>("#setting-theme").addEventListener("change", (event) => { settings.theme = (event.target as HTMLSelectElement).value as Settings["theme"]; save(); applySettings(); renderSettings(); });
      el<HTMLSelectElement>("#setting-font").addEventListener("change", (event) => { settings.fontScale = (event.target as HTMLSelectElement).value as Settings["fontScale"]; save(); applySettings(); renderSettings(); });
      el<HTMLSelectElement>("#setting-rate").addEventListener("change", (event) => { settings.speechRate = (event.target as HTMLSelectElement).value as Settings["speechRate"]; save(); });
      el<HTMLSelectElement>("#setting-accent").addEventListener("change", (event) => { settings.accent = (event.target as HTMLSelectElement).value as Settings["accent"]; save(); });
      el<HTMLButtonElement>("#setting-one-hand").addEventListener("click", () => { settings.oneHanded = !settings.oneHanded; save(); applySettings(); renderSettings(); });
      el<HTMLButtonElement>("#export-progress").addEventListener("click", exportProgress);
      el<HTMLButtonElement>("#import-progress").addEventListener("click", importProgress);
    }

    

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

