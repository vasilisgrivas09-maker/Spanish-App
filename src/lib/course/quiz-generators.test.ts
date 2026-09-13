import { describe, expect, it, vi } from "vitest";

import {
  genFill,
  genListen,
  genMatch,
  genMC,
  genQuestion,
  genSentence,
  genTyping,
} from "@/lib/course/quiz-generators";
import type { VocabItem } from "@/lib/course/types";

const pool: VocabItem[] = [
  { es: "casa", gr: "σπίτι" },
  { es: "perro", gr: "σκύλος" },
  { es: "gato", gr: "γάτα" },
  { es: "libro", gr: "βιβλίο" },
  { es: "agua", gr: "νερό" },
  { es: "pan", gr: "ψωμί" },
];

describe("quiz generators", () => {
  it("genMC returns four unique options including the answer", () => {
    const q = genMC(pool);
    expect(q.type).toBe("mc");
    expect(q.options).toHaveLength(4);
    expect(q.options).toContain(q.answer);
    expect(new Set(q.options).size).toBe(4);
  });

  it("genMatch returns up to five unique pairs", () => {
    const q = genMatch(pool);
    expect(q.type).toBe("match");
    expect(q.pairs?.length).toBeGreaterThan(0);
    expect(q.pairs?.length).toBeLessThanOrEqual(5);
    expect(q.left).toHaveLength(q.pairs!.length);
    expect(q.right).toHaveLength(q.pairs!.length);
  });

  it("genFill / genTyping / genListen keep vocab answers", () => {
    expect(genFill(pool).answer.length).toBeGreaterThan(0);
    expect(genTyping(pool).answer.length).toBeGreaterThan(0);
    const listen = genListen(pool);
    expect(listen.options).toContain(listen.answer);
  });

  it("genSentence can build prompts from vocabulary", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.9);
    const q = genSentence(pool);
    expect(q.type).toBe("sentence");
    expect(pool.some((item) => item.es === q.answer)).toBe(true);
    vi.restoreAllMocks();
  });

  it("genQuestion falls back for tiny pools", () => {
    const tiny = [{ es: "hola", gr: "γεια" }];
    expect(genQuestion(tiny).type).toBe("fill");
    expect(genQuestion([]).prompt).toContain("Δεν υπάρχουν");
  });
});
