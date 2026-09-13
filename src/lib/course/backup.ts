import { z } from "zod";

import type { Category, ProgressBackup, Settings, Stats, VocabItem } from "./types";

const vocabItemSchema = z.object({
  es: z.string(),
  gr: z.string(),
});

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  unit: z.number().optional(),
  items: z.array(vocabItemSchema),
});

const statsSchema = z.object({
  totalCorrect: z.number(),
  totalAnswered: z.number(),
  xp: z.number(),
});

const settingsSchema = z.object({
  theme: z.enum(["system", "dark", "light"]).optional(),
  fontScale: z.enum(["normal", "large", "xl"]).optional(),
  speechRate: z.enum(["slow", "normal", "fast"]).optional(),
  accent: z.enum(["es-ES", "es-MX"]).optional(),
  oneHanded: z.boolean().optional(),
});

export const progressBackupSchema = z.object({
  format: z.literal("espanol-course-backup").optional(),
  version: z.number().optional(),
  exportedAt: z.string().optional(),
  categories: z.array(categorySchema),
  stats: statsSchema,
  mistakes: z.array(vocabItemSchema).optional(),
  settings: settingsSchema.optional(),
});

export type ParsedProgressBackup = z.infer<typeof progressBackupSchema>;

function normalizeSettings(partial?: z.infer<typeof settingsSchema>): Settings {
  return {
    theme: partial?.theme ?? "system",
    fontScale: partial?.fontScale ?? "normal",
    speechRate: partial?.speechRate ?? "normal",
    accent: partial?.accent ?? "es-ES",
    oneHanded: partial?.oneHanded ?? false,
  };
}

function normalizeCategories(categories: z.infer<typeof categorySchema>[]): Category[] {
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    color: cat.color,
    unit: cat.unit ?? 1,
    items: cat.items,
  }));
}

export function parseProgressBackup(payload: unknown): ProgressBackup {
  const parsed = progressBackupSchema.parse(payload);
  return {
    format: "espanol-course-backup",
    version: 1,
    exportedAt: parsed.exportedAt ?? new Date().toISOString(),
    categories: normalizeCategories(parsed.categories),
    stats: parsed.stats,
    mistakes: parsed.mistakes ?? [],
    settings: normalizeSettings(parsed.settings),
  };
}

export function parseStoredCategories(raw: unknown): Category[] | null {
  const parsed = z.array(categorySchema).safeParse(raw);
  return parsed.success ? normalizeCategories(parsed.data) : null;
}

export function parseStoredStats(raw: unknown, fallback: Stats): Stats {
  const parsed = statsSchema.safeParse(raw);
  if (!parsed.success) return fallback;
  return { ...fallback, ...parsed.data };
}

export function parseStoredMistakes(raw: unknown): VocabItem[] {
  const parsed = z.array(vocabItemSchema).safeParse(raw);
  return parsed.success ? parsed.data : [];
}

export function parseStoredSettings(raw: unknown, fallback: Settings): Settings {
  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) return fallback;
  return { ...fallback, ...normalizeSettings(parsed.data) };
}
