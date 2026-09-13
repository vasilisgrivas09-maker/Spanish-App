import { describe, expect, it } from "vitest";

import {
  emptyAnalytics,
  parseAnalytics,
  quizzesToday,
  recordQuizCompleted,
} from "@/lib/course/analytics";
import { resolveTheme } from "@/lib/course/theme";

describe("analytics", () => {
  it("counts quizzes per day", () => {
    const now = new Date("2026-09-13T10:00:00.000Z");
    let state = emptyAnalytics();
    state = recordQuizCompleted(state, now);
    state = recordQuizCompleted(state, now);
    expect(quizzesToday(state, now)).toBe(2);
  });

  it("rejects invalid payloads", () => {
    expect(parseAnalytics({ days: "nope" })).toEqual(emptyAnalytics());
  });
});

describe("theme", () => {
  it("resolves system preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
  });
});
