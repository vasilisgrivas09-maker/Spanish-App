import { describe, expect, it } from "vitest";

import { parseProgressBackup } from "@/lib/course/backup";
import {
  clone,
  esc,
  mistakeKey,
  normalizeAnswer,
  shuffle,
  speechRateFromSetting,
  totalWords,
} from "@/lib/course/utils";
import type { Category } from "@/lib/course/types";

describe("normalizeAnswer", () => {
  it("strips accents and lowercases", () => {
    expect(normalizeAnswer("  Café  ")).toBe("cafe");
    expect(normalizeAnswer("NIÑO")).toBe("nino");
  });
});

describe("esc", () => {
  it("escapes HTML special characters", () => {
    expect(esc(`<a href="x">'&</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&#039;&amp;&lt;/a&gt;");
  });
});

describe("shuffle", () => {
  it("keeps the same elements", () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input).sort()).toEqual(input);
  });
});

describe("clone / mistakeKey / totalWords / speechRate", () => {
  it("clones deeply", () => {
    const original = { items: [{ es: "hola", gr: "γεια" }] };
    const copied = clone(original);
    copied.items[0]!.es = "adios";
    expect(original.items[0]!.es).toBe("hola");
  });

  it("builds mistake keys", () => {
    expect(mistakeKey({ es: "casa", gr: "σπίτι" })).toBe("casa||σπίτι");
  });

  it("counts words across categories", () => {
    const cats: Category[] = [
      { id: "a", name: "A", color: "#fff", unit: 1, items: [{ es: "a", gr: "α" }] },
      { id: "b", name: "B", color: "#fff", unit: 1, items: [{ es: "b", gr: "β" }, { es: "c", gr: "γ" }] },
    ];
    expect(totalWords(cats)).toBe(3);
  });

  it("maps speech rates", () => {
    expect(speechRateFromSetting("slow")).toBe(0.62);
    expect(speechRateFromSetting("normal")).toBe(0.82);
    expect(speechRateFromSetting("fast")).toBe(1.05);
  });
});

describe("parseProgressBackup", () => {
  it("accepts a valid backup payload", () => {
    const backup = parseProgressBackup({
      categories: [{ id: "x", name: "X", color: "#FF6B35", items: [{ es: "hola", gr: "γεια" }] }],
      stats: { totalCorrect: 1, totalAnswered: 2, xp: 10 },
      mistakes: [{ es: "casa", gr: "σπίτι" }],
    });
    expect(backup.categories[0]?.unit).toBe(1);
    expect(backup.mistakes).toHaveLength(1);
    expect(backup.settings.theme).toBe("system");
  });

  it("rejects invalid payloads", () => {
    expect(() => parseProgressBackup({ categories: [], stats: null })).toThrow();
  });
});
