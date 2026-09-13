import { z } from "zod";

import type { ProgressBackup } from "./types";

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
  theme: z.enum(["dark", "light"]).optional(),
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

export function parseProgressBackup(payload: unknown): ProgressBackup {
  const parsed = progressBackupSchema.parse(payload);
  return {
    format: "espanol-course-backup",
    version: 1,
    exportedAt: parsed.exportedAt ?? new Date().toISOString(),
    categories: parsed.categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color,
      unit: cat.unit ?? 1,
      items: cat.items,
    })),
    stats: parsed.stats,
    mistakes: parsed.mistakes ?? [],
    settings: {
      theme: parsed.settings?.theme ?? "dark",
      fontScale: parsed.settings?.fontScale ?? "normal",
      speechRate: parsed.settings?.speechRate ?? "normal",
      accent: parsed.settings?.accent ?? "es-ES",
      oneHanded: parsed.settings?.oneHanded ?? false,
    },
  };
}
