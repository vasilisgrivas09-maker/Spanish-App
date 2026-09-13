import { describe, expect, it } from "vitest";

import {
  DIALOGUES,
  ERROR_QUESTIONS,
  GENDER_QUESTIONS,
  GRAMMAR_LESSONS,
  SENTENCE_QUESTIONS,
  TRAP_QUESTIONS,
  UNIT1_CATEGORIES,
  UNIT2_CATEGORIES,
  CATEGORY_ICONS,
} from "@/lib/course/data";
import { parseProgressBackup, parseStoredCategories, parseStoredSettings, parseStoredStats } from "@/lib/course/backup";
import { genError, genGender, genMC, genMatch, genQuestion, genTrap } from "@/lib/course/quiz-generators";
import { esc, normalizeAnswer, shuffle } from "@/lib/course/utils";
import { resolveTheme } from "@/lib/course/theme";
import {
  emptyAnalytics,
  recordQuizCompleted,
  quizzesToday,
  parseAnalytics,
} from "@/lib/course/analytics";

describe("data integrity", () => {
  it("every dialogue turn has exactly one correct choice", () => {
    for (const dialogue of DIALOGUES) {
      expect(dialogue.id).toBeTruthy();
      expect(dialogue.turns.length).toBeGreaterThan(0);
      for (const turn of dialogue.turns) {
        const corrects = turn.choices.filter((choice) => choice.correct);
        expect(corrects, `${dialogue.id}:${turn.es}`).toHaveLength(1);
        expect(turn.choices.length).toBeGreaterThanOrEqual(2);
      }
    }
  });

  it("categories have unique ids and non-empty items", () => {
    const all = [...UNIT1_CATEGORIES, ...UNIT2_CATEGORIES];
    const ids = all.map((cat) => cat.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const cat of all) {
      expect(cat.items.length).toBeGreaterThan(0);
      expect(CATEGORY_ICONS[cat.id]).toBeTruthy();
      for (const item of cat.items) {
        expect(item.es.trim()).not.toBe("");
        expect(item.gr.trim()).not.toBe("");
      }
    }
  });

  it("keeps dialogue ids out of category id namespace", () => {
    const categoryIds = new Set([...UNIT1_CATEGORIES, ...UNIT2_CATEGORIES].map((cat) => cat.id));
    const overlaps = DIALOGUES.map((dialogue) => dialogue.id).filter((id) => categoryIds.has(id));
    expect(overlaps).toEqual([]);
  });

  it("grammar lessons have matching answers in options", () => {
    for (const lesson of GRAMMAR_LESSONS) {
      for (const question of lesson.questions) {
        expect(question.options).toContain(question.answer);
      }
    }
  });

  it("static banks have answers in options where applicable", () => {
    for (const q of ERROR_QUESTIONS) expect(q.options).toContain(q.answer);
    for (const q of GENDER_QUESTIONS) expect(q.options).toContain(q.answer);
    for (const q of TRAP_QUESTIONS) expect(q.options).toContain(q.answer);
    for (const q of SENTENCE_QUESTIONS) expect(q.answer.trim()).not.toBe("");
  });
});

describe("hash route prefixes", () => {
  it("slice lengths match prefix lengths", () => {
    expect("#browse/".length).toBe(8);
    expect("#quiz/".length).toBe(6);
    expect("#grammar/".length).toBe(9);
    expect("#dialogue/".length).toBe(10);
    expect("#dialogue/greeting".slice("#dialogue/".length)).toBe("greeting");
    expect("#browse/travel".slice("#browse/".length)).toBe("travel");
    expect("#quiz/unit1".slice("#quiz/".length)).toBe("unit1");
    expect("#grammar/articles".slice("#grammar/".length)).toBe("articles");
  });

  it("dialogues list hash does not collide with dialogue detail prefix", () => {
    expect("#dialogues".startsWith("#dialogue/")).toBe(false);
  });
});

describe("quiz generators stress", () => {
  const pool = UNIT1_CATEGORIES.flatMap((cat) => cat.items);

  it("genMC never includes blank options and always includes answer", () => {
    for (let i = 0; i < 40; i += 1) {
      const q = genMC(pool);
      expect(q.options?.length).toBe(4);
      expect(q.options).toContain(q.answer);
      expect(new Set(q.options).size).toBe(4);
    }
  });

  it("genMatch keeps unique greek sides", () => {
    for (let i = 0; i < 20; i += 1) {
      const q = genMatch(pool);
      const rights = q.right ?? [];
      expect(new Set(rights.map((value) => normalizeAnswer(value))).size).toBe(rights.length);
    }
  });

  it("bank generators keep answer in options", () => {
    const errorQ = genError();
    const genderQ = genGender();
    const trapQ = genTrap();
    expect(errorQ.options).toContain(errorQ.answer);
    expect(genderQ.options).toContain(genderQ.answer);
    expect(trapQ.options).toContain(trapQ.answer);
  });

  it("genQuestion covers multiple types over many draws", () => {
    const types = new Set<string>();
    for (let i = 0; i < 200; i += 1) types.add(genQuestion(pool).type);
    expect(types.size).toBeGreaterThanOrEqual(6);
  });
});

describe("shuffle dialogue choices behavior", () => {
  it("can place correct choice off the first index", () => {
    const sample = DIALOGUES[0]!.turns[0]!.choices;
    let sawNonFirst = false;
    for (let i = 0; i < 80; i += 1) {
      const shuffled = shuffle(sample);
      if (!shuffled[0]?.correct) {
        sawNonFirst = true;
        break;
      }
    }
    expect(sawNonFirst).toBe(true);
  });
});

describe("backup + theme + analytics edge cases", () => {
  it("preserves system theme from backup", () => {
    const backup = parseProgressBackup({
      categories: [{ id: "x", name: "X", color: "#fff", items: [{ es: "a", gr: "α" }] }],
      stats: { totalCorrect: 0, totalAnswered: 0, xp: 0 },
      settings: { theme: "system" },
    });
    expect(backup.settings.theme).toBe("system");
  });

  it("rejects corrupt localStorage-shaped payloads", () => {
    expect(parseStoredCategories("nope")).toBeNull();
    expect(parseStoredCategories([{ id: "a", name: "A", color: "#fff", items: [{ es: "hola", gr: "γεια" }] }])).toHaveLength(1);
    expect(parseStoredStats({ totalCorrect: 1 }, { totalCorrect: 0, totalAnswered: 0, xp: 0 }).totalCorrect).toBe(0);
    expect(parseStoredStats({ totalCorrect: 2, totalAnswered: 3, xp: 4 }, { totalCorrect: 0, totalAnswered: 0, xp: 0 })).toEqual({
      totalCorrect: 2,
      totalAnswered: 3,
      xp: 4,
    });
    expect(parseStoredSettings({ theme: "neon" }, { theme: "system", fontScale: "normal", speechRate: "normal", accent: "es-ES", oneHanded: false }).theme).toBe("system");
  });

  it("escapes XSS-prone strings", () => {
    expect(esc(`<img src=x onerror="alert(1)">`)).not.toContain("<img");
    expect(esc(`a"b`)).toContain("&quot;");
  });

  it("theme resolution covers system dark/light", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
  });

  it("analytics rolls days and ignores garbage", () => {
    const day1 = new Date("2026-09-01T12:00:00.000Z");
    const day2 = new Date("2026-09-02T12:00:00.000Z");
    let state = emptyAnalytics();
    state = recordQuizCompleted(state, day1);
    state = recordQuizCompleted(state, day2);
    expect(quizzesToday(state, day2)).toBe(1);
    expect(parseAnalytics({ nope: true })).toEqual(emptyAnalytics());
  });
});
