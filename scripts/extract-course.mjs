import fs from "node:fs";

const raw = fs.readFileSync("src/lib/course/_raw-script.js", "utf8");

const names = [
  "PRESET_COLORS",
  "CATEGORY_ICONS",
  "GRAMMAR_LESSONS",
  "DIALOGUES",
  "SPEAKING_PHRASES",
  "SENTENCE_QUESTIONS",
  "ERROR_QUESTIONS",
  "GENDER_QUESTIONS",
  "TRAP_QUESTIONS",
  "UNIT1_CATEGORIES",
  "UNIT2_CATEGORIES",
];

const extracted = {};
for (const name of names) {
  const re = new RegExp(`const ${name} = ([\\s\\S]*?);\\n\\s*(?=const |let )`);
  const m = raw.match(re);
  if (!m) {
    console.error("MISSING", name);
    process.exit(1);
  }
  extracted[name] = m[1].trim();
  console.log("OK", name, m[1].length);
}

const dataTs = `import type {
  Category,
  Dialogue,
  ErrorQuestion,
  GenderQuestion,
  GrammarLesson,
  SentenceQuestion,
  SpeakingPhrase,
  TrapQuestion,
} from "./types";

export const STORAGE_KEY_CATEGORIES = "spanish_categories_v3" as const;
export const STORAGE_KEY_STATS = "spanish_stats_v2" as const;
export const STORAGE_KEY_MISTAKES = "spanish_mistakes_v1" as const;
export const STORAGE_KEY_SETTINGS = "spanish_settings_v1" as const;

export const PRESET_COLORS: readonly string[] = ${extracted.PRESET_COLORS};

export const CATEGORY_ICONS: Record<string, string> = ${extracted.CATEGORY_ICONS};

export const GRAMMAR_LESSONS: GrammarLesson[] = ${extracted.GRAMMAR_LESSONS};

export const DIALOGUES: Dialogue[] = ${extracted.DIALOGUES};

export const SPEAKING_PHRASES: SpeakingPhrase[] = ${extracted.SPEAKING_PHRASES};

export const SENTENCE_QUESTIONS: SentenceQuestion[] = ${extracted.SENTENCE_QUESTIONS};

export const ERROR_QUESTIONS: ErrorQuestion[] = ${extracted.ERROR_QUESTIONS};

export const GENDER_QUESTIONS: GenderQuestion[] = ${extracted.GENDER_QUESTIONS};

export const TRAP_QUESTIONS: TrapQuestion[] = ${extracted.TRAP_QUESTIONS};

export const UNIT1_CATEGORIES: Category[] = ${extracted.UNIT1_CATEGORIES};

export const UNIT2_CATEGORIES: Category[] = ${extracted.UNIT2_CATEGORIES};

export const INITIAL_CATEGORIES: Category[] = [...UNIT1_CATEGORIES, ...UNIT2_CATEGORIES];
`;

fs.writeFileSync("src/lib/course/data.ts", dataTs);
console.log("wrote data.ts", dataTs.length);

const logicStart = raw.indexOf("let categories = clone(INITIAL_CATEGORIES);");
if (logicStart < 0) {
  throw new Error("logic start not found");
}
fs.writeFileSync("src/lib/course/_raw-logic.js", raw.slice(logicStart));
console.log("logic length", raw.length - logicStart);
