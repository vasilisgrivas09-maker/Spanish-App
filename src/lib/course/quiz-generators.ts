import {
  ERROR_QUESTIONS,
  GENDER_QUESTIONS,
  SENTENCE_QUESTIONS,
  TRAP_QUESTIONS,
} from "./data";
import type { BaseQuizQuestion, VocabItem } from "./types";
import { normalizeAnswer, shuffle } from "./utils";

function promptFromVocab(item: VocabItem): string {
  const patterns = [
    `Συμπλήρωσε με ισπανικά («${item.gr}»): «Yo necesito ___ .»`,
    `Συμπλήρωσε: «Quiero ___ .» (${item.gr})`,
    `Γράψε τη λέξη στα ισπανικά: «${item.gr}»`,
    `Μετάφρασε μέσα σε πρόταση — μόνο τη λέξη: «${item.gr}»`,
  ];
  return patterns[Math.floor(Math.random() * patterns.length)]!;
}

export function genMC(pool: VocabItem[]): BaseQuizQuestion {
  const item = pool[Math.floor(Math.random() * pool.length)]!;
  const direction = Math.random() > 0.5 ? "es2gr" : "gr2es";
  const from = direction === "es2gr" ? "es" : "gr";
  const to = direction === "es2gr" ? "gr" : "es";
  const others = shuffle(pool.filter((entry) => entry[to] !== item[to])).slice(0, 3);
  return {
    type: "mc",
    prompt: item[from],
    answer: item[to],
    options: shuffle([item[to], ...others.map((entry) => entry[to])]),
    direction,
    item,
  };
}

export function genFill(pool: VocabItem[]): BaseQuizQuestion {
  const item = pool[Math.floor(Math.random() * pool.length)]!;
  const direction = Math.random() > 0.5 ? "es2gr" : "gr2es";
  const from = direction === "es2gr" ? "es" : "gr";
  const to = direction === "es2gr" ? "gr" : "es";
  return {
    type: "fill",
    prompt: item[from],
    answer: item[to],
    direction,
    item,
  };
}

export function genTyping(pool: VocabItem[]): BaseQuizQuestion {
  const item = pool[Math.floor(Math.random() * pool.length)]!;
  const direction = Math.random() > 0.5 ? "gr2es" : "es2gr";
  const from = direction === "es2gr" ? "es" : "gr";
  const to = direction === "es2gr" ? "gr" : "es";
  return {
    type: "type",
    prompt: item[from],
    answer: item[to],
    direction,
    item,
  };
}

/** Mix curated bank with unlimited vocab-derived prompts so sentence quizzes never run out. */
export function genSentence(pool: VocabItem[] = []): BaseQuizQuestion {
  const useVocab = pool.length > 0 && Math.random() > 0.4;
  if (useVocab) {
    const item = pool[Math.floor(Math.random() * pool.length)]!;
    return {
      type: "sentence",
      prompt: promptFromVocab(item),
      answer: item.es,
      direction: "gr2es",
      item,
    };
  }

  const example = SENTENCE_QUESTIONS[Math.floor(Math.random() * SENTENCE_QUESTIONS.length)]!;
  return {
    type: "sentence",
    prompt: example.prompt,
    answer: example.answer,
    direction: "gr2es",
    item: example.item,
  };
}

export function genError(): BaseQuizQuestion {
  const example = ERROR_QUESTIONS[Math.floor(Math.random() * ERROR_QUESTIONS.length)]!;
  return {
    type: "error",
    prompt: example.prompt,
    answer: example.answer,
    options: shuffle(example.options),
    direction: "gr2es",
    item: example.item,
  };
}

export function genGender(): BaseQuizQuestion {
  const example = GENDER_QUESTIONS[Math.floor(Math.random() * GENDER_QUESTIONS.length)]!;
  return {
    type: "gender",
    prompt: example.prompt,
    answer: example.answer,
    options: shuffle(example.options),
    direction: "gr2es",
    item: example.item,
  };
}

export function genTrap(): BaseQuizQuestion {
  const example = TRAP_QUESTIONS[Math.floor(Math.random() * TRAP_QUESTIONS.length)]!;
  return {
    type: "trap",
    prompt: example.prompt,
    answer: example.answer,
    options: shuffle(example.options),
    direction: "gr2es",
    item: example.item,
  };
}

export function genListen(pool: VocabItem[]): BaseQuizQuestion {
  const item = pool[Math.floor(Math.random() * pool.length)]!;
  const others = shuffle(pool.filter((entry) => entry.gr !== item.gr)).slice(0, 3);
  return {
    type: "listen",
    prompt: item.es,
    answer: item.gr,
    options: shuffle([item.gr, ...others.map((entry) => entry.gr)]),
    direction: "es2gr",
    item,
  };
}

export function genMatch(pool: VocabItem[]): BaseQuizQuestion {
  const seen = new Set<string>();
  const items: VocabItem[] = [];
  for (const item of shuffle(pool)) {
    const key = normalizeAnswer(item.gr);
    if (!seen.has(key)) {
      seen.add(key);
      items.push(item);
    }
    if (items.length === 5) break;
  }
  return {
    type: "match",
    prompt: "",
    answer: "",
    direction: "es2gr",
    left: items.map((item) => item.es),
    right: shuffle(items.map((item) => item.gr)),
    pairs: items,
  };
}

export function genQuestion(pool: VocabItem[]): BaseQuizQuestion {
  if (!pool.length) {
    return { type: "fill", prompt: "Δεν υπάρχουν λέξεις", answer: "", direction: "es2gr" };
  }
  if (pool.length < 4) return genFill(pool);

  const type = [
    "mc",
    "mc",
    "fill",
    "match",
    "listen",
    "type",
    "sentence",
    "error",
    "gender",
    "trap",
  ][Math.floor(Math.random() * 10)];

  if (type === "mc") return genMC(pool);
  if (type === "match") return genMatch(pool);
  if (type === "listen") return genListen(pool);
  if (type === "type") return genTyping(pool);
  if (type === "sentence") return genSentence(pool);
  if (type === "error") return genError();
  if (type === "gender") return genGender();
  if (type === "trap") return genTrap();
  return genFill(pool);
}
