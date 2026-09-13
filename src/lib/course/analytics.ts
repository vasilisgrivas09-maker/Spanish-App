import { z } from "zod";

export const STORAGE_KEY_ANALYTICS = "spanish_analytics_v1" as const;

const dayBucketSchema = z.object({
  date: z.string(),
  quizzes: z.number().int().nonnegative(),
});

const analyticsSchema = z.object({
  days: z.array(dayBucketSchema).max(60),
});

export type DayBucket = z.infer<typeof dayBucketSchema>;
export type AnalyticsState = z.infer<typeof analyticsSchema>;

function todayKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

export function emptyAnalytics(): AnalyticsState {
  return { days: [] };
}

export function parseAnalytics(raw: unknown): AnalyticsState {
  const parsed = analyticsSchema.safeParse(raw);
  if (!parsed.success) return emptyAnalytics();
  return parsed.data;
}

export function recordQuizCompleted(
  state: AnalyticsState,
  now = new Date(),
): AnalyticsState {
  const date = todayKey(now);
  const existing = state.days.find((day) => day.date === date);
  const days = existing
    ? state.days.map((day) =>
        day.date === date ? { ...day, quizzes: day.quizzes + 1 } : day,
      )
    : [...state.days, { date, quizzes: 1 }];

  return {
    days: days
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30),
  };
}

export function quizzesToday(state: AnalyticsState, now = new Date()): number {
  const date = todayKey(now);
  return state.days.find((day) => day.date === date)?.quizzes ?? 0;
}

export function loadAnalyticsFromStorage(
  storage: Pick<Storage, "getItem"> = localStorage,
): AnalyticsState {
  try {
    const raw = storage.getItem(STORAGE_KEY_ANALYTICS);
    if (!raw) return emptyAnalytics();
    return parseAnalytics(JSON.parse(raw) as unknown);
  } catch {
    return emptyAnalytics();
  }
}

export function saveAnalyticsToStorage(
  state: AnalyticsState,
  storage: Pick<Storage, "setItem"> = localStorage,
): void {
  try {
    storage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(state));
  } catch {
    // Quota / private mode — analytics are best-effort.
  }
}
